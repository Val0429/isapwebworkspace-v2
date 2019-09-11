import { RegisterLanguage } from '@/../core/i18n';

@RegisterLanguage('en-US', 'English')
export default class LangObject {
    // Common
    w_Value = 'Value';
    w_Options = 'Options';
    w_Chooses = 'Choose';
    w_AllChoose = 'All';
    w_Reset = 'Reset';
    w_Back = 'Back';
    w_Submit = 'Submit';
    w_Cancel = 'Cancel';
    w_Selection = 'Selection';
    w_Multi = 'Multi';
    w_Actions = 'Actions';
    w_Confirm = 'Confirm';
    w_Cancelled = 'Cancelled';
    w_No = 'No';
    w_Next = 'Next';
    w_Prev = 'previous';
    w_StepBackward = 'Step Backward';
    w_Account = 'Account';
    w_Test = 'Test';
    w_Send = 'Send';
    w_Error_Port = 'Port should be in 1~65535';
    w_Error_Phone = 'Please check Phone Format';
    w_Error_Email = 'Please check Email Format';
    w_Error_Password = 'Password and PasswordConfirm should be same';
    w_DeleteConfirm = 'Delete Confirm';
    w_DeleteFailed = 'Delete Failed';
    w_Delete_ConfirmLabel = 'Confirm Delete';
    w_Delete_ConfirmContent = 'Please confirm delete choose';

    // Status
    w_Status_Enable = 'Enable';
    w_Status_Enabled = 'Enabled';
    w_Status_Disable = 'Disable';
    w_Status_Disabled = 'Disabled';
    w_Status_No = 'No';
    w_Status_Yes = 'Yes';
    w_Status_Success = 'Success';
    w_Status_Failed = 'Failed';
    w_Status_Error = 'Error';

    // Dialog
    w_Dialog_ErrorTitle = 'Error';
    w_Dialog_SuccessTitle = 'Success';

    // Error
    w_Error_FailedToFetch = "We can't connect to server, please try again!"; // failed to fetch
    w_Error_401 = 'Not find User, Please login again'; // 401
    w_Error_404 = 'API Not Find'; // 404

    // Login & User
    w_Username = 'User Name';
    w_Name = 'Name';
    w_Password = 'Password';
    w_Roles = 'Role';
    w_Email = 'Email';
    w_User = 'User';
    w_UserAdd = 'Add User';
    w_UserEdit = 'Edit User';
    w_ConfirmPassword = 'Confirm Password';
    w_RememberMe = 'Remember Me';
    w_Phone = 'Phone';

    // Login
    w_Login_Login = 'Login';
    w_Login_LoginTitle = 'Login';
    w_Login_ForgotPassword = 'Forgot Password';
    w_Login_Error_401 = 'Incorrect username or password';

    // Forgot Password
    w_ForgotPassword_Success = 'Send new Password to E-mail';
    w_ForgotPassword_Failed = 'Not find User, Please try again';

    // Logout
    w_Logout = 'Logout';

    // Role
    w_Role_SystemAdministrator = 'System Administrator';
    w_Role_Administrator = 'Administrator';
    w_Role_TenantAdministrator = 'Tenant Administrator';
    w_Role_TenantUser = 'Tenant User';
    w_Role_Visitor = 'Visitor';

    // Date
    w_Startdate = 'Start Date';
    w_Enddate = 'End Date';
    w_CreatedAt = 'Created Date';
    w_UpdatedAt = 'Updated Date';

    // Toolbox
    w_ExportPDF = 'Export PDF';
    w_SyncVms = 'Sync to VMS';

