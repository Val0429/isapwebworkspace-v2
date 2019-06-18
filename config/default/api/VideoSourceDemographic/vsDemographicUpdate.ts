import { IVSDemographic, IResponse } from "@/config/default/api/interfaces";
import VSDemographicCreate from "@/config/default/api/VideoSourceDemographic/vsDemographicCreate";

declare namespace VSPDemographicUpdate {
    export interface Input {
        datas: IVSDemographic[];
    }

    export interface Output extends IResponse {
    }
}

export default VSPDemographicUpdate;
