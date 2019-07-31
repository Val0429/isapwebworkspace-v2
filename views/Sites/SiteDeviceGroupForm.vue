<template>
    <div class="animated fadeIn">
        <iv-auto-card :label="transition.step === 11 ? _('w_Site_AddDevice') :  _('w_Site_EditDevice')">
            <template #toolbox>
                <iv-toolbox-back @click="pageToDeviceGroupList()" />
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
                        v-if="transition.step === 11 && isEmptyObject(area.objectId)"
                        v-bind="$attrs"
                        :value="$attrs.value ? $attrs.value : ''"
                        v-on="$listeners"
                        :multiple="false"
                        :options="areaNameItem"
                    >
                    </iv-form-selection>

                    <iv-form-label
                        v-if="transition.step === 11 && !isEmptyObject(area.objectId)"
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
                    @click="pageToDeviceGroupList()"
                >{{ _('w_Back') }}
                </b-button>
            </template>

        </iv-auto-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";
import {
    IDeviceGroupAddData,
    IDeviceGroupEditData
} from "@/config/default/api/interfaces";

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

@Component({})
export class SiteDeviceGroupForm extends Vue {
    @Prop({
        type: Object,
        default: () => {
            return {};
        }
    })
    site: any;

    @Prop({
        type: Object,
        default: () => {
            return {};
        }
    })
    area: any;

    @Prop({
        type: Object,
        default: () => {
            return {};
        }
    })
    deviceGroup: any;

    @Prop({
        type: Object,
        default: () => {
            return {};
        }
    })
    transition;

    //options
    cameraModeItem = [];
    areaNameItem = [];

    created() {}

    mounted() {
        this.initCameraItem();
        this.initAreaNameItem();
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
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (let item of response) {
                        let area = { id: item.objectId, text: item.name };
                        this.areaNameItem.push(area);
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
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

    updateDeviceGroupForm(data) {
        if (data) {
            this.deviceGroup[data.key] = data.value;
        }
    }

    async saveDeviceGroup(data) {
        let threshold = { high: data.high, medium: data.medium, low: data.low };
        if (this.transition.step === 11) {
            const datas: IDeviceGroupAddData[] = [
                {
                    areaId: this.area.objectId
                        ? this.area.objectId
                        : data.areaName,
                    name: data.name,
                    mode: data.mode,
                    threshold: threshold
                }
            ];

            const addDeviceGroupParam = { datas };
            Loading.show();
            await this.$server
                .C("/device/group", addDeviceGroupParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(
                                this._("w_Site_AddDeviceGroupSuccess")
                            );
                            this.pageToDeviceGroupList();
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else if (this.transition.step === 12) {
            const datas: IDeviceGroupEditData[] = [
                {
                    objectId: data.objectId,
                    name: data.name,
                    threshold: threshold
                }
            ];

            const editDeviceGroupParam = { datas };
            Loading.show();
            await this.$server
                .U("/device/group", editDeviceGroupParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(
                                this._("w_Site_EditDeviceGroupSuccess")
                            );
                            this.pageToDeviceGroupList();
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        }
    }

    isEmptyObject(obj) {
        for (var key in obj) {
            return false;
        }
        return true;
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

    pageToDeviceGroupList() {
        this.$emit("pageToDeviceGroupList");
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

                  /**
                 * @uiLabel - ${this._("w_Site_High")}
                 * @uiType - iv-form-number
                 * @uiColumnGroup - threshold 
                 */
                high?:number;

                 /**
                 * @uiLabel - ${this._("w_Site_Medium")}
                 * @uiType - iv-form-number
                 * @uiColumnGroup - threshold 
                 */
                medium?:number;

                 /**
                 * @uiLabel - ${this._("w_Site_Low")}
                 * @uiType - iv-form-number
                 * @uiColumnGroup - threshold 
                 */
                low?:number;

            }`;
    }
}
export default SiteDeviceGroupForm;
Vue.component("siteDeviceGroupForm", SiteDeviceGroupForm);
</script>

<style lang="scss" scoped>
</style>
