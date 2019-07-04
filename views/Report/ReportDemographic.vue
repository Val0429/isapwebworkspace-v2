<template>
    <div class="animated fadeIn">

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

                <template #toolbox>
                    <!-- Ben -->
                    <iv-toolbox-export-excel size="lg" />
                    <iv-toolbox-export-csv size="lg" />

                    <!-- Morris -->
                    <iv-toolbox-export-pdf size="lg" />

                    <!-- Tina -->
                    <iv-toolbox-send-mail
                        size="lg"
                        @click="modalShow = !modalShow"
                    />
                </template>

                <!-- Tina -->
                <analysis_filter_demographic
                    class="mb-4"
                    v-if="filterData.siteIds && filterData.siteIds.length === 1"
                    :areaSelectItem="areaSelectItem"
                    :deviceGroupSelectItem="deviceGroupSelectItem"
                    :deviceSelectItem="deviceSelectItem"
                    :typeSelectItem="typeSelectItem"
                    :timeModeSelectItem="timeModeSelectItem"
                    :areaId="inputFormData.areaId"
                    :groupId="inputFormData.groupId"
                    :deviceId="inputFormData.deviceId"
                    :type="inputFormData.type"
                    @area_id="receiveAreaId"
                    @group_id="receiveGroupId"
                    @device_id="receiveDeviceId"
                    @type="receiveType"
                >

                </analysis_filter_demographic>

                <!-- Morris -->
                <highcharts-demographic
                    ref="test"
                    :startDate="startDate"
                    :endDate="endDate"
                    :sites="sites"
                    :timeMode="timeMode"
                    :areaMode="areaMode"
                    :value="chartDatas"
                >
                </highcharts-demographic>
                <!-- Morris -->

            </iv-card>
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Dialog from "@/services/Dialog/Dialog";

// Tina
import {
    ECountType,
    EDeviceMode,
    EType
} from "@/components/Reports/models/EReport";
import {
    ERegionType,
    IRegionTreeSelected,
    RegionTreeItem
} from "@/components/RegionTree";

import RegionAPI from "@/services/RegionAPI";
import ResponseFilter from "@/services/ResponseFilter";
import Datetime from "@/services/Datetime";

// Morris
import {
    ETimeMode,
    EAreaMode,
    EWeather,
    ISite,
    IDayRange,
    IChartDemographicData,
    EAgeRange
} from "@/components/Reports";
import HighchartsDemographic from "@/components/Reports/HighchartsDemographic.vue";
import WeatherService from "@/components/Reports/models/WeatherService";

enum EPageStep {
    none = "none"
}

