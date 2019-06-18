import { IVSDwellTime, IResponse } from "@/config/default/api/interfaces";

declare namespace VSDwellTimeUpdate {
    export interface Input {
        datas: IVSDwellTime[];
    }

    export interface Output extends IResponse {
    }
}

export default VSDwellTimeUpdate;
