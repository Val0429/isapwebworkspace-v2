interface IDate {
	startDate?: Date | string;
	endDate?: Date | string;
}

interface IFilter extends IDate {
	siteId: string;
	areaId: string;
	deviceGroupId: string;
	deviceId: string;
	isEmployee: boolean | string;
	date?: Date;
	hour?: string
}

interface IRepeatVisitorFilter extends IDate {
	siteIds: string[];
}

interface ITrafficFilter extends IFilter {
	isIn: boolean | string;
}


export { IRepeatVisitorFilter, ITrafficFilter, IFilter }
