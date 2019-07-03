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

enum ETimeMode {
    none = 'none',
    hour = 'hour',
    day = 'day',
    week = 'week',
    month = 'month',
    quarter = 'quarter',
    year = 'year',
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

export { ETimeMode, EChartMode, EAreaMode, EWeather, EAgeRange };
