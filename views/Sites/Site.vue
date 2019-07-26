<template>
    <div class="animated fadeIn">
        <!--Site List-->
        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >
            <div
                key="transition_1"
                v-show="transition.step === 1"
            >
                <siteList
                    ref="siteTable"
                    v-on:pageToSiteView="pageToSiteView"
                    v-on:pageToSiteEdit="pageToSiteEdit"
                    v-on:pageToSiteAdd="pageToSiteAdd"
                    v-on:pageToAreaList="pageToAreaList"
                    v-on:pageToDeviceGroupList="pageToDeviceGroupList(1)"
                    v-on:selectedSite="selectedSite"
                ></siteList>
            </div>

            <!--Site Form (Add and Edit)-->
            <div
                key="transition_3_4"
                v-if="transition.step === 3  || transition.step === 4"
            >
                <siteForm
                    :site="site"
                    :transition="transition"
                    v-on:pageToSiteList="pageToSiteList"
                ></siteForm>
            </div>

            <!--Site View-->
            <div
                key="transition_2"
                v-if="transition.step === 2"
            >
                <siteView
                    :site="site"
                    v-on:pageToSiteList="pageToSiteList"
                ></siteView>
            </div>

            <!--Area List-->
            <div
                key="transition_5"
                v-show="transition.step === 5"
            >
                <siteAreaList
                    ref="areaTable"
                    :areaParams="areaParams"
                    v-on:pageToAreaView="pageToAreaView"
                    v-on:pageToAreaEdit="pageToAreaEdit"
                    v-on:pageToAreaAdd="pageToAreaAdd"
                    v-on:pageToSiteList="pageToSiteList"
                    v-on:pageToDeviceGroupList="pageToDeviceGroupList(5)"
                    v-on:selectedArea="selectedArea"
                ></siteAreaList>
            </div>

            <!--Area Form (Add and Edit)-->
            <div
                key="transition_7_8"
                v-if="transition.step === 7  || transition.step === 8"
            >

                <siteAreaForm
                    :site="site"
                    :area="area"
                    :transition="transition"
                    v-on:pageToAreaList="pageToAreaList"
                ></siteAreaForm>

            </div>

            <!--Area View-->
            <div
                key="transition_6"
                v-if="transition.step === 6"
            >
                <SiteAreaView
                    :site="site"
                    :area="area"
                    v-on:pageToAreaList="pageToAreaList"
                ></SiteAreaView>
            </div>

            <!--Device Group List-->
            <div
                key="transition_9"
                v-show="transition.step === 9"
            >
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

            <!--Device Form (Add and Edit)-->
            <div
                key="transition_11_12"
                v-if="transition.step === 11 || transition.step === 12"
            >
                <iv-auto-card :label="transition.step === 11 ? _('w_Site_AddDevice') :  _('w_Site_EditDevice')">
                    <template #toolbox>
                        <iv-toolbox-back @click="pageToDeviceGroupList(0)" />
                    </template>

                    <iv-form
                        :interface="IDeviceGroupForm()"
                        :value="deviceGroup"
                        @update:*="updateDeviceGroupForm($event)"
                        @submit="saveDeviceGroup($event)"
                    >

                        <template #siteName="{$attrs, $listeners}">
                            <iv-form-label
                                v-if="transition.step === 11"
                                v-bind="$attrs"
                                v-on="$listeners"
                                :value="site.name ? site.name : '' "
                            />
                            <iv-form-label
                                v-if="transition.step === 12"
                                v-bind="$attrs"
                                v-on="$listeners"
                                :value="deviceGroup.site ? deviceGroup.site.name : '' "
                            />
                        </template>

                        <template #areaName="{$attrs, $listeners}">
                            <iv-form-selection
                                v-if="transition.step === 11 && isEmptyObject(area)"
                                v-bind="$attrs"
                                :value="$attrs.value ? $attrs.value : ''"
                                v-on="$listeners"
                                :multiple="false"
                                :options="areaNameItem"
                            >
                            </iv-form-selection>

                            <iv-form-label
                                v-if="transition.step === 11 && !isEmptyObject(area)"
                                v-bind="$attrs"
                                v-on="$listeners"
                                :value="area ? area.name : '' "
                            />
                            <iv-form-label
                                v-if="transition.step === 12"
                                v-bind="$attrs"
                                v-on="$listeners"
                                :value="deviceGroup.area ? deviceGroup.area.name : '' "
                            />
                        </template>

                        <template #mode="{$attrs, $listeners}">
                            <iv-form-selection
                                v-if="transition.step === 11"
                                v-bind="$attrs"
                                :value="$attrs.value ? $attrs.value : ''"
                                v-on="$listeners"
                                :multiple="false"
                                :options="cameraModeItem"
                            >
                            </iv-form-selection>
                            <iv-form-label
                                v-if="transition.step === 12"
                                v-bind="$attrs"
                                v-on="$listeners"
                                :value="$attrs.value ? $attrs.value : ''"
                            />
                        </template>

                        <template #devices="{$attrs, $listeners}">
                            <iv-form-label
                                v-bind="$attrs"
                                v-on="$listeners"
                                :value="$attrs.value ? showDeviceDtail($attrs.value) : ''"
                            />
                        </template>

                    </iv-form>

                    <template #footer-before>
                        <b-button
                            variant="secondary"
                            size="lg"
                            @click="pageToDeviceGroupList(0)"
                        >{{ _('w_Back') }}
                        </b-button>
                    </template>

                </iv-auto-card>
            </div>

            <!--Device View-->
            <div
                key="transition_10"
                v-if="transition.step === 10"
            >
                <iv-card :label=" _('w_Site_ViewDevice')">

                    <template #toolbox>
                        <iv-toolbox-back @click="pageToDeviceGroupList(0)" />
                    </template>

                    <iv-form
                        :interface="IDeviceGroupView()"
                        :value="deviceGroup"
                    >

                        <template #siteName="{$attrs, $listeners}">
                            <iv-form-label
                                v-bind="$attrs"
                                v-on="$listeners"
                                :value="deviceGroup.site ? deviceGroup.site.name : '' "
                            />
                        </template>

                        <template #areaName="{$attrs, $listeners}">
                            <iv-form-label
                                v-bind="$attrs"
                                v-on="$listeners"
                                :value="deviceGroup.area ? deviceGroup.area.name : '' "
                            />
                        </template>

                        <template #deviceGroupName="{$attrs, $listeners}">
                            <iv-form-label
                                v-bind="$attrs"
                                v-on="$listeners"
                                :value="deviceGroup ? deviceGroup.name : '' "
                            />
                        </template>

                        <template #mode="{$attrs, $listeners}">
                            <iv-form-label
                                v-bind="$attrs"
                                v-on="$listeners"
                                :value="$attrs.value ? showDeviceModel($attrs.value) : ''"
                            />
                        </template>

                        <template #devices="{$attrs, $listeners}">
                            <iv-form-label
                                v-bind="$attrs"
                                v-on="$listeners"
                                :value="$attrs.value ? showDeviceDtail($attrs.value) : ''"
                            />
                        </template>

                    </iv-form>

                    <template #footer>
                        <b-button
                            variant="secondary"
                            size="lg"
                            @click="pageToDeviceGroupList(0)"
                        >{{ _('w_Back') }}
                        </b-button>
                    </template>
                </iv-card>
            </div>
        </iv-auto-transition>

    </div>

