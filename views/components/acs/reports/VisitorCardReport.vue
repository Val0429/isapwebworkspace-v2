<template >
<div>
     <ivc-basic-report          
        :inf="inf()"
        :title="_('w_VisitorCardReport')"
        :records="records"
        :isBusy="isBusy"
        :fields="fields"
        v-model="filter"
        :total="total"
        :itemsProvider="itemsProvider"
        v-on:input="onSubmit()"
     />          
     
</div>
</template>
           

<script lang="ts">
import { Component, Vue } from '@/../core';
import { RegisterRouter } from '@/../core/router';
import moment from 'moment';
@Component
export default class VisitorCardReport extends Vue  {
    records:any[]=[];
    fields:any[] =[];
    isBusy:boolean=false;
    filter:any={};
    total:number=0;
  members: any[];
    created(){        
        this.fields = 
        [   
            
            {
                key:"cardNumber",
                label: this._('cardNumber')
            },
            {
                key:"dateOccurred",
                label: this._("w_Report_DateOccurred")
            },
            {
                key:"startTime",
                label: this._("w_Report_StartTime")
            },
            {
                key:"at_id",
                label: this._("w_Report_DoorNumberStart")
            },
            {
                key:"endTime",
                label: this._("w_Report_EndTime")
            },
            {
                key:"at_id_end",
                label: this._("w_Report_DoorNumberEnd")
            },
            {
                key:"workTime",
                label: this._("w_Report_WorkTime")
            }

        ];

        this.filter.Start = new Date();
        this.filter.End = new Date();
        
    }
    
    itemsProvider (ctx) {
        // Here we don't set isBusy prop, so busy state will be
        // handled by table itself
        // this.isBusy = true

        console.log("filter", this.filter);

        let promise = this.$server.C('/report/visitor'as any, Object.assign({paging:{page:ctx.currentPage, pageSize:ctx.perPage}}, this.filter));

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
             * @uiLabel - ${this._('cardNumber')}
             */
            CardNumber?: string;
            
            /**
             * @uiColumnGroup - row1
             * @uiType - iv-form-date
             * @uiLabel - ${this._('w_Report_DateStart')}
             */
            Start:Date;
            /**
             * @uiColumnGroup - row1
             * @uiType - iv-form-date
             * @uiLabel - ${this._('w_Report_DateEnd')}
             */
            End:Date;
        }`;
            
    }
    
    async onSubmit(){      
        console.log("filter", this.filter) ;
    }
}
</script>

