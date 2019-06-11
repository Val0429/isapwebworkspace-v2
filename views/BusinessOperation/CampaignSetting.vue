<template>
    <div class="animated fadeIn">
        CampaignSetting

    </div>
</template>

<script lang="ts">
    import { Vue, Component, Watch } from "vue-property-decorator";
    import { toEnumInterface } from "../../../core";

    import ResponseFilter from "@/services/ResponseFilter";
    import Dialog from "@/services/Dialog.vue";

enum EPageStep {
    list = "list",
    add = "add",
    edit = "edit",
    view = "view",
    none = "none",
}

@Component({
    components: {}
})
export default class CampaignSetting extends Vue {

    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.list;



    created() {

    }

    mounted() {

    }

    clearInputData() {

    }

}
</script>
