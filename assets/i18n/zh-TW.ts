import { RegisterLanguage } from '@/../core/i18n';

@RegisterLanguage('zh-TW', '正體中文')
export default class LangObject {
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
    w_Next = 'Next';
    w_Prev = 'Previos';
    w_StepBackward = '前一步';
    w_Account = '帳號';
    w_Test = '測試';
    w_Send = '送出';
    w_Host = 'Host';
    w_Port = 'Port';
    w_Port_PlaceHolder = 'Port , 1~65535';
    w_Email_Placeholder = 'ex : admin@isap.com';
    w_Leave = 'Leave';
    w_Check = 'Check';
    w_URL = 'URL';

    w_CurrentPassword = 'Current Password';
    w_CurrentPasswordConfirm = 'Current PasswordConfirm';

    w_Error_Port = '埠號應該在1~65535之間';
    w_Error_Phone = '請確認電話格式';
    w_Error_Email = '請確認電子信箱格式';
    w_Error_Password = '密碼與確認密碼必須相同';
    w_DeleteConfirm = '確認刪除';
    w_DeleteFailed = '刪除失敗';
    w_Delete_ConfirmLabel = '確認刪除';
    w_Delete_ConfirmContent = '請確認刪除的選項';
    w_Region_ErrorFileToLarge = 'Image max size is 7MB';

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

    // Error
    w_Error_FailedToFetch = "We can't connect to server, please try again!"; // failed to fetch
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
    w_RememberMe = '記得我';
    w_Phone = 'Phone';

    // Login
    w_Login_Login = '登入';
    w_Login_LoginTitle = '登入';
    w_Login_ForgotPassword = '忘記密碼';
    w_Login_Error_401 = 'Incorrect username or password';

    // Forgot Password
    w_ForgetPassword = 'Forget Password Step';

    w_ForgotPassword_Success = 'Send new Password to E-mail';
    w_ForgotPassword_Failed = 'Not find User, Please try again';

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

    // Logout
    w_Logout = 'Logout';

    // Role
    w_Role_SystemAdministrator = '系統管理員';
    w_Role_Administrator = '管理員';
    w_Role_TenantAdministrator = '承租管理員';
    w_Role_TenantUser = '承租用戶';
    w_Role_Visitor = '訪客';

    // Date
    w_Startdate = '開始日期';
    w_Enddate = '結束日期';
    w_CreatedAt = '建立日期';
    w_UpdatedAt = '更新日期';

    // Toolbox
    w_ExportPDF = '匯出PDF';
    w_SyncVms = '同步到VMS';

    ////////////////// Navagation //////////////////
    m_Navigation_MyProfile = '個人資料';
    m_Navigation_Accounts = '帳號管理';
    m_Navigation_Buildings = '大樓管理';
    m_Navigation_Floor = '樓層管理';
    m_Navigation_Door = '閘門管理';
    m_Navigation_Company = '公司管理';
    m_Navigation_Persons = '人員管理';
    m_Navigation_Persons_PersonList = '人員列表';
    m_Navigation_Persons_BlackList = '黑名單列表';
    m_Navigation_Server = 'Server';
    m_Navigation_ISAPFrs = 'iSAP FR Server';
    m_Navigation_Frs = 'FRS';
    m_Navigation_HikVision = 'HikVision FR Tablet';
    m_Navigation_Settings = '設定';
    m_Navigation_Settings_SuntecAppServer = 'Suntec App Server';
    m_Navigation_Settings_AcsServer = 'ACS Server';
    m_Navigation_Settings_SmtpServer = 'SMTP';
    m_Navigation_Settings_Frs = 'FRS';
    m_Navigation_Settings_Vms = 'VMS';
    m_Navigation_Settings_Email = 'Email Notify';
    m_Navigation_Settings_License = 'License';
    m_Navigation_Reports = '報告';
    m_Navigation_Reports_Dashboard = '儀表板';
    m_Navigation_Reports_Investigation = '調查';
    m_Navigation_Logs = 'Logs';

    ////////////////// MyProfile //////////////////
    m_MyProfile_ViewMyProfile = '我的簡歷';
    w_MyProfile_ChangePassword = '更換密碼';
    w_MyProfile_ChangePasswordSuccess = '更換密碼成功';
    w_MyProfile_ChangePasswordFailed = '更換密碼失敗';
    w_MyProfile_OldPassword = '舊密碼';
    w_MyProfile_NewPassword = '新密碼';
    w_MyProfile_ConfirmPassword = '確認密碼';
    w_MyProfile_ErrorPasswordNotSame = '新密碼語確認密碼不同';

