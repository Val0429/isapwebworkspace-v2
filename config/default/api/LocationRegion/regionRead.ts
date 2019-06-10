import {IPaging, IRegionResults} from "@/config/default/api/interfaces";

declare namespace RegionRead {
    export interface Input {
        paging?: IPaging;
        parentId: string;
    }

    export interface Output {
        paging: IPaging;
        results: IRegionResults[]
    }

}

export default RegionRead;
