import { IResponse } from '@/config/default/api/interfaces';

declare namespace UserDelete {
    export interface Input {
        objectId: string | string[];
    }

    export interface Output extends IResponse {
    }
}

export default UserDelete;
