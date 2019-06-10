import {IAnalysis, IConfig} from "@/config/default/api/interfaces";

declare namespace FRSRead {
    export interface Input {

    }

    export interface Output {
        manage: IConfig;
        analysis: IAnalysis;
    }

}

export default FRSRead;
