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
            >
                <template #siteId="{$attrs, $listeners}">

                    <iv-form-selection
                        v-on="$listeners"
                        v-model="inputFormData.siteIds"
                        class="col-md-10"
                        :options="sitesSelectItem"
                        :multiple="true"
                        @input="changeSiteIds"
                    >
                    </iv-form-selection>

                    <div class="col-md-2">
                        <b-button
                            class="col-md-12"
                            variant="outline-secondary"
                            @click="pageToChooseTree"
                        >
                            {{ _('w_SelectSiteTree') }}
                        </b-button>
                    </div>

                </template>
            </iv-form>

            <region-tree-select
                key="transition_2"
                v-show="transition.step === 2"
                :multiple="true"
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
    import Loading from '@/services/Loading';
    import ResponseFilter from '@/services/ResponseFilter';
    import { EDeviceMode } from "@/components/Reports";

    import ReportService from '../Reports/models/ReportService';
    import RegionAPI from '../RegionTree/models/RegionAPI';

    // Transition
    import Transition from "@/services/Transition";
    import { ITransition } from "@/services/Transition";

    // Region Tree
    import {
        IRegionTreeSelected,
        RegionTreeItem,
        ERegionType
    } from "../RegionTree";


    @Component({
        components: {}
    })
    export class SiteAreaGroupDeviceFilter extends Vue {

        transition: ITransition = {
            type: Transition.type,
            prevStep: 1,
            step: 1
        };

        siteSelectItem: any = [];
        areaSelectItem: any = {};
        deviceGroupSelectItem: any = {};
        deviceSelectItem: any = {};

        inputFormData: any = {
            siteId: "",
            areaId: "",
            deviceGroupId: "",
            deviceId: "",
        };


        // tree
        selectType = ERegionType.site;
        regionTreeItem = new RegionTreeItem();
        selecteds: IRegionTreeSelected[] = [];

        created() {
            this.initData();
            this.siteFilterPermission();
            this.initRegionTreeSelect();
            this.initSelectItemTree();
        }

        mounted() {}

        initData() {

        }

        initRegionTreeSelect() {
            this.regionTreeItem = new RegionTreeItem();
            this.regionTreeItem.titleItem.card = this._("w_SiteTreeSelect");
        }

        siteFilterPermission() {
            for (const detail of this.$user.user.allowSites) {
                let site = { id: detail.objectId, text: detail.name };
                this.siteSelectItem.push(site);
                this.inputFormData.allSiteIds.push(detail.objectId);
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

            for (const id of this.inputFormData.siteId) {
                for (const detail of this.siteSelectItem) {
                    if (id === detail.id) {
                        let selectedsObject: IRegionTreeSelected = {
                            objectId: detail.id,
                            type: ERegionType.site,
                            name: detail.text
                        };
                        this.selecteds.push(selectedsObject);
                    }
                }
            }
        }

        async pageToShowResult() {
            this.transition.prevStep = this.transition.step;
            this.transition.step = 1;

            this.transition.step = this.transition.prevStep;

            // siteId clear
            this.inputFormData.siteId = "";

            // from selecteds push siteId
            if (this.selecteds.length > 0) {
                this.inputFormData.siteId = this.selecteds[
                this.selecteds.length - 1
                    ].objectId;
                await this.initSelectItemArea(this.inputFormData.siteId);
            }

            this.$emit("siteIds", this.inputFormData.siteIds);
        }

        async updateInputFormData(data) {
            switch (data.key) {
                case 'siteId':
                    if (this.inputFormData.siteId) {
                        this.initSelectItemArea(this.inputFormData.siteId);
                    } else {
                        this.inputFormData.areaId = '';
                        this.inputFormData.deviceGroupId = '';
                        this.inputFormData.deviceId = '';
                    }
                    break;
                case 'areaId':
                    if (this.inputFormData.siteId && this.inputFormData.areaId) {
                        this.initSelectItemDeviceGroup(this.inputFormData.siteId, this.inputFormData.areaId);
                    } else {
                        this.inputFormData.deviceGroupId = '';
                        this.inputFormData.deviceId = '';
                    }
                    break;
                case 'deviceGroupId':
                    if (this.inputFormData.siteId && this.inputFormData.areaId && this.inputFormData.deviceGroupId) {
                        this.initSelectItemDevice(this.inputFormData.siteId, this.inputFormData.areaId, this.inputFormData.deviceGroupId);
                    } else {
                        this.inputFormData.deviceId = '';
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
                            tempSiteSelectItem[returnValue.objectId] = returnValue.name;
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

        async initSelectItemDevice(siteId: string, areaId: string, deviceGroupId: string) {

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

        }

        IFilterConditionForm() {
            return `
            interface {


                /**
                 * @uiLabel - ${this._("w_Sites")}
                * @uiColumnGroup - row1
                 */
                siteId: any;


                /**
                 * @uiLabel - ${this._("w_Areas")}
                 * @uiColumnGroup - row1
                 */
                areaId: ${toEnumInterface(this.areaSelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_DeviceGroups")}
                 * @uiColumnGroup - row1
                 */
                deviceGroupId?: ${toEnumInterface(this.deviceGroupSelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_Devices")}
                 * @uiColumnGroup - row1
                 */
                deviceId?: ${toEnumInterface(this.deviceSelectItem as any, false)};


            }
        `;
        }

    }

    export default SiteAreaGroupDeviceFilter;
    Vue.component("site-area-Group-device-filter", SiteAreaGroupDeviceFilter);
</script>

<style lang="scss" scoped>
</style>
