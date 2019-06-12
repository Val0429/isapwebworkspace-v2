import {IPaging, IBusinessOperationCampaignResults} from "@/config/default/api/interfaces";

declare namespace CampaignRead {
    export interface Input {
        paging?: IPaging;
    }

    export interface Output {
        paging: IPaging;
        results: IBusinessOperationCampaignResults[]
    }

}

export default CampaignRead;
