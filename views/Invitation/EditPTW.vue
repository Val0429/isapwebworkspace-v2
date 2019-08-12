<template>
    <div class="animated fadeIn">

        <iv-auto-card :label="_('w_ViewPTW_StepTitle') ">

            <template #toolbox>
                <iv-toolbox-back @click="pageToList()" />
            </template>

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
                                :selectedDetail="selectedDetail"
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
                                :permission="true"
                                :selectedDetail="selectedDetail"
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
                                :selectedDetail="selectedDetail"
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
                                :selectedDetail="selectedDetail"
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
                                :selectedDetail="selectedDetail"
                                class="col-md-12"
                                :permission="true"
                                @step5="receiveStep5Data"
                                @putStep5File="putStep5File"
                            ></step5>

                            <div
                                v-if="inputFormData.attachments"
                                v-for="file in  inputFormData.attachments"
                                class="step5Div"
                            >
                                <span
                                    class="close"
                                    @click="deleteStep5File(file.base64)"
                                ></span>

                                <img
                                    v-if="file.type != 'application/pdf'"
                                    class="step5Imgs"
                                    :src="file.base64"
                                >
                                <img
                                    v-else
                                    class="step5Imgs"
                                    :src="imageBase64.pdfEmpty"
                                >
                                <a
                                    :href="file.base64"
                                    :download="file.name"
                                    target="_blank"
                                >{{file.name}}</a>
                            </div>

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
                                :selectedDetail="selectedDetail"
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
                                :selectedDetail="selectedDetail"
                                :permission="true"
                                class="col-md-12"
                                @step7="receiveStep7Data"
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
                                :selectedDetail="selectedDetail"
                                class="col-md-12"
                                @step8="receiveStep8Data"
                            ></step8>
                        </template>

                    </iv-form>
                </template>

            </iv-step-progress>

            <template #footer-before>

                <b-button
                    variant="success"
                    size="lg"
                    @click="pageToList()"
                >{{ _('w_Back') }}
                </b-button>

                <b-button
                    variant="info"
                    size="lg"
                    @click="tempSave()"
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

import {
    IStep1,
    IStep2,
    IStep3,
    IStep4,
    IStep5,
    IStep6,
    IStep7,
    IStep8,
    IWorkPermitPerson,
    IWorkPermitAccessGroup
} from "@/components/ContractorRegistration/index";

// Service
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";
import ImageBase64 from "@/services/ImageBase64";

interface IStep
    extends IStep1,
        IStep2,
        IStep3,
        IStep4,
        IStep5,
        IStep6,
        IStep7,
        IStep8 {}

