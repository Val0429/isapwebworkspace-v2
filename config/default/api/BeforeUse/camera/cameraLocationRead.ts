import {IPaging, ICameraLocationResults} from "@/config/default/api/interfaces";

declare namespace CameraLocationRead {
    export interface Input {
        paging?: IPaging;
    }

    export interface Output {
        paging: IPaging;
        results: ICameraLocationResults;

    }
}

export default CameraLocationRead;
