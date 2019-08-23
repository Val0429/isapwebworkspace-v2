<template>
    <div>
        <iv-card :label="_('w_DashboardOverview_AreaStatusByFloorPlan')">

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
export class AreaStatusByFloorPlan extends Vue {
    created() {}

    mounted() {}
}

export default AreaStatusByFloorPlan;
Vue.component("area-status-by-floor-plan", AreaStatusByFloorPlan);
</script>

<style lang="scss" scoped>
</style>
