<template>
    <div>

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :visible="visible"
                :label="_('w_ReportFilterConditionComponent_')"
            >
                <iv-form
                    :interface="IFilterConditionForm()"
                    @update:*="tempSaveInputData($event)"
                    @submit="doSubmit($event)"
                >

                    <template #ifAllSites="{ $attrs, $listeners }">
                        <p class="ml-3">{{ _('w_SelectSite') }}</p>
                    </template>

                    <template #siteIds="{$attrs, $listeners}">
                        <iv-form-selection
                            v-on="$listeners"
                            v-model="inputFormData.siteIds"
                            class="select-site ml-3"
                            :options="sitesSelectItem"
                            :multiple="false"
                            @input="changeSiteIds"
                        >
                        </iv-form-selection>

                        <div class="ml-3 mb-3">
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
                                class="mb-3"
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

            <!-- Region Tree Select -->
            <region-tree-select
                key="transition_2"
                v-show="transition.step === 2"
                :multiple="false"
                :regionTreeItem="regionTreeItem"
                :selectType="selectType"
                :selecteds="selecteds"
                v-on:click-back="pageToShowResult"
            >
            </region-tree-select>

        </iv-auto-transition>

    </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { toEnumInterface } from "../../../../core";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Region Tree
import { ERegionType, IRegionTreeSelected } from "@/components/RegionTree";

// Report
import {
    IFilterCondition,
    ITemplateItem,
    EAddPeriodSelect,
    ECountType,
    EDesignationPeriod,
    EIfAllSelected,
    ETimeMode
} from "@/components/Reports";

// Service
import Datetime from "@/services/Datetime";
import Dialog from "@/services/Dialog";

@Component({
    components: {}
})
export class FilterConditionHeatMap extends Vue {
    @Prop({
        type: Array, // Boolean, Number, String, Array, Object
        default: []
    })
    sitesSelectItem: any;

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

    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    // select 相關

    // tree
    selectType = ERegionType.site;
    selecteds: IRegionTreeSelected[] = [];

    // date 相關
    selectPeriodAddWay: string = EAddPeriodSelect.period;

    // addPeriodSelectItem: any = [];

    designationPeriodSelectItem: any = {};

    inputFormData: any = {
        siteIds: "",
        tagIds: [],
        allSiteIds: [],
        allTagIds: [],
        startDate: new Date(),
        endDate: new Date(),
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
        this.siteFilterPermission();
        this.initTemplate();
    }

    // initRegionTreeSelect() {
    //     this.regionTreeItem = new RegionTreeItem();
    //     this.regionTreeItem.titleItem.card = this._("w_SiteTreeSelect");
    // }

