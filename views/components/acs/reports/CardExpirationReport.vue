<template >

     <ivc-basic-report      
        :inf="inf()"
        :title="_('w_CardExpirationReport')"
        :records="records"
        :isBusy="isBusy"
        :fields="fields"
        v-model="filter"
        :itemsProvider="itemsProvider"
        :total="total"
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
    total:number=0;
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
  itemsProvider (ctx) {
        // Here we don't set isBusy prop, so busy state will be
        // handled by table itself
        // this.isBusy = true

        console.log("filter", this.filter);

        let promise = this.$server.C('/report/expiredcard'as any, Object.assign({paging:{page:ctx.currentPage, pageSize:ctx.perPage}}, this.filter));

        return promise.then(async (data:any) => {
          this.total = data.paging.total;          
          // Here we could override the busy state, setting isBusy to false
          // this.isBusy = false
          return(data.results);
        }).catch(error => {
          // Here we could override the busy state, setting isBusy to false
          // this.isBusy = false
          // Returning an empty array, allows table to correctly handle
          // internal busy state in case of error
          return []
        })
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
        //wait this.getData();
    }
}
</script>

