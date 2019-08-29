<template>
    <div>
        <iv-card
            :label="_('w_Dashboard_PeakHour')"
            :data="{ 'header-bg-variant': 'transparent', 'hide-collapse-button': true, 'border-variant': 'white' }"
            class="font-3xl"
        >
            <apexchart
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
        this.initDevelopData();
        this.initCharts();

        // TODO: wait api
        // Loading.show();
        // await this.$server
        //     .C("/", timeParam)
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(
        //             this,
        //             response,
        //             (response: any) => {
        //             },
        //             this._("w_Dialog_ErrorTitle")
        //         );
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

        for (let i = 23; i >= 0; i--) {
            let name = "";
            if (i == 0) {
                name = "12" + this._("mb_DateTime_LowerAM");
            }
            // else if (i % 3 != 0) {
            //     name = " ";
            // }
            else if (i == 12) {
                name = "12" + this._("mb_DateTime_LowerPM");
            } else if (i > 12) {
                name = (i - 12).toString() + this._("mb_DateTime_LowerPM");
            } else {
                name = i.toString() + this._("mb_DateTime_LowerAM");
            }

            // TODO: wait data
            let chartData = this.developData(7, { min: -30, max: 55 });

            this.chartItem.series.push({
                name: name,
                data: chartData
            });
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
    }

    receiveSiteIds(siteIds: string[]) {
        this.param.siteIds = siteIds;
        this.initData();
    }

    receiveTime(dateRange: IDateRange) {
        this.param.dateRange = dateRange;
        this.initData();
    }

    initDevelopData() {
        let startTime: number = this.param.dateRange.startDate.getTime();
        let endTime: number = this.param.dateRange.endDate.getTime();
    }

    developData(count, yRange) {
        let i = 0;
        let series = [];
        while (i < count) {
            let weekDay = i.toString();
            let x = "";
            let y =
                Math.floor(Math.random() * (yRange.max - yRange.min + 1)) +
                yRange.min;
            switch (weekDay) {
                case "0":
                    x = this._("mb_DateTime_ShortWeekDay0");
                    break;
                case "1":
                    x = this._("mb_DateTime_ShortWeekDay1");
                    break;
                case "2":
                    x = this._("mb_DateTime_ShortWeekDay2");
                    break;
                case "3":
                    x = this._("mb_DateTime_ShortWeekDay3");
                    break;
                case "4":
                    x = this._("mb_DateTime_ShortWeekDay4");
                    break;
                case "5":
                    x = this._("mb_DateTime_ShortWeekDay5");
                    break;
                case "6":
                    x = this._("mb_DateTime_ShortWeekDay6");
                    break;
            }
            series.push({ x: x, y: y });
            i++;
        }
        return series;
    }
}

export default Peakhour;
Vue.component("peak-hour", Peakhour);
</script>

<style lang="scss" scoped>
</style>
