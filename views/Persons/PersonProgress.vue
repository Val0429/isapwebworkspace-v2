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
                                    <td v-html="value.email ? value.email : errorMessageInTable()"></td>
                                    <td v-html="value.remark ? value.remark : '-'"></td>
                                    <td v-html="value.nric ? value.nric : '-'"></td>
                                    <td v-html="value.startDateText ? value.startDateText : errorMessageInTable()"></td>
                                    <td v-html="value.endDateText ? value.endDateText : '-'"></td>
                                    <td v-html="value.agreeTc ? value.agreeTc.toString() : errorMessageInTable()"></td>
                                    <td v-html="value.isUseSuntecReward ? value.isUseSuntecReward.toString() : false"></td>
                                    <td>
                                        <template v-if="value.isUseSuntecReward == 'true' && value.image !== ''">
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
    email: string;
    remark?: string;
    nric?: string;
    image: string;

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
    datetimeText?: string; // maybe no text
    datetime?: Date; // maybe time error
}

interface IBusinessOperationSalesRecord {
    customId: string;
    date: string;
    transaction: number;
    imageBase64: any;
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

    newImg = new Image();
    newImgSrc = [ImageBase64.pngEmpty];

    imageBase64 = ImageBase64;

    errorMessageFromServer = {
        noSite: "site not found"
    };

