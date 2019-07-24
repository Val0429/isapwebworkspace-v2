import { Vue, Component, Prop, Model, Emit } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";


@Component
export class SiteArea extends Vue {
    @Prop({
        type: String,
        required: false
    })
    label!: string;

    @Prop({ type: String, required: false })
    placeholder!: string;

    @Prop({ type: String, required: false })
    invalid!: string;

    @Model('input', {        
        required: false
    })
    value!: any;    
    siteArea:any={
        site:"",
        area:""
    }
    
    sites:any={};
    areas:any={};
    async created(){  
        console.log("created");
        let resp:any = await this.$server.R("/location/site" as any, {"paging.all":"true"});
        this.sites = {};
        for(let site of resp.results){
            this.sites[site.objectId]=site.name; 
            
        }
        
        if(this.value && this.value.site){
            this.siteArea.area = this.value.objectId || "";
            this.siteArea.site =  this.value.site.objectId || "";
            this.updateArea(this.siteArea.site);
        }
    }
    inf(){
        return `
        interface {
            /**
             * @uiColumnGroup - sitearea
             * @uiLabel - ${this._("w_Site")}
            */
            site:${toEnumInterface(this.sites, false)};
            /**
             * @uiColumnGroup - sitearea
             * @uiLabel - ${this._("w_Area")}
            */
            area:${toEnumInterface(this.areas, false)};
        }
        `;
    }
    mounted(){
        console.log("mounted value", this.value);        
    }
    async updateArea($event)
    {
        this.siteArea.site=$event;
        console.log("this.siteArea.site", $event, this.siteArea.site);        
        if(this.siteArea.site){
            let resp:any = await this.$server.R("/location/area" as any, {"paging.all":"true", "siteId":this.siteArea.site});
            this.areas = {};
            for(let area of resp.results)
            {
                this.areas[area.objectId]=area.name;
            }
            if(!this.siteArea.area || !this.value.site || this.value.site.objectId!=this.siteArea.site) 
                this.siteArea.area = resp.results.length>0?resp.results[0].objectId:"";
        }else{
            this.areas = {};
            this.siteArea.area="";
        }
        console.log("areas", this.areas);
        
        this.update(this.siteArea.area);
    }
    update($event){        
        this.siteArea.area=$event;
        console.log("new value", this.siteArea.area);
        this.$emit('input', this.siteArea.area);  
    }
}
export default SiteArea;