@Component({
    components: { Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8 }
})
export class EditPTW extends Vue {
    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: () => {}
    })
    selectedDetail: any;

    // step 相關
    isMounted: boolean = false;
    isChange: boolean = false;
    doMounted() {
        this.isMounted = true;
    }

    imageBase64 = ImageBase64;

    inputFormData: any = {
        // step1
        pdpaAccepted: false,

        // step2
        // PTW Data
        ptwId: "",
        tenant: "",
        workCategory: "",

        // Contractor Information
        applicantName: "",

        // Contractor Information
        contractorCompanyName: "",
        contractorCompanyAddress: "",
        contractorCompanyEmail: "",
        contractorCompanyContactPhone: 0,
        contractorCompanyFax: 0,

        // step3
        workPremisesUnit: "",
        workLocation: "",
        workDescription: "",
        workType1: false,
        workType2: false,
        workType3: false,
        workType4: false,
        workType5: false,
        workType6: false,
        workType7: false,
        workType8: false,
        workStartDate: new Date(),
        workStartTime: new Date(),
        workEndDate: new Date(),
        workEndTime: new Date(),
        workContact: "",
        workContactPhone: "",

        // step4
        checklist1: false,
        checklist2: false,
        checklist3: false,
        checklist4: false,
        checklist5: false,
        checklist6: false,
        checklist7: false,
        checklist8: false,
        checklist9: false,

        checklistRemark1: "",
        checklistRemark2: "",
        checklistRemark3: "",
        checklistRemark4: "",
        checklistRemark5: "",
        checklistRemark6: "",
        checklistRemark7: "",

        // step5
        attachments: [],

        // step6
        termsAccepted: false,

        // step7
        persons: [],

        // step8
        accessGroups: []
    };

    isApproval: boolean = false;

    created() {
        console.log('selectedDetail ~ ', this.selectedDetail)
    }

    mounted() {
    }

    pageToList() {
        this.$emit('edit-ptw-back-to-list');
    }

    ////////////////////////////// step 1  //////////////////////////////

    receiveStep1Data(step1Date) {
        this.inputFormData.pdpaAccepted = step1Date;
        //        console.log(' ~ ', this.inputFormData.accepted)
    }

    async stepTo2() {
        let stepRef: any = this.$refs.step;

        // TODO: 全部step OK
        // if (!this.inputFormData.pdpaAccepted) {
        //     Dialog.error(this._("w_ViewPTW_Step1_ErrorTip"));
        //     stepRef.currentStep = 0;
        //     return false;
        // }
        await this.tempSave();
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
        this.inputFormData.ptwId = step2Date.ptwId;
        this.inputFormData.tenant = step2Date.tenant;
        this.inputFormData.workCategory = step2Date.workCategory;

        // Contractor Information
        this.inputFormData.applicantName = step2Date.applicantName;

        // Company
        this.inputFormData.contractorCompanyName = step2Date.contractorCompanyName;
        this.inputFormData.contractorCompanyAddress = step2Date.contractorCompanyAddress;
        this.inputFormData.contractorCompanyEmail = step2Date.contractorCompanyEmail;
        this.inputFormData.contractorCompanyContactPhone = step2Date.contractorCompanyContactPhone;
        this.inputFormData.contractorCompanyFax = step2Date.contractorCompanyFax;

        console.log("inputFormData ~ ", this.inputFormData);
        this.isChange = true;
    }

    async stepTo3() {
        let stepRef: any = this.$refs.step;

        // TODO: wait下拉選單 和 全部step OK
        // if (
        //     !this.inputFormData.ptwId ||
        //     !this.inputFormData.tenant ||
        //     !this.inputFormData.workCategory ||
        //     !this.inputFormData.applicantName ||
        //     !this.inputFormData.contractorCompanyName ||
        //     !this.inputFormData.contractorCompanyAddress ||
        //     !this.inputFormData.contractorCompanyEmail ||
        //     !this.inputFormData.contractorCompanyContactPhone ||
        //     !this.inputFormData.contractorCompanyFax
        // ) {
        //     Dialog.error(this._("w_ViewPTW_Step_ErrorTip"));
        //     stepRef.currentStep = 1;
        //     return false;
        // }
        await this.tempSave();
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
        this.inputFormData.workPremisesUnit = step3Date.workPremisesUnit;
        this.inputFormData.workLocation = step3Date.workLocation;
        this.inputFormData.workDescription = step3Date.workDescription;
        this.inputFormData.workType1 = step3Date.workType1;
        this.inputFormData.workType2 = step3Date.workType2;
        this.inputFormData.workType3 = step3Date.workType3;
        this.inputFormData.workType4 = step3Date.workType4;
        this.inputFormData.workType5 = step3Date.workType5;
        this.inputFormData.workType6 = step3Date.workType6;
        this.inputFormData.workType7 = step3Date.workType7;
        this.inputFormData.workType8 = step3Date.workType8;
        this.inputFormData.workStartDate = step3Date.workStartDate;
        this.inputFormData.workStartTime = step3Date.workStartTime;
        this.inputFormData.workEndDate = step3Date.workEndDate;
        this.inputFormData.workEndTime = step3Date.workEndTime;
        this.inputFormData.workContact = step3Date.workContact;
        this.inputFormData.workContactPhone = step3Date.workContactPhone;

        console.log("inputFormData ~ ", this.inputFormData);
        this.isChange = true;
    }

    async stepTo4() {
        let stepRef: any = this.$refs.step;

        // TODO: 全部step OK
        // if (
        //     !this.inputFormData.workPremisesUnit ||
        //     !this.inputFormData.workLocation ||
        //     !this.inputFormData.workDescription ||
        //     !this.inputFormData.workStartDate ||
        //     !this.inputFormData.workStartTime ||
        //     !this.inputFormData.workEndDate ||
        //     !this.inputFormData.workEndTime ||
        //     !this.inputFormData.workContact ||
        //     !this.inputFormData.workContactPhone
        // ) {
        //     Dialog.error(this._("w_ViewPTW_Step_ErrorTip"));
        //     stepRef.currentStep = 2;
        //     return false;
        // }
        await this.tempSave();
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
        this.inputFormData.checklist1 = step4Date.checklist1;
        this.inputFormData.checklist2 = step4Date.checklist2;
        this.inputFormData.checklist3 = step4Date.checklist3;
        this.inputFormData.checklist4 = step4Date.checklist4;
        this.inputFormData.checklist5 = step4Date.checklist5;
        this.inputFormData.checklist6 = step4Date.checklist6;
        this.inputFormData.checklist7 = step4Date.checklist7;
        this.inputFormData.checklist8 = step4Date.checklist8;
        this.inputFormData.checklist9 = step4Date.checklist9;

        this.inputFormData.checklistRemark1 = step4Date.checklistRemark1;
        this.inputFormData.checklistRemark2 = step4Date.checklistRemark2;
        this.inputFormData.checklistRemark3 = step4Date.checklistRemark3;
        this.inputFormData.checklistRemark4 = step4Date.checklistRemark4;
        this.inputFormData.checklistRemark5 = step4Date.checklistRemark5;
        this.inputFormData.checklistRemark6 = step4Date.checklistRemark6;
        this.inputFormData.checklistRemark7 = step4Date.checklistRemark7;

        console.log(" ~ ", this.inputFormData);
        this.isChange = true;
    }

    async stepTo5() {
        let stepRef: any = this.$refs.step;

        // TODO: 全部step OK
        // if (
        //     !this.inputFormData.checklist1 ||
        //     !this.inputFormData.checklist2 ||
        //     !this.inputFormData.checklist3 ||
        //     !this.inputFormData.checklist4 ||
        //     !this.inputFormData.checklist5 ||
        //     !this.inputFormData.checklist6 ||
        //     !this.inputFormData.checklist7 ||
        //     !this.inputFormData.checklist8 ||
        //     !this.inputFormData.checklist9
        // ) {
        //     Dialog.error(this._("w_ViewPTW_Step_ErrorTipYes"));
        //     stepRef.currentStep = 3;
        //     return false;
        // }
        await this.tempSave();
    }

    IStep4() {
        return `
            interface {
                step4?: any;
            }`;
    }

    ////////////////////////////// step 4  //////////////////////////////

    ////////////////////////////// step 5  //////////////////////////////

    receiveStep5Data(step5Date) {
        this.isChange = true;
    }

    deleteStep5File(base64) {
        this.inputFormData.attachments = this.inputFormData.attachments.filter(
            s => s.base64 != base64
        );
        this.isChange = true;
    }

    async putStep5File(files) {
        for (let file of files) {
            if (file) {
                ImageBase64.fileToBase64(file, (base64 = "") => {
                    if (base64 != "") {
                        this.inputFormData.attachments.push({
                            name: file.name,
                            type: file.type,
                            base64: base64
                        });
                    } else {
                        Dialog.error(this._("w_Error_FileToLarge"));
                    }
                });
            }
        }
        this.isChange = true;
        await this.tempSave();
    }

    async stepTo6() {
        let stepRef: any = this.$refs.step;

        // TODO: 全部step OK
        // if (!this.inputFormData.attachments) {
        //     Dialog.error(this._("w_ViewPTW_Step1_ErrorTip"));
        //     stepRef.currentStep = 4;
        //     return false;
        // }
        await this.tempSave();
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
        this.inputFormData.termsAccepted = step6Date;
    }

    async stepTo7() {
        let stepRef: any = this.$refs.step;

        // TODO: 全部step OK
        // if (!this.inputFormData.termsAccepted) {
        //     Dialog.error(this._("w_ViewPTW_Step1_ErrorTip"));
        //     stepRef.currentStep = 5;
        //     return false;
        // }
        await this.tempSave();
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
        this.inputFormData.persons = step7Date;
        console.log(
            "this.inputFormData.step7PersonDetail ~ ",
            this.inputFormData.persons
        );
        this.isChange = true;
    }

    async stepTo8() {
        let stepRef: any = this.$refs.step;

        // TODO: 全部step OK
        // if (this.inputFormData.persons === 0) {
        //     Dialog.error(this._("w_ViewPTW_Step_ErrorTipPerson"));
        //     stepRef.currentStep = 6;
        //     return false;
        // }

        await this.tempSave();
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
        this.inputFormData.workStartDate = step8Date.startDate;
        this.inputFormData.workStartTime = step8Date.startTime;
        this.inputFormData.workEndDate = step8Date.endDate;
        this.inputFormData.workEndTime = step8Date.endTime;
        this.inputFormData.accessGroups = step8Date.accessGroups;

        this.isApproval = step8Date.approval;

        console.log("this.inputFormData ~ ", this.inputFormData);
        this.isChange = true;
    }

    async tempSave() {
        this.isChange = false;


        const updateParam = {
            // add PTW的參數
            objectId: this.selectedDetail.objectId,

            // step2可更改的部份
            companyId: this.inputFormData.tenant,
            workCategory: this.inputFormData.workCategory,

            contact: this.inputFormData.contact,

            contactEmail: this.inputFormData.contactEmail,

            // Step 1
            pdpaAccepted: this.inputFormData.pdpaAccepted,

            // step2
            // Contractor Information
            applicantName: this.inputFormData.applicantName,

            // Company
            contractorCompanyName: this.inputFormData.contractorCompanyName,
            contractorCompanyAddress: this.inputFormData.contractorCompanyAddress,
            contractorCompanyEmail: this.inputFormData.contractorCompanyEmail,
            contractorCompanyContactPhone: this.inputFormData.contractorCompanyContactPhone,
            contractorCompanyFax: this.inputFormData.contractorCompanyFax,

            // step3
            workPremisesUnit: this.inputFormData.workPremisesUnit,
            workLocation: this.inputFormData.workLocation,
            workDescription: this.inputFormData.workDescription,
            workType1: this.inputFormData.workType1,
            workType2: this.inputFormData.workType2,
            workType3: this.inputFormData.workType3,
            workType4: this.inputFormData.workType4,
            workType5: this.inputFormData.workType5,
            workType6: this.inputFormData.workType6,
            workType7: this.inputFormData.workType7,
            workType8: this.inputFormData.workType8,
            workStartDate: this.inputFormData.workStartDate,
            workStartTime: this.inputFormData.workStartTime,
            workEndDate: this.inputFormData.workEndDate,
            workEndTime: this.inputFormData.workEndTime,
            workContact: this.inputFormData.workContact,
            workContactPhone: this.inputFormData.workContactPhone,

            // step4
            checklist1: this.inputFormData.checklist1,
            checklist2: this.inputFormData.checklist2,
            checklist3: this.inputFormData.checklist3,
            checklist4: this.inputFormData.checklist4,
            checklist5: this.inputFormData.checklist5,
            checklist6: this.inputFormData.checklist6,
            checklist7: this.inputFormData.checklist7,
            checklist8: this.inputFormData.checklist8,
            checklist9: this.inputFormData.checklist9,

            checklistRemark1: this.inputFormData.checklistRemark1,
            checklistRemark2: this.inputFormData.checklistRemark2,
            checklistRemark3: this.inputFormData.checklistRemark3,
            checklistRemark4: this.inputFormData.checklistRemark4,
            checklistRemark5: this.inputFormData.checklistRemark5,
            checklistRemark6: this.inputFormData.checklistRemark6,
            checklistRemark7: this.inputFormData.checklistRemark7,

            // step5
            // TODO: 問 Min  attachments?: Parse.File[];
            attachments: this.inputFormData.attachments,

            // step6
            termsAccepted: this.inputFormData.termsAccepted,

            // step7
            persons: this.inputFormData.persons,

            // step8
            accessGroups: this.inputFormData.accessGroups

        };

        await this.$server
            .U("/flow1/crms", updateParam)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                     Dialog.success(this._("w_SaveSuccess"));

                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async doSubmit() {

        await this.tempSave();

        const doSubmitParam = {
            objectId: this.selectedDetail.objectId,
        };

        if (this.isApproval) {
            Loading.show();
            await this.$server
                .U("/flow1/crms/status-approve", doSubmitParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Dialog_SuccessTitle"));
                        },
                        this._("w_Dialog_ErrorTitle")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_Dialog_ErrorTitle")
                    );
                });

            this.$emit("submit-data", doSubmitParam);
        } else {
            Loading.show();
            await this.$server
                .U("/flow1/crms/status-reject", doSubmitParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Dialog_SuccessTitle"));
                        },
                        this._("w_Dialog_ErrorTitle")
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(
                        this,
                        e,
                        this._("w_Dialog_ErrorTitle")
                    );
                });

            this.$emit("submit-data", doSubmitParam);
        }



        // if (this.isChange) {
        //     Dialog.confirm(
        //         this._("w_Save_Checked"),
        //         this._("w_Save_Checked"),
        //         () => {
        //             this.doSubmitApi();
        //         }
        //     );
        // } else {
        //     this.doSubmitApi();
        // }
    }

    async doSubmitApi() {
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
.step5Imgs {
    width: 100%;
    height: 100%;
}
.step5Div {
    height: 100px;
    width: 100px;
    border: 1px solid black;
    position: relative;
    margin: 10px;
}
.close {
    /* still bad on picking color */
    background: orange;
    color: red;
    /* make a round button */
    border-radius: 12px;
    /* center text */
    line-height: 20px;
    text-align: center;
    height: 20px;
    width: 20px;
    font-size: 18px;
    padding: 1px;
}
/* use cross as close button */
.close::before {
    content: "\2716";
}
/* place the button on top-right */
.close {
    top: -10px;
    right: -10px;
    position: absolute;
}
</style>