</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

// API Interface
import {
    ISiteAddData,
    ISiteEditData,
    IAreaAddData,
    IAreaEditData,
    IDeviceGroupAddData,
    IDeviceGroupEditData,
    ITagReadUpdate,
    IOfficeHourEditData
} from "@/config/default/api/interfaces";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import ServerConfig from "@/services/ServerConfig";
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
import Loading from "@/services/Loading";
// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

//sunComponent
import { SiteList } from "./SiteList.vue";
import { SiteView } from "./SiteView.vue";
import { SiteForm } from "./SiteForm.vue";
import { SiteAreaList } from "./SiteAreaList.vue";
import { SiteAreaForm } from "./SiteAreaForm.vue";
import { SiteAreaView } from "./SiteAreaView.vue";

interface IGoogleMap {
    src: string;
    zSize: string;
}

enum ECameraMode {
    peopleCounting = "People Counting",
    humanDetection = "Human Detection",
    heatmap = "Heatmap",
    dwellTime = "Dwell Time",
    demographic = "Demographic",
    visitor = "Visitor"
}

@Component({
    components: {
        siteList: SiteList,
        siteView: SiteView,
        siteForm: SiteForm,
        siteAreaList: SiteAreaList,
        siteAreaForm: SiteAreaForm,
        SiteAreaView: SiteAreaView
    }
})
export default class Site extends Vue {
    serverUrl = ServerConfig.url;
    newImg = new Image();
    tableMultiple = false;
    newImgSrc = "";
    isMounted = false;

    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    //google map
    googleMap: IGoogleMap = {
        src: "https://maps.google.com/maps?output=embed",
        zSize: "16"
    };

    //site datas
    sites = {};
    site: any = {};
    gooleMapSrc = "";

    //area datas
    isSelectArea = false;
    areaPhotoSrc = "";
    areaMapSrc = "";
    areas = {};
    area: any = {};
    areaParams = {};
    areaAll = [];

