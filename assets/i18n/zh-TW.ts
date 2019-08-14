import { RegisterLanguage, ILang } from '@/../core/i18n';

@RegisterLanguage('zh-TW', '正體中文')
export default class LangObject implements ILang {
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
    w_Navigation_Setups_Purposes = '目的';

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
    w_User_EditUser = '修改帳戶';
    w_User_Password = '密碼';
    w_User_ConfirmPassword = '確認密碼';
    w_User_EditPassword = '編輯密碼';
    w_User_VisitorCannotLogin = '訪客無法登入';

    ////////////////// Role //////////////////
    w_Role_SystemAdministrator = '系統管理員';
    w_Role_Administrator = '管理員';
    w_Role_TenantAdministrator = '承租管理員';
    w_Role_TenantUser = '承租用戶';
    w_Role_Visitor = '訪客';

    ////////////////// About //////////////////
    w_About_About = '關於';
    w_About_SystemTitle = '訪客管理服務';
    w_About_Copyright = '版權 iSAP Solution';
    w_About_ServerVersion = '伺服器版本';
    w_About_FrameworkVersion = '框架版本';
    w_About_WebClientVersion = '網頁客戶版本';

    ////////////////// MyProfile //////////////////
    w_MyProfile_ViewMyProfile = '我的簡歷';
    w_MyProfile_ChangePassword = '更換密碼';
    w_MyProfile_ChangePasswordSuccess = '更換密碼成功';
    w_MyProfile_ChangePasswordFailed = '更換密碼失敗';
    w_MyProfile_OldPassword = '就密碼';
    w_MyProfile_NewPassword = '新密碼';
    w_MyProfile_ConfirmPassword = '確認密碼';
    w_MyProfile_ErrorPasswordNotSame = '新密碼語確認密碼不同';

    ////////////////// License //////////////////
    w_License_List = '憑證清單';
    w_License_Add = '新增憑證';
    w_License_LicenseKey = '憑證碼';
    w_License_Mac = '實體位址';
    w_License_productName = '專案名稱';
    w_License_Quantity = '數量';
    w_License_Trial = '審查';
    w_License_RegisterDate = '註冊日';
    w_License_ExpireDate = '過期日';
    w_License_License_Key = '憑證碼';
    w_License_UploadOfflineKey = '上傳離線碼';
    w_License_UploadOfflineKey1 = '* 上傳離線碼';
    w_License_RegisterOnline = '註冊上線';
    w_License_RegisterOffline = '註冊離線';

    w_License_License_KeyPlaceholder = '憑證碼，輸入25位數，英文或數字。 格式範例: xxxxx-xxxxx-xxxxx-xxxxx-xxxxx';

    w_License_Setting_Success = '憑證設定成功';
    w_License_Setting_Fail = '憑證設定失敗';

    w_License_MACAddress = 'MAC地址';
    w_License_Expired = '過期';

    ////////////////// FRS Setting //////////////////
    w_FRSSetting = 'FRS設定';
    w_FRSSetting_IPAddress = 'IP地址';
    w_FRSSetting_HTTPPort = 'HTTP埠';
    w_FRSSetting_Success = 'FRS 設定成功';
    w_FRSSetting_Fail = 'FRS 設定失敗';
    w_FRSReading_Fail = 'FRS 讀取失敗';

    ////////////////// Mail Setting //////////////////
    w_MailServer_Enable = '啟用';
    w_MailServer_placeholder = '設定測試信箱給 xxx@xxx.com';
    w_MailServer_Test = '測試信箱';

    w_MailServer_Setting_Fail = '信箱伺服器設定失敗';
    w_MailServer_Test_Success = '信箱伺服器設定成功';
    w_MailServer_Test_EmailSetting = '信箱設定';
    w_MailServer_Read_Fail = '信箱伺服器讀取失敗';
    w_MailServer_Read_FailMsg = '伺服器內部錯誤, 請聯絡管理員';

    w_MailSetting_SMTPHostname = 'SMTP主機名稱';
    w_MailSetting_PortNumber = '埠號碼';
    w_MailSetting_Email = '信箱';

    w_MailSetting_EmailSuccess = '信箱設定成功';

