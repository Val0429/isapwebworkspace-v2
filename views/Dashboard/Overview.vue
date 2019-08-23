<template>
    <div class="animated fadeIn">

        <div class="row">

            <current-status-dashboard class="col-md-4" />

            <filter-status-dashboard class="col-md-8" />

            <top-5sites class="col-md-6" />

            <bottom-5sites class="col-md-6" />

            <peak-hour class="col-md-12" />

            <area-status-by-floor-plan class="col-md-12" />

        </div>

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




