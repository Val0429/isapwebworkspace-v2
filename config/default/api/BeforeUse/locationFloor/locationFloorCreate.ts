declare namespace LocationFloorCreate {
    export interface Input {
        name: string;
        floorNo: number;
        imageBase64: string;
        imageWidth: number;
        imageHeight: number;
        dataWindowX: number;
        dataWindowY: number;
    }

    export interface Output {
        objectId: string;
    }
}

export default LocationFloorCreate;
