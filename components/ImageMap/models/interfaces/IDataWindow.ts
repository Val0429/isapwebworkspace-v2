// 人流
import { EBWListType } from '../enums/EMap';
import { IPosition } from './IMap';

interface IDataWindowCard {
    cardStyle: string;
    cardOriginalPosition: IPosition;
    cardShowPosition?: IPosition;
}

interface IPeopleCountingDataWindow extends IDataWindowCard {
    total: number;
    in: number;
    out: number;
}

// 人型
interface IOccupancyDataWindow extends IDataWindowCard {
    hrAgo: number;
    now: number;
}

// 車牌
interface ILicensePlateDataWindow {
    plateNO: string;
    bwListType: EBWListType;
}

export { IPeopleCountingDataWindow, IOccupancyDataWindow, ILicensePlateDataWindow };
