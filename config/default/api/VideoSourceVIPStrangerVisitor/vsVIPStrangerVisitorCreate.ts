import { IVideoSourceDevice, IResponse } from '@/config/default/api/interfaces';


declare namespace VSVIPStrangerVisitorCreate {
    export interface Input {
        datas: IVideoSourceDevice[];
    }

    export interface Output extends IResponse {

    }
}

export default VSVIPStrangerVisitorCreate;
