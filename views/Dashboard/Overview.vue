<template>
    <div class="animated fadeIn">

        <select-permission-site></select-permission-site>

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

                <current-status-dashboard class="col-md-4"></current-status-dashboard>

                <filter-status-dashboard class="col-md-8"></filter-status-dashboard>

                <top-5sites class="col-md-6"></top-5sites>

                <bottom-5sites class="col-md-6"></bottom-5sites>

                <peak-hour class="col-md-12"></peak-hour>

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




