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
                :label=" _('w_Hik_FrList') "
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
                    :server="{ path: '/client/hikvision' }"
                    @selected="selectedItem($event)"
                >

                    <template #floor="{$attrs, $listeners}">
                        {{ $attrs.value && $attrs.value.name ? $attrs.value.name : '' }}
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
                :label=" _('w_Hik_ViewFr') "
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
                :label="inputFormData.objectId == '' ? _('w_Hik_AddFr') :  _('w_Hik_EditFr')"
            >
                <template #toolbox>

                    <iv-toolbox-back @click="pageToList()" />

                </template>

                <iv-form
                    :interface="IAddAndEditForm()"
                    :value="inputFormData"
                    @submit="saveAddOrEdit($event)"
                ></iv-form>

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

    // Service
    import ResponseFilter from "@/services/ResponseFilter";
    import Dialog from "@/services/Dialog";
    import Loading from "@/services/Loading";

    // Transition
    import Transition from "@/services/Transition";
    import { ITransition } from "@/services/Transition";


    @Component({
        components: {}
    })
    export default class HikVision extends Vue {
        transition: ITransition = {
            type: Transition.type,
            prevStep: 1,
            step: 1
        };

        tableMultiple: boolean = true;

        selectedDetail: any = [];

        inputFormData: any = {
            objectId: "",
            floorId: "",
            name: "",
            protocol: "http",
            ip: "",
            port: null,
            account: "",
            password: "",
            floorText: ''
        };

        created() {}

        mounted() {}

        clearInputData() {
            this.inputFormData = {
                objectId: "",
                floorId: "",
                name: "",
                protocol: "http",
                ip: "",
                port: null,
                account: "",
                password: "",
                floorText: ''
            };
        }

        selectedItem(data) {
            this.selectedDetail = data;
            this.selectedDetail = [];
            this.selectedDetail = data;
        }

        getInputData() {
            this.clearInputData();
            for (const param of this.selectedDetail) {
                this.inputFormData = {
                    objectId: param.objectId,
                    floorId: param.floor && param.floor.objectId ? param.floor.objectId : '',
                    ip: param.ip,
                    account: param.account,
                    name: param.name,
                    password: param.password,
                    port: param.port,
                    protocol: param.protocol,
                    floorText: param.floor && param.floor.name ? param.floor.name : ''
                };
            }
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

            let dataObject: {
                name?: string;
                protocol: string;
                ip: string;
                port: number;
                account: string;
                password: string;
                floorId: string;
                objectId?: string;
            } = {
                protocol: data.protocol,
                ip: data.ip,
                port: data.port,
                account: data.account,
                password: data.password,
                floorId: data.floorId,
            };


            // add
            if (this.inputFormData.objectId == "") {
                dataObject.name = data.name;
                const datas: any = [dataObject];

                const addParam = {
                    datas
                };
                Loading.show();
                await this.$server
                    .C("/client/hikvision", addParam)
                    .then((response: any) => {
                        ResponseFilter.successCheck(
                            this,
                            response,
                            (response: any) => {
                                for (const responseElement of response.datas) {
                                    if (responseElement.statusCode === 200) {
                                        Dialog.success(this._("w_Hik_AddSuccess"));
                                        this.pageToList();
                                    } else {
                                        Dialog.error(response.message);
                                    }
                                }
                            },
                            this._("w_Hik_AddFailed")
                        );
                    })
                    .catch((e: any) => {
                        return ResponseFilter.catchError(
                            this,
                            e,
                            this._("w_Hik_AddFailed")
                        );
                    });
            } else {
                dataObject.objectId = data.objectId;
                const datas: any = [dataObject];

                const editParam = {
                    datas
                };
                Loading.show();
                await this.$server
                    .U("/client/hikvision", editParam)
                    .then((response: any) => {
                        ResponseFilter.successCheck(
                            this,
                            response,
                            (response: any) => {
                                for (const responseElement of response.datas) {
                                    if (responseElement.statusCode === 200) {
                                        Dialog.success(this._("w_Hik_EditSuccess"));
                                        this.pageToList();
                                    } else {
                                        Dialog.error(response.message);
                                    }
                                }
                            },
                            this._("w_Hik_EditFailed")
                        );
                    })
                    .catch((e: any) => {
                        return ResponseFilter.catchError(
                            this,
                            e,
                            this._("w_Hik_EditFailed")
                        );
                    });
            }
        }

        async doDelete() {
            Dialog.confirm(
                this._("w_Hik_DeleteConfirm"),
                this._("w_DeleteConfirm"),
                () => {

                    let deleteParam: {
                        objectId: any;
                    } = {
                        objectId: []
                    };

                    for (const param of this.selectedDetail) {
                        deleteParam.objectId.push(param.objectId);
                    }

                    Loading.show();
                    this.$server
                        .D("/client/hikvision", deleteParam)
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
                 * @uiLabel - ${this._("w_Account_FloorName")}
                 */
                floor: string;


                /**
                 * @uiLabel - ${this._("w_Account_UserName")}
                 */
                name: string;


                /**
                 * @uiLabel - ${this._("w_Frs_Setting_Protocol")}
                 */
                protocol: string;


                /**
                 * @uiLabel - ${this._("w_Frs_Setting_Ip")}
                 */
                ip: string;



                /**
                 * @uiLabel - ${this._("w_Frs_Setting_Port")}
                 */
                port: string;


                /**
                 * @uiLabel - ${this._("w_Frs_Setting_Account")}
                 */
                account: string;


                Actions: any

            }
        `;
        }

        IAddAndEditForm() {
            return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Hik_floorId")}
                 * @uiPlaceHolder - ${this._("w_Hik_floorId")}
                 */
                floorId: string;


                /**
                 * @uiLabel - ${this._("w_Name")}
                 * @uiPlaceHolder - ${this._("w_Name")}
                 * @uiType - ${
                        this.inputFormData.objectId === ""
                            ? "iv-form-string"
                            : "iv-form-label"
                    }
                 */
                name: string;


                /**
                 * @uiLabel - ${this._("w_Account")}
                 * @uiPlaceHolder - ${this._("w_Account")}
                 */
                account: string;


                /**
                 * @uiLabel - ${this._("w_Password")}
                 * @uiPlaceHolder - ${this._("w_Password")}
                 * @uiType - iv-form-password
                 *                  */
                password: string;


                /**
                 * @uiLabel - ${this._("w_Frs_Setting_Protocol")}
                 */
                protocol: ${toEnumInterface({
                    http: "http",
                    https: "https"
                })};


                /**
                 * @uiLabel - ${this._('w_Frs_Setting_Ip')}
                 * @uiPlaceHolder - ${this._("w_Frs_Setting_Ip")}
                 * @uiType - iv-form-ip
                 */
                ip: string;


                /**
                 * @uiLabel - ${this._("w_Port")}
                 * @uiPlaceHolder - ${this._("w_Port_PlaceHolder")}
                 * @uiAttrs - { max: 65535, min: 1}
                 */
                port: number;

            }
        `;
        }

        IViewForm() {
            return `
            interface {

            /**
             * @uiLabel - ${this._("w_Account_FloorName")}
             * @uiType - iv-form-label
             */
            floorText: string;


            /**
             * @uiLabel - ${this._("w_Name")}
             * @uiType - iv-form-label
             */
            name: string;


            /**
             * @uiLabel - ${this._("w_Account")}
             * @uiType - iv-form-label
             */
            account: string;


            /**
             * @uiLabel - ${this._("w_Frs_Setting_Protocol")}
             * @uiType - iv-form-label
             */
            protocol: string;


            /**
             * @uiLabel - ${this._("w_Frs_Setting_Ip")}
             * @uiType - iv-form-label
             */
            ip: string;


            /**
             * @uiLabel - ${this._("w_Port")}
             * @uiType - iv-form-label
             */
            port: number;

            }
        `;
        }
    }
</script>

<style lang="scss" scoped>
</style>
