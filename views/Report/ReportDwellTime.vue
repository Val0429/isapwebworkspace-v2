<template>
    <div class="animated fadeIn">

        <!-- Tina -->
        <filter-condition
            :sitesSelectItem="sitesSelectItem"
            :tagSelectItem="tagSelectItem"
            :regionTreeItem="regionTreeItem"
            :ifAllSitesSelectItem="ifAllSitesSelectItem"
            :addPeriodSelectItem="addPeriodSelectItem"
            :templateItem="templateItem"
            :label="_('w_ReportFilterConditionComponent_')"
            @submit-data="receiveFilterData"
        >
        </filter-condition>

        <iv-card
            :label="filterData.siteIds.length !== 0 ? analysisTitle() : '' "
            :visible="visible"
        >
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

            <!-- Tina -->
            <analysis-filter-dwell-time
                class="mb-4 mt-3"
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
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

// Vue
import HighchartsDwellTime from "@/components/Reports/Highcharts/HighchartsDwellTime.vue";

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
    EDeviceMode,
    EIncludedEmployee,
    EAgeRange,
    EDwellTimeRange,
    EAreaMode,
    EChartMode,
    EPageType,
    ESign,
    EBusinessChart,
    EIfAllSelected,
    EAddPeriodSelect,
    EDesignationPeriod,
    IChartDwellTimeData,
    ISite,
    ITemplateItem,
    IFilterCondition,
    IReportToTemplateItem,
    ReportTableData
} from "@/components/Reports";

// Service
import Dialog from "@/services/Dialog";
import RegionAPI from "@/components/RegionTree/models/RegionAPI";
import ResponseFilter from "@/services/ResponseFilter";
import Datetime from "@/services/Datetime";
import ReportService from "@/components/Reports/models/ReportService";
import WeatherService from "@/components/Reports/models/WeatherService";
import HighchartsService from "@/components/Reports/models/HighchartsService";
import Loading from "@/services/Loading";

