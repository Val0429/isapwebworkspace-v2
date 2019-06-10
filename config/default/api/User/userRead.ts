import {IPaging, IUserResults} from "@/config/default/api/interfaces";

declare namespace UserRead {
    export interface Input {
        paging?: IPaging;
    }

    export interface Output {
        paging: IPaging;
        results: IUserResults[]
    }

}

export default UserRead;
