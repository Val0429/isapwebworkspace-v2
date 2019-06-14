import { RegisterLanguage, ILang } from '@/../core/i18n';

@RegisterLanguage("zh-TW", "正體中文")
export default class LangObject implements ILang {
    wb_Login = "Login";
    
    w_Name = "名前";
    w_Enabled = "有効";
    w_Value = "値";
    w_Startdate = "開始日";
    w_Enddate = "終了日";
    w_Password = "密碼";
    w_Selection = "選択";
    w_Multi = "複数";

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
    
    w_Logout="Log out";

    day0="Monday";
    day1="Tuesday";
    day2="Wednesday";
    day3="Thursday";
    day4="Friday";
    day5="Saturday";
    day6="Sunday";

    w_Member="Member";
    w_MemberAdd="Add Member";
    w_MemberEdit="Edit Member";
    memberid="Member Id";
    firstname= "First Name";
    middlename= "Middle Name";
    lastname= "Last Name";
    status= "Status";
    cardnNum= "Card Number";
    createdAt= "Created At";
    updatedAt= "Updated At";

    w_Door="Door";
    system="System";
    doorid="Door Id";
    doorname="Door Name";
    unlocktime="Unlock Time";
    shunttime="Shunt Time";

    w_DoorGroup="Door Group";
    w_DoorGroupAdd="Add Door Group";
    w_DoorGroupEdit="Edit Door Group";
    groupid="Group Id";
    groupname="Group Name";
    doors = "Doors";

    w_Elevator="Elevator";
    w_ElevatorAdd="Add Elevator";
    w_ElevatorEdit="Edit Elevator";
    elevatorid="Elevator Id";
    floor="Floor";

    w_TimeSchedule="Time Schedule";
    schedule="Schedule";
    timeid ="Time Id";
    timename="Time Name";

    w_PermissionTable="Permission Table";
    w_PermissionTableAdd="Add Permission Table";
    w_PermissionTableEdit="Edit Permission Table";
    tableid="Table Id";
    tablename="Table Name";

}
