<template>
    <div class="animated fadeIn">
        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >
            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :label="_('w_Vms_VmsList')"
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
                    :server="{ path: '/client/vms' }"
                    @selected="selectedItem($event)"
                >
                    <template #Actions="{$attrs, $listeners}">
                        <iv-toolbox-more
                            size="sm"
                            :disabled="selectedDetail.length !== 1"
                        >
                            <iv-toolbox-view @click="pageToView" />
                            <iv-toolbox-edit @click="pageToEdit" />
                            <iv-toolbox-delete @click="doDelete" />

                        </iv-toolbox-more>
                    </template>

                </iv-table>
            </iv-card>

            <!-- view -->
            <iv-auto-card
                key="transition_2"
                v-show="transition.step === 2"
                :visible="true"
                :label="_('w_Account_ViewUser') "
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

            </iv-auto-card>

            <!-- Modify -->
            <iv-auto-card
                key="transition_3"
                v-show="transition.step === 3"
                :visible="true"
                :label="inputFormData.objectId == '' ? _('w_Account_AddUser') : _('w_Account_EditUser') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IModifyForm()"
                    :value="inputFormData"
                    @update:*="updateModifyForm"
                    @submit="saveModifyForm($event)"
                >
                </iv-form>

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
import { Vue, Component } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";
import ResponseFilter from "@/services/ResponseFilter";
import Loading from "@/services/Loading";
import RegexServices from "@/services/RegexServices";

@Component({
    components: {}
})
export default class SetingVms extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    tableMultiple: boolean = true;
    selectedDetail: any = [];

    inputFormData = {
        objectId: "",
        name: "",
        protocol: "http",
        ip: "0.0.0.0",
        port: 80,
        account: "",
        password: ""
    };

    created() {}

    mounted() {}

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        this.clearInputData();
        (this.$refs.listTable as any).reload();
    }

    pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
        this.clearInputData();
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
        this.clearInputData();
        this.getInputData();
    }

    async doDelete() {
        await Dialog.confirm(
            this._("w_Delete_ConfirmContent"),
            this._("w_Delete_ConfirmLabel"),
            () => {
                Loading.show();
                for (let detail of this.selectedDetail) {
                    let param = {
                        objectId: detail.objectId
                    };

                    param = RegexServices.trim(param);
                    this.$server
                        .D("/client/vms", param)
                        .then((response: any) => {
                            ResponseFilter.successCheck(
                                this,
                                response,
                                (response: any) => {
                                    this.pageToList();
                                }
                            );
                        })
                        .catch((e: any) => {
                            return ResponseFilter.catchError(this, e);
                        });
                }
            }
        );
    }

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            name: "",
            protocol: "http",
            ip: "",
            port: 0,
            account: "",
            password: ""
        };
    }

    getInputData() {
        for (const param of this.selectedDetail) {
            this.inputFormData = {
                objectId: param.objectId,
                name: param.name,
                protocol: param.protocol,
                ip: param.ip,
                port: param.port,
                account: param.account,
                password: param.password
            };
        }
    }

    selectedItem(datas: any) {
        this.selectedDetail = datas;
    }

    updateModifyForm(datas: any) {
        this.inputFormData[datas.key] = datas.value;
    }

    async saveModifyForm(event: any) {
        let datas: any = {
            datas: [
                {
                    name: this.inputFormData.name,
                    protocol: this.inputFormData.protocol,
                    ip: this.inputFormData.ip,
                    port: this.inputFormData.port,
                    account: this.inputFormData.account,
                    password: this.inputFormData.password
                }
            ]
        };

        if (this.inputFormData.objectId == "") {
            Loading.show();
            datas = RegexServices.trim(datas);
            await this.$server
                .C("/client/vms", datas)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            this.pageToList();
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else {
            Loading.show();
            datas = RegexServices.trim(datas);
            await this.$server
                .U("/client/vms", datas)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            this.pageToList();
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        }
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
                 * @uiLabel - ${this._("w_Vms_Name")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Vms_Protocol")}
                 */
                protocol: string;

                /**
                 * @uiLabel - ${this._("w_Vms_IP")}
                 */
                ip: string;

                /**
                 * @uiLabel - ${this._("w_Vms_Port")}
                 */
                port: string;

            }
        `;
    }

    IViewForm() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_Vms_Name")}
                 * @uiType - iv-form-label
                 */
                name?: string;

                /**
                 * @uiLabel - ${this._("w_Vms_Protocol")}
                 * @uiType - iv-form-label
                 */
                protocol?: string;

                /*
                * @uiLabel - ${this._("w_Vms_IP")}
                * @uiType - iv-form-label
                */
                ip?: string;

                /*
                * @uiLabel - ${this._("w_Vms_Port")}
                * @uiType - iv-form-label
                */
                port?: string;

                /**
                 * @uiLabel - ${this._("w_Account_UserTitles")}
                 * @uiType - iv-form-label
                 */
                account?: string;

                /**
                 * @uiLabel - ${this._("w_Vms_Password")}
                 * @uiType - iv-form-label
                 */
                password?: string;
            }
        `;
    }

    IModifyForm() {
        return `
            interface {
                 /**
                 * @uiLabel - ${this._("w_Vms_Name")}
                 * @uiPlaceHolder - ${this._("w_Vms_Name")}
                 */
                name: string;

                 /**
                 * @uiLabel - ${this._("w_Vms_Protocol")}
                 */
                protocol: ${toEnumInterface({
                    http: "http",
                    https: "https"
                })};

                /**
                 * @uiLabel - ${this._("w_Vms_IP")}
                 * @uiPlaceHolder - ${this._("w_Vms_IP")}
                 * @uiType - iv-form-ip
                 */
                ip: string;

                /**
                 * @uiLabel - ${this._("w_Port")}
                 * @uiPlaceHolder - ${this._("w_Port")}
                 * @uiAttrs - { max: 65535, min: 1}
                 */
                port: number;

                /**
                 * @uiLabel - ${this._("w_Vms_Acctount")}
                 * @uiPlaceHolder - ${this._("w_Vms_Acctount")}
                 */
                account: string;

                /**
                 * @uiLabel - ${this._("w_Vms_Password")}
                 * @uiPlaceHolder - ${this._("w_Vms_Password")}
                 * @uiType - iv-form-password
                 */
                password: string;
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>




