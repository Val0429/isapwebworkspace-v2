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
    ESiteMode,
    EChartMode,
    EWeather
} from "./models/EHighCharts";
import { IDate, ISite, ITrafficData } from "./models/IHighCharts";
import Datetime from "@/services/Datetime";
import HighChartsService from "./models/HighChartsService";

@Component({
    components: {}
})
export class TrafficChart extends Vue {
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
    value: ITrafficData[];

    mathRoundLength = 2;
    errorMessage: string = "";
    mountChart: boolean = false;
    chartMode: EChartMode = EChartMode.none;
    chartOptions: any = {};

    categories: string[] = [];

    created() {
        this.start();
    }

    mounted() {}

    start() {
        if (isNaN(this.startDate.getTime())) {
            this.errorMessage = "Start time error";
            return false;
        }

        if (isNaN(this.endDate.getTime())) {
            this.errorMessage = "End time error";
            return false;
        }

        let startDateString = Datetime.DateTime2String(
            this.startDate,
            "YYYY-MM-DD"
        );
        let endDateString = Datetime.DateTime2String(
            this.endDate,
            "YYYY-MM-DD"
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
            this.errorMessage = "No Find Chart Mode";
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
            let newCategorie: string = "";
            let traffic: number = 0;
            let revenue: number = 0;
            let i18n: any = this.i18nItem();
            i18n.label = categorie;

            for (let i in tempValues) {
                let iNumber = parseInt(i);
                let value: ITrafficData = tempValues[iNumber];
                value.datetime = new Date(value.datetime);
                let datetimeString = Datetime.DateTime2String(
                    value.datetime,
                    "HH:mm"
                );

                if (datetimeString == categorie) {
                    value.i18n = i18n;
                    value.conversion = this.formatFloat(
                        value.conversion * 100,
                        this.mathRoundLength
                    );
                    traffic = value.traffic;
                    revenue = value.revenue;
                    newCategorie = `${datetimeString}<span style='display:none;'>${JSON.stringify(
                        value
                    )}</span>`;
                    tempValues.splice(iNumber, 1);
                    break;
                }
            }

            if (newCategorie == "") {
                newCategorie = `${categorie}<span style='display:none;'>${JSON.stringify(
                    { i18n: i18n }
                )}</span>`;
            }

            tempSeries[0].data.push(revenue);
            tempSeries[1].data.push(traffic);
            tempCategories.push(newCategorie);
        }

        // set chart options
        this.chartOptions = {
            chart: { zoomType: "xy" },
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

                            let traffic =
                                newValue.traffic != undefined
                                    ? newValue.traffic
                                    : "0";
                            let revenue =
                                newValue.revenue != undefined
                                    ? newValue.revenue
                                    : "0";

                            result += `${newValue.i18n.time}:${
                                newValue.i18n.label
                            }<br>`;
                            result += `${
                                newValue.i18n.traffic
                            }: ${traffic}<br>`;
                            result += `${
                                newValue.i18n.revenue
                            }: ${revenue}<br>`;
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
            let newCategorie: string = "";
            let traffic: number = 0;
            let revenue: number = 0;
            let i18n: any = this.i18nItem();
            i18n.label = site.name;
            this.categories.push(site.name);

            for (let i in tempValues) {
                let iNumber = parseInt(i);
                let value: ITrafficData = tempValues[iNumber];

                value.datetime = new Date(value.datetime);
                if (value.siteId == site.objectId) {
                    let weatherIcon = HighChartsService.weatherIcon(
                        value.weather
                    );
                    value.i18n = i18n;
                    value.conversion = this.formatFloat(
                        value.conversion * 100,
                        this.mathRoundLength
                    );
                    traffic = value.traffic;
                    revenue = value.revenue;
                    newCategorie = `${
                        site.name
                    } ${weatherIcon}<span style='display:none;'>${JSON.stringify(
                        value
                    )}</span>`;
                    tempValues.splice(iNumber, 1);
                    break;
                }
            }

            let weatherIcon = HighChartsService.weatherIcon(EWeather.none);
            if (newCategorie == "") {
                newCategorie = `${
                    site.name
                } ${weatherIcon}<span style='display:none;'>${JSON.stringify({
                    i18n: i18n
                })}</span>`;
            }

            tempSeries[0].data.push(revenue);
            tempSeries[1].data.push(traffic);
            tempCategories.push(newCategorie);
        }

        // calculate avg
        for (let traffic of tempSeries[1].data) {
            trafficTotal += traffic;
        }
        if (tempSeries[1].data.length > 0) {
            trafficAVG = trafficTotal / tempSeries[1].data.length;
        }
        for (let i: number = 0; i < tempSeries[1].data.length; i++) {
            tempSeries[2].data.push(trafficAVG);
        }

        // set chart options
        this.chartOptions = {
            chart: { zoomType: "xy" },
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
                            let temperature =
                                newValue.temperature != undefined
                                    ? `${newValue.temperature}°C`
                                    : "0°C";
                            let traffic =
                                newValue.traffic != undefined
                                    ? newValue.traffic
                                    : "0";
                            let revenue =
                                newValue.revenue != undefined
                                    ? newValue.revenue
                                    : "0";
                            let transaction =
                                newValue.transaction != undefined
                                    ? newValue.transaction
                                    : "0";
                            let conversion =
                                newValue.conversion != undefined
                                    ? `${newValue.conversion}%`
                                    : "0%";

                            result += `${
                                newValue.i18n.label
                            }, ${temperature}<br>`;
                            result += `${
                                newValue.i18n.traffic
                            }: ${traffic}<br>`;
                            result += `${
                                newValue.i18n.revenue
                            }: ${revenue}<br>`;
                            result += `${
                                newValue.i18n.transaction
                            }: ${transaction}<br>`;
                            result += `${
                                newValue.i18n.conversion
                            }: ${conversion}<br>`;
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
        let tempValues = JSON.parse(JSON.stringify(this.value));
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
            }
        ];

