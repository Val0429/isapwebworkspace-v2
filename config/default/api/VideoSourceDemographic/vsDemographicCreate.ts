import { IVSDemographic, IResponse } from '@/config/default/api/interfaces';


declare namespace VSPeopleCountingCreate {
    export interface Input {
        datas: IVSDemographic[];
    }

    export interface Output extends IResponse {

    }
}

export default VSPeopleCountingCreate;
