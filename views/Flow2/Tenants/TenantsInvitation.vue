<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <iv-card
                key="transition_1"
                v-show="transition.step === 1"
                :label="_('w_Tenants_InvitationList')"
            >
                <template
                    #toolbox
                    v-if="showModifyTool()"
                >
                    <iv-toolbox-view
                        :disabled="selectedDetail.length !== 1"
                        @click="pageToView"
                    />
                    <iv-toolbox-delete
                        :disabled="selectedDetail.length === 0"
                        @click="doDelete"
                    />
                    <iv-toolbox-divider />
                    <iv-toolbox-add @click="pageToAdd" />
                    <iv-toolbox-upload-csv @click="pageToUploadCSV" />
                </template>

                <iv-table
                    ref="listTable"
                    :interface="ITableList()"
                    :multiple="tableMultiple"
                    :server="{ path: '/flow2/visitors/invites' }"
                    :selectable="showModifyTool()"
                    @selected="selectedItem($event)"
                >

                    <template #phone="{$attrs}">
                        <div>{{$attrs.row.visitors[0] != undefined && $attrs.row.visitors[0].phone != undefined ? $attrs.row.visitors[0].phone : ''}}</div>
                    </template>

                    <template #name="{$attrs}">
                        <div>{{$attrs.row.visitors[0] != undefined && $attrs.row.visitors[0].name != undefined ? $attrs.row.visitors[0].name : ''}}</div>
                    </template>

                    <template #email="{$attrs}">
                        <div>{{$attrs.row.visitors[0] != undefined && $attrs.row.visitors[0].email != undefined ? $attrs.row.visitors[0].email : ''}}</div>
                    </template>

                    <template #status="{$attrs}">
                        <div>{{$attrs.row.cancelled ? _('w_Cancelled') : $attrs.row.visitors[0].status}}</div>
                    </template>

                    <template #startDate="{$attrs}">
                        <div>{{ resolveDatetimeStart($attrs.row.dates) }}</div>
                    </template>

                    <template #endDate="{$attrs}">
                        <div>{{ resolveDatetimeEnd($attrs.row.dates) }}</div>
                    </template>

                    <template
                        #Actions="{$attrs, $listeners}"
                        v-if="showModifyTool()"
                    >
                        <iv-toolbox-more
                            size="sm"
                            :disabled="selectedDetail.length !== 1"
                        >
                            <iv-toolbox-view @click="pageToView" />
                            <iv-toolbox-delete @click="doDelete" />
                        </iv-toolbox-more>
                    </template>

                </iv-table>
            </iv-card>

            <!-- view -->
            <iv-auto-card
                key="transition_2"
                v-show="transition.step === 2"
                :visible="true"
                :label="_('w_User_ViewUser') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IViewForm()"
                    :value="inputFormData"
                >
                </iv-form>

                <template #footer>
                    <b-button
                        variant="dark"
                        size="lg"
                        @click="pageToList()"
                    >{{ _('w_Back') }}
                    </b-button>
                </template>

            </iv-auto-card>

            <!-- Modify -->
            <iv-auto-card
                key="transition_3"
                v-show="transition.step === 3"
                :visible="true"
                :label="inputFormData.objectId == '' ? _('w_Tenants_AddInvitation') : _('w_Tenants_EditInvitation') "
            >
                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-form
                    :interface="IModifyForm()"
                    :value="inputFormData"
                    @update:*="updateModifyForm"
                    @submit="saveModifyForm($event)"
                >

                    <template #purpose="{ $attrs, $listeners }">

                        <iv-form-selection
                            v-on="$listeners"
                            v-bind="$attrs"
                            :options="selectItem.purposes"
                            :multiple="false"
                        >
                        </iv-form-selection>
                    </template>

                </iv-form>

                <template #footer-before>
                    <b-button
                        variant="dark"
                        size="lg"
                        @click="pageToList()"
                    >{{ _('w_Back') }}
                    </b-button>
                </template>

            </iv-auto-card>

            <iv-card
                key="transition_4"
                v-show="transition.step === 4"
                :label="_('w_TenantsInvitation_CardTitle')"
            >

                <template #toolbox>
                    <iv-toolbox-back @click="pageToList()" />
                </template>

                <iv-step-progress
                    ref="progressStep"
                    @mounted="doMounted"
                >

                    <template #1-title>{{ _('w_TenantsInvitation_Step1') }}</template>
                    <template #1>
                        <b-button
                            class="col-md-12"
                            @click="downloadExample"
                        >{{ _('w_TenantsInvitation_Download') }}</b-button>
                    </template>

                    <template #2-title>{{ _('w_TenantsInvitation_Step2') }}</template>
                    <template #2>
                        <b-form-file
                            v-model="progressFile"
                            v-on:input="uploadProgressFile"
                        />
                    </template>

                    <template #3-title>{{ _('w_TenantsInvitation_Step3') }}</template>
                    <template #3>
                        <div>
                            <table class="table table-bordered table-hover datatable dataTable no-footer records-table">
                                <thead>
                                    <th>{{ _('w_Tenants_MobileNumber') }}</th>
                                    <th>{{ _('w_Tenants_Name') }}</th>
                                    <th>{{ _('w_Tenants_Email') }}</th>
                                    <th>{{ _('w_Tenants_Purpose') }}</th>
                                    <th>{{ _('w_Tenants_StartDate') }}</th>
                                    <th>{{ _('w_Tenants_EndDate') }}</th>
                                </thead>
                                <tbody>
                                    <tr v-for="value in progressFileContent">
                                        <td v-html="value.mobile != '' ? value.mobile : errorMessageInTable()"></td>
                                        <td v-html="value.name != '' ? value.name : errorMessageInTable()"></td>
                                        <td v-html="value.email != '' ? value.email : errorMessageInTable()"></td>
                                        <td v-html="value.purposeName != '' ? value.purposeName : errorMessageInTable()"></td>
                                        <td v-html="value.startDate != null ? changeDateToString(value.startDate) : errorMessageInTable()"></td>
                                        <td v-html="value.endDate  != null ? changeDateToString(value.endDate) : errorMessageInTable()"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </template>

                    <template #4-title>{{ _('w_TenantsInvitation_Step4') }}</template>
                    <template #4>
                        <div>
                            <table class="table table-bordered table-hover datatable dataTable no-footer records-table">
                                <thead>
                                    <th>{{ _('w_Tenants_MobileNumber') }}</th>
                                    <th>{{ _('w_Tenants_Name') }}</th>
                                    <th>{{ _('w_Tenants_Email') }}</th>
                                    <th>{{ _('w_Tenants_Purpose') }}</th>
                                    <th>{{ _('w_Tenants_StartDate') }}</th>
                                    <th>{{ _('w_Tenants_EndDate') }}</th>
                                    <th>{{ _('w_TenantsInvitation_ApiMessage') }}</th>
                                </thead>
                                <tbody>
                                    <tr v-for="value in progressFileContent">
                                        <td v-html="value.mobile"></td>
                                        <td v-html="value.name"></td>
                                        <td v-html="value.email"></td>
                                        <td v-html="value.purposeName"></td>
                                        <td v-html="value.startDate != null ? changeDateToString(value.startDate) : errorMessageInTable()"></td>
                                        <td v-html="value.endDate  != null ? changeDateToString(value.endDate) : errorMessageInTable()"></td>
                                        <td v-html="value.apiMessage"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </template>

                </iv-step-progress>

                <template
                    #footer
                    v-if="progressStep > 0"
                >
                    <b-button
                        v-if="progressStep > 1 && progressStep < 4"
                        variant="dark"
                        size="lg"
                        @click="pageToProgressPrev"
                    >{{ _('w_Prev') }}
                    </b-button>
                    <b-button
                        v-if="progressStep == 1"
                        variant="dark"
                        size="lg"
                        @click="pageToProgressStep2"
                    >{{ _('w_Next') }}
                    </b-button>
                    <b-button
                        v-if="progressStep == 3"
                        variant="dark"
                        size="lg"
                        :disabled="progressFileError"
                        @click="sendProgressFile"
                    >{{ _('w_Submit') }}
                    </b-button>
                    <b-button
                        key="transition_4"
                        v-if="progressStep == 4"
                        variant="dark"
                        size="lg"
                        @click="pageToList"
                    >{{ _('w_Back') }}
                    </b-button>

                </template>

            </iv-card>
        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
