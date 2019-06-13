// import { iSAPServerBase, ApisRequestBase, InputR, OutputR } from '../../../helpers/server/restful';
// export class SmartCommunityServer extends iSAPServerBase<RestfulRequest> {}

// server config
import ServerConfig from '@/services/ServerConfig';

// import User
import { UserCreate, UserRead, UserUpdate, UserDelete, UserReadAll } from './User';
import { UserLoginPost, UserLogoutPost, UserPasswordUpdate } from './User';

// import UserGroup
import { UserGroupCreate, UserGroupDelete, UserGroupRead, UserGroupReadAll, UserGroupUpdate } from './UserGroup';

// import Forget Password
import { Step1, Step2, Step3 } from './ForgetPassword';

// import camera
import { CameraReadAllList, CameraLocationRead } from './BeforeUse/camera';

// import Location treeRead
import { TreeRead } from './LocationTree';

// import Location Region
import { RegionCreate, RegionRead, RegionUpdate, RegionDelete, RegionReadAll } from './LocationRegion';

// import Location Site
import { SiteCreate, SiteRead, SiteUpdate, SiteDelete, SiteReadAll, SiteBindingRegion } from './LocationSite';

// import location area
import { LocationAreaCreate, LocationAreaDelete, LocationAreaRead, LocationAreaUpdate } from './BeforeUse/locationArea';

// import location device
import { LocationDeviceCreate, LocationDeviceDelete, LocationDeviceRead, LocationDeviceUpdate } from './BeforeUse/locationDevice';

// import location floor
import { LocationFloorCreate, LocationFloorDelete, LocationFloorRead, LocationFloorUpdate } from './BeforeUse/locationFloor';

// import Setting License
import { LicenseCreate, LicenseRead } from './SettingLicense';

// import network read mac
import { LicenseMacRead } from './SettingLicense';

// import Setting SMS
import { SMSTest, SMSUpdate, SMSRead } from './SettingSMS';

// import Setting mail
import { MailUpdate, MailTest, MailRead } from './SettingEmail';

// import Setting Tag
import { TagCreate, TagDelete, TagRead, TagUpdate, TagReadAll } from './SettingTag';

// import Setting Weather
import { WeatherRead, WeatherTest, WeatherUpdate } from './SettingWeather';

// import VideoSource human-detection
import { HumanDetectionCheck, HumanDetectionRead, HumanDetectionUpdate } from './VideoSource/humanDetection';

// import Server CMS
import { CMSRead, CMSUpdate, CMSDelete, CMSCreate } from './ServerCMS';

// import Server CMS
import { FRSUpdate, FRSCreate, FRSDelete, FRSRead } from './ServerFRS';

// import Business Operation Office Hour
import { OfficeHourCreate, OfficeHourDelete, OfficeHourRead, OfficeHourReadAll, OfficeHourUpdate } from './BusinessOperationOfficeHour';

// export default new SmartCommunityServer({
//     ip: ServerConfig.host,
//     port: parseInt(ServerConfig.port),
// });

interface RestfulRequest {
    // C => Post
    Post: {
        // User
        '/user/user/login': [UserLoginPost.Input, UserLoginPost.Output, false];
        '/user/base/logout': [UserLogoutPost.Input, UserLogoutPost.Output, false];
        '/user/user': [UserCreate.Input, UserCreate.Output, false];

        // UserGroup
        '/user/group': [UserGroupCreate.Input, UserGroupCreate.Output, false];

        // Forget Password
        '/user/forget/step1': [Step1.Input, Step1.Output, false];
        '/user/forget/step2': [Step2.Input, Step2.Output, false];
        '/user/forget/step3': [Step3.Input, Step3.Output, false];

        // camera

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

        // Server HD
        '/partner/human-detection': [any, any, false];
        '/partner/human-detection/test': [any, any, false];

        // Server Demographic
        '/partner/demographic': [any, any, false];
        '/partner/demographic/test': [any, any, false];

        // Business Operation Office Hour
        '/office-hour': [OfficeHourCreate.Input, OfficeHourCreate.Output, false];
    };

    // R => Get
    Get: {
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
    };

    // U => Put
    Put: {
        // User
        '/user/user': [UserUpdate.Input, UserUpdate.Output, false];
        '/user/base/password': [UserPasswordUpdate.Input, UserPasswordUpdate.Output, false];

        // UserGroup
        '/user/group': [UserGroupUpdate.Input, UserGroupUpdate.Output, false];

        // camera

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
    };

    // D => Delete
    Delete: {
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

        // Server CMS
        '/partner/cms': [CMSDelete.Input, CMSDelete.Output, false];

        // Server FRS
        '/partner/frs': [FRSDelete.Input, FRSDelete.Output, false];
        // Server Demographic
        '/partner/demographic': [any, any, false];

        // Server HD
        '/partner/human-detection': [any, any, false];
    };

    Ws: {
        '/server/alive': [any, any, false];
        '/data-window': [any, any, false];
    };
}
