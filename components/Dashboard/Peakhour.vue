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
                :options="chartOptions"
                :series="series"
            />
            <select-permission-site
                @siteIds="receiveSiteIds"
                :radioName="radioName"
            ></select-permission-site>
            <select-time
                :timeParam="timeParam"
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
Vue.component("apexchart", VueApexCharts);

@Component({
    components: { apexchart: VueApexCharts }
})
export class Peakhour extends Vue {
    timeParam: any = {
        startDate: new Date(),
        endDate: new Date()
    };

    radioName: string = "Peakhour";

    chartOptions: any = {};
    series: any = [];

    chartItem = {
        height: 480
    };

    created() {
        this.initData();
    }

    mounted() {
        this.initCharts();
    }

    initData() {
        this.timeParam = {
            // TODO: wait api
            startDate: Datetime.DateStart(new Date()),
            endDate: Datetime.DateStart(new Date())

            // startDate: Datetime.DateStart(new Date(Datetime.ThisYearStartDate())),
            // endDate: Datetime.DateStart(new Date(Datetime.ThisYearEndDate()))
        };
    }

    receiveSiteIds(siteIds: object) {
        console.log("siteIds ~ ", siteIds);
    }

    async receiveTime(time: object) {
        this.timeParam = time;
        let timeParam = JSON.parse(JSON.stringify(this.timeParam));

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

    initCharts() {
        this.series = [];
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

            this.series.push({
                name: name,
                data: this.developData(7, { min: -30, max: 55 })
            });
        }

        // TODO: Wait API
        this.chartOptions = {
            title: { text: "" },
            chart: { toolbar: { show: false } },
            dataLabels: { enabled: false },
            legend: { show: true },
            plotOptions: {
                heatmap: {
                    shadeIntensity: 0.5,
                    colorScale: {
                        ranges: [
                            {
                                from: -10000,
                                to: -1,
                                name: "",
                                color: "#ececec"
                            },
                            {
                                from: 0,
                                to: 5,
                                name: "",
                                color: "#F4F6F8"
                            },
                            {
                                from: 6,
                                to: 20,
                                name: "",
                                color: "#D8E7F8"
                            },
                            {
                                from: 21,
                                to: 45,
                                name: "",
                                color: "#B9CAFC"
                            },
                            {
                                from: 46,
                                to: 55,
                                name: "",
                                color: "#5780F8"
                            },
                            {
                                from: 56,
                                to: 1000,
                                name: "",
                                color: "#265BF6"
                            }
                        ]
                    }
                }
            }
        };
    }
}

export default Peakhour;
Vue.component("peak-hour", Peakhour);
</script>

<style lang="scss" scoped>
</style>
