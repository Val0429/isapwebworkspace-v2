import { IObjectIdAndName } from "@/config/default/api/interfaces";

declare namespace TagRead {
    export interface Input {
    }

    export interface Output {
        data: IObjectIdAndName
    }

}

export default TagRead;
