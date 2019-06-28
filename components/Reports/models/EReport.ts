// device type
enum EDeviceMode {
    peopleCounting = 'peopleCounting',
    dwellTime = 'dwellTime',
    demographic = 'demographic',
    heatmap = 'heatmap',
    visitor = 'visitor',
    humanDetection = 'humanDetection',
}

// report date
enum EAddPeriodSelect {
    period = 'period',
    designation = 'designation',
}

enum EDesignationPeriod {
    today = 'Today',
    yesterday = 'Yesterday',
    last7days = 'Last 7 days',
    thisWeek = 'This Week',
    lastWeek = 'Last Week',
    thisMonth = 'This Month',
    lastMonth = 'Last Month',
    q1 = 'Q1',
    q2 = 'Q2',
    q3 = 'Q3',
    q4 = 'Q4',
    thisYear = 'This Year',
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

export { ESign, EPageType };
export { EDeviceMode, EAddPeriodSelect, EDesignationPeriod, ECountType };
