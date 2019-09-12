<template >

     <ivc-basic-report      
        :inf="inf()"
        :title="_('w_DemographicReport')"
        :records="records"
        :isBusy="isBusy"
        :fields="fields"
        v-model="filter"
        :total="total"
        :itemsProvider="itemsProvider"
        v-on:input="onSubmit()"
     />                  
     
</template>
           

<script lang="ts">
import { Component, Vue } from '@/../core';
import { RegisterRouter } from '@/../core/router';
import moment from 'moment';
@Component
export default class DemographicReport extends Vue  {
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
                key: "cardType",
                label: this._('cardType')
            },
            {
                key: "startDate",
                label: this._('startDate')
            },
            {
                key: "endDate",
                label: this._('endDate')
            },
            {
                key: "cardCustodian",
                label: this._('cardCustodian')
            },
            {
                key: "status",
                label: this._("w_Member_Status")
            },
            {
                key: "inOutDailyCount",
                label: this._('w_Report_InOutDailyCount')
            }

        ];

        this.filter={Start : new Date(), End : new Date()};
    }
    
   
    itemsProvider (ctx) {
        // Here we don't set isBusy prop, so busy state will be
        // handled by table itself
        this.isBusy = true

        console.log("filter", this.filter);

        let promise = this.$server.C('/report/demographic'as any, Object.assign({paging:{page:ctx.currentPage, pageSize:ctx.perPage}}, this.filter));

        return promise.then(async (data:any) => {
          this.total = data.paging.total;          
          // Here we could override the busy state, setting isBusy to false
          this.isBusy = false
          return(data.results);
        }).catch(error => {
          // Here we could override the busy state, setting isBusy to false
          this.isBusy = false
          // Returning an empty array, allows table to correctly handle
          // internal busy state in case of error
          return []
        })
      }

    inf():string{
        return `interface {
            /**
             * @uiColumnGroup - row0
             * @uiLabel - ${this._('cardCustodian')}
             */
            CardCustodian?:string;
            /**
             * @uiColumnGroup - row0
             * @uiLabel - ${this._('cardNumber')}
             */
            CardNumber?: string;
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._('chineseName')}
             */
            LastName?: string;
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._('englishName')}
             */
            FirstName?: string;
            /**
             * @uiColumnGroup - row2
             * @uiLabel - ${this._('cardType')}
             */
            CardType?:string;
            /**
             * @uiColumnGroup - row2
             * @uiLabel - ${this._('companyName')}
             */
            CompanyName?:string;
            /**
             * @uiColumnGroup - row3
             * @uiLabel - ${this._('department')}
             */
            DepartmentName?:string;
            /**
             * @uiColumnGroup - row3
             * @uiLabel - ${this._('costCenter')}
             */
            CostCenterName?:string;
            /**
             * @uiColumnGroup - row4
             * @uiLabel - ${this._('workArea')}
             */
            WorkAreaName?:string;
            /**
             * @uiColumnGroup - row4
             * @uiType - iv-form-date
             * @uiLabel - ${this._('startDate')}
             */
            Start:Date;
            /**
             * @uiColumnGroup - row4
             * @uiType - iv-form-date
             * @uiLabel - ${this._('endDate')}
             */
            End:Date;
        }`;
            
    }
    
    async onSubmit(){      
        console.log("filter", this.filter) ;        
    }
}
</script>

