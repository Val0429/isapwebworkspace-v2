declare namespace LocationFloorUpdate {
    export interface Input {
        objectId: string;
        name?: string;
        floorNo?: number;
        imageBase64?: string;
        imageWidth?: number;
        imageHeight?: number;
        dataWindowX?: number;
        dataWindowY?: number;
    }

    export type Output = string;
}

export default LocationFloorUpdate;
