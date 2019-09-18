<template>
    <div class="animated fadeIn">
        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
            v-if="!showProgress"
        >
            <!-- List -->
            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :label=" _('w_Person_PersonList') "
            >
                <template #toolbox>

                    <iv-toolbox-view
                        :disabled="selectedDetail.length !== 1"
                        @click="pageToView"
                    />
                    <!-- <iv-toolbox-edit
                        :disabled="selectedDetail.length !== 1"
                        @click="pageToEdit()"
                    /> -->
                    <iv-toolbox-delete
                        :disabled="selectedDetail.length === 0"
                        @click="doDelete"
                    />
                    <iv-toolbox-divider />
                    <iv-toolbox-add @click="pageToAdd()" />
                    <ivc-toolbox-sync-excel @click="pageToProgress()" />

                </template>

                <iv-table
                    ref="listTable"
                    :interface="ITableList()"
                    :multiple="tableMultiple"
                    :server="{ path: '/person/staff' }"
                    @selected="selectedItem($event)"
                >

                    <template #imageBase64="{ $attrs }">
                        <img
                            :src="newImgSrc"
                            style="margin-left: 30px;"
                        />
                    </template>

                    <template #floors="{$attrs, $listeners}">
                        <ul>
                            <li v-for="floor in $attrs.row.floors">
                                {{floor.name}}
                            </li>
                        </ul>
                    </template>

                    <template #Actions="{$attrs, $listeners}">
                        <iv-toolbox-more :disabled="selectedDetail.length !== 1">
                            <iv-toolbox-view @click="pageToView" />
                            <!-- <iv-toolbox-edit @click="pageToEdit()" /> -->
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
                :label=" _('w_Account_ViewUser') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IViewForm()"
                    :value="inputFormData"
                >
                    <template #imageBase64="{$attrs}">
                        <img
                            :src="$attrs.value"
                            alt=""
                        >
                    </template>

                    <template #image>
                        <img
                            class="form-image"
                            :src="newImgSrc"
                        />
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
                :label="inputFormData.objectId == '' ? _('w_Person_AddStaff') :  _('w_Person_EditStaff')"
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IModifyForm()"
                    :value="inputFormData"
                    @update:*="updateInputFormData"
                    @submit="saveAddOrEdit($event)"
                >

                    <template #image>
                        <img
                            class="form-image"
                            :src="newImgSrc"
                        />
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

        <!-- Progress -->
        <person-progress v-else />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import { Ws } from "@/services/WebSocket/Ws";
import personProgress from "@/views/Persons/PersonProgress.vue";

// Custom
import { EUserRole } from "@/services/Role";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import RegexServices from "@/services/RegexServices";
import ImageBase64 from "@/services/ImageBase64";
import RoleService from "@/services/Role/RoleService";
import Datetime from "@/services/Datetime";
import ServerConfig from "@/services/ServerConfig";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

