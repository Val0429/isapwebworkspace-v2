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

                    <!-- <iv-toolbox-view
                        
                        @click="pageToView($attrs.row)"
                    /> -->
                    

                </template>
                <b-table striped hover
                ref="permTable"
                :items="myProvider" 
                :fields="fields"
                :per-page="perPage"
                :current-page="page">
                <!-- A virtual column -->
                <template slot="index" slot-scope="data">
                    {{ data.index + (page-1)*perPage+ 1 }}
                </template>
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
           >
                 <!-- A virtual column -->
                <template slot="index" slot-scope="data">
                    {{ data.index + (memberPage-1)*perPage + 1 }}
                </template>
           </b-table>
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
                >
                    <!-- A virtual column -->
                    <template slot="index" slot-scope="data">
                        {{ data.index + (doorPage-1)*perPage + 1 }}
                    </template>
                </b-table>
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
    myProvider (ctx) {
        // Here we don't set isBusy prop, so busy state will be
        // handled by table itself
        // this.isBusy = true

        console.log("filter", this.filter);

        let promise = this.$server.R('/acs/permissiontable'as any, Object.assign({paging:{page:ctx.currentPage, pageSize:ctx.perPage}}, this.filter));

        return promise.then(async (data:any) => {
          this.total = data.paging.total;
          let members = await this.getMembers(data.results.map(x=>x.tableid).join(","));
            for(let item of data.results){
                item.members = members.filter(x=>x.PermissionTable.find(y=> y == item.tableid));
                item.membercount = item.members.length;
                item.doors = [];
                item.doorcount = 0;
                if(!item.accesslevels || item.accesslevels.length<=0) continue;                
                let doors = [];
                for(let accesslevel of item.accesslevels){
                    if(!accesslevel.type || accesslevel.type!="door" || !accesslevel.door)continue;
                    doors.push(accesslevel.door);
                }
                item.doors = doors;
                item.doorcount = doors.length;               
            }
          // Here we could override the busy state, setting isBusy to false
          // this.isBusy = false
          return(data.results);
        }).catch(error => {
          // Here we could override the busy state, setting isBusy to false
          // this.isBusy = false
          // Returning an empty array, allows table to correctly handle
          // internal busy state in case of error
          return []
        })
      }
   
    async getMembers(permissions:any[]){
         let resp:any = await this.$server.R("/report/memberrecord" as any, {PermissionTable:permissions});
         return resp.results;
    }
    created() {
        this.fields = [
            {
                key: "index",
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
                key: "index",
                label: this._('w_Number')
            },
            {
                key: "doorname",
                label: this._('w_Door')
            }
        ];
        this.memberFields = [   
            {
                key: "index",
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

    mounted() {
        
    }

    doFilter($event) {
        console.log("doFilter", $event);
        this.filter = $event;
        (this.$refs.permTable as any).refresh();
    }
    

    filterInterface() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Permission_PermissionName")}
                 * @uiPlaceHolder - ${this._("w_Permission_PermissionName")}
                 */
                name?: string;

            }
        `;
    }

    

    
}
</script>
<style lang="scss" scoped>

</style>
