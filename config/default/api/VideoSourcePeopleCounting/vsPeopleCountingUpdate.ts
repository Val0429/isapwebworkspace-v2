import { IEditVSPeopleCountingHanwha, IEditVSPeopleCountingiSap, IResponse } from "@/config/default/api/interfaces";

declare namespace VSPeopleCountingUpdate {
    export interface Input {
        datas: IEditVSPeopleCountingHanwha[] | IEditVSPeopleCountingiSap[];
    }

    export interface Output extends IResponse {
    }
}

export default VSPeopleCountingUpdate;
