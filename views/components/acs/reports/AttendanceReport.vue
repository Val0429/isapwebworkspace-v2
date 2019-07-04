<template >
<div>
     <ivc-basic-report          
        :inf="inf()"
        :title="_('w_AttendanceReport')"
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
export default class EmployeeReport extends Vue  {
    records:any[]=[];
    fields:any[] =[];
    isBusy:boolean=false;
    filter:any={};
    
  members: any[];
    created(){        
        this.fields = 
        [     
            {
                key: "EmployeeNumber",
                label: this._('w_Member_EmployeeNumber1')
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
                key:"LastName",
                label: this._('w_Member_ChineseName1'),
                sortable: true
            },       
            {
                key:"FirstName",
                label: this._('w_Member_EnglishName1'),
                sortable: true
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
        await this.getMemberData();
        await this.getAttendanceRecord();
      }catch(err){
          console.error(err);
      }finally{
        this.isBusy=false;
      }
  }
  private async getMemberData() {
    let resp: any=await this.$server.R("/report/memberrecord" as any,this.filter);
    this.members=resp.results;
    
  }

    async getAttendanceRecord(){   
        
        this.filter.DateStart.setHours(0,0,0,0);        
        this.filter.DateEnd.setHours(23,59,59,999);
        // let card_no = this.filter.CardNumber;
        let start = this.filter.DateStart.toISOString();
        let end = this.filter.DateEnd.toISOString();
        let resp: any=await this.$server.R("/report/attendancerecord" as any, Object.assign(this.filter, {start, end}));
        this.records=[];
        let i=0;
        while(i<resp.results.length){            
            let item = resp.results[i];
            let item2 = resp.results[i+1];
            i+=2;
            let member = this.members.find(x=>x.CardNumber && x.CardNumber == item.card_no);
            if(!member)continue;
            let newItem = Object.assign(item, member);
            newItem.date_time_occurred_end = item2.date_time_occurred;
            newItem.at_id_end = item2.at_id;
            let timeStart = moment(newItem.date_time_occurred);
            let timeEnd = moment(newItem.date_time_occurred_end);
            newItem.StartTime = timeStart.format("HH:mm");
            newItem.DateOccurred = timeStart.format("YYYY-MM-DD");
            newItem.EndTime = timeEnd.format("HH:mm");
            newItem.WorkTime = moment.utc(timeEnd.diff(timeStart)).format("H[h ]m[m]");
            this.records.push(newItem);
            
        }
        console.log("this.records", this.records);
    }

    inf():string{
        return `interface {
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._('w_Member_EmployeeNumber1')}
             */
            EmployeeNumber?: string;
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._('w_Member_CardNumber1')}
             */
            CardNumber?: string;
            /**
             * @uiColumnGroup - name
             * @uiLabel - ${this._('w_Member_ChineseName1')}
             */
            LastName?: string;
            /**
             * @uiColumnGroup - name
             * @uiLabel - ${this._('w_Member_EnglishName1')}
             */
            FirstName?: string;
            
            /**
             * @uiColumnGroup - area
             * @uiLabel - ${this._('w_Member_Department1')}
             */
            DepartmentName?:string;
            /**
             * @uiColumnGroup - area
             * @uiLabel - ${this._('w_Member_CostCenter1')}
             */
            CostCenterName?:string;
            /**
             * @uiColumnGroup - datefilter
             * @uiType - iv-form-date
             * @uiLabel - ${this._('w_Report_DateStart')}
             */
            DateStart:Date;
            /**
             * @uiColumnGroup - datefilter
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

