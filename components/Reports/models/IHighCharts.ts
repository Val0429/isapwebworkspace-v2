import { EWeather, ETimeMode, EAreaMode, EAgeRange } from './EHighCharts';

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

interface ISiteOfficeHourItem {
    startHour: number;
    endHour: number;
}

interface IChartTrafficData {
    date: Date;
    siteObjectId: string;
    traffic: number;
    revenue: number;
    temperatureMin: number;
    temperatureMax: number;
    transaction: number;
    weather: EWeather;

    // not outside
    conversion?: number;
    asp?: number;
    trafficAVG?: number;

    // every report
    siteName?: string;
    timeMode?: ETimeMode;
    areaMode?: EAreaMode;
    i18n?: any;
    temperature?: number;
    weatherIcon?: string;
    weekNumber?: number;
    quarterNumber?: number;
    dateStart?: Date;
    dateEnd?: Date;
    timeString?: string;
    dateString?: string;
    dateStartString?: string;
    dateEndString?: string;
}

interface IChartDemographicData {
    date: Date;
    siteObjectId: string;
    ageRange: EAgeRange;
    maleCount: number;
    femaleCount: number;
    temperatureMin: number;
    temperatureMax: number;
    weather: EWeather;

    // not outside
    maleCountPercent?: number;
    femaleCountPercent?: number;

    // every report
    siteName?: string;
    timeMode?: ETimeMode;
    areaMode?: EAreaMode;
    i18n?: any;
    temperature?: number;
    weatherIcon?: string;
    weekNumber?: number;
    quarterNumber?: number;
    dateStart?: Date;
    dateEnd?: Date;
    timeString?: string;
    dateString?: string;
    dateStartString?: string;
    dateEndString?: string;
}

export { ISite, IDate, ISiteOfficeHourItem, IDatetimeGroup, IDayRange };
export { IChartTrafficData, IChartDemographicData };
