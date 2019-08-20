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
    w_UserPermission="User Permission";
    w_UserPermissionAdd="Add User Permission";
    w_UserPermissionEdit="Edit User Permission";
    w_Username = 'User Name';
    w_Roles = 'Roles';
    w_ApiRoles = "API Roles";
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
    doorscount = 'Doors Count';
    readerscount= 'Readers Count';

    w_Elevator = 'Elevator';
    w_ElevatorAdd = 'Add Elevator';
    w_ElevatorEdit = 'Edit Elevator';
    elevatorid = 'Elevator Id';
    floor = 'Floor';

    w_TimeSchedule = 'Time Schedule';
    schedule = 'Schedule';
    timeid = 'Time Id';
    timename = 'Time Name';
    permissionTable = 'Permission Table';
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
    

    w_Port_PlaceHolder = 'Port ; 1~65535';
    w_Email_Placeholder = 'ex : admin@isap.com';
    w_Phone_Placeholder = 'ex : +xxxxxxxxxx';

    w_iSap_Use = 'Use iSap Server';
    w_SetFRS = 'Not yet set? Go to set FRS Server';
    w_SetFRSManger = 'Not yet set? Go to set FRS Manger Server';

    w_Error_Port = 'Port should be in 1~65535';
    w_Error_Password = 'Password and PasswordConfirm should be same';
    w_ErrorLongitude = 'Longitude only -180~180';
    w_ErrorLatitude = 'Latitude only -90~90';
    w_ErrorReadData = 'Read data failed; please try again.';
    w_ErrorRecognize = 'Recognize failed; please try again.';

    w_SelectSiteTree = 'Select site tree';
    w_SelectRegionTree = 'Select region tree';

    // Dialog
    w_Dialog_ErrorTitle = 'Something wrong';
    w_Dialog_SuccessTitle = 'Success';

    // common
    w_Interval="Interval";
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
    w_Options = 'Options';
    w_Chooses = 'Choose';
    w_AllChoose = 'All';
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

    
    readerIO="Reader I/O";

    w_Navigation_Users = 'Users';
    w_Navigation_Users_User = 'User';
    w_Navigation_Users_UserGroup = 'User Group';
    w_Navigation_Site = 'Site';
    w_Navigation_Region = 'Region';

    w_ContractorReport = "Contractor Report";
    w_DoorReport = 'Door Report';
    w_DoorGroupReport= 'Door Group Report';
    w_DemographicReport = "Demographic Report";
    w_EmployeeReport = 'Employee Report';
    w_CardExpirationReport = 'Card Report';
    w_AttendanceReport = 'Attendance Report';
    w_VisitorCardReport = 'Visitor Card Report';

    w_Report_DateStart="Date Start";
    w_Report_DateEnd="Date End";
    w_Report_StartTime = "Start Time";
    w_Report_DoorNumberStart ="Door Number Start";
    w_Report_EndTime ="End Time";
    w_Report_DoorNumberEnd="Door Number End";
    w_Report_WorkTime = "Work Time";
    w_Report_DateOccurred = "Date Occurred";
    w_Report_InOutDailyCount = "In/Out Daily Count";
    w_Report_Month1 = "Month 1";
    w_Report_Month2 = "Month 2";
    w_Report_Month3 = "Month 3";

    w_Area_Count = "Area Count";
    w_DoorGroup_Count = "Door Group Count";
    w_Door_Count = "Door Count";
    w_Reader_Count = "Reader Count";
    w_Region = "Region";

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
    w_Manual_Sync = "Manual Sync";
    w_Not_Selected = "Not Specified";
    w_RedirectToLoginMessage = "You have been logged out";

    w_QueryPermission = "Query Permission";
    w_Member_Count = "Member Count";
    w_Number = "Number";
    w_Error_PleaseContactAdmin = "Please contact admin";

    w_DeviceType = "Device Type";
                
    w_DeviceArea="Device Area";
    w_TimeFormat = "TimeFormat";
    w_Action="Action";

    w_Error_DuplicateCardNumber="Duplicate Card number";
    w_Error_DuplicateEmployeeNumber="Duplicate Employee number";
    w_DeviceAreaOrFloor = "Area / Floor";
    w_Error_AccessLevelIsNotInCCure = "Access level is not in CCURE";

    w_FloorGroup="Floor Group";
    w_FloorGroupAdd="Add Floor Group";
    w_FloorGroupEdit="Edit Floor Group";

    user_Permission_CRUD="user_Permission_CRUD";
    user_Management_CRUD="user_Management_CRUD";
    report_door_R="report_door_R";
    report_member_R="report_member_R";
    report_doorgroup_R="report_doorgroup_R";
    report_card_R="report_card_R";
    report_contractor_R="report_contractor_R";
    report_demographic_R="report_demographic_R";
    report_attendance_R="report_attendance_R";
    report_visitor_R="report_visitor_R";
    door_permissiontable_CRUD="door_permissiontable_CRUD";
    door_member_CRUD="door_member_CRUD";
    door_doorgroup_CRUD="door_doorgroup_CRUD";
    door_door_CRUD="door_door_CRUD";
    door_reader_CRUD="door_reader_CRUD";
    door_elevatorgroup_CRUD="door_elevatorgroup_CRUD";
    door_elevator_CRUD="door_elevator_CRUD";
    door_floor_CRUD="door_floor_CRUD";
    door_floorgroup_CRUD="door_floorgroup_CRUD";
    notification_sync_CRUD="notification_sync_CRUD";
    door_accesslevel_CRUD="door_accesslevel_CRUD";
    system_hurmanresource_CRUD="system_hurmanresource_CRUD";
    system_license_CRUD="system_license_CRUD";
    system_operationlog_R="system_operationlog_R";

    w_SystemLog="System Log";
    w_log_message="Log Message";
    w_log_title="Log Title";
    w_log_date="Date";
    w_log_time="Time";

    w_MemberFields="Member Fields";
    w_Member_DeleteConfirm = 'Are you sure to delete selected member(s)?';
    w_Member_EditFailed = 'Edit Failed';
    w_Member_AddFailed = 'Add Failed';
    w_Member_ErrorUploadFile = 'Error Upload File';
    w_Member_Other = 'Other';
    w_Member_List = 'Member List';
    w_Member_Add = 'Add Member';
    w_Member_Edit = 'Edit Member';
    w_Member_View = 'View Member';

    companyName = '公司名稱';
    primaryWorkgroupName = '人員類型';
	personType='人員類型';
    employeeNumber = '工號';
    chineseName = '中文姓名';
    englishName = '英文姓名';
    cardNumber = '卡號';
    cardType = '證卡類型';  
    w_Member_CardAllNumber = '證卡全碼';
    cardCustodian = '證卡保管人';
    w_Member_Actions = '功能';
    w_Member_PersonPic = '人員照片';
    personPhoto = '上傳照片';
    cardCertificate = '卡片憑證類型';
    deviceNumber = '設備碼';
    w_Member_Status="Status";
    w_Member_CardInfo = '卡片資訊';
    pin = 'PIN';

    w_Member_Info = '資訊狀態';
    startDate = '起始日期';
    endDate = '結束日期';
    lastEditPerson = '上次修改人員';
    lastEditTime = '上次修改時間';

    w_Member_PermissionTable = '權限表';
    w_Member_CanSelect = '可用選項';
    w_Member_BeSelected = '已選擇';

    w_Member_PersonInfo = '個人資訊';
    extensionNumber = '分機號碼';
    MVPN = 'MVPN';
    phone = '行動電話';
    email = 'Email';
    gender = '性別';
    birthday = '出生日期';
    w_Member_CompanyInfo = '公司資訊';
    department = '部門';
    costCenter = '成本中心';
    area = '地區';
    workArea = '工作地區';
    registrationDate = '報到日期';
    resignationDate = '離職日期';

    w_Member_General = '一般';
    w_Member_CarLicenseData = '車證資料';
    carLicenseCategory = '車證類別';
    cardLicense = '車證編號';
    carLicense = '車位編號';
    carLicense1 = '車牌號碼I';
    carLicense2 = '車牌號碼II';
    carLicense3 = '車牌號碼III';

    accountInfo = '用戶詳情';
    account = '用戶名';
    password = '密碼';

    w_Member_CardRecord = '證卡紀錄';
    resignationNote = '離職備註';
    resignationRecordCardRecord = '離職繳回紀錄_證卡';
    reasonForCard1 = '製卡原因I';
    historyForCard1 = '歷史卡號I';
    dateForCard1 = '發卡日期I';
    reasonForCard2 = '製卡原因II';
    historyForCard2 = '歷史卡號II';
    dateForCard2 = '發卡日期II';
    reasonForCard3 = '製卡原因III';
    historyForCard3 = '歷史卡號III';
    dateForCard3 = '發卡日期III';

    w_Member_SelectTemplate = '選擇模板';
    w_Member_CardTemplate = '卡片模板';
    w_Member_CardPhoto = '卡片樣式';

    w_Member_CarLicenseRecord = '車證紀錄';
    reasonForApplication1 = '申請原因I';
    dateForApplication1 = '發證日期I';
    reasonForApplication2 = '申請原因II';
    dateForApplication2 = '發證日期II';
    reasonForApplication3 = '申請原因III';
    dateForApplication3 = '發證日期III';
    resignationRecordCarLicense = '離職繳回紀錄_車證';

    w_Member_CensusRecord = '普查紀錄';
    censusRecord1 = '普查紀錄I';
    censusDate1 = '普查日期I';
    censusRecord2 = '普查紀錄II';
    censusDate2 = '普查日期II';
    censusRecord3 = '普查紀錄III';
    censusDate3 = '普查日期III';

    w_Member_ParkingViolation = '停車違規';
    infoOfViolation1 = '違規說明I';
    dateOfViolation1 = '違規日期I';
    infoOfViolation2 = '違規說明II';
    dateOfViolation2 = '違規日期II';
    infoOfViolation3 = '違規說明III';
    dateOfViolation3 = '違規日期III';

    w_Settings = "System Settings";

    sipassdb="sipassdb";
    smtp="smtp";
    ccuresqlserver="ccuresqlserver";
    sipassconnect="sipassconnect";
    ccureconnect= "ccureconnect";
    w_Error_DuplicatePermissionTable="Duplicate permission table";
    cannotGetTokenFromSipass="cannotGetTokenFromSipass";
    accessLevelIsNotInSipass="accessLevelIsNotInSipass";
    w_Error_AccessLevelIsNotInAcs="w_Error_AccessLevelIsNotInAcs";
    importResult="Import Result";
    w_Error_LoginFailed="Login Failed";
    w_Import_RecordCount="Record Count";
    humanresource="humanresource";
}
