<template>
    <div class="chart">
        <h2 v-if="mountAnyChart()">{{ _('w_ReportDwellTime_DwellTimeChart') }}</h2>
        <b-form-group>
            <b-row>
                <b-col cols='12'>
                    <b-form-group :label="'Demographic by Gender'"></b-form-group>
                    <b-form-radio-group
                        v-if="chartMode == eChartMode.siteXDayX"
                        v-model="selection.gender"
                        class="select-gender mb-4"
                        buttons
                        button-variant="outline-success"
                        name="radio-btn-outline"
                        :options="selectItem.dwellTime"
                        @change="changeDwellTime"
                    ></b-form-radio-group>

                    <!-- site1Day1 -->
                    <highcharts
                        ref="chartSite1Day1"
                        v-if="mountChart.site1Day1"
                        :options="chartOptions.site1Day1"
                    ></highcharts>

                    <!-- site1DayX -->
                    <highcharts
                        ref="chartSite1DayX"
                        v-if="mountChart.site1DayX"
                        :options="chartOptions.site1DayX"
                    ></highcharts>

                    <!-- siteXDay1 -->
                    <highcharts
                        ref="chartSiteXDay1"
                        v-if="mountChart.siteXDay1"
                        :options="chartOptions.siteXDay1"
                    ></highcharts>

                    <!-- siteXDayX -->
                    <highcharts
                        ref="chartSiteXDayX"
                        v-if="mountChart.siteXDayX"
                        :options="chartOptions.siteXDayX"
                    ></highcharts>

                </b-col>
            </b-row>

            <b-row>
                <b-col cols="12">
                    <b-form-group :label="_('w_ReportDwellTime_LabelDwellTimePercentage')"></b-form-group>
                </b-col>

                <b-col cols="6">
                    <highcharts
                        ref="chartAge"
                        v-if="mountChart.percentage"
                        :options="chartOptions.percentage"
                    ></highcharts>
                </b-col>
                <b-col cols="6">
                    <b-row>
                        <b-col cols="12">
                            <iv-form-selection
                                class='col-md-12'
                                :value="selection.dwellTimeRange"
                                :options="selectItem.dwellTimeRange"
                                @input="changeDwellTime"
                            ></iv-form-selection>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="6">
                            <highcharts
                                ref="chartAgeRange"
                                v-if="mountChart.ageRange"
                                :options="chartOptions.ageRange"
                            ></highcharts>
                        </b-col>
                        <b-col cols="6">
                            <highcharts
                                ref="chartGender"
                                v-if="mountChart.gender"
                                :options="chartOptions.gender"
                            ></highcharts>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-form-group>
    </div>
</template>

<script lang="ts">
import {
    Vue,
    Component,
    Prop,
    Emit,
    Model,
    Watch
} from "vue-property-decorator";

/// install Highcharts
import Highcharts from "highcharts";
import HighchartsVue from "highcharts-vue";
import exportingInit from "highcharts/modules/exporting";
exportingInit(Highcharts);
Vue.use(HighchartsVue);

// custom import
import {
    ETimeMode,
    EAreaMode,
    EChartMode,
    EWeather,
    EAgeRange,
    EDwellTimeRange,
    EGender,
    EBusinessChart
} from "../";
import {
    IValSelectItem,
    IBootstrapSelectItem,
    ISite,
    ISiteOfficeHourItem,
    IChartDwellTimeData
} from "../";
import Datetime from "@/services/Datetime";
import HighchartsService from "../models/HighchartsService";

@Component({
    components: {}
})
export class HighchartsDwellTime extends Vue {
    // Prop
    @Prop({
        type: Date,
        default: function() {
            return new Date();
        }
    })
    startDate: Date;

    @Prop({
        type: Date,
        default: function() {
            return new Date();
        }
    })
    endDate: Date;

    @Prop({
        type: String,
        default: function() {
            return ETimeMode.none;
        }
    })
    timeMode: ETimeMode;

    @Prop({
        type: String,
        default: function() {
            return EAreaMode.none;
        }
    })
    areaMode: EAreaMode;

    @Prop({
        type: String,
        default: function() {
            return EBusinessChart.revenue;
        }
    })
    businessMode: EBusinessChart;

    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    sites: ISite[];

    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    value: IChartDwellTimeData[];

    @Watch("value", { deep: true })
    private onValueChanged(
        newval: IChartDwellTimeData[],
        oldval: IChartDwellTimeData[]
    ) {
        this.start();
    }

    @Watch("timeMode")
    private onTimeModeChanged(newval: ETimeMode, oldval: ETimeMode) {
        this.start();
    }

    @Watch("businessMode")
    private onBusinessModeChanged(
        newval: EBusinessChart,
        oldval: EBusinessChart
    ) {
        this.start();
    }

    eChartMode = EChartMode;
    chartMode: EChartMode = EChartMode.none;

    mountChart: {
        site1Day1: boolean;
        site1DayX: boolean;
        siteXDay1: boolean;
        siteXDayX: boolean;
        percentage: boolean;
        ageRange: boolean;
        gender: boolean;
    } = {
        site1Day1: false,
        site1DayX: false,
        siteXDay1: false,
        siteXDayX: false,
        percentage: false,
        ageRange: false,
        gender: false
    };

    selection: { dwellTimeRange: EDwellTimeRange } = {
        dwellTimeRange: EDwellTimeRange.all
    };
    selectItem: {
        dwellTimeRange: IValSelectItem[];
    } = {
        dwellTimeRange: []
    };

    // chart options
    chartOptions: {
        site1Day1: object;
        site1DayX: object;
        siteXDay1: object;
        siteXDayX: object;
        percentage: object;
        ageRange: object;
        gender: object;
    } = {
        site1Day1: {},
        site1DayX: {},
        siteXDay1: {},
        siteXDayX: {},
        percentage: {},
        ageRange: {},
        gender: {}
    };

    created() {
        this.initSelectItem();
        this.start();
    }

    mounted() {}

    initSelectItem() {
        this.selectItem.dwellTimeRange = [
            {
                id: EDwellTimeRange.all,
                text: this._("w_Report_DwellTimeRangeAll")
            },
            {
                id: EDwellTimeRange.lower5,
                text: this._("w_Report_DwellTimeRangeLower5")
            },
            {
                id: EDwellTimeRange.m5_15,
                text: this._("w_Report_DwellTimeRangeM5_15")
            },
            {
                id: EDwellTimeRange.m15_30,
                text: this._("w_Report_DwellTimeRangeM15_30")
            },
            {
                id: EDwellTimeRange.m30_60,
                text: this._("w_Report_DwellTimeRangeM30_60")
            },
            {
                id: EDwellTimeRange.m60_120,
                text: this._("w_Report_DwellTimeRangeM60_120")
            },
            {
                id: EDwellTimeRange.upper120,
                text: this._("w_Report_DwellTimeRangeUpper120")
            }
        ];
    }

