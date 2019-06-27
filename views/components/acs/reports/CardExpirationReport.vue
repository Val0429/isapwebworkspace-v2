<template >

     <ivc-basic-report      
        :inf="inf()"
        :title="_('w_CardExpirationReport')"
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
export default class CardExpirationReport extends Vue  {
    records:any[]=[];
    fields:any[] =[];
    isBusy:boolean=false;
    filter:any={};
    async created(){        
        this.fields = 
        [            
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
                key: "EmployeeNumber",
                label: this._('w_Member_EmployeeNumber1')
            },
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
                key:"WorkAreaName",
                label: this._("w_Member_WorkArea1")
            },
            {
                key:"PermissionList",
                label: this._("w_Permission_PermissionList")
            }
        ];

        await this.getData();
    }
    
  private async getData() {        
        this.isBusy=true;            
        let resp: any=await this.$server.R("/report/memberrecord" as any, this.filter);        
        this.records = resp.results;
        this.isBusy=false;
  }


    inf():string{
        return `interface {
            /**
             * @uiColumnGroup - name
             * @uiLabel - ${this._('w_Member_ChineseName1')}
             */
            FirstName?: string;
            /**
             * @uiColumnGroup - name
             * @uiLabel - ${this._('w_Member_EnglishName1')}
             */
            LastName?: string;
            /**
             * @uiColumnGroup - number
             * @uiLabel - ${this._('w_Member_EmployeeNumber1')}
             */
            EmployeeNumber?: string;
            /**
             * @uiColumnGroup - number
             * @uiLabel - ${this._('w_Member_CardNumber1')}
             */
            CardNumber?: string;
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
             * @uiColumnGroup - area
             * @uiLabel - ${this._('w_Member_WorkArea1')}
             */
            WorkAreaName?:string;
        }`;
            
    }
    
    async onSubmit(){      
        console.log("filter", this.filter) ;
        await this.getData();
    }
}
</script>

