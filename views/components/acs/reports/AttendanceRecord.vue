<template >

     <div key="main">
        <iv-card            
            :label="_('w_Filter')"
        >
            <iv-form 
            ref="form"
            @mounted="doMounted"
            :interface="inf()"
           
            @submit="onSubmit($event)">

            </iv-form>
            
        
        <template v-if="isMounted">
            <b-button class="btn-filter" size="lg" v-bind="$refs.form.submitBindings.$attrs" v-on="$refs.form.submitBindings.$listeners" >{{ _("wb_Submit") }}</b-button>
            <b-button class="btn-filter" size="lg" v-bind="$refs.form.resetBindings.$attrs" v-on="$refs.form.resetBindings.$listeners" @click="onSubmit()">{{ _("wb_Reset") }}</b-button>
            <b-button class="btn-filter" size="lg" @click="exportToExcel()" >{{ _("wb_Export") }}</b-button>            
        </template>
        </iv-card>
         <iv-card            
            :label="_('w_ColumnSelection')"
        >
        <template>
             <iv-sort-select  
                v-if="options.length>0"                      
                v-model="selectedColumns"
                class="col-md-12"
                :options="options"
            />
            
        </template>

        </iv-card>
        <iv-card            
            :label="tableTitle">        
        
           <b-table striped hover 
                :items="records" 
                :fields="fields.filter(x=> selectedColumns.find(y=>y==x.key))" 
                :per-page="perPage"
                :busy="isBusy"
                :current-page="currentPage"
           ></b-table>
           <b-pagination
            v-model="currentPage"
            :total-rows="records.length"
            :per-page="perPage"
            aria-controls="my-table"
            ></b-pagination>
        </iv-card>
        
    </div>
</template>
           

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { BasicReport, BasicReportImpl } from './BasicReport';
import { config } from 'rxjs';

@Component
export default class AttendanceRecord extends BasicReportImpl  {
    
    
    async created(){
        this.tableTitle= this._('w_AttendanceRecord');        
        await this.getData();
    }
    
    
  private async getData(filter?:any) {        
        this.isBusy=true;            
        let resp: any=await this.$server.R("/report/attendancerecord" as any, filter);
        this.data = resp.results;
        this.records = resp.results;
        this.isBusy=false;
  }


    inf(){
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
                date_occurred?: number;
                /**
                 * @uiColumnGroup - occ               
                 */
                time_occurred?: number;
                
            }`;
            
    }
    isMounted:boolean=false;
    doMounted(){
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
        this.isMounted=true;
        this.options=this.fields.map(x=>{return{value:x.key,text:x.label}});
        this.selectedColumns = this.fields.map(x=>x.key);
        console.log(this.options.length);
    }
    async onSubmit($events){        
        await this.getData($events);
    }
}
</script>
<style lang="scss" scoped>
.btn-filter{
    margin: 0 10px;
}
</style>
