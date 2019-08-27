<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :label="'Empty 1'"
            >
                Empty 1
            </iv-card>

            <iv-card
                key="transition_2"
                v-show="transition.step === 2"
                :label="'Empty 2'"
            >
                Empty 2
            </iv-card>

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
export default class Empty extends Vue {
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




