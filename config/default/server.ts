import { iSAPServerBase, ApisRequestBase, InputR, OutputR } from '@/../core/server';

interface RestfulRequest extends ApisRequestBase {
    Get: {
        // APIs
        '/apis': [any, any, false];

        ////// Account //////
        '/user/web': [any, any, false];
        '/roles': [any, any, false];

        ////// Location //////
        '/location/building': [any, any, false];
        '/location/floor': [any, any, false];
        '/location/company': [any, any, false];
        '/location/door': [any, any, false];

        ////// Person //////
        '/person/staff': [any, any, false];
        '/person/staff-blacklist': [any, any, false];

        ////// Frs //////
        '/client/frs': [any, any, false];

        ////// HikVision //////
        '/client/hikvision': [any, any, false];

        ////// email //////
        '/notify/person-blacklist': [any, any, false];

        ////// Setting //////
        '/setting/suntec-app': [any, any, false];
        '/setting/acs': [any, any, false];
        '/setting/acs-group': [any, any, false];
        '/setting/acs-server': [any, any, false];
        '/setting/smtp': [any, any, false];
        '/client/vms': [any, any, false];
        '/setting/frs': [any, any, false];
        '/license': [any, any, false];

        '/setting/push-notification': [any, any, false];
        '/setting/sgsms': [any, any, false];

        ////// Server //////
        '/server/info': [any, any, false];
        '/server/network': [any, any, false];
    };
    Post: {
        ////// User //////
        '/user/web/login': [UsersLoginAll.Input, UsersLoginAll.Output, false];
        '/user/web': [any, any, false];
        '/user/base/logout': [UsersLogoutPost.Input, any, false];
        '/user/forget/step1': [any, any, false];
        '/user/forget/step2': [any, any, false];
        '/user/forget/step3': [any, any, false];

        ////// Location //////
        '/location/building': [any, any, false];
        '/location/floor': [any, any, false];
        '/location/company': [any, any, false];
        '/location/door': [any, any, false];

        ////// Person //////
        '/person/staff': [any, any, false];
        '/person/staff-blacklist': [any, any, false];

        ////// Frs //////
        '/client/frs': [any, any, false];

        ////// HikVision //////
        '/client/hikvision': [any, any, false];

        ////// email //////
        '/notify/person-blacklist': [any, any, false];

        ////// Setting //////
        '/setting/acs-group': [any, any, false];
        '/setting/smtp/test': [any, any, false];
        '/setting/vms': [any, any, false];
        '/client/vms': [any, any, false];
        '/license': [any, any, false];

        '/setting/sgsms/test': [any, any, false];

        // Mail Setting
        '/test/email': [any, any, false];
    };
    Put: {
        ////// User //////
        '/user/web': [any, any, false];
        '/user/base/password': [any, any, false];
        '/user/base/role': [any, any, false];
        '/user/forget/step1': [any, any, false];

        ////// Location //////
        '/location/building': [any, any, false];
        '/location/floor': [any, any, false];
        '/location/company': [any, any, false];
        '/location/door': [any, any, false];

        ////// Person //////
        '/person/staff': [any, any, false];
        '/person/staff-blacklist': [any, any, false];

        ////// Frs //////
        '/client/frs': [any, any, false];

        ////// HikVision //////
        '/client/hikvision': [any, any, false];

        ////// email //////
        '/notify/person-blacklist': [any, any, false];

        ////// Setting //////
        '/setting/suntec-app': [any, any, false];
        '/setting/acs': [any, any, false];
        '/setting/acs-group': [any, any, false];
        '/setting/acs-server': [any, any, false];
        '/setting/smtp': [any, any, false];
        '/setting/vms': [any, any, false];
        '/setting/frs': [any, any, false];
        '/client/vms': [any, any, false];

        '/setting/push-notification': [any, any, false];
        '/setting/sgsms': [any, any, false];
        '/setting/system': [any, any, false];
    };
    Delete: {
        ////// User //////
        '/user/web': [any, any, false];

        ////// Location //////
        '/location/building': [any, any, false];
        '/location/floor': [any, any, false];
        '/location/company': [any, any, false];
        '/location/door': [any, any, false];

        ////// Person //////
        '/person/staff': [any, any, false];
        '/person/staff-blacklist': [any, any, false];

        ////// Frs //////
        '/client/frs': [any, any, false];

        ////// HikVision //////
        '/client/hikvision': [any, any, false];

        ////// email //////
        '/notify/person-blacklist': [any, any, false];

        ////// Setting //////
        '/setting/acs-group': [any, any, false];
        '/setting/vms': [any, any, false];
        '/client/vms': [any, any, false];
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
