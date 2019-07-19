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

                <template #siteIds="{ $attrs, $listeners }">
                    <iv-form-selection
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.siteIds"
                    >
                    </iv-form-selection>
                </template>

                <template #selectTree="{ $attrs, $listeners }">

                    <div class="ml-3 select_report_period_button">
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

                <template #designationPeriodShow>
                    <div
                        v-if="selectPeriodAddWay === 'designation' && showDesignationPeriod.endDate !== '' &&  showDesignationPeriod.startDate !== ''"
                        class="row justify-content-center align-items-center mt-2 ml-3"
                    >
                        {{ showDesignationPeriod.startDate }} - {{ showDesignationPeriod.endDate }}
                    </div>
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
            v-if="pageStep === ePageStep.chooseTree"
            :multiple="false"
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
export class FilterConditionHeatMap extends Vue {
    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: () => {}
    })
    sitesSelectItem: object;

    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: () => {}
    })
    regionTreeItem: object;

    @Prop({
        type: Object,
        default: null
    })
    templateItem: ITemplateItem | null;


    @Prop({
        type: Array, // Boolean, Number, String, Array, Object
        default: () => []
    })
    addPeriodSelectItem: any;

    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;

    // select 相關

    // tree
    selectType = ERegionType.site;
    selecteds: IRegionTreeSelected[] = [];

    // date 相關
    selectPeriodAddWay: string = EAddPeriodSelect.period;

    // addPeriodSelectItem: any = [];

    designationPeriodSelectItem: any = [];

    inputFormData: any = {
        siteIds: '',
        tagIds: [],
        allSiteIds: [],
        allTagIds: [],
        startDate: new Date(),
        endDate: new Date(),
        type: "",
        designationPeriod: EDesignationPeriod.today
    };

    showDesignationPeriod: any = {
        startDate: '',
        endDate: '',
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
        this.siteFilterPermission();
        this.initTemplate();
    }

    // initRegionTreeSelect() {
    //     this.regionTreeItem = new RegionTreeItem();
    //     this.regionTreeItem.titleItem.card = this._("w_SiteTreeSelect");
    // }

    initSelectItem() {

        this.designationPeriodSelectItem = {
            today: this._("w_Today"),
            yesterday: this._("w_Yesterday"),
            last7days: this._("w_last7days"),
            thisWeek: this._("w_thisWeek"),
            lastWeek: this._("w_lastWeek"),
            thisMonth: this._("w_thisMonth"),
            lastMonth: this._("w_lastMonth"),
            q1: this._("w_q1"),
            q2: this._("w_q2"),
            q3: this._("w_q3"),
            q4: this._("w_q4"),
            thisYear: this._("w_thisYear")
        };
    }

    siteFilterPermission() {
        for (const detail of this.$user.allowSites) {
            this.inputFormData.allSiteIds.push(detail.objectId);
        }
    }

    tempSaveInputData(data) {
        switch (data.key) {
            case "siteIds":
                for (const siteId of data.value) {
                    if (!siteId) {
                        this.inputFormData.siteIds = [];
                    } else {
                        this.inputFormData.siteIds = data.value;
                    }
                }
                break;
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
                switch (this.inputFormData.designationPeriod) {
                    case "today":
                        this.showDesignationPeriod.startDate = Datetime.CountDateNumber(0);
                        this.showDesignationPeriod.endDate = Datetime.CountDateNumber(0);
                        break;
                    case "yesterday":
                        this.showDesignationPeriod.startDate = Datetime.CountDateNumber(-1);
                        this.showDesignationPeriod.endDate = Datetime.CountDateNumber(-1);
                        break;
                    case "last7days":
                        this.showDesignationPeriod.startDate = Datetime.CountDateNumber(-6);
                        this.showDesignationPeriod.endDate = Datetime.CountDateNumber(0);
                        break;
                    case "thisWeek":
                        this.showDesignationPeriod.startDate = Datetime.ThisWeekStartDate();
                        this.showDesignationPeriod.endDate = Datetime.ThisWeekEndDate();
                        break;
                    case "lastWeek":
                        this.showDesignationPeriod.startDate = Datetime.LastWeekStartDate();
                        this.showDesignationPeriod.endDate = Datetime.LastWeekEndDate();
                        break;
                    case "thisMonth":
                        this.showDesignationPeriod.startDate = Datetime.ThisMonthStartDate();
                        this.showDesignationPeriod.endDate = Datetime.ThisMonthEndDate();
                        break;
                    case "lastMonth":
                        this.showDesignationPeriod.startDate = Datetime.LastMonthStartDate();
                        this.showDesignationPeriod.endDate = Datetime.LastMonthEndDate();
                        break;
                    case "q1":
                        this.showDesignationPeriod.startDate = Datetime.Q1StartDate();
                        this.showDesignationPeriod.endDate = Datetime.Q1EndDate();
                        break;
                    case "q2":
                        this.showDesignationPeriod.startDate = Datetime.Q2StartDate();
                        this.showDesignationPeriod.endDate = Datetime.Q2EndDate();
                        break;
                    case "q3":
                        this.showDesignationPeriod.startDate = Datetime.Q3StartDate();
                        this.showDesignationPeriod.endDate = Datetime.Q3EndDate();
                        break;
                    case "q4":
                        this.showDesignationPeriod.startDate = Datetime.Q4StartDate();
                        this.showDesignationPeriod.endDate = Datetime.Q4EndDate();
                        break;
                    case "thisYear":
                        this.showDesignationPeriod.startDate = Datetime.ThisYearStartDate();
                        this.showDesignationPeriod.endDate = Datetime.ThisYearEndDate();
                        break;
                }
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

    async pageToChooseTree() {
        this.pageStep = EPageStep.chooseTree;
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
        this.pageStep = EPageStep.none;
        // siteIds clear
        this.inputFormData.siteIds = [];

        // from selecteds push siteIds
        for (const item of this.selecteds) {
            this.inputFormData.siteIds.push(item.objectId);
        }
    }

    changeAddPeriodSelect(selected: string) {
        this.selectPeriodAddWay = selected;
        this.inputFormData.designationPeriod = EDesignationPeriod.today;
        this.showDesignationPeriod.startDate = Datetime.CountDateNumber(0);
        this.showDesignationPeriod.endDate = Datetime.CountDateNumber(0);
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
            siteIds: string;
            // tagIds: string[];
            type: ETimeMode;
        } = {
            startDate: Datetime.DateToZero(new Date()),
            endDate: Datetime.DateToZero(new Date()),
            type: ETimeMode.none,
            firstSiteId: '',
            siteIds: this.inputFormData.siteIds,
            // tagIds:this.inputFormData.tagIds === [] ? [] : this.inputFormData.tagIds,
        };

        let designationPeriod: EDesignationPeriod = EDesignationPeriod.none;

        if (!this.inputFormData.siteIds) {
            Dialog.error(this._("w_PleaseSelectSites"));
            return false;
        }

        doSubmitParam.siteIds = this.inputFormData.siteIds;
        doSubmitParam.firstSiteId = this.inputFormData.siteIds;

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
                doSubmitParam.startDate = Datetime.DateToZero(this.inputFormData.startDate);
                doSubmitParam.endDate = Datetime.DateToZero(this.inputFormData.endDate);
                doSubmitParam.type = ETimeMode.hour;
            } else {
                doSubmitParam.startDate = Datetime.DateToZero(this.inputFormData.startDate);
                doSubmitParam.endDate = Datetime.DateToZero(this.inputFormData.endDate);
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

        // console.log(' - ', doSubmitParam); return false;

        this.visible = false;
        this.$emit("submit-data", doSubmitParam, designationPeriod);
    }

    doReset() {
        this.inputFormData = {
            siteIds: '',
            allSiteIds: [],
            startDate: new Date(),
            endDate: new Date(),
            designationPeriod: "today"
        };

        this.siteFilterPermission();
    }

    IFilterConditionForm() {
        return `
            interface {


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 * @uiColumnGroup - site
                 */
                siteIds: ${toEnumInterface(this.sitesSelectItem as any, false)};


                /**
                 * @uiColumnGroup - site
                 */
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
                 * @uiColumnGroup - period
                 */
                 designationPeriodShow: any;
            }
        `;
    }
}

export default FilterConditionHeatMap;
Vue.component("filter-condition-heat-map", FilterConditionHeatMap);
</script>

<style lang="scss" scoped>
.select_report_period_button {
    margin-top: 27px;
    margin-bottom: 16px;
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
