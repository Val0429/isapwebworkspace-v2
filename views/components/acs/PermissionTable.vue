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
                    <iv-toolbox-export
                        @click="doExport()"
                    />
                    <iv-toolbox-edit
                        v-show="canEdit"
                        :disabled="isSelected.length !== 1 || pageStep == ePageStep.edit  || pageStep == ePageStep.add"
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
                    :params="searchParams"
                    @selected="selectedItem($event)"
                >
                    <template #Actions="{$attrs, $listeners}">
                        <iv-toolbox-more
                            size="sm"
                            :disabled="isSelected.length !== 1"
                        >
                            <iv-toolbox-view @click="pageToView" />
                            <iv-toolbox-edit v-show="canEdit"  :disabled="pageStep == ePageStep.edit  || pageStep == ePageStep.add" @click="pageToEdit()" />
                            <iv-toolbox-delete v-show="canDelete" @click="doDelete" />
                        </iv-toolbox-more>
                    </template>

                </iv-table>
            </iv-card>
        </div>

        <!--Site Form (Add and Edit and View)-->
        <div v-show="pageStep === ePageStep.add || pageStep === ePageStep.edit || pageStep === ePageStep.view">
            <iv-card :label="pageStep == ePageStep.add ? _('w_Permission_PermissionAdd') : pageStep == ePageStep.edit ? _('w_Permission_PermissionEdit') :  _('w_Permission_PermissionView')">

                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    ref="subForm"
                    :interface="IForm()"
                    :value="inputFormData"
                    @mounted="doMounted"
                    @submit="doSubmit($event)"
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
                    
                     <!-- elevator Group -->
                    <template #elevatorGroupName="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType === eDeviceType.elevatorGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.elevatorGroupNameOption"
                        ></iv-form-selection>
                    </template>

                     <template #elevatorGroupArea="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-if="deviceType === eDeviceType.elevatorGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.elevatorGroupAreaOption"
                        ></iv-form-selection>
                    </template>

                    <template #elevatorGroupTimeFormat="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType == eDeviceType.elevatorGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.deviceTimeFormatOption"
                        ></iv-form-selection>
                    </template>

                    <template #elevatorGroupAdd="{ $attrs }">
                        <b-button
                            v-show="deviceType === eDeviceType.elevatorGroup"
                            class="h-25 addButton"
                            variant="primary"
                            size="md"
                            @click="clickAddDeviceInTable()"
                        >{{ _('w_Add') }}
                        </b-button>
                    </template>
                    <!-- elevatorFloorGroup -->

                    <template #elevatorFloorGroupName="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType === eDeviceType.elevatorFloorGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.elevatorFloorGroupNameOption"
                        ></iv-form-selection>
                    </template>

                     <template #elevatorFloorGroupArea="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-if="deviceType === eDeviceType.elevatorFloorGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.elevatorFloorGroupAreaOption"
                        ></iv-form-selection>
                    </template>

                    <template #elevatorFloorGroupTimeFormat="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType == eDeviceType.elevatorFloorGroup"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.deviceTimeFormatOption"
                        ></iv-form-selection>
                    </template>

                    <template #elevatorFloorGroupAdd="{ $attrs }">
                        <b-button
                            v-show="deviceType === eDeviceType.elevatorFloorGroup"
                            class="h-25 addButton"
                            variant="primary"
                            size="md"
                            @click="clickAddDeviceInTable()"
                        >{{ _('w_Add') }}
                        </b-button>
                    </template>

                    <!-- floor -->

                    <template #floorName="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-if="deviceType === eDeviceType.floor"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.floorNameOption"
                        ></iv-form-selection>
                    </template>

                    <template #floorTimeFormat="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-show="deviceType == eDeviceType.floor"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.deviceTimeFormatOption"
                        ></iv-form-selection>
                    </template>
                    <template #floorArea="{ $attrs, $listeners }">
                        <iv-form-selection
                            v-if="deviceType === eDeviceType.floor"
                            v-bind="$attrs"
                            v-on="$listeners"
                            v-model="inputFormData.floorAreaOption"
                        ></iv-form-selection>
                    </template>

                    <template #floorAdd="{ $attrs }">
                        <b-button
                            v-if="deviceType === eDeviceType.floor"
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
                            <td>{{ deviceTypeItem[value.deviceType] }}</td>
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

                
                <template v-if="isMounted" >            
                    <div class="float-right">
                        <b-button
                        variant="secondary"
                        size="lg"
                        @click="pageToList()"
                    >{{ _('w_Back') }}
                    </b-button>
                        <b-button class="btn-filter" size="lg" :disabled="busy" v-bind="$refs.subForm.submitBindings.$attrs" v-on="$refs.subForm.submitBindings.$listeners" >{{ _("wb_Submit") }}</b-button>
                                   
                    </div>
                </template>
            </iv-card>
            
        </div>

    </div>
