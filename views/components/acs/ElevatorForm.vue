<template>
    <iv-form-quick>
        <!-- 5) custom view templates with <template #view.* /> -->

        <template #view.reader="{$attrs, $listeners}">
            {{ $attrs.value && $attrs.value.length > 0 ? $attrs.value.map(x => getName(x.objectId, floorOptions)).join(', '):'' }}
        </template>

        <!-- 6) custom edit / add template with <template #add.* /> -->
        <template #add.reader="{$attrs, $listeners}">
            <ivc-multi-selections 
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="floorOptions" 
            />
        </template>
    </iv-form-quick>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, Observe, toEnumInterface } from "@/../core";
import { EFormQuick, IFormQuick } from '@/../components/form';

@Component
/// 1) class name
export default class ElevatorForm extends Vue implements IFormQuick {
    /// 2) cgi path
    path: string = "/acs/elevator";
    /// 3) i18n - view / edit / add
    tView: string = "w_Elevator";
    tAdd: string = "w_ElevatorAdd";
    tEdit: string = "w_ElevatorEdit";
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
                    * @uiLabel - ${this._("system")}
                    */
                    system: number;
                    /**
                    * @uiLabel - ${this._("elevatorid")}
                    */
                    elevatorid: number;
                    /**
                    * @uiLabel - ${this._("name")}
                    */
                    elevatorname: string;
                    /**
                    * @uiLabel - ${this._("reader")}
                    */
                    reader:string;                    
                    /**
                    * @uiLabel - ${this._("status")}
                    */
                    status: number;
                    
                }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {
                    /**
                    * @uiLabel - ${this._("system")}
                    */
                    system: number;
                    /**
                    * @uiLabel - ${this._("elevatorid")}
                    */
                    elevatorid: number;
                    /**
                    * @uiLabel - ${this._("name")}
                    */
                    elevatorname: string;
                    /**
                    * @uiLabel - ${this._("reader")}
                    */
                    reader:string;                    
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
    floorOptions=[];
    async created(){
        await this.getFloorOptions();
    }
    private async getFloorOptions() {
        let resp: any =await this.$server.R("/acs/floor" as any,{"paging.all":"true"});    
        
        this.floorOptions = resp.results.map(item=>{return { key: item.objectId,value: item.floorname }});
        
        console.log("floorOptions",this.floorOptions);
    }
    getName(key:any, options:{key:any, value:any}[]){
        let item = options.find(x=>x.key==key);
        return item?item.value:'';
    }
}
</script>


<style lang="scss" scoped>
</style>

