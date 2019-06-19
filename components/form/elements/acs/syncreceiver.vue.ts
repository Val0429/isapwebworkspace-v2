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
    items:any[]=[];
    created(){        
        console.log("created");
    }
    mounted(){           
        console.log("mounted value", this.value);
        this.items=Object.assign([],this.value?this.value:[]);
        if(this.items.length==0)this.moreItem();
    }
    
    moreItem(){
        let newId = "receiver"+this.items.length;
        this.items.push({receivename:"", emailaddress:"", id:newId});
    }
    update(){        
        console.log("new value", this.items);
        this.$emit('input', this.items);  
    }
}
export default FormString;