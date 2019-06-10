import {IPaging, IFRSServerResults} from "@/config/default/api/interfaces";

declare namespace FRSRead {
    export interface Input {
        paging?: IPaging;
    }

    export interface Output {
        paging: IPaging;
        results: IFRSServerResults[]
    }

}

export default FRSRead;
