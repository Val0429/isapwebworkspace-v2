<template>
    <div class="animated fadeIn m-2">

        <!-- view -->
        <iv-card
            v-show="pageStep === ePageStep.view"
            :visible="true"
            :data="{ label: _('w_MyProfile_ViewMyProfile') }"
        >
            <template #toolbox>
                <iv-toolbox-editmyprofile @click="pageToEdit" />
                <iv-toolbox-changepassword @click="pageToChangePassword" />
            </template>

            <iv-form
                :interface="IViewForm()"
                :value="inputMyProfile"
            >
            </iv-form>

        </iv-card>

        <!-- edit Password -->
        <iv-auto-card
            v-show="pageStep === ePageStep.changePassword"
            :visible="true"
            :label="_('w_ChangePassword') "
        >
            <template #toolbox>
                <iv-toolbox-back @click="pageToView()" />
            </template>

            <iv-form
                :interface="IEditFormPassword()"
                :value="inputPasswordUpdate"
                @submit="saveEditPassword($event)"
            ></iv-form>

            <template #footer-before>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToView"
                >{{ _('w_Back') }}
                </b-button>
            </template>

        </iv-auto-card>

        <!-- edit My Profile -->
        <iv-auto-card
            v-show="pageStep === ePageStep.editMyProfile"
            :visible="true"
            :label=" _('w_MyProfile_EditMyProfile') "
        >
            <template #toolbox>
                <iv-toolbox-back @click="pageToView" />
            </template>

            <iv-form
                :interface="IEditFormMyProfile()"
                :value="inputMyProfile"
                @submit="saveEditMyProfile($event)"
            ></iv-form>

            <template #footer-before>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToView"
                >{{ _('w_Back') }}
                </b-button>
            </template>

        </iv-auto-card>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";

interface IInputMyProfile {
    objectId: string;
    account?: string;
    name?: string;
    email?: string;
    phone?: string;
    employeeId?: string;
}

interface IInputPasswordUpdate {
    objectId: string;
    previous: string;
    current: string;
}

enum EPageStep {
    changePassword,
    editMyProfile,
    view,
    none
}

@Component({
    components: {}
})
export default class MyProfile extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.view;

    userDetail: any = {};

    inputMyProfile: IInputMyProfile = {
        objectId: "",
        account: "",
        name: "",
        employeeId: "",
        email: "",
        phone: ""
    };

    inputPasswordUpdate: IInputPasswordUpdate = {
        objectId: "",
        previous: "",
        current: ""
    };

    created() {}

    mounted() {
        this.initUserDetail();
    }

    clearInputData() {
        this.inputMyProfile = {
            objectId: "",
            account: "",
            name: "",
            employeeId: "",
            email: "",
            phone: ""
        };

        this.inputPasswordUpdate = {
            objectId: "",
            previous: "",
            current: ""
        };
    }

    initUserDetail() {
        this.inputMyProfile = {
            objectId: this.$user.objectId,
            account: this.$user.username,
            name: this.$user.name,
            employeeId: this.$user.employeeId,
            email: this.$user.email,
            phone: this.$user.phone
        };
    }

    pageToView() {
        this.pageStep = EPageStep.view;
        this.initUserDetail();
    }

    pageToEdit() {
        this.pageStep = EPageStep.editMyProfile;
    }

    pageToChangePassword() {
        this.pageStep = EPageStep.changePassword;
    }

    async saveEditPassword(data) {
        const editPasswordParam: IInputPasswordUpdate = {
            objectId: this.userDetail.objectId,
            previous: data.previous,
            current: data.current
        };

        Loading.show();
        await this.$server
            .U("/user/base/password", editPasswordParam)
            .then((response: any) => {
                Loading.hide();
                if (response != undefined) {
                    Dialog.success(this._("w_MyProfile_ChangePasswordSuccess"));
                    this.$logout();
                }
            })
            .catch((e: any) => {
                Loading.hide();
                return ResponseFilter.base(
                    this,
                    e,
                    this._("w_MyProfile_ChangePasswordFailed")
                );
            });
    }

    async saveEditMyProfile(data) {
        const datas: IInputMyProfile[] = [
            {
                name: data.name,
                email: data.email,
                phone: data.phone,
                objectId: data.objectId
            }
        ];

        const editMyProfileParam = {
            datas
        };

        Loading.show();
        await this.$server
            .U("/user/user", editMyProfileParam)
            .then((response: any) => {
                Loading.hide();
                if (response != undefined) {
                    Dialog.success(this._("w_MyProfile_EditSuccess"));
                    this.pageToView();
                }
            })
            .catch((e: any) => {
                Loading.hide();
                return ResponseFilter.base(
                    this,
                    e,
                    this._("w_MyProfile_EditFailed")
                );
            });
    }

    IEditFormPassword() {
        return `
                interface {

                    /**
                     * @uiLabel - ${this._("w_PreviousPassword")}
                     * @uiPlaceHolder - ${this._("w_PreviousPassword")}
                     * @uiType - iv-form-password
                     */
                    previous: string;


                    /**
                     * @uiLabel - ${this._("w_CurrentPassword")}
                     * @uiPlaceHolder - ${this._("w_CurrentPassword")}
                     * @uiType - iv-form-password
                     * @uiColumnGroup - password
                     */
                    current: string;


                    /**
                     * @uiLabel - ${this._("w_CurrentPasswordConfirm")}
                     * @uiPlaceHolder - ${this._("w_CurrentPasswordConfirm")}
                     * @uiType - iv-form-password
                     * @uiColumnGroup - password
                     * @uiValidation - (value, all) => value === all.current
                     * @uiInvalidMessage - ${this._("w_Error_Password")}
                     */
                    confirmPassword: string;

            }
        `;
    }

    IEditFormMyProfile() {
        return `
                interface {

                    /**
                     * @uiLabel - ${this._("w_Account")}
                     * @uiType - iv-form-label
                     */
                    account?: string;


                    /**
                     * @uiLabel - ${this._("w_User_FullName")}
                     */
                    name: string;


                    /**
                     * @uiLabel - ${this._("w_User_ID")}
                     * @uiType - iv-form-label
                     */
                    employeeId?: string;


                    /**
                     * @uiLabel - ${this._("w_Email")}
                     */
                    email: string;


                    /**
                     * @uiLabel - ${this._("w_Phone")}
                     */
                    phone?: string;

            }
        `;
    }

    IViewForm() {
        return `
                interface {

                    /**
                     * @uiLabel - ${this._("w_Account")}
                     * @uiType - iv-form-label
                     */
                    account?: string;


                    /**
                     * @uiLabel - ${this._("w_User_FullName")}
                     * @uiType - iv-form-label
                     */
                    name?: string;


                    /**
                     * @uiLabel - ${this._("w_User_ID")}
                     * @uiType - iv-form-label
                     */
                    employeeId?: string;


                    /**
                     * @uiLabel - ${this._("w_Email")}
                     * @uiType - iv-form-label
                     */
                    email?: string;


                    /**
                     * @uiLabel - ${this._("w_Phone")}
                     * @uiType - iv-form-label
                     */
                    phone?: string;

            }
        `;
    }
}
</script>

