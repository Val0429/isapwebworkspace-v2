<template>
    <div class="animated fadeIn">
        <div>Peak hours</div>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th></th>
                    <th
                        :class="showHoursRange(item)"
                        v-for="(item, key, index) in timeRangeData.head"
                    >
                        {{item}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>2012/01/01</td>
                    <td>Member</td>
                    <td>Pompeius René</td>
                    <td>Pompeius René</td>
                    <td>Pompeius René</td>
                    <td>Pompeius René</td>
                    <td>Pompeius René</td>
                    <td>Paĉjo Jadon</td>
                </tr>

                <tr>
                    <td>2012/01/01</td>
                    <td>Member</td>
                    <td>Pompeius René</td>
                    <td>Pompeius René</td>
                    <td>Pompeius René</td>
                    <td>Pompeius René</td>
                    <td>Pompeius René</td>
                    <td>Paĉjo Jadon</td>
                </tr>
                <tr>

                    <td>2012/02/01</td>
                    <td>Staff</td>
                    <td>Paĉjo Jadon</td>
                    <td>Paĉjo Jadon</td>
                    <td>Paĉjo Jadon</td>
                    <td>Paĉjo Jadon</td>
                    <td>Paĉjo Jadon</td>
                    <td>Paĉjo Jadon</td>
                </tr>
                <tr>
                    <td>2012/01/01</td>
                    <td>Micheal Mercurius</td>
                    <td>Staff</td>
                    <td>Paĉjo Jadon</td>
                    <td>Paĉjo Jadon</td>
                    <td>Paĉjo Jadon</td>
                    <td>Paĉjo Jadon</td>
                    <td>Paĉjo Jadon</td>
                </tr>
                <tr>
                    <td>2012/01/01</td>
                    <td>Ganesha Dubhghall</td>
                    <td>Member</td>
                    <td>Staff</td>
                    <td>Paĉjo Jadon</td>
                    <td>Paĉjo Jadon</td>
                    <td>Paĉjo Jadon</td>
                    <td>Paĉjo Jadon</td>
                </tr>
                <tr>
                    <td>2012/01/01</td>
                    <td>Staff</td>
                    <td>Paĉjo Jadon</td>
                    <td>Paĉjo Jadon</td>
                    <td>Paĉjo Jadon</td>
                    <td>Paĉjo Jadon</td>
                    <td>Paĉjo Jadon</td>
                    <td></td>
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
                head: [1, 2, 3, 4, 5, 4, 1],
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
}
.hoursRange1 {
    background-color: #d7e7f7;
}
.hoursRange2 {
    background-color: #9ec3ef;
}
.hoursRange3 {
    background-color: #3e86db;
}
.hoursRange4 {
    background-color: #194f8f;
}
.hoursRange5 {
    background-color: #0f2f55;
}
</style>
