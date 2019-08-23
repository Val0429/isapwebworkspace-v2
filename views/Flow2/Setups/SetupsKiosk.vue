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
                :label=" _('w_Kiosk_List') "
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
                    :server="{ path: '/kiosks' }"
                    @selected="selectedItem($event)"
                >

                    <template #strictMode="{$attrs, $listeners}">
                        {{ $attrs.row.data.strictMode ? _('w_Status_Yes') : _('w_Status_No') }}
                    </template>

                    <template #status="{$attrs, $listeners}">
                        <!--                        {{ checkKioskIdSame($attrs && $attrs.row && $attrs.row.data && $attrs.row.data.kioskId, wsData) ? 'Online' : status}}-->
                        {{ resolveStatus($attrs) }}
                    </template>

                    <template #Actions="{$attrs, $listeners}">
                        <iv-toolbox-more :disabled="selectedDetail.length !== 1">
                            <iv-toolbox-view @click="pageToView" />
                            <iv-toolbox-edit @click="pageToEdit()" />
                            <iv-toolbox-delete @click="doDelete" />
                        </iv-toolbox-more>
                    </template>

                </iv-table>
            </iv-card>

            <!-- view -->
            <iv-card
                key="transition_2"
                v-show="transition.step === 2"
                :visible="true"
                :label=" _('w_Kiosk_View') "
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

            </iv-card>

            <!--From (Add and Edit)-->
            <iv-auto-card
                key="transition_3"
                v-show="transition.step === 3"
                :visible="true"
                :label="inputFormData.objectId == '' ? _('w_Kiosk_Add') :  _('w_Kiosk_Edit')"
            >
                <template #toolbox>

                    <iv-toolbox-back @click="pageToList()" />

                </template>

                <iv-form
                    :interface="IModifyForm()"
                    :value="inputFormData"
                    @update:*="updateInputFormData"
                    @submit="saveAddOrEdit($event)"
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
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// WebSocket
import { Ws } from "@/services/WebSocket/Ws";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import ServerConfig from "@/services/ServerConfig";
import RegexServices from "@/services/RegexServices";

enum EStatus {
    Offline = "Offline",
    Online = "Online"
}

enum EWsType {
    none = "none",
    status = "status",
    initKiosk = "initKiosk",
    changeKiosk = "changeKiosk"
}

interface IKioskStatus {
    objectId: string;
    status: EStatus;
}

