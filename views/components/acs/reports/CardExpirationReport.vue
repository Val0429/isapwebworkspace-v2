<template >

     <ivc-basic-report      
        :inf="inf()"
        :title="_('w_CardExpirationReport')"
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
export default class CardExpirationReport extends Vue  {
    records:any[]=[];
    fields:any[] =[];
    isBusy:boolean=false;
    filter:any={};
    async created(){        
        this.fields = 
        [     
            {
                key:"CardNumber",
                label: this._('w_Member_CardNumber1')
            },
            {
                key:"DepartmentName",
                label: this._("w_Member_Department1")
            },            
            {
                key:"CostCenterName",
                label: this._("w_Member_CostCenter1")
            },
            {
                key:"FirstName",
                label: this._('w_Member_EnglishName1'),
                sortable: true
            },
            {  
                key:"LastName",
                label: this._('w_Member_ChineseName1'),
                sortable: true
            },
            {
                key: "CompanyName",
                label: this._('w_Member_CompanyName1')
            },
            {
                key: "WorkArea",
                label: this._('w_Member_WorkArea1')
            },
            {
                key: "EndDate",
                label: this._('w_Member_EndDate1')
            },
            {
                key: "CardCustodian",
                label: this._('w_Member_CardCustodian1')
            }

        ];

    }
    
  private async getData() { 
      try{
      if(!this.filter)return;
      if(this.filter.End)this.filter.EndDate = this.filter.End.toISOString();
        this.isBusy=true;            
        let resp: any=await this.$server.R("/report/expiredcard" as any, Object.assign({"expired":true}, this.filter));
        this.records = resp.results;
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
             * @uiLabel - ${this._('w_Member_CardCustodian1')}
             */
            CardCustodian?:string;
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._('w_Member_CardNumber1')}
             */
            CardNumber?: string;
            /**
             * @uiColumnGroup - row2
             * @uiLabel - ${this._('w_Member_ChineseName1')}
             */
            LastName?: string;
            /**
             * @uiColumnGroup - row2
             * @uiLabel - ${this._('w_Member_EnglishName1')}
             */
            FirstName?: string;
            /**
             * @uiColumnGroup - row4
             * @uiLabel - ${this._('w_Member_CompanyName1')}
             */
            CompanyName?:string;
            
            
        }`;
            
    }
    
    async onSubmit(){      
        console.log("filter", this.filter) ;
        await this.getData();
    }
}
</script>

