<template>
    <div class="animated fadeIn">
        <!--List-->
        <div v-show="pageStep === ePageStep.List">
            <iv-card :label="_('w_DemographicServer_List')">

                <template #toolbox>

                    <iv-toolbox-view
                        :disabled="isSelected.length !== 1"
                        @click="pageToView()"
                    />
                    <iv-toolbox-edit
                        :disabled="isSelected.length !== 1"
                        @click="pageToEdit()"
                    />
                    <iv-toolbox-delete
                        :disabled="isSelected.length === 0"
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
                        <iv-toolbox-more :disabled="isSelected.length !== 1">
                            <iv-toolbox-view
                                :disabled="isSelected.length !== 1"
                                @click="pageToView()"
                            />
                            <iv-toolbox-edit
                                :disabled="isSelected.length !== 1"
                                @click="pageToEdit()"
                            />
                            <iv-toolbox-delete
                                :disabled="isSelected.length !== 1"
                                @click="deleteData()"
                            />
                        </iv-toolbox-more>
                    </template>
                </iv-table>

            </iv-card>
        </div>


        <!--Form (Add and Edit)-->
        <div v-show="pageStep === ePageStep.Add || pageStep === ePageStep.Edit">
            <iv-auto-card :label="pageStep == ePageStep.Add ? _('w_DemographicServer_Add') :  _('w_DemographicServer_Edit') ">
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
        </div>

        <!--View-->
        <div v-show="pageStep === ePageStep.View">
            <iv-card :label="_('w_DemographicServer_View')">
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
        </div>


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
                        :key="'tableDataFromApi__' + index"
                    >
                        <td>{{ value.imageBase64 }}</td>
                        <td>{{ value.age }}</td>
                        <td>
                                <img
                                    class="threshold-image"
                                    :src="value.imageBase64"
                                >
                        </td>
                    </tr>
                    </tbody>
                </table>
                <template #footer>
                    <b-button
                        variant="secondary"
                        size="lg"
                        @click="pageToForm1"
                    >{{ _('w_Back') }}
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
    import ImageBase64 from "@/services/ImageBase64";
    import ServerConfig from "@/services/ServerConfig";
    import Dialog from "@/services/Dialog/Dialog";
    import Datetime from "@/services/Datetime.vue";
    import ResponseFilter from "@/services/ResponseFilter";

    enum EPageStep {
        List = "List",
        View = "View",
        Add = "Add",
        Edit = "Edit",

        none = "none"
    }

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
        ePageStep = EPageStep;
        pageStep: EPageStep = EPageStep.none;
        modalShow: boolean = false;

        newImg = new Image();
        newImgSrc = "";

        //data
        isSelected: any = [];
        selectedDetail: any = [];

        inputFormData: any = {};

        //test data
        testDetailTable: any = {};

        returnImageBase64: string = '';

        //options
        targetScoreItem: any = {};

        created() {}

        mounted() {
            this.pageToList();
        }

        initTargetScoreItem() {
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
                this._("w_Age"),
            ];
        }

        clearInputData() {
            this.inputFormData = {
                objectId: '',
                customId: '',
                name: '',
                protocol: 'http',
                ip: '',
                port: '',
                margin: '0.5',
                imageBase64: ''
            }
        }


        selectedData(data) {
            this.isSelected = data;
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
                    margin: param.margin.toString(),
                };
            }

        }

        pageToView() {
            this.getInputData();
            this.pageStep = EPageStep.View;
        }

        pageToAdd() {
            this.clearInputData();
            this.pageStep = EPageStep.Add;
        }

        pageToEdit() {
            this.getInputData();
            this.pageStep = EPageStep.Edit;
        }

        pageToList() {
            this.initTargetScoreItem();
            this.clearInputData();
            this.pageStep = EPageStep.List;
            (this.$refs.listTable as any).reload();

        }

        pageToHumanServerTest() {
            this.clearInputData();
            this.modalShow = !this.modalShow;
        }

        pageToForm1() {
            this.pageStep = EPageStep.Edit;
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
                margin: parseFloat(data.margin),
            };

            const humanObject: {
                config: any,
                imageBase64: string;
            } = {
                config: configOnject,
                imageBase64: this.newImgSrc
            };

            await this.$server
                .C("/partner/demographic/test", humanObject)
                .then((response: any) => {
                    if (response != undefined) {
                        this.modalShow = !this.modalShow;
                        (this.$refs["detail"] as any).show();
                        for (const returnValue of response) {
                            let detailObject = {
                                age: returnValue.age,
                                gender: returnValue.gender,
                                imageBase64: returnValue.imageBase64,
                            };
                            this.testDetailTable.tableDataFromApi.push(detailObject);
                        }

                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.base(this, e);
                });
        }

        async saveData(data) {
            console.log("saveArea", data);

            if (this.pageStep == EPageStep.Add) {
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

                await this.$server
                    .C("/partner/demographic", addParam)
                    .then((response: any) => {
                        if (response != undefined) {
                            for (const returnValue of response) {
                                if (returnValue.statusCode === 200) {
                                    Dialog.success(this._("w_DemographicServer_AddSuccess"));
                                    this.pageToList();
                                }
                                if (returnValue.statusCode === 500 || returnValue.statusCode === 400) {
                                    Dialog.error(this._("w_DemographicServer_AddFailed"));
                                    return false;
                                }
                            }
                        }
                    })
                    .catch((e: any) => {
                        return ResponseFilter.base(this, e);
                    });

            } else if (this.pageStep == EPageStep.Edit) {
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

                await this.$server
                    .U("/partner/demographic", editParam)
                    .then((response: any) => {
                        if (response != undefined) {
                            for (const returnValue of response) {
                                if (returnValue.statusCode === 200) {
                                    Dialog.success(this._("w_DemographicServer_EditSuccess"));
                                    this.pageToList();
                                }
                                if (returnValue.statusCode === 500 || returnValue.statusCode === 400) {
                                    Dialog.error(this._("w_DemographicServer_EditFailed"));
                                    return false;
                                }
                            }
                        }
                    })
                    .catch((e: any) => {
                        return ResponseFilter.base(this, e);
                    });
            }
        }

        async deleteData() {
            Dialog.confirm(this._("w_DemographicServer_DeleteConfirm"), this._("w_Confirm"), () => {
                for (const param of this.selectedDetail) {
                    const deleteParam: {
                        objectId: string;
                    } = {
                        objectId: param.objectId
                    };

                    this.$server
                        .D("/partner/demographic", deleteParam)
                        .then((response: any) => {
                            if (response) {
                                Dialog.success(this._("w_Success"));
                                this.pageToList();
                            }
                        })
                        .catch((e: any) => {
                            return ResponseFilter.base(this, e);
                        });
                }
            });
        }

        updateForm(data) {
            console.log("updateForm", data);
            if (data) {
                this.inputFormData[data.key] = data.value;
            }
        }

        updateServerData(data) {
            console.log("updateServerData", data);
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
                            console.log("newImgSrc", this.newImgSrc);
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
                * @uiLabel - ${this._("w_ServerHD_Scale")}
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
                this.pageStep === EPageStep.Add
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
                margin?: ${toEnumInterface(
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
                margin?: ${toEnumInterface(
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

