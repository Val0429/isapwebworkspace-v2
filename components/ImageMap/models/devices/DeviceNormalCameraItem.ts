import { EDragType, EVideoSource, EDeviceType } from '../enums/EMap';
import { IPosition, ISize, IScale } from '../interfaces/IMap';
import { IDeviceCameraViewerSvg } from '../interfaces/IDevice';
import { IDeviceNormalCameraViewer, IDeviceNormalCameraViewerItem } from '../interfaces/IDevice';
import { DeviceItem } from './DeviceItem';
import IconBase64 from '../IconBase64';

class DeviceNormalCameraItem extends DeviceItem {
    // viewer svg style
    readonly cameraViewerSVG: IDeviceCameraViewerSvg = {
        fill: 'rgba(233, 176, 76, 0.5)',
        stroke: 'rgba(233, 176, 76, 0.5)',
        strokeWidth: '3',
    };

    // 視角
    private _viewer: IDeviceNormalCameraViewer = {
        deviceDefaultRotate: 0,
        angle: {
            max: 359,
            min: 30,
            use: 90,
        },
        distance: {
            max: 300,
            min: 10,
            use: 100,
        },
    };

    // 攝影機角度
    private _rotate: number = 0;

    // 尺寸
    size: ISize = { width: 35, height: 21 };

    // html style 設定
    cameraStyle: string = '';
    viewerStyle: string = '';
    viewerPath: string = '';

    // 圖檔連結
    src: string = IconBase64.normalCameraIcon;
    focusSrc: string = IconBase64.normalCameraFocusIcon;

    // api information
    cameraId: string = '';

    // constructor
    constructor(name: string, dragType: EDragType, videoSource: EVideoSource) {
        super(name, dragType, videoSource, EDeviceType.deviceNormalCamera);
        this.initViewer();
    }

