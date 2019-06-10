declare namespace MailRead {
    export interface Input {

    }

    export interface Output {
        enable: boolean;
        host: string;
        port: number;
        email: string;
        password: string;
    }

}

export default MailRead;
