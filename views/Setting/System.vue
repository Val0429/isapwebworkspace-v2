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
import RegexService from '@/services/RegexServices';

interface IInputFormData {
    hosting: string;
}

@Component({
    components: {}
})
export default class System extends Vue {

    // input框綁定model資料
    inputFormData: IInputFormData = {
        hosting: "",
    };


    created() {
        this.readHosting();
    }

    mounted() {}

    async readHosting() {
        await this.$server
            .R("/setting/system")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.inputFormData.hosting = response.hosting
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_MailServer_Read_Fail")
                );
            });
    }

    // 新增MailServer
    async saveSystemData(data) {

        /* test ok 
         http://172.16.10.21:6066
         https://172.16.10.21:4449
         http://www.isap.com
         https://www.isap.com
         */

        if (!RegexService.url(data.hosting)) {
            Dialog.error(this._("w_WrongURL"));
            return false;
        }

        const systemObject: {
            hosting: string;
        } = {
            hosting: data.hosting
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
                 */
                hosting: string;

            }
        `;
    }
}
</script>