        // set data
        for (let categorie of this.categories) {
            let newCategorie: string = "";
            let traffic: number = 0;
            let revenue: number = 0;
            let i18n: any = this.i18nItem();
            i18n.label = categorie;

            for (let i in tempValues) {
                let iNumber = parseInt(i);
                let value: ITrafficData = tempValues[iNumber];
                value.datetime = new Date(value.datetime);
                let datetimeString = Datetime.DateTime2String(
                    value.datetime,
                    "YYYY/MM/DD"
                );

                if (datetimeString == categorie) {
                    let weatherIcon = HighChartsService.weatherIcon(
                        value.weather
                    );
                    value.i18n = i18n;
                    value.conversion = this.formatFloat(
                        value.conversion * 100,
                        this.mathRoundLength
                    );
                    traffic = value.traffic;
                    revenue = value.revenue;
                    newCategorie = `${datetimeString} ${weatherIcon}<span style='display:none;'>${JSON.stringify(
                        value
                    )}</span>`;
                    tempValues.splice(iNumber, 1);
                    break;
                }
            }

            let weatherIcon = HighChartsService.weatherIcon(EWeather.none);
            if (newCategorie == "") {
                newCategorie = `${categorie} ${weatherIcon}<span style='display:none;'>${JSON.stringify(
                    { i18n: i18n }
                )}</span>`;
            }

            tempSeries[0].data.push(revenue);
            tempSeries[1].data.push(traffic);
            tempCategories.push(newCategorie);
        }

