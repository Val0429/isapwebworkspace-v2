import { IResponse, IUserGroupEdit } from "@/config/default/api/interfaces";

declare namespace UserGroupUpdate {
    export interface Input {
        datas: IUserGroupEdit[];
    }

    export interface Output extends IResponse {
    }
}

export default UserGroupUpdate;
