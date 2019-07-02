<template>
    <div>
        <!-- Tina -->
        <filter_condition
            :sitesSelectItem="sitesSelectItem"
            :tagSelectItem="tagSelectItem"
            :regionTreeItem="regionTreeItem"
            :label="_('w_ReportFilterConditionComponent_')"
            @submit-data="receiveFilterData"
        >
        </filter_condition>

        <div v-show="pageStep === ePageStep.none">

            <iv-card>

                <!-- Tina -->
                <analysis_filter_in_out_traffic
                    class="mb-4"
                    v-if="filterData.siteIds && filterData.siteIds.length === 1"
                    :firstSiteId="filterData.firstSiteId"
                    :countType="filterData.type"
                    :deviceMode="deviceMode"
                    :showReportData="responseData"
                    :areaSelectItem="areaSelectItem"
                    :deviceGroupSelectItem="deviceGroupSelectItem"
                    :deviceSelectItem="deviceSelectItem"
                    :typeSelectItem="typeSelectItem"
                    :countSelectItem="countSelectItem"
                    @traffic-chart-data="receiveTrafficChartData"
                >
                </analysis_filter_in_out_traffic>

                <!-- Ben -->
                <anlysis-dashboard :anlysisData="dData">
                </anlysis-dashboard>

                <!-- Morris -->
                <highcharts-traffic
                    :startDate="startDate"
                    :endDate="endDate"
                    :sites="sites"
                    :timeMode="timeMode"
                    :areaMode="areaMode"
                    :value="chartDatas"
                >
                </highcharts-traffic>

                <!-- Ben -->
                  <peak-time-range
                    :siteItems="siteItem"
                    :dayXSiteX="pDayXxSiteX"
                    :timeRangeData="pData"> 
                    </peak-time-range>

                <!-- Ben -->
                <report-table :reportTableData="rData">
                </report-table>

            </iv-card>

        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import Dialog from "@/services/Dialog/Dialog";

// Tina
import {
    EDeviceMode,
    ECountType,
    EType
} from "@/components/Reports/models/EReport";
import {
    ERegionType,
    RegionTreeItem,
    IRegionTreeSelected
} from "@/components/RegionTree";

