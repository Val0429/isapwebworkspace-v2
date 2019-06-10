import {ILicenseResults, IPaging} from "@/config/default/api/interfaces";
import SMSCreate from "@/config/default/api/SettingSMS/smsUpdate";

declare namespace SMSRead {
    export interface Input {

    }

    export interface Output {
        enable: boolean;
        url: string;
        username: string;
        password: string;
    }

}

export default SMSRead;
