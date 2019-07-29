<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <div
                key="transition_1"
                v-show="transition.step === 1"
                :label="'Empty 1'"
            >
                Rule and Action Occupancy 1
            </div>

            <iv-step-progress
                ref="step"
                key="transition_2"
                v-show="transition.step === 2"
                @mounted="doMounted"
            >

                <template #1-title>{{ _('w_RuleAndActions_EditStep1') }}</template>
                <template #1>
                    Step 1
                </template>

                <template #2-title>{{ _('w_RuleAndActions_EditStep2') }}</template>
                <template #2>
                    Step 2
                </template>

                <template #3-title>{{ _('w_RuleAndActions_EditStep3') }}</template>
                <template #3>
                    Step 3
                </template>

            </iv-step-progress>

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";

@Component({
    components: {}
})
export default class RuleAndActionsOccupancy extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    isMounted: boolean = false;
    doMounted() {
        this.isMounted = true;
    }

    created() {}

    mounted() {}
}
</script>

<style lang="scss" scoped>
</style>




