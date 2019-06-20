import XLSX from 'xlsx';

export default function excel2json(file) {
    return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.onload = function(e: any) {
            const data = e.target.result;
            let wb: any = XLSX.read(data, {
                type: 'binary',
            });
            const result = [];
            wb.SheetNames.forEach((sheetName) => {
                let sheet = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
                result.push({
                    sheetName: sheetName,
                    sheet: sheet,
                });
            });
            resolve(result);
        };
        reader.readAsBinaryString(file);
    });
}