    ////////////////// SMS Setting //////////////////
    w_SmsServer_Enable = '啟用';
    w_SmsServer_Setting = '設定 SMS 伺服器';
    w_SmsServer_Test = '測試 SMS';
    w_SmsServer_Phone = '電話號碼';
    w_SmsServer_Setting_Success = 'SMS 伺服器設定成功。';
    w_SmsServer_Setting_Fail = 'SMS 伺服器設定失敗。';
    w_SmsServer_Setting_Test_Fail = 'SMS 伺服器測試失敗。';
    w_SmsServer_Setting_Test_Success = 'SMS 伺服器設定成功';
    w_SmsServer_Read_Fail = 'SMS 伺服器讀取失敗';
    w_URL = '網址';
    w_SMSSetting_Username = '用戶名稱';
    w_SMSSetting_EmailSuccess = 'SMS 設定信箱成功';
    w_SMSSetting_placeholder = '寄送給 +xxxxxxxxxx';
    w_SMSSetting_COMPortNumber = 'COM埠號碼';
    w_SMSSetting_SMSSetting = 'SMS 設定';

    ////////////////// Visitor Card Setting //////////////////
    w_VisitorCardSetting = '訪客卡設定';
    w_VisitorCardSetting_RangeStart = '開始範圍';
    w_VisitorCardSetting_RangeEnd = '結束範圍';
    w_VisitorCardSetting_Success = '訪客卡設定成功';
    w_VisitorCardSetting_Fail = '訪客卡設定失敗';
    w_VisitorCardSetting_ReadFail = '訪客卡讀取失敗';
    w_VisitorCardSetting_error = '起始、結束範圍必須超過 10000';
    w_VisitorCardSetting_error1 = '起始必須小於結束';

    ////////////////// Company //////////////////
    w_Company_List = '公司清單';
    w_Company_Add = '新增公司';
    w_Company_Edit = '編輯公司';
    w_Company_View = '瀏覽公司';

    w_Company_AddSuccess = '公司編輯成功';
    w_Company_ADDFailed = '公司新增失敗, 請重試';
    w_Company_EditSuccess = '公司編輯成功';
    w_Company_EditFailed = '公司編輯失敗, 請重試';
    w_Company_DeleteConfirm = 'Are you sure to delete selected Company(s)?';

    w_Company_Name = '公司名稱';
    w_Company_UnitNumber = '單位號碼';
    w_Company_ContactPerson = '聯絡人';
    w_Company_ContactNumber = '聯絡號碼';
    w_Company_Floor = '樓層';

    ////////////////// Kiosk //////////////////
    w_Kiosk_List = '設備清單';
    w_Kiosk_Add = '新增設備';
    w_Kiosk_Edit = '修改設備';
    w_Kiosk_View = '瀏覽設備';

    w_Kiosk_AddSuccess = '設備新增成功';
    w_Kiosk_ADDFailed = '設備新增失敗, 請重試';
    w_Kiosk_EditSuccess = '設備修改成功';
    w_Kiosk_EditFailed = '設備修改失敗, 請重試';
    w_Kiosk_DeleteConfirm = '確定刪除選取設備?';

    w_Kiosk_Username = '用戶名稱';
    w_Kiosk_Id = '設備編號';
    w_Kiosk_KioskName = '設備名稱';
    w_Kiosk_Status = '狀態';

    ////////////////// Tenants Invitation //////////////////
    w_Tenants_InvitationList = '邀請清單';
    w_Tenants_MobileNumber = '設備名稱';
    w_Tenants_Name = '名稱';
    w_Tenants_Email = '信箱';
    w_Tenants_Phone = '電話';
    w_Tenants_Status = '狀態';
    w_Tenants_StartDate = '起始時間';
    w_Tenants_EndDate = '結束時間';
    w_Tenants_Purpose = '目的';
    w_Tenants_sms = 'SMS';
    w_Tenants_AddInvitation = '新增邀請';
    w_Tenants_EditInvitation = '編輯邀請';

    ////////////////// Tenants Visitor //////////////////
    w_Tenants_VisitorList = '訪客清單';

    ////////////////// Floor  //////////////////
    w_Floor_List = '樓層清單';
    w_Floor_Add = '新增樓層';
    w_Floor_Edit = '修改樓層';
    w_Floor_View = '瀏覽樓層';

    w_Floor_AddSuccess = '樓層新增成功';
    w_Floor_ADDFailed = '樓層新增失敗, 請重試';
    w_Floor_EditSuccess = '樓層編輯成功';
    w_Floor_EditFailed = '樓層編輯失敗, 請重試';
    w_Floor_DeleteConfirm = '確定刪除選取樓層?';

    w_Floor_FloorName = '樓層名稱';
    w_Floor_Floor = '樓層';

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
    w_Potrait_Photo = '你的圖片';
    w_Potrait_PhotoPlaceholder = '圖片尺寸必須大於 300 * 300';
    w_Potrait_ErrorFileToLarge = '圖片尺寸過大';
    w_Potrait_SuccessTitle = '註冊已完成!';
    w_Potrait_SuccessContent_1 = '請注意您辦理報到時發送給您的密碼';
    w_Potrait_SuccessContent_2 = '請前往設備並點擊"報到"';
}
