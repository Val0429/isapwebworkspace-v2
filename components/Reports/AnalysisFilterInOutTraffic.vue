<template>
    <div>
        <iv-form
            :interface="IAnalysisFilterForm()"
            @update:areaId="whenSelectedAreaId($event)"
            @update:groupId="whenSelectedGroupId($event)"
            @update:deviceId="whenSelectedDeviceId($event)"
            @update:type="whenSelectedType($event)"
            @update:selectInOrOut="whenSelectedInOrOut($event)"
        >

            <template #areaId="{ $attrs, $listeners }">
                <iv-form-selection
                    class="col-md-2"
                    v-bind="$attrs"
                    v-on="$listeners"
                    v-model="inputFormData.areaId"
                >
                </iv-form-selection>
            </template>

            <template #groupId="{ $attrs, $listeners }">
                <iv-form-selection
                    class="col-md-2"
                    v-bind="$attrs"
                    v-on="$listeners"
                    v-model="inputFormData.groupId"
                >
                </iv-form-selection>
            </template>

            <template #deviceId="{ $attrs, $listeners }">
                <iv-form-selection
                    class="col-md-2"
                    v-bind="$attrs"
                    v-on="$listeners"
                    v-model="inputFormData.deviceId"
                >
                </iv-form-selection>
            </template>

            <template #type="{ $attrs, $listeners }">
                <iv-form-selection
                    class="col-md-2"
                    v-if="type !== 'hour'"
                    v-bind="$attrs"
                    v-on="$listeners"
                    v-model="inputFormData.type"
                >
                </iv-form-selection>
            </template>

            <template #selectInOrOut="{ $attrs, $listeners }">

                <b-form-radio-group
                    v-bind="$attrs"
                    v-on="$listeners"
                    v-model="inputFormData.inOrOut"
                    class="h-25 click_button col-md-1"
                    buttons
                    button-variant="outline-success"
                    name="radio-btn-outline"
                    :options="typeSelectItem"
                ></b-form-radio-group>
            </template>

        </iv-form>

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
import { toEnumInterface } from "@/../core";
import { ECountType, EType } from "@/components/Reports/models/EReport";
import { IChartTrafficData, EWeather } from "@/components/Reports";
import ResponseFilter from "@/services/ResponseFilter";
let config = require("@/config/default/debug");


