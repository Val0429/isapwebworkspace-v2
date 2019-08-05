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
            name: '',
            email: '',
            tenant: '',
            workDescription: ''
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

    async initWorkDescriptionSelectItem() {

        this.workDescriptionSelectItem = {};
        let tempDescriptionSelectItem = {};

        // TODO: wait api
        // await this.$server
        //     .R("/")
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(this, response, (response: any) => {
        //             for (const returnValue of response) {
        //                 tempDescriptionSelectItem[returnValue.objectId] =
        //                     returnValue.name;
        //             }
        //             this.workDescriptionSelectItem = tempDescriptionSelectItem;
        //         });
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.catchError(this, e);
        //     });

    }

    pageToList() {
        this.$emit('add-ptw-back-to-list', this.inputFormData);
        this.clearInputData();
    }

    async doSubmit(data) {
        const doSubmitParam: {
            name: '',
            email: '',
            tenant: '',
            workDescription: '',
        } = {
            name: data.name,
            email: data.email,
            tenant: data.tenant,
            workDescription: data.workDescription,

        };

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

        this.clearInputData();

    }

    IAddForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Invitation_ContactPerson")}
                 * @uiPlaceHolder - ${this._("w_Invitation_ContactPerson")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Invitation_CompanyEmail")}
                 * @uiPlaceHolder - ${this._("w_Invitation_Email_Placeholder")}
                 */
                email: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Tenant")}
                 * @uiPlaceHolder - ${this._("w_Invitation_Tenant")}
                 */
                tenant: ${toEnumInterface(this.tenantSelectItem as any, false)};


                /**
                 * @uiLabel - ${this._("w_Invitation_WorkDescription")}
                 */
                workDescription:  ${toEnumInterface(this.workDescriptionSelectItem as any, false)};

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
