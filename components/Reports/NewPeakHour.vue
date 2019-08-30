<template>
    <div>
        <h2 v-if="dayXSiteX != eDayXSiteX.none">{{_('w_PeakHours')}}</h2>
        <b-form-select
            v-if="dayXSiteX == eDayXSiteX.siteXDayX"
            v-model="site"
            :options="siteItems"
            @change="changeSite()"
        ></b-form-select>
        <apexchart
            v-if="chartItem.mount"
            type=heatmap
            :height="chartItem.height"
            :options="chartItem.options"
            :series="chartItem.series"
        />

    </div>
</template>


<script lang="ts">
import {
    Vue,
    Component,
    Prop,
    Emit,
    Watch,
    Model
} from "vue-property-decorator";
import {
    IPeckTimeRange,
    IPeckTimeRangeBody,
    EChartMode,
    ISiteItems
} from "@/components/Reports";
import Datetime from "@/services/Datetime";
import ExcelChartLevel from "@/services/ExcelChartLevel";

/// install apexcharts
import VueApexCharts from "vue-apexcharts";
Vue.component("apexchart", VueApexCharts);

@Component({
    components: {}
})
export class NewPeakHour extends Vue {
    // Prop
    @Prop({
        type: String,
        default: function() {
            return EChartMode.none;
        }
    })
    dayXSiteX: EChartMode;

    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    siteItems: ISiteItems[];

    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    timeRangeData: IPeckTimeRange[];

    @Watch("timeRangeData", { deep: true })
    private timeRangeDataChanged(newVal, oldVal) {
        this.initData();
    }

    chartItem = {
        levelColors: [
            "#ECECEC",
            "#F4F6F8",
            "#D8E7F8",
            "#B9CAFC",
            "#5780F8",
            "#265BF6"
        ],
        mount: false,
        height: 483,
        options: {},
        series: []
    };

    data = {};
    site = "";
    eDayXSiteX = EChartMode;

    created() {}

    mounted() {
        this.site = this.siteItems[0].value;
        this.initData();
    }

    changeSite() {
        this.initData();
    }

    initData() {
        this.chartItem.mount = false;
        this.chartItem.series = [];

        switch (this.dayXSiteX) {
            case EChartMode.site1Day1:
                this.generateDay1Ste1();
                break;
            case EChartMode.site1DayX:
                this.generateDayXSte1();
                break;
            case EChartMode.siteXDay1:
                this.generateDay1SteX();
                break;
            case EChartMode.siteXDayX:
                this.generateDayXSteX();
                break;
            default:
                break;
        }
    }

    fetchZero(value) {
        return value < 10 ? "0" + value : value;
    }

    generateDay1Ste1() {
        if (this.timeRangeData.length == 0) {
            return;
        }
        console.log("generateDay1Ste1", this.timeRangeData, this.siteItems);

        let yList = [];
        let sTime = null;
        let eTime = null;
        for (let officeHourItem of this.siteItems[0].officeHour) {
            if (
                sTime == null ||
                sTime > new Date(officeHourItem.startDate).getHours()
            ) {
                sTime = new Date(officeHourItem.startDate).getHours();
            }
            if (
                eTime == null ||
                eTime < new Date(officeHourItem.endDate).getHours()
            ) {
                eTime = new Date(officeHourItem.endDate).getHours();
            }
        }

        while (sTime <= eTime) {
            let yValue = -1;
            for (let itme of this.timeRangeData[0].body[0].context) {
                if (new Date(itme.time).getHours() == sTime) {
                    yValue = itme.value;
                    break;
                }
            }
            yList.push({
                x: sTime + ":00 ~ " + (parseInt(sTime) + 1) + ":00",
                y: yValue
            });
            sTime++;
        }

        this.chartItem.series.push({
            name: this.siteItems[0].text,
            data: JSON.parse(JSON.stringify(yList))
        });

        let allValues = [];
        let chartRanges = [
            {
                from: -2,
                to: -1,
                name: " ",
                color: this.chartItem.levelColors[0]
            }
        ];

        for (let i in this.chartItem.series) {
            for (let j in this.chartItem.series[i].data) {
                if (
                    typeof this.chartItem.series[i].data[j].y == "number" &&
                    this.chartItem.series[i].data[j].y > -1
                ) {
                    allValues.push(this.chartItem.series[i].data[j].y);
                }
            }
        }

        let levelLength = this.chartItem.levelColors.length - 1;
        if (levelLength > 0) {
            for (let i = 0; i < levelLength; i++) {
                chartRanges.push({
                    from:
                        i == 0
                            ? 0
                            : ExcelChartLevel.Percentile(
                                  allValues,
                                  (1 / levelLength) * i
                              ),
                    to:
                        i == levelLength - 1
                            ? ExcelChartLevel.Percentile(
                                  allValues,
                                  (1 / levelLength) * (i + 1)
                              ) * 10000
                            : ExcelChartLevel.Percentile(
                                  allValues,
                                  (1 / levelLength) * (i + 1)
                              ),
                    name: " ",
                    color: this.chartItem.levelColors[i + 1]
                });
            }
        }

        this.chartItem.options = {
            title: { text: "" },
            chart: { toolbar: { show: false } },
            dataLabels: { enabled: false },
            legend: { show: false },
            tooltip: { enabled: false },
            plotOptions: {
                heatmap: {
                    shadeIntensity: 0,
                    colorScale: {
                        ranges: chartRanges
                    }
                }
            }
        };

        this.chartItem.mount = true;
    }

