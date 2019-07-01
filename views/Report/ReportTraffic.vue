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

                <!-- Ben -->
                <peak-time-range
                    :timeRangeData="pData"
                    :siteItem="pSiteItem"
                    v-on:changeSite="changeSite"
                >
                </peak-time-range>

                <!-- Ben -->
                <report-table :reportTableData="rData">
                </report-table>

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

    //PickTimeRange 相關
    pSite = "";
    pSiteItem = [];
    pData = [];

    //ReportTable 相關
    rData = new ReportTableData();

    created() {
        this.initChartDeveloper();
    }

    mounted() {
        this.initDashboardData();
        this.initPeakTimeRange();
        this.initReportTable();
    }

    // Ben //
    initDashboardData() {
        setTimeout(() => {
            this.dData = {
                pageType: EPageType.traffic,
                traffic: {
                    sign: ESign.negative,
                    total: 43250,
                    value: 10,
                    valueRatio: 0.156
                },
                averageOccupancy: {
                    sign: ESign.negative,
                    total: 10,
                    value: 1,
                    valueRatio: 0.099
                },
                averageDwellTime: {
                    sign: ESign.positive,
                    total: 25,
                    value: 2,
                    valueRatio: 0.01
                },
                demographic: {
                    sign: ESign.positive,
                    value: 11,
                    valueRatio: 0.099,
                    sign2: ESign.negative,
                    value2: 11,
                    valueRatio2: 0.099
                },
                vipBlacklist: {
                    sign: ESign.positive,
                    value: 11,
                    valueRatio: 0.099,
                    sign2: ESign.negative,
                    value2: 11,
                    valueRatio2: 0.099
                },
                repeatCustomer: {
                    sign: ESign.negative,
                    total: 0.36,
                    value: 9,
                    valueRatio: 0.11
                },
                revenue: {
                    sign: ESign.positive,
                    total: 9999999,
                    value: 11,
                    valueRatio: 0.099
                },
                transaction: {
                    sign: ESign.negative,
                    total: 666,
                    value: 11,
                    valueRatio: 0.099
                },
                conversion: {
                    sign: ESign.positive,
                    total: 0.18,
                    value: 2,
                    valueRatio: 0.01
                },
                asp: {
                    sign: ESign.positive,
                    total: 1235,
                    value: 2,
                    valueRatio: 0.01
                }
            };
        }, 2000);
    }

    initPeakTimeRange() {
        setTimeout(() => {
            this.pSiteItem = [
                { value: "iVTCTzctbF", text: "台北店" },
                { value: "pfLGgj8Hf5", text: "台中店" }
            ];

            this.pData = [
                {
                    site: {
                        objectId: "iVTCTzctbF",
                        name: "台北店"
                    },
                    date: "2019-06-25T16:00:00.000Z",
                    peakHourDatas: [
                        {
                            date: "2019-06-25T01:00:00.000Z",
                            level: 4
                        },
                        {
                            date: "2019-06-25T02:00:00.000Z",
                            level: 5
                        },
                        {
                            date: "2019-06-25T03:00:00.000Z",
                            level: 1
                        },
                        {
                            date: "2019-06-25T04:00:00.000Z",
                            level: 5
                        },
                        {
                            date: "2019-06-25T05:00:00.000Z",
                            level: 3
                        },
                        {
                            date: "2019-06-25T06:00:00.000Z",
                            level: 0
                        },
                        {
                            date: "2019-06-25T07:00:00.000Z",
                            level: 3
                        },
                        {
                            date: "2019-06-25T08:00:00.000Z",
                            level: 2
                        }
                    ]
                },
                {
                    site: {
                        objectId: "iVTCTzctbF",
                        name: "台北店"
                    },
                    date: "2019-06-26T16:00:00.000Z",
                    peakHourDatas: [
                        {
                            date: "2019-06-25T01:00:00.000Z",
                            level: 1
                        },
                        {
                            date: "2019-06-25T02:00:00.000Z",
                            level: 4
                        },
                        {
                            date: "2019-06-25T03:00:00.000Z",
                            level: 5
                        },
                        {
                            date: "2019-06-25T04:00:00.000Z",
                            level: 2
                        },
                        {
                            date: "2019-06-25T05:00:00.000Z",
                            level: 5
                        },
                        {
                            date: "2019-06-25T06:00:00.000Z",
                            level: 4
                        },
                        {
                            date: "2019-06-25T07:00:00.000Z",
                            level: 1
                        },
                        {
                            date: "2019-06-25T08:00:00.000Z",
                            level: 0
                        }
                    ]
                },
                {
                    site: {
                        objectId: "pfLGgj8Hf5",
                        name: "台中店"
                    },
                    date: "2019-06-26T16:00:00.000Z",
                    peakHourDatas: [
                        {
                            date: "2019-06-25T01:00:00.000Z",
                            level: 2
                        },
                        {
                            date: "2019-06-25T02:00:00.000Z",
                            level: 2
                        },
                        {
                            date: "2019-06-25T03:00:00.000Z",
                            level: 3
                        },
                        {
                            date: "2019-06-25T04:00:00.000Z",
                            level: 4
                        },
                        {
                            date: "2019-06-25T05:00:00.000Z",
                            level: 5
                        },
                        {
                            date: "2019-06-25T06:00:00.000Z",
                            level: 3
                        },
                        {
                            date: "2019-06-25T07:00:00.000Z",
                            level: 2
                        },
                        {
                            date: "2019-06-25T08:00:00.000Z",
                            level: 1
                        }
                    ]
                }
            ];
        }, 2000);
    }

    changeSite(site) {
        this.pSite = site;
        // this.initPeakTimeRange();
    }

    initReportTable() {
        setTimeout(() => {
            this.rData.head = [
                "2019-06-24T09:00:00.000Z",
                "2019-06-24T10:00:00.000Z",
                "2019-06-24T11:00:00.000Z",
                "2019-06-24T12:00:00.000Z",
                "2019-06-24T13:00:00.000Z",
                "2019-06-24T14:00:00.000Z",
                "2019-06-24T16:00:00.000Z",
                "2019-06-24T17:00:00.000Z",
                "2019-06-24T18:00:00.000Z",
                "2019-06-24T19:00:00.000Z",
                "2019-06-24T20:00:00.000Z",
                "2019-06-24T21:00:00.000Z"
            ];
            this.rData.body = [
                {
                    area: "1F精品區",
                    group: "N/A",
                    in: [
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.negative, value: 1, valueRatio: -0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.negative, value: 1, valueRatio: -0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.negative, value: 1, valueRatio: -0.01 },
                        { sign: ESign.negative, value: 2, valueRatio: -0.02 }
                    ],
                    out: [
                        { sign: ESign.negative, value: 3, valueRatio: -0.03 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.negative, value: 1, valueRatio: -0.01 },
                        { sign: ESign.negative, value: 1, valueRatio: -0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.negative, value: 1, valueRatio: -0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.negative, value: 1, valueRatio: -0.01 },
                        { sign: ESign.positive, value: 4, valueRatio: 0.05 }
                    ]
                },
                {
                    area: "2F生活用品",
                    group: "Group01",
                    in: [
                        { sign: ESign.positive, value: 5, valueRatio: 0.06 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.negative, value: 1, valueRatio: -0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.negative, value: 1, valueRatio: -0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.negative, value: 1, valueRatio: -0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.negative, value: 1, valueRatio: -0.01 },
                        { sign: ESign.negative, value: 6, valueRatio: -0.07 }
                    ],
                    out: [
                        { sign: ESign.negative, value: 7, valueRatio: -0.08 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.negative, value: 1, valueRatio: -0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.negative, value: 1, valueRatio: -0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.positive, value: 1, valueRatio: 0.01 },
                        { sign: ESign.negative, value: 8, valueRatio: -0.09 }
                    ]
                }
            ];
        }, 2000);
    }

    // Morris //
    initChartDeveloper() {
        this.timeMode = ETimeMode.day;
        this.areaMode = EAreaMode.all;

        // single day
        this.startDate = new Date("2019-07-01T08:00:00.000Z");
        this.endDate = new Date("2019-07-01T14:00:00.000Z");

        // multipe day
        this.startDate = new Date("2019-06-20T08:00:00.000Z");
        this.endDate = new Date("2019-08-10T14:00:00.000Z");

        let siteLength = 3;

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

                if (tmepWeatherNumber % 10 == 0) {
                    weather = EWeather.clearDay;
                } else if (tmepWeatherNumber % 10 == 1) {
                    weather = EWeather.clearNight;
                } else if (tmepWeatherNumber % 10 == 2) {
                    weather = EWeather.rain;
                } else if (tmepWeatherNumber % 10 == 3) {
                    weather = EWeather.snow;
                } else if (tmepWeatherNumber % 10 == 4) {
                    weather = EWeather.sleet;
                } else if (tmepWeatherNumber % 10 == 5) {
                    weather = EWeather.wind;
                } else if (tmepWeatherNumber % 10 == 6) {
                    weather = EWeather.fog;
                } else if (tmepWeatherNumber % 10 == 7) {
                    weather = EWeather.cloudy;
                } else if (tmepWeatherNumber % 10 == 8) {
                    weather = EWeather.partlyCloudyDay;
                } else if (tmepWeatherNumber % 10 == 9) {
                    weather = EWeather.partlyCloudyNight;
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




