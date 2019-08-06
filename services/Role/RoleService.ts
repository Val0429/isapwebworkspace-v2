import { EUserRole } from './';

export class RoleService {
    roleString(vue: any, role: any): string {
        let result = '';
        switch (role) {
            case EUserRole.SystemAdministrator:
                result = vue._('w_Role_SystemAdministrator');
                break;
            case EUserRole.Administrator:
                result = vue._('w_Role_Administrator');
                break;
            case EUserRole.TenantAdministrator:
                result = vue._('w_Role_TenantAdministrator');
                break;
            case EUserRole.TenantUser:
                result = vue._('w_Role_TenantUser');
                break;
            case EUserRole.Visitor:
                result = vue._('w_Role_Visitor');
                break;
        }
        return result;
    }
}

export default new RoleService();
