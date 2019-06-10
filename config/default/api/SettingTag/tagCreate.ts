import { ITag, IResponse } from '@/config/default/api/interfaces';


declare namespace TagCreate {
    export interface Input {
        datas: ITag[]
    }

    export interface Output extends IResponse {

    }
}

export default TagCreate;
