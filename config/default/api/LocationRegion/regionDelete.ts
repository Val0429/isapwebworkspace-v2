import { IResponse } from '@/config/default/api/interfaces';

declare namespace RegionDelete {
    export interface Input {
        objectId: string | string[];
    }

    export interface Output extends IResponse {
    }
}

export default RegionDelete;
