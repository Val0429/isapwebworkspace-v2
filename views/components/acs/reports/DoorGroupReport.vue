<template >

     <ivc-basic-report      
        :inf="inf()"
        :title="_('w_DoorGroupReport')"
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
export default class DoorGroupReport extends Vue  {
    records:any[]=[];
    fields:any[] =[];
    isBusy:boolean=false;
    filter:any={};
    permissions:any[]=[];
    created(){        
        this.fields = 
        [       
            // {
            //     key:"accessObjectId"
            // },
            {
                key:"DoorGroupName",
                label: this._("w_DoorGroup")
            },
            {
                key:"DoorName",
                label: this._("w_Door")
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
            let permission = this.permissions.find(x=>x.tableid==tableid);
            if(!permission || !permission.accesslevels)continue;
            for(let access of permission.accesslevels){                
                if(!access.doorgroup)continue;
                for(let door of access.doorgroup.doors){
                    let newMember = Object.assign({},member);
                    newMember.accessObjectId = access.objectId;
                    newMember.PermissionName = permission.tablename;
                    newMember.TimeSchedule = access.timeschedule.timename;
                    newMember.DoorGroupName = access.doorgroup.groupname;
                    newMember.doorGroupObjectId = access.doorgroup.objectId;
                    newMember.DoorName = door.doorname;
                    //no need to display multiple row for the same access level
                    let exists = this.records.find(x=> x.objectId == newMember.objectId && 
                                                    x.accessObjectId == newMember.accessObjectId &&                                                     
                                                    x.doorGroupObjectId == newMember.doorGroupObjectId );
                    if(!exists)this.records.push(newMember);
                }
                
            }
            
        }
    }
  }
   private async getPermissiontable() {    
    let resp: any=await this.$server.R("/report/permissionrecord" as any, Object.assign({"paging.all":"true","system":0}, this.filter));
    this.permissions=resp.results;
  }


    inf():string{
        return `interface {
            /**
             * @uiColumnGroup - row1
             * @uiLabel - ${this._('w_DoorGroup')}
             */
            doorgroupname?: string;
            
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

