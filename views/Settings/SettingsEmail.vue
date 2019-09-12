<template>
    <div class="animated fadeIn">

        <iv-auto-card
            :visible="true"
            :label="_('w_MailSetting_Test_EmailSetting')"
        >

            <iv-form
                :interface="IMailServerComponent()"
                :value="inputFormData"
                @submit="saveMailServer($event)"
            ></iv-form>

            <template #footer-before>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToEmailTest()"
                >{{ _('w_Test') }}
                </b-button>
            </template>

        </iv-auto-card>

        <!-- 點擊彈出測試輸入框 -->
        <b-modal
            hide-footer
            size="md"
            :title="_('w_MailSetting_Test')"
            v-model="modalShow"
        >

            <div class="card-content">
                <b-form-group
                    :label="_('w_MailSetting_Email')"
                    :label-cols="3"
                >
                    <b-row>
                        <b-col>
                            <b-form-input
                                v-model="inputTestEmail"
                                :placeholder="_('w_MailSetting_placeholder')"
                            ></b-form-input>
                        </b-col>
                    </b-row>
                </b-form-group>
            </div>

            <hr>

            <b-row>
                <!-- 送出email按鈕 -->
                <b-col
                    cols="3"
                    offset="6"
                >
                    <b-button
                        class="button button-full"
                        variant="success"
                        type="button"
                        @click="sendEmailTest()"
                    >{{ _('w_Send') }}
                    </b-button>
                </b-col>
                <!-- 離開按鈕 -->
                <b-col cols="3">
                    <b-button
                        class="button button-full"
                        variant="secondary"
                        type="button"
                        @click="modalShow = !modalShow"
                    >{{ _('w_Cancel') }}
                    </b-button>
                </b-col>
            </b-row>

        </b-modal>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";

interface IInputFormData {
    email: string;
    testEmail: string;
    host: string;
    password: string;
    port: number;
    enable: boolean;
}

@Component({
    components: {}
})
export default class SetupsEmail extends Vue {
    modalShow: boolean = false;

    // input框綁定model資料
    inputFormData: IInputFormData = {
        email: "",
        testEmail: "",
        host: "",
        password: "",
        port: 0,
        enable: true
    };

    inputTestEmail: string = "";

    created() {
        this.clearMailServerData();
    }

    mounted() {
        this.readMailServer();
    }

    clearMailServerData() {
        this.inputFormData = {
            testEmail: "",
            host: "",
            password: "",
            email: "",
            port: null,
            enable: true
        };

        this.inputTestEmail = "";
    }

    pageToEmailTest() {
        this.inputTestEmail = "";
        this.modalShow = !this.modalShow;
    }

    // 送出測試
    async sendEmailTest() {
        const mailServerObject: {
            email: string;
        } = {
            email: this.inputTestEmail
        };
        Loading.show();
        // await this.$server
        //     .C("/test/email", mailServerObject)
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(this, response, (response: any) => {
        //             Dialog.success(this._("w_MailServer_Test_Success"));
        //             this.modalShow = !this.modalShow;
        //         });
        //     })
        //     .catch((e: any) => {
        //         this.modalShow = !this.modalShow;
        //         return ResponseFilter.catchError(
        //             this,
        //             e,
        //             this._("w_MailServer_Read_FailMsg")
        //         );
        //     });
    }

    async readMailServer() {
        // await this.$server
        //     .R("/config")
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(this, response, (response: any) => {
        //             this.inputFormData.email = response.smtp.email;
        //             this.inputFormData.host = response.smtp.host;
        //             this.inputFormData.password = response.smtp.password;
        //             this.inputFormData.port = response.smtp.port;
        //             this.inputFormData.enable = response.smtp.enable;
        //         });
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.catchError(
        //             this,
        //             e,
        //             this._("w_MailServer_Read_Fail")
        //         );
        //     });
    }

    // 新增MailServer
    async saveMailServer(data) {
        // port正則
        const portRegex = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;

        if (!portRegex.test(data.port)) {
            Dialog.error(this._("w_Error_Port"));
            return false;
        }

        const smtp: {
            email: string;
            host: string;
            password: string;
            port: number;
            enable: string;
        } = {
            email: data.email,
            host: data.host,
            password: data.password,
            port: data.port,
            enable: data.enable
        };

        const addParam = {
            data: {
                smtp
            }
        };

        Loading.show();
        // await this.$server
        //     .C("/config", addParam)
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(this, response, (response: any) => {
        //             Dialog.success(this._("w_MailSetting_EmailSuccess"));
        //         });
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.catchError(
        //             this,
        //             e,
        //             this._("w_MailServer_Setting_Fail")
        //         );
        //     });
    }

    IMailServerComponent() {
        return `
             interface IMailServerComponent {


                /**
                 * @uiLabel - ${this._("w_MailSetting_SMTPHostname")}
                 * @uiPlaceHolder - ${this._("w_MailSetting_SMTPHostname")}
                 */
                host: string;


                 /**
                 * @uiLabel - ${this._("w_MailSetting_PortNumber")}
                 * @uiPlaceHolder - ${this._("w_MailSetting_PortNumber")}
                 * @uiAttrs - { max: 65535, min: 1}
                 */
                port: number;


                /**
                 * @uiLabel - ${this._("w_MailSetting_Email")}
                 * @uiPlaceHolder - ${this._("w_MailSetting_Email")}
                 */
                email: string;


                /**
                 * @uiLabel - ${this._("w_Password")}
                 * @uiPlaceHolder - ${this._("w_Password")}
                 * @uiType - iv-form-password
                 */
                password: string;


                /**
                 * @uiLabel - ${this._("w_MailSetting_Enable")}
                 * @uiType - iv-form-switch
                 */
                enable: boolean;

            }
        `;
    }
}
</script>

