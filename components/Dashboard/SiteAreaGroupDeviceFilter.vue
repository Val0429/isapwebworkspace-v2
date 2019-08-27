<template>
    <div>

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <iv-form
                key="transition_1"
                v-show="transition.step === 1"
                :interface="IFilterConditionForm()"
                :value="inputFormData"
                @update:*="updateInputFormData($event)"
            >

                <template #type="{ $attrs, $listeners }">
                    <iv-form-selection
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.type"
                    >
                    </iv-form-selection>
                </template>

                <template #siteId="{$attrs, $listeners}">

                    <p class="col-md-12 mb-2">* {{ _('w_Site') }}</p>

                    <iv-form-selection
                        v-on="$listeners"
                        v-model="inputFormData.siteId"
                        class="col-md-9"
                        :options="siteSelectItem"
                        :multiple="false"
                    >
                    </iv-form-selection>

                    <div class="col-md-3">
                        <b-button
                            class="col-md-12"
                            variant="outline-secondary"
                            @click="pageToChooseTree"
                        >
                            {{ _('w_SelectSiteTree') }}
                        </b-button>
                    </div>

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

            </iv-form>

            <region-tree-select
                key="transition_2"
                v-show="transition.step === 2"
                :multiple="false"
                :regionTreeItem="regionTreeItem"
                :selectType="selectType"
                :selecteds="selecteds"
                v-on:click-back="pageToShowResult"
            >
            </region-tree-select>

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import { toEnumInterface } from "../../../core";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";
import { EDeviceMode } from "@/components/Reports";

import ReportService from "../Reports/models/ReportService";
import RegionAPI from "../RegionTree/models/RegionAPI";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Region Tree
import {
    IRegionTreeSelected,
    RegionTreeItem,
    ERegionType
} from "../RegionTree";
import { EMode } from '.';

@Component({
    components: {}
})
export class SiteAreaGroupDeviceFilter extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    metricSelectItem: any = {};
    siteSelectItem: any = [];
    areaSelectItem: any = {};
    deviceGroupSelectItem: any = {};
    deviceSelectItem: any = {};

    inputFormData: any = {
        siteId: "",
        areaId: "",
        deviceGroupId: "",
        deviceId: "",
        type: EMode.peopleCounting
    };

    // tree
    selectType = ERegionType.site;
    regionTreeItem = new RegionTreeItem();
    selecteds: IRegionTreeSelected[] = [];

    created() {
        this.initSelectItem();
        this.siteFilterPermission();
        this.initRegionTreeSelect();
        this.initSelectItemTree();
    }

    mounted() {}

    initSelectItem() {
        this.metricSelectItem = {
            peopleCounting: this._("w_Navigation_RuleAndActions_Traffic"),
            humanDetection: this._("w_Navigation_RuleAndActions_Occupancy"),
            demographic: this._("w_Navigation_VideoSources_Demographic"),
            dwellTime: this._("w_Navigation_VideoSources_DwellTime"),
            visitor: this._("w_ReportDashboard_RepeatCustomer1"),
            vip: this._("w_VIPAndBlackList_TableTitleVip"),
            black: this._("w_VIPAndBlackList_TableTitleBlacklist")
        };

    }

    initRegionTreeSelect() {
        this.regionTreeItem = new RegionTreeItem();
        this.regionTreeItem.titleItem.card = this._("w_SiteTreeSelect");
    }

    siteFilterPermission() {
        for (const detail of this.$user.user.allowSites) {
            let site = { id: detail.objectId, text: detail.name };
            this.siteSelectItem.push(site);
        }
    }

    async initSelectItemTree() {
        await this.$server
            .R("/location/tree")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    let tempTree = ReportService.resolveUserSite(
                        this,
                        response
                    );
                    this.regionTreeItem.tree = RegionAPI.analysisApiResponse(
                        tempTree
                    );
                    this.regionTreeItem.region = this.regionTreeItem.tree;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async pageToChooseTree() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;

        this.selecteds = [];

            for (const detail of this.siteSelectItem) {
                if (this.inputFormData.siteId === detail.id) {
                    let selectedsObject: IRegionTreeSelected = {
                        objectId: detail.id,
                        type: ERegionType.site,
                        name: detail.text
                    };
                    this.selecteds.push(selectedsObject);
                }
            }

    }

    async pageToShowResult() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;


        // siteId clear
        this.inputFormData.siteId = "";

        // from selecteds push siteId
        if (this.selecteds.length > 0) {
            this.inputFormData.siteId = this.selecteds[
                this.selecteds.length - 1
            ].objectId;
            await this.initSelectItemArea(this.inputFormData.siteId);
        }

        this.$emit("filter-data", this.inputFormData);
    }

    async updateInputFormData(data) {
        switch (data.key) {
            case 'type':
                this.inputFormData.type = data.value;
                this.$emit("filter-data", this.inputFormData);
                break;
            case "siteId":
                if (this.inputFormData.siteId) {
                    this.initSelectItemArea(this.inputFormData.siteId);
                } else {
                    this.inputFormData.areaId = "";
                    this.inputFormData.deviceGroupId = "";
                    this.inputFormData.deviceId = "";
                }
                this.$emit("filter-data", this.inputFormData);
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
                this.$emit("filter-data", this.inputFormData);
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
                this.$emit("filter-data", this.inputFormData);
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
            mode: this.inputFormData.type
        };

        if (!siteId && !areaId && !deviceGroupId) {
            return false;
        }

        console.log(' ~ ', readParam)

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

    async doSubmit(data) {}

    IFilterConditionForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Metric")}
                 */
                type: ${toEnumInterface(this.metricSelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 */
                siteId: any;


                /**
                 * @uiLabel - ${this._("w_Area")}
                 */
                areaId: ${toEnumInterface(this.areaSelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_DeviceGroup")}
                 */
                deviceGroupId?: ${toEnumInterface(
                    this.deviceGroupSelectItem as any,
                    false
                )};


                /**
                 * @uiLabel - ${this._("w_Device")}
                 */
                deviceId?: ${toEnumInterface(
                    this.deviceSelectItem as any,
                    false
                )};


            }
        `;
    }
}

export default SiteAreaGroupDeviceFilter;
Vue.component("site-area-Group-device-filter", SiteAreaGroupDeviceFilter);
</script>

<style lang="scss" scoped>
</style>
