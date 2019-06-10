
declare namespace HumanDetectionCheck {
    export interface Input {
        imageBase64: string;
        protocol: string;       // 'http' | 'https';
        ip: string;
        port: number;
    }

    export type Output = string;

}

export default HumanDetectionCheck;
