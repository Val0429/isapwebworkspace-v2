import { EWeather } from './EHighCharts';

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
    dateString: string;
}

interface ITrafficData {
    datetime: Date;
    siteId: string;
    temperature: number;
    traffic: number;
    revenue: number;
    transaction: number;
    conversion: number;
    asp: string;
    weather: EWeather;
    i18n?: any;
    weatherIcon?: string;
}

export { ISite, IDate, IDayRange, ITrafficData };
