interface IHeatMapPosition {
    x: number;
    y: number;
    value: number;
}

interface IHeatMapData {
    max: number;
    data: IHeatMapPosition[];
}

interface IMapImage {
    name: string;
    src: string;
    width: number;
    height: number;
}

export { IMapImage, IHeatMapData, IHeatMapPosition };