@Component({
    components: { personProgress }
})
export default class SetupsFloor extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    tableMultiple: boolean = true;
    selectedDetail: any = [];
    newImg = new Image();
    newImgSrc = ImageBase64.pngEmpty;

    inputFormData: any = {
        objectId: "",
        email: "",
        phone: "",
        remark: "",
        companiesText: "",
        floorsText: "",
        name: "",
        companyId: "",
        floorIds: [],
        imageBase64: "",
        nric: "",
        realRoles: [],
        card: "",
        useCompany: false,
        useFloor: false,
        agreeTc: false,
        isUseSuntecReward: false,
        isUseSuntecRewardString: "",
        startDateString: "",
        endDateString: ""
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

    showProgress: boolean = false;

    async created() {}

    mounted() {}

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

    async pageToAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        this.clearInputData();
        await this.initSelectItem();
    }

    async pageToEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        this.clearInputData();
        await this.initSelectItem();
        this.getInputData();
    }

    pageToProgress() {
        this.showProgress = true;
    }
    clearInputData() {
        this.newImgSrc = ImageBase64.pngEmpty;
        this.inputFormData = {
            objectId: "",
            email: "",
            phone: "",
            remark: "",
            companiesText: "",
            floorsText: "",
            name: "",
            companyId: "",
            floorIds: [],
            imageBase64: "",
            nric: "",
            realRoles: [],
            card: "",
            useCompany: false,
            useFloor: false,
            agreeTc: false,
            isUseSuntecReward: false,
            isUseSuntecRewardString: "",
            startDateString: "",
            endDateString: ""
        };
    }

    selectedItem(data) {
        this.selectedDetail = data;
    }

    async getInputData() {
        for (const param of this.selectedDetail) {
            let floors = [];
            for (let tempFloor of param.floors) {
                floors.push(tempFloor.objectId);
            }
            this.newImgSrc = param.imageBase64;
            this.inputFormData = {
                objectId: param.objectId,
                name: param.name,
                email: param.email,
                imageBase64: param.imageBase64,
                isUseSuntecReward: param.isUseSuntecReward,
                isUseSuntecRewardString: param.isUseSuntecReward
                    ? this._("wb_Yes")
                    : this._("wb_No"),
                nric: param.nric,
                companyId: param.company.objectId,
                floorIds: floors,
                phone: param.phone,
                position: param.position,
                remark: param.remark,
                unitNumber: param.unitNumber,
                card: param.card,
                startDate: new Date(param.startDate),
                endDate: new Date(param.endDate),
                startDateString: Datetime.DateTime2String(
                    new Date(param.startDate),
                    "YYYY-MM-DD"
                ),
                endDateString: param.endDate
                    ? Datetime.DateTime2String(
                          new Date(param.endDate),
                          "YYYY-MM-DD"
                      )
                    : ""
            };
        }
    }

    updateInputFormData(data) {
        if (data.key == "imageBase64") {
            ImageBase64.fileToBase64(data.value, (base64 = "") => {
                if (base64 != "") {
                    this.newImg = new Image();
                    this.newImg.src = base64;
                    this.newImg.onload = () => {
                        this.newImgSrc = base64;
                        return;
                    };
                } else {
                    Dialog.error(this._("w_Region_ErrorFileToLarge"));
                }
            });
        }
        if (data.key == "companyId") {
            this.initSelectItemFloorWithCompany(data.value);
        }
        if (data.key == "agreeTc") {
            if (data.value) {
                this.inputFormData.check = true;
            } else {
                this.inputFormData.check = undefined;
            }
        }
        this.inputFormData[data.key] = data.value;
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

        if (
            RoleService.haveTenantAdministrator(this) &&
            !RoleService.haveAdministrator(this) &&
            !RoleService.haveSystemAdministrator(this)
        ) {
            await this.initSelectItemRole();
            await this.initSelectItemCompanyWithStorage();
            await this.initSelectItemFloorWithAPI();
        }
    }

    initSelectItemRole() {
        let settingRole = {
            SystemAdministrator: false,
            Administrator: false,
            TenantAdministrator: false
        };

        // check role can setting
        if (RoleService.haveSystemAdministrator(this)) {
            settingRole.Administrator = true;
        }

        if (RoleService.haveAdministrator(this)) {
            settingRole.TenantAdministrator = true;
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
            this.$user.user.company.objectId
        ] = this.$user.user.company.name;
    }

    async initSelectItemFloorWithAPI() {
        for (let ret of this.$user.user.floors) {
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

    async saveAddOrEdit(data) {
        let param: any = {
            datas: [
                {
                    isUseSuntecReward: data.isUseSuntecReward,
                    floorIds: data.floors,
                    companyId: data.companyId,
                    name: data.name,
                    email: data.email,
                    nric: data.nric,
                    position: data.position,
                    phone: data.phone,
                    remark: data.remark,
                    startDate: data.startDate,
                    endDate: data.endDate
                }
            ]
        };

        if (param.datas[0].companyId == undefined) {
            if (this.$user.user.company && this.$user.user.company.objectId) {
                param.datas[0].companyId = this.$user.user.company.objectId;
            }
        }

        if (param.datas[0].companyId == undefined) {
            Dialog.error(this._("w_Person_ErrorCompanyUndefined"));
            return false;
        }

        if (this.newImgSrc !== ImageBase64.pngEmpty) {
            param.datas[0]["imageBase64"] = this.newImgSrc;
        }

        // check
        if (
            param.datas[0]["imageBase64"] == undefined &&
            !param.datas[0].isUseSuntecReward
        ) {
            Dialog.error(this._("w_Person_ErrorMediaType"));
            return false;
        }

        if (
            param.datas[0].nric &&
            param.datas[0].nric != "" &&
            !RegexServices.nric(param.datas[0].nric)
        ) {
            Dialog.error(this._("w_Person_ErrorNricRegex"));
            return false;
        }

        if (!RegexServices.email(param.datas[0].email)) {
            Dialog.error("Email format error");
            return false;
        }

        // add
        if (!this.inputFormData.objectId) {
            Loading.show();
            param = RegexServices.trim(param);
            await this.$server
                .C("/person/staff", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Dialog_SuccessTitle"));
                            this.pageToList();
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else {
            param.datas[0].objectId = data.objectId;

            Loading.show();
            param = RegexServices.trim(param);
            await this.$server
                .U("/person/staff", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            if (response.datas) {
                                if (response.datas[0].statusCode == 200) {
                                    Dialog.success(
                                        this._("w_Dialog_SuccessTitle")
                                    );
                                    this.pageToList();
                                } else {
                                    Dialog.error(response.message);
                                }
                            }
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_Dialog_ErrorTitle")
                    );
                });
        }
    }

    tableStatus(values: any) {
        let result = "";
        for (const value of values) {
            value;
        }
    }

    async doDelete() {
        Dialog.confirm(
            this._("w_Person_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                for (const deleteParam of this.selectedDetail) {
                    let param: {
                        objectId: string;
                    } = {
                        objectId: deleteParam.objectId
                    };

                    Loading.show();
                    param = RegexServices.trim(param);
                    this.$server
                        .D("/person/staff", param)
                        .then((response: any) => {
                            ResponseFilter.successCheck(
                                this,
                                response,
                                (response: any) => {
                                    if (response.datas) {
                                        if (
                                            response.datas[0].statusCode == 200
                                        ) {
                                            this.pageToList();
                                        } else {
                                            Dialog.error(response.message);
                                        }
                                    }
                                },
                                this._("w_DeleteFailed")
                            );
                        })
                        .catch((e: any) => {
                            return ResponseFilter.catchError(this, e);
                        });

                    Loading.hide();
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
                 * @uiLabel - ${this._("w_Person_Name")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Person_Floor")}
                 */
                floors: any;

                /**
                 * @uiLabel - ${this._("w_Person_Enable_Permission")}
                 */
                startDate: Date;

                /**
                 * @uiLabel - ${this._("w_Person_Disable_Permission")}
                 */
                endDate: Date;

                /**
                 * @uiLabel - ${this._("w_Person_createdAt")}
                 */
                createdAt: Date;

                /**
                 * @uiLabel - ${this._("w_Person_createdUser")}
                 */
                createdUser: string;

                /**
                 * @uiLabel - ${this._("w_Person_updateAt")}
                 */
                updateAt: Date;

                /**
                 * @uiLabel - ${this._("w_Person_updateUser")}
                 */
                updateUser: string;

                Actions: any;
            }
        `;
    }

    IViewForm() {
        return `
            interface {

                image?: any;

                /**
                 * @uiLabel - ${this._("w_Person_Name")}
                 * @uiType - iv-form-label
                 */
                name: string;               

                /**
                 * @uiLabel - ${this._("w_Person_Company")}
                 * @uiType - iv-form-label
                 * @uiHidden - ${!this.inputFormData.useCompany}
                 */
                companyId: any;

                /**
                 * @uiLabel - ${this._("w_Person_Floor")}
                 * @uiType - iv-form-label
                 * @uiHidden - ${!this.inputFormData.useFloor}
                 */
                floorIds: string;

                /**
                 * @uiLabel - ${this._("w_Person_Email")}
                 * @uiType - iv-form-label
                 */
                email: string;
                
                /**
                 * @uiLabel - ${this._("w_Person_Agree_App")}
                 * @uiType - iv-form-label
                 */
                isUseSuntecRewardString?: string;
                
                /**
                 * @uiLabel - ${this._("w_Person_Remark")}
                 * @uiType - iv-form-label
                 */
                remark?: string;

                /**
                 * @uiLabel - ${this._("w_Person_Enable_Permission")}
                 * @uiColumnGroup - date-group
                 * @uiType - iv-form-label
                 */
                startDateString: string;

                /**
                 * @uiLabel - ${this._("w_Person_Disable_Permission")}
                 * @uiColumnGroup - date-group
                 * @uiType - iv-form-label
                 */
                endDateString?: string;
                
                /**
                 * @uiLabel - ${this._("w_Person_Card_Number")}
                 * @uiType - iv-form-label
                 */
                card?: number;

                /**
                 * @uiLabel - ${this._("w_Person_NRIC")}
                 * @uiType - iv-form-label
                 */
                nric?: string;
            }
        `;
    }

    IModifyForm() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_Person_Image")}
                 * @uiType - iv-form-file
                 */
                imageBase64?: any;

                image?: any;

                /**
                 * @uiLabel - ${this._("w_Person_Name")}
                 * @uiType - iv-form-string
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Account_UserTitles")}
                 * @uiType - iv-form-string
                 */
                position?: string;

                /**
                 * @uiLabel - ${this._("w_Account_Phone")}
                 * @uiType - iv-form-string
                 * @uiValidation - ${RegexServices.regexItem.phoneNumber}
                 */
                phone?: string;

                /**
                 * @uiLabel - ${this._("w_Person_Company")}
                 * @uiHidden - ${
                     this.$user.user.roles[0].name !== "TenantAdministrator"
                         ? false
                         : true
                 }
                 */
                companyId: ${toEnumInterface(this.selectItem.company, false)};

                /**
                 * @uiLabel - ${this._("w_Person_Floor")}
                 */
                floors: ${toEnumInterface(this.selectItem.floor, true)};

                /**
                 * @uiLabel - ${this._("w_Person_Email")}
                 * @uiValidation - ${RegexServices.regexItem.email}
                 */
                email: string;

                /**
                 * @uiLabel - ${this._("w_Person_Agree_Tc")}
                 * @uiType - iv-form-switch
                 */
                agreeTc: boolean;
                
                /**
                 * @uiLabel - ${this._("w_Person_Agree_App")}
                 * @uiType - iv-form-switch
                 * @uiDisabled- true
                 */
                isUseSuntecReward?: boolean;
                
                /**
                 * @uiLabel - ${this._("w_Person_Remark")}
                 * @uiType - iv-form-textarea
                 */
                remark?: string;

                /**
                 * @uiLabel - ${this._("w_Person_Enable_Permission")}
                 * @uiType - iv-form-date
                 * @uiColumnGroup - date-group
                 */
                startDate: Date;

                /**
                 * @uiLabel - ${this._("w_Person_Disable_Permission")}
                 * @uiType - iv-form-date
                 * @uiColumnGroup - date-group
                 */
                endDate?: Date;

                /**
                 * @uiLabel - ${this._("w_Person_NRIC")}
                 */
                nric?: string;

                check: any;
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
.form-image {
    max-width: 100px;
    max-height: 100px;
    margin-left: 30px;
}
</style>
