import { iSAPServerBase, ApisRequestBase, InputR, OutputR } from '@/../core/server';
import { UserLogin, UserLogout } from './api/User';

interface RestfulRequest extends ApisRequestBase {
    Post: {
        // Users
        '/users/login': [UserLogin.Input, UserLogin.Output, false];
        '/users/logout': [UserLogout.Input, any, false];
        '/users': [any, any, false];

        // License
        '/license': [any, any, false];

        // FRS Setting
        '/config': [any, any, false];

        // Mail Setting
        '/test/email': [any, any, false];

        // Online SMS Provider (SG only)
        '/test/sgsms': [any, any, false];

        // SMS
        '/test/sms': [any, any, false];

        // companies
        '/companies': [any, any, false];

        // Kiosks
        '/kiosks': [any, any, false];

        // Floor
        '/floors': [any, any, false];
        // visitors/invites
        '/visitors/invites': [any, any, false];
    };

    Get: {
        // Users
        '/users/login': [UserLogin.Input, UserLogin.Output, false];
        '/users/logout': [UserLogout.Input, any, false];
        '/users': [any, any, false];

        // APIs
        '/apis': [any, any, false];

        // Report
        '/reports/exception': [any, any, false];
        '/reports/recurring': [any, any, false];
        '/reports/statistic': [any, any, false];

        // Investigation
        '/visitors/investigation': [any, any, false];

        // Visitor
        '/visitors': [any, any, false];

        // Kiosks
        '/kiosks': [any, any, false];

        // License
        '/mac': [any, any, false];

        // FRS Setting
        '/config': [any, any, false];

        // Companies
        '/companies': [any, any, false];

        // Floor
        '/floors': [any, any, false];

        // Tenant
        '/visitors/invites': [any, any, false];

        //purposes
        '/purposes': [any, any, false];
    };
    Put: {
        // Users
        '/users/change-password': [any, any, false];
        '/users': [any, any, false];

        // companies
        '/companies': [any, any, false];

        // Kiosks
        '/kiosks': [any, any, false];

        // Floor
        '/floors': [any, any, false];
        // visitors/invites
        '/visitors/invites': [any, any, false];
    };
    Delete: {
        // companies
        '/companies': [any, any, false];
        '/users': [any, any, false];

        // Kiosks
        '/kiosks': [any, any, false];

        // Floor
        '/floors': [any, any, false];
    };
    Ws: {};
}

export class SmartCommunityServer extends iSAPServerBase<RestfulRequest> {}
export default SmartCommunityServer;

//////////////////////////////////////////////////////////////
