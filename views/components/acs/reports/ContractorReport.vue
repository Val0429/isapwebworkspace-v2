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
                key: "month1",
                label: this._("w_Report_Month1")
            },
            {
                key: "month2",
                label: this._("w_Report_Month2")
            },
            {
                key: "month3",
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
        this.filter.Start.setHours(0,0,0,0);        
        this.filter.End.setHours(23,59,59,999);
        // let card_no = this.filter.CardNumber;
        let start = this.filter.Start.toISOString();
        let end = this.filter.End.toISOString();
        let resp: any=await this.$server.R("/report/contractor" as any, Object.assign(this.filter, {start, end}));
        this.records= resp.results;

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
             * @uiDisabled - true
             * @uiLabel - ${this._('endDate')}
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

