<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <div
                key="transition_1"
                v-show="transition.step === 1"
                :label="'Empty 1'"
            >

                <iv-card>

                    <dashboard
                        :visitorOnSite="inputFormData.visitorOnSite"
                        :dailyTotalVisitor="inputFormData.dailyTotalVisitor"
                    >
                    </dashboard>

                    <b-form-group>
                        <b-form-radio-group
                            v-model="inputFormData.dateRange"
                            buttons
                            name="radio-btn-date-range"
                            :options="selectItem.dateRange"
                            @input="changeDateRange"
                        ></b-form-radio-group>
                    </b-form-group>

                    <iv-form
                        v-model="inputFormData"
                        :interface="filterInterface()"
                        @update:*="updateForm"
                    >
                    </iv-form>

                    <highcharts
                        ref="chartStatistic"
                        v-if="mountChart.statistic"
                        class="chart-view"
                        :options="chartOptions.statistic"
                    ></highcharts>

                    <highcharts
                        ref="chartRecurring"
                        v-if="mountChart.recurring"
                        class="chart-view"
                        :options="chartOptions.recurring"
                    ></highcharts>

                </iv-card>

            </div>

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

// Vue
import { Dashboard } from "@/components/Dashboard/Dashboard.vue";

// interface
import { IValSelectItem, IBootstrapSelectItem } from "@/services/VMS";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
import ResponseFilter from "@/services/ResponseFilter";
import packageJson from "@/package.json";

/// install Highcharts
import Highcharts from "highcharts";
import HighchartsVue from "highcharts-vue";
import exportingInit from "highcharts/modules/exporting";
exportingInit(Highcharts);
Vue.use(HighchartsVue);

enum EDateRange {
    none = "none",
    month = "month",
    week = "week",
    today = "today"
}

interface IInputFormData {
    visitorOnSite: number;
    dailyTotalVisitor: number;
    dateRange: EDateRange;
    kioskIds: string[];
    startDate: Date | null;
    endDate: Date | null;
    statistic: number;
    exception: number;
    recurring: any;
}

interface IChartRecurring {
    categorie: string;
    value: number;
}

