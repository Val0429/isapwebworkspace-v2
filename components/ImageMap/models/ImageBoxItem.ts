import { ISize, IScale, IPosition } from './interfaces/IMap';

class ImageBoxItem {
    readonly scaleSame: boolean = true;

    private _positionScale: IScale = { horizontal: 1, vertical: 1 };
    private _showSize: ISize = { width: 0, height: 0 };
    private _originalSize: ISize = { width: 0, height: 0 };

    center: IPosition = { x: 0, y: 0 };

    src: string = '';
    devices: any[] = [];
    dataWindows: any[] = [];

    constructor(src: string, originalSize: ISize, scaleSame: boolean = true) {
        this.src = src;
        this._originalSize.width = originalSize.width;
        this._originalSize.height = originalSize.height;
        this.scaleSame = scaleSame;
        this.resetScale();
    }

    private initCenter() {
        this.center.x = this._showSize.width / 2;
        this.center.y = this._showSize.height / 2;
    }

    private resetScale() {
        if (this._originalSize.width > 0 && this._originalSize.height > 0) {
            this._positionScale.horizontal = this._showSize.width / this._originalSize.width;
            this._positionScale.vertical = this.scaleSame ? this._positionScale.horizontal : this._showSize.height / this._originalSize.height;
        }
        this.initCenter();
    }

    set originalSize(value: ISize) {
        this._originalSize.width = value.width;
        this._originalSize.height = value.height;
        this.resetScale();
    }

    set showSize(value: ISize) {
        this._showSize.width = value.width;
        this._showSize.height = value.height;
        this.resetScale();
    }

    get showSize(): ISize {
        return this._showSize;
    }

    set showSizeWidth(value: number) {
        this._showSize.width = value;
        this._showSize.height = (this._originalSize.height * this._showSize.width) / this._originalSize.width;
        this.resetScale();
    }

    get positionScale(): IScale {
        return this._positionScale;
    }
}

export { ImageBoxItem };
