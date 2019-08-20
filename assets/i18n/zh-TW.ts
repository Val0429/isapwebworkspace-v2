import { RegisterLanguage, ILang } from '@/../core/i18n';

@RegisterLanguage('zh-TW', '正體中文')
export default class LangObject implements ILang {
    wb_Login = '登入';
    w_Add = '新增';
    w_Name = '姓名';
    w_Enabled = '有效';
    w_Value = '値';
    w_Startdate = '起始日';
    w_Enddate = '結束日';
    w_Password = '密碼';
    w_Selection = '';
    w_Multi = '';
    w_UserPermission="角色權限管理";
    w_UserPermissionAdd="新增角色權限";
    w_UserPermissionEdit="編輯角色權限";
    w_Username = '使用者名稱';
    w_Roles = '角色';    
    w_ApiRoles = "角色";
    w_Email = 'Email';
    w_CreatedAt = '建立日期';
    w_UpdatedAt = '編輯日期';
    w_Actions = '';
    w_ConfirmPassword = '確認密碼';

    w_User = '使用者';
    w_UserAdd = '新增使用者';
    w_UserEdit = '編輯使用者';

    m_PasswordShouldBeSame = '兩個密碼必須相同';

    w_Logout = '登出';

    day0 = '星期一';
    day1 = '星期二';
    day2 = '星期三';
    day3 = '星期四';
    day4 = '星期五';
    day5 = '星期六';
    day6 = '星期日';

    w_Member = '人員';
    w_MemberAdd = '新增人員';
    w_MemberEdit = '編輯人員';
    memberid = '員工工號';
    firstname = '名';
    middlename = '中間名';
    lastname = '姓';
    status = '狀態';
    cardnNum = '卡號';
    createdAt = '建立日期';
    updatedAt = '編輯日期';

    w_Door = '出入口';
    w_DoorAdd = '新增出入口';
    w_DoorEdit = '編輯出入口';
    system = '門禁系統';
    doorid = '出入口ID';
    doorname = '出入口名稱';
    unlocktime = 'Unlock Time';
    shunttime = 'Shunt Time';
    readerin = '讀卡機_進';
    readerout = '讀卡機_出';

    w_DoorGroup = '出入口群組';
    w_DoorGroupAdd = '新增出入口群組';
    w_DoorGroupEdit = '編輯出入口群組';
    groupid = '出入口群組ID';
    groupname = '出入口群組名稱';
    doors = '出入口';
    doorscount = '出入口數量';
    readerscount = '讀卡機數量';

    w_Elevator = '電梯';
    w_ElevatorAdd = '新增電梯';
    w_ElevatorEdit = '編輯電梯';
    elevatorid = '電梯ID';
    floor = '樓層';

    w_TimeSchedule = '時間規格';
    schedule = '';
    timeid = '時間規格ID';
    timename = '時間規格名稱';
    permissionTable = '門禁組';
    w_PermissionTable = '門禁組';
    w_PermissionTableAdd = '新增門禁組';
    w_PermissionTableEdit = '編輯門禁組';
    tableid = '門禁組 ID';
    tablename = '門禁組名稱';

    w_Reader = '讀卡機';
    w_ReaderAdd = '新增讀卡機';
    w_ReaderEdit = '編輯讀卡機';
    readerid = '讀卡機 ID';
    readername = '讀卡機名稱';

    w_SyncReceiver = '人事同步通知人員';
    w_SyncReceiverAdd = '新增人事同步通知人員';
    w_SyncReceiverEdit = '編輯人事同步通知人員';
    receivename = '姓名';
    emailaddress = 'Email';
    receivers = 'Receivers';

    w_AccessLevel = '門禁級別';
    w_AccessLevelAdd = '新增門禁級別';
    w_AccessLevelEdit = '編輯門禁級別';

    levelid = '門禁級別 ID';
    levelname = '門禁級別名稱';
    door = '出入口';
    reader = '讀卡機';
    timeschedule = '時間表';

    PersonalDetails = '人員詳細資訊';

