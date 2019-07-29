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
                Rule and Action Repeat Visitor 1
            </div>

            <div
                key="transition_2"
                v-show="transition.step === 2"
                :label="'Empty 2'"
            >
                Rule and Action Repeat Visitor 2
            </div>

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
export default class RuleAndActionsRepeatVisitor extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    created() {}

    mounted() {}
}
</script>

<style lang="scss" scoped>
</style>




