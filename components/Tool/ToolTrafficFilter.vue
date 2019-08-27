<template>
    <div>
        <iv-auto-card
            :visible="visible"
            :label="_('w_ReportFilterConditionComponent_')"
        >
            <iv-form
                :interface="IFilterConditionForm()"
                :value="inputFormData"
                @update:*="updateInputFormData($event)"
                @submit="doSubmit($event)"
            >

                <template #siteId="{ $attrs, $listeners }">
                    <iv-form-selection
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.siteId"
                    >
                    </iv-form-selection>
                </template>

                <template #areaId="{ $attrs, $listeners }">
                    <iv-form-selection
                        v-if="inputFormData.siteId"
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.areaId"
                    >
                    </iv-form-selection>
                </template>

                <template #deviceGroupId="{ $attrs, $listeners }">
                    <iv-form-selection
                        v-if="inputFormData.siteId && inputFormData.areaId"
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.deviceGroupId"
                    >
                    </iv-form-selection>
                </template>

                <template #deviceId="{ $attrs, $listeners }">
                    <iv-form-selection
                        v-if="inputFormData.siteId && inputFormData.areaId && inputFormData.deviceGroupId"
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.deviceId"
                    >
                    </iv-form-selection>
                </template>

                <template #hour="{ $attrs, $listeners }">
                    <iv-form-selection
                        v-bind="$attrs"
                        v-on="$listeners"
                    >
                    </iv-form-selection>
                </template>

            </iv-form>

        </iv-auto-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import { toEnumInterface } from "../../../core";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
import { IRepeatVisitorFilter, ITrafficFilter } from "./ITool";
import { EDeviceMode } from "@/components/Reports";
@Component({
    components: {}
})
export class ToolTrafficFilter extends Vue {
    siteSelectItem: any = {};
    areaSelectItem: any = {};
    deviceGroupSelectItem: any = {};
    deviceSelectItem: any = {};
    isIncludedEmployeeSelectItem: any = {};
    inOrOutTypeSelectItem: any = {};
    hourSelectItem: any = {};

    // 收合card控制
    visible: boolean = true;

    inputFormData: ITrafficFilter = {
        siteId: "",
        areaId: "",
        deviceGroupId: "",
        deviceId: "",
        isEmployee: "false",
        isIn: "true",
        startDate: new Date(),
        endDate: new Date(),
        hour: 10,
        date: new Date()
    };

    created() {
        this.initSelectItemSite();
        this.initSelectItem();
    }

    mounted() {}

    initSelectItem() {
        this.isIncludedEmployeeSelectItem = {
            true: this._("w_yes"),
            false: this._("w_no")
        };

        this.inOrOutTypeSelectItem = {
            true: this._("w_In"),
            false: this._("w_Out")
        };

        for (let i = 0; i < 24; i++) {
            const tempHour =
                i === 24 ? "00" : i < 10 ? "0" + i.toString() : i.toString();
            const tempValue =
                tempHour + ":00" + (i < 12 || i > 23 ? " am" : " pm");
            // const tempObject = { id: i.toString(), text: tempValue };
            // this.hourSelectItem.push(tempObject);

            this.hourSelectItem[i] = tempValue;
        }
    }

    async updateInputFormData(data) {
        switch (data.key) {
            case "siteId":
                if (this.inputFormData.siteId) {
                    this.initSelectItemArea(this.inputFormData.siteId);
                } else {
                    this.inputFormData.areaId = "";
                    this.inputFormData.deviceGroupId = "";
                    this.inputFormData.deviceId = "";
                }
                break;
            case "areaId":
                if (this.inputFormData.siteId && this.inputFormData.areaId) {
                    this.initSelectItemDeviceGroup(
                        this.inputFormData.siteId,
                        this.inputFormData.areaId
                    );
                } else {
                    this.inputFormData.deviceGroupId = "";
                    this.inputFormData.deviceId = "";
                }
                break;
            case "deviceGroupId":
                if (
                    this.inputFormData.siteId &&
                    this.inputFormData.areaId &&
                    this.inputFormData.deviceGroupId
                ) {
                    this.initSelectItemDevice(
                        this.inputFormData.siteId,
                        this.inputFormData.areaId,
                        this.inputFormData.deviceGroupId
                    );
                } else {
                    this.inputFormData.deviceId = "";
                }
                break;
        }
    }

