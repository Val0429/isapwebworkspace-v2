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
                label: this._('w_Member_ChineseName1'),
                sortable: true
            },
            {  
                key:"LastName",
                label: this._('w_Member_EnglishName1'),
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
                key: "InOutDailyCount",
                label: this._('w_Report_InOutDailyCount')
            }

        ];

        this.filter.DateStart = new Date();
        this.filter.DateEnd = new Date();
    }
    
  private async getData() { 
      if(!this.filter)return;
      if(this.filter.End)this.filter.EndDate = this.filter.End.toISOString();
        this.isBusy=true;            
        let resp: any=await this.$server.R("/report/memberrecord" as any, this.filter);        
        this.records = resp.results;
        this.isBusy=false;
  }


    inf():string{
        return `interface {
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
             * @uiLabel - ${this._('w_Member_EmployeeNumber1')}
             */
            EmployeeNumber?: string;
            /**
             * @uiColumnGroup - row2
             * @uiLabel - ${this._('w_Member_CardNumber1')}
             */
            CardNumber?: string;
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
             * @uiLabel - ${this._('w_Member_CompanyName1')}
             */
            CompanyName?:string;
            /**
             * @uiColumnGroup - row5
             * @uiLabel - ${this._('w_Member_CardType1')}
             */
            CardType?:string;
            /**
             * @uiColumnGroup - row5
             * @uiLabel - ${this._('w_Member_CardCustodian1')}
             */
            CardCustodian?:string;
            /**
             * @uiColumnGroup - row6
             * @uiType - iv-form-date
             * @uiLabel - ${this._('w_Member_StartDate1')}
             */
            Start:Date;
            /**
             * @uiColumnGroup - row6
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

