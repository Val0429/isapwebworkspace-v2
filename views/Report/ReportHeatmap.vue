<template>
    <div class="animated fadeIn">

        <!-- Tina -->
        <filter-condition-heat-map
            :sitesSelectItem="sitesSelectItem"
            :regionTreeItem="regionTreeItem"
            :templateItem="templateItem"
            :addPeriodSelectItem="addPeriodSelectItem"
            :label="_('w_ReportFilterConditionComponent_')"
            @submit-data="receiveFilterData"
        >

        </filter-condition-heat-map>

        <iv-card
            :visible="visible"
            :label="filterData.siteIds !== '' ? analysisTitle() : '' "
        >
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
                class="mb-4 mt-3"
                :areaSelectItem="areaSelectItem"
                :deviceGroupSelectItem="deviceGroupSelectItem"
                :deviceSelectItem="deviceSelectItem"
                :isIncludedEmployeeSelectItem="isIncludedEmployeeSelectItem"
                :siteIds="filterData.siteId"
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
                v-if="!checkDateTheSameDay(filterData.startDate, filterData.endDate)"
                :dayArray="dayArray"
                @day-array-index="receiveDayArrayIndex"
            ></heat-map-many-day>
            <br>

            <!-- Tina  -->
            <heat-map-one-day-slider-bar
                v-if="filterData.siteIds !== '' && checkDateTheSameDay(filterData.startDate, filterData.endDate)"
                :slider="slider"
                @hour="receiveHour"
            >
            </heat-map-one-day-slider-bar>

            <!-- Ben -->
            <camera-heatmap
                :mapImage="mapImage"
                :heatMapPosition="heatMapPosition"
            >
            </camera-heatmap>

        </iv-card>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

// Vue
import HeatMapManyDay from "@/components/Reports/Filter/HeatMapManyDay.vue";

// Region Tree
import {
    ERegionType,
    IRegionTreeSelected,
    RegionTreeItem
} from "@/components/RegionTree";

// Report
import {
    ETimeMode,
    EWeather,
    EAgeRange,
    EAreaMode,
    EDwellTimeRange,
    EPageType,
    ESign,
    EDeviceMode,
    EIncludedEmployee,
    EDesignationPeriod,
    EAddPeriodSelect,
    IChartDemographicData,
    ISite,
    ITemplateItem,
    IFilterCondition,
    IReportToTemplateItem
} from "@/components/Reports";
import {
    IHeatMapData,
    IHeatMapPosition,
    IMapImage
} from "@/components/Camera/IHeatmap";

// Service
import Dialog from "@/services/Dialog";
import RegionAPI from "@/services/RegionAPI";
import ResponseFilter from "@/services/ResponseFilter";
import Datetime from "@/services/Datetime";
import ReportService from "@/components/Reports/models/ReportService";
import WeatherService from "@/components/Reports/models/WeatherService";
import HighchartsService from "@/components/Reports/models/HighchartsService";
import Loading from "@/services/Loading";
import ServerConfig from "@/services/ServerConfig";
import ImageBase64 from "@/services/ImageBase64";

// Export
import toExcel from "@/services/Excel/json2excel";
import excel2json from "@/services/Excel/excel2json";
import ReportPDFService from "@/components/Reports/models/ReportPDFService";
import { EFileType } from "@/components/Reports";

enum ETableStep {
    mainTable = "mainTable",
    sunTable = "sunTable",
    detailTable = "detailTable",
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

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    //// Filter Condition Start ////

    // select 相關
    sitesSelectItem: any = [];
    addPeriodSelectItem: any = [];
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

    // 收合card控制
    visible: boolean = false;

