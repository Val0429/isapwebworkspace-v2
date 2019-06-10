import { IObjectIdAndName } from "@/config/default/api/interfaces";

declare namespace OfficeHourReadAll {
    export interface Input {
    }

    export interface Output {
        data: IObjectIdAndName
    }

}

export default OfficeHourReadAll;
