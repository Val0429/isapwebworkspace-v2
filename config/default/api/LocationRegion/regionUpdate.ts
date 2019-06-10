import { IRegionEditData, IResponse } from "@/config/default/api/interfaces";

declare namespace RegionUpdate {
    export interface Input {
        datas: IRegionEditData[];
    }

    export interface Output extends IResponse {
    }
}

export default RegionUpdate;
