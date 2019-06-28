<template>
    <div>
        <iv-form
            :interface="IAnalysisFilterForm()"
            @update:areaId="whenSelectedAreaId($event)"
            @update:groupId="whenSelectedGroupId($event)"
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

            <template #clickButtonsSubmit>
                <b-button
                    class="h-25 ml-3 click_button submit col-md-1"
                    @click="doSubmit"
                >
                    {{ _('wb_Submit') }}
                </b-button>

            </template>

            <template #clickButtonsReset>
                <b-button
                    class="h-25 ml-2 click_button reset col-md-1"
                    @click="doReset"
                >
                    {{ _('wb_Reset') }}
                </b-button>
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
import ResponseFilter from "@/services/ResponseFilter";
let config = require("@/config/default/debug");

enum EType {
    in = "in",
    out = "out"
}

@Component({
    components: {}
})
export class AnalysisFilterInOut extends Vue {
    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: ""
    })
    firstSiteId: string;

    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: ""
    })
    deviceMode: string;

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
        season: ECountType.season,
        year: ECountType.year
    };

    inputFormData: any = {
        areaId: "",
        groupId: "",
        deviceId: "",
        type: "",
        inOrOut: "in"
    };

    created() {}

    mounted() {
        this.initSelectItemArea();
        this.initSelectItemDeviceGroup();
        this.initSelectItemDevice();

    }

    @Watch("firstSiteId", { deep: true })
    private onfirstSiteIdChanged(newVal, oldVal) {
        this.initSelectItemArea();
        this.initSelectItemDeviceGroup();
        this.initSelectItemDevice();
    }

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

    async whenSelectedAreaId() {
        if (
            this.inputFormData.areaId !== undefined ||
            this.inputFormData.areaId !== ""
        ) {
            this.inputFormData.groupId = "";
            this.inputFormData.deviceId = "";
            await this.initSelectItemDeviceGroup();
            await this.initSelectItemDevice();
        } else {
            return false;
        }
    }

    async whenSelectedGroupId() {
        if (
            this.inputFormData.groupId !== undefined ||
            this.inputFormData.groupId !== ""
        ) {
            this.inputFormData.deviceId = "";
            await this.initSelectItemDevice();
        } else {
            return false;
        }
    }

    doSubmit() {
        // TODO: wait api
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


                /**
                 * @uiColumnGroup - analysis
                 */
                clickButtonsSubmit?: any;


                /**
                 * @uiColumnGroup - analysis
                 */
                clickButtonsReset?: any;

            }
        `;
    }
}

export default AnalysisFilterInOut;
Vue.component("analysis_filter_in_out", AnalysisFilterInOut);
</script>

<style lang="scss" scoped>
.click_button {
    margin-top: 27px;
}
.submit {
    background-color: #5c7895;
    border: 1px solid #5c7895;
}
.reset {
    background-color: #d7d7d7;
    border: 1px solid #d7d7d7;
}
</style>
