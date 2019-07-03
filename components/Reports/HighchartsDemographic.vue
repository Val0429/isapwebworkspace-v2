<template>
    <div class="chart">
        <div>
            <highcharts
                ref="chartGenderAge"
                v-if="mountChart.genderAge"
                :options="chartOptionsGenderAge"
            ></highcharts>
        </div>
        <div>
            <highcharts
                ref="chartGenderTime"
                v-if="mountChart.time"
                :options="chartOptionsGenderTime"
            ></highcharts>
        </div>
        <div>
            <highcharts
                ref="chartAge"
                v-if="mountChart.age"
                :options="chartOptionsAge"
            ></highcharts>
        </div>
        <div>
            <b-form-select></b-form-select>
            <highcharts
                ref="chartDwellTime"
                v-if="mountChart.dwellTime"
                :options="chartOptionsDwellTime"
            ></highcharts>

            <highcharts
                ref="chartGender"
                v-if="mountChart.gender"
                :options="chartOptionsGender"
            ></highcharts>
        </div>

        <div v-if="errorMessage != ''">
            {{ errorMessage }}
        </div>
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
import {
    ETimeMode,
    EAreaMode,
    EChartMode,
    EWeather,
    EAgeRange
} from "./models/EHighCharts";
import {
    IDate,
    IDatetimeGroup,
    ISite,
    IChartDemographicData,
    IChartTrafficData
} from "./models/IHighCharts";
import Datetime from "@/services/Datetime";
import HighChartsService from "./models/HighChartsService";

interface IDemographicMount {
    genderAge: boolean;
    time: boolean;
    age: boolean;
    dwellTime: boolean;
    gender: boolean;
}

@Component({
    components: {}
})
export class HighchartsDemographic extends Vue {
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
    timeMode: ETimeMode;

    @Prop({
        type: String,
        default: function() {
            return EAreaMode.none;
        }
    })
    areaMode: EAreaMode;

    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    sites: ISite[];

    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    value: IChartDemographicData[];

    @Watch("startDate")
    private onStartDateChanged(newval: Date, oldval: Date) {
        this.start();
    }

    @Watch("endDate")
    private onEndDateChanged(newval: Date, oldval: Date) {
        this.start();
    }

    @Watch("timeMode")
    private onTimeModeChanged(newval: ETimeMode, oldval: ETimeMode) {
        this.start();
    }

    @Watch("areaMode")
    private onAreaModeChanged(newval: EAreaMode, oldval: EAreaMode) {
        this.start();
    }

    @Watch("sites")
    private onSitesChanged(newval: ISite[], oldval: ISite[]) {
        this.start();
    }

    @Watch("value", { deep: true })
    private onValueChanged(
        newval: IChartDemographicData[],
        oldval: IChartDemographicData[]
    ) {
        this.start();
    }

    errorMessage: string = "";
    mountChart: IDemographicMount = {
        genderAge: false,
        time: false,
        age: false,
        dwellTime: false,
        gender: false
    };
    chartMode: EChartMode = EChartMode.none;

    chartOptionsGenderAge: any = {};

