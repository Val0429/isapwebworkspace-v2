enum EChartMode {
    none = 'none',
    day1Site1 = 'day1Site1',
    day1SiteX = 'day1SiteX',
    dayXSite1 = 'dayXSite1',
    dayXSiteX = 'dayXSiteX',
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

export { ETimeMode, EChartMode, EAreaMode, EWeather };
