<template>
    <div class="animated fadeIn m-2">

        <iv-auto-card :label="_('w_ForgetPassword')">

            <template #toolbox>
                <iv-toolbox-leave @click="pageToLeave" />
            </template>

            <iv-step-progress
                ref="step"
                @mounted="doMounted"
            >
                <template #1-title>{{ _('w_ForgetPassword_Step1') }}</template>
                <template #1>
                    <iv-form
                        v-model="inputForgetPassword"
                        ref="step1"
                        :interface="IStep1()"
                    >
                        <template #info>
                            <h5 class="info">{{ _('w_ForgetPassword_Step1_info') }}</h5>
                        </template>

                        <template #account="{$attrs, $listeners}">
                            <iv-form-string
                                v-bind="$attrs"
                                v-on="$listeners"
                                v-model="inputForgetPassword.account"
                            >
                            </iv-form-string>
                        </template>

                        <template #email="{$attrs, $listeners}">
                            <iv-form-string
                                v-bind="$attrs"
                                v-on="$listeners"
                                v-model="inputForgetPassword.email"
                            >
                            </iv-form-string>
                        </template>

                        <template #submit="{ $attrs, $listeners }">

                            <div
                                class="button-right button-group right mt-2"
                                v-bind="$attrs"
                            >
                                <b-button
                                    v-bind="{ ...$attrs, class: undefined }"
                                    v-on="$listeners"
                                    class="button"
                                    variant="success"
                                    type="button"
                                    @click="submitStep1($event)"
                                >{{ _('w_ForgetPassword_Step1_GetVerificationCode') }}
                                </b-button>
                            </div>
                        </template>

                    </iv-form>
                </template>

                <template #2-title>{{ _('w_ForgetPassword_Step2') }}</template>
                <template #2>
                    <iv-form
                        v-model="inputForgetPassword"
                        ref="step2"
                        :interface="IStep2()"
                    >
                        <template #info>
                            <h5 class="info">{{ _('w_ForgetPassword_Step2_info') }}</h5>
                        </template>

                        <template #verification="{$attrs, $listeners}">
                            <iv-form-string
                                v-bind="$attrs"
                                v-on="$listeners"
                                v-model="inputForgetPassword.verification"
                            ></iv-form-string>
                        </template>

                        <template #submit="{ $attrs, $listeners }">

                            <div
                                class="button-right button-group right mt-2"
                                v-bind="$attrs"
                            >
                                <b-button
                                    v-bind="{ ...$attrs, class: undefined }"
                                    v-on="$listeners"
                                    class="button"
                                    variant="success"
                                    type="button"
                                    @click="submitStep2($event)"
                                >{{ _('w_Check') }}
                                </b-button>
                            </div>
                        </template>
                    </iv-form>
                </template>

                <template #3-title>{{ _('w_ForgetPassword_Step3') }}</template>
                <template #3>
                    <iv-form
                        v-model="inputForgetPassword"
                        ref="step3"
                        :interface="IStep3()"
                        @submit="submitStepFinal($event)"
                    >
                        <template #info>
                            <h5 class="info">{{ _('w_ForgetPassword_Step3_info') }}</h5>
                        </template>
                    </iv-form>
                </template>

            </iv-step-progress>

            <template #footer-before>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToLeave"
                >{{ _('w_Leave') }}
                </b-button>
            </template>

        </iv-auto-card>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";

interface IInputForgetPassword {
    account: string;
    email?: string;
    verification?: string;
    password?: string;
    confirmPassword?: string;
}

