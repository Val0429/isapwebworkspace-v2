import { ISiteEditData, IResponse } from "@/config/default/api/interfaces";

declare namespace SiteUpdate {
    export interface Input {
        datas: ISiteEditData[];
    }

    export interface Output extends IResponse {
    }
}

export default SiteUpdate;
