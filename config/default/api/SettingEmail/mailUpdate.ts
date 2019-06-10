declare namespace MailUpdate {
    export interface Input {
        enable: boolean;
        host: string;
        port: number;
        email: string;
        password: string;
    }

    export type Output = string;

}

export default MailUpdate;

