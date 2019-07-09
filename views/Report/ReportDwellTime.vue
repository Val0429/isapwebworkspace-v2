<template>
    <div class="animated fadeIn">
        <div v-show="pageStep === ePageStep.none">
            DwellTime
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
export default class ReportDwellTime extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;

    created() {}

    mounted() {}
}
</script>


<style lang="scss" scoped>
</style>