    // 接收 Filter Condition 資料 相關
    filterData: any = {
        startDate: new Date(),
        endDate: new Date(),
        firstSiteId: "",
        siteIds: "",
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
    slider: any = {};
    hour: string = "";

    // 時間多天
    dayArray: any = [];
    dayArrayData: string = "";
    dayArrayDataIndex: string = "";

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

    //heatmap 相關
    heatMapPosition: IHeatMapPosition[] = [];

    mapImage: IMapImage = {
        name: "HeatMap",
        src: ImageBase64.pngEmpty,
        width: 600,
        height: 400
    };

    ////////////////////////////////////// Tina End //////////////////////////////////////

    created() {
        this.initDatas();
        this.initTemplate();
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
        this.addPeriodSelectItem = [
            { value: EAddPeriodSelect.period, text: this._("w_period") },
            {
                value: EAddPeriodSelect.designation,
                text: this._("w_Designation")
            }
        ];

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
        for (const detail of this.$user.user.allowSites) {
            let site = { id: detail.objectId, text: detail.name };
            this.sitesSelectItem.push(site);

            // tempSitesSelectItem[detail.objectId] = detail.name;
        }
        // this.sitesSelectItem = tempSitesSelectItem;
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
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response) {
                        tempSitesSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                    this.sitesSelectItem = tempSitesSelectItem;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemTag() {
        let tempTagSelectItem = {};

        await this.$server
            .R("/tag/all")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response) {
                        tempTagSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                    this.tagSelectItem = tempTagSelectItem;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemTree() {
        await this.$server
            .R("/location/tree")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    let tempTree = ReportService.resolveUserSite(
                        this,
                        response
                    );
                    this.regionTreeItem.tree = RegionAPI.analysisApiResponse(
                        tempTree
                    );
                    this.regionTreeItem.region = this.regionTreeItem.tree;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
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
        }

        await this.$server
            .R("/location/area/all", readParam)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response) {
                        tempAreaSelectItem[returnValue.objectId] =
                            returnValue.name;
                        // this.$set(this.areaSelectItem, returnValue.objectId, returnValue.name);
                    }
                    this.areaSelectItem = tempAreaSelectItem;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
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
        }

        if (this.inputFormData.areaId) {
            readParam.areaId =
                this.inputFormData.areaId !== "all"
                    ? this.inputFormData.areaId
                    : "";
        }

        await this.$server
            .R("/device/group/all", readParam)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response) {
                        tempDeviceGroupSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                    this.deviceGroupSelectItem = tempDeviceGroupSelectItem;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
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
        }

        if (this.inputFormData.areaId) {
            readParam.areaId =
                this.inputFormData.areaId !== "all"
                    ? this.inputFormData.areaId
                    : "";
        }

        if (this.inputFormData.groupId) {
            readParam.groupId =
                this.inputFormData.groupId !== "all"
                    ? this.inputFormData.groupId
                    : "";
        }

