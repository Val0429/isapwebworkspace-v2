import { RegisterLanguage, ILang } from '@/../core/i18n';

@RegisterLanguage('zh-TW', '正體中文')
export default class LangObject implements ILang {
    wb_Login = '登入';
    w_Add = 'Add';
    w_Name = '姓名';
    w_Enabled = '有效';
    w_Value = '値';
    w_Startdate = '起始日';
    w_Enddate = '結束日';
    w_Password = '密碼';
    w_Selection = '';
    w_Multi = '';
    w_UserPermission="User Permission";
    w_UserPermissionAdd="Add User Permission";
    w_UserPermissionEdit="Edit User Permission";
    w_Username = '使用者名稱';
    w_Roles = '角色';    
    w_ApiRoles = "API Roles";
    w_Email = 'Email';
    w_CreatedAt = '建立日期';
    w_UpdatedAt = '編輯日期';
    w_Actions = '';
    w_ConfirmPassword = '確認密碼';

    w_User = '使用者';
    w_UserAdd = '新增使用者';
    w_UserEdit = '編輯使用者';

    m_PasswordShouldBeSame = '兩個密碼必須相同';

    w_Logout = '登出';

    day0 = '星期一';
    day1 = '星期二';
    day2 = '星期三';
    day3 = '星期四';
    day4 = '星期五';
    day5 = '星期六';
    day6 = '星期日';

    w_Member = '人員';
    w_MemberAdd = '新增人員';
    w_MemberEdit = '編輯人員';
    memberid = '員工工號';
    firstname = '名';
    middlename = '中間名';
    lastname = '姓';
    status = '狀態';
    cardnNum = '卡號';
    createdAt = '建立日期';
    updatedAt = '編輯日期';

    w_Door = '門號';
    w_DoorAdd = 'Add Door';
    w_DoorEdit = 'Edit Door';
    system = '門禁系統';
    doorid = '門號ID';
    doorname = '門號名稱';
    unlocktime = 'Unlock Time';
    shunttime = 'Shunt Time';
    readerin = 'Reader In';
    readerout = 'Reader Out';

    w_DoorGroup = '門號群組';
    w_DoorGroupAdd = '新增門號群組';
    w_DoorGroupEdit = '編輯門號群組';
    groupid = '門號群組ID';
    groupname = '門號群組名稱';
    doors = '';
    doorscount = 'Doors Count';
    readerscount = 'Readers Count';

    w_Elevator = '電梯';
    w_ElevatorAdd = '新增電梯';
    w_ElevatorEdit = '編輯電梯';
    elevatorid = '電梯ID';
    floor = '樓層';

    w_TimeSchedule = '時間規格';
    schedule = '';
    timeid = '時間規格ID';
    timename = '時間規格名稱';

    w_PermissionTable = '權限表';
    w_PermissionTableAdd = '新增權限表';
    w_PermissionTableEdit = '編輯權限表';
    tableid = '權限表ID';
    tablename = '權限表名稱';

    w_Reader = 'Reader';
    w_ReaderAdd = 'Add Reader';
    w_ReaderEdit = 'Edit Reader';
    readerid = 'Reader Id';
    readername = 'Reader Name';

    w_SyncReceiver = 'Sync Receiver';
    w_SyncReceiverAdd = 'Add Sync Receiver';
    w_SyncReceiverEdit = 'Edit Sync Receiver';
    receivename = 'Receiver Name';
    emailaddress = 'Email Address';
    receivers = 'Receivers';

    w_AccessLevel = 'Access Level';
    w_AccessLevelAdd = 'Add Access Level';
    w_AccessLevelEdit = 'Edit Access Level';

    levelid = 'Level Id';
    levelname = 'Level Name';
    door = 'Door';
    reader = 'Reader';
    timeschedule = 'Time Schedule';

    PersonalDetails = 'Personal Details';

    w_Floor = 'Floor';
    w_FloorAdd = 'Add Floor';
    w_FloorEdit = 'Edit Floor';
    name = 'Name';
    image = 'Image';

    floorid = 'Floor Id';
    ccureid = 'CCURE Id';
    ccurename = 'CCURE Name';
    sipassid = 'SIPASS Id';
    sipassname = 'SIPASS Name';

    w_ElevatorGroup = 'Elevator Group';
    w_ElevatorGroupAdd = 'Add Elevator Group';
    w_ElevatorGroupEdit = 'Edit Elevator Group';
    elevators = 'Elevators';

