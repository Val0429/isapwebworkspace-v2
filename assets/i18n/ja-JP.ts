import { RegisterLanguage, ILang } from '@/../core/i18n';

@RegisterLanguage('ja-JP', '日本語')
export default class LangObject implements ILang {
    w_Name = '名前';
    w_Enabled = '有効';
    w_Value = '値';
    w_Startdate = '開始日';
    w_Enddate = '終了日';
    w_Password = 'パスワード';
    w_Selection = '選択';
    w_Multi = '複数';

    w_Username = '使用者名稱';
    w_Roles = '權限';
    w_Email = 'Email';
    w_CreatedAt = '建立日期';
    w_UpdatedAt = '修改日期';
    w_Actions = '動作';
    w_ConfirmPassword = '重複輸入密碼';

    w_User = '使用者';
    w_UserAdd = '新增使用者';
    w_UserEdit = '修改使用者';

    m_PasswordShouldBeSame = '兩個密碼必須相同';

    // button
    w_Save = 'Save';
    w_Back = 'Back';

    // image map
    w_ImageMap_DataWindowMainTitle = 'Data Window';
    w_ImageMap_DataWindowInTitle = 'Traffic In';
    w_ImageMap_DataWindowOutTitle = 'Traffic Out';
    w_ImageMap_DataWindowInMOutTitle = 'Net Traffic';
    w_ImageMap_DataWindowTotalTitle = 'Accumulated Traffic';
    w_ImageMap_DataWindowHrAgoTitle = '1 Hr Ago';
    w_ImageMap_DataWindowNowTitle = 'Now';
    w_ImageMap_CardTitle = 'Setup Dashboard';
    w_ImageMap_DeviceTagLabelTitle = 'Device group';
    w_ImageMap_DeviceGroupTagLabelTitle = 'Device';

    // Login
    w_Login_LoginTitle = 'Login';
    w_Login_ForgotPassword = 'Forgot password';
    w_Login_SignUpTitle = 'Sign up';
    w_Login_SignUpContent = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    w_Login_Register = 'Register Now';
}
