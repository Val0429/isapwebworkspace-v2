<template>
    <div>
        <VueSlideBar
            v-model="slider.value"
            :data="slider.data"
            :range="slider.range"
            :labelStyles="{ color: '#4a4a4a', backgroundColor: '#4a4a4a' }"
            :processStyle="{ backgroundColor: '#d8d8d8' }"
            @callbackRange="callbackRange">
            <template slot="tooltip" slot-scope="tooltip">
<!--                <img src="static/images/rectangle-slider.svg">-->
            </template>
        </VueSlideBar>
        <h2>Value: {{slider.value}}</h2>
        <h2>Label: {{rangeValue.label}}</h2>
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
    // @Prop({
    //     type: Array, // Boolean, Number, String, Array, Object
    //     default: [0]
    // })
    // values: any;
    //
    // @Prop({
    //     type: Number, // Boolean, Number, String, Array, Object
    //     default: 0
    // })
    // min: number;
    //
    // @Prop({
    //     type: Number, // Boolean, Number, String, Array, Object
    //     default: 0
    // })
    // max: number;
    //
    // @Prop({
    //     type: Number, // Boolean, Number, String, Array, Object
    //     default: 1
    // })
    // step: number;
    //
    // @Prop({
    //     type: Boolean, // Boolean, Number, String, Array, Object
    //     default: null
    // })
    // labels: boolean;

    rangeValue:any = {};
    slider:any = {
        value: 45,
        data: [
            15,
            30,
            45,
            60,
            75,
            90,
            120
        ],
        range: [
            {
                label: '15 mins'
            },
            {
                label: '30 mins',
                isHide: true
            },
            {
                label: '45 mins'
            },
            {
                label: '1 hr',
                isHide: true
            },
            {
                label: '1 hr 15 mins'
            },
            {
                label: '1 hr 30 mins',
                isHide: true
            },
            {
                label: '2 hrs'
            }
        ]
    }

    created() {
    }

    mounted() {
        this.start();
    }

    start() {
    }

    callbackRange (val) {
        this.rangeValue = val
    }

    /////////////  computed  /////////////

}

export default HeatMapOneDayVueSlideBar;
Vue.component("heat-map-one-day-slider-bar", HeatMapOneDayVueSlideBar);
</script>

<style lang="scss" scoped>


</style>
