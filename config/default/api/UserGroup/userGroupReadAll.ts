import { IObjectIdAndName } from "@/config/default/api/interfaces";

declare namespace UserGroupReadAll {
    export interface Input {
    }

    export interface Output {
        data: IObjectIdAndName
    }

}

export default UserGroupReadAll;
