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
                            <view-step1
                                :selectedDetail="selectedDetail"
                                @step1="receiveStep1Data"
                            ></view-step1>
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
                            <view-step2
                                :permission="true"
                                :selectedDetail="selectedDetail"
                                class="col-md-12"
                                @step2="receiveStep2Data"
                            ></view-step2>
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
                            <view-step3
                                :selectedDetail="selectedDetail"
                                class="col-md-12"
                                @step3="receiveStep3Data"
                            ></view-step3>
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
                            <view-step4
                                :selectedDetail="selectedDetail"
                                class="col-md-12"
                                @step4="receiveStep4Data"
                            ></view-step4>
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
                            <view-step5
                                :selectedDetail="selectedDetail"
                                class="col-md-12"
                                :permission="true"
                                @step5="receiveStep5Data"
                                @putStep5File="putStep5File"
                            ></view-step5>

                            <div
                                v-if="inputFormData.attachments"
                                v-for="file in  inputFormData.attachments"
                                class="step5Div"
                            >
                                <img
                                    v-if="file.type.indexOf('pdf') >= 0"
                                    class="step5Imgs"
                                    :src="imageBase64.pdfEmpty"
                                >
                                <img
                                    v-else
                                    class="step5Imgs"
                                    :src="file.base64"
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
                            <view-step6
                                :selectedDetail="selectedDetail"
                                class="col-md-12"
                                @step6="receiveStep6Data"
                            ></view-step6>
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
                            <view-step7
                                :selectedDetail="selectedDetail"
                                :permission="true"
                                class="col-md-12"
                                @step7="receiveStep7Data"
                            ></view-step7>
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
                            <step8-not-expire
                                :selectedDetail="selectedDetail"
                                class="col-md-12"
                                @step8="receiveStep8Data"
                            ></step8-not-expire>
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

            </template>

        </iv-auto-card>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import ViewStep1 from "@/components/ContractorRegistration/ViewStep1.vue";
import ViewStep2 from "@/components/ContractorRegistration/ViewStep2.vue";
import ViewStep3 from "@/components/ContractorRegistration/ViewStep3.vue";
import ViewStep4 from "@/components/ContractorRegistration/ViewStep4.vue";
import ViewStep5 from "@/components/ContractorRegistration/ViewStep5.vue";
import ViewStep6 from "@/components/ContractorRegistration/ViewStep6.vue";
import ViewStep7 from "@/components/ContractorRegistration/ViewStep7.vue";
import Step8 from "@/components/ContractorRegistration/Step8.vue";
import Step8NotExpire from "@/components/ContractorRegistration/Step8NotExpire.vue";

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
import Datetime from "@/services/Datetime";

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
    components: {
        ViewStep1,
        ViewStep2,
        ViewStep3,
        ViewStep4,
        ViewStep5,
        ViewStep6,
        ViewStep7,
        Step8,
        Step8NotExpire
    }
})
export class StatusApproveNotExpireDate extends Vue {
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
        contractorCompanyContactPhone: "",
        contractorCompanyFax: "",

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

    created() {}

    mounted() {
        this.initInputFormData();
    }

