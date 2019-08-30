<template>
    <div>
        <iv-card
            :visible="visible"
            :label="_('w_ReportFilterConditionComponent_')"
        >
            <iv-form
                :interface="IFilterConditionForm()"
                @update:*="tempSaveInputData($event)"
                @submit="doSubmit($event)"
            >

                <!--                <template #ifAllTags="{ $attrs, $listeners }">-->
                <!--                    <b-form-radio-group-->
                <!--                        v-bind="$attrs"-->
                <!--                        v-on="$listeners"-->
                <!--                        v-model="selectAllTags"-->
                <!--                        class="h-25 select_date_button mb-3"-->
                <!--                        button-variant="outline-success"-->
                <!--                        name="radio-btn-outline"-->
                <!--                        :options="ifAllTagsSelectItem"-->
                <!--                        @change="changeAllTagsSelect"-->
                <!--                    ></b-form-radio-group>-->
                <!--                </template>-->

                <template #ifAllTags="{ $attrs, $listeners }">

                    <p class="ml-3">{{ _('w_Tag') }}</p>

                    <b-col cols="9">
                        <b-form-radio-group
                            v-model="selectAllTags"
                            name="ifAllSites"
                            class="mb-3"
                            :options="ifAllTagsSelectItem"
                            @change="changeAllTagsSelect"
                        ></b-form-radio-group>
                    </b-col>

                </template>

                <template #tagIds="{$attrs, $listeners}">
                    <iv-form-selection
                        v-on="$listeners"
                        v-model="inputFormData.tagIds"
                        class="select-site ml-3 mr-3"
                        :options="tagSelectItem"
                        :multiple="true"
                        @input="changeTagIds"
                    >
                    </iv-form-selection>
                    <!--                    v-if="selectAllTags === 'select'"-->

                </template>

                <!--                <template #tagIds="{ $attrs, $listeners }">-->
                <!--                    <iv-form-selection-->
                <!--                        v-bind="$attrs"-->
                <!--                        v-on="$listeners"-->
                <!--                        v-model="inputFormData.tagIds"-->
                <!--                    >-->
                <!--                    </iv-form-selection>-->
                <!--                </template>-->

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
import ResponseFilter from "@/services/ResponseFilter";

