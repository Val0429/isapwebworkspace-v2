<template>
    <div>

        <iv-auto-card
            :visible="true"
            :label="_('w_Invitation_CompanyAddPTW')"
        >
            <template #toolbox>

                <iv-toolbox-back @click="pageToList()" />

            </template>

            <iv-form
                :interface="IAddForm()"
                :value="inputFormData"
                @submit="doSubmit($event)"
            ></iv-form>

            <template #footer-before>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToList()"
                >{{ _('w_Back') }}
                </b-button>
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
export class AddPTW extends Vue {

    // select
    ptwStatusSelectItem: any = {};
    tenantSelectItem: any = {};
    workDescriptionSelectItem: any = {};

    inputFormData: any = {
        name: '',
        email: '',
        tenant: '',
        workDescription: ''
    };

    step: number = 0;

    created() {
        this.initSelectItem();
        this.initTenantSelectItem();
        this.initWorkDescriptionSelectItem();
    }

    mounted() {}

    clearInputData() {
        this.inputFormData = {
            contact: '',
            contactEmail: '',
            companyId: '',
            workCategory: ''
        };
    }

    initSelectItem() {

        this.ptwStatusSelectItem = {
            approved: this._('w_Invitation_Approved'),
            pendingApproved: this._('w_Invitation_PendingApproved'),
            rejected: this._('w_Invitation_Rejected'),
        }
    }

    async initTenantSelectItem() {

        this.tenantSelectItem = {};
        let tempTenantSelectItem = {};

        await this.$server
            .R("/companies")
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

    async initWorkDescriptionSelectItem() {

        this.workDescriptionSelectItem = {};
        let tempDescriptionSelectItem = {};

        await this.$server
            .R("/purposes")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response.results) {
                        tempDescriptionSelectItem[returnValue.name] =
                            returnValue.name;
                    }
                    this.workDescriptionSelectItem = tempDescriptionSelectItem;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });

    }

    pageToList() {
        this.$emit('add-ptw-back-to-list', this.inputFormData);
        this.clearInputData();
    }

    async doSubmit(data) {
        const doSubmitParam: {
            contact: string,
            contactEmail: string,
            companyId: string,
            workCategory: string,
        } = {
            contact: data.contact,
            contactEmail: data.contactEmail,
            companyId: data.companyId,
            workCategory: data.workCategory,
        };

        // email正則
       //  const emailRule = /^([^@]+)@([\da-z\.-]+)\.([a-z\.]{2,6})([^\.])$/;
       // // const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
       //
       //  if (!emailRule.test(data.email)) {
       //      Dialog.error(this._("w_Invitation_EmailError"));
       //      this.inputFormData.email = '';
       //      return false;
       //  }

        await this.$server
            .C("/crms", doSubmitParam)
            .then((response: any) => {
                ResponseFilter.successCheck(
                    this,
                    response,
                    (response: any) => {
                        Dialog.success(this._("w_Dialog_SuccessTitle"));
                        this.pageToList();
                    },
                    this._("w_Dialog_ErrorTitle")
                );
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_Dialog_ErrorTitle")
                );
            });

        console.log('doSubmitParam ~ ', doSubmitParam);

        this.$emit("submit-data", doSubmitParam);

        this.clearInputData();

    }

    IAddForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Invitation_ContactPerson")}
                 * @uiPlaceHolder - ${this._("w_Invitation_ContactPerson")}
                 */
                contact: string;

                /**
                 * @uiLabel - ${this._("w_Invitation_CompanyEmail")}
                 * @uiPlaceHolder - ${this._("w_Invitation_Email_Placeholder")}
                 */
                contactEmail: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Tenant")}
                 * @uiPlaceHolder - ${this._("w_Invitation_Tenant")}
                 */
                companyId: ${toEnumInterface(this.tenantSelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_Invitation_WorkDescription")}
                 */
                workCategory:  ${toEnumInterface(this.workDescriptionSelectItem as any, false)};

            }
        `;
    }
}

export default AddPTW;
Vue.component("add-ptw", AddPTW);
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
