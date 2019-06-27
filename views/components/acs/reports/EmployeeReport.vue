<template >

     <div key="main">
        <iv-card            
            :label="_('w_Filter')"
        >
            <iv-form 
            ref="form"
            class="col-md-9"
            @mounted="doMounted"
            :interface="inf()"
           
            @submit="onSubmit($event)">

            </iv-form>
            
        <iv-sort-select
                v-if="options.length>0"                      
                v-model="selectedColumns"
                class="col-md-4"
                v-on:input="onOptionsChange($event)"
                :options="options"
            />
            
        <template v-if="isMounted" >            
            <div class="float-right">
                <b-button class="btn-filter" size="lg" v-bind="$refs.form.submitBindings.$attrs" v-on="$refs.form.submitBindings.$listeners" >{{ _("wb_Submit") }}</b-button>
                <b-button class="btn-filter" size="lg" v-bind="$refs.form.resetBindings.$attrs" v-on="$refs.form.resetBindings.$listeners" @click="onSubmit()">{{ _("wb_Reset") }}</b-button>
                <b-button class="btn-filter" size="lg" @click="exportToExcel()" >{{ _("wb_Export") }}</b-button>            
                
            </div>
        </template>
        </iv-card>
         <iv-card            
            :label="_('w_ColumnSelection')"
        >
      

        </iv-card>
        <iv-card            
            :label="tableTitle">        
        
           <b-table striped hover 
                :items="records" 
                :fields="sortedFields" 
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
export default class EmployeeReport extends BasicReportImpl  {
    
    
    async created(){
        this.tableTitle= this._('w_EmployeeReport');        
        await this.getData();
    }
    
    
  private async getData(filter?:any) {        
        this.isBusy=true;            
        let resp: any=await this.$server.R("/report/memberrecord" as any, filter);
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
    isMounted:boolean=false;
    doMounted(){
        
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
        this.sortedFields = Object.assign([], this.fields);
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
    margin: 0 5px;
}
</style>
