<template>
    <div>

        <iv-card
            v-show="pageStep === ePageStep.none"
            :visible="visible"
            :label="_('w_ReportFilterConditionComponent_')"
        >
            <iv-form
                :interface="IFilterConditionForm()"
                @update:*="tempSaveInputData($event)"
                @submit="doSubmit($event)"
            >

                <template #ifAllSites="{ $attrs, $listeners }">

                    <p class="ml-3">{{ _('w_Sites1') }}</p>

                    <b-col cols="9">
                        <b-form-radio-group
                            v-model="selectAllSites"
                            name="ifAllSites"
                            :options="ifAllSitesSelectItem"
                            @change="changeAllSitesSelect"
                        ></b-form-radio-group>
                    </b-col>

                </template>

                <template #siteIds="{$attrs, $listeners}">
                    <iv-form-selection
                        v-on="$listeners"
                        v-model="inputFormData.siteIds"
                        class="select-site ml-3"
                        :options="sitesSelectItem"
                        :multiple="true"
                        @input="changeSiteIds"
                    >
                    </iv-form-selection>

                    <div class="ml-3">
                        <b-button
                            variant="outline-secondary"
                            @click="pageToChooseTree"
                        >
                            {{ _('w_SelectSiteTree') }}
                        </b-button>
                    </div>

                </template>

                <template #selectPeriodAddWay="{ $attrs, $listeners }">

                    <p class="ml-3">{{ _('w_Selected_Date') }}</p>

                    <b-col cols="9">
                        <b-form-radio-group
                            v-model="selectPeriodAddWay"
                            name="selectPeriodAddWay"
                            :options="addPeriodSelectItem"
                            @change="changeAddPeriodSelect"
                        ></b-form-radio-group>
                    </b-col>

                </template>

                <template #startDate="{ $attrs, $listeners }">
                    <iv-form-date
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.startDate"
                    >
                    </iv-form-date>
                </template>

                <template #endDate="{ $attrs, $listeners }">
                    <iv-form-date
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.endDate"
                    >
                    </iv-form-date>
                </template>

                <template #designationPeriod="{ $attrs, $listeners }">
                    <iv-form-selection
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.designationPeriod"
                    >
                    </iv-form-selection>
                </template>

                <template #tagIds="{ $attrs, $listeners }">
                    <iv-form-selection
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.tagIds"
                    >
                    </iv-form-selection>
                </template>

            </iv-form>

            <template #footer>
                <b-button
                    class="submit"
                    size="lg"
                    @click="doSubmit"
                >
                    {{ _('wb_Submit') }}
                </b-button>

                <b-button
                    class="reset"
                    size="lg"
                    @click="doReset"
                >
                    {{ _('wb_Reset') }}
                </b-button>
            </template>

        </iv-card>

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
import { Component, Prop, Vue } from "vue-property-decorator";
import { toEnumInterface } from "../../../../core";
import { ERegionType, IRegionTreeSelected } from "@/components/RegionTree";
import {
    IFilterCondition,
    ITemplateItem,
    EAddPeriodSelect,
    ECountType,
    EDesignationPeriod,
    EIfAllSelected,
    ETimeMode
} from "@/components/Reports";
import Datetime from "@/services/Datetime";
import Dialog from "@/services/Dialog";
import ReportService from '../models/ReportService';

enum EPageStep {
    none = "none",
    showResult = "showResult",
    chooseTree = "chooseTree",
    select = "select",
    all = "all"
}

@Component({
    components: {}
})
export class FilterCondition extends Vue {
    @Prop({
        type: Array, // Boolean, Number, String, Array, Object
        default: []
    })
    sitesSelectItem: any;

    @Prop({
        type: Array, // Boolean, Number, String, Array, Object
        default: []
    })
    ifAllSitesSelectItem: any;

