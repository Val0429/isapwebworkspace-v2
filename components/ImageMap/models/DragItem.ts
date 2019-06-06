import { EDragType } from './enums/EMap';
import { IPosition, IScale } from './interfaces/IMap';

class DragItem {
    // 拖曳類型
    dragType: EDragType = EDragType.none;

    // 滑鼠拖曳座標
    mousePosition: IPosition = { x: 0, y: 0 };

    // other drag, not drop this object
    pointerEventNone: boolean = false;

    // 座標比例
    protected _positionScale: IScale = { horizontal: 1, vertical: 1 };

    // 圖片原始位置
    protected _originalPosition: IPosition = { x: 0, y: 0 };

    // 圖片顯示位置
    protected _showPosition: IPosition = { x: 0, y: 0 };

    // constructor
    constructor(dragType: EDragType) {
        this.dragType = dragType;
    }

    // 重設 show positon
    resetShowPosition() {
        // check undefined
        if (this._originalPosition == undefined) {
            this._originalPosition = { x: 10, y: 10 };
        }
        if (this._showPosition == undefined) {
            this._showPosition = { x: 10, y: 10 };
        }
        if (this._positionScale == undefined) {
            this._positionScale = { horizontal: 1, vertical: 1 };
        }
        this._showPosition.x = this._originalPosition.x * this._positionScale.horizontal;
        this._showPosition.y = this._originalPosition.y * this._positionScale.vertical;
        this.resetStyle();
    }

    resetStyle() {}

    // 原始座標
    set originalPosition(value: IPosition) {
        this._originalPosition = value;
        this.resetShowPosition();
    }

    // 顯示座標
    set showPosition(value: IPosition) {
        this._showPosition = value;
        this._originalPosition.x = value.x / this._positionScale.horizontal;
        this._originalPosition.y = value.y / this._positionScale.vertical;
        this.resetShowPosition();
    }

    // 比例
    set positionScale(value: IScale) {
        this._positionScale.horizontal = value.horizontal != 0 ? value.horizontal : 1;
        this._positionScale.vertical = value.vertical != 0 ? value.vertical : 1;
        this.resetShowPosition();
    }

    get originalPosition(): IPosition {
        return this._originalPosition;
    }

    get showPosition(): IPosition {
        return this._showPosition;
    }

    get positionScale(): IScale {
        return this._positionScale;
    }
}

export { DragItem };