    //device Group datas
    isSelectDeviceGroup = false;
    deviceGroups = {};
    deviceGroup: any = {};
    deviceGroupParams = {};
    deviceGroupAll = [];

    //device datas
    devicesGroupDevices = [];
    devicesGroupDevice = {};
    devices = [];
    device = {};

    //options
    managerItem = [];
    tagItem = [];
    officeHourItem = [];
    deviceTypeItem = {};
    deviceNameItem = [];
    areaNameItem = [];
    cameraModeItem = [];

    created() {}

    mounted() {
        this.isMounted = true;
        this.pageToSiteList();
    }

    pageToAreaList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 5;
        this.clearDeviceData();
        (this.$refs.areaTable as any).reload();
    }

    pageToAreaView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 6;
    }

    pageToAreaAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 7;
        this.clearAreaData();
    }

    pageToAreaEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 8;
    }

    pageToDeviceGroupList(lastPageStep) {
        this.transition.prevStep = lastPageStep
            ? lastPageStep
            : lastPageStep
            ? lastPageStep
            : this.transition.step;
        this.transition.step = 9;
        this.initCameraItem();
        (this.$refs.deviceGroupTable as any).reload();
    }

    pageToDeviceGroupView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 10;
        this.newImgSrc = this.serverUrl + this.site.imageSrc;
    }

    pageToDeviceGroupAdd(lastPageStep) {
        this.transition.prevStep = lastPageStep
            ? lastPageStep
            : this.transition.step;
        this.transition.step = 11;
        this.clearDeviceData();
        this.initDeviceTypeItem();
    }

    pageToDeviceGroupEdit(lastPageStep) {
        this.transition.prevStep = lastPageStep
            ? lastPageStep
            : this.transition.step;
        this.transition.step = 12;
        this.initDeviceTypeItem();
    }

    initCameraItem() {
        this.cameraModeItem = [
            { id: "peopleCounting", text: ECameraMode.peopleCounting },
            { id: "humanDetection", text: ECameraMode.humanDetection },
            { id: "heatmap", text: ECameraMode.heatmap },
            { id: "dwellTime", text: ECameraMode.dwellTime },
            { id: "demographic", text: ECameraMode.demographic },
            { id: "visitor", text: ECameraMode.visitor }
        ];
    }

    pageToSiteList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        this.clearAreaData();
        this.clearDeviceData();
        (this.$refs.siteTable as any).reload();
    }

    pageToSiteView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
    }

    pageToSiteAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        this.clearSiteData();
    }

    pageToSiteEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 4;
        this.newImgSrc = this.serverUrl + this.site.imageSrc;
    }

    async initDeviceNameItem() {
        this.deviceNameItem = [];

        let body: {
            paging: {
                page: number;
                pageSize: number;
            };
        } = {
            paging: {
                page: 1,
                pageSize: 999
            }
        };

        await this.$server
            .R("/device", body)
            .then((response: any) => {
                for (let item of response.results) {
                    let device = {
                        id: item.objectId,
                        text: item.name,
                        type: item.mode
                    };
                    this.deviceNameItem.push(device);
                }
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initDeviceTypeItem() {
        this.deviceTypeItem = {
            peopleCounting: "People Counting",
            dwellTime: "Dwell Time",
            demographic: "Demographic",
            heatmap: "Heatmap",
            visitor: "Visitor",
            humanDetection: "Human Detection"
        };

        this.initDeviceNameItem();
    }

    async initAreaNameItem() {
        this.areaNameItem = [];

        let body: {
            siteId: string;
        } = {
            siteId: this.site.objectId
        };

        await this.$server
            .R("/location/area/all", body)
            .then((response: any) => {
                for (let item of response) {
                    let area = { id: item.objectId, text: item.name };
                    this.areaNameItem.push(area);
                }
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async updateDevicePosition() {
        const datas: IAreaEditData[] = [
            {
                objectId: "data.objectId",
                name: "data.name"
            }
        ];

        const editAreaParam = { datas };
        Loading.show();
        await this.$server
            .U("/location/area", editAreaParam)
            .then((response: any) => {
                Loading.hide();
                if (response != undefined) {
                    Dialog.success(this._("w_Site_EditAreaSuccess"));
                    this.pageToAreaList();
                }
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async saveDeviceGroup(data) {
        if (this.transition.step === 11) {
            const datas: IDeviceGroupAddData[] = [
                {
                    areaId: this.area.objectId
                        ? this.area.objectId
                        : data.areaName,
                    name: data.name,
                    mode: data.mode
                }
            ];

            const addDeviceGroupParam = { datas };
            Loading.show();
            await this.$server
                .C("/device/group", addDeviceGroupParam)
                .then((response: any) => {
                    Loading.hide();
                    if (response != undefined) {
                        Dialog.success(this._("w_Site_AddDeviceGroupSuccess"));
                        this.pageToDeviceGroupList(0);
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else if (this.transition.step === 12) {
            const datas: IDeviceGroupEditData[] = [
                {
                    objectId: data.objectId,
                    name: data.name
                }
            ];

            const editDeviceGroupParam = { datas };
            Loading.show();
            await this.$server
                .U("/device/group", editDeviceGroupParam)
                .then((response: any) => {
                    Loading.hide();
                    if (response != undefined) {
                        Dialog.success(this._("w_Site_EditDeviceGroupSuccess"));
                        this.pageToDeviceGroupList(0);
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        }
    }

    async deleteGroupDevice() {
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
                    Loading.hide();
                    if (response) {
                        for (const returnValue of response) {
                            if (returnValue.statusCode === 200) {
                                (this.$refs.deviceGroupTable as any).reload();
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
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        });
    }

    updateDeviceGroupForm(data) {
        if (data) {
            this.deviceGroup[data.key] = data.value;
        }
    }

    selectedDeviceGroup(data) {
        this.newImgSrc = "";
        if (data && data.objectId) {
            this.deviceGroup = this.isSelectDeviceGroup = data;
        } else {
            this.clearDeviceData();
        }
    }

    selectedArea(data) {
        if (data && data.objectId) {
            this.area = data;
            this.deviceGroupParams = {
                areaId: data.objectId
            };
        } else {
            this.clearAreaData();
        }
    }

    selectedSite(data) {
        if (data && data.objectId) {
            this.site = data;

            this.areaParams = {
                siteId: data.objectId
            };
            this.deviceGroupParams = {
                siteId: data.objectId
            };
            this.initAreaNameItem();
        } else {
            this.clearSiteData();
        }
    }

    pageSize(data) {
        // TODO: do something?
        console.log("pageSize", data);
    }

    clearDeviceData() {
        this.isSelectDeviceGroup = false;
        this.newImgSrc = "";
        this.deviceGroup = {};
    }

    clearAreaData() {
        this.isSelectArea = false;
        this.newImgSrc = "";
        this.areaPhotoSrc = "";
        this.area = {};
    }

    clearSiteData() {
        this.gooleMapSrc = "";
        this.newImgSrc = "";
        this.site = { latitude: 0, longitude: 0 };
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

    showDeviceModel(datas) {
        if (datas) {
            if (
                this.cameraModeItem.filter(b => b.id == datas).map(c => c.text)
            ) {
                return this.cameraModeItem
                    .filter(b => b.id == datas)
                    .map(c => c.text)[0];
            }
        }
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

    IDeviceGroupForm() {
        return `interface {

                /**
                 * @uiLabel - ${this._("w_Site_SiteName")}
                 */
                siteName?: any;

                 /**
                 * @uiLabel - ${this._("w_Site_AreaName")}
                 */
                areaName?: any;

                /**
                 * @uiLabel - ${this._("w_Site_GroupName")}
                 * @uiPlaceHolder - ${this._("w_Site_GroupName")}
                 * @uiType - iv-form-string
                 */
                name: string;

                  /**
                * @uiLabel - ${this._("w_Site_Model")}
                */
                mode: any;

            }`;
    }

    IDeviceGroupView() {
        return `interface {

                 /**
                 * @uiLabel - ${this._("w_Site_SiteName")}
                 * @uiType - iv-form-label
                 */
                siteName?: string;

                 /**
                 * @uiLabel - ${this._("w_Site_AreaName")}
                 * @uiType - iv-form-label
                 */
                areaName?: string;

                  /**
                 * @uiLabel - ${this._("w_Site_GroupName")}
                 * @uiType - iv-form-label
                 */
                deviceGroupName?: string;

                /**
                * @uiLabel - ${this._("w_Site_Model")}
                * @uiType - iv-form-label
                */
                mode: string;

                /**
                * @uiLabel - ${this._("w_Site_Devices")}
                * @uiType - iv-form-label
                */
                devices?: string;

            }`;
    }

    isEmptyObject(obj) {
        for (var key in obj) {
            return false;
        }
        return true;
    }
}
</script>

<style lang="scss" scoped>
.googleMap {
    padding: 16px;
}
.imgSide {
    max-width: 200px;
    min-width: 200px;
    max-height: none;
    min-height: auto;
    height: 100%;
    margin-bottom: 10px;
}

.demo-control-row-view {
    width: 98%;
    .demo-control-view {
        margin: 10px;
    }
}
</style>


