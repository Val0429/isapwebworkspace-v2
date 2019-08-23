<template>
    <div>
        <iv-card :label="_('w_Dashboard_Top5sites')">
            <h5 class="mb-3">{{ mode.modeTitle }}</h5>

            <highcharts
                ref="highcharts"
                :options="chartOptions"
            ></highcharts>

            <b-row>
                <select-device-type
                    class="col-md-6"
                    :modeParam="mode"
                    @mode="receiveMode"
                ></select-device-type>
                <select-time
                    class="col-md-6"
                    :timeParam="time"
                    @time="receiveTime"
                ></select-time>
            </b-row>

        </iv-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";

/// install Highcharts
import Highcharts from "highcharts";
import HighchartsVue from "highcharts-vue";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
Vue.use(HighchartsVue);

import { EMode } from "@/components/Dashboard/index";

@Component({
    components: {}
})
export class Top5sites extends Vue {
    // Prop
    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: ""
    })
    label: string;

    chartOptions: any = {};

    time: any = {
        startDate: new Date(),
        endDate: new Date()
    };

    mode: any = {
        type: "",
        modeTitle: ""
    };

    created() {
        this.initCharts();
        this.initData();
    }

    mounted() {}

    initData() {
        this.mode = {
            type: EMode.peopleCounting,
            modeTitle: this._("w_Navigation_RuleAndActions_Traffic")
        };

        this.time = {
            // TODO: wait api
            startDate: Datetime.DateToZero(new Date()),
            endDate: Datetime.DateToZero(new Date())

            // startDate: Datetime.DateToZero(new Date(Datetime.ThisYearStartDate())),
            // endDate: Datetime.DateToZero(new Date(Datetime.ThisYearEndDate()))
        };
    }

    initCharts() {
        // 整理 xAxis（y軸）的 site
        let tempCategories: string[] = [];
        let tempData: number[] = [];
        let tempName: string = "";

        if (this.mode.type === EMode.dwellTime) {
            tempName = this._("w_Dashboard_Minutes");
        } else {
            tempName = this._("w_ReportCampaign_Traffic");
        }

        this.chartOptions = {
            chart: { type: "bar" },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            xAxis: {
                categories: ["Africa", "America", "Asia", "Europe", "Oceania"],
                title: null
            },
            yAxis: {
                title: null,
                labels: false
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    name: tempName,
                    data: [107, 31, 635, 203, 2]
                }
            ]
        };
    }

    async receiveTime(time: object) {
        this.time = time;
        let timeParam = JSON.parse(JSON.stringify(this.time));

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

    async receiveMode(mode: object) {
        this.mode = mode;

        // TODO: wait api
        // Loading.show();
        // await this.$server
        //     .C("/", this.time)
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

        this.initCharts();
    }
}

export default Top5sites;
Vue.component("top-5sites", Top5sites);
</script>

<style lang="scss" scoped>
</style>