@Component({
    components: {}
})
export default class SetupsKiosk extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };
    tableMultiple: boolean = true;
    selectedDetail: any = [];
    selectionItem = {
        building: {}
    };

    inputFormData: any = {
        objectId: "",
        name: "",
        building: "",
        buildingName: "",
        kioskId: "",
        kioskName: "",
        roles: [],
        password: "",
        confirmPassword: "",
        updatePassword: "",
        updateConfirmPassword: "",
        strictMode: false
    };

    kioskStatus: IKioskStatus[] = [];
    alive: number = 0;

    ws: Ws = new Ws({
        url: "",
        OnOpen: async (e: Event): Promise<void> => {
            console.log("WS Alive Open");
        },

        OnMessage: async (e: MessageEvent): Promise<void> => {
            console.log("WS Alive message");
            this.handleWs(e.data);
        },

        OnError: async (e: Event): Promise<void> => {
            console.log("WS Alive Error");
        },

        OnClose: async (e: CloseEvent): Promise<void> => {
            console.log("WS Alive Close");
        }
    });

    created() {
        this.initSelectionBuilding();
    }

    mounted() {
        this.initWS();
    }

    beforeDestroy() {
        this.ws.Close();
    }

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        (this.$refs.listTable as any).reload();
    }

    pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
        this.getInputData();
    }

    pageToAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        this.clearInputData();
    }

    pageToEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        this.clearInputData();
        this.getInputData();
    }

    initWS() {
        let url = `ws://${ServerConfig.host}:${ServerConfig.port}/kiosks/aliveness?sessionId=${this.$user.sessionId}`;
        this.ws.url = url;
        this.ws.Connect();
    }

    handleWs(wsData: string) {
        try {
            let data: any = JSON.parse(wsData);
            let wsType: EWsType = EWsType.none;

            // check webSocket type
            if (data.statusCode != undefined) {
                wsType = EWsType.status;
            } else if (data.length > 0) {
                wsType = EWsType.initKiosk;
            } else if (data.alive != undefined) {
                wsType = EWsType.changeKiosk;
            }

            // do something for different type
            switch (wsType) {
                case EWsType.status:
                    if (data.statusCode == 401) {
                        this.$router.push({ path: "/" });
                    }
                    break;
                case EWsType.initKiosk:
                    for (let kiokData of data) {
                        this.reoloveWsStatus(kiokData);
                    }
                    break;
                case EWsType.changeKiosk:
                    for (let i in this.kioskStatus) {
                        let status = this.kioskStatus[i];
                        if (
                            data.instance != undefined &&
                            data.instance.objectId != undefined &&
                            status.objectId == data.instance.objectId
                        ) {
                            this.kioskStatus[i].status =
                                data.alive == 1
                                    ? EStatus.Online
                                    : EStatus.Offline;
                            break;
                        }
                    }
                    break;
            }
        } catch (e) {
            console.log("WS handle error: ", e);
        }
    }

    reoloveWsStatus(data: any) {
        let haveObjectId = false;
        for (let statInfo of this.kioskStatus) {
            if (statInfo.objectId == data.objectId) {
                haveObjectId = true;
            }
        }
        if (!haveObjectId) {
            this.kioskStatus.push({
                objectId: data.objectId,
                status: EStatus.Online
            });
        }
    }

    resolveStatus(data: any): string {
        let haveObjectId = false;
        let tempKioskStatus: IKioskStatus = {
            objectId: "",
            status: EStatus.Offline
        };
        tempKioskStatus.objectId = data.row.objectId;
        for (let statInfo of this.kioskStatus) {
            if (statInfo.objectId == data.row.objectId) {
                haveObjectId = true;
                tempKioskStatus.status = statInfo.status;
            }
        }
        if (!haveObjectId) {
            this.kioskStatus.push(tempKioskStatus);
        }
        return tempKioskStatus.status;
    }

    async initSelectionBuilding() {
        this.selectionItem.building = {};
        await this.$server
            .R("/flow2/buildings")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response.results) {
                        this.selectionItem.building[returnValue.objectId] =
                            returnValue.name;
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            name: "",
            building: "",
            buildingName: "",
            kioskId: "",
            kioskName: "",
            roles: [],
            password: "",
            confirmPassword: "",
            updatePassword: "",
            updateConfirmPassword: "",
            strictMode: false
        };
    }

    selectedItem(data) {
        this.selectedDetail = data;
    }

    getInputData() {
        this.clearInputData();
        for (const param of this.selectedDetail) {
            this.inputFormData = {
                objectId: param.objectId,
                username: param.username,
                building: param.data.building.objectId,
                buildingName: param.data.building.name,
                kioskId: param.data.kioskId,
                kioskName: param.data.kioskName,
                strictMode: param.data.strictMode ? true : false
            };
        }
    }

    updateInputFormData(data) {
        this.inputFormData[data.key] = data.value;
    }

    async saveAddOrEdit(data) {
        let param: any = {
            username: data.username,
            data: {
                kioskId: data.kioskId,
                kioskName: data.kioskName,
                building: data.building,
                strictMode: data.strictMode
            },
            roles: ["Kiosk"]
        };

        // add
        if (!this.inputFormData.objectId) {
            param.password = data.password;

            Loading.show();
            param = RegexServices.trim(param);
            await this.$server
                .C("/kiosks", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Kiosk_AddSuccess"));
                            this.pageToList();
                        },
                        this._("w_Kiosk_ADDFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_Kiosk_ADDFailed")
                    );
                });
        } else {
            param.objectId = data.objectId;
            if (data.updatePassword != "") {
                param.password = data.updatePassword;
            }

            Loading.show();
            param = RegexServices.trim(param);
            await this.$server
                .U("/kiosks", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Kiosk_EditSuccess"));
                            this.pageToList();
                        },
                        this._("w_Kiosk_EditFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_Kiosk_EditFailed")
                    );
                });
        }
    }

    tableStatus(values: any) {
        let result = "";
        for (const value of values) {
            value;
        }
    }

    async doDelete() {
        Dialog.confirm(
            this._("w_Kiosk_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                for (const deleteParam of this.selectedDetail) {
                    let param: {
                        objectId: string;
                    } = {
                        objectId: deleteParam.objectId
                    };

                    Loading.show();
                    param = RegexServices.trim(param);
                    this.$server
                        .D("/kiosks", param)
                        .then((response: any) => {
                            ResponseFilter.successCheck(
                                this,
                                response,
                                (response: any) => {
                                    this.pageToList();
                                },
                                this._("w_DeleteFailed")
                            );
                        })
                        .catch((e: any) => {
                            return ResponseFilter.catchError(this, e);
                        });

                    Loading.hide();
                }
            }
        );
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
                 * @uiLabel - ${this._("w_Kiosk_Username")}
                 */
                username: string;

                data: interface {

                    building: interface {
                        /**
                         * @uiLabel - ${this._("w_Buildings_BuildingName")}
                         */
                        name: string;
                    };

                    /**
                     * @uiLabel - ${this._("w_Kiosk_Id")}
                     */
                    kioskId: string;

                    /**
                     * @uiLabel - ${this._("w_Kiosk_KioskName")}
                     */
                    kioskName: string;

                };

                /**
                 * @uiLabel - ${this._("w_Kiosk_StrictMode")}
                 */
                strictMode: any;

                /**
                 * @uiLabel - ${this._("w_Kiosk_Status")}
                 */
                status: string;

                Actions: any
            }
        `;
    }

    IViewForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Kiosk_Username")}
                 * @uiType - iv-form-label
                 */
                username: string;

                /**
                 * @uiLabel - ${this._("w_Buildings_BuildingName")}
                 * @uiType - iv-form-label
                 */
                buildingName: string;

                /**
                 * @uiLabel - ${this._("w_Kiosk_Id")}
                 * @uiType - iv-form-label
                 */
                kioskId: string;

                /**
                 * @uiLabel - ${this._("w_Kiosk_KioskName")}
                 * @uiType - iv-form-label
                 */
                kioskName: string;
            }
        `;
    }

    IModifyForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Kiosk_Username")}
                 * @uiPlaceHolder - ${this._("w_Kiosk_Username")}
                 * @uiType - ${
                     this.inputFormData.objectId === ""
                         ? "iv-form-string"
                         : "iv-form-label"
                 }
                */
                username: string;

                /**
                 * @uiLabel - ${this._("w_Kiosk_Id")}
                 * @uiPlaceHolder - ${this._("w_Kiosk_Id")}
                 */
                kioskId: string;

                /**
                 * @uiLabel - ${this._("w_Kiosk_KioskName")}
                 * @uiPlaceHolder - ${this._("w_Kiosk_KioskName")}
                 */
                kioskName: string;

                /**
                 * @uiLabel - ${this._("w_Buildings_Building")}
                 * @uiMultipe = false
                 */
                building: ${toEnumInterface(
                    this.selectionItem.building as any,
                    false
                )};

                /**
                 * @uiLabel - ${this._("w_Kiosk_StrictMode")}
                 * @uiType - iv-form-switch
                 */
                strictMode?: boolean;

                /**
                  * @uiLabel - ${this._("w_Password")}
                  * @uiPlaceHolder - ${this._("w_Password")}
                  * @uiType - iv-form-password
                  * @uiColumnGroup - password
                  * @uiHidden - ${!!this.inputFormData.objectId}
                  */
                password: string;

                /**
                 * @uiLabel - ${this._("w_ConfirmPassword")}
                 * @uiPlaceHolder - ${this._("w_ConfirmPassword")}
                 * @uiType - iv-form-password
                 * @uiColumnGroup - password
                 * @uiValidation - (value, all) => value === all.password
                 * @uiInvalidMessage - ${this._("w_Error_Password")}
                 * @uiHidden - ${!!this.inputFormData.objectId}
                */
                confirmPassword: string;

                /**
                  * @uiLabel - ${this._("w_Password")}
                  * @uiPlaceHolder - ${this._("w_Password")}
                  * @uiType - iv-form-password
                  * @uiColumnGroup - updatePassword
                  * @uiHidden - ${!this.inputFormData.objectId}
                  */
                updatePassword?: string;

                /**
                 * @uiLabel - ${this._("w_ConfirmPassword")}
                 * @uiPlaceHolder - ${this._("w_ConfirmPassword")}
                 * @uiType - iv-form-password
                 * @uiColumnGroup - updatePassword
                 * @uiValidation - (value, all) => value === all.updatePassword
                 * @uiInvalidMessage - ${this._("w_Error_Password")}
                 * @uiHidden - ${!this.inputFormData.objectId}
                */
                updateConfirmPassword?: string;

            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>
