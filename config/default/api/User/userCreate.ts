import { IUserAddData, IResponse } from '@/config/default/api/interfaces';


declare namespace UserCreate {
    export interface Input {
        datas: IUserAddData[]
    }

    export interface Output extends IResponse {

    }
}

export default UserCreate;
