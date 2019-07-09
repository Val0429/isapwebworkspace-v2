import { iSAPServerBase, ApisRequestBase, InputR, OutputR } from '@/../core/server';

// import User
import { UserCreate, UserRead, UserUpdate, UserDelete, UserReadAll } from '@/config/default/api/User';
import { UserLoginPost, UserLogoutPost, UserPasswordUpdate } from '@/config/default/api/User';

// import UserGroup
import { UserGroupCreate, UserGroupDelete, UserGroupRead, UserGroupReadAll, UserGroupUpdate } from '@/config/default/api/UserGroup';

// import Forget Password
import { Step1, Step2, Step3 } from '@/config/default/api/ForgetPassword';

// import camera
import { CameraReadAllList, CameraLocationRead } from '@/config/default/api/BeforeUse/camera';

// import Location treeRead
import { TreeRead } from '@/config/default/api/LocationTree';

// import Location Region
import { RegionCreate, RegionRead, RegionUpdate, RegionDelete, RegionReadAll } from '@/config/default/api/LocationRegion';

// import Location Site
import { SiteCreate, SiteRead, SiteUpdate, SiteDelete, SiteReadAll, SiteBindingRegion } from '@/config/default/api/LocationSite';

// import location area
import { LocationAreaCreate, LocationAreaDelete, LocationAreaRead, LocationAreaUpdate } from '@/config/default/api/BeforeUse/locationArea';

// import location device
import { LocationDeviceCreate, LocationDeviceDelete, LocationDeviceRead, LocationDeviceUpdate } from '@/config/default/api/BeforeUse/locationDevice';

// import location floor
import { LocationFloorCreate, LocationFloorDelete, LocationFloorRead, LocationFloorUpdate } from '@/config/default/api/BeforeUse/locationFloor';

// import Setting License
import { LicenseCreate, LicenseRead } from '@/config/default/api/SettingLicense';

// import network read mac
import { LicenseMacRead } from '@/config/default/api/SettingLicense';

// import Setting SMS
import { SMSTest, SMSUpdate, SMSRead } from '@/config/default/api/SettingSMS';

// import Setting mail
import { MailUpdate, MailTest, MailRead } from '@/config/default/api/SettingEmail';

// import Setting Tag
import { TagCreate, TagDelete, TagRead, TagUpdate, TagReadAll } from '@/config/default/api/SettingTag';

// import Setting Weather
import { WeatherRead, WeatherTest, WeatherUpdate } from '@/config/default/api/SettingWeather';

// import VideoSource human-detection
import { HumanDetectionCheck, HumanDetectionRead, HumanDetectionUpdate } from '@/config/default/api/VideoSource/humanDetection';

// import Server CMS
import { CMSRead, CMSUpdate, CMSDelete, CMSCreate } from '@/config/default/api/ServerCMS';

// import Server FRS
import { FRSUpdate, FRSCreate, FRSDelete, FRSRead, FRSReadDevice, FRSReadUserGroup } from '@/config/default/api/ServerFRS';

// import Business Operation Office Hour
import { OfficeHourCreate, OfficeHourDelete, OfficeHourRead, OfficeHourReadAll, OfficeHourUpdate } from '@/config/default/api/BusinessOperationOfficeHour';

// import Business Operation Campaign
import { CampaignCreate, CampaignDelete, CampaignRead, CampaignUpdate } from '@/config/default/api/BusinessOperationCampaign';

// import Business Operation Sales Record
import { SalesRecordCreate } from '@/config/default/api/BusinessOperationSalesRecord';

// Video Source People Counting
import { VSPeopleCountingCreate, VSPeopleCountingUpdate } from '@/config/default/api/VideoSourcePeopleCounting';

// Video Source Demographic
import { VSDemographicCreate, VSDemographicUpdate } from '@/config/default/api/VideoSourceDemographic';

// Video Source Dwell Time
import { VSDwellTimeUpdate, VSDwellTimeCreate } from '@/config/default/api/VideoSourceDwellTime';

// Video Source VIP Stranger Visitor
import { VSVIPStrangerVisitorCreate, VSVIPStrangerVisitorUpdate } from '@/config/default/api/VideoSourceVIPStrangerVisitor';

