<template>
    <div class="animated fadeIn">
        test
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
        default: function() {
            return {};
        }
    })
    timeRangeData: object;

    created() {}

    mounted() {}
}

export default PeakTimeRange;
Vue.component("peak-time-range", PeakTimeRange);
</script>

<style lang="scss" scoped>
</style>
