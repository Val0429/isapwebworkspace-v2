import { RegisterLanguage, ILang } from '@/../core/i18n';

@RegisterLanguage('ja-JP', '日本語')
export default class LangObject implements ILang {
    w_Name = '名前';
    w_Enabled = '有効';
    w_Value = '値';
    w_Startdate = '開始日';
    w_Enddate = '終了日';
    w_Password = 'パスワード';
    w_Selection = '選択';
    w_Multi = '複数';

    w_Username = '使用者名稱';
    w_Roles = '權限';
    w_Email = 'Email';
    w_CreatedAt = '建立日期';
    w_UpdatedAt = '修改日期';
    w_Actions = '動作';
    w_ConfirmPassword = '重複輸入密碼';

    w_User = '使用者';
    w_UserAdd = '新增使用者';
    w_UserEdit = '修改使用者';

    m_PasswordShouldBeSame = '兩個密碼必須相同';

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

    w_Port_PlaceHolder = 'Port , 1~65535';
    w_Email_Placeholder = 'ex : admin@isap.com';
    w_Phone_Placeholder = 'ex : +xxxxxxxxxx';

    w_Error_Port = 'Port should be in 1~65535';
    w_Error_Password = 'Password and PasswordConfirm should be same';
    w_ErrorLongitude = 'Longitude only -180~180';
    w_ErrorLatitude = 'Latitude only -90~90';

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

    // Dialog
    w_Dialog_ErrorTitle = 'Something wrong';
    w_Dialog_SuccessTitle = 'Success';

    // Navigation
    w_Navigation_Label = 'iSAP Solution';

    w_Navigation_Users = 'Users';
    w_Navigation_User = 'User';
    w_Navigation_UserGroup = 'User Group';

    w_Navigation_Region = 'Region';

    w_Navigation_Site = 'Site';

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
    w_Navigation_Server_FRSServer = 'FRS Server';

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
    w_ImageMap_DeviceTagLabelTitle = 'Device group';
    w_ImageMap_DeviceGroupTagLabelTitle = 'Device';

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
    w_Site_DeviceList = 'Device List';
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
    w_DemographicServer_View = 'Demographic Server View';
    w_DemographicServer_Add = 'Demographic Server Add';
    w_DemographicServer_Edit = 'Demographic Server Edit';
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
    w_DemographicServer_TestFailed = 'Server Human Detection Test Failed';

    // Server Human Detection
    w_ServerHD_List = 'Server Human Detection List';
    w_ServerHD_View = 'Server Human Detection View';
    w_ServerHD_Add = 'Server Human Detection Add';
    w_ServerHD_Edit = 'Server Human Detection Edit';
    w_ServerHD_DemographicServerList = 'Server Human Detection List';
    w_ServerHD_DemographicServerView = 'Server Human Detection View';
    w_ServerHD_DemographicServerAdd = 'Server Human Detection Add';
    w_ServerHD_DemographicServerEdit = 'Server Human Detection Edit';
    w_ServerHD_DeviceID = 'Device ID';
    w_ServerHD_DeviceName = 'Device Name';
    w_ServerHD_IP = 'IP';
    w_ServerHD_Port = 'Port';
    w_ServerHD_Scale = 'Scale';
    w_ServerHD_AddSuccess = 'Server Human Detection Add Success';
    w_ServerHD_EditSuccess = 'Server Human Detection Edit Success';
    w_ServerHD_TestSuccess = 'Server Human Detection Test Success';
    w_ServerHD_AddFailed = 'Server Human Detection Add Failed';
    w_ServerHD_EditFailed = 'Server Human Detection Edit Failed';
    w_ServerHD_TestFailed = 'Server Human Detection Test Failed';

    // Server FRS
    w_ServerFRS_List = 'FRS Server List';
    w_ServerFRS_Add = 'Add FRS Server';
    w_ServerFRS_Edit = 'Edit FRS Server';
    w_ServerFRS_View = 'View FRS Server';
    w_ServerFRS_wsport = 'WS Port';

    w_ServerFRS_AddSuccess = 'FRS Server add success.';
    w_ServerFRS_ADDFailed = 'Add failed! Can not found the FRS Server, please try again.';
    w_ServerFRS_EditSuccess = 'CMS Server edit success.';
    w_ServerFRS_EditFailed = 'Edit failed! Can not found the FRS Server, please try again.';
    w_ServerFRS_DeleteConfirm = 'Are you sure to delete selected FRS Server(s)?';

	// Business Operation Campaign
	w_BOCampaign_List = 'Campaign List';
	w_BOCampaign_Add = 'Campaign Server';
	w_BOCampaign_Edit = 'Campaign Server';
	w_BOCampaign_View = 'Campaign Server';

	w_BOCampaign_EventList = 'Event List';
	w_BOCampaign_EventType = 'Event Type';
	w_BOCampaign_Period = 'Period';
	w_BOCampaign_EventName = 'Event Name';
	w_BOCampaign_StartDate = 'Start Date';
	w_BOCampaign_FinishDate = 'Finish Date';
	w_BOCampaign_Budget = 'Budget';

	w_BOCampaign_AddSuccess = 'Campaign add success.';
	w_BOCampaign_ADDFailed = 'Campaign add failed, please try again.';
	w_BOCampaign_EditSuccess = 'Campaign success.';
	w_BOCampaign_EditFailed = 'Campaign edit failed, please try again.';
	w_BOCampaign_DeleteConfirm = 'Are you sure to delete selected campaign(s)?';
}
