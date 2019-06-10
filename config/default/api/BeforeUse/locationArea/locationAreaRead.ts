import { ILocationAreaResults, IPaging } from '@/config/default/api/interfaces';

declare namespace LocationAreaRead {
    export interface Input {
        paging?: IPaging;
        siteId?: string;
    }

    export interface Output {
        paging: IPaging;
        results: ILocationAreaResults[];
    }
}

export default LocationAreaRead;
