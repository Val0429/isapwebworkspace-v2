import { EWeather, ETimeMode, EAreaMode } from './EHighCharts';

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

interface IDatetimeGroup {
    start: Date;
    end: Date;
    categories: string;
}

interface IChartTrafficData {
    date: Date;
    siteObjectId: string;

    temperatureMin: number;
    temperatureMax: number;
    traffic: number;
    revenue: number;
    transaction: number;
    weather: EWeather;
    i18n?: any;
    siteName?: string;
    timeMode?: ETimeMode;
    areaMode?: EAreaMode;
    conversion?: number;
    asp?: number;
    temperature?: number;
    trafficAVG?: number;
    weatherIcon?: string;
    dateStart?: Date;
    dateEnd?: Date;
    weekNumber?: number;
    quarterNumber?: number;
    timeString?: string;
    dateString?: string;
    dateStartString?: string;
    dateEndString?: string;
}

export { ISite, IDate, IDatetimeGroup, IDayRange, IChartTrafficData };
