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
                key:"cardNumber",
                label: this._('w_Member_CardNumber1')
            },
            {
                key:"department",
                label: this._("w_Member_Department1")
            },            
            {
                key:"costCenter",
                label: this._("w_Member_CostCenter1")
            },
            {
                key:"englishName",
                label: this._('w_Member_EnglishName1'),
                sortable: true
            },
            {  
                key:"chineseName",
                label: this._('w_Member_ChineseName1'),
                sortable: true
            },
            {
                key: "companyName",
                label: this._('w_Member_CompanyName1')
            },
            {
                key: "workArea",
                label: this._('w_Member_WorkArea1')
            },
            {
                key: "cardType",
                label: this._('w_Member_CardType1')
            },
            {
                key: "startDate",
                label: this._('w_Member_StartDate1')
            },
            {
                key: "endDate",
                label: this._('w_Member_EndDate1')
            },
            {
                key: "CardCustodian",
                label: this._('w_Member_CardCustodian1')
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
    
  private async getData() { 
      try{    
        if(!this.filter){
            let params = {Start : new Date(), End : new Date()};
            this.filter=params;       
            return;
        }
        this.isBusy=true;           
        this.filter.Start.setHours(0,0,0,0);        
        this.filter.End.setHours(23,59,59,999);
        // let card_no = this.filter.CardNumber;
        let start = this.filter.Start.toISOString();
        let end = this.filter.End.toISOString();
        let resp: any=await this.$server.R("/report/demographic" as any, Object.assign(this.filter, {start, end}));
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