    // User
    w_User_UserList = 'User List';
    w_User_AddUser = 'Add User';
    w_User_EditUser = 'Edit User';
    w_User_ViewUser = 'View User';
    w_User_ID = 'User ID';
    w_User_FullName = 'Full Name';
    w_User_Group = 'Group';
    w_User_UserGroup = 'User Group';
    w_User_UserGroup_Admin = 'Admin';
    w_User_UserGroup_User = 'User';
    w_User_Role = 'Role';
    w_User_AppInstalled = 'App Installed';
    w_User_TestEmail = 'Test Email';
    w_User_AddUserSuccess = 'Add User Success.';
    w_User_AddUserFailed = 'Add User Failed';
    w_User_EditUserSuccess = 'Edit User Success';
    w_User_EditUserFailed = 'Edit User Failed';
    w_User_DeleteConfirm = 'Are you sure to delete selected user(s)?';

    // UserGroup
    w_UserGroup_UserGroupList = 'Group List';
    w_UserGroup_AddGroup = 'Add Group';
    w_UserGroup_EditGroup = 'Edit Group';
    w_UserGroup_ViewGroup = 'View Group';
    w_UserGroup_GroupName = 'Group Name';
    w_UserGroup_Users = 'Users';
    w_UserGroup_AddUserGroupSuccess = 'Add User Group Success.';
    w_UserGroup_AddUserGroupFailed = 'Add User Group Failed';
    w_UserGroup_EditUserGroupSuccess = 'Edit User Group Success';
    w_UserGroup_EditUserGroupFailed = 'Edit User Group Failed';
    w_UserGroup_DeleteConfirm = 'Are you sure to delete selected usergroup(s)?';

    // many page
    w_Account = 'Account';
    w_PasswordConfirm = 'PasswordConfirm';
    w_Protocol = 'Protocol';
    w_Ip = 'Ip';
    w_Port = 'Port';
    w_URL = 'URL';
    w_Host = 'Host';
    w_Phone = 'Phone';
    w_ManagedSites = 'Managed sites';
    w_Description = 'Description';
    w_Sites = 'Site(s)';
    w_Site = 'Site';
    w_Regions = 'Region(s)';
    w_PreviousPassword = 'Previous Password';
    w_CurrentPassword = 'Current Password';
    w_CurrentPasswordConfirm = 'Current PasswordConfirm';
    w_Longitude = 'Longitude';
    w_Latitude = 'Latitude';
    w_DeviceID = 'Device ID';
    w_ServerName = 'Server Name';
    w_IPAddress = 'IP Address';
    w_Selected = 'Selected';
    w_RegionTreeSelect = 'Region Tree Select';
    w_SiteTreeSelect = 'Site Tree Select';
    w_Brand = 'Brand';
    w_Model = 'Model';
    w_DeviceName = 'Device Name';
    w_DeviceGroups = 'Device Group(s)';
    w_Hanwha = 'Hanwha';
    w_iSapFRS = 'FRS';
    w_iSapFRSServer = 'FRS Server';
    w_iSapFRSManager = 'FRS Manager';
    w_iSapFRSManagerServer = 'FRS Manager ';
    w_In = 'In';
    w_Out = 'Out';
    w_Direction = 'Direction';
    w_ServerId = 'Server Id';
    w_SourceId = 'Source Id';
    w_SourceIdAndLocation = 'Source Id and Location ';
    w_Location = 'Location';

    w_Port_PlaceHolder = 'Port , 1~65535';
    w_Email_Placeholder = 'ex : admin@isap.com';
    w_Phone_Placeholder = 'ex : +xxxxxxxxxx';

    w_iSap_Use = 'Use iSap Server';
    w_SetFRS = 'Not yet set? Go to set FRS Server';
    w_SetFRSManger = 'Not yet set? Go to set FRS Manger Server';

    w_Error_Port = 'Port should be in 1~65535';
    w_Error_Password = 'Password and PasswordConfirm should be same';
    w_ErrorLongitude = 'Longitude only -180~180';
    w_ErrorLatitude = 'Latitude only -90~90';
    w_ErrorReadData = 'Read data failed, please try again.';
    w_ErrorRecognize = 'Recognize failed, please try again.';

    w_SelectSiteTree = 'Select site tree';
    w_SelectRegionTree = 'Select region tree';

    // Dialog
    w_Dialog_ErrorTitle = 'Something wrong';
    w_Dialog_SuccessTitle = 'Success';

