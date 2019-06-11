declare namespace SMSUpdate {
    export interface Input {
        enable: boolean;
        url: string;
        account: string;
        password: string;
    }

    export type Output = string;

}

export default SMSUpdate;

