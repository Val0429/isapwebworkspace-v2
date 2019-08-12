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
        <template #readersystem="{$attrs,$listeners}">                   
            <b-form-group :label="_('system')" 
            class="col-md-6">     
                <b-input-group>               
                    <b-form-radio inline v-model="readersystem" name="system" value="">{{_("w_Not_Selected")}}</b-form-radio>
                    <b-form-radio inline v-model="readersystem" name="system" value="1">SIPASS</b-form-radio>
                    <b-form-radio inline v-model="readersystem" name="system" value="800">CCURE</b-form-radio>
                </b-input-group>    
            </b-form-group>
        </template>
        <template #readerIO="{$attrs,$listeners}">                   
            <b-form-group :label="_('readerIO')" 
            class="col-md-6">     
                <b-input-group>               
                    <b-form-radio inline v-model="readerIO" name="readerIO" value="">{{_("w_Not_Selected")}}</b-form-radio>
                    <b-form-radio inline v-model="readerIO" name="readerIO" value="IN">IN</b-form-radio>
                    <b-form-radio inline v-model="readerIO" name="readerIO" value="OUT">OUT</b-form-radio>
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
        <template #view.readerIO="{$attrs, $listeners}">
            {{getInfo($attrs.row.objectId).io}}
        </template>
        <template #view.door="{$attrs, $listeners}">
            {{getInfo($attrs.row.objectId).doorname}}
        </template>
        <template #view.doorgroup="{$attrs, $listeners}">
            {{getInfo($attrs.row.objectId).groupname}}
        </template>
        <!-- 6) custom edit / add template with <template #add.* /> -->
        
    </ivc-form-quick>
    
    <div class="float-right" v-show="filterVisible" >                
        <b-button class="btn-filter" size="lg" :disabled="!syncEnabled" @click="manualSync()">{{_("w_Manual_Sync")}}</b-button>
    </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, Observe, toEnumInterface } from "@/../core";
import { EFormQuick} from '@/../components/form/helpers/form-quick/form-quick.vue.ts';
import { IFormQuick2 } from '@/components/form/form-quick/form-quick.vue.ts';
import { System } from '@/config/default/api/interfaces';
import { BasicFormQuick } from './basic-form-quick';
import { PermissionName} from '@/../src/constants/permissions';
@Component
/// 1) class name
export default class Reader extends BasicFormQuick implements IFormQuick2 {
    readersystem:string="";
    readerIO:string="";
    system = System;
    /// 2) cgi path
    path: string = "/acs/reader";
    /// 3) i18n - view / edit / add
    tView: string = "w_Reader";
    tAdd: string = "w_ReaderAdd";
    tEdit: string = "w_ReaderEdit";

    selectedOptions=[];
    options :{key:any, value:any}[]=[];
    /// 4) interfaces - view / edit / add
    inf(type: EFormQuick) {
        switch (type) {
            case EFormQuick.View:
                return `
                interface {                    
                    /**
                    * @uiLabel - ${this._("readerid")}
                    */
                    readerid: string;
                    /**
                    * @uiLabel - ${this._("w_DoorGroup")}
                    */
                    doorgroup: string;
                    /**
                    * @uiLabel - ${this._("w_Door")}
                    */
                    door: string;                  
                    /**
                    * @uiLabel - ${this._("readerIO")}
                    */
                    readerIO: string; 
                    /**
                    * @uiLabel - ${this._("readername")}
                    */
                    readername: string;                   
                    /**
                    * @uiLabel - ${this._("system")}
                    */
                    system: string;
                }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {
                    /**
                    * @uiLabel - ${this._("system")}
                    * @uiType - ivc-system-selection
                    */
                    system: number;
                    /**
                    * @uiLabel - ${this._("readerid")}
                    */
                    readerid: string;
                    /**
                    * @uiLabel - ${this._("readername")}
                    */
                    readername: string;   
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
    
    doors:any[]=[];
    doorGroups:any[]=[];
    async created(){
        this.permissionName = PermissionName.reader;
        await Promise.all([
        this.getDoorOptions(),
        this.getDoorGroupOptions()]);
    }
    private async getDoorOptions() {
        let resp: any =await this.$server.R("/acs/door",{"paging.all":"true"});            
        this.doors = resp.results;        
        console.log("doors",this.doors);
    }
    private async getDoorGroupOptions() {
        let resp: any =await this.$server.R("/acs/doorgroup" as any,{"paging.all":"true"});            
        this.doorGroups = resp.results;        
        console.log("doorGroups",this.doorGroups);    
    }
    getInfo(objectId:string){
        let doorin = this.doors.find(x=>x.readerin && x.readerin.length>0 && x.readerin.find(y=> y.status==1 && y.objectId==objectId));
        let doorout = this.doors.find(x=>x.readerout&& x.readerout.length>0 && x.readerout.find(y=> y.status==1 && y.objectId==objectId));        
        let io = doorin ? "IN" : doorout ? "OUT" : "";
        let doorname= doorin ? doorin.doorname : doorout ? doorout.doorname : "";
        let groupin:any;
        if(doorin){
            groupin = this.doorGroups.find(x=>x.doors && x.doors.length>0 && x.doors.find(y=>y.objectId==doorin.objectId));
        }
        let groupout:any;
        if(doorout){
            groupout = this.doorGroups.find(x=>x.doors && x.doors.length>0 && x.doors.find(y=>y.objectId==doorout.objectId));
        }
        
        let groupname = groupin ? groupin.groupname : groupout ? groupout.groupname : "";
        return {io,doorname,groupname};
    }
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
              * @uiLabel - ${this._("w_DoorGroup")}
              */
             doorgroup?:string;
             /**
               * @uiColumnGroup - row2
              * @uiLabel - ${this._("w_Door")}
              */
             doorname?:string;
              /**
              * @uiLabel - ${this._("name")}
              */
              name?:string;
             /**
             * @uiColumnGroup - row4
             * @uiLabel - ${this._("readerIO")}
             */
            readerIO?: string; 
              /**
              * @uiColumnGroup - row4
              * @uiLabel - ${this._("system")}
              */
              readersystem?:string;
          }`;
    } 
    onFilterSubmit($event?: any): void {
      if(!$event){this.readersystem="";this.readerIO="";}

       let params = $event || {};
       if(this.readersystem) params.system=this.readersystem;
       if(this.readerIO) params.readerIO=this.readerIO;
       this.setParams(params);
       
    }
}
</script>


<style lang="scss" scoped>
</style>

