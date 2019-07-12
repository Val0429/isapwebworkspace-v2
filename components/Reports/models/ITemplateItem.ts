import { EVideoSource } from './ETemplate';
import {EDesignationPeriod, EDeviceMode} from './EReport';

interface ITemplateSite {
    objectId: string;
    name: string;
}

interface ITemplateTag {
    objectId: string;
    name: string;
}

interface ITemplateSendUser {
    objectId: string;
    name: string;
}
interface ITemplateSendDate {
    day: string;
    dateSring: string;
    date: Date | string;
}

interface ITemplateItem {
    objectId: string;
    mode: EVideoSource;
    name?: string;
    type?: EDesignationPeriod;
    startDate?: Date;
    startDateString?: string;
    endDate?: Date;
    endDateString?: string;
    sites?: ITemplateSite[];
    tags?: ITemplateTag[];
    sendDates?: ITemplateSendDate[];
    sendUsers?: ITemplateSendUser[];
}

interface IReportToTemplateItem {
    mode: EDeviceMode;
    startDate?: Date;
    endDate?: Date;
    siteIds: string[];
    tagIds?: string[];
    sendUserIds?: string[];
    type?: EDesignationPeriod;
}


export { ITemplateItem, IReportToTemplateItem };
