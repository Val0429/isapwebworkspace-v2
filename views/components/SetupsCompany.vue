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
                :label=" _('w_Company_List') "
            >
                <template #toolbox>
                    <!-- <iv-toolbox-sync-to-vms @click="syncToVms" /> -->
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
                    :server="{ path: '/location/company' }"
                    @selected="selectedItem($event)"
                >

                    <template #floors="{$attrs}">
                        <div v-html="tableFloorString($attrs.value)"></div>
                    </template>

                    <template #contactNumber="{$attrs}">
                        <div v-html="tablePhoneString($attrs.value)"></div>
                    </template>

                    <template #actions$>
                        <iv-toolbox-more>
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
                :label=" _('w_Company_View') "
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
                :label="inputFormData.objectId == '' ? _('w_Company_Add') :  _('w_Company_Edit')"
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
                    <template #contactNumber="{$attrs, $listeners}">

                        <div class="col-md-12 mb-2">* {{ _('w_Company_ContactNumber') }}</div>

                        <iv-form-string
                            class="col-md-11"
                            v-model="inputFormData.contactNumber"
                            :placeholder="_('w_Company_ContactNumber')"
                        ></iv-form-string>

                        <div class="col-md-1">
                            <b-button
                                class="mb-2 col-md-12"
                                variant="success"
                                @click="addContactNumber()"
                            >
                                <i class="fa fa-plus"></i>
                            </b-button>
                        </div>

                        <b-row
                            class="col-md-12"
                            v-for="(value, index) in inputFormData.contactNumbers"
                            :key="'contactNumbers__' + index"
                        >
                            <b-col class="col-md-11">
                                <iv-form-string
                                    class="col-md-12"
                                    :value="contactNumbersText(index)"
                                    :disabled="true"
                                >
                                </iv-form-string>
                            </b-col>

                            <div class="col-md-1">
                                <b-button
                                    class="mb-2 col-md-12"
                                    variant="danger"
                                    type="button"
                                    @click="removeContactNumber(index)"
                                >
                                    <i class="fa fa-minus"></i>
                                </b-button>
                            </div>

                        </b-row>

                    </template>

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

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import RegexServices from "@/services/RegexServices";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

@Component
export default class SetupsCompany extends Vue {
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
        contactPerson: "",
        unitNumber: "",
        contactNumber: "",
        contactNumbers: [],
        floorIds: [],

