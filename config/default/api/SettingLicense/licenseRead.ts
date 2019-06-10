import {ILicenseResults, IPaging} from "@/config/default/api/interfaces";

declare namespace LicenseRead {
    export interface Input {
        paging?: IPaging;
    }

    export interface Output {
        paging: IPaging;
        results: ILicenseResults
    }

}

export default LicenseRead;
