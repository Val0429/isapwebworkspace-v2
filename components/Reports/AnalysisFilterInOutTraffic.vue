<template>
    <div>
        <iv-form
            :interface="IAnalysisFilterForm()"
            @update:areaId="whenSelectedAreaId($event)"
            @update:groupId="whenSelectedGroupId($event)"
            @update:deviceId="whenSelectedDeviceId($event)"
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
                    v-if="countType !== 'hour'"
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
import { ECountType } from "@/components/Reports/models/EReport";
import { IChartTrafficData } from "@/components/Reports";
import ResponseFilter from "@/services/ResponseFilter";
let config = require("@/config/default/debug");

enum EType {
    in = "in",
    out = "out"
}

@Component({
    components: {}
})
export class AnalysisFilterInOutTraffic extends Vue {
    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: ""
    })
    firstSiteId: string;

    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: ""
    })
    countType: string;

    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: ""
    })
    deviceMode: string;

    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: () => {
            return {
                peakHours: [],
                summaryDatas: []
            };
        }
    })
    showReportData: any;

    // select 相關
    areaSelectItem: any = {};
    deviceGroupSelectItem: any = {};
    deviceSelectItem: any = {};
    typeSelectItem: any = [
        { value: EType.in, text: EType.in },
        { value: EType.out, text: EType.out }
    ];
    countSelectItem: any = {
        hour: ECountType.hour,
        day: ECountType.day,
        week: ECountType.week,
        month: ECountType.month,
        season: ECountType.quarter,
        year: ECountType.year
    };

    inputFormData: any = {
        areaId: "",
        groupId: "",
        deviceId: "",
        type: "",
        inOrOut: "in"
    };

    // 整理 showReportData 相關
    areaFilter: any = [];
    deviceGroupFilter: any = [];
    deviceFilter: any = [];

    // chart 相關
    // trafficChartData: IChartTrafficData = {
    trafficChartData: any = {
        // date: null,
        // siteObjectId: '',
        // temperature: 0,
        // traffic: 0,
        // revenue: 0,
        // transaction: 0,
        // conversion: 0,
        // asp: 0,
        // weather: '',
    };

    created() {}

    mounted() {
        this.initSelectItemArea();
        this.initSelectItemDeviceGroup();
        this.initSelectItemDevice();
        this.filterSiteData();
        // console.log('showReportData - ', this.showReportData);
    }

    @Watch("firstSiteId", { deep: true })
    private onfirstSiteIdChanged(newVal, oldVal) {
        this.initSelectItemArea();
        this.initSelectItemDeviceGroup();
        this.initSelectItemDevice();
    }

    // clearTrafficChartData()  {
    //     this.trafficChartData = {
    //     date: null,
    //     siteObjectId: '',
    //     temperature: 0,
    //     traffic: 0,
    //     revenue: 0,
    //     transaction: 0,
    //     conversion: 0,
    //     asp: 0,
    //     weather: '',
    //     }
    // };

    async initSelectItemArea() {
        let tempAreaSelectItem = {};

        const readParam: {
            siteId: string;
        } = {
            siteId: this.firstSiteId
        };

        if (!this.firstSiteId) {
            return false;
        } else {
            await this.$server
                .R("/location/area/all", readParam)
                .then((response: any) => {
                    if (response != undefined) {
                        for (const returnValue of response) {
                            // 自定義 sitesSelectItem 的 key 的方式
                            tempAreaSelectItem[returnValue.objectId] =
                                returnValue.name;
                            // this.$set(this.areaSelectItem, returnValue.objectId, returnValue.name);
                        }
                        this.areaSelectItem = tempAreaSelectItem;
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
    }

    async initSelectItemDeviceGroup() {
        let tempDeviceGroupSelectItem = {};

        let readParam: {
            siteId: string;
            areaId?: string;
            mode: string;
        } = {
            siteId: this.firstSiteId,
            mode: this.deviceMode
        };

        if (!this.firstSiteId) {
            return false;
        } else if (
            this.firstSiteId &&
            (this.inputFormData.areaId === undefined ||
                this.inputFormData.areaId === "")
        ) {
            await this.$server
                .R("/device/group/all", readParam)
                .then((response: any) => {
                    if (response != undefined) {
                        for (const returnValue of response) {
                            // 自定義 tempDeviceGroupSelectItem 的 key 的方式
                            tempDeviceGroupSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceGroupSelectItem = tempDeviceGroupSelectItem;
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    console.log(e);
                    return false;
                });
        } else if (
            // 選擇site和area
            this.firstSiteId &&
            (this.inputFormData.areaId !== undefined ||
                this.inputFormData.areaId !== "")
        ) {
            readParam.areaId = this.inputFormData.areaId;

            await this.$server
                .R("/device/group/all", readParam)
                .then((response: any) => {
                    if (response != undefined) {
                        for (const returnValue of response) {
                            // 自定義 tempDeviceGroupSelectItem 的 key 的方式
                            tempDeviceGroupSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceGroupSelectItem = tempDeviceGroupSelectItem;
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
    }

    async initSelectItemDevice() {
        let tempDeviceSelectItem = {};

        const readParam: {
            siteId: string;
            areaId?: string;
            groupId?: string;
            mode: string;
        } = {
            siteId: this.firstSiteId,
            mode: this.deviceMode
        };

        if (!this.firstSiteId) {
            return false;
        } else if (
            // 只選擇site
            this.firstSiteId &&
            (this.inputFormData.areaId === undefined ||
                this.inputFormData.areaId === "") &&
            (this.inputFormData.groupId === undefined ||
                this.inputFormData.groupId === "")
        ) {
            await this.$server
                .R("/device", readParam)
                .then((response: any) => {
                    if (response.results.length > 0) {
                        for (const returnValue of response.results) {
                            // 自定義 tempDeviceSelectItem 的 key 的方式
                            tempDeviceSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceSelectItem = tempDeviceSelectItem;
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    console.log(e);
                    return false;
                });
        } else if (
            // 選擇site和area
            this.firstSiteId &&
            (this.inputFormData.areaId !== undefined ||
                this.inputFormData.areaId !== "") &&
            (this.inputFormData.groupId === undefined ||
                this.inputFormData.groupId === "")
        ) {
            readParam.areaId = this.inputFormData.areaId;

            await this.$server
                .R("/device", readParam)
                .then((response: any) => {
                    if (response.results.length > 0) {
                        for (const returnValue of response.results) {
                            // 自定義 tempDeviceSelectItem 的 key 的方式
                            tempDeviceSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceSelectItem = tempDeviceSelectItem;
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    console.log(e);
                    return false;
                });
        } else if (
            // 選擇site和area和device group
            this.firstSiteId &&
            (this.inputFormData.areaId !== undefined ||
                this.inputFormData.areaId !== "") &&
            (this.inputFormData.groupId !== undefined ||
                this.inputFormData.groupId !== "")
        ) {
            readParam.groupId = this.inputFormData.groupId;

            await this.$server
                .R("/device", readParam)
                .then((response: any) => {
                    if (response.results.length > 0) {
                        for (const returnValue of response.results) {
                            // 自定義 tempDeviceSelectItem 的 key 的方式
                            tempDeviceSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceSelectItem = tempDeviceSelectItem;
                    }
                    if (response.results.length === 0) {
                        this.deviceSelectItem = {};
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
    }

    filterSiteData() {
        console.log("filterSiteData - ", this.showReportData.summaryDatas);

       //  this.clearTrafficChartData();

        for (const singleData of this.showReportData.summaryDatas) {
            // TODO: wait Min api
            // temperature: number; --->
            // revenue: number; ---> singleData.in
            // transaction: number; ---> singleData.in
            // conversion: number; ---> singleData.in
            // asp: number; ---> singleData.in
            // weather: number; ---> singleData.in

            // date: Date; ---> singleData.date
            // siteObjectId: string; ---> singleData.site.name
            // traffic: number; ---> singleData.in

            for (const detailKey in singleData) {
                const tempSingleData = singleData[detailKey];
                switch (detailKey) {
                    case "date":
                        this.trafficChartData.date = tempSingleData;
                        break;
                    case "in":
                        this.trafficChartData.traffic = tempSingleData;
                        break;
                    case "site":
                        this.trafficChartData.siteObjectId = tempSingleData.objectId;
                        break;
                    // case "":
                    //     this.trafficChartData.temperature = tempSingleData.;
                    //     break;
                    // case "":
                    //     this.trafficChartData.revenue = tempSingleData.;
                    //     break;
                    // case "":
                    //     this.trafficChartData.transaction = tempSingleData.;
                    //     break;
                    // case "":
                    //     this.trafficChartData.conversion = tempSingleData.;
                    //     break;
                    // case "":
                    //     this.trafficChartData.asp = tempSingleData.;
                    //     break;
                    // case "":
                    //     this.trafficChartData.weather = tempSingleData.;
                    //     break;
                }

            }
            //console.log(" - ", this.trafficChartData);
        }
    }

    async whenSelectedAreaId() {

        this.areaFilter = [];

        // console.log(' - ', this.inputFormData.areaId);

       //  this.clearTrafficChartData();

        if (
            this.inputFormData.areaId !== undefined ||
            this.inputFormData.areaId !== ""
        ) {
            // 依照area篩選
            for (const singleData of this.showReportData.summaryDatas) {
                // TODO: wait Min api
                // temperature: number; --->
                // revenue: number; ---> singleData.in
                // transaction: number; ---> singleData.in
                // conversion: number; ---> singleData.in
                // asp: number; ---> singleData.in
                // weather: number; ---> singleData.in

                // date: Date; ---> singleData.date
                // siteObjectId: string; ---> singleData.site.name
                // traffic: number; ---> singleData.in

                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];

                    if (detailKey === 'area') {
                        if (this.inputFormData.areaId === tempSingleData.objectId) {
                           // console.log('!!!! - ', singleData);

                            this.areaFilter.push(singleData) ;
                        }
                    }

                }
               // console.log(" - ", this.areaFilter);
               //console.log("trafficChartData - ", this.trafficChartData);
            }


            // 整理為Morris需要的資料格式
            for (const singleData of this.areaFilter) {
                // TODO: wait Min api
                // temperature: number; --->
                // revenue: number; ---> singleData.in
                // transaction: number; ---> singleData.in
                // conversion: number; ---> singleData.in
                // asp: number; ---> singleData.in
                // weather: number; ---> singleData.in

                // date: Date; ---> singleData.date
                // siteObjectId: string; ---> singleData.site.name
                // traffic: number; ---> singleData.in

                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];

                    if (detailKey === 'area') {
                        if (this.inputFormData.areaId === tempSingleData.objectId) {

                            this.trafficChartData.date = singleData.date;
                            this.trafficChartData.traffic = singleData.in;
                            this.trafficChartData.siteObjectId = singleData.site.objectId;
                            // this.trafficChartData.temperature = tempSingleData.;
                            // this.trafficChartData.revenue = tempSingleData.;
                            // this.trafficChartData.transaction = tempSingleData.;
                            // this.trafficChartData.conversion = tempSingleData.;
                            // this.trafficChartData.asp = tempSingleData.;
                            // this.trafficChartData.weather = tempSingleData.;
                        }
                    }
                }
                console.log(" - ", this.trafficChartData);
            }


            this.inputFormData.groupId = "";
            this.inputFormData.deviceId = "";
            await this.initSelectItemDeviceGroup();
            await this.initSelectItemDevice();
        } else {
            return false;
        }
    }

    async whenSelectedGroupId() {

        this.deviceGroupFilter = [];

        if (
            this.inputFormData.groupId !== undefined ||
            this.inputFormData.groupId !== ""
        ) {
            // 依照deviceGroup篩選
            for (const singleData of this.areaFilter) {

                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];

                    if (detailKey === 'deviceGroups') {
                        if (this.inputFormData.groupId === tempSingleData[0].objectId) {
                            this.deviceGroupFilter.push(singleData) ;
                        }
                    }
                }
                 console.log(" - ", this.deviceGroupFilter);
            }

            // 整理為Morris需要的資料格式
            for (const singleData of this.deviceGroupFilter) {
                // TODO: wait Min api
                // temperature: number; --->
                // revenue: number; ---> singleData.in
                // transaction: number; ---> singleData.in
                // conversion: number; ---> singleData.in
                // asp: number; ---> singleData.in
                // weather: number; ---> singleData.in

                // date: Date; ---> singleData.date
                // siteObjectId: string; ---> singleData.site.name
                // traffic: number; ---> singleData.in

                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];

                    if (detailKey === 'deviceGroups') {
                        if (this.inputFormData.groupId === tempSingleData[0].objectId) {

                            this.trafficChartData.date = singleData.date;
                            this.trafficChartData.traffic = singleData.in;
                            this.trafficChartData.siteObjectId = singleData.site.objectId;
                            // this.trafficChartData.temperature = tempSingleData.;
                            // this.trafficChartData.revenue = tempSingleData.;
                            // this.trafficChartData.transaction = tempSingleData.;
                            // this.trafficChartData.conversion = tempSingleData.;
                            // this.trafficChartData.asp = tempSingleData.;
                            // this.trafficChartData.weather = tempSingleData.;
                        }
                    }
                }
                  console.log(" - ", this.trafficChartData);
            }

            this.inputFormData.deviceId = "";
            await this.initSelectItemDevice();
        } else {
            return false;
        }
    }

    whenSelectedDeviceId() {
        // 依照devic篩選
        for (const singleData of this.deviceGroupFilter) {

            for (const detailKey in singleData) {
                const tempSingleData = singleData[detailKey];

                if (detailKey === 'device') {
                    if (this.inputFormData.deviceId === tempSingleData.objectId) {
                        this.deviceFilter.push(singleData) ;
                    }
                }
            }
            console.log(" - ", this.deviceFilter);
        }

        // 整理為Morris需要的資料格式
        for (const singleData of this.deviceFilter) {
            // TODO: wait Min api
            // temperature: number; --->
            // revenue: number; ---> singleData.in
            // transaction: number; ---> singleData.in
            // conversion: number; ---> singleData.in
            // asp: number; ---> singleData.in
            // weather: number; ---> singleData.in

            // date: Date; ---> singleData.date
            // siteObjectId: string; ---> singleData.site.name
            // traffic: number; ---> singleData.in

            for (const detailKey in singleData) {
                const tempSingleData = singleData[detailKey];

                if (detailKey === 'device') {
                    if (this.inputFormData.deviceId === tempSingleData.objectId) {

                        this.trafficChartData.date = singleData.date;
                        this.trafficChartData.traffic = singleData.in;
                        this.trafficChartData.siteObjectId = singleData.site.objectId;
                        // this.trafficChartData.temperature = tempSingleData.;
                        // this.trafficChartData.revenue = tempSingleData.;
                        // this.trafficChartData.transaction = tempSingleData.;
                        // this.trafficChartData.conversion = tempSingleData.;
                        // this.trafficChartData.asp = tempSingleData.;
                        // this.trafficChartData.weather = tempSingleData.;
                    }
                }
            }
            console.log(" - ", this.trafficChartData);
        }
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
        await this.initSelectItemArea();
        await this.initSelectItemDeviceGroup();
        await this.initSelectItemDevice();
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
