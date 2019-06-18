import { IVSDwellTime, IResponse } from '@/config/default/api/interfaces';


declare namespace VSDwellTimeCreate {
    export interface Input {
        datas: IVSDwellTime[];
    }

    export interface Output extends IResponse {

    }
}

export default VSDwellTimeCreate;