    excelTitleName: IExcelTitle = {
        name: "Name",
        position: "Position",
        phone: "Phone",
        company: "Company",
        floor: "Floor",
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

    @Watch("recordFileContent", { immediate: true, deep: true })
    onRecordFileContentChanged(val: any[], oldVal: any[]) {
        if (val.length > 0) {
            this.recordFileContentChanged(val);
        }
    }

    doMounted() {
        this.isMounted = true;
    }

    created() {}

    mounted() {
        this.stepRef = this.$refs.step;
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

    downloadExampleStore() {
        let excelData: IRecordFile[] = [];
        let rowCount = Math.floor(Math.random() * 50) + 1;
        let now = new Date();
        // for (let i = 0; i < 2; i++) {
        if (!RoleService.haveTenantAdministrator(this)) {
            excelData.push(
                {
                    // apiMessage: "",
                    // name: "",
                    // position: "",
                    // phone: Math.floor(Math.random() * 100000000).toString(),
                    // company: x.charAt(Math.floor(Math.random() * 50)),
                    // floor: x.charAt(Math.floor(Math.random() * 50)),
                    // email: x.charAt(Math.floor(Math.random() * 50)),
                    // agreeTcText: (Math.random() >= 0.5).toString(),
                    // isUseSuntecRewardText: (Math.random() >= 0.5).toString(),
                    // remark: x.charAt(Math.floor(Math.random() * 50)),

                    // startDateText:
                    //     (now.getFullYear() + 1).toString() +
                    //     "/" +
                    //     (Math.floor(Math.random() * 11) + 1).toString() +
                    //     "/" +
                    //     (Math.floor(Math.random() * 27) + 1).toString(),

                    // endDateText:
                    //     (now.getFullYear() + 1).toString() +
                    //     "/" +
                    //     (Math.floor(Math.random() * 11) + 1).toString() +
                    //     "/" +
                    //     (Math.floor(Math.random() * 27) + 1).toString(),

                    // nric: x.charAt(Math.floor(Math.random() * 50))
                    apiMessage: "",
                    name: "John",
                    position: "Manager",
                    phone: "",
                    company: "Super market",
                    floor: "1F",
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
            // }
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

        // console.log(excelData);
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
                // TODO: Morris, append test image name
                let count = 0;
                let imageArray = [];
                // TODO: Morris, append test image name
                for (let sheetRow of data) {
                    for (let row of sheetRow.sheet) {
                        let recordFile: IRecordFile = {
                            apiMessage: "",
                            name: "",
                            position: "",
                            phone: "",
                            company: "",
                            floor: "",
                            email: "",
                            remark: "",
                            nric: "",
                            image: "",
                            imageBase64: "",

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
                        // if (
                        //     row[this.excelTitleName.revenue] != undefined &&
                        //     !isNaN(parseFloat(row[this.excelTitleName.revenue]))
                        // ) {
                        //     recordFile.revenue = parseFloat(
                        //         row[this.excelTitleName.revenue]
                        //             .toString()
                        //             .trim()
                        //     );
                        // }
                        // if (
                        //     row[this.excelTitleName.transaction] != undefined &&
                        //     !isNaN(
                        //         parseFloat(row[this.excelTitleName.transaction])
                        //     )
                        // ) {
                        //     recordFile.transaction = parseFloat(
                        //         row[this.excelTitleName.transaction]
                        //             .toString()
                        //             .trim()
                        //     );
                        // }

                        // if (
                        //     row[this.excelTitleName.count] != undefined &&
                        //     !isNaN(parseFloat(row[this.excelTitleName.count]))
                        // ) {
                        //     recordFile.count = parseFloat(
                        //         row[this.excelTitleName.count].toString().trim()
                        //     );
                        // }

                        // 判斷時間格式
                        let resolveDate = true;
                        let DateArray = recordFile.startDateText
                            .toString()
                            .split("/");

                        try {
                            if (DateArray.length > 0 && DateArray.length < 3) {
                                let tempDate: Date = new Date(
                                    (parseInt(DateArray[0]) - (25567 + 2)) *
                                        86400 *
                                        1000
                                );
                                // reset datetime text
                                if (isNaN(tempDate.getTime())) {
                                    this.recordFileError = true;
                                }
                                if (!isNaN(tempDate.getTime())) {
                                    recordFile.startDate = tempDate;
                                    recordFile.startDateText = Datetime.DateTime2String(
                                        recordFile.datetime,
                                        Datetime.FormatCheckDateTime
                                    );
                                }
                            } else if (DateArray.length >= 3) {
                                let resolveDateDetail = true;
                                let tempYear = Utility.PadLeft(
                                    DateArray[0],
                                    "0",
                                    2
                                );
                                let tempMonth = Utility.PadLeft(
                                    DateArray[1],
                                    "0",
                                    2
                                );
                                let tempDate = Utility.PadLeft(
                                    DateArray[2],
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
                                    recordFile.datetime = Datetime.String2DateTime(
                                        tempDatetimeString,
                                        Datetime.FormatCheckDateTime
                                    );
                                }
                            } else {
                                this.recordFileError = true;
                                resolveDate = false;
                            }

                            // reset datetime text
                            if (!isNaN(recordFile.datetime.getTime())) {
                                recordFile.datetimeText = Datetime.DateTime2String(
                                    recordFile.datetime,
                                    Datetime.FormatCheckDateTime
                                );
                            }
                        } catch (e) {
                            this.recordFileError = true;
                            console.log("Date error, e: ", e);
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
                        break;
                    }
                }
            }
        }
        setTimeout(this.pageTo4, 300);
    }

    recordFileContentChanged(data: any[]) {
        for (let i = 0; i < data.length; i++) {
            // check

            // for image/app
            if (
                data[i].isUseSuntecReward &&
                data[i].isUseSuntecReward == "false" &&
                ((data[i].imageBase64 &&
                    data[i].imageBase64 == ImageBase64.pngEmpty) ||
                    data[i].imageBase64 == "")
            ) {
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
                } else {
                    this.errorMessageInTable("company", i);
                    this.recordFileError = true;
                }
            }

            // // for phone check
            // let phone = data[i] ? data[i]["phone"] : "";
            // if (RegexServices.phoneNumber(phone)) {
            //     this.recordFileError = true;
            //     return;
            // }
            // // for email check
            // let email = data[i] ? data[i]["email"] : "";
            // console.log(data[i]["email"]);
            // console.log(i);
            // if (RegexServices.email(email)) {
            //     this.errorMessageInTable("email");
            //     this.recordFileError = true;
            //     return;
            // }
        }
    }

    async sendRecordFile() {
        let param: {
            datas: IBusinessOperationSalesRecord[];
        } = {
            datas: []
        };

        for (let content of this.recordFileContent) {
            let tempItem: IBusinessOperationSalesRecord = {
                customId: content.name,
                date: content.datetime.toISOString(),
                transaction: content.transaction,
                imageBase64: ""
            };
            param.datas.push(tempItem);
        }
        Loading.show();
        // await this.$server
        //     .C("/report/sales-record", param)
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(
        //             this,
        //             response,
        //             this.sendSuccess,
        //             "",
        //             false
        //         );
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.catchError(this, e);
        //     });
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
        // if (data == "company") {
        //     for (let i = 0; i < this.recordFileContent.length; i++) {
        //         let objKey = Object.keys(this.recordFileContent[i]);
        //         console.log(objKey);
        //         // for (let j = 0; j < objKey.length; j++) {
        //         //     console.log(this.recordFileContent[i]);
        //         //     // this.recordFileContent[j] = "";
        //         // }
        //     }
        //     return;
        // } else {
        this.recordFileContent[index][
            data
        ] = `<span style='color:#f00;'>${this._("w_Person_ErrorData")}</span>`;
    }
    // }
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

