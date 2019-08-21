enum EAction {
    none = 'none',
    yes = 'yes',
    no = 'no',
}

enum ERunTimeType {
    none = 'none',
    anyTime = 'anyTime',
    startAndEnd = 'startAndEnd',
}

enum ENotifyMethod {
    none = 'none',
    mobileApp = 'mobileApp',
    sms = 'sms',
    email = 'email',
    httpCommand = 'httpCommand',
}

enum EWhoNotify {
    none = 'none',
    storeManager = 'storeManager',
    permissionOfStore = 'permissionOfStore',
    users = 'users',
    userGroup = 'userGroup',
}

enum ESiteCountMode {
    none = 'none',
    single = 'single',
    multiple = 'multiple',
}

enum EEqualMode {
    none = '',
    more = 'more',
    moreEqual = 'moreEqual',
    equal = 'equal',
    less = 'less',
    lessEqual = 'lessEqual',
}

enum EAndMode {
    none = '',
    and = 'and',
    or = 'or',
}

enum ERuleMode {
    none = '',
    trafficSingleSiteToday = 'trafficSingleSiteToday',
    trafficSingleSiteCurrent = 'trafficSingleSiteCurrent',
    trafficMultipleSiteToday = 'trafficMultipleSiteToday',
    trafficMultipleSiteCurrent = 'trafficMultipleSiteCurrent',
    occupancySingleSite = 'occupancySingleSite',
    occupancyMultipleSite = 'occupancyMultipleSite',
    vipVip = 'vipVip',
    vipBlacklist = 'vipBlacklist',
}

enum EThresholdMode {
    none = '',
    high = 'high',
    medium = 'medium',
    low = 'low',
}

export { EAction, ERunTimeType, ENotifyMethod, EWhoNotify };
export { ESiteCountMode, ERuleMode, EEqualMode, EAndMode, EThresholdMode };