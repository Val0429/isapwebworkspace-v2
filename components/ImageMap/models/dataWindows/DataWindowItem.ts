import { ESetupMode, EDragType, EVideoSource } from '../enums/EMap';
import { DragItem } from '../DragItem';

class DataWindowItem extends DragItem {
    // 圖層高度
    protected _zIndex = 100;

    // 模式
    protected _setupMode: ESetupMode = ESetupMode.preview;

    // 引擎
    videoSource: EVideoSource = EVideoSource.none;

    // 標題
    title: string = '';

    // data window control
    minimizeDataWindow: boolean = false;
    dataWindowId: string = '';
    dataWindowStyle: string = '';

    constructor(title: string, dragType: EDragType, videoSource: EVideoSource) {
        super(dragType);
        this.videoSource = videoSource;
        this.title = title;
    }

    resetStyle() {
        if (this._showPosition == undefined) {
            this._showPosition = { x: 0, y: 0 };
        }

        // 重寫 style
        this.dataWindowStyle = '';
        this.dataWindowStyle += `left:${this._showPosition.x}px;`;
        this.dataWindowStyle += `top:${this._showPosition.y}px;`;
        this.dataWindowStyle += `z-index:${this._zIndex};`;
    }

    set setupMode(value: ESetupMode) {
        this._setupMode = value;
    }
}

export { DataWindowItem };
