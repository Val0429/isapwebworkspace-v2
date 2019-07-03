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
        total: null,
        value: null,
        valueRatio: null,
    };
    averageOccupancy = {
        sign: ESign.none,
        total: null,
        value: null,
        valueRatio: null,
    };
    averageDwellTime = {
        sign: ESign.none,
        total: null,
        value: null,
        valueRatio: null,
    };
    demographic = {
        sign: ESign.none,
        value: null,
        valueRatio: null,
        sign2: ESign.none,
        value2: null,
        valueRatio2: null,
    };
    vipBlacklist = {
        sign: ESign.none,
        value: null,
        valueRatio: null,
        sign2: ESign.none,
        value2: null,
        valueRatio2: null,
    };
    repeatCustomer = {
        sign: ESign.none,
        total: null,
        value: null,
        valueRatio: null,
    };
    revenue = {
        sign: ESign.none,
        total: null,
        value: null,
        valueRatio: null,
    };
    transaction = {
        sign: ESign.none,
        total: null,
        value: null,
        valueRatio: null,
    };
    conversion = {
        sign: ESign.none,
        total: null,
        value: null,
        valueRatio: null,
    };
    asp = {
        sign: ESign.none,
        total: null,
        value: null,
        valueRatio: null,
    };
}
export { ReportDashboard };
