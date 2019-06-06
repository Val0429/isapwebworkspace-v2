import { EDragType, EVideoSource, EDeviceType } from '../enums/EMap';
import { IPosition } from '../interfaces/IMap';
import { DragItem } from '../DragItem';
import { DataWindowItem } from '../dataWindows/DataWindowItem';
import { DataWindowLicensePlateRecognitionItem } from '../dataWindows/DataWindowLicensePlateRecognitionItem';
import { DataWindowOccupancyItem } from '../dataWindows/DataWindowOccupancyItem';
import { DataWindowPeopleCountingItem } from '../dataWindows/DataWindowPeopleCountingItem';

class DeviceItem extends DragItem {
    // device id
    private _deviceId: string = '';

    // device 類型
    protected _deviceType: EDeviceType;

    // 資料引擎
    protected _videoSource: EVideoSource;

    // 圖層高度
    protected _zIndex = 80;

    // 裝置名稱
    name: string = '';

    // 拖曳物件中心點
    center: IPosition = { x: 0, y: 0 };

    // 事件狀態
    event: Boolean = false;

    // data window
    dataWindow: any = new DataWindowItem('', EDragType.none, EVideoSource.none);

    // name label
    nameLabelStyle = '';

    // 是否被關注
    focus = false;

    // constructor
    constructor(name: string, dragType: EDragType, videoSource: EVideoSource, deviceType: EDeviceType) {
        super(dragType);
        this.name = name;
        this._videoSource = videoSource;
        this._deviceType = deviceType;

        switch (videoSource) {
            case EVideoSource.peopleCounting:
                this.dataWindow = new DataWindowPeopleCountingItem(this.name, EDragType.dataWindowInDevice);
                break;
            case EVideoSource.occupancy:
                this.dataWindow = new DataWindowOccupancyItem(this.name, EDragType.dataWindowInDevice);
                break;
            case EVideoSource.licensePlateRecognition:
                this.dataWindow = new DataWindowLicensePlateRecognitionItem(this.name, EDragType.dataWindowInDevice);
                break;
            default:
                this.dataWindow = new DataWindowItem(this.name, EDragType.dataWindowInDevice, EVideoSource.none);
                break;
        }
    }

    resetStyle() {}

    get deviceType(): EDeviceType {
        return this._deviceType;
    }

    set deviceId(value: string) {
        this._deviceId = value;
    }

    get deviceId(): string {
        return this._deviceId;
    }

    get videoSource(): EVideoSource {
        return this._videoSource;
    }

    set zIndex(value: number) {
        this._zIndex = value;
        this.resetStyle();
    }
}

export { DeviceItem };
