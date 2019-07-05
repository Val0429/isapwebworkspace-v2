<template>
   <div>
    <ivc-filter-form
            :inf="filterInterface()"
            :visible="filterVisible"
            v-on:input="onFilterSubmit($event)"
        />
    <ivc-form-quick v-on:viewChange="viewChange($event)">    
        <!-- 5) custom view templates with <template #view.* /> -->
        <template #view.system="{$attrs, $listeners}">
            {{$attrs.value== system.SIPASS ? "SIPASS" : $attrs.value==system.CCURE ? "CCURE" : 'UNKNOWN'}}
        </template>
        <template #view.reader="{$attrs, $listeners}">
            {{ $attrs.value && $attrs.value.length > 0 ? $attrs.value.map(x => getName(x.objectId, floorOptions)).join(', '):'' }}
        </template>
        <template #view.elevatorgroup="{$attrs, $listeners}">
            {{getInfo($attrs.row).elevatorgroup}}
        </template>
        <template #view.area="{$attrs, $listeners}">
            {{getInfo($attrs.row).area}}
        </template>
        <template #view.site="{$attrs, $listeners}">
            {{getInfo($attrs.row).site}}
        </template>
        <!-- 6) custom edit / add template with <template #add.* /> -->
        <template #add.reader="{$attrs, $listeners}">
            <ivc-multi-selections 
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="floorOptions" 
            />
        </template>
        
    </ivc-form-quick>
   </div>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, Observe, toEnumInterface } from "@/../core";
import { EFormQuick} from '@/../components/form/helpers/form-quick/form-quick.vue.ts';
import { IFormQuick2 } from '@/components/form/form-quick/form-quick.vue.ts'
import { System } from '@/config/default/api/interfaces';
import { BasicFormQuick } from './basic-form-quick';
import { PermissionName} from '@/../src/constants/permissions';
@Component
/// 1) class name
export default class ElevatorForm extends BasicFormQuick implements IFormQuick2 {

    system = System;
    /// 2) cgi path
    path: string = "/acs/elevator";
    /// 3) i18n - view / edit / add
    tView: string = "w_Elevator";
    tAdd: string = "w_ElevatorAdd";
    tEdit: string = "w_ElevatorEdit";
    
    
    /// 4) interfaces - view / edit / add
    inf(type: EFormQuick) {
        switch (type) {
            case EFormQuick.View:
                return `
                interface {
                /**
                * @uiLabel - ${this._("system")}
                */    
                system:string;
                /**
                * @uiLabel - ${this._("w_Region_LevelSite")}
                */
                site:string;
                /**
                * @uiLabel - ${this._("w_Region_LevelArea")}
                */
                area:string;
                /**
                * @uiLabel - ${this._("w_ElevatorGroup")}
                */
                elevatorgroup:string;
                    /**
                    * @uiLabel - ${this._("name")}
                    */
                    elevatorname: string;
                    /**
                    * @uiLabel - ${this._("reader")}
                    */
                    reader:string;                    
                    
                    
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
                    system:number;
                    /**
                    * @uiLabel - ${this._("name")}
                    */
                    elevatorname: string;
                    /**
                    * @uiLabel - ${this._("reader")}
                    */
                    reader:string;                                        
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
    floorOptions=[];
    elevatorGroups =[];
    async created(){
        this.permissionName = PermissionName.elevator;
        await Promise.all([this.getFloorOptions(),this.getElevatorGroups()]);
    }
    private async getFloorOptions() {
        let resp: any =await this.$server.R("/acs/floor" as any,{"paging.all":"true"});    
        
        this.floorOptions = resp.results.map(item=>{return { key: item.objectId,value: item.floorname }});
        
        console.log("floorOptions",this.floorOptions);
    }
    private async getElevatorGroups(){
        let resp: any=await this.$server.R("/acs/elevatorgroup" as any,{ "paging.all": "true" });
        this.elevatorGroups=resp.results;
        console.log("elevatorGroups", this.elevatorGroups)    
    }
     getInfo(elevator:any){
        let group = this.elevatorGroups.find(x=>x.elevators.find(y=>y.objectId==elevator.objectId));
        let elevatorgroup = group ? group.groupname : "";
        let area = group && group.area ? group.area.name : "";
        let site = group && group.area && group.area.site ? group.area.site.name : "";
        return {elevatorgroup, area, site};
    }
    
}
</script>


<style lang="scss" scoped>
</style>

