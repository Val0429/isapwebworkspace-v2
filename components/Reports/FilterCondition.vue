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

                <template #siteIds="{ $attrs, $listeners }">
                    <iv-form-selection
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.siteIds">

                    </iv-form-selection>
                </template>

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

                <template #startDate="{ $attrs, $listeners }">
                    <iv-form-date
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.startDate">
                    </iv-form-date>
                </template>

                <template #endDate="{ $attrs, $listeners }">
                    <iv-form-date
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.startDate">

                    </iv-form-date>
                </template>

                <template #designationPeriod="{ $attrs, $listeners }">
                    <iv-form-selection
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.designationPeriod">
                    </iv-form-selection>
                </template>

                <template #tagIds="{ $attrs, $listeners }">
                    <iv-form-selection
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.tagIds">

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
    import DateCount from "@/components/Reports/models/dateCount";

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

        ePageStep = EPageStep;
        pageStep: EPageStep = EPageStep.none;

        // select 相關
        sitesSelectItem: any = {};
        tagSelectItem: any = {};

        // tree
        selectType = ERegionType.site;
        regionTreeItem = new RegionTreeItem();
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

        inputFormData: any = {
            siteIds: [],
            tagIds: [],
            allSiteIds: [],
            allTagIds: [],
            startDate: new Date(),
            endDate: new Date(),
            type: '',
            designationPeriod: 'today',
        };


        created() {
            this.initSelectItemSite();
            this.initSelectItemTag();
            this.initSelectItemTree();
            this.initRegionTreeSelect();
        }

        mounted() {
        }

        initRegionTreeSelect() {
            this.regionTreeItem = new RegionTreeItem();
            this.regionTreeItem.titleItem.card = this._("w_SiteTreeSelect");
        }

        async initSelectItemSite() {
            let tempSitesSelectItem = { "all": this._("w_All") };

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
                            tempSitesSelectItem[returnValue.objectId] =
                                returnValue.name;
                            this.inputFormData.allSiteIds.push(returnValue.objectId)
                        }
                        this.sitesSelectItem = tempSitesSelectItem;
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
                            this.inputFormData.allTagIds.push(returnValue.objectId)
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

        changeAddPeriodSelect(selected: string) {
            this.selectPeriodAddWay = selected;
            this.inputFormData.designationPeriod = 'today';
            this.inputFormData.startDate = new Date();
            this.inputFormData.endDate = new Date();
        }

        doSubmit() {
            // TODO: wait api


            const sendParam = {};
            // 如果沒有選擇 siteIds，則默認為全部的siteIds
            this.inputFormData.siteIds === ['all'] ? this.inputFormData.allSiteIds : this.inputFormData.siteIds;
            // this.inputFormData.tagIds === [] ? this.inputFormData.allTagIds : this.inputFormData.tagIds;

            // 選擇 period
            if(this.selectPeriodAddWay === EAddPeriodSelect.period) {
                // this.inputFormData.startDate
                // this.inputFormData.endDate

            // 選擇 designation
            } else if(this.selectPeriodAddWay === EAddPeriodSelect.designation) {

                switch (this.inputFormData.designationPeriod) {
                    case "today":
                        this.inputFormData.startDate = DateCount.getDateStr(0);
                        this.inputFormData.endDate = DateCount.getDateStr(0);
                        console.log('startDate today - ', this.inputFormData.startDate);
                        console.log('endDate today - ',this.inputFormData.endDate);
                        break;
                    case "yesterday":
                        this.inputFormData.startDate = DateCount.getDateStr(-1);
                        this.inputFormData.endDate = DateCount.getDateStr(-1);
                        console.log('startDate yesterday - ', this.inputFormData.startDate);
                        console.log('endDate yesterday - ',this.inputFormData.endDate);
                        break;
                    case "last7days":
                        this.inputFormData.startDate = DateCount.getDateStr(-6);
                        this.inputFormData.endDate = DateCount.getDateStr(0);
                        console.log('startDate last7days - ', this.inputFormData.startDate);
                        console.log('endDate last7days - ',this.inputFormData.endDate);break;
                    case "thisWeek":
                        this.inputFormData.startDate = DateCount.getWeekStartDate();
                         this.inputFormData.endDate = DateCount.getWeekEndDate();
                        console.log('startDate thisWeek - ', this.inputFormData.startDate);
                        console.log('endDate thisWeek - ',this.inputFormData.endDate);
                        break;
                    case "lastWeek":
                        this.inputFormData.startDate = DateCount.getLastWeekStartDate();
                        this.inputFormData.endDate = DateCount.getLastWeekEndDate();
                        console.log('startDate lastWeek - ', this.inputFormData.startDate);
                        console.log('endDate lastWeek - ',this.inputFormData.endDate);
                        break;
                    case "thisMonth":
                        this.inputFormData.startDate = DateCount.getMonthStartDate();
                        this.inputFormData.endDate = DateCount.getMonthEndDate();
                        console.log('startDate thisMonth - ', this.inputFormData.startDate);
                        console.log('endDate thisMonth - ',this.inputFormData.endDate);
                        break;
                    case "lastMonth":
                        this.inputFormData.startDate = DateCount.getLastMonthStartDate();
                        this.inputFormData.endDate = DateCount.getLastMonthEndDate();
                        console.log('startDate lastMonth - ', this.inputFormData.startDate);
                        console.log('endDate lastMonth - ',this.inputFormData.endDate);
                        break;
                    case "q1":
                        this.inputFormData.startDate = DateCount.getQ1StartDate();
                        this.inputFormData.endDate = DateCount.getQ1EndDate();
                        console.log('startDate q1 - ', this.inputFormData.startDate);
                        console.log('endDate q1 - ',this.inputFormData.endDate);
                        break;
                    case "q2":
                        this.inputFormData.startDate = DateCount.getQ2StartDate();
                        this.inputFormData.endDate = DateCount.getQ2EndDate();
                        console.log('startDate q2 - ', this.inputFormData.startDate);
                        console.log('endDate q2 - ',this.inputFormData.endDate);
                        break;
                    case "q3":
                        this.inputFormData.startDate = DateCount.getQ3StartDate();
                        this.inputFormData.endDate = DateCount.getQ3EndDate();
                        console.log('startDate q3 - ', this.inputFormData.startDate);
                        console.log('endDate q3 - ',this.inputFormData.endDate);
                        break;
                    case "q4":
                        this.inputFormData.startDate = DateCount.getQ4StartDate();
                        this.inputFormData.endDate = DateCount.getQ4EndDate();
                        console.log('startDate q4 - ', this.inputFormData.startDate);
                        console.log('endDate q4 - ',this.inputFormData.endDate);
                        break;
                    case "thisYear":
                        this.inputFormData.startDate = DateCount.getThisYearStartDate();
                        this.inputFormData.endDate = DateCount.getLastYearEndDate();
                        console.log('startDate thisYear - ', this.inputFormData.startDate);
                        console.log('endDate thisYear - ',this.inputFormData.endDate);
                    break;
                }

            }

            this.$emit("submit-data", this.inputFormData);
        }

        doReset() {
            this.inputFormData = {
                siteIds: [],
                tagIds: [],
                startDate: new Date(),
                endDate: new Date(),
                designationPeriod: 'today',
            };
        }

        IFilterConditionForm() {
            return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Sites")}
                 * @uiColumnGroup - site
                 */
                siteIds: ${toEnumInterface(this.sitesSelectItem as any, true)};


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
    .submit {
        background-color: #5c7895;
        border: 1px solid #5c7895;
    }
    .reset {
        background-color: #d7d7d7;
        border: 1px solid #d7d7d7;
    }

</style>
