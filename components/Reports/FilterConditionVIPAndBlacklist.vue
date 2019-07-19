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
                            :options="ifAllTagsSelectItem"
                            @change="changeAllTagsSelect"
                        ></b-form-radio-group>
                    </b-col>

                </template>

                <template #tagIds="{$attrs, $listeners}">
                    <iv-form-selection
                        v-on="$listeners"
                        v-model="inputFormData.tagIds"
                        class="select-site ml-3"
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
import { toEnumInterface } from "@/../core";
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
import ResponseFilter from '@/services/ResponseFilter';

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

    designationPeriodSelectItem: any = [];

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
            tagIds: string[];
            siteIds: string[];
        } = {
            startDate: Datetime.DateToZero(new Date()),
            endDate: Datetime.DateToZero(new Date()),
            tagIds: [],
            siteIds: [],
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

        if (this.inputFormData.tagIds.length > 0 && this.tagIncludeSitesItem.length > 0 ) {
            this.inputFormData.tagIds.map(tagId => {
                this.tagIncludeSitesItem.map(item => {
                    if (tagId === item.objectId && item.sites.length > 0) {
                        item.sites.map(site => {
                            for (const allowSiteId in this.sitesSelectItem) {
                                if (allowSiteId === site.objectId) {
                                    tempSiteIds.push(site.objectId)

                                }
                            }
                        })
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

            } else {
                doSubmitParam.startDate = Datetime.DateToZero(this.inputFormData.startDate);
                doSubmitParam.endDate = Datetime.DateToZero(this.inputFormData.endDate);
            }

            // 選擇 designation
        } else if (this.selectPeriodAddWay === "designation") {
            switch (this.inputFormData.designationPeriod) {
                case "today":
                    doSubmitParam.startDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(0)));
                    doSubmitParam.endDate = Datetime.DateToZero(new Date( Datetime.CountDateNumber(0)));
                    designationPeriod = EDesignationPeriod.today;
                    console.log("startDate today - ", doSubmitParam.startDate);
                    console.log("endDate today - ", doSubmitParam.endDate);
                    break;
                case "yesterday":
                    doSubmitParam.startDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(-1)));
                    doSubmitParam.endDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(-1)));
                    designationPeriod = EDesignationPeriod.yesterday;
                    console.log(
                        "startDate yesterday - ",
                        doSubmitParam.startDate
                    );
                    console.log("endDate yesterday - ", doSubmitParam.endDate);
                    break;
                case "last7days":
                    doSubmitParam.startDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(-6)));
                    doSubmitParam.endDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(0)));
                    designationPeriod = EDesignationPeriod.last7days;
                    console.log(
                        "startDate last7days - ",
                        doSubmitParam.startDate
                    );
                    console.log("endDate last7days - ", doSubmitParam.endDate);
                    break;
                case "thisWeek":
                    doSubmitParam.startDate = Datetime.DateToZero(new Date(Datetime.ThisWeekStartDate()));
                    doSubmitParam.endDate = Datetime.DateToZero(new Date( Datetime.ThisWeekEndDate()));
                    designationPeriod = EDesignationPeriod.thisWeek;
                    console.log(
                        "startDate thisWeek - ",
                        doSubmitParam.startDate
                    );
                    console.log("endDate thisWeek - ", doSubmitParam.endDate);
                    break;
                case "lastWeek":
                    doSubmitParam.startDate = Datetime.DateToZero(new Date(Datetime.LastWeekStartDate()));
                    doSubmitParam.endDate = Datetime.DateToZero(new Date(Datetime.LastWeekEndDate()));
                    designationPeriod = EDesignationPeriod.lastWeek;
                    console.log(
                        "startDate lastWeek - ",
                        doSubmitParam.startDate
                    );
                    console.log("endDate lastWeek - ", doSubmitParam.endDate);
                    break;
                case "thisMonth":
                    doSubmitParam.startDate = Datetime.DateToZero(new Date(Datetime.ThisMonthStartDate()));
                    doSubmitParam.endDate = Datetime.DateToZero(new Date(Datetime.ThisMonthEndDate()));
                    designationPeriod = EDesignationPeriod.thisMonth;
                    console.log(
                        "startDate thisMonth - ",
                        doSubmitParam.startDate
                    );
                    console.log("endDate thisMonth - ", doSubmitParam.endDate);
                    break;
                case "lastMonth":
                    doSubmitParam.startDate = Datetime.DateToZero(new Date(Datetime.LastMonthStartDate()));
                    doSubmitParam.endDate = Datetime.DateToZero(new Date(Datetime.LastMonthEndDate()));
                    designationPeriod = EDesignationPeriod.lastMonth;
                    console.log(
                        "startDate lastMonth - ",
                        doSubmitParam.startDate
                    );
                    console.log("endDate lastMonth - ", doSubmitParam.endDate);
                    break;
                case "q1":
                    doSubmitParam.startDate = Datetime.DateToZero(new Date(Datetime.Q1StartDate()));
                    doSubmitParam.endDate = Datetime.DateToZero(new Date(Datetime.Q1EndDate()));
                    designationPeriod = EDesignationPeriod.q1;
                    console.log("startDate q1 - ", doSubmitParam.startDate);
                    console.log("endDate q1 - ", doSubmitParam.endDate);
                    break;
                case "q2":
                    doSubmitParam.startDate = Datetime.DateToZero(new Date(Datetime.Q2StartDate()));
                    doSubmitParam.endDate = Datetime.DateToZero(new Date(Datetime.Q2EndDate()));
                    designationPeriod = EDesignationPeriod.q2;
                    console.log("startDate q2 - ", doSubmitParam.startDate);
                    console.log("endDate q2 - ", doSubmitParam.endDate);
                    break;
                case "q3":
                    doSubmitParam.startDate = Datetime.DateToZero(new Date(Datetime.Q3StartDate()));
                    doSubmitParam.endDate = Datetime.DateToZero(new Date(Datetime.Q3EndDate()));
                    designationPeriod = EDesignationPeriod.q3;
                    console.log("startDate q3 - ", doSubmitParam.startDate);
                    console.log("endDate q3 - ", doSubmitParam.endDate);
                    break;
                case "q4":
                    doSubmitParam.startDate = Datetime.DateToZero(new Date(Datetime.Q4StartDate()));
                    doSubmitParam.endDate = Datetime.DateToZero(new Date(Datetime.Q4EndDate()));
                    designationPeriod = EDesignationPeriod.q4;
                    console.log("startDate q4 - ", doSubmitParam.startDate);
                    console.log("endDate q4 - ", doSubmitParam.endDate);
                    break;
                case "thisYear":
                    doSubmitParam.startDate = Datetime.DateToZero(new Date(Datetime.ThisYearStartDate()));
                    doSubmitParam.endDate = Datetime.DateToZero(new Date(Datetime.ThisYearEndDate()));
                    designationPeriod = EDesignationPeriod.thisYear;
                    console.log(
                        "startDate thisYear - ",
                        doSubmitParam.startDate
                    );
                    console.log("endDate thisYear - ", doSubmitParam.endDate);
                    break;
            }
        }

        // console.log(' - ', doSubmitParam); return false;

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
                 * @uiHidden - ${
                        this.selectAllTags === EIfAllSelected.all
                            ? "true"
                            : "false"
                        }
                 */
                tagIds: any;



                /**
                 * @uiColumnGroup - tag
                 */
                 tag1?: any;

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
Vue.component("filter-condition-vip-and-blacklist", FilterConditionVIPAndBlacklist);
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