    ////////////////// About //////////////////
    w_About_About = '關於';
    w_About_SystemTitle = '訪客管理服務';
    w_About_Copyright = '版權 iSAP Solution';
    w_About_ServerVersion = '伺服器版本';
    w_About_FrameworkVersion = '框架版本';
    w_About_WebClientVersion = '網頁客戶版本';

    ////////////////// Account //////////////////
    w_Account_Account = '帳號';
    w_Account_UserName = '姓名';
    w_Account_UserTitles = '職稱';
    w_Account_Email = '信箱';
    w_Account_Phone = '電話';
    w_Account_Roles = '角色';
    w_Account_FloorName = '樓層';
    w_Account_CompanyName = '公司';
    w_Account_Remark = 'Remark';
    w_Account_AccountList = '帳號清單';
    w_Account_ViewUser = '帳號預覽';
    w_Account_AddUser = '增加帳號';
    w_Account_EditUser = '編輯帳號';
    w_Account_Password = '密碼';
    w_Account_ConfirmPassword = '確認密碼';
    w_Account_EditPassword = '編輯';
    w_Account_VisitorCannotLogin = '訪客無法登入';

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

    w_Company_ErrorContactNumberNotNumber = 'Please check contact only digits';

    ////////////////// Person List //////////////////
    w_Person_PersonList = '人員列表';
    w_Person_AddStaff = '增加人員';
    w_Person_EditStaff = '編輯人員';
    w_Person_Image = '照片';
    w_Person_Company = '公司';
    w_Person_Building = 'Building';
    w_Person_Floor = 'Floor';
    w_Person_Door = 'Door';
    w_Person_Unit = 'Unit';
    w_Person_Name = '姓名';
    w_Person_Titles = '職位';
    w_Person_Phone = '電話';
    w_Person_Email = 'Email';
    w_Person_Agree_Tc = '是否同意 T&C';
    w_Person_Agree_App = '是否加入 Suntec Rewards';
    w_Person_Remark = 'Remark';
    w_Person_Enable_Permission = '進出權限啟用日';
    w_Person_Disable_Permission = '進出權限過期日';
    w_Person_Card_Number = '卡號';
    w_Person_NRIC = 'NRIC';

    ////////////////// Blacklist List //////////////////
    w_Blacklist_Blacklist = '黑名單列表';
    w_Blacklist_AddBlack = '增加黑名單';
    w_Blacklist_EditBlack = '編輯黑名單';
    w_Blacklist_DelBlack = '刪除黑名單';
    w_Blacklist_Image = '照片';
    w_Blacklist_Name = 'Name';
    w_Blacklist_NRIC = 'NRIC';
    w_Blacklist_Company = '所屬公司';
    w_Blacklist_Reason = '原因';

    ////////////////// Isap FRS //////////////////
    w_Frs_FrList = 'iSAP FR Server 列表';
    w_Frs_AddFr = '增加 iSAP FR Server';
    w_Frs_EditFr = '編輯 iSAP FR Server';
    w_Frs_DelFr = '刪除 iSAP FR Server';
    w_Frs_ViewFr = '預覽 iSAP FR Server';
    w_Frs_Index = 'Index';
    w_Frs_IPAddress = '設備連接 IP 地址';
    w_Frs_HTTPPort = '設備連接 HTTP 埠';
    w_Frs_Device_Name = '設備名稱';
    w_Frs_Position = '設備所在';
    w_Frs_Status = 'FRS 狀態';
    w_Frs_Endpoint = 'Endpoints';

    ////////////////// HikVision FR Tablet //////////////////
    w_Hik_FrList = 'FR Tablet 列表';
    w_Hik_AddFr = '增加 FR Tablet';
    w_Hik_EditFr = '編輯 FR Tablet';
    w_Hik_DelFr = '刪除 FR Tablet';
    w_Hik_ViewFr = '預覽 FR Tablet';
    w_Hik_Index = 'Index';
    w_Hik_IPAddress = 'IP 地址';
    w_Hik_HTTPPort = 'HTTP 埠';
    w_Hik_Device_Name = '設備名稱';
    w_Hik_Position = '設備所在';
    w_Hik_Status = 'Tablet 狀態';
    w_Hik_Endpoint_Name = 'Endpoint Name';

