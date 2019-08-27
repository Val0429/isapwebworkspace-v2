<template>
    <div>
        <iv-card :label="_('w_Dashboard_PeakHour')">
            <apexchart
                type=heatmap
                height=550
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

    radioName: string = 'Peakhour';

    chartOptions: any = {};
    series: any = [];

    created() {
        this.initData();
    }

    mounted() {
        this.initCharts();
    }

    initData() {
        this.timeParam = {
            // TODO: wait api
            startDate: Datetime.DateToZero(new Date()),
            endDate: Datetime.DateToZero(new Date())

            // startDate: Datetime.DateToZero(new Date(Datetime.ThisYearStartDate())),
            // endDate: Datetime.DateToZero(new Date(Datetime.ThisYearEndDate()))
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
        var i = 0;
        var series = [];
        while (i < count) {
            var x = "w" + (i + 1).toString();
            var y =
                Math.floor(Math.random() * (yRange.max - yRange.min + 1)) +
                yRange.min;
            series.push({ x: x, y: y });
            i++;
        }
        return series;
    }

    initCharts() {
        // TODO: Wait API
        this.series = [
            {
                name: "5pm",
                data: this.developData(7, { min: -30, max: 55 })
            },
            {
                name: "4pm",
                data: this.developData(7, { min: -30, max: 55 })
            },
            {
                name: "3pm",
                data: this.developData(7, { min: -30, max: 55 })
            },
            {
                name: "2pm",
                data: this.developData(7, { min: -30, max: 55 })
            },
            {
                name: "1pm",
                data: this.developData(7, { min: -30, max: 55 })
            },
            {
                name: "12am",
                data: this.developData(7, { min: -30, max: 55 })
            },
            {
                name: "11am",
                data: this.developData(7, { min: -30, max: 55 })
            },
            {
                name: "10am",
                data: this.developData(7, { min: -30, max: 55 })
            },
            {
                name: "9am",
                data: this.developData(7, { min: -30, max: 55 })
            }
        ];

        // TODO: Wait API
        this.chartOptions = {
            title: { text: "" },
            chart: { toolbar: { show: false } },
            dataLabels: { enabled: false },
            plotOptions: {
                heatmap: {
                    shadeIntensity: 0.5,
                    colorScale: {
                        ranges: [
                            {
                                from: -30,
                                to: 5,
                                name: "Low",
                                color: "#F4F6F8"
                            },
                            {
                                from: 6,
                                to: 20,
                                name: "Medium",
                                color: "#D8E7F8"
                            },
                            {
                                from: 21,
                                to: 45,
                                name: "High",
                                color: "#B9CAFC"
                            },
                            {
                                from: 46,
                                to: 55,
                                name: "Strong",
                                color: "#5780F8"
                            },
                            {
                                from: 56,
                                to: 1000,
                                name: "Extreme",
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
