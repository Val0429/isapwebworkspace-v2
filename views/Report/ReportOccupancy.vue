<template>
    <div class="animated fadeIn">

        <!-- Tina -->
        <filter-condition
            :sitesSelectItem="sitesSelectItem"
            :tagSelectItem="tagSelectItem"
            :regionTreeItem="regionTreeItem"
            :templateItem="templateItem"
            :label="_('w_ReportFilterConditionComponent_')"
            @submit-data="receiveFilterData"
        >
        </filter-condition>

        <div v-show="pageStep === ePageStep.none">

            <iv-card>

                <template #toolbox>
                    <!-- Ben -->
                    <iv-toolbox-export-excel
                        size="lg"
                        @click="exportExcel(eFileType.xlsx)"
                    />
                    <iv-toolbox-export-csv
                        size="lg"
                        @click="exportExcel(eFileType.csv)"
                    />

                    <iv-toolbox-export-pdf
                        size="lg"
                        @click="exportPDF"
                    />

                    <!-- Tina -->
                    <iv-toolbox-send-mail
                        size="lg"
                        @click="modalShow = !modalShow"
                    />
                </template>

                <!-- Tina -->
                <analysis-filter-demo
                    class="mb-4"
                    :areaSelectItem="areaSelectItem"
                    :deviceGroupSelectItem="deviceGroupSelectItem"
                    :deviceSelectItem="deviceSelectItem"
                    :timeModeSelectItem="timeModeSelectItem"
                    :isIncludedEmployeeSelectItem="isIncludedEmployeeSelectItem"
                    :siteIds="filterData.siteIds"
                    :areaId="inputFormData.areaId"
                    :groupId="inputFormData.groupId"
                    :deviceId="inputFormData.deviceId"
                    :type="inputFormData.type"
                    :isIncludedEmployee="inputFormData.isIncludedEmployee"
                    @area_id="receiveAreaId"
                    @group_id="receiveGroupId"
                    @device_id="receiveDeviceId"
                    @type="receiveType"
                    @is_included_employee="receiveIsIncludedEmployee"
                >

                </analysis-filter-demo>

                <!-- Ben -->
                <anlysis-dashboard
                    ref="anlysisDashboard"
                    :startDate="startDate"
                    :endDate="endDate"
                    :type="dTimeMode"
                    :siteIds="pSiteIds"
                    :tagIds="tags"
                    :pageType="dPageType"
                >
                </anlysis-dashboard>

                <highcharts-occupancy
                    :startDate="startDate"
                    :endDate="endDate"
                    :sites="sites"
                    :timeMode="timeMode"
                    :areaMode="areaMode"
                    :value="chartDatas"
                >
                </highcharts-occupancy>

                <!-- Ben -->
                <report-table
                    v-show="tableStep === eTableStep.mainTable"
                    ref="reportTable"
                    :reportTableData="rData"
                    :reportTableTitle="reportTableTitle"
                    @clickItem="toSunReportTable"
                >
                </report-table>

                <report-table
                    v-show="tableStep === eTableStep.sunTable"
                    ref="sunReportTable"
                    :reportTableData="sunRData"
                    :reportTableTitle="reportTableTitle"
                    @clickItem="toDetailReportTable"
                >
                </report-table>

                <occupancy-details-table
                    v-show="tableStep === eTableStep.detailTable"
                    :thresholdDetailTableContent="detailRData"
                >
                </occupancy-details-table>

                <div class="col-md-12">
                    <b-button
                        v-show="tableStep === eTableStep.sunTable || tableStep === eTableStep.detailTable "
                        variant="secondary"
                        size="lg"
                        @click="reportTableBack"
                    >{{ _('w_Back') }}
                    </b-button>
                </div>

            </iv-card>
        </div>

        <!-- Tina -->
        <recipient
            :modalShow="modalShow"
            :userSelectItem="userSelectItem"
            @user-data="receiveUserData"
            @return-modalShow="receiveModalShowData"
        ></recipient>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Dialog from "@/services/Dialog";

// Tina
import {
    ERegionType,
    IRegionTreeSelected,
    RegionTreeItem
} from "@/components/RegionTree";
import RegionAPI from "@/services/RegionAPI";
import ResponseFilter from "@/services/ResponseFilter";
import Datetime from "@/services/Datetime";
import WeatherService from "@/components/Reports/models/WeatherService";

import HighchartOccupancy from "@/components/Reports/HighchartOccupancy.vue";
import {
    EAreaMode,
    EPageType,
    ESign,
    ETimeMode,
    EWeather,
    IChartOccupancyData,
    IPeckTimeRange,
    ISiteAreas,
    ISiteItems,
    ReportDashboard,
    EChartMode,
    ISite,
    ITemplateItem,
    ReportTableData,
    IFilterCondition,
    ECountType,
    EDeviceMode,
    EIncludedEmployee
} from "@/components/Reports";
import HighchartsService from "@/components/Reports/models/HighchartsService";
import HighchartsTraffic from "@/components/Reports/HighchartsTraffic.vue";
import toExcel from "@/services/Excel/json2excel";
import excel2json from "@/services/Excel/excel2json";
enum EFileType {
    xlsx = "xlsx",
    xls = "xls",
    csv = "csv"
}

///////////////////////// export /////////////////////////
import html2Canvas from "html2canvas";
import JsPDF from "jspdf";
import ReportService from "@/components/Reports/models/ReportService";

enum EPageStep {
    none = "none"
}

enum ETableStep {
    mainTable = "mainTable",
    sunTable = "sunTable",
    detailTable = "detailTable",
    none = "none"
}

@Component({
    components: {}
})
export default class ReportOccupancy extends Vue {
    lastTableStep: ETableStep = ETableStep.none;
    tableStep: ETableStep = ETableStep.none;
    eTableStep = ETableStep;

    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;
    templateItem: ITemplateItem | null = null;
    eFileType = EFileType;

    startDate: Date = new Date("2019-01-01T00:00:00.000Z");
    endDate: Date = new Date("2019-01-01T01:00:00.000Z");
    timeMode: ETimeMode = ETimeMode.none;
    areaMode: EAreaMode = EAreaMode.none;
    sites: ISiteAreas[] = [];
    chartDatas: IChartOccupancyData[] = [];

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
    filterData: IFilterCondition = {
        startDate: new Date(),
        endDate: new Date(),
        firstSiteId: "",
        siteIds: [],
        tagIds: [],
        type: ETimeMode.none
    };
    responseData: any = {};
    userData: any = [];
    allAreaItem: any = [];
    siteAreaItem: any = {};
    sitesItem: any = [];