interface RestfulRequest extends ApisRequestBase {
    // create
    Post: {
        '/users/login': [UsersLoginAll.Input, UsersLoginAll.Output, false];
        '/user/user/login': [UsersLoginAll.Input, UsersLoginAll.Output, false];
        '/users/logout': [UsersLogoutPost.Input, any, true];
        '/users': [any, any, true];

        // User
        // '/user/user/login': [UserLoginPost.Input, UserLoginPost.Output, false];
        '/user/base/logout': [UserLogoutPost.Input, UserLogoutPost.Output, false];
        '/user/user': [UserCreate.Input, UserCreate.Output, false];

        // UserGroup
        '/user/group': [UserGroupCreate.Input, UserGroupCreate.Output, false];

        // Forget Password
        '/user/forget/step1': [Step1.Input, Step1.Output, false];
        '/user/forget/step2': [Step2.Input, Step2.Output, false];
        '/user/forget/step3': [Step3.Input, Step3.Output, false];

        // device heatmap
        '/device/heatmap': [any, any, false];

        // device/human-detection
        '/device/human-detection': [any, any, false];

        // server device
        '/partner/cms/device': [any, any, false];

        // Setting License
        '/license': [LicenseCreate.Input, LicenseCreate.Output, false];

        // Location Region
        '/location/region': [RegionCreate.Input, RegionCreate.Output, false];

        // Location Site
        '/location/site': [SiteCreate.Input, SiteCreate.Output, false];

        // location floor
        '/location/floor': [LocationFloorCreate.Input, LocationFloorCreate.Output, false];

        // location area
        '/location/area': [LocationAreaCreate.Input, LocationAreaCreate.Output, false];

        // location device
        '/location/device': [LocationDeviceCreate.Input, LocationDeviceCreate.Output, false];

        //device group
        '/device/group': [any, any, false];

        // Setting SMS
        '/setting/sgsms/test': [SMSTest.Input, SMSTest.Output, false];

        // Setting mail
        '/setting/smtp/test': [MailTest.Input, MailTest.Output, false];

        // Setting tag
        '/tag': [TagCreate.Input, TagCreate.Output, false];

        // Setting Weather
        '/setting/weather/test': [WeatherTest.Input, WeatherTest.Output, false];

        // VideoSource human-detection
        '/setting/human-detection/test': [HumanDetectionCheck.Input, HumanDetectionCheck.Output, false];

        // Server CMS
        '/partner/cms': [CMSCreate.Input, CMSCreate.Output, false];

        // Server FRS
        '/partner/frs': [FRSCreate.Input, FRSCreate.Output, false];
        '/partner/frs/device': [FRSReadDevice.Input, FRSReadDevice.Output, false];
        '/partner/frs/user-group': [FRSReadUserGroup.Input, FRSReadUserGroup.Output, false];

        // Server HD
        '/partner/human-detection': [any, any, false];
        '/partner/human-detection/test': [any, any, false];

        // Server Demographic
        '/partner/demographic': [any, any, false];
        '/partner/demographic/test': [any, any, false];

        // Business Operation Office Hour
        '/office-hour': [OfficeHourCreate.Input, OfficeHourCreate.Output, false];

        // Business Operation Campaign
        '/event/campaign': [CampaignCreate.Input, CampaignCreate.Output, false];

        // Business Operation Sales Record
        '/report/sales-record': [SalesRecordCreate.Input, SalesRecordCreate.Output, false];

        // Video Source People Counting
        '/device/people-counting': [VSPeopleCountingCreate.Input, VSPeopleCountingCreate.Output, false];

        // Video Source People Counting
        '/device/demographic': [VSDemographicCreate.Input, VSDemographicCreate.Output, false];

        // Video Source Dwell Time
        '/device/dwell-time': [VSDwellTimeCreate.Input, VSDwellTimeCreate.Output, false];

        // Video Source VIP Stranger Visitor
        '/device/visitor': [VSVIPStrangerVisitorCreate.Input, VSVIPStrangerVisitorCreate.Output, false];

        // report people-counting/summary
        '/report/people-counting/summary': [any, any, false];
        '/report/demographic/summary': [any, any, false];
        '/report/human-detection/summary': [any, any, false];
        '/report/repeat-visitor/summary': [any, any, false];
        '/report/complex': [any, any, false];
        '/report/template': [any, any, false];
    };

