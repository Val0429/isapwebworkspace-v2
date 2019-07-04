<template>
    <div class="animated fadeIn">
        <title>Peak hours</title>
        <table
            class="table table-bordered"
        >
            <thead>
                <tr>
                    <th>
                        <b-form-select
                            v-if="dayXSiteX == eDayXSiteX.siteXDayX"
                            v-model="site"
                            :options="siteItems"
                            @change="changeSite()"
                        ></b-form-select>
                    </th>
                    <th v-for="(item, key, index) in pData.head">
                        {{item + ":00"}} - {{(item + 1) + ":00"}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(items, key, index) in pData.body">
                    <td v-if="dayXSiteX != eDayXSiteX.siteXDay1"> {{(new Date(items.title)).getFullYear() + "/" + ((new Date(items.title)).getUTCMonth() + 1) + "/" + (new Date(items.title)).getUTCDate() + " " + showWeek((new Date(items.title)).getDay())}}</td>
                    <td v-if="dayXSiteX == eDayXSiteX.siteXDay1"> {{items.title}}</td>
                    <td
                        v-for="(item, key, index) in items.context"
                        :class="showHoursRange(item.value)"
                    ></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script lang="ts">
import {
    Vue,
    Component,
    Prop,
    Emit,
    Watch,
    Model
} from "vue-property-decorator";
import { IPeckTimeRange,IPeckTimeRangeBody, EChartMode, ISiteItems } from "@/components/Reports";
import Datetime from "@/services/Datetime.vue";
import HighChartsService from "./models/HighChartsService";

@Component({
    components: {}
})
export class PeakTimeRange extends Vue {
    // Prop
    @Prop({
        type: String,
        default: function() {
            return EChartMode.none;
        }
    })
    dayXSiteX: EChartMode;

    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    siteItems: ISiteItems[];

    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    timeRangeData: IPeckTimeRange[];

    @Watch("timeRangeData", { deep: true })
    private timeRangeDataChanged(newVal, oldVal) {
        this.initData();
    }

    eDayXSiteX = EChartMode;

    pData: IPeckTimeRange = {
        site: "",
        head: [],
        body: []
    };

    site = "iVTCTzctbF";

    created() {}

    mounted() {
        this.initData();
    }

    initData() {
        switch (this.dayXSiteX) {
            case EChartMode.site1Day1:
                this.generateDay1Ste1();
                break;
            case EChartMode.site1DayX:
                this.generateDayXSte1();
                break;
            case EChartMode.siteXDay1:
                this.generateDay1SteX();
                break;
            case EChartMode.siteXDayX:
                this.generateDayXSteX();
                break;
            default:
                break;
        }
    }

    generateDay1Ste1() {
        console.log("generateDay1Ste1", this.timeRangeData);
        
        if(!this.timeRangeData){
            return;
        }


        this.pData = {
            site: "",
            head: [],
            body: []
        };

        //site
        this.pData.site = this.timeRangeData[0].site ;

        //haed
        let sTime = null;
        let eTime = null;
        for(let officeHourItem of this.siteItems[0].officeHour){
            if(sTime == null || sTime > new Date(officeHourItem.startDate).getUTCHours()){
                sTime = new Date(officeHourItem.startDate).getUTCHours();
            }
            if(eTime == null || eTime < new Date(officeHourItem.endDate).getUTCHours()){
                eTime = new Date(officeHourItem.endDate).getUTCHours();
            }
        }   
      this.pData.head = [];
       while(sTime <= eTime){
            this.pData.head.push(sTime);
            sTime++
       }

 
        //body
        for(let bodyItme of this.timeRangeData[0].body){
            let contexts = [];
            for(let headItem of this.pData.head){
                let context = {
                        time: "",
                        value: 0
                }
                for(let contextItem of bodyItme.context){
                    if(headItem == new Date(contextItem.time).getUTCHours()){
                         context = {
                            time: contextItem.time,
                            value: contextItem.value
                        }
                        break;
                    }
                }
                contexts.push(context);
            }

             let thisBody:IPeckTimeRangeBody = {
                title: bodyItme.title,
                context: contexts
             }
             this.pData.body.push(thisBody);
        }   
        
     
    }

    generateDayXSte1() {
        console.log("generateDayXSte1", this.timeRangeData);

        if(!this.timeRangeData){
            return;
        }

        this.pData = {
            site: "",
            head: [],
            body: []
        };
        
        for (let timeRangeDataItem of this.timeRangeData) {
            if (timeRangeDataItem.site == this.site) {
                //site
                this.pData.site = timeRangeDataItem.site;

             
                //haed
                let sTime = null;
                let eTime = null;
                for(let officeHourItem of this.siteItems[0].officeHour){
                    if(sTime == null || sTime > new Date(officeHourItem.startDate).getUTCHours()){
                        sTime = new Date(officeHourItem.startDate).getUTCHours();
                    }
                    if(eTime == null || eTime < new Date(officeHourItem.endDate).getUTCHours()){
                        eTime = new Date(officeHourItem.endDate).getUTCHours();
                    }
                }   
                
                 this.pData.head = [];
                 while(sTime <= eTime){
                      this.pData.head.push(sTime);
                      sTime++
                 }

                 //body
                for(let bodyItme of timeRangeDataItem.body){
                    let contexts = [];
                    for(let headItem of this.pData.head){
                        let context = {
                                time: "",
                                value: 0
                        }
                        for(let contextItem of bodyItme.context){
                            if(headItem == new Date(contextItem.time).getUTCHours()){
                                 context = {
                                    time: contextItem.time,
                                    value: contextItem.value
                                }
                                break;
                            }
                        }
                        contexts.push(context);
                    }

                     let thisBody:IPeckTimeRangeBody = {
                        title: bodyItme.title,
                        context: contexts
                     }
                     this.pData.body.push(thisBody);
                }   
            }
        }
    }

    generateDay1SteX() {
        console.log("generateDay1SteX", this.timeRangeData);
        
        if(!this.timeRangeData){
            return;
        }

        this.pData = {
            site: "",
            head: [],
            body: []
        };
        for (let timeRangeDataItem of this.timeRangeData) {
               //site
                this.pData.site = timeRangeDataItem.site;
           
            //haed
                let sTime = null;
                let eTime = null;
                for(let officeHourItem of this.siteItems[0].officeHour){
                    if(sTime == null || sTime > new Date(officeHourItem.startDate).getUTCHours()){
                        sTime = new Date(officeHourItem.startDate).getUTCHours();
                    }
                    if(eTime == null || eTime < new Date(officeHourItem.endDate).getUTCHours()){
                        eTime = new Date(officeHourItem.endDate).getUTCHours();
                    }
                }   
                
                 this.pData.head = [];
                 while(sTime <= eTime){
                      this.pData.head.push(sTime);
                      sTime++
                 }

            //body 
            for (let siteItem of this.siteItems) {
                if (siteItem.value == timeRangeDataItem.site) {
                   for(let bodyItme of timeRangeDataItem.body){
                    let contexts = [];
                    for(let headItem of this.pData.head){
                        let context = {
                                time: "",
                                value: 0
                        }
                        for(let contextItem of bodyItme.context){
                            if(headItem == new Date(contextItem.time).getUTCHours()){
                                 context = {
                                    time: contextItem.time,
                                    value: contextItem.value
                                }
                                break;
                            }
                        }
                        contexts.push(context);
                    }

                     let thisBody:IPeckTimeRangeBody = {
                        title: siteItem.text,
                        context: contexts
                     }
                     this.pData.body.push(thisBody);
                }   
                }
            }
        }
    }

    generateDayXSteX() {
        console.log("generateDayXSteX", this.timeRangeData);

        if(!this.timeRangeData){
            return;
        }

        this.pData = {
            site: "",
            head: [],
            body: []
        };
        
        for (let timeRangeDataItem of this.timeRangeData) {
            if (timeRangeDataItem.site == this.site) {
                //site
                this.pData.site = timeRangeDataItem.site;

             
                //haed
                let sTime = null;
                let eTime = null;
                for(let officeHourItem of this.siteItems[0].officeHour){
                    if(sTime == null || sTime > new Date(officeHourItem.startDate).getUTCHours()){
                        sTime = new Date(officeHourItem.startDate).getUTCHours();
                    }
                    if(eTime == null || eTime < new Date(officeHourItem.endDate).getUTCHours()){
                        eTime = new Date(officeHourItem.endDate).getUTCHours();
                    }
                }   
                
                 this.pData.head = [];
                 while(sTime <= eTime){
                      this.pData.head.push(sTime);
                      sTime++
                 }

                 //body
                for(let bodyItme of timeRangeDataItem.body){
                    let contexts = [];
                    for(let headItem of this.pData.head){
                        let context = {
                                time: "",
                                value: 0
                        }
                        for(let contextItem of bodyItme.context){
                            if(headItem == new Date(contextItem.time).getUTCHours()){
                                 context = {
                                    time: contextItem.time,
                                    value: contextItem.value
                                }
                                break;
                            }
                        }
                        contexts.push(context);
                    }

                     let thisBody:IPeckTimeRangeBody = {
                        title: bodyItme.title,
                        context: contexts
                     }
                     this.pData.body.push(thisBody);
                }   
            }
        }
    }

    showWeek(data) {
        switch (data) {
            case 1:
                return "Mon";
                break;
            case 2:
                return "Tue";
                break;
            case 3:
                return "Wed";
                break;
            case 4:
                return "Thu";
                break;
            case 5:
                return "Fri";
                break;
            case 6:
                return "Sat";
                break;
            case 0:
                return "Sun";
                break;
        }
    }

    showHoursRange(data) {
        switch (data) {
            case 1:
                return "hoursRange1";
                break;
            case 2:
                return "hoursRange2";
                break;
            case 3:
                return "hoursRange3";
                break;
            case 4:
                return "hoursRange4";
                break;
            case 5:
                return "hoursRange5";
                break;
            default:
                return "hoursRange0";
        }
    }

    changeSite() {
        this.initData();
    }
}

export default PeakTimeRange;
Vue.component("peak-time-range", PeakTimeRange);
</script>

<style lang="scss" scoped>
.hoursRange0 {
    background-color: #ffffff;
    height: 47px;
}
.hoursRange1 {
    background-color: #d7e7f7;
    height: 47px;
}
.hoursRange2 {
    background-color: #9ec3ef;
    height: 47px;
}
.hoursRange3 {
    background-color: #3e86db;
    height: 47px;
}
.hoursRange4 {
    background-color: #194f8f;
    height: 47px;
}
.hoursRange5 {
    background-color: #0f2f55;
    height: 47px;
}
</style>
