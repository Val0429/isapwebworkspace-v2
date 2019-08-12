<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :label="_('w_User_AccountList')"
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
                    :server="{ path: '/users' }"
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

                    <template #roles="{$attrs}">
                        <div v-html="talbeRolesString($attrs.value)"></div>
                    </template>

                    <template #floorName="{$attrs}">
                        <div v-html="tableFloorString($attrs.row)"></div>
                    </template>
                    <template #companyName="{$attrs}">
                        <div v-html="tableCompanyString($attrs.row)"></div>
                    </template>

                </iv-table>
            </iv-card>

            <!-- view -->
            <iv-auto-card
                key="transition_2"
                v-show="transition.step === 2"
                :visible="true"
                :label="_('w_User_ViewUser') "
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
                :label="inputFormData.objectId == '' ? _('w_User_AddUser') : _('w_User_EditUser') "
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

            <!-- Modify Password -->
            <!-- <iv-auto-card
                key="transition_3_1"
                v-if="inputFormData.objectId != ''"
                v-show="transition.step === 3"
                :visible="true"
                :label="_('w_User_EditPassword')"
            >

                <iv-form
                    :interface="IPasswordForm()"
                    :value="inputFormData"
                    @update:*="updateModifyForm"
                    @submit="savePasswordForm($event)"
                >
                </iv-form>

            </iv-auto-card> -->

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Custom
import { EUserRole } from "@/services/Role";
import { IValSelectItem } from "@/services/VMS";

// Service
import Dialog from "@/services/Dialog";
import RoleService from "@/services/Role/RoleService";
import ResponseFilter from "@/services/ResponseFilter";
import Loading from "@/services/Loading";

