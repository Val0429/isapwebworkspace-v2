import { IResponse, IUserGroupAdd } from '@/config/default/api/interfaces';


declare namespace UserGroupCreate {
    export interface Input {
        datas: IUserGroupAdd[]
    }

    export interface Output extends IResponse {

    }
}

export default UserGroupCreate;
