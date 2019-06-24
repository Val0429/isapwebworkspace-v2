<template>
    <div class="animated fadeIn">

        <div class="row">
            <div class="col-lg-1 col-sm-0 col-xs-0 col-xxs-0">
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="pageType.traffic == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_Traffic")}}</span>
                            <span class="weather">Weather</span>
                            <!-- TODO chnage Weather Icon -->
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{numberWithCommas(anlysisData.traffic.total)}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="sign.positive == anlysisData.traffic.sign ?  'ratio green':'ratio red'">
                                    <span>{{sign.positive == anlysisData.traffic.sign ? '▲':'▼'}}</span>
                                    <span>{{numberWithCommas(anlysisData.traffic.value)}}</span><br>
                                    <span>{{toPercent(anlysisData.traffic.valueRatio,1)}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="pageType.averageOccupancy == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_AverageOccupancy")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{numberWithCommas(anlysisData.averageOccupancy.total)}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="sign.positive == anlysisData.averageOccupancy.sign ?  'ratio green':'ratio red'">
                                    <span>{{sign.positive == anlysisData.averageOccupancy.sign ? '▲':'▼'}}</span>
                                    <span>{{numberWithCommas(anlysisData.averageOccupancy.value)}}</span><br>
                                    <span>{{toPercent(anlysisData.averageOccupancy.valueRatio,1)}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="pageType.averageDwellTime == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_AverageDwellTime")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{numberWithCommas(anlysisData.averageDwellTime.total)}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="sign.positive == anlysisData.averageDwellTime.sign ?  'ratio green':'ratio red'">
                                    <span>{{sign.positive == anlysisData.averageDwellTime.sign ? '▲':'▼'}}</span>
                                    <span>{{numberWithCommas(anlysisData.averageDwellTime.value)}}</span><br>
                                    <span>{{toPercent(anlysisData.averageDwellTime.valueRatio,1)}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="pageType.demographic == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_Demographic")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <img src="../../assets/images/men.png">
                                <div :class="sign.positive == anlysisData.demographic.sign ?  'ratio green':'ratio red'">
                                    <span>{{sign.positive == anlysisData.demographic.sign ? '▲':'▼'}}</span>
                                    <span>{{numberWithCommas(anlysisData.demographic.value)}}</span><br>
                                    <span>{{toPercent(anlysisData.demographic.valueRatio,1)}}</span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <img src="../../assets/images/women.png">
                                <div :class="sign.positive == anlysisData.demographic.sign2 ?  'ratio green':'ratio red'">
                                    <span>{{sign.positive == anlysisData.demographic.sign2 ? '▲':'▼'}}</span>
                                    <span>{{numberWithCommas(anlysisData.demographic.value2)}}</span><br>
                                    <span>{{toPercent(anlysisData.demographic.valueRatio2,1)}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="pageType.vipBlacklist == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_VIPBlacklist")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <img src="../../assets/images/vip.png">
                                <div :class="sign.positive == anlysisData.vipBlacklist.sign ?  'ratio green':'ratio red'">
                                    <span>{{sign.positive == anlysisData.vipBlacklist.sign ? '▲':'▼'}}</span>
                                    <span>{{numberWithCommas(anlysisData.vipBlacklist.value)}}</span><br>
                                    <span>{{toPercent(anlysisData.vipBlacklist.valueRatio,1)}}</span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <img src="../../assets/images/stranger.png">
                                <div :class="sign.positive == anlysisData.vipBlacklist.sign2 ?  'ratio green':'ratio red'">
                                    <span>{{sign.positive == anlysisData.vipBlacklist.sign2 ? '▲':'▼'}}</span>
                                    <span>{{numberWithCommas(anlysisData.vipBlacklist.value2)}}</span><br>
                                    <span>{{toPercent(anlysisData.vipBlacklist.valueRatio2,1)}}</span>
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
                    <div :class="pageType.repeatCustomer == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_RepeatCustomer")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{toPercent(anlysisData.repeatCustomer.total,0)}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="sign.positive == anlysisData.repeatCustomer.sign ?  'ratio green':'ratio red'">
                                    <span>{{sign.positive == anlysisData.repeatCustomer.sign ? '▲':'▼'}}</span>
                                    <span>{{numberWithCommas(anlysisData.repeatCustomer.value)}}</span><br>
                                    <span>{{toPercent(anlysisData.repeatCustomer.valueRatio,1)}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="pageType.revenue == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_Revenue")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span
                                    class="date"
                                    style="font-size: 26px; padding:6px"
                                >{{numberWithCommas(anlysisData.revenue.total)}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="sign.positive == anlysisData.revenue.sign ?  'ratio green':'ratio red'">
                                    <span>{{sign.positive == anlysisData.revenue.sign ? '▲':'▼'}}</span>
                                    <span>{{numberWithCommas(anlysisData.revenue.value)}}</span><br>
                                    <span>{{toPercent(anlysisData.revenue.valueRatio,1)}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="pageType.transaction == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_Transaction")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{numberWithCommas(anlysisData.transaction.total)}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="sign.positive == anlysisData.transaction.sign ?  'ratio green':'ratio red'">
                                    <span>{{sign.positive == anlysisData.transaction.sign ? '▲':'▼'}}</span>
                                    <span>{{numberWithCommas(anlysisData.transaction.value)}}</span><br>
                                    <span>{{toPercent(anlysisData.transaction.valueRatio,1)}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="pageType.conversion == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_Conversion")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{toPercent(anlysisData.conversion.total,0)}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="sign.positive == anlysisData.conversion.sign ?  'ratio green':'ratio red'">
                                    <span>{{sign.positive == anlysisData.conversion.sign ? '▲':'▼'}}</span>
                                    <span>{{numberWithCommas(anlysisData.conversion.value)}}</span><br>
                                    <span>{{toPercent(anlysisData.conversion.valueRatio,1)}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="pageType.asp == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_ASP")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{numberWithCommas(anlysisData.asp.total)}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="sign.positive == anlysisData.asp.sign ?  'ratio green':'ratio red'">
                                    <span>{{sign.positive == anlysisData.asp.sign ? '▲':'▼'}}</span>
                                    <span>{{numberWithCommas(anlysisData.asp.value)}}</span><br>
                                    <span>{{toPercent(anlysisData.asp.valueRatio,1)}}</span>
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

enum PageType {
    traffic = "traffic",
    averageOccupancy = "averageOccupancy",
    averageDwellTime = "averageDwellTime",
    demographic = "demographic",
    vipBlacklist = "vipBlacklist",
    repeatCustomer = "repeatCustomer",
    revenue = "revenue",
    transaction = "transaction",
    conversion = "conversion",
    asp = "asp"
}

enum Sign {
    positive = "positive",
    negative = "negative"
}

@Component({
    components: {}
})
export class AnlysisDashboard extends Vue {
    // Prop

    @Prop({
        type: Object,
        default: ""
    })
    anlysisData: object;

    sign = Sign;
    pageType = PageType;

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
        height: 10%;

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
            font-size: 24px;
            margin-top: -8px;
            padding: 0;
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
