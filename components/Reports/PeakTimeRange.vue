<template>
    <div class="animated fadeIn">
        <title>Peak hours</title>
        <table
            class="table table-bordered"
            v-if="data.head.length > 0"
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
                    <th v-for="(item, key, index) in data.head">
                        {{(new Date(item)).getUTCHours() + ":00"}} - {{(new Date(item)).getUTCHours() + 1 + ":00"}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(items, key, index) in data.body">
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
import {
    Vue,
    Component,
    Prop,
    Emit,
    Watch,
    Model
} from "vue-property-decorator";
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
        type: Array,
        default: function() {
            return [];
        }
    })
    timeRangeData: any[];

    @Watch("timeRangeData", { deep: true })
    private timeRangeDataChanged(newVal, oldVal) {
        this.initData();
    }

    data: IPeckTimeRange = {
        head: [],
        body: []
    };

    site = "iVTCTzctbF";

    created() {}

    mounted() {
        this.initData();
    }

    initData() {
        // Data format conversion
        for (let item of this.timeRangeData) {
            if (item.site.objectId == this.site) {
                let head = [];
                let levels: number[] = [];
                this.data.body = [];
                for (let subItem of item.peakHourDatas) {
                    levels.push(subItem.level);
                    head.push(subItem.date);
                }

                let body = {
                    title: item.date,
                    context: levels
                };
                this.data.head = head;
                this.data.body.push(body);
            }
        }

        //     this.pData = {
        //         head: [
        //             "2019-06-24T09:00:00.000Z",
        //             "2019-06-24T10:00:00.000Z",
        //             "2019-06-24T11:00:00.000Z",
        //             "2019-06-24T12:00:00.000Z",
        //             "2019-06-24T13:00:00.000Z",
        //             "2019-06-24T14:00:00.000Z",
        //             "2019-06-24T16:00:00.000Z",
        //             "2019-06-24T17:00:00.000Z",
        //             "2019-06-24T18:00:00.000Z",
        //             "2019-06-24T19:00:00.000Z",
        //             "2019-06-24T20:00:00.000Z",
        //             "2019-06-24T21:00:00.000Z"
        //         ],
        //         body: [
        //             {
        //                 title: "2019-06-24T09:00:00.000Z",
        //                 context: [1, 2, 3, 4, 5, 1, 4, 5, 1, 1, 4, 1]
        //             },
        //             {
        //                 title: "2019-06-25T09:00:00.000Z",
        //                 context: [5, 4, 5, 3, 2, 1, 4, 5, 1, 2, 4, 1]
        //             },
        //             {
        //                 title: "2019-06-26T09:00:00.000Z",
        //                 context: [1, 3, 4, 5, 1, 5, 4, 2, 1, 2, 1, 1]
        //             },
        //             {
        //                 title: "2019-06-27T09:00:00.000Z",
        //                 context: [1, 3, 4, 4, 2, 1, 3, 4, 5, 1, 4, 1]
        //             },
        //             {
        //                 title: "2019-06-28T09:00:00.000Z",
        //                 context: [1, 3, 5, 4, 5, 1, 4, 2, 1, 3, 2, 2]
        //             },
        //             {
        //                 title: "2019-06-29T09:00:00.000Z",
        //                 context: [1, 2, 1, 4, 4, 5, 1, 2, 1, 3, 3, 1]
        //             },
        //             {
        //                 title: "2019-06-30T09:00:00.000Z",
        //                 context: [1, 1, 1, 2, 2, 4, 5, 1, 1, 3, 4, 1]
        //             }
        //         ]
        //     };
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
