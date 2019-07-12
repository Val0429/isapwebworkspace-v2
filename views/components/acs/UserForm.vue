<template>
<div>
    <ivc-filter-form
            :inf="filterInterface()"
            :visible="filterVisible"
            v-on:input="onFilterSubmit($event)"
        />
        <ivc-form-quick 
            v-on:viewChange="viewChange($event)"
            v-on:selectedRows="selectedRows($event)"
            :canAdd="canAdd"
            :canEdit="canEdit"
            :canDelete="canDelete"            
            :allowEdit="allowEdit">  
    
        <!-- 5) custom view templates with <template #view.* /> -->
        <template #view.roles="{$attrs, $listeners}">
            {{$attrs.value && $attrs.value.length > 0 ? $attrs.value.map(x=>x.name).join(", "):"" }}
        </template>
        <template #view.apiRoles="{$attrs, $listeners}">
            {{$attrs.value && $attrs.value.length > 0 ? $attrs.value.map(x=>x.identifier).join(", "):"" }}
        </template>
        
        <!-- 6) custom edit / add template with <template #add.* /> -->
        <template #add.roles="{$attrs, $listeners}" >
            <ivc-multi-selections v-show="roleVisible"
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="roleOptions" />
        </template>
        <template #add.apiRoles="{$attrs, $listeners}" >
            <ivc-multi-selections 
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="apiRoleOptions" />
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
import { PermissionName} from '@/../src/constants/permissions';
@Component
export default class UserForm extends BasicFormQuick implements IFormQuick2 {
   
    system = System;
    /// 2) cgi path
    path: string = "/users";
    /// 3) i18n - view / edit / add
    tView: string = "w_User";
    tAdd: string = "w_UserAdd";
    tEdit: string = "w_UserEdit";
    
    roleOptions :{key:any, value:any}[]=[];
    apiRoleOptions :{key:any, value:any}[]=[];
    /// 4) interfaces - view / edit / add
    inf(type: EFormQuick) {
        switch (type) {
            case EFormQuick.View:
                return `
                interface {                    
                    /**
                         * @uiLabel - ${this._("w_Username")}
                        */
                      username:string;
                      
                      /**
                         * @uiLabel - ${this._("w_ApiRoles")}
                        */
                      apiRoles:string;
                      /**
                         * @uiLabel - ${this._("createdAt")}
                        */
                      createdAt:Date;
                }
                `;
            case EFormQuick.Add:
                return `
                interface {
                        /**
                         * @uiLabel - ${this._("w_Username")}
                        */
                      username:string;
                      /**
                         * @uiLabel - ${this._("w_Password")}
                         * @uiType - iv-form-password
                        */
                      password:string;
                      /**
                         * @uiLabel - ${this._("w_Roles")}
                        */
                      roles?:any;
                      /**
                         * @uiLabel - ${this._("w_ApiRoles")}
                        */
                      apiRoles:any;
                }
                `;
            case EFormQuick.Edit:
                return `
                interface {
                    /**
                     * @uiDisabled - true
                     * @uiLabel - ${this._("w_Username")}
                     */                       
                     username:string;
                    /**
                     * @uiLabel - ${this._("w_ApiRoles")}
                    */
                    apiRoles?:any;
                    /**                        
                     * @uiLabel - ${this._("w_Roles")}
                    */
                    roles?:any;
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
        row.data={};
        row.roles = this.roleOptions.map(x=>x.key);
        return row;
    }
    /// 9) pre-edit 送去修改表單前要做甚麼調整
    preEdit(row) {
        row.roles = row.roles.map(x=>x.name);
        return row;
    }
    /// 10) post-edit 寫入修改前要做甚麼調整
    postEdit(row) {
        return;
    }
    async created(){
        this.permissionName = PermissionName.userManagement;
        await this.getApiRoles();
        this.roleOptions = [{key:"Admin", value:"Admin"},{key:"User", value:"User"}];
    }
    private async getApiRoles(){
        let resp: any=await this.$server.R("/api-permissions/roles" as any,{ "paging.all": "true" });
        this.apiRoleOptions=resp.results.map(x=>{return {key:x.objectId, value:x.identifier} });
        console.log("apiRoleOptions", this.apiRoleOptions)    
    }
    
    roleVisible:boolean = false;
    selectedRows($event){        
        
        this.canDelete= $event && $event.length > 0 && this.$user.user.objectId == $event[0].objectId ? 
            false :
            this.$user.permissions.find(x=>x.access.D === true && x.of.identifier == this.permissionName) != undefined; 
    }
        
}
</script>


<style lang="scss" scoped>
</style>

