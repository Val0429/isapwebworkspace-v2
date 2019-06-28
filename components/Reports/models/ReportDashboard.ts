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

class ReportDashboard {
    pageType = EPageType.none;
    traffic = {
        sign: ESign.none,
        total: -1,
        value: -1,
        valueRatio: -1,
    };
    averageOccupancy = {
        sign: ESign.none,
        total: -1,
        value: -1,
        valueRatio: -1,
    };
    averageDwellTime = {
        sign: ESign.none,
        total: -1,
        value: -1,
        valueRatio: -1,
    };
    demographic = {
        sign: ESign.none,
        value: -1,
        valueRatio: -1,
        sign2: ESign.none,
        value2: -1,
        valueRatio2: -1,
    };
    vipBlacklist = {
        sign: ESign.none,
        value: -1,
        valueRatio: -1,
        sign2: ESign.none,
        value2: -1,
        valueRatio2: -1,
    };
    repeatCustomer = {
        sign: ESign.none,
        total: -1,
        value: -1,
        valueRatio: -1,
    };
    revenue = {
        sign: ESign.none,
        total: -1,
        value: -1,
        valueRatio: -1,
    };
    transaction = {
        sign: ESign.none,
        total: -1,
        value: -1,
        valueRatio: -1,
    };
    conversion = {
        sign: ESign.none,
        total: -1,
        value: -1,
        valueRatio: -1,
    };
    asp = {
        sign: ESign.none,
        total: -1,
        value: -1,
        valueRatio: -1,
    };
}
export { ReportDashboard };
