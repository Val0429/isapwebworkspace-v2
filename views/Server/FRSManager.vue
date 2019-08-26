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
                :label=" _('w_ServerFRSManager_List') "
            >
                <template #toolbox>

                    <iv-toolbox-view
                        :disabled="isSelected.length !== 1"
                        @click="pageToView"
                    />
                    <iv-toolbox-edit
                        :disabled="isSelected.length !== 1"
                        @click="pageToEdit()"
                    />
                    <iv-toolbox-delete
                        :disabled="isSelected.length === 0"
                        @click="doDelete"
                    />
                    <iv-toolbox-divider />
                    <iv-toolbox-add @click="pageToAdd()" />

                </template>

                <iv-table
                    ref="listTable"
                    :interface="ITableList()"
                    :multiple="tableMultiple"
                    :server="{ path: '/partner/frs-manager' }"
                    @selected="selectedItem($event)"
                >

                    <template #Actions="{$attrs, $listeners}">

                        <iv-toolbox-more :disabled="isSelected.length !== 1">
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
                :label=" _('w_ServerFRS_View') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IViewForm()"
                    :value="inputFormData"
                >

                    <template #setUserGroupFRS>
                        <h6 class="ml-3 font-weight-bold mt-3">{{ _('w_SetUserGroupInFRS1') }}</h6>
                    </template>

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
                :label="inputFormData.objectId == '' ? _('w_ServerFRS_Add') :  _('w_ServerFRS_Edit')"
            >
                <template #toolbox>

                    <iv-toolbox-back @click="pageToList()" />

                </template>

                <iv-form
                    :interface="IAddAndEditForm()"
                    :value="inputFormData"
                    @update:*="tempSaveInputData($event)"
                    @submit="saveAddOrEdit($event)"
                >

                    <template #setUserGroupFRS>
                        <div class="m-3">
                            <b-button @click="clickToSetUserGroupInFRS">
                                {{ _('w_SetUserGroupInFRS1') }}
                            </b-button>
                        </div>
                    </template>
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
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import ReportService from "@/components/Reports/models/ReportService";
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";

import {
    IFRSServerResults,
    IFRSServerReadUserGroup,
    IFRSUserGroup,
    IFRSManagerAdd,
    IFRSManagerEdit
} from "@/config/default/api/interfaces";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

interface IInputFormData extends IFRSManagerAdd,  IFRSManagerEdit {
    employee?: string;
    employeeName?: string;
    vip?: string;
    vipName?: string;
    blacklist?: string;
    blacklistName?: string;
}

enum EUserGroup {
    employee = "employee",
    blacklist = "blacklist",
    vip = "vip"
}

