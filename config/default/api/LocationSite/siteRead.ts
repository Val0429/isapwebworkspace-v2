import {IPaging, ISiteResults} from "@/config/default/api/interfaces";

declare namespace SiteRead {
    export interface Input {
        paging?: IPaging;
    }

    export interface Output {
        paging: IPaging;
        results: ISiteResults[]
    }

}

export default SiteRead;
