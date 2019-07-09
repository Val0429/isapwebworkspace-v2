<template>
    <div class="animated fadeIn">

        <iv-auto-card
            :visible="true"
            :label="_('w_SmsServer_Setting')"
        >

            <iv-form
                :interface="ISmsServerComponent()"
                :value="inputFormData"
                @submit="saveSmsServer($event)"
            ></iv-form>
            <template #footer-before>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToSmsTest()"
                >{{ _('w_Test') }}
                </b-button>
            </template>

        </iv-auto-card>

        <!-- 點擊彈出測試輸入框 -->
        <b-modal
            hide-footer
            size="md"
            :title="_('w_SmsServer_Test')"
            v-model="modalShow"
        >

            <div class="card-content">
                <b-form-group
                    :label="_('w_SmsServer_Phone')"
                    :label-cols="3"
                >
                    <b-row>
                        <b-col>
                            <b-form-input
                                v-model="inputTestSmsPhone"
                                :placeholder="_('w_Phone_Placeholder')"
                            ></b-form-input>
                        </b-col>
                    </b-row>
                </b-form-group>
            </div>

            <hr>

            <b-row>
                <!-- 送出SMS按鈕 -->
                <b-col
                    cols="3"
                    offset="6"
                >
                    <b-button
                        class="button button-full"
                        variant="success"
                        type="button"
                        @click="sendSmsTest()"
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

import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";

interface IinputFormData {
    id: string;
    account: string;
    password: string;
    url: string;
    enable: boolean;
}

@Component({
    components: {}
})
export default class SMS extends Vue {
    modalShow: boolean = false;

    // input框綁定model資料
    inputFormData: IinputFormData = {
        id: "",
        account: "",
        password: "",
        url: "",
        enable: true
    };

    inputTestSmsPhone: string = "";

    created() {
        this.clearLicenseData();
        this.readSmsServer();
    }

    mounted() {
        this.readSmsServer();
    }

    clearLicenseData() {
        this.inputFormData = {
            id: "",
            account: "",
            password: "",
            url: "",
            enable: true
        };

        this.inputTestSmsPhone = "";
    }

    pageToSmsTest() {
        this.inputTestSmsPhone = "";
        this.modalShow = !this.modalShow;
    }

    // 送出測試
    async sendSmsTest() {
        const smsObject: {
            phone: string;
        } = {
            phone: this.inputTestSmsPhone
        };

        await this.$server
            .C("/setting/sgsms/test", smsObject)
            .then((response: any) => {
                if (response != undefined) {
                    this.modalShow = !this.modalShow;
                    Dialog.success(this._("w_SmsServer_Setting_Test_Success"));
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                this.modalShow = !this.modalShow;
                Dialog.error(this._("w_SmsServer_Setting_Test_Fail"));
                return false;
            });
    }

    async readSmsServer() {
        await this.$server
            .R("/setting/sgsms")
            .then((response: any) => {
                if (response != undefined) {
                    this.inputFormData.enable = response.enable;
                    this.inputFormData.password = response.password;
                    this.inputFormData.account = response.account;
                    this.inputFormData.url = response.url;
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                Dialog.error(this._("w_SmsServer_Read_Fail"));
                return false;
            });
    }

    // 新增SmsServer
    async saveSmsServer(data) {
        const smsObject: {
            enable: boolean;
            url: string;
            account: string;
            password: string;
        } = {
            enable: data.enable,
            url: data.url,
            account: data.account,
            password: data.password
        };

        await this.$server
            .U("/setting/sgsms", smsObject)
            .then((response: any) => {
                if (response != undefined) {
                    Dialog.success(this._("w_SmsServer_Setting_Success"));
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                if (e.res.statusCode == 500) {
                    Dialog.error(this._("w_SmsServer_Setting_Fail"));
                }
                console.log(e);
                return false;
            });
    }

    ISmsServerComponent() {
        return `
            interface ISmsServerComponent {

                /**
                 * @uiLabel - ${this._("w_SmsServer_Enable")}
                 * @uiType - iv-form-switch
                 */
                enable: boolean;


                /**
                 * @uiLabel - ${this._("w_Account")}
                 * @uiPlaceHolder - ${this._("w_Account")}
                 */
                account: string;


                /**
                 * @uiLabel - ${this._("w_Password")}
                 * @uiPlaceHolder - ${this._("w_Password")}
                 * @uiType - iv-form-password
                 */
                password: string;


                /**
                 * @uiLabel - ${this._("w_URL")}
                 * @uiPlaceHolder - ${this._("w_URL")}
                 */
                url: string;
            }
        `;
    }
}
</script>

