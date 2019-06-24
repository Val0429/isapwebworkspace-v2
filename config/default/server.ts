import { iSAPServerBase, ApisRequestBase, InputR, OutputR } from '@/../core/server';

interface RestfulRequest extends ApisRequestBase {
    Post: {
        '/users/login': [UsersLoginAll.Input, UsersLoginAll.Output, false];
        '/users/logout': [UsersLogoutPost.Input, any, true];
        '/users': [any, any, true];

        // Member
        '/acs/member': [any, any, true];

        // permissiontable
        '/acs/permissiontable': [any, any, true];
        '/acs/accesslevel': [any, any, true];
    };

    Get: {
        '/acs/door': [any, any, true];
        '/acs/doorgroup': [any, any, true];
        '/acs/elevator': [any, any, true];
        '/acs/elevatorgroup': [any, any, true];
        '/acs/timeschedule': [any, any, true];
        '/acs/accesslevel': [any, any, true];

        '/users/login': [UsersLoginAll.Input, UsersLoginAll.Output, false];
        '/users': [any, any, true];
        '/announcements': [AnnouncementsGet.Input, AnnouncementsGet.Output, true];

        // Member
        '/acs/member': [any, any, true];
        '/acs/workgroup': [any, any, true];
        '/acs/permissiontable': [any, any, true];
    };

    Put: {
        '/users': [any, any, true];

        // Member
        '/acs/member': [any, any, true];

        // permissiontable
        '/acs/permissiontable': [any, any, true];
    };
    Delete: {
        '/users': [any, any, true];
        '/acs/permissiontable': [any, any, true];
        '/acs/accesslevel': [any, any, true];

        // Member
        '/acs/member': [any, any, true];
    };
    Ws: {
        '/users/alive': [any, any, true];
        '/agents/connect': [any, any, true];
    };
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
//////////////////////////////////////////////////////////////
/// /announcements - Get /////////////////////////////////////
export declare namespace AnnouncementsGet {
    export interface IAnnouncements {
        /**
         * Title of announcements.
         */
        title: string;

        /**
         * Content of announcements.
         */
        content?: string;
    }
    export type Input = InputR<IAnnouncements>;
    export type Output = OutputR<IAnnouncements>;
}
//////////////////////////////////////////////////////////////
declare namespace Member {
    export interface Input {
        memberid: string;
        firstname: string;
        middlename: string;
        lastname: string;
        status: number;
        cardnNum: string;
    }
    export interface Output {
        objectId: string;
        memberid: string;
        firstname: string;
        middlename: string;
        lastname: string;
        status: number;
        cardnNum: string;
        createdAt: Date;
        updatedAt: Date;
    }
}
