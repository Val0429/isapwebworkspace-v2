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
                    <iv-toolbox-copy-to-template
                        size="lg"
                        @click="pageToReportTemplate()"
                    />
                </template>

                <!-- Tina -->
                <analysis-filter-dwell-time
                    class="mb-4"
                    :areaSelectItem="areaSelectItem"
                    :deviceGroupSelectItem="deviceGroupSelectItem"
                    :deviceSelectItem="deviceSelectItem"
                    :timeModeSelectItem="timeModeSelectItem"
                    :isIncludedEmployeeSelectItem="isIncludedEmployeeSelectItem"
                    :businessChartTypeSelectItem="businessChartTypeSelectItem"
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
                    @business_chart_type="receiveBusinessChartType"
                >

                </analysis-filter-dwell-time>

                <!-- Ben -->
                <anlysis-dashboard
                    ref="analysisDashboard"
                    :startDate="startDate"
                    :endDate="endDate"
                    :type="dTimeMode"
                    :siteIds="pSiteIds"
                    :tagIds="tags"
                    :pageType="dPageType"
                >
                </anlysis-dashboard>

                <!-- Morris -->
                <highcharts-dwell-time
                    ref="test"
                    :startDate="startDate"
                    :endDate="endDate"
                    :sites="sites"
                    :timeMode="timeMode"
                    :areaMode="areaMode"
                    :businessMode="inputFormData.businessChartType"
                    :value="chartDatas"
                >
                </highcharts-dwell-time>

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

                <dwell-time-table
                    ref="detailReportTable"
                    v-show="tableStep === eTableStep.detailTable"
                    :thresholdDetailTableContent="detailRData"
                >
                </dwell-time-table>

                <div>
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

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Dialog from "@/services/Dialog";
import HighchartsDwellTime from "@/components/Reports/Highcharts/HighchartsDwellTime.vue";

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
    IDayRange,
    ECountType,
    EDeviceMode,
    EIncludedEmployee,
    EAgeRange,
    EDwellTimeRange,
    EAreaMode,
    EChartMode,
    EPageType,
    ESign,
    IChartDwellTimeData,
    IPeckTimeRange,
    ISite,
    ISiteItems,
    ITemplateItem,
    IFilterCondition,
    ReportDashboard,
    ReportTableData,
    EDesignationPeriod,
    IReportToTemplateItem,
    EBusinessChart
} from "@/components/Reports";

///////////////////////// export /////////////////////////
import html2Canvas from "html2canvas";
import JsPDF from "jspdf";
import toExcel from "@/services/Excel/json2excel";
import excel2json from "@/services/Excel/excel2json";

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

@Component({
    components: {
        HighchartsDwellTime
    }
})
export default class ReportDwellTime extends Vue {
    lastTableStep: ETableStep = ETableStep.none;
    tableStep: ETableStep = ETableStep.none;
    eTableStep = ETableStep;
    ePageType = EPageType;
    eWeather = EWeather;
    eFileType = EFileType;

    templateItem: ITemplateItem | null = null;

    startDate: Date = new Date("2019-01-01T00:00:00.000Z");
    endDate: Date = new Date("2019-01-01T01:00:00.000Z");
    timeMode: ETimeMode = ETimeMode.none;
    areaMode: EAreaMode = EAreaMode.none;
    sites: ISite[] = [];
    chartDatas: IChartDwellTimeData[] = [];

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
    deviceMode: string = EDeviceMode.dwellTime;

    // select 相關
    areaSelectItem: any = {};
    deviceGroupSelectItem: any = {};
    deviceSelectItem: any = {};
    timeModeSelectItem: any = {};
    isIncludedEmployeeSelectItem: any = {};
    businessChartTypeSelectItem: any = {};

    inputFormData: any = {
        areaId: "",
        groupId: "",
        deviceId: "",
        type: "",
        isIncludedEmployee: EIncludedEmployee.no,
        businessChartType: EBusinessChart.revenue
    };

