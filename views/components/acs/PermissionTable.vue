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
                        v-show="canEdit"
                        :disabled="isSelected.length !== 1"
                        @click="pageToEdit()"
                    />
                    <iv-toolbox-delete
                    v-show="canDelete"
                        :disabled="isSelected.length === 0"
                        @click="doDelete"
                    />
                    <iv-toolbox-divider />
                    <iv-toolbox-add v-show="canAdd"
                    @click="pageToAdd()" />

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
                            <iv-toolbox-edit v-show="canEdit" @click="pageToEdit()" />
                            <iv-toolbox-delete v-show="canDelete" @click="doDelete" />
                        </iv-toolbox-more>
                    </template>

                </iv-table>
            </iv-card>
        </div>

        <!--Site Form (Add and Edit and View)-->
        <div v-show="pageStep === ePageStep.add || pageStep === ePageStep.edit || pageStep === ePageStep.view">
            <iv-auto-card :label="pageStep == ePageStep.add ? _('w_Permission_PermissionAdd') : pageStep == ePageStep.edit ? _('w_Permission_PermissionEdit') :  _('w_Permission_PermissionView')">

                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    ref="subForm"
                    :interface="IForm()"
                    :value="inputFormData"
                    @submit="doSave($event)"
                    @update:deviceType="selectedDeviceType($event)"
                    @update:*="updateInputData($event)"
                >
                    
                    <!-- door -->
                    <template #doorName="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType == eDeviceType.door"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.doorNameOption"
                        ></iv-form-selection>
                    </template>

                    <template #doorArea="{ $attrs, $listeners }">
                        <iv-form-string
                            v-show="deviceType == eDeviceType.door"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.doorAreaOption"
                            :disabled="true"
                        ></iv-form-string>
                    </template>

                    <template #doorTimeFormat="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType == eDeviceType.door"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.deviceTimeFormatOption"
                        ></iv-form-selection>
                    </template>

                    <template #doorAdd="{ $attrs }">
                        <b-button
                            v-show="deviceType == eDeviceType.door"
                            class="h-25 addButton"
                            variant="primary"
                            size="md"
                            @click="clickAddDeviceInTable()"
                        >{{ _('w_Add') }}
                        </b-button>
                    </template>

                    <!-- door Group -->
                    <template #doorGroupName="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType === eDeviceType.doorGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.doorGroupNameOption"
                        ></iv-form-selection>
                    </template>

                    <template #doorGroupArea="{ $attrs, $listeners }">
                        <iv-form-string
                            v-show="deviceType === eDeviceType.doorGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.doorGroupAreaOption"
                            :disabled="true"
                        ></iv-form-string>
                    </template>

                    <template #doorGroupTimeFormat="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType == eDeviceType.doorGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.deviceTimeFormatOption"
                        ></iv-form-selection>
                    </template>

                    <template #doorGroupAdd="{ $attrs }">
                        <b-button
                            v-show="deviceType === eDeviceType.doorGroup"
                            class="h-25 addButton"
                            variant="primary"
                            size="md"
                            @click="clickAddDeviceInTable()"
                        >{{ _('w_Add') }}
                        </b-button>
                    </template>

                    <!-- elevator -->

                    <template #elevatorName="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-if="deviceType === eDeviceType.elevator"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.elevatorNameOption"
                        ></iv-form-selection>
                    </template>

                    <template #elevatorArea="{ $attrs, $listeners }">
                        <iv-form-string
                            v-if="deviceType === eDeviceType.elevator"
                            v-bind="$attrs"
                            v-on="$listeners"
                            :disabled="true"
                            v-model="inputFormData.elevatorAreaOption"
                        ></iv-form-string>
                    </template>

                    <template #elevatorTimeFormat="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType == eDeviceType.elevator"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.deviceTimeFormatOption"
                        ></iv-form-selection>
                    </template>

                    <template #elevatorAdd="{ $attrs }">
                        <b-button
                            v-if="deviceType === eDeviceType.elevator"
                            class="h-25 addButton"
                            variant="primary"
                            size="md"
                            @click="clickAddDeviceInTable()"
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
                            <th v-for="(value, index) in inputFormData.title" v-bind:key="index">{{ value }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(value, index) in inputFormData.data" v-bind:key="index">
                            <td>{{ value.deviceType }}</td>
                            <td>{{ value.deviceName.text }}</td>
                            <td>{{ value.area.text}}</td>
                            <td>{{ value.timeFormat.text }}</td>
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
import Dialog from "@/services/Dialog/Dialog";
import { PermissionName} from '@/../src/constants/permissions';

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
    components: { }
})
export default class PermissionTable extends Vue {
    beforeMount(){
        if(!this.$user || !this.$user.permissions)return;
        this.permissionName = PermissionName.member;
        this.canAdd = this.$user.permissions.find(x=>x.access.C === true && x.of.identifier == this.permissionName) != undefined;
        this.canEdit = this.$user.permissions.find(x=>x.access.U === true && x.of.identifier == this.permissionName) != undefined;
        this.canDelete = this.$user.permissions.find(x=>x.access.D === true && x.of.identifier == this.permissionName) != undefined;        
    }
    canAdd:boolean;
    canEdit:boolean;
    canDelete:boolean;
    permissionName:string;


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
        deviceNameOption: "",
        deviceAreaOption: "",
        deviceTimeFormatOption: "",
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
            id: "",
            permissionName: "",
            deviceType: "door",
            deviceNameOption: "",
            deviceAreaOption: "",
            deviceTimeFormatOption: "",
            data: [] // subTable use
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
        this.clearInputFormData();
        if (this.isSelected[0] == undefined) {
            return false;
        }
        await this.initSelectItem();
        this.selectedDetail = this.isSelected[0];
        this.initInputFormData();
        this.pageStep = EPageStep.edit;
    }

    async pageToView() {
        this.clearInputFormData();
        if (this.isSelected[0] == undefined) {
            return false;
        }
        await this.initSelectItem();
        this.selectedDetail = this.isSelected[0];
        this.initInputFormData();
        this.pageStep = EPageStep.view;
    }

    async initSelectItem() {
        
        this.selectItem.timeSchedule = { "0": this._("w_Select") };
        this.selectItem.doorDevice = { "0": this._("w_Select") };
        this.selectItem.doorGroupDevice = { "0": this._("w_Select") };
        this.selectItem.elevatorDevice = { "0": this._("w_Select") };

        await this.$server
            .R("/acs/timeschedule", {"paging.all":"true"})
            .then((response: any) => {
                if (response != undefined && response.results != undefined) {
                    for (let tempItem of response.results) {
                        if (
                            tempItem.objectId != undefined &&
                            tempItem.timename != undefined &&
                            typeof tempItem.objectId == "string" &&
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
            .R("/acs/door", {"paging.all":"true"})
            .then((response: any) => {
                if (response != undefined && response.results != undefined) {
                    for (let tempItem of response.results) {
                        if (
                            tempItem.objectId != undefined &&
                            tempItem.doorname != undefined &&
                            typeof tempItem.objectId == "string" &&
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
            .R("/acs/doorgroup",  {"paging.all":"true"})
            .then((response: any) => {
                for (let tempItem of response.results) {
                    if (
                        tempItem.objectId != undefined &&
                        tempItem.groupname != undefined &&
                        typeof tempItem.objectId == "string" &&
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
            .R("/acs/elevator",  {"paging.all":"true"})
            .then((response: any) => {
                for (let tempItem of response.results) {
                    if (
                        tempItem.objectId != undefined &&
                        tempItem.elevatorname != undefined &&
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

    async initInputFormData() {
        this.inputFormData.id = this.selectedDetail.objectId;
        this.inputFormData.permissionName = this.selectedDetail.tablename;

        for (const tempAccesslevels of this.selectedDetail.accesslevels) {
            if (tempAccesslevels.objectId == undefined) {
                continue;
            }

            if (tempAccesslevels.type == undefined) {
                continue;
            }

            let deviceData: any = {
                objectId: tempAccesslevels.objectId,
                deviceType: tempAccesslevels.type,
                deviceName: { id: "", text: "" },
                area: { id: "", text: "" },
                timeFormat: { id: "", text: "" }
            };

            if (
                tempAccesslevels.timeschedule != undefined &&
                tempAccesslevels.timeschedule.objectId != undefined &&
                tempAccesslevels.timeschedule.timename != undefined
            ) {
                deviceData.timeFormat.id =
                    tempAccesslevels.timeschedule.objectId;
                deviceData.timeFormat.text =
                    tempAccesslevels.timeschedule.timename;
            }

            switch (tempAccesslevels.type) {
                case EDeviceType.door:
                    if (
                        tempAccesslevels.door != undefined &&
                        tempAccesslevels.door.objectId != undefined
                    ) {
                        deviceData.deviceName.id =
                            tempAccesslevels.door.objectId;
                        for (let key in this.selectItem.doorDevice) {
                            if (key == tempAccesslevels.door.objectId) {
                                deviceData.deviceName.text = this.selectItem.doorDevice[
                                    key
                                ];
                                break;
                            }
                        }
                    }
                    break;
                case EDeviceType.doorGroup:
                    if (
                        tempAccesslevels.doorgroup != undefined &&
                        tempAccesslevels.doorgroup.objectId != undefined
                    ) {
                        deviceData.deviceName.id =
                            tempAccesslevels.doorgroup.objectId;

                        for (let origin of this.selectItemOriginal.doorGroup) {
                            if (
                                origin.objectId != undefined &&
                                origin.objectId == deviceData.deviceName.id
                            ) {
                                if (origin.groupname != undefined) {
                                    deviceData.deviceName.text =
                                        origin.groupname;
                                }
                                if (
                                    origin.area != undefined &&
                                    origin.area.name != undefined
                                ) {
                                    deviceData.area.id = origin.area.name;
                                    deviceData.area.text = origin.area.name;
                                }
                                break;
                            }
                        }
                        for (let key in this.selectItem.doorGroupDevice) {
                            if (key == tempAccesslevels.doorgroup.objectId) {
                                deviceData.deviceName.text = this.selectItem.doorGroupDevice[
                                    key
                                ];
                                break;
                            }
                        }
                    }

                    break;
                case EDeviceType.elevator:
                    if (
                        tempAccesslevels.elevator != undefined &&
                        tempAccesslevels.elevator.objectId != undefined
                    ) {
                        deviceData.deviceName.id =
                            tempAccesslevels.elevator.objectId;
                        for (let key in this.selectItem.elevatorDevice) {
                            if (key == tempAccesslevels.elevator.objectId) {
                                deviceData.deviceName.text = this.selectItem.elevatorDevice[
                                    key
                                ];
                                break;
                            }
                        }
                    }

                    break;
                case EDeviceType.elevatorGroup:
                case EDeviceType.elevatorGroup:
                case EDeviceType.none:
                default:
                    break;
            }
            this.inputFormData.data.push(deviceData);
        }
    }

    selectedItem(data) {
        this.isSelected = data;
    }

    updateInputData(data) {
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
                        this.inputFormData.doorNameOption = key;
                        break;
                    }
                }
                break;

            case "doorTimeFormat":
                for (const key in this.selectItem.timeSchedule) {
                    if (data.value === key) {
                        this.inputFormData.deviceTimeFormatOption = key;
                        break;
                    }
                }
                break;

            // doorGroup
            case "doorGroupName":
                for (const key in this.selectItem.doorGroupDevice) {
                    if (data.value === key) {
                        this.inputFormData.doorGroupNameOption = key;
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
                                this.inputFormData.doorGroupAreaOption =
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
                        this.inputFormData.deviceTimeFormatOption = key;
                        break;
                    }
                }
                break;

            // elevator
            case "elevatorName":
                for (const key in this.selectItem.elevatorDevice) {
                    if (data.value === key) {
                        this.inputFormData.elevatorNameOption = key;
                        break;
                    }
                }
                break;

            case "elevatorTimeFormat":
                for (const key in this.selectItem.timeSchedule) {
                    if (data.value === key) {
                        this.inputFormData.deviceTimeFormatOption = key;
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

    clickAddDeviceInTable() {
        let deviceData: any = {
            objectId: "",
            deviceType: this.inputFormData.deviceType,
            deviceName: { id: "", text: "" },
            area: { id: "", text: "" },
            timeFormat: { id: "", text: "" }
        };

        if (this.inputFormData.deviceTimeFormatOption === "0") {
            return false;
        }

        deviceData.timeFormat.id = this.inputFormData.deviceTimeFormatOption;
        for (let loopKey in this.selectItem.timeSchedule) {
            if (loopKey == deviceData.timeFormat.id) {
                deviceData.timeFormat.text = this.selectItem.timeSchedule[
                    loopKey
                ];
                break;
            }
        }

        switch (this.deviceType) {
            case EDeviceType.door:
                if (this.inputFormData.doorNameOption === "0") {
                    return false;
                }
                deviceData.deviceName.id = this.inputFormData.doorNameOption;
                for (let loopKey in this.selectItem.doorDevice) {
                    if (loopKey == deviceData.deviceName.id) {
                        deviceData.deviceName.text = this.selectItem.doorDevice[
                            loopKey
                        ];
                        break;
                    }
                }

                break;
            case EDeviceType.doorGroup:
                if (this.inputFormData.doorGroupNameOption === "0") {
                    return false;
                }
                deviceData.deviceName.id = this.inputFormData.doorGroupNameOption;
                for (let origin of this.selectItemOriginal.doorGroup) {
                    if (
                        origin.objectId ==
                        this.inputFormData.doorGroupNameOption
                    ) {
                        if (
                            origin.area != undefined &&
                            origin.area.name != undefined
                        ) {
                            deviceData.area.id = origin.area.name;
                            deviceData.area.text = origin.area.name;
                        }
                        break;
                    }
                }
                for (let loopKey in this.selectItem.doorGroupDevice) {
                    if (loopKey == deviceData.deviceName.id) {
                        deviceData.deviceName.text = this.selectItem.doorGroupDevice[
                            loopKey
                        ];
                        break;
                    }
                }
                break;
            case EDeviceType.elevator:
                if (this.inputFormData.elevatorNameOption === "0") {
                    return false;
                }
                deviceData.deviceName.id = this.inputFormData.elevatorNameOption;
                for (let loopKey in this.selectItem.elevatorDevice) {
                    if (loopKey == deviceData.deviceName.id) {
                        deviceData.deviceName.text = this.selectItem.elevatorDevice[
                            loopKey
                        ];
                        break;
                    }
                }
                break;
        }
        this.inputFormData.data.push(deviceData);
        this.clearDeviceSelection();
    }

    clearDeviceSelection() {
        this.inputFormData.deviceTimeFormatOption = "0";
        this.inputFormData.doorNameOption = "0";
        this.inputFormData.doorAreaOption = "";
        this.inputFormData.doorGroupNameOption = "0";
        this.inputFormData.doorGroupAreaOption = "";
        this.inputFormData.elevatorNameOption = "0";
        this.inputFormData.elevatorAreaOption = "";
    }

    async doSubDelete(index) {
        this.inputFormData.data.splice(index, 1);
    }

    async doDelete() {
        await Dialog.confirm(
            this._("w_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                for (const param of this.isSelected) {
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
            if (tempData.objectId != undefined && tempData.objectId != "") {
                premissionParam.accesslevels.push(tempData.objectId);
            } else {
                let accessParam: any = {
                    system: 0, // always is 0
                    levelid: "", // always is empty string
                    levelname: "", // always is empty string
                    status: 1, // always is 1

                    // need update
                    timeschedule: tempData.timeFormat.id, // timeschedule
                    type: tempData.deviceType, // for frontend use
                    reader: [] // to door, doorGroup, elevator ogigin find reader
                };

                if (accessParam.timeschedule == "") {
                    console.log("!!! accessParam.timeschedule not find");
                    continue;
                }

                switch (tempData.deviceType) {
                    case EDeviceType.door:
                        accessParam.door = tempData.deviceName.id;
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
                        accessParam.doorgroup = tempData.deviceName.id;
                        for (let doorGroup of this.selectItemOriginal
                            .doorGroup) {
                            if (
                                doorGroup.objectId != undefined &&
                                doorGroup.objectId == accessParam.doorgroup
                            ) {
                                if (doorGroup.doors != undefined) {
                                    for (let door of doorGroup.doors) {
                                        if (door.readerin != undefined) {
                                            for (let reader of door.readerin) {
                                                if (
                                                    reader.objectId != undefined
                                                ) {
                                                    accessParam.reader.push(
                                                        reader.objectId
                                                    );
                                                }
                                            }
                                        }
                                        if (door.readerout != undefined) {
                                            for (let reader of door.readerout) {
                                                if (
                                                    reader.objectId != undefined
                                                ) {
                                                    accessParam.reader.push(
                                                        reader.objectId
                                                    );
                                                }
                                            }
                                        }
                                    }
                                }
                                break;
                            }
                        }
                        break;

                    case EDeviceType.elevator:
                        accessParam.elevator = tempData.deviceName.id;
                        for (let elevator of this.selectItemOriginal.elevator) {
                            if (
                                elevator.objectId != undefined &&
                                elevator.elevatorid != undefined &&
                                elevator.objectId == accessParam.elevator
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
                            premissionParam.accesslevels.push(
                                response.objectId
                            );
                        }
                    })
                    .catch((e: any) => {
                        console.log(e);
                    });
            }
        }

        if (this.inputFormData.id !=undefined && this.inputFormData.id  != "") {
            premissionParam.objectId = this.inputFormData.id;
              await this.$server
            .U("/acs/permissiontable", premissionParam)
            .then((response: any) => {
                this.pageToList();
            })
            .catch((e: any) => {
                console.log(e);
            });
        } else {
            await this.$server
            .C("/acs/permissiontable", premissionParam)
            .then((response: any) => {
                this.pageToList();
            })
            .catch((e: any) => {
                console.log(e);
            });
        }


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
                * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
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
                * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
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
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
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
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
                */
                doorTimeFormat?: ${toEnumInterface(
                    this.selectItem.timeSchedule as any,
                    false
                )};


                /*
                 * @uiColumnGroup - row11
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
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
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
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
               * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
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
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
                */
                doorGroupTimeFormat?: ${toEnumInterface(
                    this.selectItem.timeSchedule as any,
                    false
                )};


                /*
                 * @uiColumnGroup - row111
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
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
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
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
                * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
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
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
                */
                elevatorTimeFormat?: ${toEnumInterface(
                    this.selectItem.timeSchedule as any,
                    false
                )};


                /*
                 * @uiColumnGroup - row112
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
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
