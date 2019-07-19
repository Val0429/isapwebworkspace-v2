<template>
    <div>
        <div class="slider-pips">

            <input
                v-for="(value, index) in vals"
                v-model="clickValue"
                :key="'range' + index"
                :class="[ 'slider-pips__range--' + (index + 1) ]"
                :min="min"
                :max="max"
                :step="step"
                type="range"
                class="slider-pips__range"
                @change="updateValue( $event, index )"
                @input="updateValue( $event, index )"
            />

<!--                            v-model="value"
-->

<!--            <ul v-if="floats"-->
<!--                class="slider-pips__floats">-->
<!--                <li v-for="(value, index) in vals"-->
<!--                    class="slider-pips__float"-->
<!--                    :class="[ 'slider-pips__float&#45;&#45;' + (index + 1) ]"-->
<!--                    :style="{ 'left': floatPos(value) }">-->
<!--                    {{value}}-->
<!--                </li>-->
<!--            </ul>-->

<!--            <div v-if="isRange"-->
<!--                 class="slider-pips__range-holder">-->
<!--                <div class="slider-pips__range-selection"-->
<!--                     :style="{ width: rangeWidth, left: rangeLeft }"></div>-->
<!--            </div>-->

            <ul class="slider-pips__pips">

                <li class="slider-pips__pip"
                    :class="[{
              'slider-pips__pip--selected': isPipSelected( index ),
              'slider-pips__pip--in-range': isPipInRange( index )
              }, selectedPipClassName( index )
            ]"
                    v-for="( pip, index ) in pipCount"
                    @click="selectPip( index )"
                    :style="{ left: pipPos( index ) }">

          <span class="slider-pips__label"
                :class="{ 'slider-pips__label--hidden': !labels }">
            {{ pipLabel( index ) }}
          </span>

                </li>

            </ul>

        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import Datetime from "@/services/Datetime";

@Component({
    components: {}
})
export class HeatMapManyDaySliderPips extends Vue {
    // Prop
    @Prop({
        type: Array, // Boolean, Number, String, Array, Object
        default: [0]
    })
    values: any;

    @Prop({
        type: Number, // Boolean, Number, String, Array, Object
        default: 0
    })
    min: number;

    @Prop({
        type: Number, // Boolean, Number, String, Array, Object
        default: 0
    })
    max: number;

    @Prop({
        type: Number, // Boolean, Number, String, Array, Object
        default: 1
    })
    step: number;

    @Prop({
        type: Boolean, // Boolean, Number, String, Array, Object
        default: null
    })
    labels: boolean;

    vals: any = [];

    clickValue: any = null;

    created() {
        this.vals = this.values
    }

    mounted() {
        this.start();
    }

    start() {
    }

    /////////////  computed  /////////////
    // get isRange() {
    //     return this.range;
    // }

    get pipCount() {
        return Math.round(( this.fixedMax - this.fixedMin ) / this.fixedStep + 1 );
    }

    get fixedStep() {
        return this.fixValue( this.step );
    }

    get fixedMin() {
        return this.fixValue( this.min );
    }

    get fixedMax() {
        return this.fixValue( this.max );
    }

    get rangeFraction() {
        return 100 / ( this.fixedMax - this.fixedMin );
    }

    // get rangeWidth() {
    //     if ( this.vals.length === 1 ) {
    //         return (( this.vals[0] - this.fixedMin ) * this.rangeFraction ) + "%";
    //     } else {
    //         return (( this.vals[1] - this.vals[0] ) * this.rangeFraction ) + "%";
    //     }
    // }
    //
    // get rangeLeft() {
    //     if ( this.vals.length === 1 ) {
    //         return "0%";
    //     } else {
    //         return (-( this.fixedMin - this.vals[0] ) * this.rangeFraction ) + "%";
    //     }
    // }


    fixValue( value ) {
        return parseFloat( parseFloat( value ).toFixed(2) );
    }

    pipPos( index ) {
        return ( ( index * this.rangeFraction ) * this.fixedStep ) + "%";
    }

    floatPos( value ) {
        value = this.fixValue( value );
        return ( -( this.fixedMin - value ) * this.rangeFraction ) + "%";
    }

