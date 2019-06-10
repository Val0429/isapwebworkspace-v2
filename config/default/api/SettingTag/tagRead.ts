import {IPaging, ITagReadUpdate} from "@/config/default/api/interfaces";

declare namespace TagRead {
    export interface Input {
        paging?: IPaging;
    }

    export interface Output {
        paging: IPaging;
        results: ITagReadUpdate[]
    }

}

export default TagRead;
