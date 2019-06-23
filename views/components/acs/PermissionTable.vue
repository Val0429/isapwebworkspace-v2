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
                        ></iv-form-selection>
                    </template>

                    <template #doorArea="{ $attrs, $listeners }">
                        <iv-form-string
                            v-show="deviceType == eDeviceType.door"
                            v-bind="$attrs"
                            v-on="$listeners"
                            :disabled="true"
                        ></iv-form-string>
                    </template>

                    <template #doorTimeFormat="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType == eDeviceType.door"
                            v-bind="$attrs"
                            v-on="$listeners"
                        ></iv-form-selection>
                    </template>

                    <template #doorAdd="{ $attrs }">

                        <b-button
                            v-show="deviceType == eDeviceType.door"
                            class="h-25 addButton"
                            variant="primary"
                            size="md"
                            @click="pageToAddDeviceInTable()"
                        >{{ _('w_Permission_DoorAdd') }}
                        </b-button>
                    </template>

                    <!-- door Group -->
                    <template #doorGroupName="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType === eDeviceType.doorGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                        ></iv-form-selection>
                    </template>

                    <template #doorGroupArea="{ $attrs, $listeners }">
                        <iv-form-string
                            v-show="deviceType === eDeviceType.doorGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                            :disabled="true"
                        ></iv-form-string>
                    </template>

                    <template #doorGroupTimeFormat="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType == eDeviceType.doorGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                        ></iv-form-selection>
                    </template>

                    <template #doorGroupAdd="{ $attrs }">
                        <b-button
                            v-show="deviceType === eDeviceType.doorGroup"
                            class="h-25 addButton"
                            variant="primary"
                            size="md"
                            @click="pageToAddDeviceInTable()"
                        >{{ _('w_Permission_DoorGroupAdd') }}
                        </b-button>
                    </template>

                    <!-- elevator -->

                    <template #elevatorName="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-if="deviceType === eDeviceType.elevator"
                            v-bind="$attrs"
                            v-on="$listeners"
                        ></iv-form-selection>
                    </template>

                    <template #elevatorArea="{ $attrs, $listeners }">
                        <iv-form-string
                            v-if="deviceType === eDeviceType.elevator"
                            v-bind="$attrs"
                            v-on="$listeners"
                            :disabled="true"
                        ></iv-form-string>
                    </template>

                    <template #elevatorTimeFormat="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType == eDeviceType.elevator"
                            v-bind="$attrs"
                            v-on="$listeners"
                        ></iv-form-selection>
                    </template>

                    <template #elevatorAdd="{ $attrs }">
                        <b-button
                            v-if="deviceType === eDeviceType.elevator"
                            class="h-25 addButton"
                            variant="primary"
                            size="md"
                            @click="pageToAddDeviceInTable()"
                        >{{ _('w_Permission_ElevatorAdd') }}
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
    deviceType: EDeviceType;

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
            doorTimeFormat: "",
            doorGroupName: "",
            doorGroupArea: "",
            doorGroupTimeFormat: "",
            elevatorName: "",
            elevatorArea: "",
            elevatorTimeFormat: "",
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
        this.deviceType = EDeviceType.door;
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
    }

    async initSelectItem() {
        let param = {
            paging: {
                page: 1,
                pageSize: 10000
            }
        };

        this.selectItem.timeSchedule = {};
        this.selectItem.doorDevice = {};
        this.selectItem.doorGroupDevice = {};
        this.selectItem.elevatorDevice = {};

        await this.$server
            .R("/acs/timeschedule", param)
            .then((response: any) => {
                if (response != undefined && response.results != undefined) {
                    for (let tempItem of response.results) {
                        if (
                            tempItem.timeid != undefined &&
                            tempItem.timename != undefined
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
                            tempItem.doorid != undefined &&
                            tempItem.doorname != undefined
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
                        tempItem.groupid != undefined &&
                        tempItem.groupname != undefined
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
                        tempItem.elevatorid != undefined &&
                        tempItem.elevatorname != undefined
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
        this.inputFormData.id = data.objectId;
        this.inputFormData.permissionName = data.tablename;
        this.inputFormData.accesslevelIds = data.accesslevels;
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
        switch (data.key) {
            case "deviceType":
                this.inputFormData.deviceType = data.value;
                break;

            // door
            case "doorName":
                for (const key in this.selectItem.doorDevice) {
                    if (data.value === key) {
                        this.inputFormData.doorName = this.selectItem.doorDevice[
                            key
                        ];
                    }
                }
                break;
            case "doorArea":
                this.inputFormData.doorArea = data.value;
                break;
            case "doorTimeFormat":
                for (const key in this.selectItem.timeSchedule) {
                    if (data.value === key) {
                        this.inputFormData.doorTimeFormat = this.selectItem.timeSchedule[
                            key
                        ];
                    }
                }
                break;

            // doorGroup
            case "doorGroupName":
                for (const key in this.selectItem.doorGroupDevice) {
                    if (data.value === key) {
                        this.inputFormData.doorGroupName = this.selectItem.doorGroupDevice[
                            key
                        ];
                    }
                }
                break;
            case "doorGroupArea":
                this.inputFormData.doorGroupArea = data.value;
                break;
            case "doorGroupTimeFormat":
                for (const key in this.selectItem.timeSchedule) {
                    if (data.value === key) {
                        this.inputFormData.doorGroupTimeFormat = this.selectItem.timeSchedule[
                            key
                        ];
                    }
                }
                break;

            // elevator
            case "elevatorName":
                for (const key in this.selectItem.elevatorDevice) {
                    if (data.value === key) {
                        this.inputFormData.elevatorName = this.selectItem.doorGroupDevice[
                            key
                        ];
                    }
                }
                break;
            case "elevatorArea":
                this.inputFormData.elevatorArea = data.value;
                break;
            case "elevatorTimeFormat":
                for (const key in this.selectItem.timeSchedule) {
                    if (data.value === key) {
                        this.inputFormData.elevatorTimeFormat = this.selectItem.timeSchedule[
                            key
                        ];
                    }
                }
                break;
        }
    }

    selectedDeviceType(data) {
        this.deviceType = data;
        console.log("this.deviceType - ", this.deviceType);
        this.inputFormData.data.deviceType = data;
    }

    pageToAddDeviceInTable() {
        switch (this.deviceType) {
            case EDeviceType.door:
                const doorData: any = {
                    deviceType: this.inputFormData.deviceType,
                    deviceName: this.inputFormData.doorName,
                    deviceArea: this.inputFormData.doorArea,
                    deviceTimeFormat: this.inputFormData.doorTimeFormat
                };
                this.inputFormData.data.push(doorData);
                break;
            case EDeviceType.doorGroup:
                const doorGroupData: any = {
                    deviceType: this.inputFormData.deviceType,
                    deviceName: this.inputFormData.doorGroupName,
                    deviceArea: this.inputFormData.doorGroupArea,
                    deviceTimeFormat: this.inputFormData.doorGroupTimeFormat
                };
                this.inputFormData.data.push(doorGroupData);
                break;
            case EDeviceType.elevator:
                const elevatorData: any = {
                    deviceType: this.inputFormData.deviceType,
                    deviceName: this.inputFormData.elevatorName,
                    deviceArea: this.inputFormData.elevatorArea,
                    deviceTimeFormat: this.inputFormData.elevatorTimeFormat
                };
                this.inputFormData.data.push(doorGroupData);
                break;
        }

        (this.$refs.subForm as any).set("doorAdd", true);
        (this.$refs.subForm as any).set("doorGroupAdd", true);
        (this.$refs.subForm as any).set("elevatorAdd", true);
    }

    async doSubDelete(data) {
        // TODO: remove from data list
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

            // TODO: need update
            tablename: "",
            accesslevels: []
        };

        for (let tempData of this.inputFormData.data) {
            let accessParam: any = {
                system: 0, // always is 0
                levelid: "", // always is empty string
                levelname: "", // always is empty string
                status: 1, // always is 1

                // TODO: need update
                timeschedule: "", // timeschedule
                type: this.deviceType, // for frontend use
                reader: [] // to door, doorGroup, elevator ogigin find reader
            };

            switch (this.deviceType) {
                case EDeviceType.door:
                    // TODO: get door id
                    accessParam.door = "";
                    for (let door of this.selectItemOriginal.door) {
                        if (
                            door.doorid != undefined &&
                            door.doorid == accessParam.door
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
                        }
                    }
                    break;
                case EDeviceType.doorGroup:
                    // TODO: get door group id
                    accessParam.doorGroup = "";
                    for (let doorGroup of this.selectItemOriginal.doorGroup) {
                        if (
                            doorGroup.groupid != undefined &&
                            doorGroup.groupid == accessParam.doorGroup
                        ) {
                            if (doorGroup.readerin != undefined) {
                                for (let reader of doorGroup.readerin) {
                                    if (reader.objectId != undefined) {
                                        accessParam.reader.push(
                                            reader.objectId
                                        );
                                    }
                                }
                            }
                            if (doorGroup.readerout != undefined) {
                                for (let reader of doorGroup.readerout) {
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
                case EDeviceType.elevator:
                    // TODO: get elevator id
                    accessParam.elevator = "";
                    for (let elevator of this.selectItemOriginal.elevator) {
                        if (
                            elevator.elevatorid != undefined &&
                            elevator.elevatorid == accessParam.elevator
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
                    if (response != undefined && response.objectId != undefined) {
                        // TODO: push response id
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

    /*
    selectItem
        timeSchedule: ISelectOption[];
    doorDevice: ISelectOption[];
    doorGroupDevice: ISelectOption[];
    elevatorDevice: ISelectOption[];
    elevatorGroupDevice: ISelectOption[];
    * */

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
                 * @uiLabel - ${this._("w_Permission_DeviceType")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceType")}
                 * @uiColumnGroup - row15
                 */
                 deviceType?: ${toEnumInterface(
                     this.deviceTypeItem as any,
                     false
                 )};

                 ///////////////////////////////////////////////////////


                 /**
                 * @uiLabel - ${this._("w_Permission_Door")}
                 * @uiPlaceHolder - ${this._("w_Permission_Door")}
                 * @uiColumnGroup - row11
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
                         ? "iv-form-selection"
                         : "iv-form-label"
                 }
                */
                 doorArea?: string;



                /**
                 * @uiLabel - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiColumnGroup - row11
                */
                doorTimeFormat?: ${toEnumInterface(
                    this.selectItem.timeSchedule as any,
                    false
                )};


                /*
                 * @uiColumnGroup - row11
                */
                 doorAdd: any;


                ///////////////////////////////////////////////////////


                 /**
                 * @uiLabel - ${this._("w_Permission_DoorGroup")}
                 * @uiPlaceHolder - ${this._("w_Permission_DoorGroup")}
                 * @uiColumnGroup - row111
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
                        ? "iv-form-selection"
                        : "iv-form-label"
                }
                 */
                 doorGroupArea?: string;


                /**
                 * @uiLabel - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiColumnGroup - row111
                 */
                doorGroupTimeFormat?: ${toEnumInterface(
                    this.selectItem.timeSchedule as any,
                    false
                )};


                /*
                 * @uiColumnGroup - row111
                 */
                 doorGroupAdd: any;

                ///////////////////////////////////////////////////////


                /**
                 * @uiLabel - ${this._("w_Permission_Elevator")}
                 * @uiPlaceHolder - ${this._("w_Permission_Elevator")}
                 * @uiColumnGroup - row112

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
                        ? "iv-form-selection"
                        : "iv-form-label"
                }
                 */
                 elevatorArea?: string;


                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiColumnGroup - row112
                 */
                elevatorTimeFormat?: ${toEnumInterface(
                    this.selectItem.timeSchedule as any,
                    false
                )};


                /*
                 * @uiColumnGroup - row112
                 */
                 elevatorAdd: any;



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
