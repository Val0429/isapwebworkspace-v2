<template>
    <div class="chart">
        <b-form-group></b-form-group>
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
    EWeather
} from "./models/EHighCharts";
import {
    ISite,
    IChartTrafficData,
    ISiteOfficeHourItem
} from "./models/IHighCharts";
import Datetime from "@/services/Datetime";
import HighchartsService from "./models/HighchartsService";

@Component({
    components: {}
})
export class HighchartsTraffic extends Vue {
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
    value: IChartTrafficData[];

    chartMode: EChartMode = EChartMode.none;

    mountChart: {
        site1Day1: boolean;
        site1DayX: boolean;
        siteXDay1: boolean;
        siteXDayX: boolean;
    } = {
        site1Day1: false,
        site1DayX: false,
        siteXDay1: false,
        siteXDayX: false
    };
    chartOptions: {
        site1Day1: object;
        site1DayX: object;
        siteXDay1: object;
        siteXDayX: object;
    } = {
        site1Day1: {},
        site1DayX: {},
        siteXDay1: {},
        siteXDayX: {}
    };

    @Watch("value", { deep: true })
    private onValueChanged(
        newval: IChartTrafficData[],
        oldval: IChartTrafficData[]
    ) {
        this.start();
    }

    @Watch("timeMode")
    private onTimeModeChanged(newval: ETimeMode, oldval: ETimeMode) {
        this.start();
    }

    created() {
        this.start();
    }

    mounted() {}

    start() {
        this.chartMode = HighchartsService.chartMode(
            this.startDate,
            this.endDate,
            this.sites
        );

        switch (this.chartMode) {
            case EChartMode.site1Day1:
                this.initSite1Day1();
                break;
            case EChartMode.site1DayX:
                this.initSite1DayX();
                break;
            case EChartMode.siteXDay1:
                this.initSiteXDay1();
                break;
            case EChartMode.siteXDayX:
                this.initSiteXDayX();
                break;
            default:
                break;
        }

        console.log(
            "chart prop: ",
            this.chartMode,
            this.startDate,
            this.endDate,
            this.timeMode,
            this.areaMode,
            this.sites,
            JSON.stringify(this.value)
        );
    }

    ////////////////////////// site 1 day 1 //////////////////////////

