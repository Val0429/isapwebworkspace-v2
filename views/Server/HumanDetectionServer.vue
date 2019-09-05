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
                :label="_('w_ServerHD_List')"
            >

                <template #toolbox>

                    <iv-toolbox-view
                        :disabled="selectedDetail.length !== 1"
                        @click="pageToView()"
                    />
                    <iv-toolbox-edit
                        :disabled="selectedDetail.length !== 1"
                        @click="pageToEdit()"
                    />
                    <iv-toolbox-delete
                        :disabled="selectedDetail.length === 0"
                        @click="deleteData()"
                    />
                    <iv-toolbox-divider />
                    <iv-toolbox-add @click="pageToAdd()" />

                </template>

                <iv-table
                    ref="listTable"
                    :interface="IList()"
                    @selected="selectedData($event)"
                    :server="{ path: '/partner/human-detection' }"
                    :multiple="true"
                >

                    <template #target_score="{$attrs, $listeners}">
                        {{Math.round($attrs.row.target_score*100) + '%'}}
                    </template>

                    <template #Actions="{$attrs, $listeners}">
                        <iv-toolbox-more :disabled="selectedDetail.length !== 1">
                            <iv-toolbox-view
                                :disabled="selectedDetail.length !== 1"
                                @click="pageToView()"
                            />
                            <iv-toolbox-edit
                                :disabled="selectedDetail.length !== 1"
                                @click="pageToEdit()"
                            />
                            <iv-toolbox-delete
                                :disabled="selectedDetail.length !== 1"
                                @click="deleteData()"
                            />
                        </iv-toolbox-more>
                    </template>
                </iv-table>

            </iv-card>

            <!-- view -->
            <iv-card
                key="transition_2"
                v-show="transition.step === 2"
                :visible="true"
                :label="_('w_ServerHD_View')"
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IView()"
                    :value="inputFormData"
                >
                    <template #target_score="{$attrs, $listeners}">
                        <iv-form-label
                            v-bind="$attrs"
                            v-on="$listeners"
                            :value="inputFormData.target_score ? Math.round(inputFormData.target_score*100) + '%': ''"
                        />
                    </template>
                </iv-form>

                <template #footer>
                    <b-button
                        variant="secondary"
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
                :label="inputFormData.objectId == '' ? _('w_ServerHD_Add') :  _('w_ServerHD_Edit') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IForm()"
                    :value="inputFormData"
                    @update:*="updateForm($event)"
                    @submit="saveData($event)"
                >

                </iv-form>

                <template #footer-before>
                    <b-button
                        variant="secondary"
                        size="lg"
                        @click="pageToList()"
                    >{{ _('w_Back') }}
                    </b-button>
                    <b-button
                        variant="dark"
                        size="lg"
                        @click="pageToHumanServerTest()"
                    >{{ _('w_Test') }}
                    </b-button>
                </template>

            </iv-auto-card>

        </iv-auto-transition>

        <!-- Model -->
        <b-modal
            hide-footer
            hide-header
            size="md"
            :title="_('w_ServerHD_Test')"
            v-model="modalShow"
        >

            <iv-auto-card :label=" _('w_ServerHD_Test') ">

                <iv-form
                    :visible="true"
                    :interface="IHumanServerTestComponent()"
                    :value="inputFormData"
                    @update:*="updateServerData"
                    @submit="sendHumanServerTest($event)"
                >

                    <template #imageBase64="{ $attrs, $listeners }">
                        <iv-form-file
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-bind:label="_('w_Upload')"
                            v-bind:placeholder="_('w_Upload')"
                            v-bind:drop-placeholder="_('w_Upload')"
                            accept="image/jpeg,image/png,image/jpg"
                        />
                    </template>
                </iv-form>

                <template #footer-before>
                    <b-button
                        variant="dark"
                        size="lg"
                        @click="modalShow = !modalShow"
                    >{{ _('w_Cancel') }}
                    </b-button>
                </template>
            </iv-auto-card>

        </b-modal>

        <!-- return ImageBase64 -->
        <b-modal
            ref="detail"
            hide-footer
            hide-header
            size="lg"
        >

            <img :src="returnImageBase64">

            <hr>

            <b-button
                class="float-right"
                variant="dark"
                size="lg"
                @click="pageToForm()"
            >{{ _('w_Cancel') }}
            </b-button>

        </b-modal>

    </div>

</template>

<script lang="ts">
import { Vue, Component, toEnumInterface } from "../../../core";
import ImageBase64 from "@/services/ImageBase64";
import ServerConfig from "@/services/ServerConfig";
import Dialog from "@/services/Dialog";
import ResponseFilter from "@/services/ResponseFilter";
import Loading from "@/services/Loading";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

