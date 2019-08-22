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
                                    <h1>{{ _('w_ForgotPassword') }}</h1>

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
                                            >{{ _("w_Submit") }}</b-button>
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
                                                {{ _('w_Back') }}
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

interface IInputForgetPassword {
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
        email: ""
    };

    created() {}

    mounted() {}

    pageToLeave() {
        this.$router.push({ path: "/" });
    }

    clearInputData() {
        this.inputForgetPassword = {
            email: ""
        };
    }

    backToLogin() {
        this.$router.push("/login");
    }

    sendEmail() {
        console.log("Send email");
    }
}
</script>

<style lang="scss" scoped>
.info {
    margin-left: 20px;
    margin-bottom: 20px;
}
</style>
