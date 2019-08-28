<template>
    <div>
        <iv-card
            :label="_('w_Dashboard_Top5sites')"
            :data="{ 'header-bg-variant': 'transparent', 'hide-collapse-button': true, 'border-variant': 'white' }"
        >
            <template #toolbox>
                <iv-toolbox-more variant="white">
                    <iv-toolbox-dashboard-traffic
                        :disabled="isClick.isClickTraffic"
                        :iconDisabled="currentDevice.isTraffic"
                        @click="clickTraffic()"
                    />
                    <iv-toolbox-dashboard-dwelltime
                        :disabled="isClick.isClickDwellTime"
                        :iconDisabled="currentDevice.isDwellTime"
                        @click="clickDwellTime()"
                    />
                    <iv-toolbox-dashboard-vip
                        :disabled="isClick.isClickVip"
                        :iconDisabled="currentDevice.isVip"
                        @click="clickVip()"
                    />
                    <iv-toolbox-dashboard-blacklist
                        :disabled="isClick.isClickBlacklist"
                        :iconDisabled="currentDevice.isBlacklist"
                        @click="currentDevice.isBlacklist = !currentDevice.isBlacklist"
                    />
                    <iv-toolbox-dashboard-repeatcustomer
                        :disabled="isClick.isClickRepeatCustomer"
                        :iconDisabled="currentDevice.isRepeatCustomer"
                        @click="currentDevice.isRepeatCustomer = !currentDevice.isRepeatCustomer"
                    />
                </iv-toolbox-more>
            </template>

            <h5 class="mb-3">{{ modeParam.modeTitle }}</h5>

            <highcharts
                ref="highcharts"
                :options="chartOptions"
            ></highcharts>

            <b-row>
                <select-device-type
                    class="col-md-6"
                    :modeParam="modeParam"
                    @mode="receiveMode"
                ></select-device-type>
                <select-time
                    class="col-md-6"
                    :timeParam="timeParam"
                    @updateTime="receiveTime"
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
    chartOptions: any = {};

    timeParam: any = {
        startDate: new Date(),
        endDate: new Date()
    };

    modeParam: any = {
        type: "",
        modeTitle: ""
    };

    eDeviceMode = EMode;

    currentDevice: {
        isTraffic: boolean;
        isDwellTime: boolean;
        isVip: boolean;
        isBlacklist: boolean;
        isRepeatCustomer: boolean;
    } = {
        isTraffic: true,
        isDwellTime: false,
        isVip: false,
        isBlacklist: false,
        isRepeatCustomer: false
    };

    isClick: {
        isClickTraffic: boolean;
        isClickDwellTime: boolean;
        isClickVip: boolean;
        isClickBlacklist: boolean;
        isClickRepeatCustomer: boolean;
    } = {
        isClickTraffic: false,
        isClickDwellTime: true,
        isClickVip: true,
        isClickBlacklist: true,
        isClickRepeatCustomer: true
    };

    created() {
        this.initCharts();
        this.initData();
        console.log('isClick ~ ', this.isClick)
    }

    mounted() {}

    initData() {
        this.modeParam = {
            type: EMode.peopleCounting,
            modeTitle: this._("w_Navigation_RuleAndActions_Traffic")
        };

        this.timeParam = {
            // TODO: wait api
            startDate: Datetime.DateToZero(new Date()),
            endDate: Datetime.DateToZero(new Date())

            // startDate: Datetime.DateToZero(new Date(Datetime.ThisYearStartDate())),
            // endDate: Datetime.DateToZero(new Date(Datetime.ThisYearEndDate()))
        };
    }

    clickTraffic() {
        this.currentDevice.isTraffic = !this.currentDevice.isTraffic;

        if (this.currentDevice.isTraffic) {
            this.isClick = {
                isClickTraffic: false,
                isClickDwellTime: true,
                isClickVip: true,
                isClickBlacklist: true,
                isClickRepeatCustomer: true
            };
        } else {
            this.isClick = {
                isClickTraffic: false,
                isClickDwellTime: false,
                isClickVip: false,
                isClickBlacklist: false,
                isClickRepeatCustomer: false
            };
        }
        console.log("this.isClick ~ ", this.isClick);
    }

    clickDwellTime() {
        this.currentDevice.isDwellTime = !this.currentDevice.isDwellTime;
        if (this.currentDevice.isDwellTime) {
            this.isClick = {
                isClickTraffic: true,
                isClickDwellTime: false,
                isClickVip: true,
                isClickBlacklist: true,
                isClickRepeatCustomer: true
            };
        } else {
            this.isClick = {
                isClickTraffic: false,
                isClickDwellTime: false,
                isClickVip: false,
                isClickBlacklist: false,
                isClickRepeatCustomer: false
            };
        }
        console.log("this.isClick ~ ", this.isClick);
    }

    clickVip() {
        this.currentDevice.isVip = !this.currentDevice.isVip;
        if (this.currentDevice.isVip) {
            this.isClick = {
                isClickTraffic: true,
                isClickDwellTime: true,
                isClickVip: false,
                isClickBlacklist: true,
                isClickRepeatCustomer: true
            };
        } else {
            this.isClick = {
                isClickTraffic: false,
                isClickDwellTime: false,
                isClickVip: false,
                isClickBlacklist: false,
                isClickRepeatCustomer: false
            };
        }
        console.log("this.isClick ~ ", this.isClick);
    }

    updateDevice(deviceMode: EMode) {}

    initCharts() {
        // 整理 xAxis（y軸）的 site
        let tempCategories: string[] = [];
        let tempData: number[] = [];
        let tempName: string = "";

        if (this.modeParam.type === EMode.dwellTime) {
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

    async receiveMode(mode: object) {
        this.modeParam = mode;

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
