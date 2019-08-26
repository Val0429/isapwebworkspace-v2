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
            <!-- v-show="addStep === eAddStep.select" -->
            <iv-card
                key="transition_2"
                v-show="transition.step === 2"
                :label="_('w_VSVIP_Stranger_Visitor_Add') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList" />
                </template>

<!--                <div class="font-weight-bold"> {{ _('w_iSap_Use') }}</div>-->

<!--                <b-button-->
<!--                    class="button mt-3 mb-1"-->
<!--                    size="md"-->
<!--                    variant="success"-->
<!--                    type="button"-->
<!--                    @click="pageToAddByiSapFRS(eAddStep.frs)"-->
<!--                >-->
<!--                    {{ _('w_iSapFRS') }}-->
<!--                </b-button>-->

<!--                <b-button-->
<!--                    variant="link"-->
<!--                    class="mt-4"-->
<!--                    @click="goToSetFRSServer"-->
<!--                >-->
<!--                    {{ _('w_SetFRS') }}-->
<!--                </b-button>-->

<!--                <br>-->

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
                    @update:serverId="selectFrsMangerId($event)"
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
import { IConfigiSap, IConfigiSapFRSManager } from "@/config/default/api/interfaces";

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
import RegionAPI from "@/components/RegionTree/models/RegionAPI";
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
    frs = "frs",
    frsManager = "frsManager",
    none = "none"
}

enum ECameraMode {
    visitor = "visitor"
}

@Component({
    components: {}
})
export default class FaceRecognition extends Vue {
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
    demographicIdSelectItem: any = {};
    frsIdSelectItem: any = {};
    frsIPSelectItem: any = {};
    frsMangerIdSelectItem: any = {};
    frsMangerServerIdSelectItem: any = {};

