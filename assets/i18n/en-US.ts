import { RegisterLanguage } from '@/../core/i18n';

@RegisterLanguage('en-US', 'English')
export default class LangObject {
    w_Name = 'Name';
    w_Enabled = 'Enabled';
    w_Value = 'Value';
    w_Startdate = 'Start Date';
    w_Enddate = 'End Date';
    w_Password = 'Password';
    w_PasswordConfirm = 'Confirm Password';
    w_Selection = 'Selection';
    w_Multi = 'Multi';

    w_Username = 'User name';
    w_Roles = 'Roles';
    w_Email = 'Email';
    w_CreatedAt = 'Created Date';
    w_UpdatedAt = 'Updated Date';
    w_Actions = 'Actions';
    w_ConfirmPassword = 'Confirm Password';

    w_User = 'User';
    w_UserAdd = 'Add User';
    w_UserEdit = 'Edit User';

    m_PasswordShouldBeSame = 'Both password should same';

    ////////////////// Common //////////////////
    w_ThisMonth = 'This Month';
    w_ThisWeek = 'This Week';
    w_Today = 'Today';

    w_Options = 'Options';
    w_Chooses = 'Choose';

    w_AllChoose = 'All';
    w_Reset = 'Reset';
    w_Back = 'Back';
    w_Submit = 'Submit';

    w_Confirm = 'Confirm';
    w_Cancel = 'Cancel';
    w_Cancelled = 'Cancelled';

    w_Dialog_ErrorTitle = 'Error';
    w_Dialog_SuccessTitle = 'Success';

    w_Error_Port = 'Port should be in 1~65535';
    w_Error_Phone = 'Please check Phone Format';
    w_Error_Password = 'Password and PasswordConfirm should be same';

    w_No = 'No';
    w_StepBackward = 'Step Backward';
    w_Account = 'Account';
    w_Test = 'Test';
    w_Send = 'Send';

    w_Delete_ConfirmLabel = 'Confirm Delete';
    w_Delete_ConfirmContent = 'Please confirm delete choose';

    w_ExportPDF = 'Export PDF';

    /////////////////////////////////////////////

    // Login
    w_Login_LoginTitle = 'Login';
    w_Login_ForgotPassword = 'Forgot Password';

    // Logout
    w_Logout = 'Logout';

    // failed to fetch
    w_FailedToFetch = "We can't connect to server, please try again!";

    // 401
    w_UserSession_Empty = 'Not find User, Please login again';

    // 404
    w_APINotFind = 'API Not Find';

    w_DeleteConfirm = 'Delete Confirm';
    w_DeleteFailed = 'Delete Failed';

    ////////////////// Navigation //////////////////

    w_Navigation_About = 'About';

    w_Navigation_MyProfile = 'My Profile';

    w_Navigation_Reports = 'Report';
    w_Navigation_Reports_Dashboard = 'Dashboard';
    w_Navigation_Reports_Investigation = 'Investigation';

    w_Navigation_Setups = 'Setup';
    w_Navigation_Setups_Floor = 'Floor Management';
    w_Navigation_Setups_Company = 'Company Management';
    w_Navigation_Setups_Account = 'Account Management';
    w_Navigation_Setups_Kiosk = 'Kiosk Management';
    w_Navigation_Setups_License = 'License';
    w_Navigation_Setups_FRS = 'FRS Setting';
    w_Navigation_Setups_Email = 'Email Setting';
    w_Navigation_Setups_SMS = 'SMS Setting';
    w_Navigation_Setups_SMSOnline = 'Online SMS Provider (SG only)';
    w_Navigation_Setups_VisitorCard = 'Visitor Card';
    w_Navigation_Setups_Purposes = 'Purposes';

    w_Navigation_Tenants = 'Tenant';
    w_Navigation_Tenants_Invitation = 'Invitation';
    w_Navigation_Tenants_Visitor = 'Visitor';

    w_Navigation_Registration_Potrait = 'Potrait';

    ////////////////// Dashboard //////////////////
    w_Dashboard_VisitorOnSite = 'Visitor On Site';
    w_Dashboard_dailyTotalVisitor = 'Daily Total Visitor';

    w_Dashboard_ChartStatisticTitle = 'Check In Statistic';
    w_Dashboard_ChartRecurringTitle = 'Recurring Visitor';

    w_Dashboard_ChartStatisticSuccess = 'Success';
    w_Dashboard_ChartStatisticException = 'Exception';

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

    w_Investigation_EventStrictCompareFace: 'Compare Face';
    w_Investigation_EventStrictCompleteCheckIn: 'Complete Check-In';
    w_Investigation_EventStrictConfirmPhoneNumber: 'Confirm Phone Number';
    w_Investigation_EventStrictTryCheckIn: 'Try Check-In';

    ////////////////// User //////////////////
    w_User_UserName = 'User Name';
    w_User_Email = 'Email';
    w_User_Phone = 'Phone';
    w_User_Roles = 'Roles';
    w_User_FloorName = 'Floor';
    w_User_CompanyName = 'Company';
    w_User_AccountList = 'Account List';
    w_User_ViewUser = 'Preview Account';
    w_User_AddUser = 'Add Account';
    w_User_EditUser = 'Edit Account';
    w_User_Password = 'Password';
    w_User_ConfirmPassword = 'Confirm Password';
    w_User_EditPassword = 'Edit Password';
    w_User_VisitorCannotLogin = "Visitor can't login";

