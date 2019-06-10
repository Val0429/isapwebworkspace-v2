import { ITagReadUpdate, IResponse } from "@/config/default/api/interfaces";

declare namespace TagUpdate {
    export interface Input {
        datas: ITagReadUpdate[];
    }

    export interface Output extends IResponse {
    }
}

export default TagUpdate;
