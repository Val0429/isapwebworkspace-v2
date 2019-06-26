interface IReportTableDataBody {
    site?: string;
    area?: string;
    group?: string;
    in?: IReportTableDataBodyInOut;
    out?: IReportTableDataBodyInOut;
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

    constructor() {}

    showRowTotal(datas) {
        return datas.reduce((ty, u) => ty + u, 0);
    }

    showColTotal(datas, key) {
        return datas.reduce((ty, u) => ty[key] + u, 0);
    }
}

export { IReportTableData };
