import { RegisterLanguage, ILang } from '@/../core/i18n';

@RegisterLanguage('zh-TW', '正體中文')
export default class LangObject implements ILang {
    w_Name = '姓名';
    w_Enabled = '啟用';
    w_Value = '值';
    w_Startdate = '開始日期';
    w_Enddate = '結束日期';
    w_Password = '密碼';
    w_PasswordConfirm = '確認密碼';
    w_Selection = '選擇';
    w_Multi = '多';

    w_Username = '使用者姓名';
    w_Roles = '腳色';
    w_Email = '信箱';
    w_CreatedAt = '建立日期';
    w_UpdatedAt = '更新日期';
    w_Actions = '動作';
    w_ConfirmPassword = '確認密碼';

    w_User = '使用者';
    w_UserAdd = '增加使用者';
    w_UserEdit = '編輯使用者';

    m_PasswordShouldBeSame = '密碼與確認密碼必須相同';

    ////////////////// Common //////////////////
    w_ThisMonth = '這個月';
    w_ThisWeek = '這個星期';
    w_Today = '今天';

    w_Options = '選擇';
    w_Chooses = '選擇';

    w_AllChoose = '全部';
    w_Reset = '重啟';
    w_Back = '返回';
    w_Submit = '送出';

    w_Confirm = '確認';
    w_Cancel = '取消';
    w_Cancelled = '已取消';

    w_Dialog_ErrorTitle = '錯誤';
    w_Dialog_SuccessTitle = '成功';

    w_Error_Port = '埠號應該在1~65535之間';
    w_Error_Phone = '請確認電話格式';
    w_Error_Password = '密碼與確認密碼必須相同';

    w_No = '編號';
    w_StepBackward = '前一步';
    w_Account = '帳號';
    w_Test = '測試';
    w_Send = '送出';

    w_Delete_ConfirmLabel = '確認刪除';
    w_Delete_ConfirmContent = '請確認刪除的選項';

    w_ExportPDF = '匯出PDF';

    /////////////////////////////////////////////

    // Login
    w_Login_LoginTitle = '登入';
    w_Login_ForgotPassword = '忘記密碼';

    // Logout
    w_Logout = '登出';

    // failed to fetch
    w_FailedToFetch = "連接不到伺服器，請再試一次!";

    // 401
    w_UserSession_Empty = '找不到使用者，請重新登入';

    // 404
    w_APINotFind = '找不到API';

    w_DeleteConfirm = '確認刪除';
    w_DeleteFailed = '刪除失敗';

    ////////////////// Navigation //////////////////

    w_Navigation_About = '關於';

    w_Navigation_MyProfile = '個人資料';

    w_Navigation_Reports = '報告';
    w_Navigation_Reports_Dashboard = '儀表板';
    w_Navigation_Reports_Investigation = '調查';

    w_Navigation_Setups = '設定';
    w_Navigation_Setups_Floor = '樓層管理';
    w_Navigation_Setups_Company = '公司管理';
    w_Navigation_Setups_Account = '帳號管理';
    w_Navigation_Setups_Kiosk = '設備管理';
    w_Navigation_Setups_License = '許可證';
    w_Navigation_Setups_FRS = 'FRS設定';
    w_Navigation_Setups_Email = '信箱設定';
    w_Navigation_Setups_SMS = '簡訊設定';
    w_Navigation_Setups_SMSOnline = '線上簡訊提供者設定(新加坡)';
    w_Navigation_Setups_VisitorCard = '訪客卡片';
    w_Navigation_Setups_Purposes = '目的';

    w_Navigation_Tenants = '承租人';
    w_Navigation_Tenants_Invitation = '邀請';
    w_Navigation_Tenants_Visitor = '訪客';

    w_Navigation_Registration_Potrait = '大頭照';

    ////////////////// Dashboard //////////////////
    w_Dashboard_VisitorOnSite = '入場訪客';
    w_Dashboard_dailyTotalVisitor = '每日訪客統計';

    w_Dashboard_ChartStatisticTitle = '報到統計';
    w_Dashboard_ChartRecurringTitle = '定期訪客';

    w_Dashboard_ChartStatisticSuccess = '成功';
    w_Dashboard_ChartStatisticException = '例外';

    ////////////////// Investigation //////////////////
    w_Investigation_FilterTitle = '篩選';
    w_Investigation_ContentTitle = '調查';
    w_Investigation_StartDate = '開始';
    w_Investigation_EndDate = '結束';
    w_Investigation_Purpose = '目的';
    w_Investigation_Kiosk = '設備';
    w_Investigation_VisitorName = '訪客姓名';
    w_Investigation_KioskName = '設備名稱';
    w_Investigation_Result = '結果';
    w_Investigation_Event = '事件';
    w_Investigation_EventTime = '事件時間';

    w_Investigation_EventStrictCompareFace = '臉部比對';
    w_Investigation_EventStrictCompleteCheckIn = '報到完成';
    w_Investigation_EventStrictConfirmPhoneNumber = '確認電話號碼';
    w_Investigation_EventStrictTryCheckIn = '再次報到';

    ////////////////// User //////////////////
    w_User_UserName = '使用者姓名';
    w_User_Email = '信箱';
    w_User_Phone = '電話';
    w_User_Roles = '角色';
    w_User_FloorName = '樓層';
    w_User_CompanyName = '公司';
    w_User_AccountList = '帳號清單';
    w_User_ViewUser = '帳號預覽';
    w_User_AddUser = '增加帳號';
    w_User_EditUser = '編輯帳號';
    w_User_Password = '密碼';
    w_User_ConfirmPassword = '確認密碼';
    w_User_EditPassword = '編輯';
    w_User_VisitorCannotLogin = "訪客無法登入";

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

    //purposes
    w_Purposes_Name = 'Purposes Name';

    w_Purposes_List = 'Purposes List';
    w_Purposes_Add = 'Add Purposes';
    w_Purposes_Edit = 'Edit Purposes';
    w_Purposes_View = 'View Purposes';

    w_Purposes_AddSuccess = 'Purposes add success';
    w_Purposes_ADDFailed = 'Purposes add failed, please try again';
    w_Purposes_EditSuccess = 'Purposes edit success';
    w_Purposes_EditFailed = 'Purposes edit failed, please try again';
    w_Purposes_DeleteConfirm = 'Are you sure to delete selected Purposes(s)?';

    ////////////////// Potrait //////////////////
    w_Potrait_Photo = 'Your Photo';
    w_Potrait_PhotoPlaceholder = 'Photo size must bigger than 300 x 300';
    w_Potrait_ErrorFileToLarge = 'Photo size too large';
    w_Potrait_SuccessTitle = 'Registration Completed!';
    w_Potrait_SuccessContent_1 = 'Please take note of the PIN CODE sent to you for your Check-In';
    w_Potrait_SuccessContent_2 = 'kindly proceed to the Check-in Kiosk and Click "Check-in"';
}
