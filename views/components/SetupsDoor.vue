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
                :label=" _('w_Door_List') "
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
                    :server="{ path: '/location/floor' }"
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
                :label=" _('w_Door_View') "
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
                :label="inputFormData.objectId == '' ? _('w_Door_Add') :  _('w_Door_Edit')"
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

@Component
export default class SetupsDoor extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };
    selectedDetail: any = [];
    tableMultiple: boolean = true;
    selectionItem = {
        building: {},
        floor: {},
        company: {}
    };
    inputFormData: any = {
        objectId: "",
        name: "",
        buildingName: "",
        floorName: "",
        endpointName: "",
        public: null,
        floor: 0
    };
    buildings: [];
    company: [];
    async created() {
        this.initSelectionBuilding();
        this.initSelectionFloor();
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
        this.initSelectItem();
        this.clearInputData();
    }
    pageToEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        this.getInputData();
    }
    async initSelectItem() {
        this.selectionItem.company = {};
        this.selectionItem.building = {};
        this.selectionItem.floor = {};
        console.log("selectedDetail", this.selectedDetail);
        // await this.initSelectItemBuildingWithAPI();
        await this.initSelectItemBuildingWithStorage();
        await this.initSelectItemFloorWithAPI();
        for (const param of this.selectedDetail) {
            if (
                param.data != undefined &&
                param.data.company != undefined &&
                param.data.company.objectId != undefined
            ) {
                await this.initSelectItemFloorWithBuilding(
                    param.data.company.objectId
                );
            }
        }
        // if (RoleService.haveSystemAdministrator(this)) {
        //     await this.initSelectItemRole();
        //     await this.initSelectItemCompanyWithAPI();
        // }
        // if (RoleService.haveAdministrator(this)) {
        //     await this.initSelectItemRole();
        //     await this.initSelectItemCompanyWithAPI();
        //     for (const param of this.selectedDetail) {
        //         if (
        //             param.data != undefined &&
        //             param.data.company != undefined &&
        //             param.data.company.objectId != undefined
        //         ) {
        //             await this.initSelectItemFloorWithCompany(
        //                 param.data.company.objectId
        //             );
        //         }
        //     }
        // }
        // if (RoleService.haveTenantAdministrator(this)) {
        //     await this.initSelectItemRole();
        //     await this.initSelectItemCompanyWithStorage();
        //     await this.initSelectItemFloorWithAPI();
        // }
    }
    async initSelectItemBuildingWithAPI() {
        let param: any = { paging: { all: true } };
        param = RegexServices.trim(param);
        await this.$server
            .R("/location/company", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (
                        response.results != undefined &&
                        response.results.length > 0
                    ) {
                        this.buildings = JSON.parse(
                            JSON.stringify(response.results)
                        );
                        for (let ret of response.results) {
                            if (
                                ret.objectId != undefined &&
                                ret.name != undefined
                            ) {
                                this.$set(
                                    this.selectionItem.building,
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
    async initSelectItemBuildingWithStorage() {
        this.selectionItem.company = {};
        this.selectionItem.company[
            this.$user.user.data.company.objectId
        ] = this.$user.user.data.company.name;
    }
    async initSelectItemFloorWithAPI() {
        for (let ret of this.$user.user.data.floor) {
            if (ret.objectId != undefined && ret.name != undefined) {
                this.$set(this.selectionItem.floor, ret.objectId, ret.name);
            }
        }
    }
    async initSelectItemFloorWithBuilding(buildingId: string) {
        this.selectionItem.floor = {};
        if (this.buildings.length > 0) {
            for (let building of this.buildings) {
                if (buildingId == building.objectId) {
                    for (let floor of building.floor) {
                        console.log("!!! floor", floor);
                        this.$set(
                            this.selectionItem.floor,
                            floor.objectId,
                            floor.name
                        );
                    }
                    break;
                }
            }
        }
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
        let param: any = { paging: { all: true } };
        await this.$server
            .R("/location/building", param)
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
    async initSelectionFloor() {
        this.selectionItem.floor = {};
        let param: any = { paging: { all: true } };
        await this.$server
            .R("/location/floor", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response.results) {
                        this.selectionItem.floor[returnValue.objectId] =
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
    updateInputFormData(datas: any) {
        console.log("datas", datas);
        if (datas.key == "buildingName") {
            this.initSelectItemFloorWithBuilding(datas.value);
        }
        this.inputFormData[datas.key] = datas.value;
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
            param = RegexServices.trim(param);
            await this.$server
                .C("/location/floor", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Door_AddSuccess"));
                            this.pageToList();
                        },
                        this._("w_Door_ADDFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_Door_ADDFailed")
                    );
                });
        } else {
            param.objectId = data.objectId;
            Loading.show();
            param = RegexServices.trim(param);
            await this.$server
                .U("/location/floor", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Door_EditSuccess"));
                            this.pageToList();
                        },
                        this._("w_Door_EditFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_Door_EditFailed")
                    );
                });
        }
    }
    async doDelete() {
        Dialog.confirm(
            this._("w_Door_DeleteConfirm"),
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
                        .D("/location/floor", param)
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
                 * @uiLabel - ${this._("w_Door_DoorName")}
                 */
                name: string;
                /**
                 * @uiLabel - ${this._("w_Door_BuildingName")}
                 */
                buildingName: string;
                /**
                 * @uiLabel - ${this._("w_Door_FloorName")}
                 */
                floorName: string;
                /**
                 * @uiLabel - ${this._("w_Door_EndpointName")}
                 */
                endpointName: string;
                /**
                 * @uiLabel - ${this._("w_Door_IsPublic")}
                 */
                public: string;
            }
        `;
    }
    IViewForm() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_Door_DoorName")}
                 * @uiType - iv-form-label
                 */
                name: string;
                /**
                 * @uiLabel - ${this._("w_Door_BuildingName")}
                 * @uiType - iv-form-label
                 */
                buildingName: string;
                /**
                 * @uiLabel - ${this._("w_Door_FloorName")}
                 * @uiType - iv-form-label
                 */
                floorName: string;
                /**
                 * @uiLabel - ${this._("w_Door_EndpointName")}
                 * @uiType - iv-form-label
                 */
                endpointName: string;
                /**
                 * @uiLabel - ${this._("w_Door_IsPublic")}
                 * @uiType - iv-form-switch
                 * @uiDisabled - true
                 */
                public: boolean;
            }
        `;
    }
    IModifyForm() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_Door_BuildingName")}
                 * @uiMultipe = false
                 */
                buildingName: ${toEnumInterface(
                    this.selectionItem.building as any,
                    false
                )};
                /**
                 * @uiLabel - ${this._("w_Door_FloorName")}
                 * @uiMultipe = false
                 */
                floorName: ${toEnumInterface(
                    this.selectionItem.floor as any,
                    false
                )};
                /**
                 * @uiLabel - ${this._("w_Door_DoorName")}
                 * @uiPlaceHolder - ${this._("w_Door_DoorName")}
                 */
                name: string;
                /**
                 * @uiLabel - ${this._("w_Door_EndpointName")}
                 * @uiPlaceHolder - ${this._("w_Door_EndpointName")}
                 */
                endpointName: string;
                /**
                 * @uiLabel - ${this._("w_Door_IsPublic")}
                 * @uiType - iv-form-switch
                 */
                public: boolean;
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>
