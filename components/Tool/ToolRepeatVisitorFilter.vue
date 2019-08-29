<template>
    <div>
        <iv-auto-card
            :visible="visible"
            :label="_('w_ReportFilterConditionComponent_')"
        >
            <iv-form
                :interface="IFilterConditionForm()"
                :value="inputFormData"
                @update:*="updateInputFormData($event)"
                @submit="doSubmit($event)"
            >

            </iv-form>

<!--            <template #footer>-->
<!--                <b-button-->
<!--                    class="submit"-->
<!--                    size="lg"-->
<!--                    @click="doSubmit"-->
<!--                >-->
<!--                    {{ _('wb_Submit') }}-->
<!--                </b-button>-->

<!--                <b-button-->
<!--                    class="reset"-->
<!--                    size="lg"-->
<!--                    @click="doReset"-->
<!--                >-->
<!--                    {{ _('wb_Reset') }}-->
<!--                </b-button>-->
<!--            </template>-->

        </iv-auto-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import { toEnumInterface } from "../../../core";
import Loading from '@/services/Loading';
import ResponseFilter from '@/services/ResponseFilter';
import Dialog from '@/services/Dialog';
import { IRepeatVisitorFilter } from './ITool';
import Datetime from '@/services/Datetime';

@Component({
    components: {}
})
export class ToolRepeatVisitorFilter extends Vue {

    siteSelectItem: any = {};

    // 收合card控制
    visible: boolean = true;

    inputFormData: IRepeatVisitorFilter = {
        siteIds: [],
        startDate: new Date(),
        endDate: new Date(),
    };

    created() {
        this.initSelectItemSite();
    }

    mounted() {
    }

    async initSelectItemSite() {

        this.siteSelectItem = {};
        let tempSiteSelectItem = {};

        const readAllSiteParam: {
            type: string;
            paging: object;
        } = {
            type: "all",
            paging: { all: true }
        };

        await this.$server
            .R("/location/site/all", readAllSiteParam)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response) {
                        tempSiteSelectItem[returnValue.objectId] = returnValue.name;
                    }
                    this.siteSelectItem = tempSiteSelectItem;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    updateInputFormData(data) {
        switch (data.key) {
            case 'siteIds':
                this.inputFormData.siteIds = data.value;
                break;
            case 'startDate':
                if (!Datetime.CheckDate(Datetime.DateStart(data.value), Datetime.DateStart(new Date(this.inputFormData.endDate)))) {
                    Dialog.error(this._("w_ReportDateError"));
                    return false;
                }
                this.inputFormData.startDate = data.value;
                break;
            case 'endDate':
                if (!Datetime.CheckDate(Datetime.DateStart(new Date(this.inputFormData.startDate)), Datetime.DateStart(data.value))) {
                    Dialog.error(this._("w_ReportDateError"));
                    return false;
                }
                this.inputFormData.endDate = data.value;
                break;
        }
    }

    async doSubmit(data) {

        const submitParam: IRepeatVisitorFilter = {
            siteIds: data.siteIds,
            startDate: data.startDate,
            endDate: data.endDate,
        };

        if (!Datetime.CheckDate(data.startDate, data.endDate)) {
            Dialog.error(this._("w_ReportDateError"));
            this.inputFormData.startDate = new Date();
            this.inputFormData.endDate = new Date();
            return false;
        } if (Datetime.DateStart(data.endDate).getTime() === Datetime.DateStart(data.startDate).getTime()) {
            submitParam.startDate = Datetime.DateStart(data.startDate).toISOString();
            submitParam.endDate = Datetime.DateEnd(data.endDate).toISOString();
        } else {
            submitParam.startDate = Datetime.DateStart(data.startDate).toISOString();
            submitParam.endDate = Datetime.DateStart(data.endDate).toISOString();
        }
        
        this.visible = false;
        this.$emit('filter', submitParam)
    }

    IFilterConditionForm() {
        return `
            interface {


                /**
                 * @uiLabel - ${this._("w_Sites")}
                * @uiColumnGroup - row1
                 */
                siteIds: ${toEnumInterface(this.siteSelectItem as any, true)};


                /**
                * @uiLabel - ${this._("w_Startdate")}
                * @uiPlaceHolder - ${this._("w_Startdate")}
                * @uiType - iv-form-date
                * @uiColumnGroup - row1

                 */
                startDate: any;


                /**
                * @uiLabel - ${this._("w_Enddate")}
                * @uiPlaceHolder - ${this._("w_Enddate")}
                * @uiType - iv-form-date
                * @uiColumnGroup - row1
                */
                endDate: any;

            }
        `;
    }

}

export default ToolRepeatVisitorFilter;
Vue.component("tool-repeat-visitor-filter", ToolRepeatVisitorFilter);
</script>

<style lang="scss" scoped>
</style>
