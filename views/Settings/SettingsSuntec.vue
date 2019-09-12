<template>
    <div class="animated fadeIn">
        <iv-auto-card
            :visible="true"
            :label="_('w_Suntec_Suntec')"
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
            .R("/setting/suntec-app")
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
            .U("/setting/suntec-app", data)
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
                 * @uiLabel - ${this._("w_Suntec_Card_Host")}
                 * @uiPlaceHolder - ${this._("w_Suntec_Card_Host")}
                 */
                host: string;
                /**
                 * @uiLabel - ${this._("w_Suntec_Card_Token")}
                 * @uiPlaceHolder - ${this._("w_Suntec_Card_Token")}
                 */
                token: string;
            }
        `;
    }
}
</script>

