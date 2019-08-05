import { IObjectIdAndName } from '@/config/default/api/interfaces';

declare namespace UserLogin {
    export interface Input {
        username: string;
        password: string;
    }

    export interface Output {
        sessionId: string;
        serverTime: Date;
        user: string;
    }
}
export default UserLogin;
