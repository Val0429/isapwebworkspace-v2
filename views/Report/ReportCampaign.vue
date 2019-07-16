<template>
    <div class="animated fadeIn">

        <!-- Tina -->
        <filter-condition-campaign
            :yearSelectItem="yearSelectItem"
            :campaignSelectItem="campaignSelectItem"
            :campaignSiteSelectItem="campaignSiteSelectItem"
        >
        </filter-condition-campaign>

        <div v-show="pageStep === ePageStep.none">
            Campaign
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Dialog from "@/services/Dialog";

enum EPageStep {
    none = "none"
}

@Component({
    components: {}
})
export default class ReportCampaign extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    yearSelectItem: any = {};
    campaignSelectItem: any = {};
    campaignSiteSelectItem: any = {};

    inputFormData: any = {
        date: '',
        campaignIds: [],
        siteIds: [],
    };

    ////////////////////////////////////// Tina End //////////////////////////////////////

    created() {
        this.initData();
    }

    mounted() {}

    async initData() {
        this.initSelectYear();
        await this.initSelectCampaign();
        await this.initSelectCampaignStore();
    }

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    initSelectYear() {
        // this.yearSelectItem = {
        //     "2019": "2019",
        //     "2020": "2020",
        // }
    }

    async initSelectCampaign() {
        // this.campaignSelectItem = {
        //     MMsKioPy3X: "聖誕節",
        //     k6H0cOOLXe: "母親節",
        // }
    }

    async initSelectCampaignStore() {}

    ////////////////////////////////////// Tina End //////////////////////////////////////
}
</script>


<style lang="scss" scoped>
</style>




