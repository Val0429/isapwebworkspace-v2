import { IPosition, IRange } from './IMap';

// 相機視角 svg
interface IDeviceCameraViewerSvg {
    fill: string;
    stroke: string;
    strokeWidth: string;
}

// 普通相機視角物件
interface IDeviceNormalCameraViewerItem {
    start: IPosition;
    line: IPosition;
    bezier: IPosition[];
    arc: IPosition[];
}

interface IDeviceNormalCameraViewer {
    deviceDefaultRotate: number;
    angle: IRange;
    distance: IRange;
}

// 魚眼相機視角
interface IDeviceFisheyeCameraViewer {
    distance: IRange;
}

// 普通相機視角

export { IDeviceCameraViewerSvg };
export { IDeviceNormalCameraViewerItem, IDeviceNormalCameraViewer };
export { IDeviceFisheyeCameraViewer };
