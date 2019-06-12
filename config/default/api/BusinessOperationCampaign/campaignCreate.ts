import { IAddBusinessOperationCampaign, IResponse } from '@/config/default/api/interfaces';


declare namespace CampaignCreate {
    export interface Input {
        datas: IAddBusinessOperationCampaign[]
    }

    export interface Output extends IResponse {

    }
}

export default CampaignCreate;
