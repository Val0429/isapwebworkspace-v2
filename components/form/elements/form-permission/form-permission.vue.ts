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
    value!: any[];

    @Prop({ type: Array, required: false })
    options: any[];
    
    leftOptions:any[]=[];    
    rightOptions:any[]=[];

    created(){
        
        console.log("created");
    }
    mounted(){
        
        console.log("mounted", this.value);
        let temp=Object.assign([], this.options);
        this.leftOptions.push(...temp);
        
        let temp2=Object.assign([], this.value);
        this.rightOptions.push(...temp2);
    }
    
    moveItems(source:any[], target:any){
        let temp = Object.assign([], source);
        let checked = temp.filter(x=>x.checked);
        let notChecked = temp.filter(x=>!x.checked);
        source.splice(0, source.length);
        source.push(...notChecked);
        target.push(...checked);
        
    }

    goToLeft(){
        this.moveItems(this.rightOptions, this.leftOptions);        
        this.updateSelected();
    }

    goToRight(){
        this.moveItems(this.leftOptions, this.rightOptions);        
        this.updateSelected();   
    }
    updateSelected(){
        let newvalue = [...this.rightOptions];
        this.$emit('input', newvalue);        
    }
}
export default FormString;