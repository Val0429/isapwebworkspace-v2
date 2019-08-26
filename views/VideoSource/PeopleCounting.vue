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
                :label="_('w_VSPeopleCounting_List')"
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
                :label="_('w_VSPeopleCounting_Add') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList" />
                </template>

                <div class="font-weight-bold"> {{ _('w_VSPeopleCounting_Addhanwha') }}</div>

                <b-button
                    class="button mt-3 mb-1"
                    size="md"
                    variant="success"
                    type="button"
                    @click="pageToAddByHanwha(eAddStep.hanwha)"
                >
                    {{ _('w_Hanwha') }}
                </b-button>

                <hr>

                <div class="font-weight-bold"> {{ _('w_iSap_Use') }}</div>

                <b-button
                    class="button mt-3 mb-1"
                    size="md"
                    variant="success"
                    type="button"
                    @click="pageToAddByiSapFRS(eAddStep.frs)"
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
                    @click="pageToAddByiSapFRSManager(eAddStep.frsManager)"
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

            <!-- add and edit by Hanwha -->
            <!--             v-show="(addStep === eAddStep.hanwha && pageStep === ePageStep.add) || (addStep === eAddStep.hanwha && pageStep === ePageStep.edit)"
         -->
            <iv-auto-card
                key="transition_3"
                v-show="transition.step === 3"
                :label="pageStep === ePageStep.add ? _('w_VSPeopleCounting_AddhanwhaUse') : _('w_VSPeopleCounting_EdithanwhaUse')"
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
                    :interface="IAddAndEditFromHanwha()"
                    :value="inputFormData"
                    @update:siteId="selectAreaId($event)"
                    @update:areaId="selectGroupDeviceId($event)"
                    @update:*="tempSaveInputData($event)"
                    @submit="saveAddOrEditHanwha($event)"
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

            <!-- view by Hanwha -->
            <!--        <iv-card-->
            <!--            v-show="pageStep === ePageStep.view && addStep === eAddStep.hanwha"-->
            <!--            :visible="true"-->
            <!--            :label="_('w_VSPeopleCounting_View')"-->
            <!--        >-->

            <iv-card
                key="transition_4"
                v-show="transition.step === 4"
                :visible="true"
                :label="_('w_VSPeopleCounting_View')"
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IViewFromHanwha()"
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

            <!-- add and edit by iSap FRS and FRS Manager  -->
            <!--        <iv-auto-card-->
            <!--            v-show="(addStep === eAddStep.isapFrs && pageStep === ePageStep.add) || (addStep === eAddStep.isapFrsManager && pageStep === ePageStep.add) || (addStep === eAddStep.isapFrs && pageStep === ePageStep.edit) || (addStep === eAddStep.isapFrsManager && pageStep === ePageStep.edit) "-->
            <!--            :label=showLabelTitle()-->
            <!--        >-->

            <iv-auto-card
                key="transition_5"
                v-show="transition.step === 5"
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
            <!--        <iv-card-->
            <!--            v-show="(pageStep === ePageStep.view && addStep === eAddStep.isapFrs) || (pageStep === ePageStep.view && addStep === eAddStep.isapFrs)"-->
            <!--            :visible="true"-->
            <!--            :label="_('w_VSPeopleCounting_View')"-->
            <!--        >-->

            <iv-card
                key="transition_6"
                v-show="transition.step === 6"
                :visible="true"
                :label="_('w_VSPeopleCounting_View')"
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
                key="transition_7"
                v-show="transition.step === 7"
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
import { IConfig, IConfigiSap, IConfigiSapFRSManager } from "@/config/default/api/interfaces";

// Region Tree
import {
    ERegionType,
    IRegionItem,
    RegionTreeItem,
    IRegionTreeSelected
} from "@/components/RegionTree";

// Service
import Datetime from "@/services/Datetime";
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import RegionAPI from "@/components/RegionTree/models/RegionAPI";
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
    hanwha = "hanwha",
    isap = "isap",
    frs = "frs",
    frsManager = "frsManager",
    none = "none",
}

enum ECameraMode {
    peopleCounting = "peopleCounting"
}

@Component({
    components: {}
})
export default class PeopleCounting extends Vue {
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
    sourceIdSelectItem: any = {};
    frsIdSelectItem: any = {};

    params: any = {
        mode: ECameraMode.peopleCounting
    };

    // tree 相關
    selectType = ERegionType.site;
    regionTreeItem = new RegionTreeItem();
    selecteds: IRegionTreeSelected[] = [];