    // read
    Get: {
        '/users/login': [UsersLoginAll.Input, UsersLoginAll.Output, false];
        '/users': [any, any, true];
        '/announcements': [AnnouncementsGet.Input, AnnouncementsGet.Output, true];

        // User
        '/user/base/password': [UserPasswordUpdate.Input, UserPasswordUpdate.Output, false];
        '/user/user': [UserRead.Input, UserRead.Output, false];
        '/user/user/all': [UserReadAll.Input, UserReadAll.Output, false];

        // UserGroup
        '/user/group': [UserGroupRead.Input, UserGroupRead.Output, false];
        '/user/group/all': [UserGroupReadAll.Input, UserGroupReadAll.Output, false];

        // camera
        '/camera/all': [CameraReadAllList.Input, CameraReadAllList.Output, false];
        '/camera/location': [CameraLocationRead.Input, CameraLocationRead.Output, false];

        // Setting License
        '/license': [LicenseRead.Input, LicenseRead.Output, false];

        // server/network read mac
        '/server/network': [LicenseMacRead.Input, LicenseMacRead.Output, false];

        // Location Tree
        '/location/tree': [TreeRead.Input, TreeRead.Output, false];

        // Location Region
        '/location/region': [RegionRead.Input, RegionRead.Output, false];
        '/location/region/all': [RegionReadAll.Input, RegionReadAll.Output, false];

        // Location Site
        '/location/site': [SiteRead.Input, SiteRead.Output, false];
        '/location/site/all': [SiteReadAll.Input, SiteReadAll.Output, false];

        // location floor
        '/location/floor': [LocationFloorRead.Input, LocationFloorRead.Output, false];

        // location area
        '/location/area': [LocationAreaRead.Input, LocationAreaRead.Output, false];
        '/location/area/all': [LocationAreaRead.Input, LocationAreaRead.Output, false];

        // location device
        '/location/device': [LocationDeviceRead.Input, LocationDeviceRead.Output, false];

        //device
        '/device': [any, any, false];

        //device group
        '/device/group': [any, any, false];
        '/device/group/all': [any, any, false];

        // Setting SMS
        '/setting/sgsms': [SMSRead.Input, SMSRead.Output, false];

        // Setting mail
        '/setting/smtp': [MailRead.Input, MailRead.Output, false];

        // Setting tag
        '/tag': [TagRead.Input, TagRead.Output, false];
        '/tag/all': [TagReadAll.Input, TagReadAll.Output, false];

        // Setting Weather
        '/setting/weather': [WeatherRead.Input, WeatherRead.Output, false];

        // Server CMS
        '/partner/cms': [CMSRead.Input, CMSRead.Output, false];

        // Server FRS
        '/partner/frs': [FRSRead.Input, FRSRead.Output, false];

        // Server HD
        '/partner/human-detection': [any, any, false];

        // Server Demographic
        '/partner/demographic': [any, any, false];

        // VideoSource human-detection
        '/setting/human-detection': [HumanDetectionRead.Input, HumanDetectionRead.Output, false];

        // VideoSource frs
        '/setting/frs': [FRSRead.Input, FRSRead.Output, false];

        ///report/human-detection/summary
        '/report/human-detection/floor-summary': [any, any, false];
        '/report/human-detection/area-summary': [any, any, false];

        //restart server
        '/server/restart': [any, any, false];

        // Business Operation Office Hour
        '/office-hour': [OfficeHourRead.Input, OfficeHourRead.Output, false];
        '/office-hour/all': [OfficeHourReadAll.Input, OfficeHourReadAll.Output, false];

        // Business Operation Campaign
        '/event/campaign': [CampaignRead.Input, CampaignRead.Output, false];

        // report
        '/report/template': [any, any, false];
    };