@Component({
    components: {}
})
export default class ReportDemographic extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;

    ////////////////////////////////////// Morris Start //////////////////////////////////////
    startDate: Date = new Date("2019-01-01T00:00:00.000Z");
    endDate: Date = new Date("2019-01-01T01:00:00.000Z");
    timeMode: ETimeMode = ETimeMode.none;
    areaMode: EAreaMode = EAreaMode.none;
    sites: ISite[] = [];
    chartDatas: IChartDemographicData[] = [];
    ////////////////////////////////////// Morris End //////////////////////////////////////

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    //// Filter Condition Start ////

    // select 相關
    sitesSelectItem: any = {};
    tagSelectItem: any = {};
    tags = [];

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
    timeModeSelectItem: any = {
        day: ECountType.day,
        week: ECountType.week,
        month: ECountType.month,
        quarter: ECountType.quarter,
        year: ECountType.year
    };

    inputFormData: any = {
        areaId: "",
        groupId: "",
        deviceId: "",
        type: ""
    };

    // chart 相關
    trafficChartData: any = [];

    // 整理 showReportData 相關
    areaSummaryFilter: any = [];
    deviceGroupSummaryFilter: any = [];
    deviceSummaryFilter: any = [];

    //// Analysis Filter End ////

    // send user 相關
    userSelectItem: any = {};

    ////////////////////////////////////// Tina End //////////////////////////////////////

    created() {
        this.initChartDeveloper();
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
    }

    // Morris //
    initChartDeveloper() {
        this.timeMode = ETimeMode.day;
        this.areaMode = EAreaMode.single;

        // single day
        this.startDate = new Date("2019-07-01T08:00:00.000Z");
        this.endDate = new Date("2019-07-01T14:00:00.000Z");

        // multipe day
        // this.startDate = new Date("2019-06-20T08:00:00.000Z");
        // this.endDate = new Date("2019-07-10T14:00:00.000Z");

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
                let ageRange = EAgeRange.none;
                let tempAgeRangeNumber = Math.floor(Math.random() * 300);

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

                if (tempAgeRangeNumber % 6 == 0) {
                    ageRange = EAgeRange.lower20;
                } else if (tempAgeRangeNumber % 6 == 1) {
                    ageRange = EAgeRange.m21_30;
                } else if (tempAgeRangeNumber % 6 == 2) {
                    ageRange = EAgeRange.m31_40;
                } else if (tempAgeRangeNumber % 6 == 3) {
                    ageRange = EAgeRange.m41_50;
                } else if (tempAgeRangeNumber % 6 == 4) {
                    ageRange = EAgeRange.m51_60;
                } else if (tempAgeRangeNumber % 6 == 5) {
                    ageRange = EAgeRange.upper61;
                }

                let tempI = i;
                let iNumber = tempI;
                let iString = tempI.toString();
                let iString10 = iNumber < 10 ? `0${iString}` : iString;
                let tempDate = new Date(
                    `2019-07-${iString10}T${iString10}:00:00.000Z`
                );
                let tempChartData: IChartDemographicData = {
                    date: tempDate,
                    siteObjectId: "site" + (j + 1).toString(),
                    temperatureMin: iNumber,
                    temperatureMax: iNumber,
                    weather: weather,
                    ageRange: ageRange,
                    maleCount: Math.floor(Math.random() * 300),
                    femaleCount: Math.floor(Math.random() * 300)
                };

                if (!isNaN(tempChartData.date.getTime())) {
                    this.chartDatas.push(tempChartData);
                }
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
            type: "hour"
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
            !this.inputFormData.groupId
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

            // 選擇site和單一area和單一device group和 all device
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId !== "all" &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId !== "all" &&
            this.inputFormData.deviceId === "all"
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

    async initSelectItemUsers() {
        let tempUserSelectItem = {};

        await this.$server
            .R("/user/user")
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response.results) {
                        // 自定義 userSelectItem 的 key 的方式
                        tempUserSelectItem[
                            returnValue.objectId
                        ] = `${returnValue.username} - ${returnValue.email}`;
                    }
                    this.userSelectItem = tempUserSelectItem;
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

    async receiveUserData(data) {
        this.userData = [];
        this.userData = data;
        console.log("this.userData - ", this.userData);

        await this.initSelectItemUsers();
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
            type: ""
        };

        await this.$server
            .C("/report/demographic/summary", filterData)
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
                        // console.log('filterSiteId - ', filterSiteId);
                        // console.log('officeHourSiteId.objectId - ', officeHourSiteId.objectId);
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
                        this.sites.push(tempISite);
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

        // this.sites.push(tempISite);
        this.tags = this.filterData.tagIds;
        this.startDate = new Date(this.filterData.startDate);
        this.endDate = new Date(this.filterData.endDate);
        this.timeMode = this.filterData.type;
        this.areaMode = EAreaMode.all;
        this.sortOutChartData(this.responseData.summaryDatas);

        this.initSelectItemArea();
        this.initSelectItemDeviceGroup();
        this.initSelectItemDevice();

        this.inputFormData = {
            areaId: "all",
            groupId: "all",
            deviceId: "all",
            type: this.filterData.type
        };

        console.log(" - ", this.sites);
        console.log(" - ", this.startDate);
        console.log(" - ", this.endDate);
        console.log(" - ", this.timeMode);
        console.log(" - ", this.areaMode);
        console.log(" - ", this.chartDatas);
    }

    checkDateAndSite(
        date1: Date | string,
        date2: Date | string,
        siteId1: string,
        siteId2: string
    ): boolean {
        let tempDate1 = typeof date1 === "string" ? new Date(date1) : date1;
        let tempDate2 = typeof date2 === "string" ? new Date(date2) : date2;

        return (
            Datetime.DateTime2String(tempDate1, "YYYY/MM/DD HH:mm:ss") ===
                Datetime.DateTime2String(tempDate2, "YYYY/MM/DD HH:mm:ss") &&
            siteId1 === siteId2
        );
    }

    swtichAge(data) {
        switch (data) {
            case "0":
                return EAgeRange.lower20;
            case "1":
                return EAgeRange.m21_30;
            case "2":
                return EAgeRange.m31_40;
            case "3":
                return EAgeRange.m41_50;
            case "4":
                return EAgeRange.m51_60;
            case "5":
                return EAgeRange.upper61;
        }
    }

    sortOutChartData(array: any) {
        let tempChartDatas: IChartDemographicData[] = [];
        this.chartDatas = [];

        // 取得date、siteObjectId資料
        for (const summary of array) {
            let tempChartData: IChartDemographicData = {
                date: summary.date,
                siteObjectId: summary.site.objectId,
                ageRange: EAgeRange.none,
                maleCount: 0,
                femaleCount: 0,
                temperatureMin: 0,
                temperatureMax: 0,
                weather: EWeather.none
            };
            console.log("summary - ", summary);

            // 判斷date, site 兩個是否相同
            let haveSummary = false;
            for (let loopChartData of tempChartDatas) {
                if (
                    this.checkDateAndSite(
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

            //分開跑maleRange
            for (const index in summary.maleRanges) {
                tempChartData.ageRange = this.swtichAge(index);
                tempChartData.maleCount = summary.maleRanges[index];
                tempChartData.femaleCount = summary.femaleRanges[index];
                console.log(
                    " //分開跑maleRange",
                    JSON.parse(JSON.stringify(tempChartDatas)),
                    JSON.parse(JSON.stringify(tempChartData)),
                    tempChartData.ageRange
                );
                let tempDate = JSON.parse(JSON.stringify(tempChartData));

                tempChartDatas.push(tempDate);
            }

            if (!haveSummary) {
                // 取得weather、temperatureMin、temperatureMax
                for (const weather of this.responseData.weathers) {
                    if (
                        this.checkDateAndSite(
                            tempChartData.date,
                            weather.date,
                            tempChartData.siteObjectId,
                            weather.site.objectId
                        )
                    ) {
                        console.log(" - ", weather.icon);
                        tempChartData.weather = WeatherService.WeatherIcon(
                            weather.icon
                        );
                        tempChartData.temperatureMin = weather.temperatureMin;
                        tempChartData.temperatureMax = weather.temperatureMax;
                        break;
                    }
                }
            }
        }

        console.log("tempChartDatas", tempChartDatas);

        this.chartDatas = tempChartDatas;

        console.log(" - ", this.chartDatas);
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
            }

            this.sortOutChartData(this.areaSummaryFilter);
            this.areaMode = EAreaMode.single;

            console.log(" - ", this.sites);
            console.log(" - ", this.startDate);
            console.log(" - ", this.endDate);
            console.log(" - ", this.timeMode);
            console.log(" - ", this.areaMode);
            console.log(" - ", this.chartDatas);

            this.inputFormData.groupId = "";
            this.inputFormData.deviceId = "";

            await this.initSelectItemDeviceGroup();
            await this.initSelectItemDevice();

            this.inputFormData.groupId = "all";
            this.inputFormData.deviceId = "all";

            // 依照all area篩選
        } else if (
            this.inputFormData.areaId &&
            this.inputFormData.areaId === "all"
        ) {
            this.sortOutChartData(this.responseData.summaryDatas);
            this.areaMode = EAreaMode.all;

            this.inputFormData.groupId = "";
            this.inputFormData.deviceId = "";

            await this.initSelectItemArea();
            await this.initSelectItemDeviceGroup();
            await this.initSelectItemDevice();

            this.inputFormData.groupId = "all";
            this.inputFormData.deviceId = "all";

            // 清除area篩選
        } else if (!this.inputFormData.areaId) {
            this.sortOutChartData(this.responseData.summaryDatas);
            this.areaMode = EAreaMode.all;

            this.inputFormData.areaId = "";
            this.inputFormData.groupId = "";
            this.inputFormData.deviceId = "";

            await this.initSelectItemArea();
            await this.initSelectItemDeviceGroup();
            await this.initSelectItemDevice();

            this.inputFormData.areaId = "all";
            this.inputFormData.groupId = "all";
            this.inputFormData.deviceId = "all";
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

            this.sortOutChartData(this.deviceGroupSummaryFilter);

            this.inputFormData.deviceId = "";
            await this.initSelectItemDevice();
            this.inputFormData.deviceId = "all";

            // 依照all deviceGroups篩選
        } else if (
            this.inputFormData.areaId &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId === "all"
        ) {
            this.sortOutChartData(this.areaSummaryFilter);

            this.inputFormData.deviceId = "";
            await this.initSelectItemDevice();
            this.inputFormData.groupId = "all";
            this.inputFormData.deviceId = "all";

            // 清除deviceGroups篩選
        } else if (this.inputFormData.areaId && !this.inputFormData.groupId) {
            this.sortOutChartData(this.areaSummaryFilter);

            this.inputFormData.deviceId = "";
            await this.initSelectItemDevice();
            this.inputFormData.groupId = "all";
            this.inputFormData.deviceId = "all";
        } else {
            return false;
        }
    }

    async receiveDeviceId(deviceId) {
        this.inputFormData.deviceId = deviceId;
        console.log("deviceId - ", this.inputFormData.deviceId);

        this.deviceSummaryFilter = [];

        // 依照device篩選
        for (const singleData of this.deviceGroupSummaryFilter) {
            for (const detailKey in singleData) {
                const tempSingleData = singleData[detailKey];

                if (detailKey === "device") {
                    if (
                        this.inputFormData.deviceId === tempSingleData.objectId
                    ) {
                        this.deviceSummaryFilter.push(singleData);
                    }
                }
            }
            console.log(" - ", this.deviceSummaryFilter);
        }

        this.sortOutChartData(this.deviceSummaryFilter);

        // 清除device篩選
        if (
            this.inputFormData.areaId &&
            this.inputFormData.groupId &&
            !this.inputFormData.deviceId
        ) {
            this.sortOutChartData(this.deviceGroupSummaryFilter);

            this.inputFormData.deviceId = "";
            await this.initSelectItemDevice();
            this.inputFormData.deviceId = "all";

            // 依照all device篩選
        } else if (
            this.inputFormData.areaId &&
            this.inputFormData.groupId &&
            this.inputFormData.deviceId === "all"
        ) {
            this.sortOutChartData(this.deviceGroupSummaryFilter);

            this.inputFormData.deviceId = "";
            await this.initSelectItemDevice();
            this.inputFormData.deviceId = "all";
        } else {
            return false;
        }
    }

    receiveType(type) {
        this.inputFormData.type = type;
        this.timeMode = type;
        console.log("type - ", this.inputFormData.type);
    }

    ////////////////////////////////////// Tina End //////////////////////////////////////
}
</script>


<style lang="scss" scoped>
</style>




