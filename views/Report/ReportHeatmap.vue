<template>
    <div class="animated fadeIn">

        <!-- Tina -->
        <filter-condition-heat-map
            :sitesSelectItem="sitesSelectItem"
            :regionTreeItem="regionTreeItem"
            :templateItem="templateItem"
            :label="_('w_ReportFilterConditionComponent_')"
            @submit-data="receiveFilterData"
        >

        </filter-condition-heat-map>

        <div v-show="pageStep === ePageStep.none">
            <iv-card>

                <template #toolbox>

                    <iv-toolbox-export-pdf
                        size="lg"
                        @click="exportPDF"
                    />

                    <!-- Tina -->
                    <iv-toolbox-send-mail
                        size="lg"
                        @click="modalShow = !modalShow"
                    />
                    <iv-toolbox-copy-to-template
                        size="lg"
                        @click="pageToReportTemplate()"
                    />
                </template>

                <!-- Tina -->
                <analysis-filter-heat-map
                    class="mb-4"
                    :areaSelectItem="areaSelectItem"
                    :deviceGroupSelectItem="deviceGroupSelectItem"
                    :deviceSelectItem="deviceSelectItem"
                    :isIncludedEmployeeSelectItem="isIncludedEmployeeSelectItem"
                    :siteIds="filterData.siteIds"
                    :areaId="inputFormData.areaId"
                    :groupId="inputFormData.groupId"
                    :deviceId="inputFormData.deviceId"
                    :isIncludedEmployee="inputFormData.isIncludedEmployee"
                    @area_id="receiveAreaId"
                    @group_id="receiveGroupId"
                    @device_id="receiveDeviceId"
                    @is_included_employee="receiveIsIncludedEmployee"
                >
                </analysis-filter-heat-map>

                <!-- Tina -->
                <heat-map-many-day
                    :timeArray="timeArray"
                    @time-array-index="receiveTimeArrayIndex"
                ></heat-map-many-day>
                <br>

                <heat-map-one-day-slider-bar :slider="slider">

                </heat-map-one-day-slider-bar>

                <!-- Ben -->
                <camera-heatmap>
                </camera-heatmap>

            </iv-card>

        </div>

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
import ReportService from "@/components/Reports/models/ReportService";
import WeatherService from "@/components/Reports/models/WeatherService";
import HighchartsService from "@/components/Reports/models/HighchartsService";
import {
    ETimeMode,
    EWeather,
    EAgeRange,
    EAreaMode,
    EDwellTimeRange,
    EChartMode,
    EPageType,
    ESign,
    ECountType,
    EDeviceMode,
    EIncludedEmployee,
    IDayRange,
    IChartDemographicData,
    IChartTrafficData,
    IPeckTimeRange,
    ISite,
    ISiteItems,
    ITemplateItem,
    IFilterCondition,
    ReportDashboard,
    ReportTableData,
    EDesignationPeriod,
    IReportToTemplateItem
} from "@/components/Reports";

///////////////////////// export /////////////////////////
import html2Canvas from "html2canvas";
import JsPDF from "jspdf";
import toExcel from "@/services/Excel/json2excel";
import excel2json from "@/services/Excel/excel2json";
import HeatMapManyDay from "@/components/Reports/HeatMapManyDay.vue";

enum EFileType {
    xlsx = "xlsx",
    xls = "xls",
    csv = "csv"
}

enum ETableStep {
    mainTable = "mainTable",
    sunTable = "sunTable",
    detailTable = "detailTable",
    none = "none"
}

enum EPageStep {
    none = "none"
}

@Component({
    components: {
        HeatMapManyDay
    }
})
export default class ReportHeatmap extends Vue {
    // Author : Morris
    templateItem: ITemplateItem | null = null;
    startDate: Date = new Date("2019-01-01T00:00:00.000Z");
    endDate: Date = new Date("2019-01-01T01:00:00.000Z");
    timeMode: ETimeMode = ETimeMode.none;
    areaMode: EAreaMode = EAreaMode.none;
    sites: ISite[] = [];
    chartDatas: IChartDemographicData[] = [];

    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;

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
    officeHourItemDetail: any = [];

    // recipient 相關
    modalShow: boolean = false;

    // 接收 Filter Condition 資料 相關
    filterData: any = {
        startDate: new Date(),
        endDate: new Date(),
        firstSiteId: "",
        siteIds: [],
        type: ETimeMode.none
    };
    responseData: any = {};
    userData: any = [];
    //// Filter Condition End ////

