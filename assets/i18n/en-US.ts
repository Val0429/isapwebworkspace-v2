import { RegisterLanguage } from '@/../core/i18n';

@RegisterLanguage('en-US', 'English')
export default class LangObject {
    w_Name = 'Name';
    w_Enabled = 'Enabled';
    w_Value = 'Value';
    w_Startdate = 'Start Date';
    w_Enddate = 'End Date';
    w_Password = 'Password';
    w_Selection = 'Selection';
    w_Multi = 'Multi';

    w_Username = 'User name';
    w_Roles = 'Roles';
    w_Email = 'Email';
    w_CreatedAt = 'Created Date';
    w_UpdatedAt = 'Updated Date';
    w_Actions = 'Actions';
    w_ConfirmPassword = 'Confirm Password';

    w_User = 'User';
    w_UserAdd = 'Add User';
    w_UserEdit = 'Edit User';

    m_PasswordShouldBeSame = 'Both password should same';

    /////////////////////////////////////////////

    w_Options = 'Options';
    w_Chooses = 'Choose';

    w_AllChoose = 'All';
    w_Reset = 'Reset';
    w_Back = 'Back';
    w_Submit = 'Submit';

    /////////////////////////////////////////////

    // Login
    w_Login_LoginTitle = 'Login';
    w_Login_ForgotPassword = 'Forgot Password';

    // Logout
    w_Logout = 'Logout';

    // failed to fetch
    w_FailedToFetch = "We can't connect to server, please try again!";

    // 401
    w_UserSession_Empty = 'Not find User, Please login again';

    ////////////////// Navigation //////////////////

    w_Navigation_MyProfile = 'My Profile';

    w_Navigation_Reports = 'Report';
    w_Navigation_Reports_Dashboard = 'Dashboard';
    w_Navigation_Reports_Investigation = 'Investigation';

    w_Navigation_Setups = 'Setup';
    w_Navigation_Setups_Floor = 'Floor Managerment';
    w_Navigation_Setups_Company = 'Company Management';
    w_Navigation_Setups_Account = 'Account Managerment';
    w_Navigation_Setups_Kiosk = 'Kiosk Managerment';
    w_Navigation_Setups_License = 'License';
    w_Navigation_Setups_FRS = 'FRS Setting';
    w_Navigation_Setups_Email = 'Email Setting';
    w_Navigation_Setups_SMS = 'SMS Setting';
    w_Navigation_Setups_SMSOnline = 'Online SMS Provider (SG only)';
    w_Navigation_Setups_VisitorCard = 'Visitor Card';

    w_Navigation_Tenants = 'Tenant';
    w_Navigation_Tenants_Invitation = 'Invitation';
    w_Navigation_Tenants_Visitor = 'Visitor';
}
