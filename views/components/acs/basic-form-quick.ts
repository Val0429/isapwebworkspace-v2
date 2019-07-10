


import { Vue, Component } from "@/../core";

@Component
export class BasicFormQuick extends Vue {
    canAdd:boolean;
    canEdit:boolean;
    canPreview:boolean;
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
    syncEnabled:boolean = true;
    async manualSync(){
        try{
            this.syncEnabled=false;
            await this.$server.R("/acs/acssync" as any, {});
            //refresh
            this.params={};
        }catch(err){
            console.error(err);
        }finally{
            this.syncEnabled=true;
        }
    }
    beforeMount(){
        if(!this.$user || !this.$user.permissions)return;
        this.canAdd = this.$user.permissions.find(x=>x.access.C === true && x.of.identifier == this.permissionName) != undefined;
        this.canPreview = this.$user.permissions.find(x=>x.access.R === true && x.of.identifier == this.permissionName) != undefined;        
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

