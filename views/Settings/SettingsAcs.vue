<template>
    <div class="animated fadeIn">
        <iv-auto-card
            :visible="true"
            :label="_('w_Acs_Card_Range')"
        >
            <iv-form
                :interface="ICardRangeComponent()"
                :value="initCardRange"
                @update:*="dataUpdate"
                @submit="cardRangeApi($event)"
            ></iv-form>
        </iv-auto-card>

        <iv-auto-card
            v-if="isUse"
            :visible="isUse"
            :label="_('w_Acs_Acs')"
        >
            <iv-form
                :interface="IAcsServerComponent()"
                :value="initAcsFormData"
                @submit="saveAcsServer($event)"
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
    isUse: boolean = false;

    rangeType: any = {};
    initCardRange: any = {};
    initAcsFormData: any = {};

    mounted() {
        this.initCardRangeApi();
        this.initAcsServerApi();
    }

    async initCardRangeApi() {
        await this.$server
            .R("/setting/acs")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.isUse = response.isUseACSServer;
                    this.initCardRange = response;
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

    async initAcsServerApi() {
        await this.$server
            .R("/setting/acs-server")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.initAcsFormData = response;
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

    async cardRangeApi(data) {
        await this.$server
            .U("/setting/acs", data)
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

    async AcsServer(data) {
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
    }
    dataUpdate(data: any) {
        if (data.key == "isUseACSServer") {
            this.isUse = data.value;
        }
    }

    ICardRangeComponent() {
        return `
            interface ICardRangeComponent {
                /**
                 * @uiLabel - ${this._("w_Acs_Card_Staff")}
                 */
                staffCardRange: interface {
                    /**
                     * @uiLabel - ${this._("w_Acs_Card_Min")}
                     * @uiPlaceHolder - ${this._("w_Acs_Card_Min")}
                     * @uiType - iv-form-number
                     * @uiColumnGroup - staff-range
                     */
                    min: number;
                    /**
                     * @uiLabel - ${this._("w_Acs_Card_Max")}
                     * @uiPlaceHolder - ${this._("w_Acs_Card_Max")}
                     * @uiType - iv-form-number
                     * @uiColumnGroup - staff-range
                     */
                    max: number;
                };

                /**
                 * @uiLabel - ${this._("w_Acs_Card_Visitor")}
                 */
                visitorCardRange: interface {
                    /**
                     * @uiLabel - ${this._("w_Acs_Card_Min")}
                     * @uiPlaceHolder - ${this._("w_Acs_Card_Min")}
                     * @uiType - iv-form-number
                     * @uiColumnGroup - visitor-range
                     */
                    min: number;
                    /**
                     * @uiLabel - ${this._("w_Acs_Card_Max")}
                     * @uiPlaceHolder - ${this._("w_Acs_Card_Max")}
                     * @uiType - iv-form-number
                     * @uiColumnGroup - visitor-range
                     */
                    max: number;
                };

                /**
                 * @uiLabel - ${this._("w_Acs_3rd_Acs")}
                 * @uiType - iv-form-switch
                 */
                isUseACSServer?: boolean;
            }
        `;
    }

    IAcsServerComponent() {
        return `
             interface IAcsServerComponent {
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
                serviceId: string;

                /**
                 * @uiLabel - ${this._("w_Acs_FingerPrinter")}
                 * @uiPlaceHolder - ${this._("w_Acs_FingerPrinter")}
                 * @uiHidden - true
                 */
                fingerprinter: string;
            }
        `;
    }
}
</script>

