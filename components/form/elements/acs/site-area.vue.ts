import { Vue, Component, Prop, Model, Emit } from "vue-property-decorator";


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
    areaObjectId:string="";
    siteObjectId:string="";
    sites:any[]=[];
    areas:any[]=[];
    async created(){        
        this.areaObjectId = this.value ? this.value.objectId : "";
        console.log("created");
        let resp:any = await this.$server.R("/location/site/all" as any, {"type":"all"});
        this.sites = resp.map(item=>{return{key:item.objectId, value:item.name}});
        if(this.areaObjectId && this.value.site){
            this.siteObjectId = this.value.site.objectId;
            this.updateArea();
        }        
    }
    mounted(){
        console.log("mounted value", this.value);        
    }
    async updateArea(){
        console.log("siteObjectId", this.siteObjectId);
        if(this.siteObjectId){
            let resp:any = await this.$server.R("/location/area" as any, {"paging.all":"true", "siteId":this.siteObjectId});
            this.areas =  resp.results.map(item=>{return{key:item.objectId, value:item.name}});
        }else{
            this.areas = [];
        }
        console.log("areas", this.areas);
        if(!this.areaObjectId || !this.value.site || this.value.site.objectId!=this.siteObjectId) this.areaObjectId = this.areas.length>0?this.areas[0].key:"";
        this.update();
    }
    update(){        
        console.log("new value", this.areaObjectId);
        this.$emit('input', this.areaObjectId);  
    }
}
export default SiteArea;
