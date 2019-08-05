interface ICompany {}

interface IIdCard {}

interface IVisitor {
    status: number;
    objectId: string;
    name: string;
    email: string;
    phone: string;
    touchDate: string | Date;
    createdAt: string | Date;
    updatedAt: string | Date;
    company: ICompany[];
    idcard: IIdCard[];
}

interface IReportRecurring {
    lastVisitDate: string | Date;
    totalVisit: number;
    visitor: IVisitor[];
}

declare namespace ReportRecurringRead {
    export interface Input {
        start: string;
        end: string;
    }

    export interface Output {
        data: IReportRecurring[];
    }
}
export default ReportRecurringRead;
