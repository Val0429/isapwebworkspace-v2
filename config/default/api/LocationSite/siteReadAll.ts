import {ISiteReadAll} from "@/config/default/api/interfaces";

declare namespace SiteReadAll {
    export interface Input {
        type: string;
        regionId?: string;
    }

    export interface Output {
        data: ISiteReadAll;
    }

}

export default SiteReadAll;
