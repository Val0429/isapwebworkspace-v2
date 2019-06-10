declare namespace LocationDeviceCreate {
    export interface Input {
        areaId: string;
        type: string;
        direction: string;
        cameraId?: string;
        name: string;
        iconBase64: string;
        iconWidth: number;
        iconHeight: number;
        x: number;
        y: number;
        angle?: number;
        visibleDistance?: number;
        visibleAngle?: number;
    }

    export interface Output {
        objectId: string;
    }
}

export default LocationDeviceCreate;
