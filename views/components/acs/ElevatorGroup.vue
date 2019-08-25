<template>
<div>
    <ivc-filter-form
            :inf="filterInterface()"
            :visible="filterVisible"
            v-on:input="onFilterSubmit($event)"
        />
    <ivc-form-quick 
            :canAdd="canAdd"
            :canEdit="canEdit"
            :canDelete="canDelete"
            :allowEdit="allowEdit"
        v-on:viewChange="viewChange($event)">    
        <!-- 5) custom view templates with <template #view.* /> -->
        
        <template #view.elevators="{$attrs, $listeners}">
            {{ $attrs.value ? $attrs.value.length : 0  }}
        </template>
        <template #view.floors="{$attrs, $listeners}">
            {{ getReaderCount($attrs.row)  }}
        </template>  
        <!-- 6) custom edit / add template with <template #add.* /> -->
        <template #add.elevators="{$attrs, $listeners}">
            <ivc-multi-selections 
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="options" 
            />
        </template>
        

    </ivc-form-quick>
    </div>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, Observe, toEnumInterface } from "@/../core";
import { EFormQuick} from '@/../components/form/helpers/form-quick/form-quick.vue.ts';
import { IFormQuick2 } from '@/components/form/form-quick/form-quick.vue.ts'
import { BasicFormQuick } from './basic-form-quick';
import { PermissionName} from '@/../src/constants/permissions';
@Component
/// 1) class name
export default class ElevatorGroup extends BasicFormQuick implements IFormQuick2 {
    
    /// 2) cgi path
    path: string = "/acs/elevatorgroup";
    /// 3) i18n - view / edit / add
    tView: string = "w_ElevatorGroup";
    tAdd: string = "w_ElevatorGroupAdd";
    tEdit: string = "w_ElevatorGroupEdit";
    
    /// 4) interfaces - view / edit / add
    inf(type: EFormQuick) {
        switch (type) {
            case EFormQuick.View:
                return `
                interface {     
                    
                    /**
                    * @uiLabel - ${this._("groupname")}
                    */
                    groupname: string;
                    /**
                    * @uiLabel - ${this._("elevators")}
                    */
                    elevators:string; 
                    /**
                    * @uiLabel - ${this._("w_Reader_Count")}
                    */
                    floors:string;               
                }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {     
                    /**
                    * @uiLabel - ${this._("groupname")}
                    */
                    groupname: string;
                    /**
                    * @uiLabel - ${this._("elevators")}
                    */
                    elevators?:string; 
                }
                `;
        }
    }
    /// 7) pre-add 新增欄位的default值
    preAdd() {
        return;
    }
    /// 8) post-add 寫入新增前要做甚麼調整
    postAdd(row) {
        return;
    }
    /// 9) pre-edit 送去修改表單前要做甚麼調整
    preEdit(row) {
        return;
    }
    /// 10) post-edit 寫入修改前要做甚麼調整
    postEdit(row) {
        return;
    }
    /// Done
    private options:{key:any, value:any}[]=[];
    
    async created() {
        this.permissionName=PermissionName.elevatorgroup;
        let resp:any = await this.$server.R("/acs/elevator" as any, {"paging.all":"true"});

        this.options = resp.results.map(item=>{return{key:item.objectId, value:item.elevatorname}});
        
        console.log("options", this.options)
    }
    getReaderCount(group:any){
        let count=0;
        if(!group.elevators)return count;
        for(let elevator of group.elevators){
            if(elevator.reader && elevator.reader.length>0)
                count+=elevator.reader.length;
        }
        return count;
    }
    
}
</script>


<style lang="scss" scoped>
</style>

