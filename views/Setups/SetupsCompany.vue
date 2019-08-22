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
                    :server="{ path: '/flow1/companies' }"
                    @selected="selectedItem($event)"
                >

                    <template #floor="{$attrs}">
                        <div v-html="tableFloorString($attrs.value)"></div>
                    </template>

                    <template #contactNumber="{$attrs}">
                        <div v-html="tablePhoneString($attrs.value)"></div>
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
                    :interface="IAddAndEditForm()"
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

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

@Component({
    components: {}
})
export default class SetupsCompany extends Vue {
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
        contactPerson: "",
        unitNumber: "",
        contactNumber: "",
        contactNumbers: [],
        floor: [],

        floorView: "",
        contactNumberView: ""
    };

    // select
    floorsSelectItem: any = {};

    created() {}

    mounted() {
        this.initSelectItemFloor();
    }

    async initSelectItemFloor() {
        this.floorsSelectItem = {};
        let tempFloorSelectItem = {};

        await this.$server
            .R("/flow1/floors")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response.results) {
                        tempFloorSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                    this.floorsSelectItem = tempFloorSelectItem;
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
            floor: [],

            floorView: "",
            contactNumberView: ""
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
                name: param.name,
                contactPerson: param.contactPerson,
                unitNumber: param.unitNumber,
                contactNumbers: param.contactNumber,
                floor: param.floor,

                floorView: this.ViewFloorString(param.floor),
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

        this.inputFormData.floor
            ? (this.inputFormData.floor = JSON.parse(
                  JSON.stringify(
                      this.inputFormData.floor.map(item => item.objectId)
                  )
              ))
            : "";
    }

    addContactNumber() {
        if (!this.inputFormData.contactNumber) {
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
            name: data.name,
            contactPerson: data.contactPerson,
            unitNumber: data.unitNumber,
            contactNumber: data.contactNumbers,
            floor: data.floor
        };

        // add
        if (!this.inputFormData.objectId) {
            Loading.show();
            await this.$server
                .C("/flow1/companies", param)
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
            param.objectId = data.objectId;

            Loading.show();
            await this.$server
                .U("/flow1/companies", param)
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
                for (const param of this.selectedDetail) {
                    let deleteParam: {
                        objectId: string;
                    } = {
                        objectId: param.objectId
                    };

                    Loading.show();
                    this.$server
                        .D("/flow1/companies", deleteParam)
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
                floor: string;


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


                Actions: any

            }
        `;
    }

    IAddAndEditForm() {
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
                floor: ${toEnumInterface(this.floorsSelectItem as any, true)};

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
}
</script>

<style lang="scss" scoped>
</style>
