import { RegisterLanguage } from '@/../core/i18n';

@RegisterLanguage('zh-TW', '正體中文')
export default class LangObject implements LangObject {
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////

    // Common
    w_Value = '值';
    w_Options = '選擇';
    w_Chooses = '選擇';
    w_AllChoose = '全部';
    w_Reset = '重啟';
    w_Back = '返回';
    w_Submit = '送出';
    w_Cancel = '取消';
    w_Selection = '選擇';
    w_Multi = '多';
    w_Actions = '動作';
    w_Confirm = '確認';
    w_Cancelled = '已取消';
    w_No = '編號';

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
    w_Dialog_ErrorTitle = '錯誤';
    w_Dialog_SuccessTitle = '成功';

    // Date
    w_Startdate = '開始日期';
    w_Enddate = '結束日期';
    w_CreatedAt = '建立日期';
    w_UpdatedAt = '更新日期';

    // Error
    w_Error_FailedToFetch = "We can't connect to server, please try again!"; // failed to fetch
    w_Error_ResponseUndefined = "We can't get any response"; // no response
    w_Error_401 = 'Not find User, Please login again'; // 401
    w_Error_404 = 'API Not Find'; // 404

    // Login & User
    w_Username = '使用者姓名';
    w_Name = '姓名';
    w_Password = '密碼';
    w_Roles = '角色';
    w_Email = '電子信箱';
    w_User = '使用者';
    w_UserAdd = '增加使用者';
    w_UserEdit = '編輯使用者';
    w_ConfirmPassword = '確認密碼';
    w_RememberMe = 'Remember Me';

    // Login
    w_Login_Login = 'Login';
    w_Login_LoginTitle = '登入';
    w_Login_ForgotPassword = '忘記密碼';

    // Logout
    w_Logout = '登出';

    /////////////////////////////////////////////

    w_ThisMonth = '這個月';
    w_ThisWeek = '這個星期';
    w_Today = '今天';

    w_DeleteConfirm = '確認刪除';
    w_DeleteFailed = '刪除失敗';

    w_Error_Port = '埠號應該在1~65535之間';
    w_Error_Phone = '請確認電話格式';
    w_Error_Password = '密碼與確認密碼必須相同';

    w_StepBackward = '前一步';
    w_Account = '帳號';
    w_Test = '測試';
    w_Send = '送出';

    w_Delete_ConfirmLabel = '確認刪除';
    w_Delete_ConfirmContent = '請確認刪除的選項';

    w_ExportPDF = '匯出PDF';

    w_Website_title = 'iSAP訪客管理系統';

    ////////////////// Navigation //////////////////

    w_Navigation_MyProfile = '個人資料';
    w_Navigation_About = '關於';

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
    w_Navigation_Setups_Other = '其他';

    w_Navigation_Tenants = '承租人';
    w_Navigation_Tenants_Invitation = '邀請';
    w_Navigation_Tenants_Visitor = '訪客';

    w_Navigation_Registration_Potrait = '大頭照';

    w_Navigation_Logs = 'Logs';

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

    ////////////////// purposes  //////////////////
    w_Purposes_Name = '目的名稱';

    w_Purposes_List = '目的清單';
    w_Purposes_Add = '新增目的';
    w_Purposes_Edit = '修改目的';
    w_Purposes_View = '瀏覽目的';

    w_Purposes_AddSuccess = '目的新增成功';
    w_Purposes_ADDFailed = '目的新增失敗, 請重試';
    w_Purposes_EditSuccess = '目的修改成功';
    w_Purposes_EditFailed = '目的修改失敗, 請重試';
    w_Purposes_DeleteConfirm = '是否確定刪除選取目的?';

    ////////////////// other  //////////////////
    w_SetupsOther_PublicExternalNotURL = 'Public External Not URL';
    w_SetupsOther_UpdateSuccess = 'Update Success';
    w_SetupsOther_RemoveWorkerDaysFormLabel = 'Remove Worker Days';
    w_SetupsOther_PublicExternalIPFormLabel = 'Public External IP';
    w_GeneralSettings_RemoveWorkerDaysCardTitle = 'Remove Worker Days';

    ////////////////// Potrait //////////////////
    w_Potrait_Photo = '你的圖片';
    w_Potrait_PhotoPlaceholder = '圖片尺寸必須大於 300 * 300';
    w_Potrait_ErrorFileToLarge = '圖片尺寸過大';
    w_Potrait_SuccessTitle = '註冊已完成!';
    w_Potrait_SuccessContent_1 = '請注意您辦理報到時發送給您的密碼';
    w_Potrait_SuccessContent_2 = '請前往設備並點擊"報到"';

    // Logs
    w_Logs_List = 'Log List';
    w_Logs_EventType = 'Event Type';
    w_Logs_CreatedAt = 'Event Time';
    w_Logs_SearchCondition = 'Search Condition';
    w_Logs_Summary = 'Summary';
    w_Logs_Owner = 'Owner';
    w_Logs_Entity = 'Entity';
}
