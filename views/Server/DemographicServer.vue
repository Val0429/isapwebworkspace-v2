<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <!--List-->
            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :label="_('w_DemographicServer_List')"
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
                    :server="{ path: '/partner/demographic' }"
                    :multiple="true"
                >
                    <!-- :server="{ path: '/partner/human-detection' }" -->
                    <!-- :data="datas" -->

                    <template #margin="{$attrs, $listeners}">
                        {{Math.round($attrs.row.margin*100) + '%'}}
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
                :label="_('w_DemographicServer_View')"
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IView()"
                    :value="inputFormData"
                >
                    <template #margin="{$attrs, $listeners}">
                        <iv-form-label
                            v-bind="$attrs"
                            v-on="$listeners"
                            :value="inputFormData.margin ? Math.round(inputFormData.margin*100) + '%': ''"
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
                :label="inputFormData.objectId == '' ? _('w_DemographicServer_Add') :  _('w_DemographicServer_Edit') "
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
            :title="_('w_DemographicServer_Test')"
            v-model="modalShow"
        >

            <iv-auto-card :label=" _('w_DemographicServer_Test') ">

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

            <iv-card :label="_('w_DemographicServer_TestResult')">

                <table class="table b-table table-striped table-hover">
                    <thead>
                        <tr>
                            <th
                                v-for="(value,index) in testDetailTable.title"
                                :key="'title_' + index"
                            >{{ value }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(value,index) in testDetailTable.tableDataFromApi"
                            :key="'tableDataFromApi' + index"
                        >
                            <td>
                                <img
                                    class="threshold-image"
                                    :src="value.imageBase64"
                                >
                            </td>
                            <td>{{ value.gender }}</td>
                            <td>{{ value.age }}</td>

                        </tr>
                    </tbody>
                </table>
                <template #footer>
                    <b-button
                        variant="secondary"
                        size="lg"
                        @click="pageToForm"
                    >{{ _('w_Cancel') }}
                    </b-button>
                </template>

            </iv-card>

        </b-modal>

    </div>

</template>

<script lang="ts">
import {
    Vue,
    Component,
    Watch,
    iSAPServerBase,
    MetaParser,
    createDecorator,
    toEnumInterface
} from "../../../core";

// Service
import ImageBase64 from "@/services/ImageBase64";
import ServerConfig from "@/services/ServerConfig";
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
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
    margin: number;
}

@Component({
    components: {}
})
export default class DemographicServer extends Vue {
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
    testDetailTable: any = {
        title: [],
        tableDataFromApi: []
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

    initDate() {
        this.testDetailTable.title = [
            this._("w_Snapshot"),
            this._("w_Gender"),
            this._("w_Age")
        ];
    }

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            customId: "",
            name: "",
            protocol: "http",
            ip: "",
            port: "",
            margin: "0",
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
                margin: param.margin.toString()
            };
        }
    }

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        this.initTargetScoreItem();
        this.clearInputData();
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

    pageToHumanServerTest() {
        // this.clearInputData();
        this.testDetailTable.tableDataFromApi = [];
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
            margin: parseFloat(data.margin)
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
            .C("/partner/demographic/test", humanObject)
            .then((response: any) => {
                ResponseFilter.successCheck(
                    this,
                    response,
                    (response: any) => {
                        this.modalShow = !this.modalShow;
                        this.initDate();
                        for (const returnValue of response) {
                            if (returnValue.age <= 20) {
                                returnValue.age = "0~20";
                            } else if (
                                returnValue.age >= 21 &&
                                returnValue.age <= 30
                            ) {
                                returnValue.age = "21~30";
                            } else if (
                                returnValue.age >= 31 &&
                                returnValue.age <= 40
                            ) {
                                returnValue.age = "31~40";
                            } else if (
                                returnValue.age >= 31 &&
                                returnValue.age <= 40
                            ) {
                                returnValue.age = "31~40";
                            } else if (
                                returnValue.age >= 41 &&
                                returnValue.age <= 50
                            ) {
                                returnValue.age = "41~50";
                            } else if (
                                returnValue.age >= 51 &&
                                returnValue.age <= 60
                            ) {
                                returnValue.age = "51~60";
                            } else if (returnValue.age >= 61) {
                                returnValue.age = "61~";
                            }

                            let detailObject = {
                                age: returnValue.age,
                                gender: returnValue.gender,
                                imageBase64: returnValue.imageBase64
                            };

                            this.testDetailTable.tableDataFromApi.push(
                                detailObject
                            );
                        }
                        (this.$refs["detail"] as any).show();
                    },
                    "",
                    false
                );
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
                    margin: parseFloat(data.margin)
                }
            ];

            const addParam = { datas };
            Loading.show();
            await this.$server
                .C("/partner/demographic", addParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(
                                this._("w_DemographicServer_AddSuccess")
                            );
                            this.pageToList();
                        },
                        this._("w_DemographicServer_AddFailed")
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
                    margin: parseFloat(data.margin)
                }
            ];

            const editParam = { datas };
            Loading.show();
            await this.$server
                .U("/partner/demographic", editParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(
                                this._("w_DemographicServer_EditSuccess")
                            );
                            this.pageToList();
                        },
                        this._("w_DemographicServer_EditFailed")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        }
    }

    async deleteData() {
        Dialog.confirm(
            this._("w_DemographicServer_DeleteConfirm"),
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
                    .D("/partner/demographic", deleteParam)
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
                * @uiLabel - ${this._("w_ServerHD_Margin")}
                */
                margin: number;

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
                * @uiLabel - ${this._("w_ServerHD_Margin")}
                */
                margin?: any;

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
                * @uiLabel - ${this._("w_ServerHD_Margin")}
                * @uiPlaceHolder - ${this._("w_ServerHD_Margin")}
                */
                margin?: ${toEnumInterface(this.targetScoreItem as any, false)};

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
                * @uiLabel - ${this._("w_ServerHD_Margin")}
                * @uiPlaceHolder - ${this._("w_ServerHD_Margin")}
                */
                margin?: ${toEnumInterface(this.targetScoreItem as any, false)};

                imageBase64: any;

        `;
    }
}
</script>


<style lang="scss" scoped>
.threshold-image {
    margin-bottom: 5px;
}
</style>

