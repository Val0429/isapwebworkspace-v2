<template>
    <iv-form-quick>
        <!-- 5) custom view templates with <template #view.* /> -->

        <template #view.system="{$attrs, $listeners}">
            {{$attrs.value== 1 ? "SIPASS" : $attrs.value==800 ? "CCURE" : 'UNKNOWN'}}
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
        
    </iv-form-quick>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, Observe, toEnumInterface } from "@/../core";
import { EFormQuick, IFormQuick } from '@/../components/form';

@Component
/// 1) class name
export default class ReaderForm extends Vue implements IFormQuick {
    /// 2) cgi path
    path: string = "/acs/reader";
    /// 3) i18n - view / edit / add
    tView: string = "w_Reader";
    tAdd: string = "w_ReaderAdd";
    tEdit: string = "w_ReaderEdit";
    /// 4) possibility - edit / add / delete
    canAdd: boolean = false;
    canEdit: boolean = false;
    canDelete: boolean = false;
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
                    /**
                    * @uiLabel - ${this._("status")}
                    */
                    status: number;
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
    getName(key:any){
        let item = this.options.find(x=>x.key==key);        
        return item?item.value:'';
    }
    doors:any[]=[];
    doorGroups:any[]=[];
    async created(){
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
        let doorin = this.doors.find(x=>x.readerin && x.readerin.length>0 && x.readerin.find(y=>y.objectId==objectId));
        let doorout = this.doors.find(x=>x.readerout&& x.readerout.length>0 && x.readerout.find(y=>y.objectId==objectId));        
        let io = doorin ? "IN" : doorout ? "OUT" : "";
        let doorname= doorin ? doorin.doorname : doorout ? doorout.doorname : "";
        let groupin:any;
        if(doorin){
            groupin = this.doorGroups.find(x=>x.doors.find(y=>y.objectId==doorin.objectId));
        }
        let groupout:any;
        if(doorout){
            groupout = this.doorGroups.find(x=>x.doors.find(y=>y.objectId==doorout.objectId));
        }
        
        let groupname = groupin ? groupin.groupname : groupout ? groupout.groupname : "";
        return {io,doorname,groupname};
    }
    
    
        
}
</script>


<style lang="scss" scoped>
</style>