        floorView: "",
        contactNumberView: ""
    };

    // select
    floorsSelectItem: any = {};
    floorsDetailItem: any = {};

    created() {}

    mounted() {
        this.initSelectItemFloor();
    }

    async initSelectItemFloor() {
        this.floorsSelectItem = {};
        let tempFloorSelectItem = {};
        let param: any = { paging: { all: true } };

        await this.$server
            .R("/location/floor", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response.results) {
                        tempFloorSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                    this.floorsSelectItem = tempFloorSelectItem;
                    this.floorsDetailItem = response.results;
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
            contactPerson: "",
            unitNumber: "",
            contactNumber: "",
            contactNumbers: [],
            floorIds: [],

            floorView: "",
            contactNumberView: ""
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
                name: param.name,
                contactPerson: param.contactPerson,
                unitNumber: param.unitNumber,
                contactNumbers: param.contactNumber,
                floorIds: param.floors,

                floorView: this.ViewFloorString(param.floors),
                contactNumberView: this.ViewPhoneString(param.contactNumber)
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

        this.inputFormData.floorIds
            ? (this.inputFormData.floorIds = JSON.parse(
                  JSON.stringify(
                      this.inputFormData.floorIds.map(item => item.objectId)
                  )
              ))
            : "";
    }

    syncToVms() {}

    addContactNumber() {
        if (!this.inputFormData.contactNumber) {
            return false;
        }

        if (!RegexServices.phoneNumber(this.inputFormData.contactNumber)) {
            Dialog.error(this._("w_Company_ErrorContactNumberNotNumber"));
            return false;
        }

        const tempContactNumber = JSON.parse(
            JSON.stringify(this.inputFormData.contactNumber)
        );
        this.inputFormData.contactNumbers.push(tempContactNumber);
        this.inputFormData.contactNumber = "";
    }

    removeContactNumber(index: number) {
        this.inputFormData.contactNumbers.splice(index, 1);
    }

    contactNumbersText(index: number): string {
        let result: string = "";
        result += this.inputFormData.contactNumbers[index];
        return result;
    }

    async saveAddOrEdit(data) {
        let param: any = {
            datas: [
                {
                    name: data.name,
                    contactPerson: data.contactPerson,
                    unitNumber: data.unitNumber,
                    contactNumber: data.contactNumbers,
                    floorIds: data.floorIds
                }
            ]
        };

        // add
        if (!this.inputFormData.objectId) {
            Loading.show();
            param = RegexServices.trim(param);
            await this.$server
                .C("/location/company", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Company_AddSuccess"));
                            this.pageToList();
                        },
                        this._("w_Company_ADDFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_Company_ADDFailed")
                    );
                });
        } else {
            param.datas[0].objectId = data.objectId;

            Loading.show();
            param = RegexServices.trim(param);
            await this.$server
                .U("/location/company", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Company_EditSuccess"));
                            this.pageToList();
                        },
                        this._("w_Company_EditFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_Company_EditFailed")
                    );
                });
        }
    }

    async doDelete() {
        Dialog.confirm(
            this._("w_Company_DeleteConfirm"),
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
                        .D("/location/company", param)
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

    tableFloorString(datas: any): string {
        let result: string = "";
        result += "<ul>";
        if (datas != undefined) {
            for (let loopData of datas) {
                let tempText = loopData.name;
                result += `<li>${tempText}</li>`;
            }
        }
        result += "</ul>";
        return result;
    }

    tablePhoneString(datas: any): string {
        let result: string = "";
        result += "<ul>";
        if (datas != undefined) {
            for (let loopData of datas) {
                let tempText = loopData;
                result += `<li>${tempText}</li>`;
            }
        }
        result += "</ul>";
        return result;
    }

    ViewFloorString(value: any): string {
        let result = "";
        for (let val of value) {
            result += val.name + ", ";
        }
        result = result.substring(0, result.length - 2);
        return result;
    }

    ViewPhoneString(value: any): string {
        let result = "";
        for (let val of value) {
            result += val + ", ";
        }
        result = result.substring(0, result.length - 2);
        return result;
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
                 * @uiLabel - ${this._("w_Company_Name")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Company_Floor")}
                 */
                floors: string;

                /**
                 * @uiLabel - ${this._("w_Company_ContactPerson")}
                 */
                contactPerson: string;

                /**
                 * @uiLabel - ${this._("w_Company_UnitNumber")}
                 */
                unitNumber: string;

                /**
                 * @uiLabel - ${this._("w_Company_ContactNumber")}
                 */
                contactNumber: string;
            }
        `;
    }

    IViewForm() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_Company_Name")}
                 * @uiType - iv-form-label
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Company_UnitNumber")}
                 * @uiType - iv-form-label
                 */
                unitNumber: string;

                /**
                 * @uiLabel - ${this._("w_Company_ContactPerson")}
                 * @uiType - iv-form-label
                 */
                contactPerson: string;

                /**
                 * @uiLabel - ${this._("w_Company_ContactNumber")}
                 * @uiType - iv-form-label
                 */
                contactNumberView: string;

                /**
                 * @uiLabel - ${this._("w_Company_Floor")}
                 * @uiType - iv-form-label
                 */
                floorView: string;
            }
        `;
    }

    IModifyForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Company_Name")}
                 * @uiPlaceHolder - ${this._("w_Company_Name")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Company_UnitNumber")}
                 * @uiPlaceHolder - ${this._("w_Company_UnitNumber")}
                 */
                unitNumber: string;


                /**
                 * @uiLabel - ${this._("w_Company_ContactPerson")}
                 * @uiPlaceHolder - ${this._("w_Company_ContactPerson")}
                 *
                 */
                contactPerson: string;

                /**
                 * @uiLabel - ${this._("w_Company_ContactNumber")}
                 */
                contactNumber?: any;

                /**
                 * @uiLabel - ${this._("w_Company_Floor")}
                 */
                floorIds: ${toEnumInterface(
                    this.floorsSelectItem as any,
                    true
                )};

            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>
