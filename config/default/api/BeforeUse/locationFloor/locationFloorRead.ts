import { ILocationFloorResults, IPaging } from '@/config/default/api/interfaces';

declare namespace LocationFloorRead {
    export interface Input {
        paging?: IPaging;
    }

    export interface Output {
        paging: IPaging
        results: ILocationFloorResults[];
    }
}

export default LocationFloorRead;
