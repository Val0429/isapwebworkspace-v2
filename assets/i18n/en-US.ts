import { RegisterLanguage } from '@/../core/i18n';

@RegisterLanguage("en-US", "English")
export default class LangObject {
    wb_Login = "Login";

    w_Name = "Name";
    w_Enabled = "Enabled";
    w_Value = "Value";
    w_Startdate = "Start Date";
    w_Enddate = "End Date";
    w_Password = "Password";
    w_Selection = "Selection";
    w_Multi = "Multi";
    
    w_Username = "User Name";
    w_Roles = "Rolese";
    w_Email = "Email";
    w_CreatedAt = "Created At";
    w_UpdatedAt = "Updated At";
    w_Actions = "Action";
    w_ConfirmPassword = "Confirm Password";

    w_User = "User";
    w_UserAdd = "Add User";
    w_UserEdit = "Edit User";

    m_PasswordShouldBeSame = "Password missmatch";

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
    floor="Floor"

    w_TimeSchedule="Time Schedule";
    schedule="Schedule";
    timeid ="Time Id";
    timename="Time Name";

    w_PermissionTable="Permission Table";
    w_PermissionTableAdd="Add Permission Table";
    w_PermissionTableEdit="Edit Permission Table";
    tableid="Table Id";
    tablename="Table Name";
                    
    w_Reader="Reader";
    w_ReaderAdd="Add Reader";
    w_ReaderEdit="Edit Reader";
    readerid="Reader Id";
    readername="Reader Name";
    
}
