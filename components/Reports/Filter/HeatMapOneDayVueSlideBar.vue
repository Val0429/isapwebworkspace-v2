<template>
    <div>
        <VueSlideBar
            v-model="slider.value"
            :data="slider.data"
            :range="slider.range"
            :labelStyles="{ color: '#4a4a4a', backgroundColor: '#4a4a4a' }"
            :processStyle="{ backgroundColor: '#d8d8d8' }"
            class="mb-4"
            @callbackRange="callbackRange">
            <template slot="tooltip" slot-scope="tooltip">
                <img src="../images/rectangle-slider.svg">
            </template>
        </VueSlideBar>
<!--        <h2>Value: {{slider.value}}</h2>-->
<!--        <h2>Label: {{rangeValue}}</h2>-->
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import Datetime from "@/services/Datetime";
import VueSlideBar from 'vue-slide-bar'

@Component({
    components: {
        VueSlideBar
    }
})
export class HeatMapOneDayVueSlideBar extends Vue {
    // Prop
    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: {}
    })
    slider: object;

    rangeValue:string = '';

    created() {
    }

    mounted() {
        this.start();
    }

    start() {
    }

    callbackRange (val) {
        this.rangeValue = val.label.substring(0, 2);
        this.$emit('hour', this.rangeValue);
    }
}

export default HeatMapOneDayVueSlideBar;
Vue.component("heat-map-one-day-slider-bar", HeatMapOneDayVueSlideBar);
</script>

<style lang="scss" scoped>
</style>