        await this.$server
            .R("/device", readParam)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (
                        response.results != undefined &&
                        response.results.length > 0
                    ) {
                        for (const returnValue of response.results) {
                            tempDeviceSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceSelectItem = tempDeviceSelectItem;
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemUsers() {
        let tempUserSelectItem = {};

        await this.$server
            .R("/user/user")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response.results) {
                        tempUserSelectItem[
                            returnValue.objectId
                        ] = `${returnValue.username} - ${returnValue.email}`;
                    }
                    this.userSelectItem = tempUserSelectItem;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    initHourArray() {
        let weekDay = new Date().getDay();

        let dayRanges = [];

        for (const officeHour of this.officeHourItemDetail) {
            dayRanges = officeHour.dayRanges;
        }

        let result = HighchartsService.siteOfficeHour(weekDay, dayRanges);

        this.slider = {
            value: 0,
            data: [],
            range: []
        };

        let tempDataArray = [];
        let tempRangeArray = [];

        for (let i = result.startHour; i <= result.endHour; i++) {
            let hourString = i < 10 ? `0${i.toString()}` : i.toString();
            let tempLabel = { label: `${hourString}:00` };

            tempRangeArray.push(tempLabel);
            tempDataArray.push(i);
        }

        this.slider = {
            value: result.startHour,
            data: tempDataArray,
            range: tempRangeArray
        };
    }

    initDayArray() {
        let tempDayArray = [];

        if (this.responseData.summaryDatas.length > 0) {
            this.responseData.summaryDatas.map(item => {
                tempDayArray.push(item.date);
            });
        } else {
            return false;
        }

        // 去掉重複的值
        this.dayArray = [...new Set(tempDayArray)];
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

        console.log("this.filterData - ", this.filterData);

        await this.$server
            .C("/report/heatmap/summary", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.responseData = response;
                    this.officeHourItemDetail = this.responseData.officeHours;
                    this.resolveSummary();
                    if (
                        this.checkDateTheSameDay(
                            this.filterData.startDate,
                            this.filterData.endDate
                        )
                    ) {
                        this.initHourArray();
                    } else {
                        this.initDayArray();
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });

        await this.firstSortOutChartData(this.responseData.summaryDatas);
    }

    async resolveSummary() {
        this.initSelectItemArea();
        this.initSelectItemDeviceGroup();
        this.initSelectItemDevice();

        if (this.responseData.summaryDatas[0] !== undefined) {
            this.inputFormData.areaId = this.responseData.summaryDatas[0].area.objectId;
            this.inputFormData.deviceId = this.responseData.summaryDatas[0].device.objectId;
            if (this.responseData.summaryDatas[0].deviceGroups.length > 0) {
                this.inputFormData.groupId = this.responseData.summaryDatas[0].deviceGroups[0].objectId;
            } else {
                this.inputFormData.groupId = "all";
            }
        } else {
            this.inputFormData = {
                areaId: "all",
                deviceId: "all",
                type: this.filterData.type,
                isIncludedEmployee: "no"
            };
        }
    }

    analysisTitle(): string {
        let title = "Analysis - ";

        for (const site of this.sitesSelectItem) {
            if (this.filterData.siteIds === site.id) {
                title += `${this._("w_Title_One_Site")} ${site.text}. `;
            }
        }

        title += `${this._("w_Title_StartDate")} ${Datetime.DateTime2String(
            this.filterData.startDate,
            "YYYY/MM/DD"
        )}. `;
        title += `${this._("w_Title_EndDate")} ${Datetime.DateTime2String(
            this.filterData.endDate,
            "YYYY/MM/DD"
        )}. `;

        this.visible = true;

        return title;
    }

    checkDateTheSameDay(startDate: Date, endDate: Date) {
        return (
            Datetime.DateToZero(endDate).getTime() ===
            Datetime.DateToZero(startDate).getTime()
        );
    }

    checkDateTheSameHour(selectDate: string, apiDate: string) {
        const selectedDate = Datetime.DateTime2String(
            new Date(selectDate),
            "HH"
        );
        const fromApiDate = Datetime.DateTime2String(new Date(apiDate), "HH");

        return (
            Datetime.DateToZero(new Date(selectedDate)).getTime() ===
            Datetime.DateToZero(new Date(fromApiDate)).getTime()
        );
    }

    async firstSortOutChartData(datas: any) {
        if (datas[0] !== undefined) {
            this.inputFormData.areaId = datas[0].area.objectId;
            this.inputFormData.deviceId = datas[0].device.objectId;
            if (datas[0].deviceGroups.length > 0) {
                this.inputFormData.groupId = datas[0].deviceGroups[0].objectId;
            } else {
                this.inputFormData.groupId = "all";
            }
        } else {
            this.inputFormData = {
                areaId: "all",
                deviceId: "all",
                type: this.filterData.type,
                isIncludedEmployee: "no"
            };
        }

        this.sortDeviceSummaryFilterData();

        let heatmap: IHeatMapPosition[] = [];
        this.heatMapPosition = [];

        let gridUnit = 10;
        let valueZoom = 10;

        // for (const summary of datas) {
        console.log(datas[0]);
        if (
            datas[0] != undefined &&
            datas[0].scores != undefined &&
            datas[0].scores.length > 0
        ) {
            let heatmaps = datas[0].scores.map((value, index, array) => {
                return value.map((value1, index1, array1) => {
                    return {
                        x: index1 * gridUnit + gridUnit / 2,
                        y: index * gridUnit + gridUnit / 2,
                        value: value1 * valueZoom
                    };
                });
            });
            heatmap = [].concat(...heatmaps);
        }
        this.mapImage.src = datas[0];

        this.heatMapPosition = heatmap;
        this.mapImage.src = ServerConfig.url + datas[0].imageSrc;
        console.log("this.heatMapPosition ~ ", this.heatMapPosition);
    }

    sortOutChartDataOneDay(datas: any) {
        let heatmap: IHeatMapPosition[] = [];
        this.heatMapPosition = [];
        this.mapImage.src = "";

        let gridUnit = 10;
        let valueZoom = 10;

        for (const summary of datas) {
            if (this.checkDateTheSameHour(this.hour, summary.date)) {
                if (summary.scores.length > 0) {
                    let heatmaps = summary.scores.map((value, index, array) => {
                        return value.map((value1, index1, array1) => {
                            return {
                                x: index1 * gridUnit + gridUnit / 2,
                                y: index * gridUnit + gridUnit / 2,
                                value: value1 * valueZoom
                            };
                        });
                    });
                    heatmap = [].concat(...heatmaps);
                }
                this.mapImage.src = ServerConfig.url + summary.imageSrc;
            }
        }

        this.heatMapPosition = heatmap;
        console.log("this.heatMapPosition ~ ", this.heatMapPosition);
        console.log("this.mapImage.src ~ ", this.mapImage.src);
    }

    sortOutChartDataManyDay(datas: any) {
        let heatmap: IHeatMapPosition[] = [];
        this.heatMapPosition = [];
        this.mapImage.src = "";

        let gridUnit = 10;
        let valueZoom = 10;

        for (const summary of datas) {
            if (
                this.checkDateTheSameDay(
                    new Date(this.dayArrayData),
                    new Date(summary.date)
                )
            ) {
                if (summary.scores.length > 0) {
                    let heatmaps = summary.scores.map((value, index, array) => {
                        return value.map((value1, index1, array1) => {
                            return {
                                x: index1 * gridUnit + gridUnit / 2,
                                y: index * gridUnit + gridUnit / 2,
                                value: value1 * valueZoom
                            };
                        });
                    });
                    heatmap = [].concat(...heatmaps);
                }
                this.mapImage.src = ServerConfig.url + summary.imageSrc;
            }
        }

        this.heatMapPosition = heatmap;
        console.log("this.heatMapPosition ~ ", this.heatMapPosition);
        console.log("this.mapImage.src ~ ", this.mapImage.src);
    }

    sortDeviceSummaryFilterData() {
        this.areaSummaryFilter = [];
        this.deviceSummaryFilter = [];
        this.deviceGroupSummaryFilter = [];

        // area
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
        }

        // group
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
        }

        // device
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
        }