    initSite1Day1() {
        let tempValues: IChartTrafficData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempHourStrings: string[] = [];
        let tempCategories: string[] = [];
        let tempResult: IChartTrafficData[] = [];
        let tempSeries: any = [
            {
                name: this._("w_ReportTraffic_TrafficRevenue"),
                type: "column",
                yAxis: 1,
                data: []
            },
            {
                name: this._("w_ReportTraffic_TrafficTraffic"),
                type: "spline",
                data: []
            }
        ];

        //// office hour group ////
        if (this.chartMode != EChartMode.site1Day1) {
            return false;
        }
        if (this.sites.length != 1) {
            return false;
        }

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
                let value: IChartTrafficData = this.anysislyChartValue(
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
            tempSeries[1].data.push(result.traffic);
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
                            text: this._("w_ReportTraffic_TrafficTraffic"),
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
                                    result += `${newValue.i18n.traffic}: ${newValue.traffic}<br>`;
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
                                text: this._("w_ReportTraffic_TrafficTraffic"),
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
                                    result += `${newValue.i18n.traffic}: ${newValue.traffic}<br>`;
                                    result += `${newValue.i18n.revenue}: ${newValue.revenue}<br>`;
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
        let trafficAVG = 0;
        let trafficTotal = 0;
        let tempValues: IChartTrafficData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempResult: IChartTrafficData[] = [];
        let tempCategories: string[] = [];
        let tempSeries: any = [
            {
                name: this._("w_ReportTraffic_TrafficRevenue"),
                type: "column",
                yAxis: 1,
                data: []
            },
            {
                name: this._("w_ReportTraffic_TrafficTraffic"),
                type: "spline",
                data: []
            },
            {
                name: this._("w_ReportTraffic_TrafficTrafficAVG"),
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
                ) / 86400000
            ) + 1;

        while (
            tempTimestamp <= endTimestamp &&
            categorieNowlength < categorieMaxlength
        ) {
            let tempChartData: IChartTrafficData = this.anysislyChartValueDefault();

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

            let spliceIndexList: number[] = [];
            for (let i in tempValues) {
                let val = tempValues[i];
                let value: IChartTrafficData = this.anysislyChartValue(val);
                let valTimestamp = value.date.getTime();

                if (
                    value.siteObjectId == tempChartData.siteObjectId &&
                    valTimestamp >= tempStartTimestamp &&
                    valTimestamp <= tempEndTimestamp
                ) {
                    tempChartData.traffic += value.traffic;
                    tempChartData.revenue += value.revenue;
                    tempChartData.transaction += value.transaction;
                    tempChartData.temperature += value.temperature;
                    tempChartData.temperatureMin = value.temperatureMin;
                    tempChartData.temperatureMax = value.temperatureMax;
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
            trafficTotal += tempChartData.traffic;

            // calculate conversion & ASP
            if (tempChartData.traffic != 0) {
                tempChartData.conversion = HighchartsService.formatFloat(
                    (tempChartData.transaction / tempChartData.traffic) * 100
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
            trafficAVG = HighchartsService.formatFloat(trafficTotal / dateGap);
        }

        // set result
        for (let result of tempResult) {
            result.trafficAVG = trafficAVG;
            tempSeries[0].data.push(result.revenue);
            tempSeries[1].data.push(result.traffic);
            tempSeries[2].data.push(trafficAVG);
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
                        text: this._("w_ReportTraffic_TrafficTraffic"),
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
                                    result += `${newValue.i18n.traffic}: ${newValue.traffic}<br>`;
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
                                    result += `${newValue.i18n.traffic}: ${newValue.traffic}<br>`;
                                    result += `${newValue.i18n.trafficAVG}: ${newValue.trafficAVG}<br>`;
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
        let trafficAVG = 0;
        let trafficTotal = 0;
        let tempValues: IChartTrafficData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempResult: IChartTrafficData[] = [];
        let tempCategories: string[] = [];
        let tempSeries: any = [
            {
                name: this._("w_ReportTraffic_TrafficRevenue"),
                type: "column",
                yAxis: 1,
                data: []
            },
            {
                name: this._("w_ReportTraffic_TrafficTraffic"),
                type: "spline",
                data: []
            },
            {
                name: this._("w_ReportTraffic_TrafficTrafficAVG"),
                type: "spline",
                data: []
            }
        ];

        for (let site of this.sites) {
            let haveValue = false;

            let spliceIndexList: number[] = [];
            for (let i in tempValues) {
                let loopValue = tempValues[i];
                let value: IChartTrafficData = this.anysislyChartValue(
                    loopValue
                );
                if (value.siteObjectId == site.objectId) {
                    haveValue = true;
                    let haveResult = false;
                    for (let result of tempResult) {
                        if (result.siteObjectId == site.objectId) {
                            haveResult = true;
                            result.traffic += value.traffic;
                            result.revenue += value.revenue;
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
                trafficTotal += result.traffic;
            }
            trafficAVG = trafficTotal / tempResult.length;
        }

        // set result
        for (let result of tempResult) {
            result.trafficAVG = trafficAVG;
            tempSeries[0].data.push(result.revenue);
            tempSeries[1].data.push(result.traffic);
            tempSeries[2].data.push(trafficAVG);
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
                        text: this._("w_ReportTraffic_TrafficTraffic"),
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
                            result += `${newValue.i18n.traffic}: ${newValue.traffic}<br>`;
                            result += `${newValue.i18n.trafficAVG}: ${newValue.trafficAVG}<br>`;
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
        let tempValues: IChartTrafficData[] = JSON.parse(
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
            ) / 86400000
        );

        while (
            tempTimestamp <= endTimestamp &&
            categorieNowlength < categorieMaxlength
        ) {
            let tempChartData: IChartTrafficData = this.anysislyChartValueDefault();
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
                    let value: IChartTrafficData = this.anysislyChartValue(val);
                    let valTimestamp = value.date.getTime();

                    if (
                        value.siteObjectId == tempSiteValue.siteObjectId &&
                        valTimestamp >= tempStartTimestamp &&
                        valTimestamp <= tempEndTimestamp
                    ) {
                        tempSiteValue.traffic += value.traffic;
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
                        tempData.push(tempItem.traffic);
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
            let trafficTotal: number = 0;
            let transactionTotal: number = 0;
            let revenueTotal: number = 0;

            // calculate conversion & ASP
            for (let site of result.sites) {
                trafficTotal += site.traffic;
                transactionTotal += site.transaction;
                revenueTotal += site.revenue;
            }

            if (trafficTotal != 0) {
                result.conversion = HighchartsService.formatFloat(
                    (transactionTotal / trafficTotal) * 100
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
                    text: this._("w_ReportTraffic_TrafficTraffic"),
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
                                        result += `${newValue.i18n.traffic}: ${site.traffic}<br>`;
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
                                        result += `${newValue.i18n.traffic}: ${site.traffic}<br>`;
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

    private anysislyChartValueDefault(): IChartTrafficData {
        let value: IChartTrafficData = {
            date: new Date(),
            siteObjectId: "",
            traffic: 0,
            revenue: 0,
            temperatureMin: 0,
            temperatureMax: 0,
            transaction: 0,
            weather: EWeather.none,

            conversion: 0,
            asp: 0,
            trafficAVG: 0,

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

    private anysislyChartValue(item: IChartTrafficData): IChartTrafficData {
        let value = JSON.parse(JSON.stringify(item));
        value.date = new Date(value.date);
        value.conversion = 0;
        value.asp = 0;
        value.trafficAVG = 0;

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
        value.temperature = (value.temperatureMin + value.temperatureMax) / 2;
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
            traffic: this._("w_ReportTraffic_TrafficTraffic"),
            trafficAVG: this._("w_ReportTraffic_TrafficTrafficAVG"),
            revenue: this._("w_ReportTraffic_TrafficRevenue"),
            transaction: this._("w_ReportTraffic_TrafficTransaction"),
            conversion: this._("w_ReportTraffic_TrafficConversion"),
            asp: this._("w_ReportTraffic_TrafficASP")
        };
        return result;
    }
}

export default HighchartsTraffic;
Vue.component("highcharts-traffic", HighchartsTraffic);
</script>

<style lang="scss" scoped>
.chart-error-message {
    text-align: center;
}
</style>
