import { IUserEditData, IResponse } from "@/config/default/api/interfaces";

declare namespace UserUpdate {
    export interface Input {
        datas: IUserEditData[];
    }

    export interface Output extends IResponse {
    }
}

export default UserUpdate;
