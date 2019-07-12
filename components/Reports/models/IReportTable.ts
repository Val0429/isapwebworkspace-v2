import { ESign } from '../';

interface IReportTableDataTotal {
    item1Total?: IReportTableDataBodyInOut;
    item2Total?: IReportTableDataBodyInOut;
    item3Total?: IReportTableDataBodyInOut;
    item4Total?: IReportTableDataBodyInOut;
}

interface stratum {
    objectId: string;
    name: string;
}

interface IReportTableDataBody extends IReportTableDataTotal {
    site?: stratum;
    area?: stratum;
    group?: stratum;
    item1: IReportTableDataBodyInOut[];
    item2: IReportTableDataBodyInOut[];
    item3?: IReportTableDataBodyInOut[];
    item4?: IReportTableDataBodyInOut[];
}

interface IReportTableDataBodyInOut {
    sign?: ESign;
    link?: boolean;
    value: number;
    valueRatio: number;
}

interface IReportTableTitle {
    titleCount: number;
    title1?: string;
    title2?: string;
    title3?: string;
    title4?: string;
    title1Title: string;
    title2Title: string;
}

export { IReportTableDataTotal, IReportTableDataBody, IReportTableDataBodyInOut, IReportTableTitle };
