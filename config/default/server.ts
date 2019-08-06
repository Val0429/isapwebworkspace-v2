import { iSAPServerBase, ApisRequestBase, InputR, OutputR } from '@/../core/server';
import { UserLogin, UserLogout } from './api/User';

interface RestfulRequest extends ApisRequestBase {
    Get: {
        '/users/login': [UserLogin.Input, UserLogin.Output, false];
        '/users/logout': [UserLogout.Input, any, false];

        // APIs
        '/apis': [any, any, false];

        // Report
        '/reports/exception': [any, any, false];
        '/reports/recurring': [any, any, false];
        '/reports/statistic': [any, any, false];

        // Kiosks
        '/kiosks': [any, any, false];

        // Companies
        '/companies': [any, any, false];

        // Floor
        '/floors': [any, any, false];
    };
    Post: {
        '/users/login': [UserLogin.Input, UserLogin.Output, false];
        '/users/logout': [UserLogout.Input, any, false];
    };
    Put: {
        '/users/change-password': [any, any, false];
    };
    Delete: {};
    Ws: {};
}

export class SmartCommunityServer extends iSAPServerBase<RestfulRequest> {}
export default SmartCommunityServer;

//////////////////////////////////////////////////////////////
