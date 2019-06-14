<template>
    <div class="animated fadeIn">
        <iv-card
            v-show="pageStep === ePageStep.list"
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
                ref="peopleCountingTable"
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
        <iv-card
            v-show="addStep === eAddStep.select"
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

            <div class="font-weight-bold"> {{ _('w_VSPeopleCounting_isap') }}</div>

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
                {{ _('w_VSPeopleCounting_SetFRS') }}
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
                {{ _('w_VSPeopleCounting_SetFRSManger') }}
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
        <iv-auto-card
            v-show="addStep === eAddStep.hanwha"
            :label="addStep === eAddStep.hanwha ? _('w_VSPeopleCounting_AddhanwhaUse') : _('w_VSPeopleCounting_Edit')"
        >
            <template #toolbox>
                <iv-toolbox-leave @click="pageToList" />
                <iv-toolbox-step-backward @click="pageStepBackward" />
            </template>

            <iv-form
                :interface="IAddAndEditFromHanwha()"
                :value="inputPeopleCountingData"
                @submit="saveAddOrEditHanwha($event)"
            >

            </iv-form>

            <template #footer-before>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToList"
                >{{ _('w_Leave') }}
                </b-button>

                <b-button
                    variant="secondary"
                    size="lg"
                    @click="pageStepBackward"
                >{{ _('w_StepBackward') }}
                </b-button>
            </template>

        </iv-auto-card>

        <!-- view by Hanwha -->
        <iv-card
            v-show="pageStep === ePageStep.view"
            :visible="true"
            :label="_('w_VSPeopleCounting_View')"
        >
            <template #toolbox>
                <iv-toolbox-back @click="pageToList()" />
            </template>

            <iv-form
                :interface="IViewFromHanwha()"
                :value="inputPeopleCountingData"
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
        <iv-auto-card
            v-show="addStep === eAddStep.isapFrs || addStep === eAddStep.isapFrsManager"
            :label="addStep === eAddStep.isapFrs ? _('w_VSPeopleCounting_isapUseFRS') :  _('w_VSPeopleCounting_isapUseFRSManger')"
        >
            <template #toolbox>
                <iv-toolbox-leave @click="pageToList" />
                <iv-toolbox-step-backward @click="pageStepBackward" />
            </template>

            <iv-form
                :interface="IAddAndEditFromiSap()"
                :value="inputPeopleCountingData"
                @update:serverId="selectSourceIdAndLocation($event)"
                @submit="saveAddOrEditiSap($event)"
            >

            </iv-form>

            <template #footer-before>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToList"
                >{{ _('w_Leave') }}
                </b-button>

                <b-button
                    variant="secondary"
                    size="lg"
                    @click="pageStepBackward"
                >{{ _('w_StepBackward') }}
                </b-button>
            </template>

        </iv-auto-card>

        <!-- view -->
        <!--        <iv-card-->
        <!--            v-show="pageStep === ePageStep.view"-->
        <!--            :visible="true"-->
        <!--            :label="_('w_BOCampaign_View')"-->
        <!--        >-->
        <!--            <template #toolbox>-->
        <!--                <iv-toolbox-back @click="pageToList()" />-->
        <!--            </template>-->

        <!--            <iv-form-->
        <!--                :interface="IViewFromHanwha()"-->
        <!--                :value="inputPeopleCountingData"-->
        <!--            >-->

        <!--            </iv-form>-->

        <!--            <template #footer>-->
        <!--                <b-button-->
        <!--                    variant="dark"-->
        <!--                    size="lg"-->
        <!--                    @click="pageToList()"-->
        <!--                >{{ _('w_Back') }}-->
        <!--                </b-button>-->
        <!--            </template>-->

        <!--        </iv-card>-->

        <region-tree-select
            v-show="pageStep === ePageStep.chooseTree"
            :regionTreeItem="regionTreeItem"
            :selectType="selectType"
            :selecteds="selecteds"
            v-on:click-back="pageToShowResult"
        >
        </region-tree-select>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import Datetime from "@/services/Datetime";
import { toEnumInterface } from "@/../core";
import { IConfig, IConfigiSap } from "@/config/default/api/interfaces";

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
    none = "none",
    showResult = "showResult",
    chooseTree = "chooseTree"
}

enum EAddStep {
    select = "select",
    hanwha = "hanwha",
    isap = "isap",
    isapFrs = "isapFrs",
    isapFrsManager = "isapFrsManager",
    none = "none"
}

