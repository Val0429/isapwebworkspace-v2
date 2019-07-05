import { ESign } from './EReport';

interface IReportTableDataTotal {
    inTotal?: IReportTableDataBodyInOut;
    outTotal?: IReportTableDataBodyInOut;
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
}

interface IReportTableDataBodyInOut {
    sign?: ESign;
    value: number;
    valueRatio: number;
}

export { IReportTableDataTotal, IReportTableDataBody, IReportTableDataBodyInOut };
