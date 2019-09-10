import { Component, Vue, Prop, Model, Watch } from '@/../core';
import * as XLSX from 'xlsx';

@Component
export class BasicReport extends Vue{
    @Model('input', {        
        required: false
    })
    value!:any;
    @Prop({        
        type: Array,
        required: true
    })
    fields :any[];
    @Prop({        
        type: Array,
        required: true
    })
    records: any[];
    processedRecords:any[]=[];
    @Prop({   
        type:String,     
        required: true
    })
    inf:string;
    @Prop({   
        type:String,     
        required: true
    })
    title: string;
    @Prop({        
        type:Boolean,
        required: true
    })
    isBusy: boolean;
    @Prop({        
        type:Number,
        required: true
    })
    total: number;
    sortedFields:any[]=[];
    
    currentPage: number=1;
    
    options: any[]=[];
    perPage: number=10;
    
    selectedColumns: any[]=[];
    @Prop({                
        required: true
    })
    itemsProvider:any;

    data: any[]=[];
    showTable:boolean=false;
    isMounted:boolean=false;
    doMounted(){
        this.isMounted=true;        
        this.options=this.fields.map(x=>{return{value:x.key,text:x.label}});
        this.selectedColumns = [];//this.fields.map(x=>x.key);
        this.sortedFields = [];//Object.assign([], this.fields);
        //console.log(this.options.length);        
    }
    @Watch("records",{immediate:true})
    onRecordUpdated(value:any[], oldValue:any[]){
        this.reprocessRecords();
    }
    
    // @Watch("fields",{immediate:true})
    // onFieldsUpdated(value:any[], oldValue:any[]){
    //     this.reprocessRecords();
    // }
    private reprocessRecords() {
        console.log("record updated",this.sortedFields.length, this.fields.length);
        let processedRecords = [];
        for (let record of this.records) {            
            processedRecords.push(record);
        }
        this.processedRecords = processedRecords;//.filter((value, index, self) => self.indexOf(value) === index);
    }
    private getJsonValue(obj:any){
        let result="";
        for(let key in obj){
            result+=obj[key]+"";
        }
        return result;
    }
    onUpdate(value: any) {
        if (value) {            
            this.$emit("update", value);
        }
    }
    exportToExcel(){
        let headers= this.sortedFields;
        let exportList =this.processedRecords;
        // for (let item of this.processedRecords){
        //     let newItem = {};
        //     for(let h of headers.map(x=>x.key)){
        //         newItem[h]=item[h];
        //     }
        //     exportList.push(newItem);
        // }
        console.log("headers", headers);
        let workbook = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet([headers.map(x=>x.label)]);        
        XLSX.utils.sheet_add_json(ws, exportList,  {skipHeader: true, origin: "A2"});
        XLSX.utils.book_append_sheet(workbook, ws, "Sheet1");        
        XLSX.writeFile(workbook, `${this.title}.xlsx`);
    }
    filterColumn(){
        console.log(this.selectedColumns);
        console.log(this.options);
    }
    onOptionsChange($event:any[]){
        console.log("$event", $event);
        this.sortedFields = [];
        for(let key of $event){
            this.sortedFields.push(this.fields.find(x=>x.key==key));
        }    
        //this.reprocessRecords();
    }
    onSubmit($event:any){        
        this.showTable = true;
        $event.selectedColumns = this.sortedFields;
        this.$emit("input", $event);   
        console.log("onSubmit", this.$refs);
        if(this.$refs.reportTable)(this.$refs.reportTable as any).refresh();
    }
    onReset(){        
        this.showTable = false;        
        this.$emit("input", {selectedColumns:this.sortedFields});
    }
}
export default BasicReport