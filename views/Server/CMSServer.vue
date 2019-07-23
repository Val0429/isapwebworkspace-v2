<template>
    <div class="animated fadeIn">
        <iv-card
            v-show="pageStep === ePageStep.list"
            :label=" _('w_ServerCMS_List') "
        >
            <template #toolbox>

                <iv-toolbox-view
                    :disabled="isSelected.length !== 1"
                    @click="pageToView"
                />
                <iv-toolbox-edit
                    :disabled="isSelected.length !== 1"
                    @click="pageToEdit(ePageStep.edit)"
                />
                <iv-toolbox-delete
                    :disabled="isSelected.length === 0"
                    @click="doDelete"
                />
                <iv-toolbox-divider />
                <iv-toolbox-add @click="pageToAdd(ePageStep.add)" />

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
                        <iv-toolbox-edit @click="pageToEdit(ePageStep.edit)" />
                        <iv-toolbox-delete @click="doDelete" />
                    </iv-toolbox-more>
                </template>

            </iv-table>
        </iv-card>

        <!--From (Add and Edit)-->
        <iv-auto-card
            v-show="pageStep === ePageStep.add || pageStep === ePageStep.edit"
            :visible="true"
            :label="pageStep === ePageStep.add ? _('w_ServerCMS_Add') :  _('w_ServerCMS_Edit')"
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

        <!-- view -->
        <iv-card
            v-show="pageStep === ePageStep.view"
            :visible="true"
            :label=" _('w_ServerCMS_View') "
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

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

// API Interface
import { IAddCMSServer, IEditCMSServer } from "@/config/default/api/interfaces";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";

interface IinputFormData extends IAddCMSServer, IEditCMSServer {
    type?: string;
}

enum EPageStep {
    list = "list",
    add = "add",
    edit = "edit",
    view = "view",
    none = "none"
}

