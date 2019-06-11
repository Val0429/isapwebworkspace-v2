<template>
    <div class="animated fadeIn">
        <iv-auto-card
            :visible="true"
            :label="_('w_Weather_Add')"
        >

            <iv-form
                :interface="IAddFrom()"
                :value="inputWeatherData"
                @submit="saveAddWeather($event)"
            >
                <template #info="{$attrs}">
                    <p class="info">{{ _('w_Weather_Step1_info') }}</p>
                </template>
            </iv-form>

            <template #footer-before>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToWeatherTest()"
                >{{ _('w_Test') }}
                </b-button>
            </template>

        </iv-auto-card>

        <!-- 點擊彈出test -->
        <b-modal
            ref="test"
            hide-footer
            hide-header
            size="md"
            :title="_('w_Weather_Test')"
        >

            <iv-auto-card
                :visible="true"
                :label="_('w_Weather_Test')"
            >

                <iv-form
                    :interface="ITest()"
                    :value="inputWeatherTestData"
                    @submit="sendWeatherTest($event)"
                >
                    <template #info="{$attrs}">
                        <p class="info">{{ _('w_Weather_Step1_info') }}</p>
                    </template>
                </iv-form>

                <template #footer-before>
                    <b-button
                        variant="dark"
                        size="lg"
                        @click="pageToForm()"
                    >{{ _('w_Cancel') }}
                    </b-button>
                </template>

            </iv-auto-card>

        </b-modal>

        <!-- 點擊彈出結果 -->
        <b-modal
            ref="detail"
            hide-footer
            size="md"
            :title="_('w_Weather_Data')"
        >

            <iv-card
                :visible="true"
                :label="_('w_Weather_ShowDetail')"
            >
                <iv-form
                    :interface="IWeatherDetail()"
                    :value="dataFromApi"
                ></iv-form>

                <template #footer>
                    <b-button
                        variant="dark"
                        size="lg"
                        @click="pageToForm1()"
                    >{{ _('w_Cancel') }}
                    </b-button>
                </template>
            </iv-card>

        </b-modal>

    </div>
</template>

