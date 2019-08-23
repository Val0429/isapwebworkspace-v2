<template>
    <div class="animated fadeIn">

        <div class="row">
            <div class="col-lg-1 col-sm-0 col-xs-0 col-xxs-0">
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="ePageType.traffic == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_Traffic")}}</span>
                            <span
                                v-if="eWeather.none != this.weather"
                                v-html="showWeather()"
                                class="weather"
                            ></span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{anlysisData.traffic.total != null ? numberWithCommas(anlysisData.traffic.total) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.traffic.sign ? (eSign.positive == anlysisData.traffic.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.traffic.sign">{{eSign.positive == anlysisData.traffic.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.traffic.value != null ? numberWithCommas(anlysisData.traffic.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.traffic.valueRatio != null ? toPercent(anlysisData.traffic.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="ePageType.averageOccupancy == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_AverageOccupancy")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{anlysisData.averageOccupancy.total != null ? numberWithCommas(anlysisData.averageOccupancy.total) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.averageOccupancy.sign ? (eSign.positive == anlysisData.averageOccupancy.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.averageOccupancy.sign">{{eSign.positive == anlysisData.averageOccupancy.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.averageOccupancy.value != null ? numberWithCommas(anlysisData.averageOccupancy.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.averageOccupancy.valueRatio != null ? toPercent(anlysisData.averageOccupancy.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="ePageType.averageDwellTime == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_AverageDwellTime")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{anlysisData.averageDwellTime.total != null ? numberWithCommas(anlysisData.averageDwellTime.total) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.averageDwellTime.sign ? (eSign.positive == anlysisData.averageDwellTime.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.averageDwellTime.sign">{{eSign.positive == anlysisData.averageDwellTime.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.averageDwellTime.value != null ? numberWithCommas(anlysisData.averageDwellTime.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.averageDwellTime.valueRatio != null ? toPercent(anlysisData.averageDwellTime.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="ePageType.demographic == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_Demographic")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <img src="../../assets/images/men.png">
                                <div :class="eSign.none != anlysisData.demographic.sign ? (eSign.positive == anlysisData.demographic.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.demographic.sign">{{eSign.positive == anlysisData.demographic.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.demographic.value != null ? numberWithCommas(anlysisData.demographic.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.demographic.valueRatio != null ? toPercent(anlysisData.demographic.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <img src="../../assets/images/women.png">
                                <div :class="eSign.none != anlysisData.demographic.sign2 ? (eSign.positive == anlysisData.demographic.sign2 ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.demographic.sign2">{{eSign.positive == anlysisData.demographic.sign2 ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.demographic.value2 != null ? numberWithCommas(anlysisData.demographic.value2): "N/A"}} </span><br>
                                    <span>{{anlysisData.demographic.valueRatio2 != null ? toPercent(anlysisData.demographic.valueRatio2,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box">
                    <div :class="ePageType.vipBlacklist == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_VIPBlacklist")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <img src="../../assets/images/vip.png">
                                <div :class="eSign.none != anlysisData.vipBlacklist.sign ? (eSign.positive == anlysisData.vipBlacklist.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.vipBlacklist.sign">{{eSign.positive == anlysisData.vipBlacklist.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.vipBlacklist.value != null ? numberWithCommas(anlysisData.vipBlacklist.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.vipBlacklist.valueRatio != null ? toPercent(anlysisData.vipBlacklist.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <img src="../../assets/images/stranger.png">
                                <div :class="eSign.none != anlysisData.vipBlacklist.sign2 ? (eSign.positive == anlysisData.vipBlacklist.sign2 ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.vipBlacklist.sign2">{{eSign.positive == anlysisData.vipBlacklist.sign2 ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.vipBlacklist.value2 != null ? numberWithCommas(anlysisData.vipBlacklist.value2) : "N/A"}} </span><br>
                                    <span>{{anlysisData.vipBlacklist.valueRatio2 != null ? toPercent(anlysisData.vipBlacklist.valueRatio2,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-1 col-sm-0 col-xs-0 col-xxs-0">
            </div>
            <!--/col-->
        </div>

        <!-- /row -->

        <div class="row">
            <div class="col-lg-1 col-sm-0 col-xs-0 col-xxs-0">
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div
                    class="box info-box-second"
                    style="border-left: 0px"
                >
                    <div :class="ePageType.repeatCustomer == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_RepeatCustomer")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{anlysisData.repeatVisitor.total != null ? toPercent(anlysisData.repeatVisitor.total) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.repeatVisitor.sign ? (eSign.positive == anlysisData.repeatVisitor.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.repeatVisitor.sign">{{eSign.positive == anlysisData.repeatVisitor.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.repeatVisitor.value != null ? numberWithCommas(anlysisData.repeatVisitor.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.repeatVisitor.valueRatio != null ? toPercent(anlysisData.repeatVisitor.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->
            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-122">
                <div class="box info-box-second">
                    <div :class="ePageType.revenue == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_Revenue")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span :class="eSign.none != anlysisData.revenue.sign ? 'date-sm':'date'">{{anlysisData.revenue.total != null ? numberWithCommas(anlysisData.revenue.total) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.revenue.sign ? (eSign.positive == anlysisData.revenue.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.revenue.sign">{{eSign.positive == anlysisData.revenue.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.revenue.value != null ? numberWithCommas(anlysisData.revenue.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.revenue.valueRatio != null ? toPercent(anlysisData.revenue.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box-second">
                    <div :class="ePageType.transaction == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_Transaction")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{anlysisData.transaction.total != null ? numberWithCommas(anlysisData.transaction.total) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.transaction.sign ? (eSign.positive == anlysisData.transaction.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.transaction.sign">{{eSign.positive == anlysisData.transaction.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.transaction.value != null ? numberWithCommas(anlysisData.transaction.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.transaction.valueRatio != null ? toPercent(anlysisData.transaction.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box-second">
                    <div :class="ePageType.conversion == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_Conversion")}}</span>
                        </div>

                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{anlysisData.conversion.total != null ? toPercent(anlysisData.conversion.total,0) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.conversion.sign ? (eSign.positive == anlysisData.conversion.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.conversion.sign">{{eSign.positive == anlysisData.conversion.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.conversion.value != null ? numberWithCommas(anlysisData.conversion.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.conversion.valueRatio != null ? toPercent(anlysisData.conversion.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-12">
                <div class="box info-box-second">
                    <div :class="ePageType.asp == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_ASP")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{anlysisData.asp.total != null ? numberWithCommas(anlysisData.asp.total) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.asp.sign ? (eSign.positive == anlysisData.asp.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.asp.sign">{{eSign.positive == anlysisData.asp.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.asp.value != null ? numberWithCommas(anlysisData.asp.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.asp.valueRatio != null ? toPercent(anlysisData.asp.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->

            <div class="col-lg-1 col-sm-0 col-xs-0 col-xxs-0">
            </div>
            <!--/col-->
        </div>
        <!-- /row -->
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
import {
    ReportDashboard,
    EPageType,
    ESign,
    ETimeMode
} from "@/components/Reports";
import { EWeather } from "./";
import HighchartsService from "./models/HighchartsService";
import ResponseFilter from "@/services/ResponseFilter";

@Component({
    components: {}
})
export class AnalysisDashboard extends Vue {
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
        type: String,
        default: function() {
            return ETimeMode.none;
        }
    })
    type: ETimeMode;

    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    siteIds: [];

    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    tagIds: [];

    @Prop({
        type: String,
        default: function() {
            return EPageType.none;
        }
    })
    pageType: EPageType;

    @Watch("startDate", { deep: true })
    private watchStartDate(newVal, oldVal) {}
    @Watch("endDate", { deep: true })
    private watchEndDate(newVal, oldVal) {}
    @Watch("type", { deep: true })
    private watchType(newVal, oldVal) {}
    @Watch("siteIds", { deep: true })
    private watchSiteIds(newVal, oldVal) {}
    @Watch("tagIds", { deep: true })
    private watchTagIds(newVal, oldVal) {}
    @Watch("pageType", { deep: true })
    private watchPageType(newVal, oldVal) {}

    weather: EWeather = EWeather.none;
    anlysisData = new ReportDashboard();

    eSign = ESign;
    ePageType = EPageType;
    eWeather = EWeather;

    created() {}

    async mounted() {}

    async initData() {
        const readParam: {
            startDate: Date;
            endDate: Date;
            type: string;
            siteIds: string[];
            tagIds: string[];
        } = {
            startDate: this.startDate,
            endDate: this.endDate,
            type: this.type,
            siteIds: this.siteIds,
            tagIds: this.tagIds
        };

        this.$server
            .C("/report/complex", readParam)
            .then((response: any) => {
                if (response != undefined) {
                    this.anlysisData.pageType = this.pageType;

                    if (response.weather) {
                        this.weather = response.weather.icon;
                    }

                    if (response.peopleCounting) {
                        this.anlysisData.traffic = {
                            sign:
                                response.peopleCounting.variety == null ||
                                response.peopleCounting.variety == 0
                                    ? ESign.none
                                    : response.peopleCounting.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            total: response.peopleCounting.value,
                            valueRatio: response.peopleCounting.variety
                                ? response.peopleCounting.variety /
                                  response.peopleCounting.value
                                : null,
                            value: response.peopleCounting.variety
                        };
                    }
                    if (response.humanDetection) {
                        this.anlysisData.averageOccupancy = {
                            sign:
                                response.humanDetection.variety == null ||
                                response.humanDetection.variety == 0
                                    ? ESign.none
                                    : response.humanDetection.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            total: response.humanDetection.value,
                            valueRatio: response.humanDetection.variety
                                ? response.humanDetection.variety /
                                  response.humanDetection.value
                                : null,
                            value: response.humanDetection.variety
                        };
                    }

                    if (response.averageDwellTime) {
                        this.anlysisData.averageDwellTime = {
                            sign:
                                response.averageDwellTime.variety == null ||
                                response.averageDwellTime.variety == 0
                                    ? ESign.none
                                    : response.averageDwellTime.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            total: response.averageDwellTime.value,
                            valueRatio: response.averageDwellTime.variety
                                ? response.averageDwellTime.variety /
                                  response.averageDwellTime.value
                                : null,
                            value: response.averageDwellTime.variety
                        };
                    }

                    if (response.demographic) {
                        this.anlysisData.demographic = {
                            sign:
                                response.demographic.malePercent == null ||
                                response.demographic.malePercent == 0
                                    ? ESign.none
                                    : response.demographic.maleVariety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            value: response.demographic.maleVariety,
                            valueRatio: response.demographic.malePercent,
                            sign2:
                                response.demographic.femalePercent == null ||
                                response.demographic.femalePercent == 0
                                    ? ESign.none
                                    : response.demographic.femaleVariety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            value2: response.demographic.femaleVariety,
                            valueRatio2: response.demographic.femalePercent
                        };
                    }
                    if (response.vipBlacklist) {
                        this.anlysisData.vipBlacklist = {
                            sign:
                                response.vipBlacklist.vpiPercent == null ||
                                response.vipBlacklist.vpiPercent == 0
                                    ? ESign.none
                                    : response.vipBlacklist.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            value: response.vipBlacklist.vpiVariety,
                            valueRatio: response.vipBlacklist.vpiPercent,
                            sign2:
                                response.vipBlacklist.blacklistPercent ==
                                    null ||
                                response.vipBlacklist.blacklistPercent == 0
                                    ? ESign.none
                                    : response.vipBlacklist.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            value2: response.vipBlacklist.blacklistVariety,
                            valueRatio2: response.vipBlacklist.blacklistPercent
                        };
                    }
                    if (response.repeatVisitor) {
                        this.anlysisData.repeatVisitor = {
                            sign:
                                response.repeatVisitor.variety == null ||
                                response.repeatVisitor.variety == 0
                                    ? ESign.none
                                    : response.repeatVisitor.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            total: response.repeatVisitor.value,
                            valueRatio: response.repeatVisitor.variety
                                ? response.repeatVisitor.variety /
                                  response.repeatVisitor.value
                                : null,
                            value: response.repeatVisitor.variety
                        };
                    }
                    if (response.revenue) {
                        this.anlysisData.revenue = {
                            sign:
                                response.revenue.variety == null ||
                                response.revenue.variety == 0
                                    ? ESign.none
                                    : response.revenue.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            total: response.revenue.value,
                            valueRatio: response.revenue.variety
                                ? response.revenue.variety /
                                  response.revenue.value
                                : null,
                            value: response.revenue.variety
                        };
                    }
                    if (response.transaction) {
                        this.anlysisData.transaction = {
                            sign:
                                response.transaction.variety == null ||
                                response.transaction.variety == 0
                                    ? ESign.none
                                    : response.transaction.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            total: response.transaction.value,
                            valueRatio: response.transaction.variety
                                ? response.transaction.variety /
                                  response.transaction.value
                                : null,
                            value: response.transaction.variety
                        };
                    }
                    if (response.conversion) {
                        this.anlysisData.conversion = {
                            sign:
                                response.conversion.variety == null ||
                                response.conversion.variety == 0
                                    ? ESign.none
                                    : response.conversion.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            total: response.conversion.value,
                            valueRatio: response.conversion.variety
                                ? response.conversion.variety /
                                  response.conversion.value
                                : null,
                            value: response.conversion.variety
                        };
                    }
                    if (response.asp) {
                        this.anlysisData.asp = {
                            sign:
                                response.asp.variety == null ||
                                response.asp.variety == 0
                                    ? ESign.none
                                    : response.asp.variety > 0
                                    ? ESign.positive
                                    : ESign.negative,
                            total: response.asp.value,
                            valueRatio: response.asp.variety
                                ? response.asp.variety / response.asp.value
                                : null,
                            value: response.asp.variety
                        };
                    }
                }
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    numberWithCommas(number) {
        return Math.abs(number)
            .toFixed(0)
            .toString()
            .replace(/\B(?=(\d{3})+\b)/g, ",");
    }

    toPercent(point, fixed) {
        var str = Number(Math.abs(point) * 100).toFixed(fixed);
        str += "%";
        return str;
    }

    showWeather() {
        let result;
        let style = "font-size:1.1rem; color:#924da3";
        switch (this.weather as any) {
            case "day-sunny":
                result = `<i class="wi wi-day-sunny" style="${style}"></i>`;
                break;

            case "night-clear":
                result = `<i class="wi wi-night-clear" style="${style}"></i>`;
                break;

            case "rain":
                result = `<i class="wi wi-rain" style="${style}"></i>`;
                break;

            case "snow":
                result = `<i class="wi wi-snow" style="${style}"></i>`;
                break;

            case "sleet":
                result = `<i class="wi wi-sleet" style="${style}"></i>`;
                break;

            case "strong-wind":
                result = `<i class="wi wi-strong-wind" style="${style}"></i>`;
                break;

            case "fog":
                result = `<i class="wi wi-fog" style="${style}"></i>`;
                break;

            case "cloudy":
                result = `<i class="wi wi-cloudy" style="${style}"></i>`;
                break;

            case "day-cloudy":
                result = `<i class="wi wi-day-cloudy" style="${style}"></i>`;
                break;

            case "night-alt-cloudy":
                result = `<i class="wi wi-night-alt-cloudy" style="${style}"></i>`;
                break;

            case "":
            default:
                result = `<i class="fa fa-question" style="${style}"></i>`;
                break;
        }
        return result;
    }
}

export default AnalysisDashboard;
Vue.component("anlysis-dashboard", AnalysisDashboard);
</script>

<style lang="scss" scoped>
.info-box {
    border: 0px solid #dbdee0;
    margin: 0 0 30px 0;

    .backgroundColor {
        padding: 10px;
        background: #efefef;
        color: black;
        height: 120px;
        border-radius: 10px;
    }
}

.info-box-second {
    border-left: 1px solid #4d5256;
    margin: 0 0 30px 0;

    .backgroundColor {
        padding: 10px;
        color: black;
        height: 120px;
    }
}

.backgroundColor.selected {
    background: #4d5256;
    color: white;
}

.clearfix {
    padding: 10px;

    .title {
        float: left;
        font-weight: bold;
        font-size: 12px;
        margin: 0;
        padding: 0;
    }

    .weather {
        float: right;
        font-weight: bold;
        font-size: 12px;
        margin: 0;
        padding: 0;
    }

    .date {
        float: left;
        font-weight: bold;
        font-size: 36px;
        margin-top: -8px;
        padding: 0;
    }

    .date-sm {
        float: left;
        font-weight: bold;
        font-size: 26px;
        margin-top: -8px;
        padding-top: 6px;
    }

    .ratio {
        float: right;
        font-weight: bold;
        font-size: 12px;
        margin: 0;
        padding: 0;
    }

    .red {
        color: #ff4326;
    }
    .green {
        color: #55c250;
    }
}
</style>
