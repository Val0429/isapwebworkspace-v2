enum PageType {
    traffic = 'traffic',
    averageOccupancy = 'averageOccupancy',
    averageDwellTime = 'averageDwellTime',
    demographic = 'demographic',
    vipBlacklist = 'vipBlacklist',
    repeatCustomer = 'repeatCustomer',
    revenue = 'revenue',
    transaction = 'transaction',
    conversion = 'conversion',
    asp = 'asp',
    none = 'none',
}

enum Sign {
    positive = 'positive',
    negative = 'negative',
    none = 'none',
}

interface IReportDashboard {
    pageType: PageType;
    traffic: {
        sign: Sign;
        total: number;
        value: number;
        valueRatio: number;
    };
    averageOccupancy: {
        sign: Sign;
        total: number;
        value: number;
        valueRatio: number;
    };
    averageDwellTime: {
        sign: Sign;
        total: number;
        value: number;
        valueRatio: number;
    };
    demographic: {
        sign: Sign;
        value: number;
        valueRatio: number;
        sign2: Sign;
        value2: number;
        valueRatio2: number;
    };
    vipBlacklist: {
        sign: Sign;
        value: number;
        valueRatio: number;
        sign2: Sign;
        value2: number;
        valueRatio2: number;
    };
    repeatCustomer: {
        sign: Sign;
        total: number;
        value: number;
        valueRatio: number;
    };
    revenue: {
        sign: Sign;
        total: number;
        value: number;
        valueRatio: number;
    };
    transaction: {
        sign: Sign;
        total: number;
        value: number;
        valueRatio: number;
    };
    conversion: {
        sign: Sign;
        total: number;
        value: number;
        valueRatio: number;
    };
    asp: {
        sign: Sign;
        total: number;
        value: number;
        valueRatio: number;
    };
}
export { IReportDashboard, Sign, PageType };