    chartOptionsGenderTime: any = {
        chart: { type: "column", zoomType: "x" },
        exporting: { enabled: false },
        title: { text: null },
        subtitle: { text: null },
        xAxis: {
            labels: { useHTML: true },
            categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ]
        },
        yAxis: {
            min: 0,
            labels: { style: { color: "#000" } },
            title: {
                text: "Rainfall (mm)"
            }
        },
        tooltip: {
            useHTML: true
        },
        series: [
            {
                name: "Male",
                data: [
                    49.9,
                    71.5,
                    106.4,
                    129.2,
                    144.0,
                    176.0,
                    135.6,
                    148.5,
                    216.4,
                    194.1,
                    95.6,
                    54.4
                ]
            },
            {
                name: "Female",
                data: [
                    83.6,
                    78.8,
                    98.5,
                    93.4,
                    106.0,
                    84.5,
                    105.0,
                    104.3,
                    91.2,
                    83.5,
                    106.6,
                    92.3
                ]
            }
        ]
    };

    chartOptionsAge: any = {};

    chartOptionsDwellTime: any = {
        chart: {
            type: "bar",
            zoomType: "x"
        },
        exporting: { enabled: false },
        title: { text: null },
        subtitle: { text: null },
        xAxis: {
            categories: ["Africa", "America", "Asia", "Europe", "Oceania"]
        },
        yAxis: {
            min: 0,
            title: {
                text: null,
                align: "high"
            }
        },
        credits: { enabled: false },
        series: [
            {
                name: "Male",
                data: [107, 31, 635, 203, 2]
            },
            {
                name: "Female",
                data: [133, 156, 947, 408, 6]
            }
        ]
    };

    chartOptionsGender: any = {
        chart: { zoomType: "x" },
        exporting: { enabled: false },
        title: { text: null },
        subtitle: { text: null },
        tooltip: { enabled: false },
        series: [
            {
                type: "pie",
                innerSize: "50%",
                data: [["Male", 58.9], ["Female", 13.29]]
            }
        ]
    };

    created() {
        this.start();
    }

    mounted() {}

    start() {
        this.mountChart = {
            genderAge: false,
            time: false,
            age: false,
            dwellTime: false,
            gender: false
        };

        // set same chart
        this.genderAgeChart();
        this.ageChart();

        this.chartMode = HighChartsService.chartMode(
            this.startDate,
            this.endDate,
            this.sites
        );
        if (isNaN(this.startDate.getTime())) {
            this.errorMessage = this._("w_ReportTraffic_ErrorDateStart");
            return false;
        }
        if (isNaN(this.endDate.getTime())) {
            this.errorMessage = this._("w_ReportTraffic_ErrorDateEnd");
            return false;
        }
        if (this.chartMode == EChartMode.none) {
            this.errorMessage = this._("w_ReportTraffic_ErrorChartMode");
            return false;
        }
        switch (this.chartMode) {
            case EChartMode.day1Site1:
                this.initDay1Site1();
                break;
            case EChartMode.day1SiteX:
                this.initDay1SiteX();
                break;
            case EChartMode.dayXSite1:
                this.initDayXSite1();
                break;
            case EChartMode.dayXSiteX:
                this.initDayXSiteX();
                break;
            default:
                break;
        }

        console.log(this.value);
    }

    ////////////////////////// day 1 site 1 //////////////////////////

    initDay1Site1() {
        let tempValues: IChartDemographicData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let categories = ["<20", "21-30", "31-40", "41-50", "51-60", ">61"];
        let tempHourStrings: string[] = [];
        let tempCategories: string[] = [];
        let tempResult: IChartTrafficData[] = [];
        let tempTotalCount: number = 0;

        this.mountChart.time = true;
    }

    ////////////////////////// day 1 site X //////////////////////////

    initDay1SiteX() {
        this.mountChart.time = true;
    }

    ////////////////////////// day X site 1 //////////////////////////

    initDayXSite1() {
        this.mountChart.time = true;
    }

    ////////////////////////// day X site X //////////////////////////

    initDayXSiteX() {
        this.mountChart.time = true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    genderAgeChart() {
        let tempValues: IChartDemographicData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let categories = ["<20", "21-30", "31-40", "41-50", "51-60", ">61"];
        let tempTotalCount: number = 0;
        let series: any = [
            {
                name: this._("w_ReportDemographic_GenderMale"),
                countData: [],
                data: []
            },
            {
                name: this._("w_ReportDemographic_GenderFemale"),
                countData: [],
                data: []
            }
        ];

        for (let value of tempValues) {
            let tempAgeIndex = -1;
            switch (value.ageRange) {
                case EAgeRange.low20:
                    tempAgeIndex = 0;
                    break;
                case EAgeRange.m21_30:
                    tempAgeIndex = 1;
                    break;
                case EAgeRange.m31_40:
                    tempAgeIndex = 2;
                    break;
                case EAgeRange.m41_50:
                    tempAgeIndex = 3;
                    break;
                case EAgeRange.m51_60:
                    tempAgeIndex = 4;
                    break;
                case EAgeRange.upp61:
                    tempAgeIndex = 5;
                    break;
                case EAgeRange.none:
                default:
                    break;
            }
            if (tempAgeIndex > -1) {
                if (series[0].countData[tempAgeIndex] == undefined) {
                    series[0].countData[tempAgeIndex] = 0;
                }
                if (series[1].countData[tempAgeIndex] == undefined) {
                    series[1].countData[tempAgeIndex] = 0;
                }
                tempTotalCount += value.maleCount;
                tempTotalCount += value.femaleCount;
                series[0].countData[tempAgeIndex] += value.maleCount;
                series[1].countData[tempAgeIndex] += value.femaleCount;
            }

            for (let i in series) {
                let iNumber = parseInt(i);
                for (let j in series[i].countData) {
                    let jNumber = parseInt(j);
                    if (series[i].data[j] == undefined) {
                        series[i].data[j] = 0;
                    }
                    if (tempTotalCount > 0) {
                        series[i].data[j] =
                            (series[i].countData[j] / tempTotalCount) * 100;
                    }
                }
            }
        }

        // set chart options
        this.chartOptionsGenderAge = {
            chart: { type: "column", zoomType: "x" },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            xAxis: {
                labels: { useHTML: true },
                categories: categories
            },
            yAxis: {
                min: 0,
                labels: {
                    style: { color: "#000" },
                    formatter: function() {
                        let self: any = this;
                        return self.value + "%";
                    }
                },
                title: { text: null }
            },
            tooltip: {
                useHTML: true,
                enabled: false
            },
            series: series
        };

        this.mountChart.genderAge = true;
    }

    ageChart() {
        let tempValues: IChartDemographicData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let categories = ["<20", "21-30", "31-40", "41-50", "51-60", ">61"];
        let tempTotalCount: number = 0;
        let series: any = [
            {
                type: "pie",
                name: "Browser share",
                innerSize: "50%",
                data: [
                    ["<20", 58.9],
                    ["21-30", 13.29],
                    ["31-40", 13],
                    ["41-50", 3.78],
                    ["51-60", 3.42],
                    [">61", 3.42]
                ]
            }
        ];

        // for (let value of tempValues) {
        //     let tempAgeIndex = -1;
        //     switch (value.ageRange) {
        //         case EAgeRange.low20:
        //             tempAgeIndex = 0;
        //             break;
        //         case EAgeRange.m21_30:
        //             tempAgeIndex = 1;
        //             break;
        //         case EAgeRange.m31_40:
        //             tempAgeIndex = 2;
        //             break;
        //         case EAgeRange.m41_50:
        //             tempAgeIndex = 3;
        //             break;
        //         case EAgeRange.m51_60:
        //             tempAgeIndex = 4;
        //             break;
        //         case EAgeRange.upp61:
        //             tempAgeIndex = 5;
        //             break;
        //         case EAgeRange.none:
        //         default:
        //             break;
        //     }
        //     if (tempAgeIndex > -1) {
        //         if (series[0].countData[tempAgeIndex] == undefined) {
        //             series[0].countData[tempAgeIndex] = 0;
        //         }
        //         if (series[1].countData[tempAgeIndex] == undefined) {
        //             series[1].countData[tempAgeIndex] = 0;
        //         }
        //         tempTotalCount += value.maleCount;
        //         tempTotalCount += value.femaleCount;
        //         series[0].countData[tempAgeIndex] += value.maleCount;
        //         series[1].countData[tempAgeIndex] += value.femaleCount;
        //     }

        //     for (let i in series) {
        //         let iNumber = parseInt(i);
        //         for (let j in series[i].countData) {
        //             let jNumber = parseInt(j);
        //             if (series[i].data[j] == undefined) {
        //                 series[i].data[j] = 0;
        //             }
        //             if (tempTotalCount > 0) {
        //                 series[i].data[j] =
        //                     (series[i].countData[j] / tempTotalCount) * 100;
        //             }
        //         }
        //     }
        // }

        // set chart options
        this.chartOptionsAge = {
            chart: { zoomType: "x" },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: "pointer",
                    dataLabels: {
                        enabled: true
                    },
                    showInLegend: true,
                    center: ["50%", "50%"],
                    size: "100%"
                }
            },
            tooltip: { enabled: false },
            series: series
        };

        this.mountChart.age = true;
    }
}

export default HighchartsDemographic;
Vue.component("highcharts-demographic", HighchartsDemographic);
</script>

<style lang="scss" scoped>
</style>

