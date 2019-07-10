import {ETimeMode} from "@/components/Reports";

interface IFilterCondition {
	startDate: string | Date;
	endDate: string | Date;
	firstSiteId?: string;
	siteIds: string[];
	tagIds: string[];
	type: ETimeMode;
}

export { IFilterCondition };
