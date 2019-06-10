import {IObjectIdAndName} from "@/config/default/api/interfaces";

declare namespace UserReadAll {
    export interface Input {
    }

    export interface Output {
        data: IObjectIdAndName[];
    }

}

export default UserReadAll;
