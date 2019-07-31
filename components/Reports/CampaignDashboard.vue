<template>
    <div class="animated fadeIn">
        <div class="row center">
            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="ePageType.budget == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_Campaign_Budget")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{anlysisData.budget.total != null ? numberWithCommas(anlysisData.budget.total) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.budget.sign ? (eSign.positive == anlysisData.budget.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.budget.sign">{{eSign.positive == anlysisData.budget.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.budget.value != null ? numberWithCommas(anlysisData.budget.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.budget.valueRatio != null ? toPercent(anlysisData.budget.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->
            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="ePageType.trafficGainPer == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_Campaign_TrafficGainPer")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{anlysisData.trafficGainPer.total != null ? numberWithCommas(anlysisData.trafficGainPer.total) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.trafficGainPer.sign ? (eSign.positive == anlysisData.trafficGainPer.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.trafficGainPer.sign">{{eSign.positive == anlysisData.trafficGainPer.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.trafficGainPer.value != null ? numberWithCommas(anlysisData.trafficGainPer.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.trafficGainPer.valueRatio != null ? toPercent(anlysisData.trafficGainPer.valueRatio,1) : "N/A"}}</span>
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
import {
    ReportDashboard,
    EPageType,
    ESign,
    ETimeMode
} from "@/components/Reports";
import { EWeather } from "./";
import HighchartsService from "./models/HighchartsService";
import ResponseFilter from "@/services/ResponseFilter";

@Component({
    components: {}
})
export class CampaignDashboard extends Vue {
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
    anlysisData = {
        pageType: EPageType.none,
        budget: {
            sign: ESign.none,
            total: null,
            value: null,
            valueRatio: null
        },
        trafficGainPer: {
            sign: ESign.none,
            total: null,
            value: null,
            valueRatio: null
        }
    };

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
            .C("/report/complex", readParam) //TOD wiat API
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.anlysisData.pageType = this.pageType;

                    // weather
                    if (response.weather) {
                        this.weather = response.weather.icon;
                    }

                    // budget
                    if (response.budget) {
                        this.anlysisData.budget = {
                            sign:
                                response.budget.variety == null ||
                                response.budget.variety == 0
                                    ? ESign.none
                                    : response.budget.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            total: response.budget.value,
                            valueRatio: response.peopleCounting.variety
                                ? response.budget.variety /
                                  response.budget.value
                                : null,
                            value: response.budget.variety
                        };
                    }

                    // traffic Gain Per
                    if (response.trafficGainPer) {
                        this.anlysisData.trafficGainPer = {
                            sign:
                                response.trafficGainPer.variety == null ||
                                response.trafficGainPer.variety == 0
                                    ? ESign.none
                                    : response.trafficGainPer.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            total: response.trafficGainPer.value,
                            valueRatio: response.trafficGainPer.variety
                                ? response.trafficGainPer.variety /
                                  response.trafficGainPer.value
                                : null,
                            value: response.trafficGainPer.variety
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
}

export default CampaignDashboard;
Vue.component("campaign-dashboard", CampaignDashboard);
</script>

<style lang="scss" scoped>
.info-box {
    border: 1px solid #dbdee0;
    margin: 0 0 30px 0;

    .clearfix {
        padding: 10px;
    }

    .backgroundColor {
        padding: 10px;
        background: #f9f9f9;
        color: black;
        height: 120px;

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
            color: #e26929;
        }
        .green {
            color: #1bbc9b;
        }
    }

    .backgroundColor.selected {
        background: #4e93b7;
        color: white;
    }

    .center {
        float: center;
    }
}
</style>
