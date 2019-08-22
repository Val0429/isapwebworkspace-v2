<template>
    <div class="animated fadeIn">

        <iv-auto-card
            :visible="true"
            :label="_('w_VisitorCardSetting')"
        >

            <iv-form
                :interface="ISmsServerComponent()"
                :value="inputFormData"
                @submit="saveSmsServer($event)"
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
        rangeend: number;
        rangestart: number;
    }

    @Component({
        components: {}
    })
    export default class SetupsVisitorCard extends Vue {
        modalShow: boolean = false;

        // input框綁定model資料
        inputFormData: IInputFormData = {
            rangeend: 11000,
            rangestart: 10000,
        };


        created() {
            this.clearLicenseData();
            this.readSmsServer();
        }

        mounted() {
            this.readSmsServer();
        }

        clearLicenseData() {
            this.inputFormData = {
                rangeend: 11000,
                rangestart: 10000,
            };

        }

        async readSmsServer() {
            await this.$server
                .R("/config")
                .then((response: any) => {
                    ResponseFilter.successCheck(this, response, (response: any) => {
                        this.inputFormData.rangestart = response.visitorcard.rangestart;
                        this.inputFormData.rangeend = response.visitorcard.rangeend;
                    });
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_VisitorCardSetting_ReadFail")
                    );
                });
        }

        // 新增SmsServer
        async saveSmsServer(data) {

            if (data.rangestart < 10000 || data.rangeend < 10000) {
                Dialog.error(this._("w_VisitorCardSetting_error"));
                return false;
            }

            if (data.rangestart < data.rangeend ) {
                Dialog.error(this._("w_VisitorCardSetting_error1"));
                return false;
            }

            const visitorcard: {
                rangeend: number;
                rangestart: number;

            } = {
                rangeend: data.rangeend,
                rangestart: data.rangestart,
            };

            const addParam = {
                data: {
                    visitorcard
                }
            };

            Loading.show();
            await this.$server
                .C("/config", addParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(this, response, (response: any) => {
                        Dialog.success(this._("w_VisitorCardSetting_Success"));
                    });
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_VisitorCardSetting_Fail")
                    );
                });
        }

        ISmsServerComponent() {
            return `
            interface ISmsServerComponent {

                /**
                 * @uiLabel - ${this._("w_VisitorCardSetting_RangeStart")}
                 * @uiPlaceHolder - ${this._("w_VisitorCardSetting_RangeStart")}
                 * @uiAttrs - { min: 10000 }
                 */
                rangestart: number;


                /**
                 * @uiLabel - ${this._("w_VisitorCardSetting_RangeEnd")}
                 * @uiPlaceHolder - ${this._("w_VisitorCardSetting_RangeEnd")}
                 * @uiAttrs - { min: 10001}
                 */
                rangeend: number;

            }
        `;
        }
    }
</script>

