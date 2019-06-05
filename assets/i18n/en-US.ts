import { RegisterLanguage } from '@/../core/i18n';

@RegisterLanguage("en-US", "English")
export default class LangObject {
    w_Name = "Name";
    w_Enabled = "Enabled";
    w_Value = "Value";
    w_Startdate = "Start Date";
    w_Enddate = "End Date";
    w_Password = "Password";
    w_Selection = "Selection";
    w_Multi = "Multi";

    w_Username = "使用者名稱";
    w_Roles = "權限";
    w_Email = "Email";
    w_CreatedAt = "建立日期";
    w_UpdatedAt = "修改日期";
    w_Actions = "動作";
    w_ConfirmPassword = "重複輸入密碼";

    w_User = "使用者";
    w_UserAdd = "新增使用者";
    w_UserEdit = "修改使用者";

    m_PasswordShouldBeSame = "兩個密碼必須相同";
}
