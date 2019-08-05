<template >
<div>
     <ivc-basic-report          
        :inf="inf()"
        :title="_('w_VisitorCardReport')"
        :records="records"
        :isBusy="isBusy"
        :fields="fields"
        v-model="filter"
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
    
  members: any[];
    created(){        
        this.fields = 
        [   
            
            {
                key:"CardNumber",
                label: this._('w_Member_CardNumber1')
            },
            {
                key:"DateOccurred",
                label: this._("w_Report_DateOccurred")
            },
            {
                key:"StartTime",
                label: this._("w_Report_StartTime")
            },
            {
                key:"at_id",
                label: this._("w_Report_DoorNumberStart")
            },
            {
                key:"EndTime",
                label: this._("w_Report_EndTime")
            },
            {
                key:"at_id_end",
                label: this._("w_Report_DoorNumberEnd")
            },
            {
                key:"WorkTime",
                label: this._("w_Report_WorkTime")
            }

        ];

        this.filter.DateStart = new Date();
        this.filter.DateEnd = new Date();
        
    }
    
  private async getData() {    
      try{    
        if(!this.filter)return;
        this.isBusy=true;           
        
        this.filter.DateStart.setHours(0,0,0,0);        
        this.filter.DateEnd.setHours(23,59,59,999);
        let start = this.filter.DateStart.toISOString();
        let end = this.filter.DateEnd.toISOString();
        let resp: any=await this.$server.R("/report/visitor" as any, Object.assign(this.filter, {start, end}));
        this.records = resp.results;
        console.log("this.records", this.records);

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
             * @uiLabel - ${this._('w_Member_CardNumber1')}
             */
            CardNumber?: string;
            
            /**
             * @uiColumnGroup - row1
             * @uiType - iv-form-date
             * @uiLabel - ${this._('w_Report_DateStart')}
             */
            DateStart:Date;
            /**
             * @uiColumnGroup - row1
             * @uiType - iv-form-date
             * @uiLabel - ${this._('w_Report_DateEnd')}
             */
            DateEnd:Date;
        }`;
            
    }
    
    async onSubmit(){      
        console.log("filter", this.filter) ;
        await this.getData();
    }
}
</script>

