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
}

@Component({
    components: {}
})
export default class System extends Vue {

    // input框綁定model資料
    inputFormData: IInputFormData = {
        host: ''
    };


    created() {}

    mounted() {}


    // 新增MailServer
    async saveSystemData(data) {
        // port正則
        // const portRegex = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;
        //
        // if (!portRegex.test(data.port)) {
        //     Dialog.error(this._("w_Error_Port"));
        //     return false;
        // }

        const systemObject: {
            host: string;
        } = {
            host: data.host,
        };

        Loading.show();
        await this.$server
            // .U("/setting/smtp", systemObject)
            // .then((response: any) => {
            //     ResponseFilter.successCheck(this, response, (response: any) => {
            //         Dialog.success(this._("w_System_Setting_Success"));
            //     });
            // })
            // .catch((e: any) => {
            //     return ResponseFilter.catchError(
            //         this,
            //         e,
            //         this._("w_System_Setting_Fail")
            //     );
            // });
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

            }
        `;
    }
}
</script>

