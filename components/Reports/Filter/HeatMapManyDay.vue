<template>
    <div>
        <div class="card-carousel-wrapper">
            <div
                class="card-carousel--nav__left"
                @click="moveCarousel(-1)"
                :disabled="atHeadOfList"
            ></div>

            <div class="card-carousel">
                <div class="card-carousel--overflow-container">
                    <div
                        class="card-carousel-cards"
                        :style="{ transform: 'translateX' + '(' + currentOffset + 'px' + ')'}"
                    >
                        <div
                            class="card-carousel--card"
                            v-for="(day, index) in dayArray"
                            :key="'key_' + index"
                        >
                            <div class="card-carousel--card--footer">
                                <p>{{ dateAndWeekDay(day) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="card-carousel--nav__right"
                @click="moveCarousel(1)"
                :disabled="atEndOfList"
            ></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import Datetime from "@/services/Datetime";

@Component({
    components: {}
})
export class HeatMapManyDay extends Vue {
    // Prop
    @Prop({
        type: Array, // Boolean, Number, String, Array, Object
        default: () => []
    })
    dayArray: any;

    currentOffset: number = 0;
    windowSize: number = 1;
    paginationFactor: number = 300;

    created() {}

    mounted() {
        this.start();
    }

    start() {}

    get atEndOfList() {
        return (
            this.currentOffset <=
            this.paginationFactor *
                -1 *
                (this.dayArray.length - this.windowSize)
        );
    }
    get atHeadOfList() {
        return this.currentOffset === 0;
    }

    moveCarousel(direction) {
        // Find a more elegant way to express the :style. consider using props to make it truly generic
        if (direction === 1 && !this.atEndOfList) {
            this.currentOffset -= this.paginationFactor;
        } else if (direction === -1 && !this.atHeadOfList) {
            this.currentOffset += this.paginationFactor;
        }

        const arrayIndex = (this.currentOffset / this.paginationFactor)
            .toString()
            .substring(1);

        this.$emit("day-array-index", arrayIndex);
    }

    dateAndWeekDay(dateStr: string): string {
        const dateResult = Datetime.DateTime2String(
            new Date(dateStr),
            Datetime.FormatDate
        );
        let weekResult = "";

        // 今天星期幾
        const week = new Date(dateStr).getDay();
        switch (week) {
            case 0:
                weekResult = this._("w_Week_0");
                break;
            case 1:
                weekResult = this._("w_Week_1");
                break;
            case 2:
                weekResult = this._("w_Week_2");
                break;
            case 3:
                weekResult = this._("w_Week_3");
                break;
            case 4:
                weekResult = this._("w_Week_4");
                break;
            case 5:
                weekResult = this._("w_Week_5");
                break;
            case 6:
                weekResult = this._("w_Week_6");
                break;
        }

        return `${dateResult} ${weekResult}`;
    }
}

export default HeatMapManyDay;
Vue.component("heat-map-many-day", HeatMapManyDay);
</script>

<style lang="scss" scoped>
.card-carousel-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0 20px;
    color: #666a73;
}

.card-carousel {
    display: flex;
    justify-content: center;
    width: 250px;
}
.card-carousel--overflow-container {
    overflow: hidden;
}
.card-carousel--nav__left,
.card-carousel--nav__right {
    display: inline-block;
    width: 12px;
    height: 12px;
    padding: 10px;
    box-sizing: border-box;
    border-top: 2px solid #2c3e50;
    border-right: 2px solid #2c3e50;
    cursor: pointer;
    margin: 0 10px;
    transition: transform 150ms linear;
}
.card-carousel--nav__left[disabled],
.card-carousel--nav__right[disabled] {
    opacity: 0.2;
    border-color: #2c3e50;
}
.card-carousel--nav__left {
    transform: rotate(-135deg);
}
.card-carousel--nav__left:active {
    transform: rotate(-135deg) scale(0.9);
}
.card-carousel--nav__right {
    transform: rotate(45deg);
}
.card-carousel--nav__right:active {
    transform: rotate(45deg) scale(0.9);
}

.card-carousel-cards {
    display: flex;
    transition: transform 150ms ease-out;
    transform: translatex(0px);
}
.card-carousel-cards .card-carousel--card {
    margin: 0 10px;
    cursor: pointer;
    background-color: #fff;
    border-radius: 4px;
    z-index: 3;
    margin-bottom: 2px;
}
.card-carousel-cards .card-carousel--card:first-child {
    margin-left: 0;
}
.card-carousel-cards .card-carousel--card:last-child {
    margin-right: 0;
}

.card-carousel-cards .card-carousel--card--footer {
    border-top: 0;
    padding: 7px 15px;
}
.card-carousel-cards .card-carousel--card--footer p {
    width: 250px;
    padding: 2px 0;
    margin: 1px;
    font-size: 19px;
    font-weight: 600;
    color: #2c3e50;
    user-select: none;
    text-align: left;
}
.card-carousel-cards .card-carousel--card--footer p:nth-of-type(2) {
    font-size: 12px;
    font-weight: 300;
    padding: 6px;
    background: rgba(40, 44, 53, 0.06);
    display: inline-block;
    position: relative;
    margin-left: 4px;
    color: #666a73;
}
.card-carousel-cards .card-carousel--card--footer p:nth-of-type(2):before {
    content: "";
    float: left;
    position: absolute;
    top: 0;
    left: -12px;
    width: 0;
    height: 0;
    border-color: transparent rgba(40, 44, 53, 0.06) transparent transparent;
    border-style: solid;
    border-width: 12px 12px 12px 0;
}
.card-carousel-cards .card-carousel--card--footer p:nth-of-type(2):after {
    content: "";
    position: absolute;
    top: 10px;
    left: -1px;
    float: left;
    width: 4px;
    height: 4px;
    border-radius: 2px;
    background: white;
    box-shadow: -0px -0px 0px #004977;
}
</style>
