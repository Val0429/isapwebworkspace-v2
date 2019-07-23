<template>
    <div class="animated fadeIn">
        <iv-card
            v-show="pageStep === ePageStep.list"
            :label="_('w_VSVIP_Stranger_Visitor_List')"
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

                <template #FRSServer="{$attrs}">
                    <!--                    {{ $attrs && $attrs.value && $attrs.value.name ? $attrs.value.name : "" }}-->
                    {{ $attrs.row && $attrs.row.config && $attrs.row.config.server && $attrs.row.config.server.name ? $attrs.row.config.server.name : '' }}
                </template>

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
        <iv-card
            v-show="addStep === eAddStep.select"
            :label="_('w_VSVIP_Stranger_Visitor_Add') "
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
        <iv-auto-card
            v-show="(addStep === eAddStep.isapFrs && pageStep === ePageStep.add) || (addStep === eAddStep.isapFrsManager && pageStep === ePageStep.add) || (addStep === eAddStep.isapFrs && pageStep === ePageStep.edit) || (addStep === eAddStep.isapFrsManager && pageStep === ePageStep.edit) "
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
        <iv-card
            v-show="(pageStep === ePageStep.view && addStep === eAddStep.isapFrs) || (pageStep === ePageStep.view && addStep === eAddStep.isapFrs)"
            :visible="true"
            :label="_('w_VSVIP_Stranger_Visitor_View')"
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

        <region-tree-select
            v-show="pageStep === ePageStep.chooseTree"
            v-on:click-back="pageToShowResult"
            :multiple="false"
            :regionTreeItem="regionTreeItem"
            :selectType="selectType"
            :selecteds="selecteds"
        >
        </region-tree-select>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

// Vue
import { RegionTreeSelect } from "@/components/RegionTree/RegionTreeSelect.vue";

// API Interface
import { IConfig, IConfigiSap } from "@/config/default/api/interfaces";

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
import Loading from "＠/services/Loading";

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
    visitor = "visitor"
}

@Component({
    components: {}
})
export default class VIP_Stranger_Visitor extends Vue {
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
    sourceIdSelectItem: any = {};

