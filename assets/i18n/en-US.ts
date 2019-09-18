import { RegisterLanguage } from '@/../core/i18n';

@RegisterLanguage('en-US', 'English')
export default class LangObject {
    // Common
    w_Value = 'Value';
    w_Options = 'Options';
    w_Chooses = 'Choose';
    w_AllChoose = 'All';
    w_Reset = 'Reset';
    w_Back = 'Back';
    w_Submit = 'Submit';
    w_Cancel = 'Cancel';
    w_Selection = 'Selection';
    w_Multi = 'Multi';
    w_Actions = 'Actions';
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
    w_Error_ResponseUndefined = "We can't get any response"; // no response
    w_Error_401 = 'Not find User, Please login again'; // 401
    w_Error_404 = 'API Not Find'; // 404

    // Login & User
    w_Username = 'User Name';
    w_Name = 'Name';
    w_Password = 'Password';
    w_Roles = 'Role';
    w_Email = 'Email';
    w_User = 'User';
    w_UserAdd = 'Add User';
    w_UserEdit = 'Edit User';
    w_ConfirmPassword = 'Confirm Password';
    w_Login_RememberMe = 'Remember Me';

    // Login
    w_Login_Login = 'Login';
    w_Login_LoginTitle = 'Login';
    w_Login_ForgotPassword = 'Forgot Password';
    w_Login_Error_401 = 'Incorrect username or password';

    // Logout
    w_Logout = 'Logout';

    ////////////////// Navigation //////////////////
    w_Navigation_MyProfile = 'My Profile';
}
