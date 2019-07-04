import { RegisterLanguage } from '@/../core/i18n';

@RegisterLanguage('en-US', 'English')
export default class LangObject {
    w_Name = 'Name';
    w_Enabled = 'Enabled';
    w_Value = 'Value';
    w_Startdate = 'Start Date';
    w_Enddate = 'End Date';
    w_Password = 'Password';
    w_Selection = 'Selection';
    w_Multi = 'Multi';

    w_Username = 'User name';
    w_Roles = 'Role';
    w_Email = 'Email';
    w_CreatedAt = 'Created date';
    w_UpdatedAt = 'Updated date';
    w_Actions = 'Actions';
    w_ConfirmPassword = 'Confirm password';

    w_User = 'User';
    w_UserAdd = 'Add user';
    w_UserEdit = 'Edit user';

    m_PasswordShouldBeSame = 'Password should be same';

    /////////////////////////////////////////////

    // common
    w_Error = 'Error';
    w_NextPage = 'Next';
    w_PreviousPage = 'Prev';
    w_Clear = 'Clear';
    w_Unlink = 'Unlink';
    w_Search = 'Search';
    w_No = 'No';
    w_Add = 'Add';
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
    w_Logout = 'Sign out';
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
    w_SendMail = 'Send Mail';
    w_ExportPDF = 'Export PDF';
    w_ExportExcel = 'Export Excel';
    w_ExportCSV = 'Export CSV';

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
    w_Tag = 'Tag(s)';
    w_Site = 'Site';
    w_Group = 'Group';
    w_Item = 'Item';
    w_Total = 'Total';
    w_TrafficIn = 'Traffic IN';
    w_TrafficOut = 'Traffic OUT';
    w_TrafficInTotal = 'Traffic-in Total';
    w_TrafficOutTotal = 'Traffic-out Total';
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
    w_Areas = 'Area(s)';
    w_Devices = 'Device(s)';
    w_SelectSites = 'Select Site(s)';
    w_AllSites = 'All Sites';
    w_period = 'Period';
    w_Designation = 'Designation';
    w_Today = 'Today';
    w_Yesterday = 'Yesterday';
    w_last7days = 'Last 7 days';
    w_thisWeek = 'This Week';
    w_lastWeek = 'Last Week';
    w_thisMonth = 'This Month';
    w_lastMonth = 'Last Month';
    w_q1 = 'Q1';
    w_q2 = 'Q2';
    w_q3 = 'Q3';
    w_q4 = 'Q4';
    w_thisYear = 'This Year';
    w_SelectArea = 'Select Area';
    w_AllAreas = 'All Areas';
    w_AllDeviceGroups = 'All DeviceGroups';
    w_AllDevices = 'All Devices';

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

    // Dialog
    w_Dialog_ErrorTitle = 'Something wrong';
    w_Dialog_SuccessTitle = 'Success';

    // Navigation
    w_Navigation_Label = 'iSAP Solution';

    w_Navigation_Dashboards = 'Dashboards';

    w_Navigation_Analysises = 'Analysises';

    w_Navigation_Reports = 'Reports';

    w_Navigation_Users = 'Users';
    w_Navigation_Users_User = 'User';
    w_Navigation_Users_UserGroup = 'User Group';

    w_Navigation_Site = 'Site';

    w_Navigation_Region = 'Region';

    w_Navigation_VideoSources = 'Video Source';
    w_Navigation_VideoSources_PeopleCounting = 'People Counting';
    w_Navigation_VideoSources_Demographic = 'Demographic';
    w_Navigation_VideoSources_HumanDetection = 'Human Detection ';
    w_Navigation_VideoSources_Heatmap = 'Heatmap';
    w_Navigation_VideoSources_DwellTime = 'Dwell Time';
    w_Navigation_VideoSources_FaceRecognition = 'Face Recognition';
    w_Navigation_VideoSources_CMS = 'CMS';
    w_Navigation_VideoSources_VIP = 'VIP';
    w_Navigation_VideoSources_VIP_Stranger_Visitor = 'VIP / Stranger / Visitor';

