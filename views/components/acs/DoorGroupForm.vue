<template>
    <iv-form-quick>
        <!-- 5) custom view templates with <template #view.* /> -->

        <template #view.doors="{$attrs, $listeners}">
            {{ $attrs.value.length === 0 ? '' : $attrs.value.map(x => getName(x.objectId)).join(', ') }}
        </template>  
        <template #add.doors="{$attrs, $listeners}">
            <ivc-multi-selections 
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="options" 
            />
        </template>
        
        <!-- 6) custom edit / add template with <template #add.* /> -->

    </iv-form-quick>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, Observe, toEnumInterface } from "@/../core";
import { EFormQuick, IFormQuick } from '@/../components/form';

@Component
/// 1) class name
export default class DoorGroupForm extends Vue implements IFormQuick {
    private doors:any[]=[];
    private options:{key:any, value:any}[]=[];
    
    
    
    /// 2) cgi path
    path: string = "/acs/doorgroup";
    /// 3) i18n - view / edit / add
    tView: string = "w_DoorGroup";
    tAdd: string = "w_DoorGroupAdd";
    tEdit: string = "w_DoorGroupEdit";
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
                    * @uiLabel - ${this._("groupid")}
                    */
                    groupid:number;       
                    /**
                    * @uiLabel - ${this._("groupname")}
                    */
                    groupname: string;
                    /**
                    * @uiLabel - ${this._("doors")}
                    */
                    doors:string;
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
                    * @uiLabel - ${this._("groupid")}
                    */
                    groupid:number;       
                    /**
                    * @uiLabel - ${this._("groupname")}
                    */
                    groupname: string;
                    /**
                    * @uiLabel - ${this._("doors")}
                    */
                    doors:any;                   
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
        let resp = await this.server.R("/acs/door", {"paging.all":"true"});       
        this.doors=resp.results;
        for(let door of resp.results){
            this.options.push({key:door.objectId, value:door.doorname});
        }
        console.log("doors", this.options)
    }
    getName(key:any){
        let item = this.options.find(x=>x.key==key);
        return item?item.value:'';
    }
    
}
</script>


<style lang="scss" scoped>
</style>

