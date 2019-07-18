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

    created() {}

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

    initSiteXDay1() {}

    ////////////////////////// site X day X //////////////////////////

    initSiteXDayX() {}

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private anysislyChartValueDefault(): IChartVipTrackingData {
        let value: IChartVipTrackingData = {
            type: EVipTrackingType.none,
            date: new Date(),

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
