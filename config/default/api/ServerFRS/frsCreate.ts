import { IAddFRSServer, IResponse } from '@/config/default/api/interfaces';


declare namespace FRSCreate {
    export interface Input {
        datas: IAddFRSServer[]
    }

    export interface Output extends IResponse {

    }
}

export default FRSCreate;
