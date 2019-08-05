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

    /////////////////////// Invitation //////////////////////

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

    w_Invitation_New = 'New';
    w_Invitation_Approved = 'Approved';
    w_Invitation_PendingApproved = 'Pending Approved';
    w_Invitation_Rejected = 'Rejected';

    w_Invitation_DateError = 'End date must greater or equal than start date';
    w_Invitation_EmailError = 'Email format wrong';

    w_Invitation_CompanyAddPTW = 'Add PTW';
    w_Invitation_CompanyEmail = 'Company Email';
    w_Invitation_WorkDescription = 'Work Description';

    // ViewPTW
    w_ViewPTW_StepTitle = 'Permit To Work Request Form';
    w_Save = 'Save';

    w_ViewPTW_Step_ErrorTip = 'Please check the blank field';
    w_ViewPTW_Step_ErrorTipYes = 'Please check the answer';

    // step1
    w_ViewPTW_Step1_PDPAAgreement_Title = 'PDPA Agreement';
    w_ViewPTW_Step1_content = 'This Data Protection Notice (“Notice”) sets out the basis which  Hong Kong  Land  (“we”, “us”, or “our”) may collect, use, disclose or otherwise process personal data of our customers in accordance with the Personal Data Protection Act (“PDPA”). This Notice applies to personal data in our possession or under our control, including personal data in the possession of organizations which we have engaged to collect, use, disclose or process personal data for our purposes.';
    w_ViewPTW_Step1_agreement = 'I accept the agreement';
    w_ViewPTW_Step1_ErrorTip = 'Please check the agreement is accepted';

    // step2
    w_ViewPTW_Step2_Tip = '* Please help to complete all data fields. All workers’ particulars must be completed before submitting the work order.';
    w_ViewPTW_Step2_PTWTitle = 'PTW Data';
    w_ViewPTW_Step2_ContractorTitle = 'Contractor Information';
    w_ViewPTW_Step2_NameOfApplicant = 'Name of Applicant';
    w_ViewPTW_Step2_CompanyName = 'Company Name';
    w_ViewPTW_Step2_CompanyAddress = 'Company Address';
    w_ViewPTW_Step2_EmailAddress = 'Email Address';
    w_ViewPTW_Step2_ContactNumber = 'Contact Number';
    w_ViewPTW_Step2CompanyFaxNo = 'Company Fax No';

    // step3
    w_ViewPTW_Step3_WorkInformationTitle = 'Work Information';
    w_ViewPTW_Step3_WorkPremisesUnit = 'Work Premises Unit';
    w_ViewPTW_Step3_ExactLocation = 'Provide Exact Location(s) & Areas to be cordoned off and where the machineries / vehicles / equipment to be deployed';
    w_ViewPTW_Step3_ExactLocation_PlaceHolder = 'Exact Location(s) & Areas';
    w_ViewPTW_Step3_Description = 'Brief Description of the works to be carried out';
    w_ViewPTW_Step3_Description_PlaceHolder = 'Description of the works';

    w_ViewPTW_Step3_TypesOfWorkInvolved = 'Types of work involved. Please tick all that apply';
    w_ViewPTW_Step3_TypesOfWorkInvolved1 = 'Hot Works';
    w_ViewPTW_Step3_TypesOfWorkInvolved2 = 'Lifting Operations';
    w_ViewPTW_Step3_TypesOfWorkInvolved3 = 'Entry into Confined Space';
    w_ViewPTW_Step3_TypesOfWorkInvolved4 = 'Use of bottom lift or aerial platform';
    w_ViewPTW_Step3_TypesOfWorkInvolved5 = 'Installation & Use of Gondola';
    w_ViewPTW_Step3_TypesOfWorkInvolved6 = 'Installation & Use of Scaffold';
    w_ViewPTW_Step3_TypesOfWorkInvolved7 = 'Installation of Temporary Generator';
    w_ViewPTW_Step3_TypesOfWorkInvolved8 = 'Others i.e.. Structural works';

    w_ViewPTW_Step3_From = 'Expected Duration of Work – From :';
    w_ViewPTW_Step3_To = 'To';
    w_ViewPTW_Step3_NameOfApplicant = 'Name of Applicant’s Service Provider(s) in the works :';
    w_ViewPTW_Step3_HandPhoneContactNumber = 'Handphone Contact Number';

    // step4
    w_ViewPTW_Step4_ChecklistForApplicantTitle = 'Checklist for Applicant';

    w_ViewPTW_Step4_1 = '1. Has comprehensive risk assessment (RA) been carried out for the works involved ?';
    w_ViewPTW_Step4_2 = '2. Have everyone involved been informed of the RA and control measure(s) ?';
    w_ViewPTW_Step4_3 = '3. Are proper barricades and safety signs available for the closure of work area(s) ?';
    w_ViewPTW_Step4_4 = '4. Is/are the service provider(s) engaged for the work competent ?';
    w_ViewPTW_Step4_5 = '5. Is/are the work(s) to be carried out supervised by a competent person ?';
    w_ViewPTW_Step4_6 = '6. Are the locations/areas involved suitable for the works ?';
    w_ViewPTW_Step4_7 = '7. Are the machinery/equipment used approved by the relevant authorities ?';
    w_ViewPTW_Step4_8 = 'I/We am/are fully aware of the safety and health requirements under the Singapore Legislation and Regulations, and undertake to comply with these requirements and any other safety requirements imposed by the relevant authorities';
    w_ViewPTW_Step4_9 = 'Briefed on';
    w_ViewPTW_Step4_91 = 'EHS In-House';
    w_ViewPTW_Step4_93 = ' Rules ?';

    w_ViewPTW_Step4_Remarks = 'Remarks';
    w_ViewPTW_Step4_Answer = 'Answer';
    w_ViewPTW_Step4_Item = 'Item';

    w_yes = 'Yes';
    w_no = 'No';

    // step
    //w_ViewPTW_Step = '';


    // step
    //w_ViewPTW_Step = '';


    // step
    //w_ViewPTW_Step = '';


    /////////////////////// General Settings //////////////////////

    w_GeneralSettings_RemoveWorkerDaysCardTitle = 'Remove worker data days';
    w_GeneralSettings_RemoveWorkerDaysFormLabel = 'Remove Worker Data from Days';
}
