<template>
<div>
    <ivc-filter-form
            :inf="filterInterface()"
            :visible="filterVisible"
            v-on:input="onFilterSubmit($event)"
        />
        <ivc-form-quick v-on:viewChange="viewChange($event)">  
    
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
    /// 4) possibility - edit / add / delete
    // canAdd: boolean = true;
    // canEdit: boolean = true;
    // canDelete: boolean = true;
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
                return `
                    interface {
                        /**
                         * @uiLabel - ${this._("name")}
                        */
                      identifier:string;
                    }
                `;
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
        return;
    }
    /// 9) pre-edit 送去修改表單前要做甚麼調整
    async preEdit(row) {
        row.permissions = await this.getApiPermissions(row.objectId);        
        return row;
    }
    /// 10) post-edit 寫入修改前要做甚麼調整
    async postEdit(row) {
        await this.deletePermissions(row.objectId);
        await this.postPermissions(row, row.objectId);
        return row;
    }
  private async postPermissions(row: any, objectId:string) {
      if(!row.permissions || row.permissions.length<=0)return;
    let promises=[];
    for(let perm of row.permissions) {
      let data=PermissionList.find(x => x.key==this.tokenOptions.find(x => x.key==perm).value);
      if(!data)continue;
      promises.push(this.$server.C("/api-permissions" as any, { token: perm, role: objectId, data: data.access }));
    }
    await Promise.all(promises);
  }

    async deletePermissions(objectId:string){
        
        await this.$server.D("/api-permissions" as any, {objectId});
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