    pipLabel( index ) {
        return this.fixValue( this.fixedMin + index * this.fixedStep );
    }

    selectPip( index ) {
        let pipValue = this.fixValue( this.fixedMin + index * this.fixedStep );
        let handle = this.getClosestHandle( pipValue );
        this.$set( this.vals, handle, pipValue );
    }

    isPipSelected( index ) {
        let pipValue = this.fixValue( this.fixedMin + index * this.fixedStep );
        return this.vals.includes( pipValue );
    }

    isPipInRange( index ) {
        let pipValue = this.fixValue( this.fixedMin + index * this.fixedStep );
        return ( pipValue >= this.fixedMin && pipValue <= this.vals[0] );
    }

    updateValue( ev, handle ) {
        let pipValue = this.fixValue( ev.target.value );
        if ( this.vals.length > 1 ) {
            if ( handle === 0 && pipValue > this.vals[1] ) {
                this.$set( this.vals, 0, this.vals[1] );
            } else if ( handle === 1 && pipValue < this.vals[0] ) {
                this.$set( this.vals, 1, this.vals[0] );
            } else {
                this.$set( this.vals, handle, pipValue );
            }
        } else {
            this.$set( this.vals, handle, pipValue );
        }

        console.log('clickValue - ', this.clickValue);
    }

    getClosestHandle( value ) {
        let closest = this.vals.reduce( function( p, c ) {
            return ( Math.abs(c - value) < Math.abs( p - value ) ) ? c : p;
        });
        return this.vals.indexOf( closest );
    }

    selectedPipClassName( pipIndex ) {
        let className = "";
        let pipValue = this.fixValue( this.fixedMin + pipIndex * this.fixedStep );
        this.vals.forEach( function( v, i ) {
            if ( v === pipValue ) {
                className += " slider-pips__pip--selected--" + (i + 1);
            }
        });
        return className;
    }
}

export default HeatMapManyDaySliderPips;
Vue.component("heat-map-many-day-slider-pips", HeatMapManyDaySliderPips);
</script>

<style lang="scss" scoped>

    $bgcolor: #8e9cad;
    $color: #8e9cad;
    $color1: #6ef4a4;

    $trackHeight: 4px;
    $handleWidth: $trackHeight * 3;

    // ========================

    .slider-pips {

        position: relative;
        margin: 30px 0;
        min-height: 40px;
        color: $color;
        font-size: 12px;

        &__range {

            width: 100%;
            appearance: none;
            height: $trackHeight;
            display: inline-block;
            background: transparent;

            position: absolute;
            left: 0;
            right: 0;
            top: 0;

            &::-webkit-slider-runnable-track {
                appearance: none;
                position: relative;
                background: $bgcolor;
                height: $trackHeight;
                border-radius: $trackHeight;
            }

            &::-webkit-slider-thumb {
                appearance: none;
                position: relative;
                width: $handleWidth;
                height: $handleWidth;
                background: black;
                /*box-shadow: 0 0 0 6px #434d5a;*/
                border-radius: 100%;
                transform: translateY( -( $trackHeight ) );
                z-index: 1;
            }

            &:focus,
            &:focus::-webkit-slider-runnable-track {
                outline: none;
            }
        }

        &__range-selection {

            position: absolute;
            top: 0px;
            height: $trackHeight;
            background: $color1;
            border-radius: 3px;
            transition: all 0.2s ease-out;
        }

        &__pips,

        &__floats {
            position: relative;
            list-style: none;
            margin: 0 $handleWidth/2;
        }

        &__pips {
            top: $trackHeight + 8;
        }

        &__pip {

            position: absolute;
            top: -5px;
            left: 0;
            width: 1px;
            height: 6px;
            background: currentColor;
            user-select: none;
            transition: all 0.5s ease;
            cursor: pointer;

            &--selected {
                color: lighten( $color, 5% );
                height: 10px;
                transition: all 0.05s ease;
            }
        }

        &__label {
            position: absolute;
            left: 50%;
            top: 100%;
            transform: translate( -50%, 0px );
            padding: 3px;

            &--hidden {
                display: none;
            }
        }
    }


</style>
