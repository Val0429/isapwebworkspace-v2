<template >
<div>
     <ivc-basic-report      
        :inf="inf()"
        :title="_('w_EmployeeReport')"
        :records="records"
        :isBusy="isBusy"
        :fields="fields"
        :total="total"
        :itemsProvider="itemsProvider"
        v-model="filter"
        v-on:input="onSubmit()"
     />          
     </div>
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
    total:number=0;
    created(){        
        
        this.fields = 
        [       
            {
                key: "employeeNumber",
                label: this._('employeeNumber')
            },
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
                key:"workArea",
                label: this._("workArea")
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
                key: "resignationDate",
                label: this._('resignationDate')
            },
            {
                key:"permissionName",
                label: this._("w_PermissionTable")
            },
            {
                key:"doorGroupName",
                label: this._("w_DoorGroup")
            },
            {
                key:"doorName",
                label: this._("w_Door")
            },
            {
                key:"timeSchedule",
                label: this._("w_TimeSchedule")
            }
        ];
    }
    
  

    itemsProvider (ctx) {
        // Here we don't set isBusy prop, so busy state will be
        // handled by table itself
        this.isBusy = true

        console.log("filter", this.filter);

        let promise = this.$server.C('/report/employee'as any, Object.assign({paging:{page:ctx.currentPage, pageSize:ctx.perPage}}, this.filter));

        return promise.then(async (data:any) => {
          this.total = data.paging.total;          
          // Here we could override the busy state, setting isBusy to false
          this.isBusy = false
          return(data.results);
        }).catch(error => {
          // Here we could override the busy state, setting isBusy to false
          this.isBusy = false
          // Returning an empty array, allows table to correctly handle
          // internal busy state in case of error
          return []
        })
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
             * @uiColumnGroup - row4
             * @uiType - iv-form-date
             * @uiLabel - ${this._('resignationDate')}
             */
            ResignationDate?:Date;
            /**
             * @uiColumnGroup - row4
             * @uiLabel - ${this._('companyName')}
             */
            CompanyName?:string;
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
            
        }`;
            
    }
    
    async onSubmit(){      
        console.log("filter", this.filter) ;
        
    }
}
</script>

