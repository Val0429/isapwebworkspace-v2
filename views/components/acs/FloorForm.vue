<template>
<div>
    <ivc-filter-form
            :inf="filterInterface()"
            :visible="filterVisible"
            v-on:input="onFilterSubmit($event)"
        />
        <ivc-form-quick v-on:viewChange="viewChange($event)">    
        <!-- 5) custom view templates with <template #view.* /> -->

        
        <!-- 6) custom edit / add template with <template #add.* /> -->
        <!-- <template #view.image="{$attrs, $listeners}">
            <b-img v-bind:src="$attrs.value" fluid class="floor-image"/>
        </template>  -->

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
export default class FloorForm extends BasicFormQuick implements IFormQuick2 {
      
    /// 2) cgi path
    path: string = "/acs/floor";
    /// 3) i18n - view / edit / add
    tView: string = "w_Floor";
    tAdd: string = "w_FloorAdd";
    tEdit: string = "w_FloorEdit";
    
    
    /// 4) interfaces - view / edit / add
    inf(type: EFormQuick) {
        switch (type) {
            case EFormQuick.View:
                return `
                interface {             
                /**
                * @uiLabel - ${this._("name")}
                */
                floorname: string;
                /**
                * @uiLabel - ${this._("ccureid")}
                */
                
                }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {
                           
                /**
                * @uiLabel - ${this._("name")}
                */
                floorname: string;
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
     created(){
         this.permissionName = PermissionName.floor;
     }
    
}
</script>


<style lang="scss" scoped>
.floor-image{
    max-width: 200px;
    height: auto;
}
</style>

