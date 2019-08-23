<template>
    <div class="animated fadeIn">
        <iv-card :label=" _('w_Site_DeviceGroupList')">

            <template #toolbox>

                <iv-toolbox-view
                    :disabled="!isSelectDeviceGroup"
                    @click="pageToDeviceGroupView()"
                />
                <iv-toolbox-edit
                    :disabled="!isSelectDeviceGroup"
                    @click="pageToDeviceGroupEdit(9)"
                />
                <iv-toolbox-delete
                    :disabled="!isSelectDeviceGroup"
                    @click="deleteGroupDevice()"
                />

                <iv-toolbox-divider />
                <iv-toolbox-add @click="pageToDeviceGroupAdd(9)" />
                <iv-toolbox-back @click="transition.prevStep === 1? pageToSiteList() : pageToAreaList()" />

            </template>

            <iv-table
                ref="deviceGroupTable"
                :interface="IDeviceGroupList()"
                @selected="selectedDeviceGroup($event)"
                :multiple="tableMultiple"
                :server="{path: '/device/group' }"
                :params="deviceGroupParams"
            >
                <template #siteName="{$attrs, $listeners}">
                    {{$attrs.row.site ? $attrs.row.site.name : '' }}
                </template>

                <template #areaName="{$attrs, $listeners}">
                    {{$attrs.row.area ? $attrs.row.area.name : '' }}
                </template>

                <template #deviceGroupName="{$attrs, $listeners}">
                    {{$attrs.row.name ? $attrs.row.name : '' }}
                </template>

                <template #devices="{$attrs, $listeners}">
                    <label :title="showDeviceDtail($attrs.row.devices)">{{showDevices($attrs.row.devices)}}</label>
                </template>

            </iv-table>

        </iv-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";
@Component({})
export class SiteDeviceGroupList extends Vue {
    @Prop({
        type: Object,
        default: () => {
            return {};
        }
    })
    deviceGroupParams: object;

    @Prop({
        type: Object,
        default: () => {
            return {};
        }
    })
    transition;

    tableMultiple = false;

    //site datas
    site: any = {};

    //device Group datas
    isSelectDeviceGroup = false;
    deviceGroup: any = {};

    created() {}

    mounted() {}

    reload() {
        (this.$refs.deviceGroupTable as any).reload();
    }

    async deleteGroupDevice() {
        console.log("deleteGroupDevice", this.deviceGroup);
        Dialog.confirm(this._("w_DeleteConfirm"), this._("w_Confirm"), () => {
            const body: {
                objectId: string;
            } = {
                objectId: this.deviceGroup.objectId
            };

            Loading.show();
            this.$server
                .D("/device/group", body)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            for (const returnValue of response.datas) {
                                if (returnValue.statusCode === 200) {
                                    Dialog.success(this._("w_Success"));
                                    (this.$refs
                                        .deviceGroupTable as any).reload();
                                }
                                if (
                                    returnValue.statusCode === 500 ||
                                    returnValue.statusCode === 400
                                ) {
                                    Dialog.error(this._("w_DeleteFailed"));
                                    return false;
                                }
                            }
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        });
    }

    showDeviceDtail(datas) {
        let modalContext = "";
        if (datas) {
            for (let data of datas) {
                if (data) {
                    modalContext += data.mode + " : " + data.count + ",";
                }
            }
            return modalContext.slice(0, -1);
        }
    }

    showDevices(datas) {
        let count = 0;
        if (datas) {
            for (let data of datas) {
                count += data.count;
            }
        }
        return count;
    }

    selectedDeviceGroup(data) {
        this.isSelectDeviceGroup = false;
        if (data && data.objectId) {
            this.deviceGroup = this.isSelectDeviceGroup = data;
        }
        this.$emit("selectedDeviceGroup", data);
    }

    pageToDeviceGroupView() {
        this.$emit("pageToDeviceGroupView");
    }

    pageToDeviceGroupEdit() {
        this.$emit("pageToDeviceGroupEdit");
    }

    pageToDeviceGroupAdd() {
        this.$emit("pageToDeviceGroupAdd");
    }

    pageToSiteList() {
        this.$emit("pageToSiteList");
    }

    pageToAreaList() {
        this.$emit("pageToAreaList");
    }

    IDeviceGroupList() {
        return `interface {
                 /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;

                 /**
                 * @uiLabel - ${this._("w_Site_SiteName")}
                 */
                siteName: string;

                 /**
                 * @uiLabel - ${this._("w_Site_AreaName")}
                 */
                areaName: string;

                /**
                * @uiLabel - ${this._("w_Site_DeviceGroup")}
                */
                deviceGroupName: string;

                /**
                * @uiLabel - ${this._("w_Site_Model")}
                */
                mode: string;

                /**
                * @uiLabel - ${this._("w_Site_Devices")}
                */
                devices: string;
            }`;
    }
}
export default SiteDeviceGroupList;
Vue.component("siteDeviceGroupList", SiteDeviceGroupList);
</script>

<style lang="scss" scoped>
</style>
