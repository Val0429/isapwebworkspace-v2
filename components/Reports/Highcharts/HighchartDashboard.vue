<template>
    <div class="chart">
        <highcharts
            ref="chartByHours"
            :options="chartOptions"
        ></highcharts>
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
import { Chart } from "highcharts-vue";
import Highcharts from "highcharts";
import HighchartsVue from "highcharts-vue";
import exportingInit from "highcharts/modules/exporting";
import stockInit from "highcharts/modules/stock";
stockInit(Highcharts);
exportingInit(Highcharts);
Vue.use(HighchartsVue);
import Datetime from "@/services/Datetime";

enum EChartMode {
    chartByHours,
    chartByDays
}

@Component({
    components: {
        highcharts: Chart
    }
})
export class HighchartDashboard extends Vue {
    // Prop
    @Prop({
        type: Date,
        default: function() {
            return new Date();
        }
    })
    startTime: Date;

    @Prop({
        type: Date,
        default: function() {
            return new Date();
        }
    })
    endTime: Date;

    @Prop({
        type: Number,
        default: function() {
            return null;
        }
    })
    chartMode: EChartMode;

    @Prop({
        type: Object,
        default: function() {
            return {};
        }
    })
    chartData: object;

    // @Watch("value", { deep: true })
    // private onValueChanged(
    //     newval: IChartTrafficData[],
    //     oldval: IChartTrafficData[]
    // ) {
    //     this.start();
    // }

    chartOptions = {};

    created() {}

    mounted() {
        this.start();
    }

    start() {
        switch (this.chartMode) {
            case EChartMode.chartByHours:
                this.initChartByHourss();
                break;
            case EChartMode.chartByDays:
                this.initChartByDays();
                break;
            default:
                break;
        }
    }

    initChartByHourss() {
        console.log("initChartByHourss");
        this.chartOptions = {
            chart: {
                type: "column"
            },
            title: {
                text: "Monthly Average Rainfall"
            },
            subtitle: {
                text: "Source: WorldClimate.com"
            },
            xAxis: {
                categories: [
                    "00:00",
                    "01:00",
                    "02:00",
                    "03:00",
                    "04:00",
                    "05:00",
                    "06:00",
                    "07:00",

                    "08:00",
                    "09:00",
                    "10:00",
                    "11:00",
                    "12:00",
                    "13:00",
                    "14:00",
                    "15:00",
                    "16:00",
                    "17:00",
                    "18:00",
                    "19:00",
                    "20:00",
                    "21:00",
                    "22:00",
                    "23:00"
                ],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Rainfall (mm)"
                }
            },
            tooltip: {
                headerFormat:
                    '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                    '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: "</table>",
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [
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
            ]
        };
    }

    initChartByDays() {
        console.log("initChartByDays");
        this.chartOptions = {
            chart: {
                type: "column"
            },
            title: {
                text: "Monthly Average Rainfall"
            },
            subtitle: {
                text: "Source: WorldClimate.com"
            },
            xAxis: {
                categories: ["2018-09-17", "2018-09-18"],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Rainfall (mm)"
                }
            },
            tooltip: {
                headerFormat:
                    '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:
                    '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: "</table>",
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [
                {
                    name: "Visitor",
                    data: [42.4, 99.1]
                },
                {
                    name: "Unregistered",
                    data: [0, 0]
                }
            ]
        };
    }
}

export default HighchartDashboard;
Vue.component("highchart-dashboard", HighchartDashboard);
</script>

<style lang="scss" scoped>
.chart {
    padding-top: 30px;
    padding-bottom: 30px;
}
</style>
