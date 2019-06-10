import { IObjectIdAndName } from '@/config/default/api/interfaces';


declare namespace Step3 {
    export interface Input {
        account: string;
        verification: string;
        password: string;
    }

    export interface Output  {
        sessionId: string;
        objectId: string;
        account: string;
        name: string;
        roles: string[];
        employeeId: string;
        email: string;
        phone: string;
        webLestUseDate: string;
        sites: IObjectIdAndName[];
        groups: IObjectIdAndName[];
        isAppBinding: string;
    }
}

export default Step3;
