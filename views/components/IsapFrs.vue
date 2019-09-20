<template>
    <div class="animated fadeIn">
        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >
            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :label="_('w_Frs_FrList')"
            >
                <template #toolbox>
                    <iv-toolbox-view
                        :disabled="selectedDetail.length !== 1"
                        @click="pageToView"
                    />

                    <iv-toolbox-edit
                        :disabled="selectedDetail.length !== 1"
                        @click="pageToEdit()"
                    />
                    <iv-toolbox-delete
                        :disabled="selectedDetail.length === 0"
                        @click="doDelete"
                    />
                    <iv-toolbox-divider />
                    <iv-toolbox-add @click="pageToAdd()" />
                </template>

                <iv-table
                    ref="listTable"
                    :interface="ITableList()"
                    :multiple="tableMultiple"
                    :server="{ path: '/client/frs' }"
                    @selected="selectedItem($event)"
                >
                    <template #actions$>
                        <iv-toolbox-more :disabled="selectedDetail.length !== 1">
                            <iv-toolbox-view @click="pageToView" />
                            <iv-toolbox-edit @click="pageToEdit" />
                            <iv-toolbox-delete @click="doDelete" />
                        </iv-toolbox-more>
                    </template>

                </iv-table>
            </iv-card>

            <!-- view -->
            <iv-auto-card
                key="transition_2"
                v-show="transition.step === 2"
                :visible="true"
                :label="_('w_Frs_ViewFr') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IViewForm()"
                    :value="inputFormData"
                >
                </iv-form>

                <template #footer>
                    <b-button
                        variant="dark"
                        size="lg"
                        @click="pageToList()"
                    >{{ _('w_Back') }}
                    </b-button>
                </template>

            </iv-auto-card>

            <!-- Modify -->
            <iv-auto-card
                key="transition_3"
                v-show="transition.step === 3"
                :visible="true"
                :label="inputFormData.objectId == '' ? _('w_Frs_AddFr') : _('w_Frs_EditFr') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IModifyForm()"
                    :value="inputFormData"
                    @update:*="updateModifyForm"
                    @submit="saveModifyForm($event)"
                >
                </iv-form>

                <template #footer-before>
                    <b-button
                        variant="dark"
                        size="lg"
                        @click="pageToList()"
                    >{{ _('w_Back') }}
                    </b-button>
                </template>

            </iv-auto-card>

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";
import ResponseFilter from "@/services/ResponseFilter";
import Loading from "@/services/Loading";
import RegexServices from "@/services/RegexServices";

