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

enum ERuleMode {
    none = 'none',
    singleToday = 'singleToday',
    singleCurrent = 'singleCurrent',
    multipleToday = 'multipleToday',
    multipleCurrent = 'multipleCurrent',
}

enum EEqualMode {
    none = 'none',
    more = 'more',
    moreEqual = 'moreEqual',
    equal = 'equal',
    less = 'less',
    lessEqual = 'lessEqual',
}

enum EAndMode {
    none = 'none',
    and = 'and',
    or = 'or',
}

export { EAction, ERunTimeType, ENotifyMethod, EWhoNotify };
export { ESiteCountMode, ERuleMode, EEqualMode, EAndMode };