    generateDayXSte1() {
        if (this.timeRangeData.length == 0) {
            return;
        }
        console.log("generateDayXSte1", this.timeRangeData, this.siteItems);

        for (let data of this.timeRangeData) {
            let sTime = null;
            let eTime = null;
            for (let officeHourItem of this.siteItems[0].officeHour) {
                if (
                    sTime == null ||
                    sTime > new Date(officeHourItem.startDate).getHours()
                ) {
                    sTime = new Date(officeHourItem.startDate).getHours();
                }
                if (
                    eTime == null ||
                    eTime < new Date(officeHourItem.endDate).getHours()
                ) {
                    eTime = new Date(officeHourItem.endDate).getHours();
                }
            }

            let yList = [];
            while (sTime <= eTime) {
                let yValue = -1;
                for (let itme of data.body[0].context) {
                    if (new Date(itme.time).getHours() == sTime) {
                        yValue = itme.value === 0 ? -1 : itme.value;
                        break;
                    }
                }
                yList.push({
                    x: sTime + ":00 ~ " + (parseInt(sTime) + 1) + ":00",
                    y: yValue
                });
                sTime++;
            }

            this.chartItem.series.push({
                name: Datetime.DateTime2String(
                    new Date(data.body[0].title),
                    "YYYY-MM-DD"
                ),
                data: JSON.parse(JSON.stringify(yList))
            });
        }

        let allValues = [];
        let chartRanges = [
            {
                from: -2,
                to: -1,
                name: " ",
                color: this.chartItem.levelColors[0]
            }
        ];

        for (let i in this.chartItem.series) {
            for (let j in this.chartItem.series[i].data) {
                if (
                    typeof this.chartItem.series[i].data[j].y == "number" &&
                    this.chartItem.series[i].data[j].y > -1
                ) {
                    allValues.push(this.chartItem.series[i].data[j].y);
                }
            }
        }

        let levelLength = this.chartItem.levelColors.length - 1;
        if (levelLength > 0) {
            for (let i = 0; i < levelLength; i++) {
                chartRanges.push({
                    from:
                        i == 0
                            ? 0
                            : ExcelChartLevel.Percentile(
                                  allValues,
                                  (1 / levelLength) * i
                              ),
                    to:
                        i == levelLength - 1
                            ? ExcelChartLevel.Percentile(
                                  allValues,
                                  (1 / levelLength) * (i + 1)
                              ) * 10000
                            : ExcelChartLevel.Percentile(
                                  allValues,
                                  (1 / levelLength) * (i + 1)
                              ),
                    name: " ",
                    color: this.chartItem.levelColors[i + 1]
                });
            }
        }

        this.chartItem.options = {
            title: { text: "" },
            chart: { toolbar: { show: false } },
            dataLabels: { enabled: false },
            legend: { show: false },
            tooltip: { enabled: false },
            plotOptions: {
                heatmap: {
                    shadeIntensity: 0,
                    colorScale: {
                        ranges: chartRanges
                    }
                }
            }
        };

        this.chartItem.mount = true;
    }

    generateDay1SteX() {
        if (this.timeRangeData.length == 0) {
            return;
        }
        console.log("generateDay1SteX", this.timeRangeData, this.siteItems);

        for (let data of this.timeRangeData) {
            let sTime = null;
            let eTime = null;
            for (let officeHourItem of this.siteItems.filter(
                x => x.value == data.site
            )[0].officeHour) {
                if (
                    sTime == null ||
                    sTime > new Date(officeHourItem.startDate).getHours()
                ) {
                    sTime = new Date(officeHourItem.startDate).getHours();
                }
                if (
                    eTime == null ||
                    eTime < new Date(officeHourItem.endDate).getHours()
                ) {
                    eTime = new Date(officeHourItem.endDate).getHours();
                }
            }

            let yList = [];
            while (sTime <= eTime) {
                let yValue = -1;
                for (let itme of data.body[0].context) {
                    if (new Date(itme.time).getHours() == sTime) {
                        yValue = itme.value === 0 ? -1 : itme.value;
                        break;
                    }
                }
                yList.push({
                    x: sTime + ":00 ~ " + (parseInt(sTime) + 1) + ":00",
                    y: yValue
                });
                sTime++;
            }

            this.chartItem.series.push({
                name: this.siteItems.filter(x => x.value == data.site)[0].text,
                data: JSON.parse(JSON.stringify(yList))
            });
        }

        let allValues = [];
        let chartRanges = [
            {
                from: -2,
                to: -1,
                name: " ",
                color: this.chartItem.levelColors[0]
            }
        ];

        for (let i in this.chartItem.series) {
            for (let j in this.chartItem.series[i].data) {
                if (
                    typeof this.chartItem.series[i].data[j].y == "number" &&
                    this.chartItem.series[i].data[j].y > -1
                ) {
                    allValues.push(this.chartItem.series[i].data[j].y);
                }
            }
        }

        let levelLength = this.chartItem.levelColors.length - 1;
        if (levelLength > 0) {
            for (let i = 0; i < levelLength; i++) {
                chartRanges.push({
                    from:
                        i == 0
                            ? 0
                            : ExcelChartLevel.Percentile(
                                  allValues,
                                  (1 / levelLength) * i
                              ),
                    to:
                        i == levelLength - 1
                            ? ExcelChartLevel.Percentile(
                                  allValues,
                                  (1 / levelLength) * (i + 1)
                              ) * 10000
                            : ExcelChartLevel.Percentile(
                                  allValues,
                                  (1 / levelLength) * (i + 1)
                              ),
                    name: " ",
                    color: this.chartItem.levelColors[i + 1]
                });
            }
        }

        this.chartItem.options = {
            title: { text: "" },
            chart: { toolbar: { show: false } },
            dataLabels: { enabled: false },
            legend: { show: false },
            tooltip: { enabled: false },
            plotOptions: {
                heatmap: {
                    shadeIntensity: 0,
                    colorScale: {
                        ranges: chartRanges
                    }
                }
            }
        };

        this.chartItem.mount = true;
    }