    // common
    w_Interval="間隔";
    w_ColumnSelection ="Column Selection";
    w_Filter = "Filter";
    w_Error = 'Error';
    w_NextPage = 'Next';
    w_PreviousPage = 'Prev';
    w_Clear = 'Clear';
    w_Unlink = 'Unlink';
    w_Search = 'Search';
    w_No = 'No';
    w_Edit = 'Edit';
    w_View = 'View';
    w_Sliders = 'Sliders';
    w_Map = 'Map';
    w_Area = 'Area';
    w_Device = 'Device';
    w_DeviceGroup = 'Device Group';
    w_EditMyProfile = 'Edit My Profile';
    w_ChangePassword = 'Change Password';
    w_ForgetPassword = 'Forget Password Step';
    w_DeleteConfirm = 'Delete Confirm';
    w_UnlinkConfirm = 'Unlink Confirm';
    m_PermanentlyDeleteSelectedItem = 'Permanently delete {count} selected Item?';
    w_RemoveConfirm = 'Remove Confirm';
    m_PermanentlyRemoveSelectedItem = 'Permanently remove {count} selected Item?';
    w_NoItemSelected = 'No item selected';
    w_Success = 'Success';
    w_DeleteFailed = 'Delete Failed';
    w_LogoutSuccess = 'Sign out Success';
    w_Id = 'Id';
    w_Switch = 'Switch';
    w_To = 'To';
    w_StepBackward = 'Step Backward';
    w_ROIClear = 'ROI Clear';
    w_Upload_Fail = 'Upload Filed';
    w_Duplicate = 'Duplicate';
    w_Snapshot = 'Snapshot';
    w_Gender = 'Gender';
    w_Age = 'Age Range';
    w_Options = '可用選項';
    w_Chooses = '已選擇';
    w_AllChoose = '全選';
    w_Select = 'Please Select';

    // date
    w_Week_0 = 'Sunday';
    w_Week_1 = 'Monday';
    w_Week_2 = 'Tuesday';
    w_Week_3 = 'Wednesday';
    w_Week_4 = 'Thursday';
    w_Week_5 = 'Friday';
    w_Week_6 = 'Saturday';
    w_Week_7 = 'Sunday';
    w_Week_Unknow = 'Unknow';

    // Mail Server
    w_MailServer_Email = 'Email Account';
    w_MailServer_Enable = 'Mail Server Enable';
    w_MailServer_Setting = 'Set Mail Server';
    w_MailServer_Test = 'Test Email';

    w_MailServer_Setting_Success = 'Email Server set success.';
    w_MailServer_Setting_Fail = 'Email Server set failed.';
    w_MailServer_Test_Success = 'Email Server test success.';
    w_MailServer_Test_Fail = 'Email Server test failed.';
    w_MailServer_Read_Fail = 'Mail Server read failed.';

    // LocationRegion
    w_Region_Map = 'Map';
    w_Region_CardTitle = 'Region';
    w_Region_ButtonDeleteConfirm = 'Confirm';
    w_Region_DeleteConfrimTitle = 'Confirm delete';
    w_Region_DeleteConfrimContent = 'Do you want delete choose region?';
    w_Region_AddRegionTitle = 'Add a new region';

    w_Region_AddSameLayerRegion = 'Add Same Layer';
    w_Region_AddNextLayerRegion = 'Add Next Layer';
    w_Region_BindingSite = 'Binding Site';
    w_Region_BackToTree = 'Back';

    w_Region_Name = 'Name';
    w_Region_Address = 'Address';
    w_Region_CustomId = 'ID';
    w_Region_Photo = 'Photo';
    w_Region_Image = 'Floor plan';
    w_Region_Location = 'Location';
    w_Region_Lat = 'Latitude';
    w_Region_Lng = 'Longitude';
    w_Region_Tags = 'Tag';
    w_Region_Level = 'Level';
    w_Region_LevelRegion = 'Region';
    w_Region_LevelSite = 'Site';
    w_Region_LevelArea = 'Area';
    w_Region_Sites = 'Sites';

    w_Region_NamePlaceholder = 'Please input name';
    w_Region_AddressPlaceholder = 'Please input address';
    w_Region_CustomIdPlaceholder = 'Please input ID';
    w_Region_PhotoPlaceholder = 'Please upload photo';
    w_Region_ImagePlaceholder = 'Please upload floor plan';
    w_Region_LatPlaceholder = 'Please input latitude';
    w_Region_LngPlaceholder = 'Please input longitude';
    w_Region_TagsPlaceholder = 'Please choose tag';
    w_Region_LevelPlaceholder = 'Please choose level';
    w_Region_SitesPlaceholder = 'Please choose site';