    initSelectItem() {
        this.designationPeriodSelectItem = {
            today: `${this._("w_Today")} ( ${Datetime.DateTime2String(
                new Date(),
                Datetime.FormatDate
            )} ~ ${Datetime.DateTime2String(new Date(), Datetime.FormatDate)} )`,
            yesterday: `${this._("w_Yesterday")} ( ${Datetime.DateTime2String(
                Datetime.DatePlus(new Date(), -1),
                Datetime.FormatDate
            )} ~ ${Datetime.DateTime2String(
                Datetime.DatePlus(new Date(), -1),
                Datetime.FormatDate
            )} )`,
            last7days: `${this._("w_last7days")} ( ${Datetime.DateTime2String(
                Datetime.DatePlus(new Date(), -6),
                Datetime.FormatDate
            )} ~ ${Datetime.DateTime2String(new Date(), Datetime.FormatDate)} )`,
            thisWeek: `${this._("w_thisWeek")} ( ${Datetime.DateTime2String(
                Datetime.WeekStart(new Date()),
                Datetime.FormatDate
            )} ~ ${Datetime.DateTime2String(
                Datetime.WeekEnd(new Date()),
                Datetime.FormatDate
            )} )`,
            lastWeek: `${this._(
                "w_lastWeek"
            )} ( ${Datetime.LastWeekStartDate()} ~ ${Datetime.LastWeekEndDate()} )`,
            thisMonth: `${this._("w_thisMonth")} ( ${Datetime.DateTime2String(
                Datetime.MonthStart(new Date()),
                Datetime.FormatDate
            )} ~ ${Datetime.DateTime2String(
                Datetime.MonthEnd(new Date()),
                Datetime.FormatDate
            )} )`,
            lastMonth: `${this._("w_lastMonth")} ( ${Datetime.DateTime2String(
                Datetime.LastMonthStart(new Date()),
                Datetime.FormatDate
            )} ~ ${Datetime.DateTime2String(
                Datetime.LastMonthEnd(new Date()),
                Datetime.FormatDate
            )} )`,
            q1: `${this._("w_q1")} ( ${Datetime.DateTime2String(
                Datetime.Q1Start(new Date()),
                Datetime.FormatDate
            )} ~ ${Datetime.DateTime2String(
                Datetime.Q1End(new Date()),
                Datetime.FormatDate
            )} )`,
            q2: `${this._("w_q2")} ( ${Datetime.DateTime2String(
                Datetime.Q2Start(new Date()),
                Datetime.FormatDate
            )} ~ ${Datetime.DateTime2String(
                Datetime.Q2End(new Date()),
                Datetime.FormatDate
            )} )`,
            q3: `${this._("w_q3")} ( ${Datetime.DateTime2String(
                Datetime.Q3Start(new Date()),
                Datetime.FormatDate
            )} ~ ${Datetime.DateTime2String(
                Datetime.Q3End(new Date()),
                Datetime.FormatDate
            )} )`,
            q4: `${this._("w_q4")} ( ${Datetime.DateTime2String(
                Datetime.Q4Start(new Date()),
                Datetime.FormatDate
            )} ~ ${Datetime.DateTime2String(
                Datetime.Q4End(new Date()),
                Datetime.FormatDate
            )} )`,
            thisYear: `${this._("w_thisYear")} ( ${Datetime.DateTime2String(
                Datetime.YearStart(new Date()),
                Datetime.FormatDate
            )} ~ ${Datetime.DateTime2String(
                Datetime.YearEnd(new Date()),
                Datetime.FormatDate
            )} )`
        };
    }

    siteFilterPermission() {
        for (const detail of this.$user.user.allowSites) {
            this.inputFormData.allSiteIds.push(detail.objectId);
        }
    }

    tempSaveInputData(data) {
        switch (data.key) {
            case "siteIds":
                this.inputFormData.siteIds = data.value;
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

                break;
        }

        // this.selecteds = [];
        //
        // for (const id of this.inputFormData.siteIds) {
        //     for (const detail in this.sitesSelectItem) {
        //         if (id === detail) {
        //             let selectedsObject: IRegionTreeSelected = {
        //                 objectId: detail,
        //                 type: ERegionType.site,
        //                 name: this.sitesSelectItem[detail]
        //             };
        //             this.selecteds.push(selectedsObject);
        //         }
        //     }
        // }
    }

    changeSiteIds() {
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
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
        this.selecteds = [];

        for (const detail of this.sitesSelectItem) {
            if (this.inputFormData.siteIds === detail.id) {
                let selectedsObject: IRegionTreeSelected = {
                    objectId: detail.id,
                    type: ERegionType.site,
                    name: detail.text
                };
                this.selecteds.push(selectedsObject);
            }
        }
    }

    pageToShowResult() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;

        // siteIds clear
        this.inputFormData.siteIds = "";

        // from selecteds push siteIds
        for (const item of this.selecteds) {
            this.inputFormData.siteIds = item.objectId;
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
            siteId: string;
            // tagIds: string[];
            type: ETimeMode;
        } = {
            startDate: Datetime.DateStart(new Date()),
            endDate: Datetime.DateStart(new Date()),
            type: ETimeMode.none,
            firstSiteId: "",
            siteId: this.inputFormData.siteIds
            // tagIds:this.inputFormData.tagIds === [] ? [] : this.inputFormData.tagIds,
        };

        let designationPeriod: EDesignationPeriod = EDesignationPeriod.none;

        if (!this.inputFormData.siteIds) {
            Dialog.error(this._("w_PleaseSelectSites"));
            return false;
        }

