<template>
    <div class="chart">
        {{ label }}
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

@Component({
    components: {}
})
export class ChartBarLine extends Vue {
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
                categories: []
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
        tooltip: { shared: false },
        legend: {
            layout: "vertical",
            align: "left",
            x: 120,
            verticalAlign: "top",
            y: 100,
            floating: true,
            backgroundColor: "rgba(255,255,255,0.25)"
        },
        series: [
            {
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
                ]
            },
            {
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
            }
        ]
    };

    created() {}

    mounted() {
        this.start();
    }

    start() {
        this.chartOptions.xAxis[0].categories = [
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
        ];

        this.chartOptions.yAxis[0].title.text = "Traffic";
        this.chartOptions.yAxis[1].title.text = "Revenue";
        // this.$emit("input", this.inputData);
    }
}

export default ChartBarLine;
Vue.component("chart-bar-line", ChartBarLine);
</script>

<style lang="scss" scoped>
</style>
