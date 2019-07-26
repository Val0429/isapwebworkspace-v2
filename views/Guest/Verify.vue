<template>
    <div
        id="app"
        class="app flex-row align-items-center"
        @keyup.enter="verify"
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
                                    <h1>{{ _('w_Verify_VerifyTitle') }}</h1>

                                    <p class="text-muted">{{ version }}</p>

                                    <div class="input-group mb-4">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">
                                                <i class="icon-lock"></i>
                                            </span>
                                        </div>
                                        <input
                                            type="password"
                                            class="form-control"
                                            v-model="password"
                                            :placeholder="_('wb_Password')"
                                        >
                                    </div>

                                    <div class="input-group mb-4">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">
                                                <i class="icon-lock"></i>
                                            </span>
                                        </div>
                                        <input
                                            type="password"
                                            class="form-control"
                                            v-model="confirmPassword"
                                            :placeholder="_('w_Verify_ComfirmPasswordPlaceholder')"
                                        >
                                    </div>

                                    <b-row>
                                        <b-col cols="6">
                                            <b-button
                                                style="margin-top: 3px"
                                                variant="primary"
                                                class="px-4"
                                                @click="verify()"
                                            >{{ _("w_Verify_ButtonSubmit") }}</b-button>
                                        </b-col>

                                        <b-col
                                            cols="6"
                                            class="text-right"
                                        >
                                            <!-- language -->
                                            <iv-language-button />
                                            <!--== language ==-->

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
import { ServerName, ServerVersion } from "@/../core/server";
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";

@Component({
    components: {}
})
export default class Verify extends Vue {
    version: string = `${ServerName} ${ServerVersion}`;
    password: string = "";
    confirmPassword: string = "";
    token: string = "";

    created() {}

    mounted() {
        this.initVerifyCode();
    }

    async verify() {
        if (this.token == "") {
            Dialog.error(this._("w_Verify_ErrorNoToken"));
            return false;
        }

        if (this.password == "") {
            Dialog.error(this._("w_Verify_ErrorPasswordEmpty"));
            return false;
        }

        if (this.confirmPassword == "") {
            Dialog.error(this._("w_Verify_ErrorConfirmPasswordEmpty"));
            return false;
        }

        if (this.password != this.confirmPassword) {
            Dialog.error(this._("w_Verify_ErrorConfirmPasswordDifferent"));
            return false;
        }

        this.$server.C("/user/enable/step1");

        let param = {
            verification: this.token,
            password: this.password
        };

        Loading.show();
        await this.$server
            .C("/user/enable/step1", param)
            .then((response: any) => {
                let param = {
                    username: response.user.username,
                    password: this.password
                };
                this.$login(param)
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
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    // Author: Morris
    initVerifyCode() {
        if (this.$route.query.t != undefined) {
            this.token = this.$route.query.t as string;
        }
    }
}
</script>

<style lang="scss" scoped>
</style>