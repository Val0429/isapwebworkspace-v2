import { Component, Vue, Prop, Model } from '@/../core';

@Component
export class FilterForm extends Vue{
    @Model('input', {        
        required: false
    })
    value!:any;
    @Prop({   
        type:String,     
        required: true
    })
    inf:string;
    @Prop({   
        type:Boolean,     
        required: true
    })
    visible:boolean;

    isMounted:boolean=false;
    doMounted(){
        this.isMounted=true;
        
    }
    created(){   
    }
    mounted(){
    }
    onSubmit($event:any){      
        this.$emit("input", $event);        
    }
}
export default FilterForm