<template>
    <div>

        <iv-auto-card :label="_('w_Invitation_SearchCondition')">
            <iv-form
                :interface="IFilterConditionForm()"
                :value="inputFormData"
                @submit="doSubmit($event)"
            >

            </iv-form>

            <template #footer-before>

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
import Datetime from "@/services/Datetime";
import Dialog from "@/services/Dialog";
import ResponseFilter from "@/services/ResponseFilter";

enum EPTWStatus {
    new = "new",
    approve = "approve",
    pendding = "pendding",
    reject = "reject"
}

interface IPaging {
    pageSize: number;
    page: number;
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
        ptwStatus: "",
        ptwId: "",
        email: "",
        tenant: "",
        workCategory: "",
        workType: "",
        unit: "",
        contactPerson: "",
        contractor: "",
        workersName: ""
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
            new: this._("w_Invitation_New"),
            approve: this._("w_Invitation_Approved"),
            pendding: this._("w_Invitation_PendingApproved"),
            reject: this._("w_Invitation_Rejected")
        };
    }

    async initTenantSelectItem() {
        this.tenantSelectItem = {};
        let tempTenantSelectItem = {};

        await this.$server
            .R("/flow1/companies")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response.results) {
                        tempTenantSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                    this.tenantSelectItem = tempTenantSelectItem;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initWorkCategorySelectItem() {
        this.workCategorySelectItem = {};
        let tempWorkCategorySelectItem = {};

        await this.$server
            .R("/flow1/purposes")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response.results) {
                        tempWorkCategorySelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                    this.workCategorySelectItem = tempWorkCategorySelectItem;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }


    async initWorkTypeSelectItem() {
        this.workTypeSelectItem = {
            1: this._('w_ViewPTW_Step3_TypesOfWorkInvolved1'),
            2: this._('w_ViewPTW_Step3_TypesOfWorkInvolved2'),
            3: this._('w_ViewPTW_Step3_TypesOfWorkInvolved3'),
            4: this._('w_ViewPTW_Step3_TypesOfWorkInvolved4'),
            5: this._('w_ViewPTW_Step3_TypesOfWorkInvolved5'),
            6: this._('w_ViewPTW_Step3_TypesOfWorkInvolved6'),
            7: this._('w_ViewPTW_Step3_TypesOfWorkInvolved7'),
            8: this._('w_ViewPTW_Step3_TypesOfWorkInvolved8'),
        };
    }

    async doSubmit(data) {
        const doSubmitParam: {
            paging: IPaging;
            startDate: Date;
            endDate: Date;
            status: string;
            ptwId: string;
            contactEmail: string;
            companyId: string;
            workCategoryId: string;
            workType: number;
            workPremisesUnit: string;
            personName: string;
            workContact: string;
            contractorCompanyName: string;
        } = {
            paging: {
                pageSize: 10,
                page: 1
            },
            startDate: Datetime.DateToZero(data.startDate),
            endDate: Datetime.DateTo23595959(data.endDate),
            status: data.ptwStatus,
            ptwId: data.ptwId,
            contactEmail: data.email,
            companyId: data.tenant,
            workCategoryId: data.workCategory,
            workType: data.workType,
            workPremisesUnit: data.unit,
            personName: data.contactPerson,
            workContact: data.contractor,
            contractorCompanyName: data.workersName
        };

        if (!Datetime.CheckDate(data.startDate, data.endDate)) {
            Dialog.error(this._("w_Invitation_DateError"));
            this.inputFormData.startDate = new Date();
            this.inputFormData.endDate = new Date();
            return false;
        }

        console.log("doSubmitParam ~ ", doSubmitParam);

        this.$emit("submit-data", doSubmitParam);
    }

    doReset() {
        this.inputFormData = {
            startDate: new Date(),
            endDate: new Date(),
            ptwStatus: "",
            ptwId: "",
            email: "",
            tenant: "",
            workCategory: "",
            workType: "",
            unit: "",
            contactPerson: "",
            contractor: "",
            workersName: ""
        };
    }

    doExportData() {
        this.$emit("excel");
    }

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
                ptwStatus?:  ${toEnumInterface(
                    this.ptwStatusSelectItem as any,
                    false
                )};


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
                tenant?:  ${toEnumInterface(
                    this.tenantSelectItem as any,
                    false
                )};


                /**
                 * @uiLabel - ${this._("w_Invitation_WorkCategory")}
                 * @uiColumnGroup - row2
                 */
                workCategory?:  ${toEnumInterface(
                    this.workCategorySelectItem as any,
                    false
                )};


                /**
                 * @uiLabel - ${this._("w_Invitation_WorkType")}
                 * @uiColumnGroup - row2
                 */
                workType?:  ${toEnumInterface(
                    this.workTypeSelectItem as any,
                    false
                )};


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
