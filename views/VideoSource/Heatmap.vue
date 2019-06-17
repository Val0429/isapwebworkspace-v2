<template>
    <div class="animated fadeIn">
        <div v-show="pageStep === ePageStep.list">
            <iv-card :label="_('w_VSHeatmap_List')">
                <template #toolbox>

                    <iv-toolbox-view
                        :disabled="isSelected.length !== 1"
                        @click="pageToView"
                    />
                    <iv-toolbox-edit
                        :disabled="isSelected.length !== 1"
                        @click="pageToEdit()"
                    />
                    <iv-toolbox-delete
                        :disabled="isSelected.length === 0"
                        @click="doDelete"
                    />
                    <iv-toolbox-divider />
                    <iv-toolbox-add @click="pageToAdd()" />

                </template>

                <iv-table
                    ref="campaignTable"
                    :interface="ITableList()"
                    :multiple="tableMultiple"
                    :server="{ path: '/device' }"
                    :params="params"
                    @selected="selectedItem($event)"
                >

                    <template #site="{$attrs}">
                        {{ $attrs.value['name'] }}
                    </template>

                    <template #area="{$attrs}">
                        {{ $attrs.value['name'] }}
                    </template>

                    <template #groups="{$attrs}">
                        {{ showFirst($attrs.value) }}
                    </template>

                    <template #Actions="{$attrs, $listeners}">
                        <iv-toolbox-more :disabled="isSelected.length !== 1">
                            <iv-toolbox-view @click="pageToView" />
                            <iv-toolbox-edit @click="pageToEdit()" />
                            <iv-toolbox-delete @click="doDelete" />
                        </iv-toolbox-more>
                    </template>

                </iv-table>
            </iv-card>
        </div>

        <div v-show="pageStep === ePageStep.add || pageStep ===  ePageStep.edit">
            <iv-auto-card :label="pageStep == ePageStep.add ? _('w_VSHeatmap_Add') :  _('w_VSHeatmap_Edit')">

                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-step-progress
                    ref="step"
                    @mounted="doMounted"
                    :data="inputFormData"
                >

                    <template #1>
                        <iv-form
                            :interface="inf1()"
                            @update:serverId="initDeviceData($event)"
                            @update:nvrId="initChannelItem($event)"
                        >

                            <template #serverId="{$attrs, $listeners}">
                                <iv-form-selection
                                    v-bind="$attrs"
                                    v-on="$listeners"
                                    :options="cmsItem"
                                >
                                </iv-form-selection>
                                <b-button
                                    class="linkPadding"
                                    variant="link"
                                    @click="goToSetCMS"
                                >
                                    {{ _('w_VSHeatmap_SetCMS') }}
                                </b-button>
                            </template>

                            <template #nvrId="{$attrs, $listeners}">
                                <iv-form-selection
                                    v-bind="$attrs"
                                    v-on="$listeners"
                                    :options="nvrItem"
                                >
                                </iv-form-selection>
                            </template>

                            <template #channelId="{$attrs, $listeners}">
                                <iv-form-selection
                                    v-bind="$attrs"
                                    v-on="$listeners"
                                    :options="channelItem"
                                >
                                </iv-form-selection>
                            </template>

                        </iv-form>

                    </template>
                    <template #1-title>{{_('w_VSHeatmap_SelectBrand')}}</template>

                    <template #2>
                        <iv-form :interface="inf2()" />
                    </template>
                    <template #2-title>{{_('w_VSHeatmap_SelectRegion')}}</template>

                    <template #3>
                        <iv-form :interface="inf3()">
                            <template #roi="{$attrs, $listeners}">
                                <div class="col-md-12 center">
                                    <camera-roi
                                        v-on:save-roi="saveROI"
                                        v-on:clear-roi="clearROI"
                                        v-on:page-to-back="pageToBack"
                                        :drawRegionCount="7"
                                        :snapshotData="snaphotDeial"
                                        :canvasData="canvasDetail"
                                    ></camera-roi>
                                </div>
                            </template>
                        </iv-form>
                    </template>
                    <template #3-title>{{_('w_VSHeatmap_DrawROI')}}</template>

                    <template #4>
                        <iv-form :interface="inf4()" />
                    </template>
                    <template #4-title>{{_('w_VSHeatmap_CheckAndOverlook')}}</template>

                </iv-step-progress>

            </iv-auto-card>
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import Datetime from "@/services/Datetime";
import { toEnumInterface } from "@/../core";
import {
    IAddBusinessOperationCampaign,
    IEditBusinessOperationCampaign
} from "@/config/default/api/interfaces";

