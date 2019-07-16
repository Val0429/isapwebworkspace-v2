<template>
    <div>
        <iv-card
            v-show="pageStep === ePageStep.none"
            :visible="true"
            :label="_('w_ReportFilterConditionComponent_')"
        >
            <iv-form
                :interface="IFilterConditionForm()"
                @update:*="tempSaveInputData($event)"
                @submit="doSubmit($event)"
            >

                <template #ifAllSites="{ $attrs, $listeners }">
                    <b-form-radio-group
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="selectAllSites"
                        class="h-25 select_date_button mb-3"
                        buttons
                        button-variant="outline-success"
                        name="radio-btn-outline"
                        :options="ifAllSitesSelectItem"
                        @change="changeAllSitesSelect"
                    ></b-form-radio-group>
                </template>

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
                            v-if="selectAllSites === 'select'"
                            @click="pageToChooseTree"
                        >
                            {{ _('w_SelectSiteTree') }}
                        </b-button>
                    </div>
                </template>

                <template #selectPeriodAddWay="{ $attrs, $listeners }">
                    <b-form-radio-group
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="selectPeriodAddWay"
                        class="h-25 select_date_button"
                        buttons
                        button-variant="outline-success"
                        name="radio-btn-outline"
                        :options="addPeriodSelectItem"
                        @change="changeAddPeriodSelect"
                    ></b-form-radio-group>
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
            v-if="pageStep === ePageStep.chooseTree && selectAllSites === 'select'"
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
export class FilterConditionCampaign extends Vue {
    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: {}
    })
    sitesSelectItem: object;

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

    // date 相關
    selectPeriodAddWay: string = EAddPeriodSelect.period;

    addPeriodSelectItem: any = [];

    designationPeriodSelectItem: any = [];

    inputFormData: any = {
        date: '',
        campaignIds: [],
        siteIds: [],
    };

    created() {
    }

    mounted() {
        this.initTemplate();
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
                break;
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
            firstSiteId: '',
            siteIds: [],
            tagIds:this.inputFormData.tagIds === [] ? [] : this.inputFormData.tagIds,
        };

        let designationPeriod: EDesignationPeriod = EDesignationPeriod.none;

        if (this.inputFormData.siteIds.length === 0) {
            Dialog.error(this._("w_PleaseSelectSites"));
            return false;
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
                    doSubmitParam.startDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(0)));
                    doSubmitParam.endDate = Datetime.DateToZero(new Date( Datetime.CountDateNumber(0)));
                    doSubmitParam.type = ETimeMode.hour;
                    designationPeriod = EDesignationPeriod.today;
                    console.log("startDate today - ", doSubmitParam.startDate);
                    console.log("endDate today - ", doSubmitParam.endDate);
                    break;
                case "yesterday":
                    doSubmitParam.startDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(-1)));
                    doSubmitParam.endDate = Datetime.DateToZero(new Date(Datetime.CountDateNumber(-1)));
                    doSubmitParam.type = ETimeMode.hour;
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
                    doSubmitParam.type = ETimeMode.day;
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
                    doSubmitParam.type = ETimeMode.day;
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
                    doSubmitParam.type = ETimeMode.day;
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
                    doSubmitParam.type = ETimeMode.day;
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
                    doSubmitParam.type = ETimeMode.day;
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
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.q1;
                    console.log("startDate q1 - ", doSubmitParam.startDate);
                    console.log("endDate q1 - ", doSubmitParam.endDate);
                    break;
                case "q2":
                    doSubmitParam.startDate = Datetime.DateToZero(new Date(Datetime.Q2StartDate()));
                    doSubmitParam.endDate = Datetime.DateToZero(new Date(Datetime.Q2EndDate()));
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.q2;
                    console.log("startDate q2 - ", doSubmitParam.startDate);
                    console.log("endDate q2 - ", doSubmitParam.endDate);
                    break;
                case "q3":
                    doSubmitParam.startDate = Datetime.DateToZero(new Date(Datetime.Q3StartDate()));
                    doSubmitParam.endDate = Datetime.DateToZero(new Date(Datetime.Q3EndDate()));
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.q3;
                    console.log("startDate q3 - ", doSubmitParam.startDate);
                    console.log("endDate q3 - ", doSubmitParam.endDate);
                    break;
                case "q4":
                    doSubmitParam.startDate = Datetime.DateToZero(new Date(Datetime.Q4StartDate()));
                    doSubmitParam.endDate = Datetime.DateToZero(new Date(Datetime.Q4EndDate()));
                    doSubmitParam.type = ETimeMode.day;
                    designationPeriod = EDesignationPeriod.q4;
                    console.log("startDate q4 - ", doSubmitParam.startDate);
                    console.log("endDate q4 - ", doSubmitParam.endDate);
                    break;
                case "thisYear":
                    doSubmitParam.startDate = Datetime.DateToZero(new Date(Datetime.ThisYearStartDate()));
                    doSubmitParam.endDate = Datetime.DateToZero(new Date(Datetime.ThisYearEndDate()));
                    doSubmitParam.type = ETimeMode.day;
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

        this.$emit("submit-data", doSubmitParam, designationPeriod);
    }

    doReset() {
        this.inputFormData = {
            date: '',
            campaignIds: [],
            siteIds: [],
        };

    }

    IFilterConditionForm() {
        return `
            interface {


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 * @uiColumnGroup - site
                 */
                date: ${toEnumInterface(this.sitesSelectItem as any, false)};



                /**
                 * @uiLabel - ${this._("w_Sites")}
                 * @uiColumnGroup - site
                 */
                campaignIds: ${toEnumInterface(this.sitesSelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 * @uiColumnGroup - site
                 */
                siteIds: ${toEnumInterface(this.sitesSelectItem as any, false)};


            }
        `;
    }
}

export default FilterConditionCampaign;
Vue.component("filter-condition-campaign", FilterConditionCampaign);
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
