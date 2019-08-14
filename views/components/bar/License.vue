<template>
    <div class="animated fadeIn">

        <iv-card
            v-show="pageStep === ePageStep.list"
            :label=" _('w_License_List') "
        >

            <template #toolbox>
                <iv-toolbox-divider />
                <iv-toolbox-add @click="pageToAdd()" />
            </template>

            <iv-table
                ref="licenseTable"
                :params="params"
                :interface="IList()"
                :server="{ path: '/license' }"
            >
                <template #productName="{$attrs,$listeners}">
                    {{$attrs.row.productNO == "00221" ? "ACS License Count by Door" : $attrs.row.productNO == "00222" ? "ACS License Count by Elevator" : "UNKNOWN LICENSE"}}
                </template>
            </iv-table>

        </iv-card>

        <!-- 選擇增加方式 -->
        <iv-auto-card
            v-show="addStep === eAddStep.select"
            :label="_('w_License_Add') "
        >
            <template #toolbox>
                <iv-toolbox-back @click="pageToList" />
                <iv-toolbox-step-backward
                    v-show="addStep === eAddStep.macLicense || addStep === eAddStep.offline"
                    @click="pageStepBackward"
                />
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
                    v-show="addStep === eAddStep.macLicense || addStep === eAddStep.offline"
                    variant="secondary"
                    size="lg"
                    @click="pageStepBackward"
                >{{ _('w_StepBackward') }}
                </b-button>
            </template>

        </iv-auto-card>

        <!-- 使用 macLicense -->
        <iv-auto-card
            v-show="addStep === eAddStep.macLicense"
            :label="_('w_License_Add') "
        >
            <template #toolbox>
                <iv-toolbox-back @click="pageToList" />
                <iv-toolbox-step-backward
                    v-show="addStep === eAddStep.macLicense || addStep === eAddStep.offline"
                    @click="pageStepBackward"
                />
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
                    v-show="addStep === eAddStep.macLicense || addStep === eAddStep.offline"
                    variant="secondary"
                    size="lg"
                    @click="pageStepBackward"
                >{{ _('w_StepBackward') }}
                </b-button>
            </template>

        </iv-auto-card>

        <!-- 使用 offline -->
        <iv-auto-card
            v-show="addStep === eAddStep.offline"
            :label="_('w_License_Add')"
        >
            <template #toolbox>
                <iv-toolbox-back @click="pageToList" />
                <iv-toolbox-step-backward
                    v-show="addStep === eAddStep.macLicense || addStep === eAddStep.offline"
                    @click="pageStepBackward"
                />
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
                    v-show="addStep === eAddStep.macLicense || addStep === eAddStep.offline"
                    variant="secondary"
                    size="lg"
                    @click="pageStepBackward"
                >{{ _('w_StepBackward') }}
                </b-button>
            </template>

        </iv-auto-card>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog/Dialog";

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

enum EPageStep {
    list = "list",
    none = "none"
}

enum EAddStep {
    select = "select",
    macLicense = "macLicense",
    offline = "offline",
    none = "none"
}

@Component({
    components: {}
})
export default class License extends Vue {
    macSelectItem: any = {};
    params:any={};
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.list;

    eAddStep = EAddStep;
    addStep: EAddStep = EAddStep.none;

    licenseInputDataMac: ILicenseInputDataMac = {
        key: "",
        mac: ""
    };

    licenseInputDataOffline: ILicenseInputDataOffline = {
        data: ""
    };

    mounted() {}

    initMacSelectItem() {
        this.macSelectItem = {};
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

    pageToAdd() {
        this.pageStep = EPageStep.none;
        this.addStep = EAddStep.select;
        this.clearInputData();
    }

    pageToList() {
        this.pageStep = EPageStep.list;
        this.addStep = EAddStep.none;
        this.params={};
    }

    async pageToAddByMac() {
        this.clearInputData();
        await this.initMacSelectItem();
        this.addStep = EAddStep.macLicense;
    }

    pageToAddByOffline() {
        this.clearInputData();
        this.addStep = EAddStep.offline;
    }

    pageStepBackward() {
        this.clearInputData();
        this.addStep = EAddStep.select;
    }

    loadTextFromFile(e: any) {
        const file = e.target.files[0];
        const reader = new FileReader();

        // reader.onload = (e: any) => console.log('219', e.target.result);
        reader.onload = (e: any) => {
            console.log("e.target.result", e.target.result);
            this.licenseInputDataOffline.data = e.target.result;
        };
        reader.readAsText(file);
    }

    async saveAddLicenseMac(data) {
        const licenseParam: {
            keyOrData: string;            
        } = {
            keyOrData: data.key,            
        };

        await this.$server
            .C("/license" as any, licenseParam)
            .then((response: any) => {
                if (response != undefined) {
                    Dialog.success(this._("w_License_Setting_Success"));
                    this.pageToList();
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                if (e.res.statusCode == 500 || e.res.statusCode == 400) {
                    Dialog.error(this._("w_License_Setting_Fail"));
                    return false;
                }

                console.log(e);
                return false;
            });
    }

    async saveAddLicenseOffLine(data) {
        const licenseParam: {
            keyOrData: any;
        } = {
            keyOrData: data.data
        };

        await this.$server
            .C("/license" as any, licenseParam)
            .then((response: any) => {
                if (response != undefined) {
                    Dialog.success(this._("w_License_Setting_Success"));
                    this.pageToList();
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                if (e.res.statusCode == 500 || e.res.statusCode == 400) {
                    Dialog.error(this._("w_License_Setting_Fail"));
                    return false;
                }

                console.log(e);
                return false;
            });
    }

    IList() {
        return `
            interface {
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

