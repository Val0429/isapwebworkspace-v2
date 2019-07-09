<template>
    <div class="chart">

        <b-form-group v-if="errorMessage == ''">
            <b-row>
                <b-col cols="12">
                    <highcharts
                        ref="chartGenderAge"
                        v-if="mountChart.genderAge"
                        :options="chartOptionsGenderAge"
                    ></highcharts>
                </b-col>
            </b-row>

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
                        :options="selectItem.gender"
                        @change="changeGender"
                    ></b-form-radio-group>
                    <highcharts
                        ref="chartGenderTime"
                        v-if="mountChart.genderTime"
                        :options="chartOptionsGenderTime"
                    ></highcharts>
                </b-col>
            </b-row>

            <b-row>
                <b-col cols="12">
                    <b-form-group :label="'Demographic by Age'"></b-form-group>
                </b-col>

                <b-col cols="6">
                    <highcharts
                        ref="chartAge"
                        v-if="mountChart.age"
                        :options="chartOptionsAge"
                    ></highcharts>
                </b-col>
                <b-col cols="6">
                    <b-row>
                        <b-col cols="12">
                            <iv-form-selection
                                class='col-md-12'
                                :value="selection.ageRange"
                                :options="selectItem.ageRange"
                                @input="changeAge"
                            ></iv-form-selection>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="6">
                            <highcharts
                                ref="chartDwellTime"
                                v-if="mountChart.dwellTime"
                                :options="chartOptionsDwellTime"
                            ></highcharts>
                        </b-col>
                        <b-col cols="6">
                            <highcharts
                                ref="chartGender"
                                v-if="mountChart.gender"
                                :options="chartOptionsGender"
                            ></highcharts>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-form-group>

        <b-form-group
            v-if="errorMessage != ''"
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
    EWeather,
    EAgeRange,
    EGender
} from "./models/EHighCharts";
import {
    IValSelectItem,
    IBootstrapSelectItem,
    ISite,
    IDemographicMount,
    ISiteOfficeHourItem,
    IChartDemographicData
} from "./models/IHighCharts";
import Datetime from "@/services/Datetime";
import HighchartsService from "./models/HighchartsService";

@Component({
    components: {}
})
export class HighchartsDemographic extends Vue {
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
    value: IChartDemographicData[];

    @Watch("value", { deep: true })
    private onValueChanged(
        newval: IChartDemographicData[],
        oldval: IChartDemographicData[]
    ) {
        this.start();
    }

    @Watch("timeMode")
    private onTimeModeChanged(newval: ETimeMode, oldval: ETimeMode) {
        this.start();
    }

    eChartMode = EChartMode;
    errorMessage: string = "";
    chartMode: EChartMode = EChartMode.none;

    mountChart: IDemographicMount = {
        genderAge: false,
        genderTime: false,
        age: false,
        dwellTime: false,
        gender: false
    };

    selection: { gender: EGender; ageRange: EAgeRange } = {
        gender: EGender.male,
        ageRange: EAgeRange.all
    };
    selectItem: {
        gender: IBootstrapSelectItem[];
        ageRange: IValSelectItem[];
    } = {
        gender: [],
        ageRange: []
    };

    // chart options
    chartOptionsGenderAge: any = {};
    chartOptionsGenderTime: any = {};
    chartOptionsAge: any = {};
    chartOptionsDwellTime: any = {};
    chartOptionsGender: any = {};

    created() {
        this.initSelectItem();
        this.start();
    }

    mounted() {}

    initSelectItem() {
        this.selectItem.gender = [
            {
                value: EGender.male,
                text: this._("w_ReportDemographic_GenderMale")
            },
            {
                value: EGender.female,
                text: this._("w_ReportDemographic_GenderFemale")
            }
        ];
        this.selectItem.ageRange = [
            {
                id: EAgeRange.all,
                text: this._("w_ReportDemographic_AgeAll")
            },
            {
                id: EAgeRange.lower20,
                text: this._("w_ReportDemographic_AgeLow20")
            },
            {
                id: EAgeRange.m21_30,
                text: this._("w_ReportDemographic_AgeM21_30")
            },
            {
                id: EAgeRange.m31_40,
                text: this._("w_ReportDemographic_AgeM31_40")
            },
            {
                id: EAgeRange.m41_50,
                text: this._("w_ReportDemographic_AgeM41_50")
            },
            {
                id: EAgeRange.m51_60,
                text: this._("w_ReportDemographic_AgeM51_60")
            },
            {
                id: EAgeRange.upper61,
                text: this._("w_ReportDemographic_AgeUpp61")
            }
        ];
    }

