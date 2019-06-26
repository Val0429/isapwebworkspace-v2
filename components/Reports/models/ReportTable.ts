interface IReportTableDataBody {
    site?: string;
    area?: string;
    group?: string;
    in?: IReportTableDataBodyInOut[];
    out?: IReportTableDataBodyInOut[];
    inTotal?: IReportTableDataBodyInOut;
    outTotal?: IReportTableDataBodyInOut;
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

interface IReportTableDataFoot {
    inTotal: IReportTableDataBodyInOut;
    outTotal: IReportTableDataBodyInOut;
}

class IReportTableData {
    head: string[] = [];
    body: IReportTableDataBody[] = [];
    foot: IReportTableDataFoot[] = [];

    constructor() {
        for (let body of this.body) {
            body.inTotal = this.showRowTotal(body.in);
            body.outTotal = this.showRowTotal(body.out);
        }

        for (let foot of this.foot) {
            foot.inTotal = this.showColTotal(this.body, 'in');
            foot.outTotal = this.showColTotal(this.body, 'out');
        }
    }

    showRowTotal(datas) {
        return datas.reduce((ty, u) => ty.value + u.value, 0);
    }

    showColTotal(datas, key) {
        return datas.reduce((ty, u) => ty[key].value + u[key].value, 0);
    }
}

export { IReportTableData };
