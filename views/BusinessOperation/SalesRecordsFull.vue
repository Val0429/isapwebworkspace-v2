<template>
    <div class="animated fadeIn">

        <iv-card :label="_('w_BOSalesRecords_CardTitle')">

            <iv-step-progress
                ref="step"
                @mounted="doMounted"
            >
                <template #1-title>{{ _('w_BOSalesRecords_Step1') }}</template>
                <template #1>
                    <b-button
                        class="col-md-5"
                        @click="chooseStore"
                    >{{ _('w_BOSalesRecords_RecordTypeStore') }}
                    </b-button>
                    <span class="col-md-1"></span>
                    <b-button
                        class="col-md-5"
                        @click="chooseProduct"
                    >{{ _('w_BOSalesRecords_RecordTypeProduct') }}
                    </b-button>
                </template>

                <template #2-title>{{ _('w_BOSalesRecords_Step2') }}</template>
                <template #2>
                    <b-button
                        class="col-md-12"
                        @click="downloadExample"
                    >{{ _('w_BOSalesRecords_Download') }}</b-button>
                </template>

                <template #3-title>{{ _('w_BOSalesRecords_Step3') }}</template>
                <template #3>
                    <b-form-file
                        v-model="file"
                        v-on:input="uploadFile"
                    />
                </template>

                <template #4-title>{{ _('w_BOSalesRecords_Step4') }}</template>
                <template #4>
                    <div>{{ recordType }}</div>
                    <div v-if="recordType == eRecordType.store">
                        <table class="table table-bordered table-hover datatable dataTable no-footer records-table">
                            <thead>
                                <th>{{ _('w_BOSalesRecords_StoreId') }}</th>
                                <th>{{ _('w_BOSalesRecords_Time') }}</th>
                                <th>{{ _('w_BOSalesRecords_Transaction') }}</th>
                                <th>{{ _('w_BOSalesRecords_Amount') }}</th>
                            </thead>
                            <tbody>
                                <tr v-for="value in recordFileContent">
                                    <td v-html="value.storeId ? value.storeId : errorMessageInTable()"></td>
                                    <td v-html="value.datetimeText ? value.datetimeText : errorMessageInTable()"></td>
                                    <td v-html="value.transaction ? value.transaction.toString() : errorMessageInTable()"></td>
                                    <td v-html="value.amount ? value.amount.toString() : errorMessageInTable()"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="recordType == eRecordType.product">
                        <table class="table table-bordered table-hover datatable dataTable no-footer records-table">
                            <thead>
                                <th>{{ _('w_BOSalesRecords_StoreId') }}</th>
                                <th>{{ _('w_BOSalesRecords_Time') }}</th>
                                <th>{{ _('w_BOSalesRecords_ProductId') }}</th>
                                <th>{{ _('w_BOSalesRecords_Count') }}</th>
                                <th>{{ _('w_BOSalesRecords_Amount') }}</th>
                            </thead>
                            <tbody>
                                <tr v-for="value in recordFileContent">
                                    <td v-html="value.storeId ? value.storeId : errorMessageInTable()"></td>
                                    <td v-html="value.datetimeText ? value.datetimeText : errorMessageInTable()"></td>
                                    <td v-html="value.productId ? value.productId : errorMessageInTable()"></td>
                                    <td v-html="value.count ? value.count.toString() : errorMessageInTable()"></td>
                                    <td v-html="value.amount? value.amount.toString() : errorMessageInTable()"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>

                <template #5-title>{{ _('w_BOSalesRecords_Step5') }}</template>
                <template #5>
                </template>

            </iv-step-progress>

            <template
                #footer
                v-if="pageStep > 1"
            >
                <b-button
                    v-if="pageStep > 1 && pageStep < 5"
                    variant="dark"
                    size="lg"
                    @click="pageToPrev"
                >{{ _('w_PreviousPage') }}
                </b-button>
                <b-button
                    v-if="pageStep == 2"
                    variant="dark"
                    size="lg"
                    @click="pageTo3"
                >{{ _('w_NextPage') }}
                </b-button>
                <b-button
                    v-if="pageStep == 4"
                    variant="dark"
                    size="lg"
                    :disabled="recordFileError"
                    @click="sendRecordFile"
                >{{ _('w_Submit') }}
                </b-button>
                <b-button
                    v-if="pageStep == 5"
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
import Loading from "@/services/Loading";

// Export
import toExcel from "@/services/Excel/json2excel";
import excel2json from "@/services/Excel/excel2json";
import Datetime from "@/services/Datetime";
import Utility from "@/services/Utility";

enum ERecordType {
    none = "none",
    store = "store",
    product = "product"
}

interface IExcelTitle {
    storeId: string;
    date: string;
    hour: string;
    amount: string;
    transaction: string;
    productId: string;
    count: string;
}

interface IRecordFile {
    storeId: string;
    dateText: string;
    hourText: string;
    amount: number;
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
    pageStep: number = 1;
    eRecordType = ERecordType;
    recordType: ERecordType = ERecordType.none;
    stepRef: any = this.$refs.step;
    file: any | null = null;
    recordFileError: boolean = false;
    recordFileContent: IRecordFile[] = [];

    excelTitleName: IExcelTitle = {
        storeId: "Store ID",
        date: "Date",
        hour: "Hour",
        amount: "Amount",
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
        if (this.pageStep >= 5) {
            this.pageTo4();
        } else if (this.pageStep == 4) {
            this.pageTo3();
        } else if (this.pageStep == 3) {
            this.pageTo2();
        } else {
            this.pageTo1();
        }
    }