        doSubmitParam.siteId = this.inputFormData.siteIds;
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
                        Datetime.FormatCheckDate
                    ),
                    Datetime.DateTime2String(
                        this.inputFormData.endDate,
                        Datetime.FormatCheckDate
                    )
                )
            ) {
                doSubmitParam.startDate = Datetime.DateStart(
                    this.inputFormData.startDate
                );
                doSubmitParam.endDate = Datetime.DateStart(
                    this.inputFormData.endDate
                );
                doSubmitParam.type = ETimeMode.hour;
            } else {
                doSubmitParam.startDate = Datetime.DateStart(
                    this.inputFormData.startDate
                );
                doSubmitParam.endDate = Datetime.DateStart(
                    this.inputFormData.endDate
                );
                doSubmitParam.type = ETimeMode.day;
            }

            // 選擇 designation
        } else if (this.selectPeriodAddWay === "designation") {
            switch (this.inputFormData.designationPeriod) {
                case "today":
                    doSubmitParam.startDate = Datetime.DateStart(new Date());
                    doSubmitParam.endDate = Datetime.DateStart(new Date());
                    doSubmitParam.type = ETimeMode.hour;
                    designationPeriod = EDesignationPeriod.today;
                    break;
                case "yesterday":
                    doSubmitParam.startDate = Datetime.DatePlus(new Date(), -1);
                    doSubmitParam.endDate = Datetime.DatePlus(new Date(), -1);
                    doSubmitParam.type = ETimeMode.hour;
                    designationPeriod = EDesignationPeriod.yesterday;
                    break;
                case "last7days":
                    doSubmitParam.startDate = Datetime.DatePlus(new Date(), -6);
                    doSubmitParam.endDate = Datetime.DateStart(new Date());
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.last7days;
                    break;
                case "thisWeek":
                    doSubmitParam.startDate = Datetime.WeekStart(new Date());
                    doSubmitParam.endDate = Datetime.WeekEnd(new Date());
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.thisWeek;
                    break;
                case "lastWeek":
                    doSubmitParam.startDate = Datetime.DateStart(
                        new Date(Datetime.LastWeekStartDate())
                    );
                    doSubmitParam.endDate = Datetime.DateStart(
                        new Date(Datetime.LastWeekEndDate())
                    );
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.lastWeek;
                    break;
                case "thisMonth":
                    doSubmitParam.startDate = Datetime.MonthStart(new Date());
                    doSubmitParam.endDate = Datetime.MonthEnd(new Date());
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.thisMonth;
                    break;
                case "lastMonth":
                    doSubmitParam.startDate = Datetime.LastMonthStart(
                        new Date()
                    );
                    doSubmitParam.endDate = Datetime.LastMonthEnd(new Date());
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.lastMonth;
                    break;
                case "q1":
                    doSubmitParam.startDate = Datetime.Q1Start(new Date());
                    doSubmitParam.endDate = Datetime.Q1End(new Date());
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.q1;
                    break;
                case "q2":
                    doSubmitParam.startDate = Datetime.Q2Start(new Date());
                    doSubmitParam.endDate = Datetime.Q2End(new Date());
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.q2;
                    break;
                case "q3":
                    doSubmitParam.startDate = Datetime.Q3Start(new Date());
                    doSubmitParam.endDate = Datetime.Q3End(new Date());
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.q3;
                    break;
                case "q4":
                    doSubmitParam.startDate = Datetime.Q4Start(new Date());
                    doSubmitParam.endDate = Datetime.Q4End(new Date());
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.q4;
                    break;
                case "thisYear":
                    doSubmitParam.startDate = Datetime.YearStart(new Date());
                    doSubmitParam.endDate = Datetime.YearEnd(new Date());
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.thisYear;
                    break;
            }
        }

        this.visible = false;
        this.$emit("submit-data", doSubmitParam, designationPeriod);
    }

    doReset() {
        this.inputFormData = {
            siteIds: "",
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
                 * @uiLabel - ${this._("w_SelectSites")}
                 * @uiColumnGroup - site1
                 */
                ifAllSites?: any;


                /**
                 * @uiColumnGroup - site
                 */
                 siteIds: any;


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

.select-site {
    width: 89%;
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