interface IHDServer {
    objectId?: string;
    customId: string;
    name: string;
    protocol: string;
    ip: string;
    port: number;
    target_score: number;
}

@Component({
    components: {}
})
export default class HumanDetectionServer extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    modalShow: boolean = false;

    newImg = new Image();
    newImgSrc = "";

    //data

    selectedDetail: any = [];

    inputFormData: any = {};

    //test data
    inputHumanServerData = {
        imageBase64: "",
        objectId: ""
    };

    returnImageBase64: string = "";

    //options
    targetScoreItem: any = {};

    created() {}

    mounted() {
        this.pageToList();
    }

    initTargetScoreItem() {
        this.targetScoreItem["0"] = "0%";
        this.targetScoreItem["0.1"] = "10%";
        this.targetScoreItem["0.2"] = "20%";
        this.targetScoreItem["0.3"] = "30%";
        this.targetScoreItem["0.4"] = "40%";
        this.targetScoreItem["0.5"] = "50%";
        this.targetScoreItem["0.6"] = "60%";
        this.targetScoreItem["0.7"] = "70%";
        this.targetScoreItem["0.8"] = "80%";
        this.targetScoreItem["0.9"] = "90%";
        this.targetScoreItem["1"] = "100%";
    }

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            customId: "",
            name: "",
            protocol: "http",
            ip: "",
            port: "",
            target_score: "0.5",
            imageBase64: ""
        };
    }

    selectedData(data) {
        this.selectedDetail = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
    }

    getInputData() {
        this.clearInputData();

        for (const param of this.selectedDetail) {
            this.inputFormData = {
                name: param.name,
                customId: param.customId,
                objectId: param.objectId,
                ip: param.ip,
                port: param.port,
                protocol: param.protocol,
                target_score: param.target_score.toString()
            };
        }
    }

    pageToList() {
        this.initTargetScoreItem();
        this.clearInputData();
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        (this.$refs.listTable as any).reload();
    }

    pageToView() {
        this.getInputData();
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
    }

    pageToAdd() {
        this.clearInputData();
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
    }

    pageToEdit() {
        this.getInputData();
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
    }

    pageToHumanServerTest() {
        // this.clearInputData();
        this.modalShow = !this.modalShow;
    }

    pageToForm() {
        (this.$refs["detail"] as any).hide();
    }

    async sendHumanServerTest(data) {
        if (this.newImgSrc == "") {
            Dialog.error(this._("w_Upload_Fail"));
            return;
        }

        const configOnject = {
            protocol: data.protocol,
            ip: data.ip,
            port: data.port,
            target_score: parseFloat(data.target_score)
        };

        const humanObject: {
            config: any;
            imageBase64: string;
        } = {
            config: configOnject,
            imageBase64: this.newImgSrc
        };
        Loading.show();
        await this.$server
            .C("/partner/human-detection/test", humanObject)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.modalShow = !this.modalShow;
                    (this.$refs["detail"] as any).show();
                    this.returnImageBase64 = response.imageBase64;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async saveData(data) {
        if (this.inputFormData.objectId == "") {
            const datas = [
                {
                    customId: data.customId,
                    name: data.name,
                    protocol: data.protocol,
                    ip: data.ip,
                    port: data.port,
                    target_score: parseFloat(data.target_score)
                }
            ];

            const addParam = { datas };
            Loading.show();
            await this.$server
                .C("/partner/human-detection", addParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_ServerHD_AddSuccess"));
                            this.pageToList();
                        },
                        this._("w_ServerHD_AddFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else {
            const datas = [
                {
                    objectId: data.objectId,
                    customId: data.customId,
                    name: data.name,
                    protocol: data.protocol,
                    ip: data.ip,
                    port: data.port,
                    target_score: parseFloat(data.target_score)
                }
            ];

            const editParam = { datas };
            Loading.show();
            await this.$server
                .U("/partner/human-detection", editParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_ServerHD_EditSuccess"));
                            this.pageToList();
                        },
                        this._("w_ServerHD_EditFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        }
    }

    async deleteData() {
        Dialog.confirm(
            this._("w_ServerHD_DeleteConfirm"),
            this._("w_Confirm"),
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
                    .D("/partner/human-detection", deleteParam)
                    .then((response: any) => {
                        ResponseFilter.successCheck(
                            this,
                            response,
                            (response: any) => {
                                Dialog.success(this._("w_Success"));
                                this.pageToList();
                            }
                        );
                    })
                    .catch((e: any) => {
                        return ResponseFilter.catchError(this, e);
                    });

                Loading.hide();
            }
        );
    }

    updateForm(data) {
        if (data) {
            this.inputFormData[data.key] = data.value;
        }
    }

    updateServerData(data) {
        if (data && data.key == "imageBase64") {
            this.uploadFile(data.value);
        }
    }

    async uploadFile(file) {
        if (file) {
            ImageBase64.fileToBase64(file, (base64 = "") => {
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
    }

    IList() {
        return `interface {
                 /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;

                 /**
                 * @uiLabel - ${this._("w_ServerHD_DeviceID")}
                 */
                customId: string;

                 /**
                 * @uiLabel - ${this._("w_ServerHD_DeviceName")}
                 */
                name: string;

                /**
                * @uiLabel - ${this._("w_ServerHD_Scale")}
                */
                target_score: number;

                Actions: any;
            }`;
    }

    IView() {
        return `interface {
                /**
                 * @uiLabel - ${this._("w_ServerHD_DeviceID")}
                 * @uiType - iv-form-label
                 */
                customId?: string;

                 /**
                 * @uiLabel - ${this._("w_ServerHD_DeviceName")}
                 * @uiType - iv-form-label
                 */
                name?: string;

                 /**
                 * @uiLabel - ${this._("w_Protocol")}
                * @uiType - iv-form-label
                 */
                 protocol?: ${toEnumInterface({
                     http: "http",
                     https: "https"
                 })};

                /**
                 * @uiLabel - ${this._("w_ServerHD_IP")}
                 * @uiType - iv-form-label
                 */
                ip?: string;

                /**
                * @uiLabel - ${this._("w_ServerHD_Port")}
                * @uiType - iv-form-label
                */
                port?: number;


                /**
                * @uiLabel - ${this._("w_ServerHD_Scale")}
                */
                target_score?: any;

            }`;
    }

    IForm() {
        return `interface {

                /**
                 * @uiLabel - ${this._("w_ServerHD_DeviceID")}
                 * @uiPlaceHolder - ${this._("w_ServerHD_DeviceID")}
                 * @uiType - ${
                     this.inputFormData.objectId === ""
                         ? "iv-form-string"
                         : "iv-form-label"
                 }
                 */
                customId: string;

                 /**
                 * @uiLabel - ${this._("w_ServerHD_DeviceName")}
                 * @uiPlaceHolder - ${this._("w_ServerHD_DeviceName")}
                 */
                name: string;

                     /**
                 * @uiLabel - ${this._("w_Protocol")}
                 */
                 protocol: ${toEnumInterface({
                     http: "http",
                     https: "https"
                 })};

                /**
                 * @uiLabel - ${this._("w_ServerHD_IP")}
                 * @uiPlaceHolder - ${this._("w_ServerHD_IP")}
                 * @uiType - iv-form-ip
                 */
                ip: string;

                /**
                * @uiLabel - ${this._("w_ServerHD_Port")}
               * @uiPlaceHolder - ${this._("w_Port_PlaceHolder")}
                 * @uiAttrs - { max: 65535, min: 1}
                */
                port: number;


                /**
                * @uiLabel - ${this._("w_ServerHD_Scale")}
                * @uiPlaceHolder - ${this._("w_ServerHD_Scale")}
                */
                target_score?: ${toEnumInterface(
                    this.targetScoreItem as any,
                    false
                )};

            }`;
    }

    IHumanServerTestComponent() {
        return `
                interface IHumanServerTestComponent {


                /**
                 * @uiLabel - ${this._("w_Protocol")}
                 */
                 protocol: ${toEnumInterface({
                     http: "http",
                     https: "https"
                 })};

                /**
                 * @uiLabel - ${this._("w_ServerHD_IP")}
                 * @uiPlaceHolder - ${this._("w_ServerHD_IP")}
                 * @uiType - iv-form-ip
                 */
                ip: string;


                /**
                * @uiLabel - ${this._("w_ServerHD_Port")}
               * @uiPlaceHolder - ${this._("w_Port_PlaceHolder")}
                 * @uiAttrs - { max: 65535, min: 1}
                */
                port: number;


                /**
                * @uiLabel - ${this._("w_ServerHD_Scale")}
                * @uiPlaceHolder - ${this._("w_ServerHD_Scale")}
                */
                target_score?: ${toEnumInterface(
                    this.targetScoreItem as any,
                    false
                )};

                imageBase64: any;

        `;
    }
}
</script>


<style lang="scss" scoped>
</style>

