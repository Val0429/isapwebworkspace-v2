<template>
    <iv-form-quick>
        <!-- 5) custom view templates with <template #view.* /> -->

        <template #view.accesslevels="{$attrs, $listeners}">
            {{ !$attrs.value || $attrs.value.length === 0 ? '' : $attrs.value.map(x => getName(x.objectId, levelOptions)).join(', ') }}
        </template>  
        
        <!-- 6) custom edit / add template with <template #add.* /> -->
        <template #add.accesslevels="{$attrs, $listeners}">
            <ivc-multi-selections 
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="levelOptions" 
            />
        </template>
        
    </iv-form-quick>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, Observe, toEnumInterface } from "@/../core";
import { EFormQuick, IFormQuick } from '@/../components/form';

@Component
/// 1) class name
export default class PermissionTableForm extends Vue implements IFormQuick {
    

    

    /// 2) cgi path
    path: string = "/acs/permissiontable";
    /// 3) i18n - view / edit / add
    tView: string = "w_PermissionTable";
    tAdd: string = "w_PermissionTableAdd";
    tEdit: string = "w_PermissionTableEdit";
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
                    * @uiLabel - ${this._("tableid")}
                    */      
                    tableid: string;
                    /**
                    * @uiLabel - ${this._("tablename")}
                    */ 
                    tablename:string;
                    
                    /**
                    * @uiLabel - ${this._("w_TimeSchedule")}
                    */                     
                    status: number;                    
                    /**
                    * @uiLabel - ${this._("w_AccessLevel")}
                    */
                    accesslevels:string;
                }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {      
                    /**
                    * @uiLabel - ${this._("tableid")}
                    */      
                    tableid: string;
                    /**
                    * @uiLabel - ${this._("tablename")}
                    */ 
                    tablename:string;
                    
                    /**
                    * @uiLabel - ${this._("w_TimeSchedule")}
                    */                     
                    status: number;                    
                    /**
                    * @uiLabel - ${this._("w_AccessLevel")}
                    */
                    accesslevels:string;  
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
    levelOptions:{key:any,value:any}[]=[];
    async created() {
        await this.getLevelOptions();
    }
    private async getLevelOptions() {
        let resp: any =await this.$server.R("/acs/accesslevel" as any,{"paging.all":"true"});    
        this.levelOptions = resp.results.map(item=>{return { key: item.objectId,value: item.levelname }});
        
        console.log("levelOptions",this.levelOptions);
    }
    getName(key:any, options:{key:any,value:any}[]){
        let item = options.find(x=>x.key==key);
        return item?item.value:'';
    }
}
</script>


<style lang="scss" scoped>
</style>

