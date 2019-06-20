<template>
    <div class="animated fadeIn">

        <div v-show="pageStep === ePageStep.none">

            <iv-card>
                 <!-- Morris -->
                <chart-bar-line
                    label="Test Label"
                    @input="test"
                >
                </chart-bar-line>

            </iv-card>
           
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

    test(data: any) {}
}
</script>


<style lang="scss" scoped>
</style>




