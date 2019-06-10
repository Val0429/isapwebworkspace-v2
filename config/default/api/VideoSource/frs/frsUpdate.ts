import {IAnalysis, IConfig} from "@/config/default/api/interfaces";

declare namespace FRSUpdate {
    export interface Input {
        manage: IConfig;
        analysis: IAnalysis;
    }

    export type Output = string;

}

export default FRSUpdate;