    w_Floor = '樓層';
    w_FloorAdd = '新增樓層';
    w_FloorEdit = '編輯樓層';
    name = '名稱';
    image = 'Image';

    floorid = '樓層 ID';
    ccureid = 'CCURE Id';
    ccurename = 'CCURE Name';
    sipassid = 'SIPASS Id';
    sipassname = 'SIPASS Name';

    w_ElevatorGroup = '電梯群組';
    w_ElevatorGroupAdd = '新增電梯群組';
    w_ElevatorGroupEdit = '編輯電梯群組';
    elevators = '電梯';

    // User
    w_User_UserList = '使用者列表';
    w_User_AddUser = '新增使用者';
    w_User_EditUser = '編輯使用者';
    w_User_ViewUser = '檢視使用者';
    w_User_ID = '使用者 ID';
    w_User_FullName = '使用者姓名';
    w_User_Group = '角色';
    w_User_UserGroup = '使用者角色';
    w_User_UserGroup_Admin = 'Admin';
    w_User_UserGroup_User = 'User';
    w_User_Role = '角色';
    w_User_AppInstalled = 'App Installed';
    w_User_TestEmail = 'Test Email';
    w_User_AddUserSuccess = '新增使用者成功';
    w_User_AddUserFailed = '新增使用者失敗';
    w_User_EditUserSuccess = '編輯使用者成功';
    w_User_EditUserFailed = '編輯使用者失敗';
    w_User_DeleteConfirm = '你確定要刪除已選擇的使用者？';

    // UserGroup
    w_UserGroup_UserGroupList = '角色列表';
    w_UserGroup_AddGroup = '新增角色';
    w_UserGroup_EditGroup = '編輯角色';
    w_UserGroup_ViewGroup = '檢視角色';
    w_UserGroup_GroupName = '角色名稱';
    w_UserGroup_Users = '使用者';
    w_UserGroup_AddUserGroupSuccess = '新增角色成功';
    w_UserGroup_AddUserGroupFailed = '新增角色失敗';
    w_UserGroup_EditUserGroupSuccess = '編輯角色成功';
    w_UserGroup_EditUserGroupFailed = '編輯角色失敗';
    w_UserGroup_DeleteConfirm = '你確定要刪除已選擇的角色？';

    // many page
    w_Account = '帳號';
    w_PasswordConfirm = '確認密碼';
    w_Protocol = 'Protocol';
    w_Ip = 'Ip';
    w_Port = 'Port';
    w_URL = 'URL';
    w_Host = 'Host';
    w_Phone = 'Phone';
    w_ManagedSites = 'Managed sites';
    w_Description = 'Description';
    w_Sites = 'Site(s)';
    w_Site = '站點';
    w_Regions = '地區';
    w_PreviousPassword = '舊密碼';
    w_CurrentPassword = '新密碼';
    w_CurrentPasswordConfirm = '確認新密碼';
    w_Longitude = '經度';
    w_Latitude = '緯度';
    w_DeviceID = 'Device ID';
    w_ServerName = 'Server Name';
    w_IPAddress = 'IP Address';
    w_Selected = '已選擇';
    w_RegionTreeSelect = 'Region Tree Select';
    w_SiteTreeSelect = 'Site Tree Select';
    w_Brand = 'Brand';
    w_Model = 'Model';
    w_DeviceName = '裝置名稱';
    w_DeviceGroups = 'Device Group(s)';
    w_Hanwha = 'Hanwha';
    w_iSapFRS = 'FRS';
    w_iSapFRSServer = 'FRS Server';
    w_iSapFRSManager = 'FRS Manager';
    w_iSapFRSManagerServer = 'FRS Manager ';
    w_In = '進';
    w_Out = '出';
    w_Direction = 'Direction';
    w_ServerId = 'Server Id';
    w_SourceId = 'Source Id';
    w_SourceIdAndLocation = 'Source Id and Location';
    w_Location = 'Location';

    w_Port_PlaceHolder = 'Port , 1~65535';
    w_Email_Placeholder = 'ex : admin@isap.com';
    w_Phone_Placeholder = 'ex : +xxxxxxxxxx';

