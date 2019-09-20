<template>
    <div class="animated fadeIn">

        <iv-card :label="_('w_Person_CardTitle')">

            <iv-step-progress
                ref="step"
                @mounted="doMounted"
            >

                <template #1-title>{{ _('w_Person_Step1') }}</template>
                <template #1>
                    <b-button
                        class="col-md-12"
                        @click="downloadExampleStore"
                    >{{ _('w_Person_Download') }}</b-button>
                </template>

                <template #2-title>{{ _('w_Person_Step2') }}</template>
                <template #2>
                    <b-form-file
                        v-model="file"
                        v-on:input="uploadFile"
                    />
                </template>

                <template #3-title>{{ _('w_Person_Step3') }}</template>
                <template #3>
                    <b-form-file
                        :multiple="true"
                        :directory="true"
                        v-on:input='chooseDirectory'
                    />
                </template>

                <template #4-title>{{ _('w_Person_Step4') }}</template>
                <template #4>
                    <div>
                        <table class="table table-bordered table-hover datatable dataTable no-footer records-table">
                            <thead>
                                <th>{{ _('w_Person_Name') }}</th>
                                <th>{{ _('w_Person_Titles') }}</th>
                                <th>{{ _('w_Person_Phone') }}</th>
                                <th>{{ _('w_Person_Company') }}</th>
                                <th>{{ _('w_Person_Floor') }}</th>
                                <th>{{ _('w_Person_Door') }}</th>
                                <th>{{ _('w_Person_Email') }}</th>
                                <th>{{ _('w_Person_Remark') }}</th>
                                <th>{{ _('w_Person_NRIC') }}</th>
                                <th>{{ _('w_Person_Enable_Permission') }}</th>
                                <th>{{ _('w_Person_Disable_Permission') }}</th>
                                <th>{{ _('w_Person_Agree_Tc') }}</th>
                                <th>{{ _('w_Person_Agree_App') }}</th>
                                <th>{{ _('w_Person_Image') }}</th>
                            </thead>
                            <tbody>
                                <tr v-for="(value, index) in recordFileContent">
                                    <td v-html="value.name ? value.name : errorMessageInTable()"></td>
                                    <td v-html="value.position ? value.position : '-'"></td>
                                    <td v-html="value.phone ? value.phone : '-'"></td>
                                    <td v-html="value.company ? value.company : errorMessageInTable()"></td>
                                    <td v-html="value.floor ? value.floor : errorMessageInTable()"></td>
                                    <td v-html="value.door ? value.door : errorMessageInTable()"></td>
                                    <td v-html="value.email ? value.email : errorMessageInTable()"></td>
                                    <td v-html="value.remark ? value.remark : '-'"></td>
                                    <td v-html="value.nric ? value.nric : '-'"></td>
                                    <td v-html="value.startDateText ? value.startDateText : errorMessageInTable()"></td>
                                    <td v-html="value.endDateText ? value.endDateText : '-'"></td>
                                    <td v-html="value.agreeTc ? value.agreeTc.toString() : errorMessageInTable()"></td>
                                    <td v-html="value.isUseSuntecReward ? value.isUseSuntecReward.toString() : false"></td>
                                    <td>
                                        <template v-if="value.isUseSuntecReward !== '' && value.image !== ''">
                                            <img
                                                v-if="value.imageBase64 !== ''"
                                                :src="value.imageBase64"
                                                style="max-height: 100px; max-width: 100px;"
                                            />
                                            <div v-else>
                                                {{ _("w_Person_ErrorNoImage") }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div v-html="value.imageBase64"></div>
                                        </template>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>

                <template #5-title>{{ _('w_Person_Step5') }}</template>
                <template #5>
                    <div>
                        <table class="table table-bordered table-hover datatable dataTable no-footer records-table">
                            <thead>
                                <th>{{ _('w_Person_StoreId') }}</th>
                                <th>{{ _('w_Person_Time') }}</th>
                                <th>{{ _('w_Person_Transaction') }}</th>
                                <th>{{ _('w_Person_Revenue') }}</th>
                                <th>{{ _('w_Person_ApiMessage') }}</th>
                            </thead>
                            <tbody>
                                <tr v-for="value in recordFileContent">
                                    <td v-html="value.storeId"></td>
                                    <td v-html="value.datetimeText"></td>
                                    <td v-html="value.transaction"></td>
                                    <td v-html="value.revenue"></td>
                                    <td v-html="value.apiMessage"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>

            </iv-step-progress>

            <template
                #footer
                v-if="transitionStep > 0"
            >
                <b-button
                    v-if="transitionStep > 1 && transitionStep < 5"
                    variant="dark"
                    size="lg"
                    @click="pageToPrev"
                >{{ _('w_PreviousPage') }}
                </b-button>
                <b-button
                    v-if="transitionStep == 1"
                    variant="dark"
                    size="lg"
                    @click="pageTo2"
                >{{ _('w_NextPage') }}
                </b-button>
                <b-button
                    v-if="transitionStep == 4"
                    variant="dark"
                    size="lg"
                    :disabled="recordFileError"
                    @click="sendRecordFile"
                >{{ _('w_Submit') }}
                </b-button>
                <b-button
                    v-if="transitionStep == 5"
                    variant="dark"
                    size="lg"
                    @click="pageTo1"
                >{{ _('w_Back') }}
                </b-button>

            </template>

        </iv-card>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
import Utility from "@/services/Utility";
import Loading from "@/services/Loading";
import ImageBase64 from "@/services/ImageBase64";
import RoleService from "@/services/Role/RoleService";
import RegexServices from "@/services/RegexServices";

// Export
import toExcel from "@/services/Excel/json2excel";
import excel2json from "@/services/Excel/excel2json";

interface IExcelTitle {
    name: string;
    position: string;
    phone: string;
    company: string;
    floor: string;
    door: string;
    email: string;
    agreeTc: string;
    isUseSuntecReward: string;
    remark: string;
    startDate: string;
    endDate: string;
    nric: string;
    image: string;
}

interface IRecordFile {
    apiMessage: string;

    name: string;
    position?: string;
    phone?: string;
    company: string;
    floor: string;
    door: string;
    email: string;
    remark?: string;
    nric?: string;
    image: string;
    companyId?: string;
    floorIds?: string[];
    doorIds?: string[];
    floorText?: string;
    doorText?: string;

    startDateText: string;
    endDateText?: string;
    agreeTc: string;
    isUseSuntecReward?: string;

    startDate?: Date;
    endDate?: Date;

    imageBase64?: string;

    transaction?: number; // ERecordType.sotre
    productId?: string; // ERecordType.product
    count?: number; // ERecordType.product
    startDatetimeText?: string; // maybe no text
    endDatetimeText?: string; // maybe no text
    hourText?: string;
    datetime?: Date; // maybe time error
}

interface ICompanyStaffRecord {
    name: string;
    email: string;
    startDate: Date;
    companyId: string;
    floorIds: string[];
    doorIds: string[];
    imageBase64?: string;
    position?: string;
    phone?: string;
    isUseSuntecReward?: boolean;
    remark?: string;
    endDate?: Date;
    nric?: string;
}

@Component({
    components: {}
})
export default class PersonProgress extends Vue {
    transitionStep: number = 1;
    stepRef: any = this.$refs.step;
    file: any | null = null;
    recordFileError: boolean = false;
    recordFileContent: IRecordFile[] = [];

    // imageBase64 = ImageBase64;

    companies = [];
    doors = [];

    selectItem: {
        role: any;
        company: any;
        floor: any;
        door: any;
    } = {
        role: {},
        company: {},
        floor: {},
        door: {}
    };

    errorMessageFromServer = {
        noSite: "site not found"
    };

    excelTitleName: IExcelTitle = {
        name: "Name",
        position: "Position",
        phone: "Phone",
        company: "Company",
        floor: "Floor",
        door: "Door",
        email: "Email",
        agreeTc: "agreeTc",
        isUseSuntecReward: "isUseSuntecReward",
        remark: "Remark",
        startDate: "StartDate",
        endDate: "EndDate",
        nric: "NRIC",
        image: "Image"
    };

    isMounted: boolean = false;

    // @Watch("recordFileContent", { immediate: true, deep: true })
    // onRecordFileContentChanged(val: any[], oldVal: any[]) {
    //     if (val.length > 0) {
    //         this.recordFileContentChanged(val);
    //     }
    // }

    doMounted() {
        this.isMounted = true;
    }

    created() {}

    mounted() {
        this.stepRef = this.$refs.step;
        this.initSelectItemDoorWithAPI();
        if (!RoleService.haveTenantAdministrator(this)) {
            this.initSelectItemCompanyWithAPI();
        }
    }

    pageToPrev() {
        if (this.transitionStep >= 5) {
            this.pageTo4();
        } else if (this.transitionStep == 4) {
            this.pageTo3();
        } else if (this.transitionStep == 3) {
            this.pageTo2();
        } else {
            this.pageTo1();
        }
    }

    pageTo1() {
        this.file = null;
        this.recordFileContent = [];
        this.transitionStep = 1;
        this.recordFileError = false;
        this.stepToTransitionStep();
    }

    pageTo2() {
        this.transitionStep = 2;
        this.recordFileContent = [];
        this.recordFileError = false;
        this.file = null;
        this.stepToTransitionStep();
    }

    pageTo3() {
        this.transitionStep = 3;
        this.stepToTransitionStep();
    }

    pageTo4() {
        this.transitionStep = 4;
        this.stepToTransitionStep();
    }

    pageTo5() {
        this.transitionStep = 5;
        this.stepToTransitionStep();
    }

    stepToTransitionStep() {
        this.stepRef.currentStep = this.transitionStep;
    }

    async initSelectItemCompanyWithAPI() {
        let param: any = { paging: { all: true } };
        param = RegexServices.trim(param);
        await this.$server
            .R("/location/company", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (
                        response.results != undefined &&
                        response.results.length > 0
                    ) {
                        this.companies = JSON.parse(
                            JSON.stringify(response.results)
                        );
                        // for (let ret of response.results) {
                        //     if (
                        //         ret.objectId != undefined &&
                        //         ret.name != undefined
                        //     ) {
                        //         this.$set(
                        //             this.selectItem.company,
                        //             ret.objectId,
                        //             ret.name
                        //         );
                        //     }
                        // }
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemDoorWithAPI() {
        let param: any = { paging: { all: true } };
        param = RegexServices.trim(param);
        await this.$server
            .R("/location/door", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (
                        response.results != undefined &&
                        response.results.length > 0
                    ) {
                        this.doors = JSON.parse(
                            JSON.stringify(response.results)
                        );
                        // for (let ret of response.results) {
                        //     if (
                        //         ret.objectId != undefined &&
                        //         ret.name != undefined
                        //     ) {
                        //         this.$set(
                        //             this.selectItem.company,
                        //             ret.objectId,
                        //             ret.name
                        //         );
                        //     }
                        // }
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemFloorWithCompany(companyId: string) {
        this.selectItem.floor = {};
        for (let company of this.companies) {
            if (companyId == company.objectId) {
                for (let floor of company.floors) {
                    this.$set(
                        this.selectItem.floor,
                        floor.objectId,
                        floor.name
                    );
                }
                break;
            }
        }
    }

    downloadExampleStore() {
        let excelData: IRecordFile[] = [];
        let rowCount = Math.floor(Math.random() * 50) + 1;
        let now = new Date();
        if (!RoleService.haveTenantAdministrator(this)) {
            excelData.push(
                {
                    apiMessage: "",
                    name: "John",
                    position: "Manager",
                    phone: "",
                    company: "Super market",
                    floor: "1F",
                    door: "lobby",
                    email: "john@super-markert.com",
                    agreeTc: "true",
                    isUseSuntecReward: "false",
                    remark: "",
                    image: "8986d96118a65bf5ba8098109929be66_file.jpeg",

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

                    nric: ""
                },
                {
                    apiMessage: "",
                    name: "May",
                    position: "",
                    phone: "88-9999",
                    company: "MRT",
                    floor: "1F",
                    door: "lobby, emergency exit",
                    email: "may@+mrt.com",
                    agreeTc: "true",
                    isUseSuntecReward: "true",
                    remark: "",
                    image: "7ff796296acd73e889d6472bc035fe57_file.jpeg",

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

                    nric: ""
                }
            );
        } else {
            let domain = this.$user.user.company.name;
            domain = domain.replace(/\s/g, "");
            excelData.push(
                {
                    apiMessage: "",
                    name: "May",
                    position: "",
                    phone: "",
                    company: this.$user.user.company.name,
                    floor: "1F",
                    door: "lobby, emergency exit",
                    email: `may@${this.$user.user.company.name}.com`,
                    agreeTc: "true",
                    isUseSuntecReward: "true",
                    remark: "",
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
                    nric: "",
                    image: "7ff796296acd73e889d6472bc035fe57_file.jpeg"
                },
                {
                    apiMessage: "",
                    name: "Paul",
                    position: "",
                    phone: "",
                    company: this.$user.user.company.name,
                    floor: "1F",
                    door: "lobby, emergency exit",
                    email: `paul@${domain}.com`,
                    agreeTc: "true",
                    isUseSuntecReward: "false",
                    remark: "",
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
                    nric: "",
                    image: ""
                }
            );
        }
        const th = [
            this.excelTitleName.name,
            this.excelTitleName.position,
            this.excelTitleName.phone,
            this.excelTitleName.company,
            this.excelTitleName.floor,
            this.excelTitleName.door,
            this.excelTitleName.email,
            this.excelTitleName.agreeTc,
            this.excelTitleName.isUseSuntecReward,
            this.excelTitleName.remark,
            this.excelTitleName.startDate,
            this.excelTitleName.endDate,
            this.excelTitleName.nric,
            this.excelTitleName.image
        ];
        const filterVal = [
            "name",
            "position",
            "phone",
            "company",
            "floor",
            "door",
            "email",
            "agreeTc",
            "isUseSuntecReward",
            "remark",
            "startDateText",
            "endDateText",
            "nric",
            "image"
        ];
        const data = excelData.map(v => filterVal.map(k => v[k]));
        const [fileName, fileType, sheetName] = [
            "ImportPersonTemplate",
            "xlsx",
            "Person"
        ];
        toExcel({ th, data, fileName, fileType, sheetName });
    }

    uploadFile(file: any) {
        this.recordFileContent = [];

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
            Dialog.error(this._("w_Person_ErrorFileType"));
            return false;
        }

        excel2json(file)
            .then((data: any) => {
                let count = 0;
                let imageArray = [];
                for (let sheetRow of data) {
                    for (let row of sheetRow.sheet) {
                        let recordFile: IRecordFile = {
                            apiMessage: "",
                            name: "",
                            position: "",
                            phone: "",
                            company: "",
                            floor: "",
                            door: "",
                            email: "",
                            remark: "",
                            nric: "",
                            image: "",
                            // imageBase64: "",
                            companyId: "",
                            floorIds: [],
                            doorIds: [],

                            startDateText: "",
                            endDateText: "",
                            agreeTc: "",
                            isUseSuntecReward: ""
                        };

                        // get value
                        if (row[this.excelTitleName.image] != undefined) {
                            imageArray.push(row[this.excelTitleName.image]);
                            recordFile.image = imageArray[count]
                                ? imageArray[count]
                                : "";
                            count++;
                        }

                        if (row[this.excelTitleName.name] != undefined) {
                            recordFile.name = row[this.excelTitleName.name]
                                .toString()
                                .trim();
                        }

                        if (row[this.excelTitleName.position] != undefined) {
                            recordFile.position = row[
                                this.excelTitleName.position
                            ]
                                .toString()
                                .trim();
                        }

                        if (row[this.excelTitleName.phone] != undefined) {
                            recordFile.phone = row[this.excelTitleName.phone]
                                .toString()
                                .trim();
                        }
                        if (row[this.excelTitleName.company] != undefined) {
                            recordFile.company = row[
                                this.excelTitleName.company
                            ]
                                .toString()
                                .trim();
                        }
                        if (row[this.excelTitleName.floor] != undefined) {
                            recordFile.floor = row[this.excelTitleName.floor]
                                .toString()
                                .trim();
                        }
                        if (row[this.excelTitleName.door] != undefined) {
                            recordFile.door = row[this.excelTitleName.door]
                                .toString()
                                .trim();
                        }
                        if (row[this.excelTitleName.email] != undefined) {
                            recordFile.email = row[this.excelTitleName.email]
                                .toString()
                                .trim();
                        }

                        if (row[this.excelTitleName.remark] != undefined) {
                            recordFile.remark = row[this.excelTitleName.remark]
                                .toString()
                                .trim();
                        }
                        if (row[this.excelTitleName.startDate] != undefined) {
                            recordFile.startDateText = row[
                                this.excelTitleName.startDate
                            ]
                                .toString()
                                .trim();
                        }
                        if (row[this.excelTitleName.endDate] != undefined) {
                            recordFile.endDateText = row[
                                this.excelTitleName.endDate
                            ]
                                .toString()
                                .trim();
                        }
                        if (row[this.excelTitleName.nric] != undefined) {
                            recordFile.nric = row[this.excelTitleName.nric]
                                .toString()
                                .trim();
                        }
                        if (row[this.excelTitleName.agreeTc] != undefined) {
                            recordFile.agreeTc = row[
                                this.excelTitleName.agreeTc
                            ]
                                .toString()
                                .trim();
                        }
                        if (
                            row[this.excelTitleName.isUseSuntecReward] !=
                            undefined
                        ) {
                            recordFile.isUseSuntecReward = row[
                                this.excelTitleName.isUseSuntecReward
                            ]
                                .toString()
                                .trim();
                        }

                        // 判斷時間格式
                        let resolveDate = true;
                        let startDateArray = recordFile.startDateText
                            .toString()
                            .split("/");
                        let endDateArray = recordFile.endDateText
                            ? recordFile.endDateText.toString().split("/")
                            : "";

                        try {
                            if (
                                startDateArray.length > 0 &&
                                startDateArray.length < 3
                            ) {
                                let tempDate: Date = new Date(
                                    (parseInt(startDateArray[0]) -
                                        (25567 + 2)) *
                                        86400 *
                                        1000
                                );
                                // reset datetime text
                                if (isNaN(tempDate.getTime())) {
                                    this.recordFileError = true;
                                }
                                if (!isNaN(tempDate.getTime())) {
                                    recordFile.startDate = tempDate;
                                    recordFile.startDatetimeText = Datetime.DateTime2String(
                                        recordFile.startDate,
                                        Datetime.FormatCheckDate
                                    );
                                }
                            } else if (startDateArray.length >= 3) {
                                let resolveDateDetail = true;
                                let tempYear = Utility.PadLeft(
                                    startDateArray[0],
                                    "0",
                                    2
                                );
                                let tempMonth = Utility.PadLeft(
                                    startDateArray[1],
                                    "0",
                                    2
                                );
                                let tempDate = Utility.PadLeft(
                                    startDateArray[2],
                                    "0",
                                    2
                                );

                                if (isNaN(parseInt(tempYear))) {
                                    this.recordFileError = true;
                                    resolveDateDetail = false;
                                }
                                if (isNaN(parseInt(tempMonth))) {
                                    this.recordFileError = true;
                                    resolveDateDetail = false;
                                }
                                if (isNaN(parseInt(tempDate))) {
                                    this.recordFileError = true;
                                    resolveDateDetail = false;
                                }
                                if (resolveDateDetail) {
                                    // get Date()
                                    let tempDatetimeString: string = `${tempYear}-${tempMonth}-${tempDate}`;
                                    // get Date relay string
                                    recordFile.startDate = Datetime.String2DateTime(
                                        tempDatetimeString,
                                        Datetime.FormatCheckDate
                                    );
                                }
                            } else {
                                this.recordFileError = true;
                                resolveDate = false;
                            }

                            // reset datetime text
                            if (!isNaN(recordFile.startDate.getTime())) {
                                recordFile.startDatetimeText = Datetime.DateTime2String(
                                    recordFile.startDate,
                                    Datetime.FormatCheckDate
                                );
                            }
                        } catch (e) {
                            this.recordFileError = true;
                            console.log("Date error, e: ", e);
                        }
                        if (endDateArray && endDateArray.length > 0) {
                            try {
                                if (
                                    endDateArray.length > 0 &&
                                    endDateArray.length < 3
                                ) {
                                    let tempDate: Date = new Date(
                                        (parseInt(endDateArray[0]) -
                                            (25567 + 2)) *
                                            86400 *
                                            1000
                                    );
                                    // reset datetime text
                                    if (isNaN(tempDate.getTime())) {
                                        this.recordFileError = true;
                                    }
                                    if (!isNaN(tempDate.getTime())) {
                                        recordFile.endDate = tempDate;
                                        recordFile.endDatetimeText = Datetime.DateTime2String(
                                            recordFile.endDate,
                                            Datetime.FormatCheckDate
                                        );
                                    }
                                } else if (endDateArray.length >= 3) {
                                    let resolveDateDetail = true;
                                    let tempYear = Utility.PadLeft(
                                        endDateArray[0],
                                        "0",
                                        2
                                    );
                                    let tempMonth = Utility.PadLeft(
                                        endDateArray[1],
                                        "0",
                                        2
                                    );
                                    let tempDate = Utility.PadLeft(
                                        endDateArray[2],
                                        "0",
                                        2
                                    );

                                    if (isNaN(parseInt(tempYear))) {
                                        this.recordFileError = true;
                                        resolveDateDetail = false;
                                    }
                                    if (isNaN(parseInt(tempMonth))) {
                                        this.recordFileError = true;
                                        resolveDateDetail = false;
                                    }
                                    if (isNaN(parseInt(tempDate))) {
                                        this.recordFileError = true;
                                        resolveDateDetail = false;
                                    }
                                    if (resolveDateDetail) {
                                        // get Date()
                                        let tempDatetimeString: string = `${tempYear}-${tempMonth}-${tempDate}`;
                                        // get Date relay string
                                        recordFile.endDate = Datetime.String2DateTime(
                                            tempDatetimeString,
                                            Datetime.FormatCheckDate
                                        );
                                    }
                                } else {
                                    this.recordFileError = true;
                                    resolveDate = false;
                                }

                                // reset datetime text
                                if (!isNaN(recordFile.endDate.getTime())) {
                                    recordFile.endDatetimeText = Datetime.DateTime2String(
                                        recordFile.endDate,
                                        Datetime.FormatCheckDate
                                    );
                                }
                            } catch (e) {
                                this.recordFileError = true;
                                console.log("Date error, e: ", e);
                            }
                        }

                        // check disable submit button
                        // if (!this.recordFileError) {
                        //     if (
                        //         recordFile.isUseSuntecReward == "" ||
                        //         recordFile.isUseSuntecReward == "false"
                        //     ) {
                        //         this.recordFileError = true;
                        //     } else {
                        //         this.recordFileError = false;
                        //     }
                        // }

                        this.recordFileContent.push(recordFile);
                    }
                }
                this.recordFileContentChanged(this.recordFileContent);
                this.pageTo3();
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_Person_ErrorFileResolve")
                );
            });
    }

    chooseDirectory(files: File[]) {
        let isImageSame = false;
        for (let i in this.recordFileContent) {
            let content = this.recordFileContent[i];
            if (
                content.image &&
                content.image != "" &&
                (RegexServices.jpg(content.image) ||
                    RegexServices.png(content.image))
            ) {
                for (let file of files) {
                    if (
                        file.name &&
                        file.name == content.image &&
                        file &&
                        file.type &&
                        file.type.indexOf("image") >= 0
                    ) {
                        ImageBase64.fileToBase64(file, (base64: string) => {
                            this.recordFileContent[i].imageBase64 = base64;
                        });
                        isImageSame = true;
                        break;
                    }
                }
            }
            if (!isImageSame) {
                // content.image = "";
                this.errorMessageInTable("imageBase64", i);
            }
        }
        setTimeout(this.pageTo4, 300);
    }

    async recordFileContentChanged(data: any[]) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            // check
            if (
                data[i].isUseSuntecReward &&
                data[i].isUseSuntecReward == "false" &&
                ((data[i].imageBase64 &&
                    data[i].imageBase64 == ImageBase64.pngEmpty) ||
                    data[i].imageBase64 == "")
            ) {
                console.log("image", data[i]);
                this.errorMessageInTable("imageBase64", i);
                this.recordFileError = true;
            }

            if (
                data[i].phone &&
                data[i].phone != "" &&
                !RegexServices.phoneNumber(data[i].phone)
            ) {
                this.errorMessageInTable("phone", i);
                this.recordFileError = true;
            }
            if (
                data[i].email &&
                data[i].email != "" &&
                !RegexServices.email(data[i].email)
            ) {
                this.errorMessageInTable("email", i);
                this.recordFileError = true;
            }
            if (
                data[i].nric &&
                data[i].nric != "" &&
                !RegexServices.nric(data[i].nric)
            ) {
                this.errorMessageInTable("nric", i);
                this.recordFileError = true;
            }
            // for haveTenantAdministrator
            if (RoleService.haveTenantAdministrator(this)) {
                let company = data[i] ? data[i]["company"] : "";
                if (company == this.$user.user.company.name) {
                    this.recordFileError = false;
                    data[i].companyId = this.$user.user.company.objectId;
                } else {
                    this.recordFileError = true;
                    this.errorMessageInTable("company", i);
                    return;
                }
            } else {
                let isCompanySame = false;
                let isFloorSame = false;
                let isDoorSame = false;
                for (let j = 0; j < this.companies.length; j++) {
                    if (this.companies[j].name === data[i].company) {
                        isCompanySame = true;
                        this.recordFileError = false;
                        data[i].companyId = this.companies[j].objectId;
                        await this.initSelectItemFloorWithCompany(
                            this.companies[j].objectId
                        );
                    }
                }
                if (!isCompanySame) {
                    this.errorMessageInTable("company", i);
                    this.recordFileError = true;
                }
                for (let k in this.selectItem.floor) {
                    if (this.selectItem.floor[k] == data[i].floor) {
                        isFloorSame = true;
                        this.recordFileError = false;
                        data[i].floorIds.push(k);
                    }
                }
                if (!isFloorSame) {
                    this.errorMessageInTable("floor", i);
                    this.recordFileError = true;
                }
                let doorAry: string[] = [];
                let door = data[i].door.replace(/\s/gi, "");
                if (door.includes(",")) {
                    doorAry = door.split(",");
                } else {
                    doorAry.push(door);
                }
                for (let l = 0; l < doorAry.length; l++) {
                    for (let m = 0; m < this.doors.length; m++) {
                        if (
                            this.doors[m].name.replace(/\s/gi, "") ===
                            doorAry[l]
                        ) {
                            isDoorSame = true;
                            this.recordFileError = false;
                            data[i].doorIds.push(this.doors[m].objectId);
                        }
                    }
                }
                if (!isDoorSame) {
                    this.errorMessageInTable("door", i);
                    this.recordFileError = true;
                }
            }
        }
    }

    async sendRecordFile() {
        let param: {
            datas: ICompanyStaffRecord[];
        } = {
            datas: []
        };

        for (let content of this.recordFileContent) {
            let tempItem: ICompanyStaffRecord = {
                name: content.name,
                email: content.email,
                startDate: content.startDate,
                companyId: content.companyId,
                floorIds: content.floorIds,
                doorIds: content.doorIds
            };

            if (content.imageBase64 != undefined || content.imageBase64 != "") {
                tempItem["imageBase64"] = content.imageBase64;
            }

            if (content.position != undefined || content.position != "") {
                tempItem["position"] = content.position;
            }

            if (content.phone != undefined || content.phone != "") {
                tempItem["phone"] = content.phone;
            }

            if (
                content.isUseSuntecReward != undefined ||
                content.isUseSuntecReward != ""
            ) {
                tempItem["isUseSuntecReward"] =
                    content.isUseSuntecReward === "true";
            }

            if (content.remark != undefined || content.remark != "") {
                tempItem["remark"] = content.remark;
            }

            if (content.endDate != undefined) {
                tempItem["endDate"] = content.endDate;
            }

            if (content.nric != undefined || content.nric != "") {
                tempItem["nric"] = content.nric;
            }

            param.datas.push(tempItem);
        }
        param = RegexServices.trim(param);
        Loading.show();
        await this.$server
            .C("/person/staff", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    Dialog.success(this._("w_Dialog_SuccessTitle"));
                    this.$emit("excelToList");
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    sendSuccess(response: any) {
        if (typeof response == "object" && response.length > 0) {
            for (let i in response) {
                let iNumber = parseInt(i);
                let tempLoopValue = response[iNumber];
                if (this.recordFileContent[iNumber] == undefined) {
                    continue;
                }
                if (tempLoopValue.statusCode == 200) {
                    this.recordFileContent[
                        iNumber
                    ].apiMessage = `<span style='color:green;'>${this._(
                        "w_Person_ApiSuccess"
                    )}</span>`;
                } else if (tempLoopValue.statusCode == 400) {
                    if (
                        tempLoopValue.message ==
                        this.errorMessageFromServer.noSite
                    ) {
                        this.recordFileContent[
                            iNumber
                        ].apiMessage = `<span style='color:red;'>${this._(
                            "w_Person_ErrorNoImage"
                        )}</span>`;
                    } else {
                        this.recordFileContent[
                            iNumber
                        ].apiMessage = `<span style='color:red;'>${this._(
                            "w_Person_ErrorServerError"
                        )}</span>`;
                    }
                } else if (tempLoopValue.statusCode == 401) {
                    this.recordFileContent[
                        iNumber
                    ].apiMessage = `<span style='color:red;'>${this._(
                        "w_Person_ErrorNoPremission"
                    )}</span>`;
                } else {
                    this.recordFileContent[
                        iNumber
                    ].apiMessage = `<span style='color:red;'>${this._(
                        "w_Person_ErrorServerError"
                    )}</span>`;
                }
            }
            this.pageTo4();
        } else {
            this.sendError();
        }
    }

    sendError() {
        for (let i in this.recordFileContent) {
            this.recordFileContent[parseInt(i)].apiMessage = this._(
                "w_Person_ErrorServerError"
            );
        }
        this.pageTo4();
    }

    errorMessageInTable(data, index) {
        this.recordFileContent[index][
            data
        ] = `<span style='color:#f00;'>${this._("w_Person_ErrorData")}</span>`;
    }
}
</script>

<style lang="scss" scoped>
.records-table thead,
.records-table tbody td:last-child {
    text-align: center;
}
.error-message {
    color: #f00 !important;
}
.records-table tbody tr td .error-message {
    color: #f00 !important;
}
</style>

