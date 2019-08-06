<template >

     <ivc-basic-report      
        :inf="inf()"
        :title="_('w_EmployeeReport')"
        :records="records"
        :isBusy="isBusy"
        :fields="fields"
        v-model="filter"
        v-on:input="onSubmit()"
     />          
</template>
           

<script lang="ts">
import { Component, Vue } from '@/../core';
import { RegisterRouter } from '@/../core/router';

@Component
export default class AttendanceReport extends Vue  {
    records:any[]=[];
    fields:any[] =[];
    isBusy:boolean=false;
    filter:any={};
    created(){        
        
        this.fields = 
        [       
            {
                key: "employeeNumber",
                label: this._('w_Member_EmployeeNumber1')
            },
            {
                key:"cardNumber",
                label: this._('w_Member_CardNumber1')
            },    
            {
                key:"department",
                label: this._("w_Member_Department1")
            },
            {
                key:"costCenter",
                label: this._("w_Member_CostCenter1")
            },  
            {
                key:"workArea",
                label: this._("w_Member_WorkArea1")
            },           
            {
                key:"chineseName",
                label: this._('w_Member_ChineseName1'),
                sortable: true
            },
            {  
                key:"englishName",
                label: this._('w_Member_EnglishName1'),
                sortable: true
            },
            {
                key: "resignationDate",
                label: this._('w_Member_ResignationDate1')
            },
            {
                key:"permissionName",
                label: this._("w_PermissionTable")
            },
            {
                key:"doorGroupName",
                label: this._("w_DoorGroup")
            },
            {
                key:"doorName",
                label: this._("w_Door")
            },
            {
                key:"timeSchedule",
                label: this._("w_TimeSchedule")
            }
        ];
    }
    
  private async getData() {        
        try{    
            this.isBusy=true;
            if(this.filter && this.filter.ResignDate) this.filter.ResignationDate=this.filter.ResignDate.toISOString();
            let resp: any=await this.$server.R("/report/employee" as any, Object.assign({ShowEmptyCardNumber:true}, this.filter));
            this.records=resp.results;
        }catch(err){
            console.error(err);
        }finally{
            this.isBusy=false;
        }
  }



    inf():string{
        return `interface {
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._('w_Member_EmployeeNumber1')}
             */
            EmployeeNumber?: string;
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._('w_Member_CardNumber1')}
             */
            CardNumber?: string;
            /**
             * @uiColumnGroup - name
             * @uiLabel - ${this._('w_Member_ChineseName1')}
             */
            LastName?: string;
            /**
             * @uiColumnGroup - name
             * @uiLabel - ${this._('w_Member_EnglishName1')}
             */
            FirstName?: string;
            /**
             * @uiColumnGroup - row4
             * @uiType - iv-form-date
             * @uiLabel - ${this._('w_Member_ResignationDate1')}
             */
            ResignDate?:Date;
            /**
             * @uiColumnGroup - row4
             * @uiLabel - ${this._('w_Member_CompanyName1')}
             */
            CompanyName?:string;
            /**
             * @uiColumnGroup - area
             * @uiLabel - ${this._('w_Member_Department1')}
             */
            DepartmentName?:string;
            /**
             * @uiColumnGroup - area
             * @uiLabel - ${this._('w_Member_CostCenter1')}
             */
            CostCenterName?:string;
            
        }`;
            
    }
    
    async onSubmit(){      
        console.log("filter", this.filter) ;
        await this.getData();
    }
}
</script>

