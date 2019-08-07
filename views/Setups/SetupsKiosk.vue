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
                        :disabled="isSelected.length !== 1"
                        @click="pageToView"
                    />
                    <iv-toolbox-edit
                        :disabled="isSelected.length !== 1"
                        @click="pageToEdit()"
                    />
                    <iv-toolbox-delete
                        :disabled="isSelected.length === 0"
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

                    <template #status="{$attrs, $listeners}">
<!--                        {{ checkKioskIdSame($attrs && $attrs.row && $attrs.row.data && $attrs.row.data.kioskId, wsData) ? 'Online' : status}}-->
                    </template>

                    <template #Actions="{$attrs, $listeners}">

                        <iv-toolbox-more :disabled="isSelected.length !== 1">
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
                    :interface="IAddAndEditForm()"
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
import { Ws } from "@/services/WebSocket/Ws";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";
import ServerConfig from '@/services/ServerConfig';

@Component({
    components: {}
})
export default class SetupsKiosk extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    isSelected: any = [];
    tableMultiple: boolean = true;

    selectedDetail: any = [];

    inputFormData: any = {
        objectId: "",
        name: "",
        password: "",
        confirmPassword: "",
        kioskId: "",
        kioskName: "",
        roles: [],
    };

    status: string = 'Offline';
    wsData: any = undefined;

    ws: Ws = new Ws({
        url: "",
        OnOpen: async (e: Event): Promise<void> => {
            console.log("WS Alive Open");
            console.log("e: ", e);
        },
        OnMessage: async (e: MessageEvent): Promise<void> => {
            console.log("WS Alive message");
            console.log("e: ", e);
            this.handleWs(e.data);
        },
        OnError: async (e: Event): Promise<void> => {
            console.log("WS Alive Error");
            console.log("e: ", e);
        },
        OnClose: async (e: CloseEvent): Promise<void> => {
            console.log("WS Alive Close");
            console.log("e: ", e);
        }
    });


    async created() {
        // let ws = await this.$server.WS("/kiosks/aliveness" as any);
        // ws.send("123");
        // ws.io.on("message", (message) => {
        //     console.log("ws message", message);
        // });
        // ws.closeGracefully();
    }

    mounted() {
        this.initWS();
    }

    beforeDestroy() {
        this.ws.Close();
    }

    initWS() {
        let url = `ws://${ServerConfig.host}:${ServerConfig.port}/kiosks/aliveness?sessionId=${ this.$user.sessionId }`;
        // ws://172.16.10.30:6060/kiosks/aliveness?sessionId=r:ede5166019af8d95a3af2416bcc7cce6
        this.ws.url = url;
        this.ws.Connect();
    }

    handleWs(wsData: string) {
        try {
            let data: any = JSON.parse(wsData);
            if (data.statusCode != undefined && data.statusCode == 401) {
                this.$router.push({ path: "/" });
            }
            console.log("handleWs", data);
        } catch (e) {
            console.log("WS handle error: ", e);
        }

    }

    getKioskIdFromWS(values: any) {
        let kioskIds = [];
        for (const value of values) {
            kioskIds.push(value.data.kioskId);
        }
        return kioskIds;
    }

    checkKioskIdSame(checkId: string, kioskIds: any): boolean {
        for (const kioskId of kioskIds) {
            if (checkId === kioskId) {
                return true;
            }
        }
    }

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            name: "",
            password: "",
            confirmPassword: "",
            kioskId: "",
            kioskName: "",
            roles: [],
        };
    }

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
    }

    getInputData() {
        this.clearInputData();
        for (const param of this.selectedDetail) {
            this.inputFormData = {
                objectId: param.objectId,
                username: param.username,
                kioskId: param.data.kioskId,
                kioskName: param.data.kioskName,

            };
        }
    }

    updateInputFormData(data) {
        this.inputFormData[data.key] = data.value;
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
        this.getInputData();
    }

    async saveAddOrEdit(data) {
        let param: any = {
            username: data.username,
            password: data.password,
            data: {
                kioskId: data.kioskId,
                kioskName: data.kioskName,
            },
            roles: ["Kiosk"]
        };

        // add
        if (!this.inputFormData.objectId) {
            Loading.show();
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

            Loading.show();
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
        let result = '';
        for (const value of values) {
            value
        }
    }

    async doDelete() {
        Dialog.confirm(
            this._("w_Kiosk_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                for (const param of this.selectedDetail) {
                    let deleteParam: {
                        objectId: string;
                    } = {
                        objectId: param.objectId
                    };

                    Loading.show();
                    this.$server
                        .D("/kiosks", deleteParam)
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
                 * @uiLabel - ${this._("w_Kiosk_Status")}
                 */
                status: string;


                Actions: any

            }
        `;
    }

    IAddAndEditForm() {
        return `
            interface {


                /**
                 * @uiLabel - ${this._("w_Company_UnitNumber")}
                 * @uiPlaceHolder - ${this._("w_Company_UnitNumber")}
                 * @uiType - ${
                        this.inputFormData.objectId === ""
                            ? "iv-form-string"
                            : "iv-form-label"
                    }
                */
                username: string;


                 /**
                  * @uiLabel - ${this._("w_Password")}
                  * @uiPlaceHolder - ${this._("w_Password")}
                  * @uiType - iv-form-password
                  * @uiColumnGroup - password
                  * @uiHidden - ${ (!!this.inputFormData.objectId) }
                  */
                 password: string;


                 /**
                 * @uiLabel - ${this._("w_PasswordConfirm")}
                 * @uiPlaceHolder - ${this._("w_PasswordConfirm")}
                 * @uiType - iv-form-password
                 * @uiColumnGroup - password
                 * @uiValidation - (value, all) => value === all.password
                 * @uiInvalidMessage - ${this._("w_Error_Password")}
                 * @uiHidden - ${ (!!this.inputFormData.objectId)}
                */
                 confirmPassword: string;


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
}
</script>

<style lang="scss" scoped>
</style>