</template>


<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";
import Dialog from "@/services/Dialog/Dialog";
import { PermissionName} from '@/../src/constants/permissions';
import * as XLSX from 'xlsx';

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
    elevatorFloorGroup = "elevatorFloorGroup",
    elevatorGroup = "elevatorGroup",
    floor="floor",    
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
    elevatorGroupDevice: any;
    floorGroupDevice: any;
    floorDevice: any;
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
        this.canDelete = false;// this.$user.permissions.find(x=>x.access.D === true && x.of.identifier == this.permissionName) != undefined;        
    }
    isMounted:boolean=false;
    doMounted(){
        this.isMounted=true;        
        
    }
    canAdd:boolean;
    canEdit:boolean;
    canDelete:boolean;
    permissionName:string;

    busy:boolean=false;
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
    searchParams: any = {system:0};

    //options
    deviceNameItem: any = {};
    deviceAreaItem: any = {};
    deviceTimeFromatItem: any = {};
    showdeviceTimeFromatItem: any = {};
    deviceTypeItem: any = {};

    selectItemOriginal: any = {
        timeSchedule: [],
        door: [],
        doorGroup: [],
        elevator: [],
        elevatorGroup:[],
        floorGroup: [],
        floor:[]
    };
    selectItem: ISelectItem = {
        timeSchedule: [],
        doorDevice: [],
        doorGroupDevice: [],
        elevatorGroupDevice:[],
        elevatorDevice: [],
        floorGroupDevice: [],
        floorDevice:[]
    };
    
    
    created() {}

    mounted() {
        this.pageToList();
        this.deviceTypeItem.door = this._("door");
        this.deviceTypeItem.doorGroup = this._("w_DoorGroup");
        this.deviceTypeItem.elevatorGroup = this._("w_ElevatorGroup")+" - "+this._("w_Floor");
        this.deviceTypeItem.floor = this._("w_Elevator")+" - "+this._("w_Floor");
        this.deviceTypeItem.floorGroup = this._("w_Elevator")+" - "+this._("w_FloorGroup");
        this.deviceTypeItem.elevatorFloorGroup = this._("w_ElevatorGroup")+" - "+this._("w_FloorGroup");
    }

    searchTable($event) {
        let filter:any={system:0};
        if($event.permissionName){
            filter.name= $event.permissionName
        }
        this.searchParams = filter;
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
        this.pageStep = EPageStep.add;
        await this.initSelectItem();
        
    }

    async pageToEdit() {
        this.clearInputFormData();
        if (this.isSelected[0] == undefined) {
            return false;
        }
        this.pageStep = EPageStep.edit;
        await this.initSelectItem();
        this.selectedDetail = this.isSelected[0];
        this.initInputFormData();
        
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
        
        this.selectItem.timeSchedule = { "": this._("w_Select") };
        this.selectItem.doorDevice = { "": this._("w_Select") };
        this.selectItem.doorGroupDevice = { "": this._("w_Select") };
        this.selectItem.elevatorGroupDevice = { "": this._("w_Select") };
        this.selectItem.floorDevice = { "": this._("w_Select") };
        this.selectItem.floorGroupDevice = { "": this._("w_Select") };
        this.selectItem.elevatorDevice = { "": this._("w_Select") };
        await Promise.all([
            this.getTimeSchedule(),
            this.getDoor(),
            this.getDoorGroup(),
            this.getElevator(),
            this.getElevatorGroup(),
            this.getFloor(),
            this.getFloorGroup()
        ]);
    }
    private async getElevator() {
    await this.$server
      .R("/acs/elevator",{ "paging.all": "true" })
      .then((response: any) => {
        for(let tempItem of response.results.filter(x=>x.reader && x.reader.length>0)) {
          this.selectItem.elevatorDevice[tempItem.objectId]=tempItem.elevatorname;
          this.selectItemOriginal.elevator.push(tempItem);
        }
      });
  }
    private async getFloor() {
    await this.$server
      .R("/acs/floor" as any,{ "paging.all": "true" })
      .then((response: any) => {
        for(let tempItem of response.results) {
          this.selectItem.floorDevice[tempItem.objectId]=tempItem.floorname;
          this.selectItemOriginal.floor.push(tempItem);
        }
      });
  }
  private async getElevatorGroup() {
    await this.$server
      .R("/acs/elevatorgroup" as any,{ "paging.all": "true" })
      .then((response: any) => {
        for(let tempItem of response.results.filter(x=>x.elevators && x.elevators.length>0)) {
          this.selectItem.elevatorGroupDevice[tempItem.objectId]=tempItem.groupname;
          this.selectItemOriginal.elevatorGroup.push(tempItem);
        }
      });
  }
