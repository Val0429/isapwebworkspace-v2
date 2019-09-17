<template>
    <div class="animated fadeIn">

        <iv-auto-card
            v-show="transition.step == 1"
            :label="_('w_ViewPTW_StepTitle') "
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
                            <step2-add-use
                                class="col-md-12"
                                :selectedDetail="selectedDetail"
                                @step2="receiveStep2Data"
                            ></step2-add-use>
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
                                :selectedDetail="selectedDetail"
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
                                :selectedDetail="selectedDetail"
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
                                :selectedDetail="selectedDetail"
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

                                <!-- pdf upload -->
                                <img
                                    v-if="file.url == undefined && fileType(file) == 'pdf'"
                                    class="step5Pdf"
                                    :src="imageBase64.pdfEmpty"
                                />
                                <div v-if="file.url == undefined && fileType(file) == 'pdf'"
                                >{{file.name}}</div>

                                <!-- image upload -->
                                <img
                                    v-if="file.url == undefined && fileType(file) == 'image'"
                                    class="step5Imgs"
                                    :src="file.base64"
                                />
                                <a
                                    v-if="file.url == undefined && fileType(file) == 'image'"
                                    target="_blank"
                                    :href="file.base64"
                                    :download="file.name"
                                >{{file.name}}</a>

                                <!-- pdf download -->
                                <img
                                    v-if="file.url && fileType(file) == 'pdf'"
                                    class="step5Pdf"
                                    :src="imageBase64.pdfEmpty"
                                />
                                <a
                                    v-if="file.url && fileType(file) == 'pdf'"
                                    target="_blank"
                                    :href="file.url"
                                    :download="file.name"
                                >{{file.name}}</a>

                                <!-- image download -->
                                <img
                                    v-if="file.url && fileType(file) == 'image'"
                                    class="step5Imgs"
                                    :src="file.base64"
                                />
                                <a
                                    v-if="file.url && fileType(file) == 'image'"
                                    target="_blank"
                                    :href="file.url"
                                    :download="file.name"
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
                        :selectedDetail="selectedDetail"
                        :value="inputFormData"
                        @submit="doSubmit($event)"
                    >
                        <template #step7>
                            <step7
                                class="col-md-12"
                                :selectedDetail="selectedDetail"
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
                    @click="tempSave()"
                >{{ _('w_Save') }}
                </b-button>
            </template>

        </iv-auto-card>

        <iv-card
            v-show="transition.step == 2"
            :label="_('w_ViewPTW_ResultTitle')"
        >
            <div
                v-if="errorText == ''"
                class="ptw-result-content success"
            >{{ _("w_ViewPTW_ResultSuccessContent") }}</div>
            <div
                v-if="errorText != ''"
                class="ptw-result-content failed"
            >{{ errorText }}</div>
        </iv-card>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import axios from "axios";
import ServerConfig from "@/services/ServerConfig";

import Step1 from "@/components/ContractorRegistration/Step1.vue";
import Step2 from "@/components/ContractorRegistration/Step2.vue";
import Step3 from "@/components/ContractorRegistration/Step3.vue";
import Step4 from "@/components/ContractorRegistration/Step4.vue";
import Step5 from "@/components/ContractorRegistration/Step5.vue";
import Step6 from "@/components/ContractorRegistration/Step6.vue";
import Step7 from "@/components/ContractorRegistration/Step7.vue";
import Step8 from "@/components/ContractorRegistration/Step8.vue";
import Step2AddUse from "@/components/ContractorRegistration/Step2AddUse.vue";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";
import ImageBase64 from "@/services/ImageBase64";
import Datetime from "@/services/Datetime";
import RegistrationService from "@/components/ContractorRegistration/RegistrationService";