    w_Region_ErrorLongitude = 'Longitude only -180~180';
    w_Region_ErrorLatitude = 'Latitude only -90~90';
    w_Region_ErrorNoSiteBeBinding = 'No site can be binding';
    w_Region_ErrorFileToLarge = 'Image max size is 7MB';

    // Site
    w_Site_SiteID = 'Site ID';
    w_Site_SiteName = 'Site Name';
    w_Site_AreaName = 'Area Name';
    w_Site_GroupName = 'Device Group Name';
    w_Site_DeviceName = 'Device Name';
    w_Site_DeviceType = 'Device Type';
    w_Site_Address = 'Address';
    w_Site_Establishment = 'Establishment';
    w_Site_PhoneNumber = 'Phone Number';
    w_Site_SquareMeter = 'Square Meter';
    w_Site_Manager = 'Manager';
    w_Site_StaffNumber = 'Staff Number';
    w_Site_OfficeHour = 'Office Hour';
    w_Site_Area = 'Area';
    w_Site_Tag = 'Tag';
    w_Site_Devices = 'Devices';
    w_Site_DeviceGroup = 'Device Group';
    w_Site_Model = 'Model';
    w_Site_Photo = 'Photo';
    w_Site_MapPhoto = 'Map Photo';
    w_Site_Longitude = 'Longitude';
    w_Site_Latitude = 'Latitude';
    w_Site_Longitude_Range = 'Longitude range from 180° to -180°';
    w_Site_Latitude_Range = 'Latitude range from 90° to -90°';
    w_Site_Mapping = 'Mapping';
    w_Site_SiteList = 'Site List';
    w_Site_ViewSite = 'View Site';
    w_Site_AddSite = 'Add Site';
    w_Site_EditSite = 'Edit Site';
    w_Site_AreaList = 'Area List';
    w_Site_ViewArea = 'View Area';
    w_Site_AddArea = 'Add Area';
    w_Site_EditArea = 'Edit Area';
    w_Site_DeviceGroupList = 'Device Group List';
    w_Site_ViewDevice = 'View Device';
    w_Site_AddDevice = 'Add Device';
    w_Site_EditDevice = 'Edit Device';
    w_Site_AddSiteSuccess = 'Add Site Success';
    w_Site_AddSiteFailed = 'Add Site Failed';
    w_Site_EditSiteSuccess = 'Edit Site Success';
    w_Site_EditSiteFailed = 'Edit Site Failed';
    w_Site_AddAreaSuccess = 'Add Area Success';
    w_Site_AddAreaFailed = 'Add Area Failed';
    w_Site_EditAreaSuccess = 'Edit Area Success';
    w_Site_EditAreaFailed = 'Edit Area Failed';
    w_Site_AddDeviceGroupSuccess = 'Add Device Group Success';
    w_Site_AddDeviceGroupFailed = 'Add Device Group Failed';
    w_Site_EditDeviceGroupSuccess = 'Edit Device Group Success';
    w_Site_EditDeviceGroupFailed = 'Edit Device Group Failed';

    // Permission
    w_Permission_PermissionManage = 'Permission Manage';
    w_Permission_PermissionList = 'Permission List';
    w_Permission_PermissionAdd = 'Permission Add';
    w_Permission_PermissionEdit = 'Permission Edit';
    w_Permission_PermissionView = 'Permission View';
    w_Permission_PermissionName = 'Permission Name';
    w_Permission_DeviceType = 'Device Type';
    w_Permission_DeviceName = 'Device Name';
    w_Permission_DeviceArea = 'Device Area';
    w_Permission_DeviceTimeFormat = 'Time Format';
    w_Permission_Door = 'Door Name';
    w_Permission_Elevator = 'Elevator Name';
    w_Permission_DoorGroup = 'Door Group Name';
    w_Permission_DoorAdd = 'Add Door';
    w_Permission_ElevatorAdd = 'Add Elevator';
    w_Permission_DoorGroupAdd = 'Add Door Group';

    // button
    w_Save = 'Save';
    w_Back = 'Back';
    w_Cancel = 'Cancel';
    w_Send = 'Send';
    w_Leave = 'Leave';
    w_Test = 'Test';
    w_Check = 'Check';
    w_Submit = 'Submit';
    w_Confirm = 'Confirm';
    w_Upload = 'Upload';
    w_Restart = 'Restart';
    w_Reset = 'Reset';
    w_Delete = 'Delete';
    w_ViewData = 'View Device Data';
    readerIO = 'Reader I/O';

