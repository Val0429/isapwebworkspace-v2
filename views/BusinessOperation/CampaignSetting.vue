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
                :label="_('w_BOCampaign_List')"
            >
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
                    ref="listTable"
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
                            <iv-toolbox-edit @click="pageToEdit()" />
                            <iv-toolbox-delete @click="doDelete" />
                        </iv-toolbox-more>
                    </template>

                </iv-table>
            </iv-card>

            <!-- view -->
            <!-- v-show="pageStep === ePageStep.view" -->
            <iv-card
                key="transition_2"
                v-show="transition.step === 2"
                :visible="true"
                :label="_('w_BOCampaign_View')"
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IViewForm()"
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

            <!--From (Add and Edit)-->
            <!-- v-show="pageStep === ePageStep.add || pageStep === ePageStep.edit" -->
            <iv-auto-card
                key="transition_3"
                v-show="transition.step === 3"
                :visible="true"
                :label="inputFormData.objectId == '' ? _('w_BOCampaign_Add') :  _('w_BOCampaign_Edit')"
            >
                <template #toolbox>

                    <iv-toolbox-back @click="pageToList()" />

                </template>

                <iv-form
                    :interface="IAddAndEditForm()"
                    :value="inputFormData"
                    @update:*="tempSaveInputData($event)"
                    @submit="saveAddOrEdit($event)"
                >

                    <template #year="{$attrs, $listeners}">
                        <iv-form-selection
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.year"
                            :multiple="false"
                            :options="yearSelectItem"
                        >
                        </iv-form-selection>
                    </template>

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

            <!-- v-show="pageStep === ePageStep.chooseTree" -->
            <region-tree-select
                key="transition_4"
                v-show="transition.step === 4"
                v-on:click-back="pageToShowResult"
                :multiple="true"
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

// API interfaces
import {
    IAddBusinessOperationCampaign,
    IEditBusinessOperationCampaign
} from "@/config/default/api/interfaces";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Region Tree
import {
    ERegionType,
    IRegionItem,
    IRegionTreeSelected,
    RegionTreeItem
} from "@/components/RegionTree";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import RegionAPI from "@/services/RegionAPI";
import Loading from "@/services/Loading";
import Datetime from "@/services/Datetime";

interface IinputFormData
    extends IAddBusinessOperationCampaign,
        IEditBusinessOperationCampaign {
    siteIdsText?: string;
    tempSiteIds?: any;
    startDateText?: string;
    endDateText?: string;
    sites?: any;
    year: any;
}

@Component({
    components: {}
})
export default class CampaignSetting extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    isSelected: any = [];
    tableMultiple: boolean = true;
    selectedDetail: any = [];
    sitesSelectItem: any = {};
    yearSelectItem: any = [];

    // tree 相關
    selectType = ERegionType.site;
    regionTreeItem = new RegionTreeItem();
    selecteds: IRegionTreeSelected[] = [];

    inputFormData: IinputFormData = {
        objectId: "",
        name: "",
        budget: null,
        description: "",
        type: "",
        siteIds: [],
        startDate: new Date(),
        endDate: new Date(),
        siteIdsText: "",
        startDateText: "",
        endDateText: "",
        year: new Date().getFullYear().toString()
    };

    created() {}

    mounted() {}

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        (this.$refs.listTable as any).reload();
    }

    pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
        this.getInputData();
    }

    async pageToAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        this.clearInputData();
        this.initYear();
        await this.initSelectItemSite();
        this.selecteds = [];
    }

    async pageToEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        this.getInputData();
        this.initYear();
        await this.initSelectItemSite();
        this.inputFormData.year = this.inputFormData.year.toString();
        this.inputFormData.siteIds = JSON.parse(
            JSON.stringify(this.inputFormData.sites.map(item => item.objectId))
        );
    }

    async pageToChooseTree() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 4;
        this.initRegionTreeSelect();
        await this.initSelectItemTree();
        this.selecteds = [];
        for (const id of this.inputFormData.siteIds) {
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
        this.transition.step = this.transition.prevStep;

        // siteIds clear
        this.inputFormData.siteIds = [];

        // from selecteds push siteIds
        for (const item of this.selecteds) {
            this.inputFormData.siteIds.push(item.objectId);
        }
    }

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            name: "",
            budget: null,
            description: "",
            type: "",
            siteIds: [],
            startDate: new Date(),
            endDate: new Date(),
            siteIdsText: "",
            startDateText: "",
            endDateText: "",
            year: new Date().getFullYear().toString()
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

    initYear() {
        this.yearSelectItem = Datetime.FiveYearsIdText();
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
                year: param.year.toString()
            };
        }
    }

    tempSaveInputData(data) {
        switch (data.key) {
            case "name":
                this.inputFormData.name = data.value;
                break;
            case "type":
                this.inputFormData.type = data.value;
                break;
            case "budget":
                this.inputFormData.budget = data.value;
                break;
            case "description":
                this.inputFormData.description = data.value;
                break;
            case "startDate":
                this.inputFormData.startDate = data.value;
                break;
            case "endDate":
                this.inputFormData.endDate = data.value;
                break;
            case "siteIds":
                this.inputFormData.siteIds = data.value;
                break;
        }

        this.selecteds = [];

        for (const id of this.inputFormData.siteIds) {
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

    async saveAddOrEdit(data) {
        if (this.inputFormData.objectId == "") {
            const datas: any = [
                {
                    name: data.name,
                    type: data.type,
                    budget: data.budget,
                    description: data.description,
                    startDate: Datetime.DateToZero(
                        data.startDate
                    ).toISOString(),
                    endDate: Datetime.DateToZero(data.endDate).toISOString(),
                    siteIds: data.siteIds !== undefined ? data.siteIds : [],
                    year: parseInt(this.inputFormData.year)
                }
            ];

            const addParam = {
                datas
            };

            Loading.show();
            await this.$server
                .C("/event/campaign", addParam)
                .then((response: any) => {
                    Loading.hide();
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
                    return ResponseFilter.base(
                        this,
                        e,
                        this._("w_BOCampaign_ADDFailed")
                    );
                });
        } else {
            // Edit
            const datas: any = [
                {
                    objectId: data.objectId,
                    type: data.type,
                    budget: data.budget,
                    description: data.description,
                    startDate: Datetime.DateToZero(
                        data.startDate
                    ).toISOString(),
                    endDate: Datetime.DateToZero(data.endDate).toISOString(),
                    siteIds: data.siteIds !== undefined ? data.siteIds : [],
                    year: parseInt(this.inputFormData.year)
                }
            ];

            const editParam = {
                datas
            };

            Loading.show();
            await this.$server
                .U("/event/campaign", editParam)
                .then((response: any) => {
                    Loading.hide();
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
                    return ResponseFilter.base(
                        this,
                        e,
                        this._("w_BOCampaign_EditFailed")
                    );
                });
        }
    }

    async doDelete() {
        await Dialog.confirm(
            this._("w_BOCampaign_DeleteConfirm"),
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
                            return ResponseFilter.base(this, e);
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
                 * @uiLabel - ${this._("w_BOCampaign_FiscalYear")}
                 * @uiType - iv-form-label
                 */
                year?: number;


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

    IAddAndEditForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_BOCampaign_EventName")}
                 * @uiPlaceHolder - ${this._("w_BOCampaign_EventName")}
                 * @uiType - ${
                     this.inputFormData.objectId == ""
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
                 * @uiLabel - ${this._("w_BOCampaign_FiscalYear")}
                 */
                year: any;


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