    w_Navigation_RulesActions = 'Rules and Action';

    w_Navigation_BusinessOperation = 'Business Operation';
    w_Navigation_BO_CampaignSetting = 'Campaign Setting';
    w_Navigation_BO_SalesRecords = 'Sales Records';
    w_Navigation_BO_GeneralOfficeHour = 'General Office Hour';

    w_Navigation_Setting = 'Setting';
    w_Navigation_Setting_MailServer = 'Mail Server';
    w_Navigation_Setting_SMS = 'SMS';
    w_Navigation_Setting_Weather = 'Weather';
    w_Navigation_Setting_Backup = 'Backup';
    w_Navigation_Setting_Restore = 'Restore';
    w_Navigation_Setting_License = 'License';
    w_Navigation_Setting_Tag = 'Tag';

    w_Navigation_Server = 'Server';
    w_Navigation_Server_CMSServer = 'CMS Server';
    w_Navigation_Server_FRSManagerServer = 'FRS Manager Server';
    w_Navigation_Server_FRSServer = 'FRS Server';
    w_Navigation_Server_DemographicServer = 'Demographic Server';
    w_Navigation_Server_HDServer = 'Human Detection Server';

    w_Navigation_Report = 'Report';
    w_Navigation_Report_ReportTemplate = 'Report Template';
    w_Navigation_Report_Traffic = 'Traffic';
    w_Navigation_Report_DwellTime = 'Dwell Time';
    w_Navigation_Report_Demographic = 'Demographic';
    w_Navigation_Report_Heatmap = 'Heatmap';
    w_Navigation_Report_Occupancy = 'Occupancy';
    w_Navigation_Report_RepeatVisitor = 'Repeat Visitor';
    w_Navigation_Report_VIPBlackList = 'VIP & Black List';
    w_Navigation_Report_Campaign = 'Campaign';

    // 401
    w_UserSession_Empty = 'Not find User, Please login again';

    // image map
    w_ImageMap_DataWindowMainTitle = 'Data Window';
    w_ImageMap_DataWindowInTitle = 'Traffic In';
    w_ImageMap_DataWindowOutTitle = 'Traffic Out';
    w_ImageMap_DataWindowInMOutTitle = 'Net Traffic';
    w_ImageMap_DataWindowTotalTitle = 'Accumulated Traffic';
    w_ImageMap_DataWindowHrAgoTitle = '1 Hr Ago';
    w_ImageMap_DataWindowNowTitle = 'Now';
    w_ImageMap_CardTitle = 'Setup Dashboard';
    w_ImageMap_DeviceTagLabelTitle = 'Device';
    w_ImageMap_DeviceGroupTagLabelTitle = 'Device group';

    // Login
    w_Login_LoginTitle = 'Login';
    w_Login_ForgotPassword = 'Forgot password';
    w_Login_SignUpTitle = 'Sign up';
    w_Login_SignUpContent = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    w_Login_Register = 'Register Now';

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

    // License
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

    // Backup
    w_Backup_List = 'Function List';
    w_Backup_Backup = 'Backup';

    // Restore
    w_Restore_SelectFile = 'Select file(s)';
    w_Restore_SettingFiles = 'Setting Files';

    // Tag
    w_Tag_TagList = 'Tag List';
    w_Tag_AddTag = 'Add Tag';
    w_Tag_EditTag = 'Edit Tag';
    w_Tag_ViewTag = 'View Tag';
    w_Tag_TagName = 'Tag Name';
    w_Tag_AppliedSites = 'Applied Sites';

    w_Tag_AddTagSuccess = 'Add Tag Success';
    w_Tag_AddTagFailed = 'Add Tag Failed';
    w_Tag_EditTagSuccess = 'Edit Tag Success';
    w_Tag_EditTagFailed = 'Edit Tag Failed';
    w_Tag_DeleteConfirm = 'Are you sure to delete selected tag(s)?';

