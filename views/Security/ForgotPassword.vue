<template>
    <div
        id="app"
        class="app flex-row align-items-center"
        @keyup.enter="Login"
    >
        <div class="container">
            <b-row class="justify-content-center">
                <b-col
                    xl="6"
                    md="8"
                >
                    <div class="card-group">
                        <div class="card p-4">
                            <div class="card">
                                <div class="card-body">
                                    <h1>{{ _('w_Login_ForgotPassword') }}</h1>

                                    <div class="input-group mb-3">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">
                                                <i class="fa fa-user"></i>
                                            </span>
                                        </div>

                                        <input
                                            type="text"
                                            class="form-control"
                                            v-model="inputForgetPassword.username"
                                            :placeholder="_('w_Account_Account')"
                                        >
                                    </div>

                                    <div class="input-group mb-3">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">
                                                <i class="icon-envelope"></i>
                                            </span>
                                        </div>

                                        <input
                                            type="text"
                                            class="form-control"
                                            v-model="inputForgetPassword.email"
                                            :placeholder="_('w_Email')"
                                        >
                                    </div>

                                    <b-row>
                                        <b-col cols="6">
                                            <b-button
                                                style="margin-top: 3px"
                                                variant="primary"
                                                class="px-4"
                                                @click="sendEmail"
                                            >{{ _("wb_Confirm") }}</b-button>
                                        </b-col>

                                        <b-col
                                            cols="6"
                                            class="text-right"
                                        >
                                            <b-button
                                                variant="link"
                                                class="px-0"
                                                @click="backToLogin"
                                            >
                                                {{ _('wb_Back') }}
                                            </b-button>

                                        </b-col>

                                    </b-row>
                                </div>
                            </div>
                        </div>

                    </div>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import RegexServices from "@/services/RegexServices";

interface IInputForgetPassword {
    username: string;
    email: string;
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
        username: "",
        email: ""
    };

    created() {}

    mounted() {}

    pageToLeave() {
        this.$router.push({ path: "/" });
    }

    clearInputData() {
        this.inputForgetPassword = {
            username: "",
            email: ""
        };
    }

    backToLogin() {
        this.$router.push("/login");
    }

    async sendEmail() {
        let param = {
            username: this.inputForgetPassword.username,
            email: this.inputForgetPassword.email
        };

        Loading.show();
        param = RegexServices.trim(param);
        await this.$server
            .C("/user/forget/step1", param)
            .then((response: any) => {
                Loading.hide();
                Dialog.success(this._("w_ForgotPassword_Success"));
            })
            .catch((e: any) => {
                Loading.hide();
                Dialog.error(this._("w_ForgotPassword_Failed"));
            });
    }
}
</script>

<style lang="scss" scoped>
.info {
    margin-left: 20px;
    margin-bottom: 20px;
}
</style>