<script lang="ts">
    import { Vue, Component, Watch } from "vue-property-decorator";
    import {IWeatherResults} from '@/config/default/api/interfaces';

    import ResponseFilter from "@/services/ResponseFilter";
    import Dialog from "@/services/Dialog/Dialog";

    interface IDataFromApi extends IWeatherResults {
        latitude:  number,
        longitude:  number,
        timezone: string,
    }

    @Component({
        components: {}
    })
    export default class Weather extends Vue {

        inputWeatherData = {
            secretKey: '',
        };

        inputWeatherTestData = {
            latitude: null,
            longitude: null,
        };

        dataFromApi: IDataFromApi = {
            latitude:  0,
            longitude:  0,
            timezone: '',
            icon: '',
            precipProbability: 0,
            temperature: 0,
            humidity: 0,
            cloudCover: 0,
            uvIndex: 0,
            visibility: 0,
        };

        created() {}

        mounted() {
            this.clearInputData();
            this.readWeather();
        }

        clearInputData() {

            this.inputWeatherTestData = {
                latitude: null,
                longitude: null,
            };
        }

        pageToWeatherTest() {
            this.clearInputData();
            (this.$refs['test'] as any).show()

        }

        pageToForm() {
            this.clearInputData();
            (this.$refs['test'] as any).hide()
        }

        pageToForm1() {
            this.clearInputData();
            (this.$refs['detail'] as any).hide()
        }


        // 送出測試
        async sendWeatherTest(data) {

            if (data.longitude > 180 || data.longitude < -180) {
                (this.$refs['test'] as any).hide();
                Dialog.error(this._("w_ErrorLongitude"));
                return false;
            }

            if (data.latitude > 90 || data.latitude < -90) {
                (this.$refs['test'] as any).hide();
                Dialog.error(this._("w_ErrorLatitude"));
                return false;
            }

            const weatherObject: {
                latitude: number;
                longitude: number;
            } = {
                latitude: data.latitude,
                longitude: data.longitude,
            };

            await this.$server.C("/setting/weather/test", weatherObject)
                .then((response: any) => {
                    if (response != undefined) {
                        this.dataFromApi = {
                            latitude:  response.latitude,
                            longitude:  response.longitude,
                            timezone: response.timezone,
                            icon: response.currently.icon,
                            precipProbability: response.currently.precipProbability,
                            temperature: response.currently.temperature,
                            humidity: response.currently.humidity,
                            cloudCover: response.currently.cloudCover,
                            uvIndex: response.currently.uvIndex,
                            visibility: response.currently.visibility,
                        };
                        (this.$refs['detail'] as any).show();
                        setTimeout(() => (this.$refs['test'] as any).hide() , 10)

                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);

                    }
                    console.log(e);
                    Dialog.error(this._("w_WeatherTest_Fail"));
                    (this.$refs['detail'] as any).hide() && (this.$refs['test'] as any).hide();
                    return false;
                });
        }

        async readWeather() {

            await this.$server.R("/setting/weather")
                .then((response: any) => {
                    if (response !== undefined) {
                        this.inputWeatherData.secretKey = response.secretKey;
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 400) {
                       Dialog.error(this._("w_Weather_Read_Fail"));
                    }
                    console.log(e);
                });
        }

        async saveAddWeather(data) {

            const weatherParam: {
                secretKey: string;
            } = {
                secretKey: data.secretKey,

            };

            await this.$server.U("/setting/weather", weatherParam)
                .then((response: any) => {
                    if (response !== undefined) {
                        Dialog.success(this._("w_Weather_Setting_Success"));
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 400) {
                        Dialog.error(this._("w_Weather_Setting_Fail"));

                    }
                    console.log(e);
                });
        }

        IAddFrom() {
            return `
                interface {

                    info?: any;


                    /**
                     * @uiLabel - ${this._("w_Weather_secretKey")}
                     * @uiPlaceHolder - ${this._("w_Weather_secretKey")}
                     */
                    secretKey: string;

            }
        `;
        }

        ITest() {
            return `
                interface {

                /**
                * @uiLabel - ${this._("w_Latitude")}
                * @uiPlaceHolder - ${this._("w_Latitude")}
                * @uiAttrs - { max: 90, min: -90 }
                */
                latitude: number;

                /**
                * @uiLabel - ${this._("w_Longitude")}
                * @uiPlaceHolder - ${this._("w_Longitude")}
                * @uiAttrs - { max: 180, min: -180 }
                */
                longitude: number;


            }
        `;
        }

        IWeatherDetail() {
            return `
                        interface {


                        /**
                         * @uiLabel - ${this._("w_Latitude")}
                         * @uiType - iv-form-label
                         */
                        latitude?: string;


                        /**
                         * @uiLabel - ${this._("w_Longitude")}
                         * @uiType - iv-form-label
                         */
                        longitude?: any;


                        /**
                         * @uiLabel - ${this._("w_Weather_timezone")}
                         * @uiType - iv-form-label
                         */
                        timezone?: string;


                        /**
                         * @uiLabel - ${this._("w_Weather_icon")}
                         * @uiType - iv-form-label
                         */
                        icon?: any;


                        /**
                         * @uiLabel - ${this._("w_Weather_precipProbability")}
                         * @uiType - iv-form-label
                         */
                        precipProbability?: string;


                        /**
                         * @uiLabel - ${this._("w_Weather_temperature")}
                         * @uiType - iv-form-label
                         */
                        temperature?: any;


                        /**
                         * @uiLabel - ${this._("w_Weather_humidity")}
                         * @uiType - iv-form-label
                         */
                        humidity?: any;


                        /**
                         * @uiLabel - ${this._("w_Weather_cloudCover")}
                         * @uiType - iv-form-label
                         */
                        cloudCover?: string;


                        /**
                         * @uiLabel - ${this._("w_Weather_uvIndex")}
                         * @uiType - iv-form-label
                         */
                        uvIndex?: any;


                        /**
                         * @uiLabel - ${this._("w_Weather_visibility")}
                         * @uiType - iv-form-label
                         */
                        visibility?: any;
                `;
        }
    }
</script>
<style lang="scss" scoped>
    .info {
        margin-left: 20px;
        margin-bottom: 20px;
        font-size: 16px;
    }
</style>


