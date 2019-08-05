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

    ////////////////// Common //////////////////
    w_ThisMonth = 'This Month';
    w_ThisWeek = 'This Week';
    w_Today = 'Today';

    w_Options = 'Options';
    w_Chooses = 'Choose';

    w_AllChoose = 'All';
    w_Reset = 'Reset';
    w_Back = 'Back';
    w_Submit = 'Submit';

    w_Confirm = 'Confirm';
    w_Cancel = 'Cancel';

    w_Dialog_ErrorTitle = 'Error';
    w_Dialog_SuccessTitle = 'Success';

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

    w_Navigation_About = 'About';

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

    ////////////////// Dashboard //////////////////
    w_Dashboard_VisitorOnSite = 'Visitor On Site';
    w_Dashboard_dailyTotalVisitor = 'Daily Total Visitor';

    w_Dashboard_ChartStatisticTitle = 'Check In Statistic';
    w_Dashboard_ChartRecurringTitle = 'Recurring Visitor';

    w_Dashboard_ChartStatisticSuccess = 'Success';
    w_Dashboard_ChartStatisticException = 'Exception';

    ////////////////// User //////////////////
    w_User_UserName = 'User Name';
    w_User_CompanyName = 'Company Name';
    w_User_Email = 'Email';
    w_User_FloorName = 'Floor Name';

    ////////////////// MyProfile //////////////////
    w_MyProfile_ViewMyProfile = "My Profile";
    w_MyProfile_ChangePassword = "Change Password";
    w_MyProfile_ChangePasswordSuccess="Change Password Success";
    w_MyProfile_ChangePasswordFailed="Change Password Failed";
    w_MyProfile_OldPassword="Old Password";
    w_MyProfile_NewPassword="New Password";
    w_MyProfile_ConfirmPassword="Confirm Password";
    w_MyProfile_ErrorPasswordNotSame="New Password and Confirm is different"

    ////////////////// About //////////////////
    w_About_About = "About";
    w_About_SystemTitle = "Visitor Management Service";
    w_About_Copyright = "Copyright iSAP Solution";
    w_About_ServerVersion = "Server Version";
    w_About_FrameworkVersion = "Framework Version";
    w_About_WebClientVersion = "Web Client Version";



}