    start() {
        this.mountChart.site1Day1 = false;
        this.mountChart.site1DayX = false;
        this.mountChart.siteXDay1 = false;
        this.mountChart.siteXDayX = false;
        this.mountChart.percentage = false;
        this.mountChart.ageRange = false;
        this.mountChart.gender = false;

        this.chartMode = HighchartsService.chartMode(
            this.startDate,
            this.endDate,
            this.sites
        );

        // set same chartAge
        setTimeout(this.drawChartPercentage, 100);
        setTimeout(this.drawChartAgeRangeGender, 100);

        switch (this.chartMode) {
            case EChartMode.site1Day1:
                setTimeout(this.initSite1Day1, 100);
                break;
            case EChartMode.site1DayX:
                setTimeout(this.initSite1DayX, 100);
                break;
            case EChartMode.siteXDay1:
                setTimeout(this.initSiteXDay1, 100);
                break;
            case EChartMode.siteXDayX:
                setTimeout(this.initSiteXDayX, 100);
                break;
            default:
                break;
        }
    }

    mountAnyChart(): boolean {
        if (this.mountChart.site1Day1) {
            return true;
        }
        if (this.mountChart.site1DayX) {
            return true;
        }
        if (this.mountChart.siteXDay1) {
            return true;
        }
        if (this.mountChart.siteXDayX) {
            return true;
        }
        if (this.mountChart.percentage) {
            return true;
        }
        if (this.mountChart.ageRange) {
            return true;
        }
        if (this.mountChart.gender) {
            return true;
        }
        return false;
    }

    ////////////////////////// site 1 day 1 //////////////////////////

