import { iSAPServerBase, ApisRequestBase, InputR, OutputR } from '@/../core/server';

interface RestfulRequest extends ApisRequestBase {
    // read
    Get: {
        '/users/login': [UsersLoginAll.Input, UsersLoginAll.Output, false];
        '/users': [any, any, true];
        '/announcements': [AnnouncementsGet.Input, AnnouncementsGet.Output, true];

        // Regions
        '/location/site/all': [any, any, true];
        '/location/tree': [any, any, true];
    };

    // create
    Post: {
        '/users/login': [UsersLoginAll.Input, UsersLoginAll.Output, false];
        '/user/user/login': [UsersLoginAll.Input, UsersLoginAll.Output, false];
        '/users/logout': [UsersLogoutPost.Input, any, true];
        '/users': [any, any, true];

        // Regions
        '/location/region': [any, any, true];
    };

    // update
    Put: {
        '/users': [any, any, true];

        // Regions
        '/location/region': [any, any, true];
        '/location/site/binding-region': [any, any, true];
    };

    // delete
    Delete: {
        '/users': [any, any, true];

        // Regions
        '/location/region': [any, any, true];
    };

    // web socket
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
