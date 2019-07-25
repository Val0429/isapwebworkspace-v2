<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <!-- v-show="pageStep === ePageStep.list" -->
            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :label="_('w_VSDemographic_List')"
            >
                <template #toolbox>

                    <iv-toolbox-view
                        :disabled="isSelected.length !== 1"
                        @click="pageToView"
                    />
                    <iv-toolbox-edit
                        :disabled="isSelected.length !== 1"
                        @click="pageToEdit(ePageStep.edit)"
                    />
                    <iv-toolbox-delete
                        :disabled="isSelected.length === 0"
                        @click="doDelete"
                    />
                    <iv-toolbox-divider />
                    <iv-toolbox-add @click="pageToAdd(ePageStep.add)" />

                </template>

                <iv-table
                    ref="listTable"
                    :interface="ITableList()"
                    :multiple="tableMultiple"
                    :server="{ path: '/device' }"
                    :params="params"
                    @selected="selectedItem($event)"
                >

                    <template #site="{$attrs}">
                        <!--                    {{ $attrs && $attrs.value && $attrs.value.name ? $attrs.value.name : "" }}-->
                        {{ $attrs.value ? $attrs.value.name : ""}}
                    </template>

                    <template #area="{$attrs}">
                        {{ $attrs && $attrs.value && $attrs.value.name ? $attrs.value.name : "" }}
                    </template>

                    <template #groups="{$attrs}">
                        {{ showFirst($attrs.value) }}
                    </template>

                    <template #Actions="{$attrs, $listeners}">
                        <iv-toolbox-more :disabled="isSelected.length !== 1">
                            <iv-toolbox-view @click="pageToView" />
                            <iv-toolbox-edit @click="pageToEdit(ePageStep.edit)" />
                            <iv-toolbox-delete @click="doDelete" />
                        </iv-toolbox-more>
                    </template>

                </iv-table>
            </iv-card>

            <!-- 選擇增加方式 -->
            <!-- v-show="addStep === eAddStep.select" -->
            <iv-card
                key="transition_2"
                v-show="transition.step === 2"
                :label="_('w_VSDemographic_Add') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList" />
                </template>

                <div class="font-weight-bold"> {{ _('w_iSap_Use') }}</div>

                <b-button
                    class="button mt-3 mb-1"
                    size="md"
                    variant="success"
                    type="button"
                    @click="pageToAddByiSapFRS(eAddStep.isapFrs)"
                >
                    {{ _('w_iSapFRS') }}
                </b-button>

                <b-button
                    variant="link"
                    class="mt-4"
                    @click="goToSetFRSServer"
                >
                    {{ _('w_SetFRS') }}
                </b-button>

                <br>

                <b-button
                    class="button mt-3 mb-1"
                    size="md"
                    variant="success"
                    type="button"
                    @click="pageToAddByiSapFRSManager(eAddStep.isapFrsManager)"
                >
                    {{ _('w_iSapFRSManager') }}
                </b-button>

                <b-button
                    variant="link"
                    class="mt-4"
                    @click="goToSetFRSManager"
                >
                    {{ _('w_SetFRSManger') }}
                </b-button>

                <template #footer>
                    <b-button
                        variant="dark"
                        size="lg"
                        @click="pageToList"
                    >{{ _('w_Back') }}
                    </b-button>
                </template>

            </iv-card>

            <!-- add and edit by iSap FRS and FRS Manager  -->
            <!--            <iv-auto-card-->
            <!--                v-show="(addStep === eAddStep.isapFrs && pageStep === ePageStep.add) || (addStep === eAddStep.isapFrsManager && pageStep === ePageStep.add) || (addStep === eAddStep.isapFrs && pageStep === ePageStep.edit) || (addStep === eAddStep.isapFrsManager && pageStep === ePageStep.edit) "-->
            <!--                :label=showLabelTitle()-->
            <!--            >-->

            <iv-auto-card
                key="transition_3"
                v-show="transition.step === 3"
                :label=showLabelTitle()
            >
                <template #toolbox>
                    <iv-toolbox-leave
                        v-show="pageStep === ePageStep.add"
                        @click="pageToList"
                    />
                    <iv-toolbox-step-backward
                        v-show="pageStep === ePageStep.add"
                        @click="pageStepBackward"
                    />
                    <iv-toolbox-back
                        v-show="pageStep === ePageStep.edit"
                        @click="pageToList"
                    />
                </template>

                <iv-form
                    :interface="IAddAndEditFromiSap()"
                    :value="inputFormData"
                    @update:serverId="selectSourceIdAndLocation($event)"
                    @update:siteId="selectAreaId($event)"
                    @update:areaId="selectGroupDeviceId($event)"
                    @update:*="tempSaveInputData($event)"
                    @submit="saveAddOrEditiSap($event)"
                >
                    <template #selectTree="{ $atrs, $listeners }">

                        <div class="m-3">

                            <b-button @click="pageToChooseTree">
                                {{ _('w_SelectSiteTree') }}
                            </b-button>
                        </div>

                    </template>

                </iv-form>

                <template #footer-before>
                    <b-button
                        v-show="pageStep === ePageStep.add"
                        variant="dark"
                        size="lg"
                        @click="pageToList"
                    >{{ _('w_Leave') }}
                    </b-button>

                    <b-button
                        v-show="pageStep === ePageStep.add"
                        variant="secondary"
                        size="lg"
                        @click="pageStepBackward"
                    >{{ _('w_StepBackward') }}
                    </b-button>

                    <b-button
                        v-show="pageStep === ePageStep.edit"
                        variant="dark"
                        size="lg"
                        @click="pageToList"
                    >{{ _('w_Back') }}
                    </b-button>
                </template>

            </iv-auto-card>

            <!-- view by iSap FRS and FRS Manager -->
            <!--            <iv-card-->
            <!--                v-show="(pageStep === ePageStep.view && addStep === eAddStep.isapFrs) || (pageStep === ePageStep.view && addStep === eAddStep.isapFrs)"-->
            <!--                :visible="true"-->
            <!--                :label="_('w_VSDemographic_View')"-->
            <!--            >-->

            <iv-card
                key="transition_4"
                v-show="transition.step === 4"
                :visible="true"
                :label="_('w_VSDemographic_View')"
            >

                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IViewFromiSap()"
                    :value="inputFormData"
                >

                </iv-form>

                <template #footer>
                    <b-button
                        variant="dark"
                        size="lg"
                        @click="pageToList()"
                    >{{ _('w_Back') }}
                    </b-button>
                </template>

            </iv-card>

            <!-- region tree select -->
            <!-- v-show="pageStep === ePageStep.chooseTree" -->
            <region-tree-select
                key="transition_5"
                v-show="transition.step === 5"
                v-on:click-back="pageToShowResult"
                :multiple="false"
                :regionTreeItem="regionTreeItem"
                :selectType="selectType"
                :selecteds="selecteds"
            >
            </region-tree-select>
        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

