<template>
    <iv-form-quick>
        <!-- 5) custom view templates with <template #view.* /> -->

        <template #view.member="{$attrs, $listeners}">
            {{ $attrs.value.length === 0 ? '' : $attrs.value.map(value => value.firstname+ " "+ value.lastname).join(', ') }}
        </template>  
        <template #view.timeschedule="{$attrs, $listeners}">
            {{ $attrs.value.length === 0 ? '' : $attrs.value.map(value => value.timename).join(', ') }}
        </template>  
        <!-- 6) custom edit / add template with <template #add.* /> -->

    </iv-form-quick>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, Observe, toEnumInterface } from "@/../core";
import { EFormQuick, IFormQuick } from '@/../components/form';

@Component
/// 1) class name
export default class PermissionTableForm extends Vue implements IFormQuick {
    private members:any={};
    private timeschedules:any={};
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
                    member:${toEnumInterface(this.members,true)};
                    /**
                    * @uiLabel - ${this._("w_TimeSchedule")}
                    */ 
                    timeschedule:${toEnumInterface(this.timeschedules,true)};
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
        this.timeschedules={};
        for(let ts of resp1.results){
            this.timeschedules[ts.objectId]=ts.timename;
        }
        console.log("timeschedules", this.timeschedules);

        let resp2 = await this.server.R("/acs/member", {});       
        this.members={};
        for(let m of resp2.results){
            this.members[m.objectId]=m.firstname + " " + m.lastname;
        }
        console.log("members", this.members);
    }
}
</script>


<style lang="scss" scoped>
</style>

