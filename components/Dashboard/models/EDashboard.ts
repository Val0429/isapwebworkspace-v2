enum ETime {
    today = 'today',
    yesterday = 'yesterday',
    last7day = 'last7day',
    last14day = 'last14day',
    last28day = 'last28day',
    last30day = 'last30day',
    last60day = 'last60day',
    last90day = 'last90day',
    last180day = 'last180day',
    thisYear = 'thisYear',
}

enum EMode {
    peopleCounting = 'peopleCounting',
    humanDetection = 'Human Detection',
    demographic = 'Demographic',
    dwellTime = 'dwellTime',
    visitor = 'visitor',
    vip = 'vip',
    black = 'black',
}

export { ETime, EMode };