    initSite1Day1() {
        let tempValues: IChartDwellTimeData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempHourStrings: string[] = [];
        let tempCategories: string[] = [];
        let tempResult: IChartDwellTimeData[] = [];
        let tempSeries: any = [
            {
                name: this._("w_ReportDwellTime_DwellTimeRevenue"),
                type: "column",
                yAxis: 1,
                data: []
            },
            {
                name: this._("w_ReportDwellTime_DwellTimeDwellTime"),
                type: "spline",
                data: []
            }
        ];

        //// office hour group ////
        let weekDay = this.startDate.getDay();
        let officeHour: ISiteOfficeHourItem = HighchartsService.siteOfficeHour(
            weekDay,
            this.sites[0].officeHour
        );
        for (let i = officeHour.startHour; i <= officeHour.endHour; i++) {
            let hourString = i < 10 ? `0${i.toString()}` : i.toString();
            tempHourStrings.push(`${hourString}:00`);
        }
        //// office hour group ////

        // set data
        for (let categorie of tempHourStrings) {
            let haveValue = false;
            for (let i in tempValues) {
                let loopValue = tempValues[i];
                let value: IChartDwellTimeData = this.anysislyChartValue(
                    loopValue
                );
                if (value.timeString == categorie) {
                    haveValue = true;
                    tempResult.push(value);
                    tempValues.splice(parseInt(i), 1);
                    break;
                }
            }

            if (!haveValue) {
                let defaultValue = this.anysislyChartValueDefault();
                defaultValue.timeString = categorie;
                tempResult.push(defaultValue);
            }
        }

        // set result
        for (let result of tempResult) {
            tempSeries[0].data.push(result.revenue);
            tempSeries[1].data.push(result.dwellTime);

            tempCategories.push(
                HighchartsService.categorieStringWithJSON(
                    result.timeString,
                    result
                )
            );
        }

        switch (this.areaMode) {
            case EAreaMode.single:
                let singleSeries = [];

                singleSeries.push({
                    name: tempSeries[1].name,
                    data: tempSeries[1].data
                });

                // set chart options
                this.chartOptions.site1Day1 = {
                    chart: { zoomType: "x" },
                    exporting: { enabled: false },
                    title: { text: null },
                    subtitle: { text: null },
                    xAxis: {
                        crosshair: true,
                        categories: tempCategories,
                        labels: { useHTML: true }
                    },
                    yAxis: {
                        labels: { style: { color: "#000" } },
                        title: {
                            text: this._(
                                "w_ReportDwellTime_DwellTimeDwellTimeM"
                            ),
                            style: { color: "#000" }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        shared: true,
                        useHTML: true,
                        backgroundColor: "#333",
                        style: { color: "#fff" },
                        formatter: function(tooltip: any) {
                            let self: any = this;
                            let result = "";
                            if (self.x != undefined) {
                                try {
                                    // anysisly JSON
                                    let startIndex = self.x.indexOf(">{");
                                    let endIndex = self.x.indexOf("}<");
                                    let valueJson = self.x.substring(
                                        startIndex + 1,
                                        endIndex + 1
                                    );
                                    let newValue: any = JSON.parse(valueJson);

                                    // set value
                                    result += `${newValue.i18n.time}:${newValue.timeString}<br>`;
                                    result += `${newValue.i18n.dwellTime}: ${newValue.dwellTime.toFixed(2)}<br>`;
                                    result += `${newValue.i18n.maleCountPercent}: ${newValue.maleCountPercent} %<br>`;
                                    result += `${newValue.i18n.femaleCountPercent}: ${newValue.femaleCountPercent} %<br>`;

                                } catch (e) {
                                    console.log(e);
                                }
                            }
                            return result;
                        }
                    },
                    series: singleSeries
                };
                break;
            case EAreaMode.all:
            case EAreaMode.none:
            default:
                // set chart options
                this.chartOptions.site1Day1 = {
                    chart: { zoomType: "x" },
                    exporting: { enabled: false },
                    title: { text: null },
                    subtitle: { text: null },
                    xAxis: [
                        {
                            categories: tempCategories,
                            labels: { useHTML: true }
                        }
                    ],
                    yAxis: [
                        {
                            labels: { style: { color: "#000" } },
                            title: {
                                text: this._(
                                    "w_ReportDwellTime_DwellTimeDwellTimeM"
                                ),
                                style: { color: "#000" }
                            }
                        },
                        {
                            labels: { style: { color: "#000" } },
                            title: {
                                text: this._("w_ReportTraffic_TrafficRevenue"),
                                style: { color: "#000" }
                            },
                            opposite: true
                        }
                    ],
                    tooltip: {
                        enabled: true,
                        shared: true,
                        useHTML: true,
                        backgroundColor: "#333",
                        style: { color: "#fff" },
                        formatter: function(tooltip: any) {
                            let self: any = this;
                            let result = "";
                            if (self.x != undefined) {
                                try {
                                    // anysisly JSON
                                    let startIndex = self.x.indexOf(">{");
                                    let endIndex = self.x.indexOf("}<");
                                    let valueJson = self.x.substring(
                                        startIndex + 1,
                                        endIndex + 1
                                    );
                                    let newValue: any = JSON.parse(valueJson);

                                    // set value
                                    result += `${newValue.i18n.time}:${newValue.timeString}<br>`;
                                    result += `${newValue.i18n.dwellTime}: ${newValue.dwellTime.toFixed(2)}<br>`;
                                    result += `${newValue.i18n.maleCountPercent}: ${newValue.maleCountPercent} %<br>`;
                                    result += `${newValue.i18n.femaleCountPercent}: ${newValue.femaleCountPercent} %<br>`;

                                } catch (e) {
                                    console.log(e);
                                }
                            }
                            return result;
                        }
                    },
                    series: tempSeries
                };
                break;
        }

        this.mountChart.site1Day1 = true;
        let self = this;
        setTimeout(function() {
            self.mountChart.site1DayX = false;
            self.mountChart.siteXDay1 = false;
            self.mountChart.siteXDayX = false;
        }, 500);
    }

    ////////////////////////// site 1 day X //////////////////////////

    initSite1DayX() {
        let dwellTimeAVG = 0;
        let dwellTimeTotal = 0;
        let tempValues: IChartDwellTimeData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempResult: IChartDwellTimeData[] = [];
        let tempCategories: string[] = [];
        let tempSeries: any = [
            {
                name: this._("w_ReportTraffic_TrafficRevenue"),
                type: "column",
                yAxis: 1,
                data: []
            },
            {
                name: this._("w_ReportDwellTime_DwellTimeDwellTime"),
                type: "spline",
                data: []
            },
            {
                name: this._("w_ReportDwellTime_DwellTimeDwellTimeAVG"),
                type: "spline",
                data: []
            }
        ];

        // 避免時間相反造成無窮迴圈
        let sortDate = Datetime.SortDateGap(this.startDate, this.endDate);

        // 設置最大值避免無窮迴圈
        let categorieMaxlength = 10000;
        let categorieNowlength = 0;

        // 時間累加判斷用
        let tempTimestamp: number = sortDate.startDate.getTime();
        let endTimestamp: number = sortDate.endDate.getTime();
        let tempDate: Date = new Date(tempTimestamp);
        let dateGap: number =
            Math.floor(
                Math.abs(
                    sortDate.startDate.getTime() - sortDate.endDate.getTime()
                ) / Datetime.oneDayTimestamp
            ) + 1;

        while (
            tempTimestamp <= endTimestamp &&
            categorieNowlength < categorieMaxlength
        ) {
            let tempChartData: IChartDwellTimeData = this.anysislyChartValueDefault();

            // set site
            if (this.sites[0].objectId != undefined) {
                tempChartData.siteObjectId = this.sites[0].objectId;
                tempChartData.siteName = this.sites[0].name;
            }

            switch (this.timeMode) {
                case ETimeMode.year:
                    tempChartData.date = Datetime.YearStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateStart = Datetime.YearStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateEnd = Datetime.YearEnd(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateString = Datetime.DateTime2String(
                        tempChartData.date,
                        HighchartsService.datetimeFormat.year
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighchartsService.datetimeFormat.year
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighchartsService.datetimeFormat.year
                    );
                    break;

                case ETimeMode.quarter:
                    tempChartData.date = Datetime.QuarterStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateStart = Datetime.QuarterStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateEnd = Datetime.QuarterEnd(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateString = Datetime.DateTime2String(
                        tempChartData.date,
                        HighchartsService.datetimeFormat.month
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighchartsService.datetimeFormat.month
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighchartsService.datetimeFormat.month
                    );
                    break;

                case ETimeMode.month:
                    tempChartData.date = Datetime.MonthStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateStart = Datetime.MonthStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateEnd = Datetime.MonthEnd(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateString = Datetime.DateTime2String(
                        tempChartData.date,
                        HighchartsService.datetimeFormat.month
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighchartsService.datetimeFormat.month
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighchartsService.datetimeFormat.month
                    );
                    break;

                case ETimeMode.week:
                    tempChartData.date = Datetime.WeekStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateStart = Datetime.WeekStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateEnd = Datetime.WeekEnd(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateString = Datetime.DateTime2String(
                        tempChartData.date,
                        HighchartsService.datetimeFormat.date
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighchartsService.datetimeFormat.date
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighchartsService.datetimeFormat.date
                    );
                    break;

                case ETimeMode.day:
                case ETimeMode.hour:
                case ETimeMode.none:
                default:
                    tempChartData.date = Datetime.DateStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateStart = Datetime.DateStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateEnd = Datetime.DateEnd(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateString = Datetime.DateTime2String(
                        tempChartData.date,
                        HighchartsService.datetimeFormat.date
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighchartsService.datetimeFormat.date
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighchartsService.datetimeFormat.date
                    );
                    break;
            }

            let tempStartTimestamp = tempChartData.dateStart.getTime();
            let tempEndTimestamp = tempChartData.dateEnd.getTime() + 1000;

            tempChartData.timeString = Datetime.DateTime2String(
                tempChartData.dateStart,
                HighchartsService.datetimeFormat.time
            );
            tempChartData.quarterNumber = Datetime.QuarterNumber(
                tempChartData.dateStart
            );
            tempChartData.weekNumber = Datetime.WeekNumber(
                tempChartData.dateStart
            );

            let spliceIndexList: number[] = [];
            for (let i in tempValues) {
                let val = tempValues[i];
                let value: IChartDwellTimeData = this.anysislyChartValue(val);

                let valTimestamp = value.date.getTime();

                if (
                    value.siteObjectId == tempChartData.siteObjectId &&
                    valTimestamp >= tempStartTimestamp &&
                    valTimestamp < tempEndTimestamp
                ) {
                    tempChartData.dwellTime += value.dwellTime;
                    tempChartData.revenue += value.revenue;
                    tempChartData.transaction += value.transaction;
                    tempChartData.temperature = value.temperature;
                    tempChartData.temperatureMin = value.temperatureMin;
                    tempChartData.temperatureMax = value.temperatureMax;
                    tempChartData.maleCountPercent = value.maleCountPercent;
                    tempChartData.femaleCountPercent = value.femaleCountPercent;
                    tempChartData.weather = value.weather;
                    tempChartData.weatherIcon = HighchartsService.weatherIcon(
                        value.weather
                    );

                    spliceIndexList.push(parseInt(i));
                }
            }

            // tempValues 減肥
            for (let i = spliceIndexList.length - 1; i >= 0; i--) {
                tempValues.splice(spliceIndexList[i], 1);
            }

            // for calculate AVG
            dwellTimeTotal += tempChartData.dwellTime;

            // calculate conversion & ASP
            if (tempChartData.dwellTime != 0) {
                tempChartData.conversion = HighchartsService.formatFloat(
                    (tempChartData.transaction / tempChartData.dwellTime) * 100
                );
            }

            if (tempChartData.transaction > 0) {
                tempChartData.asp = HighchartsService.formatFloat(
                    tempChartData.revenue / tempChartData.transaction
                );
            }

            // push single series data
            tempResult.push(tempChartData);

            // set loop value
            categorieNowlength++;
            tempTimestamp = tempChartData.dateEnd.getTime() + 1000;
        }

        // calculate avg
        if (dateGap > 0) {
            dwellTimeAVG = HighchartsService.formatFloat(
                dwellTimeTotal / dateGap
            );
        }
        // set result
        for (let result of tempResult) {
            result.dwellTimeAVG = dwellTimeAVG;
            tempSeries[0].data.push(result.revenue);
            tempSeries[1].data.push(result.dwellTime);
            tempSeries[2].data.push(dwellTimeAVG);
            switch (this.timeMode) {
                case ETimeMode.year:
                case ETimeMode.month:
                    tempCategories.push(
                        HighchartsService.categorieStringWithJSON(
                            result.dateString,
                            result
                        )
                    );
                    break;
                case ETimeMode.quarter:
                    tempCategories.push(
                        HighchartsService.categorieStringWithJSON(
                            HighchartsService.categoriesQuarter(result.date),
                            result
                        )
                    );
                    break;
                case ETimeMode.week:
                    tempCategories.push(
                        HighchartsService.categorieStringWithJSON(
                            HighchartsService.categoriesWeek(result.date),
                            result
                        )
                    );
                    break;
                case ETimeMode.day:
                case ETimeMode.hour:
                case ETimeMode.none:
                default:
                    tempCategories.push(
                        HighchartsService.categorieStringWithJSON(
                            `${result.dateString} ${result.weatherIcon}`,
                            result
                        )
                    );
                    break;
            }
        }

        // set chart options
        this.chartOptions.site1DayX = {
            chart: { zoomType: "x" },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            xAxis: [
                {
                    crosshair: true,
                    categories: tempCategories,
                    labels: { useHTML: true }
                }
            ],
            yAxis: [
                {
                    labels: { style: { color: "#000" } },
                    title: {
                        text: this._("w_ReportDwellTime_DwellTimeDwellTimeM"),
                        style: { color: "#000" }
                    }
                },
                {
                    labels: { style: { color: "#000" } },
                    title: {
                        text: this._("w_ReportTraffic_TrafficRevenue"),
                        style: { color: "#000" }
                    },
                    opposite: true
                }
            ],
            tooltip: {
                enabled: true,
                shared: true,
                useHTML: true,
                backgroundColor: "#333",
                style: { color: "#fff" },
                formatter: function(tooltip: any) {
                    let self: any = this;
                    let result = "";
                    if (self.x != undefined) {
                        try {
                            let startIndex = self.x.indexOf(">{");
                            let endIndex = self.x.indexOf("}<");
                            let valueJson = self.x.substring(
                                startIndex + 1,
                                endIndex + 1
                            );
                            let newValue: any = JSON.parse(valueJson);

                            switch (newValue.timeMode) {
                                case ETimeMode.year:
                                case ETimeMode.quarter:
                                case ETimeMode.month:
                                case ETimeMode.week:
                                    result += `${newValue.i18n.startDate}: ${newValue.dateStartString}<br>`;
                                    result += `${newValue.i18n.endDate}: ${newValue.dateEndString}<br>`;
                                    result += `${newValue.i18n.dwellTime}: ${newValue.dwellTime.toFixed(2)}<br>`;
                                    result += `${newValue.i18n.maleCountPercent}: ${newValue.maleCountPercent} %<br>`;
                                    result += `${newValue.i18n.femaleCountPercent}: ${newValue.femaleCountPercent} %<br>`;
                                    result += `${newValue.i18n.revenue}: ${newValue.revenue}<br>`;
                                    result += `${newValue.i18n.transaction}: ${newValue.transaction}<br>`;
                                    result += `${newValue.i18n.conversion}: ${newValue.conversion}%<br>`;
                                    result += `${newValue.i18n.asp}: ${newValue.asp}<br>`;
                                    break;
                                case ETimeMode.day:
                                case ETimeMode.hour:
                                default:
                                    result += `${newValue.dateString}<br>`;
                                    result += `${newValue.i18n.temperatureMin}: ${newValue.temperatureMin}°C<br>`;
                                    result += `${newValue.i18n.temperatureMax}: ${newValue.temperatureMax}°C<br>`;
                                    result += `${newValue.i18n.dwellTime}: ${newValue.dwellTime.toFixed(2)}<br>`;
                                    result += `${newValue.i18n.maleCountPercent}: ${newValue.maleCountPercent} %<br>`;
                                    result += `${newValue.i18n.femaleCountPercent}: ${newValue.femaleCountPercent} %<br>`;
                                    result += `${newValue.i18n.dwellTimeAVG}: ${newValue.dwellTimeAVG.toFixed(2)}<br>`;
                                    result += `${newValue.i18n.revenue}: ${newValue.revenue}<br>`;
                                    result += `${newValue.i18n.transaction}: ${newValue.transaction}<br>`;
                                    result += `${newValue.i18n.conversion}: ${newValue.conversion}%<br>`;
                                    result += `${newValue.i18n.asp}: ${newValue.asp}<br>`;
                                    break;
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    return result;
                }
            },
            series: tempSeries
        };

        this.mountChart.site1DayX = true;
        let self = this;
        setTimeout(function() {
            self.mountChart.site1Day1 = false;
            self.mountChart.siteXDay1 = false;
            self.mountChart.siteXDayX = false;
        }, 500);
    }

    ////////////////////////// site X day 1 //////////////////////////

    initSiteXDay1() {
        let dwellTimeAVG = 0;
        let dwellTimeTotal = 0;
        let tempValues: IChartDwellTimeData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempResult: IChartDwellTimeData[] = [];
        let tempCategories: string[] = [];
        let tempSeries: any = [
            {
                name: this._("w_ReportTraffic_TrafficRevenue"),
                type: "column",
                yAxis: 1,
                data: []
            },
            {
                name: this._("w_ReportDwellTime_DwellTimeDwellTime"),
                type: "spline",
                data: []
            },
            {
                name: this._("w_ReportDwellTime_DwellTimeDwellTimeAVG"),
                type: "spline",
                data: []
            }
        ];

        for (let site of this.sites) {
            let haveValue = false;

            let spliceIndexList: number[] = [];
            for (let i in tempValues) {
                let loopValue = tempValues[i];
                let value: IChartDwellTimeData = this.anysislyChartValue(
                    loopValue
                );
                if (value.siteObjectId == site.objectId) {
                    haveValue = true;
                    let haveResult = false;
                    for (let result of tempResult) {
                        if (result.siteObjectId == site.objectId) {
                            haveResult = true;
                            result.dwellTime += value.dwellTime;
                            result.revenue += value.revenue;
                            result.maleCountPercent = value.maleCountPercent;
                            result.femaleCountPercent = value.femaleCountPercent;
                            break;
                        }
                    }
                    if (!haveResult) {
                        tempResult.push(value);
                    }

                    spliceIndexList.push(parseInt(i));
                }
            }

            // tempValues 減肥
            for (let i = spliceIndexList.length - 1; i >= 0; i--) {
                tempValues.splice(spliceIndexList[i], 1);
            }

            if (!haveValue) {
                let defaultValue = this.anysislyChartValueDefault();
                defaultValue.siteName = site.name;
                tempResult.push(defaultValue);
            }
        }

        // calculate avg
        if (tempResult.length > 0) {
            for (let result of tempResult) {
                dwellTimeTotal += result.dwellTime;
            }
            dwellTimeAVG = dwellTimeTotal / tempResult.length;
        }

        // set result
        for (let result of tempResult) {
            result.dwellTimeAVG = dwellTimeAVG;
            tempSeries[0].data.push(result.revenue);
            tempSeries[1].data.push(result.dwellTime);
            tempSeries[2].data.push(dwellTimeAVG);
            tempCategories.push(
                HighchartsService.categorieStringWithJSON(
                    `${result.siteName} ${result.weatherIcon}`,
                    result
                )
            );
        }

        // set chart options
        this.chartOptions.siteXDay1 = {
            chart: { zoomType: "x" },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            xAxis: [
                {
                    crosshair: true,
                    categories: tempCategories,
                    labels: { useHTML: true }
                }
            ],
            yAxis: [
                {
                    labels: { style: { color: "#000" } },
                    title: {
                        text: this._("w_ReportDwellTime_DwellTimeDwellTimeM"),
                        style: { color: "#000" }
                    }
                },
                {
                    labels: { style: { color: "#000" } },
                    title: {
                        text: this._("w_ReportTraffic_TrafficRevenue"),
                        style: { color: "#000" }
                    },
                    opposite: true
                }
            ],
            tooltip: {
                enabled: true,
                shared: true,
                useHTML: true,
                backgroundColor: "#333",
                style: { color: "#fff" },
                formatter: function(tooltip: any) {
                    let self: any = this;
                    let result = "";
                    if (self.x != undefined) {
                        try {
                            let startIndex = self.x.indexOf(">{");
                            let endIndex = self.x.indexOf("}<");
                            let valueJson = self.x.substring(
                                startIndex + 1,
                                endIndex + 1
                            );
                            let newValue: any = JSON.parse(valueJson);

                            ///////// tooltip /////////
                            result += `${newValue.siteName}<br>`;
                            result += `${newValue.i18n.date}: ${newValue.dateString}<br>`;
                            result += `${newValue.i18n.temperatureMin}: ${newValue.temperatureMin}°C<br>`;
                            result += `${newValue.i18n.temperatureMax}: ${newValue.temperatureMax}°C<br>`;
                            // result += `${newValue.i18n.maleCountPercent}: ${newValue.maleCountPercent} %<br>`;
                            // result += `${newValue.i18n.femaleCountPercent}: ${newValue.femaleCountPercent} %<br>`
                            result += `${newValue.i18n.dwellTime}: ${newValue.dwellTime.toFixed(2)}<br>`;
                            result += `${newValue.i18n.dwellTimeAVG}: ${newValue.dwellTimeAVG.toFixed(2)}<br>`;
                            result += `${newValue.i18n.revenue}: ${newValue.revenue}<br>`;
                            result += `${newValue.i18n.transaction}: ${newValue.transaction}<br>`;
                            result += `${newValue.i18n.conversion}: ${newValue.conversion}%<br>`;
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    return result;
                }
            },
            series: tempSeries
        };

        this.mountChart.siteXDay1 = true;
        let self = this;
        setTimeout(function() {
            self.mountChart.site1Day1 = false;
            self.mountChart.site1DayX = false;
            self.mountChart.siteXDayX = false;
        }, 500);
    }

    ////////////////////////// site X day X //////////////////////////

    initSiteXDayX() {
        let tempValues: IChartDwellTimeData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempResult: any[] = [];
        let tempCategories: string[] = [];
        let tempSeries: {
            name: string;
            data: number[];
        }[] = [];

        // 避免時間相反造成無窮迴圈
        let sortDate = Datetime.SortDateGap(this.startDate, this.endDate);

        // 設置最大值避免無窮迴圈
        let categorieMaxlength = 10000;
        let categorieNowlength = 0;

        // 時間累加判斷用
        let tempTimestamp: number = sortDate.startDate.getTime();
        let endTimestamp: number = sortDate.endDate.getTime();
        let tempDate: Date = new Date(tempTimestamp);
        let dateGap: number = Math.ceil(
            Math.abs(
                sortDate.startDate.getTime() - sortDate.endDate.getTime()
            ) / Datetime.oneDayTimestamp
        );

        while (
            tempTimestamp <= endTimestamp &&
            categorieNowlength < categorieMaxlength
        ) {
            let tempChartData: IChartDwellTimeData = this.anysislyChartValueDefault();
            let tempResultItem = {
                categorie: "",
                i18n: this.i18nItem(),
                sites: [],
                conversion: 0,
                asp: 0,
                timeMode: this.timeMode,
                areaMode: this.areaMode
            };
            tempChartData.i18n = null;
            tempChartData.timeMode = null;
            tempChartData.areaMode = null;

            switch (this.timeMode) {
                case ETimeMode.year:
                    tempChartData.date = Datetime.YearStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateStart = Datetime.YearStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateEnd = Datetime.YearEnd(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateString = Datetime.DateTime2String(
                        tempChartData.date,
                        HighchartsService.datetimeFormat.year
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighchartsService.datetimeFormat.year
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighchartsService.datetimeFormat.year
                    );
                    tempResultItem.categorie = Datetime.DateTime2String(
                        tempChartData.date,
                        HighchartsService.datetimeFormat.year
                    );
                    break;

                case ETimeMode.quarter:
                    tempChartData.date = Datetime.QuarterStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateStart = Datetime.QuarterStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateEnd = Datetime.QuarterEnd(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateString = Datetime.DateTime2String(
                        tempChartData.date,
                        HighchartsService.datetimeFormat.month
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighchartsService.datetimeFormat.month
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighchartsService.datetimeFormat.month
                    );
                    tempResultItem.categorie = HighchartsService.categoriesQuarter(
                        tempChartData.date
                    );
                    break;

                case ETimeMode.month:
                    tempChartData.date = Datetime.MonthStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateStart = Datetime.MonthStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateEnd = Datetime.MonthEnd(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateString = Datetime.DateTime2String(
                        tempChartData.date,
                        HighchartsService.datetimeFormat.month
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighchartsService.datetimeFormat.month
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighchartsService.datetimeFormat.month
                    );
                    tempResultItem.categorie = Datetime.DateTime2String(
                        tempChartData.date,
                        HighchartsService.datetimeFormat.month
                    );
                    break;

                case ETimeMode.week:
                    tempChartData.date = Datetime.WeekStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateStart = Datetime.WeekStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateEnd = Datetime.WeekEnd(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateString = Datetime.DateTime2String(
                        tempChartData.date,
                        HighchartsService.datetimeFormat.date
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighchartsService.datetimeFormat.date
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighchartsService.datetimeFormat.date
                    );
                    tempResultItem.categorie = Datetime.DateTime2String(
                        tempChartData.date,
                        HighchartsService.datetimeFormat.date
                    );
                    tempResultItem.categorie = HighchartsService.categoriesWeek(
                        tempChartData.date
                    );
                    break;

                case ETimeMode.day:
                case ETimeMode.hour:
                case ETimeMode.none:
                default:
                    tempChartData.date = Datetime.DateStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateStart = Datetime.DateStart(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateEnd = Datetime.DateEnd(
                        new Date(tempTimestamp)
                    );
                    tempChartData.dateString = Datetime.DateTime2String(
                        tempChartData.date,
                        HighchartsService.datetimeFormat.date
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighchartsService.datetimeFormat.date
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighchartsService.datetimeFormat.date
                    );
                    tempResultItem.categorie = Datetime.DateTime2String(
                        tempChartData.date,
                        HighchartsService.datetimeFormat.date
                    );
                    break;
            }

            let tempStartTimestamp = tempChartData.dateStart.getTime() - 1000;
            let tempEndTimestamp = tempChartData.dateEnd.getTime() + 1000;

            tempChartData.timeString = Datetime.DateTime2String(
                tempChartData.dateStart,
                HighchartsService.datetimeFormat.time
            );
            tempChartData.quarterNumber = Datetime.QuarterNumber(
                tempChartData.dateStart
            );
            tempChartData.weekNumber = Datetime.WeekNumber(
                tempChartData.dateStart
            );

            for (let site of this.sites) {
                let tempSiteValue = JSON.parse(JSON.stringify(tempChartData));
                tempSiteValue.siteObjectId = site.objectId;
                tempSiteValue.siteName = site.name;

                let spliceIndexList: number[] = [];
                for (let i in tempValues) {
                    let val = tempValues[i];
                    let value: IChartDwellTimeData = this.anysislyChartValue(
                        val
                    );
                    let valTimestamp = value.date.getTime();

                    if (
                        value.siteObjectId == tempSiteValue.siteObjectId &&
                        valTimestamp >= tempStartTimestamp &&
                        valTimestamp < tempEndTimestamp
                    ) {
                        tempSiteValue.dwellTime += value.dwellTime;
                        tempSiteValue.revenue += value.revenue;
                        tempSiteValue.transaction += value.transaction;
                        tempSiteValue.temperature = value.temperature;
                        tempSiteValue.temperatureMin = value.temperatureMin;
                        tempSiteValue.temperatureMax = value.temperatureMax;
                        if (
                            tempSiteValue.weather == EWeather.none &&
                            value.weather != EWeather.none
                        ) {
                            tempSiteValue.weather = value.weather;
                            tempSiteValue.weatherIcon = HighchartsService.weatherIcon(
                                value.weather
                            );
                        }
                        spliceIndexList.push(parseInt(i));
                    }
                }
                for (let i = spliceIndexList.length - 1; i >= 0; i--) {
                    tempValues.splice(spliceIndexList[i], 1);
                }
                tempResultItem.sites.push(tempSiteValue);
            }

            // push single series data
            tempResult.push(tempResultItem);

            // set loop value
            categorieNowlength++;
            tempTimestamp = tempChartData.dateEnd.getTime() + 1000;
        }

        // set series
        for (let site of this.sites) {
            let tempData: number[] = [];
            for (let tempItems of tempResult) {
                for (let tempItem of tempItems.sites) {
                    if (tempItem.siteObjectId == site.objectId) {
                        tempData.push(tempItem.dwellTime);
                        break;
                    }
                }
            }
            tempSeries.push({
                name: HighchartsService.categorieStringNotJSON(
                    site.name,
                    site.objectId
                ),
                data: tempData
            });
        }

        // set result
        for (let result of tempResult) {
            let dwellTimeTotal: number = 0;
            let transactionTotal: number = 0;
            let revenueTotal: number = 0;

            // calculate conversion & ASP
            for (let site of result.sites) {
                dwellTimeTotal += site.dwellTime;
                transactionTotal += site.transaction;
                revenueTotal += site.revenue;
            }

            if (dwellTimeTotal != 0) {
                result.conversion = HighchartsService.formatFloat(
                    (transactionTotal / dwellTimeTotal) * 100
                );
            }

            if (transactionTotal > 0) {
                result.asp = HighchartsService.formatFloat(
                    revenueTotal / transactionTotal
                );
            }



            switch (this.timeMode) {
                case ETimeMode.year:
                case ETimeMode.month:
                    tempCategories.push(
                        HighchartsService.categorieStringWithJSON(
                            result.categorie,
                            result
                        )
                    );
                    break;
                case ETimeMode.quarter:
                    tempCategories.push(
                        HighchartsService.categorieStringWithJSON(
                            result.categorie,
                            result
                        )
                    );
                    break;
                case ETimeMode.week:
                    tempCategories.push(
                        HighchartsService.categorieStringWithJSON(
                            result.categorie,
                            result
                        )
                    );
                    break;
                case ETimeMode.day:
                case ETimeMode.hour:
                case ETimeMode.none:
                default:
                    tempCategories.push(
                        HighchartsService.categorieStringWithJSON(
                            result.categorie,
                            result
                        )
                    );
                    break;
            }
        }

        this.chartOptions.siteXDayX = {
            chart: { zoomType: "x" },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            xAxis: {
                categories: tempCategories,
                labels: { useHTML: true }
            },
            yAxis: {
                labels: { style: { color: "#000" } },
                title: {
                    text: this._("w_ReportDwellTime_DwellTimeDwellTime"),
                    style: { color: "#000" }
                }
            },

            tooltip: {
                enabled: true,
                useHTML: true,
                backgroundColor: "#333",
                style: { color: "#fff" },
                formatter: function(tooltip: any) {
                    let self: any = this;
                    let result = "";
                    let siteId = "";

                    try {
                        let siteStartIndex = self.point.series.name.indexOf(
                            ">__"
                        );
                        let siteEndIndex = self.point.series.name.indexOf(
                            "__<"
                        );
                        siteId = self.point.series.name.substring(
                            siteStartIndex + 3,
                            siteEndIndex
                        );

                        let valueStartIndex = self.x.indexOf(">{");
                        let valueEndIndex = self.x.indexOf("}<");
                        let valueJson = self.x.substring(
                            valueStartIndex + 1,
                            valueEndIndex + 1
                        );
                        let newValue: any = JSON.parse(valueJson);

                        for (let site of newValue.sites) {
                            if (site.siteObjectId == siteId) {
                                switch (newValue.timeMode) {
                                    case ETimeMode.year:
                                    case ETimeMode.quarter:
                                    case ETimeMode.month:
                                    case ETimeMode.week:
                                        result += `${site.siteName}<br>`;
                                        result += `${newValue.i18n.startDate}: ${site.dateStartString}<br>`;
                                        result += `${newValue.i18n.endDate}: ${site.dateEndString}<br>`;
                                        result += `${newValue.i18n.dwellTime}: ${site.dwellTime.toFixed(2)}<br>`;
                                        result += `${newValue.i18n.revenue}: ${site.revenue}<br>`;
                                        result += `${newValue.i18n.transaction}: ${site.transaction}<br>`;
                                        result += `${newValue.i18n.conversion}: ${newValue.conversion}%<br>`;
                                        result += `${newValue.i18n.asp}: ${newValue.asp}<br>`;
                                        break;
                                    case ETimeMode.day:
                                    case ETimeMode.hour:
                                    default:
                                        result += `${site.siteName}<br>`;
                                        result += `${newValue.i18n.date}: ${newValue.categorie}<br>`;
                                        result += `${newValue.i18n.temperatureMin}: ${site.temperatureMin}°C<br>`;
                                        result += `${newValue.i18n.temperatureMax}: ${site.temperatureMax}°C<br>`;
                                        result += `${newValue.i18n.weather}: ${site.weatherIcon}<br>`;
                                        result += `${newValue.i18n.dwellTime}: ${site.dwellTime.toFixed(2)}<br>`;
                                        result += `${newValue.i18n.revenue}: ${site.revenue}<br>`;
                                        result += `${newValue.i18n.transaction}: ${site.transaction}<br>`;
                                        result += `${newValue.i18n.conversion}: ${newValue.conversion}%<br>`;
                                        result += `${newValue.i18n.asp}: ${newValue.asp}<br>`;
                                        break;
                                }
                                break;
                            }
                        }
                    } catch (e) {
                        console.log(e);
                    }

                    return result;
                }
            },
            series: tempSeries
        };

        this.mountChart.siteXDayX = true;
        let self = this;
        setTimeout(function() {
            self.mountChart.site1Day1 = false;
            self.mountChart.site1DayX = false;
            self.mountChart.siteXDay1 = false;
        }, 500);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    drawChartPercentage() {
        let tempValues: IChartDwellTimeData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let categories: string[] = HighchartsService.personCountRangeListDesc(
            this
        );
        let tempTotalCount: number = 0;
        let series: any = [
            {
                name: " ",
                data: [0, 0, 0, 0, 0, 0]
            }
        ];

        for (let value of tempValues) {
            let tempDwellTimeIndex = -1;
            switch (value.dwellTimeRange) {
                case EDwellTimeRange.upper120:
                    tempDwellTimeIndex = 0;
                    break;
                case EDwellTimeRange.m60_120:
                    tempDwellTimeIndex = 1;
                    break;
                case EDwellTimeRange.m30_60:
                    tempDwellTimeIndex = 2;
                    break;
                case EDwellTimeRange.m15_30:
                    tempDwellTimeIndex = 3;
                    break;
                case EDwellTimeRange.m5_15:
                    tempDwellTimeIndex = 4;
                    break;
                case EDwellTimeRange.lower5:
                    tempDwellTimeIndex = 5;
                    break;
                case EDwellTimeRange.none:
                default:
                    break;
            }

            if (tempDwellTimeIndex > -1) {
                series[0].data[tempDwellTimeIndex] += value.maleCount;
                series[0].data[tempDwellTimeIndex] += value.femaleCount;
                tempTotalCount += value.maleCount;
                tempTotalCount += value.femaleCount;
            }
        }

        if (tempTotalCount > 0) {
            // set data
            for (let i in series[0].data) {
                let iNumber = parseInt(i);
                series[0].data[iNumber] = HighchartsService.formatFloat(
                    (series[0].data[iNumber] / tempTotalCount) * 100
                );
            }

            // set chart options
            this.chartOptions.percentage = {
                chart: {
                    type: "bar",
                    zoomType: "x"
                },
                exporting: { enabled: false },
                title: { text: null },
                subtitle: { text: null },
                xAxis: {
                    categories: categories
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: null,
                        align: "high"
                    },
                    labels: {
                        formatter: function() {
                            let self: any = this;
                            return self.value + "%";
                        }
                    }
                },
                tooltip: { enabled: false },
                credits: { enabled: false },
                legend: { enabled: false },
                series: series
            };

            this.mountChart.percentage = true;
        }
    }

    drawChartAgeRangeGender() {
        let tempValues: IChartDwellTimeData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let categories: string[] = HighchartsService.ageRangeListDesc(this);
        let totalCount: number = 0;

        let barSeries = [
            {
                name: "AgeRange",
                data: [0, 0, 0, 0, 0, 0]
            }
        ];
        let pieSeriesData: any = [
            [this._("w_Male"), 0],
            [this._("w_Female"), 0]
        ];

        for (let val of tempValues) {
            let addValue = false;
            if (this.selection.dwellTimeRange == EDwellTimeRange.all) {
                addValue = true;
            } else if (val.dwellTimeRange == this.selection.dwellTimeRange) {
                addValue = true;
            }

            if (addValue) {
                let barSeriesDataIndex: number = 0;
                switch (val.ageRange) {
                    case EAgeRange.upper61:
                        barSeriesDataIndex = 0;
                        break;
                    case EAgeRange.m51_60:
                        barSeriesDataIndex = 1;
                        break;
                    case EAgeRange.m41_50:
                        barSeriesDataIndex = 2;
                        break;
                    case EAgeRange.m31_40:
                        barSeriesDataIndex = 3;
                        break;
                    case EAgeRange.m21_30:
                        barSeriesDataIndex = 4;
                        break;
                    case EAgeRange.lower20:
                        barSeriesDataIndex = 5;
                        break;
                }
                totalCount += val.maleCount;
                totalCount += val.femaleCount;
                barSeries[0].data[barSeriesDataIndex] += val.maleCount;
                barSeries[0].data[barSeriesDataIndex] += val.femaleCount;
                pieSeriesData[0][1] += val.maleCount;
                pieSeriesData[1][1] += val.femaleCount;
            }
        }

        if (totalCount > 0) {
            for (let i = 0; i < 6; i++) {
                barSeries[0].data[i] = HighchartsService.formatFloat(
                    (barSeries[0].data[i] / totalCount) * 100
                );
            }
        }

        this.chartOptions.ageRange = {
            chart: {
                type: "bar",
                zoomType: "x"
            },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            xAxis: {
                categories: categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: null,
                    align: "high"
                },
                labels: {
                    formatter: function() {
                        let self: any = this;
                        return self.value + "%";
                    }
                }
            },
            tooltip: { enabled: false },
            credits: { enabled: false },
            legend: { enabled: false },
            series: barSeries
        };

        this.chartOptions.gender = {
            chart: { zoomType: "x" },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            tooltip: { enabled: false },
            series: [
                {
                    type: "pie",
                    innerSize: "50%",
                    data: pieSeriesData
                }
            ]
        };

        this.mountChart.ageRange = true;
        this.mountChart.gender = true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    private anysislyChartValueDefault(): IChartDwellTimeData {
        let value: IChartDwellTimeData = {
            date: new Date(),
            siteObjectId: "",
            temperatureMin: 0,
            temperatureMax: 0,
            weather: EWeather.none,

            dwellTime: 0,
            ageRange: EAgeRange.none,
            dwellTimeRange: EDwellTimeRange.none,
            maleCount: 0,
            femaleCount: 0,
            revenue: 0,
            transaction: 0,

            conversion: 0,
            asp: 0,
            dwellTimeAVG: 0,
            maleCountPercent: 0,
            femaleCountPercent: 0,

            // every report
            siteName: "",
            timeMode: this.timeMode,
            areaMode: this.areaMode,
            i18n: this.i18nItem(),
            temperature: 0,
            weatherIcon: HighchartsService.weatherIcon(EWeather.none),
            weekNumber: Datetime.WeekNumber(new Date()),
            quarterNumber: Datetime.QuarterNumber(new Date()),
            dateStart: new Date(),
            dateEnd: new Date(),
            timeString: Datetime.DateTime2String(
                new Date(),
                HighchartsService.datetimeFormat.time
            ),
            dateString: Datetime.DateTime2String(
                new Date(),
                HighchartsService.datetimeFormat.date
            ),
            dateStartString: Datetime.DateTime2String(
                new Date(),
                HighchartsService.datetimeFormat.date
            ),
            dateEndString: Datetime.DateTime2String(
                new Date(),
                HighchartsService.datetimeFormat.date
            )
        };
        return value;
    }

    private anysislyChartValue(item: IChartDwellTimeData): IChartDwellTimeData {
        let value = JSON.parse(JSON.stringify(item));
        value.date = new Date(value.date);

        // value.maleCountPercent = 0;
        // value.femaleCountPercent = 0;
        value.conversion = 0;
        value.asp = 0;
        value.dwellTimeAVG = 0;

        // every report
        for (let site of this.sites) {
            if (site.objectId == value.siteObjectId) {
                value.siteName = site.name;
                break;
            }
        }
        value.timeMode = this.timeMode;
        value.areaMode = this.areaMode;
        value.i18n = this.i18nItem();
        value.temperature = HighchartsService.formatFloat(
            (value.temperatureMin + value.temperatureMax) / 2
        );
        value.weatherIcon = HighchartsService.weatherIcon(value.weather);
        value.weekNumber = Datetime.WeekNumber(value.date);
        value.quarterNumber = Datetime.QuarterNumber(value.date);

        switch (this.timeMode) {
            case ETimeMode.year:
                value.dateStart = Datetime.YearStart(value.date);
                value.dateEnd = Datetime.YearEnd(value.date);
                break;
            case ETimeMode.quarter:
                value.dateStart = Datetime.QuarterStart(value.date);
                value.dateEnd = Datetime.QuarterEnd(value.date);
                break;
            case ETimeMode.month:
                value.dateStart = Datetime.MonthStart(value.date);
                value.dateEnd = Datetime.MonthEnd(value.date);
                break;
            case ETimeMode.week:
                value.dateStart = Datetime.WeekStart(value.date);
                value.dateEnd = Datetime.WeekEnd(value.date);
                break;
            case ETimeMode.day:
            case ETimeMode.hour:
            case ETimeMode.none:
            default:
                value.dateStart = value.date;
                value.dateEnd = value.date;
                break;
        }
        value.timeString = Datetime.DateTime2String(
            value.date,
            HighchartsService.datetimeFormat.time
        );
        value.dateString = Datetime.DateTime2String(
            value.date,
            HighchartsService.datetimeFormat.date
        );
        value.dateStartString = Datetime.DateTime2String(
            value.dateStart,
            HighchartsService.datetimeFormat.date
        );
        value.dateEndString = Datetime.DateTime2String(
            value.dateEnd,
            HighchartsService.datetimeFormat.date
        );
        return value;
    }

    private changeDwellTime(value: EDwellTimeRange) {
        this.selection.dwellTimeRange = value;
        this.drawChartAgeRangeGender();
    }

    private i18nItem() {
        let result: any = {
            time: this._("w_Report_Time"),
            date: this._("w_Report_Date"),
            startDate: this._("w_Report_StartDate"),
            endDate: this._("w_Report_EndDate"),
            temperature: this._("w_Report_Temperature"),
            temperatureMin: this._("w_Report_TemperatureMin"),
            temperatureMax: this._("w_Report_TemperatureMax"),
            weather: this._("w_Report_Weather"),
            gender: this._("w_Gender"),
            male: this._("w_Male"),
            female: this._("w_Female"),
            percent: this._("w_Report_Percent"),
            dwellTime: this._("w_ReportDwellTime_DwellTimeDwellTime"),
            dwellTimeAVG: this._("w_ReportDwellTime_DwellTimeDwellTimeAVG"),
            revenue: this._("w_ReportTraffic_TrafficRevenue"),
            transaction: this._("w_ReportTraffic_TrafficTransaction"),
            conversion: this._("w_ReportTraffic_TrafficConversion"),
            asp: this._("w_ReportTraffic_TrafficASP"),
            maleCountPercent: this._("w_Male"),
            femaleCountPercent: this._("w_Female"),
        };
        return result;
    }
}

export default HighchartsDwellTime;
Vue.component("highcharts-dwell-time", HighchartsDwellTime);
</script>

<style lang="scss" scoped>
.chart {
    padding-top: 30px;
    padding-bottom: 30px;
}
.select-gender {
    height: 36px;
}
</style>