// Vue
import { RegionTreeSelect } from "@/components/RegionTree/RegionTreeSelect.vue";

// API Interface
import { IConfigiSap } from "@/config/default/api/interfaces";

// Region Tree
import {
    ERegionType,
    IRegionItem,
    RegionTreeItem,
    IRegionTreeSelected
} from "@/components/RegionTree";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import RegionAPI from "@/services/RegionAPI";
import Datetime from "@/services/Datetime";
import Loading from "@/services/Loading";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

enum EPageStep {
    list = "list",
    add = "add",
    edit = "edit",
    view = "view",
    none = "none",
    showResult = "showResult",
    chooseTree = "chooseTree"
}

enum EAddStep {
    select = "select",
    isap = "isap",
    isapFrs = "isapFrs",
    isapFrsManager = "isapFrsManager",
    none = "none"
}

enum ECameraMode {
    demographic = "demographic"
}

@Component({
    components: {}
})
export default class Demographic extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.list;

    eAddStep = EAddStep;
    addStep: EAddStep = EAddStep.none;

    isSelected: any = [];
    tableMultiple: boolean = true;

    selectedDetail: any = [];

    sitesSelectItem: any = {};
    deviceGroupSelectItem: any = {};
    areaSelectItem: any = {};
    serverIdSelectItem: any = {};
    demographicIdSelectItem: any = {};
    sourceIdSelectItem: any = {};

    params: any = {
        mode: ECameraMode.demographic
    };

    // tree 相關
    selectType = ERegionType.site;
    regionTreeItem = new RegionTreeItem();
    selecteds: IRegionTreeSelected[] = [];

    inputFormData: any = {};

    created() {}

    mounted() {}

    clearInputData() {
        this.inputFormData = {
            stepType: "",
            customId: "",
            areaId: "",
            siteId: "",
            groupIds: [],
            name: "",
            demoServerId: "",
            serverId: "",
            sourceid: "",
            location: "",
            objectId: ""
        };
    }

    initRegionTreeSelect() {
        this.regionTreeItem = new RegionTreeItem();
        this.regionTreeItem.titleItem.card = this._("w_SiteTreeSelect");
    }

    async initSelectItemSite() {
        this.sitesSelectItem = {};

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
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemTree() {
        await this.$server
            .R("/location/tree")
            .then((response: any) => {
                if (response != undefined) {
                    this.regionTreeItem.tree = RegionAPI.analysisApiResponse(
                        response
                    );
                    this.regionTreeItem.region = this.regionTreeItem.tree;
                }
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemFRSServer() {
        this.serverIdSelectItem = {};

        await this.$server
            .R("/partner/frs")
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response.results) {
                        // 自定義 areaSelectItem 的 key 的方式
                        this.serverIdSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                }
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemDemographicServer() {
        this.demographicIdSelectItem = {};

        await this.$server
            .R("/partner/demographic")
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response.results) {
                        // 自定義 demographicIdSelectItem 的 key 的方式
                        this.demographicIdSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                }
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
    }

    getInputData() {
        this.clearInputData();
        for (const param of this.selectedDetail) {
            this.inputFormData = {
                // objectId: param.objectId,
                name: param.name,
                areaId:
                    param.area && param.area["objectId"]
                        ? param.area["objectId"]
                        : "",
                area:
                    param.area && param.area["name"] ? param.area["name"] : "",
                site:
                    param.site && param.site["name"] ? param.site["name"] : "",
                customId: param.customId,
                objectId: param.objectId,
                siteId:
                    param.site && param.site["objectId"]
                        ? param.site["objectId"]
                        : "",
                groupIds: param.groups,
                demoServerId:
                    param.demoServer && param.demoServer["objectId"]
                        ? param.demoServer["objectId"]
                        : "",
                demoServerIdView:
                    param.demoServer && param.demoServer["name"]
                        ? param.demoServer["name"]
                        : "",
                serverId:
                    param.config &&
                    param.config.server &&
                    param.config.server.objectId
                        ? param.config.server.objectId
                        : "",
                serverIdView:
                    param.config &&
                    param.config.server &&
                    param.config.server.name
                        ? param.config.server.name
                        : "",
                sourceid:
                    param.config && param.config.sourceid
                        ? param.config.sourceid
                        : "",
                sourceidView:
                    param.config && param.config.sourceid
                        ? param.config.sourceid
                        : "",
                location:
                    param.config && param.config.location
                        ? param.config.location
                        : "",
                groupIdsText: this.idsToText(param.groups),
                stepType: "",
                tempSiteId:
                    param.site && param.site["objectId"]
                        ? param.site["objectId"]
                        : "",
                tempAreaId:
                    param.area && param.area["objectId"]
                        ? param.area["objectId"]
                        : ""
            };
        }

        if (this.inputFormData.serverId !== "") {
            this.selectSourceIdAndLocation(this.inputFormData.serverId);
        }
    }

    tempSaveInputData(data) {
        switch (data.key) {
            case "name":
                this.inputFormData.name = data.value;
                break;
            case "customId":
                this.inputFormData.customId = data.value;
                break;
            case "areaId":
                this.inputFormData.areaId = data.value;
                break;
            case "groupIds":
                this.inputFormData.groupIds = data.value;
                break;
            case "demoServerId":
                this.inputFormData.demoServerId = data.value;
                break;
            case "serverId":
                this.inputFormData.serverId = data.value;
                break;
            case "sourceid":
                this.inputFormData.sourceid = data.value;
                break;
            case "siteId":
                this.inputFormData.siteId = data.value;
                break;
        }

        this.selecteds = [];

        for (const detail in this.sitesSelectItem) {
            if (this.inputFormData.siteId === detail) {
                let selectedsObject: IRegionTreeSelected = {
                    objectId: detail,
                    type: ERegionType.site,
                    name: this.sitesSelectItem[detail]
                };
                this.selecteds.push(selectedsObject);
            }
        }
    }

    async selectSourceIdAndLocation(data) {
        this.sourceIdSelectItem = {};

        if (data !== undefined) {
            const readParam: {
                objectId: string;
            } = {
                objectId: data
            };
            Loading.show();
            await this.$server
                .C("/partner/frs/device", readParam)
                .then((response: any) => {
                    Loading.hide();
                    if (response != undefined) {
                        for (const returnValue of response) {
                            for (const returnValue of response) {
                                // 自定義 sourceIdSelectItem / locationSelectItem 的 key 的方式
                                this.$set(
                                    this.sourceIdSelectItem,
                                    returnValue.sourceid,
                                    returnValue.sourceid
                                );
                            }

                            if (
                                returnValue.statusCode === 500 ||
                                returnValue.statusCode === 400
                            ) {
                                Dialog.error(this._("w_ErrorReadData"));
                                return false;
                            }
                        }
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_ErrorReadData")
                    );
                });
        }
    }

    async selectAreaId(data) {
        this.areaSelectItem = {};
        this.deviceGroupSelectItem = {};

        if (data === undefined || data === "") {
            this.inputFormData.areaId = "";
            this.inputFormData.groupIds = [];
        }

        if (this.pageStep === EPageStep.add) {
            if (data !== undefined || data !== "") {
                const readParam: {
                    siteId: string;
                } = {
                    siteId: data
                };

                await this.$server
                    .R("/location/area/all", readParam)
                    .then((response: any) => {
                        if (response != undefined) {
                            for (const returnValue of response) {
                                this.inputFormData.areaId = "";
                                this.inputFormData.groupIds = [];
                                // 自定義 areaSelectItem 的 key 的方式
                                this.$set(
                                    this.areaSelectItem,
                                    returnValue.objectId,
                                    returnValue.name
                                );
                            }
                        }
                    })
                    .catch((e: any) => {
                        return ResponseFilter.catchError(
                            this,
                            e,
                            this._("w_ErrorReadData")
                        );
                    });
            }
        }

        if (this.pageStep === EPageStep.edit) {
            if (data !== undefined || data !== "") {
                if (this.inputFormData.tempSiteId !== data) {
                    this.inputFormData.areaId = "";
                }

                const readParam: {
                    siteId: string;
                } = {
                    siteId: data
                };

                await this.$server
                    .R("/location/area/all", readParam)
                    .then((response: any) => {
                        if (response != undefined) {
                            for (const returnValue of response) {
                                // 自定義 areaSelectItem 的 key 的方式
                                this.$set(
                                    this.areaSelectItem,
                                    returnValue.objectId,
                                    returnValue.name
                                );
                            }
                        }
                    })
                    .catch((e: any) => {
                        return ResponseFilter.catchError(
                            this,
                            e,
                            this._("w_ErrorReadData")
                        );
                    });
            }
        }
    }

    async selectGroupDeviceId(data) {
        this.deviceGroupSelectItem = {};

        if (data === undefined || data === "") {
            this.inputFormData.groupIds = [];
        }

        if (this.pageStep === EPageStep.add) {
            if (data !== undefined) {
                const readParam: {
                    areaId: string;
                    mode: string;
                } = {
                    areaId: data,
                    mode: ECameraMode.demographic
                };

                await this.$server
                    .R("/device/group/all", readParam)
                    .then((response: any) => {
                        if (response != undefined) {
                            for (const returnValue of response) {
                                this.inputFormData.groupIds = [];
                                // 自定義 deviceGroupSelectItem 的 key 的方式
                                this.$set(
                                    this.deviceGroupSelectItem,
                                    returnValue.objectId,
                                    returnValue.name
                                );
                            }
                        }
                    })
                    .catch((e: any) => {
                        return ResponseFilter.catchError(
                            this,
                            e,
                            this._("w_VSPeopleCounting_ADDFailed")
                        );
                    });
            }
        }

        if (this.pageStep === EPageStep.edit) {
            if (data !== undefined) {
                const readParam: {
                    areaId: string;
                    mode: string;
                } = {
                    areaId: data,
                    mode: ECameraMode.demographic
                };

                if (this.inputFormData.tempAreaId !== data) {
                    this.inputFormData.groupIds = [];
                }

                await this.$server
                    .R("/device/group/all", readParam)
                    .then((response: any) => {
                        if (response != undefined) {
                            for (const returnValue of response) {
                                // 自定義 deviceGroupSelectItem 的 key 的方式
                                this.$set(
                                    this.deviceGroupSelectItem,
                                    returnValue.objectId,
                                    returnValue.name
                                );
                            }
                        }
                    })
                    .catch((e: any) => {
                        return ResponseFilter.catchError(
                            this,
                            e,
                            this._("w_VSPeopleCounting_ADDFailed")
                        );
                    });
            }
        }
    }

    pageToList() {
        this.pageStep = EPageStep.list;
        this.addStep = EAddStep.none;
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        (this.$refs.listTable as any).reload();
    }

    async pageToAdd(stepType: string) {
        this.clearInputData();
        await this.initSelectItemSite();
        await this.initSelectItemDemographicServer();
        this.pageStep = EPageStep.add;
        this.addStep = EAddStep.select;
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
        this.inputFormData.stepType = stepType;
        this.selecteds = [];
    }

    async pageToEdit(stepType: string) {
        this.pageStep = EPageStep.edit;
        await this.initSelectItemFRSServer();
        await this.initSelectItemDemographicServer();
        await this.initSelectItemSite();
        await this.selectAreaId(this.inputFormData.siteId);
        await this.selectGroupDeviceId(this.inputFormData.areaId);
        this.getInputData();
        this.inputFormData.stepType = stepType;
        this.inputFormData.groupIds = JSON.parse(
            JSON.stringify(
                this.inputFormData.groupIds.map(item => item.objectId)
            )
        );

        if (this.inputFormData.serverId !== "") {
            this.addStep = EAddStep.isapFrs;
            this.transition.prevStep = this.transition.step;
            this.transition.step = 3;
        }
    }

    pageToView() {
        this.pageStep = EPageStep.view;
        this.getInputData();

        if (this.inputFormData.serverId !== "") {
            this.addStep = EAddStep.isapFrs;
            this.transition.prevStep = this.transition.step;
            this.transition.step = 4;
        }
    }

    async pageToAddByiSapFRS(brand: string) {
        this.clearInputData();
        await this.initSelectItemFRSServer();
        await this.initSelectItemSite();
        this.addStep = EAddStep.isapFrs;
        this.inputFormData.brand = brand;
        this.inputFormData.stepType = EPageStep.add;
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
    }

    async pageToAddByiSapFRSManager(brand: string) {
        this.clearInputData();
        await this.initSelectItemSite();

        this.addStep = EAddStep.isapFrsManager;
        this.inputFormData.brand = brand;
        this.inputFormData.stepType = EPageStep.add;
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
    }

    pageStepBackward() {
        this.clearInputData();
        this.addStep = EAddStep.select;
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
    }

    async pageToChooseTree() {
        this.pageStep = EPageStep.chooseTree;
        this.transition.prevStep = this.transition.step;
        this.transition.step = 5;
        this.initRegionTreeSelect();
        await this.initSelectItemTree();
        this.selecteds = [];
        this.areaSelectItem = {};
        this.deviceGroupSelectItem = {};
        this.inputFormData.areaId = "";
        this.inputFormData.groupIds = [];
        for (const detail in this.sitesSelectItem) {
            if (this.inputFormData.siteId === detail) {
                let selectedsObject: IRegionTreeSelected = {
                    objectId: detail,
                    type: ERegionType.site,
                    name: this.sitesSelectItem[detail]
                };
                this.selecteds.push(selectedsObject);
            }
        }
    }

    async pageToShowResult() {
        if (this.inputFormData.stepType === EPageStep.add) {
            this.pageStep = EPageStep.add;
            this.transition.step = this.transition.prevStep;

            // siteId clear
            this.inputFormData.siteId = "";

            // from selecteds push siteId
            if (this.selecteds.length > 0) {
                this.inputFormData.siteId = this.selecteds[
                this.selecteds.length - 1
                    ].objectId;
                await this.selectAreaId(this.inputFormData.siteId);
            }
        }

        if (this.inputFormData.stepType === EPageStep.edit) {
            this.pageStep = EPageStep.edit;
            this.transition.step = this.transition.prevStep;

            // siteId clear
            this.inputFormData.siteId = "";

            // from selecteds push siteId
            if (this.selecteds.length > 0) {
                this.inputFormData.siteId = this.selecteds[
                this.selecteds.length - 1
                    ].objectId;
                await this.selectAreaId(this.inputFormData.siteId);
            }
        }
    }

    goToSetFRSServer() {
        this.$router.push("/server/frs_server");
    }

    goToSetFRSManager() {
        this.$router.push("/server/frs_manager_server");
    }

    async saveAddOrEditiSap(data) {
        const configObject: IConfigiSap = {
            serverId: data.serverId,
            sourceid: data.sourceid
        };

        if (this.inputFormData.brand === EAddStep.isapFrs) {
            const datas: any = [
                {
                    customId: data.customId,
                    name: data.name,
                    areaId: data.areaId,
                    demoServerId: data.demoServerId,
                    groupIds: data.groupIds !== undefined ? data.groupIds : [],
                    config: configObject
                }
            ];

            const addParam = {
                datas
            };
            Loading.show();
            await this.$server
                .C("/device/demographic", addParam)
                .then((response: any) => {
                    Loading.hide();
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(
                                this._("w_VSDemographic_AddSuccess")
                            );
                            this.pageToList();
                        }
                        if (
                            returnValue.statusCode === 500 ||
                            returnValue.statusCode === 400
                        ) {
                            Dialog.error(this._("w_VSDemographic_ADDFailed"));
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_VSDemographic_ADDFailed")
                    );
                });
        }

        if (this.inputFormData.stepType === EPageStep.edit) {
            const datas: any = [
                {
                    objectId: data.objectId,
                    name: data.name,
                    areaId: data.areaId,
                    demoServerId: data.demoServerId,
                    groupIds: data.groupIds !== undefined ? data.groupIds : [],
                    config: configObject
                }
            ];

            const editParam = {
                datas
            };
            Loading.show();
            await this.$server
                .U("/device/demographic", editParam)
                .then((response: any) => {
                    Loading.hide();
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(
                                this._("w_VSDemographic_EditSuccess")
                            );
                            this.pageToList();
                        }
                        if (
                            returnValue.statusCode === 500 ||
                            returnValue.statusCode === 400
                        ) {
                            Dialog.error(this._("w_VSDemographic_EditFailed"));
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_VSDemographic_EditFailed")
                    );
                });
        }
    }

    async doDelete() {
        await Dialog.confirm(
            this._("w_VSDemographic_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                Loading.show();
                for (const param of this.selectedDetail) {
                    const deleteParam: {
                        objectId: string;
                    } = {
                        objectId: param.objectId
                    };

                    this.$server
                        .D("/device", deleteParam)
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
                            return ResponseFilter.catchError(this, e);
                        });
                }
                Loading.hide();
            }
        );
    }

    showFirst(value): string {
        if (value.length >= 2) {
            return value.map(item => item.name)[0] + "...";
        } else if (value.length === 1) {
            return value.map(item => item.name)[0];
        } else if (value.length == 0) {
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

    showLabelTitle(): string {
        if (
            this.pageStep === EPageStep.add &&
            this.addStep === EAddStep.isapFrs
        ) {
            return this._("w_VSDemographic_AddisapUseFRS");
        }

        if (
            this.pageStep === EPageStep.add &&
            this.addStep === EAddStep.isapFrsManager
        ) {
            return this._("w_VSDemographic_AddisapUseFRSManger");
        }

        if (
            this.pageStep === EPageStep.edit &&
            this.addStep === EAddStep.isapFrs
        ) {
            return this._("w_VSDemographic_EditisapUseFRS");
        }

        if (
            this.pageStep === EPageStep.edit &&
            this.addStep === EAddStep.isapFrsManager
        ) {
            return this._("w_VSDemographic_EditisapUseFRSManger");
        }
        return "";
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
             * @uiLabel - ${this._("w_Site")}
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

    IAddAndEditFromiSap() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Id")}
                 * @uiPlaceHolder - ${this._("w_Id")}
                 * @uiType - ${
                     this.inputFormData.stepType === EPageStep.add
                         ? "iv-form-string"
                         : "iv-form-label"
                 }
                 */
                customId: string;


                /**
                 * @uiLabel - ${this._("w_Name")}
                 * @uiPlaceHolder - ${this._("w_Name")}
                 */
                name: string;


                /**
                 * @uiLabel - ${this._("w_VSDemographic_demoServerId")}
                 * @uiPlaceHolder - ${this._("w_VSDemographic_demoServerId")}
                 * @uiHidden - ${
                     this.addStep === EAddStep.isapFrsManager ? "true" : "false"
                 }
                 */
                demoServerId: ${toEnumInterface(
                    this.demographicIdSelectItem as any,
                    false
                )};



                /**
                 * @uiLabel - ${this._("w_ServerId")}
                 * @uiPlaceHolder - ${this._("w_ServerId")}
                 * @uiHidden - ${
                     this.addStep === EAddStep.isapFrsManager ? "true" : "false"
                 }
                 */
                serverId: ${toEnumInterface(
                    this.serverIdSelectItem as any,
                    false
                )};


                /**
                 * @uiLabel - ${this._("w_SourceId")}
                 * @uiPlaceHolder - ${this._("w_SourceId")}
                 * @uiHidden - ${
                     this.addStep === EAddStep.isapFrsManager ? "true" : "false"
                 }
                 */
                sourceid: ${toEnumInterface(
                    this.sourceIdSelectItem as any,
                    false
                )};


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 */
                siteId?: ${toEnumInterface(this.sitesSelectItem as any, false)};

                selectTree?: any;


                /**
                 * @uiLabel - ${this._("w_Area")}
                 */
                areaId?: ${toEnumInterface(this.areaSelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_DeviceGroup")}
                 */
                groupIds?: ${toEnumInterface(
                    this.deviceGroupSelectItem as any,
                    true
                )};

            }
         `;
    }

    IViewFromiSap() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Id")}
                 * @uiType - iv-form-label
                 */
                customId?: string;


                /**
                 * @uiLabel - ${this._("w_Name")}
                 * @uiType - iv-form-label
                 */
                name?: string;

                /*
                 * @uiLabel - ${this._("w_VSDemographic_demoServerId")}
                 * @uiType - iv-form-label
                 */
                demoServerIdView?: string;

                /**
                 * @uiLabel - ${this._("w_ServerId")}
                 * @uiType - iv-form-label
                 */
                serverIdView?: string;


                /**
                 * @uiLabel - ${this._("w_SourceId")}
                 * @uiType - iv-form-label
                 */
                sourceidView?: string;


                /**
                 * @uiLabel - ${this._("w_Site")}
                 * @uiType - iv-form-label
                 */
                site?: string;



                /**
                 * @uiLabel - ${this._("w_Area")}
                 * @uiType - iv-form-label
                 */
                area?: string;


                /**
                 * @uiLabel - ${this._("w_DeviceGroup")}
                 * @uiType - iv-form-label
                 */
                groupIdsText?: string;

            }
         `;
    }
}
</script>

<style lang="scss" scoped>
.separate_height {
    height: 10px;
    margin: 10px;
}
</style>