    //// Filter Condition End ////

    //// Analysis Filter Start ////
    deviceMode: string = EDeviceMode.humanDetection;

    // select 相關
    areaSelectItem: any = {};
    deviceGroupSelectItem: any = {};
    deviceSelectItem: any = {};

    timeModeSelectItem: any = {
        day: ECountType.day,
        week: ECountType.week,
        month: ECountType.month,
        quarter: ECountType.quarter,
        year: ECountType.year
    };
    isIncludedEmployeeSelectItem: any = {
        yes: EIncludedEmployee.yes,
        no: EIncludedEmployee.no
    };

    inputFormData: any = {
        areaId: "",
        groupId: "",
        deviceId: "",
        type: "",
        isIncludedEmployee: "no"
    };

    // 整理 showReportData 相關
    areaSummaryFilter: any = [];
    deviceGroupSummaryFilter: any = [];
    deviceSummaryFilter: any = [];

    //// Analysis Filter End ////

    // send user 相關
    userSelectItem: any = {};

    //ReportDashboard 相關
    dPageType: EPageType = EPageType.none;
    dTimeMode: ETimeMode = ETimeMode.none;
    pSiteIds = [];

    //ReportTable 相關
    rData = new ReportTableData();
    reportTableTitle = {};

    //Sun ReportTable 相關
    sunRData = new ReportTableData();

    ///deatal ReportTable 相關
    detailRData = [];

    ////////////////////////////////////// Tina End //////////////////////////////////////

    created() {
        this.initDatas();
        this.initTemplate();
    }

    mounted() {}

    initTemplate() {
        if (this.$route.query.template != undefined) {
            let templateJSON: string = this.$route.query.template as string;
            this.templateItem = ReportService.analysisTemplate(templateJSON);
        }
    }