    ////////////////// Navagation //////////////////
    m_Navigation_MyProfile = 'My Profile';
    m_Navigation_Accounts = 'Account Management';
    m_Navigation_Buildings = 'Building Management';
    m_Navigation_Floor = 'Floor Management';
    m_Navigation_Door = 'Door Management';
    m_Navigation_Company = 'Company Management';
    m_Navigation_Persons = 'Person Management';
    m_Navigation_Persons_PersonList = 'Person List';
    m_Navigation_Persons_BlackList = 'Black List';
    m_Navigation_HikVision = 'HikVision FR Tablet';
    m_Navigation_Settings = 'Settings';
    m_Navigation_Settings_SuntecAppServer = 'Suntec App Server';
    m_Navigation_Settings_AcsServer = 'ACS Server';
    m_Navigation_Settings_SmtpServer = 'SMTP';
    m_Navigation_Settings_Vms = 'VMS';
    m_Navigation_Settings_Email = 'Email';
    m_Navigation_Settings_License = 'License';
    m_Navigation_Reports = 'Report';
    m_Navigation_Reports_Dashboard = 'Dashboard';
    m_Navigation_Reports_Investigation = 'Investigation';
    m_Navigation_Logs = 'Logs';

    ////////////////// MyProfile //////////////////
    m_MyProfile_ViewMyProfile = 'My Profile';
    w_MyProfile_ChangePassword = 'Change Password';
    w_MyProfile_ChangePasswordSuccess = 'Change Password Success';
    w_MyProfile_ChangePasswordFailed = 'Change Password Failed';
    w_MyProfile_OldPassword = 'Old Password';
    w_MyProfile_NewPassword = 'New Password';
    w_MyProfile_ConfirmPassword = 'Confirm Password';
    w_MyProfile_ErrorPasswordNotSame = 'New Password and Confirm is different';

    ////////////////// About //////////////////
    w_About_About = 'About';
    w_About_SystemTitle = 'Visitor Management Service';
    w_About_Copyright = 'Copyright iSAP Solution';
    w_About_ServerVersion = 'Server Version';
    w_About_FrameworkVersion = 'Framework Version';
    w_About_WebClientVersion = 'Web Client Version';

    ////////////////// Account //////////////////
    w_Account_Account = 'Account';
    w_Account_UserName = 'Name';
    w_Account_UserTitles = 'Titles';
    w_Account_Email = 'Email';
    w_Account_Phone = 'Phone';
    w_Account_Roles = 'Roles';
    w_Account_FloorName = 'Floor';
    w_Account_CompanyName = 'Company';
    w_Account_Remark = 'Remark';
    w_Account_AccountList = 'Account List';
    w_Account_ViewUser = 'Preview Account';
    w_Account_AddUser = 'Add Account';
    w_Account_EditUser = 'Edit Account';
    w_Account_Password = 'Password';
    w_Account_ConfirmPassword = 'Confirm Password';
    w_Account_EditPassword = 'Edit Password';
    w_Account_VisitorCannotLogin = "Visitor can't login";

    ////////////////// Building  //////////////////
    w_Buildings_Building = 'Building';
    w_Buildings_List = 'Building List';
    w_Buildings_BuildingName = 'Building Name';
    w_Buildings_View = 'View Building';
    w_Buildings_Add = 'Add Building';
    w_Buildings_Edit = 'Edit Building';
    w_Buildings_AddSuccess = 'Building add success';
    w_Buildings_ADDFailed = 'Building add failed, please try again';
    w_Buildings_EditSuccess = 'Building edit success';
    w_Buildings_EditFailed = 'Building edit failed, please try again';
    w_Buildings_DeleteConfirm = 'Are you sure to delete selected Building(s)?';

    ////////////////// Floor  //////////////////
    w_Floor_List = 'Floor List';
    w_Floor_Add = 'Add Floor';
    w_Floor_Edit = 'Edit Floor';
    w_Floor_View = 'View Floor';

    w_Floor_AddSuccess = 'Floor add success';
    w_Floor_ADDFailed = 'Floor add failed, please try again';
    w_Floor_EditSuccess = 'Floor edit success';
    w_Floor_EditFailed = 'Floor edit failed, please try again';
    w_Floor_DeleteConfirm = 'Are you sure to delete selected Floor(s)?';

