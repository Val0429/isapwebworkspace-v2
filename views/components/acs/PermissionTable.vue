<template>
    <div key="main">

        <!--Main  List-->
        <div v-show="pageStep === ePageStep.list">
            <iv-auto-card :label="_('w_Search')">
                <iv-form
                    :interface="ISerachFrom()"
                    @submit="searchTable($event)"
                >
                </iv-form>
            </iv-auto-card>

            <iv-card :label="_('w_Permission_PermissionList')">
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
                    ref="mainTable"
                    :interface="IMainTable()"
                    :multiple="tableMultiple"
                    :server="{ path: '/acs/permissiontable' }"
                    :params="SearchParams"
                    @selected="selectedItem($event)"
                >
                    <template #Actions="{$attrs, $listeners}">
                        <iv-toolbox-more
                            size="sm"
                            :disabled="isSelected.length !== 1"
                        >
                            <iv-toolbox-view @click="pageToView" />
                            <iv-toolbox-edit @click="pageToEdit()" />
                            <iv-toolbox-delete @click="doDelete" />
                        </iv-toolbox-more>
                    </template>

                </iv-table>
            </iv-card>
        </div>

        <!--Site Form (Add and Edit and View)-->
        <div v-if="pageStep === ePageStep.add || pageStep === ePageStep.edit || pageStep === ePageStep.view">
            <iv-auto-card
                :label="pageStep == ePageStep.add ? _('w_Permission_PermissionAdd') : pageStep == ePageStep.edit ? _('w_Permission_PermissionEdit') :  _('w_Permission_PermissionView')"
                v-if="pageStep != ePageStep.view"
            >

                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IForm()"
                    :value="inputFormData"
                    ref="subForm"
                    @submit="doSave($event)"
                    @update:deviceType="selectedDeviceType($event)"

                    @update:*="tempSaveInputData($event)"
                >

                    <!-- <template #deviceType="{ $attrs, $listeners}">
                        <div class="card-content iv-form-group col-md-12">
                            <b-form-group :label="_('w_Permission_DeviceType')">
                                <b-form-radio-group
                                    @change="selectedDeviceType()"
                                    v-model="selected"
                                    :options="devoceTypeItem"
                                ></b-form-radio-group>
                            </b-form-group>
                        </div>
                    </template> -->
                    <template #showInputDataInTable="{ $attrs }">
                        <b-button
                            class="h-25 addButton"
                            variant="primary"
                            size="md"
                            @click="pageToshowInputDataInTable()"
                        >{{ _('w_Add') }}
                        </b-button>
                    </template>

                </iv-form>

                <!-- Sub  Table -->
                <template
                    #toolbox
                    v-if="pageStep === ePageStep.view"
                >
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <table class="table b-table table-striped table-hover mt-5">
                    <thead>
                        <tr>
                            <th v-show="pageStep ==='remove'"></th>
                            <th v-for="value in inputFormData.title">{{ value }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(value, index) in inputFormData.data">
                            <td>{{ value.deviceType }}</td>
                            <td>{{ value.deviceName }}</td>
                            <td>{{ value.deviceArea }}</td>
                            <td>{{ value.deviceTimeFormat }}</td>
                            <td>
                                <b-button
                                    v-if="pageStep != ePageStep.view"
                                    class="button"
                                    type="button"
                                    @click="doSubDelete(value)"
                                >{{ _('w_Delete')}}</b-button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <template #footer-before>
                    <b-button
                        variant="secondary"
                        size="lg"
                        @click="pageToList()"
                    >{{ _('w_Back') }}
                    </b-button>
                </template>

            </iv-auto-card>

        </div>

    </div>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";
import PermissionTableForm from "./PermissionTableForm.vue";
import Dialog from "@/services/Dialog/Dialog";

enum EPageStep {
    list = "list",
    add = "add",
    edit = "edit",
    view = "view",
    none = "none"
}

@Component({
    components: { PermissionTableForm }
})
export default class PermissionTable extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;
    tableMultiple = true;
    isSelected: any = [];
    selectedDetail: any = [];
    inputFormData: any = {
        title: [
            "Device Type",
            "Device Name",
            "Device Area",
            "Time Format",
            "Action"
        ],
        permissionName: "",
        deviceType: "door",
        deviceName: "",
        deviceArea: "",
        deviceTimeFormat: "",
        id: "",

        data: [],   // subTable use

        accesslevelIds: [],
        accesslevels: []
    };
    accesslevel: any = {
        objectId: "",
        deviceType: "",
        deviceName: "",
        deviceArea: "",
        deviceTimeFormat: ""
    };
    SearchParams: any = {};

    //options
    deviceNameItem: any = {};
    deviceAreaItem: any = {};
    deviceTimeFromatItem: any = {};
    showdeviceTimeFromatItem: any = {};
    devoceTypeItem: any = {
        door: 'door',
        doorGroup: 'doorGroup',
        elevator: 'elevator',
    };

    selected = "door";

    created() {}

    mounted() {
        this.pageToList();
    }

    searchTable(datas) {
        this.SearchParams = {};
        for (var i in datas) {
            this.SearchParams = {
                tablename: datas.permissionName
            };
        }

        (this.$refs.mainTable as any).reload();
    }

    clearInputFormData() {
        this.inputFormData = {
            title: [
                "Device Type",
                "Device Name",
                "Device Area",
                "Time Format",
                "Action"
            ],

            data: [
                // permissionName: "",
                // deviceType: "door",
                // deviceName: "",
                // deviceArea: "",
                // deviceTimeFormat: "",
            ],
            id: "",
            // permissionName: "",
            // deviceType: "door",
            // deviceName: "",
            // deviceArea: "",
            // deviceTimeFormat: "",
            accesslevelIds: [],
            accesslevels: []
        };
    }

    async initInputFormData(datas) {
        let data = datas[0];

        this.inputFormData.id = data.objectId;
        this.inputFormData.permissionName = data.tablename;
        this.inputFormData.accesslevelIds = data.accesslevels;

        await this.$server
            .R("/acs/accesslevel")
            .then((response: any) => {
                if (response != undefined) {
                    this.inputFormData.accesslevels = [];
                    for (let accesslevel of response.results) {
                        //TODO ture有資料後 要改成比較資料 = > (returnValue.objectId ==  this.inputFormData.id)
                        if (true) {
                            if (accesslevel.door) {
                                this.$server
                                    .R("/acs/door", {
                                        objectId: accesslevel.door.objectId
                                    })
                                    .then((subResponse: any) => {
                                        if (subResponse != undefined) {
                                            for (let door of subResponse.results) {
                                                let item = {
                                                    objectId:
                                                        accesslevel.objectId, //accesslevel
                                                    deviceType: "door",
                                                    deviceName: door.doorname,
                                                    deviceArea: "",
                                                    deviceTimeFormat: this.showdeviceTimeFromatItem.filter(
                                                        x =>
                                                            x.id ==
                                                            accesslevel.timeschedule
                                                    )[0].text
                                                };
                                                this.inputFormData.accesslevels.push(
                                                    item
                                                );
                                            }
                                        }
                                    })
                                    .catch((e: any) => {
                                        console.log(e);
                                        return false;
                                    });
                            } else if (accesslevel.doorgroup) {
                            } else if (accesslevel.elevator) {
                            }
                        }
                    }
                }
            })
            .catch((e: any) => {
                console.log(e);
                return false;
            });
    }

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = [];
        if (this.isSelected && this.isSelected.length > 0) {
            this.selectedDetail = data;
            this.initInputFormData(this.selectedDetail);
        }
    }

    tempSaveInputData(data) {
        console.log('data - ', data);

        switch (data.key) {

            case "deviceType":
                this.inputFormData.deviceType = data.value;
                break;
            case "deviceName":
                this.inputFormData.deviceName = data.value;
                break;
            case "deviceArea":
                this.inputFormData.deviceArea = data.value;
                break;
            case "deviceTimeFormat":
                this.inputFormData.deviceTimeFormat = data.value;
                break;
        }

       // console.log('this.inputFormData.data - ', this.inputFormData.data);

    }

    selectedDeviceType(data) {
        this.selected = this.devoceTypeItem[data];
        this.inputFormData.data.deviceType = data;
        // console.log("selectedDeviceType", data, this.selected);

        switch (this.selected) {
            case "door":
                this.deviceNameItemByDoor();
                break;
            case "doorGroup":
                this.deviceNameItemByDoorGroup();
                break;
            case "elevator":
                this.deviceNameItemByElevtor();
                break;
            default:
                break;
        }
    }


    pageToList() {
        console.log("pageToList");
        this.selected = "door";
        this.selectedDeviceType(0);
        this.initDeviceTimeFromatItem();
        this.pageStep = EPageStep.list;
        (this.$refs.mainTable as any).reload();
    }

    pageToAdd() {
        this.clearInputFormData();

        this.pageStep = EPageStep.add;
    }

    pageToEdit() {
        this.pageStep = EPageStep.edit;
    }

    pageToView() {
        this.pageStep = EPageStep.view;
    }

    pageToshowInputDataInTable() {



        const tableData: any = {
            deviceType: this.inputFormData.deviceType,
            deviceName: this.inputFormData.deviceName,
            deviceArea: this.inputFormData.deviceArea,
            deviceTimeFormat: this.inputFormData.deviceTimeFormat
        };
        this.inputFormData.data.push(tableData);

        (this.$refs.subForm as any).set("showInputDataInTable", true);
    }

    async doSubDelete(data) {
        console.log("doSubDelete", data);
        await Dialog.confirm(
            this._("w_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                const deleteParam: {
                    objectId: string;
                } = {
                    objectId: data.objectId
                };

                this.$server
                    .D("/acs/accesslevel", deleteParam)
                    .then((response: any) => {
                        this.inputFormData.accesslevels = this.inputFormData.accesslevels.filter(
                            a => a.objectId != data.objectId
                        );
                    })
                    .catch((e: any) => {
                        console.log(e);
                    });
            }
        );
    }

    async doDelete() {
        await Dialog.confirm(
            this._("w_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                for (const param of this.selectedDetail) {
                    const deleteParam: {
                        objectId: string;
                    } = {
                        objectId: param.objectId
                    };

                    this.$server
                        .D("/acs/permissiontable", deleteParam)
                        .then((response: any) => {
                            this.pageToList();
                        })
                        .catch((e: any) => {
                            console.log(e);
                        });
                }
            }
        );
    }

    doSave() {
        //新增的時候要先新增PermissionTable再新增AccessLeve,Edit 則直接新增AccessLevel即可
        //TODO Edit or Add PermissionTable API
        //TODO Add AccessLevel API
    }

    // swtichWeeks(data) {
    //     switch (data) {
    //         case 1:
    //             return "Monday";
    //         case 2:
    //             return "Tuesday";

    //         case 3:
    //             return "Wednesday";
    //         case 4:
    //             return "Thursday";
    //         case 5:
    //             return "Friday";
    //         case 6:
    //             return "Saturday";
    //         case 7:
    //             return "Sunday";
    //     }
    // }

    async initDeviceTimeFromatItem() {
        await this.$server
            .R("/acs/timeschedule")
            .then((response: any) => {
                if (response != undefined) {
                    this.deviceTimeFromatItem = {};
                    for (const returnValue of response.results) {
                        this.$set(
                            this.deviceTimeFromatItem,
                            returnValue.objectId,
                            returnValue.timename
                        );
                        let item = {
                            id: returnValue.objectId,
                            text: returnValue.timename
                        };
                        this.showdeviceTimeFromatItem.push(item);
                    }
                }
            })
            .catch((e: any) => {
                console.log(e);
                return false;
            });
    }

    async deviceNameItemByDoor() {
        await this.$server
            .R("/acs/door")
            .then((response: any) => {
                if (response != undefined) {
                    this.deviceNameItem = {};
                    for (const returnValue of response.results) {
                        this.$set(
                            this.deviceNameItem,
                            returnValue.objectId,
                            returnValue.doorname
                        );
                    }
                    return;
                }
            })
            .catch((e: any) => {
                console.log(e);
                return false;
            });
    }

    async deviceNameItemByDoorGroup() {
        await this.$server
            .R("/acs/doorgroup")
            .then((response: any) => {
                if (response != undefined) {
                    this.deviceNameItem = {};
                    for (const returnValue of response.results) {
                        this.$set(
                            this.deviceNameItem,
                            returnValue.objectId,
                            returnValue.groupname
                        );
                    }
                }
            })
            .catch((e: any) => {
                console.log(e);
                return false;
            });
    }

    async deviceNameItemByElevtor() {
        await this.$server
            .R("/acs/elevator")
            .then((response: any) => {
                if (response != undefined) {
                    this.deviceNameItem = {};
                    for (const returnValue of response.results) {
                        this.$set(
                            this.deviceNameItem,
                            returnValue.objectId,
                            returnValue.elevatorname
                        );
                    }
                }
            })
            .catch((e: any) => {
                console.log(e);
                return false;
            });

        await this.$server
            .R("/acs/elevatorgroup")
            .then((response: any) => {
                if (response != undefined) {
                    this.deviceAreaItem = {};
                    for (const returnValue of response.results) {
                        this.$set(
                            this.deviceAreaItem,
                            returnValue.objectId,
                            returnValue.elevatorname
                        );
                    }
                }
            })
            .catch((e: any) => {
                console.log(e);
                return false;
            });
    }


    ISerachFrom() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Permission_PermissionName")}
                 * @uiPlaceHolder - ${this._("w_Permission_PermissionName")}
                 */
                permissionName?: string;


            }
        `;
    }

    IMainTable() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Permission_PermissionName")}
                 * @uiPlaceHolder - ${this._("w_Permission_PermissionName")}
                 */
                tablename?: string;

                Actions: any;
            }
        `;
    }

    IForm() {
        return `
            interface {

                 /**
                 * @uiLabel - ${this._("w_Permission_PermissionName")}
                 * @uiPlaceHolder - ${this._("w_Permission_PermissionName")}
                 * @uiColumnGroup - row1
                 */
                 permissionName: string;

                /**
                 * @uiColumnGroup - row1
                 * @uiHidden - true
                 */
                row1?: string;

                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceType")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceType")}
                 * @uiColumnGroup - row15
                 */
                 deviceType?:: ${toEnumInterface(
                     this.devoceTypeItem as any,
                     false
                 )};

                /**
                 * @uiColumnGroup - row15
                 * @uiHidden - true
                 */
                row153?: string;

                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceName")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceName")}
                 * @uiColumnGroup - row11
                 */
                 deviceName?: ${toEnumInterface(
                     this.deviceNameItem as any,
                     false
                 )};

                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceArea")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceArea")}
                 * @uiColumnGroup - row11
                * @uiType - ${
                    this.selected === "elevator"
                        ? "iv-form-selection"
                        : "iv-form-label"
                }
                 */
                 deviceArea?: string;

                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiColumnGroup - row11
                 */
                 deviceTimeFormat?: ${toEnumInterface(
                     this.deviceTimeFromatItem as any,
                     false
                 )};

                /*
                 * @uiColumnGroup - row11
                 */
                 showInputDataInTable: any

            }
        `;
    }

    ISubTable() {
        return `
            interface {



                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceType")}
                 */
                 deviceType: string;

                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceName")}
                 */
                 deviceName: string;

                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceArea")}
                 */
                 deviceArea: string;

                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceTimeFormat")}
                 */
                 deviceTimeFormat: string;

                 Actions: any;
            }
        `;
    }
}
</script>
<style lang="scss" scoped>
    .addButton {
        margin-top: 27px;
    }

</style>