    start() {
        this.errorMessage = "";
        this.mountChart = {
            genderAge: false,
            genderTime: false,
            age: false,
            dwellTime: false,
            gender: false
        };

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

        // set same chart
        this.drawChartGenderAge();
        this.drawChartAge();
        this.drawChartDwellTime();
        this.drawChartGender();

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
        let tempValues: IChartDemographicData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempHourStrings: string[] = [];
        let tempCategories: string[] = [];
        let tempResult: IChartDemographicData[] = [];
        let tempSeries: any = [
            {
                name: this._("w_ReportDemographic_GenderMale"),
                data: []
            },
            {
                name: this._("w_ReportDemographic_GenderFemale"),
                data: []
            }
        ];
        let tempTotalCount: number = 0;

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

        for (let categorie of tempHourStrings) {
            let haveValue = false;
            for (let loopValue of tempValues) {
                let value: IChartDemographicData = this.anysislyChartValue(
                    loopValue
                );
                if (value.timeString == categorie) {
                    haveValue = true;
                    tempResult.push(value);
                    tempTotalCount += value.maleCount;
                    tempTotalCount += value.femaleCount;
                    break;
                }
            }
            if (!haveValue) {
                let defaultValue = this.anysislyChartValueDefault();
                defaultValue.timeString = categorie;
                tempResult.push(defaultValue);
            }
        }

        // set data
        if (tempTotalCount > 0) {
            for (let categorie of tempHourStrings) {
                let haveValue = false;
                for (let loopValue of tempValues) {
                    let value: IChartDemographicData = this.anysislyChartValue(
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
                result.maleCountPercent = HighchartsService.formatFloat(
                    (result.maleCount / tempTotalCount) * 100
                );
                result.femaleCountPercent = HighchartsService.formatFloat(
                    (result.femaleCount / tempTotalCount) * 100
                );
                tempSeries[0].data.push(result.maleCountPercent);
                tempSeries[1].data.push(result.femaleCountPercent);
                tempCategories.push(
                    HighchartsService.categorieStringWithJSON(
                        result.timeString,
                        result
                    )
                );
            }
        }

        this.chartOptionsGenderTime = {
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
                    style: { color: "#000" },
                    formatter: function() {
                        let self: any = this;
                        return `${self.value}%`;
                    }
                },
                title: {
                    text: null
                }
            },
            tooltip: {
                useHTML: true,
                formatter: function() {
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
                            result += `${newValue.i18n.gender}: ${self.series.name}<br>`;
                            if (self.series.name == newValue.i18n.male) {
                                result += `${newValue.i18n.percent}: ${newValue.maleCountPercent}%<br>`;
                            } else {
                                result += `${newValue.i18n.percent}: ${newValue.femaleCountPercent}%<br>`;
                            }
                            return result;
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    return result;
                }
            },
            series: tempSeries
        };

        this.mountChart.genderTime = true;
    }

    ////////////////////////// site 1 day X //////////////////////////