    // Member
    w_Navigation_Users = 'Users';
    w_Navigation_Users_User = 'User';
    w_Navigation_Users_UserGroup = 'User Group';
    w_Navigation_Site = 'Site';
    w_Navigation_Region = 'Region';

    // Member
    w_Member_List = '人員管理';
    w_Member_Add = '新增人員資訊';
    w_Member_Edit = '編輯人員資訊';
    w_Member_View = '查看人員資訊';

    w_Member_CompanyName = '公司名稱：';
    w_Member_CompanyName1 = '公司名稱';
    w_Member_PersonType = '人員類型：';
    w_Member_PersonType1 = '人員類型';
    w_Member_EmployeeNumber = '工號：';
    w_Member_EmployeeNumber1 = '工號';
    w_Member_ChineseName = '中文姓名：';
    w_Member_ChineseName1 = '中文姓名';
    w_Member_EnglishName = '英文姓名：';
    w_Member_EnglishName1 = '英文姓名';
    w_Member_CardNumber = '卡號：';
    w_Member_CardNumber1 = '卡號';
    w_Member_CardType = '證卡類型：';
    w_Member_CardType1 = '證卡類型'; 
    w_Member_CardAllNumber = '證卡全碼：';
    w_Member_CardCustodian = '證卡保管人：';
    w_Member_CardCustodian1 = '證卡保管人';
    w_Member_Actions = '功能';
    w_Member_PersonPic = '人員照片：';
    w_Member_UpLoadPersonPic = '上傳照片：';
    w_Member_CardVoucherType = '卡片憑證類型：';
    w_Member_deviceNumber = '設備碼：';
    w_Member_Status="狀態";
    w_Member_CardInfo = '卡片資訊';
    w_Member_pin = 'PIN：';

    w_Member_Info = '資訊狀態';
    w_Member_StartDate = '起始日期：';
    w_Member_StartDate1 = '起始日期';
    w_Member_EndDate = '結束日期：';
    w_Member_EndDate1 = '結束日期';
    w_Member_LastEditPerson = '上次修改人員：';
    w_Member_LastEditTime = '上次修改時間：';

    w_Member_PermissionTable = '權限表：';
    w_Member_CanSelect = '可用選項：';
    w_Member_BeSelected = '已選擇：';

    w_Member_PersonInfo = '個人資訊';
    w_Member_ExtensionNumber = '分機號碼：';
    w_Member_MVPN = 'MVPN：';
    w_Member_Phone = '行動電話：';
    w_Member_Email = 'Email：';
    w_Member_Gender = '性別：';
    w_Member_Birthday = '出生日期：';
    w_Member_CompanyInfo = '公司資訊：';
    w_Member_Department = '部門：';
    w_Member_Department1 = '部門';
    w_Member_CostCenter = '成本中心：';
    w_Member_CostCenter1 = '成本中心';
    w_Member_Area = '地區：';
    w_Member_WorkArea = '工作地區：';
    w_Member_WorkArea1 = '工作地區';
    w_Member_RegistrationDate = '報到日期：';
    w_Member_ResignationDate = '離職日期：';
    w_Member_ResignationDate1 = '離職日期';

    w_Member_General = '一般';
    w_Member_CarLicenseData = '車證資料';
    w_Member_CarLicenseCategory = '車證類別：';
    w_Member_CardLicense = '車證編號：';
    w_Member_CarLicense = '車位編號：';
    w_Member_CarLicense1 = '車牌號碼I：';
    w_Member_CarLicense2 = '車牌號碼II：';
    w_Member_CarLicense3 = '車牌號碼III：';

    w_Member_AccountInfo = '用戶詳情：';
    w_Member_Account = '用戶名：';
    w_Member_Password = '密碼：';

    w_Member_CardRecord = '證卡紀錄';
    w_Member_ResignationNote = '離職備註：';
    w_Member_ResignationRecordCardRecord = '離職繳回紀錄_證卡：';
    ReasonForCard1 = '製卡原因I：';
    w_Member_HistoryForCard1 = '歷史卡號I：';
    w_Member_DateForCard1 = '發卡日期I：';
    ReasonForCard2 = '製卡原因II：';
    w_Member_HistoryForCard2 = '歷史卡號II：';
    w_Member_DateForCard2 = '發卡日期II：';
    ReasonForCard3 = '製卡原因III：';
    w_Member_HistoryForCard3 = '歷史卡號III：';
    w_Member_DateForCard3 = '發卡日期III：';

