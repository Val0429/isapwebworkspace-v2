import { EWeather, ETimeMode, EAreaMode, EAgeRange } from '../';
import { EDwellTimeRange } from '../';
import { EBusinessChart } from './EReport';

interface IValSelectItem {
    id: string;
    text: string;
}

interface IBootstrapSelectItem {
    value: string;
    text: string;
}

interface IArea {
    objectId: string;
    name: string;
}

interface ISite {
    objectId: string;
    name: string;
    officeHour: IDayRange[];
}

interface ISiteAreas extends ISite {
    areas: IArea[];
}

interface ISiteOfficeHourItem {
    startHour: number;
    endHour: number;
}

interface IDayRange {
    startDay: string;
    endDay: string;
    startDate: string;
    endDate: string;
}

interface IAgeRange {
    lower20: number;
    m21_30: number;
    m31_40: number;
    m41_50: number;
    m51_60: number;
    upper61: number;
}

interface IChart {
    date: Date;
    siteObjectId: string;
    temperatureMin: number;
    temperatureMax: number;
    weather: EWeather;

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

interface IChartTrafficData extends IChart {
    traffic: number;
    revenue: number;
    transaction: number;

    conversion?: number;
    asp?: number;
    trafficAVG?: number;
    businessMode?: EBusinessChart;
}

interface IChartDwellTimeData extends IChart {
    ageRange: EAgeRange;
    dwellTimeRange: EDwellTimeRange;
    maleCount: number;
    femaleCount: number;
    revenue: number;
    transaction: number;

    dwellTime?: number;
    dwellTimeAVG?: number;
    maleCountPercent?: number;
    femaleCountPercent?: number;
    conversion?: number;
    asp?: number;
    businessMode?: EBusinessChart;
}

interface IChartDemographicData extends IChart {
    ageRange: EAgeRange;
    dwellTimeRange: EDwellTimeRange;
    maleCount: number;
    femaleCount: number;

    maleCountPercent?: number;
    femaleCountPercent?: number;
}

interface IChartOccupancyData extends IChart {
    areaId: string;
    occupancy: number;

    areaName?: string;
}

interface IChartRepeatVisitorData extends IChart {
    repeatCount: number;
    ageRange: EAgeRange;
    maleCount: number;
    femaleCount: number;

    maleCountPercent?: number;
    femaleCountPercent?: number;
}

interface IChartCampaignMultipe {
    name: string;
    startDate: Date;
    endDate: Date;
    traffic: number;
    budget: number;

    i18n?: any;
    trafficGainPer?: number;
    startDateString?: string;
    endDateString?: string;
}

interface IChartCampaignSingle {}

export { IValSelectItem, IBootstrapSelectItem };
export { ISite, IArea, IAgeRange, ISiteAreas, ISiteOfficeHourItem };
export { IDayRange };
export { IChartTrafficData, IChartDemographicData, IChartOccupancyData, IChartRepeatVisitorData };
export { IChartDwellTimeData };
export { IChartCampaignMultipe, IChartCampaignSingle };
