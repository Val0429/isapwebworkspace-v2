import {EAreaMode} from "../../components/Reports";
<template>
    <div>
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

        <div>

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
                <analysis-filter-in-out
                    class="mb-4"
                    :areaSelectItem="areaSelectItem"
                    :deviceGroupSelectItem="deviceGroupSelectItem"
                    :deviceSelectItem="deviceSelectItem"
                    :typeSelectItem="typeSelectItem"
                    :timeModeSelectItem="timeModeSelectItem"
                    :isIncludedEmployeeSelectItem="isIncludedEmployeeSelectItem"
                    :siteIds="filterData.siteIds"
                    :areaId="inputFormData.areaId"
                    :groupId="inputFormData.groupId"
                    :deviceId="inputFormData.deviceId"
                    :type="inputFormData.type"
                    :inOrOut="inputFormData.inOrOut"
                    :isIncludedEmployee="inputFormData.isIncludedEmployee"
                    @area_id="receiveAreaId"
                    @group_id="receiveGroupId"
                    @device_id="receiveDeviceId"
                    @type="receiveType"
                    @in_or_out="receiveInOrOut"
                    @is_included_employee="receiveIsIncludedEmployee"
                >

                </analysis-filter-in-out>

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

                <highcharts-traffic
                    ref="highcharts"
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
                >
                </report-table>

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
import { Component, Vue } from "vue-property-decorator";
// Tina
import {
    ERegionType,
    IRegionTreeSelected,
    RegionTreeItem
} from "@/components/RegionTree";

import RegionAPI from "@/services/RegionAPI";
import ResponseFilter from "@/services/ResponseFilter";
import WeatherService from "@/components/Reports/models/WeatherService";
import Datetime from "@/services/Datetime";
import HighchartsService from "@/components/Reports/models/HighchartsService";
import HighchartsTraffic from "@/components/Reports/HighchartsTraffic.vue";
import {
    EAreaMode,
    EChartMode,
    EPageType,
    ESign,
    ETimeMode,
    EWeather,
    IChartTrafficData,
    IPeckTimeRange,
    ISite,
    ISiteItems,
    ReportDashboard,
    ReportTableData,
    ITemplateItem,
    IFilterCondition,
    ECountType,
    EDeviceMode,
    ETypeInOrOut,
    EIncludedEmployee
} from "@/components/Reports";
import ReportService from "@/components/Reports/models/ReportService";
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

enum ETableStep {
    mainTable = "mainTable",
    sunTable = "sunTable",
    detailTable = "detailTable",
    none = "none"
}

@Component({
    components: {
        HighchartsTraffic
    }
})
export default class ReportTraffic extends Vue {
    // Author : Morris
    templateItem: ITemplateItem | null = null;
    startDate: Date = new Date("2019-01-01T00:00:00.000Z");
    endDate: Date = new Date("2019-01-01T01:00:00.000Z");
    timeMode: ETimeMode = ETimeMode.none;
    areaMode: EAreaMode = EAreaMode.none;
    sites: ISite[] = [];
    chartDatas: IChartTrafficData[] = [];

    ////////////////////////////////////// Ben Start //////////////////////////////////////

    // Author : Ben
    lastTableStep: ETableStep = ETableStep.none;
    tableStep: ETableStep = ETableStep.none;
    eTableStep = ETableStep;
    ePageType = EPageType;
    eWeather = EWeather;
    eFileType = EFileType;

    //ReportDashboard 相關
    dPageType: EPageType = EPageType.none;
    dTimeMode: ETimeMode = ETimeMode.none;
    pSiteIds = [];

    //PickTimeRange 相關
    pData: IPeckTimeRange[] = [];
    pDayXxSiteX: EChartMode = EChartMode.none;
    siteItem: ISiteItems[] = [];

    //ReportTable 相關
    rData = new ReportTableData();
    reportTableTitle = {};

    //Sun ReportTable 相關
    sunRData = new ReportTableData();

    ////////////////////////////////////// Ben End //////////////////////////////////////

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    //// Filter Condition Start ////

    selectItem = {
        site: [],
        area: [],
        tags: []
    };

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

    //// Filter Condition End ////

    //// Analysis Filter Start ////
    deviceMode: string = EDeviceMode.peopleCounting;

