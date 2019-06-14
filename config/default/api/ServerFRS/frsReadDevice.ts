import { IEditFRSServer, IResponse } from "@/config/default/api/interfaces";

declare namespace FRSReadDevice {
    export interface Input {
        objectId: string;
    }

    export interface Output extends IResponse {
        sourceid: string;
        location: string;
        type: string;
        ip: string;
        port: number;
        username: string;
        password: string;
        channelId: number;
        nvrId: number;
    }
}

export default FRSReadDevice;
