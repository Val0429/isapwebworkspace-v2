import { IRegionAddData, IResponse } from '@/config/default/api/interfaces';


declare namespace RegionCreate {
    export interface Input {
        datas: IRegionAddData[]
    }

    export interface Output extends IResponse {

    }
}

export default RegionCreate;
