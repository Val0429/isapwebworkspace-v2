<template>
    <div class="animated fadeIn">
        <title>Peak hours</title>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th></th>
                    <th v-for="(item, key, index) in timeRangeData.head">
                        {{item}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(items, key, index) in timeRangeData.body">
                    <td>{{items.title}}</td>
                    <td
                        v-for="(item, key, index) in items.context"
                        :class="showHoursRange(item)"
                    ></td>
                </tr>
            </tbody>
        </table>
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
            return {
                head: [],
                body: []
            };
        }
    })
    timeRangeData: object;

    created() {}

    mounted() {}

    showHoursRange(data) {
        switch (data) {
            case 1:
                return "hoursRange1";
                break;
            case 2:
                return "hoursRange2";
                break;
            case 3:
                return "hoursRange3";
                break;
            case 4:
                return "hoursRange4";
                break;
            case 5:
                return "hoursRange5";
                break;
            default:
                return "hoursRange0";
        }
    }
}

export default PeakTimeRange;
Vue.component("peak-time-range", PeakTimeRange);
</script>

<style lang="scss" scoped>
.hoursRange0 {
    background-color: #ffffff;
    height: 47px;
}
.hoursRange1 {
    background-color: #d7e7f7;
    height: 47px;
}
.hoursRange2 {
    background-color: #9ec3ef;
    height: 47px;
}
.hoursRange3 {
    background-color: #3e86db;
    height: 47px;
}
.hoursRange4 {
    background-color: #194f8f;
    height: 47px;
}
.hoursRange5 {
    background-color: #0f2f55;
    height: 47px;
}
</style>
