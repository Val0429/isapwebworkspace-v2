import { IOfficeHourAddData, IResponse } from '@/config/default/api/interfaces';


declare namespace OfficeHourCreate {
    export interface Input {
        datas: IOfficeHourAddData[]
    }

    export interface Output extends IResponse {

    }
}

export default OfficeHourCreate;