enum ECameraMode {
    peopleCounting = "peopleCounting"
}

@Component({
    components: {}
})
export default class PeopleCounting extends Vue {
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
        mode: ECameraMode.peopleCounting
    };

    // tree 相關
    selectType = ERegionType.site;
    regionTreeItem = new RegionTreeItem();
    selecteds: IRegionTreeSelected[] = [];

    inputPeopleCountingData: any = {};

    created() {}

    mounted() {}

    clearInputData() {
        this.inputPeopleCountingData = {
            stepType: "",
            customId: "",
            areaId: "",
            groupIds: [],
            name: "",
            brand: "",
            model: "xnd6020r",
            protocol: "http",
            ip: "",
            port: null,
            account: "",
            password: "",
            serverId: "",
            sourceid: "",
            location: "",
            direction: "",
            objectId: ""
        };
    }

    initRegionTreeSelect() {
        this.regionTreeItem = new RegionTreeItem();
        this.regionTreeItem.titleItem.card = this._("w_SiteTreeSelect");
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
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });
    }

    async initSelectItemDeviceGroup() {
        await this.$server
            .R("/device/group/all")
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response) {
                        // 自定義 deviceGroupSelectItem 的 key 的方式
                        this.deviceGroupSelectItem[returnValue.objectId] =
                            returnValue.name;
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

    async initSelectItemArea() {
        await this.$server
            .R("/location/area/all")
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response) {
                        // 自定義 areaSelectItem 的 key 的方式
                        this.areaSelectItem[returnValue.objectId] =
                            returnValue.name;
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

    async initSelectItemFRSServer() {
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
        console.log('data - ', data)
    }

    getInputData() {

        this.clearInputData();
        for (const param of this.selectedDetail) {
            this.inputPeopleCountingData = {
                objectId: param.objectId,
                name: param.name,
                areaId: param.area["objectId"],
                site: param.site["name"],
                brand: param.brand,
                customId: param.customId,
                groupIds: param.groups,
                model: param.model,
                direction: param.direction,
                account: param.config["account"],
                password: param.config["password"],
                protocol: param.config["protocol"],
                ip: param.config["ip"],
                port: param.config["port"],
                serverId: param.config.server.objectId === undefined ? '' : param.config.server.objectId ,
                sourceid: param.config.sourceid,
                location: param.config.location,
                groupIdsText: this.idsToText(param.groups),
                stepType: ""
            };
        }
        //console.log(this.inputPeopleCountingData);
    }

    tempSaveInputData(data) {
        switch (data.key) {
            case "name":
                this.inputPeopleCountingData.name = data.value;
                break;
            case "type":
                this.inputPeopleCountingData.type = data.value;
                break;
            case "budget":
                this.inputPeopleCountingData.budget = data.value;
                break;
            case "description":
                this.inputPeopleCountingData.description = data.value;
                break;
            case "startDate":
                this.inputPeopleCountingData.startDate = data.value;
                break;
            case "endDate":
                this.inputPeopleCountingData.endDate = data.value;
                break;
            case "siteIds":
                this.inputPeopleCountingData.siteIds = data.value;
                break;
        }

        this.selecteds = [];

        for (const id of this.inputPeopleCountingData.siteIds) {
            for (const detail in this.sitesSelectItem) {
                if (id === detail) {
                    let selectedsObject: IRegionTreeSelected = {
                        objectId: detail,
                        type: ERegionType.site,
                        name: this.sitesSelectItem[detail]
                    };
                    this.selecteds.push(selectedsObject);
                }
            }
        }
    }

    async selectSourceIdAndLocation(data) {
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
                                    `${returnValue.sourceid} - ${
                                        returnValue.location
                                    }`,
                                    `${returnValue.sourceid} - ${
                                        returnValue.location
                                    }`
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
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    if (e.res.statusCode == 500) {
                        Dialog.error(this._("w_BOCampaign_ADDFailed"));
                        return false;
                    }
                    console.log(e);
                    return false;
                });
        }
        console.log("sourceIdSelectItem - ", this.sourceIdSelectItem);
    }

    async pageToAdd(stepType: string) {
        this.clearInputData();
        this.pageStep = EPageStep.add;
        this.addStep = EAddStep.select;
        this.inputPeopleCountingData.stepType = stepType;
        await this.initSelectItemSite();
        this.selecteds = [];
    }

    async pageToEdit(stepType: string) {
        this.pageStep = EPageStep.edit;
        this.getInputData();
        await this.initSelectItemFRSServer();
        await this.initSelectItemDeviceGroup();
        await this.initSelectItemArea();
        this.inputPeopleCountingData.stepType = stepType;
        this.inputPeopleCountingData.groupIds = JSON.parse(
            JSON.stringify(
                this.inputPeopleCountingData.groupIds.map(item => item.objectId)
            )
        );

        if (this.inputPeopleCountingData.brand === EAddStep.hanwha) {
            this.addStep = EAddStep.hanwha;
        }

        if (this.inputPeopleCountingData.serverId !== undefined) {
            this.addStep = EAddStep.isapFrs;
        }

        switch (this.inputPeopleCountingData.brand) {
            case EAddStep.hanwha:
                break;
            case EAddStep.isapFrsManager:
                this.addStep = EAddStep.isapFrsManager;
                break;
        }
        console.log('this.inputPeopleCountingData.brand - ', this.inputPeopleCountingData.brand)
    }

    pageToView() {
        this.pageStep = EPageStep.view;
        this.getInputData();
    }

    pageToList() {
        this.pageStep = EPageStep.list;
        this.addStep = EAddStep.none;
        (this.$refs.peopleCountingTable as any).reload();
    }

    async pageToAddByHanwha(brand: string) {
        this.clearInputData();
        await this.initSelectItemArea();
        await this.initSelectItemDeviceGroup();
        this.addStep = EAddStep.hanwha;
        this.inputPeopleCountingData.stepType = EPageStep.add;
        this.inputPeopleCountingData.brand = brand;
    }

    async pageToAddByiSapFRS(brand: string) {
        this.clearInputData();
        await this.initSelectItemFRSServer();
        await this.initSelectItemArea();
        await this.initSelectItemDeviceGroup();
        this.addStep = EAddStep.isapFrs;
        this.inputPeopleCountingData.brand = brand;
        this.inputPeopleCountingData.stepType = EPageStep.add;
        console.log("brand", this.inputPeopleCountingData.brand);
    }

    async pageToAddByiSapFRSManager(brand: string) {
        this.clearInputData();
        this.addStep = EAddStep.isapFrsManager;
        this.inputPeopleCountingData.brand = brand;
        this.inputPeopleCountingData.stepType = EPageStep.add;
        await this.initSelectItemArea();
        await this.initSelectItemDeviceGroup();
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
        for (const id of this.inputPeopleCountingData.siteIds) {
            for (const detail in this.sitesSelectItem) {
                if (id === detail) {
                    let selectedsObject: IRegionTreeSelected = {
                        objectId: detail,
                        type: ERegionType.site,
                        name: this.sitesSelectItem[detail]
                    };
                    this.selecteds.push(selectedsObject);
                }
            }
        }
    }

    pageToShowResult() {
        if (this.inputPeopleCountingData.stepType === EPageStep.edit) {
            this.pageStep = EPageStep.edit;
            // siteIds clear
            this.inputPeopleCountingData.siteIds = [];

            // from selecteds push siteIds
            for (const item of this.selecteds) {
                this.inputPeopleCountingData.siteIds.push(item.objectId);
            }
        }

        if (this.inputPeopleCountingData.stepType === EPageStep.add) {
            this.pageStep = EPageStep.add;

            // siteIds clear
            this.inputPeopleCountingData.siteIds = [];

            // from selecteds push siteIds
            for (const item of this.selecteds) {
                this.inputPeopleCountingData.siteIds.push(item.objectId);
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

        if (this.inputPeopleCountingData.stepType === EPageStep.add) {
            const datas: any = [
                {
                    customId: data.customId,
                    name: data.name,
                    brand: this.inputPeopleCountingData.brand,
                    model: data.model,
                    areaId: data.areaId,
                    groupIds: data.groupIds !== undefined ? data.groupIds : [],
                    config: configObject
                }
            ];

            const addParam = {
                datas
            };

            await this.$server
                .C("/device/people-counting", addParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(
                                this._("w_VSPeopleCounting_AddSuccess")
                            );
                            this.pageToList();
                        }
                        if (
                            returnValue.statusCode === 500 ||
                            returnValue.statusCode === 400
                        ) {
                            Dialog.error(
                                this._("w_VSPeopleCounting_ADDFailed")
                            );
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    if (e.res.statusCode == 500) {
                        Dialog.error(this._("w_BOCampaign_ADDFailed"));
                        return false;
                    }
                    console.log(e);
                    return false;
                });
        }

        if (this.inputPeopleCountingData.stepType === EPageStep.edit) {
            const datas: any = [
                {
                    objectId: data.objectId,
                    name: data.name,
                    brand: this.inputPeopleCountingData.brand,
                    model: data.model,
                    areaId: data.areaId,
                    groupIds: data.groupIds !== undefined ? data.groupIds : [],
                    config: configObject
                }
            ];

            const editParam = {
                datas
            };

            await this.$server
                .U("/device/people-counting", editParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(
                                this._("w_VSPeopleCounting_EditSuccess")
                            );
                            this.pageToList();
                        }
                        if (
                            returnValue.statusCode === 500 ||
                            returnValue.statusCode === 400
                        ) {
                            Dialog.error(
                                this._("w_VSPeopleCounting_EditFailed")
                            );
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    if (e.res.statusCode == 500) {
                        Dialog.error(this._("w_VSPeopleCounting_EditFailed"));
                        return false;
                    }
                    console.log(e);
                    return false;
                });
        }
    }

    async saveAddOrEditiSap(data) {
        const configObject: IConfigiSap = {
            serverId: data.serverId,
            sourceid: data.sourceid.split(" - ")[0],
            location: data.sourceid.split(" - ")[1]
        };

        if (this.inputPeopleCountingData.brand === EAddStep.isapFrs) {
            const datas: any = [
                {
                    customId: data.customId,
                    name: data.name,
                    brand: (this.inputPeopleCountingData.brand).split("F")[0],
                    areaId: data.areaId,
                    direction: data.direction,
                    groupIds: data.groupIds !== undefined ? data.groupIds : [],
                    config: configObject
                }
            ];

            const addParam = {
                datas
            };

            await this.$server
                .C("/device/people-counting", addParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(
                                this._("w_VSPeopleCounting_AddSuccess")
                            );
                            this.pageToList();
                        }
                        if (
                            returnValue.statusCode === 500 ||
                            returnValue.statusCode === 400
                        ) {
                            Dialog.error(
                                this._("w_VSPeopleCounting_ADDFailed")
                            );
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    if (e.res.statusCode == 500) {
                        Dialog.error(this._("w_BOCampaign_ADDFailed"));
                        return false;
                    }
                    console.log(e);
                    return false;
                });
        }

        if (this.inputPeopleCountingData.stepType === EPageStep.edit) {
            const datas: any = [
                {
                    objectId: data.objectId,
                    name: data.name,
                    brand: this.inputPeopleCountingData.brand,
                    areaId: data.areaId,
                    direction: data.direction,
                    groupIds: data.groupIds !== undefined ? data.groupIds : [],
                    config: configObject
                }
            ];

            const editParam = {
                datas
            };

            await this.$server
                .U("/device/people-counting", editParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(
                                this._("w_VSPeopleCounting_EditSuccess")
                            );
                            this.pageToList();
                        }
                        if (
                            returnValue.statusCode === 500 ||
                            returnValue.statusCode === 400
                        ) {
                            Dialog.error(
                                this._("w_VSPeopleCounting_EditFailed")
                            );
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    if (e.res.statusCode == 500) {
                        Dialog.error(this._("w_VSPeopleCounting_EditFailed"));
                        return false;
                    }
                    console.log(e);
                    return false;
                });
        }
    }

    async doDelete() {
        await Dialog.confirm(
            this._("w_VSPeopleCounting_DeleteConfirm"),
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
                     this.inputPeopleCountingData.stepType === EPageStep.add
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
                areaId?: string;


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
                     this.inputPeopleCountingData.stepType === EPageStep.add
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
                 * @uiLabel - ${this._("w_SourceIdAndLocation")}
                 * @uiPlaceHolder - ${this._("w_SourceIdAndLocation")}
                 * @uiHidden - ${
                     this.addStep === EAddStep.isapFrsManager ? "true" : "false"
                 }
                 */
                sourceid: ${toEnumInterface(
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
                serverId?: string;


                /**
                 * @uiLabel - ${this._("w_SourceId")}
                 * @uiType - iv-form-label
                 */
                sourceid?: string;


                /**
                 * @uiLabel - ${this._("w_Location")}
                 * @uiType - iv-form-label
                 */
                location?: string;


                /**
                 * @uiLabel - ${this._("w_Site")}
                 * @uiType - iv-form-label
                 */
                site?: string;



                /**
                 * @uiLabel - ${this._("w_Area")}
                 * @uiType - iv-form-label
                 */
                areaId?: string;


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
