<template>
    <div>

        <iv-card :label="_('w_DashboardOverview_FilterStatus')">

            <div class="col-lg-12 col-sm-12 col-xs-12 col-xxs-12">
                <div class="box current-info-box">
                    <div class="backgroundColor">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_Traffic")}}</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">{{anlysisData.traffic.total != null ? toPercent(anlysisData.traffic.total) : "N/A"}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-12 col-sm-12 col-xs-12 col-xxs-12">
                <div class="box current-info-box">
                    <div class="backgroundColor">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_AverageOccupancy")}}</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">{{anlysisData.averageOccupancy.total != null ? numberWithCommas(anlysisData.averageOccupancy.total) : "N/A"}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-12 col-sm-12 col-xs-12 col-xxs-12">
                <div class="box current-info-box">
                    <div class="backgroundColor">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_AverageDwellTime")}}</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">{{anlysisData.averageDwellTime.total != null ? numberWithCommas(anlysisData.averageDwellTime.total) : "N/A"}}</span>
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

            <div class="col-lg-12 col-sm-12 col-xs-12 col-xxs-12">
                <div class="box current-info-box">
                    <div class="backgroundColor">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_RepeatCustomer")}}</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">{{anlysisData.repeatVisitor.total != null ? numberWithCommas(anlysisData.repeatVisitor.total) : "N/A"}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->
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
import {
    ReportDashboard,
    EPageType,
    ESign,
    ETimeMode
} from "@/components/Reports";
import { EWeather } from "@/components/Reports";
import HighchartsService from "@/components/Reports/models/HighchartsService";
import ResponseFilter from "@/services/ResponseFilter";

@Component({
    components: {}
})
export class FilterStatusDashboard extends Vue {
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
        type: String,
        default: function() {
            return ETimeMode.none;
        }
    })
    type: ETimeMode;

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

    @Prop({
        type: String,
        default: function() {
            return EPageType.none;
        }
    })
    pageType: EPageType;

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

    weather: EWeather = EWeather.none;
    anlysisData = new ReportDashboard();

    eSign = ESign;
    ePageType = EPageType;
    eWeather = EWeather;

    created() {}

    async mounted() {}

    async initData() {
        const readParam: {
            startDate: Date;
            endDate: Date;
            type: string;
            siteIds: string[];
            tagIds: string[];
        } = {
            startDate: this.startDate,
            endDate: this.endDate,
            type: this.type,
            siteIds: this.siteIds,
            tagIds: this.tagIds
        };

        this.$server
            .C("/report/complex", readParam)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.anlysisData.pageType = this.pageType;

                    // weather
                    if (response.weather) {
                        this.weather = response.weather.icon;
                    }

                    // people Counting
                    if (response.peopleCounting) {
                        this.anlysisData.traffic = {
                            sign:
                                response.peopleCounting.variety == null ||
                                response.peopleCounting.variety == 0
                                    ? ESign.none
                                    : response.peopleCounting.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            total: response.peopleCounting.value,
                            valueRatio: response.peopleCounting.variety
                                ? response.peopleCounting.variety /
                                  response.peopleCounting.value
                                : null,
                            value: response.peopleCounting.variety
                        };
                    }

                    // human Detection
                    if (response.humanDetection) {
                        this.anlysisData.averageOccupancy = {
                            sign:
                                response.humanDetection.variety == null ||
                                response.humanDetection.variety == 0
                                    ? ESign.none
                                    : response.humanDetection.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            total: response.humanDetection.value,
                            valueRatio: response.humanDetection.variety
                                ? response.humanDetection.variety /
                                  response.humanDetection.value
                                : null,
                            value: response.humanDetection.variety
                        };
                    }

                    // average Dwell Time
                    if (response.averageDwellTime) {
                        this.anlysisData.averageDwellTime = {
                            sign:
                                response.averageDwellTime.variety == null ||
                                response.averageDwellTime.variety == 0
                                    ? ESign.none
                                    : response.averageDwellTime.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            total: response.averageDwellTime.value,
                            valueRatio: response.averageDwellTime.variety
                                ? response.averageDwellTime.variety /
                                  response.averageDwellTime.value
                                : null,
                            value: response.averageDwellTime.variety
                        };
                    }

                    // demographic
                    if (response.demographic) {
                        this.anlysisData.demographic = {
                            sign:
                                response.demographic.malePercent == null ||
                                response.demographic.malePercent == 0
                                    ? ESign.none
                                    : response.demographic.maleVariety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            value: response.demographic.maleVariety,
                            valueRatio: response.demographic.malePercent,
                            sign2:
                                response.demographic.femalePercent == null ||
                                response.demographic.femalePercent == 0
                                    ? ESign.none
                                    : response.demographic.femaleVariety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            value2: response.demographic.femaleVariety,
                            valueRatio2: response.demographic.femalePercent
                        };
                    }

                    // vip/Blacklist
                    if (response.vipBlacklist) {
                        this.anlysisData.vipBlacklist = {
                            sign:
                                response.vipBlacklist.vpiPercent == null ||
                                response.vipBlacklist.vpiPercent == 0
                                    ? ESign.none
                                    : response.vipBlacklist.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            value: response.vipBlacklist.vpiVariety,
                            valueRatio: response.vipBlacklist.vpiPercent,
                            sign2:
                                response.vipBlacklist.blacklistPercent ==
                                    null ||
                                response.vipBlacklist.blacklistPercent == 0
                                    ? ESign.none
                                    : response.vipBlacklist.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            value2: response.vipBlacklist.blacklistVariety,
                            valueRatio2: response.vipBlacklist.blacklistPercent
                        };
                    }

                    // repeat Customer
                    if (response.repeatVisitor) {
                        this.anlysisData.repeatVisitor = {
                            sign:
                                response.repeatVisitor.variety == null ||
                                response.repeatVisitor.variety == 0
                                    ? ESign.none
                                    : response.repeatVisitor.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            total: response.repeatVisitor.value,
                            valueRatio: response.repeatVisitor.variety
                                ? response.repeatVisitor.variety /
                                  response.repeatVisitor.value
                                : null,
                            value: response.repeatVisitor.variety
                        };
                    }

                    // revenue
                    if (response.revenue) {
                        this.anlysisData.revenue = {
                            sign:
                                response.revenue.variety == null ||
                                response.revenue.variety == 0
                                    ? ESign.none
                                    : response.revenue.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            total: response.revenue.value,
                            valueRatio: response.revenue.variety
                                ? response.revenue.variety /
                                  response.revenue.value
                                : null,
                            value: response.revenue.variety
                        };
                    }

                    // transaction
                    if (response.transaction) {
                        this.anlysisData.transaction = {
                            sign:
                                response.transaction.variety == null ||
                                response.transaction.variety == 0
                                    ? ESign.none
                                    : response.transaction.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            total: response.transaction.value,
                            valueRatio: response.transaction.variety
                                ? response.transaction.variety /
                                  response.transaction.value
                                : null,
                            value: response.transaction.variety
                        };
                    }

                    // conversion
                    if (response.conversion) {
                        this.anlysisData.conversion = {
                            sign:
                                response.conversion.variety == null ||
                                response.conversion.variety == 0
                                    ? ESign.none
                                    : response.conversion.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            total: response.conversion.value,
                            valueRatio: response.conversion.variety
                                ? response.conversion.variety /
                                  response.conversion.value
                                : null,
                            value: response.conversion.variety
                        };
                    }

                    // ASP
                    if (response.asp) {
                        this.anlysisData.asp = {
                            sign:
                                response.asp.variety == null ||
                                response.asp.variety == 0
                                    ? ESign.none
                                    : response.asp.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            total: response.asp.value,
                            valueRatio: response.asp.variety
                                ? response.asp.variety / response.asp.value
                                : null,
                            value: response.asp.variety
                        };
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
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

    showWeather() {
        let result;
        let style = "font-size:1.1rem; color:#924da3";
        switch (this.weather as any) {
            case "day-sunny":
                result = `<i class="wi wi-day-sunny" style="${style}"></i>`;
                break;

            case "night-clear":
                result = `<i class="wi wi-night-clear" style="${style}"></i>`;
                break;

            case "rain":
                result = `<i class="wi wi-rain" style="${style}"></i>`;
                break;

            case "snow":
                result = `<i class="wi wi-snow" style="${style}"></i>`;
                break;

            case "sleet":
                result = `<i class="wi wi-sleet" style="${style}"></i>`;
                break;

            case "strong-wind":
                result = `<i class="wi wi-strong-wind" style="${style}"></i>`;
                break;

            case "fog":
                result = `<i class="wi wi-fog" style="${style}"></i>`;
                break;

            case "cloudy":
                result = `<i class="wi wi-cloudy" style="${style}"></i>`;
                break;

            case "day-cloudy":
                result = `<i class="wi wi-day-cloudy" style="${style}"></i>`;
                break;

            case "night-alt-cloudy":
                result = `<i class="wi wi-night-alt-cloudy" style="${style}"></i>`;
                break;

            case "":
            default:
                result = `<i class="fa fa-question" style="${style}"></i>`;
                break;
        }
        return result;
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
        color: black;
        height: 120px;
        border-radius: 10px;
    }
}

.info-box-second {
    border-left: 1px solid #4d5256;
    margin: 0 0 30px 0;

    .backgroundColor {
        padding: 10px;
        color: black;
        height: 120px;
    }
}

.backgroundColor.selected {
    background: #4d5256;
    color: white;
}

.clearfix {
    padding: 10px;

    .title {
        float: left;
        font-weight: bold;
        font-size: 12px;
        margin: 0;
        padding: 0;
    }

    .weather {
        float: right;
        font-weight: bold;
        font-size: 12px;
        margin: 0;
        padding: 0;
    }

    .date {
        float: left;
        font-weight: bold;
        font-size: 36px;
        margin-top: -8px;
        padding: 0;
    }

    .date-sm {
        float: left;
        font-weight: bold;
        font-size: 26px;
        margin-top: -8px;
        padding-top: 6px;
    }

    .ratio {
        float: right;
        font-weight: bold;
        font-size: 12px;
        margin: 0;
        padding: 0;
    }

    .red {
        color: #ff4326;
    }
    .green {
        color: #55c250;
    }
}
</style>
