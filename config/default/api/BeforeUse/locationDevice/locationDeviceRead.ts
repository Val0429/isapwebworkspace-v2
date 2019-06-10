import { ILocationDeviceResults, IPaging } from '@/config/default/api/interfaces';

declare namespace LocationDeviceRead {
    export interface Input {
        paging?: IPaging;
        floorId?: string;
        areaId?: string;

    }

    export interface Output {
        paging: IPaging
        results: ILocationDeviceResults[];
    }
}

export default LocationDeviceRead;