    initViewer() {
        // angle
        this._viewer.angle.min = Math.abs(this._viewer.angle.min % 360);
        this._viewer.angle.max = Math.abs(this._viewer.angle.max % 360);
        this._viewer.angle.use = Math.abs(this._viewer.angle.use % 360);
        if (this._viewer.angle.min > this._viewer.angle.max) {
            let tempAngle = this._viewer.angle.max;
            this._viewer.angle.max = this._viewer.angle.min;
            this._viewer.angle.min = tempAngle;
        }
        this._viewer.angle.use = this._viewer.angle.use > this._viewer.angle.max ? this._viewer.angle.max : this._viewer.angle.use;
        this._viewer.angle.use = this._viewer.angle.use < this._viewer.angle.min ? this._viewer.angle.min : this._viewer.angle.use;

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
                deviceDefaultRotate: 0,
                angle: {
                    max: 359,
                    min: 30,
                    use: 90,
                },
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
        let thisCameraTransformScaleX = '';
        let viewerSize: ISize = {
            width: this._viewer.distance.use * 2,
            height: this._viewer.distance.use * 2,
        };
        let viewerPosition: IDeviceNormalCameraViewerItem = {
            start: { x: 0, y: 0 },
            line: { x: 0, y: 0 },
            bezier: [],
            arc: [],
        };

        // 避免角度大於 360 的重複畫線
        let viewAcrLength = Math.ceil((Math.abs(this._viewer.angle.use) % 360) / 90);
        if (this._viewer.angle.use != 0 && Math.abs(this._viewer.angle.use) % 360 == 0) {
            viewAcrLength = 4;
        }

        // reset center
        this.center = {
            x: this._showPosition.x + this.size.width / 2,
            y: this._showPosition.y + this.size.height / 2,
        };

        // camera style
        this.cameraStyle = '';
        this.cameraStyle += `width:${this.size.width}px;`;
        this.cameraStyle += `height:${this.size.height}px;`;
        this.cameraStyle += `transform-origin:${this.center.x} ${this.center.y};`;
        this.cameraStyle += `transform: ${thisCameraTransformScaleX} rotate(${this._rotate}deg);`;
        this.cameraStyle += `left:${this._showPosition.x}px;`;
        this.cameraStyle += `top:${this._showPosition.y}px;`;
        this.cameraStyle += `z-index:${this._zIndex};`;

        // viewer path
        // first point
        viewerPosition.start.x = 0;
        viewerPosition.start.y = 0;

        // line end point
        viewerPosition.line.x = this._viewer.distance.use;
        viewerPosition.line.y = 0;

        let tempArcStart: IPosition = {
            x: viewerPosition.line.x,
            y: viewerPosition.line.y,
        };

        for (let i = 0; i < viewAcrLength; i++) {
            let tempAngle = this._viewer.angle.use > (i + 1) * 90 ? 90 : this._viewer.angle.use - i * 90;
            let tempArc: IPosition = { x: 0, y: 0 };
            let tempBezier: IPosition = { x: 0, y: 0 };

            // arc end point
            tempArc.x = this._viewer.distance.use * Math.cos(((tempAngle + i * 90) / 180) * Math.PI);
            tempArc.y = this._viewer.distance.use * Math.sin(((tempAngle + i * 90) / 180) * Math.PI);

            // 角平分線向量
            tempBezier.x = tempArc.x + tempArcStart.x;
            tempBezier.y = tempArc.y + tempArcStart.y;

            // 求角平分線向量的純量 (長度)
            let dist = Math.sqrt(Math.pow(tempBezier.x, 2) + Math.pow(tempBezier.y, 2));

            // 起點到 bezier 的長度
            let tempNumber = Math.cos((tempAngle / 360) * Math.PI) != 0 ? Math.cos((tempAngle / 360) * Math.PI) : 1;
            let bezLen = this._viewer.distance.use / tempNumber;

            // 起點到 bezier 的比例
            dist = dist != 0 ? dist : 1;
            let rate = bezLen / dist;

            // 起點到 bezier 的向量
            tempBezier.x *= rate;
            tempBezier.y *= rate;

            viewerPosition.arc.push(JSON.parse(JSON.stringify(tempArc)));
            viewerPosition.bezier.push(JSON.parse(JSON.stringify(tempBezier)));

            tempArcStart = {
                x: tempArc.x,
                y: tempArc.y,
            };
        }

        // reset draw center
        viewerPosition.start.x = Math.round(viewerSize.width / 2);
        viewerPosition.start.y = Math.round(viewerSize.height / 2);

        viewerPosition.line.x = Math.round(viewerPosition.line.x + viewerPosition.start.x);
        viewerPosition.line.y = Math.round(viewerPosition.line.y + viewerPosition.start.y);

        for (let i = 0; i < viewAcrLength; i++) {
            viewerPosition.arc[i].x = Math.round(viewerPosition.start.x + viewerPosition.arc[i].x);
            viewerPosition.bezier[i].x = Math.round(viewerPosition.start.x + viewerPosition.bezier[i].x);
            viewerPosition.arc[i].y = Math.round(viewerPosition.start.y + viewerPosition.arc[i].y);
            viewerPosition.bezier[i].y = Math.round(viewerPosition.start.y + viewerPosition.bezier[i].y);
        }

        // view svg path & reset center
        let startToLine: IPosition = {
            x: viewerPosition.line.x - viewerPosition.start.x,
            y: viewerPosition.line.y - viewerPosition.start.y,
        };

        this.viewerPath = '';
        this.viewerPath += `m${viewerPosition.start.x} ${viewerPosition.start.y}`;
        this.viewerPath += ` `;
        this.viewerPath += `l${startToLine.x} ${startToLine.y}`;
        this.viewerPath += ` `;

        let tempStartPoint: IPosition = {
            x: viewerPosition.line.x,
            y: viewerPosition.line.y,
        };

        for (let i = 0; i < viewerPosition.arc.length; i++) {
            let thisLoopArc = viewerPosition.arc[i];
            let thisLoopBezier = viewerPosition.bezier[i];

            let lineToBezier: IPosition = {
                x: thisLoopBezier.x - tempStartPoint.x,
                y: thisLoopBezier.y - tempStartPoint.y,
            };

            let drawPoint: IPosition = {
                x: thisLoopArc.x - tempStartPoint.x,
                y: thisLoopArc.y - tempStartPoint.y,
            };

            // 畫弧線
            this.viewerPath += `q${lineToBezier.x} ${lineToBezier.y},`;
            this.viewerPath += `${drawPoint.x} ${drawPoint.y}`;

            tempStartPoint = {
                x: thisLoopArc.x,
                y: thisLoopArc.y,
            };
        }

        // 接回原點
        this.viewerPath += ` `;
        this.viewerPath += `z`;

        // ///////////////////////////////////////////////////////////

        // let arcEndX = this._viewer.distance.use / Math.cos(45);
        // let arcEndY = this._viewer.distance.use / Math.cos(45);
        // this.viewerPath = `M0 0`;
        // this.viewerPath += ` `;
        // this.viewerPath += `l${arcEndX} ${arcEndY}`;
        // this.viewerPath += ` `;
        // this.viewerPath += `A45 45, 0, 0, 0, 125 125`;

        // ///////////////////////////////////////////////////////////

        // view style
        this.viewerStyle = '';
        this.viewerStyle += `width:${viewerSize.width}px;`;
        this.viewerStyle += `height:${viewerSize.height}px;`;
        this.viewerStyle += `transform-origin:${viewerPosition.start.x}px ${viewerPosition.start.y}px;`;
        this.viewerStyle += `transform:rotate(${this._viewer.deviceDefaultRotate + this._rotate - this._viewer.angle.use / 2}deg);`;
        this.viewerStyle += `left:${this.center.x - viewerPosition.start.x}px;`;
        this.viewerStyle += `top:${this.center.y - viewerPosition.start.y}px;`;
        this.viewerStyle += `z-index:${this._zIndex - 2};`;
    }

    set rotate(value: string) {
        let tmepRotate = parseInt(value);
        if (tmepRotate >= 0 && tmepRotate <= 360) {
            this._rotate = tmepRotate;
        } else {
            console.log('rotate: only 0~360!');
        }
        this.resetStyle();
    }

    set viewerAngle(value: string) {
        let valueNumber: number = parseInt(value);
        if (isNaN(valueNumber)) {
            valueNumber = 0;
        }
        if (valueNumber > this._viewer.angle.max) {
            valueNumber = this._viewer.angle.max;
        }
        if (valueNumber < this._viewer.angle.min) {
            valueNumber = this._viewer.angle.min;
        }
        this._viewer.angle.use = valueNumber;
        this.resetStyle();
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

    get viewer(): IDeviceNormalCameraViewer {
        return this._viewer;
    }

    get viewerAngle(): string {
        return this._viewer.angle.use.toString();
    }

    get viewerDistance(): string {
        return this._viewer.distance.use.toString();
    }

    get rotate(): string {
        return this._rotate.toString();
    }
}

export { DeviceNormalCameraItem };
