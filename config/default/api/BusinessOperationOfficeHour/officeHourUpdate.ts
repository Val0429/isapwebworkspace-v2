import { IOfficeHourEditData, IResponse } from "@/config/default/api/interfaces";

declare namespace OfficeHourUpdate {
    export interface Input {
        datas: IOfficeHourEditData[];
    }

    export interface Output extends IResponse {
    }
}

export default OfficeHourUpdate;
