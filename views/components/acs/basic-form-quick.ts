


import { Vue, Component } from "@/../core";

@Component
export class BasicFormQuick extends Vue {
    canAdd:boolean;
    canEdit:boolean;
    canDelete:boolean;
    permissionName:string;
    filterVisible: boolean=true;
    params:any = {};
    
    filterInterface():string{
        return `interface {
              /**
              * @uiLabel - ${this._("name")}
              */
              name:string;
          }`;
    } 

    beforeMount(){
        if(!this.$user || !this.$user.permissions)return;
        this.canAdd = this.$user.permissions.find(x=>x.access.C === true && x.of.identifier == this.permissionName) != undefined;
        this.canEdit = this.$user.permissions.find(x=>x.access.U === true && x.of.identifier == this.permissionName) != undefined;
        this.canDelete = this.$user.permissions.find(x=>x.access.D === true && x.of.identifier == this.permissionName) != undefined;        
    }
    
    onFilterSubmit($event?: any): void {
       this.params = $event || {};
    }
    
    viewChange($event: any): void {
        console.log("view", $event)
      this.filterVisible = $event == 'view';
    } 
    getName(key:any, options:any[]){
        let item = options.find(x=>x.key==key);        
        return item?item.value:'';
    }
}
export default BasicFormQuick;

