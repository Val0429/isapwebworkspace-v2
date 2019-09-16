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
                :label=" _('w_Blacklist_Blacklist') "
            >
                <template #toolbox>

                    <iv-toolbox-view
                        :disabled="isSelected.length !== 1"
                        @click="pageToView"
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
                    :server="{ path: '/person/staff-blacklist' }"
                    @selected="selectedItem($event)"
                >

                    <template #imageBase64="{ $attrs }">
                        <img :src="$attrs.value" />
                    </template>

                    <template #Actions="{$attrs, $listeners}">
                        <iv-toolbox-more :disabled="isSelected.length !== 1">
                            <iv-toolbox-view @click="pageToView" />
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
                :label=" _('w_Blacklist_ViewBlack') "
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
                :label="inputFormData.objectId == '' ? _('w_Blacklist_AddBlack') :  _('w_Blacklist_EditBlack')"
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
import ImageBase64 from "@/services/ImageBase64";

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

    newImg = new Image();
    newImgSrc = "";

    inputFormData: any = {
        objectId: "",
        imageBase64: "",
        name: "",
        nric: "",
        remark: ""
    };

    async created() {}

    mounted() {}

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            imageBase64: "",
            name: "",
            nric: "",
            remark: ""
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
                floor: param.floor
            };
        }
    }

    updateInputFormData(data) {
        if (data.key == "imageBase64") {
            ImageBase64.fileToBase64(data.value, (base64 = "") => {
                if (base64 != "") {
                    this.newImg = new Image();
                    this.newImg.src = base64;
                    this.newImg.onload = () => {
                        this.newImgSrc = base64;
                        return;
                    };
                } else {
                    Dialog.error(this._("w_Region_ErrorFileToLarge"));
                }
            });
        }
        this.inputFormData[data.key] = data.value;
        console.log(this.inputFormData);
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
                    imageBase64: this.newImgSrc,
                    name: data.name,
                    nric: data.nric,
                    remark: data.remark
                }
            ]
        };

        // add
        if (!this.inputFormData.objectId) {
            Loading.show();
            param = RegexServices.trim(param);
            await this.$server
                .C("/person/staff-blacklist", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Dialog_SuccessTitle"));
                            this.pageToList();
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_Dialog_ErrorTitle")
                    );
                });
        } else {
            param.datas[0].objectId = data.objectId;

            Loading.show();
            param = RegexServices.trim(param);
            await this.$server
                .U("/person/staff-blacklist", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            if (response.datas) {
                                if (response.datas[0].statusCode == 200) {
                                    Dialog.success(
                                        this._("w_Dialog_SuccessTitle")
                                    );
                                    this.pageToList();
                                } else {
                                    Dialog.error(response.message);
                                }
                            }
                        },
                        this._("w_Dialog_ErrorTitle")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_Dialog_ErrorTitle")
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
                        .D("/person/staff-blacklist", param)
                        .then((response: any) => {
                            ResponseFilter.successCheck(
                                this,
                                response,
                                (response: any) => {
                                    if (response.datas) {
                                        if (
                                            response.datas[0].statusCode == 200
                                        ) {
                                            this.pageToList();
                                        } else {
                                            Dialog.error(response.message);
                                        }
                                    }
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
                 * @uiLabel - ${this._("w_Blacklist_Image")}
                 */
                imageBase64?: string;

                /**
                 * @uiLabel - ${this._("w_Blacklist_NRIC")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Blacklist_NRIC")}
                 */
                nric: string;

                /**
                 * @uiLabel - ${this._("w_Blacklist_Company")}
                 */
                organization: any;

                /**
                 * @uiLabel - ${this._("w_Blacklist_Reason")}
                 */
                remark: string;
            }
        `;
    }

    IViewForm() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_Blacklist_Image")}
                 * @uiType - iv-form-file
                 */
                imageBase64?: string;

                /**
                 * @uiLabel - ${this._("w_Blacklist_Name")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Blacklist_NRIC")}
                 */
                nric: string;

                /**
                 * @uiLabel - ${this._("w_Blacklist_Company")}
                 */
                organization?: any;

                /**
                 * @uiLabel - ${this._("w_Blacklist_Reason")}
                 */
                remark: string;
                    }
        `;
    }

    IModifyForm() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_Blacklist_Image")}
                 * @uiType - iv-form-file
                 */
                imageBase64?: string;

                /**
                 * @uiLabel - ${this._("w_Blacklist_Name")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Blacklist_NRIC")}
                 */
                nric?: string;

                /**
                 * @uiLabel - ${this._("w_Blacklist_Company")}
                 */
                organization?: any;

                /**
                 * @uiLabel - ${this._("w_Blacklist_Reason")}
                 */
                remark: string;
                    }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>
