<template>
    <div class="animated fadeIn">
        <iv-card
            v-show="pageStep === ePageStep.list"
            :label=" _('w_ReportTemplate_List') "
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
                <iv-toolbox-copy
                    :disabled="isSelected.length !== 1"
                    @click="pageToDuplicate(ePageStep.duplicate)"
                />
                <iv-toolbox-delete
                    :disabled="isSelected.length === 0"
                    @click="doDelete"
                />
                <iv-toolbox-divider />
                <iv-toolbox-add @click="pageToAdd(ePageStep.add)" />

            </template>

            <iv-table
                ref="tagTable"
                :interface="ITableList()"
                :multiple="tableMultiple"
                :server="{ path: '/tag' }"
                @selected="selectedItem($event)"
            >

                <template #Actions="{$attrs, $listeners}">
                    <iv-toolbox-more :disabled="isSelected.length !== 1">
                        <iv-toolbox-copy @click="pageToDuplicate(ePageStep.duplicate)" />
                        <iv-toolbox-view @click="pageToView" />
                        <iv-toolbox-edit @click="pageToEdit(ePageStep.edit)" />
                        <iv-toolbox-delete @click="doDelete" />
                    </iv-toolbox-more>
                </template>

                <template #sites="{$attrs}">
                    {{ showFirst($attrs.value) }}
                </template>

            </iv-table>
        </iv-card>

        <!--From (Add and Edit and Duplicate)-->
        <iv-auto-card
            v-show="pageStep === ePageStep.add || pageStep === ePageStep.edit || pageStep === ePageStep.duplicate"
            :visible="true"
            :label=showLabelTitle()
        >

            <iv-form
                :interface="IAddAndEditForm()"
                :value="inputFormData"
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

                <template #ReportPeriodTitle="{ $attrs, $listeners }">
                    <div class="ml-3 mb-2 w-100">{{ _('w_ReportTemplate_ReportPeriod1') }}</div>
                </template>

                <template #selectPeriodAddWay="{ $attrs, $listeners }">
                        <b-col cols="3" class="mb-3">
                            <b-form-radio-group
                                v-model="selectPeriodAddWay"
                                :options="addPeriodSelectItem"
                                buttons
                                button-variant="outline-success"
                                name="radio-btn-outline"
                                @change="changeAddPeriodSelect"
                            ></b-form-radio-group>
                        </b-col>
                </template>

                <template #sendReportTimeTitle="{ $attrs, $listeners }">
                    <div class="ml-3 mb-2 w-100">{{ _('w_ReportTemplate_SendReportTime1') }}</div>
                </template>

                <template #time="{$attrs, $listeners}">
                    <b-form-group class="ml-3">
                        <b-row
                            v-for="(value, index) in sendReportTime"
                            :key="'sendReportTime' + index"
                        >
                            <b-col cols="4">
                                <b-form-select
                                    class="mb-2"
                                    v-model="sendReportTime[index].week"
                                    :plain="true"
                                    :options="timeSelectItem.weeks"
                                ></b-form-select>
                            </b-col>


                            <b-col cols="4">
                                <b-form-select
                                    v-model="sendReportTime[index].hour"
                                    :plain="true"
                                    :options="timeSelectItem.hours"
                                ></b-form-select>
                            </b-col>

                            <b-col cols="1">
                                <b-button
                                    class="button addButton"
                                    variant="success"
                                    type="button"
                                    @click="addSendReportTime()"
                                >
                                    <i class="fa fa-plus"></i>
                                </b-button>
                            </b-col>

                            <b-col cols="1">
                                <b-button
                                    v-show="index === 0"
                                    class="button"
                                    variant="danger"
                                    type="button"
                                    style="visibility:hidden"
                                    @click="removeSendReportTime(index)"
                                >
                                    <i class="fa fa-minus"></i>

                                </b-button>
                            </b-col>

                            <b-col cols="1">
                                <b-button
                                    v-show="index !== 0"
                                    class="button"
                                    variant="danger"
                                    type="button"
                                    @click="removeSendReportTime(index)"
                                >
                                    <i class="fa fa-minus"></i>

                                </b-button>
                            </b-col>

                        </b-row>
                    </b-form-group>

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
            :label=" _('w_ReportTemplate_View') "
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

        <!-- region tree select -->
        <region-tree-select
            v-show="pageStep === ePageStep.chooseTree"
            :multiple="true"
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
import { toEnumInterface } from "@/../core";
import { ITag, ITagReadUpdate } from "@/config/default/api/interfaces";
import {
    ERegionType,
    IRegionItem,
    RegionTreeItem,
    IRegionTreeSelected
} from "@/components/RegionTree/models";
import { RegionTreeSelect } from "@/components/RegionTree/RegionTreeSelect.vue";