    initSite1DayX() {
        let tempValues: IChartDemographicData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempCategories: string[] = [];
        let tempResult: IChartDemographicData[] = [];
        let tempSeries: any = [
            {
                name: this._("w_ReportDemographic_GenderMale"),
                data: []
            },
            {
                name: this._("w_ReportDemographic_GenderFemale"),
                data: []
            }
        ];
        let tempTotalCount: number = 0;

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
            let tempChartData: IChartDemographicData = this.anysislyChartValueDefault();

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

            for (let val of tempValues) {
                let value: IChartDemographicData = this.anysislyChartValue(val);
                let valTimestamp = value.date.getTime();
                if (
                    value.siteObjectId == tempChartData.siteObjectId &&
                    valTimestamp >= tempStartTimestamp &&
                    valTimestamp <= tempEndTimestamp
                ) {
                    tempChartData.maleCount += value.maleCount;
                    tempChartData.femaleCount += value.femaleCount;
                    tempChartData.weather = value.weather;
                    tempChartData.weatherIcon = HighchartsService.weatherIcon(
                        value.weather
                    );

                    tempTotalCount += value.maleCount;
                    tempTotalCount += value.femaleCount;
                }
            }

            // push single series data
            tempResult.push(tempChartData);

            // set loop value
            categorieNowlength++;
            tempTimestamp = tempChartData.dateEnd.getTime() + 1000;
        }

