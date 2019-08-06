<template >

     <ivc-basic-report      
        :inf="inf()"
        :title="_('w_DoorGroupReport')"
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
export default class DoorGroupReport extends Vue  {
    records:any[]=[];
    fields:any[] =[];
    isBusy:boolean=false;
    filter:any={};
    created(){        
        this.fields = 
        [       
            // {
            //     key:"accessObjectId"
            // },
            {
                key:"doorGroupName",
                label: this._("w_DoorGroup")
            },
            {
                key:"doorName",
                label: this._("w_Door")
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
                key:"companyName",
                label: this._("w_Member_CompanyName1")
            },           
            {
                key:"workArea",
                label: this._("w_Member_WorkArea1")
            },           
            {
                key: "employeeNumber",
                label: this._('w_Member_EmployeeNumber1')
            },
            {
                key: "resignationDate",
                label: this._('w_Member_ResignationDate1')
            },
            {
                key: "status",
                label: this._('w_Member_Status')
            },
            {
                key:"permissionName",
                label: this._("w_PermissionTable")
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
            let resp: any=await this.$server.R("/report/doorgroup" as any,this.filter||{});
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
             * @uiLabel - ${this._('w_DoorGroup')}
             */
            doorgroupname?: string;
            
            /**
             * @uiColumnGroup - row1
             * @uiType - iv-form-date
             * @uiLabel - ${this._('w_Member_ResignationDate1')}
             */
            ResignDate?:Date;
        }`;
            
    }
    
    async onSubmit(){      
        console.log("filter", this.filter) ;
        await this.getData();
    }
}
</script>

