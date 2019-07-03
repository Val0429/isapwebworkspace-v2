<template>
    <div class="animated fadeIn">
        <title>Peak hours</title>
        <table
            class="table table-bordered"
            v-if="pData &&  pData.head && pData.head.length > 0"
        >
            <thead>
                <tr>
                    <th>
                        <b-form-select
                            v-if="dayXSiteX == eDayXSiteX.dayXSiteX"
                            v-model="site"
                            :options="siteItems"
                            @change="changeSite()"
                        ></b-form-select>
                    </th>
                    <th v-for="(item, key, index) in pData.head">
                        {{(new Date(item)).getUTCHours() + ":00"}} - {{(new Date(item)).getUTCHours() + 1 + ":00"}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(items, key, index) in pData.body">
                    <td v-if="dayXSiteX != eDayXSiteX.day1SiteX"> {{(new Date(items.title)).getFullYear() + "/" + ((new Date(items.title)).getUTCMonth() + 1) + "/" + (new Date(items.title)).getUTCDate() + " " + showWeek((new Date(items.title)).getDay())}}</td>
                    <td v-if="dayXSiteX == eDayXSiteX.day1SiteX"> {{items.title}}</td>
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
import { IPeckTimeRange, EDayXSiteX, ISiteItems } from "@/components/Reports";
import Datetime from "@/services/Datetime.vue";

@Component({
    components: {}
})
export class PeakTimeRange extends Vue {
    // Prop
    @Prop({
        type: String,
        default: function() {
            return EDayXSiteX.none;
        }
    })
    dayXSiteX: EDayXSiteX;

    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    siteItems: ISiteItems[];

    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    timeRangeData: IPeckTimeRange[];

    @Watch("timeRangeData", { deep: true })
    private timeRangeDataChanged(newVal, oldVal) {
        this.initData();
    }

    eDayXSiteX = EDayXSiteX;

    pData: IPeckTimeRange = {
        site: "",
        head: [],
        body: []
    };

    site = "iVTCTzctbF";

    created() {}

    mounted() {
        this.initData();
    }

    initData() {
        switch (this.dayXSiteX) {
            case EDayXSiteX.day1Site1:
                this.generateDay1Ste1();
                break;
            case EDayXSiteX.dayXSite1:
                this.generateDayXSte1();
                break;
            case EDayXSiteX.day1SiteX:
                this.generateDay1SteX();
                break;
            case EDayXSiteX.dayXSiteX:
                this.generateDayXSteX();
                break;
            default:
                break;
        }
    }

    generateDay1Ste1() {
        console.log("generateDay1Ste1", this.timeRangeData);
        this.pData = {
            site: "",
            head: [],
            body: []
        };
        this.pData = this.timeRangeData[0];
    }

    generateDayXSte1() {
        console.log("generateDayXSte1", this.timeRangeData);
        this.pData = {
            site: "",
            head: [],
            body: []
        };
        for (let item of this.timeRangeData) {
            if (item.site == this.site) {
                this.pData.site = item.site;
                this.pData.head = item.head;
                this.pData.body.push(item.body[0]);
            }
        }
    }

    generateDay1SteX() {
        console.log("generateDay1SteX", this.timeRangeData);
        this.pData = {
            site: "",
            head: [],
            body: []
        };
        for (let item of this.timeRangeData) {
            this.pData.site = item.site;
            this.pData.head = item.head;

            for (let siteItem of this.siteItems) {
                if (siteItem.value == item.site) {
                    let body = {
                        title: siteItem.text,
                        context: item.body[0].context
                    };
                    this.pData.body.push(body);
                }
            }
        }
    }

    generateDayXSteX() {
        console.log("generateDayXSteX", this.timeRangeData);
        this.pData = {
            site: "",
            head: [],
            body: []
        };
        for (let item of this.timeRangeData) {
            if (item.site == this.site) {
                this.pData.site = item.site;
                this.pData.head = item.head;
                this.pData.body.push(item.body[0]);
            }
        }
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
        this.initData();
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
