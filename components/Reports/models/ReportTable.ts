interface IReportTableDataBody extends IReportTableDataTotal {
    site?: string;
    area?: string;
    group?: string;
    in?: IReportTableDataBodyInOut[];
    out?: IReportTableDataBodyInOut[];
}

interface IReportTableDataBodyInOut {
    sign: Sign;
    value: number;
    valueRatio: number;
}

enum Sign {
    positive = 'positive',
    negative = 'negative',
    none = 'none',
}

interface IReportTableDataTotal {
    inTotal?: IReportTableDataBodyInOut;
    outTotal?: IReportTableDataBodyInOut;
}

class IReportTableData {
    head: string[] = [];
    body: IReportTableDataBody[] = [];
    foot: IReportTableDataTotal[] = [];

    constructor() {
        for (let body of this.body) {
            body.inTotal = this.showRowTotal(body.in);
            body.outTotal = this.showRowTotal(body.out);
        }

        for (let index in this.body) {
            let total: IReportTableDataTotal = {
                inTotal: this.showColTotal(this.body, 'in'),
                outTotal: this.showColTotal(this.body, 'out'),
            };
            this.foot.push(total);
        }
        console.log('tset', this.body);
    }

    showRowTotal(datas) {
        return datas.reduce((ty, u) => ty.value + u.value, 0);
    }

    showColTotal(datas, key) {
        return datas.reduce((ty, u) => ty[key].value + u[key].value, 0);
    }
}

export { IReportTableData };
