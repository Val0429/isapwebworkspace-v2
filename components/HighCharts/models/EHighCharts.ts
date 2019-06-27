enum EChartMode {
    none = 'none',
    day1Site1 = 'day1Site1',
    day1SiteX = 'day1SiteX',
    dayXSite1 = 'dayXSite1',
    dayXSiteX = 'dayXSiteX',
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

enum ESiteMode {
    none = 'none',
    single = 'single',
    multipe = 'multipe',
}

enum EWeather {
    none = 'none',
    sunny = 'sunny',
    cloudy = 'cloudy',
    rain = 'rain',
}

export { ETimeMode, ESiteMode, EChartMode, EWeather };
