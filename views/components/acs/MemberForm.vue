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
export default class MemberForm extends Vue implements IFormQuick {
    /// 2) cgi path
    path: string = "/acs/member";
    /// 3) i18n - view / edit / add
    tView: string = "w_Member";
    tAdd: string = "w_MemberAdd";
    tEdit: string = "w_MemberEdit";
    tPreview: string = "Preview";
    /// 4) possibility - edit / add / delete
    canAdd: boolean = true;
    canEdit: boolean = true;
    canPreview: boolean = false;
    canDelete: boolean = false;
    selectedOptions=[];
    options :{key:any, value:any}[]=[];
    /// 4) interfaces - view / edit / add
    inf(type: EFormQuick) {
        switch (type) {
            case EFormQuick.View:
                return `
                interface {
                    EmployeeNumber?: string;                    
                    FirstName?: string;
                    GeneralInformation?: string;
                    LastName?: string;                    
                    PrimaryWorkgroupId?: number;
                    ApbWorkgroupId?: number;
                    PrimaryWorkgroupName?: string;                    
                    SmartCardProfileId?: string;                    
                    Status?: number;            
                    StartDate?: Date;
                    EndDate?: Date;        
                `;
            case EFormQuick.Preview:
                return;
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {
                    EmployeeNumber?: string;                    
                    FirstName?: string;
                    GeneralInformation?: string;
                    LastName?: string;

                    /**
                     * @uiLabel - ${this._("PersonalDetails")}
                     * @uiType - iv-form-header
                     */
                    header?: any;

                    PersonalDetails?: interface {
                        Address?: string;
                        ContactDetails?: any;                    
                        DateOfBirth?: string;
                        PayrollNumber?: string;
                        Title?: string;
                        UserDetails?: interface {
                            UserName?: string;                        
                            /**
                            * @uiType - iv-form-password
                            */
                            Password?: string;                        
                        };
                    };
                    PrimaryWorkgroupId?: number;
                    ApbWorkgroupId?: number;
                    PrimaryWorkgroupName?: string;
                    NonPartitionWorkGroups?: any[];
                    SmartCardProfileId?: string;                    
                    Status?: number;
                    /**
                     * @uiType - iv-form-date
                     */
                    StartDate?: string;
                    /**
                     * @uiType - iv-form-date
                     */
                    EndDate?: string;
                    Token?: string;
                    TraceDetails?: any;
                    Vehicle1?: any;
                    Vehicle2?: any;
                    Potrait?: string;
                    PrimaryWorkGroupAccessRule?: any[];
                    NonPartitionWorkgroupAccessRules?: any[];
                    VisitorDetails?: any;
                    CustomFields?: any[];
                    FingerPrints?: any[];
                    CardholderPortrait?: string;
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
    tryConvertDate(date:string){
        try{
            return new Date(date);
        }catch(err){
            console.error("invalid date", date);            
        }
    }
    /// 9) pre-edit 送去修改表單前要做甚麼調整
    preEdit(row) {        
        row.EndDate = this.tryConvertDate(row.EndDate);
        row.StartDate = this.tryConvertDate(row.StartDate);
        if(!row.PersonalDetails)row.PersonalDetails={};
        return;
    }
    /// 10) post-edit 寫入修改前要做甚麼調整
    postEdit(row) {
        row.Credentials = undefined;
        row.AccessRules = undefined;
        row.CustomFields = undefined;
        return row;
    }
    /// Done
    
    getName(key:any){
        let item = this.options.find(x=>x.key==key);        
        return item?item.value:'';
    }
    
}
</script>


<style lang="scss" scoped>
</style>

