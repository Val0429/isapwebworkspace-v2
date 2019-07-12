import { ETimeMode } from '../';

interface IFilterCondition {
    startDate: Date;
    endDate: Date;
    firstSiteId?: string;
    siteIds: string[];
    tagIds: string[];
    type: ETimeMode;
}

export { IFilterCondition };
