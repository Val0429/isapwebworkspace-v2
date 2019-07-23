<template>
    <div>
        <iv-card
            :visible="true"
            :label="_('w_ReportFilterConditionComponent_')"
        >
            <iv-form
                :interface="IFilterConditionForm()"
                @update:*="tempSaveInputData($event)"
                @submit="doSubmit($event)"
            >

                <template #year="{ $attrs, $listeners }">
                    <iv-form-selection
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.year"
                    >
                    </iv-form-selection>
                </template>



                <template #campaignIds="{ $attrs, $listeners }">
                    <iv-form-selection
                        v-if="inputFormData.campaignIds && checkObjectLength(campaignSelectItem) > 1"
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.campaignIds"
                    >
                    </iv-form-selection>
                </template>


                <template #confirm="{ $attrs, $listeners }">

                    <div class="ml-3 select_report_period_button mr-5">
                        <b-button
                            variant="outline-secondary"
                            @click="confirmCampaign">
                            {{ _('w_Confirm') }}
                        </b-button>
                    </div>
                </template>

                <template #siteIds="{ $attrs, $listeners }">
                    <iv-form-selection
                        v-if="inputFormData.siteIds && checkObjectLength(campaignSiteSelectItem) > 1"
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.siteIds"
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
import ReportService from "@/components/Reports/models/ReportService";

@Component({
    components: {}
})