@Component({
    components: {}
})
export default class SetupsAccount extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    tableMultiple: boolean = true;
    selectedDetail: any = [];

    inputFormData = {
        objectId: "",
        username: "",
        email: "",
        phone: "",
        rolesText: "",
        companiesText: "",
        floorsText: "",
        roles: "",
        companies: "",
        password: "",
        confirmPassword: "",
        floors: [],
        realRoles: [],
        useCompany: false,
        useFloor: false
    };

    selectItem: {
        role: any;
        company: any;
        floor: any;
    } = {
        role: {},
        company: {},
        floor: {}
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
        this.initSelectItem();
        this.clearInputData();
    }

    pageToEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        this.initSelectItem();
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
                    this.$server
                        .D("/users", param)
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

    async initSelectItem() {
        this.selectItem.role = {};
        this.selectItem.company = {};
        this.selectItem.floor = {};

        let haveRequest = {
            role: false,
            company: false,
            floor: false
        };

        if (RoleService.haveSystemAdministrator(this)) {
            if (!haveRequest.role) {
                await this.initSelectItemRole();
                haveRequest.role = true;
            }

            if (!haveRequest.company) {
                await this.initSelectItemCompany();
                haveRequest.company = true;
            }

            if (!haveRequest.floor) {
                await this.initSelectItemFloor();
                haveRequest.floor = true;
            }
        }

        if (RoleService.haveAdministrator(this)) {
            if (!haveRequest.role) {
                await this.initSelectItemRole();
                haveRequest.role = true;
            }

            if (!haveRequest.company) {
                await this.initSelectItemCompany();
                haveRequest.company = true;
            }

            if (!haveRequest.floor) {
                await this.initSelectItemFloor();
                haveRequest.floor = true;
            }
        }

        if (RoleService.haveTenantAdministrator(this)) {
            if (!haveRequest.role) {
                await this.initSelectItemRole();
                haveRequest.role = true;
            }

            if (!haveRequest.floor) {
                await this.initSelectItemFloor();
                haveRequest.floor = true;
            }
        }
    }

    initSelectItemRole() {
        let settingRole = {
            SystemAdministrator: false,
            Administrator: false,
            TenantAdministrator: false,
            TenantUser: false,
            Visitor: false
        };

        // check role can setting
        if (RoleService.haveSystemAdministrator(this)) {
            settingRole.SystemAdministrator = true;
            settingRole.Administrator = true;
        }

        if (RoleService.haveAdministrator(this)) {
            settingRole.TenantAdministrator = true;
        }

        if (RoleService.haveTenantAdministrator(this)) {
            settingRole.TenantUser = true;
        }

        // set setting
        if (settingRole.SystemAdministrator) {
            this.selectItem.role[EUserRole.SystemAdministrator] = this._(
                "w_Role_SystemAdministrator"
            );
        }
        if (settingRole.Administrator) {
            this.selectItem.role[EUserRole.Administrator] = this._(
                "w_Role_Administrator"
            );
        }
        if (settingRole.TenantAdministrator) {
            this.selectItem.role[EUserRole.TenantAdministrator] = this._(
                "w_Role_TenantAdministrator"
            );
        }
        if (settingRole.TenantUser) {
            this.selectItem.role[EUserRole.TenantUser] = this._(
                "w_Role_TenantUser"
            );
        }
        if (settingRole.Visitor) {
            this.selectItem.role[EUserRole.Visitor] = this._("w_Role_Visitor");
        }
    }

    async initSelectItemCompany() {
        let param: any = { paging: { all: true } };
        await this.$server
            .R("/flow1/companies", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (
                        response.results != undefined &&
                        response.results.length > 0
                    ) {
                        for (let ret of response.results) {
                            if (
                                ret.objectId != undefined &&
                                ret.name != undefined
                            ) {
                                this.$set(
                                    this.selectItem.company,
                                    ret.objectId,
                                    ret.name
                                );
                            }
                        }
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemFloor() {
        let param: any = { paging: { all: true } };
        await this.$server
            .R("/flow1/floors", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (
                        response.results != undefined &&
                        response.results.length > 0
                    ) {
                        for (let ret of response.results) {
                            if (
                                ret.objectId != undefined &&
                                ret.name != undefined
                            ) {
                                this.$set(
                                    this.selectItem.floor,
                                    ret.objectId,
                                    ret.name
                                );
                            }
                        }
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            username: "",
            email: "",
            phone: "",
            rolesText: "",
            companiesText: "",
            floorsText: "",
            roles: "",
            companies: "",
            password: "",
            confirmPassword: "",
            floors: [],
            realRoles: [],
            useCompany: false,
            useFloor: false
        };
    }

    getInputData() {
        this.checkTenant();
        for (const param of this.selectedDetail) {
            this.inputFormData = {
                objectId: param.objectId,
                username: param.username,
                email: param.publicEmailAddress,
                phone: param.phone,
                rolesText: this.formRoleText(param),
                companiesText: this.formCompanyText(param),
                floorsText: this.formFloorText(param),
                roles: "",
                companies: "",
                password: "",
                confirmPassword: "",
                floors: [],
                realRoles: [],
                useCompany: false,
                useFloor: false
            };
            if (param.roles != undefined && param.roles[0] != undefined) {
                this.inputFormData.roles = param.roles[0].name;
            }
            for (let loopData of param.roles) {
                if (loopData.name == EUserRole.TenantAdministrator) {
                    this.inputFormData.useCompany = true;
                    this.inputFormData.useFloor = true;
                }
                if (loopData.name == EUserRole.TenantUser) {
                    this.inputFormData.useFloor = true;
                }
                this.inputFormData.realRoles.push(loopData.name);
            }
            if (param.data != undefined) {
                if (
                    param.data.company != undefined &&
                    param.data.company.objectId != undefined
                ) {
                    this.inputFormData.companies = param.data.company.objectId;
                }
                if (param.data.floor != undefined) {
                    for (let loopFloor of param.data.floor) {
                        this.inputFormData.floors.push(loopFloor.objectId);
                    }
                }
            }
        }
    }

    selectedItem(datas: any) {
        this.selectedDetail = datas;
    }

    talbeRolesString(datas: any): string {
        let result: string = "";
        result += "<ul>";
        for (let loopData of datas) {
            let tempText = RoleService.roleString(this, loopData.name);
            result += `<li>${tempText}</li>`;
        }
        result += "</ul>";
        return result;
    }

    tableFloorString(datas: any): string {
        let result: string = "";
        result += "<ul>";
        if (datas.data != undefined && datas.data.floor != undefined) {
            for (let loopData of datas.data.floor) {
                let tempText = loopData.name;
                result += `<li>${tempText}</li>`;
            }
        }
        result += "</ul>";
        return result;
    }

    tableCompanyString(datas: any): string {
        let result: string = "";
        result += "<ul>";
        if (
            datas.data != undefined &&
            datas.data.company != undefined &&
            datas.data.company.name != undefined
        ) {
            result += `<li>${datas.data.company.name}</li>`;
        }
        result += "</ul>";
        return result;
    }

    formRoleText(datas: any): string {
        let result: string = "";
        if (datas.roles != undefined) {
            for (let loopData of datas.roles) {
                result += `${loopData.name}, `;
            }
            if (datas.roles.length > 0) {
                result = result.substr(0, result.length - 2);
            }
        }
        return result;
    }

    formCompanyText(datas: any): string {
        let result: string = "";
        if (
            datas.data != undefined &&
            datas.data.company != undefined &&
            datas.data.company.name != undefined
        ) {
            result = `${datas.data.company.name}`;
        }
        return result;
    }

    formFloorText(datas: any): string {
        let result: string = "";
        if (datas.data != undefined && datas.data.floor != undefined) {
            for (let loopData of datas.data.floor) {
                result += `${loopData.name}, `;
            }
            if (datas.data.floor.length > 0) {
                result = result.substr(0, result.length - 2);
            }
        }
        return result;
    }

    checkTenant() {
        this.inputFormData.useCompany = false;
        this.inputFormData.useFloor = false;
        for (let loopData of this.selectedDetail) {
            if (loopData.roles != undefined) {
                for (let loopRole of loopData.roles) {
                    if (loopRole.name == EUserRole.TenantAdministrator) {
                        this.inputFormData.useCompany = true;
                        this.inputFormData.useFloor = true;
                        break;
                    }
                    if (loopRole.name == EUserRole.TenantUser) {
                        this.inputFormData.useFloor = true;
                        break;
                    }
                }
            }
        }
    }

    updateModifyForm(datas: any) {
        if (datas.key == "roles") {
            if (datas.value == EUserRole.SystemAdministrator) {
                this.inputFormData.useCompany = false;
                this.inputFormData.useFloor = false;
            }
            if (datas.value == EUserRole.Administrator) {
                this.inputFormData.useCompany = false;
                this.inputFormData.useFloor = false;
            }
            if (datas.value == EUserRole.TenantAdministrator) {
                this.inputFormData.useCompany = true;
                this.inputFormData.useFloor = true;
            }
            if (datas.value == EUserRole.TenantUser) {
                this.inputFormData.useCompany = false;
                this.inputFormData.useFloor = true;
            }
            if (datas.value == EUserRole.Visitor) {
                this.inputFormData.useCompany = false;
                this.inputFormData.useFloor = false;
            }
        }
        this.inputFormData[datas.key] = datas.value;
    }

    async saveModifyForm(event: any) {
        let param: any = {
            objectId: this.inputFormData.objectId,
            username: this.inputFormData.username,
            phone: this.inputFormData.phone,
            publicEmailAddress: this.inputFormData.email,
            roles: [this.inputFormData.roles],
            data: {
                company: this.inputFormData.companies,
                description: "",
                floor: this.inputFormData.floors
            }
        };

        // append old role
        for (let loopData of this.inputFormData.realRoles) {
            let haveLoopData = false;
            for (let paramData of param.roles) {
                if (loopData == paramData) {
                    haveLoopData = true;
                    break;
                }
            }
            if (!haveLoopData) {
                param.roles.push(loopData);
            }
        }

        // check TenantAdministrator and company
        if (
            param.data.company == "" &&
            RoleService.haveTenantAdministrator(this)
        ) {
            if (
                this.$user.user != undefined &&
                this.$user.user.data != undefined &&
                this.$user.user.data.company != undefined &&
                this.$user.user.data.company.objectId != undefined
            ) {
                param.data.company = this.$user.user.data.company.objectId;
            }
        }

        if (param.objectId == "") {
            param.password = this.inputFormData.password;
            Loading.show();
            await this.$server
                .C("/users", param)
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
            await this.$server
                .U("/users", param)
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

    // savePasswordForm(event: any) {
    //     console.log("!!! savePasswordForm", this.inputFormData);
    // }

    ITableList() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;

                /**
                 * @uiLabel - ${this._("w_User_UserName")}
                 */
                username: string;

                /**
                 * @uiLabel - ${this._("w_User_Roles")}
                 */
                roles: string;

                /**
                 * @uiLabel - ${this._("w_User_FloorName")}
                 */
                floorName: string;

                /**
                 * @uiLabel - ${this._("w_User_CompanyName")}
                 */
                companyName: string;

                /**
                 * @uiLabel - ${this._("w_User_Email")}
                 */
                publicEmailAddress: string;

                Actions: any;

            }
        `;
    }

    IViewForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_User_UserName")}
                 * @uiType - iv-form-label
                 */
                username?: string;

                /**
                 * @uiLabel - ${this._("w_User_Roles")}
                 * @uiType - iv-form-label
                 */
                rolesText?: string;

                 /**
                 * @uiLabel - ${this._("w_User_Email")}
                 * @uiType - iv-form-label
                 */
                email?: string;

                /**
                 * @uiLabel - ${this._("w_User_Phone")}
                 * @uiType - iv-form-label
                 */
                phone?: string;

                /**
                 * @uiLabel - ${this._("w_User_CompanyName")}
                 * @uiType - iv-form-label
                 * @uiHidden - ${!this.inputFormData.useCompany}
                 */
                companiesText?: any;

                /**
                 * @uiLabel - ${this._("w_User_FloorName")}
                 * @uiType - iv-form-label
                 * @uiHidden - ${!this.inputFormData.useFloor}
                 */
                floorsText?: string;

            }
        `;
    }

    IModifyForm() {
        return `
            interface {
                 /**
                 * @uiLabel - ${this._("w_User_UserName")}
                 * @uiType - ${
                     this.inputFormData.objectId == ""
                         ? "iv-form-string"
                         : "iv-form-label"
                 }
                 */
                username: string;

                /**
                 * @uiLabel - ${this._("w_User_Roles")}
                 * @uiType - iv-form-label
                 * @uiHidden - ${this.inputFormData.objectId == ""}
                 */
                rolesText?: string;

                /**
                 * @uiLabel - ${this._("w_User_Roles")}
                 * @uiHidden - ${this.inputFormData.objectId != ""}
                 */
                roles?: ${toEnumInterface(this.selectItem.role, false)};

                 /**
                 * @uiLabel - ${this._("w_User_Email")}
                 */
                email: string;

                /**
                 * @uiLabel - ${this._("w_User_Phone")}
                 */
                phone: string;

                /**
                 * @uiLabel - ${this._("w_User_CompanyName")}
                 * @uiHidden - ${!this.inputFormData.useCompany}
                 * @uiRequired - true
                 */
                companies?: ${toEnumInterface(this.selectItem.company, false)};

                /**
                 * @uiLabel - ${this._("w_User_FloorName")}
                 * @uiHidden - ${!this.inputFormData.useFloor}
                 * @uiRequired - true
                 */
                floors?: ${toEnumInterface(this.selectItem.floor, true)};

                /**
                 * @uiLabel - ${this._("w_User_Password")}
                 * @uiType - iv-form-password
                 * @uiHidden - ${this.inputFormData.objectId != ""}
                 * @uiRequired - true
                 */
                password?: string;

                /**
                 * @uiLabel - ${this._("w_User_ConfirmPassword")}
                 * @uiType - iv-form-password
                 * @uiHidden - ${this.inputFormData.objectId != ""}
                 * @uiRequired - true
                 * @uiValidation - (value, all) => value === all.password
                 */
                confirmPassword?: string;
            }
        `;
    }

    IPasswordForm() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_User_Password")}
                 * @uiType - iv-form-password
                 */
                password: string;

                /**
                 * @uiLabel - ${this._("w_User_ConfirmPassword")}
                 * @uiType - iv-form-password
                 * @uiValidation - (value, all) => value === all.password
                 */
                confirmPassword: string;
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>




