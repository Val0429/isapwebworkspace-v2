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
    w_Upload = 'Upload';

    w_Username = 'User name';
    w_Roles = 'Role';
    w_Email = 'Email';
    w_CreatedAt = 'Created date';
    w_UpdatedAt = 'Updated date';
    w_Actions = 'Actions';
    w_ConfirmPassword = 'Confirm password';

    w_User = 'User';
    w_UserAdd = 'Add user';
    w_UserEdit = 'Edit user';

    m_PasswordShouldBeSame = 'Password should be same';

    /////////////////////////////////////////////

    w_Options = 'Options';
    w_Chooses = 'Choose';
    w_AllChoose = 'All';
    w_Reset = 'Reset';
    w_Back = 'Back';
    w_Submit = 'Submit';
    w_Confirm = 'Confirm';
    w_Cancel = 'Cancel';
    w_Dialog_SuccessTitle = 'Success';
    w_Dialog_ErrorTitle = 'Error';

    /////////////////////////////////////////////

    w_Error_FileToLarge = 'File to large';

    /////////////////////////////////////////////

    // Login
    w_Login_LoginTitle = 'Login';
    w_Login_ForgotPassword = 'Forgot password';

    // failed to fetch
    w_FailedToFetch = "We can't connect to server, please try again!";
    w_ErrorResponseUndefined = "Can't get server response";

    // 401
    w_UserSession_Empty = 'Not find User, Please login again';

    /////////////////////////////////////////////

    w_Navigation_Dashboard = 'Dashboard';

    w_Navigation_Invitation = 'Invitation';

    w_Navigation_GeneralSettings = 'General Settings';
    w_Navigation_GeneralSettings_Background = 'Background';
    w_Navigation_GeneralSettings_RemoveWorker = 'Remove Worker';

    // Invitation
    // Search Condition
    w_Invitation_SearchCondition = 'Search Condition';
    w_Invitation_DateFrom = 'Date From';
    w_Invitation_DateTo = 'Date To';
    w_Invitation_PTWStatus = 'PTW Status';
    w_Invitation_PTWID = 'PTW ID';
    w_Invitation_Email = 'Email';
    w_Invitation_Email_Placeholder = 'ex : admin@isap.com';
    w_Invitation_Tenant = 'Tenant';
    w_Invitation_WorkCategory = 'Work Category';
    w_Invitation_WorkType = 'Work Type';
    w_Invitation_Unit = 'Unit #';
    w_Invitation_ContactPerson = 'Contact Person';
    w_Invitation_Contractor = 'Contractor';
    w_Invitation_WorkersName = 'Worker’s Name';

    w_Invitation_Search = 'Search';
    w_Invitation_ExportData = 'Export Data';

    w_Invitation_List = 'Invitation List';
    w_No = 'No';
    w_Invitation_StartDate = 'Start Date';
    w_Invitation_EndDate = 'End Date';
    w_Invitation_ContractorCompany = 'Contractor Company';

    w_Invitation_Approved = 'Approved';
    w_Invitation_PendingApproved = 'Pending Approved';
    w_Invitation_Rejected = 'Rejected';

    w_Invitation_DateError = 'End date must greater or equal than start date';
    w_Invitation_EmailError = 'Email format wrong';

    w_Invitation_CompanyAddPTW = 'Add PTW';
    w_Invitation_CompanyEmail = 'Company Email';
    w_Invitation_WorkDescription = 'Work Description';

    /////////////////////// General Settings //////////////////////

    w_GeneralSettings_RemoveWorkerDaysCardTitle = 'Remove worker data days';
    w_GeneralSettings_RemoveWorkerDaysFormLabel = 'Remove Worker Data from Days';
}
