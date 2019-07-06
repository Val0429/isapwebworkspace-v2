import { ESign } from './EReport';

interface IReportTableDataTotal {
    inTotal?: IReportTableDataBodyInOut;
    outTotal?: IReportTableDataBodyInOut;
    inTotal2?: IReportTableDataBodyInOut;
    outTotal2?: IReportTableDataBodyInOut;
}

interface stratum {
    objectId: string;
    name: string;
}

interface IReportTableDataBody extends IReportTableDataTotal {
    site?: stratum;
    area?: stratum;
    group?: stratum;
    in: IReportTableDataBodyInOut[];
    out: IReportTableDataBodyInOut[];
    in2?: IReportTableDataBodyInOut[];
    out2?: IReportTableDataBodyInOut[];
}

interface IReportTableDataBodyInOut {
    sign?: ESign;
    value: number;
    valueRatio: number;
}

interface IReportTableTitle {
    titleCount: number;
    title1?: string;
    title2?: string;
    title3?: string;
    title4?: string;
    inTotalTitle: string;
    outTotalTitle: string;
}

export { IReportTableDataTotal, IReportTableDataBody, IReportTableDataBodyInOut, IReportTableTitle };
