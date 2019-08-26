import { EUserRole } from './';

export class RoleService {
    checkUserRoles(vue: any): boolean {
        let result = false;
        if (vue.$user.user != undefined && vue.$user.user.roles != undefined) {
            result = true;
        }
        return result;
    }

    haveSystemAdministrator(vue: any): boolean {
        let result = false;
        if (this.checkUserRoles(vue)) {
            for (let role of vue.$user.user.roles) {
                if (role.name == EUserRole.SystemAdministrator) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    haveAdministrator(vue: any): boolean {
        let result = false;
        if (this.checkUserRoles(vue)) {
            for (let role of vue.$user.user.roles) {
                if (role.name == EUserRole.Administrator) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    haveTenantAdministrator(vue: any): boolean {
        let result = false;
        if (this.checkUserRoles(vue)) {
            for (let role of vue.$user.user.roles) {
                if (role.name == EUserRole.TenantAdministrator) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    haveTenantUser(vue: any): boolean {
        let result = false;
        if (this.checkUserRoles(vue)) {
            for (let role of vue.$user.user.roles) {
                if (role.name == EUserRole.TenantUser) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    haveVisitor(vue: any): boolean {
        let result = false;
        if (this.checkUserRoles(vue)) {
            for (let role of vue.$user.user.roles) {
                if (role.name == EUserRole.Visitor) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

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
