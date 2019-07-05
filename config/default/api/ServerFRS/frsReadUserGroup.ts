import { IFRSServerReadUserGroup, IResponse } from '@/config/default/api/interfaces';


declare namespace FRSReadUserGroup {
    export interface Input  {
        config: {
            protocol: string;
            wsport: number;
            ip: string;
            port: number;
            account: string;
            password: string;
        }
    }

    export interface Output {
        data: [];
    }
}

export default FRSReadUserGroup;
