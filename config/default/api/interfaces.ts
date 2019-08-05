// base many api use
interface IPaging {
    total?: number;
    totalPages?: number;
    page?: number;
    pageSize?: number;
}

interface IConfig {
    protocol: string;
    ip: string;
    port: number;
    account: string;
    password: string;
}

interface IConfigiSap {
    serverId: string;
    sourceid: string;
}

interface IObjectIdAndName {
    objectId: string;
    name: string;
}

interface IAnalysis {
    wsport: number;
    ip: string;
    port: number;
    account: string;
    password: string;
}

interface IFRSUserGroup {
    type: string;
    objectId: string;
    name: string;
}

export { IConfig, IPaging, IConfigiSap, IObjectIdAndName, IAnalysis, IFRSUserGroup };

// User
// interface IUser {
//     role?: string; // RoleList.Admin | RoleList.User;
//     name?: string;
//     email?: string;
//     phone?: string;
//     siteIds?: any;
// }

// interface IUserAddData extends IUser {
//     username?: string;
//     password?: string;
//     employeeId?: string;
// }

// interface IUserEditData extends IUser {
//     objectId?: string;
// }

// interface IUserResults extends IUser {
//     objectId: string;
//     sites: IObjectIdAndName[];
//     groups: IObjectIdAndName[];
//     isAppBinding: boolean;
// }

// export { IUserAddData, IUserResults, IUserEditData };

// setting License
interface ILicenseResults {
    licenseKey: string;
    description: string;
    mac: string;
    brand: string;
    productNO: string;
    productName: string;
    count: number;
    trial: boolean;
    registerDate: string;
    expireDate: string;
    expired: boolean;
}

export { ILicenseResults };

// FRS Server
interface IAddFRSServer extends IAnalysis {
    customId: string;
    name: string;
    protocol: string;
    userGroups: IFRSUserGroup[];
}

interface IEditFRSServer extends IAnalysis {
    objectId: string;
    name: string;
    protocol: string;
    userGroups: IFRSUserGroup[];
}

interface IFRSServerResults extends IAnalysis {
    objectId?: string;
    customId?: string;
    name: string;
    protocol: string;
}

interface IFRSServerReadUserGroup extends IAnalysis {
    protocol: string;
}

export { IAddFRSServer, IEditFRSServer, IFRSServerResults, IFRSServerReadUserGroup };

////////////////////// 以上為確定使用 //////////////////////

// Location/Site
interface ILocationSiteAllResponse {
    name: string;
    regionId: string;
    siteId: string;
}

interface ILocationSiteResponse {
    regionId: string;
    siteId: string;
    name: string;
    iconSrc: string;
    iconWidth: number;
    iconHeight: number;
    x: number;
    y: number;
    imageSrc: string;
    imageWidth: number;
    imageHeight: number;
    nvrConfig: IConfig;
    action: IAction;
}

export { ILocationSiteAllResponse, ILocationSiteResponse };

// LocationSite/Device
interface ILocationDeviceResponse {
    siteId: string;
    deviceId: string;
    type: number;
    cameraId: string;
    name: string;
    iconSrc: string;
    iconWidth: number;
    iconHeight: number;
    x: number;
    y: number;
    angle: number;
    visibleDistance: number;
    visibleAngle: number;
}

interface ILocationDeviceAllResponse {
    siteId: string;
    deviceId: string;
    name: string;
}

interface ILocationDeviceResults {
    objectId: string;
    floorId: string;
    areaId: string;
    type: number;
    cameraId: string;
    name: string;
    iconSrc: string;
    iconWidth: number;
    iconHeight: number;
    x: number;
    y: number;
    angle: number;
    visibleDistance: number;
    visibleAngle: number;
}

export { ILocationDeviceResponse, ILocationDeviceAllResponse, ILocationDeviceResults };

// LocationSite/LocationRegion
interface ILocationRegionResponse {
    regionId: string;
    name: string;
    longitude: number;
    latitude: number;
    imageSrc: string;
    imageWidth: number;
    imageHeight: number;
}

export { ILocationRegionResponse };

// LocationSite/Area
interface ILocationAreaResults {
    name: string;
    objectId: string;
    floorId: string;
    action: IAction;
    dataWindowX: number;
    dataWindowY: number;
}

export { ILocationAreaResults };

// LocationSite/Floor
interface ILocationFloorResults {
    objectId: string;
    name: string;
    floorNo: number;
    imageSrc: string;
    imageWidth: number;
    imageHeight: number;
    dataWindowX: number;
    dataWindowY: number;
}

export { ILocationFloorResults };

// Camera
interface ICameraResponse {
    cameraId: string;
    name: string;
    mode: number;
    type: number;
    config: IConfig;
}

interface ICameraLocationResults {
    objectId: string;
    name: string;
    floorId: string;
    floorName: string;
    floorNo: number;
    areaId: string;
    areaName: string;
    deviceId: string;
    deviceName: string;
}

export { ICameraResponse, ICameraLocationResults };

// Others
interface IAction {
    sgsms?: ISendMsg[];
    smtp?: ISendMsg[];
}

interface ISendMsg {
    userIds: string | string[];
    triggerMax: number;
    triggerMin: number;
}

export { IAction };
