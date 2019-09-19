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
                    :server="{ path: '/location/door' }"
                    @selected="selectedItem($event)"
                >

                    <template #actions$>
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

@Component({
    components: {}
})
export default class SetupsFloor extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };
    tableMultiple: boolean = true;

    selectedDetail: any = [];

    inputFormData: any = {
        objectId: "",
        name: "",
        floorId: "",
        companyId: "",
        range: "",
        floors: [],
        companies: [],
        ranges: [],
        floorText: "",
        companyText: "",
        buildingId: ""
    };

    // select
    selectItem: {
        company: any;
        floor: any;
        range: any;
    } = {
        company: {},
        floor: {},
        range: ""
    };

    floors: string[] = [];
    companies: string[] = [];
    ranges = { building: "building", floor: "floor" };

    async created() {}

    mounted() {}

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            name: "",
            floorId: "",
            companyId: "",
            range: "",
            floors: [],
            companies: [],
            floorText: "",
            companyText: ""
        };
    }

    selectedItem(data) {
        this.selectedDetail = data;
    }

    async getInputData() {
        this.clearInputData();
        for (const param of this.selectedDetail) {
            this.inputFormData = {
                objectId: param.objectId,
                name: param.name,
                floorId: param.floor ? param.floor.objectId : "",
                range: param.range ? param.range : "",
                floors: param.floor ? param.floor.objectId : [],
                floorText: param.floor ? param.floor.name : "",
                companyId: param.company ? param.company.objectId : "",
                companies: param.company ? param.company.objectId : [],
                companyText: param.company ? param.company.name : ""
            };
            if (param.objectId !== "") {
                this.initSelectItemCompanyWithAPI(param.floor.objectId);
            }
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

    updateInputFormData(data) {
        if (data.key === "floors") {
            this.initSelectItemCompanyWithAPI(data.value);
            if (
                this.inputFormData.range == "" ||
                this.inputFormData.companies.length < 1
            ) {
                this.inputFormData.check = undefined;
                return;
            }
        }
        if (data.key === "range" || data.key === "companies") {
            if (data.value == "" || data.value.length < 1) {
                this.inputFormData.check = undefined;
                return;
            }
        }
        this.inputFormData.check = true;
        this.inputFormData[data.key] = data.value;
    }

    async initSelectItem() {
        this.selectItem.company = {};
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

    async initSelectItemCompanyWithAPI(floorId) {
        this.selectItem.company = {};
        let param: any = { paging: { all: true }, floorId: floorId };
        param = RegexServices.trim(param);
        await this.$server
            .R("/location/company", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (
                        response.results != undefined &&
                        response.results.length > 0
                    ) {
                        this.companies = JSON.parse(
                            JSON.stringify(response.results)
                        );
                        for (let ret of response.results) {
                            if (
                                ret.objectId != undefined &&
                                ret.name != undefined
                            ) {
                                this.$set(
                                    this.selectItem.company,
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

    async saveAddOrEdit(data) {
        let param: any = {
            datas: [
                {
                    name: data.name
                }
            ]
        };
        if (data.companies != "") {
            param.datas[0].companyId = data.companies;
        }

        if (data.floors != "") {
            param.datas[0].floorId = data.floors;
        }

        if (data.range != "") {
            param.datas[0].range = data.range;
        }

        // add
        if (!this.inputFormData.objectId) {
            Loading.show();
            param = RegexServices.trim(param);
            await this.$server
                .C("/location/door", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Door_EditSuccess"));
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
            param.datas[0].objectId = data.objectId;

            Loading.show();
            param = RegexServices.trim(param);
            await this.$server
                .U("/location/door", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Door_EditSuccess"));
                            this.pageToList();
                        },
                        this._("w_Door_ADDFailed")
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

    tableStatus(values: any) {
        let result = "";
        for (const value of values) {
            value;
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
                        .D("/location/door", param)
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
                 * @uiLabel - ${this._("w_Door_DoorName")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Door_Range")}
                 */
                range: string;
                
                floor: interface {
                    /**
                     * @uiLabel - ${this._("w_Door_FloorName")}
                     */
                    name: string;
                };

                company: interface {
                    /**
                     * @uiLabel - ${this._("w_Door_CompanyName")}
                     */
                    name: string;
                };
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
                 * @uiLabel - ${this._("w_Door_Range")}
                 * @uiType - iv-form-label
                 */
                range: string;

                /**
                 * @uiLabel - ${this._("w_Door_FloorName")}
                 * @uiType - iv-form-label
                 */
                floorText: string;

                /**
                 * @uiLabel - ${this._("w_Door_CompanyName")}
                 * @uiType - iv-form-label
                 */
                companyText: string;
            }
        `;
    }

    IModifyForm() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_Door_DoorName")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Door_Range")}
                 */
                range?: ${toEnumInterface(this.ranges, false)};

                /**
                 * @uiLabel - ${this._("w_Door_FloorName")}
                 */
                floors: ${toEnumInterface(this.selectItem.floor, false)};

                /**
                 * @uiLabel - ${this._("w_Door_CompanyName")}
                 */
                companies?: ${toEnumInterface(this.selectItem.company, false)};

                check: any;
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>
