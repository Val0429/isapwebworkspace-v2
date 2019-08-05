<template>
    <div>


            <iv-auto-card
                :label="_('w_Invitation_SearchCondition')"
            >
                <iv-form
                    :interface="IFilterConditionForm()"
                    :value="inputFormData"
                    @submit="doSubmit($event)"
                >

                </iv-form>

                <template #footer-before>
                    <b-button
                        variant="secondary"
                        size="lg"
                        @click="doExportData"
                    >
                        {{ _('w_Invitation_ExportData') }}
                    </b-button>

<!--                    <b-button-->
<!--                        class="submit"-->
<!--                        size="md"-->
<!--                        @click="doSubmit"-->
<!--                    >-->
<!--                        {{ _('w_Invitation_Search') }}-->
<!--                    </b-button>-->

<!--                    <b-button-->
<!--                        class="reset"-->
<!--                        size="md"-->
<!--                        @click="doReset"-->
<!--                    >-->
<!--                        {{ _('wb_Reset') }}-->
<!--                    </b-button>-->
                </template>

            </iv-auto-card>

    </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import Datetime from '@/services/Datetime';
import Dialog from '@/services/Dialog';
import ResponseFilter from '@/services/ResponseFilter';

enum EPTWStatus {
    approved = 'approved',
    pendingApproved = 'pendingApproved',
    rejected = 'rejected',
}

@Component({
    components: {}
})
export class SearchCondition extends Vue {

    // select
    ptwStatusSelectItem: any = {};
    tenantSelectItem: any = {};
    workCategorySelectItem: any = {};
    workTypeSelectItem: any = {};

    inputFormData: any = {
        startDate: new Date(),
        endDate: new Date(),
        ptwStatus: '',
        ptwId: '',
        email: '',
        tenant: '',
        workCategory: '',
        workType: '',
        unit: '',
        contactPerson: '',
        contractor: '',
        workersName: '',
    };

    created() {
        this.initSelectItem();
        this.initTenantSelectItem();
        this.initWorkCategorySelectItem();
        this.initWorkTypeSelectItem();
    }

    mounted() {}

    initSelectItem() {

        this.ptwStatusSelectItem = {
            new: this._('w_Invitation_New'),
            approved: this._('w_Invitation_Approved'),
            pendingApproved: this._('w_Invitation_PendingApproved'),
            rejected: this._('w_Invitation_Rejected'),
        }
    }

