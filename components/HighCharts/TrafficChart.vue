<template>
    <div class="chart">
        <highcharts :options="chartOptions"></highcharts>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";

/// install Highcharts
import Highcharts from "highcharts";
import HighchartsVue from "highcharts-vue";
import exportingInit from "highcharts/modules/exporting";
exportingInit(Highcharts);
Vue.use(HighchartsVue);

import WeatherIconBase64 from "./models/WeatherIconBase64";

@Component({
    components: {}
})
export class TrafficChart extends Vue {
    // Prop
    @Prop({
        type: String,
        default: ""
    })
    label: string;

    chartOptions: any = {
        chart: { zoomType: "xy" },
        exporting: { enabled: false },
        title: { text: " " },
        subtitle: { text: " " },
        xAxis: [
            {
                crosshair: true,
                categories: [],
                labels: {
                    useHTML: true
                }
            }
        ],
        yAxis: [
            {
                // Primary yAxis
                labels: {
                    style: { color: "#000" }
                },
                title: {
                    text: "",
                    style: { color: "#000" }
                }
            },
            {
                // Secondary yAxis
                labels: {
                    style: { color: "#000" }
                },
                title: {
                    text: "",
                    style: { color: "#000" }
                },
                opposite: true
            }
        ],
        tooltip: {
            enabled: true,
            shared: true,
            backgroundColor: "#333",
            style: {
                color: "#fff"
            },
            formatter: function(tooltip: any) {
                let self: any = this;
                let result = "";
                if (self.x != undefined) {
                    try {
                        let startIndex = self.x.indexOf(">{");
                        let endIndex = self.x.indexOf("}<");
                        let valueJson = self.x.substring(
                            startIndex + 1,
                            endIndex + 1
                        );
                        let newValue: any = JSON.parse(valueJson);
                        result += `test1: ${newValue.test1}<br>`;
                        result += `test2: ${newValue.test2}<br>`;
                        result += `test3: ${newValue.test3}<br>`;
                        result += `test4: ${newValue.test4}`;
                    } catch (e) {
                        console.log(e);
                    }
                }
                return result;
            }
        },
        series: []
    };

    viewPage = this;

    value: any = [
        {
            label: "Jan",
            data: {
                test1: "2341324",
                test2: "f324g3g",
                test3: "t3g35bw354hb",
                test4: "dgfadsggs"
            }
        },
        {
            label: "Feb",
            data: {
                test1: "2341324",
                test2: "f324g3g",
                test3: "t3g35bw354hb",
                test4: "dgfadsggs"
            }
        },
        {
            label: "Mar",
            data: {
                test1: "2341324",
                test2: "f324g3g",
                test3: "t3g35bw354hb",
                test4: "dgfadsggs"
            }
        },
        {
            label: "Apr",
            data: {
                test1: "2341324",
                test2: "f324g3g",
                test3: "t3g35bw354hb",
                test4: "dgfadsggs"
            }
        },
        {
            label: "May",
            data: {
                test1: "2341324",
                test2: "f324g3g",
                test3: "t3g35bw354hb",
                test4: "dgfadsggs"
            }
        },
        {
            label: "Jun",
            data: {
                test1: "2341324",
                test2: "f324g3g",
                test3: "t3g35bw354hb",
                test4: "dgfadsggs"
            }
        },
        {
            label: "Jul",
            data: {
                test1: "2341324",
                test2: "f324g3g",
                test3: "t3g35bw354hb",
                test4: "dgfadsggs"
            }
        },
        {
            label: "Aug",
            data: {
                test1: "2341324",
                test2: "f324g3g",
                test3: "t3g35bw354hb",
                test4: "dgfadsggs"
            }
        },
        {
            label: "Sep",
            data: {
                test1: "2341324",
                test2: "f324g3g",
                test3: "t3g35bw354hb",
                test4: "dgfadsggs"
            }
        },
        {
            label: "Oct",
            data: {
                test1: "2341324",
                test2: "f324g3g",
                test3: "t3g35bw354hb",
                test4: "dgfadsggs"
            }
        },
        {
            label: "Nov",
            data: {
                test1: "2341324",
                test2: "f324g3g",
                test3: "t3g35bw354hb",
                test4: "dgfadsggs"
            }
        },
        {
            label: "Dec",
            data: {
                test1: "2341324",
                test2: "f324g3g",
                test3: "t3g35bw354hb",
                test4: "dgfadsggs"
            }
        }
    ];

    created() {}

    mounted() {
        this.start();
    }

    start() {
        this.chartOptions.yAxis[0].title.text = "Traffic";
        this.chartOptions.yAxis[1].title.text = "Revenue";

        this.chartOptions.xAxis[0].categories = [];
        for (let val of this.value) {
            this.chartOptions.xAxis[0].categories.push(
                `<span style='display:none;'>${JSON.stringify(
                    val.data
                )}</span>${
                    val.label
                }&nbsp;<span class='wi wi-night-sleet' style='font-size:1.2rem;color:#f00;'></span>`
            );
        }

        this.chartOptions.series[0] = {
            name: "Rainfall",
            type: "column",
            yAxis: 1,
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
            ],
            custom: [1, 2, 3]
        };

        this.chartOptions.series[1] = {
            name: "Temperature",
            type: "spline",
            data: [
                7.0,
                6.9,
                9.5,
                14.5,
                18.2,
                21.5,
                25.2,
                26.5,
                23.3,
                18.3,
                13.9,
                9.6
            ]
        };
    }
}

export default TrafficChart;
Vue.component("traffic-chart", TrafficChart);
</script>

<style lang="scss" scoped>
</style>