@Component({
    components: {
        Step1,
        Step2,
        Step3,
        Step4,
        Step5,
        Step6,
        Step7,
        Step8,
        Step2AddUse
    }
})
export class AddPTWByCR extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    errorText = "";

    imageBase64 = ImageBase64;
    publicHosting: string = "";

    // step 相關
    isMounted: boolean = false;
    isChange: boolean = false;
    doMounted() {
        this.isMounted = true;
    }

    inputFormData: any = {
        //
        verify: "",

        // step1
        pdpaAccepted: "",

        // step2
        // PTW Data
        ptwId: "",
        tenant: "",
        workCategory: "",

        // Contractor Information
        applicantName: "",
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

        // step5
        attachments: [],

        // step6
        termsAccepted: "",

        // step7
        persons: [],

        // step8
        accessGroups: []
    };

    selectedDetail: any = {
        ptwId: "",
        tenant: "",
        workCategory: ""
    };

    async created() {
        await this.initPublicIP();
        await this.initTenant();
        if (this.selectedDetail.length) {
            this.inputFormData = this.selectedDetail as any;
        }
    }

    mounted() {}

     fileType(file): string {
        let result = '';
        if (file.type.indexOf('pdf') >= 0) {
            result = 'pdf';
        } else if (file.type.indexOf('image') >= 0) {
            result = 'image';
        } else if (file.type.indexOf('jpeg') >= 0) {
            result = 'image';
        } else if (file.type.indexOf('jpg') >= 0) {
            result = 'image';
        } else if (file.type.indexOf('png') >= 0) {
            result = 'image';
        }
        return result;
    }

    async initPublicIP() {
        axios
            .get(ServerConfig.url + "flow1/crms/hosting")
            .then(response => {
                this.publicHosting = response.data
                    ? response.data
                    : ServerConfig.url;
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    async initTenant() {
        if (this.$route.query.id !== undefined) {
            this.inputFormData.verify = this.$route.query.id;
        }

        let param: any = {
            verify: this.inputFormData.verify,
            paging: { all: true }
        };

        await this.$server
            .R("/flow1/crms/tenant", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (response.company && response.company.objectId) {
                        this.selectedDetail.tenant = response.company.name;
                    }

                    if (
                        response.workCategory &&
                        response.workCategory.objectId
                    ) {
                        this.selectedDetail.workCategory =
                            response.workCategory.name;
                    }

                    this.selectedDetail.ptwId = response.ptwId;

                    this.selectedDetail.pdpaAccepted = response.pdpaAccepted;
                    this.selectedDetail.applicantName = response.applicantName;
                    this.selectedDetail.workPremisesUnit =
                        response.workPremisesUnit;
                    this.selectedDetail.contractorCompanyName =
                        response.contractorCompanyName;
                    this.selectedDetail.contractorCompanyAddress =
                        response.contractorCompanyAddress;
                    this.selectedDetail.contractorCompanyEmail =
                        response.contractorCompanyEmail;

                    this.selectedDetail.contractorCompanyContactPhone =
                        response.contractorCompanyContactPhone;
                    this.selectedDetail.contractorCompanyFax =
                        response.contractorCompanyFax;

                    this.selectedDetail.workLocation = response.workLocation;
                    this.selectedDetail.workDescription =
                        response.workDescription;
                    this.selectedDetail.workType1 = response.workType1;
                    this.selectedDetail.workType2 = response.workType2;
                    this.selectedDetail.workType3 = response.workType3;
                    this.selectedDetail.workType4 = response.workType4;
                    this.selectedDetail.workType5 = response.workType5;
                    this.selectedDetail.workType6 = response.workType6;
                    this.selectedDetail.workType7 = response.workType7;
                    this.selectedDetail.workType8 = response.workType8;

                    this.selectedDetail.workContact = response.workContact;
                    this.selectedDetail.workContactPhone =
                        response.workContactPhone;
                    this.selectedDetail.checklist1 = response.checklist1;
                    this.selectedDetail.checklistRemark1 =
                        response.checklistRemark1;
                    this.selectedDetail.checklist2 = response.checklist2;
                    this.selectedDetail.checklistRemark2 =
                        response.checklistRemark2;
                    this.selectedDetail.checklist3 = response.checklist3;
                    this.selectedDetail.checklistRemark3 =
                        response.checklistRemark3;
                    this.selectedDetail.checklist4 = response.checklist4;
                    this.selectedDetail.checklistRemark4 =
                        response.checklistRemark4;
                    this.selectedDetail.checklist5 = response.checklist5;
                    this.selectedDetail.checklistRemark5 =
                        response.checklistRemark5;
                    this.selectedDetail.checklist6 = response.checklist6;
                    this.selectedDetail.checklistRemark6 =
                        response.checklistRemark6;
                    this.selectedDetail.checklist7 = response.checklist7;
                    this.selectedDetail.checklistRemark7 =
                        response.checklistRemark7;
                    this.selectedDetail.checklist8 = response.checklist8;
                    this.selectedDetail.checklist9 = response.checklist9;

                    this.selectedDetail.termsAccepted = response.termsAccepted;
                    this.selectedDetail.persons = response.persons;

                    // Work Date time
                    let tempStartDate = new Date();
                    let tempEndDate = new Date();
                    if (response.workStartDate && response.workStartTime) {
                        tempStartDate = new Date(
                            `${Datetime.DateTime2String(
                                new Date(response.workStartDate),
                                Datetime.NewDateFormat
                            )} ${Datetime.DateTime2String(
                                new Date(response.workStartTime),
                                Datetime.NewTimeFormat
                            )}`
                        );
                    }
                    if (response.workEndDate && response.workEndTime) {
                        tempEndDate = new Date(
                            `${Datetime.DateTime2String(
                                new Date(response.workEndDate),
                                Datetime.NewDateFormat
                            )} ${Datetime.DateTime2String(
                                new Date(response.workEndTime),
                                Datetime.NewTimeFormat
                            )}`
                        );
                    }
                    this.selectedDetail.workStartDate = tempStartDate;
                    this.selectedDetail.workStartTime = new Date(
                        tempStartDate.setMinutes(tempStartDate.getMinutes() + 5)
                    );
                    this.selectedDetail.workEndDate = tempEndDate;
                    this.selectedDetail.workEndTime = new Date(
                        tempEndDate.setHours(tempEndDate.getHours() + 1)
                    );

                    // attachments
                    this.selectedDetail.attachments = [];
                    for (let attachment of response.attachments) {
                        ImageBase64.urlToBase64(
                            this.selectedDetail,
                            attachment.url,
                            (item: any, base64: any) => {
                                let tempAttachment = {
                                    name: attachment.name,
                                    type: attachment.type,
                                    base64: base64,
                                    url: attachment.url
                                };
                                item.attachments.push(tempAttachment);
                            }
                        );
                    }

                    /////// inputFormData

                    if (response.company && response.company.objectId) {
                        this.inputFormData.tenant = response.company.name;
                    }

                    if (
                        response.workCategory &&
                        response.workCategory.objectId
                    ) {
                        this.inputFormData.workCategory =
                            response.workCategory.name;
                    }

                    this.inputFormData.ptwId = response.ptwId;

                    this.inputFormData.pdpaAccepted = response.pdpaAccepted;
                    this.inputFormData.applicantName = response.applicantName;
                    this.inputFormData.workPremisesUnit =
                        response.workPremisesUnit;
                    this.inputFormData.contractorCompanyName =
                        response.contractorCompanyName;
                    this.inputFormData.contractorCompanyAddress =
                        response.contractorCompanyAddress;
                    this.inputFormData.contractorCompanyEmail =
                        response.contractorCompanyEmail;
                    this.inputFormData.contractorCompanyContactPhone =
                        response.contractorCompanyContactPhone;
                    this.inputFormData.contractorCompanyFax =
                        response.contractorCompanyFax;

                    this.inputFormData.workLocation = response.workLocation;
                    this.inputFormData.workDescription =
                        response.workDescription;
                    this.inputFormData.workType1 = response.workType1;
                    this.inputFormData.workType2 = response.workType2;
                    this.inputFormData.workType3 = response.workType3;
                    this.inputFormData.workType4 = response.workType4;
                    this.inputFormData.workType5 = response.workType5;
                    this.inputFormData.workType6 = response.workType6;
                    this.inputFormData.workType7 = response.workType7;
                    this.inputFormData.workType8 = response.workType8;
                    this.inputFormData.workStartDate = response.workStartDate
                        ? response.workStartDate
                        : new Date();
                    this.inputFormData.workStartTime = response.workStartTime
                        ? response.workStartTime
                        : new Date();
                    this.inputFormData.workEndDate = response.workEndDate
                        ? response.workEndDate
                        : new Date();
                    this.inputFormData.workEndTime = response.workEndTime
                        ? response.workEndTime
                        : new Date();
                    this.inputFormData.workContact = response.workContact;
                    this.inputFormData.workContactPhone =
                        response.workContactPhone;

                    this.inputFormData.checklist1 = response.checklist1;
                    this.inputFormData.checklistRemark1 =
                        response.checklistRemark1;
                    this.inputFormData.checklist2 = response.checklist2;
                    this.inputFormData.checklistRemark2 =
                        response.checklistRemark2;
                    this.inputFormData.checklist3 = response.checklist3;
                    this.inputFormData.checklistRemark3 =
                        response.checklistRemark3;
                    this.inputFormData.checklist4 = response.checklist4;
                    this.inputFormData.checklistRemark4 =
                        response.checklistRemark4;
                    this.inputFormData.checklist5 = response.checklist5;
                    this.inputFormData.checklistRemark5 =
                        response.checklistRemark5;
                    this.inputFormData.checklist6 = response.checklist6;
                    this.inputFormData.checklistRemark6 =
                        response.checklistRemark6;
                    this.inputFormData.checklist7 = response.checklist7;
                    this.inputFormData.checklistRemark7 =
                        response.checklistRemark7;
                    this.inputFormData.checklist8 = response.checklist8;
                    this.inputFormData.checklist9 = response.checklist9;

                    this.inputFormData.termsAccepted = response.termsAccepted;
                    this.inputFormData.persons = response.persons;

                    // attachments
                    this.inputFormData.attachments = [];
                    for (let attachment of response.attachments) {
                        ImageBase64.urlToBase64(
                            this.inputFormData,
                            attachment.url,
                            (item: any, base64: any) => {
                                let tempAttachment = {
                                    name: attachment.name,
                                    type: attachment.type,
                                    base64: base64,
                                    url: attachment.url
                                };
                                item.attachments.push(tempAttachment);
                            }
                        );
                    }
                });
                this.$emit("checkVerification", true);
            })
            .catch((e: any) => {
                Loading.hide();
                this.$emit("checkVerification", false);
            });
    }

    ////////////////////////////// step 1  //////////////////////////////

    receiveStep1Data(step1Date) {
        this.inputFormData.pdpaAccepted = step1Date;
    }

    async stepTo2() {
        let stepRef: any = this.$refs.step;

        if (!this.inputFormData.pdpaAccepted) {
            Dialog.error(this._("w_ViewPTW_Step1_ErrorTip"));
            stepRef.currentStep = 0;
            return false;
        }

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

    receiveStep2Data(step2Data) {
        // PTW Data
        this.inputFormData.ptwId = step2Data.ptwId;
        this.inputFormData.tenant = step2Data.tenant;
        this.inputFormData.workCategory = step2Data.workCategory;

        // Contractor Information
        this.inputFormData.applicantName = step2Data.applicantName;

        // Company
        this.inputFormData.contractorCompanyName =
            step2Data.contractorCompanyName;
        this.inputFormData.contractorCompanyAddress =
            step2Data.contractorCompanyAddress;
        this.inputFormData.contractorCompanyEmail =
            step2Data.contractorCompanyEmail;
        this.inputFormData.contractorCompanyContactPhone =
            step2Data.contractorCompanyContactPhone;
        this.inputFormData.contractorCompanyFax =
            step2Data.contractorCompanyFax;
    }

    async stepTo3() {
        let stepRef: any = this.$refs.step;

        let regex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
        if (!regex.test(this.inputFormData.contractorCompanyEmail)) {
            Dialog.error(this._("w_Invitation_EmadilError"));
            stepRef.currentStep = 1;
            return false;
        }

        if (
            !this.inputFormData.applicantName ||
            !this.inputFormData.contractorCompanyName ||
            !this.inputFormData.contractorCompanyAddress ||
            !this.inputFormData.contractorCompanyEmail ||
            !this.inputFormData.contractorCompanyContactPhone ||
            !this.inputFormData.contractorCompanyFax
        ) {
            Dialog.error(this._("w_ViewPTW_Step_ErrorTip"));
            stepRef.currentStep = 1;
            return false;
        }

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
        this.inputFormData.workType1 = step3Date.workType1
            ? step3Date.workType1
            : false;
        this.inputFormData.workType2 = step3Date.workType2
            ? step3Date.workType2
            : false;
        this.inputFormData.workType3 = step3Date.workType3
            ? step3Date.workType3
            : false;
        this.inputFormData.workType4 = step3Date.workType4
            ? step3Date.workType4
            : false;
        this.inputFormData.workType5 = step3Date.workType5
            ? step3Date.workType5
            : false;
        this.inputFormData.workType6 = step3Date.workType6
            ? step3Date.workType6
            : false;
        this.inputFormData.workType7 = step3Date.workType7
            ? step3Date.workType7
            : false;
        this.inputFormData.workType8 = step3Date.workType8
            ? step3Date.workType8
            : false;
        this.inputFormData.workStartDate = step3Date.workStartDate;
        this.inputFormData.workStartTime = step3Date.workStartTime;
        this.inputFormData.workEndDate = step3Date.workEndDate;
        this.inputFormData.workEndTime = step3Date.workEndTime;
        this.inputFormData.workContact = step3Date.workContact;
        this.inputFormData.workContactPhone = step3Date.workContactPhone;
    }

    async stepTo4() {
        let stepRef: any = this.$refs.step;

        if (
            !this.inputFormData.workPremisesUnit ||
            !this.inputFormData.workLocation ||
            !this.inputFormData.workDescription ||
            !this.inputFormData.workStartDate ||
            !this.inputFormData.workStartTime ||
            !this.inputFormData.workEndTime ||
            !this.inputFormData.workEndTime ||
            !this.inputFormData.workContact ||
            !this.inputFormData.workContactPhone
        ) {
            Dialog.error(this._("w_ViewPTW_Step_ErrorTip"));
            stepRef.currentStep = 2;
            return false;
        }

        if (!RegistrationService.checkWorkDate(this, this.inputFormData)) {
            stepRef.currentStep = 2;
            return false;
        }

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
    }

    async stepTo5() {
        let stepRef: any = this.$refs.step;

        if (
            !this.inputFormData.checklist1 ||
            !this.inputFormData.checklist2 ||
            !this.inputFormData.checklist3 ||
            !this.inputFormData.checklist4 ||
            !this.inputFormData.checklist5 ||
            !this.inputFormData.checklist6 ||
            !this.inputFormData.checklist7 ||
            !this.inputFormData.checklist8 ||
            !this.inputFormData.checklist9
        ) {
            Dialog.error(this._("w_ViewPTW_Step_ErrorTipYes"));
            stepRef.currentStep = 3;
            return false;
        }

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

    receiveStep5Data(step5Date) {}

    deleteStep5File(base64) {
        this.inputFormData.attachments = this.inputFormData.attachments.filter(
            s => s.base64 != base64
        );
    }

    putStep5File(files) {
        for (let file of files) {
            if (
                file.type.indexOf("pdf") < 0 &&
                file.type.indexOf("image") < 0
            ) {
                continue;
            }

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
    }

    async stepTo6() {
        let stepRef: any = this.$refs.step;

        // TODO: 全部step OK
        if (!this.inputFormData.attachments) {
            Dialog.error(this._("w_ViewPTW_Step1_ErrorTip"));
            stepRef.currentStep = 4;
            return false;
        }

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

        if (!this.inputFormData.termsAccepted) {
            Dialog.error(this._("w_ViewPTW_Step1_ErrorTip"));
            stepRef.currentStep = 5;
            return false;
        }
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
    }

    async stepTo8() {}

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
        this.inputFormData.accessGroups = step8Date.accessGroup;
    }

    async doSubmit() {
        let stepRef: any = this.$refs.step;

        const doSubmitParam = {
            verify: this.inputFormData.verify
        };

        if (!(await this.tempSave())) {
            return false;
        }

        await Dialog.confirm(
            this._("w_Save_SubmitChecked"),
            this._("w_Save_SubmitCheck"),
            () => {
                Loading.show();
                this.$server
                    .U("/flow1/crms/status-pedding", doSubmitParam)
                    .then((response: any) => {
                        ResponseFilter.successCheck(
                            this,
                            response,
                            (response: any) => {
                                Dialog.success(this._("w_PTW_SubmitSuccess"));
                                this.transition.step = 2;
                            },
                            this._("w_Dialog_ErrorTitle")
                        );
                    })
                    .catch((e: any) => {
                        Loading.hide();
                        Dialog.error(e.body);
                        this.errorText = e.body;
                        this.transition.step = 2;
                    });
            }
        );
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
        let result: boolean = false;

        const updateParam = {
            verify: this.inputFormData.verify,
            // contact: ???.contact,
            // contactEmail: ???.contactEmail,

            // Step 1
            pdpaAccepted: this.inputFormData.pdpaAccepted,

            // step2
            // Contractor Information
            applicantName: this.inputFormData.applicantName,

            // Company
            contractorCompanyName: this.inputFormData.contractorCompanyName,
            contractorCompanyAddress: this.inputFormData
                .contractorCompanyAddress,
            contractorCompanyEmail: this.inputFormData.contractorCompanyEmail,
            contractorCompanyContactPhone: this.inputFormData
                .contractorCompanyContactPhone,
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
            attachments: [],

            // step6
            termsAccepted: this.inputFormData.termsAccepted,

            // step7
            persons: this.inputFormData.persons
                ? this.inputFormData.persons
                : []
        };

        for (let attachment of this.inputFormData.attachments) {
            updateParam.attachments.push(attachment.base64);
        }

        await this.$server
            .U("/flow1/crms/tenant", updateParam)
            .then((response: any) => {
                ResponseFilter.successCheck(
                    this,
                    response,
                    (response: any) => {}
                );

                result = true;
                return result;
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });

        return result;
    }
}

export default AddPTWByCR;
Vue.component("add-ptw-by-cr", AddPTWByCR);
</script>

<style lang="scss" scoped>
.step5Imgs {
    width: 100%;
}
.step5Pdf{
    width: 70%;
    margin-left: 15%;
    margin-right: 15%;
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
.ptw-result-content {
    text-align: center;
    font-size: 3rem;
    &.success {
        color: green;
    }
    &.failed {
        color: red;
    }
}
</style>
