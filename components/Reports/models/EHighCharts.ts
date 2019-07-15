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
