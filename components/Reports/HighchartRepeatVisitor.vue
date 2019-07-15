<template>
    <div class="chart">
        <b-form-group>
            <b-row>

                <b-col cols="6">
                    <b-form-radio-group
                        v-model="selection.chartType"
                        class="h-10 click_button col-md-2"
                        buttons
                        button-variant="outline-success"
                        name="radio-btn-outline"
                        style="margin-bottom: 10px;"
                        :options="selectItem.chartType"
                        @input="changeChartType"
                    ></b-form-radio-group>
                    <div v-show="selection.chartType == 'bar'">
                        <highcharts
                            ref="chart"
                            v-if="mountChart"
                            :options="chartOptionsBar"
                        ></highcharts>
                    </div>
                    <div v-show="selection.chartType == 'pie'">
                        <highcharts
                            ref="chart"
                            v-if="mountChart"
                            :options="chartOptionsPie"
                        ></highcharts>
                    </div>
                </b-col>

                <b-col cols="6">
                    <iv-form-selection
                        class='col-md-12'
                        :value="selection.repeatCount"
                        :options="selectItem.repeatCount"
                        @input="changeRepeatCount"
                    ></iv-form-selection>
                    <b-row>
                        <b-col cols="6">
                            <highcharts
                                ref="chart"
                                v-if="mountDetailChart"
                                :options="chartOptionsDetailBar"
                            ></highcharts>
                        </b-col>

                        <b-col cols="6">
                            <highcharts
                                ref="chart"
                                v-if="mountDetailChart"
                                :options="chartOptionsDetailPie"
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
    EAgeRange,
    EWeather
} from "./";
import {
    ISiteAreas,
    IChartRepeatVisitorData,
    ISiteOfficeHourItem
} from "./";
import Datetime from "@/services/Datetime";
import HighchartsService from "./models/HighchartsService";

@Component({
    components: {}
})
export class HighchartsRepeatVisitor extends Vue {
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
    value: IChartRepeatVisitorData[];

    selection = {
        chartType: "bar",
        repeatCount: "all"
    };
    selectItem = {
        chartType: [],
        repeatCount: []
    };

    mountChart: boolean = false;
    mountDetailChart = false;
    chartOptionsBar: any = {};
    chartOptionsPie: any = {};
    chartOptionsDetailBar: any = {};
    chartOptionsDetailPie: any = {};

    @Watch("value", { deep: true })
    private onValueChanged(
        newval: IChartRepeatVisitorData[],
        oldval: IChartRepeatVisitorData[]
    ) {
        this.start();
    }

    @Watch("timeMode")
    private onTimeModeChanged(newval: ETimeMode, oldval: ETimeMode) {
        this.start();
    }

    created() {
        this.initSelectItem();
        this.start();
    }

    mounted() {}

    initSelectItem() {
        this.selectItem.chartType = [
            { value: "bar", text: "Bar" },
            { value: "pie", text: "Pie" }
        ];
        this.selectItem.repeatCount = [
            { id: "all", text: "All" },
            { id: "1", text: "1" },
            { id: "2", text: "2" },
            { id: "3", text: "3" },
            { id: "4", text: "4" },
            { id: "5+", text: "5+" }
        ];
    }

    start() {
        this.initChart();
        this.initDetailChart();

        console.log(
            "chart prop: ",
            this.startDate,
            this.endDate,
            this.timeMode,
            this.areaMode,
            this.sites,
            this.value
        );
    }

    ////////////////////////// site 1 day 1 //////////////////////////

