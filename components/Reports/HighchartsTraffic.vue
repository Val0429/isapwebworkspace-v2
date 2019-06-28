<template>
    <div class="chart">
        <highcharts
            ref="chart"
            v-if="mountChart"
            :options="chartOptions"
        ></highcharts>
        <div v-if="errorMessage != ''">
            {{ errorMessage }}
        </div>
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
import { ETimeMode, EChartMode, EWeather } from "./models/EHighCharts";
import { IDate, ISite, IChartTrafficData } from "./models/IHighCharts";
import Datetime from "@/services/Datetime";
import HighChartsService from "./models/HighChartsService";

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

    mathRoundLength = 2;
    errorMessage: string = "";
    mountChart: boolean = false;
    chartMode: EChartMode = EChartMode.none;
    chartOptions: any = {};
    categories: string[] = [];
    dateFormat = "YYYY/MM/DD";
    timeFormat = "HH:mm";

    created() {
        this.start();
    }

    mounted() {}

    start() {
        if (isNaN(this.startDate.getTime())) {
            this.errorMessage = this._("w_ReportTraffic_ErrorDateStart");
            return false;
        }

        if (isNaN(this.endDate.getTime())) {
            this.errorMessage = this._("w_ReportTraffic_ErrorDateEnd");
            return false;
        }

        let startDateString = Datetime.DateTime2String(
            this.startDate,
            this.dateFormat
        );
        let endDateString = Datetime.DateTime2String(
            this.endDate,
            this.dateFormat
        );

        if (startDateString == endDateString && this.sites.length == 1) {
            this.chartMode = EChartMode.day1Site1;
        } else if (startDateString == endDateString && this.sites.length > 1) {
            this.chartMode = EChartMode.day1SiteX;
        } else if (startDateString != endDateString && this.sites.length == 1) {
            this.chartMode = EChartMode.dayXSite1;
        } else if (startDateString != endDateString && this.sites.length > 1) {
            this.chartMode = EChartMode.dayXSiteX;
        } else {
            this.errorMessage = this._("w_ReportTraffic_ErrorChartMode");
        }

        this.initChart();
    }

    initChart() {
        switch (this.chartMode) {
            case EChartMode.day1Site1:
                this.officeHourCategories();
                this.initDay1Site1();
                break;
            case EChartMode.day1SiteX:
                this.initDay1SiteX();
                break;
            case EChartMode.dayXSite1:
                this.dateCategories();
                this.initDayXSite1();
                break;
            case EChartMode.dayXSiteX:
                this.dateCategories();
                this.initDayXSiteX();
                break;
            default:
                break;
        }
    }

    ////////////////////////// day 1 site 1 //////////////////////////

    initDay1Site1() {
        let tempValues = JSON.parse(JSON.stringify(this.value));
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

        // set data
        for (let categorie of this.categories) {
            let haveValue = false;
            for (let loopValue of tempValues) {
                let value: IChartTrafficData = this.trafficValue(loopValue);
                if (value.timeString == categorie) {
                    haveValue = true;
                    tempResult.push(value);
                    break;
                }
            }
            if (!haveValue) {
                let defaultValue = this.trafficValueDefault();
                defaultValue.timeString = categorie;
                tempResult.push(defaultValue);
            }
        }

        // set result
        for (let result of tempResult) {
            tempSeries[0].data.push(result.revenue);
            tempSeries[1].data.push(result.traffic);
            tempCategories.push(
                this.categorieStringWithJSON(result.timeString, result)
            );
        }

        // set chart options
        this.chartOptions = {
            chart: { zoomType: "x" },
            exporting: { enabled: false },
            title: { text: " " },
            subtitle: { text: " " },
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
                            // anysisly JSON
                            let startIndex = self.x.indexOf(">{");
                            let endIndex = self.x.indexOf("}<");
                            let valueJson = self.x.substring(
                                startIndex + 1,
                                endIndex + 1
                            );
                            let newValue: any = JSON.parse(valueJson);

                            // set value
                            result += `${newValue.i18n.time}:${
                                newValue.timeString
                            }<br>`;
                            result += `${newValue.i18n.traffic}: ${
                                newValue.traffic
                            }<br>`;
                            result += `${newValue.i18n.revenue}: ${
                                newValue.revenue
                            }<br>`;
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    return result;
                }
            },
            series: tempSeries
        };

        this.mountChart = true;
    }

    ////////////////////////// day 1 site X //////////////////////////

    initDay1SiteX() {
        let trafficAVG = 0;
        let trafficTotal = 0;
        let tempValues = JSON.parse(JSON.stringify(this.value));
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
            this.categories.push(site.name);
            for (let loopValue of tempValues) {
                let value: IChartTrafficData = this.trafficValue(loopValue);
                if (value.siteObjectId == site.objectId) {
                    haveValue = true;
                    tempResult.push(value);
                    break;
                }
            }

            if (!haveValue) {
                let defaultValue = this.trafficValueDefault();
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
                this.categorieStringWithJSON(result.siteName, result)
            );
        }

        // set chart options
        this.chartOptions = {
            chart: { zoomType: "x" },
            exporting: { enabled: false },
            title: { text: " " },
            subtitle: { text: " " },
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
                            result += `${newValue.i18n.date}: ${
                                newValue.dateString
                            }<br>`;
                            result += `${newValue.i18n.temperature}: ${
                                newValue.temperature
                            }°C<br>`;
                            result += `${newValue.i18n.traffic}: ${
                                newValue.traffic
                            }<br>`;
                            result += `${newValue.i18n.trafficAVG}: ${
                                newValue.trafficAVG
                            }<br>`;
                            result += `${newValue.i18n.revenue}: ${
                                newValue.revenue
                            }<br>`;
                            result += `${newValue.i18n.transaction}: ${
                                newValue.transaction
                            }<br>`;
                            result += `${newValue.i18n.conversion}: ${
                                newValue.conversionPercentage
                            }%<br>`;
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    return result;
                }
            },
            series: tempSeries
        };

        this.mountChart = true;
    }

    ////////////////////////// day X site 1 //////////////////////////

    initDayXSite1() {
        let trafficAVG = 0;
        let trafficTotal = 0;
        let tempValues = JSON.parse(JSON.stringify(this.value));
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

        // TODO: value change to timeMode

        // set data
        for (let categorie of this.categories) {
            let haveValue = false;

            for (let loopValue of tempValues) {
                let value: IChartTrafficData = this.trafficValue(loopValue);
                if (value.dateString == categorie) {
                    haveValue = true;
                    tempResult.push(value);
                    break;
                }
            }

            if (!haveValue) {
                let defaultValue = this.trafficValueDefault();
                defaultValue.dateString = categorie;
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
                this.categorieStringWithJSON(result.dateString, result)
            );
        }

        // set chart options
        this.chartOptions = {
            chart: { zoomType: "x" },
            exporting: { enabled: false },
            title: { text: " " },
            subtitle: { text: " " },
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

                            result += `${newValue.dateString}<br>`;
                            result += `${newValue.i18n.temperature}: ${
                                newValue.temperature
                            }°C<br>`;
                            result += `${newValue.i18n.traffic}: ${
                                newValue.traffic
                            }<br>`;
                            result += `${newValue.i18n.trafficAVG}: ${
                                newValue.trafficAVG
                            }<br>`;
                            result += `${newValue.i18n.revenue}: ${
                                newValue.revenue
                            }<br>`;
                            result += `${newValue.i18n.transaction}: ${
                                newValue.transaction
                            }<br>`;
                            result += `${newValue.i18n.conversion}: ${
                                newValue.conversionPercentage
                            }%<br>`;
                            result += `${newValue.i18n.asp}: ${
                                newValue.asp
                            }<br>`;
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    return result;
                }
            },
            series: tempSeries
        };

        this.mountChart = true;
    }

    ////////////////////////// day X site X //////////////////////////

    initDayXSiteX() {
        let tempValues = JSON.parse(JSON.stringify(this.value));
        let tempResult: any[] = [];
        let tempCategories: string[] = [];
        let tempSeries: {
            name: string;
            data: number[];
        }[] = [];
        let tempItem: any = [];

        // TODO: value change to timeMode

        // set series
        for (let i in this.sites) {
            let iNumber = parseInt(i);
            let site = this.sites[iNumber];
            let tempData: number[] = [];

            for (let categorie of this.categories) {
                let haveValue = false;
                let traffic: number = 0;

                for (let loopValue of tempValues) {
                    let value = this.trafficValue(loopValue);
                    if (
                        value.siteObjectId == site.objectId &&
                        value.dateString == categorie
                    ) {
                        haveValue = true;
                        tempData.push(value.traffic);
                        break;
                    }
                }

                if (!haveValue) {
                    tempData.push(0);
                }
            }

            tempSeries.push({
                name: this.categorieStringNotJSON(site.name, site.objectId),
                data: tempData
            });
        }

        for (let categorie of this.categories) {
            let tempValueForCategorie = {
                categorie: categorie,
                siteValues: []
            };
            for (let loopValue of tempValues) {
                let value = this.trafficValue(loopValue);
                if (value.dateString == categorie) {
                    tempValueForCategorie.siteValues.push(value);
                }
            }
            tempResult.push(tempValueForCategorie);
        }

        // set result
        for (let result of tempResult) {
            tempCategories.push(
                this.categorieStringWithJSON(result.categorie, result)
            );
        }

        this.chartOptions = {
            chart: { zoomType: "x" },
            exporting: { enabled: false },
            title: { text: " " },
            subtitle: { text: " " },
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
                    if (
                        self.point != undefined &&
                        self.point.series != undefined &&
                        self.point.series.name != undefined
                    ) {
                        let startIndex = self.point.series.name.indexOf(">__");
                        let endIndex = self.point.series.name.indexOf("__<");
                        siteId = self.point.series.name.substring(
                            startIndex + 3,
                            endIndex
                        );
                    }

                    if (
                        siteId != undefined &&
                        siteId != "" &&
                        self.x != undefined
                    ) {
                        try {
                            let startIndex = self.x.indexOf(">{");
                            let endIndex = self.x.indexOf("}<");
                            let valueJson = self.x.substring(
                                startIndex + 1,
                                endIndex + 1
                            );
                            let newValue: any = JSON.parse(valueJson);

                            for (let value of newValue.siteValues) {
                                if (value.siteObjectId == siteId) {
                                    result += `${value.siteName}<br>`;
                                    result += `${value.i18n.date}: ${
                                        newValue.categorie
                                    }<br>`;
                                    result += `${value.i18n.temperature}: ${
                                        value.temperature
                                    }°C<br>`;
                                    result += `${value.i18n.weather}: ${
                                        value.weatherIcon
                                    }<br>`;
                                    result += `${value.i18n.traffic}: ${
                                        value.traffic
                                    }<br>`;
                                    result += `${value.i18n.revenue}: ${
                                        value.revenue
                                    }<br>`;
                                    result += `${value.i18n.transaction}: ${
                                        value.transaction
                                    }<br>`;
                                    result += `${value.i18n.conversion}: ${
                                        value.conversionPercentage
                                    }%<br>`;
                                    result += `${value.i18n.asp}: ${
                                        value.asp
                                    }<br>`;
                                    break;
                                }
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

        this.mountChart = true;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private categorieStringNotJSON(showString: string, value: string) {
        return `${showString} <span style='display:none;'>__${value}__</span>`;
    }

    private categorieStringWithJSON(
        showString: string,
        value: IChartTrafficData
    ) {
        return `${showString} <span style='display:none;'>${JSON.stringify(
            value
        )}</span>`;
    }

    private trafficValueDefault(): IChartTrafficData {
        let value: IChartTrafficData = {
            date: new Date(),
            siteObjectId: "",
            temperature: 0,
            traffic: 0,
            revenue: 0,
            transaction: 0,
            conversion: 0,
            asp: 0,
            weather: EWeather.none,
            i18n: this.i18nItem(),
            siteName: "",
            timeMode: ETimeMode.none,
            trafficAVG: 0,
            conversionPercentage: 0,
            weatherIcon: Datetime.DateTime2String(new Date(), this.dateFormat),
            dateStart: new Date(),
            dateEnd: new Date(),
            quarterNumber: Datetime.QuarterNumber(new Date()),
            weekNumber: Datetime.WeekNumber(new Date()),
            timeString: Datetime.DateTime2String(new Date(), this.timeFormat),
            dateString: Datetime.DateTime2String(new Date(), this.dateFormat),
            dateStartString: Datetime.DateTime2String(
                new Date(),
                this.dateFormat
            ),
            dateEndString: Datetime.DateTime2String(new Date(), this.dateFormat)
        };
        return value;
    }

    private trafficValue(item: IChartTrafficData): IChartTrafficData {
        let value = JSON.parse(JSON.stringify(item));
        value.date = new Date(value.date);
        for (let site of this.sites) {
            if (site.objectId == value.siteObjectId) {
                value.siteName = site.name;
                break;
            }
        }

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

        value.conversionPercentage = this.formatFloat(
            value.conversion * 100,
            this.mathRoundLength
        );
        value.i18n = this.i18nItem();
        value.timeMode = this.timeMode;
        value.trafficAVG = 0;
        value.weatherIcon = HighChartsService.weatherIcon(value.weather);
        value.quarterNumber = Datetime.QuarterNumber(value.date);
        value.weekNumber = Datetime.WeekNumber(value.date);
        value.timeString = Datetime.DateTime2String(
            value.date,
            this.timeFormat
        );
        value.dateString = Datetime.DateTime2String(
            value.date,
            this.dateFormat
        );
        value.dateStartString = Datetime.DateTime2String(
            value.dateStart,
            this.dateFormat
        );
        value.dateEndString = Datetime.DateTime2String(
            value.dateEnd,
            this.dateFormat
        );
        return value;
    }

    private formatFloat(num: number, pos: number) {
        var size = Math.pow(10, pos);
        return Math.round(num * size) / size;
    }

    private i18nItem() {
        let result: any = {
            time: this._("w_ReportTraffic_TrafficTime"),
            date: this._("w_ReportTraffic_TrafficDate"),
            temperature: this._("w_ReportTraffic_TrafficTemperature"),
            traffic: this._("w_ReportTraffic_TrafficTraffic"),
            trafficAVG: this._("w_ReportTraffic_TrafficTrafficAVG"),
            revenue: this._("w_ReportTraffic_TrafficRevenue"),
            transaction: this._("w_ReportTraffic_TrafficTransaction"),
            conversion: this._("w_ReportTraffic_TrafficConversion"),
            weather: this._("w_ReportTraffic_TrafficWeather"),
            asp: this._("w_ReportTraffic_TrafficASP")
        };
        return result;
    }

    // Only for day1Site1
    private officeHourCategories() {
        this.categories = [];
        if (this.chartMode != EChartMode.day1Site1) {
            return false;
        }
        if (this.sites.length != 1) {
            return false;
        }

        let site = this.sites[0];

        // start
        let weekDay = this.startDate.getDay();
        let startHour = 25;
        let endHour = -1;
        for (let dayRange of site.officeHour) {
            let inday: boolean = this.inDay(
                weekDay,
                parseInt(dayRange.startDay),
                parseInt(dayRange.endDay)
            );
            if (inday) {
                let indayStartDate = new Date(dayRange.startDate);
                let indayEndDate = new Date(dayRange.endDate);
                if (isNaN(indayStartDate.getTime())) {
                    break;
                }
                if (isNaN(indayEndDate.getTime())) {
                    break;
                }
                let indayStartHour = indayStartDate.getHours();
                let indayEndHour = indayEndDate.getHours();

                if (indayStartHour >= indayEndHour) {
                    startHour = 0;
                    endHour = 23;
                } else {
                    if (startHour > indayStartHour) {
                        startHour = indayStartHour;
                    }
                    if (endHour < indayEndHour) {
                        endHour = indayEndHour;
                    }
                }
                if (startHour <= 0 && endHour >= 23) {
                    break;
                }
            }
        }
        if (startHour > endHour) {
            startHour = 0;
            endHour = 23;
        }
        for (let i = startHour; i <= endHour; i++) {
            let hourString = i < 10 ? `0${i.toString()}` : i.toString();
            this.categories.push(`${hourString}:00`);
        }
    }

    // check day in range
    private inDay(weekDay: number, startDay: number, endDay: number): boolean {
        let result = false;
        let have7 = false;
        let inRange = false;
        let startDayHave7 = startDay - 7;
        let endDayHave7 = endDay + 7;
        if (startDay > endDay) {
            have7 = true;
        }
        if (weekDay >= startDay && weekDay <= endDay) {
            result = true;
        }
        if (have7 && weekDay >= startDayHave7 && weekDay <= endDay) {
            result = true;
        }
        if (have7 && weekDay >= startDay && weekDay <= endDayHave7) {
            result = true;
        }
        return result;
    }

    // only for dayX
    private dateCategories() {
        let startTimestamp = this.startDate.getTime();
        let endTimestamp = this.endDate.getTime();

        // 避免時間相反造成無窮迴圈
        if (startTimestamp > endTimestamp) {
            let tempTimestamp = startTimestamp;
            startTimestamp = endTimestamp;
            endTimestamp = tempTimestamp;
        }

        for (let i: number = startTimestamp; i <= endTimestamp; i += 86400000) {
            let tempDate = new Date();
            tempDate.setTime(i);
            this.categories.push(
                Datetime.DateTime2String(tempDate, this.dateFormat)
            );
        }
    }
}

export default HighchartsTraffic;
Vue.component("highcharts-traffic", HighchartsTraffic);
</script>

<style lang="scss" scoped>
</style>
