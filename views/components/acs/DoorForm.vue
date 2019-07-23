<template>
    <div>
        <ivc-filter-form
            :inf="filterInterface()"
            :visible="filterVisible"
            v-on:input="onFilterSubmit($event)"
        />
    <ivc-form-quick v-on:viewChange="viewChange($event)"
            :canAdd="canAdd"
            :canEdit="canEdit"
            :canDelete="canDelete"
            :allowEdit="allowEdit">
        <!-- 5) custom view templates with <template #view.* /> -->
        
        <template #view.readerscount="{$attrs, $listeners}">
            {{ getReadersCount($attrs.row) }}
        </template>  
        
        <!-- 6) custom edit / add template with <template #add.* /> -->

        <!-- <template #add.ccurein="{$attrs, $listeners}">
            <ivc-single-selection
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="ccureOptions" 
            />
        </template>
        <template #add.ccureout="{$attrs, $listeners}">
            <ivc-single-selection
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="ccureOptions" 
            />
        </template>
        <template #add.sipassin="{$attrs, $listeners}">
            <ivc-single-selection
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="sipassOptions" 
            />
        </template>
        <template #add.sipassout="{$attrs, $listeners}">
            <ivc-single-selection
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="sipassOptions" 
            />
        </template> -->
        <template #view.doorgroup="{$attrs, $listeners}">
            {{getInfo($attrs.row).doorgroup}}
        </template>
        <template #view.area="{$attrs, $listeners}">
            {{getInfo($attrs.row).area}}
        </template>
        <template #view.site="{$attrs, $listeners}">
            {{getInfo($attrs.row).site}}
        </template>
    </ivc-form-quick>
    </div>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, Observe, toEnumInterface } from "@/../core";
import { System } from '@/config/default/api/interfaces';
import { EFormQuick} from '@/../components/form/helpers/form-quick/form-quick.vue.ts';
import { IFormQuick2 } from '@/components/form/form-quick/form-quick.vue.ts';
import { BasicFormQuick } from './basic-form-quick';
import { PermissionName} from '@/../src/constants/permissions';

@Component
/// 1) class name
export default class DoorForm extends BasicFormQuick implements IFormQuick2 {    
    
    /// 2) cgi path
    path: string = "/acs/door";    
    /// 3) i18n - view / edit / add
    tView: string = "w_Door";
    tAdd: string = "w_DoorAdd";
    tEdit: string = "w_DoorEdit";
    
    /// 4) interfaces - view / edit / add
    inf(type: EFormQuick) {
        switch (type) {
            case EFormQuick.View:
                return `
                interface {   
                /**
                * @uiLabel - ${this._("w_Region_LevelSite")}
                */
                site:string;
                /**
                * @uiLabel - ${this._("w_Region_LevelArea")}
                */
                area:string;
                /**
                * @uiLabel - ${this._("w_DoorGroup")}
                */
                doorgroup:string;
                /**
                * @uiLabel - ${this._("doorname")}
                */
                doorname:string;
               
                /**
                * @uiLabel - ${this._("readerscount")}
                */
                readerscount:string;
                }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {
                
                /**
                * @uiLabel - ${this._("doorname")}
                */
                doorname:string;                
                
                /**
                * @uiLabel - ${"SIPASS"+" "+this._("readerin")}
                */
                sipassin?:  ${toEnumInterface(this.sipassOptions, false)};
                 /**
                * @uiLabel - ${"SIPASS"+" "+this._("readerout")}
                */
                sipassout?: ${toEnumInterface(this.sipassOptions, false)};
                /**
                * @uiLabel - ${"CCURE"+" "+this._("readerin")}
                */
                ccurein?: ${toEnumInterface(this.ccureOptions, false)};
                /**
                * @uiLabel - ${"CCURE"+" "+this._("readerout")}
                */
                ccureout?: ${toEnumInterface(this.ccureOptions, false)};
                
                }
                `;
        }
    }
    
    async viewChange($event: any){
        console.log("view", $event)
        this.filterVisible = $event == 'view';
        //update options
        if($event=='add') await this.getOptions();
    } 
    
