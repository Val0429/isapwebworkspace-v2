import { IEditBusinessOperationCampaign, IResponse } from "@/config/default/api/interfaces";

declare namespace CampaignUpdate {
    export interface Input {
        datas: IEditBusinessOperationCampaign[];
    }

    export interface Output extends IResponse {
    }
}

export default CampaignUpdate;
