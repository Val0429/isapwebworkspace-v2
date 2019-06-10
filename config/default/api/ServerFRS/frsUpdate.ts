import { IEditFRSServer, IResponse } from "@/config/default/api/interfaces";

declare namespace CMSUpdate {
    export interface Input {
        datas: IEditFRSServer[];
    }

    export interface Output extends IResponse {
    }
}

export default CMSUpdate;
