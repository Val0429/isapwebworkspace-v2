import {IPaging, ICMSServerResults} from "@/config/default/api/interfaces";

declare namespace CMSRead {
    export interface Input {
        paging?: IPaging;
    }

    export interface Output {
        paging: IPaging;
        results: ICMSServerResults[]
    }

}

export default CMSRead;
