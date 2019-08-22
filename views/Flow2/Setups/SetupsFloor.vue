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
                :label=" _('w_Floor_List') "
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
                    :server="{ path: '/flow2/floors' }"
                    @selected="selectedItem($event)"
                >

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
                :label=" _('w_Floor_View') "
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
                :label="inputFormData.objectId == '' ? _('w_Floor_Add') :  _('w_Floor_Edit')"
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

    selectedDetail: any = [];
    tableMultiple: boolean = true;
    selectionItem = {
        building: {}
    };
    inputFormData: any = {
        objectId: "",
        building: "",
        buildingName: "",
        name: "",
        floor: 0
    };

    async created() {
        this.initSelectionBuilding();
    }

    mounted() {}

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

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            building: "",
            buildingName: "",
            name: "",
            floor: 0
        };
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
                building: param.building.objectId,
                buildingName: param.building.name,
                name: param.name,
                floor: param.floor
            };
        }
    }

    updateInputFormData(data) {
        this.inputFormData[data.key] = data.value;
    }

    async saveAddOrEdit(data) {
        let param: any = {
            name: data.name,
            floor: data.floor,
            building: data.building
        };

        // add
        if (!this.inputFormData.objectId) {
            Loading.show();
            await this.$server
                .C("/flow2/floors", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Floor_AddSuccess"));
                            this.pageToList();
                        },
                        this._("w_Floor_ADDFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_Floor_ADDFailed")
                    );
                });
        } else {
            param.objectId = data.objectId;

            Loading.show();
            await this.$server
                .U("/flow2/floors", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Floor_EditSuccess"));
                            this.pageToList();
                        },
                        this._("w_Floor_EditFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_Floor_EditFailed")
                    );
                });
        }
    }

    async doDelete() {
        Dialog.confirm(
            this._("w_Floor_DeleteConfirm"),
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
                        .D("/flow2/floors", deleteParam)
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

                building: interface {
                    /**
                     * @uiLabel - ${this._("w_Buildings_BuildingName")}
                     */
                    name: string;
                };

                /**
                 * @uiLabel - ${this._("w_Floor_FloorName")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Floor_Floor")}
                 */
                floor: number;

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
                buildingName: string;

                /**
                 * @uiLabel - ${this._("w_Floor_FloorName")}
                 * @uiType - iv-form-label
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Floor_Floor")}
                 * @uiType - iv-form-label
                 */
                floor: number;

            }
        `;
    }

    IModifyForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Buildings_Building")}
                 * @uiMultipe = false
                 */
                building: ${toEnumInterface(
                    this.selectionItem.building as any,
                    false
                )};
                
                /**
                 * @uiLabel - ${this._("w_Floor_FloorName")}
                 * @uiPlaceHolder - ${this._("w_Floor_FloorName")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Floor_Floor")}
                 * @uiPlaceHolder - ${this._("w_Floor_Floor")}
                 * @uiAttrs - { min: 1 }
                 */
                floor: number;

            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>
