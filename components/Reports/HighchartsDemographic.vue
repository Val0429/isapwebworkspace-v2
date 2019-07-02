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
            <b-select></b-select>
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
    chartOptionsGenderAge: any = {};
    chartOptionsGenderTime: any = {};
    chartOptionsAge: any = {};
    chartOptionsDwellTime: any = {};
    chartOptionsGender: any = {};
}

export default HighchartsDemographic;
Vue.component("highcharts-demographic", HighchartsDemographic);
</script>

<style lang="scss" scoped>
</style>

