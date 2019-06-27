<template >

     <ivc-basic-report      
        :inf="inf()"
        :title="_('w_AttendanceReport')"
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
export default class AttendanceReport extends Vue  {
    records:any[]=[];
    fields:any[] =[];
    isBusy:boolean=false;
    filter:any={};
    async created(){        
        this.fields = 
         this.fields = 
        [            
            {
                key:"first_name",
                label: this._('w_Member_ChineseName1'),
                sortable: true
            },
            {  
                key:"last_name",
                label: this._('w_Member_EnglishName1'),
                sortable: true
            },
            {
                key: "date_occurred",
                label: "date_occurred"
            },
            {
                key: "time_occurred",
                label: "time_occurred"
            }
        ];

        await this.getData();
    }
    
  private async getData() {        
        this.isBusy=true;            
        let resp: any=await this.$server.R("/report/attendancerecord" as any, this.filter);        
        this.records = resp.results;
        this.isBusy=false;
  }


    inf():string{
        return `interface {
            /**                
             * @uiColumnGroup - name
             * @uiLabel - ${this._('w_Member_ChineseName1')}
             */
            first_name?: string;
            /**                
             * @uiColumnGroup - name
             * @uiLabel - ${this._('w_Member_EnglishName1')}
             */
            last_name?: string;
            /**
             * @uiColumnGroup - occ
             */
            date_occurred?: string;
            /**
             * @uiColumnGroup - occ
             */
            time_occurred?: string;
        }`;
            
    }
    
    async onSubmit(){      
        console.log("filter", this.filter) ;
        await this.getData();
    }
}
</script>

