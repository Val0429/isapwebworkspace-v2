<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <iv-card
                v-show="transition.step === 1"
                key="transition_0"
                :visible="visible"
                :label="_('w_Dashboard_FilterCondition')"
            >
                <iv-form
                    :interface="IFilterConditionForm()"
                    :value="inputFilterData"
                    @update:*="updateFilter"
                    @submit="doSubmit($event)"
                >
                </iv-form>

                <template #footer>
                    <b-button
                        class="submit"
                        size="lg"
                        @click="doSubmit"
                    >
                        {{ _('wb_Submit') }}
                    </b-button>

                </template>

            </iv-card>

            <iv-card
                v-show="transition.step === 1"
                key="transition_1"
                :visible="!visible"
                :label="_('w_Dashboard_Dashboard')"
            >
                <div class="row">
                    <div class="col-lg-6">
                        <submitted-dashboard
                            :data="dashboardData"
                            @clickEvent="toInvitationPage"
                        ></submitted-dashboard>
                    </div>
                    <div class="col-lg-6">
                        <highchart-dashboard
                            :startTime="startTimeByHours"
                            :endTime="endTimeByHours"
                            :chartData="chartDataByHours"
                            :chartMode="EChartMode.chartByHours"
                            :chartTitle="_('w_Dashboard_RealTimeContractorTraffic')"
                        ></highchart-dashboard>
                    </div>
                    <div class="col-lg-12">
                        <highchart-dashboard
                            :startTime="startTimeByDays"
                            :endTime="endTimeByDays"
                            :chartData="chartDataByDays"
                            :chartMode="EChartMode.chartByDays"
                            :chartTitle="_('w_Dashboard_WorkFrequencyHistory')"
                        ></highchart-dashboard>
                    </div>
                </div>
            </iv-card>

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Highcharts
import { chart } from "highcharts";

// Service
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
import ResponseFilter from "@/services/ResponseFilter";

enum EChartMode {
    chartByHours,
    chartByDays
}

interface ISeries {
    name: string;
    data: number[];
}

interface IDashboardData {
    submitted: number;
    approved: number;
    awaitingApproval: number;
    total: number;
}

@Component({
    components: {}
})
export default class Dashboard extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    inputFilterData = {
        startDate: new Date(),
        endDate: new Date()
    };

    visible: boolean = true;
    EChartMode = EChartMode;
    startTimeByDays: Date = new Date();
    endTimeByDays: Date = new Date();
    startTimeByHours: Date = new Date();
    endTimeByHours: Date = new Date();
    chartDataByHours: ISeries[] = [
        {
            name: "all",
            data: []
        }
    ];
    chartDataByDays: ISeries[] = [
        {
            name: null,
            data: [0, 0]
        }
    ];
    dashboardData: IDashboardData = {
        submitted: 0,
        approved: 0,
        awaitingApproval: 0,
        total: 0
    };

    created() {
        this.initChartDate();
    }

    mounted() {}

    initChartDate() {
        this.inputFilterData.startDate = Datetime.MonthStart(new Date());
        this.inputFilterData.endDate = Datetime.MonthEnd(new Date());

        let dayStart = Datetime.DateStart(new Date());
        let dayEnd = Datetime.DateEnd(new Date());
        dayStart.setDate(dayStart.getDate() - 2);
        dayEnd.setDate(dayEnd.getDate() - 1);

        this.startTimeByHours = Datetime.DateStart(new Date());
        this.endTimeByHours = Datetime.DateEnd(new Date());
        this.startTimeByDays = dayStart;
        this.endTimeByDays = dayEnd;
    }

    updateFilter(datas: any) {
        this.inputFilterData[datas.key] = datas.value;
    }

    toInvitationPage(data) {
        let path =
            "/invitation?" +
            "startDate=" +
            this.inputFilterData.startDate.toISOString() +
            "&endDate=" +
            this.inputFilterData.startDate.toISOString();

        if (data) {
            path += "&status=" + data;
        }
        console.log("path", path);
        this.$router.push(path);
    }

    async doSubmit() {
        // clear data
        this.visible = false;
        this.chartDataByDays[0].data[0] = 0;
        this.chartDataByDays[0].data[1] = 0;
        this.chartDataByHours[0].data = [];

        // Dashboard API
        let param = {
            startDate: this.inputFilterData.startDate.toISOString(),
            endDate: this.inputFilterData.endDate.toISOString()
        };

        await this.$server
            .C("/flow1/crms/dashboard", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    // Left Top
                    if (response.leftTop != undefined) {
                        let totalLeftTop = 0;
                        if (response.leftTop.approve != undefined) {
                            this.dashboardData.approved =
                                response.leftTop.approve;
                            totalLeftTop += response.leftTop.approve;
                        }
                        if (response.leftTop.new != undefined) {
                            this.dashboardData.submitted = response.leftTop.new;
                            totalLeftTop += response.leftTop.new;
                        }
                        if (response.leftTop.pendding != undefined) {
                            this.dashboardData.awaitingApproval =
                                response.leftTop.pendding;
                            totalLeftTop += response.leftTop.pendding;
                        }
                        this.dashboardData.total = totalLeftTop;
                    }

                    // Right Top
                    let rightTopDatas = [];
                    if (response.rightTop != undefined) {
                        for (let i = 0; i < 24; i++) {
                            let haveData = false;
                            for (let loopData of response.rightTop) {
                                if (
                                    loopData.date != undefined &&
                                    loopData.count != undefined &&
                                    typeof loopData.count == "number"
                                ) {
                                    let tempDate: Date = loopData.date as Date;
                                    if (new Date(tempDate).getHours() == i) {
                                        haveData = true;
                                        rightTopDatas.push(loopData.count);
                                        break;
                                    }
                                }
                            }
                            if (!haveData) {
                                rightTopDatas.push(0);
                            }
                        }
                    } else {
                        for (let i = 0; i < 24; i++) {
                            rightTopDatas.push(0);
                        }
                    }
                    this.chartDataByHours[0].data = rightTopDatas;

                    // Bottom
                    if (response.bottom != undefined) {
                        for (let loopData of response.bottom) {
                            if (loopData.date == undefined) {
                                continue;
                            }

                            if (loopData.count == undefined) {
                                continue;
                            }

                            if (typeof loopData.count != "number") {
                                continue;
                            }

                            if (
                                Datetime.DateTime2String(
                                    loopData.date,
                                    Datetime.DateFormat
                                ) ==
                                Datetime.DateTime2String(
                                    this.startTimeByDays,
                                    Datetime.DateFormat
                                )
                            ) {
                                this.chartDataByDays[0].data[0] +=
                                    loopData.count;
                            }

                            if (
                                Datetime.DateTime2String(
                                    loopData.date,
                                    Datetime.DateFormat
                                ) ==
                                Datetime.DateTime2String(
                                    this.endTimeByDays,
                                    Datetime.DateFormat
                                )
                            ) {
                                this.chartDataByDays[0].data[1] +=
                                    loopData.count;
                            }
                        }
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    IFilterConditionForm() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_Startdate")}
                 * @uiColumnGroup - timeGroup
                 * @uiType - iv-form-date
                 */
                startDate?: Date;

                  /**
                 * @uiLabel - ${this._("w_Enddate")}
                 * @uiColumnGroup - timeGroup
                 * @uiType - iv-form-date
                 */
                endDate?: Date;
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>




