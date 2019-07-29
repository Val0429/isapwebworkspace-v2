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


export { EAction, ERunTimeType, ENotifyMethod, EWhoNotify }