import RegionAPI from "@/services/RegionAPI";
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog/Dialog";


enum EPageStep {
    list = "list",
    add = "add",
    edit = "edit",
    view = "view",
    duplicate = "duplicate",
    none = "none",
    showResult = "showResult",
    chooseTree = "chooseTree"
}

enum ECameraMode {
    peopleCounting = "People Counting",
    humanDetection = "Human Detection",
    heatmap = "Heatmap",
    dwellTime = "Dwell Time",
    demographic = "Demographic",
    visitor = "Visitor"
}

enum EAddPeriodSelect {
    period = "period",
    designation = "designation",
}

enum EWeeks {
    Sunday = "Sunday",
    Monday = "Monday",
    Tuesday = "Tuesday",
    Wednesday = "Wednesday",
    Thursday = "Thursday",
    Friday = "Friday",
    Saturday = "Saturday",
}


enum EDesignationPeriod {
    today = "Today",
    yesterday = "Yesterday",
    last7days = "Last 7 days",
    thisWeek= "This Week",
    lastWeek= "Last Week",
    thisMonth= "This Month",
    lastMonth= "Last Month",
    q1 = "Q1",
    q2 = "Q2",
    q3 = "Q3",
    q4 = "Q4",
    thisYear = "This Year",
}

const timeItem = {
    week: "1",
    hour: "22",
};

