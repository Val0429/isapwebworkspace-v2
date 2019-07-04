<template>
    <div class="chart">
        <b-form-group v-if="errorMessage == ''">
            <highcharts
                ref="chart"
                v-if="mountChart"
                :options="chartOptions"
            ></highcharts>
        </b-form-group>

        <b-form-group
            v-if="errorMessage != ''"
            class="chart-error-message"
            :label="errorMessage"
        >
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

    errorMessage: string = "";
    mountChart: boolean = false;
    chartMode: EChartMode = EChartMode.none;
    chartOptions: any = {};

    @Watch("value", { deep: true })
    private onValueChanged(
        newval: IChartTrafficData[],
        IChartTrafficData: IChartTrafficData[]
    ) {
        this.start();
    }

    created() {
        this.start();
    }

    mounted() {}

    start() {
        this.errorMessage = "";
        this.chartMode = HighChartsService.chartMode(
            this.startDate,
            this.endDate,
            this.sites
        );
        if (isNaN(this.startDate.getTime())) {
            this.errorMessage = this._("w_Report_ErrorDateStart");
            return false;
        }
        if (isNaN(this.endDate.getTime())) {
            this.errorMessage = this._("w_Report_ErrorDateEnd");
            return false;
        }
        if (this.chartMode == EChartMode.none) {
            this.errorMessage = this._("w_Report_ErrorChartMode");
            return false;
        }

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
            this.value
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
        let officeHour: ISiteOfficeHourItem = HighChartsService.siteOfficeHour(
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
            for (let loopValue of tempValues) {
                let value: IChartTrafficData = this.anysislyChartValue(
                    loopValue
                );
                if (value.timeString == categorie) {
                    haveValue = true;
                    tempResult.push(value);
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
                HighChartsService.categorieStringWithJSON(
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
                this.chartOptions = {
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
                this.chartOptions = {
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

        this.mountChart = true;
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
                        HighChartsService.datetimeFormat.year
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighChartsService.datetimeFormat.year
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighChartsService.datetimeFormat.year
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
                        HighChartsService.datetimeFormat.month
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighChartsService.datetimeFormat.month
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighChartsService.datetimeFormat.month
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
                        HighChartsService.datetimeFormat.month
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighChartsService.datetimeFormat.month
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighChartsService.datetimeFormat.month
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
                        HighChartsService.datetimeFormat.date
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighChartsService.datetimeFormat.date
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighChartsService.datetimeFormat.date
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
                        HighChartsService.datetimeFormat.date
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighChartsService.datetimeFormat.date
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighChartsService.datetimeFormat.date
                    );
                    break;
            }

            let tempStartTimestamp = tempChartData.dateStart.getTime();
            let tempEndTimestamp = tempChartData.dateEnd.getTime();

            tempChartData.timeString = Datetime.DateTime2String(
                tempChartData.dateStart,
                HighChartsService.datetimeFormat.time
            );
            tempChartData.quarterNumber = Datetime.QuarterNumber(
                tempChartData.dateStart
            );
            tempChartData.weekNumber = Datetime.WeekNumber(
                tempChartData.dateStart
            );

            for (let val of tempValues) {
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
                tempChartData.conversion = HighChartsService.formatFloat(
                    (tempChartData.transaction / tempChartData.traffic) * 100
                );
            }

            if (tempChartData.transaction > 0) {
                tempChartData.asp = HighChartsService.formatFloat(
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
            trafficAVG = HighChartsService.formatFloat(trafficTotal / dateGap);
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
                        HighChartsService.categorieStringWithJSON(
                            result.dateString,
                            result
                        )
                    );
                    break;
                case ETimeMode.quarter:
                    tempCategories.push(
                        HighChartsService.categorieStringWithJSON(
                            HighChartsService.categoriesQuarter(result.date),
                            result
                        )
                    );
                    break;
                case ETimeMode.week:
                    tempCategories.push(
                        HighChartsService.categorieStringWithJSON(
                            HighChartsService.categoriesWeek(result.date),
                            result
                        )
                    );
                    break;
                case ETimeMode.day:
                case ETimeMode.hour:
                case ETimeMode.none:
                default:
                    tempCategories.push(
                        HighChartsService.categorieStringWithJSON(
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

        this.mountChart = true;
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
            for (let loopValue of tempValues) {
                let value: IChartTrafficData = this.anysislyChartValue(
                    loopValue
                );
                if (value.siteObjectId == site.objectId) {
                    haveValue = true;
                    tempResult.push(value);
                    break;
                }
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
                HighChartsService.categorieStringWithJSON(
                    `${result.siteName} ${result.weatherIcon}`,
                    result
                )
            );
        }

        // set chart options
        this.chartOptions = {
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

        this.mountChart = true;
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
                        HighChartsService.datetimeFormat.year
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighChartsService.datetimeFormat.year
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighChartsService.datetimeFormat.year
                    );
                    tempResultItem.categorie = Datetime.DateTime2String(
                        tempChartData.date,
                        HighChartsService.datetimeFormat.year
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
                        HighChartsService.datetimeFormat.month
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighChartsService.datetimeFormat.month
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighChartsService.datetimeFormat.month
                    );
                    tempResultItem.categorie = HighChartsService.categoriesQuarter(
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
                        HighChartsService.datetimeFormat.month
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighChartsService.datetimeFormat.month
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighChartsService.datetimeFormat.month
                    );
                    tempResultItem.categorie = Datetime.DateTime2String(
                        tempChartData.date,
                        HighChartsService.datetimeFormat.month
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
                        HighChartsService.datetimeFormat.date
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighChartsService.datetimeFormat.date
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighChartsService.datetimeFormat.date
                    );
                    tempResultItem.categorie = Datetime.DateTime2String(
                        tempChartData.date,
                        HighChartsService.datetimeFormat.date
                    );
                    tempResultItem.categorie = HighChartsService.categoriesWeek(
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
                        HighChartsService.datetimeFormat.date
                    );
                    tempChartData.dateStartString = Datetime.DateTime2String(
                        tempChartData.dateStart,
                        HighChartsService.datetimeFormat.date
                    );
                    tempChartData.dateEndString = Datetime.DateTime2String(
                        tempChartData.dateEnd,
                        HighChartsService.datetimeFormat.date
                    );
                    tempResultItem.categorie = Datetime.DateTime2String(
                        tempChartData.date,
                        HighChartsService.datetimeFormat.date
                    );
                    break;
            }

            let tempStartTimestamp = tempChartData.dateStart.getTime();
            let tempEndTimestamp = tempChartData.dateEnd.getTime();

            tempChartData.timeString = Datetime.DateTime2String(
                tempChartData.dateStart,
                HighChartsService.datetimeFormat.time
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
                name: HighChartsService.categorieStringNotJSON(
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
                result.conversion = HighChartsService.formatFloat(
                    (transactionTotal / trafficTotal) * 100
                );
            }

            if (transactionTotal > 0) {
                result.asp = HighChartsService.formatFloat(
                    revenueTotal / transactionTotal
                );
            }

            switch (this.timeMode) {
                case ETimeMode.year:
                case ETimeMode.month:
                    tempCategories.push(
                        HighChartsService.categorieStringWithJSON(
                            result.categorie,
                            result
                        )
                    );
                    break;
                case ETimeMode.quarter:
                    tempCategories.push(
                        HighChartsService.categorieStringWithJSON(
                            result.categorie,
                            result
                        )
                    );
                    break;
                case ETimeMode.week:
                    tempCategories.push(
                        HighChartsService.categorieStringWithJSON(
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
                        HighChartsService.categorieStringWithJSON(
                            result.categorie,
                            result
                        )
                    );
                    break;
            }
        }

        this.chartOptions = {
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
                    }
                    return result;
                }
            },
            series: tempSeries
        };

        this.mountChart = true;
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
            weatherIcon: HighChartsService.weatherIcon(EWeather.none),
            weekNumber: Datetime.WeekNumber(new Date()),
            quarterNumber: Datetime.QuarterNumber(new Date()),
            dateStart: new Date(),
            dateEnd: new Date(),
            timeString: Datetime.DateTime2String(
                new Date(),
                HighChartsService.datetimeFormat.time
            ),
            dateString: Datetime.DateTime2String(
                new Date(),
                HighChartsService.datetimeFormat.date
            ),
            dateStartString: Datetime.DateTime2String(
                new Date(),
                HighChartsService.datetimeFormat.date
            ),
            dateEndString: Datetime.DateTime2String(
                new Date(),
                HighChartsService.datetimeFormat.date
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
        value.weatherIcon = HighChartsService.weatherIcon(value.weather);
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
            HighChartsService.datetimeFormat.time
        );
        value.dateString = Datetime.DateTime2String(
            value.date,
            HighChartsService.datetimeFormat.date
        );
        value.dateStartString = Datetime.DateTime2String(
            value.dateStart,
            HighChartsService.datetimeFormat.date
        );
        value.dateEndString = Datetime.DateTime2String(
            value.dateEnd,
            HighChartsService.datetimeFormat.date
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
