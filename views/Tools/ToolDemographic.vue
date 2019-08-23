<template>
    <div class="animated fadeIn">


        <iv-card
            :visible="visible"
            :label="_('w_Tool_FilterData')"
        >
        </iv-card>

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
export default class ToolDemographic extends Vue {
    // 收合card控制
    visible: boolean = false;

    created() {}

    mounted() {}
}
</script>

<style lang="scss" scoped>
</style>