@Component({
    components: {}
})
export class FilterConditionVIPAndBlacklist extends Vue {
    @Prop({
        type: Array, // Boolean, Number, String, Array, Object
        default: () => []
    })
    tagSelectItem: any;

    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: {}
    })
    sitesSelectItem: object;

    @Prop({
        type: Array, // Boolean, Number, String, Array, Object
        default: []
    })
    tagIncludeSitesItem: any;

    @Prop({
        type: Array, // Boolean, Number, String, Array, Object
        default: () => []
    })
    addPeriodSelectItem: any;

    @Prop({
        type: Array, // Boolean, Number, String, Array, Object
        default: () => []
    })
    allTagsItem: any;

    @Prop({
        type: Object,
        default: null
    })
    templateItem: ITemplateItem | null;

    // Tag 相關
    selectAllTags: string = EIfAllSelected.select;
    ifAllTagsSelectItem: any = [];

    // date 相關
    selectPeriodAddWay: string = EAddPeriodSelect.period;

    // addPeriodSelectItem: any = [];

    designationPeriodSelectItem: any = {};

    inputFormData: any = {
        tagIds: [],
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
        this.initSelectItem();
    }

    mounted() {
        this.initTemplate();
    }

    initSelectItem() {
        this.ifAllTagsSelectItem = [
            { value: EIfAllSelected.all, text: this._("w_AllTags") },
            { value: EIfAllSelected.select, text: this._("w_SelectTags") }
        ];

        this.designationPeriodSelectItem = {
            today: `${this._("w_Today")} ( ${Datetime.DateTime2String(
                new Date(),
                Datetime.FormatDate
            )} ~ ${Datetime.DateTime2String(
                new Date(),
                Datetime.FormatDate
            )} )`,
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
            )} ~ ${Datetime.DateTime2String(
                new Date(),
                Datetime.FormatDate
            )} )`,
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

    tempSaveInputData(data) {
        switch (data.key) {
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

    changeTagIds() {
        if (this.inputFormData.tagIds.length !== this.allTagsItem.length) {
            this.selectAllTags = EIfAllSelected.select;
        } else if (
            this.inputFormData.tagIds.length === this.allTagsItem.length
        ) {
            this.selectAllTags = EIfAllSelected.all;
        }
    }

    changeAllTagsSelect(selected: string) {
        this.inputFormData.tagIds = [];
        this.selectAllTags = selected;
        if (this.selectAllTags === EIfAllSelected.all) {
            this.inputFormData.tagIds = [];
            this.inputFormData.tagIds = this.allTagsItem;
        } else {
            this.inputFormData.tagIds = [];
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
            tagIds: string[];
            siteIds: string[];
        } = {
            startDate: Datetime.DateStart(new Date()),
            endDate: Datetime.DateStart(new Date()),
            tagIds: [],
            siteIds: []
        };

        let designationPeriod: EDesignationPeriod = EDesignationPeriod.none;

        if (this.inputFormData.tagIds.length === 0) {
            Dialog.error(this._("w_PleaseSelectTags"));
            return false;
        }

        if (this.selectAllTags === "all") {
            this.inputFormData.tagIds = this.allTagsItem;
        }

        doSubmitParam.tagIds = this.inputFormData.tagIds;

        let tempSiteIds = [];

        if (
            this.inputFormData.tagIds.length > 0 &&
            this.tagIncludeSitesItem.length > 0
        ) {
            this.inputFormData.tagIds.map(tagId => {
                this.tagIncludeSitesItem.map(item => {
                    if (tagId === item.objectId && item.sites.length > 0) {
                        item.sites.map(site => {
                            for (const allowSiteId in this.sitesSelectItem) {
                                if (allowSiteId === site.objectId) {
                                    tempSiteIds.push(site.objectId);
                                }
                            }
                        });
                    }
                });
            });
        } else {
            return false;
        }

        // 移除陣列中重複的值
        let finalSiteIds = Array.from(new Set(tempSiteIds));

        doSubmitParam.siteIds = finalSiteIds;

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
            } else {
                doSubmitParam.startDate = Datetime.DateStart(
                    this.inputFormData.startDate
                );
                doSubmitParam.endDate = Datetime.DateStart(
                    this.inputFormData.endDate
                );
            }

            // 選擇 designation
        } else if (this.selectPeriodAddWay === "designation") {
            switch (this.inputFormData.designationPeriod) {
                case "today":
                    doSubmitParam.startDate = Datetime.DateStart(new Date());
                    doSubmitParam.endDate = Datetime.DateStart(new Date());
                    designationPeriod = EDesignationPeriod.today;
                    break;
                case "yesterday":
                    doSubmitParam.startDate = Datetime.DatePlus(new Date(), -1);
                    doSubmitParam.endDate = Datetime.DatePlus(new Date(), -1);
                    designationPeriod = EDesignationPeriod.yesterday;
                    break;
                case "last7days":
                    doSubmitParam.startDate = Datetime.DatePlus(new Date(), -6);
                    doSubmitParam.endDate = Datetime.DateStart(new Date());
                    designationPeriod = EDesignationPeriod.last7days;
                    break;
                case "thisWeek":
                    doSubmitParam.startDate = Datetime.WeekStart(new Date());
                    doSubmitParam.endDate = Datetime.WeekEnd(new Date());
                    designationPeriod = EDesignationPeriod.thisWeek;
                    break;
                case "lastWeek":
                    doSubmitParam.startDate = Datetime.DateStart(
                        new Date(Datetime.LastWeekStartDate())
                    );
                    doSubmitParam.endDate = Datetime.DateStart(
                        new Date(Datetime.LastWeekEndDate())
                    );
                    designationPeriod = EDesignationPeriod.lastWeek;
                    break;
                case "thisMonth":
                    doSubmitParam.startDate = Datetime.MonthStart(new Date());
                    doSubmitParam.endDate = Datetime.MonthEnd(new Date());
                    designationPeriod = EDesignationPeriod.thisMonth;
                    break;
                case "lastMonth":
                    doSubmitParam.startDate = Datetime.LastMonthStart(
                        new Date()
                    );
                    doSubmitParam.endDate = Datetime.LastMonthEnd(new Date());
                    designationPeriod = EDesignationPeriod.lastMonth;
                    break;
                case "q1":
                    doSubmitParam.startDate = Datetime.Q1Start(new Date());
                    doSubmitParam.endDate = Datetime.Q1End(new Date());
                    designationPeriod = EDesignationPeriod.q1;
                    break;
                case "q2":
                    doSubmitParam.startDate = Datetime.Q2Start(new Date());
                    doSubmitParam.endDate = Datetime.Q2End(new Date());
                    designationPeriod = EDesignationPeriod.q2;
                    break;
                case "q3":
                    doSubmitParam.startDate = Datetime.Q3Start(new Date());
                    doSubmitParam.endDate = Datetime.Q3End(new Date());
                    designationPeriod = EDesignationPeriod.q3;
                    break;
                case "q4":
                    doSubmitParam.startDate = Datetime.Q4Start(new Date());
                    doSubmitParam.endDate = Datetime.Q4End(new Date());
                    designationPeriod = EDesignationPeriod.q4;
                    break;
                case "thisYear":
                    doSubmitParam.startDate = Datetime.YearStart(new Date());
                    doSubmitParam.endDate = Datetime.YearEnd(new Date());
                    designationPeriod = EDesignationPeriod.thisYear;
                    break;
            }
        }

        this.visible = false;
        this.$emit("submit-data", doSubmitParam, designationPeriod);
    }

    doReset() {
        this.inputFormData = {
            tagIds: [],
            allTagIds: [],
            startDate: new Date(),
            endDate: new Date(),
            designationPeriod: "today"
        };

        this.selectAllTags = EIfAllSelected.select;

        // this.initAllTags();
    }

    IFilterConditionForm() {
        return `
            interface {



                /**
                 * @uiLabel - ${this._("w_ReportTemplate_ReportPeriod1")}
                 * @uiColumnGroup - tag
                 */
                ifAllTags?: any;


                /**
                 * @uiLabel - ${this._("w_Tag")}
                 * @uiColumnGroup - tag1
                 */
                tagIds: any;


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

export default FilterConditionVIPAndBlacklist;
Vue.component(
    "filter-condition-vip-and-blacklist",
    FilterConditionVIPAndBlacklist
);
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

.select-site {
    width: 98%;
}
</style>