    // MyProfile
    w_MyProfile_EditMyProfile = 'Edit My Profile';
    w_MyProfile_ViewMyProfile = 'View My Profile';

    w_MyProfile_EditSuccess = 'Edit My Profile Success';
    w_MyProfile_EditFailed = 'Edit My Profile Failed';
    w_MyProfile_ChangePasswordSuccess = 'Change Password Success';
    w_MyProfile_ChangePasswordFailed = 'Change Password Failed';

    // Forget Password
    w_ForgetPassword_Step1 = 'Input basic info';
    w_ForgetPassword_Step1_info = 'Please input account and SettingEmail then submit to get a verification code.';
    w_ForgetPassword_Step1_GetVerificationCode = 'Get Verification Code';
    w_ForgetPassword_Step1Success = 'Submit success. Please receiving letter.';
    w_ForgetPassword_Step1Failed = 'Submit failed. Please try again.';

    w_ForgetPassword_Step2 = 'Input verification code';
    w_ForgetPassword_Step2_info = 'Please input verification code and check it right or not.';
    w_ForgetPassword_Step2Success = 'Verification code.';
    w_ForgetPassword_Step2Failed = 'Verification code check failed. Please try again.';

    w_ForgetPassword_Step3 = 'Update Password';
    w_ForgetPassword_Step3_info = 'Please update your password.';
    w_ForgetPassword_Step3Success = 'Update password success.';
    w_ForgetPassword_Step3Failed = 'Update password failed. Please try again.';

    w_ForgetPassword_VerificationCode = 'Verification code';

    // SmsServer
    w_SmsServer_Enable = 'SMS Enable';
    w_SmsServer_Setting = 'Set SMS Server';
    w_SmsServer_Test = 'Test SMS';
    w_SmsServer_Phone = 'Phone Number';
    w_SmsServer_Setting_Success = 'SMS Server set success.';
    w_SmsServer_Setting_Fail = 'SMS Server set failed.';
    w_SmsServer_Setting_Test_Fail = 'SMS Server test failed.';
    w_SmsServer_Setting_Test_Success = 'SMS Server test success.';
    w_SmsServer_Read_Fail = 'SMS Server read failed.';

    // Office Hour
    w_OfficeHour_List = 'Office Hour List';
    w_OfficeHour_Add = 'Add Office Hour';
    w_OfficeHour_Edit = 'Edit Office Hour';
    w_OfficeHour_View = 'View Office Hour';
    w_OfficeHour_Name = 'Office Hour Name';
    w_OfficeHour = '* Office Hour';
    w_OfficeHour_AddFailed = 'Add office hour failed.';
    w_OfficeHour_EditFailed = 'Edit office hour failed.';
    w_OfficeHour_DeleteConfirm = 'Are you sure to delete selected office hour(s)?';

    // Weather
    w_Weather_Add = 'Add Weather';
    w_Weather_Test = 'Test Weather';
    w_Weather_secretKey = 'SecretKey';
    w_Weather_timezone = 'Time Zone';
    w_Weather_icon = 'Icon';
    w_Weather_precipProbability = 'Precip Probability';
    w_Weather_temperature = 'Temperature';
    w_Weather_humidity = 'Humidity';
    w_Weather_cloudCover = 'Cloud Cover';
    w_Weather_uvIndex = 'UV Index';
    w_Weather_visibility = 'Visibility';
    w_Weather_ShowDetail = 'Weather Detail';
    w_Weather_Data = 'Weather Information';

    w_Weather_Step1_info = 'Please register at Dark Sky API ( https://darksky.net/dev ) and will get a SecretKey.';
    w_Weather_Setting_Success = 'Weather set success.';
    w_Weather_Setting_Fail = 'Weather set failed.';
    w_Weather_Read_Fail = 'Weather read failed.';

    w_WeatherTest_Success = 'Weather test success.';
    w_WeatherTest_Fail = 'Weather test failed.';