    pageTo1() {
        this.file = null;
        this.recordType = ERecordType.none;
        this.recordFileContent = [];
        this.pageStep = 1;
        this.recordFileError = false;
        this.stepToPageStep();
    }

    pageTo2() {
        if (this.recordType == ERecordType.none) {
            this.pageTo1();
        } else {
            this.pageStep = 2;
            this.stepToPageStep();
        }
    }

    pageTo3() {
        this.pageStep = 3;
        this.recordFileContent = [];
        this.recordFileError = false;
        this.file = null;
        this.stepToPageStep();
    }

    pageTo4() {
        this.pageStep = 4;
        this.stepToPageStep();
    }

    pageTo5() {
        this.pageStep = 5;
        this.stepToPageStep();
    }

    stepToPageStep() {
        this.stepRef.currentStep = this.pageStep;
    }

    chooseStore() {
        this.recordType = ERecordType.store;
        this.pageTo2();
    }

    chooseProduct() {
        this.recordType = ERecordType.product;
        this.pageTo2();
    }

    downloadExample() {
        switch (this.recordType) {
            case ERecordType.store:
                this.downloadExampleStore();
                break;
            case ERecordType.product:
                this.downloadExampleProduct();
                break;
        }
    }

    downloadExampleStore() {
        let excelData: IRecordFile[] = [];

        let rowCount = Math.floor(Math.random() * 50) + 1;
        let now = new Date();
        for (let i = 0; i < rowCount; i++) {
            excelData.push({
                storeId: "Store_" + Math.floor(Math.random() * 50),
                dateText:
                    (now.getFullYear() + 1).toString() +
                    "/" +
                    (Math.floor(Math.random() * 11) + 1).toString() +
                    "/" +
                    (Math.floor(Math.random() * 27) + 1).toString(),
                hourText: Math.floor(Math.random() * 23).toString(),
                amount: Math.floor(Math.random() * 5000),
                transaction: Math.floor(Math.random() * 1000)
            });
        }

        const th = [
            this.excelTitleName.storeId,
            this.excelTitleName.date,
            this.excelTitleName.hour,
            this.excelTitleName.transaction,
            this.excelTitleName.amount
        ];
        const filterVal = [
            "storeId",
            "dateText",
            "hourText",
            "transaction",
            "amount"
        ];
        const data = excelData.map(v => filterVal.map(k => v[k]));
        const [fileName, fileType, sheetName] = [
            "ImportSalesAmountTemplate",
            "xlsx",
            "SalesAmount"
        ];
        toExcel({ th, data, fileName, fileType, sheetName });
    }

    downloadExampleProduct() {
        let excelData = [];

        let rowCount = Math.floor(Math.random() * 50) + 1;
        let now = new Date();
        for (let i = 0; i < rowCount; i++) {
            excelData.push({
                storeId: "Store_" + Math.floor(Math.random() * 50),
                dateText:
                    (now.getFullYear() + 1).toString() +
                    "/" +
                    (Math.floor(Math.random() * 11) + 1).toString() +
                    "/" +
                    (Math.floor(Math.random() * 27) + 1).toString(),
                hourText: Math.floor(Math.random() * 23).toString(),
                amount: Math.floor(Math.random() * 5000),
                productId: "Product_" + Math.floor(Math.random() * 20),
                count: Math.floor(Math.random() * 1000)
            });
        }

        const th = [
            this.excelTitleName.storeId,
            this.excelTitleName.date,
            this.excelTitleName.hour,
            this.excelTitleName.productId,
            this.excelTitleName.count,
            this.excelTitleName.amount
        ];
        const filterVal = [
            "storeId",
            "dateText",
            "hourText",
            "productId",
            "count",
            "amount"
        ];
        const data = excelData.map(v => filterVal.map(k => v[k]));
        const [fileName, fileType, sheetName] = [
            "ImportProductSalesAmountTemplate",
            "xlsx",
            "ProductSalesAmount"
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
                            storeId: "",
                            dateText: "",
                            hourText: "",
                            amount: 0
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
                            row[this.excelTitleName.amount] != undefined &&
                            !isNaN(parseFloat(row[this.excelTitleName.amount]))
                        ) {
                            recordFile.amount = parseFloat(
                                row[this.excelTitleName.amount]
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
                        if (DateArray.length < 3) {
                            this.recordFileError = true;
                            resolveDate = false;
                        }

                        if (resolveDate) {
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

                                // reset datetime text
                                if (!isNaN(recordFile.datetime.getTime())) {
                                    recordFile.datetimeText = Datetime.DateTime2String(
                                        recordFile.datetime,
                                        "YYYY-MM-DD HH:mm:ss"
                                    );
                                }
                            }
                        }

                        // check disable submit button
                        if (!this.recordFileError) {
                            switch (this.recordType) {
                                case ERecordType.store:
                                    if (
                                        recordFile.storeId == "" ||
                                        recordFile.datetime == undefined ||
                                        recordFile.transaction == undefined ||
                                        recordFile.amount == undefined
                                    ) {
                                        this.recordFileError = true;
                                    }
                                    break;
                                case ERecordType.product:
                                    if (
                                        recordFile.storeId == "" ||
                                        recordFile.datetime == undefined ||
                                        recordFile.productId == undefined ||
                                        recordFile.count == undefined ||
                                        recordFile.amount == undefined
                                    ) {
                                        this.recordFileError = true;
                                    }
                                    break;
                            }
                        }
                        this.recordFileContent.push(recordFile);
                    }
                }
                this.pageTo4();
            })
            .catch((e: any) => {
                return ResponseFilter.base(
                    this,
                    e,
                    this._("w_BOSalesRecords_ErrorFileResolve")
                );
            });
    }

    async sendRecordFile() {
        this.pageTo5();
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

