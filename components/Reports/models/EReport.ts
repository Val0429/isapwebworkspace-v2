// device type
enum EDeviceMode {
    peopleCounting = 'peopleCounting',
    dwellTime = 'dwellTime',
    demographic = 'demographic',
    heatmap = 'heatmap',
    visitor = 'visitor',
    humanDetection = 'humanDetection',
}

// report site
enum EIfAllSelected {
    all = 'all',
    select = 'select',
}

// report date
enum EAddPeriodSelect {
    period = 'period',
    designation = 'designation',
}

enum EDesignationPeriod {
    today = 'today',
    yesterday = 'yesterday',
    last7days = 'last7days',
    thisWeek = 'thisWeek',
    lastWeek = 'lastWeek',
    thisMonth = 'thisMonth',
    lastMonth = 'lastMonth',
    q1 = 'q1',
    q2 = 'q2',
    q3 = 'q3',
    q4 = 'q4',
    thisYear = 'thisYear',
    none = 'none',
}

// count type
enum ECountType {
    hour = 'hour',
    day = 'day',
    week = 'week',
    month = 'month',
    quarter = 'quarter',
    year = 'year',
}

enum ETypeInOrOut {
    in = 'in',
    out = 'out',
    all = 'all',
}

enum EIncludedEmployee {
    yes = 'yes',
    no = 'no',
}

enum ESign {
    positive = 'positive',
    negative = 'negative',
    none = 'none',
}

enum EPageType {
    traffic = 'traffic',
    averageOccupancy = 'averageOccupancy',
    averageDwellTime = 'averageDwellTime',
    demographic = 'demographic',
    vipBlacklist = 'vipBlacklist',
    repeatCustomer = 'repeatCustomer',
    revenue = 'revenue',
    transaction = 'transaction',
    conversion = 'conversion',
    asp = 'asp',
    none = 'none',
}

enum EWeek {
    Mon = 'Mon',
    Tue = 'Tue',
    Wed = 'Wed',
    Thu = 'Thu',
    Fri = 'Fri',
    Sat = 'Sat',
    Sun = 'Sun',
}

enum EWeeks {
    Sunday = 'Sunday',
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
}

enum EVideoSource {
    peopleCounting = 'peopleCounting',
    humanDetection = 'humanDetection',
    heatmap = 'heatmap',
    dwellTime = 'dwellTime',
    demographic = 'demographic',
    visitor = 'visitor',
}

enum EBusinessChart {
    asp = 'asp',
    revenue = 'revenue',
    transaction = 'transaction',
    conversion = 'conversion',
}
export { EWeek, EWeeks, EVideoSource };
export { ESign, EPageType };
export { EDeviceMode, EAddPeriodSelect, EDesignationPeriod, ECountType, EIfAllSelected };
export { ETypeInOrOut, EIncludedEmployee, EBusinessChart };

enum EChartMode {
    none = 'none',
    site1Day1 = 'site1Day1',
    site1DayX = 'site1DayX',
    siteXDay1 = 'siteXDay1',
    siteXDayX = 'siteXDayX',
}

enum EAreaMode {
    none = 'none',
    all = 'all',
    single = 'single',
}

enum EGender {
    none = 'none',
    male = 'male',
    female = 'female',
}

enum ETimeMode {
    none = 'none',
    hour = 'hour',
    day = 'day',
    week = 'week',
    month = 'month',
    quarter = 'quarter',
    year = 'year',
}

enum EWeather {
    none = 'none',
    clearDay = 'clearDay',
    clearNight = 'clearNight',
    rain = 'rain',
    snow = 'snow',
    sleet = 'sleet',
    wind = 'wind',
    fog = 'fog',
    cloudy = 'cloudy',
    partlyCloudyDay = 'partlyCloudyDay',
    partlyCloudyNight = 'partlyCloudyNight',
}

enum EAgeRange {
    none = 'none',
    all = 'all',
    lower20 = 'lower20',
    m21_30 = 'm21_30',
    m31_40 = 'm31_40',
    m41_50 = 'm41_50',
    m51_60 = 'm51_60',
    upper61 = 'upper61',
}

enum EDwellTimeRange {
    none = 'none',
    all = 'all',
    lower5 = 'lower5',
    m5_15 = 'm5_15',
    m15_30 = 'm15_30',
    m30_60 = 'm30_60',
    m60_120 = 'm60_120',
    upper120 = 'upper120',
}

export { ETimeMode, EGender, EChartMode, EAreaMode, EWeather, EAgeRange, EDwellTimeRange };
