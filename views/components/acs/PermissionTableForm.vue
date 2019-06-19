<template>
    <iv-form-quick>
        <!-- 5) custom view templates with <template #view.* /> -->

        <template #view.member="{$attrs, $listeners}">
            {{ $attrs.value.length === 0 ? '' : $attrs.value.map(x => getMemberName(x.objectId)).join(', ') }}
        </template>  
        <template #view.timeschedule="{$attrs, $listeners}">
            {{ $attrs.value.length === 0 ? '' : $attrs.value.map(x => getScheduleName(x.objectId)).join(', ') }}
        </template>  
        <!-- 6) custom edit / add template with <template #add.* /> -->
        <template #add.member="{$attrs, $listeners}">
            <ivc-multi-selections 
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="memberOptions" 
            />
        </template>
        <template #add.timeschedule="{$attrs, $listeners}">
            <ivc-multi-selections 
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="schedulesOptions" 
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
    private members:any[]=[];
    private timeschedules:any[]=[];

    memberOptions:{key:any,value:any}[]=[];
    schedulesOptions:{key:any,value:any}[]=[];

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
                    * @uiLabel - ${this._("w_Member")}
                    */ 
                    member:string;
                    /**
                    * @uiLabel - ${this._("w_TimeSchedule")}
                    */ 
                    timeschedule:string;
                    /**
                    * @uiLabel - ${this._("status")}
                    */ 
                    status: number;                    
                    /**
                    * @uiLabel - ${this._("createdAt")}
                    */ 
                    createdAt: Date;
                    /**
                    * @uiLabel - ${this._("updatedAt")}
                    */ 
                    updatedAt: Date;
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
                    * @uiLabel - ${this._("w_Member")}
                    */ 
                    member:any;
                    /**
                    * @uiLabel - ${this._("w_TimeSchedule")}
                    */ 
                    timeschedule:any;
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

    private server;
    async created() {
        this.server = this.$server;        
        let resp1 = await this.server.R("/acs/timeschedule", {});       
        this.timeschedules=resp1.results;
        
        for(let item of resp1.results){
            this.schedulesOptions.push({key:item.objectId, value:item.timename});
        }
        
        console.log("timeschedules", this.schedulesOptions);

        let resp2 = await this.server.R("/acs/member", {});       
        this.members=resp2.results;
        for(let item of resp2.results){
            this.memberOptions.push({key:item.objectId, value:item.firstname + " " + item.lastname});
        }
        console.log("members", this.memberOptions);
    }
    getMemberName(key:any){
        let item = this.memberOptions.find(x=>x.key==key);
        return item?item.value:'';
    }
    getScheduleName(key:any){
        let item = this.schedulesOptions.find(x=>x.key==key);
        return item?item.value:'';
    }
}
</script>


<style lang="scss" scoped>
</style>

