<template>
    <div class="chart">
        <b-form-group>
            <highcharts
                ref="chartMultipe"
                v-if="mountChart.campaignSingle"
                :options="chartOptions.campaignSingle"
            ></highcharts>
        </b-form-group>
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
import Datetime from "@/services/Datetime";
import HighchartsService from "./models/HighchartsService";

@Component({
    components: {}
})
export class HighchartsCampaignSingle extends Vue {
    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    value: string[];

    mountChart: {
        campaignSingle: boolean;
    } = {
        campaignSingle: false
    };
    chartOptions: {
        campaignSingle: object;
    } = {
        campaignSingle: {}
    };

    @Watch("value", { deep: true })
    private onValueChanged(newval: any[], oldval: any[]) {
        this.start();
    }

    created() {
        this.start();
    }

    mounted() {}

    start() {}

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    private anysislyChartValueDefault(): any {
        let value: any = {
            date: new Date()
        };
        return value;
    }

    private anysislyChartValue(item: any): any {
        let value = JSON.parse(JSON.stringify(item));
        value.date = new Date(value.date);
        return value;
    }

    private i18nItem() {
        let result: any = {
            time: this._("w_Report_Time"),
            date: this._("w_Report_Date"),
            startDate: this._("w_Report_StartDate"),
            endDate: this._("w_Report_EndDate")
        };
        return result;
    }
}

export default HighchartsCampaignSingle;
Vue.component("highcharts-campaign-single", HighchartsCampaignSingle);
</script>

<style lang="scss" scoped>
</style>
