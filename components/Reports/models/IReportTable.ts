import { ESign } from './EReport';

interface IReportTableDataTotal {
    inTotal?: IReportTableDataBodyInOut;
    outTotal?: IReportTableDataBodyInOut;
}

interface IReportTableDataBody extends IReportTableDataTotal {
    site?: string;
    area?: string;
    group?: string;
    in: IReportTableDataBodyInOut[];
    out: IReportTableDataBodyInOut[];
}

interface IReportTableDataBodyInOut {
    sign?: ESign;
    value: number;
    valueRatio: number;
}

export { IReportTableDataTotal, IReportTableDataBody, IReportTableDataBodyInOut };
