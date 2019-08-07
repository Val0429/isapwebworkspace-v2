<template>
    <div class="animated fadeIn">

        <iv-auto-card
            :visible="true"
            :label="_('w_FRSSetting')"
        >

            <iv-form
                :interface="IForm()"
                :value="inputFormData"
                @submit="doSubmit($event)"
            ></iv-form>

        </iv-auto-card>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";
import ResponseFilter from "@/services/ResponseFilter";
import Loading from "@/services/Loading";

@Component({
    components: {}
})
export default class SetupsFRS extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    inputFormData: any = {
        ip: "",
        port: 0,
        account: "",
        password: ""
    };

    created() {
        this.readFRS();
    }

    mounted() {}

    async readFRS() {
        await this.$server
            .R("/config")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.inputFormData.account = response.frs.account;
                    this.inputFormData.password = response.frs.password;
                    this.inputFormData.ip = response.frs.ip;
                    this.inputFormData.port = response.frs.port;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_FRSReading_Fail")
                );
            });
    }

    async doSubmit(data) {
        // port正則
        const portRegex = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;

        if (!portRegex.test(data.port)) {
            Dialog.error(this._("w_Error_Port"));
            return false;
        }

        const frs: {
            account: string;
            password: string;
            ip: string;
            port: number;
        } = {
            account: data.account,
            password: data.password,
            ip: data.ip,
            port: data.port
        };

        const addParam = {
            data: {
                frs
            }
        };

        Loading.show();
        await this.$server
            .C("/config", addParam)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    Dialog.success(this._("w_FRSSetting_Success"));
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_FRSSetting_Fail")
                );
            });
    }

    IForm() {
        return `
             interface  {

                /**
                 * @uiLabel - ${this._("w_FRSSetting_IPAddress")}
                 * @uiPlaceHolder - ${this._("w_FRSSetting_IPAddress")}
                 * @uiType - iv-form-ip
                 */
                ip: string;


                /**
                 * @uiLabel - ${this._("w_FRSSetting_HTTPPort")}
                 * @uiPlaceHolder - ${this._("w_FRSSetting_HTTPPort")}
                 * @uiAttrs - { max: 65535, min: 1}
                 */
                port: number;


                /**
                 * @uiLabel - ${this._("w_Account")}
                 * @uiPlaceHolder - ${this._("w_Account")}
                 */
                account: string;


                /**
                 * @uiLabel - ${this._("w_Password")}
                 * @uiPlaceHolder - ${this._("w_Password")}
                 * @uiType - iv-form-password
                 *
                 */
                password: string;

            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>