    // Server CMS
    w_ServerCMS_List = 'CMS Server List';
    w_ServerCMS_Add = 'Add CMS Server';
    w_ServerCMS_Edit = 'Edit CMS Server';
    w_ServerCMS_View = 'View CMS Server';
    w_ServerCMS_AddSuccess = 'CMS Server add success.';
    w_ServerCMS_ADDFailed = 'Add failed! Can not found the CMS Server, please try again.';
    w_ServerCMS_ADDDuplicate = 'Add failed! CMS Server is duplicate, please try again.';
    w_ServerCMS_EditSuccess = 'CMS Server edit success.';
    w_ServerCMS_EditFailed = 'Edit failed! Can not found the CMS Server, please try again.';
    w_ServerCMS_EditDuplicate = 'Edit failed! CMS Server is duplicate, please try again.';
    w_ServerCMSDeleteConfirm = 'Are you sure to delete selected CMS Server(s)?';

    // Demographic Server
    w_DemographicServer_List = 'Demographic Server List';
    w_DemographicServer_View = 'View Demographic Server';
    w_DemographicServer_Add = 'Add Demographic Server';
    w_DemographicServer_Edit = 'Edit Demographic Server';
    w_DemographicServer_Test = 'Test Demographic Server';
    w_DemographicServer_DeviceID = 'Device ID';
    w_DemographicServer_DeviceName = 'Device Name';
    w_DemographicServer_IP = 'IP';
    w_DemographicServer_Port = 'Port';
    w_DemographicServer_Scale = 'Scale';
    w_DemographicServer_AddSuccess = 'Demographic Server Add Success';
    w_DemographicServer_EditSuccess = 'Demographic Server Edit Success';
    w_DemographicServer_TestSuccess = 'Server Human Detection Test Success';
    w_DemographicServer_AddFailed = 'Demographic Server Add Failed';
    w_DemographicServer_EditFailed = 'Demographic Server Edit Failed';
    w_DemographicServer_TestResult = 'Demographic Server Test Result';
    w_DemographicServer_DeleteConfirm = 'Are you sure to delete selected Demographic Server(s)?';

    // Server Human Detection
    w_ServerHD_List = 'Human Detection Server List';
    w_ServerHD_View = 'View Human Detection Server';
    w_ServerHD_Add = 'Add Human Detection Server';
    w_ServerHD_Edit = 'Edit Human Detection Server';

    w_ServerHD_DeviceID = 'Device ID';
    w_ServerHD_DeviceName = 'Device Name';
    w_ServerHD_IP = 'IP';
    w_ServerHD_Port = 'Port';
    w_ServerHD_Scale = 'Scale';
    w_ServerHD_Test = 'Test Human Detection Server';
    w_ServerHD_AddSuccess = 'Human Detection Server Add Success';
    w_ServerHD_EditSuccess = 'Human Detection Server Edit Success';
    w_ServerHD_TestSuccess = 'Human Detection Server Test Success';
    w_ServerHD_AddFailed = 'Human Detection Server Add Failed';
    w_ServerHD_EditFailed = 'Human Detection Server Edit Failed';
    w_ServerHD_TestFailed = 'Human Detection Server Test Failed';
    w_ServerHD_DeleteConfirm = 'Are you sure to delete selected Human Detection Server(s)?';

    // Server FRS
    w_ServerFRS_List = 'FRS Server List';
    w_ServerFRS_Add = 'Add FRS Server';
    w_ServerFRS_Edit = 'Edit FRS Server';
    w_ServerFRS_View = 'View FRS Server';
    w_ServerFRS_wsport = 'WS Port';

    w_ServerFRS_AddSuccess = 'FRS Server add success.';
    w_ServerFRS_ADDFailed = 'Add failed! Can not found the FRS Server, please try again.';
    w_ServerFRS_ADDDuplicate = 'Add failed! FRS Server is duplicate, please try again.';
    w_ServerFRS_EditSuccess = 'CMS Server edit success.';
    w_ServerFRS_EditFailed = 'Edit failed! Can not found the FRS Server, please try again.';
    w_ServerFRS_EditDuplicate = 'Edit failed! FRS Server is duplicate, please try again.';
    w_ServerFRS_DeleteConfirm = 'Are you sure to delete selected FRS Server(s)?';

