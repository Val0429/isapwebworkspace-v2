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
        <div v-show="pageStep === ePageStep.add || pageStep === ePageStep.edit || pageStep === ePageStep.view">
            <iv-auto-card
                :label="pageStep == ePageStep.add ? _('w_Permission_PermissionAdd') : pageStep == ePageStep.edit ? _('w_Permission_PermissionEdit') :  _('w_Permission_PermissionView')"

            >
<!--                v-if="pageStep != ePageStep.view"-->

                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    ref="subForm"
                    :interface="IForm()"
                    :value="inputFormData"
                    @submit="doSave($event)"
                    @update:deviceType="selectedDeviceType($event)"
                    @update:*="tempSaveInputData($event)"
                >

                    <!-- door -->
                    <template #doorName="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType == eDeviceType.door"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.doorName"
                        ></iv-form-selection>
                    </template>

                    <template #doorArea="{ $attrs, $listeners }">
                        <iv-form-string
                            v-show="deviceType == eDeviceType.door"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.doorArea"
                            :disabled="true"
                        ></iv-form-string>
                    </template>

                    <template #doorTimeFormat="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType == eDeviceType.door"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.deviceTimeFormat"
                        ></iv-form-selection>
                    </template>

                    <template #doorAdd="{ $attrs }">

                        <b-button
                            v-show="deviceType == eDeviceType.door"
                            class="h-25 addButton"
                            variant="primary"
                            size="md"
                            @click="pageToAddDeviceInTable()"
                        >{{ _('w_Add') }}
                        </b-button>
                    </template>

                    <!-- door Group -->
                    <template #doorGroupName="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType === eDeviceType.doorGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.doorGroupName"
                        ></iv-form-selection>
                    </template>

                    <template #doorGroupArea="{ $attrs, $listeners }">
                        <iv-form-string
                            v-show="deviceType === eDeviceType.doorGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.doorGroupArea"
                            :disabled="true"
                        ></iv-form-string>
                    </template>

                    <template #doorGroupTimeFormat="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType == eDeviceType.doorGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.deviceTimeFormat"
                        ></iv-form-selection>
                    </template>

                    <template #doorGroupAdd="{ $attrs }">
                        <b-button
                            v-show="deviceType === eDeviceType.doorGroup"
                            class="h-25 addButton"
                            variant="primary"
                            size="md"
                            @click="pageToAddDeviceInTable()"
                        >{{ _('w_Add') }}
                        </b-button>
                    </template>

                    <!-- elevator -->

                    <template #elevatorName="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-if="deviceType === eDeviceType.elevator"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.elevatorName"
                        ></iv-form-selection>
                    </template>

                    <template #elevatorArea="{ $attrs, $listeners }">
                        <iv-form-string
                            v-if="deviceType === eDeviceType.elevator"
                            v-bind="$attrs"
                            v-on="$listeners"
                            :disabled="true"
                            v-model="inputFormData.elevatorArea"
                        ></iv-form-string>
                    </template>

                    <template #elevatorTimeFormat="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType == eDeviceType.elevator"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.deviceTimeFormat"
                        ></iv-form-selection>
                    </template>

                    <template #elevatorAdd="{ $attrs }">
                        <b-button
                            v-if="deviceType === eDeviceType.elevator"
                            class="h-25 addButton"
                            variant="primary"
                            size="md"
                            @click="pageToAddDeviceInTable()"
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
                                    @click="doSubDelete(index)"
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

enum EDeviceType {
    none = "none",
    door = "door",
    doorGroup = "doorGroup",
    elevator = "elevator",
    elevatorGroup = "elevatorGroup"
}

interface ISelectOption {
    value: string;
    text: string;
}

interface ISelectItem {
    timeSchedule: any;
    doorDevice: any;
    doorGroupDevice: any;
    elevatorDevice: any;
    elevatorGroupDevice: any;
}

