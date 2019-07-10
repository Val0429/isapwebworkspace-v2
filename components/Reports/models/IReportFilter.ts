import { ETimeMode } from '@/components/Reports';

interface IFilterCondition {
    startDate: Date;
    endDate: Date;
    firstSiteId?: string;
    siteIds: string[];
    tagIds: string[];
    type: ETimeMode;
}

export { IFilterCondition };