@Component({
    components: {}
})
export default class ClientFRS extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    tableMultiple: boolean = true;
    selectedDetail: any = [];

    inputFormData = {
        objectId: "",
        name: "",
        protocol: "http",
        ip: "0.0.0.0",
        port: 80,
        account: "",
        password: ""
    };

    // select
    selectItem: {
        floor: any;
    } = {
        floor: {}
    };

    floors: string[] = [];

    created() {}

    mounted() {}

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        this.clearInputData();
        (this.$refs.listTable as any).reload();
    }

    pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
        this.clearInputData();
        this.getInputData();
    }

    async pageToAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        this.clearInputData();
        await this.initSelectItem();
    }

    async pageToEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        this.clearInputData();
        await this.initSelectItem();
        this.getInputData();
    }

    async doDelete() {
        await Dialog.confirm(
            this._("w_Frs_DeleteConfirm"),
            this._("w_Delete_ConfirmLabel"),
            () => {
                Loading.show();
                for (let detail of this.selectedDetail) {
                    let param = {
                        objectId: detail.objectId
                    };

                    param = RegexServices.trim(param);
                    this.$server
                        .D("/client/frs", param)
                        .then((response: any) => {
                            ResponseFilter.successCheck(
                                this,
                                response,
                                (response: any) => {
                                    this.pageToList();
                                }
                            );
                        })
                        .catch((e: any) => {
                            return ResponseFilter.catchError(this, e);
                        });
                }
            }
        );
    }

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            name: "",
            protocol: "http",
            ip: "",
            port: 0,
            account: "",
            password: ""
        };
    }

    getInputData() {
        this.clearInputData();
        for (const param of this.selectedDetail) {
            this.inputFormData = {
                objectId: param.objectId,
                name: param.name,
                protocol: param.protocol,
                ip: param.ip,
                port: param.port,
                account: param.account,
                password: param.password
            };
        }
    }

    selectedItem(datas: any) {
        this.selectedDetail = datas;
    }

    updateModifyForm(datas: any) {
        this.inputFormData[datas.key] = datas.value;
    }

    async initSelectItem() {
        this.selectItem.floor = {};
        this.initSelectItemFloorWithAPI();
    }

    async initSelectItemFloorWithAPI() {
        let param: any = { paging: { all: true } };
        param = RegexServices.trim(param);
        await this.$server
            .R("/location/floor", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (
                        response.results != undefined &&
                        response.results.length > 0
                    ) {
                        this.floors = JSON.parse(
                            JSON.stringify(response.results)
                        );
                        for (let ret of response.results) {
                            if (
                                ret.objectId != undefined &&
                                ret.name != undefined
                            ) {
                                this.$set(
                                    this.selectItem.floor,
                                    ret.objectId,
                                    ret.name
                                );
                            }
                        }
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async saveModifyForm(event: any) {
        let datas: any = {
            datas: [
                {
                    name: event.name ? event.name : "",
                    floorId: event.floors ? event.floors : "",
                    protocol: event.protocol ? event.protocol : "",
                    ip: event.ip ? event.ip : "",
                    port: event.port ? event.port : "",
                    account: event.account ? event.account : "",
                    password: event.password ? event.password : ""
                }
            ]
        };

        if (this.inputFormData.objectId == "") {
            Loading.show();
            datas = RegexServices.trim(datas);
            await this.$server
                .C("/client/frs", datas)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            this.pageToList();
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else {
            Loading.show();
            datas = RegexServices.trim(datas);
            await this.$server
                .U("/client/frs", datas)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            this.pageToList();
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        }
    }

    ITableList() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;

                /**
                 * @uiLabel - ${this._("w_Account_Account")}
                 */
                account: string;

                /**
                 * @uiLabel - ${this._("w_Frs_Device_Name")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Frs_Position")}
                 * @uiType - iv-form-string
                 */
                floorId: string;

                /**
                 * @uiLabel - ${this._("w_Frs_IPAddress")}
                 */
                ip: string;

                /**
                 * @uiLabel - ${this._("w_Frs_HTTPPort")}
                 */
                port: string;

                /**
                 * @uiLabel - ${this._("w_Frs_Setting_Protocol")}
                 * @uiType - iv-form-label
                 */
                protocol?: string;

            }
        `;
    }

    IViewForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Account_UserTitles")}
                 * @uiType - iv-form-label
                 */
                account?: string;

                /**
                 * @uiLabel - ${this._("w_Frs_Device_Name")}
                 * @uiType - iv-form-label
                 */
                name?: string;

                /**
                 * @uiLabel - ${this._("w_Frs_Position")}
                 * @uiType - iv-form-string
                 */
                floorId: string;

                /*
                * @uiLabel - ${this._("w_Frs_IPAddress")}
                * @uiType - iv-form-label
                */
                ip?: string;

                /*
                * @uiLabel - ${this._("w_Frs_HTTPPort")}
                * @uiType - iv-form-label
                */
                port?: string;

                /**
                 * @uiLabel - ${this._("w_Frs_Setting_Protocol")}
                 * @uiType - iv-form-label
                 */
                protocol?: string;
            }
        `;
    }

    IModifyForm() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_Account_Account")}
                 * @uiType - iv-form-string
                 */
                account: string;

                /**
                 * @uiLabel - ${this._("w_Account_Password")}
                 * @uiType - iv-form-password
                 * @uiHidden - ${this.inputFormData.objectId != ""}
                 * @uiRequired - true
                 * @uiColumnGroup - password
                 */
                password?: string;

                /**
                 * @uiLabel - ${this._("w_Account_ConfirmPassword")}
                 * @uiType - iv-form-password
                 * @uiHidden - ${this.inputFormData.objectId != ""}
                 * @uiRequired - true
                 * @uiValidation - (value, all) => value === all.password
                 * @uiColumnGroup - password
                 */
                confirmPassword?: string;

                /**
                 * @uiLabel - ${this._("w_Frs_Device_Name")}
                 * @uiType - iv-form-string
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Frs_Position")}
                 */
                floors: ${toEnumInterface(this.selectItem.floor, false)};

                /**
                 * @uiLabel - ${this._("w_Frs_IPAddress")}
                 * @uiPlaceHolder - ${this._("w_Frs_IPAddress")}
                 * @uiType - iv-form-ip
                 */
                ip: string;

                /**
                 * @uiLabel - ${this._("w_Frs_HTTPPort")}
                 * @uiPlaceHolder - ${this._("w_Frs_HTTPPort")}
                 * @uiAttrs - { max: 65535, min: 1}
                 */
                port: number;

                /**
                 * @uiLabel - ${this._("w_Frs_Setting_Protocol")}
                 */
                protocol: ${toEnumInterface({
                    http: "http",
                    https: "https"
                })};
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>




