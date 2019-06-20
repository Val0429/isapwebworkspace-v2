<template>
    <iv-form-quick>
        <!-- 5) custom view templates with <template #view.* /> -->

        <!-- <template #view.firstname="{$attrs, $listeners}">
            <img style="max-width: 150px; max-height: 150px" src="https://res.klook.com/image/upload/fl_lossy.progressive/q_auto/f_auto/c_fill/blogen/5-taipei-hotspots-new-cover.png" />
        </template> -->

        <!-- 6) custom edit / add template with <template #add.* /> -->
        
    </iv-form-quick>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, Observe, toEnumInterface } from "@/../core";
import { EFormQuick, IFormQuick } from '@/../components/form';

@Component
/// 1) class name
export default class ReaderForm extends Vue implements IFormQuick {
    /// 2) cgi path
    path: string = "/acs/reader";
    /// 3) i18n - view / edit / add
    tView: string = "w_Reader";
    tAdd: string = "w_ReaderAdd";
    tEdit: string = "w_ReaderEdit";
    /// 4) possibility - edit / add / delete
    canAdd: boolean = false;
    canEdit: boolean = false;
    canDelete: boolean = false;
    selectedOptions=[];
    options :{key:any, value:any}[]=[];
    /// 4) interfaces - view / edit / add
    inf(type: EFormQuick) {
        switch (type) {
            case EFormQuick.View:
                return `
                interface {
                    /**
                    * @uiLabel - ${this._("system")}
                    */
                    system: string;
                    /**
                    * @uiLabel - ${this._("readerid")}
                    */
                    readerid: string;
                    /**
                    * @uiLabel - ${this._("readername")}
                    */
                    readername: string;                    
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
                    system: string;
                    /**
                    * @uiLabel - ${this._("readerid")}
                    */
                    readerid: string;
                    /**
                    * @uiLabel - ${this._("readername")}
                    */
                    readername: string;                    
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
    created() {
        this.server = this.$server;
        
    }
    
    getName(key:any){
        let item = this.options.find(x=>x.key==key);        
        return item?item.value:'';
    }
}
</script>


<style lang="scss" scoped>
</style>

