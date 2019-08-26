import { RegisterLanguage } from '@/../core/i18n';

@RegisterLanguage('en-US', 'English')
export default class LangObject {
    // Navagation
    w_Navagation_Persons = "Persons";
    w_Navagation_Persons_Person = "Person";
    w_Navagation_Persons_Stranger = "Stranger";
    w_Navagation_Users = "Users Management";
    w_Navagation_Users_Users = "Users";
    w_Navagation_Users_Groups = "User Grpous";
    w_Navagation_Region = "Region";
    w_Navagation_Region_Site = "Site";

    // Card Header
    w_Persons_Person_List = "Person List";
    w_Persons_Stranger_List = "Stranger List";
    w_Users_User_List = "User List";
    w_Users_Group_List = "Group List";

    // Common
    w_User = 'User';
    w_Group = 'Group';
    w_Email = 'E-mail';
    w_Confirm_Password = 'Confirm Password';
    w_Name = 'Name';
    w_Type = 'Type';
    w_Title = 'Name';
    w_Picture = 'Picture';

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

    // Dialog
    w_Dialog_ErrorTitle = 'Error';
    w_Dialog_SuccessTitle = 'Success';

    // Date
    w_Startdate = 'Start Date';
    w_Enddate = 'End Date';
    w_CreatedAt = 'Created Date';
    w_UpdatedAt = 'Updated Date';

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
