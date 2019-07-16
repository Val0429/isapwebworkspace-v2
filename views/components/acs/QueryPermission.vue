<template>
    <div key="main">
        <div v-show="!viewPage">
            <iv-auto-card :label="_('w_Search')">
                <iv-form
                    :interface="filterInterface()"
                    @submit="doFilter($event)"
                >
                </iv-form>
            </iv-auto-card>

            <iv-card :label="_('w_Permission_PermissionList')">
                <template #toolbox>

                    <iv-toolbox-view
                        
                        @click="pageToView($attrs.row)"
                    />
                    

                </template>
                <b-table striped hover 
                :items="records" 
                :fields="fields" 
                :per-page="perPage"
                :current-page="page">
                    <template slot="Actions" slot-scope="data">
                        
                            <iv-toolbox-view @click="pageToView(data.item)" />
                        
                    </template>
                </b-table>
                <b-pagination
                v-model="page"
                :total-rows="total"
                :per-page="perPage"
                aria-controls="my-table"
                />
            </iv-card>
        </div>
        <div v-show="viewPage">
            <iv-card :label="_('w_Member')">
                <b-table striped hover 
                :items="memberRecords" 
                :fields="memberFields" 
                :per-page="perPage"
                :current-page="memberPage"
           />
           <b-pagination
            v-model="memberPage"
            :total-rows="memberRecords.length"
            :per-page="perPage"
            aria-controls="my-table"
            />
                
            </iv-card>
            <iv-card :label="_('w_Door')">
                
                <b-table striped hover 
                :items="doorRecords" 
                :fields="doorFields" 
                :per-page="perPage"
                :current-page="doorPage"
           />
           <b-pagination
            v-model="doorPage"
            :total-rows="doorRecords.length"
            :per-page="perPage"
            aria-controls="my-table"
            />
                <template #footer>
                    <b-button @click="viewToPage()">{{_('w_Back')}}</b-button>
                </template>
            </iv-card>
        </div>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";
import Dialog from "@/services/Dialog/Dialog";
import { PermissionName} from '@/../src/constants/permissions';




@Component({
    components: { }
})
export default class QueryPermission extends Vue {
    viewPage:boolean=false;    
    filter: any = {};
    perPage:number=10;
    page:number=1;
    total:number=0;
    records:any[]=[];
    memberPage:number=1;
    doorPage:number=1;
    doorFields:any=[];
    memberFields:any=[];
    fields:any=[];
    memberRecords:any=[];
    doorRecords:any=[];
    pageToView(permission:any){
        console.log("permission", permission);        
        this.viewPage=true;
        this.memberPage=1;
        this.doorPage=1;
        this.memberRecords = permission.members;
        this.doorRecords = permission.doors;
    }
    viewToPage(){
        console.log("viewToPage");     
        this.viewPage=false;
        
    }
    async getData(){
        let resp:any = await this.$server.R("/acs/permissiontable" as any, this.filter);
        this.total = resp.total;
        let i=1;
        this.records=[];
        
        let members = await this.getMembers(resp.results.map(x=>x.tableid));
        for(let item of resp.results){
            item.no = i++;
            item.members = members.filter(x=>x.PermissionTable.find(y=> y == item.tableid));
            let j=1;
            for(let member of item.members){
                member.no = j++;
            }
            item.membercount = item.members.length;
            if(!item.accesslevels || item.accesslevels.length<=0)continue;
            let doors = [];
            for(let accesslevel of item.accesslevels){
                if(!accesslevel.type || accesslevel.type!="door" || !accesslevel.door)continue;
                doors.push(accesslevel.door);
            }
            let k=1;
            for(let door of doors){
                door.no = k++;
            }
            item.doors = doors;
            item.doorcount = doors.length;
            this.records.push(item);
        }
        
    }
    async getMembers(permissions:any[]){
         let resp:any = await this.$server.R("/report/memberrecord" as any, {PermissionTable:permissions});
         return resp.results;
    }
    created() {
        this.fields = [
            {
                key: "no",
                label: this._('w_Number')
            },
            {
                key: "tablename",
                label: this._('w_Permission_PermissionName')
            },
            {
                key: "doorcount",
                label: this._('w_Door_Count')
            },
            {
                key: "membercount",
                label: this._('w_Member_Count')
            },
            {
                key: "Actions",
                label: ""
            }

        ];
        this.doorFields = [
            {
                key: "no",
                label: this._('w_Number')
            },
            {
                key: "doorname",
                label: this._('w_Door')
            }
        ];
        this.memberFields = [   
            {
                key: "no",
                label: this._('w_Number')
            },
            {
                key: "EmployeeNumber",
                label: this._('w_Member_EmployeeNumber1')
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
                key:"CardNumber",
                label: this._('w_Member_CardNumber1')
            }

        ];

    }

    async mounted() {
        await this.getData();
    }

    async doFilter($event) {
        console.log("filter", $event);
        this.filter = $event;
        await this.getData();
    }

    

    filterInterface() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Permission_PermissionName")}
                 * @uiPlaceHolder - ${this._("w_Permission_PermissionName")}
                 */
                permissionName?: string;

            }
        `;
    }

    

    
}
</script>
<style lang="scss" scoped>

</style>