    w_iSap_Use = 'Use iSap Server';
    w_SetFRS = 'Not yet set? Go to set FRS Server';
    w_SetFRSManger = 'Not yet set? Go to set FRS Manger Server';

    w_Error_Port = 'Port 範圍應在 1~65535 之間';
    w_Error_Password = '密碼需一致';
    w_ErrorLongitude = '經度範圍應在 -180~180 之間';
    w_ErrorLatitude = '緯度範圍應在 -90~90 之間';
    w_ErrorReadData = '讀取資料失敗，請再試一次';
    w_ErrorRecognize = '辨識失敗，請再試一次';

    w_SelectSiteTree = 'Select site tree';
    w_SelectRegionTree = 'Select region tree';

    // Dialog
    w_Dialog_ErrorTitle = '錯誤';
    w_Dialog_SuccessTitle = '成功';

    // common
    w_Interval="間隔";
    w_ColumnSelection ="Column Selection";
    w_Filter = "搜尋";
    w_Error = '錯誤';
    w_NextPage = '下一步';
    w_PreviousPage = '上一步';
    w_Clear = 'Clear';
    w_Unlink = 'Unlink';
    w_Search = '搜尋';
    w_No = 'No';
    w_Edit = 'Edit';
    w_View = 'View';
    w_Sliders = 'Sliders';
    w_Map = '地圖';
    w_Area = '區域';
    w_Device = '裝置';
    w_DeviceGroup = 'Device Group';
    w_EditMyProfile = 'Edit My Profile';
    w_ChangePassword = '修改密碼';
    w_ForgetPassword = '忘記密碼';
    w_DeleteConfirm = 'Delete Confirm';
    w_UnlinkConfirm = 'Unlink Confirm';
    m_PermanentlyDeleteSelectedItem = 'Permanently delete {count} selected Item?';
    w_RemoveConfirm = 'Remove Confirm';
    m_PermanentlyRemoveSelectedItem = 'Permanently remove {count} selected Item?';
    w_NoItemSelected = '未選擇任何選項';
    w_Success = '成功';
    w_DeleteFailed = '刪除失敗';
    w_LogoutSuccess = '登出失敗';
    w_Id = 'Id';
    w_Switch = 'Switch';
    w_To = 'To';
    w_StepBackward = 'Step Backward';
    w_ROIClear = 'ROI Clear';
    w_Upload_Fail = '上傳失敗';
    w_Duplicate = '重複';
    w_Snapshot = 'Snapshot';
    w_Gender = '性別';
    w_Age = 'Age Range';
    w_Options = '可用選項';
    w_Chooses = '已選擇';
    w_AllChoose = '全選';
    w_Select = '請選擇';

    // date
    w_Week_0 = '星期日';
    w_Week_1 = '星期一';
    w_Week_2 = '星期二';
    w_Week_3 = '星期三';
    w_Week_4 = '星期四';
    w_Week_5 = '星期五';
    w_Week_6 = '星期六';
    w_Week_7 = '星期日';
    w_Week_Unknow = 'Unknow';

    // Mail Server
    w_MailServer_Email = 'Email 帳號';
    w_MailServer_Enable = 'Mail Server Enable';
    w_MailServer_Setting = '設定 Mail Server';
    w_MailServer_Test = 'Test Email';

    w_MailServer_Setting_Success = '設定 Email Server 成功';
    w_MailServer_Setting_Fail = '設定 Email Server 失敗';
    w_MailServer_Test_Success = '測試 Email Server 成功';
    w_MailServer_Test_Fail = '測試 Email Server 失敗';
    w_MailServer_Read_Fail = '讀取 Email Server 失敗';

    // LocationRegion
    w_Region_Map = '地圖';
    w_Region_CardTitle = '地區';
    w_Region_ButtonDeleteConfirm = '刪除';
    w_Region_DeleteConfrimTitle = '刪除';
    w_Region_DeleteConfrimContent = '你確定要刪除已選擇的地區？';
    w_Region_AddRegionTitle = '新增地區';