    async initTenantSelectItem() {

        this.tenantSelectItem = {};
        let tempTenantSelectItem = {};

        // TODO: wait api
        // await this.$server
        //     .R("/")
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(this, response, (response: any) => {
        //             for (const returnValue of response) {
        //                 tempTenantSelectItem[returnValue.objectId] =
        //                     returnValue.name;
        //             }
        //             this.tenantSelectItem = tempTenantSelectItem;
        //         });
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.catchError(this, e);
        //     });

    }

    async initWorkCategorySelectItem() {

        this.workCategorySelectItem = {};
        let tempWorkCategorySelectItem = {};

        // TODO: wait api
        // await this.$server
        //     .R("/")
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(this, response, (response: any) => {
        //             for (const returnValue of response) {
        //                 tempWorkCategorySelectItem[returnValue.objectId] =
        //                     returnValue.name;
        //             }
        //             this.workCategorySelectItem = tempWorkCategorySelectItem;
        //         });
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.catchError(this, e);
        //     });

    }

    async initWorkTypeSelectItem() {

        this.workTypeSelectItem = {};
        let tempWorkTypeSelectItem = {};

        // TODO: wait api
        // await this.$server
        //     .R("/")
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(this, response, (response: any) => {
        //             for (const returnValue of response) {
        //                 tempWorkTypeSelectItem[returnValue.objectId] =
        //                     returnValue.name;
        //             }
        //             this.workTypeSelectItem = tempWorkTypeSelectItem;
        //         });
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.catchError(this, e);
        //     });

    }


    async doSubmit(data) {
        const doSubmitParam: {
            startDate: Date;
            endDate: Date,
            ptwStatus: string,
            ptwId: '',
            email: '',
            tenant: '',
            workCategory: '',
            workType: '',
            unit: '',
            contactPerson: '',
            contractor: '',
            workersName: '',
        } = {
            startDate: new Date(),
            endDate: new Date(),
            ptwStatus: data.ptwStatus,
            ptwId: data.ptwId,
            email: data.email,
            tenant: data.tenant,
            workCategory: data.workCategory,
            workType: data.workType,
            unit: data.unit,
            contactPerson: data.contactPerson,
            contractor: data.contractor,
            workersName: data.workersName,
        };

        if (!Datetime.CheckDate(data.startDate, data.endDate)) {
            Dialog.error(this._("w_Invitation_DateError"));
            this.inputFormData.startDate = new Date();
            this.inputFormData.endDate = new Date();
            return false;
        }

        // email正則
        const emailRule = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+(([.\-])[A-Za-z0-9]+)*\.[A-Za-z]+$/;
       // const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

        if (!emailRule.test(data.email)) {
            Dialog.error(this._("w_Invitation_EmailError"));
            this.inputFormData.email = '';
            return false;
        }

        console.log('doSubmitParam ~ ', doSubmitParam);

        this.$emit("submit-data", doSubmitParam);
    }

    doReset() {
        this.inputFormData = {
            startDate: new Date(),
            endDate: new Date(),
            ptwStatus: '',
            ptwId: '',
            email: '',
            tenant: '',
            workCategory: '',
            workType: '',
            unit: '',
            contactPerson: '',
            contractor: '',
            workersName: '',
        };
    }

    doExportData() {}

    IFilterConditionForm() {
        return `
            interface {

                /**
                * @uiLabel - ${this._("w_Invitation_DateFrom")}
                * @uiPlaceHolder - ${this._("w_Invitation_DateFrom")}
                * @uiType - iv-form-date
                * @uiColumnGroup - row1
                */
                startDate?: any;


                /**
                * @uiLabel - ${this._("w_Invitation_DateTo")}
                * @uiPlaceHolder - ${this._("w_Invitation_DateTo")}
                * @uiType - iv-form-date
                * @uiColumnGroup - row1
                */
                endDate?: any;


                /**
                 * @uiLabel - ${this._("w_Invitation_PTWStatus")}
                 * @uiColumnGroup - row1
                 */
                ptwStatus?:  ${toEnumInterface(this.ptwStatusSelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_Invitation_PTWID")}
                 * @uiPlaceHolder - ${this._("w_Invitation_PTWID")}
                 * @uiColumnGroup - row1
                 */
                ptwId?: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Email")}
                 * @uiPlaceHolder - ${this._("w_Invitation_Email_Placeholder")}
                 * @uiColumnGroup - row2
                 */
                email?: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Tenant")}
                 * @uiColumnGroup - row2
                 */
                tenant?:  ${toEnumInterface(this.tenantSelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_Invitation_PTWStatus")}
                 * @uiColumnGroup - row2
                 */
                workCategory?:  ${toEnumInterface(this.workCategorySelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_Invitation_PTWStatus")}
                 * @uiColumnGroup - row2
                 */
                workType?:  ${toEnumInterface(this.workTypeSelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_Invitation_Unit")}
                 * @uiPlaceHolder - ${this._("w_Invitation_Unit")}
                 * @uiColumnGroup - row3
                 */
                unit?: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_ContactPerson")}
                 * @uiPlaceHolder - ${this._("w_Invitation_ContactPerson")}
                 * @uiColumnGroup - row3
                 */
                contactPerson?: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Contractor")}
                 * @uiPlaceHolder - ${this._("w_Invitation_Contractor")}
                 * @uiColumnGroup - row3
                 */
                contractor?: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_WorkersName")}
                 * @uiPlaceHolder - ${this._("w_Invitation_WorkersName")}
                 * @uiColumnGroup - row3
                 */
                workersName?: string;
            }
        `;
    }
}

export default SearchCondition;
Vue.component("search-condition", SearchCondition);
</script>

<style lang="scss" scoped>
    .submit {
        background-color: #5c7895;
        border: 1px solid #5c7895;
    }
    .reset {
        background-color: #d7d7d7;
        border: 1px solid #d7d7d7;
    }

</style>