@Component({
    components: { PermissionTableForm }
})
export default class PermissionTable extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;
    eDeviceType = EDeviceType;
    deviceType: EDeviceType = EDeviceType.door;

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
        id: "",
        permissionName: "",
        deviceType: "door",
        deviceName: "",
        deviceArea: "",
        deviceTimeFormat: "",
        data: [] // subTable use
    };
    SearchParams: any = {};

    //options
    deviceNameItem: any = {};
    deviceAreaItem: any = {};
    deviceTimeFromatItem: any = {};
    showdeviceTimeFromatItem: any = {};
    deviceTypeItem: any = {
        door: EDeviceType.door,
        doorGroup: EDeviceType.doorGroup,
        elevator: EDeviceType.elevator
    };

    selectItemOriginal: any = {
        timeSchedule: [],
        door: [],
        doorGroup: [],
        elevator: [],
        elevatorGroup: []
    };
    selectItem: ISelectItem = {
        timeSchedule: [],
        doorDevice: [],
        doorGroupDevice: [],
        elevatorDevice: [],
        elevatorGroupDevice: []
    };
    selectAera: any = {
        door: "",
        doorGroup: "",
        elevator: "",
        elevatorGroup: ""
    };

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
            id: "",
            permissionName: "",
            deviceType: "door",
            doorName: "",
            doorArea: "",
            doorGroupName: "",
            doorGroupArea: "",
            elevatorName: "",
            elevatorArea: "",
            deviceTimeFormat: "0",
            title: [
                "Device Type",
                "Device Name",
                "Device Area",
                "Time Format",
                "Action"
            ],
            data: []
        };
    }

    pageToList() {
        this.clearInputFormData();
        this.selectedDeviceType(EDeviceType.door);
        (this.$refs.mainTable as any).reload();
        this.pageStep = EPageStep.list;
    }

    async pageToAdd() {
        this.clearInputFormData();
        await this.initSelectItem();
        this.pageStep = EPageStep.add;
    }

    async pageToEdit() {
        await this.initSelectItem();
        this.pageStep = EPageStep.edit;
    }

    pageToView() {
        this.pageStep = EPageStep.view;
        console.log('this.pageStep - ', this.pageStep);
    }

    async initSelectItem() {
        let param = {
            paging: {
                page: 1,
                pageSize: 10000
            }
        };

        this.selectItem.timeSchedule = { "0": this._("w_Select") };
        this.selectItem.doorDevice = { "0": this._("w_Select") };
        this.selectItem.doorGroupDevice = { "0": this._("w_Select") };
        this.selectItem.elevatorDevice = { "0": this._("w_Select") };

        await this.$server
            .R("/acs/timeschedule", param)
            .then((response: any) => {
                if (response != undefined && response.results != undefined) {
                    for (let tempItem of response.results) {
                        if (
                            tempItem.objectId != undefined &&
                            tempItem.timeid != undefined &&
                            tempItem.timename != undefined &&
                            typeof tempItem.timeid == "string" &&
                            typeof tempItem.timename == "string"
                        ) {
                            this.selectItem.timeSchedule[tempItem.objectId] =
                                tempItem.timename;
                            this.selectItemOriginal.timeSchedule.push(tempItem);
                        }
                    }
                }
            })
            .catch((e: any) => {
                console.log(e);
                return false;
            });

        await this.$server
            .R("/acs/door", param)
            .then((response: any) => {
                if (response != undefined && response.results != undefined) {
                    for (let tempItem of response.results) {
                        if (
                            tempItem.objectId != undefined &&
                            tempItem.doorid != undefined &&
                            tempItem.doorname != undefined &&
                            typeof tempItem.doorid == "string" &&
                            typeof tempItem.doorname == "string"
                        ) {
                            this.selectItem.doorDevice[tempItem.objectId] =
                                tempItem.doorname;
                            this.selectItemOriginal.door.push(tempItem);
                        }
                    }
                }
            })
            .catch((e: any) => {
                console.log(e);
                return false;
            });

        await this.$server
            .R("/acs/doorgroup", param)
            .then((response: any) => {
                for (let tempItem of response.results) {
                    if (
                        tempItem.objectId != undefined &&
                        tempItem.groupid != undefined &&
                        tempItem.groupname != undefined &&
                        typeof tempItem.groupid == "string" &&
                        typeof tempItem.groupname == "string"
                    ) {
                        this.selectItem.doorGroupDevice[tempItem.objectId] =
                            tempItem.groupname;
                        this.selectItemOriginal.doorGroup.push(tempItem);
                    }
                }
            })
            .catch((e: any) => {
                console.log(e);
                return false;
            });

        await this.$server
            .R("/acs/elevator", param)
            .then((response: any) => {
                for (let tempItem of response.results) {
                    if (
                        tempItem.objectId != undefined &&
                        tempItem.elevatorid != undefined &&
                        tempItem.elevatorname != undefined &&
                        typeof tempItem.elevatorid == "string" &&
                        typeof tempItem.elevatorname == "string"
                    ) {
                        this.selectItem.elevatorDevice[tempItem.objectId] =
                            tempItem.elevatorname;
                        this.selectItemOriginal.elevator.push(tempItem);
                    }
                }
            })
            .catch((e: any) => {
                console.log(e);
                return false;
            });
    }

    async initInputFormData(datas) {
        let data = datas[0];
        this.deviceType = EDeviceType.door;
        this.inputFormData.id = data.objectId;
        this.inputFormData.permissionName = data.tablename;
        this.inputFormData.accesslevelIds = data.accesslevels;
    }

    selectedItem(data) {
        this.clearInputFormData();
        this.isSelected = data;
        this.selectedDetail = [];
        if (this.isSelected && this.isSelected.length > 0) {
            this.selectedDetail = data;
            this.initInputFormData(this.selectedDetail);
        }
    }

    tempSaveInputData(data) {
        switch (data.key) {
            case "permissionName":
                this.inputFormData.permissionName = data.value;
                break;

            case "deviceType":
                this.inputFormData.deviceType = data.value;
                break;

            // door
            case "doorName":
                for (const key in this.selectItem.doorDevice) {
                    if (data.value === key) {
                        this.inputFormData.doorName = key;
                        break;
                    }
                }
                break;

            case "doorTimeFormat":
                for (const key in this.selectItem.timeSchedule) {
                    if (data.value === key) {
                        this.inputFormData.deviceTimeFormat = key;
                        break;
                    }
                }
                break;

            // doorGroup
            case "doorGroupName":
                for (const key in this.selectItem.doorGroupDevice) {
                    if (data.value === key) {
                        this.inputFormData.doorGroupName = key;
                        break;
                    }
                }
                for (let origin of this.selectItemOriginal.doorGroup) {
                    if (origin.objectId != undefined) {
                        if (data.value == origin.objectId) {
                            if (
                                origin.area != undefined &&
                                origin.area.name != undefined
                            ) {
                                this.inputFormData.doorGroupArea =
                                    origin.area.name;
                            }
                            break;
                        }
                    }
                }
                break;

            case "doorGroupTimeFormat":
                for (const key in this.selectItem.timeSchedule) {
                    if (data.value === key) {
                        this.inputFormData.deviceTimeFormat = key;
                        break;
                    }
                }
                break;

            // elevator
            case "elevatorName":
                for (const key in this.selectItem.elevatorDevice) {
                    if (data.value === key) {
                        this.inputFormData.elevatorName = key;
                        break;
                    }
                }
                break;

            case "elevatorTimeFormat":
                for (const key in this.selectItem.timeSchedule) {
                    if (data.value === key) {
                        this.inputFormData.deviceTimeFormat = key;
                        break;
                    }
                }
                break;
        }
    }

    selectedDeviceType(data) {
        this.deviceType = data;
        this.inputFormData.data.deviceType = data;
    }

    pageToAddDeviceInTable() {
        switch (this.deviceType) {
            case EDeviceType.door:
                if (
                    this.inputFormData.doorName === "Please Select" ||
                    this.inputFormData.doorName === "0"
                ) {
                    return false;
                }
                if (
                    this.inputFormData.deviceTimeFormat === "Please Select" ||
                    this.inputFormData.deviceTimeFormat === "0"
                ) {
                    return false;
                }
                const doorData: any = {
                    deviceType: this.inputFormData.deviceType,
                    deviceName: this.inputFormData.doorName,
                    deviceArea: this.inputFormData.doorArea,
                    deviceTimeFormat: this.inputFormData.deviceTimeFormat
                };
                this.inputFormData.data.push(doorData);
                this.clearDeviceSelection();
                break;
            case EDeviceType.doorGroup:
                if (
                    this.inputFormData.doorGroupName === "Please Select" ||
                    this.inputFormData.doorGroupName === "0"
                ) {
                    return false;
                }
                if (
                    this.inputFormData.doorGroupTimeFormat ===
                        "Please Select" ||
                    this.inputFormData.doorGroupTimeFormat === "0"
                ) {
                    return false;
                }
                const doorGroupData: any = {
                    deviceType: this.inputFormData.deviceType,
                    deviceName: this.inputFormData.doorGroupName,
                    deviceArea: this.inputFormData.doorGroupArea,
                    deviceTimeFormat: this.inputFormData.deviceTimeFormat
                };
                this.inputFormData.data.push(doorGroupData);
                this.clearDeviceSelection();
                break;
            case EDeviceType.elevator:
                if (
                    this.inputFormData.elevatorName === "Please Select" ||
                    this.inputFormData.elevatorName === "0"
                ) {
                    return false;
                }
                if (
                    this.inputFormData.elevatorTimeFormat === "Please Select" ||
                    this.inputFormData.elevatorTimeFormat === "0"
                ) {
                    return false;
                }
                const elevatorData: any = {
                    deviceType: this.inputFormData.deviceType,
                    deviceName: this.inputFormData.elevatorName,
                    deviceArea: this.inputFormData.elevatorArea,
                    deviceTimeFormat: this.inputFormData.deviceTimeFormat
                };
                this.inputFormData.data.push(elevatorData);
                this.clearDeviceSelection();
                break;
        }
    }

    clearDeviceSelection() {
        this.inputFormData.deviceTimeFormat = "0";

        this.inputFormData.doorName = "0";
        this.inputFormData.doorArea = "";

        this.inputFormData.doorGroupName = "0";
        this.inputFormData.doorGroupArea = "";

        this.inputFormData.elevatorName = "0";
        this.inputFormData.elevatorArea = "";
    }

    async doSubDelete(index) {
        this.inputFormData.data.splice(index, 1);
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

    async doSave() {
        let premissionParam: any = {
            status: 1,

            // need update
            tablename: this.inputFormData.permissionName,
            accesslevels: []
        };

        for (let tempData of this.inputFormData.data) {
            let accessParam: any = {
                system: 0, // always is 0
                levelid: "", // always is empty string
                levelname: "", // always is empty string
                status: 1, // always is 1

                // need update
                timeschedule: tempData.deviceTimeFormat, // timeschedule
                type: this.deviceType, // for frontend use
                reader: [] // to door, doorGroup, elevator ogigin find reader
            };

            if (accessParam.timeschedule == "") {
                console.log("!!! accessParam.timeschedule not find");
                continue;
            }

            switch (this.deviceType) {
                case EDeviceType.door:
                    accessParam.door = tempData.doorName;

                    for (let door of this.selectItemOriginal.door) {
                        if (
                            door.objectId != undefined &&
                            door.doorid != undefined &&
                            door.objectId == accessParam.door
                        ) {
                            if (door.readerin != undefined) {
                                for (let reader of door.readerin) {
                                    if (reader.objectId != undefined) {
                                        accessParam.reader.push(
                                            reader.objectId
                                        );
                                    }
                                }
                            }
                            if (door.readerout != undefined) {
                                for (let reader of door.readerout) {
                                    if (reader.objectId != undefined) {
                                        accessParam.reader.push(
                                            reader.objectId
                                        );
                                    }
                                }
                            }
                            break;
                        }
                    }
                    break;
                case EDeviceType.doorGroup:
                    accessParam.doorGroup = tempData.doorGroupName;
                    for (let doorGroup of this.selectItemOriginal.doorGroup) {
                        if (
                            doorGroup.objectId != undefined &&
                            doorGroup.groupid != undefined &&
                            doorGroup.objectId == tempData.doorGroupName
                        ) {
                            if (
                                doorGroup.door != undefined &&
                                doorGroup.readerin != undefined
                            ) {
                                for (let reader of doorGroup.readerin) {
                                    if (reader.objectId != undefined) {
                                        accessParam.reader.push(
                                            reader.objectId
                                        );
                                    }
                                }
                            }
                            if (
                                doorGroup.door != undefined &&
                                doorGroup.readerout != undefined
                            ) {
                                for (let reader of doorGroup.readerout) {
                                    if (reader.objectId != undefined) {
                                        accessParam.reader.push(
                                            reader.objectId
                                        );
                                    }
                                }
                            }
                            break;
                        }
                    }
                    break;
                case EDeviceType.elevator:
                    accessParam.elevator = tempData.elevator;
                    for (let elevator of this.selectItemOriginal.elevator) {
                        if (
                            elevator.objectId != undefined &&
                            elevator.elevatorid != undefined &&
                            elevator.objectId == tempData.elevator
                        ) {
                            if (elevator.reader != undefined) {
                                for (let reader of elevator.reader) {
                                    if (reader.objectId != undefined) {
                                        accessParam.reader.push(
                                            reader.objectId
                                        );
                                    }
                                }
                            }
                        }
                    }
                    break;
                case EDeviceType.elevatorGroup:
                case EDeviceType.none:
                default:
                    break;
            }

            await this.$server
                .C("/acs/accesslevel", accessParam)
                .then((response: any) => {
                    if (
                        response != undefined &&
                        response.objectId != undefined
                    ) {
                        premissionParam.accesslevels.push(response.objectId);
                    }
                })
                .catch((e: any) => {
                    console.log(e);
                });
        }

        await this.$server
            .C("/acs/permissiontable", premissionParam)
            .then((response: any) => {
                this.pageToList();
            })
            .catch((e: any) => {
                console.log(e);
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
                 * @uiDisabled - ${
                    this.pageStep === EPageStep.add ||
                    this.pageStep === EPageStep.edit
                        ? "false"
                        : "true"
                }
                */
                 permissionName: string;


                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceType")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceType")}
                 * @uiColumnGroup - row15
                 * @uiDisabled - ${
                        this.pageStep === EPageStep.add ||
                        this.pageStep === EPageStep.edit
                            ? "false"
                            : "true"
                        }
                */
                 deviceType?: ${toEnumInterface(
                     this.deviceTypeItem as any,
                     false
                 )};

                 ///////////////////////////////////////////////////////


                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceName")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceName")}
                 * @uiColumnGroup - row11
                 * @uiDisabled - ${
                        this.pageStep === EPageStep.add ||
                        this.pageStep === EPageStep.edit
                            ? "false"
                            : "true"
                        }
                */
                 doorName?: ${toEnumInterface(
                     this.selectItem.doorDevice as any,
                     false
                 )};

                /**
                 * @uiLabel - ${this._("w_Permission_DeviceArea")}
                 * @uiColumnGroup - row11
                 * @uiType - ${
                     this.deviceType === "elevator"
                         ? "iv-form-string"
                         : "iv-form-label"
                 }
                */
                 doorArea?: string;



                /**
                 * @uiLabel - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiColumnGroup - row11
                 * @uiDisabled - ${
                        this.pageStep === EPageStep.add ||
                        this.pageStep === EPageStep.edit
                            ? "false"
                            : "true"
                        }
                */
                doorTimeFormat?: ${toEnumInterface(
                    this.selectItem.timeSchedule as any,
                    false
                )};


                /*
                 * @uiColumnGroup - row11
                */
                 doorAdd?: any;


                ///////////////////////////////////////////////////////


                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceName")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceName")}
                 * @uiColumnGroup - row111
                 * @uiDisabled - ${
                        this.pageStep === EPageStep.add ||
                        this.pageStep === EPageStep.edit
                            ? "false"
                            : "true"
                        }
                */
                 doorGroupName?: ${toEnumInterface(
                     this.selectItem.doorGroupDevice as any,
                     false
                 )};

                /**
                 * @uiLabel - ${this._("w_Permission_DeviceArea")}
                 * @uiColumnGroup - row111
                * @uiType - ${
                    this.deviceType === EDeviceType.doorGroup
                        ? "iv-form-string"
                        : "iv-form-label"
                }
                 */
                 doorGroupArea?: string;


                /**
                 * @uiLabel - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiColumnGroup - row111
                 * @uiDisabled - ${
                        this.pageStep === EPageStep.add ||
                        this.pageStep === EPageStep.edit
                            ? "false"
                            : "true"
                        }
                */
                doorGroupTimeFormat?: ${toEnumInterface(
                    this.selectItem.timeSchedule as any,
                    false
                )};


                /*
                 * @uiColumnGroup - row111
                 */
                 doorGroupAdd?: any;

                ///////////////////////////////////////////////////////


                /**
                 * @uiLabel - ${this._("w_Permission_DeviceName")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceName")}
                 * @uiColumnGroup - row112
                 * @uiDisabled - ${
                        this.pageStep === EPageStep.add ||
                        this.pageStep === EPageStep.edit
                            ? "false"
                            : "true"
                        }
                */
                 elevatorName?: ${toEnumInterface(
                     this.selectItem.elevatorDevice as any,
                     false
                 )};


                /**
                 * @uiLabel - ${this._("w_Permission_DeviceArea")}
                 * @uiColumnGroup - row112
                * @uiType - ${
                    this.deviceType === EDeviceType.elevator
                        ? "iv-form-string"
                        : "iv-form-label"
                }
                 */
                 elevatorArea?: string;


                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiColumnGroup - row112
                 * @uiDisabled - ${
                        this.pageStep === EPageStep.add ||
                        this.pageStep === EPageStep.edit
                            ? "false"
                            : "true"
                        }
                */
                elevatorTimeFormat?: ${toEnumInterface(
                    this.selectItem.timeSchedule as any,
                    false
                )};


                /*
                 * @uiColumnGroup - row112
                 */
                 elevatorAdd?: any;



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
