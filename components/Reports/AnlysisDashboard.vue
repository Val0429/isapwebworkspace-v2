<template>
    <div class="animated fadeIn">

        <div class="row">
            <div class="col-lg-1 col-sm-0 col-xs-0 col-xxs-0">
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="ePageType.traffic == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_Traffic")}}</span>
                            <span class="weather">Weather</span>
                            <!-- TODO chnage Weather Icon -->
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{anlysisData.traffic.total > 0 ? numberWithCommas(anlysisData.traffic.total) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.traffic.sign ? (eSign.positive == anlysisData.traffic.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.traffic.sign">{{eSign.positive == anlysisData.traffic.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.traffic.value > 0 ? numberWithCommas(anlysisData.traffic.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.traffic.valueRatio > 0 ? toPercent(anlysisData.traffic.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="ePageType.averageOccupancy == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_AverageOccupancy")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{anlysisData.averageOccupancy.total > 0 ? numberWithCommas(anlysisData.averageOccupancy.total) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.averageOccupancy.sign ? (eSign.positive == anlysisData.averageOccupancy.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.averageOccupancy.sign">{{eSign.positive == anlysisData.averageOccupancy.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.averageOccupancy.value > 0 ? numberWithCommas(anlysisData.averageOccupancy.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.averageOccupancy.valueRatio > 0 ? toPercent(anlysisData.averageOccupancy.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="ePageType.averageDwellTime == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_AverageDwellTime")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{anlysisData.averageDwellTime.total > 0 ? numberWithCommas(anlysisData.averageDwellTime.total) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.averageDwellTime.sign ? (eSign.positive == anlysisData.averageDwellTime.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.averageDwellTime.sign">{{eSign.positive == anlysisData.averageDwellTime.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.averageDwellTime.value > 0 ? numberWithCommas(anlysisData.averageDwellTime.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.averageDwellTime.valueRatio > 0 ? toPercent(anlysisData.averageDwellTime.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="ePageType.demographic == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_Demographic")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <img src="../../assets/images/men.png">
                                <div :class="eSign.none != anlysisData.demographic.sign ? (eSign.positive == anlysisData.demographic.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.demographic.sign">{{eSign.positive == anlysisData.demographic.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.demographic.value > 0 ? numberWithCommas(anlysisData.demographic.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.demographic.valueRatio > 0 ? toPercent(anlysisData.demographic.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <img src="../../assets/images/women.png">
                                <div :class="eSign.none != anlysisData.demographic.sign2 ? (eSign.positive == anlysisData.demographic.sign2 ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.demographic.sign2">{{eSign.positive == anlysisData.demographic.sign2 ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.demographic.value2 > 0 ? numberWithCommas(anlysisData.demographic.value2) : "N/A"}} </span><br>
                                    <span>{{anlysisData.demographic.valueRatio2 > 0 ? toPercent(anlysisData.demographic.valueRatio2,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="ePageType.vipBlacklist == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_VIPBlacklist")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <img src="../../assets/images/vip.png">
                                <div :class="eSign.none != anlysisData.vipBlacklist.sign ? (eSign.positive == anlysisData.vipBlacklist.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.vipBlacklist.sign">{{eSign.positive == anlysisData.vipBlacklist.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.vipBlacklist.value > 0 ? numberWithCommas(anlysisData.vipBlacklist.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.vipBlacklist.valueRatio > 0 ? toPercent(anlysisData.vipBlacklist.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <img src="../../assets/images/stranger.png">
                                <div :class="eSign.none != anlysisData.vipBlacklist.sign2 ? (eSign.positive == anlysisData.vipBlacklist.sign2 ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.vipBlacklist.sign2">{{eSign.positive == anlysisData.vipBlacklist.sign2 ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.vipBlacklist.value2 > 0 ? numberWithCommas(anlysisData.vipBlacklist.value2) : "N/A"}} </span><br>
                                    <span>{{anlysisData.vipBlacklist.valueRatio2 > 0 ? toPercent(anlysisData.vipBlacklist.valueRatio2,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-1 col-sm-0 col-xs-0 col-xxs-0">
            </div>
            <!--/col-->
        </div>

        <!-- /row -->

        <div class="row">
            <div class="col-lg-1 col-sm-0 col-xs-0 col-xxs-0">
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="ePageType.repeatCustomer == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_RepeatCustomer")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{anlysisData.repeatCustomer.total > 0 ? toPercent(anlysisData.repeatCustomer.total) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.repeatCustomer.sign ? (eSign.positive == anlysisData.repeatCustomer.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.repeatCustomer.sign">{{eSign.positive == anlysisData.repeatCustomer.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.repeatCustomer.value > 0 ? numberWithCommas(anlysisData.repeatCustomer.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.repeatCustomer.valueRatio > 0 ? toPercent(anlysisData.repeatCustomer.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->
            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-122">
                <div class="box info-box">
                    <div :class="ePageType.revenue == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_Revenue")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span :class="eSign.none != anlysisData.revenue.sign ? 'date-sm':'date'">{{anlysisData.revenue.total > 0 ? numberWithCommas(anlysisData.revenue.total) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.revenue.sign ? (eSign.positive == anlysisData.revenue.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.revenue.sign">{{eSign.positive == anlysisData.revenue.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.revenue.value > 0 ? numberWithCommas(anlysisData.revenue.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.revenue.valueRatio > 0 ? toPercent(anlysisData.revenue.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="ePageType.transaction == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_Transaction")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{anlysisData.transaction.total > 0 ? numberWithCommas(anlysisData.transaction.total) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.transaction.sign ? (eSign.positive == anlysisData.transaction.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.transaction.sign">{{eSign.positive == anlysisData.transaction.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.transaction.value > 0 ? numberWithCommas(anlysisData.transaction.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.transaction.valueRatio > 0 ? toPercent(anlysisData.transaction.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="ePageType.conversion == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_Conversion")}}</span>
                        </div>

                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{anlysisData.conversion.total > 0 ? toPercent(anlysisData.conversion.total,0) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.conversion.sign ? (eSign.positive == anlysisData.conversion.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.conversion.sign">{{eSign.positive == anlysisData.conversion.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.conversion.value > 0 ? numberWithCommas(anlysisData.conversion.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.conversion.valueRatio > 0 ? toPercent(anlysisData.conversion.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="ePageType.asp == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_ASP")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{anlysisData.asp.total > 0 ? numberWithCommas(anlysisData.asp.total) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.asp.sign ? (eSign.positive == anlysisData.asp.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.asp.sign">{{eSign.positive == anlysisData.asp.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.asp.value > 0 ? numberWithCommas(anlysisData.asp.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.asp.valueRatio > 0 ? toPercent(anlysisData.asp.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-1 col-sm-0 col-xs-0 col-xxs-0">
            </div>
            <!--/col-->
        </div>
        <!-- /row -->
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import { ReportDashboard, EPageType, ESign } from "@/components/Reports";

@Component({
    components: {}
})
export class AnlysisDashboard extends Vue {
    // Prop

    @Prop({
        type: Object,
        default: function() {
            return new ReportDashboard();
        }
    })
    anlysisData: ReportDashboard;

    eSign = ESign;
    ePageType = EPageType;

    created() {}

    mounted() {}

    numberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    toPercent(point, fixed) {
        var str = Number(point * 100).toFixed(fixed);
        str += "%";
        return str;
    }
}

export default AnlysisDashboard;
Vue.component("anlysis-dashboard", AnlysisDashboard);
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
}
</style>