    //// Analysis Filter Start ////
    deviceMode: string = EDeviceMode.heatmap;

    // select 相關
    areaSelectItem: any = {};
    deviceGroupSelectItem: any = {};
    deviceSelectItem: any = {};
    timeModeSelectItem: any = {};
    isIncludedEmployeeSelectItem: any = {};

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

    // 時間一天
    hourArray: any = [];
    hourArrayData: string = "";
    slider: any = {};

    // 時間多天
    timeArray: any = [];
    timeArrayData: string = "";

    //// Analysis Filter End ////

    // send user 相關
    userSelectItem: any = {};

    // Report To Template相關
    ReportToTemplateData: IReportToTemplateItem | null = null;
    designationPeriod: EDesignationPeriod = EDesignationPeriod.none;

    //ReportDashboard 相關
    dPageType: EPageType = EPageType.none;
    dTimeMode: ETimeMode = ETimeMode.none;
    pSiteIds = [];

    //ReportTable 相關
    rData = new ReportTableData();
    reportTableTitle = {};

    //Sun ReportTable 相關
    sunRData = new ReportTableData();

    ////////////////////////////////////// Tina End //////////////////////////////////////

    created() {
        this.initDatas();
        this.initTemplate();

        // Tina 之後移到發api之後
        this.initTimeArray();
        this.initHourArray();
    }

    mounted() {}

    async initDatas() {
        // Tina
        this.initSelect();
        await this.initRegionTreeSelect();
        await this.siteFilterPermission();
        await this.initSelectItemTag();
        await this.initSelectItemTree();
        await this.initSelectItemUsers();
    }

    initSelect() {
        this.timeModeSelectItem = {
            day: this._("w_daily"),
            week: this._("w_weekly"),
            month: this._("w_monthly"),
            quarter: this._("w_quarterly"),
            year: this._("w_yearly")
        };

        this.isIncludedEmployeeSelectItem = {
            yes: this._("w_yes"),
            no: this._("w_no")
        };
    }

    // Author: Morris
    initTemplate() {
        if (this.$route.query.template != undefined) {
            let templateJSON: string = this.$route.query.template as string;
            this.templateItem = ReportService.analysisTemplate(templateJSON);
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
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId !== "all"
        ) {
            // 選擇site和單一area
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
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId === "all"
        ) {
            // 選擇site和all area
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
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId !== "all" &&
            !this.inputFormData.groupId
        ) {
            // 選擇site和單一area
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
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId !== "all" &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId !== "all"
        ) {
            // 選擇site和單一area和單一device group
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
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId !== "all" &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId !== "all" &&
            this.inputFormData.deviceId === "all"
        ) {
            // 選擇site和單一area和單一device group和 all device
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
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId === "all" &&
            (this.inputFormData.groupId === undefined ||
                this.inputFormData.groupId === "") &&
            this.inputFormData.groupId !== "all"
        ) {
            // 選擇site和all area
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
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId === "all" &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId === "all"
        ) {
            // 選擇site和all area和all device group
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
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId !== "all" &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId === "all"
        ) {
            // 選擇site和單一area和all device group
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

    initHourArray() {
        this.hourArray = [
            "2019-07-01T16:00:00.000Z",
            "2019-07-01T17:00:00.000Z",
            "2019-07-01T18:00:00.000Z",
            "2019-07-01T19:00:00.000Z"
        ];

        this.slider = {
            value: 45,
            data: [9, 10, 11, 12, 13, 14, 15],
            range: [
                { label: "9:00" },
                { label: "10:00" },
                { label: "11:00" },
                { label: "12:00" },
                { label: "13:00" },
                { label: "14:00" },
                { label: "15:00" }
            ]
        };
    }

    initTimeArray() {
        this.timeArray = [
            "2019-07-01T16:00:00.000Z",
            "2019-07-02T16:00:00.000Z",
            "2019-07-03T16:00:00.000Z",
            "2019-07-04T16:00:00.000Z"
        ];
    }

    async receiveUserData(data) {
        this.userData = [];
        this.userData = data;
    }

    receiveModalShowData(data) {
        this.modalShow = data;
    }

    //// 以下為 analysis filter ////

    async receiveFilterData(
        filterData: IFilterCondition,
        designationPeriod: EDesignationPeriod
    ) {
        let param = JSON.parse(JSON.stringify(filterData));
        this.filterData = filterData;
        this.designationPeriod = designationPeriod;
        this.inputFormData = {
            areaId: "",
            groupId: "",
            deviceId: "",
            type: "",
            isIncludedEmployee: "no"
        };

        await this.$server
            .C("/report/demographic/summary", param)
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

    resolveSummary() {
        if (this.filterData.siteIds.length === 1) {
            this.initSelectItemArea();
            this.initSelectItemDeviceGroup();
            this.initSelectItemDevice();
        }

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
                        this.sites.push(tempISite);
                        break;
                    }
                }
            }
        }

