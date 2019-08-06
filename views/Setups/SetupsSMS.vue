<template>
    <div class="animated fadeIn">

        <iv-auto-card
            :visible="true"
            :label="_('w_SMSSetting_SMSSetting')"
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
                                :placeholder="_('w_SMSSetting_placeholder')"
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

    // Service
    import ResponseFilter from "@/services/ResponseFilter";
    import Dialog from "@/services/Dialog";
    import Loading from "@/services/Loading";

    interface IInputFormData {
        comPort: string;
        enable: boolean;

    }

    @Component({
        components: {}
    })
    export default class SetupsSMS extends Vue {
        modalShow: boolean = false;

        // input框綁定model資料
        inputFormData: IInputFormData = {
            comPort: "",
            enable: true,
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
                comPort: "",
                enable: true,
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
            Loading.show();
            await this.$server
                .C("/test/sms", smsObject)
                .then((response: any) => {
                    ResponseFilter.successCheck(this, response, (response: any) => {
                        this.modalShow = !this.modalShow;
                        Dialog.success(this._("w_SmsServer_Setting_Test_Success"));
                    });
                })
                .catch((e: any) => {
                    this.modalShow = !this.modalShow;
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_SmsServer_Setting_Test_Fail")
                    );
                });
        }

        async readSmsServer() {
            await this.$server
                .R("/config")
                .then((response: any) => {
                    ResponseFilter.successCheck(this, response, (response: any) => {
                        this.inputFormData.enable = response.sms.enable;
                        this.inputFormData.comPort = response.sms.comPort;
                    });
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_SmsServer_Read_Fail")
                    );
                });
        }

        // 新增SmsServer
        async saveSmsServer(data) {

            const sms: {
                enable: string;
                comPort: string;
            } = {
                enable: data.enable,
                comPort: data.comPort,
            };

            const addParam = {
                data: {
                    sms
                }
            };

            Loading.show();
            await this.$server
                .C("/config", addParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(this, response, (response: any) => {
                        Dialog.success(this._("w_SMSSetting_EmailSuccess"));
                    });
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_SmsServer_Setting_Fail")
                    );
                });
        }

        ISmsServerComponent() {
            return `
            interface ISmsServerComponent {

                /**
                 * @uiLabel - ${this._("w_SMSSetting_COMPortNumber")}
                 * @uiPlaceHolder - ${this._("w_SMSSetting_COMPortNumber")}
                 */
                comPort: string;


                /**
                 * @uiLabel - ${this._("w_SmsServer_Enable")}
                 * @uiType - iv-form-switch
                 */
                enable: boolean;

            }
        `;
        }
    }
</script>

