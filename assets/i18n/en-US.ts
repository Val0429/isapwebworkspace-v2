import { RegisterLanguage } from '@/../core/i18n';

@RegisterLanguage('en-US', 'English')
export default class LangObject {
    wb_Login = 'Login';

    w_Add = 'Add';
    w_Name = 'Name';
    w_Enabled = 'Enabled';
    w_Value = 'Value';
    w_Startdate = 'Start Date';
    w_Enddate = 'End Date';
    w_Password = 'Password';
    w_Selection = 'Selection';
    w_Multi = 'Multi';

    w_Username = 'User Name';
    w_Roles = 'Rolese';
    w_Email = 'Email';
    w_CreatedAt = 'Created At';
    w_UpdatedAt = 'Updated At';
    w_Actions = 'Action';
    w_ConfirmPassword = 'Confirm Password';

    w_User = 'User';
    w_UserAdd = 'Add User';
    w_UserEdit = 'Edit User';

    m_PasswordShouldBeSame = 'Password missmatch';

    w_Logout = 'Log out';

    day0 = 'Monday';
    day1 = 'Tuesday';
    day2 = 'Wednesday';
    day3 = 'Thursday';
    day4 = 'Friday';
    day5 = 'Saturday';
    day6 = 'Sunday';

    w_Member = 'Member';
    w_MemberAdd = 'Add Member';
    w_MemberEdit = 'Edit Member';
    memberid = 'Member Id';
    firstname = 'First Name';
    middlename = 'Middle Name';
    lastname = 'Last Name';
    status = 'Status';
    cardnNum = 'Card Number';
    createdAt = 'Created At';
    updatedAt = 'Updated At';

    w_Door = 'Door';
    w_DoorAdd = 'Add Door';
    w_DoorEdit = 'Edit Door';
    system = 'System';
    doorid = 'Door Id';
    doorname = 'Door Name';
    unlocktime = 'Unlock Time';
    shunttime = 'Shunt Time';
    readerin = 'Reader In';
    readerout = 'Reader Out';

    w_DoorGroup = 'Door Group';
    w_DoorGroupAdd = 'Add Door Group';
    w_DoorGroupEdit = 'Edit Door Group';
    groupid = 'Group Id';
    groupname = 'Group Name';
    doors = 'Doors';

    w_Elevator = 'Elevator';
    w_ElevatorAdd = 'Add Elevator';
    w_ElevatorEdit = 'Edit Elevator';
    elevatorid = 'Elevator Id';
    floor = 'Floor';

    w_TimeSchedule = 'Time Schedule';
    schedule = 'Schedule';
    timeid = 'Time Id';
    timename = 'Time Name';

    w_PermissionTable = 'Permission Table';
    w_PermissionTableAdd = 'Add Permission Table';
    w_PermissionTableEdit = 'Edit Permission Table';
    tableid = 'Table Id';
    tablename = 'Table Name';

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

    w_EmployeeList = 'Employee List';
    w_AttendanceRecord = 'Attendance Record';

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

    // common
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
    w_Options = 'Options';
    w_Chooses = 'Choose';
    w_AllChoose = 'All';

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
    w_ViewData = 'View Form Data';

    // Member
    w_Member_List = '人員管理';
    w_Member_Add = '新增人員資訊';
    w_Member_Edit = '編輯人員資訊';
    w_Member_View = 'View Member';

    w_Member_CompanyName = '公司名稱：';
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
    w_Member_CardAllNumber = '證卡全碼：';
    w_Member_CardCustodian = '證卡保管人：';
    w_Member_Actions = '功能';
    w_Member_PersonPic = '人員照片：';
    w_Member_UpLoadPersonPic = '上傳照片：';

    w_Member_Info = '資訊狀態：';
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
    w_Member_RegistrationDate = '報到日期：';
    w_Member_ResignationDate = '離職日期：';

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
}
