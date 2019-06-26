import { Vue, Component, Prop, Model, Emit } from "vue-property-decorator";


@Component
export class MultiSelections extends Vue {
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
    value!: any[];

    @Prop({ type: Array, required: false })
    options: any[];
    
    leftOptions:any[]=[];    
    rightOptions:any[]=[];

    created(){
        
        console.log("created");
    }
    mounted(){        
        console.log("mounted", this.value, this.options);
        this.rightOptions = Object.assign([], this.value && this.value.length>0?this.value.map(x=> x.objectId ? x.objectId : x):[]);
        this.leftOptions = this.options.map(x=>{return {value:x.key,text:x.value}});
        this.updateSelected();
    }
    
    
    updateSelected(){        
        console.log("new value", this.rightOptions);
        this.$emit('input', this.rightOptions);        
    }
}
export default MultiSelections;