    // Business Operation Campaign
    w_BOCampaign_List = 'Campaign Setting List';
    w_BOCampaign_Add = 'Add Campaign Setting';
    w_BOCampaign_Edit = 'Edit Campaign Setting';
    w_BOCampaign_View = 'View Campaign Setting';

    w_BOCampaign_EventList = 'Event List';
    w_BOCampaign_EventType = 'Event Type';
    w_BOCampaign_Period = 'Period';
    w_BOCampaign_EventName = 'Event Name';
    w_BOCampaign_StartDate = 'Start Date';
    w_BOCampaign_FinishDate = 'Finish Date';
    w_BOCampaign_Budget = 'Budget';

    w_BOCampaign_AddSuccess = 'Campaign add success.';
    w_BOCampaign_ADDFailed = 'Campaign add failed, please try again.';
    w_BOCampaign_EditSuccess = 'Campaign edit success.';
    w_BOCampaign_EditFailed = 'Campaign edit failed, please try again.';
    w_BOCampaign_DeleteConfirm = 'Are you sure to delete selected campaign(s)?';

    // Business Operation Sales Records
    w_BOSalesRecords_CardTitle = 'Import Excel (.xlsx)';
    w_BOSalesRecords_Step1 = 'Choose Record type';
    w_BOSalesRecords_Step2 = 'Download .xlsx example';
    w_BOSalesRecords_Step3 = 'Upload .xlsx file';
    w_BOSalesRecords_Step4 = 'Confirm upload information';
    w_BOSalesRecords_Step5 = 'Upload result';
    w_BOSalesRecords_RecordTypeStore = 'Store';
    w_BOSalesRecords_RecordTypeProduct = 'Product';
    w_BOSalesRecords_Download = 'Download';
    w_BOSalesRecords_StoreId = 'Store ID';
    w_BOSalesRecords_Date = 'Date';
    w_BOSalesRecords_Hour = 'Hour';
    w_BOSalesRecords_Time = 'Time';
    w_BOSalesRecords_Amount = 'Amount';
    w_BOSalesRecords_Revenue = 'Revenue';
    w_BOSalesRecords_Transaction = 'Transaction';
    w_BOSalesRecords_ProductId = 'Product ID';
    w_BOSalesRecords_Count = 'Count';
    w_BOSalesRecords_ApiMessage = 'Message';
    w_BOSalesRecords_ApiSuccess = 'Success';

    w_BOSalesRecords_ErrorFileType = 'Please upload xlsx';
    w_BOSalesRecords_ErrorFileResolve = 'File content can not be Resolve';
    w_BOSalesRecords_ErrorNoData = 'no data';
    w_BOSalesRecords_ErrorServerError = 'Server Connect Error';
    w_BOSalesRecords_ErrorNoSite = 'Store not find';
    w_BOSalesRecords_ErrorNoPremission = 'No Premission';

    // People Counting Device
    w_VSPeopleCounting_List = 'People Counting Device List';
    w_VSPeopleCounting_Add = 'Add People Counting Device';
    w_VSPeopleCounting_Edit = 'Edit People Counting Device';
    w_VSPeopleCounting_View = 'View People Counting Device';

    w_VSPeopleCounting_Addhanwha = 'Use Hanwha Server';
    w_VSPeopleCounting_AddhanwhaUse = 'Add People Counting Device Use Hanwha Server';
    w_VSPeopleCounting_EdithanwhaUse = 'Edit People Counting Device Use Hanwha Server';

    w_VSPeopleCounting_AddisapUseFRS = 'Add People Counting Device Use iSap FRS Server';
    w_VSPeopleCounting_EditisapUseFRS = 'Edit People Counting Device Use iSap FRS Server';

    w_VSPeopleCounting_AddisapUseFRSManger = 'Add People Counting Device Use iSap FRS Manger Server';
    w_VSPeopleCounting_EditisapUseFRSManger = 'Edit People Counting Device Use iSap FRS Manger Server';