    w_Region_AddSameLayerRegion = 'Add Same Layer';
    w_Region_AddNextLayerRegion = 'Add Next Layer';
    w_Region_BindingSite = 'Binding Site';
    w_Region_BackToTree = 'Back';

    w_Region_Name = '名稱';
    w_Region_Address = '地址';
    w_Region_CustomId = 'ID';
    w_Region_Photo = '照片';
    w_Region_Image = 'Floor plan';
    w_Region_Location = 'Location';
    w_Region_Lat = '經度';
    w_Region_Lng = '緯度';
    w_Region_Tags = 'Tag';
    w_Region_Level = 'Level';
    w_Region_LevelRegion = '地區';
    w_Region_LevelSite = '站點';
    w_Region_LevelArea = '區域';
    w_Region_Sites = 'Sites';

    w_Region_NamePlaceholder = '請輸入姓名';
    w_Region_AddressPlaceholder = '請輸入地址';
    w_Region_CustomIdPlaceholder = 'Please input ID';
    w_Region_PhotoPlaceholder = '請上傳照片';
    w_Region_ImagePlaceholder = 'Please upload floor plan';
    w_Region_LatPlaceholder = '請輸入經度';
    w_Region_LngPlaceholder = '請輸入緯度';
    w_Region_TagsPlaceholder = 'Please choose tag';
    w_Region_LevelPlaceholder = 'Please choose level';
    w_Region_SitesPlaceholder = '請選擇站點';

    w_Region_ErrorLongitude = '經度範圍應在 -180~180 之間';
    w_Region_ErrorLatitude = '緯度範圍應在 -90~90 之間';
    w_Region_ErrorNoSiteBeBinding = '無可綁定站點';
    w_Region_ErrorFileToLarge = '照片檔案最大不能超過 7MB';

    // Site
    w_Site_SiteID = '站點 ID';
    w_Site_SiteName = '站點名稱';
    w_Site_AreaName = '區域名稱';
    w_Site_GroupName = 'Device Group Name';
    w_Site_DeviceName = '裝置名稱';
    w_Site_DeviceType = '裝置類型';
    w_Site_Address = '地址';
    w_Site_Establishment = 'Establishment';
    w_Site_PhoneNumber = 'Phone Number';
    w_Site_SquareMeter = 'Square Meter';
    w_Site_Manager = 'Manager';
    w_Site_StaffNumber = 'Staff Number';
    w_Site_OfficeHour = 'Office Hour';
    w_Site_Area = '區域';
    w_Site_Tag = 'Tag';
    w_Site_Devices = 'Devices';
    w_Site_DeviceGroup = 'Device Group';
    w_Site_Model = 'Model';
    w_Site_Photo = '照片';
    w_Site_MapPhoto = '地圖照片';
    w_Site_Longitude = '經度';
    w_Site_Latitude = '緯度';
    w_Site_Longitude_Range = '經度範圍應在-180~180之間';
    w_Site_Latitude_Range = '緯度範圍應在-90~90之間';
    w_Site_Mapping = 'Mapping';
    w_Site_SiteList = '站點列表';
    w_Site_ViewSite = '檢視站點';
    w_Site_AddSite = '新增站點';
    w_Site_EditSite = '編輯站點';
    w_Site_AreaList = '區域列表';
    w_Site_ViewArea = '檢視區域';
    w_Site_AddArea = '新增區域';
    w_Site_EditArea = '編輯區域';
    w_Site_DeviceGroupList = 'Device Group List';
    w_Site_ViewDevice = 'View Device';
    w_Site_AddDevice = 'Add Device';
    w_Site_EditDevice = 'Edit Device';
    w_Site_AddSiteSuccess = '新增站點成功';
    w_Site_AddSiteFailed = '新增站點失敗';
    w_Site_EditSiteSuccess = '編輯站點成功';
    w_Site_EditSiteFailed = '編輯站點失敗';
    w_Site_AddAreaSuccess = '新增區域成功';
    w_Site_AddAreaFailed = '新增區域失敗';
    w_Site_EditAreaSuccess = '編輯區域成功';
    w_Site_EditAreaFailed = '編輯區域失敗';
    w_Site_AddDeviceGroupSuccess = 'Add Device Group Success';
    w_Site_AddDeviceGroupFailed = 'Add Device Group Failed';
    w_Site_EditDeviceGroupSuccess = 'Edit Device Group Success';
    w_Site_EditDeviceGroupFailed = 'Edit Device Group Failed';