        // this.sites.push(tempISite);
        this.dTimeMode = this.filterData.type;
        this.pSiteIds = this.filterData.siteIds;
        this.tags = this.filterData.tagIds;
        this.startDate = new Date(this.filterData.startDate);
        this.endDate = new Date(this.filterData.endDate);
        this.timeMode = this.filterData.type;
        this.areaMode = EAreaMode.all;
        this.sortOutChartData(this.responseData.summaryDatas);

        //Ben
        // this.initDashboardData();
        // this.initReportTable();
    }

    sortOutChartData(datas: any) {
        let tempChartDatas: IChartDemographicData[] = [];
        let isOneDay = false;
        this.chartDatas = [];

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
                let tempDate = Datetime.DateToZero(this.filterData.startDate);
                tempDate.setHours(i);
                let tempDateChartDataLower20 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.lower20,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataM21_30 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m21_30,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataM31_40 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m31_40,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataM41_50 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m41_50,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataM51_60 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m51_60,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataUpper61 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.upper61,
                    maleCount: 0,
                    femaleCount: 0
                };

                for (let siteId of this.filterData.siteIds) {
                    let tempSiteChartDataLower20 = JSON.parse(
                        JSON.stringify(tempDateChartDataLower20)
                    );
                    tempSiteChartDataLower20.date = new Date(
                        tempSiteChartDataLower20.date
                    );
                    tempSiteChartDataLower20.siteObjectId = siteId;

                    let tempSiteChartDataM21_30 = JSON.parse(
                        JSON.stringify(tempDateChartDataM21_30)
                    );
                    tempSiteChartDataM21_30.date = new Date(
                        tempSiteChartDataM21_30.date
                    );
                    tempSiteChartDataM21_30.siteObjectId = siteId;

                    let tempSiteChartDataM31_40 = JSON.parse(
                        JSON.stringify(tempDateChartDataM31_40)
                    );
                    tempSiteChartDataM31_40.date = new Date(
                        tempSiteChartDataM31_40.date
                    );
                    tempSiteChartDataM31_40.siteObjectId = siteId;

                    let tempSiteChartDataM41_50 = JSON.parse(
                        JSON.stringify(tempDateChartDataM41_50)
                    );
                    tempSiteChartDataM41_50.date = new Date(
                        tempSiteChartDataM41_50.date
                    );
                    tempSiteChartDataM41_50.siteObjectId = siteId;

                    let tempSiteChartDataM51_60 = JSON.parse(
                        JSON.stringify(tempDateChartDataM51_60)
                    );
                    tempSiteChartDataM51_60.date = new Date(
                        tempSiteChartDataM51_60.date
                    );
                    tempSiteChartDataM51_60.siteObjectId = siteId;

                    let tempSiteChartDataUpper61 = JSON.parse(
                        JSON.stringify(tempDateChartDataUpper61)
                    );
                    tempSiteChartDataUpper61.date = new Date(
                        tempSiteChartDataUpper61.date
                    );
                    tempSiteChartDataUpper61.siteObjectId = siteId;

                    tempChartDatas.push(
                        tempSiteChartDataLower20,
                        tempSiteChartDataM21_30,
                        tempSiteChartDataM31_40,
                        tempSiteChartDataM41_50,
                        tempSiteChartDataM51_60,
                        tempSiteChartDataUpper61
                    );
                }
            }
        } else {
            // multiple days
            let dateList = Datetime.DateList(
                this.filterData.startDate,
                this.filterData.endDate
            );

            for (let dateItem of dateList) {
                let tempDateChartDataLower20 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.lower20,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataM21_30 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m21_30,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataM31_40 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m31_40,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataM41_50 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m41_50,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataM51_60 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m51_60,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataUpper61 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.upper61,
                    maleCount: 0,
                    femaleCount: 0
                };

                for (let siteId of this.filterData.siteIds) {
                    let tempSiteChartDataLower20 = JSON.parse(
                        JSON.stringify(tempDateChartDataLower20)
                    );
                    tempSiteChartDataLower20.date = new Date(
                        tempSiteChartDataLower20.date
                    );
                    tempSiteChartDataLower20.siteObjectId = siteId;

                    let tempSiteChartDataM21_30 = JSON.parse(
                        JSON.stringify(tempDateChartDataM21_30)
                    );
                    tempSiteChartDataM21_30.date = new Date(
                        tempSiteChartDataM21_30.date
                    );
                    tempSiteChartDataM21_30.siteObjectId = siteId;

                    let tempSiteChartDataM31_40 = JSON.parse(
                        JSON.stringify(tempDateChartDataM31_40)
                    );
                    tempSiteChartDataM31_40.date = new Date(
                        tempSiteChartDataM31_40.date
                    );
                    tempSiteChartDataM31_40.siteObjectId = siteId;

                    let tempSiteChartDataM41_50 = JSON.parse(
                        JSON.stringify(tempDateChartDataM41_50)
                    );
                    tempSiteChartDataM41_50.date = new Date(
                        tempSiteChartDataM41_50.date
                    );
                    tempSiteChartDataM41_50.siteObjectId = siteId;

                    let tempSiteChartDataM51_60 = JSON.parse(
                        JSON.stringify(tempDateChartDataM51_60)
                    );
                    tempSiteChartDataM51_60.date = new Date(
                        tempSiteChartDataM51_60.date
                    );
                    tempSiteChartDataM51_60.siteObjectId = siteId;

                    let tempSiteChartDataUpper61 = JSON.parse(
                        JSON.stringify(tempDateChartDataUpper61)
                    );
                    tempSiteChartDataUpper61.date = new Date(
                        tempSiteChartDataUpper61.date
                    );
                    tempSiteChartDataUpper61.siteObjectId = siteId;

                    tempChartDatas.push(
                        tempSiteChartDataLower20,
                        tempSiteChartDataM21_30,
                        tempSiteChartDataM31_40,
                        tempSiteChartDataM41_50,
                        tempSiteChartDataM51_60,
                        tempSiteChartDataUpper61
                    );
                }
            }
        }

        for (let tempChartData of tempChartDatas) {
            let tempDateFormat = isOneDay
                ? Datetime.DateTime2String(
                      tempChartData.date,
                      ReportService.datetimeFormat.hour
                  )
                : Datetime.DateTime2String(
                      tempChartData.date,
                      ReportService.datetimeFormat.date
                  );

            // 計算 maleCount、femaleCount
            for (let summary of datas) {
                let summaryDateFormat = isOneDay
                    ? Datetime.DateTime2String(
                          new Date(summary.date),
                          ReportService.datetimeFormat.hour
                      )
                    : Datetime.DateTime2String(
                          new Date(summary.date),
                          ReportService.datetimeFormat.date
                      );

                if (
                    summaryDateFormat == tempDateFormat &&
                    summary.site.objectId == tempChartData.siteObjectId
                ) {
                    let ageRangeIndex = 0;
                    switch (tempChartData.ageRange) {
                        case EAgeRange.lower20:
                            ageRangeIndex = 0;
                            break;
                        case EAgeRange.m21_30:
                            ageRangeIndex = 1;
                            break;
                        case EAgeRange.m31_40:
                            ageRangeIndex = 2;
                            break;
                        case EAgeRange.m41_50:
                            ageRangeIndex = 3;
                            break;
                        case EAgeRange.m51_60:
                            ageRangeIndex = 4;
                            break;
                        case EAgeRange.upper61:
                            ageRangeIndex = 5;
                            break;
                    }

                    summary.maleRanges[ageRangeIndex] =
                        summary.maleRanges[ageRangeIndex] === null
                            ? 0
                            : summary.maleRanges[ageRangeIndex];
                    summary.femaleRanges[ageRangeIndex] =
                        summary.femaleRanges[ageRangeIndex] === null
                            ? 0
                            : summary.femaleRanges[ageRangeIndex];
                    summary.maleEmployeeRanges[ageRangeIndex] =
                        summary.maleEmployeeRanges[ageRangeIndex] === null
                            ? 0
                            : summary.maleEmployeeRanges[ageRangeIndex];
                    summary.femaleEmployeeRanges[ageRangeIndex] =
                        summary.femaleEmployeeRanges[ageRangeIndex] === null
                            ? 0
                            : summary.femaleEmployeeRanges[ageRangeIndex];

                    tempChartData.maleCount +=
                        summary.maleRanges[ageRangeIndex];
                    tempChartData.femaleCount +=
                        summary.femaleRanges[ageRangeIndex];

                    if (
                        this.inputFormData.isIncludedEmployee ===
                        EIncludedEmployee.no
                    ) {
                        tempChartData.maleCount -=
                            summary.maleEmployeeRanges[ageRangeIndex];
                        tempChartData.femaleCount -=
                            summary.femaleEmployeeRanges[ageRangeIndex];
                    }
                }
            }

            // 取得天氣
            for (let i in this.responseData.weathers) {
                let weather = this.responseData.weathers[i];
                let weatherDateFormat = isOneDay
                    ? Datetime.DateTime2String(
                          new Date(weather.date),
                          ReportService.datetimeFormat.hour
                      )
                    : Datetime.DateTime2String(
                          new Date(weather.date),
                          ReportService.datetimeFormat.date
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
                    break;
                }
            }

            // TODO: Dwell time
            let tempRandomDwellTime = Math.floor(Math.random() * 6);
            if (tempRandomDwellTime == 0) {
                tempChartData.dwellTimeRange = EDwellTimeRange.lower5;
            } else if (tempRandomDwellTime == 1) {
                tempChartData.dwellTimeRange = EDwellTimeRange.m5_15;
            } else if (tempRandomDwellTime == 2) {
                tempChartData.dwellTimeRange = EDwellTimeRange.m15_30;
            } else if (tempRandomDwellTime == 3) {
                tempChartData.dwellTimeRange = EDwellTimeRange.m30_60;
            } else if (tempRandomDwellTime == 4) {
                tempChartData.dwellTimeRange = EDwellTimeRange.m60_120;
            } else {
                tempChartData.dwellTimeRange = EDwellTimeRange.upper120;
            }
            // TODO: Dwell time
        }

        this.chartDatas = tempChartDatas;
    }

    async receiveAreaId(areaId) {
        this.inputFormData.areaId = areaId;

        this.areaSummaryFilter = [];
        this.chartDatas = [];

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
    }

    async receiveIsIncludedEmployee(isIncludedEmployee) {
        this.inputFormData.isIncludedEmployee = isIncludedEmployee;

        // 單一site
        if (this.filterData.firstSiteId) {
            this.sortOutChartData(this.responseData.summaryDatas);

            this.inputFormData.areaId = "";
            this.inputFormData.groupId = "";
            this.inputFormData.deviceId = "";

            await this.initSelectItemArea();
            await this.initSelectItemDeviceGroup();
            await this.initSelectItemDevice();

            this.inputFormData.areaId = "all";
            this.inputFormData.groupId = "all";
            this.inputFormData.deviceId = "all";
        }
    }

    receiveTimeArrayIndex(timeArrayIndex) {
        console.log(" timeArrayIndex : ", timeArrayIndex);
        for (const index in this.timeArray) {
            if (timeArrayIndex === index) {
                this.timeArrayData = this.timeArray[index];
                console.log(" - ", this.timeArray[index]);
            }
        }
    }

    // Author: Tina
    sortOutReportToTemplateData() {
        this.ReportToTemplateData = {
            startDate: this.filterData.startDate,
            endDate: this.filterData.endDate,
            mode: EDeviceMode.demographic,
            siteIds: this.filterData.siteIds,
            tagIds: this.filterData.tagIds,
            sendUserIds: this.userData,
            type: this.designationPeriod
        };
    }

    // Author: Tina
    pageToReportTemplate() {
        this.sortOutReportToTemplateData();
        this.$router.push({
            path: "/reports/",
            query: {
                reportToTemplateData: JSON.stringify(this.ReportToTemplateData)
            }
        });
    }

    ////////////////////////////////////// Tina End //////////////////////////////////////

    ////////////////////////////////////// Export //////////////////////////////////////

    // Author: Morris
    exportPDF() {
        let title = "";
        title += this._("w_Navigation_Report_Traffic");
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

    /////////////////////////////////////////////////////////////////////
}
</script>


<style lang="scss" scoped>
</style>