    @Prop({
        type: Array, // Boolean, Number, String, Array, Object
        default: []
    })
    addPeriodSelectItem: any;

    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: {}
    })
    tagSelectItem: object;

    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: {}
    })
    regionTreeItem: object;

    @Prop({
        type: Object,
        default: null
    })
    templateItem: ITemplateItem | null;

    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;

    // site 相關
    selectAllSites: string = EIfAllSelected.select;
    // ifAllSitesSelectItem: any = [];

    // select 相關

    // tree
    selectType = ERegionType.site;
    selecteds: IRegionTreeSelected[] = [];

    // date 相關
    selectPeriodAddWay: string = EAddPeriodSelect.period;

    // addPeriodSelectItem: any = [];

    designationPeriodSelectItem: any = {};

    inputFormData: any = {
        siteIds: [],
        tagIds: [],
        allSiteIds: [],
        allTagIds: [],
        startDate: new Date(),
        endDate: new Date(),
        type: "",
        designationPeriod: EDesignationPeriod.today
    };


    // response 相關
    responseData: any = {};

    // 收合card控制
    visible: boolean = true;

    created() {
        // this.initSelectItemSite();
        this.initSelectItem();
    }

    mounted() {
        // this.initSelectItemTag();
        // this.initSelectItemTree();
        // this.initRegionTreeSelect();
        this.siteFilterPermission();
        this.initTemplate();
    }

    // initRegionTreeSelect() {
    //     this.regionTreeItem = new RegionTreeItem();
    //     this.regionTreeItem.titleItem.card = this._("w_SiteTreeSelect");
    // }

    initSelectItem() {
        // this.ifAllSitesSelectItem = [
        //     { value: EIfAllSelected.all, text: this._("w_AllSites") },
        //     { value: EIfAllSelected.select, text: this._("w_SelectSites") }
        // ];

        // this.addPeriodSelectItem = [
        //     { value: EAddPeriodSelect.period, text: this._("w_period") },
        //     {
        //         value: EAddPeriodSelect.designation,
        //         text: this._("w_Designation")
        //     }
        // ];

        this.designationPeriodSelectItem = {
            today: `${this._("w_Today")} ( ${Datetime.CountDateNumber(0)} ~ ${Datetime.CountDateNumber(0)} )`,
            yesterday: `${this._("w_Yesterday")} ( ${Datetime.CountDateNumber(-1)} ~ ${Datetime.CountDateNumber(-1)} )`,
            last7days: `${this._("w_last7days")} ( ${Datetime.CountDateNumber(-6)} ~ ${Datetime.CountDateNumber(0)} )`,
            thisWeek: `${this._("w_thisWeek")} ( ${Datetime.ThisWeekStartDate()} ~ ${Datetime.ThisWeekEndDate()} )`,
            lastWeek: `${this._("w_lastWeek")} ( ${Datetime.LastWeekStartDate()} ~ ${Datetime.LastWeekEndDate()} )`,
            thisMonth: `${this._("w_thisMonth")} ( ${Datetime.ThisMonthStartDate()} ~ ${Datetime.ThisMonthEndDate()} )`,
            lastMonth: `${this._("w_lastMonth")} ( ${Datetime.LastMonthStartDate()} ~ ${Datetime.LastMonthEndDate()} )`,
            q1: `${this._("w_q1")} ( ${Datetime.Q1StartDate()} ~ ${Datetime.Q1EndDate()} )`,
            q2: `${this._("w_q2")} ( ${Datetime.Q2StartDate()} ~ ${Datetime.Q2EndDate()} )`,
            q3: `${this._("w_q3")} ( ${Datetime.Q3StartDate()} ~ ${Datetime.Q3EndDate()} )`,
            q4: `${this._("w_q4")} ( ${Datetime.Q4StartDate()} ~ ${Datetime.Q4EndDate()} )`,
            thisYear: `${this._("w_thisYear")} ( ${Datetime.ThisYearStartDate()} ~ ${Datetime.ThisYearEndDate()} )`
        };
    }

    siteFilterPermission() {
        for (const detail of this.$user.allowSites) {
            this.inputFormData.allSiteIds.push(detail.objectId);
        }
    }

    tempSaveInputData(data) {
        switch (data.key) {
            // case "siteIds":
            //     for (const siteId of data.value) {
            //         if (!siteId) {
            //             this.inputFormData.siteIds = [];
            //         } else {
            //             this.inputFormData.siteIds = data.value;
            //         }
            //     }
            //     break;
            case "tagIds":
                this.inputFormData.tagIds = data.value;
                break;
            case "startDate":
                this.inputFormData.startDate = data.value;
                break;
            case "endDate":
                this.inputFormData.endDate = data.value;
                break;
            case "designationPeriod":
                this.inputFormData.designationPeriod = data.value;
                break;
        }
    }

    changeSiteIds() {

        if (this.inputFormData.siteIds.length !== this.inputFormData.allSiteIds.length) {
            this.selectAllSites = EIfAllSelected.select;
        } else if(this.inputFormData.siteIds.length === this.inputFormData.allSiteIds.length) {
            this.selectAllSites = EIfAllSelected.all;
        }

        this.selecteds = [];

        for (const id of this.inputFormData.siteIds) {
            for (const detail of this.sitesSelectItem) {
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

    async pageToChooseTree() {
        this.pageStep = EPageStep.chooseTree;
        this.selecteds = [];

        for (const id of this.inputFormData.siteIds) {
            for (const detail of this.sitesSelectItem) {
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

    pageToShowResult() {
        this.pageStep = EPageStep.none;
        // siteIds clear
        this.inputFormData.siteIds = [];

        // from selecteds push siteIds
        for (const item of this.selecteds) {
            this.inputFormData.siteIds.push(item.objectId);
        }

        if (this.inputFormData.siteIds.length !== this.inputFormData.allSiteIds.length) {
            this.selectAllSites = EIfAllSelected.select;
        } else if(this.inputFormData.siteIds.length === this.inputFormData.allSiteIds.length) {
            this.selectAllSites = EIfAllSelected.all;
        }
    }

    changeAllSitesSelect(selected: string) {
        this.inputFormData.siteIds = [];
        this.selecteds = [];
        this.selectAllSites = selected;
        if (this.selectAllSites === EIfAllSelected.all) {
            this.inputFormData.siteIds = [];
            this.selecteds = [];


            this.inputFormData.siteIds = this.inputFormData.allSiteIds;
        } else {
            this.inputFormData.siteIds = [];
            this.selecteds = [];
        }
    }

    changeAddPeriodSelect(selected: string) {
        this.selectPeriodAddWay = selected;
        this.inputFormData.designationPeriod = EDesignationPeriod.today;
        this.inputFormData.startDate = new Date();
        this.inputFormData.endDate = new Date();
    }

    initTemplate() {
        if (this.templateItem != null) {
            if (this.templateItem.type != undefined) {
                this.inputFormData.type = this.templateItem.type;
            }

            if (this.templateItem.sites != undefined) {
                for (let site of this.templateItem.sites) {
                    this.inputFormData.siteIds.push(site.objectId);
                }
            }

            if (this.templateItem.tags != undefined) {
                for (let tag of this.templateItem.tags) {
                    this.inputFormData.tagIds.push(tag.objectId);
                }
            }

            console.log("!!!! templateItem:", this.templateItem);

            // Select Report Period
            if (
                this.templateItem.type &&
                !this.templateItem.startDate &&
                !this.templateItem.endDate
            ) {
                this.selectPeriodAddWay = EAddPeriodSelect.designation;
                this.inputFormData.designationPeriod = this.templateItem.type;
            }

            if (
                !this.templateItem.type &&
                this.templateItem.startDate &&
                this.templateItem.endDate
            ) {
                this.selectPeriodAddWay = EAddPeriodSelect.period;
                this.inputFormData.startDate = this.templateItem.startDate;
                this.inputFormData.endDate = this.templateItem.endDate;
            }

            this.doSubmit();
        }
    }

    async doSubmit() {
        const doSubmitParam: {
            startDate: Date;
            endDate: Date;
            firstSiteId?: string;
            siteIds: string[];
            tagIds: string[];
            type: ETimeMode;
        } = {
            startDate: Datetime.DateToZero(new Date()),
            endDate: Datetime.DateToZero(new Date()),
            type: ETimeMode.none,
            firstSiteId: "",
            siteIds: [],
            tagIds:
                this.inputFormData.tagIds === []
                    ? []
                    : this.inputFormData.tagIds
        };

        let designationPeriod: EDesignationPeriod = EDesignationPeriod.none;

        if (this.inputFormData.siteIds.length === 0) {
            Dialog.error(this._("w_PleaseSelectSites"));
            return false;
        }

        if (this.selectAllSites === "all") {
            this.inputFormData.siteIds = this.inputFormData.allSiteIds;
        }

        doSubmitParam.siteIds = this.inputFormData.siteIds;
        doSubmitParam.firstSiteId = doSubmitParam.siteIds[0];

        // 選擇 period
        if (this.selectPeriodAddWay === "period") {
            if (
                !Datetime.CheckDate(
                    this.inputFormData.startDate,
                    this.inputFormData.endDate
                )
            ) {
                Dialog.error(this._("w_ReportDateError"));
                this.inputFormData.startDate = new Date();
                this.inputFormData.endDate = new Date();
                return false;
            }

            if (
                Datetime.CheckTheSameDate(
                    Datetime.DateTime2String(
                        this.inputFormData.startDate,
                        "YYYY-MM-DD"
                    ),
                    Datetime.DateTime2String(
                        this.inputFormData.endDate,
                        "YYYY-MM-DD"
                    )
                )
            ) {
                doSubmitParam.startDate = Datetime.DateToZero(
                    this.inputFormData.startDate
                );
                doSubmitParam.endDate = Datetime.DateToZero(
                    this.inputFormData.endDate
                );
                doSubmitParam.type = ETimeMode.hour;
            } else {
                doSubmitParam.startDate = Datetime.DateToZero(
                    this.inputFormData.startDate
                );
                doSubmitParam.endDate = Datetime.DateToZero(
                    this.inputFormData.endDate
                );
                doSubmitParam.type = ETimeMode.day;
            }

            // 選擇 designation
        } else if (this.selectPeriodAddWay === "designation") {
            switch (this.inputFormData.designationPeriod) {
                case "today":
                    doSubmitParam.startDate = Datetime.DateToZero(
                        new Date(Datetime.CountDateNumber(0))
                    );
                    doSubmitParam.endDate = Datetime.DateToZero(
                        new Date(Datetime.CountDateNumber(0))
                    );
                    doSubmitParam.type = ETimeMode.hour;
                    designationPeriod = EDesignationPeriod.today;
                    break;
                case "yesterday":
                    doSubmitParam.startDate = Datetime.DateToZero(
                        new Date(Datetime.CountDateNumber(-1))
                    );
                    doSubmitParam.endDate = Datetime.DateToZero(
                        new Date(Datetime.CountDateNumber(-1))
                    );
                    doSubmitParam.type = ETimeMode.hour;
                    designationPeriod = EDesignationPeriod.yesterday;
                    break;
                case "last7days":
                    doSubmitParam.startDate = Datetime.DateToZero(
                        new Date(Datetime.CountDateNumber(-6))
                    );
                    doSubmitParam.endDate = Datetime.DateToZero(
                        new Date(Datetime.CountDateNumber(0))
                    );
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.last7days;
                    break;
                case "thisWeek":
                    doSubmitParam.startDate = Datetime.DateToZero(
                        new Date(Datetime.ThisWeekStartDate())
                    );
                    doSubmitParam.endDate = Datetime.DateToZero(
                        new Date(Datetime.ThisWeekEndDate())
                    );
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.thisWeek;
                    break;
                case "lastWeek":
                    doSubmitParam.startDate = Datetime.DateToZero(
                        new Date(Datetime.LastWeekStartDate())
                    );
                    doSubmitParam.endDate = Datetime.DateToZero(
                        new Date(Datetime.LastWeekEndDate())
                    );
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.lastWeek;
                    break;
                case "thisMonth":
                    doSubmitParam.startDate = Datetime.DateToZero(
                        new Date(Datetime.ThisMonthStartDate())
                    );
                    doSubmitParam.endDate = Datetime.DateToZero(
                        new Date(Datetime.ThisMonthEndDate())
                    );
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.thisMonth;
                    break;
                case "lastMonth":
                    doSubmitParam.startDate = Datetime.DateToZero(
                        new Date(Datetime.LastMonthStartDate())
                    );
                    doSubmitParam.endDate = Datetime.DateToZero(
                        new Date(Datetime.LastMonthEndDate())
                    );
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.lastMonth;
                    break;
                case "q1":
                    doSubmitParam.startDate = Datetime.DateToZero(
                        new Date(Datetime.Q1StartDate())
                    );
                    doSubmitParam.endDate = Datetime.DateToZero(
                        new Date(Datetime.Q1EndDate())
                    );
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.q1;
                    break;
                case "q2":
                    doSubmitParam.startDate = Datetime.DateToZero(
                        new Date(Datetime.Q2StartDate())
                    );
                    doSubmitParam.endDate = Datetime.DateToZero(
                        new Date(Datetime.Q2EndDate())
                    );
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.q2;
                    break;
                case "q3":
                    doSubmitParam.startDate = Datetime.DateToZero(
                        new Date(Datetime.Q3StartDate())
                    );
                    doSubmitParam.endDate = Datetime.DateToZero(
                        new Date(Datetime.Q3EndDate())
                    );
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.q3;
                    break;
                case "q4":
                    doSubmitParam.startDate = Datetime.DateToZero(
                        new Date(Datetime.Q4StartDate())
                    );
                    doSubmitParam.endDate = Datetime.DateToZero(
                        new Date(Datetime.Q4EndDate())
                    );
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.q4;
                    break;
                case "thisYear":
                    doSubmitParam.startDate = Datetime.DateToZero(
                        new Date(Datetime.ThisYearStartDate())
                    );
                    doSubmitParam.endDate = Datetime.DateToZero(
                        new Date(Datetime.ThisYearEndDate())
                    );
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.thisYear;
                    break;
            }
        }

        // console.log(" - ", doSubmitParam);
        // return false;
        this.visible = false;
        this.$emit("submit-data", doSubmitParam, designationPeriod);
    }

    doReset() {
        this.inputFormData = {
            siteIds: [],
            tagIds: [],
            allSiteIds: [],
            startDate: new Date(),
            endDate: new Date(),
            designationPeriod: "today"
        };

        this.selectAllSites = EIfAllSelected.select;

        this.siteFilterPermission();
    }

    IFilterConditionForm() {
        return `
            interface {


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_ReportPeriod1")}
                 * @uiColumnGroup - site1
                 */
                ifAllSites?: any;


                siteIds: any;

                 selectTree?: any;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_ReportPeriod1")}
                 */
                 selectPeriodAddWay?: any;


                /**
                * @uiLabel - ${this._("w_BOCampaign_StartDate")}
                * @uiPlaceHolder - ${this._("w_BOCampaign_StartDate")}
                * @uiType - iv-form-date
                * @uiColumnGroup - date
                * @uiHidden - ${
                    this.selectPeriodAddWay === EAddPeriodSelect.designation
                        ? "true"
                        : "false"
                }
                 */
                startDate?: any;


                /**
                * @uiLabel - ${this._("w_BOCampaign_FinishDate")}
                * @uiPlaceHolder - ${this._("w_BOCampaign_FinishDate")}
                * @uiType - iv-form-date
                * @uiColumnGroup - date
                * @uiHidden - ${
                    this.selectPeriodAddWay === EAddPeriodSelect.designation
                        ? "true"
                        : "false"
                }
                 */
                endDate?: any;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Fixed_Interval")}
                 * @uiColumnGroup - period
                 * @uiHidden - ${
                     this.selectPeriodAddWay === EAddPeriodSelect.period
                         ? "true"
                         : "false"
                 }
                 */
                designationPeriod?: ${toEnumInterface(
                    this.designationPeriodSelectItem as any,
                    false
                )};


                /**
                 * @uiLabel - ${this._("w_Tag")}
                 * @uiColumnGroup - tag
                 */
                tagIds?: ${toEnumInterface(this.tagSelectItem as any, true)};

            }
        `;
    }
}

export default FilterCondition;
Vue.component("filter-condition", FilterCondition);
</script>

<style lang="scss" scoped>
.select_report_period_button {
    margin-top: 27px;
    margin-bottom: 16px;
}

.select-site {
    width: 89%;
}

.tree {
    background-color: #fff;
    border: 1px solid #d1d1d1;
    color: #bbb;
}

.select_date_button {
    margin-top: 29px;
}
.submit {
    background-color: #5c7895;
    border: 1px solid #5c7895;
}
.reset {
    background-color: #d7d7d7;
    border: 1px solid #d7d7d7;
}
</style>