    w_VSPeopleCounting_AddSuccess = 'People Counting Device add success.';
    w_VSPeopleCounting_ADDFailed = 'People Counting Device add failed, please try again.';
    w_VSPeopleCounting_EditSuccess = 'People Counting Device edit success.';
    w_VSPeopleCounting_EditFailed = 'People Counting Device edit failed, please try again.';
    w_VSPeopleCounting_DeleteConfirm = 'Are you sure to delete selected People Counting Device(s)?';

    // Demographic
    w_VSDemographic_List = 'Demographic Device List';
    w_VSDemographic_Add = 'Add Demographic Device';
    w_VSDemographic_Edit = 'Edit Demographic Device';
    w_VSDemographic_View = 'View Demographic Device';
    w_VSDemographic_demoServerId = 'Demographic Server Id';

    w_VSDemographic_AddisapUseFRS = 'Add Demographic Device Use iSap FRS Server';
    w_VSDemographic_EditisapUseFRS = 'Edit Demographic Device Use iSap FRS Server';

    w_VSDemographic_AddisapUseFRSManger = 'Add Demographic Device Use iSap FRS Manger Server';
    w_VSDemographic_EditisapUseFRSManger = 'Edit Demographic Device Use iSap FRS Manger Server';

    w_VSDemographic_AddSuccess = 'Demographic Device add success.';
    w_VSDemographic_ADDFailed = 'Demographic Device add failed, please try again.';
    w_VSDemographic_EditSuccess = 'Demographic Device edit success.';
    w_VSDemographic_EditFailed = 'Demographic Device edit failed, please try again.';
    w_VSDemographic_DeleteConfirm = 'Are you sure to delete selected Demographic Device(s)?';

    // Heatmap Device
    w_VSHeatmap_List = 'Heatmap Device List';
    w_VSHeatmap_Add = 'Heatmap Device Add';
    w_VSHeatmap_Edit = 'Heatmap Device Edit';
    w_VSHeatmap_View = 'Heatmap Device View';
    w_VSHeatmap_SelectBrand = 'Select Brand';
    w_VSHeatmap_SelectRegion = 'Select Region';
    w_VSHeatmap_DrawROI = 'Draw ROI';
    w_VSHeatmap_CheckAndOverlook = 'Check and Overlook';
    w_VSHeatmap_CustomId = 'Id';
    w_VSHeatmap_Name = 'Name';
    w_VSHeatmap_Brand = 'Brand';
    w_VSHeatmap_CMS = 'CMS';
    w_VSHeatmap_SetCMS = 'Not yet set? Go to set CMS';
    w_VSHeatmap_NVR = 'NVR';
    w_VSHeatmap_ChannelInNVR = 'Channel In NVR';
    w_VSHeatmap_Site = 'Site';
    w_VSHeatmap_Area = 'Area';
    w_VSHeatmap_DeviceGroup = 'Device Group';
    w_VSHeatmap_PageToCMSAlter = 'Data will not be stored, Are you sure to CMS Page?';
    w_VSHeatmap_DeleteConfirm = 'Are you sure to delete selected Device(s)?';

