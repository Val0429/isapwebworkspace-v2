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
                class="row"
            >
                <iv-card
                    class="current-status-card"
                    :label="_('w_DashboardOverview_CurrentStatus')"
                >
                    <current-status-dashboard></current-status-dashboard>
                </iv-card>
                <iv-card
                    class="filter-status-card"
                    :label="_('w_DashboardOverview_FilterStatus')"
                >
                    <current-status-dashboard></current-status-dashboard>
                </iv-card>
            </div>

            <div
                key="transition_2"
                v-show="transition.step === 2"
                :label="'Empty 2'"
            >
                Empty 2
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
export default class Overview extends Vue {
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
.current-status-card {
    width: 23%;
    margin: 1%;
}
.filter-status-card {
    width: 73%;
    margin: 1%;
}
</style>




