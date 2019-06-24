<template>
    <div class="animated fadeIn">
        <div class="row">
            <div class="col-lg-1 col-sm-0 col-xs-0 col-xxs-0">
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6col-xxs-12">
                <div class="box info-box">
                    <div :class="pageType.traffic == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">TRAFFIC</span>
                            <span class="value">Weather</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">432,50</span>
                            <span class="change red">▼11 (15.78%)</span>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="pageType.averageOccupancy == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">AVERAGE OCCUPANCY</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">10</span>
                            <span class="change green">▲1 (15.78%)</span>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="pageType.averageDwellTime == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">AVERAGE DWELL TIME(M)</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">25</span>
                            <span class="change green">▲2 (15.78%)</span>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="pageType.demographic == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">DEMOGRAPHIC</span>
                        </div>
                        <div class="clearfix">
                            <img src="../../assets/images/men.png">
                            <span class="date green">▲11 (15.78%)</span>
                            <img src="../../assets/images/women.png">
                            <span class="change red">▼11 (15.78%)</span>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="pageType.vipBlacklist == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">VIP/BLACKLIST</span>
                        </div>
                        <div class="clearfix">
                            <img src="../../assets/images/vip.png">
                            <span class="date green">▲11</span>
                            <span class="date green">(15.78%)</span>
                            <img src="../../assets/images/stranger.png">
                            <span class="change red">▼11 (15.78%)</span>
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
                    <div :class="pageType.bepeatCustomer == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">BEPEAT CUSTOMER</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">36%</span>
                            <span class="change red">▼9 (11.78%)</span>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="pageType.bevenue == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">BEVENUE</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">99,999</span>
                            <span class="change green">▲9.9 (99.78%)</span>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="pageType.transaction == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">TRANSACTION</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">666</span>
                            <span class="change green">▲11 (19.78%)</span>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="pageType.conversion == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">CONVERSION%</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">18%</span>
                            <span class="change red">▼2 (1.78%)</span>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="pageType.asp == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">ASP</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">1,245</span>
                            <span class="change red">▼1 (15,78%)</span>
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
    bepeatCustomer = "bepeatCustomer",
    bevenue = "bevenue",
    transaction = "transaction",
    conversion = "conversion",
    asp = "asp"
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

    pageType = PageType;

    created() {}

    mounted() {}

    dashboardClick(event) {
        let els = document.getElementsByClassName("backgroundColor") as any;
        for (let el of els) {
            el.classList.remove("selected");
        }
        event.currentTarget.classList.add("selected");
    }
}

export default AnlysisDashboard;
Vue.component("anlysis-dashboard", AnlysisDashboard);
</script>

<style lang="scss" scoped>
.info-box {
    border: 1px solid #dbdee0;
    margin: 0 0 30px 0;

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

        .value {
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