    // Human Detection
    w_VSHumanDetection_List = 'Human Detection Device List';
    w_VSHumanDetection_Add = 'Human Detection Device Add';
    w_VSHumanDetection_Edit = 'Human Detection Device Edit';
    w_VSHumanDetection_View = 'Human Detection Device View';
    w_VSHumanDetection_SelectBrand = 'Select Brand';
    w_VSHumanDetection_SelectRegion = 'Select Region';
    w_VSHumanDetection_DrawROI = 'Draw ROI';
    w_VSHumanDetection_CheckAndOverlook = 'Check and Overlook';
    w_VSHumanDetection_CustomId = 'Id';
    w_VSHumanDetection_Name = 'Name';
    w_VSHumanDetection_Brand = 'Brand';
    w_VSHumanDetection_HDserver = 'HD Server';
    w_VSHumanDetection_CMS = 'CMS';
    w_VSHumanDetection_SetCMS = 'Not yet set? Go to set CMS';
    w_VSHumanDetection_SetSHServer = 'Not yet set? Go to set SHServer';
    w_VSHumanDetection_NVR = 'NVR';
    w_VSHumanDetection_ChannelInNVR = 'Channel In NVR';
    w_VSHumanDetection_Site = 'Site';
    w_VSHumanDetection_Area = 'Area';
    w_VSHumanDetection_DeviceGroup = 'Device Group';
    w_VSHumanDetection_PageToCMSAlter = 'Data will not be stored, Are you sure to CMS Page?';
    w_VSHumanDetection_PageToHDServerAlter = 'Data will not be stored, Are you sure to HD Server Page?';
    w_VSHumanDetection_DeleteConfirm = 'Are you sure to delete selected Device(s)?';

    // DwellTime
    w_VSDwellTime_List = 'Dwell Time Device List';
    w_VSDwellTime_Add = 'Add Dwell Time Device';
    w_VSDwellTime_Edit = 'Edit DwellTime Device';
    w_VSDwellTime_View = 'View Dwell Time Device';

    w_VSDwellTime_AddisapUseFRS = 'Add Dwell Time Device Use iSap FRS Server';
    w_VSDwellTime_EditisapUseFRS = 'Edit Dwell Time Device Use iSap FRS Server';

    w_VSDwellTime_AddisapUseFRSManger = 'Add Dwell Time Device Use iSap FRS Manger Server';
    w_VSDwellTime_EditisapUseFRSManger = 'Edit Dwell Time Device Use iSap FRS Manger Server';

    w_VSDwellTime_AddSuccess = 'Dwell Time Device add success.';
    w_VSDwellTime_ADDFailed = 'Dwell Time Device add failed, please try again.';
    w_VSDwellTime_EditSuccess = 'Dwell Time Device edit success.';
    w_VSDwellTime_EditFailed = 'Dwell Time Device edit failed, please try again.';
    w_VSDwellTime_DeleteConfirm = 'Are you sure to delete selected Dwell Time Device(s)?';

    // VIP_Stranger_Visitor
    w_VSVIP_Stranger_Visitor_List = 'VIP, Stranger, Frequent Visitor Device List';
    w_VSVIP_Stranger_Visitor_Add = 'Add VIP, Stranger, Frequent Visitor Device';
    w_VSVIP_Stranger_Visitor_Edit = 'Edit VIP, Stranger, Frequent Visitor Device';
    w_VSVIP_Stranger_Visitor_View = 'View VIP, Stranger, Frequent Visitor Device';

    w_VSVIP_Stranger_Visitor_AddisapUseFRS = 'Add VIP, Stranger, Frequent Visitor Device Use iSap FRS Server';
    w_VSVIP_Stranger_Visitor_EditisapUseFRS = 'Edit VIP, Stranger, Frequent Visitor Device Use iSap FRS Server';

    w_VSVIP_Stranger_Visitor_AddisapUseFRSManger = 'Add VIP, Stranger, Frequent Visitor Device Use iSap FRS Manger Server';
    w_VSVIP_Stranger_Visitor_EditisapUseFRSManger = 'Edit VIP, Stranger, Frequent Visitor Device Use iSap FRS Manger Server';

    w_VSVIP_Stranger_Visitor_AddSuccess = 'VIP, Stranger, Frequent Visitor Device add success.';
    w_VSVIP_Stranger_Visitor_ADDFailed = 'VIP, Stranger, Frequent Visitor Device add failed, please try again.';
    w_VSVIP_Stranger_Visitor_EditSuccess = 'VIP, Stranger, Frequent Visitor Device edit success.';
    w_VSVIP_Stranger_Visitor_EditFailed = 'VIP, Stranger, Frequent Visitor Device edit failed, please try again.';
    w_VSVIP_Stranger_Visitor_DeleteConfirm = 'Are you sure to delete selected VIP, Stranger, Frequent Visitor Device(s)?';