import ResponseFilter from "@/services/ResponseFilter";
import RoleService from "../../../services/Role/RoleService";
import Utility from "@/services/Utility";
import Loading from "@/services/Loading";

// Export
import toExcel from "@/services/Excel/json2excel";
import excel2json from "@/services/Excel/excel2json";

interface IExcelTitle {
    mobile: string;
    name: string;
    email: string;
    purpose: string;
    startDate: string;
    endDate: string;
}

interface IProgressFile {
    mobile: string;
    name: string;
    email: string;
    purposeId: string;
    purposeName: string;
    startDate: Date | null;
    endDate: Date | null;
    startDateText: string;
    endDateText: string;
    apiMessage: string;
}

@Component({
    components: {}
})
export default class TenantsInvitation extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    progressStep: number = 1;
    progressFile: any | null = null;
    progressFileError: boolean = false;
    progressFileContent: IProgressFile[] = [];

    progressStepRef: any = this.$refs.progressStep;
    progressExcelTitleName: IExcelTitle = {
        mobile: "mobile",
        name: "name",
        email: "email",
        purpose: "purpose",
        startDate: "startDate",
        endDate: "endDate"
    };

    tableMultiple: boolean = true;
    selectedDetail: any = [];

    inputFormData: any = {
        objectId: "",
        mobile: "",
        name: "",
        email: "",
        status: "",
        startDate: new Date(),
        endDate: new Date(),
        purpose: "",
        startString: "",
        endString: ""
    };

    selectItem: {
        purposes: any;
    } = {
        purposes: []
    };

    isMounted: boolean = false;
    doMounted() {
        this.isMounted = true;
    }

    created() {}

    mounted() {
        this.initSelectItemPurpose();
        this.progressStepRef = this.$refs.progressStep;
    }

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        this.clearInputData();
        (this.$refs.listTable as any).reload();

        this.progressStep = 1;
        this.progressFile = null;
        this.progressFileError = false;
        this.progressFileContent = [];
        this.progressStepRef.currentStep = 1;
    }

    pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
        this.clearInputData();
        this.getInputData();
    }

    pageToAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
    }

    pageToEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
    }

    pageToUploadCSV() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 4;
    }

    pageToProgressPrev() {
        if (this.progressStep >= 5) {
            this.pageToProgressStep4();
        } else if (this.progressStep == 4) {
            this.pageToProgressStep3();
        } else if (this.progressStep == 3) {
            this.pageToProgressStep2();
        } else {
            this.pageToProgressStep1();
        }
    }

    pageToProgressStep1() {
        this.progressFile = null;
        this.progressFileContent = [];
        this.progressStep = 1;
        this.progressFileError = false;
        this.stepToProgressStep();
    }

    pageToProgressStep2() {
        this.progressStep = 2;
        this.progressFileContent = [];
        this.progressFileError = false;
        this.progressFile = null;
        this.stepToProgressStep();
    }

    pageToProgressStep3() {
        this.progressStep = 3;
        this.stepToProgressStep();
    }

    pageToProgressStep4() {
        this.progressStep = 4;
        this.stepToProgressStep();
    }

    stepToProgressStep() {
        this.progressStepRef.currentStep = this.progressStep;
    }

    showModifyTool(): boolean {
        let result = false;
        result = RoleService.haveTenantUser(this);
        return result;
    }

    async initSelectItemPurpose() {
        const readParam: {} = {};

        await this.$server
            .R("/flow2/purposes", readParam)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response.results) {
                        let item = {
                            id: returnValue.objectId,
                            text: returnValue.name
                        };
                        this.selectItem.purposes.push(item);
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async doDelete() {
        for (let item of this.selectedDetail) {
            const deleteParam = {
                objectId: item.objectId,
                cancelled: true
            };

            await this.$server
                .U("/flow2/visitors/invites", deleteParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {}
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        }

        this.pageToList();
    }

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            mobile: "",
            name: "",
            email: "",
            status: "",
            startDate: new Date(),
            endDate: new Date(),
            purpose: "",
            startDateString: "",
            endDateString: ""
        };
    }

    selectedItem(datas: any) {
        this.selectedDetail = datas;
    }

    resolveDatetimeStartDate(dateStringList: any): Date {
        let result = new Date();
        let dataIndex = 0;
        if (
            dateStringList[dataIndex] != undefined &&
            dateStringList[dataIndex].start != undefined
        ) {
            result = new Date(dateStringList[dataIndex].start);
        }
        return result;
    }

    resolveDatetimeEndDate(dateStringList: any): Date {
        let result = new Date();
        let dataIndex = dateStringList.length - 1;
        if (
            dateStringList[dataIndex] != undefined &&
            dateStringList[dataIndex].end != undefined
        ) {
            result = new Date(dateStringList[dataIndex].end);
        }
        return result;
    }

    resolveDatetimeStart(dateStringList: any): string {
        let result = "";
        let dataIndex = 0;
        if (
            dateStringList[dataIndex] != undefined &&
            dateStringList[dataIndex].start != undefined
        ) {
            result = Datetime.DateTime2String(
                new Date(dateStringList[dataIndex].start),
                "YYYY-MM-DD"
            );
        }
        return result;
    }

    resolveDatetimeEnd(dateStringList: any): string {
        let result = "";
        let dataIndex = dateStringList.length - 1;
        if (
            dateStringList[dataIndex] != undefined &&
            dateStringList[dataIndex].end != undefined
        ) {
            result = Datetime.DateTime2String(
                new Date(dateStringList[dataIndex].end),
                "YYYY-MM-DD"
            );
        }
        return result;
    }

    getInputData() {
        for (const param of this.selectedDetail) {
            let visitorMobile =
                param.visitors != undefined &&
                param.visitors[0] != undefined &&
                param.visitors[0].phone != undefined
                    ? param.visitors[0].phone
                    : "";
            let visitorName =
                param.visitors != undefined &&
                param.visitors[0] != undefined &&
                param.visitors[0].name != undefined
                    ? param.visitors[0].name
                    : "";
            let visitorEmail =
                param.visitors != undefined &&
                param.visitors[0] != undefined &&
                param.visitors[0].email != undefined
                    ? param.visitors[0].email
                    : "";
            let visitorStatus =
                param.visitors != undefined &&
                param.visitors[0] != undefined &&
                param.visitors[0].status != undefined
                    ? param.visitors[0].status
                    : "";

            this.inputFormData = {
                objectId: param.objectId,
                mobile: visitorMobile,
                name: visitorName,
                email: visitorEmail,
                status: visitorStatus,
                startDate: this.resolveDatetimeStartDate(param.dates),
                endDate: this.resolveDatetimeEndDate(param.dates),
                purpose: param.purpose.name,
                startString: this.resolveDatetimeStart(param.dates),
                endString: this.resolveDatetimeEnd(param.dates)
            };
        }
    }

    updateModifyForm(datas: any) {
        this.inputFormData[datas.key] = datas.value;
    }

    uploadProgressFile(file: any) {
        this.progressFileContent = [];

        // 檢查 file 是否存在
        if (file == null) {
            return false;
        }

        // 判斷檔案類型
        const extensions = file.name.split(".")[1];
        const extension = ["xlsx"].some(item => item === extensions);
        if (
            !extension ||
            !file.type ||
            file.type !=
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
            Dialog.error(this._("w_TenantsInvitation_ErrorFileType"));
            return false;
        }

        excel2json(file)
            .then((data: any) => {
                for (let sheetRow of data) {
                    for (let row of sheetRow.sheet) {
                        try {
                            let progressFile: IProgressFile = {
                                mobile: "",
                                name: "",
                                email: "",
                                purposeId: "",
                                purposeName: "",
                                startDate: null,
                                endDate: null,
                                startDateText: "",
                                endDateText: "",
                                apiMessage: ""
                            };

                            // get value
                            if (
                                row[this.progressExcelTitleName.mobile] !=
                                undefined
                            ) {
                                progressFile.mobile = row[
                                    this.progressExcelTitleName.mobile
                                ]
                                    .toString()
                                    .trim();
                            }

                            if (
                                row[this.progressExcelTitleName.name] !=
                                undefined
                            ) {
                                progressFile.name = row[
                                    this.progressExcelTitleName.name
                                ]
                                    .toString()
                                    .trim();
                            }

                            if (
                                row[this.progressExcelTitleName.email] !=
                                undefined
                            ) {
                                progressFile.email = row[
                                    this.progressExcelTitleName.email
                                ]
                                    .toString()
                                    .trim();
                            }

                            if (
                                row[this.progressExcelTitleName.purpose] !=
                                undefined
                            ) {
                                let tempPurposeName = row[
                                    this.progressExcelTitleName.purpose
                                ]
                                    .toString()
                                    .trim();

                                for (let purposes of this.selectItem.purposes) {
                                    if (purposes.text == tempPurposeName) {
                                        progressFile.purposeId = purposes.id;
                                        progressFile.purposeName =
                                            purposes.text;
                                    }
                                }
                            }

                            if (
                                row[this.progressExcelTitleName.startDate] !=
                                undefined
                            ) {
                                progressFile.startDateText = row[
                                    this.progressExcelTitleName.startDate
                                ]
                                    .toString()
                                    .trim();
                            }

                            if (
                                row[this.progressExcelTitleName.endDate] !=
                                undefined
                            ) {
                                progressFile.endDateText = row[
                                    this.progressExcelTitleName.endDate
                                ]
                                    .toString()
                                    .trim();
                            }

                            progressFile.startDate = this.resolveProgressFileDate(
                                progressFile.startDateText
                            );

                            progressFile.endDate = this.resolveProgressFileDate(
                                progressFile.endDateText
                            );

                            if (progressFile.startDate == null) {
                                this.progressFileError = true;
                            }

                            if (progressFile.endDateText == null) {
                                this.progressFileError = true;
                            }

                            // check disable submit button
                            if (!this.progressFileError) {
                                if (
                                    progressFile.mobile == "" ||
                                    progressFile.name == "" ||
                                    progressFile.email == "" ||
                                    progressFile.purposeId == ""
                                ) {
                                    this.progressFileError = true;
                                }
                            }

                            this.progressFileContent.push(progressFile);
                        } catch (e) {
                            console.log("Resolve Error: ", e);
                        }
                    }
                }
                this.pageToProgressStep3();
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_TenantsInvitation_ErrorFileResolve")
                );
            });
    }

    resolveProgressFileDate(value: string): null | Date {
        let result = null;

        // 判斷時間格式
        let tempDateArray = value.toString().split("/");

        try {
            if (tempDateArray.length >= 3) {
                let resolveDateDetail = true;
                let tempYear = Utility.PadLeft(tempDateArray[0], "0", 4);
                let tempMonth = Utility.PadLeft(tempDateArray[1], "0", 2);
                let tempDate = Utility.PadLeft(tempDateArray[2], "0", 2);

                if (isNaN(parseInt(tempYear))) {
                    resolveDateDetail = false;
                }
                if (isNaN(parseInt(tempMonth))) {
                    resolveDateDetail = false;
                }
                if (isNaN(parseInt(tempDate))) {
                    resolveDateDetail = false;
                }

                if (resolveDateDetail) {
                    result = new Date(
                        `${tempYear}/${tempMonth}/${tempDate} 00:00:00`
                    );
                }
            }
        } catch (e) {
            this.progressFileError = true;
            console.log("Date error, e: ", e);
        }

        return result;
    }

    async saveModifyForm() {
        //post api
        const createParam = {
            visitors: [
                {
                    name: this.inputFormData.name,
                    phone: this.inputFormData.mobile,
                    email: this.inputFormData.email
                }
            ],
            purpose: this.inputFormData.purpose,
            dates: [
                {
                    start: Datetime.DateStart(this.inputFormData.startDate),
                    end: Datetime.DateEnd(this.inputFormData.endDate)
                }
            ]
        };

        await this.$server
            .C("/flow2/visitors/invites", createParam)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.pageToList();
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async sendProgressFile() {
        Loading.show();
        for (let i in this.progressFileContent) {
            let tempValue = this.progressFileContent[i];

            //post api
            const createParam = {
                visitors: [
                    {
                        name: tempValue.name,
                        phone: tempValue.mobile,
                        email: tempValue.email
                    }
                ],
                purpose: tempValue.purposeId,
                dates: [
                    {
                        start: Datetime.DateStart(tempValue.startDate),
                        end: Datetime.DateEnd(tempValue.endDate)
                    }
                ]
            };

            await this.$server
                .C("/flow2/visitors/invites", createParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            this.progressFileContent[i].apiMessage = this._(
                                "w_TenantsInvitation_UploadSuccess"
                            );
                        }
                    );
                })
                .catch((e: any) => {
                    this.progressFileContent[i].apiMessage = e.body;
                });
        }
        Loading.hide();
        console.log(this.progressFileContent);
        this.pageToProgressStep4();
    }

    downloadExample() {
        let excelData: IProgressFile[] = [];
        let rowCount = Math.floor(Math.random() * 10) + 1;
        let now = new Date();

        for (let i = 0; i < rowCount; i++) {
            excelData.push({
                mobile: "0987654321",
                name: "iSAP",
                email: "isap@gamil.com",
                purposeId: "adfadsf",
                purposeName: "Wait",
                startDate: null,
                endDate: null,
                startDateText:
                    (now.getFullYear() + 1).toString() +
                    "/" +
                    (Math.floor(Math.random() * 11) + 1).toString() +
                    "/" +
                    (Math.floor(Math.random() * 27) + 1).toString(),
                endDateText:
                    (now.getFullYear() + 1).toString() +
                    "/" +
                    (Math.floor(Math.random() * 11) + 1).toString() +
                    "/" +
                    (Math.floor(Math.random() * 27) + 1).toString(),
                apiMessage: ""
            });
        }

        const th = [
            this.progressExcelTitleName.mobile,
            this.progressExcelTitleName.name,
            this.progressExcelTitleName.email,
            this.progressExcelTitleName.purpose,
            this.progressExcelTitleName.startDate,
            this.progressExcelTitleName.endDate
        ];
        const filterVal = [
            "mobile",
            "name",
            "email",
            "purposeName",
            "startDateText",
            "endDateText"
        ];
        const data = excelData.map(v => filterVal.map(k => v[k]));
        const [fileName, fileType, sheetName] = [
            "ImportBetchInvitationTemplate",
            "xlsx",
            "Invitation"
        ];
        toExcel({ th, data, fileName, fileType, sheetName });
    }

    errorMessageInTable() {
        return `<span style='color:#f00;'>${this._(
            "w_TenantsInvitation_ErrorNoData"
        )}</span>`;
    }

    changeDateToString(date: Date): string | null {
        let result = null;
        if (date != undefined) {
            try {
                result = Datetime.DateTime2String(date, "YYYY-MM-DD");
            } catch (e) {}
        }
        return result;
    }

    ////////////////////////// interface //////////////////////////

    ITableList() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;

                /**
                 * @uiLabel - ${this._("w_Tenants_MobileNumber")}
                 */
                phone: any;

                /**
                 * @uiLabel - ${this._("w_Tenants_Name")}
                 */
                name: any;

                /**
                 * @uiLabel - ${this._("w_Tenants_Email")}
                 */
                email: any;

                /**
                 * @uiLabel - ${this._("w_Tenants_Status")}
                 */
                status: any;

                /**
                 * @uiLabel - ${this._("w_Tenants_StartDate")}
                 */
                startDate: any;

                /**
                 * @uiLabel - ${this._("w_Tenants_EndDate")}
                 */
                endDate: any;

                purpose: interface {
                    /**
                     * @uiLabel - ${this._("w_Tenants_Purpose")}
                     */
                    name: string;
                };

                ${this.showModifyTool() ? "Actions: any;" : ""} 
            }
        `;
    }

    IViewForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Tenants_MobileNumber")}
                 * @uiType - iv-form-label
                 */
                mobile?: string;

                /**
                 * @uiLabel - ${this._("w_Tenants_Name")}
                 * @uiType - iv-form-label
                 */
                name?: string;

                 /**
                 * @uiLabel - ${this._("w_Tenants_Email")}
                 * @uiType - iv-form-label
                 */
                email?: string;

                /**
                 * @uiLabel - ${this._("w_Tenants_Status")}
                 * @uiType - iv-form-label
                 */
                status?: string;

                /**
                 * @uiLabel - ${this._("w_Tenants_StartDate")}
                 * @uiType - iv-form-label
                 * @uiColumnGroup - date
                 */
                startString?: string;

                /**
                 * @uiLabel - ${this._("w_Tenants_EndDate")}
                 * @uiType - iv-form-label
                 * @uiColumnGroup - date
                 */
                endString?: string;

                /**
                 * @uiLabel - ${this._("w_Tenants_Purpose")}
                 * @uiType - iv-form-label
                 */
                purpose?: string;
            }
        `;
    }

    IModifyForm() {
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_Tenants_MobileNumber")}
                 */
                mobile: string;

                /**
                 * @uiLabel - ${this._("w_Tenants_Name")}
                 */
                name: string;

                /**
                 * @uiLabel - ${this._("w_Tenants_Email")}
                 */
                email: string;

                /**
                 * @uiLabel - ${this._("w_Tenants_StartDate")}
                 * @uiType - iv-form-date
                 * @uiColumnGroup - date
                 */
                startDate: Date;

                /**
                 * @uiLabel - ${this._("w_Tenants_EndDate")}
                 * @uiType - iv-form-date
                 * @uiColumnGroup - date
                 */
                endDate: Date;

        
                /**
                 * @uiLabel - ${this._("w_Tenants_Purpose")}
                 * @uiType - iv-form-selection
                 */
                purpose?: ${toEnumInterface(
                    this.selectItem.purposes as any,
                    false
                )};
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>




