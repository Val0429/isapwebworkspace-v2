import { IEditCMSServer, IResponse } from "@/config/default/api/interfaces";

declare namespace CMSUpdate {
    export interface Input {
        datas: IEditCMSServer[];
    }

    export interface Output extends IResponse {
    }
}

export default CMSUpdate;
