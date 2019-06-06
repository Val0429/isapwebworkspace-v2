import { ESetupMode, EDragType, EVideoSource } from '../enums/EMap';
import { DataWindowItem } from './DataWindowItem';

class DataWindowPeopleCountingItem extends DataWindowItem {
    private _inPerson: number = 0;
    private _outPerson: number = 0;
    private _totalPerson: number = 0;

    private _inToday: number = 0;
    private _outToday: number = 0;
    private _totalToday: number = 0;

    constructor(title: string, dragType: EDragType) {
        super(title, dragType, EVideoSource.peopleCounting);
    }

    private calculateData() {
        this._totalPerson = this._inPerson - this._outPerson;
        this._totalToday = this._inToday - this._outToday;
    }
    set inPerson(value: string) {
        if (!isNaN(parseInt(value))) {
            this._inPerson = parseInt(value);
            this.calculateData();
        }
    }

    set outPerson(value: string) {
        if (!isNaN(parseInt(value))) {
            this._outPerson = parseInt(value);
            this.calculateData();
        }
    }

    set inToday(value: string) {
        if (!isNaN(parseInt(value))) {
            this._inToday = parseInt(value);
            this.calculateData();
        }
    }

    set outToday(value: string) {
        if (!isNaN(parseInt(value))) {
            this._outToday = parseInt(value);
            this.calculateData();
        }
    }

    get inPerson(): string {
        return this._setupMode == ESetupMode.setup ? '-' : this._inPerson.toString();
    }

    get outPerson(): string {
        return this._setupMode == ESetupMode.setup ? '-' : this._outPerson.toString();
    }

    get totalPerson(): string {
        return this._setupMode == ESetupMode.setup ? '-' : this._totalPerson.toString();
    }

    get inToday(): string {
        return this._setupMode == ESetupMode.setup ? '-' : this._inToday.toString();
    }

    get outToday(): string {
        return this._setupMode == ESetupMode.setup ? '-' : this._outToday.toString();
    }

    get totalToday(): string {
        return this._setupMode == ESetupMode.setup ? '-' : this._totalToday.toString();
    }
}

export { DataWindowPeopleCountingItem };
