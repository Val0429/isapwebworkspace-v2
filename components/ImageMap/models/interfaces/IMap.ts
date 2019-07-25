// 位置
interface IPosition {
    // x 座標
    x: number;

    // y 座標
    y: number;
}

// 尺寸
interface ISize {
    // 寬度 0~無限
    width: number;

    // 高度 0~無限
    height: number;
}

// 比例
interface IScale {
    horizontal: number;
    vertical: number;
}

// 座標
interface ILocation {
    // 緯度 -90 ~ 90
    lat: number;

    // 經度 -180 ~ 180
    lng: number;
}

// 範圍
interface IRange {
    max: number;
    min: number;
    use: number;
}

// map 繪製設定
interface IDrawConfig {
    deviceGroupInTagLabel: boolean;
    deviceInTagLabel: boolean;
    dataWindowInMap: boolean;
    dataWindowInDeviceGroup: boolean;
    dataWindowInDevice: boolean;
    deviceInMap: boolean;
    nameInDevice: boolean;
    viewerInDevice: boolean;
}

// 拖曳事件
interface IDropItem {
    dragType: string;
    mousePosition: IPosition;
    size: ISize;
    left: number;
    data: Object;
}

export { IPosition, ISize, IScale, ILocation, IRange };
export { IDropItem, IDrawConfig };
