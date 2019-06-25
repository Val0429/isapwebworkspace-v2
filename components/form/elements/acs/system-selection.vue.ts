import { Vue, Component, Prop, Model, Emit } from "vue-property-decorator";
import { System } from '@/config/default/api/interfaces';


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
    value!: number;    
    system:number=System.SIPASS;
    options=[];
    created(){
        this.system = this.value || System.SIPASS;
        this.update();
        this.options.push({key:System.CCURE, value:"CCURE"});
        this.options.push({key:System.SIPASS, value:"SIPASS"});
    }
    update(){        
        console.log("new value", this.system);
        this.$emit('input', this.system);  
    }
}
export default FormString;
