<template>
    <div>
        <iv-auto-card
            v-show="pageStep === ePageStep.none"
            :visible="true"
            :label="_('w_ReportFilterConditionComponent_')"
        >
            <iv-form :interface="IFilterConditionForm()">

                <template #selectTree="{ $attrs, $listeners }">

                    <div class="ml-3 select_report_period_button">
                        <b-button @click="pageToChooseTree">
                            {{ _('w_SelectSiteTree') }}
                        </b-button>
                    </div>
                </template>

                <template #ReportPeriodTitle="{ $attrs, $listeners }">
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

            </iv-form>
        </iv-auto-card>

        <!-- region tree select -->
        <!--             "
 -->
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
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import {
    ERegionType,
    RegionTreeItem,
    IRegionTreeSelected
} from "@/components/RegionTree/models";
import { RegionTreeSelect } from "@/components/RegionTree/RegionTreeSelect.vue";
import RegionAPI from "@/services/RegionAPI";
import ResponseFilter from "@/services/ResponseFilter";

enum EPageStep {
    none = "none",
    showResult = "showResult",
    chooseTree = "chooseTree"
}

enum EAddPeriodSelect {
    period = "period",
    designation = "designation"
}

enum EDesignationPeriod {
    today = "Today",
    yesterday = "Yesterday",
    last7days = "Last 7 days",
    thisWeek = "This Week",
    lastWeek = "Last Week",
    thisMonth = "This Month",
    lastMonth = "Last Month",
    q1 = "Q1",
    q2 = "Q2",
    q3 = "Q3",
    q4 = "Q4",
    thisYear = "This Year"
}

@Component({
    components: {}
})
export class FilterCondition extends Vue {
    // Prop
    // @Prop({
    //     type: String, // Boolean, Number, String, Array, Object
    //     default: "000"
    // })
    // label: string;

    // @Prop({
    //     type: Object, // Boolean, Number, String, Array, Object
    //     default: ""
    // })
    // filterData: object;

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

    // Model
    @Model("model", {
        type: String,
        default: ""
    })
    value: string;

    inputData = "Test input data";
    modelData = "";

    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;

    siteIds: any = [];

    // tree 相關
    selectType = ERegionType.site;
    selecteds: IRegionTreeSelected[] = [];

    // date 相關
    selectPeriodAddWay: string = EAddPeriodSelect.period;

    addPeriodSelectItem: any = [
        { value: EAddPeriodSelect.period, text: EAddPeriodSelect.period },
        {
            value: EAddPeriodSelect.designation,
            text: EAddPeriodSelect.designation
        }
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
        thisYear: EDesignationPeriod.thisYear
    };

    created() {
    }

    async mounted() {
        this.start();
        this.modelData = this.value;
    }

    start() {
        this.$emit("input", this.inputData);
    }

    putModel() {
        this.$emit("model", this.modelData);
    }



    async pageToChooseTree() {
        this.pageStep = EPageStep.chooseTree;
        console.log('son pageStep - ',  this.pageStep);
        this.selecteds = [];
        for (const id of this.siteIds) {
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

        this.$emit("page-to-choose-tree", this.pageStep);

    }

    pageToShowResult() {
        this.pageStep = EPageStep.none;
        // siteIds clear
        this.siteIds = [];

        // from selecteds push siteIds
        for (const item of this.selecteds) {
            this.siteIds.push(item.objectId);
        }
    }

    changeAddPeriodSelect(selected: string) {
        this.selectPeriodAddWay = selected;
    }

    IFilterConditionForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Sites")}
                 * @uiColumnGroup - site
                 */
                siteIds?: ${toEnumInterface(this.sitesSelectItem as any, true)};


                /**
                 * @uiColumnGroup - site
                 */
                 selectTree?: any;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_ReportPeriod1")}
                 * @uiColumnGroup - date
                 */
                 selectPeriodAddWay?: any;


                /**
                * @uiLabel - ${this._("w_BOCampaign_StartDate")}
                * @uiPlaceHolder - ${this._("w_BOCampaign_StartDate")}
                * @uiColumnGroup - date
                * @uiType - iv-form-date
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
                * @uiColumnGroup - date
                * @uiType - iv-form-date
                * @uiHidden - ${
                    this.selectPeriodAddWay === EAddPeriodSelect.designation
                        ? "true"
                        : "false"
                }
                 */
                endDate?: any;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_DesignationPeriod")}
                 * @uiColumnGroup - date
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


                /**
                 * @uiColumnGroup - tag
                 */
                 tag1?: any;
            }
        `;
    }
}

export default FilterCondition;
Vue.component("filter_condition", FilterCondition);
</script>

<style lang="scss" scoped>
.select_report_period_button {
    margin-top: 27px;
}

.select_date_button {
    margin-top: 29px;
}
</style>
