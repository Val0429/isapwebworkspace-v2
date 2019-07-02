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
import {
    ETimeMode,
    EAreaMode,
    EChartMode,
    EWeather
} from "./models/EHighCharts";
import {
    IDate,
    IDatetimeGroup,
    ISite,
    IChartTrafficData
} from "./models/IHighCharts";
import Datetime from "@/services/Datetime";
import HighChartsService from "./models/HighChartsService";
import Weather from "../../views/Setting/Weather.vue";

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

    mathRoundLength = 2;
    errorMessage: string = "";
    mountChart: boolean = false;
    chartMode: EChartMode = EChartMode.none;
    chartOptions: any = {};

    datetimeFormat = {
        year: "YYYY",
        month: "YYYY/MM",
        date: "YYYY/MM/DD",
        time: "HH:mm"
    };

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
            this.datetimeFormat.date
        );
        let endDateString = Datetime.DateTime2String(
            this.endDate,
            this.datetimeFormat.date
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
                this.initDay1Site1();
                break;
            case EChartMode.day1SiteX:
                this.initDay1SiteX();
                break;
            case EChartMode.dayXSite1:
                this.initDayXSite1();
                break;
            case EChartMode.dayXSiteX:
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
        let categories: string[] = [];
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
            categories.push(`${hourString}:00`);
        }

        //// office hour group ////

        // set data
        for (let categorie of categories) {
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

        console.log(tempSeries);

        switch (this.areaMode) {
            case EAreaMode.single:
                let singleSeries = [];

                singleSeries.push({
                    name: tempSeries[1].name,
                    data: tempSeries[1].data
                });

                // set chart options
                this.chartOptions = {
                    chart: { zoomType: "x" },
                    exporting: { enabled: false },
                    title: { text: " " },
                    subtitle: { text: " " },
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
                this.categorieStringWithJSON(
                    `${result.siteName} ${result.weatherIcon}`,
                    result
                )
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

        // 避免時間相反造成無窮迴圈
        if (this.startDate.getTime() > this.endDate.getTime()) {
            let tempDate = new Date(this.startDate.getTime());
            this.startDate = new Date(this.endDate.getTime());
            this.endDate = new Date(tempDate.getTime());
        }

        // 設置最大值避免無窮迴圈
        let categorieMaxlength = 10000;
        let categorieNowlength = 0;

        // 時間累加判斷用
        let tempTimestamp: number = this.startDate.getTime();
        let endTimestamp: number = this.endDate.getTime();
        let tempDate: Date = new Date(tempTimestamp);
        let dateGap: number = Math.ceil(
            Math.abs(this.startDate.getTime() - this.endDate.getTime()) /
                86400000
        );

        while (
            tempTimestamp <= endTimestamp &&
            categorieNowlength < categorieMaxlength
        ) {
            let tempChartData: IChartTrafficData = this.trafficValueDefault();

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
                        this.datetimeFormat.year
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        this.datetimeFormat.year
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        this.datetimeFormat.year
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
                        this.datetimeFormat.month
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        this.datetimeFormat.month
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        this.datetimeFormat.month
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
                        this.datetimeFormat.month
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        this.datetimeFormat.month
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        this.datetimeFormat.month
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
                        this.datetimeFormat.date
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        this.datetimeFormat.date
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        this.datetimeFormat.date
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
                        this.datetimeFormat.date
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        this.datetimeFormat.date
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        this.datetimeFormat.date
                    );
                    break;
            }

            let tempStartTimestamp = tempChartData.dateStart.getTime();
            let tempEndTimestamp = tempChartData.dateEnd.getTime();

            tempChartData.timeString = Datetime.DateTime2String(
                tempChartData.dateStart,
                this.datetimeFormat.time
            );
            tempChartData.quarterNumber = Datetime.QuarterNumber(
                tempChartData.dateStart
            );
            tempChartData.weekNumber = Datetime.WeekNumber(
                tempChartData.dateStart
            );

            for (let val of tempValues) {
                let value: IChartTrafficData = this.trafficValue(val);
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
                    tempChartData.weather = value.weather;
                    tempChartData.weatherIcon = HighChartsService.weatherIcon(
                        value.weather
                    );

                    // for calculate AVG
                    trafficTotal += tempChartData.traffic;
                }
            }

            // calculate conversion & ASP
            if (tempChartData.traffic != 0) {
                tempChartData.conversion = this.formatFloat(
                    (tempChartData.transaction / tempChartData.traffic) * 100,
                    this.mathRoundLength
                );
            }

            if (tempChartData.transaction > 0) {
                tempChartData.asp = this.formatFloat(
                    tempChartData.revenue / tempChartData.transaction,
                    this.mathRoundLength
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
            trafficAVG = this.formatFloat(
                trafficTotal / dateGap,
                this.mathRoundLength
            );
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
                        this.categorieStringWithJSON(result.dateString, result)
                    );
                    break;
                case ETimeMode.quarter:
                    tempCategories.push(
                        this.categorieStringWithJSON(
                            this.categoriesQuarter(result.date),
                            result
                        )
                    );
                    break;
                case ETimeMode.week:
                    tempCategories.push(
                        this.categorieStringWithJSON(
                            this.categoriesWeek(result.date),
                            result
                        )
                    );
                    break;
                case ETimeMode.day:
                case ETimeMode.hour:
                case ETimeMode.none:
                default:
                    tempCategories.push(
                        this.categorieStringWithJSON(
                            `${result.dateString} ${result.weatherIcon}`,
                            result
                        )
                    );
                    break;
            }
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

        // 避免時間相反造成無窮迴圈
        if (this.startDate.getTime() > this.endDate.getTime()) {
            let tempDate = new Date(this.startDate.getTime());
            this.startDate = new Date(this.endDate.getTime());
            this.endDate = new Date(tempDate.getTime());
        }

        // 設置最大值避免無窮迴圈
        let categorieMaxlength = 10000;
        let categorieNowlength = 0;

        // 時間累加判斷用
        let tempTimestamp: number = this.startDate.getTime();
        let endTimestamp: number = this.endDate.getTime();
        let tempDate: Date = new Date(tempTimestamp);
        let dateGap: number = Math.ceil(
            Math.abs(this.startDate.getTime() - this.endDate.getTime()) /
                86400000
        );

        while (
            tempTimestamp <= endTimestamp &&
            categorieNowlength < categorieMaxlength
        ) {
            let tempChartData: IChartTrafficData = this.trafficValueDefault();
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
                        this.datetimeFormat.year
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        this.datetimeFormat.year
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        this.datetimeFormat.year
                    );
                    tempResultItem.categorie = Datetime.DateTime2String(
                        tempChartData.date,
                        this.datetimeFormat.year
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
                        this.datetimeFormat.month
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        this.datetimeFormat.month
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        this.datetimeFormat.month
                    );
                    tempResultItem.categorie = this.categoriesQuarter(
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
                        this.datetimeFormat.month
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        this.datetimeFormat.month
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        this.datetimeFormat.month
                    );
                    tempResultItem.categorie = Datetime.DateTime2String(
                        tempChartData.date,
                        this.datetimeFormat.month
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
                        this.datetimeFormat.date
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        this.datetimeFormat.date
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        this.datetimeFormat.date
                    );
                    tempResultItem.categorie = Datetime.DateTime2String(
                        tempChartData.date,
                        this.datetimeFormat.date
                    );
                    tempResultItem.categorie = this.categoriesWeek(
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
                        this.datetimeFormat.date
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        this.datetimeFormat.date
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        this.datetimeFormat.date
                    );
                    tempResultItem.categorie = Datetime.DateTime2String(
                        tempChartData.date,
                        this.datetimeFormat.date
                    );
                    break;
            }

            let tempStartTimestamp = tempChartData.dateStart.getTime();
            let tempEndTimestamp = tempChartData.dateEnd.getTime();

            tempChartData.timeString = Datetime.DateTime2String(
                tempChartData.dateStart,
                this.datetimeFormat.time
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

                for (let val of tempValues) {
                    let value: IChartTrafficData = this.trafficValue(val);
                    let valTimestamp = value.date.getTime();

                    if (
                        value.siteObjectId == tempSiteValue.siteObjectId &&
                        valTimestamp >= tempStartTimestamp &&
                        valTimestamp <= tempEndTimestamp
                    ) {
                        tempSiteValue.traffic += value.traffic;
                        tempSiteValue.revenue += value.revenue;
                        tempSiteValue.transaction += value.transaction;
                        tempSiteValue.temperature += value.temperature;
                        tempSiteValue.weather = value.weather;
                        tempSiteValue.weatherIcon = HighChartsService.weatherIcon(
                            value.weather
                        );
                    }
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
                name: this.categorieStringNotJSON(site.name, site.objectId),
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
                result.conversion = this.formatFloat(
                    (transactionTotal / trafficTotal) * 100,
                    this.mathRoundLength
                );
            }

            if (transactionTotal > 0) {
                result.asp = this.formatFloat(
                    revenueTotal / transactionTotal,
                    this.mathRoundLength
                );
            }

            switch (this.timeMode) {
                case ETimeMode.year:
                case ETimeMode.month:
                    tempCategories.push(
                        this.categorieStringWithJSON(result.categorie, result)
                    );
                    break;
                case ETimeMode.quarter:
                    tempCategories.push(
                        this.categorieStringWithJSON(result.categorie, result)
                    );
                    break;
                case ETimeMode.week:
                    tempCategories.push(
                        this.categorieStringWithJSON(result.categorie, result)
                    );
                    break;
                case ETimeMode.day:
                case ETimeMode.hour:
                case ETimeMode.none:
                default:
                    tempCategories.push(
                        this.categorieStringWithJSON(result.categorie, result)
                    );
                    break;
            }
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
                                            result += `${newValue.i18n.temperatureMin}: ${newValue.temperatureMin}°C<br>`;
                                            result += `${newValue.i18n.temperatureMax}: ${newValue.temperatureMax}°C<br>`;
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
            temperatureMin: 0,
            temperatureMax: 0,
            traffic: 0,
            revenue: 0,
            transaction: 0,
            weather: EWeather.none,
            i18n: this.i18nItem(),
            siteName: "",
            timeMode: this.timeMode,
            areaMode: this.areaMode,
            conversion: 0,
            asp: 0,
            trafficAVG: 0,
            weatherIcon: HighChartsService.weatherIcon(EWeather.none),
            dateStart: new Date(),
            dateEnd: new Date(),
            quarterNumber: Datetime.QuarterNumber(new Date()),
            weekNumber: Datetime.WeekNumber(new Date()),
            timeString: Datetime.DateTime2String(
                new Date(),
                this.datetimeFormat.time
            ),
            dateString: Datetime.DateTime2String(
                new Date(),
                this.datetimeFormat.date
            ),
            dateStartString: Datetime.DateTime2String(
                new Date(),
                this.datetimeFormat.date
            ),
            dateEndString: Datetime.DateTime2String(
                new Date(),
                this.datetimeFormat.date
            )
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

        value.conversion = 0;
        value.asp = 0;
        value.i18n = this.i18nItem();
        value.timeMode = this.timeMode;
        value.areaMode = this.areaMode;
        value.trafficAVG = 0;
        value.temperature = (value.temperatureMin + value.temperatureMax) / 2;
        value.weatherIcon = HighChartsService.weatherIcon(value.weather);
        value.quarterNumber = Datetime.QuarterNumber(value.date);
        value.weekNumber = Datetime.WeekNumber(value.date);
        value.timeString = Datetime.DateTime2String(
            value.date,
            this.datetimeFormat.time
        );
        value.dateString = Datetime.DateTime2String(
            value.date,
            this.datetimeFormat.date
        );
        value.dateStartString = Datetime.DateTime2String(
            value.dateStart,
            this.datetimeFormat.date
        );
        value.dateEndString = Datetime.DateTime2String(
            value.dateEnd,
            this.datetimeFormat.date
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
            startDate: this._("w_ReportTraffic_TrafficStartDate"),
            endDate: this._("w_ReportTraffic_TrafficEndDate"),
            temperature: this._("w_ReportTraffic_TrafficTemperature"),
            temperatureMin: this._("w_ReportTraffic_TrafficTemperatureMin"),
            temperatureMax: this._("w_ReportTraffic_TrafficTemperatureMax"),
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

    private categoriesQuarter(date: Date): string {
        let result = "";
        let quarterNumber = Datetime.QuarterNumber(date);
        result += `${date.getFullYear()}-Q${quarterNumber}`;
        return result;
    }

    private categoriesWeek(date: Date): string {
        let result = "";
        let weekNumber = Datetime.WeekNumber(date);
        result += `${date.getFullYear()}-W${weekNumber}`;
        return result;
    }
}

export default HighchartsTraffic;
Vue.component("highcharts-traffic", HighchartsTraffic);
</script>

<style lang="scss" scoped>
.weather-icon {
    font-size: 1.1rem;
    color: #924da3;
}
</style>
