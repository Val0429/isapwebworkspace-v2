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

                    <template #elevatorTimeFormat="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType == eDeviceType.elevator"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.deviceTimeFormatOption"
                        ></iv-form-selection>
                    </template>
                    <template #elevatorArea="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-if="deviceType === eDeviceType.elevator"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.elevatorAreaOption"
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
                    <!-- floor group -->
                    <template #floorGroupName="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-if="deviceType === eDeviceType.floorGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.floorGroupNameOption"
                        ></iv-form-selection>
                    </template>
                    <template #floorGroupTimeFormat="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType == eDeviceType.floorGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.deviceTimeFormatOption"
                        ></iv-form-selection>
                    </template>
                    <template #floorGroupArea="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-if="deviceType === eDeviceType.floorGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.floorGroupAreaOption"
                        ></iv-form-selection>
                    </template>

                    <template #floorGroupAdd="{ $attrs }">
                        <b-button
                            v-if="deviceType === eDeviceType.floorGroup"
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
import { Component, Vue, Watch } from "vue-property-decorator";
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
    floorGroup = "floorGroup"
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
    floorGroupDevice: any;
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
    inputFormData:any={};
    defaultFormData: any = {
        id: "",
        permissionName: "",
        deviceType: "door",
        deviceNameOption: "",
        deviceAreaOption: "",
        deviceTimeFormatOption: "",
        data: [] // subTable use
    };
    SearchParams: any = {system:0};

    //options
    deviceNameItem: any = {};
    deviceAreaItem: any = {};
    deviceTimeFromatItem: any = {};
    showdeviceTimeFromatItem: any = {};
    deviceTypeItem: any = {
        door: EDeviceType.door,
        doorGroup: EDeviceType.doorGroup,
        elevator: EDeviceType.elevator,
        floorGroup: EDeviceType.floorGroup
    };

    selectItemOriginal: any = {
        timeSchedule: [],
        door: [],
        doorGroup: [],
        elevator: [],
        floorGroup: []
    };
    selectItem: ISelectItem = {
        timeSchedule: [],
        doorDevice: [],
        doorGroupDevice: [],
        elevatorDevice: [],
        floorGroupDevice: []
    };

    created() {}

    mounted() {
        this.pageToList();
    }

    searchTable(datas) {
        this.SearchParams = {};
        for (var i in datas) {
            this.SearchParams = {
                name: datas.permissionName,
                system:0
            };
        }
    }

    clearInputFormData() {
        this.inputFormData = Object.assign({
            title: [
                this._("w_DeviceType"),
                this._("w_DeviceName"),
                this._("w_Floor"),
                this._("w_TimeFormat"),
                this._("w_Action")
            ]}, this.defaultFormData
        );
        this.inputFormData.data=[];
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
        this.selectItem.floorGroupDevice = { "0": this._("w_Select") };

        await Promise.all([
            this.getTimeSchedule(),
            this.getDoor(),
            this.getDoorGroup(),
            this.getElevator(),
            this.getFloorGroup()
        ]);
    }
