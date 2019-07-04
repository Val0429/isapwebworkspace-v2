<template >

     <ivc-basic-report      
        :inf="inf()"
        :title="_('w_EmployeeReport')"
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
    permissions: any[];
    async created(){        
        this.fields = 
        [       
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
                key:"LastName",
                label: this._('w_Member_ChineseName1'),
                sortable: true
            },
            {  
                key:"FirstName",
                label: this._('w_Member_EnglishName1'),
                sortable: true
            },
            {
                key: "ResignationDate",
                label: this._('w_Member_ResignationDate1')
            },
            {
                key:"PermissionName",
                label: this._("w_PermissionTable")
            },
            {
                key:"DoorGroupName",
                label: this._("w_DoorGroup")
            },
            {
                key:"DoorName",
                label: this._("w_Door")
            },
            {
                key:"TimeSchedule",
                label: this._("w_TimeSchedule")
            }
        ];
    }
    
  private async getData() {        
        try{    
            this.isBusy=true;
            await this.getPermissiontable();
            await this.getMember();
        }catch(err){
            console.error(err);
        }finally{
            this.isBusy=false;
        }
  }


  private async getMember() {
    if(this.filter.ResignDate)
      this.filter.ResignationDate=this.filter.ResignDate.toISOString();
    let resp: any=await this.$server.R("/report/memberrecord" as any,this.filter||{});
    this.records=[];
    for(let member of resp.results){
        for(let tableid of member.PermissionTable){
            let newMember = Object.assign({},member);
            let permission = this.permissions.find(x=>x.tableid==tableid);
            if(!permission)continue;
            for(let access of permission.accesslevels){
                newMember.PermissionName = permission.tablename;
                newMember.TimeSchedule = access.timeschedule.timename;
                newMember.DoorName = access.door?access.door.doorname:'';
                newMember.DoorGroupName = access.doorgroup?access.doorgroup.groupname:'';
                
                this.records.push(newMember);
            }
            
        }
    }
  }
   private async getPermissiontable() {    
    let resp: any=await this.$server.R("/acs/permissiontable" as any, {"paging.all":"true"});
    this.permissions=resp.results;
  }

    inf():string{
        return `interface {
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._('w_Member_EmployeeNumber1')}
             */
            EmployeeNumber?: string;
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._('w_Member_CardNumber1')}
             */
            CardNumber?: string;
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
             * @uiColumnGroup - row4
             * @uiType - iv-form-date
             * @uiLabel - ${this._('w_Member_ResignationDate1')}
             */
            ResignDate?:Date;
            /**
             * @uiColumnGroup - row4             
             * @uiLabel - ${this._('w_Member_CompanyName1')}
             */
            CompanyName?:string;
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
            
        }`;
            
    }
    
    async onSubmit(){      
        console.log("filter", this.filter) ;
        await this.getData();
    }
}
</script>

