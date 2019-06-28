import { EWeather, ETimeMode } from './EHighCharts';

interface IDayRange {
    startDay: string;
    endDay: string;
    startDate: string;
    endDate: string;
}

interface ISite {
    objectId: string;
    name: string;
    officeHour: IDayRange[];
}

interface IDate {
    date: Date;
    dateStart?: Date;
    dateEnd?: Date;
    dateString?: string;
    dateStartString?: string;
    dateEndString?: string;
}

interface IChartTrafficData {
    date: Date;
    siteObjectId: string;
    temperature: number;
    traffic: number;
    revenue: number;
    transaction: number;
    conversion: number;
    asp: number;
    weather: EWeather;
    i18n?: any;
    siteName?: string;
    timeMode?: ETimeMode;
    trafficAVG?: number;
    conversionPercentage?: number;
    weatherIcon?: string;
    dateStart?: Date;
    dateEnd?: Date;
    timeString?: string;
    dateString?: string;
    dateStartString?: string;
    dateEndString?: string;
}

export { ISite, IDate, IDayRange, IChartTrafficData };
