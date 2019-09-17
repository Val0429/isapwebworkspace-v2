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
                :label=" _('w_Buildings_List') "
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
                    :server="{ path: '/location/building' }"
                    @selected="selectedItem($event)"
                >

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
                :label=" _('w_Buildings_View') "
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
                :label="inputFormData.objectId == '' ? _('w_Buildings_Add') :  _('w_Buildings_Edit')"
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
import { Ws } from "@/services/WebSocket/Ws";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import RegexServices from "@/services/RegexServices";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";
import ServerConfig from "@/services/ServerConfig";

@Component({
    components: {}
})
export default class SetupsFloor extends Vue {
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
        acs: ""
    };

    async created() {}

    mounted() {}

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            name: ""
        };
    }

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
    }

    async getInputData() {
        this.clearInputData();
        for (const param of this.selectedDetail) {
            this.inputFormData = {
                objectId: param.objectId,
                name: param.name,
                acs: ""
            };
        }
        await this.initAcsGroup();
    }

    async initAcsGroup() {
        let param = { objectId: this.inputFormData.objectId };
        await this.$server
            .R("/setting/acs-group", param)
            .then((response: any) => {
                if (response.group) {
                    this.inputFormData.acs = response.group;
                }
            })
            .catch(e => {
                console.log(e);
            });
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
        this.clearInputData();
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

    async saveAddOrEdit(data) {
        let param: any = {
            datas: [
                {
                    name: data.name,
                    floor: data.floor
                }
            ]
        };

        // add
        if (!this.inputFormData.objectId) {
            Loading.show();
            param = RegexServices.trim(param);
            await this.$server
                .C("/location/building", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            let aceParam = {
                                datas: [
                                    {
                                        buildingId: response.datas[0].objectId,
                                        group: this.inputFormData.acs
                                    }
                                ]
                            };
                            this.$server
                                .C("/setting/acs-group", aceParam)
                                .then((response: any) => {
                                    ResponseFilter.successCheck(
                                        this,
                                        response,
                                        (response: any) => {
                                            Dialog.success(
                                                this._("w_Buildings_AddSuccess")
                                            );
                                            this.pageToList();
                                        },
                                        this._("w_Buildings_ADDFailed")
                                    );
                                })
                                .catch((e: any) => {
                                    return ResponseFilter.catchError(
                                        this,
                                        e,
                                        this._("w_Buildings_ADDFailed")
                                    );
                                });
                        },
                        this._("w_Buildings_ADDFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_Buildings_ADDFailed")
                    );
                });
        } else {
            param.datas[0].objectId = data.objectId;

            Loading.show();
            param = RegexServices.trim(param);
            await this.$server
                .U("/location/building", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            let aceParam = {
                                datas: [
                                    {
                                        objectId: response.datas[0].objectId,
                                        group: this.inputFormData.acs
                                    }
                                ]
                            };
                            this.$server
                                .U("/setting/acs-group", aceParam)
                                .then((response: any) => {
                                    ResponseFilter.successCheck(
                                        this,
                                        response,
                                        (response: any) => {
                                            Dialog.success(
                                                this._("w_Buildings_AddSuccess")
                                            );
                                            this.pageToList();
                                        },
                                        this._("w_Buildings_ADDFailed")
                                    );
                                })
                                .catch((e: any) => {
                                    return ResponseFilter.catchError(
                                        this,
                                        e,
                                        this._("w_Buildings_ADDFailed")
                                    );
                                });
                        },
                        this._("w_Buildings_EditFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_Buildings_EditFailed")
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
            this._("w_Buildings_DeleteConfirm"),
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
                        .D("/location/building", param)
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
                 * @uiLabel - ${this._("w_Buildings_BuildingName")}
                 */
                name: string;

                Actions: any
            }
        `;
    }

    IViewForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Buildings_BuildingName")}
                 * @uiType - iv-form-label
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Acs_AccessGroupName")}
                 * @uiType - iv-form-label
                 * @uiPlaceHolder - ${this._("w_Acs_AccessGroupName")}
                 */
                acs: string;

            }
        `;
    }

    IModifyForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Buildings_BuildingName")}
                 * @uiPlaceHolder - ${this._("w_Buildings_BuildingName")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Acs_AccessGroupName")}
                 * @uiPlaceHolder - ${this._("w_Acs_AccessGroupName")}
                 */
                acs: string;

            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>
