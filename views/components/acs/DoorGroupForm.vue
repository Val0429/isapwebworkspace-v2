<template>
<div>
    <ivc-filter-form
            :inf="filterInterface()"
            :visible="filterVisible"
            v-on:input="onFilterSubmit($event)"
        />
    <ivc-form-quick v-on:viewChange="viewChange($event)">
        <!-- 5) custom view templates with <template #view.* /> -->
        <template #view.area="{$attrs, $listeners}">
            {{$attrs.value ? $attrs.value.name : ''}}
        </template>
        <template #view.site="{$attrs, $listeners}">
            {{$attrs.row.area && $attrs.row.area.site ? $attrs.row.area.site.name : ''}}
        </template>
        <template #view.readerscount="{$attrs, $listeners}">
            {{ getReadersCount($attrs.row.doors)}}
        </template>  
        <template #view.doorscount="{$attrs, $listeners}">
            {{ $attrs.row.doors ? $attrs.row.doors.length:0 }}
        </template>  
        <template #add.doors="{$attrs, $listeners}">
            <ivc-multi-selections 
            v-bind="$attrs" 
            v-on="$listeners" 
            :options="options" 
            />
        </template>
        <template #add.area="{$attrs, $listeners}">
            <ivc-site-area 
            v-bind="$attrs" 
            v-on="$listeners"              
            />
        </template>
        
        <!-- 6) custom edit / add template with <template #add.* /> -->

    </ivc-form-quick>
    </div>
</template>

<script lang="ts">
import { Vue, Component, iSAPServerBase, MetaParser, createDecorator, Observe, toEnumInterface } from "@/../core";
import { EFormQuick} from '@/../components/form/helpers/form-quick/form-quick.vue.ts';
import { IFormQuick2 } from '@/components/form/form-quick/form-quick.vue.ts'


@Component
/// 1) class name
export default class DoorGroupForm extends Vue implements IFormQuick2 {
    
      params:any = {};
  onFilterSubmit($event?: any): void {
     this.params = $event || {};
  }
  filterVisible: boolean=true;
  viewChange($event: any): void {
      console.log("view", $event)
    this.filterVisible = $event == 'view';
  } 
    filterInterface():string{
      return `interface {
            /**
            * @uiLabel - ${this._("name")}
            */
            name?:string;
        }`;
  }  
    
    /// 2) cgi path
    path: string = "/acs/doorgroup";
    /// 3) i18n - view / edit / add
    tView: string = "w_DoorGroup";
    tAdd: string = "w_DoorGroupAdd";
    tEdit: string = "w_DoorGroupEdit";
    /// 4) possibility - edit / add / delete
    canAdd: boolean = true;
    canEdit: boolean = true;
    canDelete: boolean = true;
    /// 4) interfaces - view / edit / add
    inf(type: EFormQuick) {
        switch (type) {
            case EFormQuick.View:
                return `
                interface {   
                    /**
                    * @uiLabel - ${this._("w_Region_LevelSite")}
                    */
                    site:string;
                    /**
                    * @uiLabel - ${this._("w_Region_LevelArea")}
                    */
                    area:string;
                    /**
                    * @uiLabel - ${this._("groupname")}
                    */
                    groupname: string;
                    /**
                    * @uiLabel - ${this._("doorscount")}
                    */
                    doorscount:string;
                    /**
                    * @uiLabel - ${this._("readerscount")}
                    */
                    readerscount:string;
                    
                }
                `;
            case EFormQuick.Add:
            case EFormQuick.Edit:
                return `
                interface {
                    /**
                    * @uiLabel - ${this._("w_Region_LevelArea")}
                    */
                    area:string;
                    /**
                    * @uiLabel - ${this._("groupname")}
                    */
                    groupname: string;
                    /**
                    * @uiLabel - ${this._("doors")}
                    */
                    doors?:any;                   
                   
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
        let resp:any = await this.$server.R("/acs/door", {"paging.all":"true"});

        this.options = resp.results.map(door=>{return{key:door.objectId, value:door.doorname}});
        
        console.log("doors", this.options)
    }
    getName(key:any, options:{key:any, value:any}[]){
        let item = options.find(x=>x.key==key);
        return item?item.value:'';
    }
    getReadersCount(doors:any){
        if(!doors)return 0;
        let count=0;
        for(let item of doors){
            count += item.readerin?item.readerin.length:0;
            count += item.readerout?item.readerout.length:0;
        }
        return count;
    }
}
</script>


<style lang="scss" scoped>
</style>

