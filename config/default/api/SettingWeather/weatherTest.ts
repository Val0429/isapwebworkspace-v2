import {IWeatherResults} from "@/config/default/api/interfaces";

declare namespace WeatherTest {
    export interface Input {
        longitude: number;
        latitude: number;    }

    export interface Output {
        longitude: number;
        latitude: number;
        timezone: string;
        currently: IWeatherResults[];
    }
}

export default WeatherTest;
