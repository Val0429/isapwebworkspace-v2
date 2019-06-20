<template>
    <div class="animated fadeIn">
        <div v-show="pageStep === ePageStep.none">
            RepeatVisitor
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Dialog from "@/services/Dialog/Dialog";

enum EPageStep {
    none = "none"
}

@Component({
    components: {}
})
export default class RepeatVisitor extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;

    created() {}

    mounted() {}
}
</script>


<style lang="scss" scoped>
</style>




