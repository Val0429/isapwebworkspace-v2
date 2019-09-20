<template>
    <div class="animated fadeIn">

        <iv-auto-card
            :visible="true"
            :label="_('w_FRSManagerSetting')"
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
export default class SetupsFRSManager extends Vue {
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
        this.readFRSManager();
    }

    mounted() {}

    async readFRSManager() {
        await this.$server
            .R("/config")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (!response.frsmanager) {
                        Dialog.error(this._("w_FRSManagerSetting_ReadingFail"));
                        return false;
                    }
                    this.inputFormData.account = response.frsmanager.account;
                    this.inputFormData.password = response.frsmanager.password;
                    this.inputFormData.ip = response.frsmanager.ip;
                    this.inputFormData.port = response.frsmanager.port;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async doSubmit(data) {
        // port正則
        const portRegex = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;

        if (!portRegex.test(data.port)) {
            Dialog.error(this._("w_Error_Port"));
            return false;
        }

        const param: {
            data: {
                frsmanager: {
                    account: string;
                    password: string;
                    ip: string;
                    port: number;
                };
            };
        } = {
            data: {
                frsmanager: {
                    account: data.account,
                    password: data.password,
                    ip: data.ip,
                    port: data.port
                }
            }
        };

        Loading.show();
        await this.$server
            .C("/config", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    Dialog.success(this._("w_FRSManagerSetting_Success"));
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_FRSManagerSetting_Fail")
                );
            });
    }

    IForm() {
        return `
             interface  {

                /**
                 * @uiLabel - ${this._("w_FRSManagerSetting_IPAddress")}
                 * @uiPlaceHolder - ${this._("w_FRSManagerSetting_IPAddress")}
                 * @uiType - iv-form-ip
                 */
                ip: string;

                /**
                 * @uiLabel - ${this._("w_FRSManagerSetting_HTTPPort")}
                 * @uiPlaceHolder - ${this._("w_FRSManagerSetting_HTTPPort")}
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




