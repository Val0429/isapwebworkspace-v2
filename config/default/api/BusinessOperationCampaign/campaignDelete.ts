import { IResponse } from '@/config/default/api/interfaces';

declare namespace CampaignDelete {
    export interface Input {
        objectId: string | string[];
    }

    export interface Output extends IResponse {
    }
}

export default CampaignDelete;