    ////////////////// Role //////////////////
    w_Role_SystemAdministrator = 'System Administrator';
    w_Role_Administrator = 'Administrator';
    w_Role_TenantAdministrator = 'Tenant Administrator';
    w_Role_TenantUser = 'Tenant User';
    w_Role_Visitor = 'Visitor';

    ////////////////// About //////////////////
    w_About_About = 'About';
    w_About_SystemTitle = 'Visitor Management Service';
    w_About_Copyright = 'Copyright iSAP Solution';
    w_About_ServerVersion = 'Server Version';
    w_About_FrameworkVersion = 'Framework Version';
    w_About_WebClientVersion = 'Web Client Version';

    ////////////////// MyProfile //////////////////
    w_MyProfile_ViewMyProfile = 'My Profile';
    w_MyProfile_ChangePassword = 'Change Password';
    w_MyProfile_ChangePasswordSuccess = 'Change Password Success';
    w_MyProfile_ChangePasswordFailed = 'Change Password Failed';
    w_MyProfile_OldPassword = 'Old Password';
    w_MyProfile_NewPassword = 'New Password';
    w_MyProfile_ConfirmPassword = 'Confirm Password';
    w_MyProfile_ErrorPasswordNotSame = 'New Password and Confirm is different';

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

    ////////////////// FRS Setting //////////////////
    w_FRSSetting = 'FRS Setting';
    w_FRSSetting_IPAddress = 'IP Address';
    w_FRSSetting_HTTPPort = 'HTTP Port';
    w_FRSSetting_Success = 'FRS Setting has been updated';
    w_FRSSetting_Fail = 'FRS Setting failed';
    w_FRSReading_Fail = 'FRS Reading failed';

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

    ////////////////// SMS Setting //////////////////
    w_SmsServer_Enable = 'Enable';
    w_SmsServer_Setting = 'Set SMS Server';
    w_SmsServer_Test = 'Test SMS';
    w_SmsServer_Phone = 'Phone Number';
    w_SmsServer_Setting_Success = 'SMS Server set success.';
    w_SmsServer_Setting_Fail = 'SMS Server set failed.';
    w_SmsServer_Setting_Test_Fail = 'SMS Server test failed.';
    w_SmsServer_Setting_Test_Success = 'SMS has been sent';
    w_SmsServer_Read_Fail = 'SMS Server read failed.';
    w_URL = 'URL';
    w_SMSSetting_Username = 'Username';
    w_SMSSetting_EmailSuccess = 'SMS Setting has been updated';
    w_SMSSetting_placeholder = 'Sent to +xxxxxxxxxx';
    w_SMSSetting_COMPortNumber = 'COM Port Number';
    w_SMSSetting_SMSSetting = 'SMS Setting';

    ////////////////// Visitor Card Setting //////////////////
    w_VisitorCardSetting = 'Visitor Card Setting';
    w_VisitorCardSetting_RangeStart = 'Range Start';
    w_VisitorCardSetting_RangeEnd = 'Range End';
    w_VisitorCardSetting_Success = 'Visitor Card Setting has been updated';
    w_VisitorCardSetting_Fail = 'Visitor Card Setting fail';
    w_VisitorCardSetting_ReadFail = 'Visitor Card read fail';
    w_VisitorCardSetting_error = 'Range Start, Range End need more than 10000';
    w_VisitorCardSetting_error1 = 'Range End need more than Range Start';

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

    ////////////////// Kiosk //////////////////
    w_Kiosk_List = 'Kiosk List';
    w_Kiosk_Add = 'Add Kiosk';
    w_Kiosk_Edit = 'Edit Kiosk';
    w_Kiosk_View = 'View Kiosk';

    w_Kiosk_AddSuccess = 'Kiosk add success';
    w_Kiosk_ADDFailed = 'Kiosk add failed, please try again';
    w_Kiosk_EditSuccess = 'Kiosk edit success';
    w_Kiosk_EditFailed = 'Kiosk edit failed, please try again';
    w_Kiosk_DeleteConfirm = 'Are you sure to delete selected Kiosk(s)?';

    w_Kiosk_Username = 'Username';
    w_Kiosk_Id = 'Kiosk Id';
    w_Kiosk_KioskName = 'Kiosk Name';
    w_Kiosk_Status = 'Status';

    ////////////////// Tenants Invitation //////////////////
    w_Tenants_InvitationList = 'Invitation List';
    w_Tenants_MobileNumber = 'Mobile number';
    w_Tenants_Name = 'Name';
    w_Tenants_Email = 'Email';
    w_Tenants_Phone = 'Phone';
    w_Tenants_Status = 'Status';
    w_Tenants_StartDate = 'Start';
    w_Tenants_EndDate = 'End';
    w_Tenants_Purpose = 'Purpose';
    w_Tenants_sms = 'SMS';
    w_Tenants_AddInvitation = 'Add Invitation';
    w_Tenants_EditInvitation = 'Edit Invitation';

    ////////////////// Tenants Visitor //////////////////
    w_Tenants_VisitorList = 'Visitor List';

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

    ////////////////// Potrait //////////////////
    w_Potrait_Photo = 'Your Photo';
    w_Potrait_PhotoPlaceholder = 'Photo size must bigger than 300 x 300';
    w_Potrait_ErrorFileToLarge = 'Photo size to large';
    w_Potrait_SuccessTitle = 'Registration Completed!';
    w_Potrait_SuccessContent_1 = 'Please take note of the PIN CODE sent to you for your Check-In';
    w_Potrait_SuccessContent_2 = 'kindly proceed to the Check-in Kiosk and Click "Check-in"';
}
