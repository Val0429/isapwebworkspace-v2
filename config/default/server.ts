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

        // SMS
        '/test/sms': [any, any, false];

        // Online SMS Provider (SG only)
        '/test/sgsms': [any, any, false];

        // Kiosks
        '/kiosks': [any, any, false];

        ////// flow1 //////
        '/flow1/purposes': [any, any, false];
        '/flow1/floors': [any, any, false];
        '/flow1/companies': [any, any, false];

        ////// flow2 //////
        '/flow2/users/forget-password': [any, any, false];
        '/flow2/visitors/invites': [any, any, false];
        '/flow2/purposes': [any, any, false];
        '/flow2/buildings': [any, any, false];
        '/flow2/floors': [any, any, false];
        '/flow2/companies': [any, any, false];
        '/flow2/blacklist': [any, any, false];
    };

    Get: {
        // APIs
        '/apis': [any, any, false];

        // Users
        '/users/login': [UserLogin.Input, UserLogin.Output, false];
        '/users/logout': [UserLogout.Input, any, false];
        '/users': [any, any, false];

        // License
        '/mac': [any, any, false];

        // FRS Setting
        '/config': [any, any, false];

        // Kiosks
        '/kiosks': [any, any, false];

        ////// flow1 //////
        '/flow1/reports/exception': [any, any, false];
        '/flow1/reports/recurring': [any, any, false];
        '/flow1/reports/statistic': [any, any, false];
        '/flow1/investigation': [any, any, false];
        '/flow1/purposes': [any, any, false];
        '/flow1/floors': [any, any, false];
        '/flow1/companies': [any, any, false];

        ////// flow2 //////
        '/flow2/reports/exception': [any, any, false];
        '/flow2/reports/recurring': [any, any, false];
        '/flow2/reports/statistic': [any, any, false];
        '/flow2/investigation': [any, any, false];
        '/flow2/purposes': [any, any, false];
        '/flow2/buildings': [any, any, false];
        '/flow2/floors': [any, any, false];
        '/flow2/companies': [any, any, false];
        '/flow2/blacklist': [any, any, false];
    };

    Put: {
        // Users
        '/users/change-password': [any, any, false];
        '/users': [any, any, false];

        // Registration
        '/visitors/pre-registration': [any, any, false];

        // Kiosks
        '/kiosks': [any, any, false];

        ////// flow1 //////
        '/flow1/purposes': [any, any, false];
        '/flow1/floors': [any, any, false];
        '/flow1/companies': [any, any, false];

        ////// flow2 //////
        '/flow2/visitors/invites': [any, any, false];
        '/flow2/purposes': [any, any, false];
        '/flow2/buildings': [any, any, false];
        '/flow2/floors': [any, any, false];
        '/flow2/companies': [any, any, false];
    };

    Delete: {
        '/users': [any, any, false];

        // Kiosks
        '/kiosks': [any, any, false];

        ////// flow1 //////
        '/flow1/purposes': [any, any, false];
        '/flow1/floors': [any, any, false];
        '/flow1/companies': [any, any, false];

        ////// flow2 //////
        '/flow2/purposes': [any, any, false];
        '/flow2/buildings': [any, any, false];
        '/flow2/floors': [any, any, false];
        '/flow2/companies': [any, any, false];
        '/flow2/blacklist': [any, any, false];
    };

    Ws: {};
}

export class SmartCommunityServer extends iSAPServerBase<RestfulRequest> {}
export default SmartCommunityServer;

//////////////////////////////////////////////////////////////
