import { EDragType, EVideoSource, EDeviceType } from '../enums/EMap';
import { ISize, IScale } from '../interfaces/IMap';
import { IDeviceCameraViewerSvg } from '../interfaces/IDevice';
import { IDeviceFisheyeCameraViewer } from '../interfaces/IDevice';
import { DeviceItem } from './DeviceItem';
import IconBase64 from '../IconBase64';

class DeviceFisheyeCameraItem extends DeviceItem {
    // viewer svg style
    readonly cameraViewerSVG: IDeviceCameraViewerSvg = {
        fill: 'rgba(233, 176, 76, 0.5)',
        stroke: 'rgba(233, 176, 76, 0.5)',
        strokeWidth: '3',
    };

    // 視角
    private _viewer: IDeviceFisheyeCameraViewer = {
        distance: {
            max: 300,
            min: 10,
            use: 100,
        },
    };

    // 尺寸
    size: ISize = { width: 35, height: 35 };

    // html style 設定
    cameraStyle: string = '';
    viewerStyle: string = '';

    // 圖檔連結
    src: string = IconBase64.fisheyeCameraIcon;
    focusSrc: string = IconBase64.fisheyeCameraFocusIcon;

    // api information
    cameraId: string = '';

    // constructor
    constructor(name: string, dragType: EDragType, videoSource: EVideoSource) {
        super(name, dragType, videoSource, EDeviceType.deviceFisheyeCamera);
        this.initViewer();
    }

    initViewer() {
        // distance
        this._viewer.distance.min = Math.abs(Math.round(this._viewer.distance.min));
        this._viewer.distance.max = Math.abs(Math.round(this._viewer.distance.max));
        this._viewer.distance.use = Math.abs(Math.round(this._viewer.distance.use));
        if (this._viewer.distance.min > this._viewer.distance.max) {
            const tempDistance = this._viewer.distance.max;
            this._viewer.distance.max = this._viewer.distance.min;
            this._viewer.distance.min = tempDistance;
        }
        this._viewer.distance.use = this._viewer.distance.use > this._viewer.distance.max ? this._viewer.distance.max : this._viewer.distance.use;
        this._viewer.distance.use = this._viewer.distance.use < this._viewer.distance.min ? this._viewer.distance.min : this._viewer.distance.use;
    }

    resetStyle() {
        if (this.size == undefined) {
            this.size = { width: 35, height: 21 };
        }
        if (this._viewer == undefined) {
            this._viewer = {
                distance: {
                    max: 300,
                    min: 10,
                    use: 100,
                },
            };
        }
        if (this._showPosition == undefined) {
            this._showPosition = { x: 0, y: 0 };
        }

        // 預設尺寸
        this.size.width = this.size.width != 0 ? this.size.width : 50;
        this.size.height = this.size.height != 0 ? this.size.height : 50;

        // 計算用變數
        let viewerSize: ISize = {
            width: this._viewer.distance.use * 2,
            height: this._viewer.distance.use * 2,
        };

        // reset center
        this.center = {
            x: this._showPosition.x + this.size.width / 2,
            y: this._showPosition.y + this.size.height / 2,
        };

        // camera style
        this.cameraStyle = '';
        this.cameraStyle += `width:${this.size.width}px;`;
        this.cameraStyle += `height:${this.size.height}px;`;
        this.cameraStyle += `left:${this._showPosition.x}px;`;
        this.cameraStyle += `top:${this._showPosition.y}px;`;

        // view style
        this.viewerStyle = '';
        this.viewerStyle += `width:${viewerSize.width}px;`;
        this.viewerStyle += `height:${viewerSize.height}px;`;
        this.viewerStyle += `left:${this.center.x - this._viewer.distance.use}px;`;
        this.viewerStyle += `top:${this.center.y - this._viewer.distance.use}px;`;
        this.viewerStyle += `z-index:${this._zIndex - 2};`;
    }

    set viewerDistance(value: string) {
        let valueNumber: number = parseInt(value);
        if (isNaN(valueNumber)) {
            valueNumber = 0;
        }
        if (valueNumber > this._viewer.distance.max) {
            valueNumber = this._viewer.distance.max;
        }
        if (valueNumber < this._viewer.distance.min) {
            valueNumber = this._viewer.distance.min;
        }
        this._viewer.distance.use = valueNumber;
        this.resetStyle();
    }

    get viewer(): IDeviceFisheyeCameraViewer {
        return this._viewer;
    }

    get viewerDistance(): string {
        return this._viewer.distance.use.toString();
    }
}

export { DeviceFisheyeCameraItem };
