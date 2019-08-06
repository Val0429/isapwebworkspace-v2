<template>
    <div class="animated fadeIn">

        <iv-auto-card :label="_('w_ViewPTW_StepTitle') ">
            <iv-step-progress
                ref="step"
                @mounted="doMounted"
            >

                <template #1-title>{{ _('w_ViewPTW_Step1_PDPAAgreement_Title') }}</template>
                <template #1>

                    <iv-form
                        :interface="IStep1()"
                        :value="inputFormData"
                        @submit="stepTo2($event)"
                    >
                        <template #step1>
                            <step1 @step1="receiveStep1Data"></step1>
                        </template>

                    </iv-form>
                </template>

                <template #2-title>{{ _('w_ViewPTW_Step2_ContractorTitle') }}</template>
                <template #2>

                    <iv-form
                        :interface="IStep2()"
                        :value="inputFormData"
                        @submit="stepTo3($event)"
                    >
                        <template #step2>
                            <step2
                                class="col-md-12"
                                @step2="receiveStep2Data"
                            ></step2>
                        </template>

                    </iv-form>
                </template>

                <template #3-title>{{ _('w_ViewPTW_Step3_WorkInformationTitle') }}</template>
                <template #3>

                    <iv-form
                        :interface="IStep3()"
                        :value="inputFormData"
                        @submit="stepTo4($event)"
                    >
                        <template #step3>
                            <step3
                                class="col-md-12"
                                @step3="receiveStep3Data"
                            ></step3>
                        </template>

                    </iv-form>
                </template>

                <template #4-title>{{ _('w_ViewPTW_Step4_ChecklistForApplicantTitle') }}</template>
                <template #4>

                    <iv-form
                        :interface="IStep4()"
                        :value="inputFormData"
                        @submit="stepTo5($event)"
                    >
                        <template #step4>
                            <step4
                                class="col-md-12"
                                @step4="receiveStep4Data"
                            ></step4>
                        </template>

                    </iv-form>
                </template>

                <template #5-title>{{ _('w_ViewPTW_Step5_SupportingDocumentationTitle') }}</template>
                <template #5>

                    <iv-form
                        :interface="IStep5()"
                        :value="inputFormData"
                        @submit="stepTo6($event)"
                    >
                        <template #step5>
                            <step5
                                class="col-md-12"
                                :permission="true"
                                @step5="receiveStep5Data"
                                @putStep5File="putStep5File"
                            ></step5>
                        </template>

                    </iv-form>
                </template>

                <template #6-title>{{ _('w_ViewPTW_Step6_TermsConditionsTitle') }}</template>
                <template #6>

                    <iv-form
                        :interface="IStep6()"
                        :value="inputFormData"
                        :permission="true"
                        @submit="stepTo7($event)"
                    >
                        <template #step6>
                            <step6
                                class="col-md-12"
                                @step6="receiveStep6Data"
                            ></step6>
                        </template>

                    </iv-form>
                </template>

                <template #7-title>{{ _('w_ViewPTW_Step7_AddPerson') }}</template>
                <template #7>

                    <iv-form
                        :interface="IStep7()"
                        :value="inputFormData"
                        @submit="stepTo8($event)"
                    >
                        <template #step7>
                            <step7
                                class="col-md-12"
                                @step7="receiveStep7Data"
                                :permission="true"
                            ></step7>
                        </template>

                    </iv-form>
                </template>

                <template #8-title>{{ _('w_ViewPTW_Step8_Title') }}</template>
                <template #8>

                    <iv-form
                        :interface="IStep8()"
                        :value="inputFormData"
                        @submit="doSubmit($event)"
                    >
                        <template #step8>
                            <step8
                                class="col-md-12"
                                @step8="receiveStep8Data"
                            ></step8>
                        </template>

                    </iv-form>
                </template>

            </iv-step-progress>

            <template #footer-before>
                <b-button
                    variant="info"
                    size="lg"
                    @click="pageToList()"
                >{{ _('w_Save') }}
                </b-button>
            </template>

        </iv-auto-card>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Step1 from "@/components/ContractorRegistration/Step1.vue";