@Component({
    components: {}
})
export default class CMSServer extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.list;

    isSelected: any = [];
    tableMultiple: boolean = true;

    selectedDetail: any = [];

    inputFormData: IinputFormData = {
        objectId: "",
        customId: "",
        name: "",
        protocol: "http",
        ip: "",
        port: null,
        account: "",
        password: "",
        type: ""
    };

    created() {}

    mounted() {}

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            customId: "",
            name: "",
            protocol: "http",
            ip: "",
            port: null,
            account: "",
            password: "",
            type: ""
        };
    }

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
    }

    getInputData() {
        this.clearInputData();
        for (const param of this.selectedDetail) {
            this.inputFormData = {
                objectId: param.objectId,
                customId: param.customId,
                ip: param.ip,
                account: param.account,
                name: param.name,
                password: param.password,
                port: param.port,
                protocol: param.protocol
            };
        }
    }

    pageToAdd(type: string) {
        this.pageStep = EPageStep.add;
        this.clearInputData();
        this.inputFormData.type = type;
    }

    pageToEdit(type: string) {
        this.pageStep = EPageStep.edit;
        this.getInputData();
        this.inputFormData.type = type;
    }

    pageToView() {
        this.pageStep = EPageStep.view;
        this.getInputData();
    }

    pageToList() {
        this.pageStep = EPageStep.list;
        (this.$refs.listTable as any).reload();
    }

    async saveAddOrEdit(data) {
        // add
        if (this.inputFormData.type === EPageStep.add) {
            const datas: IinputFormData[] = [
                {
                    customId: data.customId,
                    name: data.name,
                    protocol: data.protocol,
                    ip: data.ip,
                    port: data.port,
                    account: data.account,
                    password: data.password
                }
            ];

            const addParam = {
                datas
            };

            await this.$server
                .C("/partner/cms", addParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(this._("w_ServerCMS_AddSuccess"));
                            this.pageToList();
                        }
                        if (returnValue.statusCode === 500) {
                            Dialog.error(this._("w_ServerCMS_ADDFailed"));
                            return false;
                        }
                        if (returnValue.statusCode === 400) {
                            Dialog.error(this._("w_ServerCMS_ADDDuplicate"));
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.base(
                        this,
                        e,
                        this._("w_ServerCMS_ADDFailed")
                    );
                });
        }

        // edit
        if (this.inputFormData.type === EPageStep.edit) {
            const datas: IinputFormData[] = [
                {
                    name: data.name,
                    protocol: data.protocol,
                    ip: data.ip,
                    port: data.port,
                    account: data.account,
                    password: data.password,
                    objectId: data.objectId
                }
            ];

            const editParam = {
                datas
            };

            await this.$server
                .U("/partner/cms", editParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(this._("w_ServerCMS_EditSuccess"));
                            this.pageToList();
                        }
                        if (returnValue.statusCode === 500) {
                            Dialog.error(this._("w_ServerCMS_EditFailed"));
                            return false;
                        }
                        if (returnValue.statusCode === 400) {
                            Dialog.error(this._("w_ServerCMS_EditDuplicate"));
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.base(
                        this,
                        e,
                        this._("w_ServerCMS_EditFailed")
                    );
                });
        }
    }

    async doDelete() {
        Dialog.confirm(
            this._("w_ServerCMSDeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                for (const param of this.selectedDetail) {
                    const deleteUserParam: {
                        objectId: string;
                    } = {
                        objectId: param.objectId
                    };

                    this.$server
                        .D("/partner/cms", deleteUserParam)
                        .then((response: any) => {
                            for (const returnValue of response) {
                                if (returnValue.statusCode === 200) {
                                    this.pageToList();
                                }
                                if (returnValue.statusCode === 500) {
                                    Dialog.error(this._("w_DeleteFailed"));
                                    return false;
                                }
                            }
                        })
                        .catch((e: any) => {
                            return ResponseFilter.base(this, e);
                        });
                }
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
                 * @uiLabel - ${this._("w_DeviceID")}
                 */
                customId: string;


                /**
                 * @uiLabel - ${this._("w_ServerName")}
                 */
                name: string;


                /**
                 * @uiLabel - ${this._("w_IPAddress")}
                 */
                ip: string;

                Actions: any

            }
        `;
    }

    IAddAndEditForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Id")}
                 * @uiPlaceHolder - ${this._("w_Id")}
                 * @uiType - ${
                     this.inputFormData.type === EPageStep.add
                         ? "iv-form-string"
                         : "iv-form-label"
                 }
                 */
                customId: string;


                /**
                 * @uiLabel - ${this._("w_Name")}
                 * @uiPlaceHolder - ${this._("w_Name")}
                 */
                name: string;


                /**
                 * @uiLabel - ${this._("w_Account")}
                 * @uiPlaceHolder - ${this._("w_Account")}
                 */
                account: string;


                /**
                 * @uiLabel - ${this._("w_Password")}
                 * @uiPlaceHolder - ${this._("w_Password")}
                 * @uiType - iv-form-password
                 *                  */
                password: string;


                /**
                 * @uiLabel - ${this._("w_Protocol")}
                 */
                protocol: ${toEnumInterface({
                    http: "http",
                    https: "https"
                })};


                /**
                 * @uiLabel - ${this._("w_Ip")}
                 * @uiPlaceHolder - ${this._("w_Ip")}
                 * @uiType - iv-form-ip
                 */
                ip: string;


                /**
                 * @uiLabel - ${this._("w_Port")}
                 * @uiPlaceHolder - ${this._("w_Port_PlaceHolder")}
                 * @uiAttrs - { max: 65535, min: 1}
                 */
                port: number;

            }
        `;
    }

    IViewForm() {
        return `
            interface {

            /**
             * @uiLabel - ${this._("w_Id")}
             * @uiType - iv-form-label
             */
            customId: string;


            /**
             * @uiLabel - ${this._("w_Name")}
             * @uiType - iv-form-label
             */
            name: string;


            /**
             * @uiLabel - ${this._("w_Account")}
             * @uiType - iv-form-label
             */
            account: string;


            /**
             * @uiLabel - ${this._("w_Protocol")}
             * @uiType - iv-form-label
             */
            protocol: string;


            /**
             * @uiLabel - ${this._("w_Ip")}
             * @uiType - iv-form-label
             */
            ip: string;


            /**
             * @uiLabel - ${this._("w_Port")}
             * @uiType - iv-form-label
             */
            port: number;

            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>
