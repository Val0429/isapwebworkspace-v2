<template>
    <div>
        <iv-form
            :interface="IAddForm()"
            :value="inputFormData"
            @update:*="updateInputFormData"
        >
            <template #ptwTitle>
                <div class="font-weight-bold col-md-12 mb-3 mt-3">{{ _('w_ViewPTW_Step2_Tip') }}</div>
                <div class="font-weight-bold col-md-12 mb-3">{{ _('w_ViewPTW_Step2_PTWTitle') }}</div>
            </template>

            <template #contractorTitle>
                <div class="font-weight-bold col-md-12 mb-3 mt-5">{{ _('w_ViewPTW_Step2_ContractorTitle') }}</div>
            </template>

            <template #contractorIsRequired>
                <span class="font-red col-md-12 mb-3 mt-5">* {{ _('w_ViewPTW_Step_AsteriskIsRequired') }}</span>
            </template>

        </iv-form>

    </div>
</template>

<script lang="ts">
import {
    Vue,
    Component,
    Prop,
    Emit,
    Model,
    Watch
} from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import { IStep2 } from ".";
import ResponseFilter from "@/services/ResponseFilter";
import RegexService from "@/services/RegexServices";
import Dialog from "@/services/Dialog";

@Component({
    components: {}
})
export class Step2 extends Vue {
    // Prop
    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: () => {}
    })
    selectedDetail: any;

    @Prop({
        type: Boolean,
        default: function() {
            return false;
        }
    })
    permission: boolean;

    tenantSelectItem: any = {};
    workCategorySelectItem: any = {};

    inputFormData: IStep2 = {
        // PTW Data
        ptwId: this.selectedDetail.ptwId ? this.selectedDetail.ptwId : "",
        tenant:
            this.selectedDetail.company && this.selectedDetail.company.objectId
                ? this.selectedDetail.company.objectId
                : "",
        workCategoryId:
            this.selectedDetail.workCategory &&
            this.selectedDetail.workCategory.objectId
                ? this.selectedDetail.workCategory.objectId
                : "",

        // Contractor Information
        applicantName: this.selectedDetail.applicantName
            ? this.selectedDetail.applicantName
            : "",

        // Company
        contractorCompanyName: this.selectedDetail.contractorCompanyName
            ? this.selectedDetail.contractorCompanyName
            : "",
        contractorCompanyAddress: this.selectedDetail.contractorCompanyAddress
            ? this.selectedDetail.contractorCompanyAddress
            : "",
        contractorCompanyEmail: this.selectedDetail.contractorCompanyEmail
            ? this.selectedDetail.contractorCompanyEmail
            : "",
        contractorCompanyContactPhone: this.selectedDetail
            .contractorCompanyContactPhone
            ? this.selectedDetail.contractorCompanyContactPhone
            : "",
        contractorCompanyFax: this.selectedDetail.contractorCompanyFax
            ? this.selectedDetail.contractorCompanyFax
            : ""
    };

    created() {}

    mounted() {
        this.initTenantSelectItem();
        this.initWorkCategorySelectItem();
    }

    @Watch("selectedDetail", { deep: true })
    private ptwIdChanged(newVal, oldVal) {
        this.initInputFormData();
    }

    initInputFormData() {
        this.inputFormData.ptwId = this.selectedDetail.ptwId;
        this.inputFormData.workCategoryId = this.selectedDetail.workCategory.objectId;
        this.inputFormData.tenant = this.selectedDetail.company.objectId;
        // if (this.selectedDetail && this.selectedDetail.company && this.selectedDetail.company.objectId) {
        //     this.inputFormData.tenant = this.selectedDetail.company.objectId;
        // }
        this.inputFormData.applicantName = this.selectedDetail.applicantName;
        this.inputFormData.contractorCompanyName = this.selectedDetail.contractorCompanyName;
        this.inputFormData.contractorCompanyAddress = this.selectedDetail.contractorCompanyAddress;
        this.inputFormData.contractorCompanyEmail = this.selectedDetail.contractorCompanyEmail;
        this.inputFormData.contractorCompanyContactPhone = this.selectedDetail.contractorCompanyContactPhone;
        this.inputFormData.contractorCompanyFax = this.selectedDetail.contractorCompanyFax;
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

    updateInputFormData(data) {
        switch (data.key) {
            // PTW Data
            case "ptwId":
                this.inputFormData.ptwId = data.value;
                break;
            case "tenant":
                this.inputFormData.tenant = data.value;
                break;
            case "workCategoryId":
                this.inputFormData.workCategoryId = data.value;
                break;

            // Contractor Information
            case "applicantName":
                this.inputFormData.applicantName = data.value;
                break;
            case "contractorCompanyName":
                this.inputFormData.contractorCompanyName = data.value;
                break;
            case "contractorCompanyAddress":
                this.inputFormData.contractorCompanyAddress = data.value;
                break;
            case "contractorCompanyEmail":
                this.inputFormData.contractorCompanyEmail = data.value;
                break;
            case "contractorCompanyContactPhone":
                this.inputFormData.contractorCompanyContactPhone = RegexService.numberReplace(
                    data.value
                );
                this.inputFormData.contractorCompanyContactPhone = RegexService.numberReplace(
                    this.inputFormData.contractorCompanyContactPhone
                );
                break;
            case "contractorCompanyFax":
                this.inputFormData.contractorCompanyFax = RegexService.numberReplace(
                    data.value
                );
                this.inputFormData.contractorCompanyFax = RegexService.numberReplace(
                    this.inputFormData.contractorCompanyFax
                );
                break;
        }

        this.$emit("step2", this.inputFormData);
    }

    IAddForm() {
        return `
            interface {

                ptwTitle?: any;


                /**
                 * @uiLabel - ${this._("w_Invitation_PTWID")}
                 * @uiPlaceHolder - ${this._("w_Invitation_PTWID")}
                 * @uiType - iv-form-label
                 */
                ptwId?: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Tenant")}
                 * @uiDisabled - ${!this.permission}
                 */
                tenant?:  ${toEnumInterface(
                    this.tenantSelectItem as any,
                    false
                )};


                /**
                 * @uiLabel - ${this._("w_Invitation_WorkCategory")}
                 * @uiDisabled - ${!this.permission}
                 */
                workCategoryId?:  ${toEnumInterface(
                    this.workCategorySelectItem as any,
                    false
                )};

                contractorTitle?: any;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step2_NameOfApplicant")}
                 * @uiPlaceHolder - ${this._("w_ViewPTW_Step2_NameOfApplicant")}
                 */
                applicantName: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step2_CompanyName")}
                 * @uiPlaceHolder - ${this._("w_ViewPTW_Step2_CompanyName")}
                 */
               contractorCompanyName: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step2_CompanyAddress")}
                 * @uiPlaceHolder - ${this._("w_ViewPTW_Step2_CompanyAddress")}
                 */
                contractorCompanyAddress: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step2_EmailAddress")}
                 * @uiPlaceHolder - ${this._("w_ViewPTW_Step2_EmailAddress")}
                 * @uiType - ivc-form-email
                 */
                 contractorCompanyEmail: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step2_ContactNumber")}
                 * @uiPlaceHolder - ${this._("w_ViewPTW_Step2_ContactNumber")}
                 */
                 contractorCompanyContactPhone: string;


                /**
                 * @uiLabel - ${this._("w_ViewPTW_Step2CompanyFaxNo")}
                 * @uiPlaceHolder - ${this._("w_ViewPTW_Step2CompanyFaxNo")}
                 */
                 contractorCompanyFax: string;

                contractorIsRequired?: any;


            }
        `;
    }
}

export default Step2;
Vue.component("step2", Step2);
</script>

<style lang="scss" scoped>
.font-red {
    color: red;
}
</style>
