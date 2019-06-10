import {IPaging, IOfficeHourResults} from "@/config/default/api/interfaces";

declare namespace OfficeHourRead {
    export interface Input {
        paging?: IPaging;
    }

    export interface Output {
        paging: IPaging;
        results: IOfficeHourResults[]
    }

}

export default OfficeHourRead;
