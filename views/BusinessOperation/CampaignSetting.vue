<template>
    <div class="animated fadeIn">
        <iv-card
            v-show="pageStep === ePageStep.list"
            :label="_('w_BOCampaign_List')"
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
                ref="campaignTable"
                :interface="ITableList()"
                :multiple="tableMultiple"
                :server="{ path: '/event/campaign' }"
                @selected="selectedItem($event)"
            >
                <template #startDate="{$attrs}">
                    {{ dateToYYYY_MM_DD($attrs.value) }}
                </template>

                <template #endDate="{$attrs}">
                    {{ dateToYYYY_MM_DD($attrs.value) }}
                </template>

                <template #sites="{$attrs}">
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

        <!--From (Add and Edit)-->
        <iv-auto-card
            v-show="pageStep === ePageStep.add || pageStep === ePageStep.edit"
            :visible="true"
            :label="pageStep === ePageStep.add ? _('w_BOCampaign_Add') :  _('w_BOCampaign_Edit')"
        >
            <template #toolbox>

                <iv-toolbox-back @click="pageToList()" />

            </template>

            <iv-form
                :interface="IAddAndEditForm()"
                :value="inputCampaignData"
                @update:*="tempSaveInputData($event)"
                @submit="saveAddOrEdit($event)"
            >

                <template #selectTree="{ $attrs, $listeners }">

                    <div class="mt-2 ml-3">
                        <b-button @click="pageToChooseTree">
                            {{ _('w_SelectSiteTree') }}
                        </b-button>
                    </div>
                </template>

            </iv-form>

            <template #footer-before>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToList()"
                >{{ _('w_Back') }}
                </b-button>
            </template>

        </iv-auto-card>

        <!-- view -->
        <iv-card
            v-show="pageStep === ePageStep.view"
            :visible="true"
            :label="_('w_BOCampaign_View')"
        >
            <template #toolbox>
                <iv-toolbox-back @click="pageToList()" />
            </template>

            <iv-form
                :interface="IViewForm()"
                :value="inputCampaignData"
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
            :multiple="true"
            :regionTreeItem="regionTreeItem"
            :selectType="selectType"
            :selecteds="selecteds"
        >
        </region-tree-select>

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

interface IInputCampaignData
    extends IAddBusinessOperationCampaign,
        IEditBusinessOperationCampaign {
    siteIdsText?: string;
    tempSiteIds?: any;
    stepType?: string;
    startDateText?: string;
    endDateText?: string;
    sites?: any;
}

enum EPageStep {
    list = "list",
    add = "add",
    edit = "edit",
    view = "view",
    none = "none",
    showResult = "showResult",
    chooseTree = "chooseTree"
}

