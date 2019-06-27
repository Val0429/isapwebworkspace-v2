<template>
    <div class="animated fadeIn">

        <!-- Tina -->
        <filter_condition
            :label="_('w_ReportFilterConditionComponent_')"
            @submit-data="receiveFilterData"
        >
        </filter_condition>


        <div v-show="pageStep === ePageStep.none">

            <iv-card>


                <!-- Tina -->
                <analysis_filter_in_out
                    class="mb-5 mt-3 ml-4"
                    v-if="filterData.siteIds && filterData.siteIds.length === 1"
                    :siteIds0="filterData.siteIds0"
                    :deviceMode="deviceMode"
                >
                </analysis_filter_in_out>

                <!-- Morris -->
                <traffic-chart
                    :startDate="startDate"
                    :endDate="endDate"
                    :sites="sites"
                    :value="value"
                >
                </traffic-chart>

            </iv-card>

        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Dialog from "@/services/Dialog/Dialog";

// Morris
import TrafficChart from "@/components/HighCharts/TrafficChart.vue";
import FilterCondition from "@/components/Reports/FilterCondition.vue";
import {
    EWeather,
    ISite,
    IDayRange,
    ITrafficData
} from "@/components/HighCharts";

enum EPageStep {
    none = "none"
}

enum EDeviceMode {
    peopleCounting = "peopleCounting",
}

@Component({
    components: {
        TrafficChart
    }
})
export default class ReportTraffic extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;

    startDate: Date = new Date("2019-06-26T08:00:00.000Z");
    endDate: Date = new Date("2019-06-01T00:00:00.000Z");
    sites: ISite[] = [];
    value: ITrafficData[] = [];

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    // recipient 相關
    modalShow: boolean = false;

    // 往recipient子元件傳資料
    deviceMode: string = EDeviceMode.peopleCounting;

    // 接收 Filter Condition 資料 相關
    filterData: any = {};
    responseData: any = {};
    userData: any = [];

    ////////////////////////////////////// Tina End //////////////////////////////////////

    created() {
        this.initChartDeveloper();
    }

    mounted() {
    }

    initChartDeveloper() {
        this.startDate = new Date("2019-06-26T08:00:00.000Z");
        this.endDate = new Date("2019-06-26T14:00:00.000Z");

        this.sites.push({
            objectId: "site-1",
            name: "Site",
            officeHour: [
                {
                    startDay: "0",
                    endDay: "6",
                    startDate: "2000-01-01T00:00:00.000Z",
                    endDate: "2000-01-01T14:00:00.000Z"
                }
            ]
        });

        // this.sites.push({
        //     objectId: "site-2",
        //     name: "Site",
        //     officeHour: [
        //         {
        //             startDay: "0",
        //             endDay: "6",
        //             startDate: "2000-01-01T12:00:00.000Z",
        //             endDate: "2000-01-01T16:00:00.000Z"
        //         }
        //     ]
        // });

        for (let i = 8; i < 16; i++) {
            let iNumber = i;
            let iString = i.toString();
            let iString10 = iNumber < 10 ? `0${iString}` : iString;
            let tempDate = new Date(`2019-06-26T${iString10}:00:00.000Z`);
            let trafficChartData: ITrafficData = {
                datetime: tempDate,
                siteId: "site-2",
                temperature: iNumber,
                traffic: iNumber + 100,
                revenue: iNumber * 1000,
                transaction: iNumber,
                conversion: iNumber / 1000,
                asp: "Unknow",
                weather: EWeather.sunny
            };
            this.value.push(trafficChartData);
        }
    }

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    receiveFilterData(filterData, responseData) {
        this.filterData = filterData;
        this.responseData = responseData;
        Vue.set(this.filterData, "siteIds0", filterData.siteIds[0]);
        console.log('this.filterData  - ', this.filterData );
        console.log('this.responseData  - ', this.responseData );
    }

    receiveUserData(data) {
        this.userData = data;
        console.log('this.userData - ', this.userData);
    }

    receiveModalShowData(data) {
        this.modalShow = data;
    }

    ////////////////////////////////////// Tina End //////////////////////////////////////


}
</script>


<style lang="scss" scoped>
</style>




