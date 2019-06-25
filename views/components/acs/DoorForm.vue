<template>
    <iv-form-quick>
        <!-- 5) custom view templates with <template #view.* /> -->
        <!-- <template #view="{$attrs, $listeners}">
            {{$attrs.row}}
        </template> -->
        
        <template #view.readerscount="{$attrs, $listeners}">
            {{ getReadersCount($attrs.row) }}
        </template>  
        
        <!-- 6) custom edit / add template with <template #add.* /> -->

        <template #add.ccurein="{$attrs, $listeners}">
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
        </template>
        <template #view.doorgroup="{$attrs, $listeners}">
            {{getInfo($attrs.row).doorgroup}}
        </template>
        <template #view.area="{$attrs, $listeners}">
            {{getInfo($attrs.row).area}}
        </template>
        <template #view.site="{$attrs, $listeners}">
            {{getInfo($attrs.row).site}}
        </template>
    </iv-form-quick>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, Observe, toEnumInterface } from "@/../core";
import { EFormQuick, IFormQuick } from '@/../components/form';
import { System } from '@/config/default/api/interfaces';

@Component
/// 1) class name
export default class DoorForm extends Vue implements IFormQuick {    
    /// 2) cgi path
    path: string = "/acs/door";
    /// 3) i18n - view / edit / add
    tView: string = "w_Door";
    tAdd: string = "w_DoorAdd";
    tEdit: string = "w_DoorEdit";
    /// 4) possibility - edit / add / delete
    canAdd: boolean = true;
    canEdit: boolean = true;
    canDelete: boolean = true;
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
                sipassin?: string;
                 /**
                * @uiLabel - ${"SIPASS"+" "+this._("readerout")}
                */
                sipassout?: string;
                /**
                * @uiLabel - ${"CCURE"+" "+this._("readerin")}
                */
                ccurein?: string;
                /**
                * @uiLabel - ${"CCURE"+" "+this._("readerout")}
                */
                ccureout?: string;
                
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
        return this.postAddEdit(row);     
    }
    /// 9) pre-edit 送去修改表單前要做甚麼調整
    preEdit(row) {
        let props = this.getReaderInfo(row);
        row.sipassin = props.sipassin;
        row.sipassout = props.sipassout;
        row.ccurein = props.ccurein;
        row.ccureout = props.ccureout;
        return row;
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
        row.system = parseInt(row.system);
        row.readerin= [];        
        if(row.sipassin){row.readerin.push(row.sipassin);row.sipassin=undefined;}
        if(row.ccurein){row.readerin.push(row.ccurein);row.ccurein=undefined;}
        row.readerout= [];
        if(row.sipassout){row.readerout.push(row.sipassout);row.sipassout=undefined;}
        if(row.ccureout){row.readerout.push(row.ccureout);row.ccureout=undefined;}
        return row;
    }
    /// Done
    private sipassOptions:{key:any, value:any, system:any}[]=[];
    private ccureOptions:{key:any, value:any, system:any}[]=[];
    private options:{key:any, value:any, system:any}[]=[];
    private doorGroups:any[]=[];
    private areas:any[]=[];
    async created() {
        await Promise.all([this.getOptions(),
        this.getDoorGroups()]);

        console.log("sipassOptions", this.sipassOptions);
        console.log("ccureOptions", this.ccureOptions);
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

    private async getOptions() {
        let resp: any=await this.$server.R("/acs/reader" as any,{ "paging.all": "true" });
        this.options=resp.results.map(item => { return { key: item.objectId,value: item.readername,system: item.system }; });
        this.sipassOptions=this.options.filter(x => x.system==System.SIPASS);
        this.ccureOptions=this.options.filter(x => x.system==System.CCURE);
    }
    getInfo(door:any){
        let group = this.doorGroups.find(x=>x.doors.find(y=>y.objectId==door.objectId));
        let doorgroup = group ? group.groupname : "";
        let area = group && group.area ? group.area.name : "";
        let site = group && group.area && group.area.site ? group.area.site.name : "";
        return {doorgroup, area, site};
    }
    getName(obj:any, options:{key:any, value:any}[]){
        if (!obj)return'';
        let item = options.find(x=>x.key==obj.objectId);
        return item?item.value:'';
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