    params: any = {
        mode: ECameraMode.visitor
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
                return ResponseFilter.base(this, e);
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
                return ResponseFilter.base(this, e);
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
                return ResponseFilter.base(this, e);
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
            case "serverId":
                this.inputFormData.serverId = data.value;
                break;
            case "sourceid":
                this.inputFormData.sourceid = data.value;
                break;
            case "direction":
                this.inputFormData.direction = data.value;
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

            await this.$server
                .C("/partner/frs/device", readParam)
                .then((response: any) => {
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
                    return ResponseFilter.base(
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
                        return ResponseFilter.base(
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
                        return ResponseFilter.base(
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
                    mode: ECameraMode.visitor
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
                        return ResponseFilter.base(
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
                    mode: ECameraMode.visitor
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
                        return ResponseFilter.base(
                            this,
                            e,
                            this._("w_VSPeopleCounting_ADDFailed")
                        );
                    });
            }
        }
    }

    async pageToAdd(stepType: string) {
        this.clearInputData();
        await this.initSelectItemSite();
        this.pageStep = EPageStep.add;
        this.addStep = EAddStep.select;
        this.inputFormData.stepType = stepType;
        this.selecteds = [];
    }

    async pageToEdit(stepType: string) {
        this.pageStep = EPageStep.edit;
        this.getInputData();
        await this.initSelectItemFRSServer();
        await this.initSelectItemSite();
        await this.selectAreaId(this.inputFormData.siteId);
        await this.selectGroupDeviceId(this.inputFormData.areaId);
        this.inputFormData.stepType = stepType;
        this.inputFormData.groupIds = JSON.parse(
            JSON.stringify(
                this.inputFormData.groupIds.map(item => item.objectId)
            )
        );

        if (this.inputFormData.serverId !== "") {
            this.addStep = EAddStep.isapFrs;
        }
    }

    pageToView() {
        this.pageStep = EPageStep.view;
        this.getInputData();

        if (this.inputFormData.serverId !== "") {
            this.addStep = EAddStep.isapFrs;
        }
    }

    pageToList() {
        this.pageStep = EPageStep.list;
        this.addStep = EAddStep.none;
        (this.$refs.listTable as any).reload();
    }

    async pageToAddByiSapFRS(brand: string) {
        this.clearInputData();
        await this.initSelectItemFRSServer();
        await this.initSelectItemSite();
        this.addStep = EAddStep.isapFrs;
        this.inputFormData.brand = brand;
        this.inputFormData.stepType = EPageStep.add;
    }

    async pageToAddByiSapFRSManager(brand: string) {
        this.clearInputData();
        await this.initSelectItemSite();

        this.addStep = EAddStep.isapFrsManager;
        this.inputFormData.brand = brand;
        this.inputFormData.stepType = EPageStep.add;
    }

    pageStepBackward() {
        this.clearInputData();
        this.addStep = EAddStep.select;
    }

    async pageToChooseTree() {
        this.pageStep = EPageStep.chooseTree;
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

            // siteId clear
            this.inputFormData.siteId = "";

            // from selecteds push siteId
            this.inputFormData.siteId = this.selecteds[0].objectId;
            await this.selectAreaId(this.inputFormData.siteId);
        }

        if (this.inputFormData.stepType === EPageStep.edit) {
            this.pageStep = EPageStep.edit;
            // siteId clear
            this.inputFormData.siteId = "";

            // from selecteds push siteId
            this.inputFormData.siteId = this.selecteds[0].objectId;
            await this.selectAreaId(this.inputFormData.siteId);
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
                    groupIds: data.groupIds !== undefined ? data.groupIds : [],
                    config: configObject
                }
            ];

            const addParam = {
                datas
            };

            await this.$server
                .C("/device/visitor", addParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(
                                this._("w_VSVIP_Stranger_Visitor_AddSuccess")
                            );
                            this.pageToList();
                        }
                        if (
                            returnValue.statusCode === 500 ||
                            returnValue.statusCode === 400
                        ) {
                            Dialog.error(
                                this._("w_VSVIP_Stranger_Visitor_ADDFailed")
                            );
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.base(
                        this,
                        e,
                        this._("w_VSVIP_Stranger_Visitor_ADDFailed")
                    );
                });
        }

        if (this.inputFormData.stepType === EPageStep.edit) {
            const datas: any = [
                {
                    objectId: data.objectId,
                    name: data.name,
                    areaId: data.areaId,
                    groupIds: data.groupIds !== undefined ? data.groupIds : [],
                    config: configObject
                }
            ];

            const editParam = {
                datas
            };

            await this.$server
                .U("/device/visitor", editParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(
                                this._("w_VSVIP_Stranger_Visitor_EditSuccess")
                            );
                            this.pageToList();
                        }
                        if (
                            returnValue.statusCode === 500 ||
                            returnValue.statusCode === 400
                        ) {
                            Dialog.error(
                                this._("w_VSVIP_Stranger_Visitor_EditFailed")
                            );
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.base(
                        this,
                        e,
                        this._("w_VSVIP_Stranger_Visitor_EditFailed")
                    );
                });
        }
    }

    async doDelete() {
        await Dialog.confirm(
            this._("w_VSVIP_Stranger_Visitor_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
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
                            return ResponseFilter.base(this, e);
                        });
                }
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
            return this._("w_VSVIP_Stranger_Visitor_AddisapUseFRS");
        }

        if (
            this.pageStep === EPageStep.add &&
            this.addStep === EAddStep.isapFrsManager
        ) {
            return this._("w_VSVIP_Stranger_Visitor_AddisapUseFRSManger");
        }

        if (
            this.pageStep === EPageStep.edit &&
            this.addStep === EAddStep.isapFrs
        ) {
            return this._("w_VSVIP_Stranger_Visitor_EditisapUseFRS");
        }

        if (
            this.pageStep === EPageStep.edit &&
            this.addStep === EAddStep.isapFrsManager
        ) {
            return this._("w_VSVIP_Stranger_Visitor_EditisapUseFRSManger");
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
             * @uiLabel - ${this._("w_iSapFRSServer")}
             */
            FRSServer: string;


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
