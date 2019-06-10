import {IPaging, IUserGroupResults} from "@/config/default/api/interfaces";

declare namespace UserGroupRead {
    export interface Input {
        paging?: IPaging;
    }

    export interface Output {
        paging: IPaging;
        results: IUserGroupResults[]
    }

}

export default UserGroupRead;
