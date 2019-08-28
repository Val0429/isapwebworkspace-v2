import { RegisterLanguage } from '@/../core/i18n';

@RegisterLanguage('zh-TW', '正體中文')
export default class LangObject {
    // Navagation
    m_Dashboard = "Dashboard";
    m_Navagation_Persons = "人員管理";
    m_Navagation_Persons_Person = "人員";
    m_Navagation_Persons_Stranger = "陌生人";
    m_Navagation_Users = "使用者管理";
    m_Navagation_Users_Users = "使用者";
    m_Navagation_Users_Groups = "使用者群組";
    m_Navagation_Region = " 區域管理";
    m_Navagation_Region_Site = "工地";

    // Card Header
    m_Persons_Person_List = "人員列表";
    m_Persons_Stranger_List = "陌生人列表";
    m_Users_User_List = "用戶清單";
    m_Users_Group_List = "群組清單";
    m_Region_Site_Search = "工地查詢";
    m_Region_Site_Detail = "工地細節";
    m_Users_Add_User = "新增用戶";
    m_Users_Edit_User = "修改用戶";
    m_Users_Add_Group = "新增群組";

    // Common
    w_User = '用戶';
    w_Group = '群組';
    w_Email = '電子信箱';
    w_Confirm_Password = '請確認密碼';
    w_Name = '姓名';
    w_Type = '類型';
    w_Title = '名稱';
    w_Picture = '照片';
    w_Image = '圖片';
    w_Region = '區域';
    w_Site = '工地';
    w_Work_Area = '工區';
    w_Inquire = '查詢';
    w_Detail = '細節';
    w_Status = '狀態';
    w_Address = '地址';
    w_Lat = '經度';
    w_Lng = '緯度';
    w_Actions = '檢視';
    w_Number = '編號';
    w_Card_Number = '卡號';
    w_Timestamp = '時間';

    // Status
    w_Status_On = '開啟';
    w_Status_Off = '關閉';

    // Date
    w_Startdate = '開始日';
    w_Enddate = '終了日';
    w_CreatedAt = '建立日期';
    w_UpdatedAt = '修改日期';

    // Dialog
    w_Dialog_ErrorTitle = 'Error';
    w_Dialog_SuccessTitle = 'Success';

    // Error
    w_Error_FailedToFetch = "We can't connect to server, please try again!"; // failed to fetch
    w_Error_401 = 'Not find User, Please login again'; // 401
    w_Error_404 = 'API Not Find'; // 404

    // Login
    w_Login_Login = '登入';
    w_Login_LoginTitle = '登入';
    w_Login_ForgotPassword = '忘記密碼';

    // Logout
    w_Logout = 'Logout';

    ////////////////// Navigation //////////////////
    w_Navigation_MyProfile = 'My Profile';
}
