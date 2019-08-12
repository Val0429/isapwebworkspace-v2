<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <iv-card
                :label="_('w_Dashboard_FilterCondition')"
                key="transition_0"
                v-show="transition.step === 1"
                :visible="visible"
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
                :label="_('w_Dashboard_Dashboard')"
                key="transition_1"
                v-show="transition.step === 1"
                :visible="!visible"
            >
                <div class="row">
                    <div class="col-lg-6">
                        <submitted-dashboard :data="dashboardData"></submitted-dashboard>
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

            <div
                key="transition_2"
                v-show="transition.step === 2"
                :label="'Empty 2'"
            >
                Dashboard 2
            </div>

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
import { chart } from "highcharts";
import ResponseFilter from '@/services/ResponseFilter';

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
    startTimeByDays = new Date("1990-1-1 00:00");
    endTimeByDays = new Date("1990-1-2 00:00");
    startTimeByHours = new Date("1990-1-1 00:00");
    endTimeByHours = new Date("1990-1-2 00:00");
    chartDataByHours: ISeries[] = [];
    chartDataByDays: ISeries[] = [];
    dashboardData: IDashboardData = {
        submitted: 0,
        approved: 0,
        awaitingApproval: 0,
        total: 0
    };

    created() {}

    mounted() {}

    initdata() {
        //false data
        this.dashboardData = {
            submitted: 7,
            approved: 15,
            awaitingApproval: 70,
            total: 93
        };

        this.startTimeByHours = new Date("2019-8-5 00:00");
        this.endTimeByHours = new Date("2019-8-6 00:00");
        this.chartDataByHours = [
            {
                name: "all",
                data: [
                    0,
                    0,
                    0,
                    0,
                    0,
                    12.4,
                    23.2,
                    24.5,
                    39.7,
                    10,
                    45.5,
                    57.4,
                    40.4,
                    27.6,
                    29.1,
                    1.8,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ]
            }
        ];

        this.startTimeByDays = new Date("2019-8-5 00:00");
        this.endTimeByDays = new Date("2019-8-6 00:00");
        this.chartDataByDays = [
            {
                name: "Visitor",
                data: [42.4, 99.1]
            },
            {
                name: "Unregistered",
                data: [0, 0]
            }
        ];
    }

    updateFilter(datas: any) {
        this.inputFilterData[datas.key] = datas.value;
        console.log(this.inputFilterData);
    }

    async doSubmit() {
        // TODO waiting for api
        this.initdata();
        this.visible = false;

        await this.$server
            .C("/flow1/crms/dashboard")
            .then((response: any) => {
                console.log('response ~ ', response)
                ResponseFilter.successCheck(this, response, (response: any) => {

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




