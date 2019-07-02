<template>
    <div class="chart">
        <div>
            <highcharts
                ref="chartGenderAge"
                v-if="mountChart"
                :options="chartOptionsGenderAge"
            ></highcharts>
        </div>
        <div>
            <highcharts
                ref="chartGenderTime"
                v-if="mountChart"
                :options="chartOptionsGenderTime"
            ></highcharts>
        </div>
        <div>
            <highcharts
                ref="chartAge"
                v-if="mountChart"
                :options="chartOptionsAge"
            ></highcharts>
        </div>
        <div>
            <highcharts
                ref="chartDwellTime"
                v-if="mountChart"
                :options="chartOptionsDwellTime"
            ></highcharts>
            <highcharts
                ref="chartGender"
                v-if="mountChart"
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
    EWeather
} from "./models/EHighCharts";
import {
    IDate,
    IDatetimeGroup,
    ISite,
    IChartTrafficData
} from "./models/IHighCharts";
import Datetime from "@/services/Datetime";
import HighChartsService from "./models/HighChartsService";
import Weather from "../../views/Setting/Weather.vue";

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
    value: IChartTrafficData[];

    errorMessage: string = "";
    mountChart: boolean = false;
    chartMode: EChartMode = EChartMode.none;

    chartOptionsGenderAge: any = {
        chart: { type: "column", zoomType: "x" },
        exporting: { enabled: false },
        title: { text: " " },
        subtitle: { text: " " },
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

    chartOptionsAge: any = {
        chart: { zoomType: "x" },
        exporting: { enabled: false },
       title: { text: null },
        subtitle: { text: null },
        tooltip: { enabled: false },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    // distance: -50,
                    style: {
                        fontWeight: "bold",
                        color: "white"
                    }
                },
                startAngle: 0,
                endAngle: 360,
                center: ["50%", "50%"],
                size: "100%"
            }
        },
        series: [
            {
                type: "pie",
                name: "Browser share",
                innerSize: "50%",
                data: [
                    ["Chrome", 58.9],
                    ["Firefox", 13.29],
                    ["Internet Explorer", 13],
                    ["Edge", 3.78],
                    ["Safari", 3.42],
                    {
                        name: "Other",
                        y: 7.61,
                        dataLabels: {
                            enabled: false
                        }
                    }
                ]
            }
        ]
    };

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
                text: " ",
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
        this.mountChart = true;
    }

    mounted() {}
}

export default HighchartsDemographic;
Vue.component("highcharts-demographic", HighchartsDemographic);
</script>

<style lang="scss" scoped>
</style>

