import { ISiteAddData, IResponse } from '@/config/default/api/interfaces';

declare namespace SiteCreate {
    export interface Input {
        datas: ISiteAddData[];
    }
    export interface Output extends IResponse {}
}

export default SiteCreate;
