<template>
<div>
    <ivc-filter-form
            :inf="filterInterface()"
            :visible="filterVisible"
            v-on:input="onFilterSubmit($event)"
        />
        <ivc-form-quick
            :canAdd="canAdd"
            :canEdit="canEdit"
            :canDelete="canDelete"
            :allowEdit="allowEdit"
            v-on:selectedRows="selectedRows($event)"
            v-on:viewChange="viewChange($event)">  
    
        <!-- 5) custom view templates with <template #view.* /> -->
        <template #view.roles="{$attrs, $listeners}">
            {{$attrs.value && $attrs.value.length > 0 ? $attrs.value.map(x=>x.name).join(", "):"" }}
        </template>
        
        <!-- 6) custom edit / add template with <template #add.* /> -->
        
        <template #add.permissions="{$attrs, $listeners}">
            <ivc-multi-selections
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="tokenOptions" />
        </template>
    </ivc-form-quick>
    </div>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, Observe, toEnumInterface } from "@/../core";
import { EFormQuick} from '@/../components/form/helpers/form-quick/form-quick.vue.ts';
import { IFormQuick2 } from '@/components/form/form-quick/form-quick.vue.ts';
import { System } from '@/config/default/api/interfaces';
import { BasicFormQuick } from './basic-form-quick';
import { PermissionName, PermissionList} from '@/../src/constants/permissions';
@Component
export default class UserPermissionForm extends BasicFormQuick implements IFormQuick2 {
   
    system = System;
    /// 2) cgi path
    path: string = "/api-permissions/roles";
    /// 3) i18n - view / edit / add
    tView: string = "w_UserPermission";
    tAdd: string = "w_UserPermissionAdd";
    tEdit: string = "w_UserPermissionEdit";
    
    tokenOptions :{key:any, value:any}[]=[];
    apiRoleOptions :{key:any, value:any}[]=[];
    /// 4) interfaces - view / edit / add
    inf(type: EFormQuick) {
        switch (type) {
            case EFormQuick.View:
                return `
                interface {                    
                    /**
                         * @uiLabel - ${this._("name")}
                        */
                      identifier:string;
                      /**
                         * @uiLabel - ${this._("createdAt")}
                        */
                      createdAt:Date;
                }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {
                    /**
                    * @uiLabel - ${this._("name")}
                    */
                    identifier:string;
                    /**
                    * @uiLabel - ${this._("w_ApiRoles")}
                    */
                    permissions:any;
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
        row.permissions=this.getNewPermissions(row);
        return row;
    }
    /// 9) pre-edit 送去修改表單前要做甚麼調整
    async preEdit(row) {                
        row.permissions = await this.getApiPermissions(row.objectId);        
        return row;
    }
    /// 10) post-edit 寫入修改前要做甚麼調整
    postEdit(row) {
        row.permissions=this.getNewPermissions(row);
        return row;
    }
    getNewPermissions(row:any){
        let newPermissions=[];
        for(let perm of row.permissions) {
            let data=PermissionList.find(x => x.key==this.tokenOptions.find(x => x.key==perm).value);
            if(!data)continue;
            newPermissions.push({objectId:perm, value:data.access})
        }
        return newPermissions;
    }
    
    selectedRows($event){
        
        this.allowEdit=true;
        this.canDelete = this.$user.permissions.find(x=>x.access.D === true && x.of.identifier == this.permissionName) != undefined; 
        //console.log("this.$user", this.$user);
        //console.log("$event", $event);
        for(let event of $event){
            let exists = this.$user.user.apiRoles.find(x=>x.objectId == event.objectId);
            //console.log("exists", exists);
            if(!exists)continue;
            this.allowEdit=false;
            this.canDelete = false;
            return;
        }
    }

    async created(){
        this.permissionName = PermissionName.user;        
        await this.getApiToken();
       
    }
    private async getApiPermissions(objectId:string){
        let resp: any=await this.$server.R("/api-permissions" as any,{ "paging.all": "true", role:objectId });

        return resp.results.map(x=> x.of);
    }
    private async getApiToken(){
        let resp: any=await this.$server.R("/api-permissions/tokens" as any,{ "paging.all": "true" });
        this.tokenOptions=resp.results.map(x=>{return {key:x.objectId, value:x.identifier} });
        console.log("tokenOptions", this.tokenOptions);    
    }
    
    
        
}
</script>


<style lang="scss" scoped>
</style>

