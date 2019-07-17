<template>
    <div class="animated fadeIn">
        <div>

            <!-- Morris -->
            <highcharts-campaign-multipe
                v-if="chartMode.multiple"
                :value="chartDatas.multiple"
            >
            </highcharts-campaign-multipe>

            <highcharts-campaign-single
                v-if="chartMode.single"
                :value="chartDatas.single"
            >
            </highcharts-campaign-single>
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Dialog from "@/services/Dialog";
import HighchartsCampaignMultipe from "@/components/Reports/HighchartsCampaignMultipe.vue";
import HighchartsCampaignSingle from "@/components/Reports/HighchartsCampaignSingle.vue";
import HighchartsService from "@/components/Reports/models/HighchartsService";

import {
    IChartCampaignMultipe,
    IChartCampaignSingle
} from "@/components/Reports";

@Component({
    components: {
        HighchartsCampaignMultipe,
        HighchartsCampaignSingle
    }
})
export default class ReportCampaign extends Vue {
    chartMode: {
        multiple: boolean;
        single: boolean;
    } = {
        multiple: false,
        single: false
    };
    chartDatas: {
        multiple: IChartCampaignMultipe[];
        single: IChartCampaignSingle[];
    } = {
        multiple: [],
        single: []
    };

    created() {
        this.initChartDeveloper();
    }

    mounted() {}

    /////////////////////////////////////////////////////////////////////

    // Author: Morris, Product remove
    initChartDeveloper() {
        this.chartDatas.multiple = [];
        this.chartDatas.single = [];

        for (let i = 0; i < 10; i++) {
            let tempItem: IChartCampaignMultipe = {
                name: "Campaign " + i.toString(),
                startDate: new Date(),
                endDate: new Date(),
                traffic: Math.floor(Math.random() * 300),
                budget: Math.floor(Math.random() * 1000)
            };
            this.chartDatas.multiple.push(tempItem);
        }

        this.chartMode.multiple = true;
        this.chartMode.single = true;
    }
}
</script>


<style lang="scss" scoped>
</style>




