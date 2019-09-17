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
import Datetime from "@/services/Datetime";
import Dialog from "@/services/Dialog";
import ResponseFilter from "@/services/ResponseFilter";
import Loading from "@/services/Loading";

enum EPTWStatus {
    new = "new",
    approve = "approve",
    pendding = "pendding",
    reject = "reject"
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
        name: "",
        email: "",
        tenant: "",
        workDescription: ""
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
            contact: "",
            contactEmail: "",
            companyId: "",
            workCategoryId: ""
        };
    }

    initSelectItem() {
        this.ptwStatusSelectItem = {
            name: this._("w_Invitation_New"),
            approve: this._("w_Invitation_Approved"),
            pendding: this._("w_Invitation_PendingApproved"),
            reject: this._("w_Invitation_Rejected")
        };
    }

    async initTenantSelectItem() {
        this.tenantSelectItem = {};
        let tempTenantSelectItem = {};
        let param: any = { paging: { all: true } };

        await this.$server
            .R("/flow1/companies", param)
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
        let param: any = { paging: { all: true } };

        await this.$server
            .R("/flow1/purposes", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response.results) {
                        tempDescriptionSelectItem[returnValue.objectId] =
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
        this.$emit("add-ptw-back-to-list", this.inputFormData);
        this.clearInputData();
    }

    async doSubmit(data) {
        const doSubmitParam: {
            contact: string;
            contactEmail: string;
            companyId: string;
            workCategoryId: string;
        } = {
            contact: data.contact,
            contactEmail: data.contactEmail,
            companyId: data.companyId,
            workCategoryId: data.workCategoryId
        };

        Loading.show();
        await this.$server
            .C("/flow1/crms", doSubmitParam)
            .then((response: any) => {
                ResponseFilter.successCheck(
                    this,
                    response,
                    (response: any) => {
                        Dialog.success(this._("w_PTW_AddPTWSuccess"));
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
                companyId: ${toEnumInterface(
                    this.tenantSelectItem as any,
                    false
                )};


                /**
                 * @uiLabel - ${this._("w_Invitation_WorkDescription")}
                 */
                workCategoryId:  ${toEnumInterface(
                    this.workDescriptionSelectItem as any,
                    false
                )};

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
