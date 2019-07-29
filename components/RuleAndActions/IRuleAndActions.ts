interface IChooseMetrics {
    active: EAction;
    siteIds: string[];
    areaIds: string[];
    deviceGroupIds: string[];
    deviceIds: string[];
    ruleName: string;
    runTimeType: ERunTimeType;
    startTime?: Date;
    endTime?: Date;
}

interface IActions {
    notifyMethod: ENotifyMethod[];
    whoNotify: EWhoNotify[];
    userIds?: string[];
    userGroupIds?: string[];
}
