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
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import {
    ERegionType,
    RegionTreeItem,
    IRegionTreeSelected
} from "@/components/RegionTree";
import { RegionTreeSelect } from "@/components/RegionTree/RegionTreeSelect.vue";
import {
    EAddPeriodSelect,
    ECountType,
    EDesignationPeriod, EIfAllSelected
} from "@/components/Reports/models/EReport";
import RegionAPI from "@/services/RegionAPI";
import ResponseFilter from "@/services/ResponseFilter";
import Datetime from "@/services/Datetime";
import Dialog from "@/services/Dialog/Dialog";

enum EPageStep {
    none = "none",
    showResult = "showResult",
    chooseTree = "chooseTree",
    select = "select",
    all = "all",
}

@Component({
    components: {}
})
export class FilterCondition extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;

    // site 相關
    selectAllSites: string = EIfAllSelected.select;
    ifAllSitesSelectItem: any = [];

    // select 相關
    sitesSelectItem: any = {};
    tagSelectItem: any = {};

    // tree
    selectType = ERegionType.site;
    regionTreeItem = new RegionTreeItem();
    selecteds: IRegionTreeSelected[] = [];

    // date 相關
    selectPeriodAddWay: string = EAddPeriodSelect.period;

    addPeriodSelectItem: any = [];

    designationPeriodSelectItem: any = [];

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

    isMounted: boolean = false;

    created() {
        // this.initSelectItemSite();
        this.initSelectItem();

    }

    mounted() {
        this.initSelectItemTag();
        this.initSelectItemTree();
        this.initRegionTreeSelect();
        this.siteFilterPermission();

        this.isMounted = true;
        console.log('FC - ', );
    }

    initRegionTreeSelect() {
        this.regionTreeItem = new RegionTreeItem();
        this.regionTreeItem.titleItem.card = this._("w_SiteTreeSelect");
    }

    initSelectItem() {
        this.ifAllSitesSelectItem = [
            { value: EIfAllSelected.all, text: this._('w_AllSites')},
            { value: EIfAllSelected.select, text: this._('w_SelectSites') },
        ];

        this.addPeriodSelectItem = [
            { value: EAddPeriodSelect.period, text: this._('w_period')},
            { value: EAddPeriodSelect.designation, text: this._('w_Designation') },
        ];

        this.designationPeriodSelectItem = {
            today: this._('w_Today'),
            yesterday: this._('w_Yesterday'),
            last7days: this._('w_last7days'),
            thisWeek: this._('w_thisWeek'),
            lastWeek: this._('w_lastWeek'),
            thisMonth: this._('w_thisMonth'),
            lastMonth: this._('w_lastMonth'),
            q1: this._('w_q1'),
            q2: this._('w_q2'),
            q3: this._('w_q3'),
            q4: this._('w_q4'),
            thisYear: this._('w_thisYear'),
        };

    }

    siteFilterPermission() {
        let tempSitesSelectItem = {};
        for (const detail of this.$user.allowSites) {
            tempSitesSelectItem[detail.objectId] = detail.name;
            this.inputFormData.allSiteIds.push(detail.objectId);
        }
        this.sitesSelectItem = tempSitesSelectItem;
    }

    // async initSelectItemSite() {
    //     let tempSitesSelectItem = { all: this._("w_All") };
    //
    //     const readAllSiteParam: {
    //         type: string;
    //     } = {
    //         type: "all"
    //     };
    //
    //     await this.$server
    //         .R("/location/site/all", readAllSiteParam)
    //         .then((response: any) => {
    //             if (response != undefined) {
    //                 for (const returnValue of response) {
    //                     // 自定義 sitesSelectItem 的 key 的方式
    //                     tempSitesSelectItem[returnValue.objectId] =
    //                         returnValue.name;
    //                     this.inputFormData.allSiteIds.push(
    //                         returnValue.objectId
    //                     );
    //                 }
    //                 this.sitesSelectItem = tempSitesSelectItem;
    //             }
    //         })
    //         .catch((e: any) => {
    //             if (e.res && e.res.statusCode && e.res.statusCode == 401) {
    //                 return ResponseFilter.base(this, e);
    //             }
    //             console.log(e);
    //             return false;
    //         });
    // }

    async initSelectItemTag() {
        let tempTagSelectItem = {};
        await this.$server
            .R("/tag/all")
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response) {
                        // 自定義 tagSelectItem 的 key 的方式
                        tempTagSelectItem[returnValue.objectId] =
                            returnValue.name;
                        this.inputFormData.allTagIds.push(returnValue.objectId);
                    }
                    this.tagSelectItem = tempTagSelectItem;
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
                    this.regionTreeItem.tree = RegionAPI.analysisRegionTreeFilterSite(
                        response,
                        this.$user.allowSites
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
        this.inputFormData.designationPeriod = "today";
        this.inputFormData.startDate = new Date();
        this.inputFormData.endDate = new Date();
    }

    async doSubmit() {
        const doSubmitParam: {
            startDate?: string;
            endDate?: string;
            type?: string;
            siteIds?: [];
            tagIds?: [];
        } = {
            tagIds:
                this.inputFormData.tagIds === []
                    ? []
                    : this.inputFormData.tagIds
        };

        if (this.inputFormData.siteIds.length === 0) {
            return false;
        }

        if (this.selectAllSites === 'all') {
            this.inputFormData.siteIds = this.inputFormData.allSiteIds;
        }

        doSubmitParam.siteIds = this.inputFormData.siteIds;

        // 選擇 period
        if (this.selectPeriodAddWay === 'period') {
            if (
                Datetime.CheckDate(
                    Datetime.DateTime2String(this.inputFormData.startDate, 'YYYY-MM-DD'),
                    Datetime.DateTime2String(this.inputFormData.endDate,  'YYYY-MM-DD')
                )
            ) {
                Dialog.error(this._("w_ReportDateError"));
                this.inputFormData.startDate = new Date();
                this.inputFormData.endDate = new Date();
                return false;
            }

            if (
                Datetime.CheckTheSameDate(
                    Datetime.DateTime2String(this.inputFormData.startDate, 'YYYY-MM-DD'),
                    Datetime.DateTime2String(this.inputFormData.endDate, 'YYYY-MM-DD')
                )
            ) {
                doSubmitParam.startDate = this.inputFormData.startDate.toISOString();
                doSubmitParam.endDate = this.inputFormData.endDate.toISOString();
                doSubmitParam.type = ECountType.hour;
            } else {
                doSubmitParam.startDate = this.inputFormData.startDate.toISOString();
                doSubmitParam.endDate = this.inputFormData.endDate.toISOString();
                doSubmitParam.type = ECountType.day;
            }

            // 選擇 designation
        } else if (this.selectPeriodAddWay === 'designation') {
            switch (this.inputFormData.designationPeriod) {
                case "today":
                    doSubmitParam.startDate = new Date(Datetime.CountDateNumber(0)).toISOString();
                    doSubmitParam.endDate = new Date(Datetime.CountDateNumber(0)).toISOString();
                    doSubmitParam.type = ECountType.hour;
                    console.log("startDate today - ", doSubmitParam.startDate);
                    console.log("endDate today - ", doSubmitParam.endDate);
                    break;
                case "yesterday":
                    doSubmitParam.startDate = new Date(Datetime.CountDateNumber(-1)).toISOString();
                    doSubmitParam.endDate = new Date(Datetime.CountDateNumber(-1)).toISOString();
                    doSubmitParam.type = ECountType.hour;
                    console.log(
                        "startDate yesterday - ",
                        doSubmitParam.startDate
                    );
                    console.log("endDate yesterday - ", doSubmitParam.endDate);
                    break;
                case "last7days":
                    doSubmitParam.startDate = new Date(Datetime.CountDateNumber(-6)).toISOString();
                    doSubmitParam.endDate = new Date(Datetime.CountDateNumber(0)).toISOString();
                    doSubmitParam.type = ECountType.day;
                    console.log(
                        "startDate last7days - ",
                        doSubmitParam.startDate
                    );
                    console.log("endDate last7days - ", doSubmitParam.endDate);
                    break;
                case "thisWeek":
                    doSubmitParam.startDate = new Date(Datetime.ThisWeekStartDate()).toISOString();
                    doSubmitParam.endDate = new Date(Datetime.ThisWeekEndDate()).toISOString();
                    doSubmitParam.type = ECountType.day;
                    console.log(
                        "startDate thisWeek - ",
                        doSubmitParam.startDate
                    );
                    console.log("endDate thisWeek - ", doSubmitParam.endDate);
                    break;
                case "lastWeek":
                    doSubmitParam.startDate = new Date(Datetime.LastWeekStartDate()).toISOString();
                    doSubmitParam.endDate = new Date(Datetime.LastWeekEndDate()).toISOString();
                    doSubmitParam.type = ECountType.day;
                    console.log(
                        "startDate lastWeek - ",
                        doSubmitParam.startDate
                    );
                    console.log("endDate lastWeek - ", doSubmitParam.endDate);
                    break;
                case "thisMonth":
                    doSubmitParam.startDate = new Date(Datetime.ThisMonthStartDate()).toISOString();
                    doSubmitParam.endDate = new Date(Datetime.ThisMonthEndDate()).toISOString();
                    doSubmitParam.type = ECountType.day;
                    console.log(
                        "startDate thisMonth - ",
                        doSubmitParam.startDate
                    );
                    console.log("endDate thisMonth - ", doSubmitParam.endDate);
                    break;
                case "lastMonth":
                    doSubmitParam.startDate = new Date(Datetime.LastMonthStartDate()).toISOString();
                    doSubmitParam.endDate = new Date(Datetime.LastMonthEndDate()).toISOString();
                    doSubmitParam.type = ECountType.day;
                    console.log(
                        "startDate lastMonth - ",
                        doSubmitParam.startDate
                    );
                    console.log("endDate lastMonth - ", doSubmitParam.endDate);
                    break;
                case "q1":
                    doSubmitParam.startDate = new Date(Datetime.Q1StartDate()).toISOString();
                    doSubmitParam.endDate = new Date(Datetime.Q1EndDate()).toISOString();
                    doSubmitParam.type = ECountType.day;
                    console.log("startDate q1 - ", doSubmitParam.startDate);
                    console.log("endDate q1 - ", doSubmitParam.endDate);
                    break;
                case "q2":
                    doSubmitParam.startDate = new Date(Datetime.Q2StartDate()).toISOString();
                    doSubmitParam.endDate = new Date(Datetime.Q2EndDate()).toISOString();
                    doSubmitParam.type = ECountType.day;
                    console.log("startDate q2 - ", doSubmitParam.startDate);
                    console.log("endDate q2 - ", doSubmitParam.endDate);
                    break;
                case "q3":
                    doSubmitParam.startDate = new Date(Datetime.Q3StartDate()).toISOString();
                    doSubmitParam.endDate = new Date(Datetime.Q3EndDate()).toISOString();
                    doSubmitParam.type = ECountType.day;
                    console.log("startDate q3 - ", doSubmitParam.startDate);
                    console.log("endDate q3 - ", doSubmitParam.endDate);
                    break;
                case "q4":
                    doSubmitParam.startDate = new Date(Datetime.Q4StartDate()).toISOString();
                    doSubmitParam.endDate = new Date(Datetime.Q4EndDate()).toISOString();
                    doSubmitParam.type = ECountType.day;
                    console.log("startDate q4 - ", doSubmitParam.startDate);
                    console.log("endDate q4 - ", doSubmitParam.endDate);
                    break;
                case "thisYear":
                    doSubmitParam.startDate = new Date(Datetime.ThisYearStartDate()).toISOString();
                    doSubmitParam.endDate = (new Date(Datetime.ThisYearEndDate())).toISOString();
                    doSubmitParam.type = ECountType.day;
                    console.log(
                        "startDate thisYear - ",
                        doSubmitParam.startDate
                    );
                    console.log("endDate thisYear - ", doSubmitParam.endDate);
                    break;
            }
        }

        // console.log(' - ', doSubmitParam); return false;

        await this.$server
            .C("/report/people-counting/summary", doSubmitParam)
            .then((response: any) => {
                if (response !== undefined) {
                    this.responseData = response;
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });

        this.$emit("submit-data", doSubmitParam, this.responseData);
    }

    doReset() {
        this.inputFormData = {
            siteIds: [],
            tagIds: [],
            startDate: new Date(),
            endDate: new Date(),
            designationPeriod: "today"
        };
    }

    IFilterConditionForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_ReportTemplate_ReportPeriod1")}
                 * @uiColumnGroup - site
                 */
                 ifAllSites?: any;


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 * @uiColumnGroup - site
                 * @uiHidden - ${
                        this.selectAllSites === EIfAllSelected.all
                            ? "true"
                            : "false"
                        }
                 */
                siteIds: ${toEnumInterface(this.sitesSelectItem as any, true)};


                /**
                 * @uiColumnGroup - site
                 * @uiHidden - ${
                        this.selectAllSites === EIfAllSelected.all
                            ? "true"
                            : "false"
                        }
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
                    this.selectPeriodAddWay ===  EAddPeriodSelect.designation
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
