<template>
    <div class="chart">
        <h2 v-if="mountAnyChart()">{{ _('w_ReportCampaign_CampaignChart') }}</h2>
        <b-form-group>
            <highcharts
                ref="chartMultiple"
                v-if="mountChart.campaignSingle"
                :options="chartOptions.campaignSingle"
            ></highcharts>
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
import { ECampaignTimeType } from "../";
import { IChartCampaignSingle } from "../";

@Component({
    components: {}
})
export class HighchartsCampaignSingle extends Vue {
    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    value: any[];

    mountChart: {
        campaignSingle: boolean;
    } = {
        campaignSingle: false
    };
    chartOptions: {
        campaignSingle: object;
    } = {
        campaignSingle: {}
    };

    @Watch("value", { deep: true })
    private onValueChanged(newval: any[], oldval: any[]) {
        this.start();
    }

    created() {
        this.start();
    }

    mounted() {}

    start() {
        this.initCampaignSingleChart();
    }

    initCampaignSingleChart() {
        let tempValues: IChartCampaignSingle[] = JSON.parse(
            JSON.stringify(this.value)
        );

        let tempCategories: string[] = [];
        let tempSeries: any = [
            {
                name: this._("w_ReportCampaign_CampaignBefore"),
                data: []
            },
            {
                name: this._("w_ReportCampaign_CampaignDuring"),
                data: []
            },
            {
                name: this._("w_ReportCampaign_CampaignAfter"),
                data: []
            }
        ];

        let tempCampaignTimeType: ECampaignTimeType = ECampaignTimeType.before;

        for (let val of tempValues) {
            let tempItem = this.anysislyChartValue(val);
            if (tempCampaignTimeType == ECampaignTimeType.before) {
                switch (tempItem.type) {
                    case ECampaignTimeType.before:
                        tempSeries[0].data.push(tempItem.traffic);
                        tempSeries[1].data.push(null);
                        tempSeries[2].data.push(null);
                        tempCategories.push(
                            HighchartsService.categorieStringWithJSON(
                                tempItem.dateString,
                                tempItem
                            )
                        );
                        break;
                    case ECampaignTimeType.during:
                        tempCampaignTimeType = ECampaignTimeType.during;
                        tempSeries[0].data.push(tempItem.traffic);
                        tempSeries[1].data.push(tempItem.traffic);
                        tempSeries[2].data.push(null);
                        tempCategories.push(
                            HighchartsService.categorieStringWithJSON(
                                tempItem.dateString,
                                tempItem
                            )
                        );
                        break;
                    case ECampaignTimeType.after:
                        tempCampaignTimeType = ECampaignTimeType.during;
                        tempSeries[0].data.push(tempItem.traffic);
                        tempSeries[1].data.push(tempItem.traffic);
                        tempSeries[2].data.push(tempItem.traffic);
                        tempCategories.push(
                            HighchartsService.categorieStringWithJSON(
                                tempItem.dateString,
                                tempItem
                            )
                        );
                        break;
                }
            } else if (tempCampaignTimeType == ECampaignTimeType.during) {
                switch (tempItem.type) {
                    case ECampaignTimeType.during:
                        tempSeries[0].data.push(null);
                        tempSeries[1].data.push(tempItem.traffic);
                        tempSeries[2].data.push(null);
                        tempCategories.push(
                            HighchartsService.categorieStringWithJSON(
                                tempItem.dateString,
                                tempItem
                            )
                        );
                        break;
                    case ECampaignTimeType.after:
                        tempCampaignTimeType = ECampaignTimeType.after;
                        tempSeries[0].data.push(null);
                        tempSeries[1].data.push(tempItem.traffic);
                        tempSeries[2].data.push(tempItem.traffic);
                        tempCategories.push(
                            HighchartsService.categorieStringWithJSON(
                                tempItem.dateString,
                                tempItem
                            )
                        );
                        break;
                }
            } else if (tempCampaignTimeType == ECampaignTimeType.after) {
                if (tempItem.type == ECampaignTimeType.after) {
                    tempSeries[0].data.push(null);
                    tempSeries[1].data.push(null);
                    tempSeries[2].data.push(tempItem.traffic);
                    tempCategories.push(
                        HighchartsService.categorieStringWithJSON(
                            tempItem.dateString,
                            tempItem
                        )
                    );
                }
            }
        }

        this.chartOptions.campaignSingle = {
            chart: {
                type: "area",
                zoomType: "x"
            },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            xAxis: { categories: tempCategories },
            yAxis: { title: { text: null } },
            tooltip: {
                enabled: true,
                useHTML: true,
                shared: true,
                backgroundColor: "#333",
                style: { color: "#fff" },
                formatter: function() {
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
                            result += `${newValue.dateString}<br>`;
                            result += `${newValue.i18n.traffic}: ${newValue.traffic}<br>`;
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    return result;
                }
            },
            plotOptions: { area: { fillOpacity: 0.5 } },
            series: tempSeries
        };

        this.mountChart.campaignSingle = true;
    }

    mountAnyChart(): boolean {
        if (this.mountChart.campaignSingle) {
            return true;
        }
        return false;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    private anysislyChartValueDefault(): IChartCampaignSingle {
        let value: IChartCampaignSingle = {
            type: ECampaignTimeType.none,
            date: new Date(),
            traffic: 0
        };

        value.i18n = this.i18nItem();
        value.i18n = this.i18nItem();
        value.dateString = Datetime.DateTime2String(
            value.date,
            HighchartsService.datetimeFormat.date
        );
        return value;
    }

    private anysislyChartValue(
        item: IChartCampaignSingle
    ): IChartCampaignSingle {
        let value = JSON.parse(JSON.stringify(item));
        value.date = new Date(value.date);

        value.i18n = this.i18nItem();
        value.dateString = Datetime.DateTime2String(
            value.date,
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
            traffic: this._("w_ReportCampaign_Traffic")
        };
        return result;
    }
}

export default HighchartsCampaignSingle;
Vue.component("highcharts-campaign-single", HighchartsCampaignSingle);
</script>

<style lang="scss" scoped>
.chart {
    padding-top: 30px;
    padding-bottom: 30px;
}
</style>
