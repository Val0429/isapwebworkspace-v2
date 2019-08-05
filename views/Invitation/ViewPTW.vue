<template>
    <div class="animated fadeIn">

        <iv-auto-card
            :label="_('w_ViewPTW_StepTitle')  "
        >
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
                            <step1
                                @step1="receiveStep1Data"
                            ></step1>
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

                <template #4-title>{{ _('') }}</template>
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


                <template #5-title>{{ _('') }}</template>
                <template #5>

                    <iv-form
                        :interface="IStep5()"
                        :value="inputFormData"
                        @submit="stepTo6($event)"
                    >
                        <template #step5>
                            <step5
                                class="col-md-12"
                                @step5="receiveStep5Data"
                            ></step5>
                        </template>

                    </iv-form>
                </template>


                <template #6-title>{{ _('') }}</template>
                <template #6>

                    <iv-form
                        :interface="IStep6()"
                        :value="inputFormData"
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


                <template #7-title>{{ _('') }}</template>
                <template #7>

                    <iv-form
                        :interface="IStep7()"
                        :value="inputFormData"
                        @submit="doSubmit($event)"
                    >
                        <template #step7>
                            <step7
                                class="col-md-12"
                                @step7="receiveStep7Data"
                            ></step7>
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
import { Vue, Component } from "vue-property-decorator";
import Step1 from "@/components/ContractorRegistration/Step1.vue";
import Step2 from "@/components/ContractorRegistration/Step2.vue";
import Step3 from "@/components/ContractorRegistration/Step3.vue";
import Step4 from "@/components/ContractorRegistration/Step4.vue";
import Step5 from "@/components/ContractorRegistration/Step5.vue";
import Step6 from "@/components/ContractorRegistration/Step6.vue";
import Step7 from "@/components/ContractorRegistration/Step7.vue";

// Service
import Dialog from "@/services/Dialog";

@Component({
    components: { Step1, Step2, Step3, Step4, Step5, Step6, Step7  }
})
export class ViewPTW extends Vue {

    // step 相關
    isMounted: boolean = false;
    doMounted() {
        this.isMounted = true;
    }

    inputFormData: any = {
        // step1
        step1Accepted: '',

        // step2
        // PTW Data
        step2PtwId: '',
        step2Tenant: '',
        step2WorkCategory: '',

        // Contractor Information
        step2NameOfApplicant: '',
        step2CompanyName: '',
        step2CompanyAddress: '',
        step2Email: '',
        step2ContactNumber: 0,
        step2CompanyFaxNo: 0,

        // step3
        step3Unit: '',
        step3Location: '',
        step3Description: '',
        step3TypeOfWork: [],
        step3StartDate: new Date(),
        step3EndDate: new Date(),
        step3NameOfApplicantService:'',
        step3HandPhoneContactNumber: 0
        // step4

        // step5

        // step6

        // step7
    };

    created() {}

    mounted() {}

    ////////////////////////////// step 1  //////////////////////////////

    receiveStep1Data(step1Date) {
        this.inputFormData.step1Accepted = step1Date;
//        console.log(' ~ ', this.inputFormData.accepted)
    }

    stepTo2() {
        let stepRef: any = this.$refs.step;

        if (!this.inputFormData.step1Accepted) {
            Dialog.error(this._("w_ViewPTW_Step1_ErrorTip"));
            stepRef.currentStep = 0;
            return false;
        }
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

        console.log('inputFormData ~ ', this.inputFormData)
    }

    stepTo3() {
        let stepRef: any = this.$refs.step;

        // TODO: wait下拉選單
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
        this.inputFormData.step3NameOfApplicantService = step3Date.nameOfApplicantService;
        this.inputFormData.step3HandPhoneContactNumber = step3Date.handPhoneContactNumber;

        console.log('inputFormData ~ ', this.inputFormData)

    }

    stepTo4() {

        let stepRef: any = this.$refs.step;

        if (
            !this.inputFormData.step3Unit ||
            !this.inputFormData.step3Location ||
            !this.inputFormData.step3Description ||
            this.inputFormData.step3TypeOfWork.length === 0 ||
            !this.inputFormData.step3StartDate ||
            !this.inputFormData.step3EndDate ||
            !this.inputFormData.step3NameOfApplicantService ||
            !this.inputFormData.step3HandPhoneContactNumber
        ) {
            Dialog.error(this._("w_ViewPTW_Step_ErrorTip"));
            stepRef.currentStep = 2;
            return false;
        }
    }

    IStep3() {
        return `
            interface {
                step3?: any;
            }`;
    }

    ////////////////////////////// step 3  //////////////////////////////

    ////////////////////////////// step 4  //////////////////////////////

    receiveStep4Data(step4Date) {}

    stepTo5() {}

    IStep4() {
        return `
            interface {
                step4?: any;
            }`;
    }

    ////////////////////////////// step 4  //////////////////////////////


    ////////////////////////////// step 5  //////////////////////////////

    receiveStep5Data(step5Date) {}

    stepTo6() {}

    IStep5() {
        return `
            interface {
                step5?: any;
            }`;
    }

    ////////////////////////////// step 5  //////////////////////////////

    ////////////////////////////// step 6  //////////////////////////////

    receiveStep6Data(step6Date) {}

    stepTo7() {}

    IStep6() {
        return `
            interface {
                step6?: any;
            }`;
    }

    ////////////////////////////// step 6  //////////////////////////////

    ////////////////////////////// step 7  //////////////////////////////

    receiveStep7Data(step7Date) {}


    doSubmit() {}

    IStep7() {
        return `
            interface {
                step7?: any;
            }`;
    }

    ////////////////////////////// step 7  //////////////////////////////

}


export default ViewPTW;
Vue.component("view-ptw", ViewPTW);
</script>

<style lang="scss" scoped>
</style>




