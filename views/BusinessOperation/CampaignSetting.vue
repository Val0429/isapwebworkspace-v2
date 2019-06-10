<template>
    <div class="animated fadeIn">
        CampaignSetting

    </div>
</template>

<script lang="ts">
    import { Vue, Component, Watch } from "vue-property-decorator";
    import { IConfig, IAnalysis } from '@/config/default/api/interfaces';
    import { toEnumInterface } from "../../../core";

    import ResponseFilter from "@/services/ResponseFilter";
    import Dialog from "@/services/Dialog.vue";



enum EPageStep {
    list,
    add,
    edit,
    none,
}

@Component({
    components: {
        iSAPFormCard,
        Card
    }
})
export default class CampaignSetting extends Vue {

    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.list;

    server = Server;


    created() {

    }

    mounted() {

    }

    clearInputData() {

    }

}
</script>
