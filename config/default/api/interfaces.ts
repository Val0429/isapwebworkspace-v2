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

interface IAnalysis {
    wsport: number;
    ip: string;
    port: number;
    account: string;
    password: string;
}

interface IResponse {
    statusCode: number;
    objectId: string;
    message: string;
}

interface IOfficeHours {
    startDay: string;
    endDay: string;
    startDate: string;
    endDate: string;
}

interface IObjectIdAndName {
    objectId: string;
    name: string;
}

export { IConfig, IPaging, IResponse, IObjectIdAndName, IAnalysis };

// User
interface IUser {
    role?: string; // RoleList.Admin | RoleList.User;
    name?: string;
    email?: string;
    phone?: string;
    siteIds?: any;
    groupIds?: IObjectIdAndName[];
}

interface IUserAddData extends IUser {
    account?: string;
    password?: string;
    employeeId?: string;
}

interface IUserEditData extends IUser {
    objectId?: string;
}

interface IUserResults extends IUser {
    objectId: string;
    sites: IObjectIdAndName[];
    groups: IObjectIdAndName[];
    isAppBinding: boolean;
}

export { IUserAddData, IUserResults, IUserEditData };

// User Group

interface IUserGroup {
    description: string;
    siteIds: any;
}

interface IUserGroupAdd extends IUserGroup {
    name?: string;
}

interface IUserGroupEdit extends IUserGroup {
    objectId?: string;
}

interface IUserGroupResults {
    objectId: string;
    name: string;
    description: string;
    sites: string[];
    users: string[];
}

export { IUserGroupResults, IUserGroupAdd, IUserGroupEdit };

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

// Location Tree

interface IParentData {
    name: string;
    tags: string[];
}

interface IChildrenData extends IParentData {
    customId: string;
    address: string;
    imageSrc: string;
    longitude: number;
    latitude: number;
}

interface ITreeChildren {
    objectId: string;
    parentId: string;
    type: string;
    data: IChildrenData;
    lft: number;
    rgt: number;
    childrens: ITreeChildren[];
}

export { IParentData, ITreeChildren };

// Location Region
interface IRegion {
    type: string;
    name: string;
    customId: string;
    address: string;
    longitude: number;
    latitude: number;
}

interface IRegionAddData extends IRegion {
    parentId: string;
    imageBase64: string;
}

interface IRegionEditData extends IRegion {
    objectId: string;
    imageBase64: string;
}

interface IRegionResults extends IRegion {
    objectId: string;
    parentId: string;
    tags: string[];
    imageSrc: string;
}

export { IRegion, IRegionAddData, IRegionEditData, IRegionResults };

// Location Site
interface ISite {
    customId: string;
    name: string;
    address: string;
    phone: string;
    establishment: string;
    squareMeter: string;
    staffNumber: string;
    officeHourId: string;
    longitude: number;
    latitude: number;
}

interface ISiteAddData extends ISite {
    regionId?: string;
    managerId: string;
    imageBase64: string;
}

interface ISiteEditData extends ISite {
    objectId: string;
    regionId?: string;
    managerId: string;
    imageBase64?: string;
}

interface ISiteResults extends IRegion {
    objectId: string;
    customId: string;
    manager: IObjectIdAndName;
    tags: string[];
    imageSrc: string;
    areaCount: number;
    deviceGroupCount: number;
}

interface ISiteReadAll extends IObjectIdAndName {
    region?: IObjectIdAndName;
}

interface IBindingRegion {
    objectId: string;
    regionId: string;
}

export { IBindingRegion, ISiteAddData, ISiteEditData, ISiteResults, ISiteReadAll };

//Area
interface IAreaAddData {
    siteId: string;
    name: string;
    imageBase64: string;
    mapBase64: string;
}

interface IAreaEditData {
    objectId: string;
    name: string;
    imageBase64?: string;
    mapBase64?: string;
}

export { IAreaAddData, IAreaEditData };

// Tag
interface ITag {
    name?: string;
    description?: string;
    regionIds?: any;
    siteIds?: any;
}

interface ITagReadUpdate extends ITag {
    objectId: string;
}

export { ITag, ITagReadUpdate };

// office hour
interface IOfficeHourAddData extends IOfficeHours {
    name: string;
    dayRanges: IOfficeHours[];
}

interface IOfficeHourEditData extends IOfficeHours {
    objectId: string;
    dayRanges: IOfficeHours[];
}

interface IOfficeHourResults extends IOfficeHourAddData {
    objectId: string;
    sites: string[];
}

export { IOfficeHourAddData, IOfficeHourEditData, IOfficeHourResults };

// weather
interface IWeatherResults {
    icon: string;
    precipProbability: number;
    temperature: number;
    humidity: number;
    cloudCover: number;
    uvIndex: number;
    visibility: number;
}

export { IWeatherResults };

// CMS Server
interface IAddCMSServer extends IConfig {
    customId?: string;
    name: string;
}

interface IEditCMSServer extends IConfig {
    objectId?: string;
    name: string;
}

interface ICMSServerResults extends IEditCMSServer {
    customId: string;
}

export { IAddCMSServer, IEditCMSServer, ICMSServerResults };

// FRS Server
interface IAddFRSServer extends IConfig, IAnalysis {
    customId?: string;
    name: string;
    analysis: IAnalysis;
    manage: IConfig;
}

interface IEditFRSServer extends IConfig, IAnalysis {
    objectId?: string;
    name: string;
    analysis: IAnalysis;
    manage: IConfig;
}

interface IFRSServerResults extends IConfig, IAnalysis {
    objectId: string;
    customId: string;
    name: string;
    analysis: IAnalysis;
    manage: IConfig;
}

export { IAddFRSServer, IEditFRSServer, IFRSServerResults };

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
