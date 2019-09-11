import { iSAPServerBase, ApisRequestBase, InputR, OutputR } from '@/../core/server';

interface RestfulRequest extends ApisRequestBase {
    Get: {
        // APIs
        '/apis': [any, any, false];

        ////// User //////
        '/user/web': [any, any, false];
        '/roles': [any, any, false];

        ////// License //////
        '/license': [any, any, false];

        ////// HikVision //////
        '/client/hikvision': [any, any, false];

        ////// Setting //////
        '/setting/acs': [any, any, false];
        '/setting/acs-group': [any, any, false];
        '/setting/push-notification': [any, any, false];
        '/setting/sgsms': [any, any, false];
        '/setting/smtp': [any, any, false];
        '/setting/system': [any, any, false];

        ////// Server //////
        '/server/info': [any, any, false];
        '/server/network': [any, any, false];

        ////// Location //////
        '/location/building': [any, any, false];
        '/location/floor': [any, any, false];
        '/location/company': [any, any, false];

        '/mac': [any, any, false];

        '/flow2/investigation': [any, any, false];

        // FRS Setting
        '/config': [any, any, false];
    };
    Post: {
        ////// User //////
        '/user/web/login': [UsersLoginAll.Input, UsersLoginAll.Output, false];
        '/user/web': [any, any, false];
        '/user/base/logout': [UsersLogoutPost.Input, any, false];
        '/user/forget/step1': [any, any, false];
        '/user/forget/step2': [any, any, false];
        '/user/forget/step3': [any, any, false];
        ////// License //////
        '/license': [any, any, false];

        ////// HikVision //////
        '/client/hikvision': [any, any, false];

        ////// Setting //////
        '/setting/acs-group': [any, any, false];
        '/setting/sgsms/test': [any, any, false];
        '/setting/smtp/test': [any, any, false];

        ////// Location //////
        '/location/building': [any, any, false];
        '/location/floor': [any, any, false];
        '/location/company': [any, any, false];
        // Mail Setting
        '/test/email': [any, any, false];

        // FRS Setting
        '/config': [any, any, false];
    };
    Put: {
        ////// User //////
        '/user/web': [any, any, false];
        '/user/base/password': [any, any, false];
        '/user/base/role': [any, any, false];
        '/user/forget/step1': [any, any, false];

        ////// HikVision //////
        '/client/hikvision': [any, any, false];

        ////// Setting //////
        '/setting/acs': [any, any, false];
        '/setting/acs-group': [any, any, false];
        '/setting/push-notification': [any, any, false];
        '/setting/sgsms': [any, any, false];
        '/setting/smtp': [any, any, false];
        '/setting/system': [any, any, false];

        ////// Location //////
        '/location/building': [any, any, false];
        '/location/floor': [any, any, false];
        '/location/company': [any, any, false];
    };
    Delete: {
        ////// User //////
        '/user/web': [any, any, false];

        ////// Setting //////
        '/setting/acs-group': [any, any, false];

        ////// Location //////
        '/location/building': [any, any, false];
        '/location/floor': [any, any, false];
        '/location/company': [any, any, false];

        ////// HikVision //////
        '/client/hikvision': [any, any, false];
    };
    Ws: {};
}

export class SmartCommunityServer extends iSAPServerBase<RestfulRequest> {}
export default SmartCommunityServer;

/// /users/login - All /////////////////////////////////////
declare namespace UsersLoginAll {
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
//////////////////////////////////////////////////////////////
/// /users/logout - Post /////////////////////////////////////
declare namespace UsersLogoutPost {
    export interface Input {
        sessionId: string;
    }
}
