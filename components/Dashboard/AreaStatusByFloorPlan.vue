<template>
    <div>
        <iv-card :label="_('w_DashboardOverview_AreaStatusByFloorPlan')">
            <template #toolbox>
                <iv-toolbox-add @click="addNewCard" />
            </template>
            <div class="row">
                <template v-for="(value, index) in data">
                    <area-status-by-floor-plan-detail
                        :datum="value"
                        :isDelete="data.length <= 1"
                        @removeCard="removeCard"
                        class="col-md-6"
                    />
                </template>
            </div>

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
    data = [1];

    created() {}

    mounted() {}

    addNewCard() {
        this.data.push(this.data[this.data.length - 1] + 1);
    }

    removeCard(datum) {
        console.log("removeCard", datum);
        this.data = this.data.filter(d => d != datum);
    }
}

export default AreaStatusByFloorPlan;
Vue.component("area-status-by-floor-plan", AreaStatusByFloorPlan);
</script>

<style lang="scss" scoped>
</style>
