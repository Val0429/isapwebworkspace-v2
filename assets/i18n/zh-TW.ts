import { RegisterLanguage, ILang } from '@/../core/i18n';

@RegisterLanguage("zh-TW", "正體中文")
export default class LangObject implements ILang {
    wb_Login = "登入";
    w_Add = "Add";
    w_Name = "姓名";
    w_Enabled = "有效";
    w_Value = "値";
    w_Startdate = "起始日";
    w_Enddate = "結束日";
    w_Password = "密碼";
    w_Selection = "";
    w_Multi = "";

    w_Username = "使用者名稱";
    w_Roles = "角色";
    w_Email = "Email";
    w_CreatedAt = "建立日期";
    w_UpdatedAt = "編輯日期";
    w_Actions = "";
    w_ConfirmPassword = "確認密碼";

    w_User = "使用者";
    w_UserAdd = "新增使用者";
    w_UserEdit = "編輯使用者";

    m_PasswordShouldBeSame = "兩個密碼必須相同";
    
    w_Logout="登出";

    day0="星期一";
    day1="星期二";
    day2="星期三";
    day3="星期四";
    day4="星期五";
    day5="星期六";
    day6="星期日";

    w_Member="人員";
    w_MemberAdd="新增人員";
    w_MemberEdit="編輯人員";
    memberid="員工工號";
    firstname= "名";
    middlename= "中間名";
    lastname= "姓";
    status= "狀態";
    cardnNum= "卡號";
    createdAt= "建立日期";
    updatedAt= "編輯日期";

    w_Door="門號";
    w_DoorAdd="Add Door";
    w_DoorEdit="Edit Door";
    system="門禁系統";
    doorid="門號ID";
    doorname="門號名稱";
    unlocktime="Unlock Time";
    shunttime="Shunt Time";
    readerin="Reader In";
    readerout="Reader Out";
    

    w_DoorGroup="門號群組";
    w_DoorGroupAdd="新增門號群組";
    w_DoorGroupEdit="編輯門號群組";
    groupid="門號群組ID";
    groupname="門號群組名稱";
    doors = "";

    w_Elevator="電梯";
    w_ElevatorAdd="新增電梯";
    w_ElevatorEdit="編輯電梯";
    elevatorid="電梯ID";
    floor="樓層";

    w_TimeSchedule="時間規格";
    schedule="";
    timeid ="時間規格ID";
    timename="時間規格名稱";

    w_PermissionTable="權限表";
    w_PermissionTableAdd="新增權限表";
    w_PermissionTableEdit="編輯權限表";
    tableid="權限表ID";
    tablename="權限表名稱";

    w_Reader="Reader";
    w_ReaderAdd="Add Reader";
    w_ReaderEdit="Edit Reader";
    readerid="Reader Id";
    readername="Reader Name";

    w_SyncReceiver="Sync Receiver";
    w_SyncReceiverAdd="Add Sync Receiver";
    w_SyncReceiverEdit="Edit Sync Receiver";
    receivename="Receiver Name";
    emailaddress="Email Address";
    receivers="Receivers";

    w_AccessLevel="Access Level";
    w_AccessLevelAdd="Add Access Level";
    w_AccessLevelEdit="Edit Access Level";

    levelid="Level Id";
    levelname="Level Name";
    door="Door";
    reader="Reader";
    timeschedule="Time Schedule";

    PersonalDetails="Personal Details";

    w_Floor="Floor";
    w_FloorAdd="Add Floor";
    w_FloorEdit="Edit Floor";
    name="Name";
    image="Image";

    floorid="Floor Id";    
    ccureid="CCURE Id";
    ccurename="CCURE Name";
    sipassid="SIPASS Id";
    sipassname="SIPASS Name";

}
