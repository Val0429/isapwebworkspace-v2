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
                key:"englishName",
                label: this._('englishName'),
                sortable: true
            },
            {  
                key:"chineseName",
                label: this._('chineseName'),
                sortable: true
            },
            {
                key: "companyName",
                label: this._('companyName')
            },
            {
                key: "workArea",
                label: this._('workArea')
            },
            {
                key: "endDate",
                label: this._('endDate')
            },
            {
                key: "cardCustodian",
                label: this._('cardCustodian')
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
             * @uiLabel - ${this._('cardCustodian')}
             */
            CardCustodian?:string;
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._('cardNumber')}
             */
            CardNumber?: string;
            /**
             * @uiColumnGroup - row2
             * @uiLabel - ${this._('chineseName')}
             */
            LastName?: string;
            /**
             * @uiColumnGroup - row2
             * @uiLabel - ${this._('englishName')}
             */
            FirstName?: string;
            /**
             * @uiColumnGroup - row4
             * @uiLabel - ${this._('companyName')}
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

