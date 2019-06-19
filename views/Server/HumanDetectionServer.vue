<template>
    <div class="animated fadeIn">
        <!--List-->
        <div v-show="pageStep === ePageStep.List">
            <iv-card :label="_('w_ServerHD_List')">

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
                    ref="dataTable"
                    :interface="IList()"
                    @selected="selectedData($event)"
                    :server="{ path: '/partner/human-detection' }"
                    :multiple="true"
                >
                    <!-- :server="{ path: '/partner/human-detection' }" -->
                    <!-- :data="datas" -->

                    <template #target_score="{$attrs, $listeners}">
                        {{Math.round($attrs.row.target_score*100) + '%'}}
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

        <!--View-->
        <div v-show="pageStep === ePageStep.View">
            <iv-card :label="_('w_ServerHD_View')">
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IView()"
                    :value="data[0]"
                >
                    <template #target_score="{$attrs, $listeners}">
                        <iv-form-label
                            v-bind="$attrs"
                            v-on="$listeners"
                            :value="data[0] ? Math.round(data[0].target_score*100) + '%': ''"
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

        <!--Form (Add and Edit)-->
        <div v-show="pageStep === ePageStep.Add || pageStep === ePageStep.Edit">
            <iv-auto-card :label="pageStep == ePageStep.Add ? _('w_ServerHD_Add') :  _('w_ServerHD_Edit') ">
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IForm()"
                    :value="data[0]"
                    @update:*="updateForm($event)"
                    @submit="saveData($event)"
                >

                    <template #customId="{$attrs, $listeners}">
                        <iv-form-string
                            v-if="pageStep === ePageStep.Add"
                            v-bind="
                        $attrs"
                            :value="$attrs.value ? $attrs.value : ''"
                        >
                        </iv-form-string>
                        <iv-form-label
                            v-if="pageStep === ePageStep.Edit"
                            v-bind="
                        $attrs"
                            :value="$attrs.value ? $attrs.value : ''"
                        >
                        </iv-form-label>
                    </template>
                </iv-form>

                <template #footer-before>
                    <b-button
                        variant="secondary"
                        size="lg"
                        @click="pageToList()"
                    >{{ _('w_Back') }}
                    </b-button>
                    <b-button
                        v-show="pageStep === ePageStep.Edit"
                        variant="dark"
                        size="lg"
                        @click="pageToHumanServerTest()"
                    >{{ _('w_Test') }}
                    </b-button>
                </template>

            </iv-auto-card>
        </div>

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
                    :value="inputHumanServerData"
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
                @click="pageToForm1()"
            >{{ _('w_Cancel') }}
            </b-button>

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
    target_score: number;
}

@Component({
    components: {}
})
export default class HumanDetectionServer extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;
    modalShow: boolean = false;

    newImg = new Image();
    newImgSrc = "";

    //data
    isSelected: any = [];
    datas = {};
    data = [];

    //test data
    inputHumanServerData = {
        imageBase64: "",
        objectId: "",
    };

    returnImageBase64: string = '';

    //options
    targetScoreItem: any = {};

    created() {}

    mounted() {
        this.pageToList();
    }

    pageToList() {
        // this.initData(); //todo for test when no datas
        this.initTargetScoreItem();
        this.pageStep = EPageStep.List;
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

    initData() {
        this.datas = {
            paging: {
                total: 1,
                totalPages: 1,
                page: 1,
                pageSize: 10
            },
            results: [
                {
                    customId: "S-0001",
                    name: "server 1",
                    protocol: "https",
                    ip: "127.0.0.1",
                    port: 8000,
                    target_score: 1
                },
                {
                    customId: "S-0002",
                    name: "server 2",
                    protocol: "http",
                    ip: "127.0.0.1",
                    port: 8000,
                    target_score: 0.6
                }
            ]
        };
    }

    clearData() {
        this.isSelected = [];
        this.data = [];
    }

    pageToView() {
        this.pageStep = EPageStep.View;
    }

    pageToAdd() {
        this.clearData();
        this.pageStep = EPageStep.Add;
    }

    pageToEdit() {
        this.pageStep = EPageStep.Edit;
    }

    async deleteData() {
        Dialog.confirm(this._("w_DeleteConfirm"), this._("w_Confirm"), () => {
            for (const param of this.data) {
                const deleteParam: {
                    objectId: string;
                } = {
                    objectId: param.objectId
                };

                this.$server
                    .D("/partner/human-detection", deleteParam)
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
                    target_score: data.target_score
                }
            ];

            const addParam = { datas };

            await this.$server
                .C("/partner/human-detection", addParam)
                .then((response: any) => {
                    if (response != undefined) {
                        Dialog.success(this._("w_ServerHD_AddSuccess"));
                        this.pageToList();
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
                    target_score: data.target_score
                }
            ];

            const editParam = { datas };

            await this.$server
                .U("/partner/human-detection", editParam)
                .then((response: any) => {
                    if (response != undefined) {
                        Dialog.success(this._("w_ServerHD_EditSuccess"));
                        this.pageToList();
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.base(this, e);
                });
        }
    }

    updateForm(data) {
        console.log("updateForm", data);
        if (data) {
            this.data[data.key] = data.value;
        }
    }

    updateServerData(data) {
        console.log("updateServerData", data);
        if (data && data.key == "imageBase64") {
            this.uploadFile(data.value);
        }
    }

    selectedData(data) {
        this.isSelected = data;
        this.data = [];
        for (let item of data) {
            item.target_score = item.target_score.toString();
        }
        this.data = data;
    }

    pageToHumanServerTest() {
        console.log("pageToHumanServerTest", this.data);
        this.modalShow = !this.modalShow;
        this.inputHumanServerData.objectId = this.data["objectId"];

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

        const humanObject: {
            objectId: string;
            imageBase64: string;
        } = {
            objectId: this.data[0].objectId,
            imageBase64: this.newImgSrc
        };

        await this.$server
            .C("/partner/human-detection/test", humanObject)
            .then((response: any) => {
                if (response != undefined) {
                    this.modalShow = !this.modalShow;
                    (this.$refs["detail"] as any).show();
                    this.returnImageBase64 = response.imageBase64;
                }
            })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });
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

                imageBase64: any;

        `;
    }
}
</script>


<style lang="scss" scoped>
</style>