    w_Floor_FloorName = 'Floor Name';
    w_Floor_Floor = 'Floor';

    ////////////////// Door  //////////////////
    w_Door_DoorName = 'Door Name';
    w_Door_List = 'Door List';
    w_Door_BuildingName = 'Building Name';
    w_Door_FloorName = 'Floor Name';
    w_Door_EndpointName = 'Endpoint Name';
    w_Door_IsPublic = 'Public';
    w_Door_View = 'View Door';
    w_Door_Add = 'Add Door';
    w_Door_Edit = 'Edit Door';
    w_Door_AddSuccess = 'Door add success';
    w_Door_ADDFailed = 'Door add failed, please try again';
    w_Door_EditSuccess = 'Door edit success';
    w_Door_EditFailed = 'Door edit failed, please try again';
    w_Door_DeleteConfirm = 'Are you sure to delete selected Door(s)?';

    ////////////////// Company //////////////////
    w_Company_List = 'Company List';
    w_Company_Add = 'Add Company';
    w_Company_Edit = 'Edit Company';
    w_Company_View = 'View Company';

    w_Company_AddSuccess = 'Company add success';
    w_Company_ADDFailed = 'Company add failed, please try again';
    w_Company_EditSuccess = 'Company edit success';
    w_Company_EditFailed = 'Company edit failed, please try again';
    w_Company_DeleteConfirm = 'Are you sure to delete selected Company(s)?';

    w_Company_Name = 'Company Name';
    w_Company_UnitNumber = 'Unit Number';
    w_Company_ContactPerson = 'Contact Person';
    w_Company_ContactNumber = 'Contact Number';
    w_Company_Floor = 'Floor';

    w_Company_ErrorContactNumberNotNumber = 'Please check contact only digits';

    ////////////////// Person List //////////////////
    w_Person_PersonList = 'Person List';
    w_Person_AddStaff = 'Add Staff';
    w_Person_EditStaff = 'Edit Staff';
    w_Person_Image = 'Image';
    w_Person_Company = 'Company';
    w_Person_Building = 'Building';
    w_Person_Floor = 'Floor';
    w_Person_Door = 'Door';
    w_Person_Unit = 'Unit';
    w_Person_Name = 'Name';
    w_Person_Titles = 'Titles';
    w_Person_Phone = 'Phone';
    w_Person_Email = 'Email';
    w_Person_Agree_Tc = 'I agree to the T&C';
    w_Person_Agree_App = 'I agree to the Suntec Rewards';
    w_Person_Remark = 'Remark';
    w_Person_Enable_Permission = 'Enable Permission Date';
    w_Person_Disable_Permission = 'Disble Permission Date';
    w_Person_Card_Number = 'Card Number';
    w_Person_NRIC = 'NRIC';

    ////////////////// Blacklist List //////////////////
    w_Blacklist_Blacklist = 'Blacklist';
    w_Blacklist_Image = 'Image';
    w_Blacklist_NRIC = 'NRIC';
    w_Blacklist_Company = 'Company';
    w_Blacklist_Reason = 'Reason';

    ////////////////// HikVision FR Tablet //////////////////
    w_Hik_FrList = 'FR Tablet List';
    w_Hik_AddFr = 'Add FR Tablet';
    w_Hik_EditFr = 'Edit FR Tablet';
    w_Hik_DelFr = 'Delete FR Tablet';
    w_Hik_ViewFr = 'Preview FR Tablet';
    w_Hik_Index = 'Index';
    w_Hik_IPAddress = 'IP Address';
    w_Hik_HTTPPort = 'HTTP Port';
    w_Hik_Device_Name = 'Device Name';
    w_Hik_Position = 'Device Postion';
    w_Hik_Status = 'Status';
    w_Hik_Endpoint_Name = 'Endpoint Name';

