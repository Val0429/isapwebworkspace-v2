import { IBindingRegion, IResponse } from "@/config/default/api/interfaces";

declare namespace SiteBindingRegion {
    export interface Input {
        datas: IBindingRegion[];
    }

    export interface Output extends IResponse {
        data: IResponse[]
    }
}

export default SiteBindingRegion;
