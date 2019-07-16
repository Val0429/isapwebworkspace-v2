<template>
    <div class="animated fadeIn">

        <!-- Tina -->
        <filter-condition-campaign
            :yearSelectItem="yearSelectItem"
            :campaignSelectItem="campaignSelectItem"
            :campaignStoreSelectItem="campaignStoreSelectItem"
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
    campaignStoreSelectItem: any = {};

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

    initSelectYear() {}
    async initSelectCampaign() {}
    async initSelectCampaignStore() {}

    ////////////////////////////////////// Tina End //////////////////////////////////////
}
</script>


<style lang="scss" scoped>
</style>