@Component({
    components: {}
})
export default class FRSManager extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    isSelected: any = [];
    tableMultiple: boolean = true;

    selectedDetail: any = [];

    // user group 相關
    groupEmployee: any = {};
    groupVIP: any = {};
    groupBlacklist: any = {};
    groupData: any = [];

    inputFormData: IInputFormData = {
        objectId: "",
        customId: "",
        name: "",
        protocol: "http",
        ip: "",
        port: null,
        account: "",
        password: "",
        employee: "",
        vip: "",
        blacklist: ""
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
            employee: "",
            vip: "",
            blacklist: ""
        };
    }

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
    }

    async initUserGroupInFRS() {
        const configObject: any = {
            ip: this.inputFormData.ip,
            port: this.inputFormData.port,
            protocol: this.inputFormData.protocol,
            account: this.inputFormData.account,
            password: this.inputFormData.password
        };

        const addParam = {
            config: configObject
        };

        Loading.show();
        let results = await this.$server
            .C("/partner/frs-manager/user-group", addParam)
            .then((response: any) => {
                ResponseFilter.successCheck(
                    this,
                    response,
                    (response: any) => {
                    },
                    this._("w_FRSManager_UserGroup_failed")
                );
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_WrongConfig")
                );
            });
        Loading.hide();
        this.groupData = results;

        let tempBlacklist = {};
        let tempVIP = {};
        let tempEmployee = {};

        if (!this.groupData) {
            return false;
        } else {
            for (const result of this.groupData) {
                switch (result.name) {
                    case "Blacklist":
                        tempBlacklist[result.objectId] = result.name;
                        this.groupBlacklist = tempBlacklist;
                        break;
                    case "VIP":
                        tempVIP[result.objectId] = result.name;
                        this.groupVIP = tempVIP;
                        break;
                    case "Visitor":
                        tempEmployee[result.objectId] = result.name;
                        this.groupEmployee = tempEmployee;
                        break;
                    // case "Employee":
                    //     tempEmployee[result.objectId] = result.name;
                    //     this.groupEmployee = tempEmployee;
                    //     break;
                }
            }
        }
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

            if (param.userGroups) {
                param.userGroups.map(item => {
                    switch (item.type) {
                        case EUserGroup.employee:
                            this.inputFormData.employee = item.objectId;
                            this.inputFormData.employeeName = item.name;
                            break;
                        case EUserGroup.vip:
                            this.inputFormData.vip = item.objectId;
                            this.inputFormData.vipName = item.name;
                            break;
                        case EUserGroup.blacklist:
                            this.inputFormData.blacklist = item.objectId;
                            this.inputFormData.blacklistName = item.name;
                            break;
                    }
                });
            }
        }
    }

    tempSaveInputData(data) {
        switch (data.key) {
            case "name":
                this.inputFormData.name = data.value;
                break;
            case "customId":
                this.inputFormData.customId = data.value;
                break;
            case "ip":
                this.inputFormData.ip = data.value;
                break;
            case "port":
                this.inputFormData.port = data.value;
                break;
            case "protocol":
                this.inputFormData.protocol = data.value;
                break;
            case "account":
                this.inputFormData.account = data.value;
                break;
            case "password":
                this.inputFormData.password = data.value;
                break;
        }
    }

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        (this.$refs.listTable as any).reload();
    }

    async pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
        this.getInputData();
    }

    pageToAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        this.clearInputData();
    }

    async pageToEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        this.getInputData();

        if (!this.groupData) {
            await this.initUserGroupInFRS();
        }
    }

    async clickToSetUserGroupInFRS() {
        if (
            !this.inputFormData.ip ||
            !this.inputFormData.port ||
            !this.inputFormData.protocol ||
            !this.inputFormData.account ||
            !this.inputFormData.password
        ) {
            Dialog.error(this._("w_ErrorConfigFRSManager"));
            return false;
        }

        if (this.groupData.length === 0) {
            await this.initUserGroupInFRS();
        }
    }

    async saveAddOrEdit(data) {
        let userGroups: IFRSUserGroup = {
            type: "",
            objectId: "",
            name: ""
        };

        let tempGroups: any = [];
        let tempUserGroups = JSON.parse(JSON.stringify(userGroups));

        if (this.groupData) {
            this.groupData.map(item => {
                switch (item.objectId) {
                    case data.employee:
                        tempUserGroups = JSON.parse(JSON.stringify(userGroups));
                        tempUserGroups.type = EUserGroup.employee;
                        tempUserGroups.objectId = item.objectId;
                        tempUserGroups.name = item.name;
                        tempGroups.push(tempUserGroups);
                        break;
                    case data.vip:
                        tempUserGroups = JSON.parse(JSON.stringify(userGroups));
                        tempUserGroups.type = EUserGroup.vip;
                        tempUserGroups.objectId = item.objectId;
                        tempUserGroups.name = item.name;
                        tempGroups.push(tempUserGroups);
                        break;
                    case data.blacklist:
                        tempUserGroups = JSON.parse(JSON.stringify(userGroups));
                        tempUserGroups.type = EUserGroup.blacklist;
                        tempUserGroups.objectId = item.objectId;
                        tempUserGroups.name = item.name;
                        tempGroups.push(tempUserGroups);
                        break;
                }
            });
        }


        // add
        if (this.inputFormData.objectId == "") {
            const datas: IFRSManagerAdd[] = [
                {
                    customId: data.customId,
                    name: data.name,
                    protocol: data.protocol,
                    ip: data.ip,
                    port: data.port,
                    account: data.account,
                    password: data.password,
                    userGroups: tempGroups ? tempGroups : []
                }
            ];

            const addParam = {
                datas
            };
            Loading.show();
            await this.$server
                .C("/partner/frs-manager", addParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_ServerFRSManager_AddSuccess"));
                            this.pageToList();
                        },
                        this._("w_ServerFRSManager_ADDFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_ServerFRSManager_ADDFailed")
                    );
                });
        } else {
            // edit
            const datas: IFRSManagerEdit[] = [
                {
                    name: data.name,
                    protocol: data.protocol,
                    ip: data.ip,
                    port: data.port,
                    account: data.account,
                    password: data.password,
                    objectId: data.objectId,
                    userGroups: tempGroups ? tempGroups : []
                }
            ];

            const editParam = {
                datas
            };
            Loading.show();
            await this.$server
                .U("/partner/frs-manager", editParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_ServerFRSManager_EditSuccess"));
                            this.pageToList();
                        },
                        this._("w_ServerFRSManager_EditFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_ServerFRSManager_EditFailed")
                    );
                });
        }
    }

    async doDelete() {
        Dialog.confirm(
            this._("w_ServerFRSManager_DeleteConfirm"),
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
                        .D("/partner/frs-manager", deleteParam)
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
                     this.inputFormData.objectId === ""
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


                setUserGroupFRS?: any;

                /**
                 * @uiLabel - ${this._("w_Employee")}
                 * @uiHidden - ${ReportService.CheckObjectIfEmpty(
                     this.groupEmployee
                 )}
                 */
                employee?: ${toEnumInterface(this.groupEmployee as any, false)};


                /**
                 * @uiLabel - ${this._("w_VIP")}
                 * @uiHidden - ${ReportService.CheckObjectIfEmpty(
                     this.groupVIP
                 )}
                 */
                vip?: ${toEnumInterface(this.groupVIP as any, false)};


                /**
                 * @uiLabel - ${this._("w_Blacklist")}
                 * @uiHidden - ${ReportService.CheckObjectIfEmpty(
                     this.groupBlacklist
                 )}
                 */
                blacklist?: ${toEnumInterface(
                    this.groupBlacklist as any,
                    false
                )};

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
            customId?: string;


            /**
             * @uiLabel - ${this._("w_Name")}
             * @uiType - iv-form-label
             */
            name?: string;


            /**
             * @uiLabel - ${this._("w_Account")}
             * @uiType - iv-form-label
             */
            account?: string;


            /**
             * @uiLabel - ${this._("w_Protocol")}
             * @uiType - iv-form-label
             */
            protocol?: string;


            /**
             * @uiLabel - ${this._("w_Ip")}
             * @uiType - iv-form-label
             */
            ip?: string;


            /**
             * @uiLabel - ${this._("w_Port")}
             * @uiType - iv-form-label
             */
            port?: number;


            setUserGroupFRS?: any;

              /**
               * @uiLabel - ${this._("w_Employee")}
               * @uiType - iv-form-label
               */
              employeeName?: string;


              /**
               * @uiLabel - ${this._("w_VIP")}
               * @uiType - iv-form-label
               */
              vipName?: string;


              /**
               * @uiLabel - ${this._("w_Blacklist")}
               * @uiType - iv-form-label
               */
              blacklistName?: string;

            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>