export class FilterConditionCampaign extends Vue {
    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: {}
    })
    yearSelectItem: object;

    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: {}
    })
    campaignAllData: object;

    // @Prop({
    //     type: Object, // Boolean, Number, String, Array, Object
    //     default: {}
    // })
    // campaignSelectItem: object;
    //
    // @Prop({
    //     type: Object, // Boolean, Number, String, Array, Object
    //     default: {}
    // })
    // campaignSiteSelectItem: object;

    @Prop({
        type: Object,
        default: null
    })
    templateItem: ITemplateItem | null;

    inputFormData: any = {
        year: '',
        campaignIds: '',
        siteIds: '',
    };

    campaignSelectItem: any = {};
    campaignSiteSelectItem: any = {};

    // 收合card控制
    visible: boolean = true;

    created() {
        // this.initSelect();
    }

    mounted() {
        // this.initTemplate();
    }

    tempSaveInputData(data) {
        switch (data.key) {
            case "year":
                this.inputFormData.year = data.value;

                if (this.inputFormData.year) {
                    let tempCampaignSelectItem = { all: this._('w_AllCampaign')};
                    for (const year in this.campaignAllData) {
                        if (this.inputFormData.year === year) {
                            const tempYearCampaign = this.campaignAllData[year];
                            for (const campaignKey of tempYearCampaign) {
                                tempCampaignSelectItem[campaignKey.objectId] = campaignKey.name;
                            }
                        }
                    }
                    this.campaignSelectItem = tempCampaignSelectItem;
                    this.inputFormData.campaignIds = 'all';
                    this.campaignSiteSelectItem = {};
                } else {
                    this.inputFormData.campaignIds = '';
                    this.campaignSelectItem = {};
                    this.campaignSiteSelectItem = {};
                }

                break;
            case "campaignIds":
                this.inputFormData.campaignIds = data.value;

                if (this.inputFormData.campaignIds) {
                    let tempCampaignSiteSelectItem = { all: this._('w_AllSites')};
                    for (const year in this.campaignAllData) {
                        const tempYearCampaign = this.campaignAllData[year];
                        if (tempYearCampaign.length > 0) {
                            tempYearCampaign.map(campaign => {
                                if (campaign.objectId === this.inputFormData.campaignIds) {
                                    if (campaign.sites.length > 0) {
                                        campaign.sites.map(item => {
                                            tempCampaignSiteSelectItem[item.objectId] = item.name;
                                        });
                                    }
                                }
                            })
                        }
                    }
                    this.campaignSiteSelectItem = tempCampaignSiteSelectItem;
                    this.inputFormData.siteIds = 'all';
                } else if (this.inputFormData.campaignIds && this.inputFormData.campaignIds === 'all') {
                    this.inputFormData.campaignIds = '';
                    this.campaignSiteSelectItem = {};
                } else {
                    this.inputFormData.campaignIds = 'all';
                    this.campaignSiteSelectItem = {};
                }

                break;
                case "siteIds":
                    this.inputFormData.siteIds = data.value;

                    if (!this.inputFormData.siteIds) {
                        this.inputFormData.siteIds = 'all';
                    }
                break;

        }
    }

    checkObjectLength(obj: object): number {
        const result = Object.keys(obj);
        return result.length;
    }

    // initTemplate() {
    //     if (this.templateItem != null) {
    //         if (this.templateItem.type != undefined) {
    //             this.inputFormData.type = this.templateItem.type;
    //         }
    //
    //         if (this.templateItem.sites != undefined) {
    //             for (let site of this.templateItem.sites) {
    //                 this.inputFormData.siteIds.push(site.objectId);
    //             }
    //         }
    //
    //         if (this.templateItem.tags != undefined) {
    //             for (let tag of this.templateItem.tags) {
    //                 this.inputFormData.tagIds.push(tag.objectId);
    //             }
    //         }
    //
    //         // Select Report Period
    //         if (
    //             this.templateItem.type &&
    //             !this.templateItem.startDate &&
    //             !this.templateItem.endDate
    //         ) {
    //             this.selectPeriodAddWay = EAddPeriodSelect.designation;
    //             this.inputFormData.designationPeriod = this.templateItem.type;
    //         }
    //
    //         if (
    //             !this.templateItem.type &&
    //             this.templateItem.startDate &&
    //             this.templateItem.endDate
    //         ) {
    //             this.selectPeriodAddWay = EAddPeriodSelect.period;
    //             this.inputFormData.startDate = this.templateItem.startDate;
    //             this.inputFormData.endDate = this.templateItem.endDate;
    //         }
    //
    //         this.doSubmit();
    //     }
    // }

    async confirmCampaign() {
        this.$emit('year-campaign', this.inputFormData.year, this.inputFormData.campaignIds)
    }

    async doSubmit() {
        const doSubmitParam: {
            year: number;
            campaignIds: string[];
            siteIds: string[];

        } = {
            year: parseInt(this.inputFormData.year),
            campaignIds: [],
            siteIds: [],
        };


        if (this.inputFormData.year) {
            for (const year in this.campaignAllData) {
                if (this.inputFormData.year === year) {
                    const tempYearCampaign = this.campaignAllData[year];

                    // all campaigns
                    if (this.inputFormData.campaignIds === 'all') {
                        for (const campaignKey of tempYearCampaign) {
                            doSubmitParam.campaignIds.push(campaignKey.objectId)
                        }
                    } else {

                        // one campaigns
                        doSubmitParam.campaignIds.push(this.inputFormData.campaignIds);

                        // all sites
                        if (this.inputFormData.siteIds === 'all') {
                            if (tempYearCampaign.length > 0) {
                                tempYearCampaign.map(campaign => {
                                    if (campaign.objectId === this.inputFormData.campaignIds) {
                                        if (campaign.sites.length > 0) {
                                            campaign.sites.map(item => {
                                                doSubmitParam.siteIds.push(item.objectId)
                                            });
                                        }
                                    }
                                })
                            }
                        } else {
                            // one sites
                            doSubmitParam.siteIds.push(this.inputFormData.siteIds);
                        }
                    }
                }
            }
        }

        this.visible = false;
        this.$emit("submit-data", doSubmitParam);
    }

    doReset() {
        this.inputFormData = {
            year: '',
            campaignIds: '',
            siteIds: '',
        };

    }

    IFilterConditionForm() {
        return `
            interface {


                /**
                 * @uiLabel - ${this._("w_BOCampaign_FiscalYear")}
                 * @uiColumnGroup - site
                 */
                year: ${toEnumInterface(this.yearSelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_BOCampaign_EventName")}
                 * @uiColumnGroup - site
                 */
                campaignIds: ${toEnumInterface(this.campaignSelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 * @uiColumnGroup - site
                 */
                siteIds?: ${toEnumInterface(this.campaignSiteSelectItem as any, false)};


            }
        `;
    }
}

//                  * @uiHidden - ${ReportService.CheckObjectIfEmpty(this.campaignSiteSelectItem)}


export default FilterConditionCampaign;
Vue.component("filter-condition-campaign", FilterConditionCampaign);
</script>

<style lang="scss" scoped>
.select_report_period_button {
    margin-top: 28px;
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
