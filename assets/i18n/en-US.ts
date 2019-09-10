import { RegisterLanguage } from '@/../core/i18n';

@RegisterLanguage('en-US', 'English')
export default class LangObject {
    // Navagation
    m_Dashboard = 'Dashboard';
    m_Navagation_Persons = 'Persons';
    m_Navagation_Persons_Person = 'Person';
    m_Navagation_Persons_Stranger = 'Stranger';
    m_Navagation_Users = 'Users Management';
    m_Navagation_Users_Users = 'Users';
    m_Navagation_Users_Groups = 'User Groups';
    m_Navagation_Region = 'Region';
    m_Navagation_Region_Site = 'Site';

    // Card Header
    m_Persons_Person_List = 'Person List';
    m_Persons_Person_Detail = 'Person Detail';
    m_Persons_Person_Work_Station_Record = 'Work Station Record';
    m_Persons_Person_Allow_Into_Site = 'Allow Into Site';
    m_Persons_Person_Enter_Site_Record = 'Enter Site Record';
    m_Persons_Stranger_List = 'Stranger List';
    m_Users_User_List = 'User List';
    m_Users_Group_List = 'Group List';
    m_Region_Site_Search = 'Site Search';
    m_Region_Site_Detail = 'Site Detail';
    m_Users_Add_User = 'Add User';
    m_Users_Edit_User = 'Edit User';
    m_Users_Add_Group = 'Add Group';

    // Common
    w_User = 'User';
    w_Role = 'Role';
    w_Group = 'Group';
    w_Email = 'E-mail';
    w_Confirm_Password = 'Confirm Password';
    w_Name = 'Name';
    w_Type = 'Type';
    w_Title = 'Name';
    w_Picture = 'Picture';
    w_Image = 'Image';
    w_Region = 'Region';
    w_Site = 'Site';
    w_Work_Area = 'Work Area';
    w_Inquire = 'Inquire';
    w_Detail = 'Detail';
    w_Status = 'Status';
    w_Address = 'Address';
    w_Lat = 'Latitude';
    w_Lng = 'Longitude';
    w_Actions = 'Actions';
    w_Number = 'Number';
    w_Card_Number = 'Card Number';
    w_Timestamp = 'Time';
    w_Date = 'Date';
    w_Get = 'Get';
    w_Close = 'Close';
    w_Reason = 'Reason';
    w_Enter = 'Enter';
    w_Leave = 'Leave';
    w_Stay = 'Stay';
    w_Certificate = 'Certificate';
    w_Certificate_Expiry = 'Expiry';
    w_Work_Station = 'Work Station';
    w_Bad_Record = 'Bad Record';
    w_Work_Record = 'Work Record';
    w_Is_Black = 'Black List';
    w_Company = 'Company';
    w_Sorting_By_CreatedAt = 'Sorting by CreatedAt';
    w_Sorting_By_Name = 'Sorting by Name';
    w_Sorting_Asc = 'Asc';
    w_Sorting_Desc = 'Desc';

    // Score
    w_level_1 = 'E';
    w_level_2 = 'D';
    w_level_3 = 'C';
    w_level_4 = 'B';
    w_level_5 = 'A';

    // Status
    w_Status_On = 'On';
    w_Status_Off = 'Off';

    // Warn
    m_Warn_Password = 'Confirm your password';
    m_Warn_Email = 'Confirm your Email';

    // Error
    w_Error_FailedToFetch = "We can't connect to server, please try again!"; // failed to fetch
    w_Error_401 = 'Not find User, Please login again'; // 401
    w_Error_404 = 'API Not Find'; // 404

    // Login
    w_Login_Login = 'Login';
    w_Login_LoginTitle = 'Login';
    w_Login_ForgotPassword = 'Forgot Password';

    // Logout
    w_Logout = 'Logout';

    ////////////////// Navigation //////////////////
    w_Navigation_MyProfile = 'My Profile';
}