    // select 相關
    areaSelectItem: any = {};
    deviceGroupSelectItem: any = {};
    deviceSelectItem: any = {};
    typeSelectItem: any = [
        { value: ETypeInOrOut.in, text: ETypeInOrOut.in },
        { value: ETypeInOrOut.out, text: ETypeInOrOut.out }
    ];
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
        inOrOut: "in",
        isIncludedEmployee: "no"
    };

    // 整理 showReportData 相關
    areaSummaryFilter: any = [];
    deviceGroupSummaryFilter: any = [];
    deviceSummaryFilter: any = [];

    //// Analysis Filter End ////

    // send user 相關
    userSelectItem: any = {};

    ////////////////////////////////////// Tina End //////////////////////////////////////

    created() {
        this.initDatas();
        this.initTemplate();
    }

    mounted() {}

    // Author: Tina
    async initDatas() {
        await this.initRegionTreeSelect();
        await this.siteFilterPermission();
        await this.initSelectItemTag();
        await this.initSelectItemTree();
        await this.initSelectItemUsers();
    }

    // Author: Morris
    initTemplate() {
        if (this.$route.query.template != undefined) {
            let templateJSON: string = this.$route.query.template as string;
            this.templateItem = ReportService.analysisTemplate(templateJSON);
        }
    }

    // Author: Ben
    reportTableBack() {
        this.tableStep = this.lastTableStep;
        this.lastTableStep = ETableStep.mainTable;
    }

    // Author: Ben
    initDashboardData() {
        this.dPageType = EPageType.traffic;
        setTimeout(() => {
            let anlysisDashboard: any = this.$refs.anlysisDashboard;
            anlysisDashboard.initData();
        }, 300);
    }

    // Author: Ben
    initPeakTimeRange() {
        // Data format conversion
        this.siteItem = [];
        this.pData = [];

        let chartMode = HighchartsService.chartMode(
            this.startDate,
            this.endDate,
            this.sites
        );

        this.pDayXxSiteX = chartMode;

        for (let site of this.sites) {
            let item = {
                value: site.objectId,
                text: site.name,
                officeHour: site.officeHour
            };
            this.siteItem.push(item);
        }

        for (let item of this.responseData.peakHours) {
            let pDatum: IPeckTimeRange = {
                site: "",
                head: [],
                body: []
            };
            let head = [];
            let levels = [];
            for (let subItem of item.peakHourDatas) {
                let level = {
                    time: subItem.date,
                    value: subItem.level
                };

                levels.push(level);
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
    }

    // Author: Ben
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
                        out: []
                    };
                    if (
                        tempArray.every(
                            t =>
                                t.group == undefined ||
                                t.group.objectId != body.group.objectId
                        )
                    )
                        tempArray.push(body);
                }
            } else {
                let body = {
                    site: summaryData.site,
                    area: summaryData.area,
                    in: [],
                    out: []
                };
                if (
                    tempArray.every(
                        t =>
                            t.area == undefined ||
                            t.area.objectId != body.area.objectId
                    )
                )
                    tempArray.push(body);
            }
        }

        // 填入資料
        for (let index in tempArray) {
            for (let head of this.sunRData.head) {
                let inCount = { value: 0, valueRatio: 0, link: false };
                let outCount = { value: 0, valueRatio: 0, link: false };
                for (let summaryData of summaryTableDatas) {
                    if (
                        new Date(summaryData.date).getHours().toString() != head
                    ) {
                        continue;
                    }

                    if (tempArray[index].group != undefined) {
                        for (let deviceGroup of summaryData.deviceGroups) {
                            if (
                                tempArray[index].group.objectId ==
                                deviceGroup.objectId
                            ) {
                                inCount.value += summaryData.in;
                                inCount.valueRatio += this.countRatio(
                                    summaryData.in,
                                    summaryData.prevIn
                                );
                                outCount.value += summaryData.out;
                                outCount.valueRatio += this.countRatio(
                                    summaryData.out,
                                    summaryData.prevOut
                                );
                            }
                        }
                    } else {
                        if (
                            tempArray[index].area.objectId ==
                            summaryData.area.objectId
                        ) {
                            inCount.value += summaryData.in;
                            inCount.valueRatio += this.countRatio(
                                summaryData.in,
                                summaryData.prevIn
                            );
                            outCount.value += summaryData.out;
                            outCount.valueRatio += this.countRatio(
                                summaryData.out,
                                summaryData.prevOut
                            );
                        }
                    }
                }
                tempArray[index].in.push(inCount);
                tempArray[index].out.push(outCount);
            }
            this.sunRData.body = tempArray;
        }
        //調整head時間格式
        this.sunRData.head = this.sunRData.head.map(
            x => x + ":00 - " + (x + 1) + ":00"
        );
    }

    // Author: Ben
    initReportTable() {
        this.lastTableStep = this.tableStep;
        this.tableStep = ETableStep.mainTable;
        let chartMode = HighchartsService.chartMode(
            this.startDate,
            this.endDate,
            this.sites
        );
        this.rData.chartMode = chartMode;

        this.reportTableTitle = {
            titleCount: 2,
            title1: this._("w_TrafficIn"),
            title2: this._("w_TrafficOut"),
            inTotalTitle: this._("w_TrafficInTotal"),
            outTotalTitle: this._("w_TrafficOutTotal")
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
        for (let summaryData of this.responseData.summaryDatas) {
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
                        out: []
                    };

                    if (
                        tempArray.every(
                            t =>
                                t.group == undefined ||
                                t.group.objectId != body.group.objectId
                        )
                    )
                        tempArray.push(body);
                }
            } else {
                let body = {
                    site: summaryData.site,
                    area: summaryData.area,
                    in: [],
                    out: []
                };

                if (
                    tempArray.every(
                        t =>
                            t.area == undefined ||
                            t.area.objectId != body.area.objectId
                    )
                )
                    tempArray.push(body);
            }
        }
        //填入資料
        switch (chartMode) {
            case EChartMode.site1Day1:
            case EChartMode.siteXDay1:
                for (let index in tempArray) {
                    for (let head of this.rData.head) {
                        let inCount = { value: 0, valueRatio: 0, link: true };
                        let outCount = { value: 0, valueRatio: 0, link: true };
                        for (let summaryData of this.responseData
                            .summaryDatas) {
                            if (
                                new Date(summaryData.date)
                                    .getHours()
                                    .toString() != head
                            ) {
                                continue;
                            }

                            if (tempArray[index].group != undefined) {
                                for (let deviceGroup of summaryData.deviceGroups) {
                                    if (
                                        tempArray[index].group.objectId ==
                                        deviceGroup.objectId
                                    ) {
                                        inCount.value += summaryData.in;
                                        inCount.valueRatio += this.countRatio(
                                            summaryData.in,
                                            summaryData.prevIn
                                        );
                                        outCount.value += summaryData.out;
                                        outCount.valueRatio += this.countRatio(
                                            summaryData.out,
                                            summaryData.prevOut
                                        );
                                    }
                                }
                            } else {
                                if (
                                    tempArray[index].area.objectId ==
                                    summaryData.area.objectId
                                ) {
                                    inCount.value += summaryData.in;
                                    inCount.valueRatio += this.countRatio(
                                        summaryData.in,
                                        summaryData.prevIn
                                    );
                                    outCount.value += summaryData.out;
                                    outCount.valueRatio += this.countRatio(
                                        summaryData.out,
                                        summaryData.prevOut
                                    );
                                }
                            }
                        }
                        tempArray[index].in.push(inCount);
                        tempArray[index].out.push(outCount);
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
                        let inCount = { value: 0, valueRatio: 0, link: true };
                        let outCount = { value: 0, valueRatio: 0, link: true };
                        for (let summaryData of this.responseData
                            .summaryDatas) {
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

                            if (tempArray[index].group != undefined) {
                                for (let deviceGroup of summaryData.deviceGroups) {
                                    if (
                                        tempArray[index].group.objectId ==
                                        deviceGroup.objectId
                                    ) {
                                        inCount.value += summaryData.in;
                                        inCount.valueRatio += this.countRatio(
                                            summaryData.in,
                                            summaryData.prevIn
                                        );
                                        outCount.value += summaryData.out;
                                        outCount.valueRatio += this.countRatio(
                                            summaryData.out,
                                            summaryData.prevOut
                                        );
                                    }
                                }
                            } else {
                                if (
                                    tempArray[index].area.objectId ==
                                    summaryData.area.objectId
                                ) {
                                    inCount.value += summaryData.in;
                                    inCount.valueRatio += this.countRatio(
                                        summaryData.in,
                                        summaryData.prevIn
                                    );
                                    outCount.value += summaryData.out;
                                    outCount.valueRatio += this.countRatio(
                                        summaryData.out,
                                        summaryData.prevOut
                                    );
                                }
                            }
                        }
                        tempArray[index].in.push(inCount);
                        tempArray[index].out.push(outCount);
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
                        this.showWeek(new Date(x).getDay())
                );
                break;
        }
        this.rData.body = tempArray;
        console.log("  this.rData.body", this.rData);
    }

    // Author: Ben
    async toSunReportTable(thatDay, sunTime, sunSite, sunArea) {
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
                .C("/report/people-counting/summary", filterData)
                .then((response: any) => {
                    if (response !== undefined) {
                        summaryTableDatas = response.summaryDatas;
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
            // this.toDetailReportTable(thatDay, sunTime, sunSite, sunArea);
        }
    }

    // Author: Ben
    countRatio(value: number, prevValue: number): number {
        if (value == undefined) {
            return 0;
        }
        if (prevValue == undefined) {
            return 0;
        }
        if (value == null) {
            return 0;
        }
        if (prevValue == null) {
            return 0;
        }
        if (value == 0) {
            return 0;
        }
        if (prevValue == 0) {
            return 0;
        }
        if (value > prevValue) {
            return prevValue / value;
        } else if (value < prevValue) {
            return -(value / prevValue);
        } else {
            return 1;
        }
    }

    // Author: Ben
    showWeek(data) {
        switch (data) {
            case 1:
                return "Mon";
            case 2:
                return "Tue";
            case 3:
                return "Wed";
            case 4:
                return "Thu";
            case 5:
                return "Fri";
            case 6:
                return "Sat";
            case 0:
                return "Sun";
        }
    }

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    // Author: Tina
    initRegionTreeSelect() {
        this.regionTreeItem = new RegionTreeItem();
        this.regionTreeItem.titleItem.card = this._("w_SiteTreeSelect");
    }

    // Author: Tina
    siteFilterPermission() {
        let tempSitesSelectItem = {};
        for (const detail of this.$user.allowSites) {
            tempSitesSelectItem[detail.objectId] = detail.name;
        }
        this.sitesSelectItem = tempSitesSelectItem;
    }

    // Author: Tina
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

    // Author: Tina
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

    // Author: Tina
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

    // Author: Tina
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

    // Author: Tina
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

    // Author: Tina
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
            //     // 選擇all area, all group, 單一 device
            // } else if (
            //     this.filterData.firstSiteId &&
            //     this.inputFormData.areaId &&
            //     this.inputFormData.areaId === "all" &&
            //     this.inputFormData.groupId &&
            //     this.inputFormData.groupId === "all"
            // ) {
        }
    }

    // Author: Tina
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

    // Author: Tina
    async receiveUserData(data) {
        this.userData = [];
        this.userData = data;
        console.log("this.userData - ", this.userData);
    }

    // Author: Tina
    receiveModalShowData(data) {
        this.modalShow = data;
    }

    //// 以下為 analysis filter ////

    // Author: Tina
    async receiveFilterData(filterData) {
        this.inputFormData = {
            areaId: "",
            groupId: "",
            deviceId: "",
            type: "",
            inOrOut: "in",
            isIncludedEmployee: "no"
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
        this.filterData.startDate = new Date(this.filterData.startDate);
        this.filterData.endDate = new Date(this.filterData.endDate);

        console.log("this.filterData  - ", this.filterData);
        console.log("this.responseData  - ", this.responseData);

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
            inOrOut: "in",
            isIncludedEmployee: "no"
        };

        // get office hour data
        let tempISite: any = {};
        this.sites = [];

        for (const filterSiteId of this.filterData.siteIds) {
            for (const detail of this.officeHourItemDetail) {
                for (const officeHourSiteId of detail.sites) {
                    if (filterSiteId === officeHourSiteId.objectId) {
                        console.log("filterSiteId - ", filterSiteId);
                        console.log(
                            "officeHourSiteId.objectId - ",
                            officeHourSiteId.objectId
                        );
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

        this.dTimeMode = this.filterData.type;
        this.pSiteIds = this.filterData.siteIds;
        this.tags = this.filterData.tagIds;
        this.startDate = new Date(this.filterData.startDate);
        this.endDate = new Date(this.filterData.endDate);
        this.timeMode = this.filterData.type;
        this.areaMode = EAreaMode.all;
        this.sortOutChartData(this.responseData.summaryDatas);

        // Ben
        this.initDashboardData();
        this.initPeakTimeRange();
        this.initReportTable();

        console.log(" - ", this.sites);
        console.log(" - ", this.startDate);
        console.log(" - ", this.endDate);
        console.log(" - ", this.timeMode);
        console.log(" - ", this.areaMode);
        console.log(" chartDatas - ", this.chartDatas);
    }

    // Author: Tina & Morris
    sortOutChartData(datas: any) {
        let tempChartDatas: IChartTrafficData[] = [];
        let isOneDay = false;
        this.chartDatas = [];

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
                let tempDateChartData = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    traffic: 0,
                    revenue: 0,
                    transaction: 0
                };
                for (let siteId of this.filterData.siteIds) {
                    let tempSiteChartData = JSON.parse(
                        JSON.stringify(tempDateChartData)
                    );
                    tempSiteChartData.date = new Date(tempSiteChartData.date);
                    tempSiteChartData.siteObjectId = siteId;
                    tempChartDatas.push(tempSiteChartData);
                }
            }
        } else {
            // multipe day
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
                    traffic: 0,
                    revenue: 0,
                    transaction: 0
                };
                for (let siteId of this.filterData.siteIds) {
                    let tempSiteChartData = JSON.parse(
                        JSON.stringify(tempDateChartData)
                    );
                    tempSiteChartData.date = new Date(tempSiteChartData.date);
                    tempSiteChartData.siteObjectId = siteId;
                    tempChartDatas.push(tempSiteChartData);
                }
            }
        }

        // 取得date、siteObjectId資料
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
                    if (this.inputFormData.inOrOut == ETypeInOrOut.in) {
                        tempChartData.traffic += summary.in;
                        if (
                            this.inputFormData.isIncludedEmployee ==
                            EIncludedEmployee.no
                        ) {
                            tempChartData.traffic -= summary.inEmployee;
                        }
                    } else if (this.inputFormData.inOrOut == ETypeInOrOut.out) {
                        tempChartData.traffic += summary.out;
                        if (
                            this.inputFormData.isIncludedEmployee ==
                            EIncludedEmployee.no
                        ) {
                            tempChartData.traffic -= summary.outEmployee;
                        }
                    }
                    break;
                }
            }
        }

        for (let saleRecord of this.responseData.salesRecords) {
            let saleDateFormat = isOneDay
                ? Datetime.DateTime2String(
                      new Date(saleRecord.date),
                      "YYYY-MM-DD HH"
                  )
                : Datetime.DateTime2String(
                      new Date(saleRecord.date),
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
                    saleDateFormat == tempDateFormat &&
                    saleRecord.site.objectId == tempChartData.siteObjectId
                ) {
                    tempChartData.revenue += saleRecord.revenue;
                    tempChartData.transaction += saleRecord.transaction;
                    break;
                }
            }
        }

        for (let tempChartData of tempChartDatas) {
            let tempDateFormat = isOneDay
                ? Datetime.DateTime2String(tempChartData.date, "YYYY-MM-DD HH")
                : Datetime.DateTime2String(tempChartData.date, "YYYY-MM-DD");
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
                    this.responseData.weathers.splice(i, 1);
                    break;
                }
            }
        }
        this.chartDatas = tempChartDatas;
    }

    // Author: Tina
    async receiveAreaId(areaId) {
        this.inputFormData.areaId = areaId;
        console.log("areaId - ", this.inputFormData.areaId);

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

    // Author: Tina
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

    // Author: Tina
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

    // Author: Tina
    receiveType(type) {
        let chartRef: any = this.$refs.highcharts;
        this.inputFormData.type = type;
        this.timeMode = type;

        if (chartRef != undefined) {
            console.log("ready to start");
            chartRef.start();
        }

        console.log("type - ", this.inputFormData.type);

        console.log(" - ", this.sites);
        console.log(" - ", this.startDate);
        console.log(" - ", this.endDate);
        console.log(" - ", this.timeMode);
        console.log(" - ", this.areaMode);
        console.log(" chartDatas - ", this.chartDatas);
    }

    // Author: Tina
    async receiveInOrOut(inOrOut) {
        this.inputFormData.inOrOut = inOrOut;
        console.log("inOrOut - ", this.inputFormData.inOrOut);

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

    // Author: Tina
    async receiveIsIncludedEmployee(isIncludedEmployee) {
        this.inputFormData.isIncludedEmployee = isIncludedEmployee;
        console.log(
            "isIncludedEmployee - ",
            this.inputFormData.isIncludedEmployee
        );

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

    ////////////////////////////////////// Tina End //////////////////////////////////////

    ////////////////////////////////////// Export //////////////////////////////////////

    // Author: Ben
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

    ///////////////////////////////////////////////////////

    // Author: Morris, Product remove
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
                let tempDate = new Date(
                    `2019-07-${iString10}T${iString10}:00:00.000Z`
                );
                let tempChartData: IChartTrafficData = {
                    date: tempDate,
                    siteObjectId: "site" + (j + 1).toString(),
                    temperatureMin: iNumber,
                    temperatureMax: iNumber,
                    weather: weather,
                    traffic: Math.floor(Math.random() * 500),
                    revenue: Math.floor(Math.random() * 1000),
                    transaction: Math.floor(Math.random() * 50)
                };
                this.chartDatas.push(tempChartData);
            }
        }
    }
}
</script>


<style lang="scss" scoped>
</style>




