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

enum EDeviceType {
    none = "none",
    door = "door",
    doorGroup = "doorGroup",
    evelator = "evelator",
    evelatorGroup = "evelatorGroup"
}

interface ISelectOption {
    value: string;
    text: string;
}

interface ISelectItem {
    timeSchedule: ISelectOption[];
    doorDevice: ISelectOption[];
    doorGroupDevice: ISelectOption[];
    evelatorDevice: ISelectOption[];
    evelatorGruopDevice: ISelectOption[];
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
    devoceTypeItem: any = {
        door: "door",
        doorGroup: "doorGroup",
        elevator: "elevator"
    };
    selected = "door";

    // Morris
    selectItemOriginal: any = {
        timeSchedule: [],
        door: [],
        doorGroup: [],
        evelator: [],
        evelatorGruop: []
    };
    selectItem: ISelectItem = {
        timeSchedule: [],
        doorDevice: [],
        doorGroupDevice: [],
        evelatorDevice: [],
        evelatorGruopDevice: []
    };
    selectAera: any = {
        door: "",
        doorGroup: "",
        evelator: "",
        evelatorGroup: ""
    };
    // Morris

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
            deviceName: "",
            deviceArea: "",
            deviceTimeFormat: "",
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
        this.selected = "door";
        this.selectedDeviceType(0);
        (this.$refs.mainTable as any).reload();
        this.pageStep = EPageStep.list;
    }

    pageToAdd() {
        this.clearInputFormData();
        this.initSelectItem();
        this.pageStep = EPageStep.add;
    }

    pageToEdit() {
        this.initSelectItem();
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

        this.selectItem.timeSchedule = [];
        this.selectItem.doorDevice = [];
        this.selectItem.doorGroupDevice = [];
        this.selectItem.evelatorDevice = [];

        await this.$server
            .R("/acs/timeschedule", param)
            .then((response: any) => {
                if (response != undefined && response.results != undefined) {
                    for (let tempItem of response.results) {
                        if (
                            tempItem.timeid != undefined &&
                            tempItem.timename != undefined
                        ) {
                            let tempOption: ISelectOption = {
                                value: tempItem.timeid,
                                text: tempItem.timename
                            };
                            this.selectItem.timeSchedule.push(tempOption);
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
                            let tempOption: ISelectOption = {
                                value: tempItem.doorid,
                                text: tempItem.doorname
                            };
                            this.selectItem.doorDevice.push(tempOption);
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
                        let tempOption: ISelectOption = {
                            value: tempItem.groupid,
                            text: tempItem.groupname
                        };
                        this.selectItem.doorGroupDevice.push(tempOption);
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
                        let tempOption: ISelectOption = {
                            value: tempItem.elevatorid,
                            text: tempItem.elevatorname
                        };
                        this.selectItem.evelatorDevice.push(tempOption);
                        this.selectItemOriginal.evelator.push(tempItem);
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
    }

    // TODO: change v-show for device type
    selectedDeviceType(data) {
        this.selected = this.devoceTypeItem[data];
        this.inputFormData.data.deviceType = data;
        switch (this.selected) {
            case "door":
                break;
            case "doorGroup":
                break;
            case "elevator":
                break;
            case "elevatorGroup":
            case "none":
            default:
                break;
        }
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

    doSave() {
        // for create accesslevels
        // create premissionTable
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
