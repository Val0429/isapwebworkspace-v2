<template>
    <div class="chart">
        <h2 v-if="mountAnyChart()">{{ _('w_ReportOccupancy_OccupancyChart') }}</h2>
        <b-form-group>
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
import { ETimeMode, EAreaMode, EChartMode, EWeather } from "../";
import { ISiteAreas, IChartOccupancyData, ISiteOfficeHourItem } from "../";
import Datetime from "@/services/Datetime";
import HighchartsService from "../models/HighchartsService";

@Component({
    components: {}
})
export class HighchartsOccupancy extends Vue {
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
    sites: ISiteAreas[];

    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    value: IChartOccupancyData[];

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
        newval: IChartOccupancyData[],
        oldval: IChartOccupancyData[]
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
        this.mountChart.site1Day1 = false;
        this.mountChart.site1DayX = false;
        this.mountChart.siteXDay1 = false;
        this.mountChart.siteXDayX = false;
        this.chartMode = HighchartsService.chartMode(
            this.startDate,
            this.endDate,
            this.sites
        );

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
        return false;
    }

    ////////////////////////// site 1 day 1 //////////////////////////

    initSite1Day1() {
        let tempValues: IChartOccupancyData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempHourStrings: string[] = [];
        let tempCategories: string[] = [];
        let tempResult: IChartOccupancyData[] = [];
        let tempSeries: any = [];

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

        // set areas
        for (let site of this.sites) {
            for (let area of site.areas) {
                tempSeries.push({
                    areaId: area.objectId,
                    name: area.name,
                    data: []
                });
            }
        }

        // anysisly result
        for (let i in tempHourStrings) {
            let categorie = tempHourStrings[i];
            let haveValue = false;

            // set area data length
            for (let serie of tempSeries) {
                serie.data.push(0);
            }

            for (let j in tempValues) {
                let loopValue = tempValues[j];
                let value: IChartOccupancyData = this.anysislyChartValue(
                    loopValue
                );
                let tempValueHour = Datetime.DateTime2String(
                    value.date,
                    "HH:mm"
                );

                if (tempValueHour == categorie) {
                    for (let serie of tempSeries) {
                        if (value.areaId == serie.areaId) {
                            serie.data[i] += value.occupancy;
                        }
                    }
                }
            }

            let tempCategorieData = {
                i18n: this.i18nItem(),
                datas: []
            };

            for (let serie of tempSeries) {
                tempCategorieData.datas.push({
                    areaId: serie.areaId,
                    areaName: serie.name,
                    occupancy: HighchartsService.formatFloat(serie.data[i])
                });
            }

            tempCategories.push(
                HighchartsService.categorieStringWithJSON(
                    categorie,
                    tempCategorieData
                )
            );
        }

        // set chart options
        this.chartOptions.site1Day1 = {
            chart: { type: "column", zoomType: "x" },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            xAxis: {
                labels: { useHTML: true },
                categories: tempCategories
            },
            yAxis: {
                min: 0,
                labels: {
                    style: { color: "#000" }
                },
                title: { text: null }
            },
            tooltip: {
                useHTML: true,
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
                            let seriesIndex = self.series.index;
                            for (let data of newValue.datas) {
                                result += `${data.areaName}:${data.occupancy}<br>`;
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
        let tempValues: IChartOccupancyData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempHourStrings: string[] = [];
        let tempCategories: string[] = [];
        let tempResult: IChartOccupancyData[] = [];
        let tempSeries: any = [];

        // set areas
        for (let site of this.sites) {
            for (let area of site.areas) {
                tempSeries.push({
                    areaId: area.objectId,
                    name: area.name,
                    data: []
                });
            }
        }

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
            let tempChartData: IChartOccupancyData = this.anysislyChartValueDefault();

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

            for (let serie of tempSeries) {
                serie.data.push(0);
                let dataIndex = serie.data.length - 1;

                for (let value of tempValues) {
                    let tempValue = this.anysislyChartValue(value);
                    let valTimestamp = tempValue.date.getTime();
                    if (
                        tempValue.areaId == serie.areaId &&
                        valTimestamp >= tempStartTimestamp &&
                        valTimestamp < tempEndTimestamp
                    ) {
                        serie.data[dataIndex] += value.occupancy;
                    }
                }
            }

            tempHourStrings.push(tempChartData.dateString);

            // set loop value
            categorieNowlength++;
            tempTimestamp = tempChartData.dateEnd.getTime() + 1000;
        }

        for (let i in tempHourStrings) {
            let categorie = tempHourStrings[i];

            let tempCategorieData = {
                i18n: this.i18nItem(),
                datas: []
            };

            for (let serie of tempSeries) {
                tempCategorieData.datas.push({
                    areaId: serie.areaId,
                    areaName: serie.name,
                    occupancy: HighchartsService.formatFloat(serie.data[i])
                });
            }

            tempCategories.push(
                HighchartsService.categorieStringWithJSON(
                    categorie,
                    tempCategorieData
                )
            );
        }

        // set chart options
        this.chartOptions.site1DayX = {
            chart: { type: "column", zoomType: "x" },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            xAxis: {
                labels: { useHTML: true },
                categories: tempCategories
            },
            yAxis: {
                min: 0,
                labels: {
                    style: { color: "#000" }
                },
                title: { text: null }
            },
            tooltip: {
                useHTML: true,
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
                            let seriesIndex = self.series.index;
                            for (let data of newValue.datas) {
                                result += `${data.areaName}:${data.occupancy}<br>`;
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
        let tempValues: IChartOccupancyData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempCategories: string[] = [];
        let tempSeries: any = [
            {
                name: this._("w_ReportOccupancy_OccupancyAVG"),
                data: []
            }
        ];

        for (let i in this.sites) {
            let site = this.sites[i];
            let tempDate = new Date();
            let tempWeatherIcon = HighchartsService.weatherIcon(EWeather.none);
            tempSeries[0].data.push(0);

            for (let val of tempValues) {
                let tempValue = this.anysislyChartValue(val);
                if (tempValue.siteObjectId == site.objectId) {
                    tempDate = tempValue.date;
                    tempWeatherIcon = HighchartsService.weatherIcon(
                        tempValue.weather
                    );
                    tempSeries[0].data[i] += val.occupancy;
                }
            }

            let categorieItem = {
                i18n: this.i18nItem(),
                siteObjectId: site.objectId,
                siteName: site.name,
                date: tempDate,
                dateString: Datetime.DateTime2String(tempDate, Datetime.DateFormat),
                occupancy: tempSeries[0].data[i]
            };
            tempCategories.push(
                HighchartsService.categorieStringWithJSON(
                    `${site.name} ${tempWeatherIcon}`,
                    categorieItem
                )
            );
        }

        // set chart options
        this.chartOptions.siteXDay1 = {
            chart: { type: "column", zoomType: "x" },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            xAxis: {
                labels: { useHTML: true },
                categories: tempCategories
            },
            yAxis: {
                min: 0,
                labels: { style: { color: "#000" } },
                title: { text: null }
            },
            tooltip: {
                useHTML: true,
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

                            result += `${newValue.siteName}<br>`;
                            result += `${newValue.i18n.date}:${newValue.dateString}<br>`;
                            result += `${newValue.i18n.occupancy}:${newValue.occupancy}<br>`;
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
        let tempValues: IChartOccupancyData[] = JSON.parse(
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
            let tempChartData: IChartOccupancyData = this.anysislyChartValueDefault();
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

            for (let site of this.sites) {
                let tempSiteValue = JSON.parse(JSON.stringify(tempChartData));
                tempSiteValue.siteObjectId = site.objectId;
                tempSiteValue.siteName = site.name;

                for (let val of tempValues) {
                    let value: IChartOccupancyData = this.anysislyChartValue(
                        val
                    );
                    let valTimestamp = value.date.getTime();

                    if (
                        value.siteObjectId == tempSiteValue.siteObjectId &&
                        valTimestamp >= tempStartTimestamp &&
                        valTimestamp < tempEndTimestamp
                    ) {
                        tempSiteValue.occupancy += value.occupancy;
                        tempSiteValue.temperature = value.temperature;
                        tempSiteValue.temperatureMax = value.temperatureMax;
                        tempSiteValue.temperatureMin = value.temperatureMin;
                        tempSiteValue.weather = value.weather;
                        tempSiteValue.weatherIcon = HighchartsService.weatherIcon(
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
                        tempData.push(
                            HighchartsService.formatFloat(tempItem.occupancy)
                        );
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
            for (let i in result.sites) {
                result.sites[i].occupancy = HighchartsService.formatFloat(
                    result.sites[i].occupancy
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
                    text: this._("w_ReportOccupancy_OccupancyAVG"),
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
                                        result += `${newValue.i18n.occupancy}: ${site.occupancy}<br>`;
                                        break;
                                    case ETimeMode.day:
                                    case ETimeMode.hour:
                                    default:
                                        result += `${site.siteName}<br>`;
                                        result += `${newValue.i18n.date}: ${newValue.categorie}<br>`;
                                        result += `${newValue.i18n.temperatureMin}: ${site.temperatureMin}°C<br>`;
                                        result += `${newValue.i18n.temperatureMax}: ${site.temperatureMax}°C<br>`;
                                        result += `${newValue.i18n.weather}: ${site.weatherIcon}<br>`;
                                        result += `${newValue.i18n.occupancy}: ${site.occupancy}<br>`;
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

    private anysislyChartValueDefault(): IChartOccupancyData {
        let value: IChartOccupancyData = {
            date: new Date(),
            siteObjectId: "",
            temperatureMin: 0,
            temperatureMax: 0,
            weather: EWeather.none,

            areaId: "",
            areaName: "",
            occupancy: 0,

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

    private anysislyChartValue(item: IChartOccupancyData): IChartOccupancyData {
        let value = JSON.parse(JSON.stringify(item));
        value.date = new Date(value.date);

        // every report
        for (let site of this.sites) {
            if (site.objectId == value.siteObjectId) {
                value.siteName = site.name;
                for (let area of site.areas) {
                    if (area.objectId == value.areaId) {
                        value.areaName = area.name;
                        break;
                    }
                }
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
            occupancy: this._("w_ReportOccupancy_Occupancy"),
            avgOccupancy: this._("w_ReportOccupancy_OccupancyAVG")
        };
        return result;
    }
}

export default HighchartsOccupancy;
Vue.component("highcharts-occupancy", HighchartsOccupancy);
</script>

<style lang="scss" scoped>
.chart {
    padding-top: 30px;
    padding-bottom: 30px;
}
</style>
