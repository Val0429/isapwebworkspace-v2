import { IAreaAddData, IResponse } from '@/config/default/api/interfaces';

declare namespace LocationAreaCreate {
    export interface Input {
        datas: IAreaAddData[];
    }
    export interface Output extends IResponse {}
}

export default LocationAreaCreate;
