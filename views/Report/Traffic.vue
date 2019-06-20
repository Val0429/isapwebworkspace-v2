<template>
    <div class="animated fadeIn">

        <div v-show="pageStep === ePageStep.none">

            <!-- Morris -->
            <chart-bar-line label="Test Label">
            </chart-bar-line>

        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Dialog from "@/services/Dialog/Dialog";

// Morris
import ChartBarLine from "@/components/HighCharts/BarLine.vue";

enum EPageStep {
    none = "none"
}

@Component({
    components: {
        ChartBarLine
    }
})
export default class Traffic extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;

    created() {}

    mounted() {}
}
</script>


<style lang="scss" scoped>
</style>