    // Permission
    w_Permission_PermissionManage = '門禁組管理';
    w_Permission_PermissionList = '門禁組列表';
    w_Permission_PermissionAdd = '新增門禁組';
    w_Permission_PermissionEdit = '編輯門禁組';
    w_Permission_PermissionView = '檢視門禁組';
    w_Permission_PermissionName = '門禁組名稱';
    w_Permission_DeviceType = '裝置類型';
    w_Permission_DeviceName = '裝置名稱';
    w_Permission_DeviceArea = '裝置區域';
    w_Permission_DeviceTimeFormat = '時間格式';
    w_Permission_Door = '出入口名稱';
    w_Permission_Elevator = '電梯名稱';
    w_Permission_DoorGroup = '門組名稱';
    w_Permission_DoorAdd = '新增門號';
    w_Permission_ElevatorAdd = '新增電梯';
    w_Permission_DoorGroupAdd = '新增出入口群組';

    // button
    w_Save = '儲存';
    w_Back = '返回';
    w_Cancel = '取消';
    w_Send = '發送';
    w_Leave = 'Leave';
    w_Test = 'Test';
    w_Check = 'Check';
    w_Submit = '送出';
    w_Confirm = '確認';
    w_Upload = '上傳';
    w_Restart = 'Restart';
    w_Reset = '清空';
    w_Delete = '刪除';
    w_ViewData = 'View Device Data';
    readerIO = 'Reader I/O';

    // Member
    w_Navigation_Users = 'Users';
    w_Navigation_Users_User = 'User';
    w_Navigation_Users_UserGroup = 'User Group';
    w_Navigation_Site = '站點';
    w_Navigation_Region = '地區';

    

    w_AttendanceReport = '差勤紀錄查詢';
    w_DoorReport = '門號報表';
    w_DoorGroupReport= '門號群組';
    w_CardExpirationReport = '證卡到期查詢';
    w_ContractorReport = "契約商報表";    
    w_DemographicReport = "人口統計報表";
    w_EmployeeReport = '人員報表';
    w_VisitorCardReport = '訪客卡號紀錄';
    

    w_Report_DateStart="起始日期";
    w_Report_DateEnd="結束日期";
    w_Report_StartTime = "起始時間";
    w_Report_DoorNumberStart ="起始門號";
    w_Report_EndTime ="日終時間";
    w_Report_DoorNumberEnd="日終門號";
    w_Report_WorkTime = "工作時長";
    w_Report_DateOccurred = "出勤日期";
    w_Report_InOutDailyCount = "總進出天數";

    w_Report_Month1 = "近三個月進出天數";
    w_Report_Month2 = "近二個月進出天數";
    w_Report_Month3 = "近一個月進出天數";

    w_Area_Count = "區域數量";
    w_DoorGroup_Count = "門號群組數量";
    w_Door_Count = "門號數量";
    w_Reader_Count = "讀卡機數量";
    w_Region = "地區名稱";

    w_Permission="系統權限";
    w_Setting="設定";    
    w_Report="報表";

    w_License="憑證";
    w_License_List = '憑證列表';
    w_License_Add = '新增憑證';
    w_License_LicenseKey = '憑證金鑰';
    w_License_Mac = 'MAC位址';
    w_License_productName = '產品名稱';
    w_License_Quantity = '數量';
    w_License_Trial = '試用';
    w_License_RegisterDate = '註冊日';
    w_License_ExpireDate = '到期日';
    w_License_License_Key = '憑證金鑰';
    w_License_UploadOfflineKey = '離線上傳憑證金鑰';
    w_License_UploadOfflineKey1 = '* Upload offline key';

    w_License_License_KeyPlaceholder = '憑證金鑰請輸入25位英數字。格式範例：xxxxx-xxxxx-xxxxx-xxxxx-xxxxx';