    async initSelectItemSite() {
        this.siteSelectItem = {};
        let tempSiteSelectItem = {};

        const readAllSiteParam: {
            type: string;
        } = {
            type: "all"
        };

        await this.$server
            .R("/location/site/all", readAllSiteParam)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response) {
                        tempSiteSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                    this.siteSelectItem = tempSiteSelectItem;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemArea(siteId: string) {
        let tempAreaSelectItem = {};

        const readParam: {
            siteId: string;
        } = {
            siteId: siteId
        };

        if (!siteId) {
            return false;
        }

        await this.$server
            .R("/location/area/all", readParam)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response) {
                        tempAreaSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                    this.areaSelectItem = tempAreaSelectItem;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemDeviceGroup(siteId: string, areaId: string) {
        let tempDeviceGroupSelectItem = {};
        this.deviceGroupSelectItem = {};

        let readParam: {
            siteId: string;
            areaId?: string;
            mode: string;
        } = {
            siteId: siteId,
            areaId: areaId,
            mode: EDeviceMode.peopleCounting
        };

        if (!siteId && !areaId) {
            return false;
        }

        await this.$server
            .R("/device/group/all", readParam)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response) {
                        tempDeviceGroupSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                    this.deviceGroupSelectItem = tempDeviceGroupSelectItem;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemDevice(
        siteId: string,
        areaId: string,
        deviceGroupId: string
    ) {
        let tempDeviceSelectItem = {};
        this.deviceSelectItem = {};

        const readParam: {
            siteId: string;
            areaId: string;
            deviceGroupId: string;
            mode: string;
        } = {
            siteId: siteId,
            areaId: areaId,
            deviceGroupId: deviceGroupId,
            mode: EDeviceMode.peopleCounting
        };

        if (!siteId && !areaId && !deviceGroupId) {
            return false;
        }

        await this.$server
            .R("/device", readParam)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (
                        response.results != undefined &&
                        response.results.length > 0
                    ) {
                        for (const returnValue of response.results) {
                            tempDeviceSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceSelectItem = tempDeviceSelectItem;
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async doSubmit(data) {
        const submitParam: ITrafficFilter = {
            siteId: data.siteId,
            areaId: data.areaId,
            deviceGroupId: data.deviceGroupId ? data.deviceGroupId : undefined,
            deviceId: data.deviceId ? data.deviceId : undefined,
            isEmployee: data.isEmployee,
            isIn: data.isIn,
            startDate: new Date(
                data.date.getFullYear(),
                data.date.getMonth(),
                data.date.getDate(),
                Number(data.hour)
            ).toISOString(),
            endDate: new Date(
                data.date.getFullYear(),
                data.date.getMonth(),
                data.date.getDate(),
                Number(data.hour) + 1
            ).toISOString()
        };

        console.log(' ~ ', new Date(
            data.date.getFullYear(),
            data.date.getMonth(),
            data.date.getDate(),
            data.hour + 1
        ))

        if (data.isEmployee === "true") {
            submitParam.isEmployee = true;
        } else if (data.isEmployee === "false") {
            submitParam.isEmployee = false;
        } else {
            submitParam.isEmployee = undefined;
        }

        if (data.isIn === "true") {
            submitParam.isIn = true;
        } else if (data.isIn === "false") {
            submitParam.isIn = false;
        } else {
            submitParam.isIn = undefined;
        }

        this.visible = false;
        this.$emit("filter", submitParam);
    }

    IFilterConditionForm() {
        return `
            interface {


                /**
                 * @uiLabel - ${this._("w_Sites")}
                * @uiColumnGroup - row1
                 */
                siteId: ${toEnumInterface(this.siteSelectItem as any, false)};

                                /**
                 * @uiLabel - ${this._("w_Areas")}
                 * @uiColumnGroup - row1
                 */
                areaId: ${toEnumInterface(this.areaSelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_DeviceGroups")}
                 * @uiColumnGroup - row1
                 */
                deviceGroupId?: ${toEnumInterface(
                    this.deviceGroupSelectItem as any,
                    false
                )};


                /**
                 * @uiLabel - ${this._("w_Devices")}
                 * @uiColumnGroup - row1
                 */
                deviceId?: ${toEnumInterface(
                    this.deviceSelectItem as any,
                    false
                )};


                /**
                 * @uiLabel - ${this._("w_isIncludedEmployee")}
                 * @uiColumnGroup - row2
                 */
                isEmployee: ${toEnumInterface(
                    this.isIncludedEmployeeSelectItem as any,
                    false
                )};


                /**
                 * @uiLabel - ${this._("w_InOutType")}
                 * @uiColumnGroup - row2
                 */
                isIn: ${toEnumInterface(
                    this.inOrOutTypeSelectItem as any,
                    false
                )};


                /**
                * @uiLabel - ${this._("w_BOSalesRecords_Date")}
                * @uiPlaceHolder - ${this._("w_BOSalesRecords_Date")}
                * @uiType - iv-form-date
                * @uiColumnGroup - row2

                 */
                date: any;


                /**
                 * @uiLabel - ${this._("w_BOSalesRecords_Hour")}
                 * @uiColumnGroup - row2
                 */
                hour: ${toEnumInterface(this.hourSelectItem as any, false)};

            }
        `;
    }
}

export default ToolTrafficFilter;
Vue.component("tool-traffic-filter", ToolTrafficFilter);
</script>

<style lang="scss" scoped>
</style>