import {
    ERegionType,
    IRegionItem,
    RegionTreeItem,
    IRegionTreeSelected
} from "@/components/RegionTree/models";
import { RegionTreeSelect } from "@/components/RegionTree/RegionTreeSelect.vue";

import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog/Dialog";
import RegionAPI from "@/services/RegionAPI";

enum EPageStep {
    list = "list",
    add = "add",
    edit = "edit",
    view = "view",
    none = "none"
}

enum ECameraMode {
    heatmap = "heatmap"
}

@Component({
    components: {}
})
export default class Heatmap extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;
    isSelected: any = [];
    tableMultiple: boolean = true;
    selectedDetail: any = [];
    sitesSelectItem: any = {};
    params: any = {
        mode: ECameraMode.heatmap
    };

    // options
    cmsItem = [];
    devices = [];
    nvrItem = [];
    channels = [];
    channelItem = [];

    // tree
    selectType = ERegionType.site;
    regionTreeItem = new RegionTreeItem();
    selecteds: IRegionTreeSelected[] = [];

    inputFormData = {
        objectId: "",
        brand: "isap",
        name: "",
        budget: null,
        description: "",
        type: "",
        siteIds: [],
        startDate: new Date(),
        endDate: new Date(),
        stepType: "",
        siteIdsText: "",
        startDateText: "",
        endDateText: ""
    };

    created() {}

    mounted() {
        this.pageToList();
    }

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            brand: "isap",
            name: "",
            budget: null,
            description: "",
            type: "",
            siteIds: [],
            startDate: new Date(),
            endDate: new Date(),
            stepType: "",
            siteIdsText: "",
            startDateText: "",
            endDateText: ""
        };
    }

    async initCMSItem() {
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
            .R("/partner/cms", body)
            .then((response: any) => {
                if (response != undefined) {
                    this.cmsItem = [];
                    for (let item of response.results) {
                        let cms = { id: item.objectId, text: item.name };

                        this.cmsItem.push(cms);
                    }
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

    async initDeviceData(data) {
        console.log("initDeviceData", data);
        let body: {
            objectId: string;
        } = {
            objectId: data
        };

        await this.$server
            .C("/partner/cms/device", body)
            .then((response: any) => {
                if (response != undefined) {
                    this.devices = response;
                    this.initNVRItem();
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

    initNVRItem() {
        this.nvrItem = [];
        for (let device of this.devices) {
            let nvr = { id: device.nvrId, text: device.nvrId };
            this.nvrItem.push(nvr);
        }
    }

    initChannelItem(data) {
        this.channelItem = [];
        for (let device of this.devices) {
            if (device.nvrId == data) {
                for (let channel of device.channels) {
                    let item = { id: channel.channelId, text: channel.name };
                    this.channelItem.push(item);
                }
            }
        }
    }

    async initSelectItemSite() {
        const readAllSiteParam: {
            type: string;
        } = {
            type: "all"
        };

        await this.$server
            .R("/location/site/all", readAllSiteParam)
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response) {
                        // 自定義 sitesSelectItem 的 key 的方式
                        this.sitesSelectItem[returnValue.objectId] =
                            returnValue.name;
                        this.regionTreeItem.tree = RegionAPI.analysisApiResponse(
                            returnValue
                        );
                    }
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

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
    }
    async pageToAdd() {
        this.clearInputData();
        this.selecteds = [];
        this.pageStep = EPageStep.add;
    }

    async pageToEdit() {
        this.pageStep = EPageStep.edit;
    }

    pageToView() {
        this.pageStep = EPageStep.view;
    }

    pageToList() {
        this.initCMSItem();
        this.pageStep = EPageStep.list;
    }

    async doDelete() {
        await Dialog.confirm(
            this._("w_BOCampaign_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                for (const param of this.selectedDetail) {
                    const deleteParam: {
                        objectId: string;
                    } = {
                        objectId: param.objectId
                    };

                    this.$server
                        .D("/event/campaign", deleteParam)
                        .then((response: any) => {
                            for (const returnValue of response) {
                                if (returnValue.statusCode === 200) {
                                    this.pageToList();
                                }
                                if (returnValue.statusCode === 500) {
                                    Dialog.error(this._("w_DeleteFailed"));
                                    return false;
                                }
                            }
                        })
                        .catch((e: any) => {
                            if (
                                e.res &&
                                e.res.statusCode &&
                                e.res.statusCode == 401
                            ) {
                                return ResponseFilter.base(this, e);
                            }

                            console.log(e);
                        });
                }
            }
        );
    }

    showFirst(value): string {
        if (value.length >= 2) {
            return value.map(item => item.name)[0] + "...";
        }
        if (value.length === 1) {
            return value.map(item => item.name)[0];
        }
        if (value.length == 0) {
            return "";
        }
    }

    show30Words(
        value: any,
        startWord: number = 0,
        endWord: number = 30
    ): string {
        return value.length < endWord
            ? value.substring(startWord, endWord)
            : value.substring(startWord, endWord) + "...";
    }

    idsToText(value: any): string {
        let result = "";
        for (const val of value) {
            result += val.name + ", ";
        }
        result = result.substring(0, result.length - 2);
        return result;
    }

    goToSetCMS() {
        Dialog.confirm(
            this._("w_VSHeatmap_PageToCMSAlter"),
            this._("w_DeleteConfirm"),
            () => {
                this.$router.push("/server/cms_server");
            }
        );
    }

    ITableList() {
        return `
            interface {

            /**
             * @uiLabel - ${this._("w_No")}
             * @uiType - iv-cell-auto-index
             */
            no: string;


            /**
             * @uiLabel - ${this._("w_DeviceID")}
             */
            customId: string;


            /**
             * @uiLabel - ${this._("w_DeviceName")}
             */
            name: string;


            /**
             * @uiLabel - ${this._("w_Brand")}
             */
            brand: string;


            /**
             * @uiLabel - ${this._("w_Model")}
             */
            model: string;


            /**
             * @uiLabel - ${this._("w_Sites")}
             */
            site: string;


            /**
             * @uiLabel - ${this._("w_Area")}
             */
            area: string;


            /**
             * @uiLabel - ${this._("w_DeviceGroups")}
             */
            groups: string;

            Actions?: any;

            }
        `;
    }

    private inf1() {
        return `
            interface {

                /**
                * @uiLabel - ${this._("w_VSHeatmap_CustomId")}
                * @uiPlaceHolder - ${this._("w_VSHeatmap_CustomId")}
                * @uiType - iv-form-string
                */
                customId: string;

                /**
                * @uiLabel - ${this._("w_VSHeatmap_Name")}
                * @uiPlaceHolder - ${this._("w_VSHeatmap_Name")}
                * @uiType - iv-form-string
                */
                name: string;

                /*
                * @uiLabel - ${this._("w_VSHeatmap_Brand")}
                * @uiType - iv-form-selection
                * @uiAttrs - { multiple: false }
                */
                brand: ${toEnumInterface({
                    isap: "iSAP"
                })}

                /*
                * @uiLabel - ${this._("w_VSHeatmap_CMS")} 
                * @uiType - iv-form-selection
                * @uiAttrs - { multiple: false }
                */
                 serverId: any;

                  /*
                * @uiLabel - ${this._("w_VSHeatmap_NVR")}
                * @uiType - iv-form-selection
                * @uiAttrs - { multiple: false }
                */
                nvrId: any;

                    /*
                * @uiLabel - ${this._("w_VSHeatmap_ChannelInNVR")}
                * @uiType - iv-form-selection
                * @uiAttrs - { multiple: false }
                */
                channelId: any;
            }
        `;
    }

    private inf2() {
        return `
        interface {

                /*
                * @uiLabel - ${this._("w_VSHeatmap_Site")}
                * @uiType - iv-form-selection
                * @uiAttrs - { multiple: false }
                */
                siteId: ${toEnumInterface({
                    site1: "site01",
                    site2: "site02"
                })}

                /*
                * @uiLabel - ${this._("w_VSHeatmap_Area")}
                * @uiType - iv-form-selection
                * @uiAttrs - { multiple: false }
                */
                areaId: ${toEnumInterface({
                    area1: "area01",
                    area2: "area02"
                })}


                        /*
                * @uiLabel - ${this._("w_VSHeatmap_DeviceGroup")}
                * @uiType - iv-form-selection
                * @uiAttrs - { multiple: true }
                */
                groupIds: ${toEnumInterface({
                    group1: "group01",
                    group2: "group02"
                })}

            }
        `;
    }

    private inf3() {
        return `
       interface {
             roi?: any;
        `;
    }

    private inf4() {
        return `
        interface {
           /**
                * @uiLabel - ${this._("w_VSHeatmap_CustomId")}
                * @uiPlaceHolder - ${this._("w_VSHeatmap_CustomId")}
                * @uiType - iv-form-label
                */
                customId?: string;

                /**
                * @uiLabel - ${this._("w_VSHeatmap_Name")}
                * @uiPlaceHolder - ${this._("w_VSHeatmap_Name")}
                * @uiType - iv-form-label
                */
                name?: string;

                /*
                * @uiLabel - ${this._("w_VSHeatmap_Brand")}
                * @uiType - iv-form-label
                * @uiAttrs - { multiple: false }
                */
                brand?: ${toEnumInterface({
                    isap: "iSAP"
                })}

                /*
                * @uiLabel - ${this._("w_VSHeatmap_CMS")}
                * @uiType - iv-form-label
                * @uiAttrs - { multiple: false }
                */
                   serverId?: any;

                  /*
                * @uiLabel - ${this._("w_VSHeatmap_NVR")}
                * @uiType - iv-form-label
                * @uiAttrs - { multiple: false }
                */
                nvrId?: ${toEnumInterface({
                    1: "NVR1",
                    2: "NVR2"
                })}

                    /*
                * @uiLabel - ${this._("w_VSHeatmap_ChannelInNVR")}
                * @uiType - iv-form-label
                * @uiAttrs - { multiple: false }
                */
                channelId?: ${toEnumInterface({
                    1: "1 ch",
                    2: "2 ch"
                })}
            
                /*
                * @uiLabel - ${this._("w_VSHeatmap_Site")}
                * @uiType - iv-form-label
                * @uiAttrs - { multiple: false }
                */
                siteId?: ${toEnumInterface({
                    site1: "site01",
                    site2: "site02"
                })}

                /*
                * @uiLabel - ${this._("w_VSHeatmap_Area")}
                * @uiType - iv-form-label
                * @uiAttrs - { multiple: false }
                */
                areaId?: ${toEnumInterface({
                    area1: "area01",
                    area2: "area02"
                })}


                 /*
                * @uiLabel - ${this._("w_VSHeatmap_DeviceGroup")}
                * @uiType - iv-form-label
                * @uiAttrs - { multiple: true }
                */
                groupIds?: ${toEnumInterface({
                    group1: "group01",
                    group2: "group02"
                })}
        }
        `;
    }

    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
    }

    snaphotDeial = {
        name: "ROI",
        snapshotBase64:
            "data:image/jpeg;base64,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",
        cameraWidth: 600,
        cameraHeight: 350
    };

    canvasDetail = [
        {
            x: 100,
            y: 200,
            width: 200,
            height: 100
        },
        {
            x: 0,
            y: 0,
            width: 600,
            height: 350
        }
    ];

    log(data) {
        console.log("Done", data);
    }

    pageToBack() {
        console.log("pageToBack");
    }

    saveROI(data) {
        console.log("saveROI", data, this.canvasDetail);
    }

    clearROI(data) {
        console.log("clearROI", data, this.canvasDetail);
    }
}
</script>

<style lang="scss" scoped>
.selectWeekWidth {
    width: 130px;
}

.selectHourWidth {
    width: 130px;
}

.selectMinuteWidth {
    width: 80px;
}

.linkPadding {
    position: relative;
    top: -20px;
}
</style>
