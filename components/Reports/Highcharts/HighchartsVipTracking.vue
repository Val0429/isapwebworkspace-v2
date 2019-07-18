<template>
    <div class="chart">
        <b-form-group>
            <b-row>
                <b-col>

                    <!-- siteXDay1 -->
                    <highcharts
                        ref="chartSiteXDay1"
                        v-if="mountChart.siteXday1"
                        :options="chartOptions.siteXday1"
                    ></highcharts>

                    <!-- siteXDayX -->
                    <highcharts
                        ref="chartSiteXDayX"
                        v-if="mountChart.siteXdayX"
                        :options="chartOptions.siteXdayX"
                    ></highcharts>

                </b-col>
            </b-row>
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
import Datetime from "@/services/Datetime";
import HighchartsService from "../models/HighchartsService";
import { ISite, ISiteOfficeHourItem, IChartVipTrackingData } from "../";
import { EChartMode, EVipTrackingType } from "../";
import { IChartVipTrackingDetailData } from "../models/IHighCharts";

@Component({
    components: {}
})
export class HighchartsVipTracking extends Vue {
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
    value: IChartVipTrackingData[];

    chartMode: EChartMode = EChartMode.none;

    mountChart: {
        siteXday1: boolean;
        siteXdayX: boolean;
    } = {
        siteXday1: false,
        siteXdayX: false
    };

    chartOptions: {
        siteXday1: any;
        siteXdayX: any;
    } = {
        siteXday1: {},
        siteXdayX: {}
    };

    @Watch("value", { deep: true })
    private onValueChanged(
        newval: IChartVipTrackingData[],
        oldval: IChartVipTrackingData[]
    ) {
        this.start();
    }

    created() {
        this.start();
    }

    mounted() {}

    start() {
        this.chartMode = HighchartsService.chartMode(
            this.startDate,
            this.endDate,
            this.sites
        );

        switch (this.chartMode) {
            case EChartMode.site1Day1:
            case EChartMode.siteXDay1:
                this.initSiteXDay1();
                break;
            case EChartMode.site1DayX:
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
            this.sites,
            this.value
        );
    }

    ////////////////////////// site X day 1 //////////////////////////

    initSiteXDay1() {
        let tempValues: IChartVipTrackingData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempHourStrings: string[] = [];
        let tempCategories: string[] = [];
        let tempSeries: {
            name: string;
            data: number[];
        }[] = [
            { name: "VIP", data: [4, 5, 2] },
            { name: "Blacklist", data: [23, 43, 5] }
        ];

        // get all site office hour
        let weekDay = this.startDate.getDay();
        let tempOfficeHour: ISiteOfficeHourItem = { startHour: 24, endHour: 0 };
        for (let site of this.sites) {
            let officeHour: ISiteOfficeHourItem = HighchartsService.siteOfficeHour(
                weekDay,
                this.sites[0].officeHour
            );
            if (officeHour.startHour < tempOfficeHour.startHour) {
                tempOfficeHour.startHour = officeHour.startHour;
            }
            if (officeHour.endHour > tempOfficeHour.endHour) {
                tempOfficeHour.endHour = officeHour.endHour;
            }
            if (officeHour.startHour >= 23 && officeHour.endHour <= 0) {
                break;
            }
        }

        // get all office hour string list
        for (
            let i = tempOfficeHour.startHour;
            i <= tempOfficeHour.endHour;
            i++
        ) {
            let hourString = i < 10 ? `0${i.toString()}` : i.toString();
            tempHourStrings.push(`${hourString}:00`);
        }

        for (let val of tempValues) {
            // if () {

            // }
        }

        this.chartOptions.siteXday1 = {
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
                    text: this._("w_ReportTraffic_TrafficTraffic"),
                    style: { color: "#000" }
                }
            },
            tooltip: {
                enabled: true,
                useHTML: true,
                backgroundColor: "#333",
                style: { color: "#fff" }
                // formatter: function(tooltip: any) {
                //     let self: any = this;
                //     let result = "";
                //     try {
                //         // let siteStartIndex = self.point.series.name.indexOf(
                //         //     ">__"
                //         // );
                //         // let siteEndIndex = self.point.series.name.indexOf(
                //         //     "__<"
                //         // );
                //         // siteId = self.point.series.name.substring(
                //         //     siteStartIndex + 3,
                //         //     siteEndIndex
                //         // );
                //         // let valueStartIndex = self.x.indexOf(">{");
                //         // let valueEndIndex = self.x.indexOf("}<");
                //         // let valueJson = self.x.substring(
                //         //     valueStartIndex + 1,
                //         //     valueEndIndex + 1
                //         // );
                //         // let newValue: any = JSON.parse(valueJson);
                //     } catch (e) {
                //         console.log(e);
                //     }
                //     return result;
                // }
            },
            series: tempSeries
        };
        this.mountChart.siteXday1 = true;
    }

    ////////////////////////// site X day X //////////////////////////

    initSiteXDayX() {}

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private anysislyChartValueDefault(): IChartVipTrackingData {
        let value: IChartVipTrackingData = {
            type: EVipTrackingType.none,
            date: new Date(),
            personCount: 0,

            // every report
            i18n: this.i18nItem(),
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
        item: IChartVipTrackingData
    ): IChartVipTrackingData {
        let value: IChartVipTrackingData = JSON.parse(JSON.stringify(item));
        value.date = new Date(value.date);

        value.i18n = this.i18nItem();
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

    private i18nItem() {
        let result: any = {
            time: this._("w_Report_Time"),
            date: this._("w_Report_Date"),
            startDate: this._("w_Report_StartDate"),
            endDate: this._("w_Report_EndDate")
        };
        return result;
    }
}

export default HighchartsVipTracking;
Vue.component("highcharts-vip-tracking", HighchartsVipTracking);
</script>

<style lang="scss" scoped>
</style>
