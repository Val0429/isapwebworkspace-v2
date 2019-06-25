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
            <b-button size="lg" v-bind="$refs.form.submitBindings.$attrs" v-on="$refs.form.submitBindings.$listeners" >{{ _("wb_Submit") }}</b-button>
            <b-button size="lg" v-bind="$refs.form.resetBindings.$attrs" v-on="$refs.form.resetBindings.$listeners" @click="onSubmit()">{{ _("wb_Reset") }}</b-button>
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
            :label="_('w_EmployeeList')">        
        
           <b-table striped hover 
                :items="employeeList" 
                :fields="fields().filter(x=> selectedColumns.find(y=>y==x.key))" 
                :per-page="perPage"
                :busy="isBusy"
                :current-page="currentPage"
           ></b-table>
           <b-pagination
            v-model="currentPage"
            :total-rows="employeeList.length"
            :per-page="perPage"
            aria-controls="my-table"
            ></b-pagination>
        <template >
            <b-button size="lg" @click="exportToExcel()" >{{ _("wb_Export") }}</b-button>            
        </template>
        
        </iv-card>
        
    </div>
</template>
           

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';

@Component
export default class EmployeeList extends Vue {
    currentPage:number=1;
    options=[];
    perPage:number=10;
    employeeList:any[]=[];
    selectedColumns=[];
    isBusy:boolean=false;
    members:any[]=[];
    async created(){
        let resp: any=await this.$server.R("/acs/member",{ "paging.all": "true" });
        this.members=resp.results;
        this.getData();
    }
    isMounted:boolean=false;
    doMounted(){
        this.isMounted=true;
        this.options=this.fields().map(x=>{return{value:x.key,text:x.label}});
        this.selectedColumns = this.fields().map(x=>x.key);
    }
    filterColumn(){
        console.log(this.selectedColumns);
        console.log(this.options);
    }
  private getData(filter?:any) {        
        this.isBusy=true;        
        this.employeeList=[];         
        
        for(let item of this.members) {
            let department=item.CustomFields&&item.CustomFields.length>0? item.CustomFields.find(x => x.FiledName=="CustomTextBoxControl5__CF_CF_CF"):undefined;
            let departmentName=department&&department.FieldValue? department.FieldValue:'';
            let costCenter=item.CustomFields&&item.CustomFields.length>0? item.CustomFields.find(x => x.FiledName=="CustomTextBoxControl5__CF_CF_CF_CF"):undefined;
            let costCenterName=costCenter&&costCenter.FieldValue? costCenter.FieldValue:'';
            let workArea=item.CustomFields&&item.CustomFields.length>0? item.CustomFields.find(x => x.FiledName=="CustomTextBoxControl5__CF_CF_CF_CF_CF_CF"):undefined;
            let workAreaName=workArea&&workArea.FieldValue? workArea.FieldValue:'';
            if(item.AccessRules&&item.AccessRules.length>0){
                for(let accessRule of item.AccessRules){
                    this.employeeList.push(this.createEmployee(item,departmentName,costCenterName,workAreaName,accessRule.ObjectName));
                }
            }else{
                this.employeeList.push(this.createEmployee(item,departmentName,costCenterName,workAreaName, ""));
            }      
        }
        this.isBusy=false;
        if(!filter)return;
        if(filter.LastName) this.employeeList= this.employeeList.filter(x=>x.LastName.toLowerCase().indexOf(filter.LastName.toLowerCase())>-1);
        if(filter.FirstName) this.employeeList= this.employeeList.filter(x=>x.FirstName.toLowerCase().indexOf(filter.FirstName.toLowerCase())>-1);
        if(filter.EmployeeNumber) this.employeeList= this.employeeList.filter(x=>x.EmployeeNumber.toLowerCase().indexOf(filter.EmployeeNumber.toLowerCase())>-1);
        if(filter.CardNumber) this.employeeList= this.employeeList.filter(x=>x.CardNumber.toLowerCase().indexOf(filter.CardNumber.toLowerCase())>-1);
        if(filter.CostCenterName) this.employeeList= this.employeeList.filter(x=>x.CostCenterName.toLowerCase().indexOf(filter.CostCenterName.toLowerCase())>-1);
        if(filter.WorkAreaName) this.employeeList= this.employeeList.filter(x=>x.WorkAreaName.toLowerCase().indexOf(filter.WorkAreaName.toLowerCase())>-1);
        if(filter.PermissionList) this.employeeList= this.employeeList.filter(x=>x.PermissionList.toLowerCase().indexOf(filter.PermissionList.toLowerCase())>-1);
        
        
        
  }

  private createEmployee(item: any,departmentName: string,costCenterName: string,workAreaName: string, accessRule: string) {
    return {
      FirstName: item.FirstName,
      LastName: item.LastName,
      EmployeeNumber: item.EmployeeNumber,
      CardNumber: item.Credentials&&item.Credentials.length>0? item.Credentials.map(x => x.CardNumber).join(", "):"",
      DepartmentName: departmentName,
      CostCenterName: costCenterName,
      WorkAreaName: workAreaName,
      PermissionList: accessRule
    }
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
    fields(){
        return [            
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
    }
    onSubmit($events){        
        this.getData($events);
    }
}
</script>
