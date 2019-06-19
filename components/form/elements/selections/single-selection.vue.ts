import { Vue, Component, Prop, Model, Emit } from "vue-property-decorator";


@Component
export class FormString extends Vue {
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
    selected:any="";
    @Prop({ type: Array, required: false })
    options: {key:any, value:any}[];
    

    created(){        
        console.log("created");
    }
    mounted(){   
        this.selected = this.value? this.value.objectId:""; 
        this.$emit('input', this.selected);            
        console.log("mounted selected", this.selected);
        console.log("mounted options", this.options);
    }
    
    
    updateSelected($event:any){
        this.selected = $event.target.value;
        console.log("new value", this.selected);
        this.$emit('input', this.selected);  
    }
}
export default FormString;