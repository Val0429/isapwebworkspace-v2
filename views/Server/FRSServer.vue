<template>
    <div class="animated fadeIn">
        <iv-card
            v-show="pageStep === ePageStep.list"
            :label=" _('w_ServerFRS_List') "
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
                :server="{ path: '/partner/frs' }"
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
            :label="pageStep === ePageStep.add ? _('w_ServerFRS_Add') :  _('w_ServerFRS_Edit')"
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
                        <b-button
                            @click="clickToSetUserGroupInFRS">
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

        <!-- view -->
        <iv-card
            v-show="pageStep === ePageStep.view"
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

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import { IFRSServerResults, IAddFRSServer, IEditFRSServer, IFRSServerReadUserGroup, IFRSUserGroup } from "@/config/default/api/interfaces";

import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog/Dialog";

interface IInputFormData extends IFRSServerResults {
    type?: string;
    employee?: string;
    employeeName?: string;
    vip?: string;
    vipName?: string;
    blacklist?: string;
    blacklistName?: string;
}

enum EPageStep {
    list = "list",
    add = "add",
    edit = "edit",
    view = "view",
    none = "none"
}

enum EUserGroup {
    employee = "employee",
    blacklist = "blacklist",
    vip = "vip",
}

@Component({
    components: {}
})
export default class FRSServer extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.list;

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
        wsport: null,
        account: "",
        password: "",
        type: "",
        employee: '',
        vip: '',
        blacklist: ''
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
            wsport: null,
            account: "",
            password: "",
            type: "",
            employee: '',
            vip: '',
            blacklist: ''
        };
    }

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
    }

   async initUserGroupInFRS() {
        const configObject: IFRSServerReadUserGroup = {
            ip: this.inputFormData.ip,
            port: this.inputFormData.port,
            wsport: this.inputFormData.wsport,
            protocol: this.inputFormData.protocol,
            account: this.inputFormData.account,
            password: this.inputFormData.password,
        };

        const addParam = {
            config: configObject
        };

        let results = await this.$server
            .C("/partner/frs/user-group", addParam)
            // .then((response: any) => {
            //     for (const returnValue of response) {
            //         if (returnValue.statusCode === 200) {
            //             Dialog.success(this._("w_ServerFRS_AddSuccess"));
            //             this.pageToList();
            //         }
            //         if (returnValue.statusCode === 500) {
            //             Dialog.error(this._("w_ServerFRS_ADDFailed"));
            //             return false;
            //         }
            //         if (returnValue.statusCode === 400) {
            //             Dialog.error(this._("w_ServerFRS_ADDDuplicate"));
            //             return false;
            //         }
            //     }
            // })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                if (e.res.statusCode == 400) {
                    Dialog.error(this._("w_WrongConfig"));
                    return false;
                }
                console.log(e);
                return false;
            });

        this.groupData = results;

        let tempBlacklist = {};
        let tempVIP = {};
        let tempEmployee = {};

        if (this.groupData.length === 0) {
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
                }
            }
        }

    }

    getInputData() {
        this.clearInputData();
        console.log('this.selectedDetail - ', this.selectedDetail);
        for (const param of this.selectedDetail) {

            this.inputFormData = {
                objectId: param.objectId,
                customId: param.customId,
                ip: param.ip,
                account: param.account,
                name: param.name,
                password: param.password,
                port: param.port,
                wsport: param.wsport,
                protocol: param.protocol,
            };

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
            case "wsport":
                this.inputFormData.wsport = data.value;
                break;
        }
    }

    pageToAdd(type: string) {
        this.pageStep = EPageStep.add;
        this.clearInputData();
        this.inputFormData.type = type;
    }

    async pageToEdit(type: string) {
        this.pageStep = EPageStep.edit;
        this.getInputData();
        this.inputFormData.type = type;

        await this.initUserGroupInFRS();
    }

    async pageToView() {
        this.pageStep = EPageStep.view;
        this.getInputData();
    }

    pageToList() {
        this.pageStep = EPageStep.list;
        (this.$refs.listTable as any).reload();
    }

    async clickToSetUserGroupInFRS() {
        if (
            !this.inputFormData.ip ||
            !this.inputFormData.port ||
            !this.inputFormData.wsport ||
            !this.inputFormData.protocol ||
            !this.inputFormData.account ||
            !this.inputFormData.password
        ) {
            Dialog.error(this._("w_ErrorConfig"));
            return false;
        }

        await this.initUserGroupInFRS();
    }

    async saveAddOrEdit(data) {
        console.log('data - ', data);

        // add
        if (this.inputFormData.type === EPageStep.add) {

            let userGroups: IFRSUserGroup = {
                type: '',
                objectId: '',
                name: '',
            };

            let tempGroups: any = [];
            let tempUserGroups = JSON.parse(JSON.stringify(userGroups));

            this.groupData.map(item => {
                console.log('item - ', item);
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


            const datas: IAddFRSServer[] = [
                {
                    customId: data.customId,
                    name: data.name,
                    protocol: data.protocol,
                    ip: data.ip,
                    wsport: data.wsport,
                    port: data.port,
                    account: data.account,
                    password: data.password,
                    userGroups: tempGroups
                }
            ];

            const addParam = {
                datas
            };

            console.log('addParam - ', addParam);

            await this.$server
                .C("/partner/frs", addParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(this._("w_ServerFRS_AddSuccess"));
                            this.pageToList();
                        }
                        if (returnValue.statusCode === 500) {
                            Dialog.error(this._("w_ServerFRS_ADDFailed"));
                            return false;
                        }
                        if (returnValue.statusCode === 400) {
                            Dialog.error(this._("w_ServerFRS_ADDDuplicate"));
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    if (e.res.statusCode == 500) {
                        Dialog.error(this._("w_ServerFRS_ADDFailed"));
                        return false;
                    }
                    console.log(e);
                    return false;
                });
        }

        // edit
        if (this.inputFormData.type === EPageStep.edit) {
            const datas: IEditFRSServer[] = [
                {
                    name: data.name,
                    protocol: data.protocol,
                    ip: data.ip,
                    port: data.port,
                    wsport: data.wsport,
                    account: data.account,
                    password: data.password,
                    objectId: data.objectId
                }
            ];

            const editParam = {
                datas
            };

            await this.$server
                .U("/partner/frs", editParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(this._("w_ServerFRS_EditSuccess"));
                            this.pageToList();
                        }
                        if (returnValue.statusCode === 500) {
                            Dialog.error(this._("w_ServerFRS_EditFailed"));
                            return false;
                        }
                        if (returnValue.statusCode === 400) {
                            Dialog.error(this._("w_ServerFRS_EditDuplicate"));
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    if (e.res.statusCode == 500) {
                        Dialog.error(this._("w_ServerFRS_EditFailed"));
                        return false;
                    }
                    console.log(e);
                    return false;
                });
        }
    }

    async doDelete() {
        Dialog.confirm(
            this._("w_ServerFRS_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                for (const param of this.selectedDetail) {
                    const deleteUserParam: {
                        objectId: string;
                    } = {
                        objectId: param.objectId
                    };

                    this.$server
                        .D("/partner/frs", deleteUserParam)
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
                            if (
                                e.res &&
                                e.res.statusCode &&
                                e.res.statusCode == 401
                            ) {
                                return ResponseFilter.base(this, e);
                            }
                            console.log(e);
                        });
                }
            }
        );
    }

    checkObject(obj: object): boolean {
        const result = Object.keys(obj);
        return result.length === 0;
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


                /**
                 * @uiLabel - ${this._("w_ServerFRS_wsport")}
                 * @uiPlaceHolder - ${this._("w_Port_PlaceHolder")}
                 * @uiAttrs - { max: 65535, min: 1}
                 */
                wsport: number;

                setUserGroupFRS?: any;

                /**
                 * @uiLabel - ${this._("w_Employee")}
                 * @uiHidden - ${this.checkObject(this.groupEmployee)}
                 */
                employee: ${toEnumInterface(this.groupEmployee as any, false)};


                /**
                 * @uiLabel - ${this._("w_VIP")}
                 * @uiHidden - ${this.checkObject(this.groupVIP)}
                 */
                vip: ${toEnumInterface(this.groupVIP as any, false)};


                /**
                 * @uiLabel - ${this._("w_Blacklist")}
                 * @uiHidden - ${this.checkObject(this.groupBlacklist)}
                 */
                blacklist: ${toEnumInterface(this.groupBlacklist as any, false)};

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


            /**
             * @uiLabel - ${this._("w_ServerFRS_wsport")}
             * @uiType - iv-form-label
             */
             wsport?: number;

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
