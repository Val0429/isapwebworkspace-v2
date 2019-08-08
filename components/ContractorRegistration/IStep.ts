interface IStep1 {
	pdpaAccepted: boolean;
}

interface IStep2 {
	// PTW Data
	ptwId: string;
	tenant: string;
	workCategory: string;

	// Contractor Information
	applicantName: string;

	// Company
	companyName: string;
	companyAddress: string;
	companyEmail: string;
	companyContactPhone: string;
	companyFax: string;
}

interface IStep3 {
	workPremisesUnit: string;
	workLocation: string;
	workDescription: string;
	workType: number[];
	workStartDate: Date;
	workStartTime: Date;
	workEndDate: Date;
	workEndTime: Date;
	workContact: string;
	workContactPhone: string;
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
	persons: IPerson[];
}

interface IStep8 {
	accessGroups: IAccessGroup[];
}

interface IPerson {
	name: string;
	phone: string;
	nric: string;
	occupation: string;
	unitNo: string;
	vehicle: string;
	companyName: string;
	shift: string
}

interface IAccessGroup {
	doorId: string;
	doorName: string;
}

export { IStep1, IStep2, IStep3, IStep4, IStep5, IStep6, IStep7, IStep8, IPerson, IAccessGroup }
