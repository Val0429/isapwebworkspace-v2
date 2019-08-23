<template>
    <div>
        <iv-card :label="_('w_ReportDashboard_Traffic')">
            <template #toolbox>
                <iv-toolbox-delete @click="removeCard()" />
            </template>

        </iv-card>
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

import VueApexCharts from "vue-apexcharts";
Vue.component("apexchart", VueApexCharts);

import HighchartsService from "@/components/Reports/models/HighchartsService";
import ResponseFilter from "@/services/ResponseFilter";

import {
    ReportDashboard,
    EPageType,
    ESign,
    ETimeMode
} from "@/components/Reports";

@Component({
    components: {}
})
export class AreaStatusByFloorPlanDetail extends Vue {
    @Prop({
        type: Number,
        default: () => {
            return 0;
        }
    })
    datum: number;

    created() {}

    mounted() {}

    removeCard() {
        console.log("devail", this.datum);
        this.$emit("removeCard", this.datum);
    }
}

export default AreaStatusByFloorPlanDetail;
Vue.component("area-status-by-floor-plan-detail", AreaStatusByFloorPlanDetail);
</script>

<style lang="scss" scoped>
</style>
