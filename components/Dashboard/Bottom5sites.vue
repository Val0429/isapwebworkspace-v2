import {EMode} from "@/components/Dashboard/models/EDashboard";
<template>
    <div>
        <iv-card
            :label="_('w_Dashboard_Bottom5sites')"
            :data="{ 'header-bg-variant': 'transparent', 'hide-collapse-button': true, 'border-variant': 'white' }"
            class="font-3xl"
        >
            <template #toolbox>
                <iv-toolbox-dashboard-refresh variant="white">
                    <iv-toolbox-dashboard-traffic
                        :iconDisabled="currentDevice.isTraffic"
                        @click="changeDevice('isTraffic')"
                    />
                    <iv-toolbox-dashboard-dwelltime
                        :iconDisabled="currentDevice.isDwellTime"
                        @click="changeDevice('isDwellTime')"
                    />
                    <iv-toolbox-dashboard-vip
                        :iconDisabled="currentDevice.isVip"
                        @click="changeDevice('isVip')"
                    />
                    <iv-toolbox-dashboard-blacklist
                        :iconDisabled="currentDevice.isBlacklist"
                        @click="changeDevice('isBlacklist')"
                    />
                    <iv-toolbox-dashboard-repeatcustomer
                        :iconDisabled="currentDevice.isRepeatCustomer"
                        @click="changeDevice('isRepeatCustomer')"
                    />
                </iv-toolbox-dashboard-refresh>
            </template>

            <h5 class="mb-3 font-weight-bold">{{ modeParam.modeTitle }}</h5>

            <highcharts
                ref="highcharts"
                :options="chartOptions"
            ></highcharts>


            <select-time
                :timeParam="timeParam"
                @updateTime="receiveTime"
            ></select-time>

        </iv-card>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    /// install Highcharts
    import HighchartsVue from "highcharts-vue";
    import Datetime from "@/services/Datetime";
    import {EMode} from "@/components/Dashboard/index";

    Vue.use(HighchartsVue);

    @Component({
        components: {}
    })
    export class Bottom5sites extends Vue {
        chartOptions: any = {};

        timeParam: any = {
            startDate: new Date(),
            endDate: new Date()
        };

        modeParam: any = {
            type: "",
            modeTitle: ""
        };

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

        created() {
            this.initCharts();
            this.initData();
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

        changeDevice(type) {
            for (let status of Object.keys(this.currentDevice)) {
                this.currentDevice[status] = false;
            }
            this.currentDevice[type] = !this.currentDevice[type];

            if (this.currentDevice.isDwellTime) {
                this.modeParam.type = EMode.dwellTime;
                this.modeParam.modeTitle = this._("w_Dashboard_Minutes")
            } else {
                this.modeParam.type = EMode.peopleCounting;
                this.modeParam.modeTitle = this._("w_Navigation_RuleAndActions_Traffic")
            }

            this.initCharts();
        }

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
                colors:['#FD6893'],
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

    export default Bottom5sites;
    Vue.component("bottom-5sites", Bottom5sites);
</script>

<style lang="scss" scoped>
</style>
