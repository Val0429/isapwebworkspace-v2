import { IAction } from '@/config/default/api/interfaces';

declare namespace LocationDeviceUpdate {
    export interface Input {
        objectId?: string;
        areaId?: string;
        type?: string;
        cameraId?: string;
        name?: string;
        iconBase64?: string;
        iconWidth?: number;
        iconHeight?: number;
        x?: number;
        y?: number;
        angle?: number;
        visibleDistance?: number;
        visibleAngle?: number;
    }

    export type Output = string;
}

export default LocationDeviceUpdate;
