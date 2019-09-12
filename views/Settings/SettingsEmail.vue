<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <!-- List -->
            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :label=" _('w_MailSetting_List') "
            >
                <template #toolbox>

                    <iv-toolbox-view
                        :disabled="selectedDetail.length !== 1"
                        @click="pageToView"
                    />
                    <iv-toolbox-edit
                        :disabled="selectedDetail.length !== 1"
                        @click="pageToEdit()"
                    />
                    <iv-toolbox-delete
                        :disabled="selectedDetail.length === 0"
                        @click="doDelete"
                    />
                    <iv-toolbox-divider />
                    <iv-toolbox-add @click="pageToAdd()" />

                </template>

                <iv-table
                    ref="listTable"
                    :interface="ITableList()"
                    :multiple="tableMultiple"
                    :server="{ path: '/notify/person-blacklist' }"
                    @selected="selectedItem($event)"
                >

                    <template #Actions="{$attrs, $listeners}">

                        <iv-toolbox-more :disabled="selectedDetail.length !== 1">
                            <iv-toolbox-view @click="pageToView" />
                            <iv-toolbox-edit @click="pageToEdit()" />
                            <iv-toolbox-delete @click="doDelete" />
                        </iv-toolbox-more>
                    </template>

                </iv-table>
            </iv-card>

            <!-- view -->
            <iv-card
                key="transition_2"
                v-show="transition.step === 2"
                :visible="true"
                :label=" _('w_MailSetting_View') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IViewForm()"
                    :value="inputFormData"
                >

                </iv-form>

                <template #footer>
                    <b-button
                        variant="dark"
                        size="lg"
                        @click="pageToList()"
                    >{{ _('w_Back') }}
                    </b-button>
                </template>

            </iv-card>

            <!--From (Add and Edit)-->
            <iv-auto-card
                key="transition_3"
                v-show="transition.step === 3"
                :visible="true"
                :label="inputFormData.objectId == '' ? _('w_MailSetting_Add') :  _('w_MailSetting_Edit')"
            >
                <template #toolbox>

                    <iv-toolbox-back @click="pageToList()" />

                </template>

                <iv-form
                    :interface="IAddAndEditForm()"
                    :value="inputFormData"
                    @submit="saveAddOrEdit($event)"
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

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";
import RegexServices from "@/services/RegexServices";