    async initDatas() {
        // Tina
        await this.initRegionTreeSelect();
        await this.siteFilterPermission();
        await this.initSelectItemTag();
        await this.initSelectItemTree();
        await this.initSelectItemUsers();
    }

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
                ],
                areas: [
                    {
                        objectId: "area1" + tempJ.toString(),
                        name: "Area 1" + tempJ.toString()
                    },
                    {
                        objectId: "area2" + tempJ.toString(),
                        name: "Area 2" + tempJ.toString()
                    }
                    // {
                    //     objectId: "area3" + tempJ.toString(),
                    //     name: "Area 3" + tempJ.toString()
                    // },
                    // {
                    //     objectId: "area4" + tempJ.toString(),
                    //     name: "Area 4" + tempJ.toString()
                    // },
                    // {
                    //     objectId: "area5" + tempJ.toString(),
                    //     name: "Area 5" + tempJ.toString()
                    // }
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
                let tempDate = new Date(
                    `2019-07-${iString10}T${iString10}:00:00.000Z`
                );

                for (let area of this.sites[j].areas) {
                    let tempChartData: IChartOccupancyData = {
                        date: tempDate,
                        siteObjectId: "site" + (j + 1).toString(),
                        temperatureMin: iNumber,
                        temperatureMax: iNumber,
                        weather: weather,
                        areaId: area.objectId,
                        occupancy: Math.floor(Math.random() * 50)
                    };
                    if (!isNaN(tempChartData.date.getTime())) {
                        this.chartDatas.push(tempChartData);
                    }
                }
            }
        }
    }

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
        let tempTree = {};
        let tempChildrenArray = [];

        await this.$server
            .R("/location/tree")
            .then((response: any) => {
                if (response != undefined) {
                    tempTree = response;
                    if (this.$user.allowSites.length > 0) {
                        this.$user.allowSites.map(site => {
                            if (response.childrens.length > 0) {
                                response.childrens.map(item => {
                                    if (item.objectId === site.objectId) {
                                        let tempTreeData = JSON.parse(
                                            JSON.stringify(tempTree)
                                        );
                                        tempTreeData.childrens = [];
                                        tempChildrenArray.push(item);
                                        tempTreeData.childrens = tempChildrenArray;
                                        tempTree = tempTreeData;
                                    }
                                });
                            }
                        });
                    }

                    this.regionTreeItem.tree = RegionAPI.analysisApiResponse(
                        tempTree
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
                        this.allAreaItem = response;
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
    }

    receiveModalShowData(data) {
        this.modalShow = data;
    }

    //// 以下為 analysis filter ////

    async receiveFilterData(filterData) {
        let param = JSON.parse(JSON.stringify(filterData));
        this.filterData = filterData;
        this.inputFormData = {
            areaId: "",
            groupId: "",
            deviceId: "",
            type: "",
            isIncludedEmployee: "no"
        };

        await this.$server
            .C("/report/human-detection/summary", param)
            .then((response: any) => {
                if (response !== undefined) {
                    this.responseData = response;
                    this.officeHourItemDetail = this.responseData.officeHours;
                    this.resolveSummary();
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

    async resolveSummary() {
        console.log("this.filterData  - ", this.filterData);
        console.log("this.responseData  - ", this.responseData);

        await this.initSelectItemArea();
        this.initSelectItemDeviceGroup();
        this.initSelectItemDevice();

        this.inputFormData = {
            areaId: "all",
            groupId: "all",
            deviceId: "all",
            type: this.filterData.type,
            isIncludedEmployee: "no"
        };

        // get office hour data
        let tempISite: any = {};
        this.sites = [];
        let tempAreas = [];

        for (const filterSiteId of this.filterData.siteIds) {
            for (const detail of this.officeHourItemDetail) {
                for (const singleArea of this.allAreaItem) {
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

                            this.siteAreaItem = {
                                objectId: officeHourSiteId.objectId,
                                name: officeHourSiteId.name,
                                officeHour: tempOfficeHours
                            };

                            if (filterSiteId === singleArea.site.objectId) {
                                let tempArea: any = {};
                                tempArea = {
                                    name: singleArea.name,
                                    objectId: singleArea.objectId
                                };
                                tempAreas.push(tempArea);
                            }
                        }
                    }
                }
            }
            tempISite.areas = tempAreas;
            this.sites.push(tempISite);
            this.sitesItem.push(tempISite);
        }

        // this.sites.push(tempISite);
        this.dTimeMode = this.filterData.type;
        this.pSiteIds = this.filterData.siteIds;
        this.tags = this.filterData.tagIds;
        this.startDate = new Date(this.filterData.startDate);
        this.endDate = new Date(this.filterData.endDate);
        this.timeMode = this.filterData.type;
        this.areaMode = EAreaMode.all;
        this.sortOutChartData(this.responseData.summaryTableDatas);

        // Ben
        this.initDashboardData();
        this.initReportTable();

        console.log("this.sites - ", this.sites);
        console.log(" - ", this.startDate);
        console.log(" - ", this.endDate);
        console.log(" - ", this.timeMode);
        console.log(" - ", this.areaMode);
        console.log(" - ", this.chartDatas);
    }

    // Ben //
    reportTableBack() {
        this.tableStep = this.lastTableStep;
        this.lastTableStep = ETableStep.mainTable;
    }

    initDashboardData() {
        this.dPageType = EPageType.averageOccupancy;
        setTimeout(() => {
            let anlysisDashboard: any = this.$refs.anlysisDashboard;
            anlysisDashboard.initData();
        }, 300);
    }

    initSunReportTable(summaryTableDatas) {
        this.lastTableStep = this.tableStep;
        this.tableStep = ETableStep.sunTable;
        let chartMode = EChartMode.site1Day1;

        this.sunRData.chartMode = chartMode;
        this.sunRData.noFoot = true;
        this.sunRData.thatDay = this.startDate; //單天記錄時間日期

        //head
        this.sunRData.head = [];
        let sTime = null;
        let eTime = null;
        for (let siteItem of this.sites) {
            for (let officeHourItem of siteItem.officeHour) {
                if (
                    sTime == null ||
                    sTime > new Date(officeHourItem.startDate).getHours()
                ) {
                    sTime = new Date(officeHourItem.startDate).getHours();
                }
                if (
                    eTime == null ||
                    eTime < new Date(officeHourItem.endDate).getHours()
                ) {
                    eTime = new Date(officeHourItem.endDate).getHours();
                }
            }
        }
        while (sTime <= eTime) {
            this.sunRData.head.push(sTime);
            sTime++;
        }

        //body
        this.sunRData.body = [];
        let tempArray = [];
        //篩選出所有店
        for (let summaryData of summaryTableDatas) {
            if (
                summaryData.deviceGroups &&
                summaryData.deviceGroups.length > 0
            ) {
                for (let deviceGroup of summaryData.deviceGroups) {
                    let body = {
                        site: summaryData.site,
                        area: summaryData.area,
                        group: deviceGroup,
                        in: [],
                        out: [],
                        in2: [],
                        out2: []
                    };

                    if (
                        tempArray.every(
                            t =>
                                t.group == undefined ||
                                t.group.objectId != body.group.objectId
                        )
                    ) {
                        tempArray.push(body);
                    }
                }
            } else {
                let body = {
                    site: summaryData.site,
                    area: summaryData.area,
                    group: null,
                    in: [],
                    out: [],
                    in2: [],
                    out2: []
                };

                if (
                    tempArray.every(
                        t =>
                            t.area == undefined ||
                            t.area.objectId != body.area.objectId
                    )
                ) {
                    tempArray.push(body);
                }
            }
        }

        //填入資料
        for (let index in tempArray) {
            for (let head of this.sunRData.head) {
                let inCount = { value: 0, valueRatio: 0, link: false };
                let outCount = { value: 0, valueRatio: 0, link: true };
                let in2Count = { value: 0, valueRatio: 0, link: true };
                let out2Count = { value: 0, valueRatio: 0, link: false };
                for (let summaryData of summaryTableDatas) {
                    if (
                        new Date(summaryData.date).getHours().toString() != head
                    ) {
                        continue;
                    }
                    if (tempArray[index].group != null) {
                        for (let deviceGroup of summaryData.deviceGroups) {
                            if (
                                tempArray[index].group.objectId ==
                                deviceGroup.objectId
                            ) {
                                inCount.value += Math.round(
                                    summaryData.total / summaryData.count
                                );
                                inCount.valueRatio += 0;
                                outCount.value += summaryData.mediumThreshold;
                                outCount.valueRatio += 0;
                                in2Count.value += summaryData.highThreshold;
                                in2Count.valueRatio += 0;
                                out2Count.value += summaryData.maxValue;
                                out2Count.valueRatio += 0;
                            }
                        }
                    } else {
                        if (
                            tempArray[index].area.objectId ==
                            summaryData.area.objectId
                        ) {
                            inCount.value += Math.round(
                                summaryData.total / summaryData.count
                            );
                            inCount.valueRatio += 0;
                            outCount.value += summaryData.mediumThreshold;
                            outCount.valueRatio += 0;
                            in2Count.value += summaryData.highThreshold;
                            in2Count.valueRatio += 0;
                            out2Count.value += summaryData.maxValue;
                            out2Count.valueRatio += 0;
                        }
                    }
                }
                tempArray[index].in.push(inCount);
                tempArray[index].out.push(outCount);
                tempArray[index].in2.push(in2Count);
                tempArray[index].out2.push(out2Count);
            }
            this.sunRData.body = tempArray;
        }
        //調整head時間格式
        this.sunRData.head = this.sunRData.head.map(
            x => x + ":00 - " + (x + 1) + ":00"
        );
    }

    initReportTable() {
        this.lastTableStep = this.tableStep;
        this.tableStep = ETableStep.mainTable;
        let chartMode = HighchartsService.chartMode(
            this.startDate,
            this.endDate,
            this.sites
        );
        this.rData.chartMode = chartMode;
        this.rData.noFoot = true;

        this.reportTableTitle = {
            titleCount: 4,
            title1: this._("w_Average_Occupancy"),
            title2: this._("w_Over_Medium_Threshold"),
            title3: this._("w_Over_High_Threshold"),
            title4: this._("w_Max_Occupancy")
        };

        //head
        this.rData.head = [];
        let sTime = null;
        let eTime = null;
        switch (chartMode) {
            case EChartMode.site1Day1:
            case EChartMode.siteXDay1:
                this.rData.thatDay = this.startDate; //單天記錄時間日期
                for (let siteItem of this.sites) {
                    for (let officeHourItem of siteItem.officeHour) {
                        if (
                            sTime == null ||
                            sTime >
                                new Date(officeHourItem.startDate).getHours()
                        ) {
                            sTime = new Date(
                                officeHourItem.startDate
                            ).getHours();
                        }
                        if (
                            eTime == null ||
                            eTime < new Date(officeHourItem.endDate).getHours()
                        ) {
                            eTime = new Date(officeHourItem.endDate).getHours();
                        }
                    }
                }
                while (sTime <= eTime) {
                    this.rData.head.push(sTime);
                    sTime++;
                }

                break;
            case EChartMode.site1DayX:
            case EChartMode.siteXDayX:
                this.rData.thatDay = null; //多天無當天時間
                let sDate = new Date(this.startDate);
                let eDate = new Date(this.endDate);
                while (sDate <= eDate) {
                    this.rData.head.push(sDate.toString());
                    sDate.setDate(sDate.getDate() + 1);
                }

                break;
        }

        //body
        this.rData.body = [];
        let tempArray = [];
        //篩選出所有店
        for (let summaryData of this.responseData.summaryTableDatas) {
            if (
                summaryData.deviceGroups &&
                summaryData.deviceGroups.length > 0
            ) {
                for (let deviceGroup of summaryData.deviceGroups) {
                    let body = {
                        site: summaryData.site,
                        area: summaryData.area,
                        group: deviceGroup,
                        in: [],
                        out: [],
                        in2: [],
                        out2: []
                    };

                    if (
                        tempArray.every(
                            t =>
                                t.group == undefined ||
                                t.group.objectId != body.group.objectId
                        )
                    ) {
                        tempArray.push(body);
                    }
                }
            } else {
                let body = {
                    site: summaryData.site,
                    area: summaryData.area,
                    group: null,
                    in: [],
                    out: [],
                    in2: [],
                    out2: []
                };

                if (
                    tempArray.every(
                        t =>
                            t.area == undefined ||
                            t.area.objectId != body.area.objectId
                    )
                ) {
                    tempArray.push(body);
                }
            }
        }

        //填入資料
        switch (chartMode) {
            case EChartMode.site1Day1:
            case EChartMode.siteXDay1:
                for (let index in tempArray) {
                    for (let head of this.rData.head) {
                        let inCount = { value: 0, valueRatio: 0, link: false };
                        let outCount = { value: 0, valueRatio: 0, link: true };
                        let in2Count = { value: 0, valueRatio: 0, link: true };
                        let out2Count = {
                            value: 0,
                            valueRatio: 0,
                            link: false
                        };
                        for (let summaryData of this.responseData
                            .summaryTableDatas) {
                            if (
                                new Date(summaryData.date)
                                    .getHours()
                                    .toString() != head
                            ) {
                                continue;
                            }

                            if (tempArray[index].group != null) {
                                for (let deviceGroup of summaryData.deviceGroups) {
                                    if (
                                        tempArray[index].group.objectId ==
                                        deviceGroup.objectId
                                    ) {
                                        inCount.value += Math.round(
                                            summaryData.total /
                                                summaryData.count
                                        );
                                        inCount.valueRatio += 0;
                                        outCount.value +=
                                            summaryData.mediumThreshold;
                                        outCount.valueRatio += 0;
                                        in2Count.value +=
                                            summaryData.highThreshold;
                                        in2Count.valueRatio += 0;
                                        out2Count.value += summaryData.maxValue;
                                        out2Count.valueRatio += 0;
                                    }
                                }
                            } else {
                                if (
                                    tempArray[index].area.objectId ==
                                    summaryData.area.objectId
                                ) {
                                    inCount.value += Math.round(
                                        summaryData.total / summaryData.count
                                    );
                                    inCount.valueRatio += 0;
                                    outCount.value +=
                                        summaryData.mediumThreshold;
                                    outCount.valueRatio += 0;
                                    in2Count.value += summaryData.highThreshold;
                                    in2Count.valueRatio += 0;
                                    out2Count.value += summaryData.maxValue;
                                    out2Count.valueRatio += 0;
                                }
                            }
                        }
                        tempArray[index].in.push(inCount);
                        tempArray[index].out.push(outCount);
                        tempArray[index].in2.push(in2Count);
                        tempArray[index].out2.push(out2Count);
                    }
                }
                this.rData.head = this.rData.head.map(
                    x => x + ":00 - " + (x + 1) + ":00"
                );
                break;
            case EChartMode.site1DayX:
            case EChartMode.siteXDayX:
                for (let index in tempArray) {
                    for (let head of this.rData.head) {
                        let inCount = { value: 0, valueRatio: 0, link: false };
                        let outCount = { value: 0, valueRatio: 0, link: true };
                        let in2Count = { value: 0, valueRatio: 0, link: true };
                        let out2Count = {
                            value: 0,
                            valueRatio: 0,
                            link: false
                        };
                        for (let summaryData of this.responseData
                            .summaryTableDatas) {
                            if (
                                new Date(summaryData.date).getFullYear() !=
                                    new Date(head).getFullYear() ||
                                new Date(summaryData.date).getMonth() !=
                                    new Date(head).getMonth() ||
                                new Date(summaryData.date).getDate() !=
                                    new Date(head).getDate()
                            ) {
                                continue;
                            }
                            if (tempArray[index].group != null) {
                                for (let deviceGroup of summaryData.deviceGroups) {
                                    if (
                                        tempArray[index].group.objectId ==
                                        deviceGroup.objectId
                                    ) {
                                        inCount.value += Math.round(
                                            summaryData.total /
                                                summaryData.count
                                        );
                                        inCount.valueRatio += 0;
                                        outCount.value +=
                                            summaryData.mediumThreshold;
                                        outCount.valueRatio += 0;
                                        in2Count.value +=
                                            summaryData.highThreshold;
                                        in2Count.valueRatio += 0;
                                        out2Count.value += summaryData.maxValue;
                                        out2Count.valueRatio += 0;
                                    }
                                }
                            } else {
                                if (
                                    tempArray[index].area.objectId ==
                                    summaryData.area.objectId
                                ) {
                                    inCount.value += Math.round(
                                        summaryData.total / summaryData.count
                                    );
                                    inCount.valueRatio += 0;
                                    outCount.value +=
                                        summaryData.mediumThreshold;
                                    outCount.valueRatio += 0;
                                    in2Count.value += summaryData.highThreshold;
                                    in2Count.valueRatio += 0;
                                    out2Count.value += summaryData.maxValue;
                                    out2Count.valueRatio += 0;
                                }
                            }
                        }
                        tempArray[index].in.push(inCount);
                        tempArray[index].out.push(outCount);
                        tempArray[index].in2.push(in2Count);
                        tempArray[index].out2.push(out2Count);
                    }
                }
                this.rData.head = this.rData.head.map(
                    x =>
                        new Date(x).getFullYear() +
                        "/" +
                        (new Date(x).getMonth() + 1) +
                        "/" +
                        new Date(x).getDate() +
                        " " +
                        ReportService.showWeek(new Date(x).getDay())
                );
                break;
        }

        this.rData.body = tempArray;
    }

    async toSunReportTable(thatDay, sunTime, sunSite, sunArea, rowName) {
        if (!thatDay) {
            let tempDate = new Date(sunTime.split(" ")[0]); //去掉星期
            let sDate = new Date(
                tempDate.getFullYear(),
                tempDate.getMonth(),
                tempDate.getDate()
            ).toISOString();
            let eDate = new Date(
                tempDate.getFullYear(),
                tempDate.getMonth(),
                tempDate.getDate()
            ).toISOString();
            let filterData = {
                startDate: sDate,
                endDate: eDate,
                type: "hour",
                siteIds: [sunSite],
                tagIds: []
            };

            let summaryTableDatas;
            let officeHours;
            await this.$server
                .C("/report/human-detection/summary", filterData)
                .then((response: any) => {
                    if (response !== undefined) {
                        summaryTableDatas = response.summaryTableDatas;
                        this.initSunReportTable(summaryTableDatas);
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    console.log(e);
                    return false;
                });
        } else {
            this.toDetailReportTable(
                thatDay,
                sunTime,
                sunSite,
                sunArea,
                rowName
            );
        }
    }

    async toDetailReportTable(thatDay, sunTime, sunSite, sunArea, rowName) {
        this.lastTableStep = this.tableStep;
        this.tableStep = ETableStep.detailTable;
        let tempTime = parseInt(sunTime.split(":")[0]);
        console.log(
            "toDetailReportTable",
            thatDay,
            sunTime,
            sunSite,
            sunArea,
            rowName,
            tempTime
        );

        let tempSDate = new Date(
            thatDay.getFullYear(),
            thatDay.getMonth(),
            thatDay.getDate(),
            tempTime
        ).toISOString();
        let tempEDate = new Date(
            thatDay.getFullYear(),
            thatDay.getMonth(),
            thatDay.getDate(),
            tempTime + 1
        ).toISOString();

        let filterData = {
            startDate: tempSDate,
            endDate: tempEDate,
            type: rowName == "out" ? "medium" : "high",
            areaId: sunArea
        };

        let summaryTableDatas;
        let officeHours;
        await this.$server
            .C("/report/human-detection/summary-threshold", filterData)
            .then((response: any) => {
                if (response !== undefined) {
                    this.detailRData = response;
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

    checkDateAndSite(
        date1: Date | string,
        date2: Date | string,
        siteId1: string,
        siteId2: string
    ): boolean {
        let tempDate1 =
            typeof date1 === "string"
                ? Datetime.DateToZero(new Date(date1))
                : Datetime.DateToZero(date1);
        let tempDate2 =
            typeof date2 === "string"
                ? Datetime.DateToZero(new Date(date2))
                : Datetime.DateToZero(date2);

        return (
            Datetime.DateTime2String(tempDate1, "YYYY/MM/DD HH:mm:ss") ===
                Datetime.DateTime2String(tempDate2, "YYYY/MM/DD HH:mm:ss") &&
            siteId1 === siteId2
        );
    }

    checkDateAndSiteAndArea(
        date1: Date | string,
        date2: Date | string,
        siteId1: string,
        siteId2: string,
        areaId1: string,
        areaId2: string
    ): boolean {
        let tempDate1 = typeof date1 === "string" ? new Date(date1) : date1;
        let tempDate2 = typeof date2 === "string" ? new Date(date2) : date2;

        return (
            Datetime.DateTime2String(tempDate1, "YYYY/MM/DD HH:mm:ss") ===
                Datetime.DateTime2String(tempDate2, "YYYY/MM/DD HH:mm:ss") &&
            siteId1 === siteId2 &&
            areaId1 === areaId1
        );
    }

    sortOutChartData(datas: any) {
        let tempChartDatas: IChartOccupancyData[] = [];
        let isOneDay = false;

        // all area
        if (
            (this.inputFormData.areaId && this.inputFormData.areaId === "all") ||
            !this.inputFormData.areaId
        ) {

        	console.log('all area - ', );

	        this.sitesItem.map(item => {
		        for (let i = 0; i < item.areas.length; i++) {

		        	console.log(' - ', item.areas.length);

				// 取得date、siteObjectId資料
			        if (
				        Datetime.IsOneDate(
					        this.filterData.startDate,
					        this.filterData.endDate
				        )
			        ) {
				        isOneDay = true;

				        // one day
				        for (let i = 0; i < 24; i++) {
					        let tempDate = Datetime.DateToZero(
						        this.filterData.startDate
					        );
					        tempDate.setHours(i);
					        let tempDateChartData = {
						        date: tempDate,
						        siteObjectId: "",
						        temperatureMin: 0,
						        temperatureMax: 0,
						        weather: EWeather.none,
						        occupancy: 0,
						        areaId: ""
					        };

					        for (let siteId of this.filterData.siteIds) {
						        let tempSiteChartData = JSON.parse(
							        JSON.stringify(tempDateChartData)
						        );
						        tempSiteChartData.date = new Date(
							        tempSiteChartData.date
						        );
						        tempSiteChartData.siteObjectId = siteId;
						        tempChartDatas.push(tempSiteChartData);
					        }
				        }
			        } else {
				        // multiple days
				        let dateList = Datetime.DateList(
					        this.filterData.startDate,
					        this.filterData.endDate
				        );
				        for (let dateItem of dateList) {
					        let tempDateChartData = {
						        date: new Date(dateItem.getTime()),
						        siteObjectId: "",
						        temperatureMin: 0,
						        temperatureMax: 0,
						        weather: EWeather.none,
						        occupancy: 0,
						        areaId: ""
					        };
					        for (let siteId of this.filterData.siteIds) {
						        let tempSiteChartData = JSON.parse(
							        JSON.stringify(tempDateChartData)
						        );
						        tempSiteChartData.date = new Date(
							        tempSiteChartData.date
						        );
						        tempSiteChartData.siteObjectId = siteId;
						        tempChartDatas.push(tempSiteChartData);
					        }
				        }
			        }

			        item.areas.map(area => {
				        // 計算 occupancy
				        for (let summary of datas) {
					        let summaryDateFormat = isOneDay
						        ? Datetime.DateTime2String(
							        new Date(summary.date),
							        "YYYY-MM-DD HH"
						        )
						        : Datetime.DateTime2String(
							        new Date(summary.date),
							        "YYYY-MM-DD"
						        );

					        for (let tempChartData of tempChartDatas) {
						        let tempDateFormat = isOneDay
							        ? Datetime.DateTime2String(
								        tempChartData.date,
								        "YYYY-MM-DD HH"
							        )
							        : Datetime.DateTime2String(
								        tempChartData.date,
								        "YYYY-MM-DD"
							        );
						        if (
							        summaryDateFormat == tempDateFormat &&
							        summary.site.objectId == tempChartData.siteObjectId
						        ) {

						        	console.log('summary.total - ', summary.total);
						        	console.log('summary.count - ', summary.count);
						        	console.log(' - ', area.objectId);

							        tempChartData.occupancy = summary.total / summary.count;
							        tempChartData.areaId = area.objectId;
							        break;
						        }
					        }
				        }

				        for (let tempChartData of tempChartDatas) {
					        let tempDateFormat = isOneDay
						        ? Datetime.DateTime2String(
							        tempChartData.date,
							        "YYYY-MM-DD HH"
						        )
						        : Datetime.DateTime2String(
							        tempChartData.date,
							        "YYYY-MM-DD"
						        );
					        for (let i in this.responseData.weathers) {
						        let weather = this.responseData.weathers[i];
						        let weatherDateFormat = isOneDay
							        ? Datetime.DateTime2String(
								        new Date(weather.date),
								        "YYYY-MM-DD HH"
							        )
							        : Datetime.DateTime2String(
								        new Date(weather.date),
								        "YYYY-MM-DD"
							        );
						        if (
							        weatherDateFormat == tempDateFormat &&
							        weather.site.objectId == tempChartData.siteObjectId
						        ) {
							        tempChartData.weather = WeatherService.WeatherIcon(
								        weather.icon
							        );
							        tempChartData.temperatureMin = weather.temperatureMin;
							        tempChartData.temperatureMax = weather.temperatureMax;
							        // this.responseData.weathers.splice(i, 1);
							        break;
						        }
					        }
				        }

				        console.log("!!! 1", new Date().getTime());
				        this.chartDatas = tempChartDatas;
			        });


		        }
	        });


            // 單一 area
        } else if (
            this.inputFormData.areaId &&
            this.inputFormData.areaId !== "all"
        ) {
            // 取得date、siteObjectId資料
            if (
                Datetime.IsOneDate(
                    this.filterData.startDate,
                    this.filterData.endDate
                )
            ) {
                isOneDay = true;

                // one day
                for (let i = 0; i < 24; i++) {
                    let tempDate = Datetime.DateToZero(
                        this.filterData.startDate
                    );
                    tempDate.setHours(i);
                    let tempDateChartData = {
                        date: tempDate,
                        siteObjectId: "",
                        temperatureMin: 0,
                        temperatureMax: 0,
                        weather: EWeather.none,
                        occupancy: 0,
                        areaId: this.inputFormData.areaId
                    };

                    for (let siteId of this.filterData.siteIds) {
                        let tempSiteChartData = JSON.parse(
                            JSON.stringify(tempDateChartData)
                        );
                        tempSiteChartData.date = new Date(
                            tempSiteChartData.date
                        );
                        tempSiteChartData.siteObjectId = siteId;
                        tempChartDatas.push(tempSiteChartData);
                    }
                }
            } else {
                // multiple days
                let dateList = Datetime.DateList(
                    this.filterData.startDate,
                    this.filterData.endDate
                );
                for (let dateItem of dateList) {
                    let tempDateChartData = {
                        date: new Date(dateItem.getTime()),
                        siteObjectId: "",
                        temperatureMin: 0,
                        temperatureMax: 0,
                        weather: EWeather.none,
                        occupancy: 0,
                        areaId: this.inputFormData.areaId
                    };
                    for (let siteId of this.filterData.siteIds) {
                        let tempSiteChartData = JSON.parse(
                            JSON.stringify(tempDateChartData)
                        );
                        tempSiteChartData.date = new Date(
                            tempSiteChartData.date
                        );
                        tempSiteChartData.siteObjectId = siteId;
                        tempChartDatas.push(tempSiteChartData);
                    }
                }
            }

            let total: any = 0;
            let count: any = 0;

            // 計算 occupancy
            for (let summary of datas) {
                let summaryDateFormat = isOneDay
                    ? Datetime.DateTime2String(
                          new Date(summary.date),
                          "YYYY-MM-DD HH"
                      )
                    : Datetime.DateTime2String(
                          new Date(summary.date),
                          "YYYY-MM-DD"
                      );

                for (let tempChartData of tempChartDatas) {
                    let tempDateFormat = isOneDay
                        ? Datetime.DateTime2String(
                              tempChartData.date,
                              "YYYY-MM-DD HH"
                          )
                        : Datetime.DateTime2String(
                              tempChartData.date,
                              "YYYY-MM-DD"
                          );
                    if (
                        summaryDateFormat == tempDateFormat &&
                        summary.site.objectId == tempChartData.siteObjectId
                    ) {

                        tempChartData.occupancy = summary.total / summary.count;
                        break;
                    }
                }
            }

            for (let tempChartData of tempChartDatas) {
                let tempDateFormat = isOneDay
                    ? Datetime.DateTime2String(
                          tempChartData.date,
                          "YYYY-MM-DD HH"
                      )
                    : Datetime.DateTime2String(
                          tempChartData.date,
                          "YYYY-MM-DD"
                      );
                for (let i in this.responseData.weathers) {
                    let weather = this.responseData.weathers[i];
                    let weatherDateFormat = isOneDay
                        ? Datetime.DateTime2String(
                              new Date(weather.date),
                              "YYYY-MM-DD HH"
                          )
                        : Datetime.DateTime2String(
                              new Date(weather.date),
                              "YYYY-MM-DD"
                          );
                    if (
                        weatherDateFormat == tempDateFormat &&
                        weather.site.objectId == tempChartData.siteObjectId
                    ) {
                        tempChartData.weather = WeatherService.WeatherIcon(
                            weather.icon
                        );
                        tempChartData.temperatureMin = weather.temperatureMin;
                        tempChartData.temperatureMax = weather.temperatureMax;
                        // this.responseData.weathers.splice(i, 1);
                        break;
                    }
                }
            }

            console.log("!!! 1", new Date().getTime());
            this.chartDatas = tempChartDatas;
        }
    }

    // sortOutChartData(array: any) {
    //     console.log("areaSelectItem - ", this.areaSelectItem);
    //     console.log("areaId - ", this.inputFormData.areaId);
    //
    //
    //     let tempChartDatas: IChartOccupancyData[] = [];
    //     let isOneDay = false;
    //
    //
    //     // all area
    //     if (
    //         (this.inputFormData.areaId &&
    //             this.inputFormData.areaId === "all") ||
    //         !this.inputFormData.areaId
    //     ) {
    //         let tempChartDatas: IChartOccupancyData[] = [];
    //         this.chartDatas = [];
    //
    //         // 取得date、siteObjectId資料
    //         for (const summary of array) {
    //             let tempChartData: IChartOccupancyData = {
    //                 date: summary.date,
    //                 siteObjectId: "",
    //                 temperatureMin: 0,
    //                 temperatureMax: 0,
    //                 weather: EWeather.none,
    //                 areaId: "",
    //                 occupancy: 0
    //             };
    //
    //             let total: any = 0;
    //             let count: any = 0;
    //             let average: any = 0;
    //
    //             // 判斷date, site 兩個是否相同
    //             let haveSummary = false;
    //             for (let loopChartData of tempChartDatas) {
    //                 if (
    //                     this.checkDateAndSite(
    //                         loopChartData.date,
    //                         summary.date,
    //                         loopChartData.siteObjectId,
    //                         summary.site.objectId
    //                         // loopChartData.areaId,
    //                         // summary.area.objectId,
    //                     )
    //                 ) {
    //                     haveSummary = true;
    //                     tempChartData = loopChartData;
    //                     break;
    //                 }
    //             }
    //
    //             average = summary.total / summary.count;
    //             tempChartData.occupancy = average;
    //
    //             if (!haveSummary) {
    //                 // 取得weather、temperatureMin、temperatureMax
    //                 for (const weather of this.responseData.weathers) {
    //                     if (
    //                         this.checkDateAndSite(
    //                             tempChartData.date,
    //                             weather.date,
    //                             tempChartData.siteObjectId,
    //                             weather.site.objectId
    //                         )
    //                     ) {
    //                         console.log(" - ", weather.icon);
    //                         tempChartData.weather = WeatherService.WeatherIcon(
    //                             weather.icon
    //                         );
    //                         tempChartData.temperatureMin =
    //                             weather.temperatureMin;
    //                         tempChartData.temperatureMax =
    //                             weather.temperatureMax;
    //                         break;
    //                     }
    //                 }
    //             }
    //             let tempData = JSON.parse(JSON.stringify(tempChartData));
    //             tempData.areaId = summary.area.objectId;
    //             tempData.siteObjectId = summary.site.objectId;
    //
    //             tempChartDatas.push(tempData);
    //             this.chartDatas = tempChartDatas;
    //
    //             console.log("this.chartDatas - ", this.chartDatas);
    //         }
    //
    //         // 單一 area
    //     } else if (
    //         this.inputFormData.areaId &&
    //         this.inputFormData.areaId !== "all"
    //     ) {
    //         let tempChartDatas: IChartOccupancyData[] = [];
    //         this.chartDatas = [];
    //
    //         // 取得date、siteObjectId資料
    //         for (const summary of array) {
    //             let tempChartData: IChartOccupancyData = {
    //                 date: summary.date,
    //                 siteObjectId: "",
    //                 temperatureMin: 0,
    //                 temperatureMax: 0,
    //                 weather: EWeather.none,
    //                 areaId: summary.area.objectId,
    //                 occupancy: 0
    //             };
    //
    //             let total: any = 0;
    //             let count: any = 0;
    //             let average: any = 0;
    //
    //             // 判斷date, site 兩個是否相同
    //             let haveSummary = false;
    //             for (let loopChartData of tempChartDatas) {
    //                 if (
    //                     this.checkDateAndSite(
    //                         loopChartData.date,
    //                         summary.date,
    //                         loopChartData.siteObjectId,
    //                         summary.site.objectId
    //                         // loopChartData.areaId,
    //                         // summary.area.objectId,
    //                     )
    //                 ) {
    //                     haveSummary = true;
    //                     tempChartData = loopChartData;
    //                     break;
    //                 }
    //             }
    //
    //             // total += summary.total;
    //             // count += summary.count;
    //             average = summary.total / summary.count;
    //             tempChartData.occupancy = average;
    //             // tempChartData.occupancy += summary.count;
    //
    //             if (!haveSummary) {
    //                 // 取得weather、temperatureMin、temperatureMax
    //                 for (const weather of this.responseData.weathers) {
    //                     if (
    //                         this.checkDateAndSite(
    //                             tempChartData.date,
    //                             weather.date,
    //                             tempChartData.siteObjectId,
    //                             weather.site.objectId
    //                         )
    //                     ) {
    //                         console.log(" - ", weather.icon);
    //                         tempChartData.weather = WeatherService.WeatherIcon(
    //                             weather.icon
    //                         );
    //                         tempChartData.temperatureMin =
    //                             weather.temperatureMin;
    //                         tempChartData.temperatureMax =
    //                             weather.temperatureMax;
    //                         break;
    //                     }
    //                 }
    //             }
    //
    //             let tempData = JSON.parse(JSON.stringify(tempChartData));
    //             tempData.areaId = summary.area.objectId;
    //             tempData.siteObjectId = summary.site.objectId;
    //
    //             tempChartDatas.push(tempChartData);
    //             this.chartDatas = tempChartDatas;
    //
    //             console.log("this.chartDatas - ", this.chartDatas);
    //         }
    //     }
    // }

    async receiveAreaId(areaId) {
        this.inputFormData.areaId = areaId;
        console.log("areaId - ", this.inputFormData.areaId);

        this.areaSummaryFilter = [];
        this.chartDatas = [];

        // 依照單一area篩選
        if (this.inputFormData.areaId && this.inputFormData.areaId !== "all") {
            for (const singleData of this.responseData.summaryTableDatas) {
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

            let tempAreas = [];

            this.sitesItem.map(item => {
                item.areas.map(area => {
                    if (this.inputFormData.areaId === area.objectId) {
                        let tempArea: any = {};
                        tempArea = {
                            name: area.name,
                            objectId: area.objectId
                        };
                        tempAreas.push(tempArea);
                    }
                });
            });
            this.siteAreaItem.areas = tempAreas;
            this.sites = [];
            this.sites.push(this.siteAreaItem);

            this.sortOutChartData(this.areaSummaryFilter);
            this.areaMode = EAreaMode.single;

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
            this.sortOutChartData(this.responseData.summaryTableDatas);
            this.areaMode = EAreaMode.all;
            this.sites = this.sitesItem;

            this.inputFormData.groupId = "";
            this.inputFormData.deviceId = "";

            await this.initSelectItemArea();
            await this.initSelectItemDeviceGroup();
            await this.initSelectItemDevice();

            this.inputFormData.groupId = "all";
            this.inputFormData.deviceId = "all";

            // 清除area篩選
        } else if (!this.inputFormData.areaId) {
            this.sortOutChartData(this.responseData.summaryTableDatas);
            this.areaMode = EAreaMode.all;
            this.sites = this.sitesItem;

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

        console.log("this.sites - ", this.sites);
        console.log(" - ", this.startDate);
        console.log(" - ", this.endDate);
        console.log(" - ", this.timeMode);
        console.log(" - ", this.areaMode);
        console.log(" - ", this.chartDatas);
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
                console.log("singleData - ", singleData);
                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];

                    if (detailKey === "deviceGroups") {
                        console.log(
                            "tempSingleData[0].objectId - ",
                            tempSingleData[0].objectId
                        );
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

        // 判斷沒有 deviceGroup
        if (
            ReportService.CheckObjectIfEmpty(this.deviceGroupSummaryFilter) &&
            this.inputFormData.groupId === "all"
        ) {
            // 依照device篩選
            for (const singleData of this.areaSummaryFilter) {
                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];

                    if (detailKey === "device") {
                        if (
                            this.inputFormData.deviceId ===
                            tempSingleData.objectId
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
                this.sortOutChartData(this.areaSummaryFilter);

                this.inputFormData.deviceId = "";
                await this.initSelectItemDevice();
                this.inputFormData.deviceId = "all";

                // 依照all device篩選
            } else if (
                this.inputFormData.areaId &&
                this.inputFormData.groupId &&
                this.inputFormData.deviceId === "all"
            ) {
                this.sortOutChartData(this.areaSummaryFilter);

                this.inputFormData.deviceId = "";
                await this.initSelectItemDevice();
                this.inputFormData.deviceId = "all";
            } else {
                return false;
            }

            // 判斷有 deviceGroup，groupId 為 'all'，
        } else if (
            !ReportService.CheckObjectIfEmpty(this.deviceGroupSummaryFilter) &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId === "all"
        ) {
            // 依照device篩選
            for (const singleData of this.deviceGroupSummaryFilter) {
                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];

                    if (detailKey === "device") {
                        if (
                            this.inputFormData.deviceId ===
                            tempSingleData.objectId
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

            // 判斷有 deviceGroup，groupId 不為 'all'，
        } else if (
            !ReportService.CheckObjectIfEmpty(this.deviceGroupSummaryFilter) &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId !== "all"
        ) {
            // 依照device篩選
            for (const singleData of this.deviceGroupSummaryFilter) {
                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];

                    if (detailKey === "device") {
                        if (
                            this.inputFormData.deviceId ===
                            tempSingleData.objectId
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
    }

    receiveType(type) {
        this.inputFormData.type = type;
        this.timeMode = type;
        console.log("type - ", this.inputFormData.type);
    }

    receiveIsIncludedEmployee(isIncludedEmployee) {
        this.inputFormData.isIncludedEmployee = isIncludedEmployee;
        console.log(
            "isIncludedEmployee - ",
            this.inputFormData.isIncludedEmployee
        );
    }

    ////////////////////////////////////// Tina End //////////////////////////////////////

    ////////////////////////////////////// Export //////////////////////////////////////

    exportExcel(fType) {
        let reportTable: any = this.$refs.reportTable;
        let tableData = reportTable.tableToArray();
        //th
        let th = [];
        for (let title of tableData[0]) {
            th.push(title);
        }

        //data
        let data = [];
        for (let bodys of tableData) {
            if (tableData.indexOf(bodys) == 0) continue;
            data.push(bodys);
        }
        let [fileName, fileType, sheetName] = [
            this._("w_Navigation_VideoSources_Demographic"),
            fType,
            Datetime.DateTime2String(this.startDate, "YYYY-MM-DD")
        ];
        toExcel({ th, data, fileName, fileType, sheetName });
    }

    exportPDF() {
        let title = "";
        title += this._("w_Navigation_Report_Occupancy");
        title += " ";
        title += Datetime.DateTime2String(
            this.startDate,
            HighchartsService.datetimeFormat.date
        );

        html2Canvas(document.querySelector(".container-fluid"), {
            allowTaint: true,
            useCORS: true
        }).then(function(canvas) {
            let contentWidth = canvas.width;
            let contentHeight = canvas.height;
            let pageHeight = (contentWidth / 592.28) * 841.89;
            let leftHeight = contentHeight;
            let position = 0;
            const imgWidth = 595.28;
            let imgHeight = (592.28 / contentWidth) * contentHeight;
            let pageData = canvas.toDataURL("image/jpeg", 1.0);
            let PDF = new JsPDF("", "pt", "a4");
            if (leftHeight < pageHeight) {
                PDF.addImage(pageData, "JPEG", 0, 10, imgWidth, imgHeight);
            } else {
                while (leftHeight > 0) {
                    PDF.addImage(
                        pageData,
                        "JPEG",
                        0,
                        position,
                        imgWidth,
                        imgHeight
                    );
                    leftHeight -= pageHeight;
                    position -= 841.89;
                    if (leftHeight > 0) {
                        PDF.addPage();
                    }
                }
            }
            PDF.save(title + ".pdf");
        });
    }
}
</script>


<style lang="scss" scoped>
</style>




