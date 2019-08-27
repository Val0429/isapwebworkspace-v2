<template>
    <div>

        <iv-card :label="_('w_DashboardOverview_FilterStatus')">
            <div class="row">
                <div class="col-lg-2 col-sm-2 col-xs-2 col-xxs-2">
                    <div class="box current-info-box">
                        <div class="backgroundColor">
                            <div class="clearfix">
                                <span class="title">{{_("w_ReportDashboard_Traffic")}} </span>
                            </div>
                            <div class="clearfix">
                                <span
                                    class="date"
                                    style="margin-top: 30px;"
                                >{{anlysisData.traffic.total != null ? numberWithCommas(anlysisData.traffic.total) : "N/A"}}</span>
                                <span v-if="eSign.none != anlysisData.traffic.sign">{{eSign.positive == anlysisData.traffic.sign ? '▲':'▼'}}</span>
                                <span>{{anlysisData.traffic.valueRatio != null ? toPercent(anlysisData.traffic.valueRatio,1) : "N/A"}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!--/col-->

                <div class="col-lg-2 col-sm-2 col-xs-2 col-xxs-2">
                    <div class="box current-info-box">
                        <div class="backgroundColor">
                            <div class="clearfix">
                                <span class="title">{{_("w_ReportDashboard_AverageOccupancy")}} </span>
                            </div>
                            <div class="clearfix">
                                <span class="date">{{anlysisData.averageOccupancy.total != null ? numberWithCommas(anlysisData.averageOccupancy.total) : "N/A"}}</span>
                                <span v-if="eSign.none != anlysisData.averageOccupancy.sign">{{eSign.positive == anlysisData.averageOccupancy.sign ? '▲':'▼'}}</span>
                                <span>{{anlysisData.averageOccupancy.valueRatio != null ? toPercent(anlysisData.averageOccupancy.valueRatio,1) : "N/A"}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!--/col-->

                <div class="col-lg-2 col-sm-2 col-xs-2 col-xxs-2">
                    <div class="box current-info-box">
                        <div class="backgroundColor">
                            <div class="clearfix">
                                <span class="title">{{_("w_ReportDashboard_AverageDwellTime")}}</span>
                            </div>
                            <div class="clearfix">
                                <span class="date">{{anlysisData.averageDwellTime.total != null ? numberWithCommas(anlysisData.averageDwellTime.total) : "N/A"}}</span>
                                <span v-if="eSign.none != anlysisData.averageDwellTime.sign">{{eSign.positive == anlysisData.averageDwellTime.sign ? '▲':'▼'}}</span>
                                <span>{{anlysisData.averageDwellTime.valueRatio != null ? toPercent(anlysisData.averageDwellTime.valueRatio,1) : "N/A"}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!--/col-->

                <div class="col-lg-2 col-sm-2 col-xs-2 col-xxs-2">
                    <div class="box current-info-box">
                        <div class="backgroundColor">
                            <div class="clearfix">
                                <span class="title">{{_("w_ReportDashboard_Demographic")}}</span>
                            </div>
                            <div class="clearfix">
                                <highcharts
                                    class="demographic-div"
                                    :options="chartOptions.demographic"
                                ></highcharts>
                                <div class="charfix">
                                    <span v-if="eSign.none != anlysisData.demographic.sign">{{eSign.positive == anlysisData.demographic.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.demographic.valueRatio != null ? toPercent(anlysisData.demographic.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--/col-->

                <div class="col-lg-2 col-sm-2 col-xs-2 col-xxs-2">
                    <div class="box current-info-box">
                        <div class="backgroundColor">
                            <div class="clearfix">
                                <span class="title">{{_("w_ReportDashboard_VIPBlacklist")}}</span>
                            </div>
                            <div class="row clearfix">
                                <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-6 vip-blackList-div">
                                    <div class="right">
                                        <div>
                                            <span>{{anlysisData.vipBlacklist.value != null ? numberWithCommas(anlysisData.vipBlacklist.value) : "N/A"}} </span>
                                        </div>
                                        <img src="../../assets/images/vip.png">

                                        <p>
                                            <div class="clearfix">
                                                <span v-if="eSign.none != anlysisData.vipBlacklist.sign">{{eSign.positive == anlysisData.vipBlacklist.sign ? '▲':'▼'}}</span>
                                                <span>{{anlysisData.vipBlacklist.valueRatio1 != null ? toPercent(anlysisData.vipBlacklist.valueRatio1,1) : "N/A"}}</span>
                                            </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-6 vip-blackList-div">
                                    <div class="left">

                                        <div>
                                            <span>{{anlysisData.vipBlacklist.value2 != null ? numberWithCommas(anlysisData.vipBlacklist.value2) : "N/A"}} </span>
                                        </div>
                                        <img
                                            src="../../assets/images/stranger.png"
                                            height="26px"
                                        >
                                        <p>
                                            <div class="clearfix">
                                                <span v-if="eSign.none != anlysisData.vipBlacklist.sign2">{{eSign.positive == anlysisData.vipBlacklist.sign2 ? '▲':'▼'}}</span>
                                                <span>{{anlysisData.vipBlacklist.valueRatio2 != null ? toPercent(anlysisData.vipBlacklist.valueRatio2,1) : "N/A"}}</span>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--/col-->

                <div class="col-lg-2 col-sm-2 col-xs-2 col-xxs-2">
                    <div class="box current-info-box">
                        <div class="backgroundColor">
                            <div class="clearfix">
                                <span class="title">{{_("w_ReportDashboard_RepeatCustomer")}} </span>
                            </div>
                            <div class="clearfix">
                                <apexchart
                                    type=radialBar
                                    height=180
                                    :options="chartOptions.repeatCustomer"
                                    :series="chartOptions.repeatCustomer.series"
                                />
                                <div class="charfix">
                                    <span v-if="eSign.none != anlysisData.averageDwellTime.sign">{{eSign.positive == anlysisData.averageDwellTime.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.averageDwellTime.valueRatio != null ? toPercent(anlysisData.averageDwellTime.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!--/col-->
            </div>

            <highcharts :options="chartOptions.filterTable"></highcharts>

            <b-row>
                <select-time
                    class="col-md-12"
                    :timeParam="timeParam"
                    :radioName="radioName"
                    @updateTime="receiveTime"
                ></select-time>

            </b-row>

            <select-permission-site @siteIds="receiveSiteIds"></select-permission-site>

        </iv-card>
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

import VueApexCharts from "vue-apexcharts";
Vue.component("apexchart", VueApexCharts);

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
export class FilterStatusDashboard extends Vue {
    eSign = ESign;

    anlysisData = new ReportDashboard();

    // chart options
    chartOptions: {
        demographic: object;
        repeatCustomer: object;
        filterTable: object;
    } = {
        demographic: {},
        repeatCustomer: {},
        filterTable: {}
    };

    timeParam: any = {
        startDate: new Date(),
        endDate: new Date()
    };

    radioName: string = 'AreaStatusByFloorPlanDetail';

    created() {}

    mounted() {
        this.initData();
    }

    receiveSiteIds(siteIds: object) {
        console.log("siteIds ~ ", siteIds);
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

        let demographicData = [
            {
                name: "male",
                y: 500
            },
            {
                name: "female",
                y: 600
            }
        ];

        this.chartOptions.demographic = {
            chart: { zoomType: "x", height: "110px" },
            exporting: { enabled: false },
            title: {
                text: null,
                style:
                    "font-weight: bold; font-size: 12px; margin: 0; padding: 0; display: flex; justify-content: center;"
            },
            subtitle: { text: null },
            tooltip: {
                enabled: true,
                pointFormat:
                    '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                    "Area (square km): <b>{point.y}</b>"
            },
            series: [
                {
                    type: "pie",
                    size: "80%",
                    innerSize: "60%",
                    label: { enabled: true },
                    data: demographicData
                }
            ],

            credits: {
                enabled: false
            }
        };

        this.chartOptions.repeatCustomer = {
            series: [76],
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    track: {
                        background: "#e7e7e7",
                        strokeWidth: "97%",
                        margin: 5, // margin is in pixels
                        shadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            color: "#999",
                            opacity: 1,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: false
                        },
                        value: {
                            offsetY: 15,
                            fontSize: "22px"
                        }
                    }
                }
            },
            fill: {
                type: "gradient",
                gradient: {
                    shade: "light",
                    shadeIntensity: 0.4,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 53, 91]
                }
            },
            labels: ["Average Results"]
        };

        this.chartOptions.filterTable = {
            chart: { type: "line" },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            xAxis: {
                categories: ["19", "20", "21", "22", "23"],
                title: null
            },
            yAxis: {
                title: null
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    name: "traffic",
                    data: [40, 30, 50, 20, 60]
                }
            ]
        };
    }

    async receiveTime(time: object) {
        this.timeParam = time;
        let timeParam = JSON.parse(JSON.stringify(this.timeParam));

        // TODO: wait api
        // Loading.show();
        // await this.$server
        //     .C("/", timeParam)
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(
        //             this,
        //             response,
        //             (response: any) => {
        //             },
        //             this._("w_Dialog_ErrorTitle")
        //         );
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.catchError(
        //             this,
        //             e,
        //             this._("w_Dialog_ErrorTitle")
        //         );
        //     });
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

export default FilterStatusDashboard;
Vue.component("filter-status-dashboard", FilterStatusDashboard);
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

.charfix {
    margin-top: -10px;
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
        margin-top: 10px;
        padding: 0;
        display: flex;
        justify-content: center;
    }

    .ratio {
    }

    .right {
        float: right;
    }

    .left {
        float: left;
    }

    .demographic-div {
        margin-top: 0px;
        height: 200px;
    }

    .vip-blackList-div {
        margin-top: 20px;
    }
}
</style>