@Component({
    components: {}
})
export default class ReportsDashboard extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    inputFormData: IInputFormData = {
        visitorOnSite: 0,
        dailyTotalVisitor: 0,
        dateRange: EDateRange.month,
        kioskIds: [],
        startDate: null,
        endDate: null,
        statistic: 0,
        exception: 0,
        recurring: []
    };

    selectItem: {
        dateRange: IBootstrapSelectItem[];
        kioskIds: any;
    } = {
        dateRange: [],
        kioskIds: {}
    };

    mountChart = {
        statistic: false,
        recurring: false
    };

    chartOptions = {
        statistic: {},
        recurring: {}
    };

    created() {
        this.selectItem.dateRange = [
            { value: EDateRange.month, text: this._("w_ThisMonth") },
            { value: EDateRange.week, text: this._("w_ThisWeek") },
            { value: EDateRange.today, text: this._("w_Today") }
        ];
    }

    async mounted() {
        await this.initDateRange();
        await this.initKiosk();
        await this.initStatistic();
        await this.initException();
        await this.initRecurring();
        this.initStatisticChart();
    }

    async initDateRange() {
        switch (this.inputFormData.dateRange) {
            case EDateRange.month:
                this.inputFormData.startDate = Datetime.MonthStart(new Date());
                this.inputFormData.endDate = Datetime.MonthEnd(new Date());
                break;
            case EDateRange.week:
                this.inputFormData.startDate = Datetime.WeekStart(new Date());
                this.inputFormData.endDate = Datetime.WeekEnd(new Date());
                break;
            case EDateRange.today:
                this.inputFormData.startDate = Datetime.DateStart(new Date());
                this.inputFormData.endDate = Datetime.DateEnd(new Date());
                break;
        }
    }

    async initKiosk() {
        let param = {
            paging: {
                all: true
            }
        };
        await this.$server
            .R("/kiosks", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (
                        response.results != undefined &&
                        response.results.length > 0
                    ) {
                        for (let ret of response.results) {
                            if (
                                ret.objectId != undefined &&
                                ret.username != undefined &&
                                ret.data != undefined &&
                                ret.data.activated != undefined &&
                                ret.data.activated
                            ) {
                                this.$set(
                                    this.selectItem.kioskIds,
                                    ret.objectId,
                                    ret.username
                                );
                                this.inputFormData.kioskIds.push(ret.objectId);
                            }
                        }
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initRecurring() {
        this.inputFormData.recurring = [];

        let param = {
            start: this.inputFormData.startDate.toISOString(),
            end: this.inputFormData.endDate.toISOString()
        };
        await this.$server
            .R("/flow1/reports/recurring", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (response.data != undefined) {
                        for (let res of response.data) {
                            let tempItem: IChartRecurring = {
                                categorie: "",
                                value: 0
                            };

                            if (res.totalVisit != undefined) {
                                tempItem.value = res.totalVisit;
                            }

                            if (
                                res.visitor != undefined &&
                                res.visitor != undefined &&
                                res.visitor.name != undefined
                            ) {
                                let recurringIndex = -1;
                                for (let i in this.inputFormData.recurring) {
                                    if (
                                        this.inputFormData.recurring[i]
                                            .categorie == res.visitor.name
                                    ) {
                                        recurringIndex = parseInt(i);
                                        break;
                                    }
                                }
                                if (recurringIndex < 0) {
                                    tempItem.categorie = res.visitor.name;
                                    this.inputFormData.recurring.push(tempItem);
                                } else {
                                    this.inputFormData.recurring[
                                        recurringIndex
                                    ].value += tempItem.value;
                                }
                            }
                        }
                    }
                });
                this.initRecurringChart();
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initStatistic() {
        this.inputFormData.visitorOnSite = 0;
        this.inputFormData.dailyTotalVisitor = 0;
        this.inputFormData.statistic = 0;

        if (this.inputFormData.kioskIds.length > 0) {
            let param = {
                start: this.inputFormData.startDate.toISOString(),
                end: this.inputFormData.endDate.toISOString(),
                kioskIds: this.kioskIdString()
            };
            await this.$server
                .R("/flow1/reports/statistic", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            if (response.data != undefined) {
                                for (let resData of response.data) {
                                    if (resData.totalVisitor != undefined) {
                                        this.inputFormData.visitorOnSite +=
                                            resData.totalVisitor;
                                        this.inputFormData.dailyTotalVisitor +=
                                            resData.totalVisitor;
                                        this.inputFormData.statistic +=
                                            resData.totalVisitor;
                                    }
                                }
                            }
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        }
    }

    async initException() {
        this.inputFormData.exception = 0;
        if (this.inputFormData.kioskIds.length > 0) {
            let param = {
                start: this.inputFormData.startDate.toISOString(),
                end: this.inputFormData.endDate.toISOString(),
                kioskIds: this.kioskIdString()
            };
            await this.$server
                .R("/flow1/reports/exception", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            if (response.data != undefined) {
                                for (let tempLoop of response.data) {
                                    if (tempLoop.totalException != undefined) {
                                        this.inputFormData.exception +=
                                            tempLoop.totalException;
                                    }
                                }
                            }
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        }
    }

    initStatisticChart() {
        let tempSeries = [
            {
                name: this._("w_Dashboard_ChartStatisticSuccess"),
                y: this.inputFormData.statistic
            },
            {
                name: this._("w_Dashboard_ChartStatisticException"),
                y: this.inputFormData.exception
            }
        ];

        this.mountChart.statistic = false;

        this.chartOptions.statistic = {
            chart: { type: "column" },
            exporting: { enabled: false },
            title: { text: this._("w_Dashboard_ChartStatisticTitle") },
            subtitle: { text: null },
            xAxis: { type: "category" },
            yAxis: { title: { text: null } },
            legend: { enabled: false },
            series: [
                {
                    name: null,
                    colorByPoint: true,
                    data: tempSeries
                }
            ]
        };

        this.mountChart.statistic = true;
    }

    initRecurringChart() {
        let tempCategories = [];
        let tempSeries = [];

        for (let res of this.inputFormData.recurring) {
            tempCategories.push(res.categorie);
            tempSeries.push({
                name: res.categorie,
                data: []
            });
        }

        for (let i in tempSeries) {
            for (let j in this.inputFormData.recurring) {
                if (i == j) {
                    tempSeries[i].data.push(
                        this.inputFormData.recurring[j].value
                    );
                } else {
                    tempSeries[i].data.push(null);
                }
            }
        }

        this.mountChart.recurring = false;
        this.chartOptions.recurring = {
            chart: { type: "bar" },
            exporting: { enabled: false },
            title: { text: this._("w_Dashboard_ChartRecurringTitle") },
            subtitle: { text: null },
            xAxis: {
                categories: tempCategories
            },
            yAxis: {
                min: 0,
                title: {
                    text: null,
                    align: "high"
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: "normal"
                }
            },
            series: tempSeries
        };
        this.mountChart.recurring = true;
    }

    kioskIdString(): string {
        let result = "";
        for (let kioskId of this.inputFormData.kioskIds) {
            result += `${kioskId},`;
        }
        result = result.substr(0, result.length - 1);
        return result;
    }

    async changeDateRange() {
        await this.initDateRange();
        await this.initRecurring();
        await this.initStatistic();
        await this.initException();
        await this.initStatisticChart();
    }

    async updateForm(data: any) {
        switch (data.key) {
            case "kioskIds":
                this.inputFormData.kioskIds = data.value;
                break;
        }
        await this.initStatistic();
        await this.initException();
        await this.initStatisticChart();
    }

    filterInterface() {
        return `
            interface {

                /**
                 * @uiLabel - ${" "}
                 */
                kioskIds?: ${toEnumInterface(
                    this.selectItem.kioskIds as any,
                    true
                )};

            }
        `;
    }
}
</script>

<style lang="scss" scoped>
.chart-view {
    margin-top: 20px;
}
</style>




