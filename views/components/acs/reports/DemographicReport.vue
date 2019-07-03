<template >

     <ivc-basic-report      
        :inf="inf()"
        :title="_('w_DemographicReport')"
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
import moment from 'moment';
@Component
export default class DemographicReport extends Vue  {
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
                key: "CardType",
                label: this._('w_Member_CardType1')
            },
            {
                key: "StartDate",
                label: this._('w_Member_StartDate1')
            },
            {
                key: "EndDate",
                label: this._('w_Member_EndDate1')
            },
            {
                key: "CardCustodian",
                label: this._('w_Member_CardCustodian1')
            },
            {
                key: "Status",
                label: this._("w_Member_Status")
            },
            {
                key: "InOutDailyCount",
                label: this._('w_Report_InOutDailyCount')
            }

        ];

        this.filter.Start = new Date();
        this.filter.End = new Date();
    }
    
  private async getData() { 
      try{    
        if(!this.filter)return;
        this.isBusy=true;           
        await this.getMemberData();
        await this.getAttendanceRecord();
      }catch(err){
          console.error(err);
      }finally{
        this.isBusy=false;
      }
  }
  async getMemberData() {
    let resp: any=await this.$server.R("/report/memberrecord" as any,this.filter);
    this.records=resp.results;
    
  }
async getAttendanceRecord(){   
        
        this.filter.Start.setHours(0,0,0,0);        
        this.filter.End.setHours(23,59,59,999);
        // let card_no = this.filter.CardNumber;
        let start = this.filter.Start.toISOString();
        let end = this.filter.End.toISOString();
        let resp: any=await this.$server.R("/report/attendancerecord" as any, Object.assign(this.filter, {start, end}));
        
        let i=0;
        while(i<resp.results.length){            
            let item = resp.results[i];
            let item2 = resp.results[i+1];
            i+=2;
            let member = this.records.find(x=>x.CardNumber == item.card_no);
            if(!member)continue;
            if(!member.InOutDailyCount)member.InOutDailyCount=0;
            if(member.LastDateOccured !== item.date_occurred){
                member.LastDateOccured = item.date_occurred;
                member.InOutDailyCount +=1;            
            }
        }
        
    }

    inf():string{
        return `interface {
            /**
             * @uiColumnGroup - row0
             * @uiLabel - ${this._('w_Member_CardCustodian1')}
             */
            CardCustodian?:string;
            /**
             * @uiColumnGroup - row0
             * @uiLabel - ${this._('w_Member_CardNumber1')}
             */
            CardNumber?: string;
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._('w_Member_ChineseName1')}
             */
            FirstName?: string;
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._('w_Member_EnglishName1')}
             */
            LastName?: string;
            /**
             * @uiColumnGroup - row2
             * @uiLabel - ${this._('w_Member_CardType1')}
             */
            CardType?:string;
            /**
             * @uiColumnGroup - row2
             * @uiLabel - ${this._('w_Member_CompanyName1')}
             */
            CompanyName?:string;
            /**
             * @uiColumnGroup - row3
             * @uiLabel - ${this._('w_Member_Department1')}
             */
            DepartmentName?:string;
            /**
             * @uiColumnGroup - row3
             * @uiLabel - ${this._('w_Member_CostCenter1')}
             */
            CostCenterName?:string;
            /**
             * @uiColumnGroup - row4
             * @uiLabel - ${this._('w_Member_WorkArea1')}
             */
            WorkAreaName?:string;
            /**
             * @uiColumnGroup - row4
             * @uiType - iv-form-date
             * @uiLabel - ${this._('w_Member_StartDate1')}
             */
            Start:Date;
            /**
             * @uiColumnGroup - row4
             * @uiType - iv-form-date
             * @uiLabel - ${this._('w_Member_EndDate1')}
             */
            End:Date;
        }`;
            
    }
    
    async onSubmit(){      
        console.log("filter", this.filter) ;
        await this.getData();
    }
}
</script>