    params: any = {
        mode: ECameraMode.visitor
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
        demoServerId: "",   // FRS 和 FRS Manager 共用
        serverId: "",   // FRS 和 FRS Manager 共用
        sourceid: "",
        location: "",
        objectId: "",
        // FRS Manager
        frsId: "",
        sourceId: "",
        model: '',
        brand: '',
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
            demoServerId: "",   // FRS 和 FRS Manager 共用
            serverId: "",   // FRS 和 FRS Manager 共用
            sourceid: "",
            location: "",
            objectId: "",
            // FRS Manager
            frsId: "",
            sourceId: "",
            model: '',
            brand: '',
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

    async initSelectItemDemographicServer() {
        this.demographicIdSelectItem = {};

        await this.$server
            .R("/partner/demographic")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response.results) {
                        this.demographicIdSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemFRSSManagerServer() {
        this.frsMangerIdSelectItem = {};

        if (this.addStep === EAddStep.frs) {
            await this.$server
                .R("/partner/frs-manager")
                .then((response: any) => {
                    ResponseFilter.successCheck(this, response, (response: any) => {
                        for (const returnValue of response.results) {
                            this.frsMangerIdSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                    });
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else if (this.addStep === EAddStep.frsManager) {
            await this.$server
                .R("/partner/frs-manager")
                .then((response: any) => {
                    ResponseFilter.successCheck(this, response, (response: any) => {
                        for (const returnValue of response.results) {
                            this.frsMangerIdSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                    });
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
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
                model: param.model,
                brand: param.brand,
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
                        : "",

                frsId:
                    param.config && param.config.frsId
                        ? param.config.frsId
                        : "",
                frsIdView:
                    param.config && param.config.frsIp
                        ? param.config.frsIp
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

        if (this.inputFormData.serverId !== "") {
            this.selectFrsMangerId(this.inputFormData.serverId);
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
            case "demoServerId":
                this.inputFormData.demoServerId = data.value;
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

    async selectFrsMangerId(data) {
         await this.initFrsId(data);
    }

    async initFrsId(data) {

        this.frsIdSelectItem = {};
        this.sourceIdSelectItem = {};

        if (data !== undefined) {
            const readParam: {
                objectId: string;
            } = {
                objectId: data
            };

            Loading.show();
            await this.$server
                .C("/partner/frs-manager/device", readParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {

                            for (const returnValue of response) {
                                this.$set(
                                    this.frsIdSelectItem,
                                    returnValue.frsId,
                                    returnValue.frsIp
                                );
                            }

                            for (const returnValue of response) {
                                for (const value of returnValue.channels) {
                                    this.$set(
                                        this.sourceIdSelectItem,
                                        value.sourceId,
                                        value.sourceId
                                    );
                                }

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
                .C("/partner/frs-manager/device", readParam)
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
                    mode: ECameraMode.visitor
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
                    mode: ECameraMode.visitor
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
        this.inputFormData.stepType = stepType;
        this.pageStep = EPageStep.add;
        await this.initSelectItemSite();
        await this.initSelectItemDemographicServer();
        await this.initSelectItemFRSSManagerServer();
        this.addStep = EAddStep.select;
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
        this.selecteds = [];
    }

    async pageToEdit(stepType: string) {
        this.pageStep = EPageStep.edit;

	    await this.getInputData();

	    if (this.inputFormData.model === EAddStep.frs) {
		    this.addStep = EAddStep.frs;
		    this.transition.prevStep = this.transition.step;
		    this.transition.step = 3;
	    }

	    if (this.inputFormData.model === EAddStep.frsManager) {
		    this.addStep = EAddStep.frsManager;
		    this.transition.prevStep = this.transition.step;
		    this.transition.step = 3;
	    }

	    await this.initSelectItemFRSServer();
        await this.initSelectItemSite();
        await this.initSelectItemDemographicServer();
        await this.selectAreaId(this.inputFormData.siteId);
        await this.selectGroupDeviceId(this.inputFormData.areaId);

        await this.initSelectItemFRSSManagerServer();


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

        if (this.inputFormData.model === EAddStep.frs) {
            this.addStep = EAddStep.frs;
            this.transition.prevStep = this.transition.step;
            this.transition.step = 4;
        }

        if (this.inputFormData.model === EAddStep.frsManager) {
            this.addStep = EAddStep.frsManager;
            this.transition.prevStep = this.transition.step;
            this.transition.step = 4;
        }
    }

    async pageToAddByiSapFRS() {

        this.addStep = EAddStep.frsManager;
        this.clearInputData();

        await this.initSelectItemFRSServer();
        await this.initSelectItemDemographicServer();
        await this.initSelectItemFRSSManagerServer();
        await this.initSelectItemSite();
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;

    }

    async pageToAddByiSapFRSManager() {
        // this.inputFormData.stepType = EPageStep.add;
        this.addStep = EAddStep.frsManager;

        await this.initSelectItemSite();
        await this.initSelectItemDemographicServer();
        await this.initSelectItemFRSSManagerServer();
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
        console.log(' pageToShowResult this.inputFormData.stepType ~ ', this.inputFormData.stepType)
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

        if (this.addStep === EAddStep.frs) {

            const configFRSServerObject: IConfigiSap = {
                serverId: data.serverId,
                sourceid: data.sourceid
            };

            if (!this.inputFormData.objectId) {

                const datas: any = [
                    {
                        customId: data.customId,
                        brand: EAddStep.isap,
                        model: EAddStep.frs,
                        name: data.name,
                        areaId: data.areaId,
                        demoServerId: data.demoServerId,
                        groupIds: data.groupIds !== undefined ? data.groupIds : [],
                        config: configFRSServerObject
                    }
                ];

                const addParam = {
                    datas
                };
                Loading.show();
                await this.$server
                    .C("/device/visitor", addParam)
                    .then((response: any) => {
                        ResponseFilter.successCheck(
                            this,
                            response,
                            (response: any) => {
                                Dialog.success(
                                    this._("w_VSVIP_Stranger_Visitor_AddSuccess")
                                );
                                this.pageToList();
                            },
                            this._("w_VSVIP_Stranger_Visitor_ADDFailed")
                        );
                    })
                    .catch((e: any) => {
                        return ResponseFilter.catchError(
                            this,
                            e,
                            this._("w_VSVIP_Stranger_Visitor_ADDFailed")
                        );
                    });
            } else {
                const datas: any = [
                    {
                        objectId: data.objectId,
                        brand: EAddStep.isap,
                        model: EAddStep.frs,
                        name: data.name,
                        areaId: data.areaId,
                        demoServerId: data.demoServerId,
                        groupIds: data.groupIds !== undefined ? data.groupIds : [],
                        config: configFRSServerObject
                    }
                ];

                const editParam = {
                    datas
                };
                Loading.show();
                await this.$server
                    .U("/device/visitor", editParam)
                    .then((response: any) => {
                        ResponseFilter.successCheck(
                            this,
                            response,
                            (response: any) => {
                                Dialog.success(
                                    this._("w_VSVIP_Stranger_Visitor_EditSuccess")
                                );
                                this.pageToList();
                            },
                            this._("w_VSVIP_Stranger_Visitor_EditFailed")
                        );
                    })
                    .catch((e: any) => {
                        return ResponseFilter.catchError(
                            this,
                            e,
                            this._("w_VSVIP_Stranger_Visitor_EditFailed")
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

            if (data.frsId) {
                for (const frsId in this.frsIdSelectItem) {
                    if (data.frsId === frsId) {
                        configFRSManagerObject.frsIp = this.frsIdSelectItem[frsId]
                    }
                }
            }

            if (!this.inputFormData.objectId) {

                const datas: any = [
                    {
                        customId: data.customId,
                        brand: EAddStep.isap,
                        model: EAddStep.frsManager,
                        name: data.name,
                        areaId: data.areaId,
                        demoServerId: data.demoServerId,
                        groupIds: data.groupIds !== undefined ? data.groupIds : [],
                        config: configFRSManagerObject
                    }
                ];

                const addParam = {
                    datas
                };

                Loading.show();
                await this.$server
                    .C("/device/visitor", addParam)
                    .then((response: any) => {
                        ResponseFilter.successCheck(
                            this,
                            response,
                            (response: any) => {
                                Dialog.success(
                                    this._("w_VSVIP_Stranger_Visitor_AddSuccess")
                                );
                                this.pageToList();
                            },
                            this._("w_VSVIP_Stranger_Visitor_ADDFailed")
                        );
                    })
                    .catch((e: any) => {
                        return ResponseFilter.catchError(
                            this,
                            e,
                            this._("w_VSVIP_Stranger_Visitor_ADDFailed")
                        );
                    });
            } else {
                const datas: any = [
                    {
                        objectId: data.objectId,
                        customId: data.customId,
                        brand: EAddStep.isap,
                        model: EAddStep.frsManager,
                        name: data.name,
                        areaId: data.areaId,
                        demoServerId: data.demoServerId,
                        groupIds: data.groupIds !== undefined ? data.groupIds : [],
                        config: configFRSManagerObject
                    }
                ];

                const editParam = {
                    datas
                };

                Loading.show();
                await this.$server
                    .U("/device/visitor", editParam)
                    .then((response: any) => {
                        ResponseFilter.successCheck(
                            this,
                            response,
                            (response: any) => {
                                Dialog.success(
                                    this._("w_VSVIP_Stranger_Visitor_EditSuccess")
                                );
                                this.pageToList();
                            },
                            this._("w_VSVIP_Stranger_Visitor_EditFailed")
                        );
                    })
                    .catch((e: any) => {
                        return ResponseFilter.catchError(
                            this,
                            e,
                            this._("w_VSVIP_Stranger_Visitor_EditFailed")
                        );
                    });
            }

        }
    }

    async doDelete() {
        await Dialog.confirm(
            this._("w_VSVIP_Stranger_Visitor_DeleteConfirm"),
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
            return this._("w_VSVIP_Stranger_Visitor_AddisapUseFRS");
        }

        if (
            this.pageStep === EPageStep.add &&
            this.addStep === EAddStep.frsManager
        ) {
            return this._("w_VSVIP_Stranger_Visitor_AddisapUseFRSManger");
        }

        if (
            this.pageStep === EPageStep.edit &&
            this.addStep === EAddStep.frs
        ) {
            return this._("w_VSVIP_Stranger_Visitor_EditisapUseFRS");
        }

        if (
            this.pageStep === EPageStep.edit &&
            this.addStep === EAddStep.frsManager
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
                        !this.inputFormData.objectId
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
                 */
                demoServerId: ${toEnumInterface(
                    this.demographicIdSelectItem as any,
                    false
                )};


                /**
                 * @uiLabel - ${this._("w_ServerId")}
                 * @uiPlaceHolder - ${this._("w_ServerId")}
                 */
                serverId: ${toEnumInterface(
                    this.frsMangerIdSelectItem as any,
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
                 * @uiHidden - ${ this.addStep === EAddStep.frsManager ? "true" : "false" }
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
