<template>
    <div class="animated fadeIn">

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";

@Component({
    components: {}
})
export class PeakTimeRange extends Vue {
    // Prop

    @Prop({
        type: Object,
        default: ""
    })
    timeRangeData: object;

    created() {}

    mounted() {}
}

export default PeakTimeRange;
Vue.component("peak-tiem-range", PeakTimeRange);
</script>

<style lang="scss" scoped>
</style>
