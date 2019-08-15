import { RegisterLanguage, ILang } from '@/../core/i18n';

@RegisterLanguage('ja-JP', '日本語')
export default class LangObject implements ILang {
    // Common
    w_Value = '値';
    w_Options = 'Options';
    w_Chooses = 'Choose';
    w_AllChoose = 'All';
    w_Reset = 'Reset';
    w_Back = 'Back';
    w_Submit = 'Submit';
    w_Cancel = 'Cancel';
    w_Success = 'Success';
    w_Error = 'Error';
    w_Failed = 'Failed';
    w_Selection = '選択';
    w_Multi = '複数';
    w_Actions = '動作';
    w_Confirm = 'Confirm';
    w_Cancelled = 'Cancelled';
    w_No = 'No';

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

    // Login & User
    w_Username = '使用者名稱';
    w_Name = '名前';
    w_Password = 'パスワード';
    w_Roles = '權限';
    w_Email = 'Email';
    w_User = '使用者';
    w_UserAdd = '新增使用者';
    w_UserEdit = '修改使用者';
    w_ConfirmPassword = '重複輸入密碼';

    // Error
    w_Error_FailedToFetch = "We can't connect to server, please try again!"; // failed to fetch
    w_Error_ResponseUndefined = "We can't get any response"; // no response
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