import RegionAPI from "@/services/RegionAPI";
import ResponseFilter from "@/services/ResponseFilter";

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
    ESign,
    EDayXSiteX,
    ISiteItems
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

    ////////////////////////////////////// Morris Start //////////////////////////////////////
    startDate: Date = new Date("2019-01-01T00:00:00.000Z");
    endDate: Date = new Date("2019-01-01T01:00:00.000Z");
    timeMode: ETimeMode = ETimeMode.none;
    areaMode: EAreaMode = EAreaMode.none;
    sites: ISite[] = [];
    chartDatas: IChartTrafficData[] = [];
    ////////////////////////////////////// Morris End //////////////////////////////////////

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    //// Filter Condition Start ////

    // select 相關
    sitesSelectItem: any = {};
    tagSelectItem: any = {};

    // tree
    selectType = ERegionType.site;
    regionTreeItem = new RegionTreeItem();
    selecteds: IRegionTreeSelected[] = [];

    // OfficeHour 相關
    officeHourItem: any = {};
    officeHourItemDetail: any = {};
    // recipient 相關
    modalShow: boolean = false;

    // 接收 Filter Condition 資料 相關
    filterData: any = {};
    responseData: any = {};
    userData: any = [];

    //// Filter Condition End ////

    //// Analysis Filter Start ////

    // 往recipient子元件傳資料
    deviceMode: string = EDeviceMode.peopleCounting;

    // select 相關
    areaSelectItem: any = {};
    deviceGroupSelectItem: any = {};
    deviceSelectItem: any = {};
    typeSelectItem: any = [
        { value: EType.in, text: EType.in },
        { value: EType.out, text: EType.out }
    ];
    countSelectItem: any = {
        hour: ECountType.hour,
        day: ECountType.day,
        week: ECountType.week,
        month: ECountType.month,
        season: ECountType.quarter,
        year: ECountType.year
    };

    inputFormData: any = {
        areaId: "",
        groupId: "",
        deviceId: "",
        type: "",
        inOrOut: "in"
    };

    //// Analysis Filter End ////

    ////////////////////////////////////// Tina End //////////////////////////////////////

    //Dashboard 相關
    dData = new ReportDashboard();

    //PickTimeRange 相關
    pData: IPeckTimeRange[] = [];
    pDayXxSiteX: EDayXSiteX = EDayXSiteX.none;
    siteItem: ISiteItems[] = [];

    //ReportTable 相關
    rData = new ReportTableData();

    created() {
        // this.initChartDeveloper();
    }

    mounted() {
        this.initDashboardData();
        this.initPeakTimeRange();
        this.initReportTable();
        // Tina
        this.initSelectItemSite();
        this.initSelectItemTag();
        this.initSelectItemTree();
        this.initOfficeHour();
        this.initRegionTreeSelect();
        this.siteFilterPermission();
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
            this.pDayXxSiteX = EDayXSiteX.dayXSiteX;

            this.siteItem = [
                { value: "iVTCTzctbF", text: "台北店" },
                { value: "pfLGgj8Hf5", text: "台中店" }
            ];

            let apipData = [
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

            // Data format conversion
            for (let item of apipData) {
                let pDatum: IPeckTimeRange = {
                    site: "",
                    head: [],
                    body: []
                };
                let head = [];
                let levels: number[] = [];
                for (let subItem of item.peakHourDatas) {
                    levels.push(subItem.level);
                    head.push(subItem.date);
                }

                let body = {
                    title: item.date,
                    context: levels
                };
                pDatum.site = item.site.objectId;
                pDatum.head = head;
                pDatum.body.push(body);
                this.pData.push(pDatum);
            }
        }, 2000);
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
                        {value: 1, valueRatio: 0.01 },
                        {value: 1, valueRatio: -0.01 },
                        {value: 1, valueRatio: 0.01 },
                        {value: 1, valueRatio: 0.01 },
                        {value: 1, valueRatio: 0.01 },
                        {value: 1, valueRatio: -0.01 },
                        {value: 1, valueRatio: 0.01 },
                        {value: 1, valueRatio: 0.01 },
                        {value: 1, valueRatio: 0.01 },
                        {value: 1, valueRatio: 0.01 },
                        {value: 1, valueRatio: -0.01 },
                        {value: 2, valueRatio: -0.02 }
                    ],
                    out: [
                        { value: 3, valueRatio: -0.03 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 4, valueRatio: 0.05 }
                    ]
                },
                {
                    area: "2F生活用品",
                    group: "Group01",
                    in: [
                        { value: 5, valueRatio: 0.06 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 6, valueRatio: -0.07 }
                    ],
                    out: [
                        {  value: 7, valueRatio: -0.08 },
                        {  value: 1, valueRatio: 0.01 },
                        {  value: 1, valueRatio: 0.01 },
                        {  value: 1, valueRatio: -0.01 },
                        {  value: 1, valueRatio: 0.01 },
                        {  value: 1, valueRatio: 0.01 },
                        {  value: 1, valueRatio: -0.01 },
                        {  value: 1, valueRatio: 0.01 },
                        {  value: 1, valueRatio: 0.01 },
                        {  value: 1, valueRatio: 0.01 },
                        {  value: 1, valueRatio: 0.01 },
                        {  value: 8, valueRatio: -0.09 }
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
        // this.startDate = new Date("2019-06-20T08:00:00.000Z");
        // this.endDate = new Date("2019-08-10T14:00:00.000Z");

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
                let tempWeatherNumber = Math.floor(Math.random() * 300);

                if (tempWeatherNumber % 10 == 0) {
                    weather = EWeather.clearDay;
                } else if (tempWeatherNumber % 10 == 1) {
                    weather = EWeather.clearNight;
                } else if (tempWeatherNumber % 10 == 2) {
                    weather = EWeather.rain;
                } else if (tempWeatherNumber % 10 == 3) {
                    weather = EWeather.snow;
                } else if (tempWeatherNumber % 10 == 4) {
                    weather = EWeather.sleet;
                } else if (tempWeatherNumber % 10 == 5) {
                    weather = EWeather.wind;
                } else if (tempWeatherNumber % 10 == 6) {
                    weather = EWeather.fog;
                } else if (tempWeatherNumber % 10 == 7) {
                    weather = EWeather.cloudy;
                } else if (tempWeatherNumber % 10 == 8) {
                    weather = EWeather.partlyCloudyDay;
                } else if (tempWeatherNumber % 10 == 9) {
                    weather = EWeather.partlyCloudyNight;
                }

                let tempI = i;
                let iNumber = tempI;
                let iString = tempI.toString();
                let iString10 = iNumber < 10 ? `0${iString}` : iString;
                let tempDate = new Date(`2019-07-02T${iString10}:00:00.000Z`);
                let trafficChartData: IChartTrafficData = {
                    date: tempDate,
                    siteObjectId: "site" + (j + 1).toString(),
                    temperature: iNumber,
                    temperatureMin: iNumber,
                    temperatureMax: iNumber,
                    traffic: Math.floor(Math.random() * 500),
                    revenue: Math.floor(Math.random() * 1000),
                    transaction: Math.floor(Math.random() * 50),
                    weather: weather
                };
                this.chartDatas.push(trafficChartData);
            }
        }
    }
    // Morris //

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    initRegionTreeSelect() {
        this.regionTreeItem = new RegionTreeItem();
        this.regionTreeItem.titleItem.card = this._("w_SiteTreeSelect");
    }

    siteFilterPermission() {
        let tempSitesSelectItem = {};
        for (const detail of this.$user.allowSites) {
            tempSitesSelectItem[detail.objectId] = detail.name;
        }
        this.sitesSelectItem = tempSitesSelectItem;
    }

    async initSelectItemSite() {
        let tempSitesSelectItem = {};

        const readAllSiteParam: {
            type: string;
        } = {
            type: "all"
        };

        await this.$server
            .R("/location/site/all", readAllSiteParam)
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response) {
                        // 自定義 sitesSelectItem 的 key 的方式
                        tempSitesSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                    this.sitesSelectItem = tempSitesSelectItem;
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });
    }

    async initSelectItemTag() {
        let tempTagSelectItem = {};

        await this.$server
            .R("/tag/all")
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response) {
                        // 自定義 tagSelectItem 的 key 的方式
                        tempTagSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                    this.tagSelectItem = tempTagSelectItem;
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });
    }

    async initSelectItemTree() {
        await this.$server
            .R("/location/tree")
            .then((response: any) => {
                if (response != undefined) {
                    this.regionTreeItem.tree = RegionAPI.analysisRegionTreeFilterSite(
                        response,
                        this.$user.allowSites
                    );
                    this.regionTreeItem.region = this.regionTreeItem.tree;
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });
    }

    async initOfficeHour() {
        let tempOfficeHourItem = {};

        await this.$server
            .R("/office-hour/all")
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response) {
                        // 自定義 tagSelectItem 的 key 的方式
                        tempOfficeHourItem[returnValue.objectId] =
                            returnValue.name;
                    }
                    this.officeHourItem = tempOfficeHourItem;
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });

        await this.$server
            .R("/office-hour")
            .then((response: any) => {
                if (response != undefined) {
                    this.officeHourItemDetail = response.results;
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });
    }

    async initSelectItemArea() {
        let tempAreaSelectItem = { all: this._("w_AllAreas") };

        const readParam: {
            siteId: string;
        } = {
            siteId: this.filterData.firstSiteId
        };

        if (!this.filterData.firstSiteId) {
            return false;
        } else {
            await this.$server
                .R("/location/area/all", readParam)
                .then((response: any) => {
                    if (response != undefined) {
                        for (const returnValue of response) {
                            // 自定義 sitesSelectItem 的 key 的方式
                            tempAreaSelectItem[returnValue.objectId] =
                                returnValue.name;
                            // this.$set(this.areaSelectItem, returnValue.objectId, returnValue.name);
                        }
                        this.areaSelectItem = tempAreaSelectItem;
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    console.log(e);
                    return false;
                });
        }
    }

    async initSelectItemDeviceGroup() {
        // let tempDeviceGroupSelectItem = { all: this._("w_AllDeviceGroups") };
        // let readParam: {
        //     siteId: string;
        //     areaId?: string;
        //     mode: string;
        // } = {
        //     siteId: this.filterData.firstSiteId,
        //     mode: this.deviceMode
        // };
        // if (!this.filterData.firstSiteId) {
        //     return false;
        //     // 只選擇site
        // } else if (
        //     this.filterData.firstSiteId &&
        //     (this.inputFormData.areaId === undefined ||
        //         this.inputFormData.areaId === "") &&
        //     this.inputFormData.areaId !== "all"
        // ) {
        //     await this.$server
        //         .R("/device/group/all", readParam)
        //         .then((response: any) => {
        //             if (response != undefined) {
        //                 for (const returnValue of response) {
        //                     // 自定義 tempDeviceGroupSelectItem 的 key 的方式
        //                     tempDeviceGroupSelectItem[returnValue.objectId] =
        //                         returnValue.name;
        //                 }
        //                 this.deviceGroupSelectItem = tempDeviceGroupSelectItem;
        //             }
        //         })
        //         .catch((e: any) => {
        //             if (e.res && e.res.statusCode && e.res.statusCode == 401) {
        //                 return ResponseFilter.base(this, e);
        //             }
        //             console.log(e);
        //             return false;
        //         });
        //     // 選擇site和單一area
        // } else if (
        //     this.filterData.firstSiteId &&
        //     this.inputFormData.areaId &&
        //     this.inputFormData.areaId !== "all"
        // ) {
        //     readParam.areaId = this.inputFormData.areaId;
        //     await this.$server
        //         .R("/device/group/all", readParam)
        //         .then((response: any) => {
        //             if (response != undefined) {
        //                 for (const returnValue of response) {
        //                     // 自定義 tempDeviceGroupSelectItem 的 key 的方式
        //                     tempDeviceGroupSelectItem[returnValue.objectId] =
        //                         returnValue.name;
        //                 }
        //                 this.deviceGroupSelectItem = tempDeviceGroupSelectItem;
        //             }
        //         })
        //         .catch((e: any) => {
        //             if (e.res && e.res.statusCode && e.res.statusCode == 401) {
        //                 return ResponseFilter.base(this, e);
        //             }
        //             console.log(e);
        //             return false;
        //         });
        //     // 選擇site和all area
        // } else if (
        //     this.filterData.firstSiteId &&
        //     this.inputFormData.areaId &&
        //     this.inputFormData.areaId === "all"
        // ) {
        //     await this.$server
        //         .R("/device/group/all", readParam)
        //         .then((response: any) => {
        //             if (response != undefined) {
        //                 for (const returnValue of response) {
        //                     // 自定義 tempDeviceGroupSelectItem 的 key 的方式
        //                     tempDeviceGroupSelectItem[returnValue.objectId] =
        //                         returnValue.name;
        //                 }
        //                 this.deviceGroupSelectItem = tempDeviceGroupSelectItem;
        //             }
        //         })
        //         .catch((e: any) => {
        //             if (e.res && e.res.statusCode && e.res.statusCode == 401) {
        //                 return ResponseFilter.base(this, e);
        //             }
        //             console.log(e);
        //             return false;
        //         });
        // }
    }

    async initSelectItemDevice() {
        // let tempDeviceSelectItem = {};
        // tempDeviceSelectItem = { all: this._("w_AllDevices") };
        // const readParam: {
        //     siteId: string;
        //     areaId?: string;
        //     groupId?: string;
        //     mode: string;
        // } = {
        //     siteId: this.filterData.firstSiteId,
        //     mode: this.deviceMode
        // };
        // if (!this.filterData.firstSiteId) {
        //     return false;
        //     // 只選擇site
        // } else if (
        //     this.filterData.firstSiteId &&
        //     !this.inputFormData.areaId &&
        //     !this.inputFormData.groupId
        // ) {
        //     await this.$server
        //         .R("/device", readParam)
        //         .then((response: any) => {
        //             if (response.results.length > 0) {
        //                 for (const returnValue of response.results) {
        //                     // 自定義 tempDeviceSelectItem 的 key 的方式
        //                     tempDeviceSelectItem[returnValue.objectId] =
        //                         returnValue.name;
        //                 }
        //                 this.deviceSelectItem = tempDeviceSelectItem;
        //             }
        //         })
        //         .catch((e: any) => {
        //             if (e.res && e.res.statusCode && e.res.statusCode == 401) {
        //                 return ResponseFilter.base(this, e);
        //             }
        //             console.log(e);
        //             return false;
        //         });
        //     // 選擇site和單一area
        // } else if (
        //     this.filterData.firstSiteId &&
        //     this.inputFormData.areaId &&
        //     this.inputFormData.areaId !== "all" &&
        //     (this.inputFormData.groupId === undefined ||
        //         this.inputFormData.groupId === "") &&
        //     this.inputFormData.groupId !== "all"
        // ) {
        //     readParam.areaId = this.inputFormData.areaId;
        //     await this.$server
        //         .R("/device", readParam)
        //         .then((response: any) => {
        //             if (response.results.length > 0) {
        //                 for (const returnValue of response.results) {
        //                     // 自定義 tempDeviceSelectItem 的 key 的方式
        //                     tempDeviceSelectItem[returnValue.objectId] =
        //                         returnValue.name;
        //                 }
        //                 this.deviceSelectItem = tempDeviceSelectItem;
        //             }
        //         })
        //         .catch((e: any) => {
        //             if (e.res && e.res.statusCode && e.res.statusCode == 401) {
        //                 return ResponseFilter.base(this, e);
        //             }
        //             console.log(e);
        //             return false;
        //         });
        //     // 選擇site和單一area和單一device group
        // } else if (
        //     this.filterData.firstSiteId &&
        //     this.inputFormData.areaId &&
        //     this.inputFormData.areaId !== "all" &&
        //     this.inputFormData.groupId &&
        //     this.inputFormData.groupId !== "all"
        // ) {
        //     readParam.groupId = this.inputFormData.groupId;
        //     await this.$server
        //         .R("/device", readParam)
        //         .then((response: any) => {
        //             if (response.results.length > 0) {
        //                 for (const returnValue of response.results) {
        //                     // 自定義 tempDeviceSelectItem 的 key 的方式
        //                     tempDeviceSelectItem[returnValue.objectId] =
        //                         returnValue.name;
        //                 }
        //                 this.deviceSelectItem = tempDeviceSelectItem;
        //             }
        //             if (response.results.length === 0) {
        //                 this.deviceSelectItem = {};
        //             }
        //         })
        //         .catch((e: any) => {
        //             if (e.res && e.res.statusCode && e.res.statusCode == 401) {
        //                 return ResponseFilter.base(this, e);
        //             }
        //             console.log(e);
        //             return false;
        //         });
        //     // 選擇site和all area
        // } else if (
        //     this.filterData.firstSiteId &&
        //     this.inputFormData.areaId &&
        //     this.inputFormData.areaId === "all" &&
        //     (this.inputFormData.groupId === undefined ||
        //         this.inputFormData.groupId === "") &&
        //     this.inputFormData.groupId !== "all"
        // ) {
        //     readParam.areaId = "";
        //     await this.$server
        //         .R("/device", readParam)
        //         .then((response: any) => {
        //             if (response.results.length > 0) {
        //                 for (const returnValue of response.results) {
        //                     // 自定義 tempDeviceSelectItem 的 key 的方式
        //                     tempDeviceSelectItem[returnValue.objectId] =
        //                         returnValue.name;
        //                 }
        //                 this.deviceSelectItem = tempDeviceSelectItem;
        //             }
        //         })
        //         .catch((e: any) => {
        //             if (e.res && e.res.statusCode && e.res.statusCode == 401) {
        //                 return ResponseFilter.base(this, e);
        //             }
        //             console.log(e);
        //             return false;
        //         });
        //     // 選擇site和all area和all device group
        // } else if (
        //     this.filterData.firstSiteId &&
        //     this.inputFormData.areaId &&
        //     this.inputFormData.areaId === "all" &&
        //     this.inputFormData.groupId &&
        //     this.inputFormData.groupId === "all"
        // ) {
        //     readParam.groupId = this.inputFormData.groupId;
        //     await this.$server
        //         .R("/device", readParam)
        //         .then((response: any) => {
        //             if (response.results.length > 0) {
        //                 for (const returnValue of response.results) {
        //                     // 自定義 tempDeviceSelectItem 的 key 的方式
        //                     tempDeviceSelectItem[returnValue.objectId] =
        //                         returnValue.name;
        //                 }
        //                 this.deviceSelectItem = tempDeviceSelectItem;
        //             }
        //             if (response.results.length === 0) {
        //                 this.deviceSelectItem = {};
        //             }
        //         })
        //         .catch((e: any) => {
        //             if (e.res && e.res.statusCode && e.res.statusCode == 401) {
        //                 return ResponseFilter.base(this, e);
        //             }
        //             console.log(e);
        //             return false;
        //         });
        //     // 選擇site和單一area和all device group
        // } else if (
        //     this.filterData.firstSiteId &&
        //     this.inputFormData.areaId &&
        //     this.inputFormData.areaId !== "all" &&
        //     this.inputFormData.groupId &&
        //     this.inputFormData.groupId === "all"
        // ) {
        //     readParam.areaId = this.inputFormData.areaId;
        //     readParam.groupId = "";
        //     await this.$server
        //         .R("/device", readParam)
        //         .then((response: any) => {
        //             if (response.results.length > 0) {
        //                 for (const returnValue of response.results) {
        //                     // 自定義 tempDeviceSelectItem 的 key 的方式
        //                     tempDeviceSelectItem[returnValue.objectId] =
        //                         returnValue.name;
        //                 }
        //                 this.deviceSelectItem = tempDeviceSelectItem;
        //             }
        //             if (response.results.length === 0) {
        //                 this.deviceSelectItem = {};
        //             }
        //         })
        //         .catch((e: any) => {
        //             if (e.res && e.res.statusCode && e.res.statusCode == 401) {
        //                 return ResponseFilter.base(this, e);
        //             }
        //             console.log(e);
        //             return false;
        //         });
        // }
    }

    // @Watch("sites", { deep: true })
    // private onFirstSiteIdChanged(newVal, oldVal) {
    //     console.log(" - ", this.sites);
    // }

    async receiveFilterData(filterData) {
        await this.$server
            .C("/report/people-counting/summary", filterData)
            .then((response: any) => {
                if (response !== undefined) {
                    this.responseData = response;
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });

        this.filterData = filterData;
        Vue.set(this.filterData, "firstSiteId", filterData.siteIds[0]);
        console.log("this.filterData  - ", this.filterData);
        console.log("this.responseData  - ", this.responseData);

        // get office hour data
        let tempISite: any = {};
        let tempOfficeHours = [];

        for (const filterSiteId of this.filterData.siteIds) {
            for (const detail of this.officeHourItemDetail) {
                for (const officeHourSiteId of detail.sites) {
                    if (filterSiteId === officeHourSiteId.objectId) {
                        for (const dayRangesValue of detail.dayRanges) {
                            let tempOfficeHour: any = {};
                            tempOfficeHour = {
                                startDay: dayRangesValue.startDay,
                                endDay: dayRangesValue.endDay,
                                startDate: dayRangesValue.startDate,
                                endDate: dayRangesValue.endDate
                            };
                            tempOfficeHours.push(tempOfficeHour);
                        }
                        tempISite = {
                            objectId: officeHourSiteId.objectId,
                            name: officeHourSiteId.name,
                            officeHour: tempOfficeHours
                        };
                    }
                }
            }
        }

        this.sites.push(tempISite);
        this.startDate = new Date(this.filterData.startDate);
        this.endDate = new Date(this.filterData.endDate);
        this.timeMode = this.filterData.type;
        this.areaMode = EAreaMode.all;
    }

    receiveUserData(data) {
        this.userData = data;
        console.log("this.userData - ", this.userData);
    }

    receiveModalShowData(data) {
        this.modalShow = data;
    }

    // receiveChartSites(chartSites) {
    //     this.sites = chartSites;
    // }

    receiveTrafficChartData(chartData) {
        this.chartDatas = chartData;

        console.log("chartData - ", this.chartDatas);
    }

    ////////////////////////////////////// Tina End //////////////////////////////////////
}
</script>


<style lang="scss" scoped>
</style>




