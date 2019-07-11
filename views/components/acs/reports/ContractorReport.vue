<template >

     <ivc-basic-report      
        :inf="inf()"
        :title="_('w_ContractorReport')"
        :records="records"
        :isBusy="isBusy"
        :fields="fields"
        v-model="filter"
        v-on:input="onSubmit($event)"        
        v-on:update="onUpdate($event)"
     />                  
     
</template>
           

<script lang="ts">
import { Component, Watch, Vue } from '@/../core';
import { RegisterRouter } from '@/../core/router';
import moment, { months } from 'moment';
@Component
export default class ContractorReport extends Vue  {
    records:any[]=[];
    fields:any[] =[];
    isBusy:boolean=false;
    filter:any={
        Start : moment(new Date()).add(-3, 'M').toDate(),
        End : new Date()
    };
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
                key: "Month1",
                label: this._("w_Report_Month1")
            },
            {
                key: "Month2",
                label: this._("w_Report_Month2")
            },
            {
                key: "Month3",
                label: this._("w_Report_Month3")
            }
        ];

    }
    
  private async getData() { 
      try{    
        if(!this.filter){            
            this.filter = {
                Start : moment(new Date()).add(-3, 'M').toDate(),
                End : new Date()
            };
            return;
        }
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
    for(let member of this.records){
        if(!member.Month1)member.Month1=0;
        if(!member.Month2)member.Month2=0;
        if(!member.Month3)member.Month3=0;
    }
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
            if(!member.Month1)member.Month1=0;
            if(!member.Month2)member.Month2=0;
            if(!member.Month3)member.Month3=0;
            let monthDifferent =  moment.utc(moment(this.filter.End).diff(moment(item.date_time_occurred))).month();
            console.log("monthDifferent",monthDifferent);
            if(member.LastDateOccured === item.date_occurred)continue;
            member.LastDateOccured = item.date_occurred;
            if(monthDifferent==0)member.Month1 +=1;
            if(monthDifferent==1)member.Month2 +=1;
            if(monthDifferent==2)member.Month3 +=1;                
            
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
            LastName?: string;
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._('w_Member_EnglishName1')}
             */
            FirstName?: string;
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
             * @uiDisabled - true
             * @uiLabel - ${this._('w_Member_EndDate1')}
             */
            End:Date;
        }`;
            
    }
    
    async onSubmit($event){    
        //this.filter=$event;  
        console.log("filter", this.filter) ;
        await this.getData();
    }
    
     
    onUpdate($event){      
        
        if($event.key!=="Start")return;        
        if(!this.filter){
            this.filter = {
                Start : moment(new Date()).add(-3, 'M').toDate(),
                End : new Date()
            };    
        }
        console.log("$event", $event);
        this.filter.Start = $event.value;
        this.filter.Start.setHours(0,0,0,0);
        this.filter.End = moment($event.value).add(3, 'M').toDate();
        this.filter.End.setHours(23,59,59,999);
        
    }
}
</script>