private async getFloorGroup() {
    await this.$server
      .R("/acs/floorgroup" as any,{ "paging.all": "true" })
      .then((response: any) => {
        for(let tempItem of response.results) {
          this.selectItem.floorGroupDevice[tempItem.objectId]=tempItem.groupname;
          this.selectItemOriginal.floorGroup.push(tempItem);
        }
      });
  }
  private async getElevator() {
    await this.$server
      .R("/acs/elevator",{ "paging.all": "true" })
      .then((response: any) => {
        for(let tempItem of response.results) {
          this.selectItem.elevatorDevice[tempItem.objectId]=tempItem.elevatorname;
          this.selectItemOriginal.elevator.push(tempItem);
        }
      });
  }

  private async getDoorGroup() {
    await this.$server
      .R("/acs/doorgroup",{ "paging.all": "true" })
      .then((response: any) => {
        for(let tempItem of response.results) {
          this.selectItem.doorGroupDevice[tempItem.objectId]=tempItem.groupname;
          this.selectItemOriginal.doorGroup.push(tempItem);
        }
      });
  }

  private async getDoor() {
    await this.$server
      .R("/acs/door",{ "paging.all": "true" })
      .then((response: any) => {
        for(let tempItem of response.results) {
          this.selectItem.doorDevice[tempItem.objectId]=tempItem.doorname;
          this.selectItemOriginal.door.push(tempItem);
        }
      });
  }

  private async getTimeSchedule() {
    await this.$server
      .R("/acs/timeschedule",{ "paging.all": "true" })
      .then((response: any) => {
        for(let tempItem of response.results) {
          this.selectItem.timeSchedule[tempItem.objectId]=tempItem.timename;
          this.selectItemOriginal.timeSchedule.push(tempItem);
        }
      });
  }

    async initInputFormData() {
        this.inputFormData.id = this.selectedDetail.objectId;
        this.inputFormData.permissionName = this.selectedDetail.tablename;
        if(!this.selectedDetail.accesslevels)return;
        for (const tempAccesslevels of this.selectedDetail.accesslevels) {
            
            if (!tempAccesslevels.type) continue;

            let deviceData: any = {
                objectId: tempAccesslevels.objectId,
                deviceType: tempAccesslevels.type,
                deviceName: { id: "", text: "" },
                area: { id: "", text: "" },
                timeFormat: { id: "", text: "" }
            };

            if (tempAccesslevels.timeschedule ) {
                deviceData.timeFormat.id = tempAccesslevels.timeschedule.objectId;
                deviceData.timeFormat.text = tempAccesslevels.timeschedule.timename;
            }
            let origin:any;
            switch (tempAccesslevels.type) {
                case EDeviceType.door:
                    if (!tempAccesslevels.door) break;
                    deviceData.deviceName.id = tempAccesslevels.door.objectId;
                    origin = this.selectItemOriginal.door.find(x=>x.objectId == deviceData.deviceName.id);    
                    //skip orphan door
                    if(!origin)continue;
                    deviceData.deviceName.text = origin.doorname;
                    break;
                case EDeviceType.doorGroup:
                    if (!tempAccesslevels.doorgroup) break;
                    deviceData.deviceName.id = tempAccesslevels.doorgroup.objectId;
                    origin = this.selectItemOriginal.doorGroup.find(x=>x.objectId == deviceData.deviceName.id);                        
                    //skip orphan door group
                    if (!origin) continue;
                    deviceData.deviceName.text = origin.groupname;                                
                    if(!origin.area )break
                    //deviceData.area.id = origin.area.name;
                    //deviceData.area.text = origin.area.name;
                    break;
                case EDeviceType.elevator:
                    console.log("tempAccesslevels", tempAccesslevels);
                    if (!tempAccesslevels.elevator) break;
                    deviceData.deviceName.id = tempAccesslevels.elevator.objectId;
                    origin = this.selectItemOriginal.elevator.find(x=>x.objectId == deviceData.deviceName.id);                        
                    //skip orphan elevator
                    if (!origin) continue;                    
                    deviceData.deviceName.text = origin.elevatorname;                    
                    if(!origin.reader || !tempAccesslevels.floor || tempAccesslevels.floor.length<=0) break;                    
                    let floor = origin.reader.find(x=>x.objectId == tempAccesslevels.floor[0].objectId);                    
                    if(!floor)break;
                    deviceData.area.id = floor.floorname;
                    deviceData.area.text = floor.floorname;
                    break;
                case EDeviceType.floorGroup:
                    if (!tempAccesslevels.elevatorgroup) break;
                    deviceData.deviceName.id = tempAccesslevels.elevatorgroup.objectId;
                    origin = this.selectItemOriginal.floorGroup.find(x=>x.objectId == deviceData.deviceName.id);                        
                    //skip orphan door group
                    if (!origin) continue;
                    deviceData.deviceName.text = origin.groupname;                                
                    if(!origin.area )break
                    //deviceData.area.id = origin.area.name;
                    //deviceData.area.text = origin.area.name;
                    break;
                    break;
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
    floorGroupOptions:any={};
    floorOptions:any={};
    updateInputData(data) {
        switch (data.key) {
            case "permissionName":
                this.inputFormData.permissionName = data.value;
                break;

            case "deviceType":
                this.inputFormData.deviceType = data.value;
                break;

            // door
            case "doorName": this.inputFormData.doorNameOption = data.value;                        
                break;
            // doorGroup
            case "doorGroupName": this.inputFormData.doorGroupNameOption = data.value;
                let dg = this.selectItemOriginal.doorGroup.find(x=>x.objectId == data.value);
                if (dg && dg.area) {
                    this.inputFormData.doorGroupAreaOption = dg.area.name;
                }
                break;
            case "floorGroupName": 
                console.log("floorGroupName changed",data);
                this.inputFormData.floorGroupNameOption = data.value;                
                break;
            
            // elevator
            case "elevatorName":
                console.log("elevatorName changed",data);
                this.floorOptions={};
                let elevator = this.selectItemOriginal.elevator.find(x=>x.objectId == data.value);                
                if(elevator&&elevator.reader){
                    for(let floor of elevator.reader){
                        this.floorOptions[floor.objectId]=floor.floorname;
                    }
                }else{
                    this.inputFormData.elevatorAreaOption="";
                }                
                this.inputFormData.elevatorNameOption = data.value;                        
                break;            
            case "elevatorArea":
                console.log("elevatorArea changed",data);
                this.inputFormData.elevatorAreaOption = data.value;                
                break;
            case "floorGroupArea":
                console.log("floorGroupArea changed",data);
                this.inputFormData.floorGroupAreaOption = data.value;                
                break;
            case "doorTimeFormat": 
            case "elevatorTimeFormat":
            case "floorGroupTimeFormat":                    
            case "doorGroupTimeFormat":   
                this.inputFormData.deviceTimeFormatOption = data.value;
                break;

        }
    }

    selectedDeviceType(data) {
        this.deviceType = data;
        this.inputFormData.data.deviceType = data;
    }
    
    clickAddDeviceInTable() {
        console.log("this.inputFormData", this.inputFormData);
        let deviceData: any = {
            objectId: "",
            deviceType: this.inputFormData.deviceType,
            deviceName: { id: "", text: "" },
            area: { id: "", text: "" },
            timeFormat: { id: "", text: "" }
        };

        if (!this.inputFormData.deviceTimeFormatOption || this.inputFormData.deviceTimeFormatOption === "0") {
            return false;
        }

        deviceData.timeFormat.id = this.inputFormData.deviceTimeFormatOption;
        deviceData.timeFormat.text = this.selectItem.timeSchedule[deviceData.timeFormat.id];

        switch (this.deviceType) {
            case EDeviceType.door:
                if (this.inputFormData.doorNameOption === "0") break;
                deviceData.deviceName.id = this.inputFormData.doorNameOption;
                deviceData.deviceName.text = this.selectItem.doorDevice[deviceData.deviceName.id];
                break;
            case EDeviceType.doorGroup:
                if (this.inputFormData.doorGroupNameOption === "0") break;
                deviceData.deviceName.id = this.inputFormData.doorGroupNameOption;
                let doorgroup = this.selectItemOriginal.doorGroup.find(x=>x.objectId == deviceData.deviceName.id );                
                if (doorgroup && doorgroup.area) {
                    // deviceData.area.id = doorgroup.area.name;
                    // deviceData.area.text = doorgroup.area.name;
                }                      
                deviceData.deviceName.text = this.selectItem.doorGroupDevice[deviceData.deviceName.id];
                break;
            case EDeviceType.elevator:
                if (this.inputFormData.elevatorNameOption === "0") break;
                deviceData.deviceName.id = this.inputFormData.elevatorNameOption;
                if(this.inputFormData.elevatorAreaOption){
                    let elevator = this.selectItemOriginal.elevator.find(x=>x.objectId == deviceData.deviceName.id );    
                    console.log("elevator", elevator);
                    if(elevator&&elevator.reader){
                        deviceData.area.id = this.inputFormData.elevatorAreaOption;
                        let floor = elevator.reader.find(x=>x.objectId == deviceData.area.id);
                        if(floor)deviceData.area.text=floor.floorname;
                    }                    
                }       
                deviceData.deviceName.text = this.selectItem.elevatorDevice[deviceData.deviceName.id];
                break;
            case EDeviceType.floorGroup:
                if (this.inputFormData.floorGroupNameOption === "0") break;
                deviceData.deviceName.id = this.inputFormData.floorGroupNameOption; 
                deviceData.deviceName.text = this.selectItem.elevatorDevice[deviceData.deviceName.id];
                if (this.inputFormData.floorGroupAreaOption === "0") break;
                deviceData.area.id = this.inputFormData.floorGroupAreaOption;
                deviceData.area.text = this.selectItem.floorGroupDevice[deviceData.area.id];
                
                break;
            }
        console.log("push device data", deviceData);
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
        this.inputFormData.elevatorAreaOption = "0";
        this.inputFormData.floorGroupAreaOption = "0";
        this.inputFormData.floorGroupNameOption = "0";
    }

    async doSubDelete(index) {
        this.inputFormData.data.splice(index, 1);
    }

    async doDelete() {
        await Dialog.confirm(
            this._("w_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            async () => {
                let promises=[];
                for (const param of this.isSelected) {
                    promises.push(this.$server.D("/acs/permissiontable", { objectId: param.objectId }));
                }
                await Promise.all(promises);
                this.pageToList();
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
            console.log("tempData", tempData);
            if (tempData.objectId && tempData.objectId != "") {
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
                        let door = this.selectItemOriginal.door.find(x=>x.objectId==accessParam.door);                            
                        if (!door)break;
                        if(door.readerin) {
                            for (let reader of door.readerin) {
                                accessParam.reader.push(reader.objectId);
                            }
                        }
                        if (door.readerout) {
                            for (let reader of door.readerout) {                                
                                accessParam.reader.push(reader.objectId);
                            }
                        }                                              
                        break;
                    case EDeviceType.doorGroup:
                        accessParam.doorgroup = tempData.deviceName.id;
                        let doorGroup = this.selectItemOriginal.doorGroup.find(x=>x.objectId == accessParam.doorgroup);
                        if(!doorGroup || !doorGroup.doors)break;
                        for (let door of doorGroup.doors) {
                            if (door.readerin) {
                                for (let reader of door.readerin) {
                                    accessParam.reader.push(reader.objectId);                                    
                                }
                            }
                            if (door.readerout) {
                                for (let reader of door.readerout) {                                    
                                    accessParam.reader.push(reader.objectId);
                                }
                            }
                        }
                        break;

                    case EDeviceType.elevator:
                        accessParam.elevator = tempData.deviceName.id;
                        if(tempData.area){
                            accessParam.floor=[tempData.area.id];
                        }
                        break;

                    case EDeviceType.floorGroup:
                        accessParam.elevator = tempData.deviceName.id;
                        if(tempData.area){
                            accessParam.floorgroup=tempData.area.id;
                            let floorgroup = this.selectItemOriginal.floorGroup.find(x=>x.objectId ==accessParam.floorgroup);
                            if(floorgroup && floorgroup.floors){
                                accessParam.floor = floorgroup.floors.map(x=>x.objectId);
                            }
                        }
                    case EDeviceType.none:
                    default:
                        break;
                }
                
                await this.$server
                    .C("/acs/accesslevel", accessParam)
                    .then((response: any) => {                        
                            premissionParam.accesslevels.push(response.objectId);
                    });
            }
        }

        if (this.inputFormData.id && this.inputFormData.id  != "") {
            premissionParam.objectId = this.inputFormData.id;
              await this.$server
            .U("/acs/permissiontable", premissionParam)
            .then((response: any) => {
                this.checkError(response);
            });
        } else {
            await this.$server
            .C("/acs/permissiontable", premissionParam)
            .then((response: any) => {
                this.checkError(response);
                
            });
        }


    }

  private checkError(response: any) {
    if(!response.errors||response.errors.length<=0){
        this.pageToList();
        return;
    };
    
    if(response.errors.find(x=>x.type=="accessLevelIsNotInCCure")){
        let messages = `<table class="table"><tr><th>${this._("w_Device")}</th><th>${this._("w_TimeSchedule")}</th><th></th></tr><tr>`;
        for(let error of response.errors.filter(x=>x.type=="accessLevelIsNotInCCure")){
            messages+=`<tr><td>${error.devicename || ""}</td><td>${error.timename  ||""}</td><td>${error.message || ""}</td></tr>`;
        }
        messages+="</tr></table>"
        Dialog.error(this._("w_Error_AccessLevelIsNotInCCure")+"<br/>"+messages);
               
    }else if(response.errors.find(x=>x.type=="clearanceIsNotInCCure")){
        let messages = ``;
        for(let permTable of response.permTableNames){
            messages+=`${this._("w_PermissionTable")}: ${permTable.permissionTableName || ""}<br/>`;
            messages+=`<table class="table"><tr><th>${this._("w_Device")}</th><th>${this._("w_TimeSchedule")}</th><th></th></tr><tr>`;             
            for(let dev of permTable.devices){                
                messages+=`<tr><td>${dev.devicename || ""}</td><td>${dev.timename  ||""}</td><td>${dev.message || ""}</td></tr>`;
            }
             messages+="</tr></table>"
        }
       
        Dialog.error(this._("w_Error_AccessLevelIsNotInCCure")+"<br/>"+messages);
    }else{
        this.pageToList();
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
                /**
                 * @uiLabel - ${this._("w_Action")}
                 */
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
                 * @uiHidden - true
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
               * @uiHidden - true
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
                 * @uiLabel - ${this._("w_Elevator")}
                 * @uiPlaceHolder - ${this._("w_Elevator")}
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
                 * @uiLabel - ${this._("w_Floor")}
                 * @uiColumnGroup - row112
                * @uiHidden - ${this.pageStep === EPageStep.view ? "true" : "false"}
                */
                 elevatorArea?:  ${toEnumInterface(this.floorOptions, false)};


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
                 ///////////////////////

                 /**
                 * @uiLabel - ${this._("w_Elevator")}
                 * @uiPlaceHolder - ${this._("w_Elevator")}
                 * @uiColumnGroup - row113
                 * @uiDisabled - ${
                     this.pageStep === EPageStep.add ||
                     this.pageStep === EPageStep.edit
                         ? "false"
                         : "true"
                 }
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
                */
                 floorGroupName?: ${toEnumInterface(
                     this.selectItem.elevatorDevice as any,
                     false
                 )};


                /**
                 * @uiLabel - ${this._("w_FloorGroup")}
                 * @uiColumnGroup - row113
                * @uiHidden - ${this.pageStep === EPageStep.view ? "true" : "false"}
                */
                 floorGroupArea?:  ${toEnumInterface(this.selectItem.floorGroupDevice , false)};


                 /**
                 * @uiLabel - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiColumnGroup - row113
                 * @uiDisabled - ${
                     this.pageStep === EPageStep.add ||
                     this.pageStep === EPageStep.edit
                         ? "false"
                         : "true"
                 }
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
                */
                floorGroupTimeFormat?: ${toEnumInterface(
                    this.selectItem.timeSchedule as any,
                    false
                )};


                /*
                 * @uiColumnGroup - row113
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
                */
                 floorGroupAdd?: any;

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

                /**
                 * @uiLabel - ${this._("w_Action")}
                 */
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