    ////////////////// ACS Setting //////////////////
    w_Acs_Card_Range = 'Card Range';
    w_Acs_Card_Staff = 'Staff';
    w_Acs_Card_Visitor = 'Visitor';
    w_Acs_3rd_Acs = 'Using 3rd Party ACS';
    w_Acs_Acs = 'ACS server Setting';
    w_Acs_IPAddress = 'IP Address';
    w_Acs_HTTPPort = 'HTTP Port';
    w_Acs_ServiceName = 'Service Name';
    w_Acs_FingerPrinter = 'Finger Printer';
    w_Acs_AccessGroupName = 'Access Group Name';

    ////////////////// SMTP Setting //////////////////
    w_Smtp_Smtp = 'SMTP Setting';

    ////////////////// VMS Setting //////////////////
    w_Vms_Vms = 'VMS Setting';

    ////////////////// Mail Setting //////////////////
    w_MailServer_Enable = 'Enable';
    w_MailServer_placeholder = 'Set Test Email to xxx@xxx.com';
    w_MailServer_Test = 'Test Email';

    w_MailServer_Setting_Fail = 'Email Server set failed';
    w_MailServer_Test_Success = 'Email Server test success';
    w_MailServer_Test_EmailSetting = 'Email Setting';
    w_MailServer_Read_Fail = 'Mail Server read failed';
    w_MailServer_Read_FailMsg = 'Internal Server Error, please contact administrator';

    w_MailSetting_SMTPHostname = 'SMTP Hostname';
    w_MailSetting_PortNumber = 'Port Number';
    w_MailSetting_Email = 'Email';

    w_MailSetting_EmailSuccess = 'Email Setting has been updated';

    ////////////////// License //////////////////
    w_License_List = 'License List';
    w_License_Add = 'Add License';
    w_License_LicenseKey = 'License Key';
    w_License_Mac = 'Mac';
    w_License_productName = 'Product Name';
    w_License_Quantity = 'Quantity';
    w_License_Trial = 'Trial';
    w_License_RegisterDate = 'Register Date';
    w_License_ExpireDate = 'ExpireDate';
    w_License_License_Key = 'License Key';
    w_License_UploadOfflineKey = 'Upload offline key';
    w_License_UploadOfflineKey1 = '* Upload offline key';
    w_License_RegisterOnline = 'Register Online';
    w_License_RegisterOffline = 'Register Offline';

    w_License_License_KeyPlaceholder = 'License Key. Input 25 digits.  English alphabet or number only.  Format: xxxxx-xxxxx-xxxxx-xxxxx-xxxxx';

    w_License_Setting_Success = 'License set success.';
    w_License_Setting_Fail = 'License set failed.';

    w_License_MACAddress = 'MAC Address ';
    w_License_Expired = 'Expired';

    ////////////////// Investigation //////////////////
    w_Investigation_FilterTitle = 'Filter';
    w_Investigation_ContentTitle = 'Investigation';
    w_Investigation_StartDate = 'Start';
    w_Investigation_EndDate = 'End';
    w_Investigation_Purpose = 'Purpose';
    w_Investigation_Kiosk = 'Kiosk';
    w_Investigation_VisitorName = 'Visitor Name';
    w_Investigation_KioskName = 'Kiosk Name';
    w_Investigation_Result = 'Result';
    w_Investigation_Event = 'Event';
    w_Investigation_EventTime = 'Event Time';

    w_Investigation_EventStrictCompareFace = 'Compare Face';
    w_Investigation_EventStrictCompleteCheckIn = 'Complete Check-In';
    w_Investigation_EventStrictConfirmPhoneNumber = 'Confirm Phone Number';
    w_Investigation_EventStrictTryCheckIn = 'Try Check-In';

    // Logs
    w_Logs_List = 'Log List';
    w_Logs_EventType = 'Event Type';
    w_Logs_CreatedAt = 'Event Time';
    w_Logs_SearchCondition = 'Search Condition';
    w_Logs_Summary = 'Summary';
    w_Logs_Owner = 'Owner';
    w_Logs_Entity = 'Entity';
    w_Logs_Message = 'Message';
}
