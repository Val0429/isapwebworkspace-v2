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
                    :areaSelectItem="areaSelectItem"
                    :deviceGroupSelectItem="deviceGroupSelectItem"
                    :deviceSelectItem="deviceSelectItem"
                    :typeSelectItem="typeSelectItem"
                    :countSelectItem="countSelectItem"
                    :areaId="inputFormData.areaId"
                    :groupId="inputFormData.groupId"
                    :deviceId="inputFormData.deviceId"
                    :type="inputFormData.type"
                    :inOrOut="inputFormData.inOrOut"
                    @area_id="receiveAreaId"
                    @group_id="receiveGroupId"
                    @device_id="receiveDeviceId"
                    @type="receiveType"
                    @in_or_out="receiveInOrOut"
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
                    :timeRangeData="pData"
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
import Datetime from "@/services/Datetime";

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
    officeHourItemDetail: any = {};
    // recipient 相關
    modalShow: boolean = false;

    // 接收 Filter Condition 資料 相關
    filterData: any = {};
    responseData: any = {};
    userData: any = [];

    //// Filter Condition End ////

    //// Analysis Filter Start ////

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

    // chart 相關
    trafficChartData: any = [];

    // 整理 showReportData 相關

    siteSummaryFilter: any = [];
    siteSalesRecordsFilter: any = [];
    siteWeathersFilter: any = [];

    areaSummaryFilter: any = [];
    deviceGroupSummaryFilter: any = [];
    deviceSummaryFilter: any = [];

    areaSalesRecordsFilter: any = [];
    deviceGroupSalesRecordsFilter: any = [];
    deviceSalesRecordsFilter: any = [];

    areaWeathersFilter: any = [];
    deviceGroupWeathersFilter: any = [];
    deviceWeathersFilter: any = [];

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
        this.initDatas();
    }

    async initDatas() {
        // Tina
        await this.initRegionTreeSelect();
        await this.siteFilterPermission();
        await this.initSelectItemSite();
        await this.initSelectItemTag();
        await this.initSelectItemTree();
        // await this.initOfficeHour();

        // Ben
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
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 2, valueRatio: -0.02 }
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
                        { value: 7, valueRatio: -0.08 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 8, valueRatio: -0.09 }
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

    clearInputFormData() {
        this.inputFormData = {
            areaId: "all",
            groupId: "all",
            deviceId: "all",
            type: "hour",
            inOrOut: "in"
        };
    }

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
        let tempDeviceGroupSelectItem = { all: this._("w_AllDeviceGroups") };
        this.deviceGroupSelectItem = {};

        let readParam: {
            siteId: string;
            areaId?: string;
            mode: string;
        } = {
            siteId: this.filterData.firstSiteId,
            mode: this.deviceMode
        };
        if (!this.filterData.firstSiteId) {
            return false;

            // 只選擇site
        } else if (this.filterData.firstSiteId && !this.inputFormData.areaId) {
            await this.$server
                .R("/device/group/all", readParam)
                .then((response: any) => {
                    if (response != undefined) {
                        for (const returnValue of response) {
                            // 自定義 tempDeviceGroupSelectItem 的 key 的方式
                            tempDeviceGroupSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceGroupSelectItem = tempDeviceGroupSelectItem;
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    console.log(e);
                    return false;
                });
            // 選擇site和單一area
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId !== "all"
        ) {
            readParam.areaId = this.inputFormData.areaId;
            await this.$server
                .R("/device/group/all", readParam)
                .then((response: any) => {
                    if (response != undefined) {
                        for (const returnValue of response) {
                            // 自定義 tempDeviceGroupSelectItem 的 key 的方式
                            tempDeviceGroupSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceGroupSelectItem = tempDeviceGroupSelectItem;
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    console.log(e);
                    return false;
                });
            // 選擇site和all area
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId === "all"
        ) {
            await this.$server
                .R("/device/group/all", readParam)
                .then((response: any) => {
                    if (response != undefined) {
                        for (const returnValue of response) {
                            // 自定義 tempDeviceGroupSelectItem 的 key 的方式
                            tempDeviceGroupSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceGroupSelectItem = tempDeviceGroupSelectItem;
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

    async initSelectItemDevice() {
        let tempDeviceSelectItem = { all: this._("w_AllDevices") };
        this.deviceSelectItem = {};

        const readParam: {
            siteId: string;
            areaId?: string;
            groupId?: string;
            mode: string;
        } = {
            siteId: this.filterData.firstSiteId,
            mode: this.deviceMode
        };
        if (!this.filterData.firstSiteId) {
            return false;

            // 只選擇site
        } else if (
            this.filterData.firstSiteId &&
            !this.inputFormData.areaId &&
            !this.inputFormData.groupId
        ) {
            await this.$server
                .R("/device", readParam)
                .then((response: any) => {
                    if (response.results.length > 0) {
                        for (const returnValue of response.results) {
                            // 自定義 tempDeviceSelectItem 的 key 的方式
                            tempDeviceSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceSelectItem = tempDeviceSelectItem;
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    console.log(e);
                    return false;
                });
            // 選擇site和單一area
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId !== "all" &&
            (this.inputFormData.groupId === undefined ||
                this.inputFormData.groupId === "") &&
            this.inputFormData.groupId !== "all"
        ) {
            readParam.areaId = this.inputFormData.areaId;
            await this.$server
                .R("/device", readParam)
                .then((response: any) => {
                    if (response.results.length > 0) {
                        for (const returnValue of response.results) {
                            // 自定義 tempDeviceSelectItem 的 key 的方式
                            tempDeviceSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceSelectItem = tempDeviceSelectItem;
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    console.log(e);
                    return false;
                });
            // 選擇site和單一area和單一device group
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId !== "all" &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId !== "all"
        ) {
            readParam.groupId = this.inputFormData.groupId;
            await this.$server
                .R("/device", readParam)
                .then((response: any) => {
                    if (response.results.length > 0) {
                        for (const returnValue of response.results) {
                            // 自定義 tempDeviceSelectItem 的 key 的方式
                            tempDeviceSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceSelectItem = tempDeviceSelectItem;
                    }
                    if (response.results.length === 0) {
                        this.deviceSelectItem = {};
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    console.log(e);
                    return false;
                });
            // 選擇site和all area
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId === "all" &&
            (this.inputFormData.groupId === undefined ||
                this.inputFormData.groupId === "") &&
            this.inputFormData.groupId !== "all"
        ) {
            readParam.areaId = "";
            await this.$server
                .R("/device", readParam)
                .then((response: any) => {
                    if (response.results.length > 0) {
                        for (const returnValue of response.results) {
                            // 自定義 tempDeviceSelectItem 的 key 的方式
                            tempDeviceSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceSelectItem = tempDeviceSelectItem;
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    console.log(e);
                    return false;
                });
            // 選擇site和all area和all device group
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId === "all" &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId === "all"
        ) {
            readParam.groupId = this.inputFormData.groupId;
            await this.$server
                .R("/device", readParam)
                .then((response: any) => {
                    if (response.results.length > 0) {
                        for (const returnValue of response.results) {
                            // 自定義 tempDeviceSelectItem 的 key 的方式
                            tempDeviceSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceSelectItem = tempDeviceSelectItem;
                    }
                    if (response.results.length === 0) {
                        this.deviceSelectItem = {};
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    console.log(e);
                    return false;
                });
            // 選擇site和單一area和all device group
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId !== "all" &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId === "all"
        ) {
            readParam.areaId = this.inputFormData.areaId;
            readParam.groupId = "";
            await this.$server
                .R("/device", readParam)
                .then((response: any) => {
                    if (response.results.length > 0) {
                        for (const returnValue of response.results) {
                            // 自定義 tempDeviceSelectItem 的 key 的方式
                            tempDeviceSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceSelectItem = tempDeviceSelectItem;
                    }
                    if (response.results.length === 0) {
                        this.deviceSelectItem = {};
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

    receiveUserData(data) {
        this.userData = data;
        console.log("this.userData - ", this.userData);
    }

    receiveModalShowData(data) {
        this.modalShow = data;
    }

    //// 以下為 analysis filter ////

    async receiveFilterData(filterData) {
        this.inputFormData = {
            areaId: "",
            groupId: "",
            deviceId: "",
            type: "",
            inOrOut: ""
        };

        await this.$server
            .C("/report/people-counting/summary", filterData)
            .then((response: any) => {
                if (response !== undefined) {
                    this.responseData = response;
                    this.officeHourItemDetail = this.responseData.officeHours;
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
        this.sites = [];

        for (const filterSiteId of this.filterData.siteIds) {
            for (const detail of this.officeHourItemDetail) {
                for (const officeHourSiteId of detail.sites) {
                    if (filterSiteId === officeHourSiteId.objectId) {
                        let tempOfficeHours = [];
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
                        break;
                    }
                }
            }
        }

        /*
		   for (const filterSiteId of this.filterData.siteIds) {
			for (const detail of this.officeHourItemDetail) {
				for (const officeHourSiteId of detail.sites) {
					if (filterSiteId === officeHourSiteId.objectId) {
						tempISite = {
							objectId: officeHourSiteId.objectId,
							name: officeHourSiteId.name,
							officeHour: []
						};

						for (const dayRangesValue of detail.dayRanges) {
							tempISite.officeHour.push({
								startDay: dayRangesValue.startDay,
								endDay: dayRangesValue.endDay,
								startDate: dayRangesValue.startDate,
								endDate: dayRangesValue.endDate
							});
						}

						break;
					}
				}
			}
		}
		*/

        this.sites.push(tempISite);
        this.startDate = new Date(this.filterData.startDate);
        this.endDate = new Date(this.filterData.endDate);
        this.timeMode = this.filterData.type;
        this.areaMode = EAreaMode.all;

        this.initSelectItemArea();
        this.initSelectItemDeviceGroup();
        this.initSelectItemDevice();
        this.clearInputFormData();
        this.filterSiteData();

        console.log(" - ", this.sites);
        console.log(" - ", this.startDate);
        console.log(" - ", this.endDate);
        console.log(" - ", this.timeMode);
        console.log(" - ", this.areaMode);
        console.log(" - ", this.chartDatas);
    }

    checkPramary(
        date1: Date | string,
        date2: Date | string,
        siteId1: string,
        siteId2: string
    ): boolean {
        let tempDate1 = typeof date1 == "string" ? new Date(date1) : date1;
        let tempDate2 = typeof date2 == "string" ? new Date(date2) : date2;

        return (
            Datetime.DateTime2String(tempDate1, "YYYY/MM/DD HH:mm:ss") ==
                Datetime.DateTime2String(tempDate2, "YYYY/MM/DD HH:mm:ss") &&
            siteId1 == siteId2
        );
    }

    filterSiteData() {
        console.log("summaryDatas - ", this.responseData.summaryDatas);

        let tempChartDatas: IChartTrafficData[] = [];
        this.chartDatas = [];

        // 取得date、siteObjectId資料
        for (const summary of this.responseData.summaryDatas) {
            console.log("summary", summary.date);
            let tempChartData: IChartTrafficData = {
                date: summary.date,
                siteObjectId: summary.site.objectId,
                temperatureMin: 0,
                temperatureMax: 0,
                traffic: 0,
                revenue: 0,
                transaction: 0,
                weather: EWeather.none
            };

            let haveSummary = false;
            for (let loopChartData of tempChartDatas) {
                console.log("loopChartData", loopChartData.date);
                if (
                    this.checkPramary(
                        loopChartData.date,
                        summary.date,
                        loopChartData.siteObjectId,
                        summary.site.objectId
                    )
                ) {
                    haveSummary = true;
                    tempChartData = loopChartData;
                    break;
                }
            }
            tempChartData.traffic += summary.in;

            if (!haveSummary) {
                // 取得revenue、transaction資料
                for (const saleRecord of this.responseData.salesRecords) {
                    console.log("saleRecord", saleRecord.date);
                    if (
                        this.checkPramary(
                            tempChartData.date,
                            saleRecord.date,
                            tempChartData.siteObjectId,
                            saleRecord.site.objectId
                        )
                    ) {
                        tempChartData.revenue = saleRecord.revenue;
                        tempChartData.transaction = saleRecord.transaction;
                        break;
                    }
                }

                // 取得weather、temperatureMin、temperatureMax
                for (const weather of this.responseData.weathers) {
                    console.log("weather", weather.date);
                    if (
                        this.checkPramary(
                            tempChartData.date,
                            weather.date,
                            tempChartData.siteObjectId,
                            weather.site.objectId
                        )
                    ) {
                        tempChartData.weather = this.weatherIcon(weather.icon);
                        tempChartData.temperatureMin = weather.temperatureMin;
                        tempChartData.temperatureMax = weather.temperatureMax;
                        break;
                    }
                }
            }

            tempChartDatas.push(tempChartData);
        }

        // console.log('trafficChartData - ', this.trafficChartData);
        console.log(" - ", this.chartDatas);

        this.chartDatas = tempChartDatas;
    }

    async receiveAreaId(areaId) {
        this.inputFormData.areaId = areaId;
        // console.log("areaId - ", this.inputFormData.areaId);

        this.areaSummaryFilter = [];
        this.chartDatas = [];
        let tempChartData: any = {};

        // 依照單一area篩選
        if (this.inputFormData.areaId && this.inputFormData.areaId !== "all") {
            for (const singleData of this.responseData.summaryDatas) {
                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];
                    if (detailKey === "area") {
                        if (
                            this.inputFormData.areaId ===
                            tempSingleData.objectId
                        ) {
                            this.areaSummaryFilter.push(singleData);
                        }
                    }
                }
                // console.log(" - ", this.areaSummaryFilter);
                //console.log("trafficChartData - ", this.trafficChartData);
            }

            // 整理為Morris需要的資料格式
            for (const singleData of this.areaSummaryFilter) {
                console.log("1298 - ", singleData.date);
                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];

                    if (detailKey === "area") {
                        if (
                            this.inputFormData.areaId ===
                            tempSingleData.objectId
                        ) {
                            tempChartData.date = singleData.date;
                            tempChartData.siteObjectId =
                                singleData.site.objectId;
                            tempChartData.traffic = singleData.in;
                        }
                    }
                }
                this.chartDatas.push(tempChartData);
                // console.log(" - ", this.trafficChartData);
            }

            // 取得revenue、transaction資料
            for (const singleData of this.responseData.salesRecords) {
                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];
                    switch (detailKey) {
                        case "revenue":
                            tempChartData.revenue = tempSingleData;
                            break;
                        case "transaction":
                            tempChartData.transaction = tempSingleData;
                            break;
                    }
                }
            }

            // 取得weather、temperatureMin、temperatureMax
            for (const singleData of this.responseData.weathers) {
                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];
                    switch (detailKey) {
                        case "icon":
                            tempChartData.weather = this.weatherIcon(
                                tempSingleData
                            );
                            break;
                        case "temperatureMin":
                            tempChartData.temperatureMin = tempSingleData;
                            break;
                        case "temperatureMax":
                            tempChartData.temperatureMax = tempSingleData;
                            break;
                    }
                }
            }

            // console.log(this.trafficChartData);

            this.inputFormData.groupId = "";
            this.inputFormData.deviceId = "";

            await this.initSelectItemDeviceGroup();
            await this.initSelectItemDevice();

            this.inputFormData.groupId = "all";
            this.inputFormData.deviceId = "all";

            console.log(" - ", this.chartDatas);

            // 依照all area篩選
        } else if (
            this.inputFormData.areaId &&
            this.inputFormData.areaId === "all"
        ) {
            this.inputFormData.groupId = "";
            this.inputFormData.deviceId = "";

            await this.initSelectItemArea();
            await this.initSelectItemDeviceGroup();
            await this.initSelectItemDevice();

            this.inputFormData.groupId = "all";
            this.inputFormData.deviceId = "all";

            // 清除area篩選
        } else if (!this.inputFormData.areaId) {
            this.inputFormData.areaId = "";
            this.inputFormData.groupId = "";
            this.inputFormData.deviceId = "";

            await this.initSelectItemArea();
            await this.initSelectItemDeviceGroup();
            await this.initSelectItemDevice();

            this.inputFormData.groupId = "";
            this.inputFormData.deviceId = "";
        } else {
            return false;
        }
    }

    async receiveGroupId(groupId) {
        this.inputFormData.groupId = groupId;
        console.log("groupId - ", this.inputFormData.groupId);

        this.deviceGroupSummaryFilter = [];

        if (
            this.inputFormData.groupId &&
            this.inputFormData.groupId !== "all"
        ) {
            // 依照單一deviceGroup篩選
            for (const singleData of this.areaSummaryFilter) {
                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];

                    if (detailKey === "deviceGroups") {
                        if (
                            this.inputFormData.groupId ===
                            tempSingleData[0].objectId
                        ) {
                            this.deviceGroupSummaryFilter.push(singleData);
                        }
                    }
                }
                // console.log(" - ", this.deviceGroupSummaryFilter);
            }

            // 整理為Morris需要的資料格式
            for (const singleData of this.deviceGroupSummaryFilter) {
                // TODO: wait Min api
                // temperature: number; --->
                // revenue: number; ---> singleData.in
                // transaction: number; ---> singleData.in
                // weather: number; ---> singleData.in

                // date: Date; ---> singleData.date
                // siteObjectId: string; ---> singleData.site.name
                // traffic: number; ---> singleData.in

                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];

                    if (detailKey === "deviceGroups") {
                        if (
                            this.inputFormData.groupId ===
                            tempSingleData[0].objectId
                        ) {
                            this.trafficChartData.date = singleData.date;
                            this.trafficChartData.siteObjectId =
                                singleData.site.objectId;
                            // this.trafficChartData.temperature = tempSingleData.;
                            // this.trafficChartData.revenue = tempSingleData.;
                            // this.trafficChartData.transaction = tempSingleData.;
                            // this.trafficChartData.weather = tempSingleData.;
                        }
                    }
                }
                //  console.log(" - ", this.trafficChartData);
            }

            this.inputFormData.deviceId = "";
            await this.initSelectItemDevice();
            this.inputFormData.deviceId = "all";

            // 依照all deviceGroups篩選
        } else if (
            this.inputFormData.areaId &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId === "all"
        ) {
            this.inputFormData.deviceId = "";
            await this.initSelectItemDevice();
            this.inputFormData.deviceId = "all";

            // 清除deviceGroups篩選
        } else if (this.inputFormData.areaId && !this.inputFormData.groupId) {
            this.inputFormData.deviceId = "";
            await this.initSelectItemDevice();
        } else {
            return false;
        }
    }

    receiveDeviceId(deviceId) {
        this.inputFormData.deviceId = deviceId;
        console.log("deviceId - ", this.inputFormData.deviceId);

        //
        // // 依照device篩選
        // for (const singleData of this.deviceGroupSummaryFilter) {
        //     for (const detailKey in singleData) {
        //         const tempSingleData = singleData[detailKey];
        //
        //         if (detailKey === "device") {
        //             if (
        //                 this.inputFormData.deviceId === tempSingleData.objectId
        //             ) {
        //                 this.deviceSummaryFilter.push(singleData);
        //             }
        //         }
        //     }
        //     console.log(" - ", this.deviceSummaryFilter);
        // }
        //
        // // 整理為Morris需要的資料格式
        // for (const singleData of this.deviceSummaryFilter) {
        //     // TODO: wait Min api
        //     // temperature: number; --->
        //     // revenue: number; ---> singleData.in
        //     // transaction: number; ---> singleData.in
        //     // weather: number; ---> singleData.in
        //
        //     // date: Date; ---> singleData.date
        //     // siteObjectId: string; ---> singleData.site.name
        //     // traffic: number; ---> singleData.in
        //
        //     for (const detailKey in singleData) {
        //         const tempSingleData = singleData[detailKey];
        //
        //         if (detailKey === "device") {
        //             if (
        //                 this.inputFormData.deviceId === tempSingleData.objectId
        //             ) {
        //                 this.trafficChartData.date = singleData.date;
        //                 this.trafficChartData.siteObjectId =
        //                     singleData.site.objectId;
        //                 // this.trafficChartData.temperature = tempSingleData.;
        //                 // this.trafficChartData.revenue = tempSingleData.;
        //                 // this.trafficChartData.transaction = tempSingleData.;
        //                 // this.trafficChartData.weather = tempSingleData.;
        //             }
        //         }
        //     }
        //     console.log(" - ", this.trafficChartData);
        // }
    }

    receiveType(type) {
        this.inputFormData.type = type;

        console.log("type - ", this.inputFormData.type);
    }

    receiveInOrOut(inOrOut) {
        this.inputFormData.inOrOut = inOrOut;

        console.log("inOrOut - ", this.inputFormData.inOrOut);
    }

    weatherIcon(icon: string): EWeather {
        switch (icon) {
            case "clear-day":
                return EWeather.clearDay;
            case "clear-night":
                return EWeather.clearNight;
            case "rain":
                return EWeather.rain;
            case "snow":
                return EWeather.snow;
            case "sleet":
                return EWeather.sleet;
            case "wind":
                return EWeather.wind;
            case "fog":
                return EWeather.fog;
            case "cloudy":
                return EWeather.cloudy;
            case "partly-cloudy-day":
                return EWeather.partlyCloudyDay;
            case "partly-cloudy-night":
                return EWeather.partlyCloudyNight;
            default:
                return EWeather.none;
        }
    }

    ////////////////////////////////////// Tina End //////////////////////////////////////
}
</script>


<style lang="scss" scoped>
</style>