    // Report All
    w_Report_Time = 'Time';
    w_Report_Date = 'Date';
    w_Report_StartDate = 'Start Date';
    w_Report_EndDate = 'End Date';
    w_Report_Temperature = 'Temperature';
    w_Report_TemperatureMin = 'Temperature Min';
    w_Report_TemperatureMax = 'Temperature Max';
    w_Report_Weather = 'Weather';
    w_Report_Percent = 'Percent';

    w_Report_ErrorDateStart = 'Start date error';
    w_Report_ErrorDateEnd = 'End date error';
    w_Report_ErrorChartMode = 'No Find Chart Mode';

    // Report Traffic
    w_ReportTraffic_TrafficTraffic = 'Traffic';
    w_ReportTraffic_TrafficTrafficAVG = 'AVG Traffic';
    w_ReportTraffic_TrafficRevenue = 'Revenue';
    w_ReportTraffic_TrafficTransaction = 'Transaction';
    w_ReportTraffic_TrafficConversion = 'Conversion';
    w_ReportTraffic_TrafficASP = 'ASP';

    // Report Demographic
    w_ReportDemographic_Gender = 'Gender';
    w_ReportDemographic_GenderMale = 'Male';
    w_ReportDemographic_GenderFemale = 'Female';

    w_ReportDemographic_AgeAll = 'All';
    w_ReportDemographic_AgeLow20 = '<20';
    w_ReportDemographic_AgeM21_30 = '21-30';
    w_ReportDemographic_AgeM31_40 = '31-40';
    w_ReportDemographic_AgeM41_50 = '41-50';
    w_ReportDemographic_AgeM51_60 = '51-60';
    w_ReportDemographic_AgeUpp61 = '>61';

    // Report Occupancy
    w_ReportOccupancy_Occupancy = 'Occupancy';
    w_ReportOccupancy_OccupancyAVG = 'AVG Occupancy';

    // Report Template
    w_ReportTemplate_List = 'Report Template List';
    w_ReportTemplate_Add = 'Add Report Template';
    w_ReportTemplate_Edit = 'Edit Report Template';
    w_ReportTemplate_View = 'View Report Template';
    w_ReportTemplate_AddDuplicate = 'Duplicate Add Report Template';

    w_ReportTemplate_Name = 'Report Name';
    w_ReportTemplate_Metric = 'Metric';
    w_ReportTemplate_ReportPeriod = 'Report Period';
    w_ReportTemplate_ReportPeriod1 = '* Select Report Period';
    w_ReportTemplate_DesignationPeriod = 'Designation';
    w_ReportTemplate_SendReportTime = 'Send Report Time';
    w_ReportTemplate_SendReportTime1 = '* Send Report Time';
    w_ReportTemplate_Recipient = 'Recipient';
    w_ReportTemplate_Recipients = 'Recipient(s)';
    w_ReportTemplate_RecipientSelect = 'Select Recipient(s)';

    // Report Filter Condition Component
    w_ReportFilterConditionComponent_ = 'Filter Condition';
    w_ReportDateError = 'EndDate must greater or equal than startDate.';
    w_countSelect = 'Time Mode';

    // Report Dashboard
    w_ReportDashboard_Traffic = 'TRAFFIC';
    w_ReportDashboard_AverageOccupancy = 'AVERAGE OCCUPANCY';
    w_ReportDashboard_AverageDwellTime = 'AVERAGE DWELL TIME(M)';
    w_ReportDashboard_Demographic = 'DEMOGRAPHIC';
    w_ReportDashboard_VIPBlacklist = 'VIP/BLACKLIST';
    w_ReportDashboard_RepeatCustomer = 'REPEAT CUSTOMER';
    w_ReportDashboard_Revenue = 'REVENUE';
    w_ReportDashboard_Transaction = 'TRANSACTION';
    w_ReportDashboard_Conversion = 'CONVERSION%';
    w_ReportDashboard_ASP = 'ASP';
}
