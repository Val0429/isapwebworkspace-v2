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
                :label=" _('m_MyProfile_ViewMyProfile') "
            >
                <template #toolbox>
                    <iv-toolbox-changepassword @click="pageToChangePassword" />
                    <iv-toolbox-about @click="pageToAbout" />
                </template>

                <iv-form
                    :interface="IViewForm()"
                    :value="inputMyProfile"
                >
                </iv-form>

            </iv-card>

            <!-- edit Password -->
            <iv-auto-card
                key="transition_3"
                v-show="transition.step === 3"
                :visible="true"
                :label="_('w_MyProfile_ChangePassword') "
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

            <!-- About -->
            <iv-card
                key="transition_4"
                v-show="transition.step === 4"
                :visible="true"
                :label="_('w_About_About') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToView()" />
                </template>

                <div>
                    <p>{{ server.name }}</p>
                    <p>{{ _('w_About_Copyright') }}</p>
                    <p>{{ _('w_About_ServerVersion') }}: {{ server.serverVersion }}</p>
                    <p>{{ _('w_About_FrameworkVersion') }}: {{ server.frameworkVersion }}</p>
                    <p>{{ _('w_About_WebClientVersion') }} : {{ server.clientVersion }}</p>
                </div>

            </iv-card>

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

// Server
import { ServerName, ServerVersion } from "@/../core/server";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import RegexServices from "@/services/RegexServices";
import RoleService from "@/services/Role/RoleService";

interface IInputMyProfile {
    objectId: string;
    username: string;
    email: string;
    companyName: string;
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
        username: "",
        email: "",
        companyName: ""
    };

    inputPasswordUpdate: IInputPasswordUpdate = {
        objectId: "",
        previous: "",
        current: ""
    };

    server = {
        name: ServerName,
        clientVersion: ServerVersion,
        frameworkVersion: "",
        serverVersion: ""
    };

    created() {
        this.server.clientVersion = this.server.clientVersion.replace("v", "");
    }

    mounted() {
        this.initUserDetail();
    }

    pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        this.initUserDetail();
    }

    pageToChangePassword() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
    }

    pageToAbout() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 4;
        this.initAPIs();
    }

    clearInputData() {
        this.inputMyProfile = {
            objectId: "",
            username: "",
            email: "",
            companyName: ""
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
            username: this.$user.user.name,
            email: this.$user.user.email,
            companyName: this.$user.user.company
                ? this.$user.user.company.name
                : ""
        };
    }

    async initAPIs() {
        await this.$server
            .R("/apis")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (response.serverVersion != undefined) {
                        this.server.serverVersion = response.serverVersion;
                    }
                    if (response.frameworkVersion != undefined) {
                        this.server.frameworkVersion =
                            response.frameworkVersion;
                    }
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

    async saveEditPassword(data) {
        let param: IInputPasswordUpdate = {
            objectId: this.userDetail.objectId,
            previous: data.previous,
            current: data.current
        };

        Loading.show();
        param = RegexServices.trim(param);
        await this.$server
            .U("/user/base/password", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    Dialog.success(this._("w_MyProfile_ChangePasswordSuccess"));
                    this.$login({
                        username: this.$user.user.username,
                        password: param.current
                    });
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

    IViewForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Account_UserName")}
                 * @uiType - iv-form-label
                 */
                username?: string;

                /**
                 * @uiLabel - ${this._("w_Email")}
                 * @uiType - iv-form-label
                 */
                email?: string;

                /**
                 * @uiLabel - ${this._("w_Account_CompanyName")}
                 * @uiType - iv-form-label
                 * @uiHidden - ${!RoleService.haveTenantAdministrator(this)}
                 */
                companyName?: string;

            }
        `;
    }

    IEditFormPassword() {
        return `
            interface {
                
                /**
                 * @uiLabel - ${this._("w_MyProfile_OldPassword")}
                 * @uiPlaceHolder - ${this._("w_MyProfile_OldPassword")}
                 * @uiType - iv-form-password
                 */
                previous: string;

                /**
                 * @uiLabel - ${this._("w_MyProfile_NewPassword")}
                 * @uiPlaceHolder - ${this._("w_MyProfile_NewPassword")}
                 * @uiType - iv-form-password
                 * @uiColumnGroup - password
                 */
                current: string;

                /**
                 * @uiLabel - ${this._("w_MyProfile_ConfirmPassword")}
                 * @uiPlaceHolder - ${this._("w_MyProfile_ConfirmPassword")}
                 * @uiType - iv-form-password
                 * @uiColumnGroup - password
                 * @uiValidation - (value, all) => value === all.current
                 * @uiInvalidMessage - ${this._(
                     "w_MyProfile_ErrorPasswordNotSame"
                 )}
                */
                confirmPassword: string;

            }
        `;
    }
}
</script>

