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
    w_ExportExcel = 'Export Excel';
    w_HowToExportExcel = 'How To Export Excel?';
    w_Expired = 'Expired';

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
    w_Logout = 'Logout';

    w_Website_title = 'iSAP Contractor Management System';

    /////////////////////////////////////////////

    w_Error_FileToLarge = 'File to large';
    w_Save_Checked = 'You have made changes to this PTW .  Do you want to save them ?';
    w_Error_EmailServerError = 'Email server not set, please setup email server';
    w_Error_EmailServerErrorEnable = 'Email server must enable';
    w_Error_EmailSettingError = 'Email server setting error';
    w_Save_SubmitChecked = 'Attention! Once a PTW is submitted , they cannot longer edit it';
    w_Save_SubmitCheck = 'Submit Remind';

    /////////////////////////////////////////////

    // Login
    w_Login_LoginTitle = 'Login';
    w_Login_ForgotPassword = 'Forgot password';
    w_Login_RemeberMe = 'Remeber Me';

    // failed to fetch
    w_FailedToFetch = "We can't connect to server, please try again!";
    w_ErrorResponseUndefined = "Can't get server response";

    // 401
    w_UserSession_Empty = 'Incorrect Username / Password';

    // 404
    w_APINotFind = 'API not find';

    /////////////////////////////////////////////

    w_Navigation_Dashboard = 'Dashboard';

    w_Navigation_Invitation = 'Invitation';
    w_Navigation_ContractorRegistration = 'ContractorRegistration';

    w_Navigation_GeneralSettings = 'General Settings';
    w_Navigation_GeneralSettings_Background = 'Background';
    w_Navigation_GeneralSettings_RemoveWorker = 'Remove Worker';

    w_Navigation_Welcome = 'WELCOME!';
    w_Navigation_ContractorManagementSystem = 'Contractor Management System';
    w_Navigation_CreateWorkOrderRequest = 'Create Work Order Request';
    w_Navigation_PTWNotFound = 'PTW Not Found';
    w_Navigation_TheInvitationNumberDoesNotExistOrIsNoLongerOpen = 'The invitation number does not exist or is no longer open';

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
    w_Invitation_WorkersName = "Worker's Name";

    w_Invitation_Search = 'Search';
    w_Invitation_ExportData = 'Export Data';

    w_Invitation_List = 'Invitation List';
    w_No = 'No';
    w_Invitation_StartDate = 'Start Date';
    w_Invitation_EndDate = 'End Date';
    w_Invitation_ContractorCompany = 'Contractor Company';

    w_Invitation_New = 'New';
    w_Invitation_Approved = 'Approved';
    w_Invitation_PendingApproved = 'Pending Approval';
    w_Invitation_Rejected = 'Rejected';

    w_Invitation_DateError = 'End date must greater or equal than start date';
    w_Invitation_StartDateError = 'Start date cannot be earlier than today';
    w_Invitation_DateErrorCheck = 'End date must greater than today';
    w_Invitation_EmadilError = 'Email format wrong';

    w_Invitation_CompanyAddPTW = 'Add PTW';
    w_Invitation_CompanyEmail = 'Company Email';
    w_Invitation_WorkDescription = 'Work Description';
    w_Invitation_ExportCurrentPage = 'Export Current Page';
    w_Invitation_ExportAllData = 'Export All Data';

    // ViewPTW
    w_ViewPTW_StepTitle = 'Permit To Work Request Form';
    w_Save = 'Save';
    w_SaveSuccess = 'Save Success';

    w_ViewPTW_Step_ErrorTip = 'All required fields must befilled out';
    w_ViewPTW_Step_ErrorTipYes = 'All Selection Items must be marked "Yes" before continuing';
    w_ViewPTW_Step_ErrorTipPerson = 'Please add person';
    w_ViewPTW_Step_ErrorPhone = 'Number only';

    w_ViewPTW_Step_AsteriskIsRequired = 'Indicates required field.';

    w_PTW_SubmitSuccess = 'Your PTW application has been successfully submitted';
    w_PTW_AddPTWSuccess = 'PTW has been succesfully added';
    w_PTW_EditPTWSuccess = 'PTW has been succesfully updated';

    // step1
    w_ViewPTW_Step1_PDPAAgreement_Title = 'PDPA Agreement';
    w_ViewPTW_Step1_content = 'This Data Protection Notice (“Notice”) sets out the basis which  Hong Kong  Land  (“we”, “us”, or “our”) may collect, use, disclose or otherwise process personal data of our customers in accordance with the Personal Data Protection Act (“PDPA”). This Notice applies to personal data in our possession or under our control, including personal data in the possession of organizations which we have engaged to collect, use, disclose or process personal data for our purposes.';
    w_ViewPTW_Step1_agreement = 'I accept the agreement';
    w_ViewPTW_Step1_ErrorTip = 'You must agree to the terms and conditions before continuing';

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
    w_ViewPTW_Step3_TypesOfWorkInvolved1 = '1. Hot Works';
    w_ViewPTW_Step3_TypesOfWorkInvolved2 = '2. Lifting Operations';
    w_ViewPTW_Step3_TypesOfWorkInvolved3 = '3. Entry into Confined Space';
    w_ViewPTW_Step3_TypesOfWorkInvolved4 = '4. Use of bottom lift or aerial platform';
    w_ViewPTW_Step3_TypesOfWorkInvolved5 = '5. Installation & Use of Gondola';
    w_ViewPTW_Step3_TypesOfWorkInvolved6 = '6. Installation & Use of Scaffold';
    w_ViewPTW_Step3_TypesOfWorkInvolved7 = '7. Installation of Temporary Generator';
    w_ViewPTW_Step3_TypesOfWorkInvolved8 = '8. Others i.e.. Structural works';

    w_ViewPTW_Step3_From = 'Expected Duration of Work – From :';
    w_ViewPTW_Step3_To = 'To';
    w_ViewPTW_Step3_NameOfApplicant = "Name of Applicant's Service Provider(s) in the works :";
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

    // step5
    w_ViewPTW_Step5_SupportingDocumentationTitle = 'Supporting Documentation';
    // for Admin
    w_ViewPTW_Step5_SupportingDocuments = 'Please attach supporting documents:';
    w_ViewPTW_Step5_RiskAssessment = 'Risk Assessment';
    w_ViewPTW_Step5_MethodOfStatement = 'Method of Statement';
    w_ViewPTW_Step5_SafeWorkProcedure = 'Safe Work Procedure';
    w_ViewPTW_Step5_AnyRelevantLicensesOrPasses = 'Any relevant licenses or passes';
    w_ViewPTW_Step5_BizsafeCertificate = 'Bizsafe certificate';
    // for Worker
    w_ViewPTW_Step5_SupportingDocument = 'Please remember to attach any PTW supporting documentation such as :';
    w_ViewPTW_Step5_Forms = 'Risk Assessment Evaluation Forms';
    w_ViewPTW_Step5_License = 'Heavy Works License';
    w_ViewPTW_Step5_Others = 'Others';

    w_ViewPTW_Step5_UploadFiles = 'Upload File(s)';
    w_ViewPTW_Step5_supported = 'Only .PDF , .JPEG and .PNG files are supported';

    // step6
    w_ViewPTW_Step6_TermsConditionsTitle = 'Terms & Conditions';
    w_ViewPTW_Step6_TermsConditionsInfo = 'The tenant and the contractor must comply with the following:';

    w_ViewPTW_Step6_1 = '1. Noisy works and work which emit toxic fumes must be performed outside normal office hours (i.e. must be performed between 2400 hrs. to 0500 hrs.), unless the Landlord has first approved otherwise.';
    w_ViewPTW_Step6_2 = '2. The work process and all materials must be confined to the tenant’s premises and the tenant must ensure it or its contractor removes all debris from site at the end of each working days to prevent fire hazards.';
    w_ViewPTW_Step6_3 = '3. Before starting any works, all people who will work in the premises must obtain a site pass from the landlord’s Building Security Office at Checkpoint level 1. The landlord may require a worker found on site without a site pass to leave the building immediately.';
    w_ViewPTW_Step6_4 = '4. Smoking and gambling is strictly prohibited.';
    w_ViewPTW_Step6_5 = '5. Fire exit doors must not be wedged open and corridors must not be obstructed at any time.';
    w_ViewPTW_Step6_6 = '6. Throughout the works period the contractor must provide adequate fire extinguishers in the premises.';
    w_ViewPTW_Step6_7 = '7. A worker found urinating or defecating in areas other than a toilet designated by the landlord will be required to leave the building immediately.';
    w_ViewPTW_Step6_8 = '8. Electrical wiring must be installed by a qualified electrician and must comply with local regulations.';
    w_ViewPTW_Step6_9 = '9. Electrical equipment must be unplugged when not in use.';
    w_ViewPTW_Step6_10 = '10. A Hot Work permit need to be submitted before any hot work being carried out. Dangerous or flammable\n' +
        'materials must not be stored on site unless supervised by responsible personnel and in appropriate containers,\n' +
        'the building management office (BMO) must be notified in advance if such materials are to be left on site\n' +
        'overnight';
    w_ViewPTW_Step6_11 = '11. If the tenant has arranged for works to be carried out overnight, the tenant or its authorized agents must notify\n' +
        'the landlord in writing at least 2 days in advance.';
    w_ViewPTW_Step6_12 = '12. All waste and rubbish must be removed from the building daily.';
    w_ViewPTW_Step6_13 = '13. The contractor responsible person on site must check the workplace each day after the works are finished for\n' +
        'signs of burning or smouldering before leaving the site.';

    // step7
    w_ViewPTW_Step7_AddPerson = 'Add Person';
    w_ViewPTW_Step7_RemovePerson = 'Remove Person';
    w_ViewPTW_Step7_EditPerson = 'Edit Person';
    w_ViewPTW_Step7_PersonList = 'Person List';
    w_ViewPTW_Step7_FullName = 'Full Name';
    w_ViewPTW_Step7_Occupation = 'Occupation';
    w_ViewPTW_Step7_NRIC = 'NRIC / FIN';
    w_ViewPTW_Step7_Shift = 'Shift';
    w_ViewPTW_Step7_Vehicle = 'Vehicle #';
    w_ViewPTW_Step7_Company = 'Company';

    w_ViewPTW_Step7_NRICFIN = 'NRIC / FIN';

    w_ViewPTW_Step7_NRICFIN_PlaceHolder = 'Please fill in NRIC/FIN last 4 characters';

    w_ViewPTW_Step7_Day = 'Day';
    w_ViewPTW_Step7_Night = 'Night';
    w_ViewPTW_Step7_Midnight = 'Midnight';

    w_ViewPTW_Step7_DeleteConfirm = 'Are you sure to delete selected person?';
    w_DeleteConfirm = 'Delete Confirm';

    // step8
    w_ViewPTW_Step8_Title = 'Confirmation review';
    w_ViewPTW_Step8_ValidityOfApproval = 'Validity of Approval';
    w_ViewPTW_Step8_AccessGroup = 'Access Group';

    w_Invitation_Approve = 'Approve';
    w_Invitation_Reject = 'Reject';

    w_ViewPTW_ResultTitle = 'Registration Result';
    w_ViewPTW_ResultSuccessContent = 'Registration Success';
    w_ViewPTW_ResultFailedContent = 'Registration Failed';
    w_ViewPTW_DoorPlaceHolder = 'Please select access area';

    /////////////////////// General Settings //////////////////////

    w_GeneralSettings_RemoveWorkerDaysCardTitle = 'Remove worker data days';
    w_GeneralSettings_RemoveWorkerDaysFormLabel = 'Remove Worker Data from Days';
    w_GeneralSettings_UpdateSuccess = 'Update general setting is success';
    w_GeneralSettings_PublicExternalIPFormLabel = 'External Address';
    w_GeneralSettings_PublicExternalNotURL = 'External Address please input URL';

    /////////////////////// Dashboard //////////////////////
    w_Dashboard_Dashboard = 'Dashboard';
    w_Dashboard_FilterCondition = 'Filter Condition';
    w_Dashboard_RealTimeContractorTraffic = 'Real Time Contractor Traffic';
    w_Dashboard_WorkFrequencyHistory = 'Work Frequency History';
    w_Dashboard_Submitted = 'New';
    w_Dashboard_Approved = 'Approved';
    w_Dashboard_AwaitingApproval = 'Pending Approval';
    w_Dashboard_Total = 'Total';

    //
    w_User_VisitorCannotLogin = '';
}
