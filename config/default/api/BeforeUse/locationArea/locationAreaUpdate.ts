import { IAreaEditData, IResponse } from '@/config/default/api/interfaces';

declare namespace LocationAreaUpdate {
    export interface Input {
        datas: IAreaEditData[];
    }
    export interface Output extends IResponse {}
}

export default LocationAreaUpdate;
