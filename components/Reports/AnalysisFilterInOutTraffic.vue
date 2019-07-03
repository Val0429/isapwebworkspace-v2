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
    timeModeSelectItem: object;

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
    // timeModeSelectItem: any = {
    //     hour: ECountType.hour,
    //     day: ECountType.day,
    //     week: ECountType.week,
    //     month: ECountType.month,
    //     season: ECountType.quarter,
    //     year: ECountType.year
    // };

    inputFormData: any = {
        areaId: "all",
        groupId: "all",
        deviceId: "all",
        type: "day",
        inOrOut: "in"
    };

    created() {}

    mounted() {
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

    async whenSelectedAreaId() {
        this.$emit("area_id", this.inputFormData.areaId);
    }

    async whenSelectedGroupId() {
        this.$emit("group_id", this.inputFormData.groupId);
    }

    async whenSelectedDeviceId() {
        this.$emit("device_id", this.inputFormData.deviceId);
    }

    whenSelectedType() {
        this.$emit("type", this.inputFormData.type);
    }

    whenSelectedInOrOut() {
        this.$emit("in_or_out", this.inputFormData.inOrOut);
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
                type?: ${toEnumInterface(this.timeModeSelectItem as any, false)};


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
