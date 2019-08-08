<template >

     <ivc-basic-report      
        :inf="inf()"
        :title="_('w_DoorReport')"
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
export default class DoorReport extends Vue  {
    records:any[]=[];
    fields:any[] =[];
    isBusy:boolean=false;
    filter:any={};
    created(){        
        this.fields = 
       [       
            {
                key:"cardNumber",
                label: this._('cardNumber')
            },                
            {
                key:"department",
                label: this._("department")
            },
            {
                key:"costCenter",
                label: this._("costCenter")
            },  
            {
                key:"chineseName",
                label: this._('chineseName'),
                sortable: true
            },
            {  
                key:"englishName",
                label: this._('englishName'),
                sortable: true
            },
            {
                key:"companyName",
                label: this._("companyName")
            },           
            {
                key:"workArea",
                label: this._("workArea")
            },           
            {
                key: "employeeNumber",
                label: this._('employeeNumber')
            },
            {
                key: "resignationDate",
                label: this._('resignationDate')
            },
            {
                key: "Status",
                label: this._('w_Member_Status')
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
            let resp: any=await this.$server.R("/report/door" as any,this.filter||{});
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
             * @uiLabel - ${this._('w_Door')}
             */
            doorname?: string;
            
            /**
             * @uiColumnGroup - row1
             * @uiType - iv-form-date
             * @uiLabel - ${this._('resignationDate')}
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

