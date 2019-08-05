interface IReportException {
    date: string;
    totalException: number;
}

declare namespace ReportExceptionRead {
    export interface Input {
        start: string;
        end: string;
        kioskIds: string[];
    }

    export interface Output {
        data: IReportException[];
    }
}
export default ReportExceptionRead;
