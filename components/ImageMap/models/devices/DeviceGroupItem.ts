import { EDragType, EVideoSource } from '../enums/EMap';
import { IPosition } from '../interfaces/IMap';
import { DataWindowItem } from '../dataWindows/DataWindowItem';
import { DragItem } from '../DragItem';
import { DataWindowPeopleCountingItem } from '../dataWindows/DataWindowPeopleCountingItem';
import { DataWindowOccupancyItem } from '../dataWindows/DataWindowOccupancyItem';
import { DataWindowLicensePlateRecognitionItem } from '../dataWindows/DataWindowLicensePlateRecognitionItem';

class DeviceGroupItem extends DragItem {
    // device id
    private _deviceGroupId: string = '';

    // 裝置名稱
    readonly name: string = '';

    // 資料引擎
    protected _videoSource: EVideoSource = EVideoSource.none;

    // 拖曳物件中心點
    center: IPosition;

    // 事件狀態
    event: Boolean = false;

    // data window
    dataWindow: any;

    // name label
    nameLabelStyle = '';

    // constructor
    constructor(name: string, dragType: EDragType, videoSource: EVideoSource) {
        super(dragType);
        this.name = name;
        this._videoSource = videoSource;

        switch (videoSource) {
            case EVideoSource.peopleCounting:
                this.dataWindow = new DataWindowPeopleCountingItem(this.name, dragType);
                break;
            case EVideoSource.occupancy:
                this.dataWindow = new DataWindowOccupancyItem(this.name, dragType);
                break;
            case EVideoSource.licensePlateRecognition:
                this.dataWindow = new DataWindowLicensePlateRecognitionItem(this.name, dragType);
                break;
            default:
                this.dataWindow = new DataWindowItem(this.name, dragType, EVideoSource.none);
                break;
        }
    }

    resetStyle() {}

    set deviceGroupId(value: string) {
        this._deviceGroupId = value;
    }

    get deviceGroupId(): string {
        return this._deviceGroupId;
    }

    get videoSource(): EVideoSource {
        return this._videoSource;
    }
}

export { DeviceGroupItem };