        // set chart options
        this.chartOptions = {
            chart: { zoomType: "xy" },
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

                            let temperature =
                                newValue.temperature != undefined
                                    ? `${newValue.temperature}°C`
                                    : "0°C";
                            let traffic =
                                newValue.traffic != undefined
                                    ? newValue.traffic
                                    : "0";
                            let revenue =
                                newValue.revenue != undefined
                                    ? newValue.revenue
                                    : "0";
                            let transaction =
                                newValue.transaction != undefined
                                    ? newValue.transaction
                                    : "0";
                            let conversion =
                                newValue.conversion != undefined
                                    ? `${newValue.conversion}%`
                                    : "0%";

                            result += `${
                                newValue.i18n.label
                            }, ${temperature}<br>`;
                            result += `${
                                newValue.i18n.traffic
                            }: ${traffic}<br>`;
                            result += `${
                                newValue.i18n.revenue
                            }: ${revenue}<br>`;
                            result += `${
                                newValue.i18n.transaction
                            }: ${transaction}<br>`;
                            result += `${
                                newValue.i18n.conversion
                            }: ${conversion}<br>`;
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
        let tempCategories: string[] = [];
        let tempSeries: {
            name: string;
            data: number[];
        }[] = [];
        let tempItem: any = [];

        for (let i in this.sites) {
            let iNumber = parseInt(i);
            let site = this.sites[iNumber];
            let tempData: number[] = [];

            for (let categorie of this.categories) {
                let haveValue = false;
                let traffic: number = 0;
                for (let value of tempValues) {
                    value.datetime = new Date(value.datetime);
                    let datetimeString = Datetime.DateTime2String(
                        value.datetime,
                        "YYYY/MM/DD"
                    );
                    if (
                        value.siteId == site.objectId &&
                        datetimeString == categorie
                    ) {
                        haveValue = true;
                        // append chart data in tempData
                        tempData.push(value.traffic);
                        break;
                    }
                }
                if (!haveValue) {
                    tempData.push(0);
                }
            }
            tempSeries.push({
                name: `${site.name}<span style='display:none;'>__${
                    site.objectId
                }__</span>`,
                data: tempData
            });
        }

        for (let categorie of this.categories) {
            let tempValueForCategorie = {
                categorie: categorie,
                i18n: this.i18nItem(),
                siteValues: []
            };
            for (let value of tempValues) {
                value.datetime = new Date(value.datetime);
                let datetimeString = Datetime.DateTime2String(
                    value.datetime,
                    "YYYY/MM/DD"
                );
                if (datetimeString == categorie) {
                    let siteName = "";
                    for (let site of this.sites) {
                        if (site.objectId == value.siteId) {
                            siteName = site.name;
                            break;
                        }
                    }
                    tempValueForCategorie.siteValues.push({
                        siteId: value.siteId,
                        siteName: siteName,
                        temperature: value.temperature,
                        traffic: value.traffic,
                        revenue: value.revenue,
                        transaction: value.transaction,
                        conversion: this.formatFloat(
                            value.conversion * 100,
                            this.mathRoundLength
                        ),
                        asp: value.asp,
                        weatherIcon: HighChartsService.weatherIcon(
                            value.weather
                        )
                    });
                }
            }
            tempCategories.push(
                `${categorie}<span style='display:none;'>${JSON.stringify(
                    tempValueForCategorie
                )}</span>`
            );
        }

        this.chartOptions = {
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
                                if (value.siteId == siteId) {
                                    let temperature =
                                        value.temperature != undefined
                                            ? `${value.temperature}°C`
                                            : "0°C";
                                    let traffic =
                                        value.traffic != undefined
                                            ? value.traffic
                                            : "0";
                                    let revenue =
                                        value.revenue != undefined
                                            ? value.revenue
                                            : "0";
                                    let transaction =
                                        value.transaction != undefined
                                            ? value.transaction
                                            : "0";
                                    let conversion =
                                        value.conversion != undefined
                                            ? `${value.conversion}%`
                                            : "0%";

                                    result += `${value.siteName}<br>`;
                                    result += `${newValue.i18n.date}: ${
                                        newValue.categorie
                                    }<br>`;
                                    result += `${
                                        newValue.i18n.temperature
                                    }: ${temperature}<br>`;
                                    result += `${newValue.i18n.weather}: ${
                                        value.weatherIcon
                                    }<br>`;
                                    result += `${
                                        newValue.i18n.traffic
                                    }: ${traffic}<br>`;
                                    result += `${
                                        newValue.i18n.revenue
                                    }: ${revenue}<br>`;
                                    result += `${
                                        newValue.i18n.transaction
                                    }: ${transaction}<br>`;
                                    result += `${
                                        newValue.i18n.conversion
                                    }: ${conversion}<br>`;
                                    result += `${newValue.i18n.asp}: ${
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
                Datetime.DateTime2String(tempDate, "YYYY/MM/DD")
            );
        }
    }
}

export default TrafficChart;
Vue.component("traffic-chart", TrafficChart);
</script>

<style lang="scss" scoped>
</style>
