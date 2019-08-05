interface IReportStatsticRead {
    date: string;
    totalVisitor: number;
}

declare namespace ReportStatisticRead {
    export interface Input {
        start: string;
        end: string;
        kioskIds: string[];
    }

    export interface Output {
        data: IReportStatsticRead[];
    }
}
export default ReportStatisticRead;
