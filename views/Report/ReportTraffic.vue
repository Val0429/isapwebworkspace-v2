<template>
    <div class="animated fadeIn">

        <div v-show="pageStep === ePageStep.none">

            <iv-card>
                <!-- Morris -->
                <traffic-chart
                    :chartTimeMode="chartTimeMode"
                    :value="value"
                >
                </traffic-chart>

            </iv-card>

        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Dialog from "@/services/Dialog/Dialog";

// Morris
import TrafficChart from "@/components/HighCharts/TrafficChart.vue";
import { EChartTimeMode, ITrafficData } from "@/components/HighCharts/models";

enum EPageStep {
    none = "none"
}

@Component({
    components: {
        TrafficChart
    }
})
export default class ReportTraffic extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;

    chartTimeMode = EChartTimeMode.hour;
    value: ITrafficData[] = [];

    created() {}

    mounted() {}

    initChart() {
        for (let i = 0; i < 30; i++) {
            let iNumber = i;
            let iString = i.toString();
            let trafficChartData = {
                datetime: new Date(),
                siteId: "SiteId_" + iString,
                siteName: "Site " + iString,
                temperature: iNumber,
                traffic: iNumber + 100,
                revenue: iNumber * 1000,
                transaction: iNumber,
                conversion: iNumber / 1000
            };
            this.value.push(trafficChartData);
        }
    }
}
</script>


<style lang="scss" scoped>
</style>




