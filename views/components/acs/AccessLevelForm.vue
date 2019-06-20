<template>
    <iv-form-quick>
        <!-- 5) custom view templates with <template #view.* /> -->

        <template #view.reader="{$attrs, $listeners}">
            {{ $attrs.value.length === 0 ? '' : $attrs.value.map(x => getName(x.objectId, readerOptions)).join(', ') }}
        </template>
        <template #view.door="{$attrs, $listeners}">
            {{ $attrs.value ? getName($attrs.value.objectId, doorOptions): ''}}
        </template>
        <template #view.timeschedule="{$attrs, $listeners}">
            {{ $attrs.value ? getName($attrs.value.objectId, scheduleOptions): ''}}
        </template>
        <template #add.reader="{$attrs, $listeners}">
            <ivc-multi-selections 
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="readerOptions" 
            />
        </template>
        <template #add.door="{$attrs, $listeners}">
            <ivc-single-selection
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="doorOptions" 
            />
        </template>
        <template #add.timeschedule="{$attrs, $listeners}">
            <ivc-single-selection
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="scheduleOptions" 
            />
        </template>
        
        <!-- 6) custom edit / add template with <template #add.* /> -->

    </iv-form-quick>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, Observe, toEnumInterface } from "@/../core";
import { EFormQuick, IFormQuick } from '@/../components/form';

@Component
/// 1) class name
export default class AccessLevelForm extends Vue implements IFormQuick {   
    
    /// 2) cgi path
    path: string = "/acs/accesslevel";
    /// 3) i18n - view / edit / add
    tView: string = "w_AccessLevel";
    tAdd: string = "w_AccessLevel";
    tEdit: string = "w_AccessLevel";
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
                    * @uiLabel - ${this._("levelid")}
                    */
                    levelid:string;       
                    /**
                    * @uiLabel - ${this._("levelname")}
                    */
                    levelname: string;
                    /**
                    * @uiLabel - ${this._("door")}
                    */
                    door:string;
                    /**
                    * @uiLabel - ${this._("status")}
                    */
                    status: number;
                    /**
                    * @uiLabel - ${this._("reader")}
                    */
                    reader:string;
                    /**
                    * @uiLabel - ${this._("timeschedule")}
                    */
                    timeschedule:string;
                }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {
                    /**
                    * @uiLabel - ${this._("levelid")}
                    */
                    levelid:string;       
                    /**
                    * @uiLabel - ${this._("levelname")}
                    */
                    levelname: string;
                    /**
                    * @uiLabel - ${this._("door")}
                    */
                    door:any;
                    /**
                    * @uiLabel - ${this._("status")}
                    */
                    status: number;
                    /**
                    * @uiLabel - ${this._("reader")}
                    */
                    reader:any[];
                    /**
                    * @uiLabel - ${this._("timeschedule")}
                    */
                    timeschedule:string;
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
    private doorOptions:any[]=[];    
    private scheduleOptions:any[]=[];    
    private readerOptions:{key:any, value:any}[]=[];
    
    
    async created() {
        await this.getReaderOptions();
        await this.getDoorOptions();
        await this.getScheduleOptions();
    }
    private async getScheduleOptions() {
        let resp: any =await this.$server.R("/acs/timeschedule" as any,{"paging.all":"true"});    
        
        this.scheduleOptions= resp.results.map(item=>{return { key: item.objectId,value: item.timename }});
        
        console.log("scheduleOptions",this.scheduleOptions);
    }
    private async getDoorOptions() {
        let resp: any =await this.$server.R("/acs/door",{"paging.all":"true"});    
        
        this.doorOptions = resp.results.map(item=>{return { key: item.objectId,value: item.doorname }});
        
        console.log("doorOptions",this.doorOptions);
    }

    private async getReaderOptions() {
        let resp: any =await this.$server.R("/acs/reader" as any,{"paging.all":"true"});    
        
        this.readerOptions = resp.results.map(item=>{return { key: item.objectId,value: item.readername }});
        
        console.log("readerOptions",this.readerOptions);
    }

    getName(key:any, options:{key:any,value:any}[]){
        let item = options.find(x=>x.key==key);
        return item?item.value:'';
    }
    
}
</script>


<style lang="scss" scoped>
</style>

