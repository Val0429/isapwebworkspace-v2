<template>
    <div class="animated fadeIn">

        <view-ptw
            :selectedDetail="selectedDetail"></view-ptw>

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <div
                key="transition_1"
                v-show="transition.step === 1"
            >

                <search-condition
                    @submit-data="receiveSearchConditionData"
                ></search-condition>

                <iv-card
                    key="transition_1"
                    v-show="transition.step === 1"
                    :label=" _('w_Invitation_List') "
                >
                    <template #toolbox>

                        <iv-toolbox-view
                            :disabled="isSelected.length !== 1"
                            @click="pageToView"
                        />
                        <iv-toolbox-divider />
                        <iv-toolbox-add @click="pageToAdd" />

                    </template>

                    <iv-table
                        ref="listTable"
                        :interface="ITableList()"
                        :multiple="tableMultiple"
                        :server="{ path: '/partner/cms' }"
                        @selected="selectedItem($event)"
                    >
                        <template #Actions="{$attrs, $listeners}">

                            <iv-toolbox-more :disabled="isSelected.length !== 1">
                                <iv-toolbox-view @click="pageToView" />
                            </iv-toolbox-more>
                        </template>

                    </iv-table>
                </iv-card>

            </div>

            <div
                key="transition_2"
                v-show="transition.step === 2"
            >
                <add-ptw @add-ptw-back-to-list="addPTWToList"></add-ptw>
            </div>

            <div
                key="transition_3"
                v-show="transition.step === 3"
            >
            </div>

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import SearchCondition from "./SearchCondition.vue";
import AddPTW from "./AddPTW.vue";
import ViewPTW from "./ViewPTW.vue";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";
import Loading from '@/services/Loading';
import ResponseFilter from '@/services/ResponseFilter';
import Datetime from '@/services/Datetime';

@Component({
    components: { SearchCondition, AddPTW, ViewPTW }
})
export default class Invitation extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    // table相關
    path: string = "";
    isSelected: any = [];
    tableMultiple: boolean = true;
    selectedDetail: any = {};

    // api 回來資料
    responseData: any = {};

    inputFormData: any = {
        objectId: '',
        name: '',
        email: '',
        tenant: '',
        workDescription: ''
    };

    created() {}

    mounted() {}

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = {};
        this.selectedDetail = data;
    }

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
    }

    pageToAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
    }

    pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        // TODO: 7steps
    }


    async receiveSearchConditionData(searchConditionData: any) {

        let param = JSON.parse(JSON.stringify(searchConditionData));

        // TODO: wait api
        // Loading.show();
        // await this.$server
        //     .R("/", param)
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(this, response, (response: any) => {
        //             this.responseData = response;
        //         });
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.catchError(this, e);
        //     });
    }

    async addPTWToList(addPTWParam: object) {
        this.inputFormData = addPTWParam;

        // TODO: wait api
        // const datas =  [];
        //
        // const addParam = {
        //     datas
        // };
        //
        // Loading.show();
        // await this.$server
        //     .C("/", addParam)
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(
        //             this,
        //             response,
        //             (response: any) => {
        //                 Dialog.success(this._("w_Dialog_SuccessTitle"));
        //                 this.pageToList();
        //             },
        //             this._("w_Dialog_ErrorTitle")
        //         );
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.catchError(
        //             this,
        //             e,
        //             this._("")
        //         );
        //     });
    }

    dateToYYYY_MM_DD(value) {
        return Datetime.DateTime2String(new Date(value), "YYYY-MM-DD");
    }

    ITableList() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_PTWID")}
                 */
                ptwId: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_PTWStatus")}
                 */
                ptwStatus: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Email")}
                 */
                email: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Tenant")}
                 */
                tenant: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Unit")}
                 */
                unit: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_WorkCategory")}
                 */
                workCategory: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_StartDate")}
                 */
                startDate: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_EndDate")}
                 */
                endDate: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_ContractorCompany")}
                 */
                contractor: string;

                Actions: any


            }`;
    }

    IAddForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_PTWID")}
                 */
                ptwId: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_PTWStatus")}
                 */
                ptwStatus: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Email")}
                 */
                email: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Tenant")}
                 */
                tenant: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Unit")}
                 */
                unit: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_WorkCategory")}
                 */
                workCategory: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_StartDate")}
                 */
                startDate: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_EndDate")}
                 */
                endDate: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_ContractorCompany")}
                 */
                contractor: string;

                Actions: any


            }`;
    }

}
</script>

<style lang="scss" scoped>
</style>




