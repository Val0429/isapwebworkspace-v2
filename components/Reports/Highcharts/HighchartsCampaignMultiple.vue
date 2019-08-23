<template>
    <div class="chart">
        <h2 v-if="mountAnyChart()">{{ _('w_ReportCampaign_CampaignChart') }}</h2>
        <b-form-group :label="_('w_ReportCampaign_MultipleLabel')">
            <b-row>
                <b-col>
                    <highcharts
                        ref="chartMultiple"
                        v-if="mountChart.campaignMultiple"
                        :options="chartOptions.campaignMultiple"
                    ></highcharts>
                </b-col>
            </b-row>
        </b-form-group>
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

// custom import
import Datetime from "@/services/Datetime";
import HighchartsService from "../models/HighchartsService";
import { ETimeMode } from "../";
import { IChartCampaignMultiple } from "../";

@Component({
    components: {}
})
export class HighchartsCampaignMultiple extends Vue {
    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    value: IChartCampaignMultiple[];

    mountChart: {
        campaignMultiple: boolean;
    } = {
        campaignMultiple: false
    };
    chartOptions: {
        campaignMultiple: object;
    } = {
        campaignMultiple: {}
    };

    @Watch("value", { deep: true })
    private onValueChanged(
        newval: IChartCampaignMultiple[],
        oldval: IChartCampaignMultiple[]
    ) {
        this.start();
    }

    created() {
        this.start();
    }

    mounted() {}

    start() {
        this.initCampaignMultipleChart();
    }

    mountAnyChart(): boolean {
        if (this.mountChart.campaignMultiple) {
            return true;
        }
        return false;
    }

    initCampaignMultipleChart() {
        let tempValues: IChartCampaignMultiple[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempCategories: string[] = [];
        let tempSeries: any = [
            {
                name: this._("w_ReportCampaign_Budget"),
                type: "column",
                data: []
            },
            {
                name: this._("w_ReportCampaign_TrafficGainPer"),
                type: "spline",
                yAxis: 1,
                data: []
            }
        ];

        for (let val of tempValues) {
            let tempVal = this.anysislyChartValue(val);
            tempSeries[0].data.push(tempVal.budget);
            tempSeries[1].data.push(tempVal.trafficGainPer);
            tempCategories.push(
                HighchartsService.categorieStringWithJSON(tempVal.name, tempVal)
            );
        }

        this.chartOptions.campaignMultiple = {
            chart: { zoomType: "x" },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            xAxis: [
                {
                    categories: tempCategories,
                    labels: { useHTML: true }
                }
            ],
            yAxis: [
                {
                    labels: { style: { color: "#000" } },
                    title: {
                        text: this._("w_ReportCampaign_Budget"),
                        style: { color: "#000" }
                    }
                },
                {
                    labels: { style: { color: "#000" } },
                    title: {
                        text: this._("w_ReportCampaign_TrafficGainPer"),
                        style: { color: "#000" }
                    },
                    opposite: true
                }
            ],
            tooltip: {
                enabled: true,
                useHTML: true,
                shared: true,
                backgroundColor: "#333",
                style: { color: "#fff" },
                formatter: function(tooltip: any) {
                    let self: any = this;
                    let result = "";
                    if (self.x != undefined) {
                        try {
                            // anysisly JSON
                            let startIndex = self.x.indexOf(">{");
                            let endIndex = self.x.indexOf("}<");
                            let valueJson = self.x.substring(
                                startIndex + 1,
                                endIndex + 1
                            );
                            let newValue: any = JSON.parse(valueJson);

                            // set value
                            result += `${newValue.name}<br>`;
                            result += `${newValue.i18n.startDate}: ${newValue.startDateString}<br>`;
                            result += `${newValue.i18n.endDate}: ${newValue.endDateString}<br>`;
                            result += `${
                                newValue.i18n.budget
                            }: ${newValue.budget.toString()}<br>`;
                            result += `${
                                newValue.i18n.totalTraffic
                            }: ${newValue.traffic.toString()}<br>`;
                            result += `${
                                newValue.i18n.trafficGainPer
                            }: ${newValue.trafficGainPer.toString()}<br>`;
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    return result;
                }
            },
            series: tempSeries
        };

        this.mountChart.campaignMultiple = true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    private anysislyChartValueDefault(): IChartCampaignMultiple {
        let value: IChartCampaignMultiple = {
            name: "",
            startDate: new Date(),
            endDate: new Date(),
            traffic: 0,
            budget: 0,
            trafficGainPer: 0
        };

        value.i18n = this.i18nItem();
        value.startDateString = Datetime.DateTime2String(
            value.startDate,
            HighchartsService.datetimeFormat.date
        );
        value.endDateString = Datetime.DateTime2String(
            value.endDate,
            HighchartsService.datetimeFormat.date
        );
        return value;
    }

    private anysislyChartValue(
        item: IChartCampaignMultiple
    ): IChartCampaignMultiple {
        let value = JSON.parse(JSON.stringify(item));
        value.startDate = new Date(value.startDate);
        value.endDate = new Date(value.endDate);

        value.trafficGainPer = HighchartsService.formatFloat(
            value.trafficGainPer
        );
        value.i18n = this.i18nItem();
        value.startDateString = Datetime.DateTime2String(
            value.startDate,
            HighchartsService.datetimeFormat.date
        );
        value.endDateString = Datetime.DateTime2String(
            value.endDate,
            HighchartsService.datetimeFormat.date
        );
        return value;
    }

    private i18nItem() {
        let result: any = {
            time: this._("w_Report_Time"),
            date: this._("w_Report_Date"),
            startDate: this._("w_Report_StartDate"),
            endDate: this._("w_Report_EndDate"),
            budget: this._("w_ReportCampaign_Budget"),
            traffic: this._("w_ReportCampaign_Traffic"),
            totalTraffic: this._("w_ReportCampaign_TotalTraffic"),
            trafficGainPer: this._("w_ReportCampaign_TrafficGainPer")
        };
        return result;
    }
}

export default HighchartsCampaignMultiple;
Vue.component("highcharts-campaign-multiple", HighchartsCampaignMultiple);
</script>

<style lang="scss" scoped>
.chart {
    padding-top: 30px;
    padding-bottom: 30px;
}
</style>
