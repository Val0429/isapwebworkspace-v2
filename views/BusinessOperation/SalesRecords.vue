<template>
    <div class="animated fadeIn">

        <iv-card :label="_('w_BOSalesRecords_CardTitle')">

            <iv-step-progress
                ref="step"
                @mounted="doMounted"
            >

                <template #1-title>{{ _('w_BOSalesRecords_Step2') }}</template>
                <template #1>
                    <b-button
                        class="col-md-12"
                        @click="downloadExample"
                    >{{ _('w_BOSalesRecords_Download') }}</b-button>
                </template>

                <template #2-title>{{ _('w_BOSalesRecords_Step3') }}</template>
                <template #2>
                    <b-form-file
                        v-model="file"
                        v-on:input="uploadFile"
                    />
                </template>

                <template #3-title>{{ _('w_BOSalesRecords_Step4') }}</template>
                <template #3>
                    <div>
                        <table class="table table-bordered table-hover datatable dataTable no-footer records-table">
                            <thead>
                                <th>{{ _('w_BOSalesRecords_StoreId') }}</th>
                                <th>{{ _('w_BOSalesRecords_Time') }}</th>
                                <th>{{ _('w_BOSalesRecords_Transaction') }}</th>
                                <th>{{ _('w_BOSalesRecords_Revenue') }}</th>
                            </thead>
                            <tbody>
                                <tr v-for="value in recordFileContent">
                                    <td v-html="value.storeId ? value.storeId : errorMessageInTable()"></td>
                                    <td v-html="value.datetimeText ? value.datetimeText : errorMessageInTable()"></td>
                                    <td v-html="value.transaction ? value.transaction.toString() : errorMessageInTable()"></td>
                                    <td v-html="value.revenue ? value.revenue.toString() : errorMessageInTable()"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>

                <template #4-title>{{ _('w_BOSalesRecords_Step5') }}</template>
                <template #4>
                    <div>
                        <table class="table table-bordered table-hover datatable dataTable no-footer records-table">
                            <thead>
                                <th>{{ _('w_BOSalesRecords_StoreId') }}</th>
                                <th>{{ _('w_BOSalesRecords_Time') }}</th>
                                <th>{{ _('w_BOSalesRecords_Transaction') }}</th>
                                <th>{{ _('w_BOSalesRecords_Revenue') }}</th>
                                <th>{{ _('w_BOSalesRecords_ApiMessage') }}</th>
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
                    v-if="transitionStep > 1 && transitionStep < 4"
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
                    v-if="transitionStep == 3"
                    variant="dark"
                    size="lg"
                    :disabled="recordFileError"
                    @click="sendRecordFile"
                >{{ _('w_Submit') }}
                </b-button>
                <b-button
                    v-if="transitionStep == 4"
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

// API Interface
import { IBusinessOperationSalesRecord } from "../../config/default/api/interfaces";

// Service
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
import Utility from "@/services/Utility";
import Loading from "@/services/Loading";

// Export
import toExcel from "@/services/Excel/json2excel";
import excel2json from "@/services/Excel/excel2json";

interface IExcelTitle {
    storeId: string;
    date: string;
    hour: string;
    revenue: string;
    transaction: string;
    productId: string;
    count: string;
}

interface IRecordFile {
    apiMessage: string;
    storeId: string;
    dateText: string;
    hourText: string;
    revenue: number;
    transaction?: number; // ERecordType.sotre
    productId?: string; // ERecordType.product
    count?: number; // ERecordType.product
    datetimeText?: string; // maybe no text
    datetime?: Date; // maybe time error
}

@Component({
    components: {}
})
export default class SalesRecords extends Vue {
    transitionStep: number = 1;
    stepRef: any = this.$refs.step;
    file: any | null = null;
    recordFileError: boolean = false;
    recordFileContent: IRecordFile[] = [];

    errorMessageFromServer = {
        noSite: "site not found"
    };

    excelTitleName: IExcelTitle = {
        storeId: "Store ID",
        date: "Date",
        hour: "Hour",
        revenue: "Revenue",
        transaction: "Transaction",
        productId: "Product ID",
        count: "Count"
    };

