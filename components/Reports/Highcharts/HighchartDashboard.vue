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

interface ISeries {
    name: string;
    data: number[];
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
            return null;
        }
    })
    startTime: Date;

    @Prop({
        type: Date,
        default: function() {
            return null;
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
        type: Array,
        default: function() {
            return [];
        }
    })
    chartData: ISeries;

    @Prop({
        type: String,
        default: function() {
            return "";
        }
    })
    chartTitle: string;

    @Watch("startTime", { deep: true })
    private onstartTimeChanged() {
        this.start();
    }

    @Watch("endTime", { deep: true })
    private onendTimeChanged() {
        this.start();
    }

    oneHour = 1 * 60 * 60 * 1000;
    chartOptions = {};

    created() {}

    mounted() {
        this.start();
    }

    start() {
        switch (this.chartMode) {
            case EChartMode.chartByHours:
                this.initChartByHours();
                break;
            case EChartMode.chartByDays:
                this.initChartByDays();
                break;
            default:
                break;
        }
    }

    initChartByHours() {
        let categories = [];

        let sDate = this.startTime;
        let eDate = this.endTime;
        while (sDate.getTime() < eDate.getTime()) {
            categories.push(
                (sDate.getHours() >= 10
                    ? sDate.getHours()
                    : "0" + sDate.getHours()) + ":00"
            );
            sDate = new Date(sDate.getTime() + this.oneHour);
        }

        this.chartOptions = {
            chart: {
                type: "column"
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            exporting: { enabled: false },
            legend: { enabled: null },
            title: {
                text: this.chartTitle,
                align: "left",
                style: { color: "#ababab", fontSize: "42px" }
            },

            xAxis: {
                categories: categories
            },
            series: this.chartData
        };
    }

    initChartByDays() {
        let categories = [];

        let sDate = this.startTime;
        let eDate = this.endTime;
        while (sDate.getTime() <= eDate.getTime()) {
            categories.push(Datetime.DateTime2String(sDate, "YYYY-MM-DD"));
            sDate = new Date(sDate.getTime() + this.oneHour * 24);
        }

        this.chartOptions = {
            chart: {
                type: "column"
            },
            exporting: { enabled: false },
            legend: { enabled: null },
            title: {
                text: this.chartTitle,
                align: "left",
                style: { color: "#ababab", fontSize: "42px" }
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            xAxis: {
                categories: categories
            },
            series: this.chartData
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
