import { RegisterLanguage, ILang } from '@/../core/i18n';

@RegisterLanguage('zh-TW', '正體中文')
export default class LangObject implements ILang {
    w_Name = '名稱';
    w_Enabled = '有效';
    w_Value = '值';
    w_Startdate = '起始日期';
    w_Enddate = '結束日期';
    w_Password = '密碼';
    w_Selection = '選擇';
    w_Multi = '多選';

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

    // Login
    w_Login_LoginTitle = 'Login';
}
