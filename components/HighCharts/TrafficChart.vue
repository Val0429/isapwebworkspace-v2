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

    @Watch("value", {})
    private onValueChanged(newval: any, oldval: any) {
        let chartRef: any = this.$refs.chart;
        if (chartRef == undefined) {
            return false;
        }
    }

    lineOption: any = {
        exporting: { enabled: false },
        title: { text: " " },
        subtitle: { text: " " },
        xAxis: { labels: { useHTML: true } },
        yAxis: { title: { text: "" } },
        tooltip: {
            enabled: true,
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
                        result += `test1: ${newValue.test1}<br>`;
                        result += `test2: ${newValue.test2}<br>`;
                        result += `test3: ${newValue.test3}<br>`;
                        result += `test4: ${newValue.test4}<br>`;
                        result += `<i class='wi wi-night-sleet'></i>`;
                    } catch (e) {
                        console.log(e);
                    }
                }
                return result;
            }
        },
        series: []
    };

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
        console.log(this.chartMode, this.categories);
    }

    initDay1Site1() {
        let values = JSON.parse(JSON.stringify(this.value));
        let categories: string[] = [];
        let series: any = [
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

            for (let i in values) {
                let iNumber = parseInt(i);
                let value: ITrafficData = values[iNumber];
                value.datetime = new Date(value.datetime);
                let datetimeString = Datetime.DateTime2String(
                    value.datetime,
                    "HH:mm"
                );

                if (datetimeString == categorie) {
                    value.i18n = i18n;
                    traffic = value.traffic;
                    revenue = value.revenue;
                    newCategorie = `${datetimeString}<span style='display:none;'>${JSON.stringify(
                        value
                    )}</span>`;
                    values.splice(iNumber, 1);
                    break;
                }
            }

            if (newCategorie == "") {
                newCategorie = `${categorie}<span style='display:none;'>${JSON.stringify(
                    { i18n: i18n }
                )}</span>`;
            }

            series[0].data.push(revenue);
            series[1].data.push(traffic);
            categories.push(newCategorie);
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
                    categories: categories,
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
                            console.log("tooltipValue", newValue);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    return result;
                }
            },
            series: series
        };

        this.mountChart = true;
    }

    initDay1SiteX() {}

    initDayXSite1() {
        let values = JSON.parse(JSON.stringify(this.value));
        let categories: string[] = [];
        let series: any = [
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

            for (let i in values) {
                let iNumber = parseInt(i);
                let value: ITrafficData = values[iNumber];
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
                    traffic = value.traffic;
                    revenue = value.revenue;
                    newCategorie = `${datetimeString} ${weatherIcon}<span style='display:none;'>${JSON.stringify(
                        value
                    )}</span>`;
                    values.splice(iNumber, 1);
                    break;
                }
            }

            let weatherIcon = HighChartsService.weatherIcon(EWeather.none);
            if (newCategorie == "") {
                newCategorie = `${categorie} ${weatherIcon}<span style='display:none;'>${JSON.stringify(
                    { i18n: i18n }
                )}</span>`;
            }

            series[0].data.push(revenue);
            series[1].data.push(traffic);
            categories.push(newCategorie);
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
                    categories: categories,
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
                                    ? `${newValue.conversion * 100}%`
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
                            console.log("tooltipValue", newValue);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    return result;
                }
            },
            series: series
        };

        this.mountChart = true;
    }

    initDayXSiteX() {}

    ///////////////////////////////////////////////////////////////////////////

    private i18nItem() {
        let result: any = {
            time: this._("w_ReportTraffic_TrafficTime"),
            temperature: this._("w_ReportTraffic_TrafficTemperature"),
            traffic: this._("w_ReportTraffic_TrafficTraffic"),
            revenue: this._("w_ReportTraffic_TrafficRevenue"),
            transaction: this._("w_ReportTraffic_TrafficTransaction"),
            conversion: this._("w_ReportTraffic_TrafficConversion")
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

    // dateList: IDate[] = [];
    // siteList: ISite[] = [];
    // categories: string[] = [];
    // series: any = [];

    // start() {
    //     this.errorMessage = "";
    //     this.mountChart = false;
    //     this.chartMode = EChartMode.none;
    //     this.dateList = [];
    //     this.siteList = [];
    //     this.categories = [];
    //     this.series = [];

    //     // get day and site list
    //     for (let val of this.value) {
    //         let haveDay = false;
    //         let haveSite = false;
    //         let tempDateString: string = this.dateToString(val.datetime);
    //         for (let date of this.dateList) {
    //             if (tempDateString == date.dateString) {
    //                 haveDay = true;
    //             }
    //         }
    //         for (let site of this.siteList) {
    //             if (val.site.objectId == site.objectId) {
    //                 haveSite = true;
    //                 break;
    //             }
    //         }
    //         if (!haveDay) {
    //             this.dateList.push({
    //                 date: val.datetime,
    //                 dateString: tempDateString
    //             });
    //         }
    //         if (!haveSite) {
    //             this.siteList.push(val.site);
    //         }
    //     }

    //     // check mode
    //     if (this.dateList.length == 1 && this.siteList.length == 1) {
    //         this.chartMode = EChartMode.day1Site1;
    //     } else if (this.dateList.length == 1 && this.siteList.length > 1) {
    //         this.chartMode = EChartMode.day1SiteX;
    //     } else if (this.dateList.length > 1 && this.siteList.length == 1) {
    //         this.chartMode = EChartMode.dayXSite1;
    //     } else if (this.dateList.length > 1 && this.siteList.length > 1) {
    //         this.chartMode = EChartMode.dayXSiteX;
    //     }

    //     // sort dateList
    //     this.dateListSort();

    //     // init chart flow
    //     switch (this.chartMode) {
    //         case EChartMode.day1Site1:
    //             this.startBarLine();
    //             this.officeHourCategories();
    //             this.initChartData();
    //             this.mountChart = true;
    //             break;

    //         case EChartMode.day1SiteX:
    //             this.startBarLine();
    //             this.initChartData();
    //             this.mountChart = true;
    //             break;

    //         case EChartMode.dayXSite1:
    //             this.startBarLine();
    //             this.dateCategories();
    //             this.initChartData();
    //             for (let val of this.value) {
    //                 let label = Datetime.DateTime2String(
    //                     val.datetime,
    //                     "YYYY/MM/DD"
    //                 );
    //             }
    //             this.mountChart = true;
    //             break;

    //         case EChartMode.dayXSiteX:
    //             this.startLine();
    //             this.dateCategories();
    //             this.initChartData();
    //             this.mountChart = true;
    //             break;

    //         default:
    //             this.mountChart = false;
    //             break;
    //     }
    //     console.log(
    //         "this.categories",
    //         this.categories,
    //         this.dateList,
    //         this.siteList
    //     );
    // }

    // initChartData() {
    //     switch (this.chartMode) {
    //         case EChartMode.day1Site1:
    //             break;
    //         case EChartMode.day1SiteX:
    //             break;
    //         case EChartMode.dayXSite1:
    //             break;
    //         case EChartMode.dayXSiteX:
    //             break;
    //         default:
    //             break;
    //     }
    //     for (let val of this.value) {
    //         let label: string = "";
    //         let weatherIcon = HighChartsService.weatherIcon(val.weather);
    //         switch (this.chartMode) {
    //             case EChartMode.day1Site1:
    //                 label = Datetime.DateTime2String(val.datetime, "HH:mm");
    //                 break;
    //             case EChartMode.day1SiteX:
    //                 label = val.site.name;
    //                 break;
    //             case EChartMode.dayXSite1:
    //                 label = Datetime.DateTime2String(
    //                     val.datetime,
    //                     "YYYY/MM/DD"
    //                 );
    //                 label += ` ${weatherIcon}`;
    //                 break;
    //             case EChartMode.dayXSiteX:
    //                 label = Datetime.DateTime2String(
    //                     val.datetime,
    //                     "YYYY/MM/DD"
    //                 );
    //                 label += ` ${weatherIcon}`;
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    // }

    // startLine() {
    //     this.chartOptions = JSON.parse(JSON.stringify(this.lineOption));
    //     this.chartOptions.yAxis.title.text = this._("w_ReportTraffic_Traffic");
    //     this.chartOptions.series = [];
    // }

    // startBarLine() {
    //     this.chartOptions = JSON.parse(JSON.stringify(this.barLineOption));
    //     this.chartOptions.yAxis[0].title.text = this._(
    //         "w_ReportTraffic_Traffic"
    //     );
    //     this.chartOptions.yAxis[1].title.text = this._(
    //         "w_ReportTraffic_TrafficRevenue"
    //     );
    //     this.chartOptions.xAxis[0].categories = [];
    // }

    // private dateToString(date: Date): string {
    //     return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    // }

    // private siteCategories() {
    //     this.categories = [];
    //     for (let site of this.siteList) {
    //         this.categories.push(site.name);
    //     }
    // }

    // private dateListSort() {
    //     let timestampList: number[] = [];
    //     for (let dateItem of this.dateList) {
    //         let tempTime = dateItem.date.getTime();
    //         timestampList.push(Math.floor(tempTime));
    //     }
    //     timestampList.sort(function(a, b) {
    //         return a - b;
    //     });
    //     this.dateList = [];
    //     for (let timestamp of timestampList) {
    //         let tempDatetime = new Date();
    //         tempDatetime.setTime(timestamp);
    //         this.dateList.push({
    //             date: tempDatetime,
    //             dateString: this.dateToString(tempDatetime)
    //         });
    //     }
    // }

    // private dateCategories() {
    //     this.categories = [];
    //     if (this.dateList.length < 2) {
    //         return false;
    //     }

    //     let startDate = this.dateList[0];
    //     let endDate = this.dateList[this.dateList.length - 1];
    //     let startDateTimestamp = startDate.date.getTime();
    //     let endDateTimestamp = endDate.date.getTime();
    //     for (let i = startDateTimestamp; i < endDateTimestamp; i += 86400) {}
    // }

    // temp() {
    //     // for (let val of this.value) {
    //     // this.chartOptions.xAxis[0].categories.push(
    //     //     `<span style='display:none;'>${JSON.stringify(
    //     //         val.data
    //     //     )}</span>${
    //     //         val.label
    //     //     }&nbsp;<span class='wi wi-night-sleet' style='font-size:1.2rem;color:#f00;'></span>`
    //     // );
    //     // }

    // }
}

export default TrafficChart;
Vue.component("traffic-chart", TrafficChart);
</script>

<style lang="scss" scoped>
</style>
