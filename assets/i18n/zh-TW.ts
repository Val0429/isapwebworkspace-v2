import { RegisterLanguage, ILang } from '@/../core/i18n';

@RegisterLanguage('zh-TW', '正體中文')
export default class LangObject implements ILang {
    // Navagation
    w_Navagation_Persons = "人員管理";
    w_Navagation_Persons_Person = "人員";
    w_Navagation_Persons_Stranger = "陌生人";
    w_Navagation_Users = "使用者管理";
    w_Navagation_Users_Users = "使用者";
    w_Navagation_Users_Groups = "使用者群組";
    w_Navagation_Region = " 區域管理";
    w_Navagation_Region_Site = "工地";

    // Card Header
    w_Persons_Person_List = "人員列表";
    w_Persons_Stranger_List = "陌生人列表";
    w_Users_User_List = "用戶清單";
    w_Users_Group_List = "群組清單";

    // Common
    w_User = '用戶';
    w_Group = '群組';
    w_Email = '電子信箱';
    w_Confirm_Password = '請確認密碼';
    w_Name = '姓名';
    w_Type = '類型';
    w_Title = '名稱';
    w_Picture = '照片';

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