    // 整理 showReportData 相關
    areaSummaryFilter: any = [];
    deviceGroupSummaryFilter: any = [];
    deviceSummaryFilter: any = [];

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

    ///deatal ReportTable 相關
    detailRData = [];

    created() {
        this.initChartDeveloper();
        this.initTemplate();
        this.initDatas();
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

        this.businessChartTypeSelectItem = {
            revenue: this._("w_revenue"),
            asp: this._("w_asp"),
            transaction: this._("w_transaction"),
            conversion: this._("w_conversion")
        };
    }

    initTemplate() {
        if (this.$route.query.template != undefined) {
            let templateJSON: string = this.$route.query.template as string;
            this.templateItem = ReportService.analysisTemplate(templateJSON);
        }
    }

    // Ben //
    reportTableBack() {
        this.tableStep = this.lastTableStep;
        this.lastTableStep = ETableStep.mainTable;
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
                        item1: [],
                        item2: [],
                        item3: [],
                        item4: []
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
                    item1: [],
                    item2: [],
                    item3: [],
                    item4: []
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
                        let item1Count = {
                            value: 0,
                            valueRatio: 0,
                            link: false
                        };
                        let item2Count = {
                            value: 0,
                            valueRatio: 0,
                            link: true
                        };
                        let item3Count = {
                            value: 0,
                            valueRatio: 0,
                            link: true
                        };
                        let item4Count = {
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
                                        item1Count.value += Math.round(
                                            summaryData.total /
                                                summaryData.count
                                        );
                                        item1Count.valueRatio += 0;
                                        item2Count.value +=
                                            summaryData.mediumThreshold;
                                        item2Count.valueRatio += 0;
                                        item3Count.value +=
                                            summaryData.highThreshold;
                                        item3Count.valueRatio += 0;
                                        item4Count.value +=
                                            summaryData.maxValue;
                                        item4Count.valueRatio += 0;
                                    }
                                }
                            } else {
                                if (
                                    tempArray[index].area.objectId ==
                                    summaryData.area.objectId
                                ) {
                                    item1Count.value += Math.round(
                                        summaryData.total / summaryData.count
                                    );
                                    item1Count.valueRatio += 0;
                                    item2Count.value +=
                                        summaryData.mediumThreshold;
                                    item2Count.valueRatio += 0;
                                    item3Count.value +=
                                        summaryData.highThreshold;
                                    item3Count.valueRatio += 0;
                                    item4Count.value += summaryData.maxValue;
                                    item4Count.valueRatio += 0;
                                }
                            }
                        }
                        tempArray[index].item1.push(item1Count);
                        tempArray[index].item2.push(item2Count);
                        tempArray[index].item3.push(item3Count);
                        tempArray[index].item4.push(item4Count);
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
                        let item1Count = {
                            value: 0,
                            valueRatio: 0,
                            link: false
                        };
                        let item2Count = {
                            value: 0,
                            valueRatio: 0,
                            link: true
                        };
                        let item3Count = {
                            value: 0,
                            valueRatio: 0,
                            link: true
                        };
                        let item4Count = {
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
                                        item1Count.value += Math.round(
                                            summaryData.total /
                                                summaryData.count
                                        );
                                        item1Count.valueRatio += 0;
                                        item2Count.value +=
                                            summaryData.mediumThreshold;
                                        item2Count.valueRatio += 0;
                                        item3Count.value +=
                                            summaryData.highThreshold;
                                        item3Count.valueRatio += 0;
                                        item4Count.value +=
                                            summaryData.maxValue;
                                        item4Count.valueRatio += 0;
                                    }
                                }
                            } else {
                                if (
                                    tempArray[index].area.objectId ==
                                    summaryData.area.objectId
                                ) {
                                    item1Count.value += Math.round(
                                        summaryData.total / summaryData.count
                                    );
                                    item1Count.valueRatio += 0;
                                    item2Count.value +=
                                        summaryData.mediumThreshold;
                                    item2Count.valueRatio += 0;
                                    item3Count.value +=
                                        summaryData.highThreshold;
                                    item3Count.valueRatio += 0;
                                    item4Count.value += summaryData.maxValue;
                                    item4Count.valueRatio += 0;
                                }
                            }
                        }
                        tempArray[index].item1.push(item1Count);
                        tempArray[index].item2.push(item2Count);
                        tempArray[index].item3.push(item3Count);
                        tempArray[index].item4.push(item4Count);
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
                .C("/report/demographic/summary", filterData)
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
            type: rowName == "item2" ? "medium" : "high",
            areaId: sunArea
        };

        let summaryTableDatas;
        let officeHours;
        await this.$server
            .C("/report/human-detection/summary-threshold", filterData) //TODO wait api
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
                        item1: [],
                        item2: []
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
                    item1: [],
                    item2: []
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
                let item1Count = { value: 0, valueRatio: 0, link: false };
                let item2Count = { value: 0, valueRatio: 0, link: false };
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
                                item1Count.value += summaryData.maleTotal;
                                item1Count.valueRatio += ReportService.countRatio(
                                    summaryData.maleTotal,
                                    summaryData.prevMaleTotal
                                );
                                item2Count.value += summaryData.femaleTotal;
                                item2Count.valueRatio += ReportService.countRatio(
                                    summaryData.femaleTotal,
                                    summaryData.prevFemaleTotal
                                );
                            }
                        }
                    } else {
                        if (
                            tempArray[index].area.objectId ==
                            summaryData.area.objectId
                        ) {
                            item1Count.value += summaryData.maleTotal;
                            item1Count.valueRatio += ReportService.countRatio(
                                summaryData.maleTotal,
                                summaryData.prevMaleTotal
                            );
                            item2Count.value += summaryData.femaleTotal;
                            item2Count.valueRatio += ReportService.countRatio(
                                summaryData.femaleTotal,
                                summaryData.prevFemaleTotal
                            );
                        }
                    }
                }
                tempArray[index].item1.push(item1Count);
                tempArray[index].item2.push(item2Count);
            }
            this.sunRData.body = tempArray;
        }
        //調整head時間格式
        this.sunRData.head = this.sunRData.head.map(
            x => x + ":00 - " + (x + 1) + ":00"
        );
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
            isIncludedEmployee: EIncludedEmployee.no,
            businessChartType: EBusinessChart.revenue
        };

        // await this.$server
        //     .C("/report/demographic/summary", param)
        //     .then((response: any) => {
        //         if (response !== undefined) {
        //             this.responseData = response;
        //             this.officeHourItemDetail = this.responseData.officeHours;
        //             this.resolveSummary();
        //         }
        //     })
        //     .catch((e: any) => {
        //         if (e.res && e.res.statusCode && e.res.statusCode == 401) {
        //             return ResponseFilter.base(this, e);
        //         }
        //         console.log(e);
        //         return false;
        //     });
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
            isIncludedEmployee: EIncludedEmployee.no,
            businessChartType: EBusinessChart.revenue
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
        // this.dTimeMode = this.filterData.type;
        // this.pSiteIds = this.filterData.siteIds;
        this.tags = this.filterData.tagIds;
        this.startDate = new Date(this.filterData.startDate);
        this.endDate = new Date(this.filterData.endDate);
        this.timeMode = this.filterData.type;
        this.areaMode = EAreaMode.all;
        this.sortOutChartData(this.responseData.summaryDatas);

        //Ben
        this.initDashboardData();
        this.initReportTable();
    }

    initDashboardData() {
        this.dPageType = EPageType.averageDwellTime;
        setTimeout(() => {
            let analysisDashboard: any = this.$refs.analysisDashboard;
            analysisDashboard.initData();
        }, 300);
    }

    sortOutChartData(datas: any) {
        let tempChartDatas: IChartDwellTimeData[] = [];
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
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };
                let tempDateChartDataM21_30 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m21_30,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };
                let tempDateChartDataM31_40 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m31_40,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };
                let tempDateChartDataM41_50 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m41_50,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };
                let tempDateChartDataM51_60 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m51_60,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };
                let tempDateChartDataUpper61 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.upper61,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
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
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };
                let tempDateChartDataM21_30 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m21_30,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };
                let tempDateChartDataM31_40 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m31_40,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };
                let tempDateChartDataM41_50 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m41_50,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };
                let tempDateChartDataM51_60 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m51_60,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };
                let tempDateChartDataUpper61 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.upper61,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
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

    async receiveBusinessChartType(businessChartType) {
        this.inputFormData.businessChartType = businessChartType;

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

    exportExcel(fType) {
        let reportTable: any = null;
        if (this.tableStep == ETableStep.mainTable) {
            reportTable = this.$refs.reportTable;
        } else {
            reportTable = this.$refs.sunReportTable;
        }
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
            this._("w_Navigation_Report_DwellTime"),
            fType,
            Datetime.DateTime2String(this.startDate, "YYYY-MM-DD")
        ];
        toExcel({ th, data, fileName, fileType, sheetName });
    }

    exportPDF() {
        let title = "";
        title += this._("w_Navigation_Report_DwellTime");
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

    // Author: Morris, Product remove
    initChartDeveloper() {
        this.timeMode = ETimeMode.day;
        this.areaMode = EAreaMode.all;
        this.inputFormData.businessChartType = EBusinessChart.revenue;

        // single day
        this.startDate = new Date("2019-07-01T08:00:00.000Z");
        this.endDate = new Date("2019-07-01T14:00:00.000Z");

        // Multiple day
        this.startDate = new Date("2019-06-20T08:00:00.000Z");
        this.endDate = new Date("2019-07-10T14:00:00.000Z");

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
                let ageRange = EAgeRange.none;
                let dwellTimeRange = EDwellTimeRange.none;
                let weather = EWeather.none;

                let tempAgeRangeNumber = Math.floor(Math.random() * 300);
                let tempDwellTimeRangeNumber = Math.floor(Math.random() * 300);
                let tempWeatherNumber = Math.floor(Math.random() * 300);

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

                if (tempDwellTimeRangeNumber % 6 == 0) {
                    dwellTimeRange = EDwellTimeRange.lower5;
                } else if (tempDwellTimeRangeNumber % 6 == 1) {
                    dwellTimeRange = EDwellTimeRange.m5_15;
                } else if (tempDwellTimeRangeNumber % 6 == 2) {
                    dwellTimeRange = EDwellTimeRange.m15_30;
                } else if (tempDwellTimeRangeNumber % 6 == 3) {
                    dwellTimeRange = EDwellTimeRange.m30_60;
                } else if (tempDwellTimeRangeNumber % 6 == 4) {
                    dwellTimeRange = EDwellTimeRange.m60_120;
                } else if (tempDwellTimeRangeNumber % 6 == 5) {
                    dwellTimeRange = EDwellTimeRange.upper120;
                }

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
                let tempChartData: IChartDwellTimeData = {
                    date: tempDate,
                    siteObjectId: "site" + (j + 1).toString(),
                    temperatureMin: iNumber,
                    temperatureMax: iNumber,
                    weather: weather,
                    ageRange: ageRange,
                    dwellTimeRange: dwellTimeRange,
                    maleCount: Math.floor(Math.random() * 300),
                    femaleCount: Math.floor(Math.random() * 300),
                    revenue: Math.floor(Math.random() * 1000),
                    transaction: Math.floor(Math.random() * 50)
                };

                if (!isNaN(tempChartData.date.getTime())) {
                    this.chartDatas.push(tempChartData);
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