    w_Member_SelectTemplate = '選擇模板';
    w_Member_CardTemplate = '卡片模板';
    w_Member_CardPhoto = '卡片樣式';

    w_Member_CarLicenseRecord = '車證紀錄';
    w_Member_ReasonForApplication1 = '申請原因I：';
    w_Member_DateForApplication1 = '發證日期I：';
    w_Member_ReasonForApplication2 = '申請原因II：';
    w_Member_DateForApplication2 = '發證日期II：';
    w_Member_ReasonForApplication3 = '申請原因III：';
    w_Member_DateForApplication3 = '發證日期III：';
    w_Member_ResignationRecordCarLicense = '離職繳回紀錄_車證：';

    w_Member_Other = '其他';
    w_Member_CensusRecord = '普查紀錄：';
    w_Member_CensusRecord1 = '普查紀錄I：';
    w_Member_CensusDate1 = '普查日期I：';
    w_Member_CensusRecord2 = '普查紀錄II：';
    w_Member_CensusDate2 = '普查日期II：';
    w_Member_CensusRecord3 = '普查紀錄：III';
    w_Member_CensusDate3 = '普查日期III：';

    w_Member_ParkingViolation = '停車違規';
    w_Member_InfoOfViolation1 = '違規說明I：';
    w_Member_DateOfViolation1 = '違規日期I：';
    w_Member_InfoOfViolation2 = '違規說明II：';
    w_Member_DateOfViolation2 = '違規日期II：';
    w_Member_InfoOfViolation3 = '違規說明III：';
    w_Member_DateOfViolation3 = '違規日期III：';

    w_Member_DeleteConfirm = 'Are you sure to delete selected member(s)?';
    w_Member_EditFailed = '編輯失敗';
    w_Member_AddFailed = '新增失敗';
    w_Member_ErrorUploadFile = '上傳失敗';

    w_AttendanceReport = '差勤紀錄查詢';
    w_DoorReport = '門號報表';
    w_DoorGroupReport= '門號群組';
    w_CardExpirationReport = '證卡到期查詢';
    w_ContractorReport = "契約商報表";    
    w_DemographicReport = "人口統計報表";
    w_EmployeeReport = '人員報表';
    w_VisitorCardReport = '訪客卡號紀錄';
    

    w_Report_DateStart="Date Start";
    w_Report_DateEnd="Date End";
    w_Report_StartTime = "起始時間";
    w_Report_DoorNumberStart ="起始門號";
    w_Report_EndTime ="日終時間";
    w_Report_DoorNumberEnd="日終門號";
    w_Report_WorkTime = "工作時長";
    w_Report_DateOccurred = "出勤日期";
    w_Report_InOutDailyCount = "總進出天數";

    w_Report_Month1 = "近三個月進出天數";
    w_Report_Month2 = "近二個月進出天數";
    w_Report_Month3 = "近一個月進出天數";

    w_Area_Count = "區域數量";
    w_DoorGroup_Count = "門號群組數量";
    w_Door_Count = "門號數量";
    w_Reader_Count = "讀卡機數量";
    w_Region = "地區名稱";

    w_Permission="Permission";
    w_Setting="Setting";    
    w_Report="Report";

    w_License="License";
    w_License_List = 'License List';
    w_License_Add = 'Add License';
    w_License_LicenseKey = 'LicenseKey';
    w_License_Mac = 'Mac';
    w_License_productName = 'ProductName';
    w_License_Quantity = 'Quantity';
    w_License_Trial = 'Trial';
    w_License_RegisterDate = 'RegisterDate';
    w_License_ExpireDate = 'ExpireDate';
    w_License_License_Key = 'License Key';
    w_License_UploadOfflineKey = 'Upload offline key';
    w_License_UploadOfflineKey1 = '* Upload offline key';

    w_License_License_KeyPlaceholder = 'License Key. Input 25 digits.  English alphabet or number only.  Format: xxxxx-xxxxx-xxxxx-xxxxx-xxxxx';

    w_License_Setting_Success = 'License set success.';
    w_License_Setting_Fail = 'License set failed.';

    w_License_Step1_mac = 'Add by license key and mac';
    w_License_Step1_offline = 'Add by upload offline key';
}
