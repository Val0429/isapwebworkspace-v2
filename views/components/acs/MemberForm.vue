<template>
    <iv-form-quick>
        <!-- 5) custom view templates with <template #view.* /> -->

        <!-- <template #view.firstname="{$attrs, $listeners}">
            <img style="max-width: 150px; max-height: 150px" src="https://res.klook.com/image/upload/fl_lossy.progressive/q_auto/f_auto/c_fill/blogen/5-taipei-hotspots-new-cover.png" />
        </template> -->

        <!-- 6) custom edit / add template with <template #add.* /> -->
        <template #add.permission="{$attrs, $listeners}">
            <ivc-form-permission 
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="options" 
            />
        </template>
        <template #view.permission="{$attrs, $listeners}" v-if="isMounted">
            {{!$attrs.value || $attrs.value.length==0 ? '' : $attrs.value.map(x=>getName(x)).join(", ")}}
        </template>
    </iv-form-quick>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, Observe, toEnumInterface } from "@/../core";
import { EFormQuick, IFormQuick } from '@/../components/form';

@Component
/// 1) class name
export default class MemberForm extends Vue implements IFormQuick {
    /// 2) cgi path
    path: string = "/acs/member";
    /// 3) i18n - view / edit / add
    tView: string = "w_Member";
    tAdd: string = "w_MemberAdd";
    tEdit: string = "w_MemberEdit";
    /// 4) possibility - edit / add / delete
    canAdd: boolean = true;
    canEdit: boolean = true;
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
                    * @uiLabel - ${this._("memberid")}
                    */
                    memberid: string;
                    /**
                    * @uiLabel - ${this._("firstname")}
                    */
                    firstname: string;
                    /**
                    * @uiLabel - ${this._("middlename")}
                    */
                    middlename: string;
                    /**
                    * @uiLabel - ${this._("lastname")}
                    */
                    lastname: string;
                    /**
                    * @uiLabel - ${this._("status")}
                    */
                    status: number;
                    /**
                    * @uiLabel - ${this._("cardnNum")}
                    */
                    cardnNum: string;
                    /**
                    * @uiLabel - ${this._("createdAt")}
                    */
                    createdAt: Date;
                    /**
                    * @uiLabel - ${this._("updatedAt")}
                    */
                    updatedAt: Date;
                    permission:string;
                }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {
                    /**
                    * @uiLabel - ${this._("memberid")}
                    */
                    memberid: string;
                    /**
                    * @uiLabel - ${this._("firstname")}
                    */
                    firstname: string;
                    /**
                    * @uiLabel - ${this._("middlename")}
                    */
                    middlename: string;
                    /**
                    * @uiLabel - ${this._("lastname")}
                    */
                    lastname: string;
                    /**
                    * @uiLabel - ${this._("status")}
                    */
                    status: number;
                    /**
                    * @uiLabel - ${this._("cardnNum")}                    
                    */
                    cardnNum: string;
                    permission?: any;
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
        this.options.push({key:"1",value:"A"});
        this.options.push({key:"2",value:"B"});
        this.options.push({key:"3",value:"C"});
    }
    isMounted:boolean=false;
    mounted(){
        this.isMounted=true;
    }
    getName(key:any){
        let item = this.options.find(x=>x.key==key);        
        return item?item.value:'';
    }
}
</script>


<style lang="scss" scoped>
</style>

