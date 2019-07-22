<template >

     <ivc-basic-report      
        :inf="inf()"
        :title="_('w_DoorReport')"
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
export default class DoorReport extends Vue  {
    records:any[]=[];
    fields:any[] =[];
    isBusy:boolean=false;
    filter:any={};
    permissions:any[]=[];
    created(){        
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
                key:"CompanyName",
                label: this._("w_Member_CompanyName1")
            },           
            {
                key:"WorkAreaName",
                label: this._("w_Member_WorkArea1")
            },           
            {
                key: "EmployeeNumber",
                label: this._('w_Member_EmployeeNumber1')
            },
            {
                key: "ResignationDate",
                label: this._('w_Member_ResignationDate1')
            },
            {
                key: "Status",
                label: this._('w_Member_Status')
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
    if(this.filter && this.filter.ResignDate)
      this.filter.ResignationDate=this.filter.ResignDate.toISOString();
    let resp: any=await this.$server.R("/report/memberrecord" as any,this.filter||{});
    this.records=[];
    for(let member of resp.results){
        for(let tableid of member.PermissionTable){
            let newMember = Object.assign({},member);
            let permission = this.permissions.find(x=>x.tableid==tableid);
           if(!permission || !permission.accesslevels)continue;
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
    let resp: any=await this.$server.R("/acs/permissiontable" as any, Object.assign({"paging.all":"true"}, this.filter));
    this.permissions=resp.results;
  }


    inf():string{
        return `interface {
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._('w_Door')}
             */
            doorname?: string;
            
            /**
             * @uiColumnGroup - row1
             * @uiType - iv-form-date
             * @uiLabel - ${this._('w_Member_ResignationDate1')}
             */
            ResignDate?:Date;
        }`;
            
    }
    
    async onSubmit(){      
        console.log("filter", this.filter) ;
        await this.getData();
    }
}
</script>

