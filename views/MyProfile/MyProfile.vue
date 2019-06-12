<template>
    <div class="animated fadeIn m-2">

        <!-- view -->
        <iv-card
            v-show="pageStep === ePageStep.view"
            :visible="true"
            :data="{ label: _('w_MyProfile_ViewMyProfile') }"
        >
            <template #toolbox>
                <iv-toolbox-leave @click="pageToLeave" />
                <iv-toolbox-editmyprofile @click="pageToEdit" />
                <iv-toolbox-changepassword @click="pageToChangePassword" />
            </template>

            <iv-form
                :interface="IViewForm()"
                :value="inputMyProfile"
            >
            </iv-form>

            <template #footer>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToLeave"
                >{{ _('w_Leave') }}
                </b-button>
            </template>

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
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog/Dialog";

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
        // TODO: wait Val how to get data from session
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
            // objectId: User.userId,
            // employeeId: User.employeeId,
            // account: User.account,
            // name: User.name,
            // email: User.email,
            // phone: User.phone
            objectId: "",
            account: "",
            name: "",
            employeeId: "",
            email: "",
            phone: ""
        };
    }

    pageToLeave() {
        this.$router.push({ path: "/" });
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

        await this.$server.U("/user/base/password", editPasswordParam)
            .then((response: any) => {
                if (response != undefined) {
                    Dialog.success(this._("w_MyProfile_ChangePasswordSuccess"));
                    this.logout();
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e)
                }
                if (e.res.statusCode == 500) {
                    Dialog.error(this._("w_MyProfile_ChangePasswordFailed"));
                    return false;
                }
                console.log(e);
                return false;
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

        await this.$server.U("/user/user", editMyProfileParam)
            .then((response: any) => {
                if (response != undefined) {
                    Dialog.success(this._("w_MyProfile_EditSuccess"));
                    // User.name = data.name;
                    // User.email = data.email;
                    // User.phone = data.phone;
                    this.pageToView();
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e)
                }
                if (e.res.statusCode == 500) {
                    Dialog.error(this._("w_MyProfile_EditFailed"));
                    return false;
                }
                console.log(e);
                return false;
            });
    }

    async logout() {
        await this.$server.C("/user/base/logout", {})
            .then((response: any) => {
                this.logoutAlways();
            })
            .catch((e: any) => {
                this.logoutAlways();
            });
    }

    logoutAlways() {
        //User.clearUser();
        this.$router.push({ path: "/login" });
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

