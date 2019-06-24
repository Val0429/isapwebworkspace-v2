<template >

     <div key="main">
         
        <b-table striped hover :items="attendanceRecords" :fields="fields()" :busy="isBusy"></b-table>
    
        
    </div>
</template>
           

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';

@Component
export default class AttendanceRecord extends Vue {
    attendanceRecords:any[]=[];
    isBusy:boolean=false;
    reports:any[]=[];
    async created(){
        let resp:any = await this.$server.R("/report/attendancerecord" as any, {});
        this.reports = resp.results;
        console.log("reports", this.reports);
        for(let item of this.reports){
            this.attendanceRecords.push(item);
        }
    }
    fields(){
        return{
            
            first_name: {
                label: this._('w_Member_ChineseName'),
                sortable: true
            },
            last_name: {
               label: this._('w_Member_EnglishName'),
                sortable: true
            },
            date_occurred: {
                label: 'date_occurred'
            },
            time_occurred: {
                label: 'time_occurred'
            }
        }
    }
}
</script>