@Component({
    components: {}
})
export default class ReportTemplate extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.list;

    isSelected: any = [];
    tableMultiple: boolean = true;

    selectedDetail: any = [];

    sitesSelectItem: any = {};
    metricSelectItem: any = {
        peopleCounting: ECameraMode.peopleCounting,
        humanDetection: ECameraMode.humanDetection,
        heatmap: ECameraMode.heatmap,
        dwellTime: ECameraMode.dwellTime,
        demographic: ECameraMode.demographic,
        visitor: ECameraMode.visitor,
    };
    userSelectItem: any = {};

    timeSelectItem: any = {
        weeks: [
            { value: "0", text: EWeeks.Sunday },
            { value: "1", text: EWeeks.Monday },
            { value: "2", text: EWeeks.Tuesday },
            { value: "3", text: EWeeks.Wednesday },
            { value: "4", text: EWeeks.Thursday },
            { value: "5", text: EWeeks.Friday },
            { value: "6", text: EWeeks.Saturday }
        ],
        hours: [],
    };

    addPeriodSelectItem: any =[
        { value: EAddPeriodSelect.period, text: EAddPeriodSelect.period },
        { value: EAddPeriodSelect.designation, text: EAddPeriodSelect.designation }
        ];

    designationPeriodSelectItem: any = {
        today: EDesignationPeriod.today,
        yesterday: EDesignationPeriod.yesterday,
        last7days: EDesignationPeriod.last7days,
        thisWeek: EDesignationPeriod.thisWeek,
        lastWeek: EDesignationPeriod.lastWeek,
        thisMonth: EDesignationPeriod.thisMonth,
        lastMonth: EDesignationPeriod.lastMonth,
        q1: EDesignationPeriod.q1,
        q2: EDesignationPeriod.q2,
        q3: EDesignationPeriod.q3,
        q4: EDesignationPeriod.q4,
        thisYear: EDesignationPeriod.thisYear,
    };

    // tree 相關
    selectType = ERegionType.site;
    regionTreeItem = new RegionTreeItem();
    selecteds: IRegionTreeSelected[] = [];

    inputFormData: any = {};
    sendReportTime: any = [
        { week: '1', hour: '22' }
    ];
    selectPeriodAddWay: string = EAddPeriodSelect.period;


    created() {}

    mounted() {
        this.initDayRanges();
    }

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            name: "",
            description: "",
            siteIds: [],
            designationPeriod: "today",
            siteIdsText: "",
            regionIdsText: "",
            stepType: ""
        };
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

    async initSelectItemUsers() {

        this.sitesSelectItem = {};

        await this.$server
            .R("/user/user")
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response.results) {
                        // 自定義 userSelectItem 的 key 的方式
                        this.userSelectItem[returnValue.objectId] =
                            `${returnValue.username} : ${returnValue.email}`;
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

    initRegionTreeSelect() {
        this.regionTreeItem = new RegionTreeItem();
        this.regionTreeItem.titleItem.card = this._("w_SiteTreeSelect");
    }

    initDayRanges() {
        for (let i = 0; i < 25; i++) {
            const tempHour =
                i === 24 ? "00" : i < 10 ? "0" + i.toString() : i.toString();
            const tempValue =
                tempHour + ":00" + (i < 12 || i > 23 ? " am" : " pm");
            const tempObject = { value: i.toString(), text: tempValue };
            this.timeSelectItem.hours.push(tempObject);
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
                objectId: param.objectId,
                name: param.name,
                description: param.description,
                siteIds: param.sites,
                regionIds: param.regions,
                siteIdsText: this.idsToText(param.sites),
                regionIdsText: this.idsToText(param.regions),
                stepType: ""
            };
        }
    }

    tempSaveInputData(data) {
        switch (data.key) {
            case "name":
                this.inputFormData.name = data.value;
                break;
            case "description":
                this.inputFormData.description = data.value;
                break;
            case "siteIds":
                this.inputFormData.siteIds = data.value;
                break;
            case "regionIds":
                this.inputFormData.regionIds = data.value;
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

    async pageToAdd(stepType: string) {
        this.pageStep = EPageStep.add;
        await this.initSelectItemSite();
        await this.initSelectItemUsers();
        this.clearInputData();
        this.selecteds = [];
        this.inputFormData.stepType = stepType;
    }

    async pageToDuplicate(stepType: string) {
        this.pageStep = EPageStep.duplicate;
        await this.initSelectItemSite();
        await this.initSelectItemUsers();
        this.inputFormData.name = '';
        this.selecteds = [];
        this.inputFormData.stepType = stepType;
    }

    async pageToEdit(stepType: string) {
        this.pageStep = EPageStep.edit;
        this.getInputData();
        await this.initSelectItemSite();
        await this.initSelectItemUsers();
        this.selecteds = [];

        this.inputFormData.stepType = stepType;

        this.inputFormData.siteIds = JSON.parse(
            JSON.stringify(this.inputFormData.siteIds.map(item => item.objectId))
        );
        this.inputFormData.regionIds = JSON.parse(
            JSON.stringify(
                this.inputFormData.regionIds.map(item => item.objectId)
            )
        );
    }

    pageToView() {
        this.pageStep = EPageStep.view;
        this.getInputData();
    }

    pageToList() {
        this.pageStep = EPageStep.list;
        (this.$refs.tagTable as any).reload();
        this.selecteds = [];
    }

    async pageToChooseTree() {
        this.pageStep = EPageStep.chooseTree;
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
        if (this.inputFormData.type === EPageStep.edit) {
            this.pageStep = EPageStep.edit;
            // siteIds clear
            this.inputFormData.siteIds = [];

            // from selecteds push siteIds
            for (const item of this.selecteds) {
                this.inputFormData.siteIds.push(item.objectId);
            }
        }

        if (this.inputFormData.type === EPageStep.add) {
            this.pageStep = EPageStep.add;

            // siteIds clear
            this.inputFormData.siteIds = [];

            // from selecteds push siteIds
            for (const item of this.selecteds) {
                this.inputFormData.siteIds.push(item.objectId);
            }
        }
    }

    addSendReportTime() {
        var tempTimeItem = JSON.parse(JSON.stringify(timeItem));
        this.sendReportTime.push(tempTimeItem);
    }

    removeSendReportTime(index: number) {
        this.sendReportTime.splice(index, 1);
    }

    changeAddPeriodSelect(selected: string) {
        this.selectPeriodAddWay = selected;
        this.inputFormData.designationPeriod = 'today';
        this.inputFormData.startDate = new Date();
        this.inputFormData.endDate = new Date();
    }

    async saveAddOrEdit(data) {
        if (this.inputFormData.stepType === EPageStep.add) {
            const datas: ITag[] = [
                {
                    name: data.name,
                    description: data.description,
                    regionIds:
                        data.regionIds !== undefined ? data.regionIds : [],
                    siteIds: data.siteIds !== undefined ? data.siteIds : []
                }
            ];

            const addParam = {
                datas
            };

            await this.$server
                .C("/tag", addParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(this._("w_Tag_AddTagSuccess"));
                            this.pageToList();
                        }
                        if (returnValue.statusCode === 500) {
                            Dialog.error(this._("w_Tag_AddTagFailed"));
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    if (e.res.statusCode == 500) {
                        Dialog.error(this._("w_Tag_AddTagFailed"));
                        return false;
                    }
                    console.log(e);
                    return false;
                });
        }
        if (this.inputFormData.stepType === EPageStep.edit) {
            const datas: ITagReadUpdate[] = [
                {
                    description: data.description,
                    regionIds:
                        data.regionIds !== undefined ? data.regionIds : [],
                    siteIds: data.siteIds !== undefined ? data.siteIds : [],
                    objectId: data.objectId
                }
            ];

            const editgParam = {
                datas
            };

            await this.$server
                .U("/tag", editgParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(this._("w_Tag_EditTagSuccess"));
                            this.pageToList();
                        }
                        if (returnValue.statusCode === 500) {
                            Dialog.error(this._("w_Tag_EditTagFailed"));
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    if (e.res.statusCode == 500) {
                        Dialog.error(this._("w_Tag_EditTagFailed"));
                        return false;
                    }
                    console.log(e);
                    return false;
                });
        }
    }

    async doDelete() {
        Dialog.confirm(
            this._("w_Tag_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                for (const param of this.selectedDetail) {
                    const deleteUserParam: {
                        objectId: string;
                    } = {
                        objectId: param.objectId
                    };

                    this.$server
                        .D("/tag", deleteUserParam)
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

    showFirst(value: any): string {
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
        for (let val of value) {
            result += val.name + ", ";
        }
        result = result.substring(0, result.length - 2);
        return result;
    }

    showLabelTitle(): string {
        if (this.pageStep === EPageStep.add) {
            return this._("w_ReportTemplate_Add");
        }
        if (this.pageStep === EPageStep.edit) {
            return this._("w_ReportTemplate_Edit");
        }
        if (this.pageStep === EPageStep.duplicate) {
            return this._("w_ReportTemplate_AddDuplicate");
        }
    }


    getWeekText(value: any): string {
        return !isNaN(value) && value > -1 && value < 7
            ? this._(`w_Week_${value.toString()}` as any)
            : this._("w_Week_Unknow");
    }

    getNumber10plus0(value: any): string {
        let result = "00";
        if (!isNaN(value)) {
            result = value < 10 ? "0" + value.toString() : value.toString();
        }
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
                 * @uiLabel - ${this._("w_ReportTemplate_Name")}
                 */
                name: string;


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 */
                sites: string;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Metric")}
                 */
                ?: string;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_ReportPeriod")}
                 */
                ?: string;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_SendReportTime")}
                 */
                ?: string;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Recipient")}
                 */
                ?: string;


                Actions?: any;

            }
        `;
    }

    IAddAndEditForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Name")}
                 * @uiPlaceHolder - ${this._("w_ReportTemplate_Name")}
                 * @uiType - ${
                     (this.inputFormData.stepType === EPageStep.add || this.inputFormData.stepType === EPageStep.duplicate)
                         ? "iv-form-string"
                         : "iv-form-label"
                 }
                */
                name: string;


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 */
                siteIds?: ${toEnumInterface(this.sitesSelectItem as any, true)};

                selectTreeSite?: any;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Metric")}
                 */
                metric: ${toEnumInterface(this.metricSelectItem as any, false)};


                ReportPeriodTitle?: any;
                selectPeriodAddWay?: any;


                /**
                * @uiLabel - ${this._("w_BOCampaign_StartDate")}
                * @uiPlaceHolder - ${this._("w_BOCampaign_StartDate")}
                * @uiColumnGroup - date
                * @uiType - iv-form-date
                * @uiHidden - ${
                    this.selectPeriodAddWay === EAddPeriodSelect.designation ? "true" : "false"
                }
                 */
                startDate?: any;


                /**
                * @uiLabel - ${this._("w_BOCampaign_FinishDate")}
                * @uiPlaceHolder - ${this._("w_BOCampaign_FinishDate")}
                * @uiColumnGroup - date
                * @uiType - iv-form-date
                * @uiHidden - ${
                    this.selectPeriodAddWay === EAddPeriodSelect.designation ? "true" : "false"
                }
                 */
                endDate?: any;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_DesignationPeriod")}
                 * @uiHidden - ${this.selectPeriodAddWay === EAddPeriodSelect.period ? "true" : "false"}
                 */
                designationPeriod?: ${toEnumInterface(this.designationPeriodSelectItem as any, false)};


                sendReportTimeTitle: any;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_SendReportTime")}
                 */
                time: any;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Recipient")}
                 */
                users: ${toEnumInterface(this.userSelectItem as any, true)};

            }
        `;
    }

    IViewForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Name")}
                 * @uiType - iv-form-label
                 */
                name?: string;


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 * @uiType - iv-form-label
                */
                siteIdsText?: string;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Metric")}
                 * @uiType - iv-form-label
                */
                ?: string;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_ReportPeriod")}
                 * @uiType - iv-form-label
                */
                ?: string;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_SendReportTime")}
                 * @uiType - iv-form-label
                */
                ?: string;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Recipient")}
                 * @uiType - iv-form-label
                */
                ?: string;


            }
        `;
    }
}
</script>

