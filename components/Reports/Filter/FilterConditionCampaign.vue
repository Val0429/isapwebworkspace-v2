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
                        v-bind="$attrs"
                        v-on="$listeners"
                        v-model="inputFormData.siteIds"
                    >
                    </iv-form-selection>
                </template>
<!--                        v-if="inputFormData.year !== '' && inputFormData.campaignIds.length === 1 && inputFormData.campaignIds !== 'all'"
-->
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

    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: {}
    })
    campaignSelectItem: object;

    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: {}
    })
    campaignSiteSelectItem: object;

    @Prop({
        type: Object,
        default: null
    })
    templateItem: ITemplateItem | null;

    inputFormData: any = {
        year: new Date().getFullYear().toString(),
        campaignIds: [],
        siteIds: [],
    };

    // 收合card控制
    visible: boolean = true;

    created() {
        console.log('campaignAllData - ', this.campaignAllData);
    }

    mounted() {
        // this.initTemplate();
        console.log('campaignSiteSelectItem - ', ReportService.CheckObjectIfEmpty(this.campaignSiteSelectItem));
    }

    tempSaveInputData(data) {
        switch (data.key) {
            case "year":
                this.inputFormData.year = data.value;
                break;
            case "siteIds":
                for (const siteId of data.value) {
                    if (!siteId) {
                        this.inputFormData.siteIds = [];
                    } else {
                        this.inputFormData.siteIds = data.value;
                    }
                }
                break;
            case "campaignIds":
                this.inputFormData.campaignIds = [];
                this.inputFormData.campaignIds.push(data.value);
                break;
        }
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
    //         console.log("!!!! templateItem:", this.templateItem);
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
            year: this.inputFormData.year,
            campaignIds: [],
            siteIds: [],
        };


        if (this.inputFormData.campaignIds === 'all') {
           // this.inputFormData.campaignIds =
        } else {
            // this.inputFormData.campaignIds =
        }

        if (this.inputFormData.siteIds === 'all') {
            // this.inputFormData.siteIds =
        } else {
            // this.inputFormData.siteIds =
        }

        // console.log(' - ', doSubmitParam); return false;

        this.visible = false;
        this.$emit("submit-data", doSubmitParam);
    }

    doReset() {
        this.inputFormData = {
            year: '',
            campaignIds: [],
            siteIds: [],
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
                 * @uiColumnGroup - site
                 */
                 confirm: any;


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 * @uiColumnGroup - site
                 * @uiHidden - ${ReportService.CheckObjectIfEmpty(this.campaignSiteSelectItem)}
                 */
                siteIds?: ${toEnumInterface(this.campaignSiteSelectItem as any, false)};


            }
        `;
    }
}

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
