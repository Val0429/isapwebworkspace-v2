declare namespace SMSUpdate {
    export interface Input {
        enable: boolean;
        url: string;
        username: string;
        password: string;
    }

    export type Output = string;

}

export default SMSUpdate;

