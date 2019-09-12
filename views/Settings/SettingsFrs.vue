<template>
    <div class="animated fadeIn">

        <iv-auto-card
            :visible="true"
            :label="_('w_FrsServer_Setting')"
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
            :title="_('w_FrsServer_Test')"
            v-model="modalShow"
        >

            <div class="card-content">
                <b-form-group
                    :label="_('w_FrsServer_Phone')"
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
export default class Frs extends Vue {
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

    async readSmsServer() {
        let param: any = { paging: { all: true } };
        await this.$server
            .R("/setting/frs", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.inputFormData.enable = response.enable;
                    this.inputFormData.password = response.password;
                    this.inputFormData.account = response.account;
                    this.inputFormData.url = response.url;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_FrsServer_Read_Fail")
                );
            });
    }

    // 新增SmsServer
    async saveSmsServer(data) {
        const param: {
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
        Loading.show();
        await this.$server
            .U("/setting/frs", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    Dialog.success(this._("w_FrsServer_Setting_Success"));
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_FrsServer_Setting_Fail")
                );
            });
    }

    ISmsServerComponent() {
        return `
            interface ISmsServerComponent {

                /**
                 * @uiLabel - ${this._("w_FrsServer_Enable")}
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

