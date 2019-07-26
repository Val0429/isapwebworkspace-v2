<template>
    <div class="animated fadeIn m-2">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <!-- view -->
            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :visible="true"
                :label=" _('w_MyProfile_ViewMyProfile') "
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

            <!-- edit My Profile -->
            <iv-auto-card
                key="transition_2"
                v-show="transition.step === 2"
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

            <!-- edit Password -->
            <iv-auto-card
                key="transition_3"
                v-show="transition.step === 3"
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

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

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

@Component({
    components: {}
})
export default class MyProfile extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

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
            objectId: this.$user.user.objectId,
            account: this.$user.user.username,
            name: this.$user.user.name,
            employeeId: this.$user.user.employeeId,
            email: this.$user.user.email,
            phone: this.$user.user.phone
        };
    }

    pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        this.initUserDetail();
    }

    pageToEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
    }

    pageToChangePassword() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
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
                ResponseFilter.successCheck(this, response, (response: any) => {
                    Dialog.success(this._("w_MyProfile_ChangePasswordSuccess"));
                    this.$logout();
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
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
                ResponseFilter.successCheck(this, response, (response: any) => {
                    Dialog.success(this._("w_MyProfile_EditSuccess"));
                    this.pageToView();
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
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

