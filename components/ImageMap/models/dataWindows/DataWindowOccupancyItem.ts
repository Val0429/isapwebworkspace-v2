import { ESetupMode, EDragType, EVideoSource } from '../enums/EMap';
import { DataWindowItem } from './DataWindowItem';

class DataWindowOccupancyItem extends DataWindowItem {
    private _hrAgoPerson: number = 0;
    private _nowPerson: number = 0;

    constructor(title: string, dragType: EDragType) {
        super(title, dragType, EVideoSource.occupancy);
    }

    set hrAgoPerson(value: string) {
        if (!isNaN(parseInt(value))) {
            this._hrAgoPerson = parseInt(value);
        }
    }

    set nowPerson(value: string) {
        if (!isNaN(parseInt(value))) {
            this._nowPerson = parseInt(value);
        }
    }

    get hrAgoPerson(): string {
        return this._setupMode == ESetupMode.setup ? '-' : this._hrAgoPerson.toString();
    }

    get nowPerson(): string {
        return this._setupMode == ESetupMode.setup ? '-' : this._nowPerson.toString();
    }
}

export { DataWindowOccupancyItem };