        console.log("@@@@@@");
        // console.log('this.areaSummaryFilter ~ ', this.areaSummaryFilter)
        // console.log('this.deviceGroupSummaryFilter ~ ', this.deviceGroupSummaryFilter)
        console.log("this.deviceSummaryFilter ~ ", this.deviceSummaryFilter);
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
                        if (tempSingleData.length > 0) {
                            if (
                                this.inputFormData.groupId ===
                                tempSingleData[0].objectId
                            ) {
                                this.deviceGroupSummaryFilter.push(singleData);
                            }
                        }
                    }
                }
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
            this.inputFormData.groupId = "all";
            this.inputFormData.deviceId = "all";

            // 清除deviceGroups篩選
        } else if (this.inputFormData.areaId && !this.inputFormData.groupId) {
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
                        // console.log('receiveDeviceId  deviceId~ ', this.inputFormData.deviceId)
                        // console.log('tempSingleData.objectId~ ', tempSingleData.objectId)
                        // console.log('??? ~ ',  this.inputFormData.deviceId === tempSingleData.objectId)

                        if (
                            this.inputFormData.deviceId ===
                            tempSingleData.objectId
                        ) {
                            this.deviceSummaryFilter.push(singleData);
                        }
                    }
                }
            }

            console.log("^^^^^^^^^^ ~ ");

            if (
                this.checkDateTheSameDay(
                    this.filterData.startDate,
                    this.filterData.endDate
                )
            ) {
                console.log("Hour ~ ");
                this.receiveHour(this.slider.value);
            } else {
                console.log("Day ~ ");
                this.receiveDayArrayIndex(this.dayArrayDataIndex);
            }

            console.log(
                "receiveDeviceId deviceSummaryFilter ~ ",
                this.deviceSummaryFilter
            );

            // 清除device篩選
            if (
                this.inputFormData.areaId &&
                this.inputFormData.groupId &&
                !this.inputFormData.deviceId
            ) {
                this.inputFormData.deviceId = "";
                await this.initSelectItemDevice();
                this.inputFormData.deviceId = "all";

                // 依照all device篩選
            } else if (
                this.inputFormData.areaId &&
                this.inputFormData.groupId &&
                this.inputFormData.deviceId === "all"
            ) {
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

            // 清除device篩選
            if (
                this.inputFormData.areaId &&
                this.inputFormData.groupId &&
                !this.inputFormData.deviceId
            ) {
                this.inputFormData.deviceId = "";
                await this.initSelectItemDevice();
                this.inputFormData.deviceId = "all";

                // 依照all device篩選
            } else if (
                this.inputFormData.areaId &&
                this.inputFormData.groupId &&
                this.inputFormData.deviceId === "all"
            ) {
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

            // 清除device篩選
            if (
                this.inputFormData.areaId &&
                this.inputFormData.groupId &&
                !this.inputFormData.deviceId
            ) {
                this.inputFormData.deviceId = "";
                await this.initSelectItemDevice();
                this.inputFormData.deviceId = "all";

                // 依照all device篩選
            } else if (
                this.inputFormData.areaId &&
                this.inputFormData.groupId &&
                this.inputFormData.deviceId === "all"
            ) {
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
            this.sortOutChartDataOneDay(this.responseData.summaryDatas);

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

    // 一天的其中一小時
    async receiveHour(hour) {
        console.log(" ~ ", hour);
        let tempHour = new Date();
        tempHour.setHours(parseInt(hour), 0, 0, 0);
        this.hour = new Date(tempHour).toISOString();
        Datetime.DateTime2String(new Date(this.hour), "HH");

        this.sortDeviceSummaryFilterData();
        this.sortOutChartDataOneDay(this.deviceSummaryFilter);
    }

    // 多天的其中一天
    async receiveDayArrayIndex(timeArrayIndex) {
        console.log(" ~ ", timeArrayIndex);

        this.dayArrayDataIndex = timeArrayIndex;

        for (const index in this.dayArray) {
            if (timeArrayIndex === index) {
                this.dayArrayData = this.dayArray[index];
            }
        }

        this.sortDeviceSummaryFilterData();

        // const param = this.filterData;
        // this.filterData.startDate = this.dayArrayData;
        // this.filterData.endDate = this.dayArrayData;
        //
        // console.log(this.filterData);
        //
        // await this.$server
        //     .C("/report/heatmap/summary", param)
        //     .then((response: any) => {
        //         if (response !== undefined) {
        //             this.responseData = response;
        //             this.officeHourItemDetail = this.responseData.officeHours;
        //             this.resolveSummary();
        //             if (
        //                 this.checkDateTheSameDay(
        //                     this.filterData.startDate,
        //                     this.filterData.endDate
        //                 )
        //             ) {
        //                 this.initHourArray();
        //             } else {
        //                 this.initDayArray();
        //             }
        //             this.firstSortOutChartData(this.responseData.summaryDatas);
        //
        //         }
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.catchError(this, e);
        //     });

        console.log("this.dayArrayData ~ ", this.dayArrayData);
        console.log(
            "this.responseData.deviceSummaryFilter ~ ",
            this.deviceSummaryFilter
        );
        this.sortOutChartDataManyDay(this.deviceSummaryFilter);
    }

    // Author: Tina
    sortOutReportToTemplateData() {
        this.ReportToTemplateData = {
            startDate: this.filterData.startDate,
            endDate: this.filterData.endDate,
            mode: EDeviceMode.heatmap,
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
        ReportPDFService.exportPDF(title);
    }

    /////////////////////////////////////////////////////////////////////
}
</script>

<style lang="scss" scoped>
</style>