    // update
    Put: {
        '/users': [any, any, true];

        // User
        '/user/user': [UserUpdate.Input, UserUpdate.Output, false];
        '/user/base/password': [UserPasswordUpdate.Input, UserPasswordUpdate.Output, false];

        // UserGroup
        '/user/group': [UserGroupUpdate.Input, UserGroupUpdate.Output, false];

        // device heatmap
        '/device/heatmap': [any, any, false];

        // device/human-detection
        '/device/human-detection': [any, any, false];

        // Location Region
        '/location/region': [RegionUpdate.Input, RegionUpdate.Output, false];

        // Location Site
        '/location/site': [SiteUpdate.Input, SiteUpdate.Output, false];
        '/location/site/binding-region': [SiteBindingRegion.Input, SiteBindingRegion.Output, false];

        // location floor
        '/location/floor': [LocationFloorUpdate.Input, LocationFloorUpdate.Output, false];

        // location area
        '/location/area': [LocationAreaUpdate.Input, LocationAreaUpdate.Output, false];

        // location device
        '/location/device': [LocationDeviceUpdate.Input, LocationDeviceUpdate.Output, false];

        //device group
        '/device/group': [any, any, false];

        // Setting SMS
        '/setting/sgsms': [SMSUpdate.Input, SMSUpdate.Output, false];

        // Setting mail
        '/setting/smtp': [MailUpdate.Input, MailUpdate.Output, false];

        // Setting tag
        '/tag': [TagUpdate.Input, TagUpdate.Output, false];

        // Setting Weather
        '/setting/weather': [WeatherUpdate.Input, WeatherUpdate.Output, false];

        // VideoSource human-detection
        '/setting/human-detection': [HumanDetectionUpdate.Input, HumanDetectionUpdate.Output, false];

        // Server CMS
        '/partner/cms': [CMSUpdate.Input, CMSUpdate.Output, false];

        // Server FRS
        '/partner/frs': [FRSUpdate.Input, FRSUpdate.Output, false];

        // Server HD
        '/partner/human-detection': [any, any, false];

        // Server Demographic
        '/partner/demographic': [any, any, false];

        // VideoSource frs
        '/setting/frs': [FRSUpdate.Input, FRSUpdate.Output, false];

        // Business Operation Office Hour
        '/office-hour': [OfficeHourUpdate.Input, OfficeHourUpdate.Output, false];

        // Business Operation Campaign
        '/event/campaign': [CampaignUpdate.Input, CampaignUpdate.Output, false];

        // Video Source People Counting
        '/device/people-counting': [VSPeopleCountingUpdate.Input, VSPeopleCountingUpdate.Output, false];

        // Video Source People Counting
        '/device/demographic': [VSDemographicUpdate.Input, VSDemographicUpdate.Output, false];

        // Video Source Dwell Time
        '/device/dwell-time': [VSDwellTimeUpdate.Input, VSDwellTimeUpdate.Output, false];

        // Video Source VIP Stranger Visitor
        '/device/visitor': [VSVIPStrangerVisitorUpdate.Input, VSVIPStrangerVisitorUpdate.Output, false];

        // report
        '/report/template': [any, any, false];
    };

    // delete
    Delete: {
        '/users': [any, any, true];

        // User
        // User
        '/user/user': [UserDelete.Input, UserDelete.Output, false];

        // UserGroup
        '/user/group': [UserGroupDelete.Input, UserGroupDelete.Output, false];

        // camera

        // Location Region
        '/location/region': [RegionDelete.Input, RegionDelete.Output, false];

        // Location Site
        '/location/site': [SiteDelete.Input, SiteDelete.Output, false];

        // location floor
        '/location/floor': [LocationFloorDelete.Input, LocationFloorDelete.Output, false];

        // location area
        '/location/area': [LocationAreaDelete.Input, LocationAreaDelete.Output, false];

        // location device
        '/location/device': [LocationDeviceDelete.Input, LocationDeviceDelete.Output, false];

        //device group
        '/device/group': [any, any, false];

        // Setting tag
        '/tag': [TagDelete.Input, TagDelete.Output, false];

        // Business Operation Office Hour
        '/office-hour': [OfficeHourDelete.Input, OfficeHourDelete.Output, false];

        // Business Operation Campaign
        '/event/campaign': [CampaignDelete.Input, CampaignDelete.Output, false];

        // Server CMS
        '/partner/cms': [CMSDelete.Input, CMSDelete.Output, false];

        // Server FRS
        '/partner/frs': [FRSDelete.Input, FRSDelete.Output, false];
        // Server Demographic
        '/partner/demographic': [any, any, false];

        // Server HD
        '/partner/human-detection': [any, any, false];

        //device
        '/device': [any, any, false];

        // report
        '/report/template': [any, any, false];
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
