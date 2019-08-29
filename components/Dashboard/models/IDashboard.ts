interface IDateRange {
    startDate: Date;
    endDate: Date;
}

interface IParam {
    siteIds: string[];
    dateRange: IDateRange;
}

interface IPeakhour {
    date: Date;
    value: number;
}

export { IDateRange, IParam };
export { IPeakhour };