    initInputFormData() {
        if (
            this.selectedDetail.company &&
            this.selectedDetail.company.objectId
        ) {
            this.inputFormData.tenant = this.selectedDetail.company.objectId;
        }

        if (
            this.selectedDetail.workCategory &&
            this.selectedDetail.workCategory.objectId
        ) {
            this.inputFormData.workCategoryId = this.selectedDetail.workCategory.objectId;
        }

        this.inputFormData.ptwId = this.selectedDetail.ptwId;

        this.inputFormData.pdpaAccepted = this.selectedDetail.pdpaAccepted;
        this.inputFormData.applicantName = this.selectedDetail.applicantName;
        this.inputFormData.contractorCompanyName = this.selectedDetail.contractorCompanyName;
        this.inputFormData.contractorCompanyAddress = this.selectedDetail.contractorCompanyAddress;
        this.inputFormData.contractorCompanyEmail = this.selectedDetail.contractorCompanyEmail;

        this.inputFormData.contractorCompanyContactPhone = this.selectedDetail.contractorCompanyContactPhone;
        this.inputFormData.contractorCompanyFax = this.selectedDetail.contractorCompanyFax;

        this.inputFormData.workPremisesUnit = this.selectedDetail.workPremisesUnit;
        this.inputFormData.workLocation = this.selectedDetail.workLocation;
        this.inputFormData.workDescription = this.selectedDetail.workDescription;
        this.inputFormData.workType1 = this.selectedDetail.workType1;
        this.inputFormData.workType2 = this.selectedDetail.workType2;
        this.inputFormData.workType3 = this.selectedDetail.workType3;
        this.inputFormData.workType4 = this.selectedDetail.workType4;
        this.inputFormData.workType5 = this.selectedDetail.workType5;
        this.inputFormData.workType6 = this.selectedDetail.workType6;
        this.inputFormData.workType7 = this.selectedDetail.workType7;
        this.inputFormData.workType8 = this.selectedDetail.workType8;
        this.inputFormData.workStartDate = this.selectedDetail.workStartDate
            ? this.selectedDetail.workStartDate
            : new Date();
        this.inputFormData.workStartTime = this.selectedDetail.workStartDate
            ? this.selectedDetail.workStartDate
            : new Date();
        this.inputFormData.workEndDate = this.selectedDetail.workEndDate
            ? this.selectedDetail.workEndDate
            : new Date();
        this.inputFormData.workEndTime = this.selectedDetail.workEndDate
            ? this.selectedDetail.workEndDate
            : new Date();
        this.inputFormData.workContact = this.selectedDetail.workContact;
        this.inputFormData.workContactPhone = this.selectedDetail.workContactPhone;

        this.inputFormData.checklist1 = this.selectedDetail.checklist1;
        this.inputFormData.checklistRemark1 = this.selectedDetail.checklistRemark1;
        this.inputFormData.checklist2 = this.selectedDetail.checklist2;
        this.inputFormData.checklistRemark2 = this.selectedDetail.checklistRemark2;
        this.inputFormData.checklist3 = this.selectedDetail.checklist3;
        this.inputFormData.checklistRemark3 = this.selectedDetail.checklistRemark3;
        this.inputFormData.checklist4 = this.selectedDetail.checklist4;
        this.inputFormData.checklistRemark4 = this.selectedDetail.checklistRemark4;
        this.inputFormData.checklist5 = this.selectedDetail.checklist5;
        this.inputFormData.checklistRemark5 = this.selectedDetail.checklistRemark5;
        this.inputFormData.checklist6 = this.selectedDetail.checklist6;
        this.inputFormData.checklistRemark6 = this.selectedDetail.checklistRemark6;
        this.inputFormData.checklist7 = this.selectedDetail.checklist7;
        this.inputFormData.checklistRemark7 = this.selectedDetail.checklistRemark7;
        this.inputFormData.checklist8 = this.selectedDetail.checklist8;
        this.inputFormData.checklist9 = this.selectedDetail.checklist9;

        this.inputFormData.termsAccepted = this.selectedDetail.termsAccepted;
        this.inputFormData.persons = this.selectedDetail.persons;

        // Work Date time
        let tempStartDate = new Date();
        let tempEndDate = new Date();
        if (
            this.selectedDetail.workStartDate &&
            this.selectedDetail.workStartTime
        ) {
            tempStartDate = new Date(
                `${Datetime.DateTime2String(
                    new Date(this.selectedDetail.workStartDate),
                    Datetime.NewDateFormat
                )} ${Datetime.DateTime2String(
                    new Date(this.selectedDetail.workStartTime),
                    Datetime.NewTimeFormat
                )}`
            );
        }
        if (
            this.selectedDetail.workEndDate &&
            this.selectedDetail.workEndTime
        ) {
            tempEndDate = new Date(
                `${Datetime.DateTime2String(
                    new Date(this.selectedDetail.workEndDate),
                    Datetime.NewDateFormat
                )} ${Datetime.DateTime2String(
                    new Date(this.selectedDetail.workEndTime),
                    Datetime.NewTimeFormat
                )}`
            );
        }
        this.inputFormData.workStartDate = tempStartDate;
        this.inputFormData.workStartTime = tempStartDate;
        this.inputFormData.workEndDate = tempEndDate;
        this.inputFormData.workEndTime = tempEndDate;

        // attachments
        this.inputFormData.attachments = [];
        for (let attachment of this.selectedDetail.attachments) {
            ImageBase64.urlToBase64(
                this.inputFormData,
                attachment.url,
                (item: any, base64: any) => {
                    let tempAttachment = {
                        name: attachment.name,
                        type: attachment.type,
                        base64: base64
                    };
                    item.attachments.push(tempAttachment);
                }
            );
        }
    }