private async getFloorGroup() {
    await this.$server
      .R("/acs/floorgroup" as any,{ "paging.all": "true" })
      .then((response: any) => {
        for(let tempItem of response.results.filter(x=>x.floors && x.floors.length>0)) {
          this.selectItem.floorGroupDevice[tempItem.objectId]=tempItem.groupname;
          this.selectItemOriginal.floorGroup.push(tempItem);
        }
      });
  }

  private async getDoorGroup() {
    await this.$server
      .R("/acs/doorgroup",{ "paging.all": "true" })
      .then((response: any) => {
        for(let tempItem of response.results.filter(x=>x.doors && x.doors.length>0)) {
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
async doExport(){
        let headers= [
                        this._("w_PermissionTable"),
                        this._("w_AccessLevel"),
                        this._("timename"),
                        this._("w_Door"),
                        this._("w_DoorGroup"),
                        this._("w_Elevator"),
                        this._("w_ElevatorGroup"),
                        this._("w_Floor"),
                        this._("w_FloorGroup")
                    ];
        let exportList =[];
        console.log("headers", headers);
        let resp:any = await this.$server.R("/acs/permissiontable" as any, Object.assign({"paging.all":"true"}, this.searchParams));
        for(let pt of resp.results){ 
            let tablename = pt.tablename;
            for(let al of pt.accesslevels){
                let timename = al.timeschedule.timename;
                let levelname = al.levelname;
                let elevatorname = al.elevator ? al.elevator.elevatorname:"";
                let elevatorgroupname = al.elevatorgroup ? al.elevatorgroup.groupname:"";
                let doorname=al.door? al.door.doorname:"";
                let doorgroupname=al.doorgroup ? al.doorgroup.groupname:"";
                let floorname=al.floor?al.floor.floorname:"";
                let floorgroupname=al.floorgroup?al.floorgroup.groupname:"";
                exportList.push({tablename,levelname,timename,doorname,doorgroupname,elevatorname,elevatorgroupname,floorname,floorgroupname})
            }
            
        }
        let workbook = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet([headers]);        
        XLSX.utils.sheet_add_json(ws, exportList,  {skipHeader: true, origin: "A2"});
        XLSX.utils.book_append_sheet(workbook, ws, "Sheet1");        
        XLSX.writeFile(workbook, `${this._("w_PermissionTable")}.xlsx`);
    }
  private async getTimeSchedule() {
    await this.$server
      .R("/acs/timeschedule",{ "paging.all": "true", system:1 })
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
            console.log("tempAccesslevels", tempAccesslevels);
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
            switch (tempAccesslevels.type) {
                case EDeviceType.door:
                    if (!tempAccesslevels.door) continue;
                    deviceData.deviceName.id = tempAccesslevels.door.objectId;
                    deviceData.deviceName.text = tempAccesslevels.door.doorname;
                    break;
                case EDeviceType.doorGroup:
                    if (!tempAccesslevels.doorgroup) continue;
                    deviceData.deviceName.id = tempAccesslevels.doorgroup.objectId;
                    deviceData.deviceName.text =  tempAccesslevels.doorgroup.groupname;
                    break;
                case EDeviceType.elevatorGroup:                    
                    if (!tempAccesslevels.elevatorgroup) continue;
                    deviceData.deviceName.id = tempAccesslevels.elevatorgroup.objectId;                   
                    deviceData.deviceName.text = tempAccesslevels.elevatorgroup.groupname;
                    deviceData.area.id = tempAccesslevels.floor.floorname;
                    deviceData.area.text = tempAccesslevels.floor.floorname;
                    break;
                case EDeviceType.elevatorFloorGroup:                    
                    if (!tempAccesslevels.elevatorgroup) continue;
                    deviceData.deviceName.id = tempAccesslevels.elevatorgroup.objectId;                   
                    deviceData.deviceName.text = tempAccesslevels.elevatorgroup.groupname;
                    deviceData.area.id = tempAccesslevels.floorgroup.groupname;
                    deviceData.area.text = tempAccesslevels.floorgroup.groupname;
                    break;
                case EDeviceType.floor:                    
                    if (!tempAccesslevels.floor || !tempAccesslevels.elevator) continue;
                    deviceData.deviceName.id = tempAccesslevels.elevator.objectId;                   
                    deviceData.deviceName.text = tempAccesslevels.elevator.elevatorname; 
                    
                    deviceData.area.id = tempAccesslevels.floor.floorname;
                    deviceData.area.text = tempAccesslevels.floor.floorname;
                    break;
                case EDeviceType.floorGroup:
                    if (!tempAccesslevels.floorgroup || !tempAccesslevels.elevator) continue;
                    deviceData.deviceName.id = tempAccesslevels.elevator.objectId;
                    deviceData.deviceName.text =  tempAccesslevels.elevator.elevatorname;  
                    deviceData.area.id = tempAccesslevels.floorgroup.groupname;
                    deviceData.area.text = tempAccesslevels.floorgroup.groupname;
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
    
    updateInputData(data) {
        console.log("updateInputData", data);
        let elevator:any;
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
                break;
            case "elevatorGroupName": 
                this.selectItem.floorDevice={ "": this._("w_Select") };
                let elevatorGroup = this.selectItemOriginal.elevatorGroup.find(x=>x.objectId == data.value);
                if(elevatorGroup&&elevatorGroup.elevators){
                    for(let elevator of elevatorGroup.elevators){
                        for(let floor of elevator.reader){
                            this.selectItem.floorDevice[floor.objectId]=floor.floorname;
                        }
                    }               
                }
                else{
                    this.inputFormData.elevatorGroupAreaOption="";
                }                
                this.inputFormData.elevatorGroupNameOption = data.value;                
                break;
            
            // floor - elevator option
            case "floorName":
                console.log("floor elevator changed", data);
                this.selectItem.floorDevice={ "": this._("w_Select") };
                elevator = this.selectItemOriginal.elevator.find(x=>x.objectId == data.value);                
                if(elevator&&elevator.reader){
                    for(let floor of elevator.reader){
                        this.selectItem.floorDevice[floor.objectId]=floor.floorname;
                    }
                }
                else{
                    this.inputFormData.floorAreaOption="";
                }                
                this.inputFormData.floorNameOption = data.value;                        
                break;            
            case "floorArea":
                console.log("floorArea changed", data);
                this.inputFormData.floorAreaOption = data.value;                
                break;
            case "floorGroupName":
                console.log("floorGroup elevator changed", data);                          
                this.inputFormData.floorGroupNameOption = data.value;                        
                break;
            case "floorGroupArea":
                console.log("floorGroupArea changed",data);
                this.inputFormData.floorGroupAreaOption = data.value;                
                break;
            case "elevatorFloorGroupArea":
                this.inputFormData.elevatorFloorGroupAreaOption = data.value;                
                break;
            case "elevatorFloorGroupName":
                this.inputFormData.elevatorFloorGroupNameOption =  data.value;
                this.inputFormData.elevatorFloorGroupAreaOption = "";                
                break;
            case "doorTimeFormat": 
            case "doorGroupTimeFormat":
            case "elevatorGroupTimeFormat":
            case "floorTimeFormat":
            case "floorGroupTimeFormat":                    
            case "elevatorFloorGroupTimeFormat":          
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
        

        if(!this.inputFormData.deviceTimeFormatOption||
            (!this.inputFormData.floorAreaOption && this.inputFormData.deviceType==EDeviceType.floor )|| 
            (!this.inputFormData.elevatorGroupAreaOption && this.inputFormData.deviceType==EDeviceType.elevatorGroup)||
            (!this.inputFormData.elevatorFloorGroupAreaOption && this.inputFormData.deviceType==EDeviceType.elevatorFloorGroup)||
            (!this.inputFormData.floorGroupAreaOption && this.inputFormData.deviceType==EDeviceType.floorGroup)){            
            return;
        }   
        let deviceData: any = {
            objectId: "",
            deviceType: this.inputFormData.deviceType,
            deviceName: { id: "", text: "" },
            area: { id: "", text: "" },
            timeFormat: { id: "", text: "" }
        };
        
        deviceData.timeFormat.id = this.inputFormData.deviceTimeFormatOption;
        deviceData.timeFormat.text = this.selectItem.timeSchedule[deviceData.timeFormat.id];

        switch (this.deviceType) {
            case EDeviceType.door:
                if (!this.inputFormData.doorNameOption) return;
                deviceData.deviceName.id = this.inputFormData.doorNameOption;
                deviceData.deviceName.text = this.selectItem.doorDevice[deviceData.deviceName.id];
                break;
            case EDeviceType.doorGroup:
                if (!this.inputFormData.doorGroupNameOption) return;
                deviceData.deviceName.id = this.inputFormData.doorGroupNameOption;
                deviceData.deviceName.text = this.selectItem.doorGroupDevice[deviceData.deviceName.id];
                break;
            case EDeviceType.elevatorGroup:
                if (!this.inputFormData.elevatorGroupNameOption) return;
                deviceData.deviceName.id = this.inputFormData.elevatorGroupNameOption;
                deviceData.deviceName.text = this.selectItem.elevatorGroupDevice[deviceData.deviceName.id];
                deviceData.area.id = this.inputFormData.elevatorGroupAreaOption;
                deviceData.area.text = this.selectItem.floorDevice[deviceData.area.id]; 
                break;
            case EDeviceType.elevatorFloorGroup:
                if (!this.inputFormData.elevatorFloorGroupNameOption) return;
                deviceData.deviceName.id = this.inputFormData.elevatorFloorGroupNameOption;
                deviceData.deviceName.text = this.selectItem.elevatorGroupDevice[deviceData.deviceName.id];
                deviceData.area.id = this.inputFormData.elevatorFloorGroupAreaOption;
                deviceData.area.text = this.selectItem.floorGroupDevice[deviceData.area.id]; 
                break;
            case EDeviceType.floor:
                if (!this.inputFormData.floorNameOption) return;
                deviceData.deviceName.id = this.inputFormData.floorNameOption;
                deviceData.deviceName.text = this.selectItem.elevatorDevice[deviceData.deviceName.id];
                deviceData.area.id = this.inputFormData.floorAreaOption;
                deviceData.area.text = this.selectItem.floorDevice[deviceData.area.id]; 
                break;
            case EDeviceType.floorGroup:
                if (!this.inputFormData.floorGroupNameOption) return;
                deviceData.deviceName.id = this.inputFormData.floorGroupNameOption; 
                deviceData.deviceName.text = this.selectItem.elevatorDevice[deviceData.deviceName.id];                
                deviceData.area.id = this.inputFormData.floorGroupAreaOption;
                deviceData.area.text = this.selectItem.floorGroupDevice[deviceData.area.id];                
                break;
            }
        console.log("push device data", deviceData);
        this.inputFormData.data.push(deviceData);
        this.clearDeviceSelection();
    }

    clearDeviceSelection() {
        this.inputFormData.deviceTimeFormatOption = "";
        this.inputFormData.doorNameOption = "";
        
        this.inputFormData.doorGroupNameOption = "";
        
        this.inputFormData.elevatorGroupAreaOption = "";
        this.inputFormData.elevatorGroupNameOption = "";
        this.inputFormData.floorNameOption = "";
        this.inputFormData.floorAreaOption = "";
        this.inputFormData.floorGroupAreaOption = "";
        this.inputFormData.floorGroupNameOption = "";

        this.inputFormData.elevatorFloorGroupAreaOption = "";
        this.inputFormData.elevatorFloorGroupNameOption = "";
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
    savedAccessLevels: any[];
    async doSubmit($event){
        try{
            this.busy=true;
            let duplicate = await this.checkDuplication({objectId: this.inputFormData.id, tablename:this.inputFormData.permissionName})
            if(!duplicate) await this.doSave();
        }        
        catch(err){
            console.error("doSubmit", err)
            if(err.res && err.res.statusCode && err.res.statusCode===400 && (err.body =="accessLevelIsNotInSipass" || err.body =="cannotGetTokenFromSipass")) { 
                await Dialog.error(this._(err.body)); 
            }
            // let global error handles this
            else throw err;
        }
        finally{
            this.busy=false;
        }
    }
    async doSave() {
        this.savedAccessLevels=[];
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
                        this.savedAccessLevels.push({timename: tempData.timeFormat.text, devicename: tempData.deviceName.text});
                        break;
                    case EDeviceType.doorGroup:
                        accessParam.doorgroup = tempData.deviceName.id;
                        let doorGroup = this.selectItemOriginal.doorGroup.find(x=>x.objectId == accessParam.doorgroup);
                        if(!doorGroup || !doorGroup.doors)continue;
                        for (let door of doorGroup.doors) {
                            this.savedAccessLevels.push({timename: tempData.timeFormat.text, devicename: door.doorname});
                        }
                        break;
                    case EDeviceType.elevatorGroup:
                        accessParam.elevatorgroup = tempData.deviceName.id;                       
                        accessParam.floor = tempData.area.id;                        
                        this.savedAccessLevels.push({timename: tempData.timeFormat.text, devicename: `${tempData.deviceName.text}-${tempData.area.text}`});
                        break;
                    case EDeviceType.floor:
                        accessParam.elevator = tempData.deviceName.id;                        
                        accessParam.floor=tempData.area.id;                        
                        this.savedAccessLevels.push({timename: tempData.timeFormat.text, devicename: `${tempData.deviceName.text}-${tempData.area.text}`});
                        break;
                    case EDeviceType.floorGroup:
                        accessParam.elevator = tempData.deviceName.id;                        
                        accessParam.floorgroup=tempData.area.id;
                        let floorgroup = this.selectItemOriginal.floorGroup.find(x=>x.objectId ==accessParam.floorgroup);
                        if(floorgroup && floorgroup.floors){
                            for(let floor of floorgroup.floors){
                                this.savedAccessLevels.push({timename: tempData.timeFormat.text, devicename: `${tempData.deviceName.text}-${floor.floorname}`});
                            }                             
                        }
                        break;
                    case EDeviceType.elevatorFloorGroup:
                        accessParam.elevatorgroup = tempData.deviceName.id;                        
                        accessParam.floorgroup=tempData.area.id;
                        let floorGroup = this.selectItemOriginal.floorGroup.find(x=>x.objectId ==accessParam.floorgroup);
                        if(floorGroup && floorGroup.floors){
                            for(let floor of floorGroup.floors){
                                this.savedAccessLevels.push({timename: tempData.timeFormat.text, devicename: `${tempData.deviceName.text}-${floor.floorname}`});
                            }                             
                        }
                        break;
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
private async checkDuplication(permtable:any):Promise<boolean>{
    let resp:any = await this.$server.R("/acs/permissiontable",{tablename:permtable.tablename, system:0});
      if(resp.results.length>0){        
        let isDuplicate = permtable.objectId ? resp.results[0].objectId!=permtable.objectId : true;
        if(isDuplicate)alert(this._("w_Error_DuplicatePermissionTable"));
        return isDuplicate;
      }
      
      return false; 
  }
  private checkError(response: any) {
    if(!response.errors||response.errors.length<=0){
        this.pageToList();
        return;
    };
    
    if(response.errors.find(x=>x.type=="accessLevelIsNotInCCure")){
        let messages = `<table class="table"><tr><th>${this._("w_Device")}</th><th>${this._("w_TimeSchedule")}</th><th></th></tr>`;
        for(let error of response.errors.filter(x=>x.type=="accessLevelIsNotInCCure")){
            messages+=`<tr><td>${error.devicename || ""}</td><td>${error.timename  ||""}</td><td>${error.message || ""}</td></tr>`;
        }
        messages+="</table>"
        Dialog.error(this._("w_Error_AccessLevelIsNotInCCure")+"<br/>"+messages);               
    }
    else if(response.errors.find(x=>x.type=="accessLevelIsNotInAcs")){ 
        let messages = `CCURE ${this._("w_PermissionTable")}: ${this.inputFormData.permissionName||""}<br/>`       
        messages += `<table class="table"><tr><th>${this._("w_Device")}</th><th>${this._("w_TimeSchedule")}</th><th></th></tr>`;
        for(let error of response.errors.filter(x=>x.type=="accessLevelIsNotInAcs")){
            messages+=`<tr><td>${error.devicename || ""}</td><td>${error.timename  ||""}</td><td>${error.message || ""}</td></tr>`;
        }
        messages+="</table>";
        messages += this.createPermTableMessage({permissionTableName:this.inputFormData.permissionName, devices:Object.assign([], this.savedAccessLevels)});
        Dialog.error(this._("w_Error_AccessLevelIsNotInAcs")+"<br/>"+messages);
    }
    else if(response.errors.find(x=>x.type=="clearanceIsNotInCCure")){
        let messages = this.createPermTableMessage({permissionTableName:this.inputFormData.permissionName, devices:Object.assign([], this.savedAccessLevels)});           
        Dialog.error(this._("w_Error_AccessLevelIsNotInCCure")+"<br/>"+messages);
    }    
    else if(response.errors.find(x=>x.type=="errorFromSipass")){
        let sipassError = response.errors.find(x=>x.type=="errorFromSipass").message;
        let messages = `${sipassError.Message}`;
        Dialog.error(this._("errorFromSipass")+"<br/>"+messages);
    }
    else{
        this.pageToList();
    }
  }
    
  private createPermTableMessage(permTable: any) {
    let messages=`ACS ${this._("w_PermissionTable")}: ${permTable.permissionTableName||""}<br/>`;
    messages+=`<table class="table"><tr><th>${this._("w_Device")}</th><th>${this._("w_TimeSchedule")}</th><th></th></tr>`;
    for(let dev of this.savedAccessLevels) {
        let exists = permTable.devices.find(x=>x.devicename==dev.devicename && x.timename==dev.timename);
        messages+=`<tr ${exists ? 'style="color:red"' : ''}><td>${dev.devicename||""}</td><td>${dev.timename||""}</td><td>${dev.message||""}</td></tr>`;
    }
    messages+="</table>";
    return messages;
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
                 * @uiLabel - ${this._("w_ElevatorGroup")}
                 * @uiPlaceHolder - ${this._("w_ElevatorGroup")}
                 * @uiColumnGroup - row111eg
                 * @uiDisabled - ${
                     this.pageStep === EPageStep.add ||
                     this.pageStep === EPageStep.edit
                         ? "false"
                         : "true"
                 }
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
                */
                 elevatorGroupName?: ${toEnumInterface(
                     this.selectItem.elevatorGroupDevice as any,
                     false
                 )};

                 /**
                 * @uiLabel - ${this._("w_Floor")}
                 * @uiColumnGroup - row111eg
                * @uiHidden - ${this.pageStep === EPageStep.view ? "true" : "false"}
                */
                 elevatorGroupArea?:  ${toEnumInterface(this.selectItem.floorDevice, false)};


                /**
                 * @uiLabel - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiColumnGroup - row111eg
                 * @uiDisabled - ${
                     this.pageStep === EPageStep.add ||
                     this.pageStep === EPageStep.edit
                         ? "false"
                         : "true"
                 }
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
                */
                elevatorGroupTimeFormat?: ${toEnumInterface(
                    this.selectItem.timeSchedule as any,
                    false
                )};


                /*
                 * @uiColumnGroup - row111eg
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
                */
                 elevatorGroupAdd?: any;

                ///////////////////////////////////////////////////////
                

                 /**
                 * @uiLabel - ${this._("w_ElevatorGroup")}
                 * @uiPlaceHolder - ${this._("w_ElevatorGroup")}
                 * @uiColumnGroup - row111efg
                 * @uiDisabled - ${
                     this.pageStep === EPageStep.add ||
                     this.pageStep === EPageStep.edit
                         ? "false"
                         : "true"
                 }
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
                */
                 elevatorFloorGroupName?: ${toEnumInterface(
                     this.selectItem.elevatorGroupDevice as any,
                     false
                 )};

                 /**
                 * @uiLabel - ${this._("w_FloorGroup")}
                 * @uiColumnGroup - row111efg
                * @uiHidden - ${this.pageStep === EPageStep.view ? "true" : "false"}
                */
                 elevatorFloorGroupArea?:  ${toEnumInterface(this.selectItem.floorGroupDevice, false)};


                /**
                 * @uiLabel - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiPlaceHolder - ${this._("w_Permission_DeviceTimeFormat")}
                 * @uiColumnGroup - row111efg
                 * @uiDisabled - ${
                     this.pageStep === EPageStep.add ||
                     this.pageStep === EPageStep.edit
                         ? "false"
                         : "true"
                 }
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
                */
                elevatorFloorGroupTimeFormat?: ${toEnumInterface(
                    this.selectItem.timeSchedule as any,
                    false
                )};


                /*
                 * @uiColumnGroup - row111efg
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
                */
                 elevatorFloorGroupAdd?: any;

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
                 floorName?: ${toEnumInterface(
                     this.selectItem.elevatorDevice as any,
                     false
                 )};


                /**
                 * @uiLabel - ${this._("w_Floor")}
                 * @uiColumnGroup - row112
                * @uiHidden - ${this.pageStep === EPageStep.view ? "true" : "false"}
                */
                 floorArea?:  ${toEnumInterface(this.selectItem.floorDevice, false)};


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
                floorTimeFormat?: ${toEnumInterface(
                    this.selectItem.timeSchedule as any,
                    false
                )};


                /*
                 * @uiColumnGroup - row112
                 * @uiHidden - ${this.pageStep === EPageStep.view? "true" : "false"}
                */
                 floorAdd?: any;
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