@Component({
    components: {}
})
export default class SettingsEmail extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    tableMultiple: boolean = true;

    selectedDetail: any = [];

    inputFormData: any = {
        objectId: "",
        name: "",
        position: "",
        phone: "",
        email: "",
        remark: ""
    };

    created() {}

    mounted() {}

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            name: "",
            position: "",
            phone: "",
            email: "",
            remark: ""
        };
    }

    selectedItem(data) {
        this.selectedDetail = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
    }

    getInputData() {
        this.clearInputData();
        for (const param of this.selectedDetail) {
            this.inputFormData = {
                objectId: param.objectId,
                name: param.name,
                position: param.position,
                phone: param.phone,
                email: param.email,
                remark: param.remark
            };
        }
    }

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        (this.$refs.listTable as any).reload();
    }

    pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
        this.getInputData();
    }

    pageToAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        this.clearInputData();
    }

    pageToEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        this.getInputData();
    }

    async saveAddOrEdit(data) {
        let dataObject: {
            name: string;
            position: string;
            phone: string;
            email: number;
            remark: string;
            objectId?: string;
        } = {
            name: data.name,
            position: data.position,
            phone: data.phone,
            email: data.email,
            remark: data.remark
        };

        // add
        if (!this.inputFormData.objectId) {
            const datas: any = [dataObject];

            const addParam = {
                datas
            };
            Loading.show();
            await this.$server
                .C("/notify/person-blacklist", addParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            for (const responseElement of response.datas) {
                                if (responseElement.statusCode === 200) {
                                    Dialog.success(
                                        this._(
                                            "w_MailSetting_AddEmailAddSuccess"
                                        )
                                    );
                                    this.pageToList();
                                } else {
                                    Dialog.error(responseElement.message);
                                }
                            }
                        },
                        this._("w_MailSetting_AddEmailFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_MailSetting_AddEmailFailed")
                    );
                });
        } else {
            dataObject.objectId = data.objectId;
            const datas: any = [dataObject];

            const editParam = {
                datas
            };
            Loading.show();
            await this.$server
                .U("/notify/person-blacklist", editParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            for (const responseElement of response.datas) {
                                if (responseElement.statusCode === 200) {
                                    Dialog.success(
                                        this._("w_MailSetting_EditEmailSuccess")
                                    );
                                    this.pageToList();
                                } else {
                                    Dialog.error(responseElement.message);
                                }
                            }
                        },
                        this._("w_MailSetting_EditEmailFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_MailSetting_EditEmailFailed")
                    );
                });
        }
    }

    async doDelete() {
        Dialog.confirm(
            this._("w_MailSetting_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                let deleteParam: {
                    objectId: any;
                } = {
                    objectId: []
                };

                for (const param of this.selectedDetail) {
                    deleteParam.objectId.push(param.objectId);
                }

                Loading.show();
                this.$server
                    .D("/notify/person-blacklist", deleteParam)
                    .then((response: any) => {
                        ResponseFilter.successCheck(
                            this,
                            response,
                            (response: any) => {
                                this.pageToList();
                            },
                            this._("w_DeleteFailed")
                        );
                    })
                    .catch((e: any) => {
                        return ResponseFilter.catchError(this, e);
                    });

                Loading.hide();
            }
        );
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
                 * @uiLabel - ${this._("w_Account_UserName")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Person_Position")}
                 */
                position: string;

                /**
                 * @uiLabel - ${this._("w_Person_Phone")}
                 */
                phone: string;

                /**
                 * @uiLabel - ${this._("w_Person_Email")}
                 */
                email: string;

                /**
                 * @uiLabel - ${this._("w_Account_Remark")}
                 */
                remark: string;

                Actions: any
            }
        `;
    }

    IAddAndEditForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Name")}
                 * @uiPlaceHolder - ${this._("w_Name")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Person_Position")}
                 * @uiPlaceHolder - ${this._("w_Person_Position")}
                 */
                position?: string;

                /**
                 * @uiLabel - ${this._("w_Person_Phone")}
                 * @uiPlaceHolder - ${this._("w_Person_Phone")}
                 * @uiValidation - ${RegexServices.regexItem.phoneNumber}
                 * @uiInvalidMessage - ${this._("w_Error_Phone")}
                 */
                phone?: string;

                /**
                 * @uiLabel - ${this._("w_Person_Email")}
                 * @uiPlaceHolder - ${this._("w_Person_Email")}
                 * @uiValidation - ${RegexServices.regexItem.email}
                 * @uiInvalidMessage - ${this._("w_Error_Email")}
                 */
                email: string;

                /**
                 * @uiLabel - ${this._("w_Account_Remark")}
                 * @uiPlaceHolder - ${this._("w_Account_Remark")}
                 */
                remark?: string;
            }
        `;
    }

    IViewForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Name")}
                 * @uiType - iv-form-label
                 */
                name?: string;

                /**
                 * @uiLabel - ${this._("w_Person_Position")}
                 * @uiType - iv-form-label
                 */
                position?: string;

                /**
                 * @uiLabel - ${this._("w_Person_Phone")}
                 * @uiType - iv-form-label
                 */
                phone?: string;

                /**
                 * @uiLabel - ${this._("w_Person_Email")}
                 * @uiType - iv-form-label
                 */
                email?: string;

                /**
                 * @uiLabel - ${this._("w_Account_Remark")}
                 * @uiType - iv-form-label
                 */
                remark?: string;

            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>
