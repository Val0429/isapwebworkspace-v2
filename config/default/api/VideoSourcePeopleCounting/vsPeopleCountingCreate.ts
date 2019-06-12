import { IAddVSPeopleCountingHanwha, IAddVSPeopleCountingiSap, IResponse } from '@/config/default/api/interfaces';


declare namespace VSPeopleCountingCreate {
    export interface Input {
        datas: IAddVSPeopleCountingHanwha[] | IAddVSPeopleCountingiSap[];
    }

    export interface Output extends IResponse {

    }
}

export default VSPeopleCountingCreate;
