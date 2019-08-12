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
       
       <template #view.floors="{$attrs, $listeners}">
            {{ $attrs.value? $attrs.value.filter(x=>x.status==1).length : '0'}}
        </template>  
        <template #add.floors="{$attrs, $listeners}">
            <ivc-multi-selections 
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="options" 
            />
        </template>
        
        <!-- 6) custom edit / add template with <template #add.* /> -->

    </ivc-form-quick>
    </div>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, Observe, toEnumInterface } from "@/../core";
import { EFormQuick} from '@/../components/form/helpers/form-quick/form-quick.vue.ts';
import { IFormQuick2 } from '@/components/form/form-quick/form-quick.vue.ts'
import { BasicFormQuick } from './basic-form-quick';
import { PermissionName} from '@/../src/constants/permissions';

@Component
/// 1) class name
export default class FloorGroup extends BasicFormQuick implements IFormQuick2 {

    
    /// 2) cgi path
    path: string = "/acs/floorgroup";
    /// 3) i18n - view / edit / add
    tView: string = "w_FloorGroup";
    tAdd: string = "w_FloorGroupAdd";
    tEdit: string = "w_FloorGroupEdit";
    
    /// 4) interfaces - view / edit / add
    inf(type: EFormQuick) {
        switch (type) {
            case EFormQuick.View:
                return `
                interface {   
                    /**
                    * @uiLabel - ${this._("groupname")}
                    */
                    groupname: string;
                    /**
                    * @uiLabel - ${this._("floor")}
                    */
                    floors?:any;
                }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {
                    /**
                    * @uiLabel - ${this._("groupname")}
                    */
                    groupname: string;
                    /**
                    * @uiLabel - ${this._("floor")}
                    */
                    floors?:any;                   
                   
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
        row.floors = row.floors.filter(x=>x.status==1);
        return row;
    }
    /// 10) post-edit 寫入修改前要做甚麼調整
    postEdit(row) {
        return;
    }
    /// Done
    private options:{key:any, value:any}[]=[];
    
    async created() {
        this.permissionName = PermissionName.floorgroup;
        let resp:any = await this.$server.R("/acs/floor" as any, {"paging.all":"true"});

        this.options = resp.results.map(floor=>{return{key:floor.objectId, value:floor.floorname}});
        
        console.log("floors", this.options)
    }
}
</script>


<style lang="scss" scoped>
</style>

