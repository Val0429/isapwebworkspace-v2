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
                            <span v-if="eWeather.none != this.weather" v-html="showWeather()" class="weather"></span>
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
                                    <span>{{anlysisData.demographic.value2 != null ? numberWithCommas(anlysisData.demographic.value2) : "N/A"}} </span><br>
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
                <div class="box info-box">
                    <div :class="ePageType.repeatCustomer == anlysisData.pageType ?  'backgroundColor selected':'backgroundColor'">
                        <div class="clearfix">
                            <span class="title">{{_("w_ReportDashboard_RepeatCustomer")}}</span>
                        </div>
                        <div class="row clearfix">
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <span class="date">{{anlysisData.repeatCustomer.total != null ? toPercent(anlysisData.repeatCustomer.total) : "N/A"}}</span>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-xs-6 col-xxs-12">
                                <div :class="eSign.none != anlysisData.repeatCustomer.sign ? (eSign.positive == anlysisData.repeatCustomer.sign ?  'ratio green':'ratio red') : 'ratio'">
                                    <span v-if="eSign.none != anlysisData.repeatCustomer.sign">{{eSign.positive == anlysisData.repeatCustomer.sign ? '▲':'▼'}}</span>
                                    <span>{{anlysisData.repeatCustomer.value != null ? numberWithCommas(anlysisData.repeatCustomer.value) : "N/A"}} </span><br>
                                    <span>{{anlysisData.repeatCustomer.valueRatio != null ? toPercent(anlysisData.repeatCustomer.valueRatio,1) : "N/A"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--/col-->
            <div class="col-lg-2 col-sm-6 col-xs-6 col-xxs-122">
                <div class="box info-box">
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
                <div class="box info-box">
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
                <div class="box info-box">
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
                <div class="box info-box">
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
import { Vue, Component, Prop, Emit, Model,Watch } from "vue-property-decorator";
import { ReportDashboard, EPageType, ESign,ETimeMode } from "@/components/Reports";
import { EWeather } from "./models/EHighCharts";
import HighChartsService from "./models/HighChartsService";
import ResponseFilter from "@/services/ResponseFilter";

@Component({
    components: {}
})
export class AnlysisDashboard extends Vue {
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
    private watchStartDate(newVal, oldVal) {
        console.log('startDate',this.startDate);
    }
   @Watch("endDate", { deep: true })
    private watchEndDate(newVal, oldVal) {
        console.log('endDate',this.endDate);
    }
       @Watch("type", { deep: true })
    private watchType(newVal, oldVal) {
        console.log('type',this.type);
    }
   @Watch("siteIds", { deep: true })
    private watchSiteIds(newVal, oldVal) {
        console.log('siteIds',this.siteIds);
    }
   @Watch("tagIds", { deep: true })
    private watchTagIds(newVal, oldVal) {
        console.log('tagIds',this.tagIds);
    }
   @Watch("pageType", { deep: true })
    private watchPageType(newVal, oldVal) {
        console.log('pageType',this.pageType);
    }

    
    weather: EWeather = EWeather.none;
    anlysisData = new ReportDashboard();

    eSign = ESign;
    ePageType = EPageType;
    eWeather = EWeather;
    
    created() {}

    async mounted() {
    }

    async initData(){
        const readParam: {
            startDate: Date,
            endDate: Date,
            type:string,
            siteIds: string[],
            tagIds: string[]
        } = {
            startDate: this.startDate,
            endDate: this.endDate,
            type: this.type,
            siteIds: this.siteIds,
            tagIds: this.tagIds
        };
        
          await this.$server.C("/report/complex", readParam)
            .then((response: any) => {
                if (response != undefined) {
                    this.anlysisData.pageType= this.pageType;

                    if(response.weather){
                          this.weather = response.weather.icon;
                    }

                        if(response.peopleCounting){
                          this.anlysisData.traffic = {
                            sign: response.peopleCounting.variety == null ? ESign.none : (response.peopleCounting.variety > 0 ? ESign.positive : ESign.negative) ,
                            total:response.peopleCounting.value,
                            value:  response.peopleCounting.variety ? response.peopleCounting.value * response.peopleCounting.variety : null,
                            valueRatio: response.peopleCounting.variety
                        }
                          }
                        if(response.averageOccupancy){
                            this.anlysisData.averageOccupancy = {
                            sign: response.averageOccupancy.variety == null ? ESign.none : (response.averageOccupancy.variety > 0 ? ESign.positive : ESign.negative) ,
                            total: response.averageOccupancy.value,
                            value: response.averageOccupancy.variety ? response.averageOccupancy.value * response.averageOccupancy.variety : null,
                            valueRatio: response.averageOccupancy.variety
                            }
                        }
                        
                          if(response.averageDwellTime){
                          this.anlysisData.averageDwellTime= {
                         sign: response.averageDwellTime.variety  == null ? ESign.none : (response.averageDwellTime.variety > 0 ? ESign.positive : ESign.negative) ,
                            total: response.averageDwellTime.value,
                            value: response.averageDwellTime.variety ? response.averageDwellTime.value * response.averageDwellTime.variety : null,
                            valueRatio: response.averageDwellTime.variety
                        }
                         }

                              if(response.demographic){
                          this.anlysisData.demographic= {
                                sign: response.demographic.maleVariety  == null ? ESign.none : (response.demographic.maleVariety > 0 ? ESign.positive : ESign.negative) ,
                            value:  response.demographic.maleVariety,
                            valueRatio:  response.demographic.malePercent,
                            sign2: response.demographic.femaleVariety  == null ? ESign.none : (response.demographic.femaleVariety > 0 ? ESign.positive : ESign.negative) ,
                            value2: response.demographic.femaleVariety,
                            valueRatio2:   response.demographic.femalePercent
                        }
                              }
                                if(response.vipBlacklist){
                            this.anlysisData.vipBlacklist= {
                                sign: response.vipBlacklist.variety  == null ? ESign.none : (response.vipBlacklist.variety > 0 ? ESign.positive : ESign.negative) ,
                              value: response.vipBlacklist.vpiVariety,
                              valueRatio:  response.vipBlacklist.vpiPercent,
                             sign2: response.vipBlacklist.variety  == null ? ESign.none : (response.vipBlacklist.variety > 0 ? ESign.positive : ESign.negative) ,
                              value2: response.vipBlacklist.blacklistVariety,
                              valueRatio2: response.vipBlacklist.blacklistPercent
                          } }
                             if(response.repeatCustomer){
                            this.anlysisData.repeatCustomer= {
                              sign: response.repeatCustomer.variety  == null ? ESign.none : (response.repeatCustomer.variety > 0 ? ESign.positive : ESign.negative) ,
                              total: response.repeatCustomer.value,
                               value: response.repeatCustomer.variety ? response.repeatCustomer.value * response.repeatCustomer.variety : null,
                              valueRatio: response.repeatCustomer.variety
                          }}
                             if(response.revenue){
                          this.anlysisData.revenue= {
                              sign: response.revenue.variety  == null ? ESign.none : (response.revenue.variety > 0 ? ESign.positive : ESign.negative) ,
                            total:  response.revenue.value,
                            value:   response.revenue.variety ? response.revenue.value * response.revenue.variety : null,
                            valueRatio: response.revenue.variety
                                }}
                             if(response.transaction){
                          this.anlysisData.transaction= {
                                sign: response.transaction.variety  == null ? ESign.none : (response.transaction.variety > 0 ? ESign.positive : ESign.negative) ,
                            total: response.transaction.value,
                            value: response.transaction.variety ? response.transaction.value * response.transaction.variety : null,
                            valueRatio: response.transaction.variety
                             }}
                             if(response.conversion){
                          this.anlysisData.conversion= {
                               sign: response.conversion.variety  == null ? ESign.none : (response.conversion.variety > 0 ? ESign.positive : ESign.negative) ,
                            total:  response.conversion.value,
                               value: response.conversion.variety ? response.conversion.value * response.conversion.variety : null,
                            valueRatio: response.conversion.variety
                              }}
                             if(response.asp){
                          this.anlysisData.asp = {
                                 sign: response.asp.variety  == null ? ESign.none : (response.asp.variety > 0 ? ESign.positive : ESign.negative) ,
                            total: response.asp.value,
                                 value: response.asp.variety ? response.asp.value * response.asp.variety : null,
                            valueRatio: response.asp.variety
                         }
                    }
                }
                
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });
    }

    numberWithCommas(number) {
        return Math.abs(number).toFixed(0).toString().replace(/\B(?=(\d{3})+\b)/g, ",");
    }

    toPercent(point, fixed) {
        var str = Number(Math.abs(point) * 100).toFixed(fixed);
        str += "%";
        return str;
    }

    showWeather(){
        let result = HighChartsService.weatherIcon(this.weather);
        return result;
    }
        
    
}

export default AnlysisDashboard;
Vue.component("anlysis-dashboard", AnlysisDashboard);
</script>

<style lang="scss" scoped>
.info-box {
    border: 1px solid #dbdee0;
    margin: 0 0 30px 0;

    .clearfix {
        padding: 10px;
    }

    .backgroundColor {
        padding: 10px;
        background: #f9f9f9;
        color: black;
        height: 120px;

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
            color: #e26929;
        }
        .green {
            color: #1bbc9b;
        }
    }

    .backgroundColor.selected {
        background: #4e93b7;
        color: white;
    }
}
</style>
