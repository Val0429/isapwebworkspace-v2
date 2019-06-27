// device type
enum EDeviceMode {
    peopleCounting = "peopleCounting",
    dwellTime = "dwellTime",
    demographic = "demographic",
    heatmap = "heatmap",
    visitor = "visitor",
    humanDetection = "humanDetection"
}

// report date
enum EAddPeriodSelect {
    period = "period",
    designation = "designation"
}

enum EDesignationPeriod {
    today = "Today",
    yesterday = "Yesterday",
    last7days = "Last 7 days",
    thisWeek = "This Week",
    lastWeek = "Last Week",
    thisMonth = "This Month",
    lastMonth = "Last Month",
    q1 = "Q1",
    q2 = "Q2",
    q3 = "Q3",
    q4 = "Q4",
    thisYear = "This Year"
}

// count type
enum ECountType {
    hour = 'hour',
    day = 'day',
    week = 'week',
    month = 'month',
    season = 'season',
    year = 'year',
}

export { EDeviceMode, EAddPeriodSelect, EDesignationPeriod, ECountType };
