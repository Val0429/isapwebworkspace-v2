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
    options: {key:any, value:any}[];
    
    leftOptions:{key:any, value:any}[]=[];    
    rightOptions:{key:any, value:any}[]=[];

    created(){
        
        console.log("created");
    }
    mounted(){
        
        console.log("mounted", this.value, this.options);

        let temp2=Object.assign([], this.value && this.value.length>0?this.value.map(x=> x.objectId ? x.objectId : x):[]);
        this.$emit('input', temp2);        
        if(temp2 && temp2.length>0){
            for(let key of temp2){
                let itemValue = this.options.find(x=>x.key==key);
                if(itemValue){
                    let newItem={key:itemValue.key, value:itemValue.value};                    
                    this.rightOptions.push(newItem);
                }            
            }
        }

        let temp=Object.assign([], this.options);
        if(!temp || temp.length<=0)return;

        for(let item of temp){
            item.checked=false;
            if(this.rightOptions.findIndex(x=>x.key == item.key)<0) this.leftOptions.push(item);
        }            
        
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
        let newValue = [...this.rightOptions.map(x=>x.key)];
        console.log("new value", newValue);
        this.$emit('input', newValue);        
    }
}
export default MultiSelections;