    pageToList() {
        this.$emit("edit-ptw-back-to-list");
    }

    ////////////////////////////// step 1  //////////////////////////////

    receiveStep1Data(step1Date) {
        this.inputFormData.pdpaAccepted = step1Date;
    }

    stepTo2() {
        let stepRef: any = this.$refs.step;

        // TODO: 全部step OK
        // if (!this.inputFormData.pdpaAccepted) {
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
        this.inputFormData.ptwId = step2Date.ptwId;
        this.inputFormData.tenant = step2Date.tenant;
        this.inputFormData.workCategory = step2Date.workCategory;

        // Contractor Information
        this.inputFormData.applicantName = step2Date.applicantName;

        // Company
        this.inputFormData.contractorCompanyName =
            step2Date.contractorCompanyName;
        this.inputFormData.contractorCompanyAddress =
            step2Date.contractorCompanyAddress;
        this.inputFormData.contractorCompanyEmail =
            step2Date.contractorCompanyEmail;
        this.inputFormData.contractorCompanyContactPhone =
            step2Date.contractorCompanyContactPhone;
        this.inputFormData.contractorCompanyFax =
            step2Date.contractorCompanyFax;

        this.isChange = true;
    }

    stepTo3() {
        let stepRef: any = this.$refs.step;

        // TODO: wait下拉選單 和 全部step OK
        // if (
        //     !this.inputFormData.ptwId ||
        //     !this.inputFormData.tenant ||
        //     !this.inputFormData.workCategory ||
        //     !this.inputFormData.applicantName ||
        //     !this.inputFormData.companyName ||
        //     !this.inputFormData.companyAddress ||
        //     !this.inputFormData.companyEmail ||
        //     !this.inputFormData.companyContactPhone ||
        //     !this.inputFormData.companyFax
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

        this.isChange = true;
    }

    stepTo4() {
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

        this.isChange = true;
    }

    stepTo5() {
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

    putStep5File(files) {
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
    }

    stepTo6() {
        let stepRef: any = this.$refs.step;

        // TODO: 全部step OK
        // if (!this.inputFormData.attachments) {
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
        this.inputFormData.termsAccepted = step6Date;
    }

    stepTo7() {
        let stepRef: any = this.$refs.step;

        // TODO: 全部step OK
        // if (!this.inputFormData.termsAccepted) {
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
        this.inputFormData.persons = step7Date;

        this.isChange = true;
    }

    stepTo8() {
        let stepRef: any = this.$refs.step;

        // TODO: 全部step OK
        // if (this.inputFormData.persons === 0) {
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
        this.inputFormData.workStartDate = step8Date.workStartDate;
        this.inputFormData.workStartTime = step8Date.workStartTime;
        this.inputFormData.workEndDate = step8Date.workEndDate;
        this.inputFormData.workEndTime = step8Date.workEndTime;
        this.inputFormData.accessGroups = step8Date.accessGroups;

        this.isChange = true;
    }

    async doSubmit() {
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

        await this.tempSave();

        const doSubmitParam = {
            objectId: this.selectedDetail.objectId
        };

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

        this.$emit("edit-ptw-back-to-list");
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

        this.$emit("view-done", doSubmitParam);
    }

    IStep8() {
        return `
            interface {
                step8?: any;
            }`;
    }

    ////////////////////////////// step 8  //////////////////////////////

    async tempSave() {
        this.isChange = false;

        const updateParam = {
            objectId: this.selectedDetail.objectId,

            workStartDate: this.inputFormData.workStartDate,
            workStartTime: this.inputFormData.workStartTime,
            workEndDate: this.inputFormData.workEndDate,
            workEndTime: this.inputFormData.workEndTime,

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
}

export default StatusApproveNotExpireDate;
Vue.component(
    "status-approve-not-expire-date-edit",
    StatusApproveNotExpireDate
);
</script>

<style lang="scss" scoped>
.step5Imgs {
    width: 100%;
}
.step5Div {
    width: 20%;
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




