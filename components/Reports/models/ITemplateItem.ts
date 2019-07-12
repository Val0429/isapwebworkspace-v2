import { EVideoSource, EDesignationPeriod } from '../';

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

export { ITemplateItem };
