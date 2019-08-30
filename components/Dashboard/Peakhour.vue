<template>
    <div>
        <iv-card
            :label="_('w_Dashboard_PeakHour')"
            :data="{ 'header-bg-variant': 'transparent', 'hide-collapse-button': true, 'border-variant': 'white' }"
            class="font-3xl"
        >
            <apexchart
                v-if="chartItem.mount"
                type=heatmap
                :height="chartItem.height"
                :options="chartItem.options"
                :series="chartItem.series"
            />
            <select-permission-site
                :radioName="radioName"
                @siteIds="receiveSiteIds"
            ></select-permission-site>
            <select-time
                :timeParam="param.dateRange"
                @updateTime="receiveTime"
            ></select-time>
        </iv-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";

// Custom
import {
    IDateRange,
    IParam,
    IPeakhour
} from "@/components/Dashboard/models/IDashboard";

// Services
import Datetime from "@/services/Datetime";
import ExcelChartLevel from "@/services/ExcelChartLevel";

/// install apexcharts
import VueApexCharts from "vue-apexcharts";
Vue.component("apexchart", VueApexCharts);

@Component({
    components: { apexchart: VueApexCharts }
})
export class Peakhour extends Vue {
    param: IParam = {
        siteIds: [],
        dateRange: {
            startDate: new Date(),
            endDate: new Date()
        }
    };

    radioName: string = "Peakhour";
    peakHourDatas: IPeakhour[] = [];
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

    created() {}

    async mounted() {
        await this.initData();
    }

    async initData() {
        // TODO: wait api to remove
        // this.initDevelopData();

        let tempData = {
            "peakHours": [
                {
                    "site": {
                        "objectId": "iVTCTzctbF",
                        "name": "台北店"
                    },
                    "date": "2019-08-28T16:00:00.000Z",
                    "peakHourDatas": [
                        {
                            "date": "2019-08-29T00:00:00.000Z",
                            "level": 122
                        },
                        {
                            "date": "2019-08-29T01:00:00.000Z",
                            "level": 112
                        },
                        {
                            "date": "2019-08-29T02:00:00.000Z",
                            "level": 30
                        },
                        {
                            "date": "2019-08-29T03:00:00.000Z",
                            "level": 71
                        }
                    ]
                }
            ]
        };



        this.formatChartData(tempData.peakHours);

        // TODO: wait api
        // Loading.show();
        // await this.$server
        //     .C("/", timeParam)
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(this, response, (response: any) => {
        //             this.formatChartData();
        //         });
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.catchError(
        //             this,
        //             e,
        //             this._("w_Dialog_ErrorTitle")
        //         );
        //     });
    }

    initCharts() {
        this.chartItem.mount = false;
        this.chartItem.series = [];

        let chartRanges = [];
        let weekList = [];
        let allValues = [];

        for (let i = 0; i < 7; i++) {
            let iString = i.toString();
            let xString = "";
            switch (iString) {
                case "0":
                    xString = this._("mb_DateTime_ShortWeekDay0");
                    break;
                case "1":
                    xString = this._("mb_DateTime_ShortWeekDay1");
                    break;
                case "2":
                    xString = this._("mb_DateTime_ShortWeekDay2");
                    break;
                case "3":
                    xString = this._("mb_DateTime_ShortWeekDay3");
                    break;
                case "4":
                    xString = this._("mb_DateTime_ShortWeekDay4");
                    break;
                case "5":
                    xString = this._("mb_DateTime_ShortWeekDay5");
                    break;
                case "6":
                    xString = this._("mb_DateTime_ShortWeekDay6");
                    break;
            }
            weekList.push({
                x: xString,
                y: -1
            });
        }

        for (let i = 23; i >= 0; i--) {
            let name = "";
            if (i == 0) {
                name = "12" + this._("mb_DateTime_LowerAM");
            } else if (i % 3 != 0) {
                name = " ";
            } else if (i == 12) {
                name = "12" + this._("mb_DateTime_LowerPM");
            } else if (i > 12) {
                name = (i - 12).toString() + this._("mb_DateTime_LowerPM");
            } else {
                name = i.toString() + this._("mb_DateTime_LowerAM");
            }

            this.chartItem.series.push({
                name: name,
                data: JSON.parse(JSON.stringify(weekList))
            });
        }

        for (let peakHour of this.peakHourDatas) {
            if (isNaN(peakHour.date.getTime())) {
                continue;
            }
            if (typeof peakHour.value != "number") {
                continue;
            }
            let dataHour: number = peakHour.date.getHours();
            let dateDay: number = peakHour.date.getDay();
            if (this.chartItem.series[dataHour].data[dateDay].y == -1) {
                this.chartItem.series[dataHour].data[dateDay].y = 0;
            }
            this.chartItem.series[dataHour].data[dateDay].y += peakHour.value;
        }

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

        chartRanges = [
            {
                from: -2,
                to: -1,
                name: " ",
                color: this.chartItem.levelColors[0]
            }
        ];

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

    formatChartData(value: any) {
        for (const data of value) {
            for (const detail of data.peakHourDatas) {
                let peakHour = {
                    date: new Date(detail.date),
                    value: detail.level
                };
                this.peakHourDatas.push(peakHour)
            }
        }
        this.initCharts();
    }

    receiveSiteIds(siteIds: string[]) {
        this.param.siteIds = siteIds;
        this.initData();
    }

    receiveTime(dateRange: IDateRange) {
        let startTime = !isNaN(dateRange.startDate.getTime())
            ? dateRange.startDate.getTime()
            : new Date().getTime();
        let endTime = !isNaN(dateRange.endDate.getTime())
            ? dateRange.endDate.getTime()
            : new Date().getTime();
        if (startTime > endTime) {
            let tempTime = startTime;
            startTime = endTime;
            endTime = tempTime;
        }
        this.param.dateRange = {
            startDate: new Date(startTime),
            endDate: new Date(endTime)
        };
        this.initData();
    }

    initDevelopData() {
        this.peakHourDatas = [];
        let startTime: number = this.param.dateRange.startDate.getTime();
        let endTime: number = this.param.dateRange.endDate.getTime();
        for (let siteId of this.param.siteIds) {
            for (
                let i = startTime;
                i <= endTime;
                i += Datetime.oneDayTimestamp
            ) {
                for (let j = 0; j < 24; j++) {
                    let tempDate = new Date(i);
                    tempDate.setHours(j);
                    this.peakHourDatas.push({
                        date: tempDate,
                        value: Math.floor(Math.random() * (128 + 1))
                    });
                }
            }
        }
        this.initCharts();
    }
}

export default Peakhour;
Vue.component("peak-hour", Peakhour);
</script>

<style lang="scss" scoped>
</style>
