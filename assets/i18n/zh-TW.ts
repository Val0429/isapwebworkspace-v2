import { RegisterLanguage, ILang } from '@/../core/i18n';

@RegisterLanguage('zh-TW', '正體中文')
export default class LangObject implements ILang {
    w_Name = '名稱';
    w_Enabled = '有效';
    w_Value = '值';
    w_Startdate = '起始日期';
    w_Enddate = '結束日期';
    w_Password = '密碼';
    w_Selection = '選擇';
    w_Multi = '多選';

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
    w_Clear = 'Clear';
    w_Back = 'Back';
    w_Cancel = 'Cancel';
    w_Send = 'Send';
    w_Leave = 'Leave';
    w_Test = 'Test';
    w_Check = 'Check';
    w_Submit = 'Submit';

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
}
