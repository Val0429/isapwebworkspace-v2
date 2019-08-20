<template>
    <div>
        <div class="row">

            <div class="col-lg-12 col-sm-12 col-xs-12 col-xxs-12">
                <div class="box current-info-box">
                    <div class="backgroundColor">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_RepeatCustomer")}}</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">{{anlysisData.repeatCustomer.total != null ? toPercent(anlysisData.repeatCustomer.total) : "N/A"}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-12 col-sm-12 col-xs-12 col-xxs-12">
                <div class="box current-info-box">
                    <div class="backgroundColor">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_Revenue")}}</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">{{anlysisData.revenue.total != null ? numberWithCommas(anlysisData.revenue.total) : "N/A"}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-12 col-sm-12 col-xs-12 col-xxs-12">
                <div class="box current-info-box">
                    <div class="backgroundColor">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_Demographic")}}</span>
                        </div>
                        <div class="clearfix">
                            <highcharts
                                class="demographic-div"
                                ref="chartGender"
                                :options="chartOptions.demographic"
                            ></highcharts>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-12 col-sm-12 col-xs-12 col-xxs-12">
                <div class="box current-info-box">
                    <div class="backgroundColor">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_VIPBlacklist")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <img src="../../assets/images/vip.png">
                                <div class="ratio">

                                    <span>{{anlysisData.vipBlacklist.value != null ? numberWithCommas(anlysisData.vipBlacklist.value) : "N/A"}} </span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <img src="../../assets/images/stranger.png">
                                <div class="ratio">
                                    <span>{{anlysisData.vipBlacklist.value2 != null ? numberWithCommas(anlysisData.vipBlacklist.value2) : "N/A"}} </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

        </div>
        <!-- /row -->
    </div>
</template>

<script lang="ts">
import {
    Vue,
    Component,
    Prop,
    Emit,
    Model,
    Watch
} from "vue-property-decorator";

/// install Highcharts
import Highcharts from "highcharts";
import HighchartsVue from "highcharts-vue";
import exportingInit from "highcharts/modules/exporting";
exportingInit(Highcharts);
Vue.use(HighchartsVue);

import HighchartsService from "@/components/Reports/models/HighchartsService";
import ResponseFilter from "@/services/ResponseFilter";

import {
    ReportDashboard,
    EPageType,
    ESign,
    ETimeMode
} from "@/components/Reports";

@Component({
    components: {}
})
export class CurrentStatusDashboard extends Vue {
    // Prop
    @Prop({
        type: Date,
        default: function() {
            return new Date();
        }
    })
    startDate: Date;

    @Prop({
        type: Date,
        default: function() {
            return new Date();
        }
    })
    endDate: Date;

    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    siteIds: [];

    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    tagIds: [];

    @Watch("startDate", { deep: true })
    private watchStartDate(newVal, oldVal) {}
    @Watch("endDate", { deep: true })
    private watchEndDate(newVal, oldVal) {}
    @Watch("type", { deep: true })
    private watchType(newVal, oldVal) {}
    @Watch("siteIds", { deep: true })
    private watchSiteIds(newVal, oldVal) {}
    @Watch("tagIds", { deep: true })
    private watchTagIds(newVal, oldVal) {}
    @Watch("pageType", { deep: true })
    private watchPageType(newVal, oldVal) {}

    anlysisData = new ReportDashboard();

    // chart options
    chartOptions: {
        demographic: object;
    } = {
        demographic: {}
    };

    created() {}

    async mounted() {
        this.initData();
    }

    async initData() {
        // const readParam: {
        //     startDate: Date;
        //     endDate: Date;
        //     siteIds: string[];
        //     tagIds: string[];
        // } = {
        //     startDate: this.startDate,
        //     endDate: this.endDate,
        //     siteIds: this.siteIds,
        //     tagIds: this.tagIds
        // };

        // this.$server
        //     .C("/report/complex", readParam)
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(this, response, (response: any) => {
        //             // people Counting
        //             if (response.peopleCounting) {
        //                 this.anlysisData.traffic = {
        //                     sign:
        //                         response.peopleCounting.variety == null ||
        //                         response.peopleCounting.variety == 0
        //                             ? ESign.none
        //                             : response.peopleCounting.variety > 0
        //                             ? ESign.positive
        //                             : ESign.negative,
        //                     total: response.peopleCounting.value,
        //                     valueRatio: response.peopleCounting.variety
        //                         ? response.peopleCounting.variety /
        //                           response.peopleCounting.value
        //                         : null,
        //                     value: response.peopleCounting.variety
        //                 };
        //             }

        //             // human Detection
        //             if (response.humanDetection) {
        //                 this.anlysisData.averageOccupancy = {
        //                     sign:
        //                         response.humanDetection.variety == null ||
        //                         response.humanDetection.variety == 0
        //                             ? ESign.none
        //                             : response.humanDetection.variety > 0
        //                             ? ESign.positive
        //                             : ESign.negative,
        //                     total: response.humanDetection.value,
        //                     valueRatio: response.humanDetection.variety
        //                         ? response.humanDetection.variety /
        //                           response.humanDetection.value
        //                         : null,
        //                     value: response.humanDetection.variety
        //                 };
        //             }

        //             // average Dwell Time
        //             if (response.averageDwellTime) {
        //                 this.anlysisData.averageDwellTime = {
        //                     sign:
        //                         response.averageDwellTime.variety == null ||
        //                         response.averageDwellTime.variety == 0
        //                             ? ESign.none
        //                             : response.averageDwellTime.variety > 0
        //                             ? ESign.positive
        //                             : ESign.negative,
        //                     total: response.averageDwellTime.value,
        //                     valueRatio: response.averageDwellTime.variety
        //                         ? response.averageDwellTime.variety /
        //                           response.averageDwellTime.value
        //                         : null,
        //                     value: response.averageDwellTime.variety
        //                 };
        //             }

        //             // demographic
        //             if (response.demographic) {
        //                 this.anlysisData.demographic = {
        //                     sign:
        //                         response.demographic.malePercent == null ||
        //                         response.demographic.malePercent == 0
        //                             ? ESign.none
        //                             : response.demographic.maleVariety > 0
        //                             ? ESign.positive
        //                             : ESign.negative,
        //                     value: response.demographic.maleVariety,
        //                     valueRatio: response.demographic.malePercent,
        //                     sign2:
        //                         response.demographic.femalePercent == null ||
        //                         response.demographic.femalePercent == 0
        //                             ? ESign.none
        //                             : response.demographic.femaleVariety > 0
        //                             ? ESign.positive
        //                             : ESign.negative,
        //                     value2: response.demographic.femaleVariety,
        //                     valueRatio2: response.demographic.femalePercent
        //                 };
        //             }

        //             // vip/Blacklist
        //             if (response.vipBlacklist) {
        //                 this.anlysisData.vipBlacklist = {
        //                     sign:
        //                         response.vipBlacklist.vpiPercent == null ||
        //                         response.vipBlacklist.vpiPercent == 0
        //                             ? ESign.none
        //                             : response.vipBlacklist.variety > 0
        //                             ? ESign.positive
        //                             : ESign.negative,
        //                     value: response.vipBlacklist.vpiVariety,
        //                     valueRatio: response.vipBlacklist.vpiPercent,
        //                     sign2:
        //                         response.vipBlacklist.blacklistPercent ==
        //                             null ||
        //                         response.vipBlacklist.blacklistPercent == 0
        //                             ? ESign.none
        //                             : response.vipBlacklist.variety > 0
        //                             ? ESign.positive
        //                             : ESign.negative,
        //                     value2: response.vipBlacklist.blacklistVariety,
        //                     valueRatio2: response.vipBlacklist.blacklistPercent
        //                 };
        //             }

        //             // repeat Customer
        //             if (response.repeatCustomer) {
        //                 this.anlysisData.repeatCustomer = {
        //                     sign:
        //                         response.repeatCustomer.variety == null ||
        //                         response.repeatCustomer.variety == 0
        //                             ? ESign.none
        //                             : response.repeatCustomer.variety > 0
        //                             ? ESign.positive
        //                             : ESign.negative,
        //                     total: response.repeatCustomer.value,
        //                     valueRatio: response.repeatCustomer.variety
        //                         ? response.repeatCustomer.variety /
        //                           response.repeatCustomer.value
        //                         : null,
        //                     value: response.repeatCustomer.variety
        //                 };
        //             }

        //             // revenue
        //             if (response.revenue) {
        //                 this.anlysisData.revenue = {
        //                     sign:
        //                         response.revenue.variety == null ||
        //                         response.revenue.variety == 0
        //                             ? ESign.none
        //                             : response.revenue.variety > 0
        //                             ? ESign.positive
        //                             : ESign.negative,
        //                     total: response.revenue.value,
        //                     valueRatio: response.revenue.variety
        //                         ? response.revenue.variety /
        //                           response.revenue.value
        //                         : null,
        //                     value: response.revenue.variety
        //                 };
        //             }

        //             // transaction
        //             if (response.transaction) {
        //                 this.anlysisData.transaction = {
        //                     sign:
        //                         response.transaction.variety == null ||
        //                         response.transaction.variety == 0
        //                             ? ESign.none
        //                             : response.transaction.variety > 0
        //                             ? ESign.positive
        //                             : ESign.negative,
        //                     total: response.transaction.value,
        //                     valueRatio: response.transaction.variety
        //                         ? response.transaction.variety /
        //                           response.transaction.value
        //                         : null,
        //                     value: response.transaction.variety
        //                 };
        //             }

        //             // conversion
        //             if (response.conversion) {
        //                 this.anlysisData.conversion = {
        //                     sign:
        //                         response.conversion.variety == null ||
        //                         response.conversion.variety == 0
        //                             ? ESign.none
        //                             : response.conversion.variety > 0
        //                             ? ESign.positive
        //                             : ESign.negative,
        //                     total: response.conversion.value,
        //                     valueRatio: response.conversion.variety
        //                         ? response.conversion.variety /
        //                           response.conversion.value
        //                         : null,
        //                     value: response.conversion.variety
        //                 };
        //             }

        //             // ASP
        //             if (response.asp) {
        //                 this.anlysisData.asp = {
        //                     sign:
        //                         response.asp.variety == null ||
        //                         response.asp.variety == 0
        //                             ? ESign.none
        //                             : response.asp.variety > 0
        //                             ? ESign.positive
        //                             : ESign.negative,
        //                     total: response.asp.value,
        //                     valueRatio: response.asp.variety
        //                         ? response.asp.variety / response.asp.value
        //                         : null,
        //                     value: response.asp.variety
        //                 };
        //             }
        //         });
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.catchError(this, e);
        //     });

        let pieSeriesData = [
            {
                name: "male",
                y: 505370,
                z: 92.9
            },
            {
                name: "female",
                y: 551500,
                z: 118.7
            }
        ];

        this.chartOptions.demographic = {
            chart: { zoomType: "x", height: "130px" },
            exporting: { enabled: false },
            title: {
                text: this._("w_ReportDashboard_Demographic"),
                style:
                    "font-weight: bold; font-size: 12px; margin: 0; padding: 0; display: flex; justify-content: center;"
            },
            subtitle: { text: null },
            tooltip: { enabled: true },
            series: [
                {
                    type: "pie",
                    size: "140%",
                    innerSize: "60%",
                    label: { enabled: true },
                    data: pieSeriesData
                }
            ]
        };
    }

    numberWithCommas(number) {
        return Math.abs(number)
            .toFixed(0)
            .toString()
            .replace(/\B(?=(\d{3})+\b)/g, ",");
    }

    toPercent(point, fixed) {
        var str = Number(Math.abs(point) * 100).toFixed(fixed);
        str += "%";
        return str;
    }
}

export default CurrentStatusDashboard;
Vue.component("current-status-dashboard", CurrentStatusDashboard);
</script>

<style lang="scss" scoped>
.info-box {
    border: 0px solid #dbdee0;
    margin: 0 0 30px 0;

    .backgroundColor {
        padding: 10px;
        background: #efefef;
        color: gray;
        height: 140px;
        border-radius: 10px;
    }
}

.current-info-box {
    border: 1px solid #4d5256;
    margin: 0 0 30px 0;

    .backgroundColor {
        padding: 10px;
        color: black;
        height: 140px;
    }
}

.backgroundColor.selected {
    background: #4d5256;
    color: white;
}

.clearfix {
    text-align: center;

    .title {
        font-weight: bold;
        font-size: 12px;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
    }

    .date {
        font-weight: bold;
        font-size: 36px;
        margin-top: -8px;
        padding: 0;
        display: flex;
        justify-content: center;
    }

    .demographic-div {
        margin-top: -20px;
        height: 200px;
    }
}
</style>