    preAdd() {    
        return;
    }
    /// 8) post-add 寫入新增前要做甚麼調整
    postAdd(row) {
        return this.postAddEdit(row);     
    }
    /// 9) pre-edit 送去修改表單前要做甚麼調整
    async preEdit(row) {
        let props = this.getReaderInfo(row);
        row.sipassin = props.sipassin ? props.sipassin.objectId:"";
        row.sipassout =  props.sipassout ? props.sipassout.objectId:"";
        row.ccurein =  props.ccurein ? props.ccurein.objectId:"";
        row.ccureout = props.ccureout ? props.ccureout.objectId:"";
        console.log("row.readerin", row.readerin);
        console.log("row.readerout", row.readerout);
        await this.getOptions(row.readerin,row.readerout);        
        return row;
    }
    filterInterface(){
         return `interface {
            /**
               * @uiColumnGroup - row1
              * @uiLabel - ${this._("w_Site")}
              */
             sitename?:string;
             /**
               * @uiColumnGroup - row1
              * @uiLabel - ${this._("w_Area")}
              */
             areaname?:string;
             /**
               * @uiColumnGroup - row2
              * @uiLabel - ${this._("w_DoorGroup")}
              */
             doorgroup?:string;
             /**
               * @uiColumnGroup - row2
              * @uiLabel - ${this._("w_Door")}
              */
             name?:string;
        }`;
    }
    
    getReaderInfo(row: any) {
     let{sipassin, sipassout, ccurein, ccureout}={} as any;
    if(row.readerin&&row.readerin.length>0) {
      for(let item of row.readerin) {
        let reader=this.options.find(x => x.key==item.objectId);
        if(reader)
          item.system=reader.system;
      }
      sipassin=row.readerin.find(x => x.system==System.SIPASS);
      ccurein=row.readerin.find(x => x.system==System.CCURE);
    }
    if(row.readerout&&row.readerout.length>0) {
      for(let item of row.readerout) {
        let reader=this.options.find(x => x.key==item.objectId);
        if(reader)
          item.system=reader.system;
      }
      sipassout=row.readerout.find(x => x.system==System.SIPASS);
      ccureout=row.readerout.find(x => x.system==System.CCURE);
    }
    
    return {sipassin, sipassout, ccurein, ccureout};
  }

    /// 10) post-edit 寫入修改前要做甚麼調整
    postEdit(row) {
        return this.postAddEdit(row);        
    }
    postAddEdit(row){
        
        row.readerin= [];        
        if(row.sipassin){row.readerin.push(row.sipassin);row.sipassin=undefined;}
        if(row.ccurein){row.readerin.push(row.ccurein);row.ccurein=undefined;}
        row.readerout= [];
        if(row.sipassout){row.readerout.push(row.sipassout);row.sipassout=undefined;}
        if(row.ccureout){row.readerout.push(row.ccureout);row.ccureout=undefined;}
        return row;
    }
    /// Done
    private sipassOptions:any={};
    private ccureOptions:any={};
    private options:{key:any, value:any, system:any}[]=[];
    private doorGroups:any[]=[];
    private areas:any[]=[];
    async created() {
        this.permissionName = PermissionName.door;
        await this.getDoorGroups();
        //await this.getOptions();
    }
    private async getDoorGroups(){
        let resp: any=await this.$server.R("/acs/doorgroup" as any,{ "paging.all": "true" });
        this.doorGroups=resp.results;
        console.log("doorGroups", this.doorGroups)    
    }
    private async getAreas(){
        let resp:any = await this.$server.R("/location/area" as any, {"paging.all":"true"});
        this.areas =  resp.results;
    }

    private async getOptions(readerin?:any[],readerout?:any[]):Promise<void> {
        let resp: any=await this.$server.R("/acs/reader" as any,{ "paging.all": "true", "vacant":"true" });
        let tempOptions=resp.results;        
        if(readerin)tempOptions.push(...readerin);
        if(readerout)tempOptions.push(...readerout);        
        this.options=tempOptions.map(item => { return { key: item.objectId,value: item.readername,system: item.system }; });
        this.sipassOptions={};
        for(let option of this.options.filter(x => x.system==System.SIPASS)){
            this.sipassOptions[option.key]=option.value;
        }
        this.ccureOptions={};
         for(let option of this.options.filter(x => x.system==System.CCURE)){
            this.ccureOptions[option.key]=option.value;
        }
        
        console.log("sipassOptions", this.sipassOptions);
        console.log("ccureOptions", this.ccureOptions);
    }
    getInfo(door:any){
        let group = this.doorGroups.find(x=>x.doors && x.doors.length>0 && x.doors.find(y=>y.objectId==door.objectId));
        let doorgroup = group ? group.groupname : "";
        let area = group && group.area ? group.area.name : "";
        let site = group && group.area && group.area.site ? group.area.site.name : "";
        return {doorgroup, area, site};
    }
    
    getReadersCount(door:any){
        if(!door)return 0;
        let count = door.readerin ? door.readerin.length : 0;
        count += door.readerout ? door.readerout.length : 0;
        
        return count;
    }
    
    
}
</script>


<style lang="scss" scoped>
</style>

