<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <!-- List -->
            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :label=" _('w_License_List') "
            >

                <template #toolbox>
                    <iv-toolbox-divider />
                    <iv-toolbox-add @click="pageToAdd()" />
                </template>

                <iv-table
                    ref="licenseTable"
                    :interface="IList()"
                    :server="{ path: '/license' }"
                >

                </iv-table>

            </iv-card>

            <!-- 選擇增加方式 -->
            <!-- v-show="addStep === eAddStep.select" -->
            <iv-auto-card
                key="transition_2"
                v-show="transition.step === 2"
                :label="_('w_License_Add') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList" />
                </template>

                <iv-form :interface="IAddFromSelect()">

                    <template #licensemac="{$attrs, $listeners}">
                        <b-button
                            class="button ml-3 mr-5 mb-3 mt-2"
                            size="md"
                            variant="success"
                            type="button"
                            @click="pageToAddByMac()"
                        >
                            {{ _('w_License_Step1_mac') }}
                        </b-button>

                    </template>

                    <template #offline="{$attrs, $listeners}">
                        <b-button
                            class="button mb-3 mt-2"
                            size="md"
                            variant="success"
                            type="button"
                            @click="pageToAddByOffline()"
                        >
                            {{ _('w_License_Step1_offline') }}
                        </b-button>

                    </template>

                </iv-form>

                <template #footer-before>
                    <b-button
                        variant="dark"
                        size="lg"
                        @click="pageToList"
                    >{{ _('w_Back') }}
                    </b-button>

                    <b-button
                        variant="secondary"
                        size="lg"
                        @click="transitionStepBackward"
                    >{{ _('w_StepBackward') }}
                    </b-button>
                </template>

            </iv-auto-card>

            <!-- 使用 macLicense -->
            <!-- v-show="addStep === eAddStep.macLicense" -->
            <iv-auto-card
                key="transition_3"
                v-show="transition.step === 3"
                :label="_('w_License_Add') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList" />
                    <iv-toolbox-step-backward @click="transitionStepBackward" />
                </template>

                <iv-form
                    :interface="IAddFromMac()"
                    :value="licenseInputDataMac"
                    @submit="saveAddLicenseMac($event)"
                >

                    <template #key="{$attrs, $listeners}">
                        <iv-form-license
                            v-bind="$attrs"
                            v-on="$listeners"
                        ></iv-form-license>
                    </template>

                    <template #mac="{$attrs, $listeners}">
                        <iv-form-selection
                            v-bind="$attrs"
                            v-on="$listeners"
                        ></iv-form-selection>
                    </template>

                </iv-form>

                <template #footer-before>
                    <b-button
                        variant="dark"
                        size="lg"
                        @click="pageToList"
                    >{{ _('w_Back') }}
                    </b-button>

                    <b-button
                        variant="secondary"
                        size="lg"
                        @click="transitionStepBackward"
                    >{{ _('w_StepBackward') }}
                    </b-button>
                </template>

            </iv-auto-card>

            <!-- 使用 offline -->
            <!-- v-show="addStep === eAddStep.offline" -->
            <iv-auto-card
                key="transition_4"
                v-show="transition.step === 4"
                :label="_('w_License_Add')"
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList" />
                    <iv-toolbox-step-backward @click="transitionStepBackward" />
                </template>

                <iv-form
                    :interface="IAddFromOffline()"
                    :value="licenseInputDataOffline"
                    @submit="saveAddLicenseOffLine($event)"
                >

                    <template #title="{ $attrs, $listeners }">
                        <div class="ml-3 mb-2 w-100">{{ _('w_License_UploadOfflineKey1') }}</div>
                    </template>

                    <template #data="{$attrs, $listeners}">
                        <div class="upload_file">
                            <b-form-file
                                v-bind="$attrs"
                                v-on="$listeners"
                                @change="loadTextFromFile"
                            >
                            </b-form-file>
                        </div>

                    </template>

                </iv-form>

                <template #footer-before>
                    <b-button
                        variant="dark"
                        size="lg"
                        @click="pageToList"
                    >{{ _('w_Back') }}
                    </b-button>

                    <b-button
                        variant="secondary"
                        size="lg"
                        @click="transitionStepBackward"
                    >{{ _('w_StepBackward') }}
                    </b-button>
                </template>

            </iv-auto-card>

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";