    inputFormData: any = {
        stepType: "",
        customId: "",
        areaId: "",
        siteId: "",
        groupIds: [],
        name: "",
        brand: "",
        model: "xnd6020r",
        protocol: "http",
        ip: "",
        port: null,
        account: "",
        password: "",
        serverId: "", // FRS 和 FRS Manager 共用
        sourceid: "",
        location: "",
        direction: "", // FRS 和 FRS Manager 共用
        objectId: "",
        // FRS Manager
        frsId: "",
        sourceId: "",
    };

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
            brand: "",
            model: "xnd6020r",
            protocol: "http",
            ip: "",
            port: null,
            account: "",
            password: "",
            serverId: "", // FRS 和 FRS Manager 共用
            sourceid: "",
            location: "",
            direction: "", // FRS 和 FRS Manager 共用
            objectId: "",
            // FRS Manager
            frsId: "",
            sourceId: "",
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
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response) {
                        this.sitesSelectItem[returnValue.objectId] =
                            returnValue.name;
                        this.regionTreeItem.tree = RegionAPI.analysisApiResponse(
                            returnValue
                        );
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemTree() {
        await this.$server
            .R("/location/tree")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.regionTreeItem.tree = RegionAPI.analysisApiResponse(
                        response
                    );
                    this.regionTreeItem.region = this.regionTreeItem.tree;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemFRSServer() {
        this.serverIdSelectItem = {};

        if (this.addStep === EAddStep.frs) {
            await this.$server
                .R("/partner/frs")
                .then((response: any) => {
                    ResponseFilter.successCheck(this, response, (response: any) => {
                        for (const returnValue of response.results) {
                            this.serverIdSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                    });
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else if (this.addStep === EAddStep.frsManager) {
            // TODO:
            // await this.$server
            //     .R("/partner/frs-manager")
            //     .then((response: any) => {
            //         ResponseFilter.successCheck(this, response, (response: any) => {
            //             for (const returnValue of response.results) {
            //                 this.serverIdSelectItem[returnValue.objectId] =
            //                     returnValue.name;
            //             }
            //         });
            //     })
            //     .catch((e: any) => {
            //         return ResponseFilter.catchError(this, e);
            //     });
        }


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
                brand: param.brand,
                customId: param.customId,
                objectId: param.objectId,
                siteId:
                    param.site && param.site["objectId"]
                        ? param.site["objectId"]
                        : "",
                groupIds: param.groups,
                model: param.model,
                direction: param.direction,
                account:
                    param.config && param.config["account"]
                        ? param.config["account"]
                        : "",
                password:
                    param.config && param.config["password"]
                        ? param.config["password"]
                        : "",
                protocol:
                    param.config && param.config["protocol"]
                        ? param.config["protocol"]
                        : "",
                ip:
                    param.config && param.config["ip"]
                        ? param.config["ip"]
                        : "",
                port:
                    param.config && param.config["port"]
                        ? param.config["port"]
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
                        : "",

                // TODO: check param
                frsId:
                    param.config && param.config.frsId
                        ? param.config.frsId
                        : "",
                frsIdView:
                    param.config && param.config.frsId
                        ? param.config.frsId
                        : "",
                sourceId:
                    param.config && param.config.sourceId
                        ? param.config.sourceId
                        : "",
                sourceIdView:
                    param.config && param.config.sourceId
                        ? param.config.sourceId
                        : "",
            };
        }

        if (this.pageStep === EPageStep.edit) {
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
            case "model":
                this.inputFormData.model = data.value;
                break;
            case "protocol":
                this.inputFormData.protocol = data.value;
                break;
            case "ip":
                this.inputFormData.ip = data.value;
                break;
            case "port":
                this.inputFormData.port = data.value;
                break;
            case "account":
                this.inputFormData.account = data.value;
                break;
            case "password":
                this.inputFormData.password = data.value;
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
            case "sourceId":
                this.inputFormData.sourceId = data.value;
                break;
            case "frsId":
                this.inputFormData.frsId = data.value;
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

        if (this.addStep === EAddStep.frs) {
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
                        ResponseFilter.successCheck(
                            this,
                            response,
                            (response: any) => {
                                for (const returnValue of response) {
                                    this.$set(
                                        this.sourceIdSelectItem,
                                        returnValue.sourceid,
                                        returnValue.sourceid
                                    );
                                }
                            },
                            this._("w_ErrorReadData")
                        );
                    })
                    .catch((e: any) => {
                        return ResponseFilter.catchError(
                            this,
                            e,
                            this._("w_ErrorReadData")
                        );
                    });
            }
        } else if(this.addStep === EAddStep.frsManager) {

            // TODO: Min
            if (data !== undefined) {
                // const readParam: {
                //     objectId: string;
                // } = {
                //     objectId: data
                // };
                //
                // Loading.show();
                // await this.$server
                //     .C("/partner/frs/device", readParam)
                //     .then((response: any) => {
                //         ResponseFilter.successCheck(
                //             this,
                //             response,
                //             (response: any) => {
                //                 for (const returnValue of response) {
                //                     this.$set(
                //                         this.sourceIdSelectItem,
                //                         returnValue.sourceid,
                //                         returnValue.sourceid
                //                     );
                //                 }
                //             },
                //             this._("w_ErrorReadData")
                //         );
                //     })
                //     .catch((e: any) => {
                //         return ResponseFilter.catchError(
                //             this,
                //             e,
                //             this._("w_ErrorReadData")
                //         );
                //     });
            }
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
                        ResponseFilter.successCheck(
                            this,
                            response,
                            (response: any) => {
                                for (const returnValue of response) {
                                    this.inputFormData.areaId = "";
                                    this.inputFormData.groupIds = [];
                                    this.$set(
                                        this.areaSelectItem,
                                        returnValue.objectId,
                                        returnValue.name
                                    );
                                }
                            }
                        );
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
                        ResponseFilter.successCheck(
                            this,
                            response,
                            (response: any) => {
                                for (const returnValue of response) {
                                    this.$set(
                                        this.areaSelectItem,
                                        returnValue.objectId,
                                        returnValue.name
                                    );
                                }
                            }
                        );
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
                    mode: ECameraMode.peopleCounting
                };

                await this.$server
                    .R("/device/group/all", readParam)
                    .then((response: any) => {
                        ResponseFilter.successCheck(
                            this,
                            response,
                            (response: any) => {
                                for (const returnValue of response) {
                                    this.inputFormData.groupIds = [];
                                    this.$set(
                                        this.deviceGroupSelectItem,
                                        returnValue.objectId,
                                        returnValue.name
                                    );
                                }
                            }
                        );
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
                    mode: ECameraMode.peopleCounting
                };

                if (this.inputFormData.tempAreaId !== data) {
                    this.inputFormData.groupIds = [];
                }

                await this.$server
                    .R("/device/group/all", readParam)
                    .then((response: any) => {
                        ResponseFilter.successCheck(
                            this,
                            response,
                            (response: any) => {
                                for (const returnValue of response) {
                                    this.$set(
                                        this.deviceGroupSelectItem,
                                        returnValue.objectId,
                                        returnValue.name
                                    );
                                }
                            }
                        );
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

    pageToList() {
        this.pageStep = EPageStep.list;
        this.addStep = EAddStep.none;
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        (this.$refs.listTable as any).reload();
    }

    async pageToAdd(stepType: string) {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
        this.clearInputData();
        await this.initSelectItemSite();
        this.pageStep = EPageStep.add;
        this.addStep = EAddStep.select;
        this.inputFormData.stepType = stepType;
        this.selecteds = [];
    }

    async pageToEdit(stepType: string) {
        this.pageStep = EPageStep.edit;

        await this.getInputData();

        if (this.inputFormData.brand === EAddStep.hanwha) {
            this.addStep = EAddStep.hanwha;
            this.transition.prevStep = this.transition.step;
            this.transition.step = 3;
        }

        if (this.inputFormData.model === EAddStep.frs) {
            this.addStep = EAddStep.frs;
            this.transition.prevStep = this.transition.step;
            this.transition.step = 5;
        }

        if (this.inputFormData.model === EAddStep.frsManager) {
            this.addStep = EAddStep.frsManager;
            this.transition.prevStep = this.transition.step;
            this.transition.step = 5;
        }

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

    }

    pageToView() {
        this.pageStep = EPageStep.view;
        this.getInputData();
        if (this.inputFormData.brand === EAddStep.hanwha) {
            this.addStep = EAddStep.hanwha;
            this.transition.prevStep = this.transition.step;
            this.transition.step = 4;
        }

        if (this.inputFormData.model === EAddStep.frs) {
            this.addStep = EAddStep.frs;
            this.transition.prevStep = this.transition.step;
            this.transition.step = 6;
        }

        if (this.inputFormData.model === EAddStep.frsManager) {
            this.addStep = EAddStep.frsManager;
            this.transition.prevStep = this.transition.step;
            this.transition.step = 6;
        }
    }

    async pageToAddByHanwha() {
        this.clearInputData();
        await this.initSelectItemSite();
        this.addStep = EAddStep.hanwha;
        this.inputFormData.stepType = EPageStep.add;
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
    }

    async pageToAddByiSapFRS() {
        this.addStep = EAddStep.frs;
        this.clearInputData();
        await this.initSelectItemFRSServer();
        await this.initSelectItemSite();
        this.inputFormData.stepType = EPageStep.add;
        this.transition.prevStep = this.transition.step;
        this.transition.step = 5;
    }

    async pageToAddByiSapFRSManager() {
        this.addStep = EAddStep.frsManager;
        this.clearInputData();
        await this.initSelectItemFRSServer();
        await this.initSelectItemSite();

        this.inputFormData.stepType = EPageStep.add;
        this.transition.prevStep = this.transition.step;
        this.transition.step = 5;
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
        this.transition.step = 7;
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

    async saveAddOrEditHanwha(data) {
        const configObject: IConfig = {
            protocol: data.protocol,
            ip: data.ip,
            port: data.port,
            account: data.account,
            password: data.password
        };

        if (this.inputFormData.stepType === EPageStep.add) {
            const datas: any = [
                {
                    customId: data.customId,
                    name: data.name,
                    brand: EAddStep.hanwha,
                    model: data.model,
                    areaId: data.areaId,
                    groupIds: data.groupIds !== undefined ? data.groupIds : [],
                    config: configObject
                }
            ];

            const addParam = {
                datas
            };

            Loading.show();
            await this.$server
                .C("/device/people-counting", addParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(
                                this._("w_VSPeopleCounting_AddSuccess")
                            );
                            this.pageToList();
                        },
                        this._("w_VSPeopleCounting_ADDFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_VSPeopleCounting_ADDFailed")
                    );
                });
        }

        if (this.inputFormData.stepType === EPageStep.edit) {
            const datas: any = [
                {
                    objectId: data.objectId,
                    name: data.name,
                    brand: EAddStep.hanwha,
                    model: data.model,
                    areaId: data.areaId,
                    groupIds: data.groupIds !== undefined ? data.groupIds : [],
                    config: configObject
                }
            ];

            const editParam = {
                datas
            };

            Loading.show();
            await this.$server
                .U("/device/people-counting", editParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(
                                this._("w_VSPeopleCounting_EditSuccess")
                            );
                            this.pageToList();
                        },
                        this._("w_VSPeopleCounting_EditFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_VSPeopleCounting_EditFailed")
                    );
                });
        }
    }

    async saveAddOrEditiSap(data) {

        if (this.addStep === EAddStep.frs) {

            const configFRSServerObject: IConfigiSap = {
                serverId: data.serverId,
                sourceid: data.sourceid
            };

            if (!this.inputFormData.objectId) {

                const datas: any = [
                    {
                        customId: data.customId,
                        name: data.name,
                        brand: EAddStep.isap,
                        model: EAddStep.frs,
                        areaId: data.areaId,
                        direction: data.direction,
                        groupIds: data.groupIds !== undefined ? data.groupIds : [],
                        config: configFRSServerObject
                    }
                ];

                const addParam = {
                    datas
                };

                Loading.show();
                await this.$server
                    .C("/device/people-counting", addParam)
                    .then((response: any) => {
                        ResponseFilter.successCheck(
                            this,
                            response,
                            (response: any) => {
                                Dialog.success(
                                    this._("w_VSPeopleCounting_AddSuccess")
                                );
                                this.pageToList();
                            },
                            this._("w_VSPeopleCounting_ADDFailed")
                        );
                    })
                    .catch((e: any) => {
                        return ResponseFilter.catchError(
                            this,
                            e,
                            this._("w_VSPeopleCounting_ADDFailed")
                        );
                    });
            } else {
                const datas: any = [
                    {
                        objectId: data.objectId,
                        name: data.name,
                        brand: EAddStep.isap,
                        model: EAddStep.frs,
                        areaId: data.areaId,
                        direction: data.direction,
                        groupIds: data.groupIds !== undefined ? data.groupIds : [],
                        config: configFRSServerObject
                    }
                ];

                const editParam = {
                    datas
                };

                Loading.show();
                await this.$server
                    .U("/device/people-counting", editParam)
                    .then((response: any) => {
                        ResponseFilter.successCheck(
                            this,
                            response,
                            (response: any) => {
                                Dialog.success(
                                    this._("w_VSPeopleCounting_EditSuccess")
                                );
                                this.pageToList();
                            },
                            this._("w_VSPeopleCounting_EditFailed")
                        );
                    })
                    .catch((e: any) => {
                        return ResponseFilter.catchError(
                            this,
                            e,
                            this._("w_VSPeopleCounting_EditFailed")
                        );
                    });
            }

        }


        if (this.addStep === EAddStep.frsManager) {

            const configFRSManagerObject: IConfigiSapFRSManager = {
                serverId: data.serverId,
                frsId: data.frsId,
                sourceId: data.sourceId,
            };

            if (!this.inputFormData.objectId) {

                const datas: any = [
                    {
                        customId: data.customId,
                        name: data.name,
                        brand: EAddStep.isap,
                        model: EAddStep.frs,
                        areaId: data.areaId,
                        direction: data.direction,
                        groupIds: data.groupIds !== undefined ? data.groupIds : [],
                        config: configFRSManagerObject
                    }
                ];

                const addParam = {
                    datas
                };

                Loading.show();
                await this.$server
                    .C("/device/people-counting", addParam)
                    .then((response: any) => {
                        ResponseFilter.successCheck(
                            this,
                            response,
                            (response: any) => {
                                Dialog.success(
                                    this._("w_VSPeopleCounting_AddSuccess")
                                );
                                this.pageToList();
                            },
                            this._("w_VSPeopleCounting_ADDFailed")
                        );
                    })
                    .catch((e: any) => {
                        return ResponseFilter.catchError(
                            this,
                            e,
                            this._("w_VSPeopleCounting_ADDFailed")
                        );
                    });
            } else {
                const datas: any = [
                    {
                        objectId: data.objectId,
                        name: data.name,
                        brand: EAddStep.isap,
                        model: EAddStep.frs,
                        areaId: data.areaId,
                        direction: data.direction,
                        groupIds: data.groupIds !== undefined ? data.groupIds : [],
                        config: configFRSManagerObject
                    }
                ];

                const editParam = {
                    datas
                };

                Loading.show();
                await this.$server
                    .U("/device/people-counting", editParam)
                    .then((response: any) => {
                        ResponseFilter.successCheck(
                            this,
                            response,
                            (response: any) => {
                                Dialog.success(
                                    this._("w_VSPeopleCounting_EditSuccess")
                                );
                                this.pageToList();
                            },
                            this._("w_VSPeopleCounting_EditFailed")
                        );
                    })
                    .catch((e: any) => {
                        return ResponseFilter.catchError(
                            this,
                            e,
                            this._("w_VSPeopleCounting_EditFailed")
                        );
                    });
            }

        }
    }

    async doDelete() {
        await Dialog.confirm(
            this._("w_VSPeopleCounting_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {

                let deleteParam: {
                    objectId: any;
                } = {
                    objectId: []
                };

                for (const param of this.selectedDetail) {
                    deleteParam.objectId.push(param.objectId);
                }

                Loading.show();

                    this.$server
                        .D("/device", deleteParam)
                        .then((response: any) => {
                            ResponseFilter.successCheck(
                                this,
                                response,
                                (response: any) => {
                                    this.pageToList();
                                },
                                this._("w_DeleteFailed")
                            );
                        })
                        .catch((e: any) => {
                            return ResponseFilter.catchError(this, e);
                        });

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
            this.addStep === EAddStep.frs
        ) {
            return this._("w_VSPeopleCounting_AddisapUseFRS");
        }

        if (
            this.pageStep === EPageStep.add &&
            this.addStep === EAddStep.frsManager
        ) {
            return this._("w_VSPeopleCounting_AddisapUseFRSManger");
        }

        if (
            this.pageStep === EPageStep.edit &&
            this.addStep === EAddStep.frs
        ) {
            return this._("w_VSPeopleCounting_EditisapUseFRS");
        }

        if (
            this.pageStep === EPageStep.edit &&
            this.addStep === EAddStep.frsManager
        ) {
            return this._("w_VSPeopleCounting_EditisapUseFRSManger");
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
             * @uiLabel - ${this._("w_Model")}
             */
            model: string;


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

    IAddAndEditFromHanwha() {
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
                 * @uiLabel - ${this._("w_Model")}
                 */
                model: ${toEnumInterface({
                    xnd6020r: "xnd6020r"
                })};


                /**
                 * @uiLabel - ${this._("w_Account")}
                 * @uiPlaceHolder - ${this._("w_Account")}
                 */
                account: string;


                /**
                 * @uiLabel - ${this._("w_Password")}
                 * @uiPlaceHolder - ${this._("w_Password")}
                 * @uiType - iv-form-password
                 *                  */
                password: string;


                /**
                 * @uiLabel - ${this._("w_Protocol")}
                 */
                protocol: ${toEnumInterface({
                    http: "http",
                    https: "https"
                })};


                /**
                 * @uiLabel - ${this._("w_Ip")}
                 * @uiPlaceHolder - ${this._("w_Ip")}
                 * @uiType - iv-form-ip
                 */
                ip: string;


                /**
                 * @uiLabel - ${this._("w_Port")}
                 * @uiPlaceHolder - ${this._("w_Port_PlaceHolder")}
                 * @uiAttrs - { max: 65535, min: 1}
                 */
                port: number;


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 */
                siteId: ${toEnumInterface(this.sitesSelectItem as any, false)};

                selectTree?: any;


                /**
                 * @uiLabel - ${this._("w_Area")}
                 */
                areaId: ${toEnumInterface(this.areaSelectItem as any, false)};


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

    IViewFromHanwha() {
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
                 * @uiLabel - ${this._("w_Model")}
                 * @uiType - iv-form-label
                 */
                model?: string;


                /**
                 * @uiLabel - ${this._("w_Account")}
                 * @uiType - iv-form-label
                 */
                account?: string;


                /**
                 * @uiLabel - ${this._("w_Protocol")}
                 * @uiType - iv-form-label
                 */
                protocol?: string;


                /**
                 * @uiLabel - ${this._("w_Ip")}
                 * @uiType - iv-form-label
                 */
                ip?: string;


                /**
                 * @uiLabel - ${this._("w_Port")}
                 * @uiType - iv-form-label
                 */
                port?: number;


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
                 */
                serverId: ${toEnumInterface(
                    this.serverIdSelectItem as any,
                    false
                )};


                /**
                 * @uiLabel - ${this._("w_SourceId")}
                 * @uiPlaceHolder - ${this._("w_SourceId")}
                 * @uiHidden - ${
                     this.addStep === EAddStep.frsManager ? "true" : "false"
                 }
                 */
                sourceid: ${toEnumInterface(
                    this.sourceIdSelectItem as any,
                    false
                )};


               /**
                 * @uiLabel - ${this._("w_FRSId")}
                 * @uiPlaceHolder - ${this._("w_FRSId")}
                 * @uiHidden - ${
                        this.addStep === EAddStep.frs ? "true" : "false"
                    }
                 */
                frsId: ${toEnumInterface(
                    this.frsIdSelectItem as any,
                    false
                )};

               /**
                 * @uiLabel - ${this._("w_SourceId")}
                 * @uiPlaceHolder - ${this._("w_SourceId")}
                 * @uiHidden - ${
                        this.addStep === EAddStep.frs ? "true" : "false"
                    }
                 */
                sourceId: ${toEnumInterface(
                    this.sourceIdSelectItem as any,
                    false
                )};


                /**
                 * @uiLabel - ${this._("w_Direction")}
                 * @uiPlaceHolder - ${this._("w_Direction")}
                 */
                direction: ${toEnumInterface({
                    in: this._("w_In"),
                    out: this._("w_Out")
                })};


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 */
                siteId: ${toEnumInterface(this.sitesSelectItem as any, false)};

                selectTree?: any;


                /**
                 * @uiLabel - ${this._("w_Area")}
                 */
                areaId: ${toEnumInterface(this.areaSelectItem as any, false)};


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
                 * @uiLabel - ${this._("w_FRSId")}
                 * @uiType - iv-form-label
                 * @uiHidden - ${ this.addStep === EAddStep.frs ? "true" : "false" }
                 */
                 */
                frsIdView?: string;


                /**
                 * @uiLabel - ${this._("w_SourceId")}
                 * @uiType - iv-form-label
                 * @uiHidden - ${ this.addStep === EAddStep.frs ? "true" : "false" }
                 */
                 */
                sourceIdView?: string;



                /**
                 * @uiLabel - ${this._("w_Direction")}
                 * @uiType - iv-form-label
                 */
                direction?: direction;


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
