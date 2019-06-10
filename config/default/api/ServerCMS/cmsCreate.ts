import { IAddCMSServer, IResponse } from '@/config/default/api/interfaces';


declare namespace CMSCreate {
    export interface Input {
        datas: IAddCMSServer[]
    }

    export interface Output extends IResponse {

    }
}

export default CMSCreate;