    isMounted: boolean = false;
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

    downloadExample() {
        this.downloadExampleStore();
    }

    downloadExampleStore() {
        let excelData: IRecordFile[] = [];
        let rowCount = Math.floor(Math.random() * 50) + 1;
        let now = new Date();
        for (let i = 0; i < rowCount; i++) {
            excelData.push({
                apiMessage: "",
                storeId: "Store_" + Math.floor(Math.random() * 50),
                dateText:
                    (now.getFullYear() + 1).toString() +
                    "/" +
                    (Math.floor(Math.random() * 11) + 1).toString() +
                    "/" +
                    (Math.floor(Math.random() * 27) + 1).toString(),
                hourText: Math.floor(Math.random() * 23).toString(),
                revenue: Math.floor(Math.random() * 5000),
                transaction: Math.floor(Math.random() * 1000)
            });
        }

        const th = [
            this.excelTitleName.storeId,
            this.excelTitleName.date,
            this.excelTitleName.hour,
            this.excelTitleName.transaction,
            this.excelTitleName.revenue
        ];
        const filterVal = [
            "storeId",
            "dateText",
            "hourText",
            "transaction",
            "revenue"
        ];
        const data = excelData.map(v => filterVal.map(k => v[k]));
        const [fileName, fileType, sheetName] = [
            "ImportSalesRevenueTemplate",
            "xlsx",
            "SalesRevenue"
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
            Dialog.error(this._("w_BOSalesRecords_ErrorFileType"));
            return false;
        }

        excel2json(file)
            .then((data: any) => {
                for (let sheetRow of data) {
                    for (let row of sheetRow.sheet) {
                        let recordFile: IRecordFile = {
                            apiMessage: "",
                            storeId: "",
                            dateText: "",
                            hourText: "",
                            revenue: 0
                        };

                        // get value
                        if (row[this.excelTitleName.storeId] != undefined) {
                            recordFile.storeId = row[
                                this.excelTitleName.storeId
                            ]
                                .toString()
                                .trim();
                        }
                        if (row[this.excelTitleName.date] != undefined) {
                            recordFile.dateText = row[this.excelTitleName.date]
                                .toString()
                                .trim();
                        }

                        if (row[this.excelTitleName.hour] != undefined) {
                            recordFile.hourText = row[this.excelTitleName.hour]
                                .toString()
                                .trim();
                        }
                        if (row[this.excelTitleName.productId] != undefined) {
                            recordFile.productId = row[
                                this.excelTitleName.productId
                            ]
                                .toString()
                                .trim();
                        }
                        if (
                            row[this.excelTitleName.revenue] != undefined &&
                            !isNaN(parseFloat(row[this.excelTitleName.revenue]))
                        ) {
                            recordFile.revenue = parseFloat(
                                row[this.excelTitleName.revenue]
                                    .toString()
                                    .trim()
                            );
                        }
                        if (
                            row[this.excelTitleName.transaction] != undefined &&
                            !isNaN(
                                parseFloat(row[this.excelTitleName.transaction])
                            )
                        ) {
                            recordFile.transaction = parseFloat(
                                row[this.excelTitleName.transaction]
                                    .toString()
                                    .trim()
                            );
                        }

                        if (
                            row[this.excelTitleName.count] != undefined &&
                            !isNaN(parseFloat(row[this.excelTitleName.count]))
                        ) {
                            recordFile.count = parseFloat(
                                row[this.excelTitleName.count].toString().trim()
                            );
                        }

                        // 判斷時間格式
                        let resolveDate = true;
                        let DateArray = recordFile.dateText
                            .toString()
                            .split("/");

                        try {
                            if (DateArray.length > 0 && DateArray.length < 3) {
                                let tempDate: Date = new Date(
                                    (parseInt(DateArray[0]) - (25567 + 2)) *
                                        86400 *
                                        1000
                                );
                                let tempHour = Utility.PadLeft(
                                    recordFile.hourText,
                                    "0",
                                    2
                                );
                                // reset datetime text
                                if (isNaN(tempDate.getTime())) {
                                    this.recordFileError = true;
                                }
                                if (isNaN(parseInt(tempHour))) {
                                    this.recordFileError = true;
                                }

                                if (
                                    !isNaN(tempDate.getTime()) &&
                                    !isNaN(parseInt(tempHour))
                                ) {
                                    tempDate.setHours(parseInt(tempHour));
                                    recordFile.datetime = tempDate;
                                    recordFile.datetimeText = Datetime.DateTime2String(
                                        recordFile.datetime,
                                        "YYYY-MM-DD HH:mm:ss"
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
                                let tempHour = Utility.PadLeft(
                                    recordFile.hourText,
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
                                if (isNaN(parseInt(tempHour))) {
                                    this.recordFileError = true;
                                    resolveDateDetail = false;
                                }

                                if (resolveDateDetail) {
                                    // get Date()
                                    let tempDatetimeString: string = `${tempYear}-${tempMonth}-${tempDate} ${tempHour}:00:00`;

                                    // get Date relay string
                                    recordFile.datetime = Datetime.String2DateTime(
                                        tempDatetimeString,
                                        "YYYY-MM-DD HH:mm:SS"
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
                                    "YYYY-MM-DD HH:mm:ss"
                                );
                            }
                        } catch (e) {
                            this.recordFileError = true;
                            console.log("Date error, e: ", e);
                        }

                        // check disable submit button
                        if (!this.recordFileError) {
                            if (
                                recordFile.storeId == "" ||
                                recordFile.datetime == undefined ||
                                recordFile.transaction == undefined ||
                                recordFile.revenue == undefined
                            ) {
                                this.recordFileError = true;
                            }
                        }
                        this.recordFileContent.push(recordFile);
                    }
                }
                this.pageTo3();
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_BOSalesRecords_ErrorFileResolve")
                );
            });
    }

    async sendRecordFile() {
        let param: {
            datas: IBusinessOperationSalesRecord[];
        } = {
            datas: []
        };

        for (let content of this.recordFileContent) {
            let tempItem: IBusinessOperationSalesRecord = {
                customId: content.storeId,
                date: content.datetime.toISOString(),
                revenue: content.revenue,
                transaction: content.transaction
            };
            param.datas.push(tempItem);
        }

        Loading.show();
        await this.$server
            .C("/report/sales-record", param)
            .then((response: any) => {
                ResponseFilter.successCheck(
                    this,
                    response,
                    this.sendSuccess,
                    "",
                    false
                );
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
                        "w_BOSalesRecords_ApiSuccess"
                    )}</span>`;
                } else if (tempLoopValue.statusCode == 400) {
                    if (
                        tempLoopValue.message ==
                        this.errorMessageFromServer.noSite
                    ) {
                        this.recordFileContent[
                            iNumber
                        ].apiMessage = `<span style='color:red;'>${this._(
                            "w_BOSalesRecords_ErrorNoSite"
                        )}</span>`;
                    } else {
                        this.recordFileContent[
                            iNumber
                        ].apiMessage = `<span style='color:red;'>${this._(
                            "w_BOSalesRecords_ErrorServerError"
                        )}</span>`;
                    }
                } else if (tempLoopValue.statusCode == 401) {
                    this.recordFileContent[
                        iNumber
                    ].apiMessage = `<span style='color:red;'>${this._(
                        "w_BOSalesRecords_ErrorNoPremission"
                    )}</span>`;
                } else {
                    this.recordFileContent[
                        iNumber
                    ].apiMessage = `<span style='color:red;'>${this._(
                        "w_BOSalesRecords_ErrorServerError"
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
                "w_BOSalesRecords_ErrorServerError"
            );
        }
        this.pageTo4();
    }

    errorMessageInTable() {
        return `<span style='color:#f00;'>${this._(
            "w_BOSalesRecords_ErrorNoData"
        )}</span>`;
    }
}
</script>

<style lang="scss" scoped>
.error-message {
    color: #f00 !important;
}
.records-table tbody tr td .error-message {
    color: #f00 !important;
}
</style>