    w_License_Setting_Success = '憑證設定成功';
    w_License_Setting_Fail = '憑證設定失敗';

    w_License_Step1_mac = '新增憑證金鑰及MAC位址';
    w_License_Step1_offline = '離線上傳憑證金鑰';

    w_Manual_Sync = "手動同步";
    w_Not_Selected = "不限";
    w_RedirectToLoginMessage = "因閒置過久已被登出，請重新登入";
    w_QueryPermission = "許可表查詢";
    w_Member_Count = "人員數量";
    w_Number = "序號";
    w_Error_PleaseContactAdmin = "請聯絡系統管理員";

    w_DeviceType = "裝置類型";
                
    w_DeviceArea="裝置區域";
    w_TimeFormat = "時間格式";
    w_Action="行動";

    w_Error_DuplicateCardNumber="重複卡號";
    w_Error_DuplicateEmployeeNumber="重複工號";
    w_DeviceAreaOrFloor = "裝置區域 / 樓層";
    w_Error_AccessLevelIsNotInCCure = "請先至CCure800建立相同權限許可表";

    w_FloorGroup="樓層群組";
    w_FloorGroupAdd="新增樓層群組";
    w_FloorGroupEdit="編輯樓層群組";

    user_Permission_CRUD="編輯角色權限";
    user_Management_CRUD="編輯使用者";
    report_door_R="查詢門號報表";
    report_member_R="查詢人員報表";
    report_doorgroup_R="查詢門號群組報表";
    report_card_R="查詢證卡到期";
    report_contractor_R="查詢契約商報表";
    report_demographic_R="查詢人口統計報表";
    report_attendance_R="查詢差勤紀錄";
    report_visitor_R="查詢訪客卡號紀錄";
    door_permissiontable_CRUD="編輯門禁權限";
    door_member_CRUD="編輯人員";
    door_doorgroup_CRUD="編輯出入口群組";
    door_door_CRUD="編輯出入口";
    door_reader_CRUD="查詢讀卡機";
    door_elevatorgroup_CRUD="編輯電梯群組";
    door_elevator_CRUD="編輯電梯";
    door_floor_CRUD="查詢樓層";
    door_floorgroup_CRUD="編輯樓層群組";
    notification_sync_CRUD="編輯人事同步通知人員";
    door_accesslevel_CRUD="door_accesslevel_CRUD";
    system_hurmanresource_CRUD="編輯系統設定";
    system_license_CRUD="編輯憑證設定";
    system_operationlog_R="查詢系統操作紀錄";

    w_SystemLog="系統日誌";
    w_log_message="日誌內容";
    w_log_title="日誌標題";
    w_log_date="日期";
    w_log_time="時間";
    w_MemberFields="使用者帳號";

    
    w_Member_DeleteConfirm = '你確定要刪除已選擇人員？';
    w_Member_EditFailed = '編輯人員失敗';
    w_Member_AddFailed = '新增人員失敗';
    w_Member_ErrorUploadFile = '上傳失敗';
    w_Member_Other = '其他';
    w_Member_List = '人員管理';
    w_Member_Add = '新增人員資訊';
    w_Member_Edit = '編輯人員資訊';
    w_Member_View = '查看人員資訊';

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
    
    w_Settings = "系統設定";
    sipassdb="SiPass 資料庫";
    smtp="SMTP";
    ccuresqlserver="ccuresqlserver";
    sipassconnect="SiPass 連線資訊";
    ccureconnect= "CCure 連線資訊";

    w_Error_DuplicatePermissionTable="門禁組名稱已存在，請使用其他名稱";
    cannotGetTokenFromSipass="無法連線至SiPass，請稍待一分鐘後重試";
    accessLevelIsNotInSipass="SiPass無此門禁點";
    w_Error_AccessLevelIsNotInAcs="於中介平台上建立的門禁組無此門禁";
    importResult="匯入結果";
    w_Error_LoginFailed="登入失敗";
    w_Import_RecordCount="匯入資料筆數";
    humanresource="人事系統設定";
}
