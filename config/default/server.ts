import { iSAPServerBase, ApisRequestBase, InputR, OutputR } from '@/../core/server';
import { UserLogin, UserLogout } from './api/User';
import ServerConfig from './serverConfig';

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
        '/flow1/companies': [any, any, false];

        // Kiosks
        '/kiosks': [any, any, false];

        // Floor
        '/flow1/floors': [any, any, false];

        // visitors/invites
        '/flow1/visitors/invites': [any, any, false];
    };

    Get: {
        // Users
        '/users/login': [UserLogin.Input, UserLogin.Output, false];
        '/users/logout': [UserLogout.Input, any, false];
        '/users': [any, any, false];

        // APIs
        '/apis': [any, any, false];

        // Report
        '/flow1/reports/exception': [any, any, false];
        '/flow1/reports/recurring': [any, any, false];
        '/flow1/reports/statistic': [any, any, false];

        // Investigation
        '/flow1/investigation': [any, any, false];

        // Visitor
        '/visitors': [any, any, false];

        // Kiosks
        '/kiosks': [any, any, false];

        // License
        '/mac': [any, any, false];

        // FRS Setting
        '/config': [any, any, false];

        // Companies
        '/flow1/companies': [any, any, false];

        // Floor
        '/flow1/floors': [any, any, false];

        // Tenant
        '/flow1/visitors/invites': [any, any, false];

        //purposes
        '/flow1/purposes': [any, any, false];
    };
    Put: {
        // Users
        '/users/change-password': [any, any, false];
        '/users': [any, any, false];

        // companies
        '/flow1/companies': [any, any, false];

        // Kiosks
        '/kiosks': [any, any, false];

        // Floor
        '/flow1/floors': [any, any, false];

        // visitors/invites
        '/flow1/visitors/invites': [any, any, false];

        // Registration
        '/visitors/pre-registration': [any, any, false];
    };
    Delete: {
        // companies
        '/flow1/companies': [any, any, false];
        '/users': [any, any, false];

        // Kiosks
        '/kiosks': [any, any, false];

        // Floor
        '/flow1/floors': [any, any, false];
    };
    Ws: {};
}

export class SmartCommunityServer extends iSAPServerBase<RestfulRequest> {}
export default SmartCommunityServer;

//////////////////////////////////////////////////////////////