    generateDayXSteX() {
        if (this.timeRangeData.length == 0) {
            return;
        }
        console.log("generateDayXSteX", this.timeRangeData, this.siteItems);

        for (let data of this.timeRangeData) {
            if (data.site != this.site) {
                continue;
            }
            let sTime = null;
            let eTime = null;
            for (let officeHourItem of this.siteItems.filter(
                x => x.value == this.site
            )[0].officeHour) {
                if (
                    sTime == null ||
                    sTime > new Date(officeHourItem.startDate).getHours()
                ) {
                    sTime = new Date(officeHourItem.startDate).getHours();
                }
                if (
                    eTime == null ||
                    eTime < new Date(officeHourItem.endDate).getHours()
                ) {
                    eTime = new Date(officeHourItem.endDate).getHours();
                }
            }

            let yList = [];
            while (sTime <= eTime) {
                let yValue = -1;
                for (let itme of data.body[0].context) {
                    if (new Date(itme.time).getHours() == sTime) {
                        yValue = itme.value === 0 ? -1 : itme.value;
                        break;
                    }
                }
                yList.push({
                    x: sTime + ":00 ~ " + (parseInt(sTime) + 1) + ":00",
                    y: yValue
                });
                sTime++;
            }

            this.chartItem.series.push({
                name: Datetime.DateTime2String(
                    new Date(data.body[0].title),
                    "YYYY-MM-DD"
                ),
                data: JSON.parse(JSON.stringify(yList))
            });
        }

        let allValues = [];
        let chartRanges = [
            {
                from: -2,
                to: -1,
                name: " ",
                color: this.chartItem.levelColors[0]
            }
        ];

        for (let i in this.chartItem.series) {
            for (let j in this.chartItem.series[i].data) {
                if (
                    typeof this.chartItem.series[i].data[j].y == "number" &&
                    this.chartItem.series[i].data[j].y > -1
                ) {
                    allValues.push(this.chartItem.series[i].data[j].y);
                }
            }
        }

        let levelLength = this.chartItem.levelColors.length - 1;
        if (levelLength > 0) {
            for (let i = 0; i < levelLength; i++) {
                chartRanges.push({
                    from:
                        i == 0
                            ? 0
                            : ExcelChartLevel.Percentile(
                                  allValues,
                                  (1 / levelLength) * i
                              ),
                    to:
                        i == levelLength - 1
                            ? ExcelChartLevel.Percentile(
                                  allValues,
                                  (1 / levelLength) * (i + 1)
                              ) * 10000
                            : ExcelChartLevel.Percentile(
                                  allValues,
                                  (1 / levelLength) * (i + 1)
                              ),
                    name: " ",
                    color: this.chartItem.levelColors[i + 1]
                });
            }
        }

        this.chartItem.options = {
            title: { text: "" },
            chart: { toolbar: { show: false } },
            dataLabels: { enabled: false },
            legend: { show: false },
            tooltip: { enabled: false },
            plotOptions: {
                heatmap: {
                    shadeIntensity: 0,
                    colorScale: {
                        ranges: chartRanges
                    }
                }
            }
        };

        this.chartItem.mount = true;
    }
}

export default NewPeakHour;
Vue.component("new-peak-hour", NewPeakHour);
</script>

<style lang="scss" scoped>
.hoursRange0 {
    background-color: #f4f6f8;
    height: 47px;
}
.hoursRange1 {
    background-color: #d8e7f8;
    height: 47px;
}
.hoursRange2 {
    background-color: #b9cafc;
    height: 47px;
}

.hoursRange3 {
    background-color: #5780f8;
    height: 47px;
}
.hoursRange4 {
    background-color: #265bf6;
    height: 47px;
}

.table-no-border {
    border-collapse: collapse;
    th,
    td {
        border: 10px solid rgb(100%, 100%, 100%);
    }
}
</style>
