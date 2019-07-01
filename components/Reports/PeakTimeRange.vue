<template>
    <div class="animated fadeIn">
        <title>Peak hours</title>
        <table
            class="table table-bordered"
            v-if="timeRangeData.head.length > 0"
        >
            <thead>
                <tr>
                    <th>
                        <b-form-select
                            v-model="site"
                            :options="siteItem"
                            @change="changeSite()"
                        ></b-form-select>
                    </th>
                    <th v-for="(item, key, index) in timeRangeData.head">
                        {{(new Date(item)).getUTCHours() + ":00"}} - {{(new Date(item)).getUTCHours() + 1 + ":00"}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(items, key, index) in timeRangeData.body">
                    <td> {{(new Date(items.title)).getFullYear() + "/" + (new Date(items.title)).getMonth() + "/" + (new Date(items.title)).getDate() + " " + showWeek((new Date(items.title)).getDay())}}</td>
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
import { IPeckTimeRange } from "@/components/Reports";
import Datetime from "@/services/Datetime.vue";

@Component({
    components: {}
})
export class PeakTimeRange extends Vue {
    // Prop
    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    siteItem: [];

    @Prop({
        type: Object,
        default: function() {
            return {
                head: [],
                body: []
            };
        }
    })
    timeRangeData: IPeckTimeRange;

    site = "iVTCTzctbF";

    created() {}

    mounted() {
    }

    showWeek(data) {
        switch (data) {
            case 1:
                return "Mon";
                break;
            case 2:
                return "Tue";
                break;
            case 3:
                return "Wed";
                break;
            case 4:
                return "Thu";
                break;
            case 5:
                return "Fri";
                break;
            case 6:
                return "Sat";
                break;
            case 0:
                return "Sun";
                break;
        }
    }

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

    changeSite() {
        this.$emit("changeSite", this.site);
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
