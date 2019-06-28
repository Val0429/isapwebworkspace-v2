import { EPageType, ESign } from './EReport';

interface IReportDashboard {
    pageType: EPageType;
    traffic: {
        sign: ESign;
        total: number;
        value: number;
        valueRatio: number;
    };
    averageOccupancy: {
        sign: ESign;
        total: number;
        value: number;
        valueRatio: number;
    };
    averageDwellTime: {
        sign: ESign;
        total: number;
        value: number;
        valueRatio: number;
    };
    demographic: {
        sign: ESign;
        value: number;
        valueRatio: number;
        sign2: ESign;
        value2: number;
        valueRatio2: number;
    };
    vipBlacklist: {
        sign: ESign;
        value: number;
        valueRatio: number;
        sign2: ESign;
        value2: number;
        valueRatio2: number;
    };
    repeatCustomer: {
        sign: ESign;
        total: number;
        value: number;
        valueRatio: number;
    };
    revenue: {
        sign: ESign;
        total: number;
        value: number;
        valueRatio: number;
    };
    transaction: {
        sign: ESign;
        total: number;
        value: number;
        valueRatio: number;
    };
    conversion: {
        sign: ESign;
        total: number;
        value: number;
        valueRatio: number;
    };
    asp: {
        sign: ESign;
        total: number;
        value: number;
        valueRatio: number;
    };
}
export { IReportDashboard };