@Component({
    components: {}
})
export default class CampaignSetting extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.list;

    isSelected: any = [];
    tableMultiple: boolean = true;

    selectedDetail: any = [];

    sitesSelectItem: any = {};

    // tree 相關
    selectType = ERegionType.site;
    regionTreeItem = new RegionTreeItem();
    selecteds: IRegionTreeSelected[] = [];

    inputCampaignData: IInputCampaignData = {
        objectId: "",
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

    mounted() {}

    clearInputData() {
        this.inputCampaignData = {
            objectId: "",
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

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
    }

    getInputData() {
        this.clearInputData();
        for (const param of this.selectedDetail) {
            this.inputCampaignData = {
                objectId: param.objectId,
                name: param.name,
                budget: param.budget,
                description: param.description,
                endDate: new Date(param.endDate),
                startDate: new Date(param.startDate),
                startDateText: this.dateToYYYY_MM_DD(param.startDate),
                endDateText: this.dateToYYYY_MM_DD(param.endDate),
                type: param.type,
                siteIdsText: this.idsToText(param.sites),
                sites: param.sites,
                stepType: ""
            };
        }
    }

    tempSaveInputData(data) {
        switch (data.key) {
            case "name":
                this.inputCampaignData.name = data.value;
                break;
            case "type":
                this.inputCampaignData.type = data.value;
                break;
            case "budget":
                this.inputCampaignData.budget = data.value;
                break;
            case "description":
                this.inputCampaignData.description = data.value;
                break;
            case "startDate":
                this.inputCampaignData.startDate = data.value;
                break;
            case "endDate":
                this.inputCampaignData.endDate = data.value;
                break;
            case "siteIds":
                this.inputCampaignData.siteIds = data.value;
                break;
        }

        this.selecteds = [];

        for (const id of this.inputCampaignData.siteIds) {
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

    async pageToAdd(stepType: string) {
        this.pageStep = EPageStep.add;
        this.clearInputData();
        await this.initSelectItemSite();

        this.selecteds = [];
        this.inputCampaignData.stepType = stepType;
    }

    async pageToEdit(stepType: string) {
        this.pageStep = EPageStep.edit;
        this.getInputData();
        await this.initSelectItemSite();

        this.inputCampaignData.stepType = stepType;

        this.inputCampaignData.siteIds = JSON.parse(
            JSON.stringify(
                this.inputCampaignData.sites.map(item => item.objectId)
            )
        );
    }

    pageToView() {
        this.pageStep = EPageStep.view;
        this.getInputData();
    }

    pageToList() {
        this.pageStep = EPageStep.list;
        (this.$refs.campaignTable as any).reload();
    }

    async pageToChooseTree() {
        this.pageStep = EPageStep.chooseTree;
        this.initRegionTreeSelect();
        await this.initSelectItemTree();
        this.selecteds = [];
        for (const id of this.inputCampaignData.siteIds) {
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
        if (this.inputCampaignData.stepType === EPageStep.edit) {
            this.pageStep = EPageStep.edit;
            // siteIds clear
            this.inputCampaignData.siteIds = [];

            // from selecteds push siteIds
            for (const item of this.selecteds) {
                this.inputCampaignData.siteIds.push(item.objectId);
            }
        }

        if (this.inputCampaignData.stepType === EPageStep.add) {
            this.pageStep = EPageStep.add;

            // siteIds clear
            this.inputCampaignData.siteIds = [];

            // from selecteds push siteIds
            for (const item of this.selecteds) {
                this.inputCampaignData.siteIds.push(item.objectId);
            }
        }
    }

    async saveAddOrEdit(data) {
        if (this.inputCampaignData.stepType === EPageStep.add) {
            const datas: any = [
                {
                    name: data.name,
                    type: data.type,
                    budget: data.budget,
                    description: data.description,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    siteIds: data.siteIds !== undefined ? data.siteIds : []
                }
            ];

            const addParam = {
                datas
            };

            await this.$server
                .C("/event/campaign", addParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(this._("w_BOCampaign_AddSuccess"));
                            this.pageToList();
                        }
                        if (returnValue.statusCode === 500) {
                            Dialog.error(this._("w_BOCampaign_ADDFailed"));
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

        // edit
        if (this.inputCampaignData.stepType === EPageStep.edit) {
            const datas: any = [
                {
                    objectId: data.objectId,
                    type: data.type,
                    budget: data.budget,
                    description: data.description,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    siteIds: data.siteIds !== undefined ? data.siteIds : []
                }
            ];

            const editParam = {
                datas
            };

            await this.$server
                .U("/event/campaign", editParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(this._("w_BOCampaign_EditSuccess"));
                            this.pageToList();
                        }
                        if (returnValue.statusCode === 500) {
                            Dialog.error(this._("w_BOCampaign_EditFailed"));
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    if (e.res.statusCode == 500) {
                        Dialog.error(this._("w_BOCampaign_EditFailed"));
                        return false;
                    }
                    console.log(e);
                    return false;
                });
        }
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

    dateToYYYY_MM_DD(value) {
        return Datetime.DateTime2String(new Date(value), "YYYY-MM-DD");
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
             * @uiLabel - ${this._("w_BOCampaign_EventList")}
             */
            name: string;


            /**
             * @uiLabel - ${this._("w_BOCampaign_EventType")}
             */
            type: string;


            /**
             * @uiLabel - ${this._("w_BOCampaign_StartDate")}
             */
            startDate: string;


            /**
             * @uiLabel - ${this._("w_BOCampaign_FinishDate")}
             */
            endDate: string;


            /**
             * @uiLabel - ${this._("w_Sites")}
             */
            sites: string;


            Actions?: any;

            }
        `;
    }

    IAddAndEditForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_BOCampaign_EventName")}
                 * @uiPlaceHolder - ${this._("w_BOCampaign_EventName")}
                 * @uiType - ${
                     this.inputCampaignData.stepType === EPageStep.add
                         ? "iv-form-string"
                         : "iv-form-label"
                 }
                */
                name: string;


                /**
                 * @uiLabel - ${this._("w_BOCampaign_EventType")}
                 * @uiPlaceHolder - ${this._("w_BOCampaign_EventType")}
                 */
                type: string;


                /**
                 * @uiLabel - ${this._("w_BOCampaign_Budget")}
                 * @uiPlaceHolder - ${this._("w_BOCampaign_Budget")}
                 * @uiAttrs - { min: 0 }
                 */
                budget: number;


                /**
                 * @uiLabel - ${this._("w_Description")}
                 * @uiPlaceHolder - ${this._("w_Description")}
                 * @uiType - iv-form-textarea
                 */
                description: string;


                /**
                * @uiLabel - ${this._("w_BOCampaign_StartDate")}
                * @uiPlaceHolder - ${this._("w_BOCampaign_StartDate")}
                * @uiType - iv-form-date
                */
                startDate: any;


                /**
                * @uiLabel - ${this._("w_BOCampaign_FinishDate")}
                * @uiPlaceHolder - ${this._("w_BOCampaign_FinishDate")}
                * @uiType - iv-form-date
                */
                endDate: any;


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 */
                siteIds?: ${toEnumInterface(this.sitesSelectItem as any, true)};

                selectTree?: any;

            }
        `;
    }

    IViewForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_BOCampaign_EventName")}
                 * @uiType - iv-form-label
                 */
                name?: string;



                /**
                 * @uiLabel - ${this._("w_BOCampaign_EventType")}
                 * @uiType - iv-form-label
                 */
                type?: string;


                /**
                 * @uiLabel - ${this._("w_BOCampaign_Budget")}
                 * @uiType - iv-form-label
                 */
                budget?: number;


                /**
                 * @uiLabel - ${this._("w_Description")}
                 * @uiType - iv-form-label
                 */
                description?: string;


                /**
                * @uiLabel - ${this._("w_BOCampaign_StartDate")}
                * @uiType - iv-form-label
                */
                startDateText?: any;


                /**
                * @uiLabel - ${this._("w_BOCampaign_FinishDate")}
                * @uiType - iv-form-label
                */
                endDateText?: any;


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 * @uiType - iv-form-label
                 */
                siteIdsText: string;

            }
        `;
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
</style>