    initChart() {
        let tempValues: IChartRepeatVisitorData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempCategories: {
            bar: string[];
            pie: string[];
        } = {
            bar: ["1", "2", "3", "4", "5+"],
            pie: []
        };

        let tempSeries: {
            bar: any;
            pie: any;
        } = {
            bar: [
                {
                    name: this._("w_ReportRepeatVisitor_NumberOfVisit"),
                    data: [0, 0, 0, 0, 0]
                }
            ],
            pie: [
                {
                    type: "pie",
                    name: null,
                    innerSize: "50%",
                    data: [["1", 0], ["2", 0], ["3", 0], ["4", 0], ["5+", 0]]
                }
            ]
        };

        let tempTotalCunt = 0;

        for (let val of tempValues) {
            let barIndex = 0;
            if (val.repeatCount <= 0) {
                barIndex = 0;
            } else if (val.repeatCount >= 5) {
                barIndex = 4;
            } else {
                barIndex = val.repeatCount - 1;
            }
            tempSeries.bar[0].data[barIndex] += val.maleCount;
            tempSeries.bar[0].data[barIndex] += val.femaleCount;
            tempTotalCunt += val.maleCount;
            tempTotalCunt += val.femaleCount;
        }

        for (let i = 0; i < 5; i++) {
            tempSeries.pie[0].data[i][1] = HighchartsService.formatFloat(
                (tempSeries.bar[0].data[i] / tempTotalCunt) * 100
            );
        }

        // bar
        this.chartOptionsBar = {
            chart: { type: "column", zoomType: "x" },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            xAxis: {
                labels: { useHTML: true },
                categories: tempCategories.bar
            },
            yAxis: {
                min: 0,
                labels: { style: { color: "#000" } },
                title: { text: null }
            },
            tooltip: {
                useHTML: true,
                enabled: false
            },
            series: tempSeries.bar
        };

        // pie
        this.chartOptionsPie = {
            chart: { zoomType: "x" },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: "pointer",
                    dataLabels: {
                        enabled: true,
                        formatter: function() {
                            let self: any = this;
                            return `${self.y}%`;
                        }
                    },
                    showInLegend: true,
                    center: ["50%", "50%"],
                    size: "100%"
                }
            },
            tooltip: { enabled: false },
            series: tempSeries.pie
        };

        this.mountChart = true;
    }

    initDetailChart() {
        let tempValues: IChartRepeatVisitorData[] = JSON.parse(
            JSON.stringify(this.value)
        );

        let tempCategories: {
            bar: string[];
            pie: string[];
        } = {
            bar: [
                this._("w_Report_AgeRangeUpper61"),
                this._("w_Report_AgeRangeM51_60"),
                this._("w_Report_AgeRangeM41_50"),
                this._("w_Report_AgeRangeM31_40"),
                this._("w_Report_AgeRangeM21_30"),
                this._("w_Report_AgeRangeLower20")
            ],
            pie: []
        };

        let tempSeries: {
            bar: any;
            pie: any;
        } = {
            bar: [
                {
                    name: null,
                    data: [0, 0, 0, 0, 0, 0]
                }
            ],
            pie: [[this._("w_Male"), 0], [this._("w_Female"), 0]]
        };

        let totalCount = 0;
        let maleCount = 0;
        let femaleCount = 0;

        for (let val of tempValues) {
            switch (this.selection.repeatCount) {
                case "1":
                    if (val.repeatCount == 1) {
                        totalCount += val.maleCount;
                        totalCount += val.femaleCount;
                        maleCount += val.maleCount;
                        femaleCount += val.femaleCount;

                        switch (val.ageRange) {
                            case EAgeRange.upper61:
                                tempSeries.bar[0].data[0] += val.maleCount;
                                tempSeries.bar[0].data[0] += val.femaleCount;
                                break;
                            case EAgeRange.m51_60:
                                tempSeries.bar[0].data[1] += val.maleCount;
                                tempSeries.bar[0].data[1] += val.femaleCount;
                                break;
                            case EAgeRange.m41_50:
                                tempSeries.bar[0].data[2] += val.maleCount;
                                tempSeries.bar[0].data[2] += val.femaleCount;
                                break;
                            case EAgeRange.m31_40:
                                tempSeries.bar[0].data[3] += val.maleCount;
                                tempSeries.bar[0].data[3] += val.femaleCount;
                                break;
                            case EAgeRange.m21_30:
                                tempSeries.bar[0].data[4] += val.maleCount;
                                tempSeries.bar[0].data[4] += val.femaleCount;
                                break;
                            case EAgeRange.lower20:
                                tempSeries.bar[0].data[5] += val.maleCount;
                                tempSeries.bar[0].data[5] += val.femaleCount;
                                break;
                        }
                    }
                    break;

                case "2":
                    if (val.repeatCount == 2) {
                        totalCount += val.maleCount;
                        totalCount += val.femaleCount;
                        maleCount += val.maleCount;
                        femaleCount += val.femaleCount;

                        switch (val.ageRange) {
                            case EAgeRange.upper61:
                                tempSeries.bar[0].data[0] += val.maleCount;
                                tempSeries.bar[0].data[0] += val.femaleCount;
                                break;
                            case EAgeRange.m51_60:
                                tempSeries.bar[0].data[1] += val.maleCount;
                                tempSeries.bar[0].data[1] += val.femaleCount;
                                break;
                            case EAgeRange.m41_50:
                                tempSeries.bar[0].data[2] += val.maleCount;
                                tempSeries.bar[0].data[2] += val.femaleCount;
                                break;
                            case EAgeRange.m31_40:
                                tempSeries.bar[0].data[3] += val.maleCount;
                                tempSeries.bar[0].data[3] += val.femaleCount;
                                break;
                            case EAgeRange.m21_30:
                                tempSeries.bar[0].data[4] += val.maleCount;
                                tempSeries.bar[0].data[4] += val.femaleCount;
                                break;
                            case EAgeRange.lower20:
                                tempSeries.bar[0].data[5] += val.maleCount;
                                tempSeries.bar[0].data[5] += val.femaleCount;
                                break;
                        }
                    }
                    break;

                case "3":
                    if (val.repeatCount == 3) {
                        totalCount += val.maleCount;
                        totalCount += val.femaleCount;
                        maleCount += val.maleCount;
                        femaleCount += val.femaleCount;

                        switch (val.ageRange) {
                            case EAgeRange.upper61:
                                tempSeries.bar[0].data[0] += val.maleCount;
                                tempSeries.bar[0].data[0] += val.femaleCount;
                                break;
                            case EAgeRange.m51_60:
                                tempSeries.bar[0].data[1] += val.maleCount;
                                tempSeries.bar[0].data[1] += val.femaleCount;
                                break;
                            case EAgeRange.m41_50:
                                tempSeries.bar[0].data[2] += val.maleCount;
                                tempSeries.bar[0].data[2] += val.femaleCount;
                                break;
                            case EAgeRange.m31_40:
                                tempSeries.bar[0].data[3] += val.maleCount;
                                tempSeries.bar[0].data[3] += val.femaleCount;
                                break;
                            case EAgeRange.m21_30:
                                tempSeries.bar[0].data[4] += val.maleCount;
                                tempSeries.bar[0].data[4] += val.femaleCount;
                                break;
                            case EAgeRange.lower20:
                                tempSeries.bar[0].data[5] += val.maleCount;
                                tempSeries.bar[0].data[5] += val.femaleCount;
                                break;
                        }
                    }
                    break;

                case "4":
                    if (val.repeatCount == 4) {
                        totalCount += val.maleCount;
                        totalCount += val.femaleCount;
                        maleCount += val.maleCount;
                        femaleCount += val.femaleCount;

                        switch (val.ageRange) {
                            case EAgeRange.upper61:
                                tempSeries.bar[0].data[0] += val.maleCount;
                                tempSeries.bar[0].data[0] += val.femaleCount;
                                break;
                            case EAgeRange.m51_60:
                                tempSeries.bar[0].data[1] += val.maleCount;
                                tempSeries.bar[0].data[1] += val.femaleCount;
                                break;
                            case EAgeRange.m41_50:
                                tempSeries.bar[0].data[2] += val.maleCount;
                                tempSeries.bar[0].data[2] += val.femaleCount;
                                break;
                            case EAgeRange.m31_40:
                                tempSeries.bar[0].data[3] += val.maleCount;
                                tempSeries.bar[0].data[3] += val.femaleCount;
                                break;
                            case EAgeRange.m21_30:
                                tempSeries.bar[0].data[4] += val.maleCount;
                                tempSeries.bar[0].data[4] += val.femaleCount;
                                break;
                            case EAgeRange.lower20:
                                tempSeries.bar[0].data[5] += val.maleCount;
                                tempSeries.bar[0].data[5] += val.femaleCount;
                                break;
                        }
                    }
                    break;

                case "5+":
                    if (val.repeatCount >= 5) {
                        totalCount += val.maleCount;
                        totalCount += val.femaleCount;
                        maleCount += val.maleCount;
                        femaleCount += val.femaleCount;

                        switch (val.ageRange) {
                            case EAgeRange.upper61:
                                tempSeries.bar[0].data[0] += val.maleCount;
                                tempSeries.bar[0].data[0] += val.femaleCount;
                                break;
                            case EAgeRange.m51_60:
                                tempSeries.bar[0].data[1] += val.maleCount;
                                tempSeries.bar[0].data[1] += val.femaleCount;
                                break;
                            case EAgeRange.m41_50:
                                tempSeries.bar[0].data[2] += val.maleCount;
                                tempSeries.bar[0].data[2] += val.femaleCount;
                                break;
                            case EAgeRange.m31_40:
                                tempSeries.bar[0].data[3] += val.maleCount;
                                tempSeries.bar[0].data[3] += val.femaleCount;
                                break;
                            case EAgeRange.m21_30:
                                tempSeries.bar[0].data[4] += val.maleCount;
                                tempSeries.bar[0].data[4] += val.femaleCount;
                                break;
                            case EAgeRange.lower20:
                                tempSeries.bar[0].data[5] += val.maleCount;
                                tempSeries.bar[0].data[5] += val.femaleCount;
                                break;
                        }
                    }
                    break;

                case "all":
                default:
                    totalCount += val.maleCount;
                    totalCount += val.femaleCount;
                    maleCount += val.maleCount;
                    femaleCount += val.femaleCount;

                    switch (val.ageRange) {
                        case EAgeRange.upper61:
                            tempSeries.bar[0].data[0] += val.maleCount;
                            tempSeries.bar[0].data[0] += val.femaleCount;
                            break;
                        case EAgeRange.m51_60:
                            tempSeries.bar[0].data[1] += val.maleCount;
                            tempSeries.bar[0].data[1] += val.femaleCount;
                            break;
                        case EAgeRange.m41_50:
                            tempSeries.bar[0].data[2] += val.maleCount;
                            tempSeries.bar[0].data[2] += val.femaleCount;
                            break;
                        case EAgeRange.m31_40:
                            tempSeries.bar[0].data[3] += val.maleCount;
                            tempSeries.bar[0].data[3] += val.femaleCount;
                            break;
                        case EAgeRange.m21_30:
                            tempSeries.bar[0].data[4] += val.maleCount;
                            tempSeries.bar[0].data[4] += val.femaleCount;
                            break;
                        case EAgeRange.lower20:
                            tempSeries.bar[0].data[5] += val.maleCount;
                            tempSeries.bar[0].data[5] += val.femaleCount;
                            break;
                    }

                    break;
            }
        }

        if (totalCount > 0) {
            tempSeries.pie[0][1] = HighchartsService.formatFloat(
                (maleCount / totalCount) * 100
            );
            tempSeries.pie[1][1] = HighchartsService.formatFloat(
                (femaleCount / totalCount) * 100
            );
        }

        // detail bar
        this.chartOptionsDetailBar = {
            chart: {
                type: "bar",
                zoomType: "x"
            },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            xAxis: {
                categories: tempCategories.bar
            },
            yAxis: {
                min: 0,
                title: {
                    text: null,
                    align: "high"
                }
            },
            credits: { enabled: false },
            tooltip: { enabled: false },
            legend: { enabled: false },
            series: tempSeries.bar
        };

        // detail pie
        this.chartOptionsDetailPie = {
            chart: { zoomType: "x" },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            tooltip: { enabled: false },
            series: [
                {
                    type: "pie",
                    innerSize: "50%",
                    data: tempSeries.pie
                }
            ]
        };

        this.mountDetailChart = true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    private anysislyChartValueDefault(): IChartRepeatVisitorData {
        let value: IChartRepeatVisitorData = {
            date: new Date(),
            siteObjectId: "",

            repeatCount: 0,
            ageRange: EAgeRange.none,
            maleCount: 0,
            femaleCount: 0,
            maleCountPercent: 0,
            femaleCountPercent: 0,

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

    private anysislyChartValue(
        item: IChartRepeatVisitorData
    ): IChartRepeatVisitorData {
        let value = JSON.parse(JSON.stringify(item));
        value.date = new Date(value.date);

        value.maleCountPercent = 0;
        value.femaleCountPercent = 0;

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
            weather: this._("w_Report_Weather")
        };
        return result;
    }

    private changeChartType(value: string) {
        this.selection.chartType = value;
    }

    private changeRepeatCount(value: string) {
        this.selection.repeatCount = value;
        this.initDetailChart();
    }
}

export default HighchartsRepeatVisitor;
Vue.component("highcharts-repeat-visitor", HighchartsRepeatVisitor);
</script>

<style lang="scss" scoped>
.chart-error-message {
    text-align: center;
}
</style>