@Component({
    components: {}
})
export class AnalysisFilterInOutTraffic extends Vue {
    // @Prop({
    //     type: String, // Boolean, Number, String, Array, Object
    //     default: ""
    // })
    // firstSiteId: string;
    //
    // @Prop({
    //     type: String, // Boolean, Number, String, Array, Object
    //     default: ""
    // })
    // countType: string;
    //
    // @Prop({
    //     type: String, // Boolean, Number, String, Array, Object
    //     default: ""
    // })
    // deviceMode: string;
    //
    // @Prop({
    //     type: Object, // Boolean, Number, String, Array, Object
    //     default: () => {
    //         return {
    //             weathers: [],
    //             peakHours: [],
    //             summaryDatas: []
    //         };
    //     }
    // })
    // showReportData: any;

    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: {}
    })
    areaSelectItem: object;

    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: {}
    })
    deviceGroupSelectItem: object;

    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: {}
    })
    deviceSelectItem: object;

    @Prop({
        type: Array, // Boolean, Number, String, Array, Object
        default: []
    })
    typeSelectItem: object;

    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default:{}
    })
    countSelectItem: object;

    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: "all"
    })
    areaId: string;

    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: "all"
    })
    groupId: string;

    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: "all"
    })
    deviceId: string;

    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: "hour"
    })
    type: string;

    // @Prop({
    //     type: String, // Boolean, Number, String, Array, Object
    //     default: "in"
    // })
    // inOrOut: string;



    // select 相關
    // areaSelectItem: any = {};
    // deviceGroupSelectItem: any = {};
    // deviceSelectItem: any = {};
    // typeSelectItem: any = [
    //     { value: EType.in, text: EType.in },
    //     { value: EType.out, text: EType.out }
    // ];
    // countSelectItem: any = {
    //     hour: ECountType.hour,
    //     day: ECountType.day,
    //     week: ECountType.week,
    //     month: ECountType.month,
    //     season: ECountType.quarter,
    //     year: ECountType.year
    // };

    inputFormData: any = {
        areaId: "",
        groupId: "",
        deviceId: "",
        type: "hour",
        inOrOut: "in"
    };

    // 整理 showReportData 相關

    siteSummaryFilter: any = [];
    siteSalesRecordsFilter: any = [];
    siteWeathersFilter: any = [];

    areaSummaryFilter: any = [];
    deviceGroupSummaryFilter: any = [];
    deviceSummaryFilter: any = [];

    areaSalesRecordsFilter: any = [];
    deviceGroupSalesRecordsFilter: any = [];
    deviceSalesRecordsFilter: any = [];

    areaWeathersFilter: any = [];
    deviceGroupWeathersFilter: any = [];
    deviceWeathersFilter: any = [];

    // chart 相關
    // trafficChartData: IChartTrafficData = {
    trafficChartData: any = [];
        // {
        // date: null,
        // siteObjectId: '',
        // temperature: 0,
        // traffic: 0,
        // revenue: 0,
        // transaction: 0,
        // conversion: 0,
        // asp: 0,
        // weather: '',
    // };

    created() {}

    mounted() {
        // this.initSelectItemArea();
        // this.initSelectItemDeviceGroup();
        // this.initSelectItemDevice();
        // this.filterSiteData();
        this.clearInputFormData();
        // console.log('showReportData - ', this.showReportData);
    }
    @Watch("areaId", { deep: true })
    private areaIdChanged(newVal, oldVal) {
        this.inputFormData.areaId = newVal;
    }

    @Watch("groupId", { deep: true })
    private groupIdChanged(newVal, oldVal) {
        this.inputFormData.groupId = newVal;
    }

    @Watch("deviceId", { deep: true })
    private deviceIdChanged(newVal, oldVal) {
        this.inputFormData.deviceId = newVal;
    }

    @Watch("type", { deep: true })
    private typeChanged(newVal, oldVal) {
        this.inputFormData.type = newVal;
    }

    @Watch("inOrOut", { deep: true })
    private inOrOutChanged(newVal, oldVal) {
        this.inputFormData.inOrOut = newVal;
    }

    clearInputFormData() {
        this.inputFormData = {
            areaId: "all",
            groupId: "all",
            deviceId: "all",
            type: "",
            inOrOut: "in"
        };
    }

    // clearTrafficChartData()  {
    //     this.trafficChartData = {
    //     date: null,
    //     siteObjectId: '',
    //     temperatureMin: 0,
    //     temperatureMax: 0,
    //     traffic: 0,
    //     revenue: 0,
    //     transaction: 0,
    //     weather: '',
    //     }
    // };

    // async initSelectItemArea() {
    //     let tempAreaSelectItem = { all: this._("w_AllAreas") };
    //
    //     const readParam: {
    //         siteId: string;
    //     } = {
    //         siteId: this.firstSiteId
    //     };
    //
    //     if (!this.firstSiteId) {
    //         return false;
    //     } else {
    //         await this.$server
    //             .R("/location/area/all", readParam)
    //             .then((response: any) => {
    //                 if (response != undefined) {
    //                     for (const returnValue of response) {
    //                         // 自定義 sitesSelectItem 的 key 的方式
    //                         tempAreaSelectItem[returnValue.objectId] =
    //                             returnValue.name;
    //                         // this.$set(this.areaSelectItem, returnValue.objectId, returnValue.name);
    //                     }
    //                     this.areaSelectItem = tempAreaSelectItem;
    //                 }
    //             })
    //             .catch((e: any) => {
    //                 if (e.res && e.res.statusCode && e.res.statusCode == 401) {
    //                     return ResponseFilter.base(this, e);
    //                 }
    //                 console.log(e);
    //                 return false;
    //             });
    //     }
    // }
    //
    // async initSelectItemDeviceGroup() {
    //     let tempDeviceGroupSelectItem = { all: this._("w_AllDeviceGroups") };
    //
    //     let readParam: {
    //         siteId: string;
    //         areaId?: string;
    //         mode: string;
    //     } = {
    //         siteId: this.firstSiteId,
    //         mode: this.deviceMode
    //     };
    //
    //     if (!this.firstSiteId) {
    //         return false;
    //
    //         // 只選擇site
    //     } else if (
    //         this.firstSiteId &&
    //         (this.inputFormData.areaId === undefined ||
    //             this.inputFormData.areaId === "") &&
    //         this.inputFormData.areaId !== "all"
    //     ) {
    //         await this.$server
    //             .R("/device/group/all", readParam)
    //             .then((response: any) => {
    //                 if (response != undefined) {
    //                     for (const returnValue of response) {
    //                         // 自定義 tempDeviceGroupSelectItem 的 key 的方式
    //                         tempDeviceGroupSelectItem[returnValue.objectId] =
    //                             returnValue.name;
    //                     }
    //                     this.deviceGroupSelectItem = tempDeviceGroupSelectItem;
    //                 }
    //             })
    //             .catch((e: any) => {
    //                 if (e.res && e.res.statusCode && e.res.statusCode == 401) {
    //                     return ResponseFilter.base(this, e);
    //                 }
    //                 console.log(e);
    //                 return false;
    //             });
    //
    //         // 選擇site和單一area
    //     } else if (
    //         this.firstSiteId &&
    //         this.inputFormData.areaId &&
    //         this.inputFormData.areaId !== "all"
    //     ) {
    //         readParam.areaId = this.inputFormData.areaId;
    //
    //         await this.$server
    //             .R("/device/group/all", readParam)
    //             .then((response: any) => {
    //                 if (response != undefined) {
    //                     for (const returnValue of response) {
    //                         // 自定義 tempDeviceGroupSelectItem 的 key 的方式
    //                         tempDeviceGroupSelectItem[returnValue.objectId] =
    //                             returnValue.name;
    //                     }
    //                     this.deviceGroupSelectItem = tempDeviceGroupSelectItem;
    //                 }
    //             })
    //             .catch((e: any) => {
    //                 if (e.res && e.res.statusCode && e.res.statusCode == 401) {
    //                     return ResponseFilter.base(this, e);
    //                 }
    //                 console.log(e);
    //                 return false;
    //             });
    //
    //         // 選擇site和all area
    //     } else if (
    //         this.firstSiteId &&
    //         this.inputFormData.areaId &&
    //         this.inputFormData.areaId === "all"
    //     ) {
    //         await this.$server
    //             .R("/device/group/all", readParam)
    //             .then((response: any) => {
    //                 if (response != undefined) {
    //                     for (const returnValue of response) {
    //                         // 自定義 tempDeviceGroupSelectItem 的 key 的方式
    //                         tempDeviceGroupSelectItem[returnValue.objectId] =
    //                             returnValue.name;
    //                     }
    //                     this.deviceGroupSelectItem = tempDeviceGroupSelectItem;
    //                 }
    //             })
    //             .catch((e: any) => {
    //                 if (e.res && e.res.statusCode && e.res.statusCode == 401) {
    //                     return ResponseFilter.base(this, e);
    //                 }
    //                 console.log(e);
    //                 return false;
    //             });
    //     }
    // }
    //
    // async initSelectItemDevice() {
    //     let tempDeviceSelectItem = {};
    //
    //     tempDeviceSelectItem = { all: this._("w_AllDevices") };
    //
    //     const readParam: {
    //         siteId: string;
    //         areaId?: string;
    //         groupId?: string;
    //         mode: string;
    //     } = {
    //         siteId: this.firstSiteId,
    //         mode: this.deviceMode
    //     };
    //
    //     if (!this.firstSiteId) {
    //         console.log("!this.firstSiteId - ", !this.firstSiteId);
    //         return false;
    //
    //         // 只選擇site
    //     } else if (
    //         this.firstSiteId &&
    //         !this.inputFormData.areaId &&
    //         !this.inputFormData.groupId
    //     ) {
    //         await this.$server
    //             .R("/device", readParam)
    //             .then((response: any) => {
    //                 if (response.results.length > 0) {
    //                     for (const returnValue of response.results) {
    //                         // 自定義 tempDeviceSelectItem 的 key 的方式
    //                         tempDeviceSelectItem[returnValue.objectId] =
    //                             returnValue.name;
    //                     }
    //                     this.deviceSelectItem = tempDeviceSelectItem;
    //                 }
    //             })
    //             .catch((e: any) => {
    //                 if (e.res && e.res.statusCode && e.res.statusCode == 401) {
    //                     return ResponseFilter.base(this, e);
    //                 }
    //                 console.log(e);
    //                 return false;
    //             });
    //
    //         // 選擇site和單一area
    //     } else if (
    //         this.firstSiteId &&
    //         this.inputFormData.areaId &&
    //         this.inputFormData.areaId !== "all" &&
    //         (this.inputFormData.groupId === undefined ||
    //             this.inputFormData.groupId === "") &&
    //         this.inputFormData.groupId !== "all"
    //     ) {
    //         readParam.areaId = this.inputFormData.areaId;
    //
    //         await this.$server
    //             .R("/device", readParam)
    //             .then((response: any) => {
    //                 if (response.results.length > 0) {
    //                     for (const returnValue of response.results) {
    //                         // 自定義 tempDeviceSelectItem 的 key 的方式
    //                         tempDeviceSelectItem[returnValue.objectId] =
    //                             returnValue.name;
    //                     }
    //                     this.deviceSelectItem = tempDeviceSelectItem;
    //                 }
    //             })
    //             .catch((e: any) => {
    //                 if (e.res && e.res.statusCode && e.res.statusCode == 401) {
    //                     return ResponseFilter.base(this, e);
    //                 }
    //                 console.log(e);
    //                 return false;
    //             });
    //
    //         // 選擇site和單一area和單一device group
    //     } else if (
    //         this.firstSiteId &&
    //         this.inputFormData.areaId &&
    //         this.inputFormData.areaId !== "all" &&
    //         this.inputFormData.groupId &&
    //         this.inputFormData.groupId !== "all"
    //     ) {
    //         readParam.groupId = this.inputFormData.groupId;
    //
    //         await this.$server
    //             .R("/device", readParam)
    //             .then((response: any) => {
    //                 if (response.results.length > 0) {
    //                     for (const returnValue of response.results) {
    //                         // 自定義 tempDeviceSelectItem 的 key 的方式
    //                         tempDeviceSelectItem[returnValue.objectId] =
    //                             returnValue.name;
    //                     }
    //                     this.deviceSelectItem = tempDeviceSelectItem;
    //                 }
    //                 if (response.results.length === 0) {
    //                     this.deviceSelectItem = {};
    //                 }
    //             })
    //             .catch((e: any) => {
    //                 if (e.res && e.res.statusCode && e.res.statusCode == 401) {
    //                     return ResponseFilter.base(this, e);
    //                 }
    //                 console.log(e);
    //                 return false;
    //             });
    //
    //         // 選擇site和all area
    //     } else if (
    //         this.firstSiteId &&
    //         this.inputFormData.areaId &&
    //         this.inputFormData.areaId === "all" &&
    //         (this.inputFormData.groupId === undefined ||
    //             this.inputFormData.groupId === "") &&
    //         this.inputFormData.groupId !== "all"
    //     ) {
    //         readParam.areaId = "";
    //
    //         await this.$server
    //             .R("/device", readParam)
    //             .then((response: any) => {
    //                 if (response.results.length > 0) {
    //                     for (const returnValue of response.results) {
    //                         // 自定義 tempDeviceSelectItem 的 key 的方式
    //                         tempDeviceSelectItem[returnValue.objectId] =
    //                             returnValue.name;
    //                     }
    //                     this.deviceSelectItem = tempDeviceSelectItem;
    //                 }
    //             })
    //             .catch((e: any) => {
    //                 if (e.res && e.res.statusCode && e.res.statusCode == 401) {
    //                     return ResponseFilter.base(this, e);
    //                 }
    //                 console.log(e);
    //                 return false;
    //             });
    //
    //         // 選擇site和all area和all device group
    //     } else if (
    //         this.firstSiteId &&
    //         this.inputFormData.areaId &&
    //         this.inputFormData.areaId === "all" &&
    //         this.inputFormData.groupId &&
    //         this.inputFormData.groupId === "all"
    //     ) {
    //         readParam.groupId = this.inputFormData.groupId;
    //
    //         await this.$server
    //             .R("/device", readParam)
    //             .then((response: any) => {
    //                 if (response.results.length > 0) {
    //                     for (const returnValue of response.results) {
    //                         // 自定義 tempDeviceSelectItem 的 key 的方式
    //                         tempDeviceSelectItem[returnValue.objectId] =
    //                             returnValue.name;
    //                     }
    //                     this.deviceSelectItem = tempDeviceSelectItem;
    //                 }
    //                 if (response.results.length === 0) {
    //                     this.deviceSelectItem = {};
    //                 }
    //             })
    //             .catch((e: any) => {
    //                 if (e.res && e.res.statusCode && e.res.statusCode == 401) {
    //                     return ResponseFilter.base(this, e);
    //                 }
    //                 console.log(e);
    //                 return false;
    //             });
    //
    //         // 選擇site和單一area和all device group
    //     } else if (
    //         this.firstSiteId &&
    //         this.inputFormData.areaId &&
    //         this.inputFormData.areaId !== "all" &&
    //         this.inputFormData.groupId &&
    //         this.inputFormData.groupId === "all"
    //     ) {
    //         readParam.areaId = this.inputFormData.areaId;
    //         readParam.groupId = "";
    //
    //         await this.$server
    //             .R("/device", readParam)
    //             .then((response: any) => {
    //                 if (response.results.length > 0) {
    //                     for (const returnValue of response.results) {
    //                         // 自定義 tempDeviceSelectItem 的 key 的方式
    //                         tempDeviceSelectItem[returnValue.objectId] =
    //                             returnValue.name;
    //                     }
    //                     this.deviceSelectItem = tempDeviceSelectItem;
    //                 }
    //                 if (response.results.length === 0) {
    //                     this.deviceSelectItem = {};
    //                 }
    //             })
    //             .catch((e: any) => {
    //                 if (e.res && e.res.statusCode && e.res.statusCode == 401) {
    //                     return ResponseFilter.base(this, e);
    //                 }
    //                 console.log(e);
    //                 return false;
    //             });
    //     }
    // }
    //
    // filterSiteData() {
    //     console.log("filterSiteData - ", this.showReportData.summaryDatas);
    //
    //     let tempChartData: any = {};
    //
    //     // 取得date、siteObjectId資料
    //     for (const singleData of this.showReportData.summaryDatas) {
    //         for (const detailKey in singleData) {
    //             // console.log('singleData - ', singleData);
    //             const tempSingleData = singleData[detailKey];
    //             switch (detailKey) {
    //                 case "date":
    //                     tempChartData.date = tempSingleData;
    //                     break;
    //                 case "site":
    //                     tempChartData.siteObjectId = tempSingleData.objectId;
    //                     break;
    //                 case "in":
    //                     tempChartData.traffic = tempSingleData;
    //                     break;
    //             }
    //         }
    //
    //         this.trafficChartData.push(tempChartData);
    //         // console.log(" - ", this.trafficChartData);
    //         this.$emit("traffic-chart-data", this.trafficChartData);
    //     }
    //
    //     // 取得traffic、revenue、transaction資料
    //     for (const singleData of this.showReportData.salesRecords) {
    //         for (const detailKey in singleData) {
    //             const tempSingleData = singleData[detailKey];
    //             switch (detailKey) {
    //                 case "revenue":
    //                     tempChartData.revenue = tempSingleData;
    //                     break;
    //                 case "transaction":
    //                     tempChartData.transaction = tempSingleData;
    //                     break;
    //             }
    //         }
    //     }
    //
    //     // 取得weather、temperatureMin、temperatureMax
    //     for (const singleData of this.showReportData.weathers) {
    //         // if (singleData.site.objectId === this.firstSiteId) {
    //         //     this.siteWeathersFilter.push(singleData);
    //         // }
    //         for (const detailKey in singleData) {
    //             const tempSingleData = singleData[detailKey];
    //             switch (detailKey) {
    //                 case "icon":
    //                     tempChartData.weather = this.weatherIcon(
    //                         tempSingleData
    //                     );
    //                     break;
    //                 case "temperatureMin":
    //                     tempChartData.temperatureMin = tempSingleData;
    //                     break;
    //                 case "temperatureMax":
    //                     tempChartData.temperatureMax = tempSingleData;
    //                     break;
    //             }
    //         }
    //     }
    //     // console.log(' - ', this.trafficChartData);
    // }

    async whenSelectedAreaId() {
        this.$emit("area_id", this.inputFormData.areaId);

        //
        // this.areaSummaryFilter = [];
        //
        // // console.log(' - ', this.inputFormData.areaId);
        //
        // //  this.clearTrafficChartData();
        //
        // // 依照單一area篩選
        // if (this.inputFormData.areaId && this.inputFormData.areaId !== "all") {
        //     for (const singleData of this.showReportData.summaryDatas) {
        //         // TODO: wait Min api
        //         // temperature: number; --->
        //         // revenue: number; ---> singleData.in
        //         // transaction: number; ---> singleData.in
        //         // weather: number; ---> singleData.in
        //
        //         // date: Date; ---> singleData.date
        //         // siteObjectId: string; ---> singleData.site.name
        //         // traffic: number; ---> singleData.in
        //
        //         for (const detailKey in singleData) {
        //             const tempSingleData = singleData[detailKey];
        //
        //             if (detailKey === "area") {
        //                 if (
        //                     this.inputFormData.areaId ===
        //                     tempSingleData.objectId
        //                 ) {
        //                     // console.log('!!!! - ', singleData);
        //                     this.areaSummaryFilter.push(singleData);
        //                 }
        //             }
        //         }
        //         // console.log(" - ", this.areaSummaryFilter);
        //         //console.log("trafficChartData - ", this.trafficChartData);
        //     }
        //
        //     // 整理為Morris需要的資料格式
        //     for (const singleData of this.areaSummaryFilter) {
        //         // TODO: wait Min api
        //         // temperature: number; --->
        //         // revenue: number; ---> singleData.in
        //         // transaction: number; ---> singleData.in
        //         // weather: number; ---> singleData.in
        //
        //         // date: Date; ---> singleData.date
        //         // siteObjectId: string; ---> singleData.site.name
        //         // traffic: number; ---> singleData.in
        //
        //         for (const detailKey in singleData) {
        //             const tempSingleData = singleData[detailKey];
        //
        //             if (detailKey === "area") {
        //                 if (
        //                     this.inputFormData.areaId ===
        //                     tempSingleData.objectId
        //                 ) {
        //                     this.trafficChartData.date = singleData.date;
        //                     this.trafficChartData.siteObjectId =
        //                         singleData.site.objectId;
        //                     // this.trafficChartData.temperature = tempSingleData.;
        //                     // this.trafficChartData.revenue = tempSingleData.;
        //                     // this.trafficChartData.transaction = tempSingleData.;
        //                     // this.trafficChartData.weather = tempSingleData.;
        //                 }
        //             }
        //         }
        //         console.log(" - ", this.trafficChartData);
        //     }
        //
        //     this.inputFormData.groupId = "";
        //     this.inputFormData.deviceId = "";
        //
        //     await this.initSelectItemDeviceGroup();
        //     await this.initSelectItemDevice();
        //
        //     this.inputFormData.groupId = "all";
        //     this.inputFormData.deviceId = "all";
        //
        //     // 依照all area篩選
        // } else if (
        //     this.inputFormData.areaId &&
        //     this.inputFormData.areaId === "all"
        // ) {
        //     this.inputFormData.groupId = "";
        //     this.inputFormData.deviceId = "";
        //
        //     await this.initSelectItemArea();
        //     await this.initSelectItemDeviceGroup();
        //     await this.initSelectItemDevice();
        //
        //     this.inputFormData.groupId = "all";
        //     this.inputFormData.deviceId = "all";
        //
        //     // 清除area篩選
        // } else if (!this.inputFormData.areaId) {
        //     this.inputFormData.groupId = "";
        //     this.inputFormData.deviceId = "";
        //
        //     await this.initSelectItemArea();
        //     await this.initSelectItemDeviceGroup();
        //     await this.initSelectItemDevice();
        // } else {
        //     return false;
        // }
    }

    async whenSelectedGroupId() {
        this.$emit("group_id", this.inputFormData.groupId);

        // this.deviceGroupSummaryFilter = [];
        //
        // if (
        //     this.inputFormData.groupId &&
        //     this.inputFormData.groupId !== "all"
        // ) {
        //     // 依照單一deviceGroup篩選
        //     for (const singleData of this.areaSummaryFilter) {
        //         for (const detailKey in singleData) {
        //             const tempSingleData = singleData[detailKey];
        //
        //             if (detailKey === "deviceGroups") {
        //                 if (
        //                     this.inputFormData.groupId ===
        //                     tempSingleData[0].objectId
        //                 ) {
        //                     this.deviceGroupSummaryFilter.push(singleData);
        //                 }
        //             }
        //         }
        //         // console.log(" - ", this.deviceGroupSummaryFilter);
        //     }
        //
        //     // 整理為Morris需要的資料格式
        //     for (const singleData of this.deviceGroupSummaryFilter) {
        //         // TODO: wait Min api
        //         // temperature: number; --->
        //         // revenue: number; ---> singleData.in
        //         // transaction: number; ---> singleData.in
        //         // weather: number; ---> singleData.in
        //
        //         // date: Date; ---> singleData.date
        //         // siteObjectId: string; ---> singleData.site.name
        //         // traffic: number; ---> singleData.in
        //
        //         for (const detailKey in singleData) {
        //             const tempSingleData = singleData[detailKey];
        //
        //             if (detailKey === "deviceGroups") {
        //                 if (
        //                     this.inputFormData.groupId ===
        //                     tempSingleData[0].objectId
        //                 ) {
        //                     this.trafficChartData.date = singleData.date;
        //                     this.trafficChartData.siteObjectId =
        //                         singleData.site.objectId;
        //                     // this.trafficChartData.temperature = tempSingleData.;
        //                     // this.trafficChartData.revenue = tempSingleData.;
        //                     // this.trafficChartData.transaction = tempSingleData.;
        //                     // this.trafficChartData.weather = tempSingleData.;
        //                 }
        //             }
        //         }
        //         console.log(" - ", this.trafficChartData);
        //     }
        //
        //     this.inputFormData.deviceId = "";
        //     await this.initSelectItemDevice();
        //     this.inputFormData.deviceId = "all";
        //
        //     // 依照all deviceGroups篩選
        // } else if (
        //     this.inputFormData.areaId &&
        //     this.inputFormData.groupId &&
        //     this.inputFormData.groupId === "all"
        // ) {
        //     this.inputFormData.deviceId = "";
        //     await this.initSelectItemDevice();
        //     this.inputFormData.deviceId = "all";
        //
        //     // 清除deviceGroups篩選
        // } else if (this.inputFormData.areaId && !this.inputFormData.groupId) {
        //     this.inputFormData.deviceId = "";
        //     await this.initSelectItemDevice();
        // } else {
        //     return false;
        // }
    }

    whenSelectedDeviceId() {
        this.$emit("device_id", this.inputFormData.deviceId);
        //
        // // 依照device篩選
        // for (const singleData of this.deviceGroupSummaryFilter) {
        //     for (const detailKey in singleData) {
        //         const tempSingleData = singleData[detailKey];
        //
        //         if (detailKey === "device") {
        //             if (
        //                 this.inputFormData.deviceId === tempSingleData.objectId
        //             ) {
        //                 this.deviceSummaryFilter.push(singleData);
        //             }
        //         }
        //     }
        //     console.log(" - ", this.deviceSummaryFilter);
        // }
        //
        // // 整理為Morris需要的資料格式
        // for (const singleData of this.deviceSummaryFilter) {
        //     // TODO: wait Min api
        //     // temperature: number; --->
        //     // revenue: number; ---> singleData.in
        //     // transaction: number; ---> singleData.in
        //     // weather: number; ---> singleData.in
        //
        //     // date: Date; ---> singleData.date
        //     // siteObjectId: string; ---> singleData.site.name
        //     // traffic: number; ---> singleData.in
        //
        //     for (const detailKey in singleData) {
        //         const tempSingleData = singleData[detailKey];
        //
        //         if (detailKey === "device") {
        //             if (
        //                 this.inputFormData.deviceId === tempSingleData.objectId
        //             ) {
        //                 this.trafficChartData.date = singleData.date;
        //                 this.trafficChartData.siteObjectId =
        //                     singleData.site.objectId;
        //                 // this.trafficChartData.temperature = tempSingleData.;
        //                 // this.trafficChartData.revenue = tempSingleData.;
        //                 // this.trafficChartData.transaction = tempSingleData.;
        //                 // this.trafficChartData.weather = tempSingleData.;
        //             }
        //         }
        //     }
        //     console.log(" - ", this.trafficChartData);
        // }
    }

    whenSelectedType() {
        this.$emit("type", this.inputFormData.type);

    }

    whenSelectedInOrOut() {
        this.$emit("in_or_out", this.inputFormData.inOrOut);
    }

    doSubmit() {
        this.$emit("submit-data", this.inputFormData);
        this.inputFormData = {
            areaId: []
        };
    }

    async doReset() {
        this.inputFormData = {
            areaId: "",
            groupId: "",
            deviceId: "",
            type: "",
            inOrOut: "in"
        };

        this.inputFormData.groupId = "";
        this.inputFormData.deviceId = "";
        // await this.initSelectItemArea();
        // await this.initSelectItemDeviceGroup();
        // await this.initSelectItemDevice();
    }

    weatherIcon(icon: string): string {
        switch (icon) {
            case "clear-day":
                return EWeather.clearDay;
            case "clear-night":
                return EWeather.clearNight;
            case "rain":
                return EWeather.rain;
            case "snow":
                return EWeather.snow;
            case "sleet":
                return EWeather.sleet;
            case "wind":
                return EWeather.wind;
            case "fog":
                return EWeather.fog;
            case "cloudy":
                return EWeather.cloudy;
            case "partly-cloudy-day":
                return EWeather.partlyCloudyDay;
            case "partly-cloudy-night":
                return EWeather.partlyCloudyNight;
            default:
                return EWeather.none;
        }
    }

    IAnalysisFilterForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Areas")}
                 * @uiColumnGroup - analysis
                 */
                areaId?: ${toEnumInterface(this.areaSelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_DeviceGroups")}
                 * @uiColumnGroup - analysis
                 */
                groupId?: ${toEnumInterface(
                    this.deviceGroupSelectItem as any,
                    false
                )};


                /**
                 * @uiLabel - ${this._("w_Devices")}
                 * @uiColumnGroup - analysis
                 */
                deviceId?: ${toEnumInterface(
                    this.deviceSelectItem as any,
                    false
                )};


                /**
                 * @uiLabel - ${this._("w_countSelect")}
                 * @uiColumnGroup - analysis
                 */
                type?: ${toEnumInterface(this.countSelectItem as any, false)};


                /**
                 * @uiColumnGroup - analysis
                 */
                selectInOrOut?: any;

            }
        `;
    }
}

export default AnalysisFilterInOutTraffic;
Vue.component("analysis_filter_in_out_traffic", AnalysisFilterInOutTraffic);
</script>

<style lang="scss" scoped>
.click_button {
    margin-top: 27px;
}
</style>
