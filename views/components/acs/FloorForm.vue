<template>
<div>
    <iv-card
        v-show="filterVisible" 
            :label="_('w_Filter')"
        >
            <iv-form
                    ref="form"
                    class="col-md-9"
                    :value="params"
                    @mounted="doMounted"
                    :interface="filterInterface()"
                    @submit="onFilterSubmit($event)"
                    :visible="true"
                >
                <template #floorsystem="{$attrs,$listeners}">                   
                    <b-form-group :label="_('system')" 
                    class="col-md-6">     
                        <b-input-group>               
                            <b-form-radio inline v-model="floorsystem" name="system" value="">{{_("w_Not_Selected")}}</b-form-radio>
                            <b-form-radio inline v-model="floorsystem" name="system" value="1">SIPASS</b-form-radio>
                            <b-form-radio inline v-model="floorsystem" name="system" value="800">CCURE</b-form-radio>
                        </b-input-group>    
                    </b-form-group>
                </template>       
            
            </iv-form> 

        <div class="col-md-12">
            <template v-if="isMounted" >            
                <div class="float-right">
                    <b-button class="btn-filter" size="lg" v-bind="$refs.form.submitBindings.$attrs" v-on="$refs.form.submitBindings.$listeners" >{{ _("wb_Submit") }}</b-button>
                    <b-button class="btn-filter" size="lg" v-bind="$refs.form.resetBindings.$attrs" v-on="$refs.form.resetBindings.$listeners" @click="onFilterSubmit()">{{ _("wb_Reset") }}</b-button>                
                </div>
            </template>
        </div>
        </iv-card>
        <ivc-form-quick v-on:viewChange="viewChange($event)"
            :canAdd="canAdd"
            :canEdit="canEdit"
            :canDelete="canDelete"
            :allowEdit="allowEdit">  
            <!-- 5) custom view templates with <template #view.* /> -->
             <template #view.system="{$attrs, $listeners}">
                {{$attrs.value== system.SIPASS ? "SIPASS" : $attrs.value==system.CCURE ? "CCURE" : 'UNKNOWN'}}
            </template>
            <template #view.elevatorname="{$attrs, $listeners}">
                {{getInfo($attrs.row).elevatorname}}
            </template>
            
            <template #view.elevatorgroup="{$attrs, $listeners}">
                {{getInfo($attrs.row).elevatorgroups}}
            </template>
        </ivc-form-quick>

    <div class="float-right">                
        <b-button class="btn-filter" size="lg" :disabled="!syncEnabled" @click="manualSync('floor')">{{_("w_Manual_Sync")}}</b-button>
    </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, Observe, toEnumInterface } from "@/../core";
import { EFormQuick} from '@/../components/form/helpers/form-quick/form-quick.vue.ts';
import { IFormQuick2 } from '@/components/form/form-quick/form-quick.vue.ts'
import { BasicFormQuick } from './basic-form-quick';
import { PermissionName} from '@/../src/constants/permissions';
import { System } from '@/config/default/api/interfaces';
@Component
/// 1) class name
export default class FloorForm extends BasicFormQuick implements IFormQuick2 {
      system = System;
    /// 2) cgi path
    path: string = "/acs/floor";
    /// 3) i18n - view / edit / add
    tView: string = "w_Floor";
    tAdd: string = "w_FloorAdd";
    tEdit: string = "w_FloorEdit";
    
   
    /// 4) interfaces - view / edit / add
    inf(type: EFormQuick) {
        switch (type) {
            case EFormQuick.View:
                return `
                    interface {
                    
                    /**
                    * @uiLabel - ${this._("w_ElevatorGroup")}
                    */
                    elevatorgroup:string;
                    /**
                    * @uiLabel - ${this._("w_Elevator")}
                    */
                    elevatorname: string;                    
                    /**
                    * @uiLabel - ${this._("w_Floor")}
                    */
                    floorname: string;
                    /**
                    * @uiLabel - ${this._("system")}
                    */    
                    system:string;
                }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {
                           
                /**
                * @uiLabel - ${this._("name")}
                */
                floorname: string;
                }
                `;
        }
    }
    /// 7) pre-add 新增欄位的default值
    preAdd() {
        return;
    }
    /// 8) post-add 寫入新增前要做甚麼調整
    postAdd(row) {
        return;
    }
    /// 9) pre-edit 送去修改表單前要做甚麼調整
    preEdit(row) {
        return;
    }
    /// 10) post-edit 寫入修改前要做甚麼調整
    postEdit(row) {  
        return;
    }
    /// Done
  
    elevatorGroups =[];
    elevators =[];
    floorsystem:string="";
    isMounted:boolean=false;
    doMounted(){
        this.isMounted=true;
        this.canEdit=false;
        this.canDelete=false;
        this.canAdd=false;
    }
    filterInterface():string{
        return `interface {
             /**
               * @uiColumnGroup - row2
              * @uiLabel - ${this._("w_ElevatorGroup")}
              */
             groupname?:string;
             
              /**
               * @uiColumnGroup - row2
              * @uiLabel - ${this._("w_Elevator")}
              */
              elevatorname?:string;
             /**
               * @uiColumnGroup - row4
              * @uiLabel - ${this._("name")}
              */
              name?:string;
              /**
              * @uiColumnGroup - row4
              * @uiLabel - ${this._("system")}
              */
              floorsystem?:string;
          }`;
    } 
    
    onFilterSubmit($event?: any): void {
        
      if(!$event)this.floorsystem="";

       let params = $event || {};
       if(this.floorsystem) params.system=this.floorsystem;
       
       this.setParams(params);
    }
    private async getElevators(){
        let resp: any=await this.$server.R("/acs/elevator" as any,{ "paging.all": "true" });
        this.elevators=resp.results;
        console.log("elevators", this.elevators)    
    }
    private async getElevatorGroups(){
        let resp: any=await this.$server.R("/acs/elevatorgroup" as any,{ "paging.all": "true" });
        this.elevatorGroups=resp.results;
        console.log("elevatorGroups", this.elevatorGroups)    
    }
    async created(){
        this.permissionName = PermissionName.floor;
        await Promise.all([
            this.getElevators(),
            this.getElevatorGroups()
        ]);
    }
     getInfo(floor:any){
        let elevator = this.elevators.find(x=>x.reader&& x.reader.length>0 && x.reader.find(y=> y.objectId == floor.objectId));
        let elevatorname = elevator ? elevator.elevatorname : "";
        let elevatorgroups = elevator ? this.elevatorGroups.filter(x=>x.elevators && x.elevators.length>0 && x.elevators.find(y=>y.objectId==elevator.objectId)).map(x=>x.groupname).join(", ") : "";
        
        
        return {elevatorname, elevatorgroups};
    }
}
</script>


<style lang="scss" scoped>
.floor-image{
    max-width: 200px;
    height: auto;
}
</style>

