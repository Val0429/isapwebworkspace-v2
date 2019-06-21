<template>
    <iv-form-quick>
        <!-- 5) custom view templates with <template #view.* /> -->
        
        <template #view.system="{$attrs, $listeners}">
            {{$attrs.value== 1 ? "SIPASS" : $attrs.value==800 ? "CCURE" : 'UNKNOWN'}}
        </template>
        <template #view.readerin="{$attrs, $listeners}">
            {{ $attrs.value ? getName($attrs.value.objectId, options) : '' }}
        </template>  
        <template #view.readerout="{$attrs, $listeners}">
            {{ $attrs.value ? getName($attrs.value.objectId, options) : '' }}
        </template>  
        <template #add.readerin="{$attrs, $listeners}">
            <ivc-single-selection
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="options" 
            />
        </template>
        <template #add.readerout="{$attrs, $listeners}">
            <ivc-single-selection
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
export default class DoorForm extends Vue implements IFormQuick {
    
    
    
    
    /// 2) cgi path
    path: string = "/acs/door";
    /// 3) i18n - view / edit / add
    tView: string = "w_Door";
    tAdd: string = "w_DoorAdd";
    tEdit: string = "w_DoorEdit";
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
                system:string;
                /**
                * @uiLabel - ${this._("doorid")}
                */
                doorid:string;
                /**
                * @uiLabel - ${this._("doorname")}
                */
                doorname:string;
                /**
                * @uiLabel - ${this._("unlocktime")}
                */
                unlocktime:string;
                /**
                * @uiLabel - ${this._("shunttime")}
                */
                shunttime:string;
                /**
                * @uiLabel - ${this._("status")}
                */
                status: number;
                /**
                * @uiLabel - ${this._("readerin")}
                */
                readerin: string;
                 /**
                * @uiLabel - ${this._("readerout")}
                */
                readerout: string;
                }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {
                    /**
                * @uiLabel - ${this._("system")}
                */
                system: ${toEnumInterface({
                            "1": 'SIPASS',
                            "800": 'CCURE'
                        }, false)};
                /**
                * @uiLabel - ${this._("doorid")}
                */
                doorid:string;
                /**
                * @uiLabel - ${this._("doorname")}
                */
                doorname:string;                
                /**
                * @uiLabel - ${this._("status")}
                */
                status: number;
                /**
                * @uiLabel - ${this._("readerin")}
                */
                readerin: string;
                 /**
                * @uiLabel - ${this._("readerout")}
                */
                readerout: string;
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
    private options:{key:any, value:any}[]=[];
    
    async created() {
        let resp: any = await this.$server.R("/acs/reader" as any, {"paging.all":"true"});

        this.options = resp.results.map(item=>{return{key:item.objectId, value:item.readername}});
        
        console.log("options", this.options)
    }
    getName(key:any, options:{key:any, value:any}[]){
        let item = options.find(x=>x.key==key);
        return item?item.value:'';
    }
    
}
</script>


<style lang="scss" scoped>
</style>

