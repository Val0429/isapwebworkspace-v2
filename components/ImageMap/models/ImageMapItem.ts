import { ImageBoxItem } from './ImageBoxItem';
import { ESetupMode, EDragType } from './enums/EMap';
import { IDropItem, IDrawConfig } from './interfaces/IMap';
import IconBase64 from './IconBase64';

class ImageMapItem {
    private _setupMode: ESetupMode = ESetupMode.setup;
    dragMode: boolean = true;
    imageBox = new ImageBoxItem(IconBase64.pngEmpty, { width: 1, height: 1 });
    draw: IDrawConfig = {
        deviceGroupInTagLabel: true,
        deviceInTagLabel: true,
        dataWindowInMap: true,
        dataWindowInDeviceGroup: true,
        dataWindowInDevice: true,
        deviceInMap: true,
        nameInDevice: true,
        viewerInDevice: true,
    };
    dropItem: IDropItem = {
        dragType: EDragType.none,
        mousePosition: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
        left: 0,
        data: {},
    };
    deviceGroups: any = [];
    devices: any = [];

    constructor() {}

    resetSetupMode() {
        // update dataWindow in map
        for (let dataWindow of this.imageBox.dataWindows) {
            dataWindow.setupMode = this._setupMode;
        }

        // update dataWindow in deviceGroups
        for (let deviceGroup of this.deviceGroups) {
            deviceGroup.dataWindow.setupMode = this._setupMode;
        }

        // update dataWindow in devices
        for (let device of this.devices) {
            device.dataWindow.setupMode = this._setupMode;
        }
    }

    get setupMode(): ESetupMode {
        return this._setupMode;
    }

    set setupMode(value: ESetupMode) {
        this._setupMode = value;
        this.resetSetupMode();
    }
}

export { ImageMapItem };
