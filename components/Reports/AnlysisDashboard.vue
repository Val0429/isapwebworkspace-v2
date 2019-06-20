<template>
    <div class="animated fadeIn">
        <div class="row">
            <div class="col-lg-1 col-sm-0 col-xs-0 col-xxs-0">
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6col-xxs-12">
                <div class="box info-box">
                    <div class="backgroundColor cyan">
                        <div class="clearfix">
                            <span class="title">TRAFFIC</span>
                            <span class="value">Weather</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">432,50</span>
                            <span class="change red">▼11 (15.78%)</span>
                        </div>
                        <div
                            class="chart-info-box"
                            style="height: 50px; margin-top: 20px; position: relative; padding: 0px;"
                        ><canvas
                                class="flot-base"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas><canvas
                                class="flot-overlay"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas></div>
                    </div>

                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div class="backgroundColor gary">
                        <div class="clearfix">
                            <span class="title">AVERAGE OCCUPANCY</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">10</span>
                            <span class="change green">▲1 (15.78%)</span>
                        </div>
                        <div
                            class="chart-info-box"
                            style="height: 50px; margin-top: 20px; position: relative; padding: 0px;"
                        ><canvas
                                class="flot-base"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas><canvas
                                class="flot-overlay"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas></div>
                    </div>

                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div class="backgroundColor gary">
                        <div class="clearfix">
                            <span class="title">AVERAGE DWELL TIME(M)</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">25</span>
                            <span class="change green">▲2 (15.78%)</span>
                        </div>
                        <div
                            class="chart-info-box"
                            style="height: 50px; margin-top: 20px; position: relative; padding: 0px;"
                        ><canvas
                                class="flot-base"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas><canvas
                                class="flot-overlay"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas></div>
                    </div>

                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div class="backgroundColor gary">
                        <div class="clearfix">
                            <span class="title">DEMOGRAPHIC</span>
                        </div>
                        <div class="clearfix">
                            <span class="date green">▲11 (15.78%)</span>
                            <span class="change red">▼11 (15.78%)</span>
                        </div>
                        <div
                            class="chart-info-box"
                            style="height: 50px; margin-top: 20px; position: relative; padding: 0px;"
                        ><canvas
                                class="flot-base"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas><canvas
                                class="flot-overlay"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas></div>
                    </div>

                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div class="backgroundColor gary">
                        <div class="clearfix">
                            <span class="title">VIP/BLACKLIST</span>
                        </div>
                        <div class="clearfix">
                            <span class="date green">▲11 (15.78%)</span>
                            <span class="change red">▼11 (15.78%)</span>
                        </div>
                        <div
                            class="chart-info-box"
                            style="height: 50px; margin-top: 20px; position: relative; padding: 0px;"
                        ><canvas
                                class="flot-base"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas><canvas
                                class="flot-overlay"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas></div>
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
                    <div class="backgroundColor gary">
                        <div class="clearfix">
                            <span class="title">BEPEAT CUSTOMER</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">36%</span>
                            <span class="change red">▼9 (11.78%)</span>
                        </div>
                        <div
                            class="chart-info-box"
                            style="height: 50px; margin-top: 20px; position: relative; padding: 0px;"
                        ><canvas
                                class="flot-base"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas><canvas
                                class="flot-overlay"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas></div>
                    </div>

                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div class="backgroundColor gary">
                        <div class="clearfix">
                            <span class="title">BEVENUE</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">99,999</span>
                            <span class="change green">▲9.9 (99.78%)</span>
                        </div>
                        <div
                            class="chart-info-box"
                            style="height: 50px; margin-top: 20px; position: relative; padding: 0px;"
                        ><canvas
                                class="flot-base"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas><canvas
                                class="flot-overlay"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas></div>
                    </div>

                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div class="backgroundColor gary">
                        <div class="clearfix">
                            <span class="title">TRANSACTION</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">666</span>
                            <span class="change green">▲11 (19.78%)</span>
                        </div>
                        <div
                            class="chart-info-box"
                            style="height: 50px; margin-top: 20px; position: relative; padding: 0px;"
                        ><canvas
                                class="flot-base"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas><canvas
                                class="flot-overlay"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas></div>
                    </div>

                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div class="backgroundColor gary">
                        <div class="clearfix">
                            <span class="title">CONVERSION%</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">18%</span>
                            <span class="change red">▼2 (1.78%)</span>
                        </div>
                        <div
                            class="chart-info-box"
                            style="height: 50px; margin-top: 20px; position: relative; padding: 0px;"
                        ><canvas
                                class="flot-base"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas><canvas
                                class="flot-overlay"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas></div>
                    </div>

                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2  col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div class="backgroundColor gary">
                        <div class="clearfix">
                            <span class="title">ASP</span>
                        </div>
                        <div class="clearfix">
                            <span class="date">1,245</span>
                            <span class="change red">▼1 (15,78%)</span>
                        </div>
                        <div
                            class="chart-info-box"
                            style="height: 50px; margin-top: 20px; position: relative; padding: 0px;"
                        ><canvas
                                class="flot-base"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas><canvas
                                class="flot-overlay"
                                style="direction: ltr; position: absolute; left: 0px; top: 0px; width: 232px; height: 50px;"
                                width="232"
                                height="50"
                            ></canvas></div>
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

    inputData = "Test input data";
    modelData = "";

    created() {}

    mounted() {
        this.start();
    }

    start() {
        this.$emit("input", this.inputData);
    }
}

export default AnlysisDashboard;
Vue.component("anlysis-dashboard", AnlysisDashboard);
</script>

<style lang="scss" scoped>
.backgroundColor.cyan {
    background: #4e93b7;
    padding: 10px;
    color: white;
}

.backgroundColor.gary {
    padding: 10px;
    background: #f9f9f9;
    color: black;
}

.box {
    border: 1px solid #dbdee0;
    margin: 0 0 30px 0;
}

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
</style>
