<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :label="_('w_Account_AccountList')"
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
                    :server="{ path: '/user/web' }"
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

// Custom
import { EUserRole } from "@/services/Role";

// Service
import Dialog from "@/services/Dialog";
import RoleService from "@/services/Role/RoleService";
import ResponseFilter from "@/services/ResponseFilter";
import Loading from "@/services/Loading";
import RegexServices from "@/services/RegexServices";

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
        remark: "",
        rolesText: "",
        companiesText: "",
        floorsText: "",
        role: "",
        name: "",
        company: "",
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

    companies = [];

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

                    param = RegexServices.trim(param);
                    this.$server
                        .D("/user/web", param)
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

        if (RoleService.haveSystemAdministrator(this)) {
            await this.initSelectItemRole();
            await this.initSelectItemCompanyWithAPI();
        }

        if (RoleService.haveAdministrator(this)) {
            await this.initSelectItemRole();
            await this.initSelectItemCompanyWithAPI();
            for (const param of this.selectedDetail) {
                if (
                    param != undefined &&
                    param.company != undefined &&
                    param.company.objectId != undefined
                ) {
                    await this.initSelectItemFloorWithCompany(
                        param.company.objectId
                    );
                }
            }
        }

        if (RoleService.haveTenantAdministrator(this)) {
            await this.initSelectItemRole();
        }
    }

    haveSystemAdministrator() {
        return RoleService.haveSystemAdministrator(this);
    }

    haveAdministrator() {
        return RoleService.haveAdministrator(this);
    }

    haveTenantAdministrator() {
        return RoleService.haveTenantAdministrator(this);
    }

    initSelectItemRole() {
        let settingRole = {
            Administrator: false,
            TenantAdministrator: false
        };
        // check role can setting
        if (RoleService.haveSystemAdministrator(this)) {
            settingRole.Administrator = true;
        }

        if (
            !RoleService.haveSystemAdministrator(this) &&
            RoleService.haveAdministrator(this)
        ) {
            settingRole.TenantAdministrator = true;
        }

        // set setting
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
    }

    async initSelectItemCompanyWithAPI() {
        let param: any = { paging: { all: true } };

        param = RegexServices.trim(param);
        await this.$server
            .R("/location/company", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (
                        response.results != undefined &&
                        response.results.length > 0
                    ) {
                        this.companies = JSON.parse(
                            JSON.stringify(response.results)
                        );
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

    async initSelectItemCompanyWithStorage() {
        this.selectItem.company = {};
        this.selectItem.company[
            this.$user.user.data.company.objectId
        ] = this.$user.user.data.company.name;
    }

    async initSelectItemFloorWithAPI() {
        for (let ret of this.$user.user.data.floor) {
            if (ret.objectId != undefined && ret.name != undefined) {
                this.$set(this.selectItem.floor, ret.objectId, ret.name);
            }
        }
    }

    async initSelectItemFloorWithCompany(companyId: string) {
        this.selectItem.floor = {};
        for (let company of this.companies) {
            if (companyId == company.objectId) {
                for (let floor of company.floors) {
                    this.$set(
                        this.selectItem.floor,
                        floor.objectId,
                        floor.name
                    );
                }
                break;
            }
        }
    }

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            username: "",
            password: "",
            confirmPassword: "",
            role: "",
            name: "",
            email: "",
            phone: "",
            remark: "",
            rolesText: "",
            companiesText: "",
            floorsText: "",
            company: "",
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
                password: "",
                confirmPassword: "",
                role: "",
                name: "",
                email: param.email,
                phone: param.phone,
                remark: "",
                rolesText: this.formRoleText(param),
                companiesText: this.formCompanyText(param),
                floorsText: this.formFloorText(param),
                company: "",
                floors: [],
                realRoles: [],
                useCompany: false,
                useFloor: false
            };
            if (param.role != undefined) {
                this.inputFormData.role = param.role;
            }
            if (param.name != undefined) {
                this.inputFormData.name = param.name;
            }
            if (param.remark != undefined) {
                this.inputFormData.remark = param.remark;
            }
            if (param.role == EUserRole.TenantAdministrator) {
                this.inputFormData.useCompany = true;
                this.inputFormData.useFloor = true;
            }
            this.inputFormData.realRoles.push(param.role);

            if (
                param.company != undefined &&
                param.company.objectId != undefined
            ) {
                this.inputFormData.company = param.company.objectId;
            }
            if (param.floors != undefined) {
                for (let loopFloor of param.floors) {
                    this.inputFormData.floors.push(loopFloor.objectId);
                }
            }
        }
        console.log("!!!! rfg retgh etyh ", this.inputFormData);
    }

    selectedItem(datas: any) {
        this.selectedDetail = datas;
    }

    tableFloorString(datas: any): string {
        let result: string = "";
        result += "<ul>";
        if (datas != undefined && datas.floors != undefined) {
            for (let loopData of datas.floors) {
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
            datas != undefined &&
            datas.company != undefined &&
            datas.company.name != undefined
        ) {
            result += `<li>${datas.company.name}</li>`;
        }
        result += "</ul>";
        return result;
    }

    formRoleText(datas: any): string {
        let result: string = "";
        if (datas.role != undefined) {
            if (datas.role.length > 0) {
                result = result.substr(0, result.length - 2);
            }
            result = datas.role;
        }
        return result;
    }

    formCompanyText(datas: any): string {
        let result: string = "";
        if (
            datas != undefined &&
            datas.company != undefined &&
            datas.company.name != undefined
        ) {
            result = `${datas.company.name}`;
        }
        return result;
    }

    formFloorText(datas: any): string {
        let result: string = "";
        if (datas != undefined && datas.floors != undefined) {
            for (let loopData of datas.floors) {
                result += `${loopData.name}, `;
            }
            if (datas.floors.length > 0) {
                result = result.substr(0, result.length - 2);
            }
        }
        return result;
    }

    checkTenant() {
        this.inputFormData.useCompany = false;
        this.inputFormData.useFloor = false;
        for (let loopData of this.selectedDetail) {
            if (loopData.role != undefined) {
                for (let loopRole of loopData.role) {
                    if (loopRole.name == EUserRole.TenantAdministrator) {
                        this.inputFormData.useCompany = true;
                        this.inputFormData.useFloor = true;
                        break;
                    }
                }
            }
        }
    }

    updateModifyForm(datas: any) {
        if (datas.key == "role") {
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
        }
        if (datas.key == "company") {
            this.initSelectItemFloorWithCompany(datas.value);
        }
        this.inputFormData[datas.key] = datas.value;
    }

    async saveModifyForm(event: any) {
        let datas: any = {
            datas: [
                {
                    username: this.inputFormData.username,
                    name: this.inputFormData.name,
                    email: this.inputFormData.email,
                    role: this.inputFormData.role,
                    companyId: this.inputFormData.company,
                    floorIds: this.inputFormData.floors
                }
            ]
        };

        if (this.inputFormData.phone != "") {
            datas.datas[0]["phone"] = this.inputFormData.phone;
        }
        if (this.inputFormData.remark != "") {
            datas.datas[0]["remark"] = this.inputFormData.remark;
        }
        if (this.inputFormData.objectId != "") {
            datas.datas[0]["objectId"] = this.inputFormData.objectId;
        }
        if (this.inputFormData.objectId == "") {
            datas.datas[0].password = this.inputFormData.password;

            Loading.show();
            datas = RegexServices.trim(datas);
            await this.$server
                .C("/user/web", datas)
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
                .U("/user/web", datas)
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
                 * @uiLabel - ${this._("w_Account_UserName")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Account_Roles")}
                 */
                role: string;

                /**
                 * @uiLabel - ${this._("w_Account_FloorName")}
                 */
                floorName: string;

                /**
                 * @uiLabel - ${this._("w_Account_CompanyName")}
                 */
                companyName: string;

                /**
                 * @uiLabel - ${this._("w_Account_Email")}
                 */
                email: string;

                Actions: any;

            }
        `;
    }

    IViewForm() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_Account_Account")}
                 * @uiType - iv-form-label
                 */
                username: string;

                /**
                 * @uiLabel - ${this._("w_Account_Roles")}
                 * @uiType - iv-form-label
                 */
                rolesText: string;

                /*
                * @uiLabel - ${this._("w_Account_CompanyName")}
                * @uiType - iv-form-label
                */
                companiesText: string;

                /*
                * @uiLabel - ${this._("w_Account_FloorName")}
                * @uiType - iv-form-label
                */
                floorsText: string;

                /**
                 * @uiLabel - ${this._("w_Account_UserName")}
                 * @uiType - iv-form-label
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Account_UserTitles")}
                 * @uiType - iv-form-label
                 */
                titles?: string;

                /**
                 * @uiLabel - ${this._("w_Account_Phone")}
                 * @uiType - iv-form-label
                 */
                phone?: string;

                 /**
                 * @uiLabel - ${this._("w_Account_Email")}
                 * @uiType - iv-form-label
                 */
                email: string;

                 /**
                 * @uiLabel - ${this._("w_Account_Remark")}
                 * @uiType - iv-form-label
                 */
                remark?: string;
            }
        `;
    }

    IModifyForm() {
        return `
            interface {
                 /**
                 * @uiLabel - ${this._("w_Account_Account")}
                 * @uiType - ${
                     this.inputFormData.objectId == ""
                         ? "iv-form-string"
                         : "iv-form-label"
                 }
                 */
                username: string;

                /**
                 * @uiLabel - ${this._("w_Account_Password")}
                 * @uiType - iv-form-password
                 * @uiHidden - ${this.inputFormData.objectId != ""}
                 * @uiRequired - true
                 * @uiColumnGroup - password
                 */
                password?: string;

                /**
                 * @uiLabel - ${this._("w_Account_ConfirmPassword")}
                 * @uiType - iv-form-password
                 * @uiHidden - ${this.inputFormData.objectId != ""}
                 * @uiRequired - true
                 * @uiValidation - (value, all) => value === all.password
                 * @uiColumnGroup - password
                 */
                confirmPassword?: string;

                /**
                 * @uiLabel - ${this._("w_Account_Roles")}
                 * @uiType - ${
                     this.inputFormData.objectId != "" ? "iv-form-label" : ""
                 }
                 */
                role: ${toEnumInterface(this.selectItem.role, false)};

                /**
                 * @uiLabel - ${this._("w_Account_CompanyName")}
                 * @uiHidden - ${!this.inputFormData.useCompany}
                 * @uiDisabled - ${
                     this.inputFormData.objectId != "" ? true : false
                 }
                 */
                company: ${toEnumInterface(this.selectItem.company, false)};

                /**
                 * @uiLabel - ${this._("w_Account_FloorName")}
                 * @uiHidden - ${!this.inputFormData.useFloor}
                 */
                floors: ${toEnumInterface(this.selectItem.floor, true)};

                 /**
                 * @uiLabel - ${this._("w_Account_UserName")}
                 * @uiType - iv-form-string
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Account_UserTitles")}
                 */
                titles?: string;

                /**
                 * @uiLabel - ${this._("w_Account_Phone")}
                 * @uiValidation - ${RegexServices.regexItem.phoneNumber}
                 */
                phone?: string;

                 /**
                 * @uiLabel - ${this._("w_Account_Email")}
                 * @uiValidation - ${RegexServices.regexItem.email}
                 * @uiInvalidMessage - ${this._("w_Error_Email")}
                 */
                email: string;

                 /**
                 * @uiLabel - Remark
                 * @uiType - iv-form-textarea
                 */
                remark?: string;
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>




