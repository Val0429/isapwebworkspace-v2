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
                    :firstSiteId="filterData.firstSiteId"
                    :deviceMode="deviceMode"
                >
                </analysis_filter_in_out>

                <!-- Ben -->
                <anlysis-dashboard :anlysisData="dData">
                </anlysis-dashboard>

                <!-- Morris -->
                <highcharts-traffic
                    :startDate="startDate"
                    :endDate="endDate"
                    :timeMode="timeMode"
                    :areaMode="areaMode"
                    :sites="sites"
                    :value="value"
                >
                </highcharts-traffic>

            </iv-card>

        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Dialog from "@/services/Dialog/Dialog";

// Tina
import { EDeviceMode } from "@/components/Reports/models/EReport";

// Morris
import HighchartsTraffic from "@/components/Reports/HighchartsTraffic.vue";
import FilterCondition from "@/components/Reports/FilterCondition.vue";
import {
    ETimeMode,
    EAreaMode,
    EWeather,
    ISite,
    IDayRange,
    IChartTrafficData
} from "@/components/Reports";
// Ben
import {
    ReportTableData,
    IPeckTimeRange,
    ReportDashboard,
    EPageType,
    ESign
} from "@/components/Reports";

enum EPageStep {
    none = "none"
}

@Component({
    components: {
        HighchartsTraffic
    }
})
export default class ReportTraffic extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;
    startDate: Date = new Date("2019-01-01T00:00:00.000Z");
    endDate: Date = new Date("2019-01-01T01:00:00.000Z");
    timeMode: ETimeMode = ETimeMode.none;
    areaMode: EAreaMode = EAreaMode.none;
    sites: ISite[] = [];
    value: IChartTrafficData[] = [];

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

    //Dashboard 相關
    dData = new ReportDashboard();

    created() {
        this.initChartDeveloper();
    }

    mounted() {}

    // Morris //
    initChartDeveloper() {
        this.timeMode = ETimeMode.week;

        // single day
        this.startDate = new Date("2019-07-01T08:00:00.000Z");
        this.endDate = new Date("2019-07-01T14:00:00.000Z");

        // multipe day
        this.startDate = new Date("2015-01-20T08:00:00.000Z");
        this.endDate = new Date("2019-10-10T14:00:00.000Z");

        let siteLength = 1;

        for (let j = 0; j < siteLength; j++) {
            let tempJ = j + 1;
            this.sites.push({
                objectId: "site" + tempJ.toString(),
                name: "Site " + tempJ.toString(),
                officeHour: [
                    {
                        startDay: "0",
                        endDay: "6",
                        startDate: "2000-01-01T00:00:00.000Z",
                        endDate: "2000-01-01T14:00:00.000Z"
                    }
                ]
            });

            for (let i = 1; i < 30; i++) {
                let weather = EWeather.none;

                let tmepWeatherNumber = Math.floor(Math.random() * 300);
                if (tmepWeatherNumber % 3 == 0) {
                    weather = EWeather.sunny;
                } else if (tmepWeatherNumber % 3 == 1) {
                    weather = EWeather.cloudy;
                } else if (tmepWeatherNumber % 3 == 2) {
                    weather = EWeather.rain;
                }

                let tempI = i;
                let iNumber = tempI;
                let iString = tempI.toString();
                let iString10 = iNumber < 10 ? `0${iString}` : iString;
                let tempDate = new Date(`2019-07-${iString10}T12:00:00.000Z`);
                let trafficChartData: IChartTrafficData = {
                    date: tempDate,
                    siteObjectId: "site" + (j + 1).toString(),
                    temperature: iNumber,
                    traffic: Math.floor(Math.random() * 500),
                    revenue: Math.floor(Math.random() * 1000),
                    transaction: Math.floor(Math.random() * 50),
                    conversion: Math.floor(Math.random() * 100) / 100,
                    asp: Math.floor(Math.random() * 500),
                    weather: weather
                };
                this.value.push(trafficChartData);
            }
        }
    }
    // Morris //

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    receiveFilterData(filterData, responseData) {
        this.filterData = filterData;
        this.responseData = responseData;
        Vue.set(this.filterData, "firstSiteId", filterData.siteIds[0]);
        console.log("this.filterData  - ", this.filterData);
        console.log("this.responseData  - ", this.responseData);
    }

    receiveUserData(data) {
        this.userData = data;
        console.log("this.userData - ", this.userData);
    }

    receiveModalShowData(data) {
        this.modalShow = data;
    }

    ////////////////////////////////////// Tina End //////////////////////////////////////
}
</script>


<style lang="scss" scoped>
</style>




