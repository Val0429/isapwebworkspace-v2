<template>
    <div class="animated fadeIn">
        <iv-auto-card
            :visible="true"
            :label="_('w_Acs_Card_Range')"
        >
            <ul v-if="hasData">
                <li
                    class="row col-sm"
                    v-for="(i, index) in rangeType"
                >
                    {{ index == 0 ? _('w_Acs_Card_Staff') : _('w_Acs_Card_Visitor') }}
                    <dl
                        class="col-sm"
                        v-for="(j, index) in i"
                    >
                        <dt>
                            {{  index }}</dt>
                        <dd>
                            {{ j }}</dd>
                    </dl>
                </li>
            </ul>
            <div class="row col-sm">
                <p>{{ _('w_Acs_3rd_Acs') }}</p>
                <iv-form-switch
                    class="col-sm"
                    @input="getStatus($event)"
                />
            </div>
        </iv-auto-card>

        <iv-auto-card
            v-if="isUse"
            :visible="isUse"
            :label="_('w_Acs_Acs')"
        >

            <iv-form
                :interface="IMailServerComponent()"
                :value="inputFormData"
                @submit="saveMailServer($event)"
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
    hasData: boolean = false;
    isUse: boolean = false;

    // input框綁定model資料
    inputFormData: IInputFormData = {
        email: "",
        testEmail: "",
        host: "",
        password: "",
        port: 0,
        enable: true
    };

    rangeType: any = {};
    cardRange: any = {
        staffCardRange: {
            min: 0,
            max: 0
        },
        visitorCardRange: {
            min: 0,
            max: 0
        }
    };

    inputTestEmail: string = "";

    created() {
        this.clearMailServerData();
    }

    mounted() {
        this.initAcsApi();
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

    async initAcsApi() {
        await this.$server
            .R("/setting/acs")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.hasData = true;
                    this.rangeType = [
                        response.staffCardRange,
                        response.visitorCardRange
                    ];
                    // Dialog.success(this._("w_MailSetting_EmailSuccess"));
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e
                    // this._("w_MailServer_Setting_Fail")
                );
            });
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
    getStatus(data: any) {
        this.isUse = data;
    }

    IMailServerComponent() {
        return `
             interface IMailServerComponent {
                /**
                 * @uiLabel - ${this._("w_Acs_IPAddress")}
                 * @uiPlaceHolder - ${this._("w_Acs_IPAddress")}
                 * @uiType - iv-form-ip
                 */
                ip: string;


                 /**
                 * @uiLabel - ${this._("w_Acs_HTTPPort")}
                 * @uiPlaceHolder - ${this._("w_Acs_HTTPPort")}
                 * @uiAttrs - { max: 65535, min: 1}
                 */
                port: number;


                /**
                 * @uiLabel - ${this._("w_Account")}
                 * @uiPlaceHolder - ${this._("w_Account")}
                 * @uiHidden - true
                 */
                account: string;

                /**
                 * @uiLabel - ${this._("w_Password")}
                 * @uiPlaceHolder - ${this._("w_Password")}
                 * @uiType - iv-form-password
                 * @uiHidden - true
                 */
                password: string;

                /**
                 * @uiLabel - ${this._("w_Acs_ServiceName")}
                 * @uiPlaceHolder - ${this._("w_Acs_ServiceName")}
                 */
                servicename: string;

                /**
                 * @uiLabel - ${this._("w_Acs_FingerPrinter")}
                 * @uiPlaceHolder - ${this._("w_Acs_FingerPrinter")}
                 * @uiHidden - true
                 */
                fingerprinter: string;

                /**
                 * @uiLabel - ${this._("w_Acs_AccessGroupName")}
                 * @uiPlaceHolder - ${this._("w_Acs_AccessGroupName")}
                 */
                accessgroup: string;
            }
        `;
    }
}
</script>