interface ISelectItem {
    mac: object[];
}

interface ILicenseInputDataMac {
    key: string;
    mac: string;
}

interface ILicenseInputDataOffline {
    data: any;
}

@Component({
    components: {}
})
export default class License extends Vue {
    macSelectItem: any = {};

    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    licenseInputDataMac: ILicenseInputDataMac = {
        key: "",
        mac: ""
    };

    licenseInputDataOffline: ILicenseInputDataOffline = {
        data: ""
    };

    mounted() {}

    async initMacSelectItem() {
        await this.$server
            .R("/server/network")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response) {
                        // 自定義 macSelectItem 的 key 的方式
                        this.macSelectItem[
                            returnValue.mac
                        ] = `${returnValue.mac}, ${returnValue.ifname}`;
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    clearInputData() {
        this.licenseInputDataMac = {
            key: "",
            mac: ""
        };

        this.licenseInputDataOffline = {
            data: ""
        };
    }

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
    }

    pageToAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
        this.clearInputData();
    }

    async pageToAddByMac() {
        this.clearInputData();
        await this.initMacSelectItem();
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
    }

    pageToAddByOffline() {
        this.clearInputData();
        this.transition.prevStep = this.transition.step;
        this.transition.step = 4;
    }

    transitionStepBackward() {
        this.clearInputData();
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
    }

    loadTextFromFile(e: any) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.licenseInputDataOffline.data = e.target.result;
        };
        reader.readAsText(file);
    }

    async saveAddLicenseMac(data) {
        const licenseParam: {
            key: string;
            mac: string;
        } = {
            key: data.key,
            mac: data.mac
        };
        Loading.show();
        await this.$server
            .C("/license", licenseParam)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    Dialog.success(this._("w_License_Setting_Success"));
                    this.pageToList();
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_License_Setting_Fail")
                );
            });
    }

    async saveAddLicenseOffLine(data) {
        const licenseParam: {
            data: string;
        } = {
            data: data.data
        };
        Loading.show();
        await this.$server
            .C("/license", licenseParam)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    Dialog.success(this._("w_License_Setting_Success"));
                    this.pageToList();
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_License_Setting_Fail")
                );
            });
    }

    IList() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;


                /**
                 * @uiLabel - ${this._("w_License_LicenseKey")}
                 */
                licenseKey: string;


                /**
                 * @uiLabel - ${this._("w_License_productName")}
                 */
                productName: string;


                /**
                 * @uiLabel - ${this._("w_License_Mac")}
                 */
                mac: string;



                /**
                 * @uiLabel - ${this._("w_License_Quantity")}
                 */
                count: number;


                /**
                 * @uiLabel - ${this._("w_License_Trial")}
                 */
                trial: boolean;


                /**
                 * @uiLabel - ${this._("w_License_RegisterDate")}
                 */
                registerDate: string;


                /**
                 * @uiLabel - ${this._("w_License_ExpireDate")}
                 */
                expireDate: string;


            }
            `;
    }

    IAddFromSelect() {
        return `
            interface {
                licensemac: any;
                offline: any;
            }
         `;
    }

    IAddFromMac() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_License_License_Key")}
                 * @uiPlaceHolder - ${this._(
                     "w_License_License_KeyPlaceholder"
                 )}
                 * @uiAttrs - { maxlength: 29}
                 * @uiType - iv-form-license
                 */
                key: string;


                /**
                 * @uiLabel - ${this._("w_License_Mac")}
                 * @uiPlaceHolder - ${this._("w_License_Mac")}
                 */
                mac: ${toEnumInterface(this.macSelectItem as any)};
            }
        `;
    }

    IAddFromOffline() {
        return `
            interface {

                title?: any;

                /**
                * @uiLabel - ${this._("w_License_UploadOfflineKey")}
                * @uiPlaceHolder - ${this._("w_License_UploadOfflineKey")}
                */
                data: string;

            }
        `;
    }
}
</script>


<style lang="scss" scoped>
.upload_file {
    margin-left: 20px;
    width: 97%;
}
</style>

