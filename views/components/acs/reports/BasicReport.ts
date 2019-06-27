import { Component, Vue } from 'vue-property-decorator';
import * as XLSX from 'xlsx';

interface BasicReport{
    currentPage:number;
    options:any[];
    perPage:number;
    records:any[];
    selectedColumns:any[];
    isBusy:boolean;
    data:any[];
    fields :any[];
    exportToExcel():void;
    filterColumn():void;
    tableTitle:string;
}
class BasicReportImpl extends Vue implements  BasicReport{
    tableTitle: string;
    currentPage: number=1;
    fields :any[]=[];
    options: any[]=[];
    perPage: number=10;
    records: any[]=[];
    selectedColumns: any[]=[];
    isBusy: boolean=false;
    data: any[]=[];
    exportToExcel(){
        let headers= this.fields.filter(x=> this.selectedColumns.find(y=>y==x.key));
        let exportList =[];
        for (let item of this.records){
            let newItem = {};
            for(let h of headers.map(x=>x.key)){
                newItem[h]=item[h];
            }
            exportList.push(newItem);
        }
        console.log("headers", headers);
        let workbook = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet([headers.map(x=>x.label)]);        
        XLSX.utils.sheet_add_json(ws, exportList,  {skipHeader: true, origin: "A2"});
        XLSX.utils.book_append_sheet(workbook, ws, "Sheet1");        
        XLSX.writeFile(workbook, `${this.tableTitle}.xlsx`);
    }
    filterColumn(){
        console.log(this.selectedColumns);
        console.log(this.options);
    }
}
export{BasicReport, BasicReportImpl}