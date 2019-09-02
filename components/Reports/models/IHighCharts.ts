import { EWeather, ETimeMode, EAreaMode, EAgeRange } from '../';
import { EDwellTimeRange, EBusinessChart, ECampaignTimeType } from '../';
import { EVipTrackingType } from './EReport';

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

    siteName?: string;
    i18n?: any;
    dateStart?: Date;
    dateEnd?: Date;
    timeString?: string;
    dateString?: string;
    dateStartString?: string;
    dateEndString?: string;
}

interface IChartWeather {
    temperatureMin: number;
    temperatureMax: number;
    weather: EWeather;

    temperature?: number;
    weatherIcon?: string;
}

interface ITimeMode {
    timeMode?: ETimeMode;
    weekNumber?: number;
    quarterNumber?: number;
}

interface IAreaMode {
    areaMode?: EAreaMode;
}

interface IChartTrafficData extends IChart, IChartWeather, ITimeMode, IAreaMode {
    traffic: number;
    revenue: number;
    transaction: number;

    conversion?: number;
    asp?: number;
    trafficAVG?: number;
    businessMode?: EBusinessChart;
}

interface IChartDwellTimeData extends IChart, IChartWeather, ITimeMode, IAreaMode {
    dwellTime: number;
    ageRange: EAgeRange;
    dwellTimeRange: EDwellTimeRange;
    maleCount: number;
    femaleCount: number;
    revenue: number;
    transaction: number;

    dwellTimeAVG?: number;
    maleCountPercent?: number;
    femaleCountPercent?: number;
    conversion?: number;
    asp?: number;
    businessMode?: EBusinessChart;
}

interface IChartDemographicData extends IChart, IChartWeather, ITimeMode, IAreaMode {
    ageRange: EAgeRange;
    dwellTimeRange: EDwellTimeRange;
    maleCount: number;
    femaleCount: number;

    maleCountPercent?: number;
    femaleCountPercent?: number;
}

interface IChartOccupancyData extends IChart, IChartWeather, ITimeMode, IAreaMode {
    areaId: string;
    occupancy: number;

    areaName?: string;
}

interface IChartVipTrackingData {
    type: EVipTrackingType;
    date: Date;
    personCount: number;

    i18n?: any;
    timeString?: string;
    dateString?: string;
}

interface IChartVipTrackingDetailData {
    type: EVipTrackingType;
    siteObjectId: string;
    name: string;
    data: Date;
    dwellTime: number;
    imgSrc: string;

    timeString?: string;
    dataString?: string;
    siteName?: string;
    dwellTimeString?: string;
}

interface IChartRepeatVisitorData extends IChart {
    repeatCount: number;
    ageRange: EAgeRange;
    maleCount: number;
    femaleCount: number;

    maleCountPercent?: number;
    femaleCountPercent?: number;
}

interface IChartCampaignMultiple {
    name: string;
    startDate: Date;
    endDate: Date;
    traffic: number;
    budget: number;
    trafficGainPer: number;

    i18n?: any;
    startDateString?: string;
    endDateString?: string;
}

interface IChartCampaignSingle {
    type: ECampaignTimeType;
    date: Date;
    traffic: number;

    i18n?: any;
    dateString?: string;
}

export { IValSelectItem, IBootstrapSelectItem };
export { ISite, IArea, IAgeRange, IDayRange, ISiteAreas, ISiteOfficeHourItem };
export { IChartTrafficData, IChartDwellTimeData, IChartDemographicData, IChartOccupancyData };
export { IChartRepeatVisitorData };
export { IChartVipTrackingData, IChartVipTrackingDetailData };
export { IChartCampaignMultiple, IChartCampaignSingle };
