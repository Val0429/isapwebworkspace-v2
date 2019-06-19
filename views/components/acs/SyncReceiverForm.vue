<template>
    <iv-form-quick>
        <!-- 5) custom view templates with <template #view.* /> -->

        <template #view.receivers="{$attrs, $listeners}" >
            <div class="col-md-6" v-for="item of $attrs.value" v-bind:key="item.receivename+item.emailaddress">
                {{item.receivename}} -
                {{item.emailaddress}}
            </div>
        </template> 
        <template #add.receivers="{$attrs, $listeners}">
            <ivc-syncreceiver
             v-bind="$attrs" 
             v-on="$listeners" 
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
export default class SyncReceiverForm extends Vue implements IFormQuick {
    /// 2) cgi path
    path: string = "/acs/syncreceiver";
    /// 3) i18n - view / edit / add
    tView: string = "w_SyncReceiver";
    tAdd: string = "w_SyncReceiverAdd";
    tEdit: string = "w_SyncReceiverEdit";
    /// 4) possibility - edit / add / delete
    canAdd: boolean = true;
    canEdit: boolean = true;
    canDelete: boolean = true;
    selectedOptions=[];
    options :{key:any, value:any}[]=[];
    /// 4) interfaces - view / edit / add
    inf(type: EFormQuick) {
        switch (type) {
            case EFormQuick.View:
                return `
                interface {                    
                    /**
                    * @uiLabel - ${this._("receivers")}                    
                    */
                    receivers: string;
                                      
                }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {
                    /**
                    * @uiLabel - ${this._("receivers")}
                    */
                    receivers: any[];
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

