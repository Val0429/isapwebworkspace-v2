<template>
    <div class="animated fadeIn">
        <iv-auto-card
            :visible="true"
            :label="_('w_Frs_Setting_FrList')"
        >
            <iv-form
                :interface="IFormComponent()"
                :value="initForm"
                @submit="updateFormApi($event)"
            ></iv-form>
        </iv-auto-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";

@Component
export default class SetupsEmail extends Vue {
    modalShow: boolean = false;
    initForm: any = {};
    mounted() {
        this.initFormApi();
    }

    async initFormApi() {
        await this.$server
            .R("/setting/frs")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.initForm = response;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_Dialog_ErrorTitle")
                );
            });
    }

    async updateFormApi(data) {
        await this.$server
            .U("/setting/frs", data)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    Dialog.success(this._("w_Dialog_SuccessTitle"));
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_Dialog_ErrorTitle")
                );
            });
    }
    IFormComponent() {
        return `
            interface IFormComponent {
                /**
                 * @uiLabel - ${this._("w_Frs_Setting_Account")}
                 * @uiPlaceHolder - ${this._("w_Frs_Setting_Account")}
                 */
                account: string;
                /**
                 * @uiLabel - ${this._("w_Frs_Setting_Password")}
                 * @uiPlaceHolder - ${this._("w_Frs_Setting_Password")}
                 * @uiType - iv-form-password
                 * @uiColumnGroup - password
                 */
                password: string;
                /**
                 * @uiLabel - ${this._("w_Account_ConfirmPassword")}
                 * @uiPlaceHolder - ${this._("w_Account_ConfirmPassword")}
                 * @uiType - iv-form-password
                 * @uiColumnGroup - password
                 * @uiValidation - (value, all) => value === all.password
                 */
                confirmPassword: string;
                /**
                 * @uiLabel - ${this._("w_Frs_Setting_Ip")}
                 * @uiPlaceHolder - ${this._("w_Frs_Setting_Ip")}
                 */
                ip: string;
                /**
                 * @uiLabel - ${this._("w_Frs_Setting_Port")}
                 * @uiPlaceHolder - ${this._("w_Frs_Setting_Port")}
                 */
                port: string;
                /**
                 * @uiLabel - ${this._("w_Frs_Setting_Protocol")}
                 * @uiPlaceHolder - ${this._("w_Frs_Setting_Protocol")}
                 */
                protocol: string;
            }
        `;
    }
}
</script>