@Component({
    components: {}
})
export default class ForgetPassword extends Vue {
    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
    }

    inputForgetPassword: IInputForgetPassword = {
        account: "",
        email: "",
        verification: "",
        password: "",
        confirmPassword: ""
    };

    created() {}

    mounted() {}

    pageToLeave() {
        this.$router.push({ path: "/" });
    }

    clearInputData() {
        this.inputForgetPassword = {
            account: "",
            email: "",
            verification: "",
            password: "",
            confirmPassword: ""
        };
    }

    async submitStep1() {
        const step1Param: {
            username: string;
            email: string;
        } = {
            username: this.inputForgetPassword.account,
            email: this.inputForgetPassword.email
        };

        Loading.show();
        await this.$server
            .C("/user/forget/step1", step1Param)
            .then((response: any) => {
                Loading.hide();
                if (response !== undefined) {
                    (this.$refs.step1 as any).set("submit", true);
                    (this.$refs.step as any).currentStep = 2;
                }
            })
            .catch((e: any) => {
                Loading.hide();
                return ResponseFilter.customMessage(
                    this,
                    e,
                    this._("w_ForgetPassword_Step1Failed")
                );
            });
    }

    async submitStep2() {
        const step2Param: {
            username: string;
            verification: string;
        } = {
            username: this.inputForgetPassword.account,
            verification: this.inputForgetPassword.verification
        };

        Loading.show();
        await this.$server
            .C("/user/forget/step2", step2Param)
            .then((response: any) => {
                Loading.hide();
                if (response !== undefined) {
                    (this.$refs.step2 as any).set("submit", true);
                    (this.$refs.step as any).currentStep = 3;
                }
            })
            .catch((e: any) => {
                Loading.hide();
                return ResponseFilter.customMessage(
                    this,
                    e,
                    this._("w_ForgetPassword_Step2Failed")
                );
            });
    }

    async submitStepFinal(data) {
        const step3Param: {
            username: string;
            verification: string;
            password: string;
        } = {
            username: this.inputForgetPassword.account,
            verification: this.inputForgetPassword.verification,
            password: data.password
        };

        this.inputForgetPassword.password = data.password;

        Loading.show();
        await this.$server
            .C("/user/forget/step3", step3Param)
            .then((response: any) => {
                Loading.hide();
                if (response !== undefined) {
                    this.login();
                }
            })
            .catch((e: any) => {
                Loading.hide();
                return ResponseFilter.customMessage(
                    this,
                    e,
                    this._("w_ForgetPassword_Step3Failed")
                );
            });
    }

    async login() {
        Loading.show();
        let param = {
            username: this.inputForgetPassword.account,
            password: this.inputForgetPassword.password
        };
        await this.$login(param)
            .then(() => {
                Loading.hide();
                this.$router.push("/");
            })
            .catch((e: any) => {
                Loading.hide();
                console.log(e);
                if (
                    e.res != undefined &&
                    e.res.statusCode != undefined &&
                    e.res.statusCode == 401
                ) {
                    Dialog.error(this._("w_UserSession_Empty"));
                }
            });
    }

    IStep1() {
        return `
            interface {
                info?: any;
                
                /**
                 * @uiLabel - ${this._("w_Account")}
                 * @uiPlaceHolder - ${this._("w_Account")}
                 */
                account: string;

                /**
                 * @uiLabel - ${this._("w_Email")}
                 * @uiPlaceHolder - ${this._("w_Email_Placeholder")}
                 */
                email: string;

                submit: any;
            }
        `;
    }

    IStep2() {
        return `
            interface {

                info?: any;
                
                /**
                 * @uiLabel - ${this._("w_ForgetPassword_VerificationCode")}
                 * @uiPlaceHolder - ${this._(
                     "w_ForgetPassword_VerificationCode"
                 )}
                 * @uiType - iv-form-password
                 */
                verification: string;

                submit: any;
            }
        `;
    }

    IStep3() {
        return `
            interface {

                info?: any;

                /**
                 * @uiLabel - ${this._("w_CurrentPassword")}
                 * @uiPlaceHolder - ${this._("w_CurrentPassword")}
                 * @uiType - iv-form-password
                 */
                password: string;

                /**
                 * @uiLabel - ${this._("w_CurrentPasswordConfirm")}
                 * @uiPlaceHolder - ${this._("w_CurrentPasswordConfirm")}
                 * @uiType - iv-form-password
                 * @uiValidation - (value, all) => value === all.password
                 * @uiInvalidMessage - ${this._("w_Error_Password")}
                 */
                confirmPassword: string;
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
.info {
    margin-left: 20px;
    margin-bottom: 20px;
}
</style>