    ////////////////// Suntec Setting //////////////////
    w_Suntec_Suntec = 'Suntec App server';
    w_Suntec_Card_Host = 'Host';
    w_Suntec_Card_Token = 'Token';

    ////////////////// ACS Setting //////////////////
    w_Acs_Card_Range = '卡號範圍';
    w_Acs_Card_Staff = '員工';
    w_Acs_Card_Visitor = '訪客';
    w_Acs_Card_Min = '最小';
    w_Acs_Card_Max = '最大';
    w_Acs_3rd_Acs = '是否使用3rd Party ACS';
    w_Acs_Acs = 'ACS server 設定';
    w_Acs_IPAddress = 'IP地址';
    w_Acs_HTTPPort = 'HTTP埠';
    w_Acs_ServiceName = 'Service Name';
    w_Acs_FingerPrinter = 'Finger Printer';
    w_Acs_AccessGroupName = 'Access Group Name';

    ////////////////// SMTP Setting //////////////////
    w_Smtp_Smtp = 'SMTP 設定';
    w_Smtp_Enable = '啟用';
    w_Smtp_placeholder = '設定測試信箱給 xxx@xxx.com';
    w_Smtp_Test = '測試信箱';

    w_Smtp_Email = 'Email Account';
    w_Smtp_Setting = 'Set Mail Server';

    w_Smtp_Setting_Success = 'Email Server set success.';
    w_Smtp_Setting_Fail = 'Email Server set failed.';
    w_Smtp_Test_Success = 'Email Server test success.';
    w_Smtp_Test_Fail = 'Email Server test failed.';
    w_Smtp_Read_Fail = 'Mail Server read failed.';

    ////////////////// FRS Setting //////////////////
    w_Frs_Setting_FrList = 'FRS 設定';
    w_Frs_Setting_Account = 'Account';
    w_Frs_Setting_Ip = 'IP';
    w_Frs_Setting_Password = 'Password';
    w_Frs_Setting_Port = 'Port';
    w_Frs_Setting_Protocol = 'Protocol';

    ////////////////// VMS Setting //////////////////
    w_Vms_Vms = 'VMS 設定';
    w_Vms_Name = 'Name';
    w_Vms_Protocol = 'Protocol';

    ////////////////// FRS Setting //////////////////
    w_FrsServer_Enable = 'FRS Enable';
    w_FrsServer_Setting = 'Set FRS Server';
    w_FrsServer_Test = 'Test FRS';
    w_FrsServer_Phone = 'Phone Number';
    w_FrsServer_Setting_Success = 'FRS Server set success.';
    w_FrsServer_Setting_Fail = 'FRS Server set failed.';
    w_FrsServer_Setting_Test_Fail = 'FRS Server test failed.';
    w_FrsServer_Setting_Test_Success = 'FRS Server test success.';
    w_FrsServer_Read_Fail = 'FRS Server read failed.';

    ////////////////// Mail Setting //////////////////
    w_MailSetting_Enable = '啟用';
    w_MailSetting_placeholder = '設定測試信箱給 xxx@xxx.com';
    w_MailSetting_Test = '測試信箱';

    w_MailSetting_Setting_Fail = '信箱伺服器設定失敗';
    w_MailSetting_Test_Success = '信箱伺服器設定成功';
    w_MailSetting_Test_EmailSetting = '信箱設定';
    w_MailSetting_Read_Fail = '信箱伺服器讀取失敗';
    w_MailSetting_Read_FailMsg = '伺服器內部錯誤, 請聯絡管理員';

    w_MailSetting_SMTPHostname = 'SMTP主機名稱';
    w_MailSetting_PortNumber = '埠號碼';
    w_MailSetting_Email = '信箱';

    w_MailSetting_EmailSuccess = '信箱設定成功';

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

    w_License_Step1_mac = 'Add by license key and mac';
    w_License_Step1_offline = 'Add by upload offline key';

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

    ////////////////// Logs //////////////////
    w_Logs_List = 'Log List';
    w_Logs_EventType = 'Event Type';
    w_Logs_CreatedAt = 'Event Time';
    w_Logs_SearchCondition = 'Search Condition';
    w_Logs_Summary = 'Summary';
    w_Logs_Owner = 'Owner';
    w_Logs_Entity = 'Entity';
}
