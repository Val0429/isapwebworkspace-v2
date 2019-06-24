<template>
    <div class="animated fadeIn">

        <div v-show="pageStep === ePageStep.none">

            <iv-card>
                <!-- Morris -->
                <traffic-chart
                    label="Test Label"
                    @input="test"
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

    created() {}

    mounted() {}

    test(data: any) {}
}
</script>


<style lang="scss" scoped>
</style>




