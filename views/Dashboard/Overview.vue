<template>
    <div class="animated fadeIn">

        <div class="row">
            <current-status-dashboard class="col-md-3" />
            <filter-status-dashboard class="col-md-9" />

            <b-row class="col-md-12" >
                <b-col>
                    <peak-hour class="col-md-12" />

                </b-col>
                <b-col>
                    <top-5sites class="col-md-12" />
                    <bottom-5sites class="col-md-12" />
                </b-col>

            </b-row>

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