// Export
import toExcel from "@/services/Excel/json2excel";
import excel2json from "@/services/Excel/excel2json";
import ReportPDFService from "@/components/Reports/models/ReportPDFService";
import { EFileType, IReportTableTitle } from "@/components/Reports";


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
    sitesSelectItem: any = [];
    ifAllSitesSelectItem: any = [];
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

    reportTableTitle: IReportTableTitle = {
        titleCount: 0
    };

    //Sun ReportTable 相關
    sunRData = new ReportTableData();

    ///deatal ReportTable 相關
    detailRData = [];

    created() {
        // this.initChartDeveloper();
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
        this.ifAllSitesSelectItem = [
            { value: EIfAllSelected.all, text: this._("w_AllSites") },
            { value: EIfAllSelected.select, text: this._("w_SelectSites") }
        ];

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
        this.rData.noFoot = false;

        this.reportTableTitle = {
            titleCount: 1,
            title1: this._("w_DwellTime"),
            total1Title: this._("w_DwellTimeTotal")
        };

        //head
        this.rData.head = [];
        let sTime = null;
        let eTime = null;
        switch (chartMode) {
            case EChartMode.site1Day1:
            case EChartMode.siteXDay1:
                this.rData.thatDay = this.startDate; //單天記錄時間日期
                this.reportTableTitle.headTitle = this._(
                    "w_ReportDwellTime_DwellTimeByHours"
                );
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
                this.reportTableTitle.headTitle = this._(
                    "w_ReportDwellTime_DwellTimeByDays"
                );
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
                        item1: []
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
                    item1: []
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
                            link: true
                        };

                        for (let summaryData of this.responseData
                            .summaryDatas) {
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
                                        item1Count.valueRatio += ReportService.countRatio(
                                            summaryData.total /
                                                summaryData.count,
                                            summaryData.prevTotal /
                                                summaryData.prevCount
                                        );
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
                                }
                            }
                        }
                        tempArray[index].item1.push(item1Count);
                    }
                }
                this.rData.head = this.rData.head.map(
                    x =>
                        this.fetchZero(x) +
                        ":00 ~ " +
                        this.fetchZero(x + 1) +
                        ":00"
                );
                break;

            case EChartMode.site1DayX:
            case EChartMode.siteXDayX:
                for (let index in tempArray) {
                    for (let head of this.rData.head) {
                        let item1Count = {
                            value: 0,
                            valueRatio: 0,
                            link: true
                        };

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
                                        item1Count.valueRatio += ReportService.countRatio(
                                            summaryData.total /
                                                summaryData.count,
                                            summaryData.prevTotal /
                                                summaryData.prevCount
                                        );
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
                                    item1Count.valueRatio += ReportService.countRatio(
                                        summaryData.total / summaryData.count,
                                        summaryData.prevTotal /
                                            summaryData.prevCount
                                    );
                                }
                            }
                        }
                        tempArray[index].item1.push(item1Count);
                    }
                }
                this.rData.head = this.rData.head.map(
                    x =>
                        new Date(x).getFullYear() +
                        "/" +
                        this.fetchZero(new Date(x).getMonth() + 1) +
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

            let summaryDatas;
            let officeHours;
            Loading.show();
            await this.$server
                .C("/report/dwell-time/summary", filterData)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            summaryDatas = response.summaryDatas;
                            this.initSunReportTable(summaryDatas);
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
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

        let summaryDatas;
        let officeHours;
        Loading.show();

        // TODO: wait api
        await this.$server
            .C("/report/human-detection/summary-threshold", filterData)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.detailRData = response;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    initSunReportTable(summaryDatas) {
        this.lastTableStep = this.tableStep;
        this.tableStep = ETableStep.sunTable;
        let chartMode = EChartMode.site1Day1;

        this.sunRData.chartMode = chartMode;
        this.sunRData.noFoot = false;
        this.sunRData.thatDay = this.startDate; //單天記錄時間日期
        this.reportTableTitle.headTitle = this._(
            "w_ReportDwellTime_DwellTimeByHours"
        );

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
        for (let summaryData of summaryDatas) {
            if (
                summaryData.deviceGroups &&
                summaryData.deviceGroups.length > 0
            ) {
                for (let deviceGroup of summaryData.deviceGroups) {
                    let body = {
                        site: summaryData.site,
                        area: summaryData.area,
                        group: deviceGroup,
                        item1: []
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
                    item1: []
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
                let item1Count = { value: 0, valueRatio: 0, link: true };
                for (let summaryData of summaryDatas) {
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
                                item1Count.value += Math.round(
                                    summaryData.total / summaryData.count
                                );
                                item1Count.valueRatio += ReportService.countRatio(
                                    summaryData.total / summaryData.count,
                                    summaryData.prevTotal /
                                        summaryData.prevCount
                                );
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
                            item1Count.valueRatio += ReportService.countRatio(
                                summaryData.total / summaryData.count,
                                summaryData.prevTotal / summaryData.prevCount
                            );
                        }
                    }
                }
                tempArray[index].item1.push(item1Count);
            }
            this.sunRData.body = tempArray;
        }
        //調整head時間格式
        this.sunRData.head = this.sunRData.head.map(
            x => this.fetchZero(x) + ":00 ~ " + this.fetchZero(x + 1) + ":00"
        );
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
        }
    }

    async initSelectItemSite() {
        let tempSitesSelectItem = {};

        const readAllSiteParam: {
            type: string;
            paging: object;
        } = {
            type: "all",
            paging: { all: true }
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
        let param: any = { paging: { all: true } };
        await this.$server
            .R("/tag/all", param)
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
        let param: any = { paging: { all: true } };
        await this.$server
            .R("/location/tree", param)
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
            paging: object;
        } = {
            siteId: this.filterData.firstSiteId,
            paging: { all: true }
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
            paging: object;
        } = {
            siteId: this.filterData.firstSiteId,
            mode: this.deviceMode,
            paging: { all: true }
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
            paging: object;
        } = {
            siteId: this.filterData.firstSiteId,
            mode: this.deviceMode,
            paging: { all: true }
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
        let param: any = { paging: { all: true } };

        await this.$server
            .R("/user/user", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (
                        response.results != undefined &&
                        response.results.length > 0
                    ) {
                        for (const returnValue of response.results) {
                            tempUserSelectItem[
                                returnValue.objectId
                            ] = `${returnValue.username} - ${returnValue.email}`;
                        }
                        this.userSelectItem = tempUserSelectItem;
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
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

        Loading.show();
        await this.$server
            .C("/report/dwell-time/summary", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.responseData = response;
                    this.officeHourItemDetail = this.responseData.officeHours;
                    this.resolveSummary();
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
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

        //追加沒有的資料site傳入陣列 以便chart 單店多店判斷
        for (const filterSiteId of this.filterData.siteIds) {
            if (this.sites.some(x => x.objectId == filterSiteId)) {
                continue;
            }
            let tempISite = {
                objectId: filterSiteId,
                name: this.sitesSelectItem.filter(x => x.id == filterSiteId)[0]
                    .text,
                officeHour: []
            };
            this.sites.push(tempISite);
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
        this.initDashboardData();
        this.initReportTable();
    }

    fetchZero(value) {
        return value < 10 ? "0" + value : value;
    }
    analysisTitle(): string {
        let title = "Analysis - ";

        if (this.filterData.siteIds.length === 1) {
            for (const site of this.sitesSelectItem) {
                if (this.filterData.siteIds[0] === site.id) {
                    title += `${this._("w_Title_One_Site")} ${site.text}. `;
                }
            }
        } else {
            title += `${this._("w_Title_Many_Site_Start")} ${
                this.filterData.siteIds.length
            } ${this._("w_Title_Many_Site_End")} `;
        }

        title += `${this._("w_Title_StartDate")} ${Datetime.DateTime2String(
            this.filterData.startDate,
            Datetime.FormatDate
        )}. `;
        title += `${this._("w_Title_EndDate")} ${Datetime.DateTime2String(
            this.filterData.endDate,
            Datetime.FormatDate
        )}. `;

        if (this.filterData.tagIds.length === 1) {
            for (const tagId in this.tagSelectItem) {
                if (this.filterData.tagIds[0] === tagId) {
                    title += `${this._("w_Title_One_Tag")} ${
                        this.tagSelectItem[tagId]
                    }. `;
                }
            }
        } else if (this.filterData.tagIds.length >= 2) {
            title += `${this._("w_Title_Many_Tag_Start")} ${
                this.filterData.tagIds.length
            } ${this._("w_Title_Many_Tag_End")} `;
        } else {
            title += "";
        }

        this.visible = true;

        return title;
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
                let tempDate = Datetime.DateStart(this.filterData.startDate);
                tempDate.setHours(i);

                let tempDateChartDataLower5 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    dwellTime: 0,
                    ageRange: EAgeRange.none,
                    dwellTimeRange: EDwellTimeRange.lower5,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };

                let tempDateChartDataM5_15 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    dwellTime: 0,
                    ageRange: EAgeRange.none,
                    dwellTimeRange: EDwellTimeRange.m5_15,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };

                let tempDateChartDataM15_30 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    dwellTime: 0,
                    ageRange: EAgeRange.none,
                    dwellTimeRange: EDwellTimeRange.m15_30,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };

                let tempDateChartDataM30_60 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    dwellTime: 0,
                    ageRange: EAgeRange.none,
                    dwellTimeRange: EDwellTimeRange.m30_60,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };

                let tempDateChartDataM60_120 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    dwellTime: 0,
                    ageRange: EAgeRange.none,
                    dwellTimeRange: EDwellTimeRange.m60_120,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };

                let tempDateChartDataUpper120 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    dwellTime: 0,
                    ageRange: EAgeRange.none,
                    dwellTimeRange: EDwellTimeRange.upper120,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };

                for (let siteId of this.filterData.siteIds) {
                    for (let j = 0; j < 6; j++) {
                        switch (j) {
                            case 0:
                                for (let k = 0; k < 6; k++) {
                                    switch (k) {
                                        case 0:
                                            let tempLower20 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataLower5
                                                )
                                            );
                                            tempLower20.ageRange =
                                                EAgeRange.lower20;
                                            tempLower20.date = new Date(
                                                tempLower20.date
                                            );
                                            tempLower20.siteObjectId = siteId;
                                            tempChartDatas.push(tempLower20);
                                            break;
                                        case 1:
                                            let tempM21_30 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataLower5
                                                )
                                            );
                                            tempM21_30.ageRange =
                                                EAgeRange.m21_30;
                                            tempM21_30.date = new Date(
                                                tempM21_30.date
                                            );
                                            tempM21_30.siteObjectId = siteId;
                                            tempChartDatas.push(tempM21_30);
                                            break;
                                        case 2:
                                            let tempM31_40 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataLower5
                                                )
                                            );
                                            tempM31_40.ageRange =
                                                EAgeRange.m31_40;
                                            tempM31_40.date = new Date(
                                                tempM31_40.date
                                            );
                                            tempM31_40.siteObjectId = siteId;
                                            tempChartDatas.push(tempM31_40);
                                            break;
                                        case 3:
                                            let tempM41_50 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataLower5
                                                )
                                            );
                                            tempM41_50.ageRange =
                                                EAgeRange.m41_50;
                                            tempM41_50.date = new Date(
                                                tempM41_50.date
                                            );
                                            tempM41_50.siteObjectId = siteId;
                                            tempChartDatas.push(tempM41_50);
                                            break;
                                        case 4:
                                            let tempM51_60 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataLower5
                                                )
                                            );
                                            tempM51_60.ageRange =
                                                EAgeRange.m51_60;
                                            tempM51_60.date = new Date(
                                                tempM51_60.date
                                            );
                                            tempM51_60.siteObjectId = siteId;
                                            tempChartDatas.push(tempM51_60);
                                            break;
                                        case 5:
                                            let tempUpper61 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataLower5
                                                )
                                            );
                                            tempUpper61.ageRange =
                                                EAgeRange.upper61;
                                            tempUpper61.date = new Date(
                                                tempUpper61.date
                                            );
                                            tempUpper61.siteObjectId = siteId;
                                            tempChartDatas.push(tempUpper61);
                                            break;
                                    }
                                }
                                break;
                            case 1:
                                for (let k = 0; k < 6; k++) {
                                    switch (k) {
                                        case 0:
                                            let tempLower20 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM5_15
                                                )
                                            );
                                            tempLower20.ageRange =
                                                EAgeRange.lower20;
                                            tempLower20.date = new Date(
                                                tempLower20.date
                                            );
                                            tempLower20.siteObjectId = siteId;
                                            tempChartDatas.push(tempLower20);
                                            break;
                                        case 1:
                                            let tempM21_30 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM5_15
                                                )
                                            );
                                            tempM21_30.ageRange =
                                                EAgeRange.m21_30;
                                            tempM21_30.date = new Date(
                                                tempM21_30.date
                                            );
                                            tempM21_30.siteObjectId = siteId;
                                            tempChartDatas.push(tempM21_30);
                                            break;
                                        case 2:
                                            let tempM31_40 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM5_15
                                                )
                                            );
                                            tempM31_40.ageRange =
                                                EAgeRange.m31_40;
                                            tempM31_40.date = new Date(
                                                tempM31_40.date
                                            );
                                            tempM31_40.siteObjectId = siteId;
                                            tempChartDatas.push(tempM31_40);
                                            break;
                                        case 3:
                                            let tempM41_50 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM5_15
                                                )
                                            );
                                            tempM41_50.ageRange =
                                                EAgeRange.m41_50;
                                            tempM41_50.date = new Date(
                                                tempM41_50.date
                                            );
                                            tempM41_50.siteObjectId = siteId;
                                            tempChartDatas.push(tempM41_50);
                                            break;
                                        case 4:
                                            let tempM51_60 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM5_15
                                                )
                                            );
                                            tempM51_60.ageRange =
                                                EAgeRange.m51_60;
                                            tempM51_60.date = new Date(
                                                tempM51_60.date
                                            );
                                            tempM51_60.siteObjectId = siteId;
                                            tempChartDatas.push(tempM51_60);
                                            break;
                                        case 5:
                                            let tempUpper61 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM5_15
                                                )
                                            );
                                            tempUpper61.ageRange =
                                                EAgeRange.upper61;
                                            tempUpper61.date = new Date(
                                                tempUpper61.date
                                            );
                                            tempUpper61.siteObjectId = siteId;
                                            tempChartDatas.push(tempUpper61);
                                            break;
                                    }
                                }
                                break;
                            case 2:
                                for (let k = 0; k < 6; k++) {
                                    switch (k) {
                                        case 0:
                                            let tempLower20 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM15_30
                                                )
                                            );
                                            tempLower20.ageRange =
                                                EAgeRange.lower20;
                                            tempLower20.date = new Date(
                                                tempLower20.date
                                            );
                                            tempLower20.siteObjectId = siteId;
                                            tempChartDatas.push(tempLower20);
                                            break;
                                        case 1:
                                            let tempM21_30 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM15_30
                                                )
                                            );
                                            tempM21_30.ageRange =
                                                EAgeRange.m21_30;
                                            tempM21_30.date = new Date(
                                                tempM21_30.date
                                            );
                                            tempM21_30.siteObjectId = siteId;
                                            tempChartDatas.push(tempM21_30);
                                            break;
                                        case 2:
                                            let tempM31_40 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM15_30
                                                )
                                            );
                                            tempM31_40.ageRange =
                                                EAgeRange.m31_40;
                                            tempM31_40.date = new Date(
                                                tempM31_40.date
                                            );
                                            tempM31_40.siteObjectId = siteId;
                                            tempChartDatas.push(tempM31_40);
                                            break;
                                        case 3:
                                            let tempM41_50 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM15_30
                                                )
                                            );
                                            tempM41_50.ageRange =
                                                EAgeRange.m41_50;
                                            tempM41_50.date = new Date(
                                                tempM41_50.date
                                            );
                                            tempM41_50.siteObjectId = siteId;
                                            tempChartDatas.push(tempM41_50);
                                            break;
                                        case 4:
                                            let tempM51_60 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM15_30
                                                )
                                            );
                                            tempM51_60.ageRange =
                                                EAgeRange.m51_60;
                                            tempM51_60.date = new Date(
                                                tempM51_60.date
                                            );
                                            tempM51_60.siteObjectId = siteId;
                                            tempChartDatas.push(tempM51_60);
                                            break;
                                        case 5:
                                            let tempUpper61 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM15_30
                                                )
                                            );
                                            tempUpper61.ageRange =
                                                EAgeRange.upper61;
                                            tempUpper61.date = new Date(
                                                tempUpper61.date
                                            );
                                            tempUpper61.siteObjectId = siteId;
                                            tempChartDatas.push(tempUpper61);
                                            break;
                                    }
                                }
                                break;
                            case 3:
                                for (let k = 0; k < 6; k++) {
                                    switch (k) {
                                        case 0:
                                            let tempLower20 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM30_60
                                                )
                                            );
                                            tempLower20.ageRange =
                                                EAgeRange.lower20;
                                            tempLower20.date = new Date(
                                                tempLower20.date
                                            );
                                            tempLower20.siteObjectId = siteId;
                                            tempChartDatas.push(tempLower20);
                                            break;
                                        case 1:
                                            let tempM21_30 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM30_60
                                                )
                                            );
                                            tempM21_30.ageRange =
                                                EAgeRange.m21_30;
                                            tempM21_30.date = new Date(
                                                tempM21_30.date
                                            );
                                            tempM21_30.siteObjectId = siteId;
                                            tempChartDatas.push(tempM21_30);
                                            break;
                                        case 2:
                                            let tempM31_40 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM30_60
                                                )
                                            );
                                            tempM31_40.ageRange =
                                                EAgeRange.m31_40;
                                            tempM31_40.date = new Date(
                                                tempM31_40.date
                                            );
                                            tempM31_40.siteObjectId = siteId;
                                            tempChartDatas.push(tempM31_40);
                                            break;
                                        case 3:
                                            let tempM41_50 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM30_60
                                                )
                                            );
                                            tempM41_50.ageRange =
                                                EAgeRange.m41_50;
                                            tempM41_50.date = new Date(
                                                tempM41_50.date
                                            );
                                            tempM41_50.siteObjectId = siteId;
                                            tempChartDatas.push(tempM41_50);
                                            break;
                                        case 4:
                                            let tempM51_60 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM30_60
                                                )
                                            );
                                            tempM51_60.ageRange =
                                                EAgeRange.m51_60;
                                            tempM51_60.date = new Date(
                                                tempM51_60.date
                                            );
                                            tempM51_60.siteObjectId = siteId;
                                            tempChartDatas.push(tempM51_60);
                                            break;
                                        case 5:
                                            let tempUpper61 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM30_60
                                                )
                                            );
                                            tempUpper61.ageRange =
                                                EAgeRange.upper61;
                                            tempUpper61.date = new Date(
                                                tempUpper61.date
                                            );
                                            tempUpper61.siteObjectId = siteId;
                                            tempChartDatas.push(tempUpper61);
                                            break;
                                    }
                                }
                                break;
                            case 4:
                                for (let k = 0; k < 6; k++) {
                                    switch (k) {
                                        case 0:
                                            let tempLower20 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM60_120
                                                )
                                            );
                                            tempLower20.ageRange =
                                                EAgeRange.lower20;
                                            tempLower20.date = new Date(
                                                tempLower20.date
                                            );
                                            tempLower20.siteObjectId = siteId;
                                            tempChartDatas.push(tempLower20);
                                            break;
                                        case 1:
                                            let tempM21_30 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM60_120
                                                )
                                            );
                                            tempM21_30.ageRange =
                                                EAgeRange.m21_30;
                                            tempM21_30.date = new Date(
                                                tempM21_30.date
                                            );
                                            tempM21_30.siteObjectId = siteId;
                                            tempChartDatas.push(tempM21_30);
                                            break;
                                        case 2:
                                            let tempM31_40 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM60_120
                                                )
                                            );
                                            tempM31_40.ageRange =
                                                EAgeRange.m31_40;
                                            tempM31_40.date = new Date(
                                                tempM31_40.date
                                            );
                                            tempM31_40.siteObjectId = siteId;
                                            tempChartDatas.push(tempM31_40);
                                            break;
                                        case 3:
                                            let tempM41_50 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM60_120
                                                )
                                            );
                                            tempM41_50.ageRange =
                                                EAgeRange.m41_50;
                                            tempM41_50.date = new Date(
                                                tempM41_50.date
                                            );
                                            tempM41_50.siteObjectId = siteId;
                                            tempChartDatas.push(tempM41_50);
                                            break;
                                        case 4:
                                            let tempM51_60 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM60_120
                                                )
                                            );
                                            tempM51_60.ageRange =
                                                EAgeRange.m51_60;
                                            tempM51_60.date = new Date(
                                                tempM51_60.date
                                            );
                                            tempM51_60.siteObjectId = siteId;
                                            tempChartDatas.push(tempM51_60);
                                            break;
                                        case 5:
                                            let tempUpper61 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM60_120
                                                )
                                            );
                                            tempUpper61.ageRange =
                                                EAgeRange.upper61;
                                            tempUpper61.date = new Date(
                                                tempUpper61.date
                                            );
                                            tempUpper61.siteObjectId = siteId;
                                            tempChartDatas.push(tempUpper61);
                                            break;
                                    }
                                }
                                break;
                            case 5:
                                for (let k = 0; k < 6; k++) {
                                    switch (k) {
                                        case 0:
                                            let tempLower20 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataUpper120
                                                )
                                            );
                                            tempLower20.ageRange =
                                                EAgeRange.lower20;
                                            tempLower20.date = new Date(
                                                tempLower20.date
                                            );
                                            tempLower20.siteObjectId = siteId;
                                            tempChartDatas.push(tempLower20);
                                            break;
                                        case 1:
                                            let tempM21_30 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataUpper120
                                                )
                                            );
                                            tempM21_30.ageRange =
                                                EAgeRange.m21_30;
                                            tempM21_30.date = new Date(
                                                tempM21_30.date
                                            );
                                            tempM21_30.siteObjectId = siteId;
                                            tempChartDatas.push(tempM21_30);
                                            break;
                                        case 2:
                                            let tempM31_40 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataUpper120
                                                )
                                            );
                                            tempM31_40.ageRange =
                                                EAgeRange.m31_40;
                                            tempM31_40.date = new Date(
                                                tempM31_40.date
                                            );
                                            tempM31_40.siteObjectId = siteId;
                                            tempChartDatas.push(tempM31_40);
                                            break;
                                        case 3:
                                            let tempM41_50 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataUpper120
                                                )
                                            );
                                            tempM41_50.ageRange =
                                                EAgeRange.m41_50;
                                            tempM41_50.date = new Date(
                                                tempM41_50.date
                                            );
                                            tempM41_50.siteObjectId = siteId;
                                            tempChartDatas.push(tempM41_50);
                                            break;
                                        case 4:
                                            let tempM51_60 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataUpper120
                                                )
                                            );
                                            tempM51_60.ageRange =
                                                EAgeRange.m51_60;
                                            tempM51_60.date = new Date(
                                                tempM51_60.date
                                            );
                                            tempM51_60.siteObjectId = siteId;
                                            tempChartDatas.push(tempM51_60);
                                            break;
                                        case 5:
                                            let tempUpper61 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataUpper120
                                                )
                                            );
                                            tempUpper61.ageRange =
                                                EAgeRange.upper61;
                                            tempUpper61.date = new Date(
                                                tempUpper61.date
                                            );
                                            tempUpper61.siteObjectId = siteId;
                                            tempChartDatas.push(tempUpper61);
                                            break;
                                    }
                                }
                                break;
                        }
                    }
                }
            }
        } else {
            // multiple days
            let dateList = Datetime.DateList(
                this.filterData.startDate,
                this.filterData.endDate
            );

            for (let dateItem of dateList) {
                let tempDateChartDataLower5 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.none,
                    dwellTime: 0,
                    dwellTimeRange: EDwellTimeRange.lower5,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };

                let tempDateChartDataM5_15 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.none,
                    dwellTime: 0,
                    dwellTimeRange: EDwellTimeRange.m5_15,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };

                let tempDateChartDataM15_30 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.none,
                    dwellTime: 0,
                    dwellTimeRange: EDwellTimeRange.m15_30,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };

                let tempDateChartDataM30_60 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.none,
                    dwellTime: 0,
                    dwellTimeRange: EDwellTimeRange.m30_60,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };

                let tempDateChartDataM60_120 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.none,
                    dwellTime: 0,
                    dwellTimeRange: EDwellTimeRange.m60_120,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };

                let tempDateChartDataUpper120 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.none,
                    dwellTime: 0,
                    dwellTimeRange: EDwellTimeRange.upper120,
                    maleCount: 0,
                    femaleCount: 0,
                    revenue: 0,
                    transaction: 0
                };

                for (let siteId of this.filterData.siteIds) {
                    for (let j = 0; j < 6; j++) {
                        switch (j) {
                            case 0:
                                for (let k = 0; k < 6; k++) {
                                    switch (k) {
                                        case 0:
                                            let tempLower20 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataLower5
                                                )
                                            );
                                            tempLower20.ageRange =
                                                EAgeRange.lower20;
                                            tempLower20.date = new Date(
                                                tempLower20.date
                                            );
                                            tempLower20.siteObjectId = siteId;
                                            tempChartDatas.push(tempLower20);
                                            break;
                                        case 1:
                                            let tempM21_30 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataLower5
                                                )
                                            );
                                            tempM21_30.ageRange =
                                                EAgeRange.m21_30;
                                            tempM21_30.date = new Date(
                                                tempM21_30.date
                                            );
                                            tempM21_30.siteObjectId = siteId;
                                            tempChartDatas.push(tempM21_30);
                                            break;
                                        case 2:
                                            let tempM31_40 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataLower5
                                                )
                                            );
                                            tempM31_40.ageRange =
                                                EAgeRange.m31_40;
                                            tempM31_40.date = new Date(
                                                tempM31_40.date
                                            );
                                            tempM31_40.siteObjectId = siteId;
                                            tempChartDatas.push(tempM31_40);
                                            break;
                                        case 3:
                                            let tempM41_50 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataLower5
                                                )
                                            );
                                            tempM41_50.ageRange =
                                                EAgeRange.m41_50;
                                            tempM41_50.date = new Date(
                                                tempM41_50.date
                                            );
                                            tempM41_50.siteObjectId = siteId;
                                            tempChartDatas.push(tempM41_50);
                                            break;
                                        case 4:
                                            let tempM51_60 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataLower5
                                                )
                                            );
                                            tempM51_60.ageRange =
                                                EAgeRange.m51_60;
                                            tempM51_60.date = new Date(
                                                tempM51_60.date
                                            );
                                            tempM51_60.siteObjectId = siteId;
                                            tempChartDatas.push(tempM51_60);
                                            break;
                                        case 5:
                                            let tempUpper61 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataLower5
                                                )
                                            );
                                            tempUpper61.ageRange =
                                                EAgeRange.upper61;
                                            tempUpper61.date = new Date(
                                                tempUpper61.date
                                            );
                                            tempUpper61.siteObjectId = siteId;
                                            tempChartDatas.push(tempUpper61);
                                            break;
                                    }
                                }
                                break;
                            case 1:
                                for (let k = 0; k < 6; k++) {
                                    switch (k) {
                                        case 0:
                                            let tempLower20 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM5_15
                                                )
                                            );
                                            tempLower20.ageRange =
                                                EAgeRange.lower20;
                                            tempLower20.date = new Date(
                                                tempLower20.date
                                            );
                                            tempLower20.siteObjectId = siteId;
                                            tempChartDatas.push(tempLower20);
                                            break;
                                        case 1:
                                            let tempM21_30 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM5_15
                                                )
                                            );
                                            tempM21_30.ageRange =
                                                EAgeRange.m21_30;
                                            tempM21_30.date = new Date(
                                                tempM21_30.date
                                            );
                                            tempM21_30.siteObjectId = siteId;
                                            tempChartDatas.push(tempM21_30);
                                            break;
                                        case 2:
                                            let tempM31_40 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM5_15
                                                )
                                            );
                                            tempM31_40.ageRange =
                                                EAgeRange.m31_40;
                                            tempM31_40.date = new Date(
                                                tempM31_40.date
                                            );
                                            tempM31_40.siteObjectId = siteId;
                                            tempChartDatas.push(tempM31_40);
                                            break;
                                        case 3:
                                            let tempM41_50 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM5_15
                                                )
                                            );
                                            tempM41_50.ageRange =
                                                EAgeRange.m41_50;
                                            tempM41_50.date = new Date(
                                                tempM41_50.date
                                            );
                                            tempM41_50.siteObjectId = siteId;
                                            tempChartDatas.push(tempM41_50);
                                            break;
                                        case 4:
                                            let tempM51_60 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM5_15
                                                )
                                            );
                                            tempM51_60.ageRange =
                                                EAgeRange.m51_60;
                                            tempM51_60.date = new Date(
                                                tempM51_60.date
                                            );
                                            tempM51_60.siteObjectId = siteId;
                                            tempChartDatas.push(tempM51_60);
                                            break;
                                        case 5:
                                            let tempUpper61 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM5_15
                                                )
                                            );
                                            tempUpper61.ageRange =
                                                EAgeRange.upper61;
                                            tempUpper61.date = new Date(
                                                tempUpper61.date
                                            );
                                            tempUpper61.siteObjectId = siteId;
                                            tempChartDatas.push(tempUpper61);
                                            break;
                                    }
                                }
                                break;
                            case 2:
                                for (let k = 0; k < 6; k++) {
                                    switch (k) {
                                        case 0:
                                            let tempLower20 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM15_30
                                                )
                                            );
                                            tempLower20.ageRange =
                                                EAgeRange.lower20;
                                            tempLower20.date = new Date(
                                                tempLower20.date
                                            );
                                            tempLower20.siteObjectId = siteId;
                                            tempChartDatas.push(tempLower20);
                                            break;
                                        case 1:
                                            let tempM21_30 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM15_30
                                                )
                                            );
                                            tempM21_30.ageRange =
                                                EAgeRange.m21_30;
                                            tempM21_30.date = new Date(
                                                tempM21_30.date
                                            );
                                            tempM21_30.siteObjectId = siteId;
                                            tempChartDatas.push(tempM21_30);
                                            break;
                                        case 2:
                                            let tempM31_40 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM15_30
                                                )
                                            );
                                            tempM31_40.ageRange =
                                                EAgeRange.m31_40;
                                            tempM31_40.date = new Date(
                                                tempM31_40.date
                                            );
                                            tempM31_40.siteObjectId = siteId;
                                            tempChartDatas.push(tempM31_40);
                                            break;
                                        case 3:
                                            let tempM41_50 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM15_30
                                                )
                                            );
                                            tempM41_50.ageRange =
                                                EAgeRange.m41_50;
                                            tempM41_50.date = new Date(
                                                tempM41_50.date
                                            );
                                            tempM41_50.siteObjectId = siteId;
                                            tempChartDatas.push(tempM41_50);
                                            break;
                                        case 4:
                                            let tempM51_60 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM15_30
                                                )
                                            );
                                            tempM51_60.ageRange =
                                                EAgeRange.m51_60;
                                            tempM51_60.date = new Date(
                                                tempM51_60.date
                                            );
                                            tempM51_60.siteObjectId = siteId;
                                            tempChartDatas.push(tempM51_60);
                                            break;
                                        case 5:
                                            let tempUpper61 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM15_30
                                                )
                                            );
                                            tempUpper61.ageRange =
                                                EAgeRange.upper61;
                                            tempUpper61.date = new Date(
                                                tempUpper61.date
                                            );
                                            tempUpper61.siteObjectId = siteId;
                                            tempChartDatas.push(tempUpper61);
                                            break;
                                    }
                                }
                                break;
                            case 3:
                                for (let k = 0; k < 6; k++) {
                                    switch (k) {
                                        case 0:
                                            let tempLower20 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM30_60
                                                )
                                            );
                                            tempLower20.ageRange =
                                                EAgeRange.lower20;
                                            tempLower20.date = new Date(
                                                tempLower20.date
                                            );
                                            tempLower20.siteObjectId = siteId;
                                            tempChartDatas.push(tempLower20);
                                            break;
                                        case 1:
                                            let tempM21_30 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM30_60
                                                )
                                            );
                                            tempM21_30.ageRange =
                                                EAgeRange.m21_30;
                                            tempM21_30.date = new Date(
                                                tempM21_30.date
                                            );
                                            tempM21_30.siteObjectId = siteId;
                                            tempChartDatas.push(tempM21_30);
                                            break;
                                        case 2:
                                            let tempM31_40 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM30_60
                                                )
                                            );
                                            tempM31_40.ageRange =
                                                EAgeRange.m31_40;
                                            tempM31_40.date = new Date(
                                                tempM31_40.date
                                            );
                                            tempM31_40.siteObjectId = siteId;
                                            tempChartDatas.push(tempM31_40);
                                            break;
                                        case 3:
                                            let tempM41_50 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM30_60
                                                )
                                            );
                                            tempM41_50.ageRange =
                                                EAgeRange.m41_50;
                                            tempM41_50.date = new Date(
                                                tempM41_50.date
                                            );
                                            tempM41_50.siteObjectId = siteId;
                                            tempChartDatas.push(tempM41_50);
                                            break;
                                        case 4:
                                            let tempM51_60 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM30_60
                                                )
                                            );
                                            tempM51_60.ageRange =
                                                EAgeRange.m51_60;
                                            tempM51_60.date = new Date(
                                                tempM51_60.date
                                            );
                                            tempM51_60.siteObjectId = siteId;
                                            tempChartDatas.push(tempM51_60);
                                            break;
                                        case 5:
                                            let tempUpper61 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM30_60
                                                )
                                            );
                                            tempUpper61.ageRange =
                                                EAgeRange.upper61;
                                            tempUpper61.date = new Date(
                                                tempUpper61.date
                                            );
                                            tempUpper61.siteObjectId = siteId;
                                            tempChartDatas.push(tempUpper61);
                                            break;
                                    }
                                }
                                break;
                            case 4:
                                for (let k = 0; k < 6; k++) {
                                    switch (k) {
                                        case 0:
                                            let tempLower20 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM60_120
                                                )
                                            );
                                            tempLower20.ageRange =
                                                EAgeRange.lower20;
                                            tempLower20.date = new Date(
                                                tempLower20.date
                                            );
                                            tempLower20.siteObjectId = siteId;
                                            tempChartDatas.push(tempLower20);
                                            break;
                                        case 1:
                                            let tempM21_30 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM60_120
                                                )
                                            );
                                            tempM21_30.ageRange =
                                                EAgeRange.m21_30;
                                            tempM21_30.date = new Date(
                                                tempM21_30.date
                                            );
                                            tempM21_30.siteObjectId = siteId;
                                            tempChartDatas.push(tempM21_30);
                                            break;
                                        case 2:
                                            let tempM31_40 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM60_120
                                                )
                                            );
                                            tempM31_40.ageRange =
                                                EAgeRange.m31_40;
                                            tempM31_40.date = new Date(
                                                tempM31_40.date
                                            );
                                            tempM31_40.siteObjectId = siteId;
                                            tempChartDatas.push(tempM31_40);
                                            break;
                                        case 3:
                                            let tempM41_50 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM60_120
                                                )
                                            );
                                            tempM41_50.ageRange =
                                                EAgeRange.m41_50;
                                            tempM41_50.date = new Date(
                                                tempM41_50.date
                                            );
                                            tempM41_50.siteObjectId = siteId;
                                            tempChartDatas.push(tempM41_50);
                                            break;
                                        case 4:
                                            let tempM51_60 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM60_120
                                                )
                                            );
                                            tempM51_60.ageRange =
                                                EAgeRange.m51_60;
                                            tempM51_60.date = new Date(
                                                tempM51_60.date
                                            );
                                            tempM51_60.siteObjectId = siteId;
                                            tempChartDatas.push(tempM51_60);
                                            break;
                                        case 5:
                                            let tempUpper61 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataM60_120
                                                )
                                            );
                                            tempUpper61.ageRange =
                                                EAgeRange.upper61;
                                            tempUpper61.date = new Date(
                                                tempUpper61.date
                                            );
                                            tempUpper61.siteObjectId = siteId;
                                            tempChartDatas.push(tempUpper61);
                                            break;
                                    }
                                }
                                break;
                            case 5:
                                for (let k = 0; k < 6; k++) {
                                    switch (k) {
                                        case 0:
                                            let tempLower20 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataUpper120
                                                )
                                            );
                                            tempLower20.ageRange =
                                                EAgeRange.lower20;
                                            tempLower20.date = new Date(
                                                tempLower20.date
                                            );
                                            tempLower20.siteObjectId = siteId;
                                            tempChartDatas.push(tempLower20);
                                            break;
                                        case 1:
                                            let tempM21_30 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataUpper120
                                                )
                                            );
                                            tempM21_30.ageRange =
                                                EAgeRange.m21_30;
                                            tempM21_30.date = new Date(
                                                tempM21_30.date
                                            );
                                            tempM21_30.siteObjectId = siteId;
                                            tempChartDatas.push(tempM21_30);
                                            break;
                                        case 2:
                                            let tempM31_40 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataUpper120
                                                )
                                            );
                                            tempM31_40.ageRange =
                                                EAgeRange.m31_40;
                                            tempM31_40.date = new Date(
                                                tempM31_40.date
                                            );
                                            tempM31_40.siteObjectId = siteId;
                                            tempChartDatas.push(tempM31_40);
                                            break;
                                        case 3:
                                            let tempM41_50 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataUpper120
                                                )
                                            );
                                            tempM41_50.ageRange =
                                                EAgeRange.m41_50;
                                            tempM41_50.date = new Date(
                                                tempM41_50.date
                                            );
                                            tempM41_50.siteObjectId = siteId;
                                            tempChartDatas.push(tempM41_50);
                                            break;
                                        case 4:
                                            let tempM51_60 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataUpper120
                                                )
                                            );
                                            tempM51_60.ageRange =
                                                EAgeRange.m51_60;
                                            tempM51_60.date = new Date(
                                                tempM51_60.date
                                            );
                                            tempM51_60.siteObjectId = siteId;
                                            tempChartDatas.push(tempM51_60);
                                            break;
                                        case 5:
                                            let tempUpper61 = JSON.parse(
                                                JSON.stringify(
                                                    tempDateChartDataUpper120
                                                )
                                            );
                                            tempUpper61.ageRange =
                                                EAgeRange.upper61;
                                            tempUpper61.date = new Date(
                                                tempUpper61.date
                                            );
                                            tempUpper61.siteObjectId = siteId;
                                            tempChartDatas.push(tempUpper61);
                                            break;
                                    }
                                }
                                break;
                        }
                    }
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
                    let dwellTimeRangeIndex = 0;

                    switch (tempChartData.dwellTimeRange) {
                        case EDwellTimeRange.lower5:
                            dwellTimeRangeIndex = 0;
                            switch (tempChartData.ageRange) {
                                case EAgeRange.lower20:
                                    ageRangeIndex = 0;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m21_30:
                                    ageRangeIndex = 1;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m31_40:
                                    ageRangeIndex = 2;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m41_50:
                                    ageRangeIndex = 3;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m51_60:
                                    ageRangeIndex = 4;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.upper61:
                                    ageRangeIndex = 5;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                            }
                            break;
                        case EDwellTimeRange.m5_15:
                            dwellTimeRangeIndex = 1;
                            switch (tempChartData.ageRange) {
                                case EAgeRange.lower20:
                                    ageRangeIndex = 0;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m21_30:
                                    ageRangeIndex = 1;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m31_40:
                                    ageRangeIndex = 2;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m41_50:
                                    ageRangeIndex = 3;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m51_60:
                                    ageRangeIndex = 4;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.upper61:
                                    ageRangeIndex = 5;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                            }
                            break;
                        case EDwellTimeRange.m15_30:
                            dwellTimeRangeIndex = 2;
                            switch (tempChartData.ageRange) {
                                case EAgeRange.lower20:
                                    ageRangeIndex = 0;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m21_30:
                                    ageRangeIndex = 1;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m31_40:
                                    ageRangeIndex = 2;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m41_50:
                                    ageRangeIndex = 3;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m51_60:
                                    ageRangeIndex = 4;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.upper61:
                                    ageRangeIndex = 5;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                            }
                            break;
                        case EDwellTimeRange.m30_60:
                            dwellTimeRangeIndex = 3;
                            switch (tempChartData.ageRange) {
                                case EAgeRange.lower20:
                                    ageRangeIndex = 0;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m21_30:
                                    ageRangeIndex = 1;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m31_40:
                                    ageRangeIndex = 2;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m41_50:
                                    ageRangeIndex = 3;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m51_60:
                                    ageRangeIndex = 4;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.upper61:
                                    ageRangeIndex = 5;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                            }
                            break;
                        case EDwellTimeRange.m60_120:
                            dwellTimeRangeIndex = 4;
                            switch (tempChartData.ageRange) {
                                case EAgeRange.lower20:
                                    ageRangeIndex = 0;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m21_30:
                                    ageRangeIndex = 1;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m31_40:
                                    ageRangeIndex = 2;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m41_50:
                                    ageRangeIndex = 3;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m51_60:
                                    ageRangeIndex = 4;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.upper61:
                                    ageRangeIndex = 5;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                            }
                            break;
                        case EDwellTimeRange.upper120:
                            dwellTimeRangeIndex = 5;
                            switch (tempChartData.ageRange) {
                                case EAgeRange.lower20:
                                    ageRangeIndex = 0;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m21_30:
                                    ageRangeIndex = 1;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m31_40:
                                    ageRangeIndex = 2;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m41_50:
                                    ageRangeIndex = 3;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.m51_60:
                                    ageRangeIndex = 4;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                                case EAgeRange.upper61:
                                    ageRangeIndex = 5;
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                    summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];

                                    tempChartData.maleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].maleRanges[ageRangeIndex];
                                    tempChartData.femaleCount += summary.dwellTimeRanges[dwellTimeRangeIndex].femaleRanges[ageRangeIndex];
                                    tempChartData.dwellTime = Number((summary.total / 60).toFixed(2));

                                    if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                                        tempChartData.maleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].maleEmployeeRanges[ageRangeIndex];
                                        tempChartData.femaleCount -= summary.dwellTimeRanges[dwellTimeRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                                    }
                                    break;
                            }
                            break;
                    }

                    // summary.dwellTimeRanges[ageRangeIndex].maleRanges[ageRangeIndex] = summary.dwellTimeRanges[ageRangeIndex].maleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[ageRangeIndex].maleRanges[ageRangeIndex];
                    // summary.dwellTimeRanges[ageRangeIndex].femaleRanges[ageRangeIndex] = summary.dwellTimeRanges[ageRangeIndex].femaleRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[ageRangeIndex].femaleRanges[ageRangeIndex];
                    // summary.dwellTimeRanges[ageRangeIndex].maleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[ageRangeIndex].maleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[ageRangeIndex].maleEmployeeRanges[ageRangeIndex];
                    // summary.dwellTimeRanges[ageRangeIndex].femaleEmployeeRanges[ageRangeIndex] = summary.dwellTimeRanges[ageRangeIndex].femaleEmployeeRanges[ageRangeIndex] === null ? 0 : summary.dwellTimeRanges[ageRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                    //
                    // tempChartData.maleCount += summary.dwellTimeRanges[ageRangeIndex].maleRanges[ageRangeIndex];
                    // tempChartData.femaleCount += summary.dwellTimeRanges[ageRangeIndex].femaleRanges[ageRangeIndex];
                    //
                    // if (this.inputFormData.isIncludedEmployee === EIncludedEmployee.no) {
                    //     tempChartData.maleCount -= summary.dwellTimeRanges[ageRangeIndex].maleEmployeeRanges[ageRangeIndex];
                    //     tempChartData.femaleCount -= summary.dwellTimeRanges[ageRangeIndex].femaleEmployeeRanges[ageRangeIndex];
                    // }

                }
            }

            for (let saleRecord of this.responseData.salesRecords) {

                let saleDateFormat = isOneDay
                    ? Datetime.DateTime2String(
                        new Date(saleRecord.date),
                        `${Datetime.FormatCheckDate} HH`
                    )
                    : Datetime.DateTime2String(
                        new Date(saleRecord.date),
                        Datetime.FormatCheckDate
                    );


                let tempDateFormat = isOneDay
                    ? Datetime.DateTime2String(
                        tempChartData.date,
                        `${Datetime.FormatCheckDate} HH`
                    )
                    : Datetime.DateTime2String(
                        tempChartData.date,
                        Datetime.FormatCheckDate
                    );
                if (
                    saleDateFormat == tempDateFormat &&
                    saleRecord.site.objectId == tempChartData.siteObjectId
                ) {
                    tempChartData.revenue += saleRecord.revenue;
                    tempChartData.transaction += saleRecord.transaction;
                    break;
                }

                    if (
                        saleDateFormat == tempDateFormat &&
                        saleRecord.site.objectId == tempChartData.siteObjectId
                    ) {
                        tempChartData.revenue += saleRecord.revenue;
                        tempChartData.transaction += saleRecord.transaction;
                        break;
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

        console.log('this.chartDatas ~ ', JSON.stringify(this.chartDatas))

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
            mode: EDeviceMode.dwellTime,
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
            Datetime.DateTime2String(this.startDate, Datetime.FormatCheckDate)
        ];
        toExcel({ th, data, fileName, fileType, sheetName });
    }

    // Author: Morris
    exportPDF() {
        let title = "";
        title += this._("w_Navigation_Report_DwellTime");
        title += " ";
        title += Datetime.DateTime2String(
            this.startDate,
            HighchartsService.datetimeFormat.date
        );
        ReportPDFService.exportPDF(title);
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
                    transaction: Math.floor(Math.random() * 50),
                    dwellTime: Math.floor(Math.random() * 2)
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