import Step2 from "@/components/ContractorRegistration/Step2.vue";
import Step3 from "@/components/ContractorRegistration/Step3.vue";
import Step4 from "@/components/ContractorRegistration/Step4.vue";
import Step5 from "@/components/ContractorRegistration/Step5.vue";
import Step6 from "@/components/ContractorRegistration/Step6.vue";
import Step7 from "@/components/ContractorRegistration/Step7.vue";
import Step8 from "@/components/ContractorRegistration/Step8.vue";

// Service
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";

@Component({
    components: { Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8 }
})
export class EditPTW extends Vue {
    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: () => {}
    })
    selectedDetail: string;

    // step 相關
    isMounted: boolean = false;
    doMounted() {
        this.isMounted = true;
    }

    inputFormData: any = {
        // step1
        step1Accepted: "",

        // step2
        // PTW Data
        step2PtwId: "",
        step2Tenant: "",
        step2WorkCategory: "",

        // Contractor Information
        step2NameOfApplicant: "",
        step2CompanyName: "",
        step2CompanyAddress: "",
        step2Email: "",
        step2ContactNumber: 0,
        step2CompanyFaxNo: 0,

        // step3
        step3Unit: "",
        step3Location: "",
        step3Description: "",
        step3TypeOfWork: [],
        step3StartDate: new Date(),
        step3EndDate: new Date(),
        step3NameOfApplicantService: "",
        step3HandPhoneContactNumber: 0,

        // step4
        step4Checklist1: false,
        step4Checklist2: false,
        step4Checklist3: false,
        step4Checklist4: false,
        step4Checklist5: false,
        step4Checklist6: false,
        step4Checklist7: false,
        step4Checklist8: false,
        step4Checklist9: false,

        step4Checklist1Remarks: "",
        step4Checklist2Remarks: "",
        step4Checklist3Remarks: "",
        step4Checklist4Remarks: "",
        step4Checklist5Remarks: "",
        step4Checklist6Remarks: "",

        // step5

        // step6
        step6Accepted: "",

        // step7
        step7PersonDetail: undefined,

        // step8
        step8StartDate: new Date(),
        step8EndDate: new Date(),
        step8AccessGroup: "",
        step8Approval: false
    };

    created() {
        this.inputFormData = this.selectedDetail;
    }

    mounted() {}

    ////////////////////////////// step 1  //////////////////////////////

    receiveStep1Data(step1Date) {
        this.inputFormData.step1Accepted = step1Date;
        //        console.log(' ~ ', this.inputFormData.accepted)
    }

    stepTo2() {
        let stepRef: any = this.$refs.step;

        // TODO: 全部step OK
        // if (!this.inputFormData.step1Accepted) {
        //     Dialog.error(this._("w_ViewPTW_Step1_ErrorTip"));
        //     stepRef.currentStep = 0;
        //     return false;
        // }
    }

    IStep1() {
        return `
            interface {
                step1?: any;
            }`;
    }

    ////////////////////////////// step 1  //////////////////////////////

    ////////////////////////////// step 2  //////////////////////////////

    receiveStep2Data(step2Date) {
        // PTW Data
        this.inputFormData.step2PtwId = step2Date.ptwId;
        this.inputFormData.step2Tenant = step2Date.tenant;
        this.inputFormData.step2WorkCategory = step2Date.workCategory;

        // Contractor Information
        this.inputFormData.step2NameOfApplicant = step2Date.nameOfApplicant;
        this.inputFormData.step2CompanyName = step2Date.companyName;
        this.inputFormData.step2CompanyAddress = step2Date.companyAddress;
        this.inputFormData.step2Email = step2Date.email;
        this.inputFormData.step2ContactNumber = step2Date.contactNumber;
        this.inputFormData.step2CompanyFaxNo = step2Date.companyFaxNo;

        console.log("inputFormData ~ ", this.inputFormData);
    }

    stepTo3() {
        let stepRef: any = this.$refs.step;

        // TODO: wait下拉選單 和 全部step OK
        // if (
        //     !this.inputFormData.step2PtwId ||
        //     !this.inputFormData.step2Tenant ||
        //     !this.inputFormData.step2WorkCategory ||
        //     !this.inputFormData.step2NameOfApplicant ||
        //     !this.inputFormData.step2CompanyName ||
        //     !this.inputFormData.step2CompanyAddress ||
        //     !this.inputFormData.step2Email ||
        //     !this.inputFormData.step2ContactNumber ||
        //     !this.inputFormData.step2CompanyFaxNo
        // ) {
        //     Dialog.error(this._("w_ViewPTW_Step_ErrorTip"));
        //     stepRef.currentStep = 1;
        //     return false;
        // }
    }

    IStep2() {
        return `
            interface {
                step2?: any;
            }`;
    }

    ////////////////////////////// step 2  //////////////////////////////

    ////////////////////////////// step 3  //////////////////////////////

    receiveStep3Data(step3Date) {
        this.inputFormData.step3Unit = step3Date.unit;
        this.inputFormData.step3Location = step3Date.location;
        this.inputFormData.step3Description = step3Date.description;
        this.inputFormData.step3TypeOfWork = step3Date.typeOfWork;
        this.inputFormData.step3StartDate = step3Date.startDate;
        this.inputFormData.step3EndDate = step3Date.endDate;
        this.inputFormData.step3NameOfApplicantService =
            step3Date.nameOfApplicantService;
        this.inputFormData.step3HandPhoneContactNumber =
            step3Date.handPhoneContactNumber;

        console.log("inputFormData ~ ", this.inputFormData);
    }

    stepTo4() {
        let stepRef: any = this.$refs.step;

        // TODO: 全部step OK
        // if (
        //     !this.inputFormData.step3Unit ||
        //     !this.inputFormData.step3Location ||
        //     !this.inputFormData.step3Description ||
        //     this.inputFormData.step3TypeOfWork.length === 0 ||
        //     !this.inputFormData.step3StartDate ||
        //     !this.inputFormData.step3EndDate ||
        //     !this.inputFormData.step3NameOfApplicantService ||
        //     !this.inputFormData.step3HandPhoneContactNumber
        // ) {
        //     Dialog.error(this._("w_ViewPTW_Step_ErrorTip"));
        //     stepRef.currentStep = 2;
        //     return false;
        // }
    }

    IStep3() {
        return `
            interface {
                step3?: any;
            }`;
    }

    ////////////////////////////// step 3  //////////////////////////////

    ////////////////////////////// step 4  //////////////////////////////

    receiveStep4Data(step4Date) {
        this.inputFormData.step4Checklist1 = step4Date.checklist1;
        this.inputFormData.step4Checklist2 = step4Date.checklist2;
        this.inputFormData.step4Checklist3 = step4Date.checklist3;
        this.inputFormData.step4Checklist4 = step4Date.checklist4;
        this.inputFormData.step4Checklist5 = step4Date.checklist5;
        this.inputFormData.step4Checklist6 = step4Date.checklist6;
        this.inputFormData.step4Checklist7 = step4Date.checklist7;
        this.inputFormData.step4Checklist8 = step4Date.checklist8;
        this.inputFormData.step4Checklist9 = step4Date.checklist9;

        this.inputFormData.step4Checklist1Remarks = step4Date.checklist1Remarks;
        this.inputFormData.step4Checklist2Remarks = step4Date.checklist2Remarks;
        this.inputFormData.step4Checklist3Remarks = step4Date.checklist3Remarks;
        this.inputFormData.step4Checklist4Remarks = step4Date.checklist4Remarks;
        this.inputFormData.step4Checklist5Remarks = step4Date.checklist5Remarks;
        this.inputFormData.step4Checklist6Remarks = step4Date.checklist6Remarks;
        this.inputFormData.step4Checklist7Remarks = step4Date.checklist7Remarks;

        console.log(" ~ ", this.inputFormData);
    }

    stepTo5() {
        let stepRef: any = this.$refs.step;

        // TODO: 全部step OK
        // if (
        //     !this.inputFormData.step4Checklist1 ||
        //     !this.inputFormData.step4Checklist2 ||
        //     !this.inputFormData.step4Checklist3 ||
        //     !this.inputFormData.step4Checklist4 ||
        //     !this.inputFormData.step4Checklist5 ||
        //     !this.inputFormData.step4Checklist6 ||
        //     !this.inputFormData.step4Checklist7 ||
        //     !this.inputFormData.step4Checklist8 ||
        //     !this.inputFormData.step4Checklist9
        // ) {
        //     Dialog.error(this._("w_ViewPTW_Step_ErrorTipYes"));
        //     stepRef.currentStep = 3;
        //     return false;
        // }
    }

    IStep4() {
        return `
            interface {
                step4?: any;
            }`;
    }

    ////////////////////////////// step 4  //////////////////////////////

    ////////////////////////////// step 5  //////////////////////////////

    receiveStep5Data(step5Date) {}

    putStep5File(file) {
        console.log("putStep5File", file);
    }

    stepTo6() {
        let stepRef: any = this.$refs.step;

        // TODO: 全部step OK
        // if (判斷條件) {
        //     Dialog.error(this._("w_ViewPTW_Step1_ErrorTip"));
        //     stepRef.currentStep = 4;
        //     return false;
        // }
    }

    IStep5() {
        return `
            interface {
                step5?: any;
            }`;
    }

    ////////////////////////////// step 5  //////////////////////////////

    ////////////////////////////// step 6  //////////////////////////////

    receiveStep6Data(step6Date) {
        this.inputFormData.step6Accepted = step6Date;
    }

    stepTo7() {
        let stepRef: any = this.$refs.step;

        // TODO: 全部step OK
        // if (!this.inputFormData.step6Accepted) {
        //     Dialog.error(this._("w_ViewPTW_Step1_ErrorTip"));
        //     stepRef.currentStep = 5;
        //     return false;
        // }
    }

    IStep6() {
        return `
            interface {
                step6?: any;
            }`;
    }

    ////////////////////////////// step 6  //////////////////////////////

    ////////////////////////////// step 7  //////////////////////////////

    receiveStep7Data(step7Date) {
        this.inputFormData.step7PersonDetail = step7Date;
        console.log(
            "this.inputFormData.step7PersonDetail ~ ",
            this.inputFormData.step7PersonDetail
        );
    }

    stepTo8() {
        let stepRef: any = this.$refs.step;

        // TODO: 全部step OK
        // if (!this.inputFormData.personDetail) {
        //     Dialog.error(this._("w_ViewPTW_Step_ErrorTipPerson"));
        //     stepRef.currentStep = 6;
        //     return false;
        // }
    }

    IStep7() {
        return `
            interface {
                step7?: any;
            }`;
    }

    ////////////////////////////// step 7  //////////////////////////////

    ////////////////////////////// step 8  //////////////////////////////

    receiveStep8Data(step8Date) {
        this.inputFormData.step8StartDate = step8Date.startDate;
        this.inputFormData.step8EndDate = step8Date.endDate;
        this.inputFormData.step8AccessGroup = step8Date.accessGroup;
        this.inputFormData.step8Approval = step8Date.approval;

        console.log("this.inputFormData ~ ", this.inputFormData);
    }

    async doSubmit() {
        // TODO: wait api
        const datas: any = [];

        const doSubmitParam = {
            datas
        };

        // Loading.show();
        // await this.$server
        //     .U("/", doSubmitParam)
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(
        //             this,
        //             response,
        //             (response: any) => {
        //                 Dialog.success(this._("w_Dialog_SuccessTitle"));
        //             },
        //             this._("w_Dialog_ErrorTitle")
        //         );
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.catchError(
        //             this,
        //             e,
        //             this._("w_Dialog_ErrorTitle")
        //         );
        //     });

        this.$emit("submit-data", doSubmitParam);
    }

    IStep8() {
        return `
            interface {
                step8?: any;
            }`;
    }

    ////////////////////////////// step 8  //////////////////////////////
}

export default EditPTW;
Vue.component("edit-ptw", EditPTW);
</script>

<style lang="scss" scoped>
</style>




