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
    
    created(){        
        this.fields = 
        [     
            {
                key: "employeeNumber",
                label: this._('employeeNumber')
            },   
            {
                key: "cardNumber",
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
        this.filter= {DateStart: new Date(), DateEnd : new Date()};
        
    }
    
  private async getData() {    
      try{    
        if(!this.filter){
            this.filter= {DateStart: new Date(), DateEnd : new Date()};
            return;
        }
        this.isBusy=true;           
        await this.getAttendanceRecord();
      }catch(err){
          console.error(err);
      }finally{
        this.isBusy=false;
      }
  }
    

    async getAttendanceRecord(){  
        this.filter.DateStart.setHours(0,0,0,0);        
        this.filter.DateEnd.setHours(23,59,59,999);
        // let card_no = this.filter.CardNumber;
        let start = this.filter.DateStart.toISOString();
        let end = this.filter.DateEnd.toISOString();
        let resp: any=await this.$server.R("/report/attendance" as any, Object.assign(this.filter, {start, end}));
        this.records=resp.results;
        console.log("this.records", this.records);
    }

    inf():string{
        return `interface {
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._('employeeNumber')}
             */
            EmployeeNumber?: string;
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._('cardNumber')}
             */
            CardNumber?: string;
            /**
             * @uiColumnGroup - name
             * @uiLabel - ${this._('chineseName')}
             */
            LastName?: string;
            /**
             * @uiColumnGroup - name
             * @uiLabel - ${this._('englishName')}
             */
            FirstName?: string;
            
            /**
             * @uiColumnGroup - area
             * @uiLabel - ${this._('department')}
             */
            DepartmentName?:string;
            /**
             * @uiColumnGroup - area
             * @uiLabel - ${this._('costCenter')}
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