        // set data
        if (tempTotalCount > 0) {
            // set result
            for (let result of tempResult) {
                result.maleCountPercent = HighchartsService.formatFloat(
                    (result.maleCount / tempTotalCount) * 100
                );
                result.femaleCountPercent = HighchartsService.formatFloat(
                    (result.femaleCount / tempTotalCount) * 100
                );
                tempSeries[0].data.push(result.maleCountPercent);
                tempSeries[1].data.push(result.femaleCountPercent);
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
                                HighchartsService.categoriesQuarter(
                                    result.date
                                ),
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
        }

        this.chartOptionsGenderTime = {
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
                    style: { color: "#000" },
                    formatter: function() {
                        let self: any = this;
                        return `${self.value}%`;
                    }
                },
                title: {
                    text: null
                }
            },
            tooltip: {
                useHTML: true,
                formatter: function() {
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
                            result += `${newValue.i18n.date}:${newValue.dateString}<br>`;
                            result += `${newValue.i18n.gender}: ${self.series.name}<br>`;
                            if (self.series.name == newValue.i18n.male) {
                                result += `${newValue.i18n.percent}: ${newValue.maleCountPercent}%<br>`;
                            } else {
                                result += `${newValue.i18n.percent}: ${newValue.femaleCountPercent}%<br>`;
                            }
                            return result;
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    return result;
                }
            },
            series: tempSeries
        };

        this.mountChart.genderTime = true;
    }

    ////////////////////////// site X day 1 //////////////////////////

    initSiteXDay1() {
        let tempValues: IChartDemographicData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempCategories: string[] = [];
        let tempResult: IChartDemographicData[] = [];
        let tempSeries: any = [
            {
                name: this._("w_ReportDemographic_GenderMale"),
                data: []
            },
            {
                name: this._("w_ReportDemographic_GenderFemale"),
                data: []
            }
        ];
        let tempTotalCount: number = 0;

        for (let site of this.sites) {
            let haveValue = false;
            for (let loopValue of tempValues) {
                let value: IChartDemographicData = this.anysislyChartValue(
                    loopValue
                );
                if (value.siteObjectId == site.objectId) {
                    haveValue = true;
                    tempTotalCount += value.maleCount;
                    tempTotalCount += value.femaleCount;
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

        if (tempTotalCount > 0) {
            // set result
            for (let result of tempResult) {
                result.maleCountPercent = HighchartsService.formatFloat(
                    (result.maleCount / tempTotalCount) * 100
                );
                result.femaleCountPercent = HighchartsService.formatFloat(
                    (result.femaleCount / tempTotalCount) * 100
                );
                tempSeries[0].data.push(result.maleCountPercent);
                tempSeries[1].data.push(result.femaleCountPercent);
                tempCategories.push(
                    HighchartsService.categorieStringWithJSON(
                        `${result.siteName} ${result.weatherIcon}`,
                        result
                    )
                );
            }

            this.chartOptionsGenderTime = {
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
                        style: { color: "#000" },
                        formatter: function() {
                            let self: any = this;
                            return `${self.value}%`;
                        }
                    },
                    title: {
                        text: null
                    }
                },
                tooltip: {
                    useHTML: true,
                    formatter: function() {
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
                                result += `${newValue.siteName}<br>`;
                                result += `${newValue.i18n.gender}: ${self.series.name}<br>`;
                                result += `${newValue.i18n.date}:${newValue.dateString}<br>`;
                                if (self.series.name == newValue.i18n.male) {
                                    result += `${newValue.i18n.percent}: ${newValue.maleCountPercent}%<br>`;
                                } else {
                                    result += `${newValue.i18n.percent}: ${newValue.femaleCountPercent}%<br>`;
                                }
                                return result;
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        return result;
                    }
                },
                series: tempSeries
            };

            this.mountChart.genderTime = true;
        }
    }

    ////////////////////////// site X day X //////////////////////////

    initSiteXDayX() {
        let tempValues: IChartDemographicData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempCategories: string[] = [];
        let tempResult: any = [];
        let tempSeries: {
            name: string;
            data: number[];
        }[] = [];

        let tempTotalMaleCount: number = 0;
        let tempTotalFemaleCount: number = 0;
        let tempTotalCount: number = 0;

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
            let tempChartData: IChartDemographicData = this.anysislyChartValueDefault();
            let tempResultItem = {
                categorie: "",
                i18n: this.i18nItem(),
                sites: [],
                timeMode: this.timeMode,
                areaMode: this.areaMode,
                genderMode: this.selection.gender
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

            let tempStartTimestamp = tempChartData.dateStart.getTime()-1000;
            let tempEndTimestamp = tempChartData.dateEnd.getTime() +1000;

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
                    let value: IChartDemographicData = this.anysislyChartValue(
                        val
                    );
                    let valTimestamp = value.date.getTime();

                    if (
                        value.siteObjectId == tempSiteValue.siteObjectId &&
                        valTimestamp >= tempStartTimestamp &&
                        valTimestamp <= tempEndTimestamp
                    ) {
                        tempSiteValue.maleCount += value.maleCount;
                        tempSiteValue.femaleCount += value.femaleCount;
                        tempSiteValue.temperature += value.temperature;
                        tempSiteValue.weather = value.weather;
                        tempSiteValue.weatherIcon = HighchartsService.weatherIcon(
                            value.weather
                        );

                        tempTotalCount += value.maleCount;
                        tempTotalCount += value.femaleCount;

                        tempTotalMaleCount += value.maleCount;
                        tempTotalFemaleCount += value.femaleCount;
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
                        if (tempTotalMaleCount != 0) {
                            tempItem.maleCountPercent = HighchartsService.formatFloat(
                                (tempItem.maleCount / tempTotalMaleCount) * 100
                            );
                        }
                        if (tempTotalFemaleCount != 0) {
                            tempItem.femaleCountPercent = HighchartsService.formatFloat(
                                (tempItem.femaleCount / tempTotalFemaleCount) *
                                    100
                            );
                        }

                        switch (this.selection.gender) {
                            case EGender.male:
                                tempData.push(tempItem.maleCountPercent);
                                break;
                            case EGender.female:
                                tempData.push(tempItem.femaleCountPercent);
                                break;
                        }

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

        this.chartOptionsGenderTime = {
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
                    text: null,
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
                                            if (newValue.genderMode == "male") {
                                                result += `${newValue.i18n.gender}: ${newValue.i18n.male}<br>`;
                                                result += `${newValue.i18n.percent}: ${site.maleCountPercent}%<br>`;
                                            } else {
                                                result += `${newValue.i18n.gender}: ${newValue.i18n.female}<br>`;
                                                result += `${newValue.i18n.percent}: ${site.femaleCountPercent}%<br>`;
                                            }
                                            break;
                                        case ETimeMode.day:
                                        case ETimeMode.hour:
                                        default:
                                            result += `${site.siteName}<br>`;
                                            result += `${newValue.i18n.date}: ${newValue.categorie}<br>`;
                                            if (newValue.genderMode == "male") {
                                                result += `${newValue.i18n.gender}: ${newValue.i18n.male}<br>`;
                                                result += `${newValue.i18n.percent}: ${site.maleCountPercent}%<br>`;
                                            } else {
                                                result += `${newValue.i18n.gender}: ${newValue.i18n.female}<br>`;
                                                result += `${newValue.i18n.percent}: ${site.femaleCountPercent}%<br>`;
                                            }
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
        this.mountChart.genderTime = true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    drawChartGenderAge() {
        let tempValues: IChartDemographicData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let categories: string[] = this.getAgeList();
        let tempTotalCount: number = 0;
        let series: any = [
            {
                name: this._("w_ReportDemographic_GenderMale"),
                countData: [0, 0, 0, 0, 0, 0],
                data: [0, 0, 0, 0, 0, 0]
            },
            {
                name: this._("w_ReportDemographic_GenderFemale"),
                countData: [0, 0, 0, 0, 0, 0],
                data: [0, 0, 0, 0, 0, 0]
            }
        ];

        for (let value of tempValues) {
            let tempAgeIndex = -1;
            switch (value.ageRange) {
                case EAgeRange.lower20:
                    tempAgeIndex = 0;
                    break;
                case EAgeRange.m21_30:
                    tempAgeIndex = 1;
                    break;
                case EAgeRange.m31_40:
                    tempAgeIndex = 2;
                    break;
                case EAgeRange.m41_50:
                    tempAgeIndex = 3;
                    break;
                case EAgeRange.m51_60:
                    tempAgeIndex = 4;
                    break;
                case EAgeRange.upper61:
                    tempAgeIndex = 5;
                    break;
                case EAgeRange.none:
                default:
                    break;
            }
            if (tempAgeIndex > -1) {
                if (series[0].countData[tempAgeIndex] == undefined) {
                    series[0].countData[tempAgeIndex] = 0;
                }
                if (series[1].countData[tempAgeIndex] == undefined) {
                    series[1].countData[tempAgeIndex] = 0;
                }
                tempTotalCount += value.maleCount;
                tempTotalCount += value.femaleCount;
                series[0].countData[tempAgeIndex] += value.maleCount;
                series[1].countData[tempAgeIndex] += value.femaleCount;
            }
        }

        if (tempTotalCount > 0) {
            for (let i in series) {
                let iNumber = parseInt(i);
                for (let j in series[i].countData) {
                    let jNumber = parseInt(j);
                    if (series[i].data[j] == undefined) {
                        series[i].data[j] = 0;
                    }
                    series[i].data[j] = HighchartsService.formatFloat(
                        (series[i].countData[j] / tempTotalCount) * 100
                    );
                }
            }

            // set chart options
            this.chartOptionsGenderAge = {
                chart: { type: "column", zoomType: "x" },
                exporting: { enabled: false },
                title: { text: null },
                subtitle: { text: null },
                xAxis: {
                    labels: { useHTML: true },
                    categories: categories
                },
                yAxis: {
                    min: 0,
                    labels: {
                        style: { color: "#000" },
                        formatter: function() {
                            let self: any = this;
                            return self.value + "%";
                        }
                    },
                    title: { text: null }
                },
                tooltip: {
                    useHTML: true,
                    enabled: false
                },
                series: series
            };

            this.mountChart.genderAge = true;
        }
    }

    drawChartAge() {
        let tempValues: IChartDemographicData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let categories: string[] = this.getAgeList();
        let tempTotalCount: number = 0;
        let series: any = [
            {
                type: "pie",
                name: null,
                innerSize: "50%",
                data: [],
                countData: []
            }
        ];

        for (let categorie of categories) {
            series[0].data.push([categorie, 0]);
            series[0].countData.push(0);
        }

        for (let value of tempValues) {
            let tempAgeIndex = -1;
            switch (value.ageRange) {
                case EAgeRange.lower20:
                    tempAgeIndex = 0;
                    break;
                case EAgeRange.m21_30:
                    tempAgeIndex = 1;
                    break;
                case EAgeRange.m31_40:
                    tempAgeIndex = 2;
                    break;
                case EAgeRange.m41_50:
                    tempAgeIndex = 3;
                    break;
                case EAgeRange.m51_60:
                    tempAgeIndex = 4;
                    break;
                case EAgeRange.upper61:
                    tempAgeIndex = 5;
                    break;
                case EAgeRange.none:
                default:
                    break;
            }
            if (tempAgeIndex > -1) {
                if (series[0].data[tempAgeIndex][1] == undefined) {
                    series[0].data[tempAgeIndex][1] = 0;
                }
                if (series[0].countData[tempAgeIndex] == undefined) {
                    series[0].countData[tempAgeIndex] = 0;
                }
                series[0].countData[tempAgeIndex] += value.maleCount;
                series[0].countData[tempAgeIndex] += value.femaleCount;
                tempTotalCount += value.maleCount;
                tempTotalCount += value.femaleCount;
            }
        }

        if (tempTotalCount > 0) {
            // set data
            for (let i in series[0].data) {
                let iNumber = parseInt(i);
                series[0].data[iNumber][1] = HighchartsService.formatFloat(
                    (series[0].countData[iNumber] / tempTotalCount) * 100
                );
            }

            // set chart options
            this.chartOptionsAge = {
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
                series: series
            };

            this.mountChart.age = true;
        }
    }

    // TODO: No dwelltime API
    drawChartDwellTime() {
        let tempValues: IChartDemographicData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let categories: string[] = this.getPersonCountList();

        this.chartOptionsDwellTime = {
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
                }
            },
            credits: { enabled: false },
            series: [
                {
                    name: "Male",
                    data: [107, 31, 635, 203, 2, 0]
                },
                {
                    name: "Female",
                    data: [133, 156, 947, 408, 6, 12]
                }
            ]
        };
        this.mountChart.dwellTime = true;
    }

    // TODO: No dwelltime API
    drawChartGender() {
        this.chartOptionsGender = {
            chart: { zoomType: "x" },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            tooltip: { enabled: false },
            series: [
                {
                    type: "pie",
                    innerSize: "50%",
                    data: [["Male", 58.9], ["Female", 13.29]]
                }
            ]
        };
        this.mountChart.gender = true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    private anysislyChartValueDefault(): IChartDemographicData {
        let value: IChartDemographicData = {
            date: new Date(),
            siteObjectId: "",
            ageRange: EAgeRange.none,
            maleCount: 0,
            femaleCount: 0,
            temperatureMin: 0,
            temperatureMax: 0,
            weather: EWeather.none,

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

    private anysislyChartValue(
        item: IChartDemographicData
    ): IChartDemographicData {
        let value = JSON.parse(JSON.stringify(item));
        value.date = new Date(value.date);

        value.maleCountPercent = 0;
        value.femaleCountPercent = 0;

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

    private changeGender(value: EGender) {
        this.selection.gender = value;
        if (this.chartMode == EChartMode.siteXDayX) {
            this.initSiteXDayX();
        }
    }

    private changeAge(value: EAgeRange) {
        this.selection.ageRange = value;
        this.drawChartDwellTime();
        this.drawChartGender();
    }

    private getAgeList(): string[] {
        let result: string[] = [
            this._("w_ReportDemographic_AgeLow20"),
            this._("w_ReportDemographic_AgeM21_30"),
            this._("w_ReportDemographic_AgeM31_40"),
            this._("w_ReportDemographic_AgeM41_50"),
            this._("w_ReportDemographic_AgeM51_60"),
            this._("w_ReportDemographic_AgeUpp61")
        ];
        return result;
    }

    private getPersonCountList(): string[] {
        let result: string[] = [
            "<5",
            "5-15",
            "15-30",
            "30-60",
            "60-120",
            ">120"
        ];
        return result;
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
            gender: this._("w_ReportDemographic_Gender"),
            male: this._("w_ReportDemographic_GenderMale"),
            female: this._("w_ReportDemographic_GenderFemale"),
            percent: this._("w_Report_Percent")
        };
        return result;
    }
}

export default HighchartsDemographic;
Vue.component("highcharts-demographic", HighchartsDemographic);
</script>

<style lang="scss" scoped>
.chart-error-message {
    text-align: center;
}
    .select-gender {
        height: 36px;
    }
</style>

