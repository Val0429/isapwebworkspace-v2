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

/// install Highcharts
import VueApexCharts from "vue-apexcharts";
import Datetime from "@/services/Datetime";
import {
    IDateRange,
    IParam,
    IPeakhour
} from "@/components/Dashboard/models/IDashboard";
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
        console.log("!!! this.param.siteIds", this.param.siteIds);
        this.initDevelopData();

        // TODO: wait api
        // Loading.show();
        // await this.$server
        //     .C("/", timeParam)
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(this, response, (response: any) => {
        //             this.initCharts();
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
        this.chartItem.series = [];

        let chartRanges = [];
        let weekList = [];

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

        console.log("!!!! series", this.chartItem.series);

        for (let peakHour of this.peakHourDatas) {
            let dataHour: number = peakHour.date.getHours();
            let dateDay: number = peakHour.date.getDay();
            if (this.chartItem.series[dataHour].data[dateDay].y == -1) {
                this.chartItem.series[dataHour].data[dateDay].y = 0;
            }
            this.chartItem.series[dataHour].data[dateDay].y += peakHour.value;
        }

        // TODO: Wait API
        chartRanges = [
            {
                from: -10000,
                to: -1,
                name: " ",
                color: "#ececec"
            },
            {
                from: 0,
                to: 5,
                name: " ",
                color: "#F4F6F8"
            },
            {
                from: 6,
                to: 20,
                name: " ",
                color: "#D8E7F8"
            },
            {
                from: 21,
                to: 45,
                name: " ",
                color: "#B9CAFC"
            },
            {
                from: 46,
                to: 55,
                name: " ",
                color: "#5780F8"
            },
            {
                from: 56,
                to: 100000,
                name: " ",
                color: "#265BF6"
            }
        ];

        this.chartItem.options = {
            title: { text: "" },
            chart: { toolbar: { show: false } },
            dataLabels: { enabled: false },
            legend: { show: false },
            // tooltip: { enabled: false },
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
                this.peakHourDatas.push({
                    date: new Date(i),
                    siteId: siteId,
                    value: Math.floor(Math.random() * (55 + 30 + 1)) - 30
                });
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
