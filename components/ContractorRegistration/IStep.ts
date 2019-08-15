interface IStep1 {
    pdpaAccepted: boolean;
}

interface IStep2 {
    // PTW Data
    ptwId: string;
    tenant: string;
    workCategoryId: string;

    // Contractor Information
    applicantName: string;

    // Company
    contractorCompanyName: string;
    contractorCompanyAddress: string;
    contractorCompanyEmail: string;
    contractorCompanyContactPhone: number;
    contractorCompanyFax: number;
}

interface IStep3 {
    workPremisesUnit: string;
    workLocation: string;
    workDescription: string;
    workType1: boolean;
    workType2: boolean;
    workType3: boolean;
    workType4: boolean;
    workType5: boolean;
    workType6: boolean;
    workType7: boolean;
    workType8: boolean;
    workStartDate: Date;
    workStartTime: Date;
    workEndDate: Date;
    workEndTime: Date;
    workContact: string;
    workContactPhone: number;
}

interface IStep4 {
    checklist1: boolean;
    checklistRemark1: string;
    checklist2: boolean;
    checklistRemark2: string;
    checklist3: boolean;
    checklistRemark3: string;
    checklist4: boolean;
    checklistRemark4: string;
    checklist5: boolean;
    checklistRemark5: string;
    checklist6: boolean;
    checklistRemark6: string;
    checklist7: boolean;
    checklistRemark7: string;
    checklist8: boolean;
    checklist9: boolean;
}

interface IStep5 {
    attachments: string[];
}

interface IStep6 {
    termsAccepted: boolean;
}

interface IStep7 {
    persons: IWorkPermitPerson[];
}

interface IStep8 {
    accessGroups: IWorkPermitAccessGroup[];
}

interface IWorkPermitPerson {
    name: string;
    phone: string;
    nric: string;
    occupation: string;
    unitNo: string;
    vehicle: string;
    companyName: string;
    shift: string;
}

interface IWorkPermitAccessGroup {
    doorId: string;
    doorName: string;
}

export { IStep1, IStep2, IStep3, IStep4, IStep5, IStep6, IStep7, IStep8, IWorkPermitPerson, IWorkPermitAccessGroup };
