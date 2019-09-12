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
                    <template #floors="{$attrs}">
                        <div v-html="tableFloorString($attrs.row)"></div>
                    </template>
                    <template #company="{$attrs}">
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

    async initSelectItem() {
        this.selectItem.role = {};
        this.selectItem.company = {};
        this.selectItem.floor = {};
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
            companies: "",
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
                company: this.formCompanyText(param),
                companies: "",
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
            for (let loopData of param.role) {
                if (loopData.name == EUserRole.TenantAdministrator) {
                    this.inputFormData.useCompany = true;
                    this.inputFormData.useFloor = true;
                }
                this.inputFormData.realRoles.push(loopData.name);
            }
            if (param.datas != undefined) {
                if (
                    param.datas.company != undefined &&
                    param.datas.company.objectId != undefined
                ) {
                    this.inputFormData.companies = param.datas.company.objectId;
                }
                if (param.datas.floor != undefined) {
                    for (let loopFloor of param.datas.floor) {
                        this.inputFormData.floors.push(loopFloor.objectId);
                    }
                }
            }
        }
    }

    selectedItem(datas: any) {
        this.selectedDetail = datas;
    }

    // talbeRolesString(datas: any): string {
    //     let result: string = "";
    //     result += "<ul>";
    //     for (let loopData of datas) {
    //         let tempText = RoleService.roleString(this, loopData.name);
    //         result += `<li>${tempText}</li>`;
    //     }
    //     result += "</ul>";
    //     return result;
    // }

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
            // for (let loopData of datas.role) {
            //     result += `${loopData.name}, `;
            // }
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
                    companyId: this.inputFormData.companies,
                    floorIds: this.inputFormData.floors,
                    remark: this.inputFormData.remark
                }
            ]
        };

        if (this.inputFormData.phone != "") {
            datas.datas[0]["phone"] = this.inputFormData.phone;
        }
        if (this.inputFormData.objectId != "") {
            datas.datas[0]["objectId"] = this.inputFormData.objectId;
        }
        if (this.inputFormData.objectId == "") {
            datas.datas[0].password = this.inputFormData.password;

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
                 * @uiPlaceHolder - ${this._("w_Vms_Protocol")}
                 */
                protocol: string;

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




