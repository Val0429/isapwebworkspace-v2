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
    ISiteAreas,
    IChartOccupancyData,
    ISiteOfficeHourItem
} from "./models/IHighCharts";
import Datetime from "@/services/Datetime";
import HighchartsService from "./models/HighchartsService";

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

    errorMessage: string = "";
    mountChart: boolean = false;
    chartMode: EChartMode = EChartMode.none;
    chartOptions: any = {};

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
        this.errorMessage = "";
        this.chartMode = HighchartsService.chartMode(
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
        let tempValues: IChartOccupancyData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempHourStrings: string[] = [];
        let tempCategories: string[] = [];
        let tempResult: IChartOccupancyData[] = [];
        let tempSeries: any = [];

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

        // set areas
        for (let site of this.sites) {
            for (let area of site.areas) {
                tempSeries.push({
                    areaId: area.objectId,
                    areaName: area.name,
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

            for (let loopValue of tempValues) {
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
                    areaName: serie.areaName,
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
        this.chartOptions = {
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

        this.mountChart = true;
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
                    areaName: area.name,
                    data: []
                });
            }
        }

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

            for (let serie of tempSeries) {
                serie.data.push(0);
                let dataIndex = serie.data.length - 1;

                for (let value of tempValues) {
                    let tempValue = this.anysislyChartValue(value);
                    let valTimestamp = tempValue.date.getTime();
                    if (
                        tempValue.areaId == serie.areaId &&
                        valTimestamp >= tempStartTimestamp &&
                        valTimestamp <= tempEndTimestamp
                    ) {
                        serie.data[dataIndex] += value.occupancy;
                        break;
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
                    areaName: serie.areaName,
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
        this.chartOptions = {
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

        this.mountChart = true;
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
                dateString: Datetime.DateTime2String(tempDate, "YYYY/MM/DD"),
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
        this.chartOptions = {
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
        this.mountChart = true;
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

                for (let val of tempValues) {
                    let value: IChartOccupancyData = this.anysislyChartValue(
                        val
                    );
                    let valTimestamp = value.date.getTime();

                    if (
                        value.siteObjectId == tempSiteValue.siteObjectId &&
                        valTimestamp >= tempStartTimestamp &&
                        valTimestamp <= tempEndTimestamp
                    ) {
                        tempSiteValue.occupancy += value.occupancy;
                        tempSiteValue.temperature = value.temperature;
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
                    }
                    return result;
                }
            },
            series: tempSeries
        };

        this.mountChart = true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    private anysislyChartValueDefault(): IChartOccupancyData {
        let value: IChartOccupancyData = {
            date: new Date(),
            siteObjectId: "",

            areaId: "",
            areaName: "",
            occupancy: 0,

            // every report
            temperatureMin: 0,
            temperatureMax: 0,
            weather: EWeather.none,
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
.chart-error-message {
    text-align: center;
}
</style>
