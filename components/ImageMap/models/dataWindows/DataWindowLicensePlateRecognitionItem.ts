import { ESetupMode, EDragType, EVideoSource, EBWListType } from '../enums/EMap';
import { ILicensePlateDataWindow } from '../interfaces/IDataWindow';
import { DataWindowItem } from './DataWindowItem';

class DataWindowLicensePlateRecognitionItem extends DataWindowItem {
    private _licensePlates: ILicensePlateDataWindow[] = [];

    constructor(title: string, dragType: EDragType) {
        super(title, dragType, EVideoSource.licensePlateRecognition);
    }

    set licensePlate(value: ILicensePlateDataWindow) {
        this._licensePlates.push(value);
    }

    set licensePlates(value: ILicensePlateDataWindow[]) {
        this._licensePlates = value;
    }

    get licensePlates(): ILicensePlateDataWindow[] {
        let result: ILicensePlateDataWindow[] = [];
        if (this._setupMode == ESetupMode.setup) {
            result.push({ plateNO: '-', bwListType: EBWListType.normal });
            result.push({ plateNO: '-', bwListType: EBWListType.black });
            result.push({ plateNO: '-', bwListType: EBWListType.white });
        } else {
            result = this._licensePlates;
        }
        return result;
    }
}

export { DataWindowLicensePlateRecognitionItem };
