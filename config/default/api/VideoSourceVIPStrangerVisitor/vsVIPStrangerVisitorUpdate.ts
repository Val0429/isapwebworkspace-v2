import { IVideoSourceDevice, IResponse } from "@/config/default/api/interfaces";

declare namespace VSVIPStrangerVisitorUpdate {
    export interface Input {
        datas: IVideoSourceDevice[];
    }

    export interface Output extends IResponse {
    }
}

export default VSVIPStrangerVisitorUpdate;
