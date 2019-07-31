<template>
    <div class="animated fadeIn">

        <iv-auto-card
            :visible="true"
            :label="_('w_System_Setting')"
        >

            <iv-form
                :interface="IAddForm()"
                :value="inputFormData"
                @submit="saveSystemData($event)"
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

interface IInputFormData {
    host: string;
    port: number;
}

@Component({
    components: {}
})
export default class System extends Vue {

    // input框綁定model資料
    inputFormData: IInputFormData = {
        host: "",
        port: null
    };

    tempHost = '';

    created() {
        this.readHosting();
    }

    mounted() {}

    async readHosting() {
        await this.$server
            .R("/setting/system")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.tempHost = response.hosting
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_MailServer_Read_Fail")
                );
            });

        this.inputFormData.host = this.tempHost.substring(7).split(":")[0];
        this.inputFormData.port = parseInt(this.tempHost.substring(7).split(":")[1]);
    }

    // 新增MailServer
    async saveSystemData(data) {
        // port正則
        const portRegex = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;

        if (!portRegex.test(data.port)) {
            Dialog.error(this._("w_Error_Port"));
            return false;
        }

        const systemObject: {
            hosting: string;
        } = {
            hosting: `http://${data.host}:${data.port.toString()}`
        };

        Loading.show();
        await this.$server
            .U("/setting/system", systemObject)
            .then((response: any) => {
                 ResponseFilter.successCheck(this, response, (response: any) => {
                    Dialog.success(this._("w_System_Setting_Success"));
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_System_Setting_Fail")
                );
            });
    }

    IAddForm() {
        return `
             interface {

                /**
                 * @uiLabel - ${this._("w_System_WebHost")}
                 * @uiPlaceHolder - ${this._("w_System_WebHost")}
                 * @uiType - iv-form-ip
                 */
                host: string;


                 /**
                 * @uiLabel - ${this._("w_Port")}
                 * @uiPlaceHolder - ${this._("w_Port_PlaceHolder")}
                 * @uiAttrs - { max: 65535, min: 1}
                 */
                port: number;

            }
        `;
    }
}
</script>

