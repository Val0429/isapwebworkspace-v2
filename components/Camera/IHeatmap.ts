interface IHeatMapPosition {
    x: number;
    y: number;
    value: string;
}

interface IHeatMapData {
    max: string;
    data: IHeatMapPosition[];
}

interface IMapImage {
    name: string;
    src: string;
    width: number;
    height: number;
}

export { IMapImage, IHeatMapData, IHeatMapPosition };
