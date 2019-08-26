// 設定
enum ESetupMode {
    none = 'none',
    setup = 'setup',
    preview = 'preview',
}

// 資料引擎
enum EVideoSource {
    none = 'none',
    peopleCounting = 'peopleCounting',
    occupancy = 'occupancy',
    licensePlateRecognition = 'licensePlateRecognition',
}

// 拖曳物件類型
enum EDragType {
    none = 'none',
    deviceInTagLabel = 'deviceInTagLabel',
    deviceGroupInTagLabel = 'deviceGroupInTagLabel',
    deviceInMap = 'deviceInMap',
    dataWindowInMap = 'dataWindowInMap',
    dataWindowInDeviceGroup = 'dataWindowInDeviceGroup',
    dataWindowInDevice = 'dataWindowInDevice',
}

// 裝置類型
enum EDeviceType {
    none,
    deviceNormalCamera,
    deviceFisheyeCamera,
}

// 黑白名單類型
enum EBWListType {
    none = 'none',
    normal = 'normal',
    black = 'black',
    white = 'white',
}

export { ESetupMode, EDragType, EVideoSource, EBWListType, EDeviceType };
