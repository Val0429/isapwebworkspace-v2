<template>
    <div class="animated fadeIn">

        <div
            key="transition_4"
            v-show="transition.step === 4"
        >
        </div>

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <div
                key="transition_1"
                v-show="transition.step === 1"
            >

                <search-condition @submit-data="receiveSearchConditionData"></search-condition>

                <iv-card
                    key="transition_1"
                    v-show="transition.step === 1"
                    :label=" _('w_Invitation_List') "
                >
                    <template #toolbox>

                        <iv-toolbox-edit @click="pageToEdit" />
                        <iv-toolbox-divider />

                        <iv-toolbox-export-excel @click="downloadPageExcel" />
                        <iv-toolbox-add @click="pageToAdd" />

                    </template>

                    <iv-table
                        ref="listTable"
                        :interface="ITableList()"
                        :multiple="tableMultiple"
                        :server="{ path: '/flow1/crms' }"
                        :params="flow1Params"
                        @selected="selectedItem($event)"
                    >

                        <!--                        <template #status="{$attrs, $listeners}">-->
                        <!--                            {{ tableShowStatus($attrs.value) }}-->
                        <!--                        </template>-->

                        <template #startDate="{$attrs}">
                            {{ $attrs.value ? dateToYYYY_MM_DD($attrs.value) : ''}}
                        </template>

                        <template #endDate="{$attrs}">
                            {{ $attrs.value ? dateToYYYY_MM_DD($attrs.value) : ''}}
                        </template>

                        <template #workCategory="{$attrs, $listeners}">
                            {{$attrs.row.workCategory.name }}
                        </template>

                        <template #Actions="{$attrs, $listeners}">

                            <iv-toolbox-more>
                                <iv-toolbox-edit @click="pageToEdit" />
                            </iv-toolbox-more>
                        </template>

                    </iv-table>
                </iv-card>

            </div>

            <div
                key="transition_2"
                v-show="transition.step === 2"
            >
                <add-ptw @add-ptw-back-to-list="addPTWToList"></add-ptw>
            </div>

            <div
                key="transition_3"
                v-show="transition.step === 3"
            >
                <!-- status-pendding-edit -->
                <edit-ptw
                    v-if="!CheckObjectIfEmpty(selectedDetail) && selectedDetail.status === 'pendding'"
                    :selectedDetail="selectedDetail"
                    @edit-ptw-back-to-list="editPtwBackToList"
                ></edit-ptw>

                <!-- status-new-view -->
                <status-new-view
                    v-if="!CheckObjectIfEmpty(selectedDetail) && selectedDetail.status === 'new'"
                    :selectedDetail="selectedDetail"
                    @view-done="editPtwBackToList"
                    @edit-ptw-back-to-list="editPtwBackToList"
                ></status-new-view>

                <!-- status-approve-edit， 可編輯， 須加上 Approve未期後的條件 -->
                <status-approve-not-expire-date-edit
                    v-if="!CheckObjectIfEmpty(selectedDetail) && selectedDetail.status === 'approve' && CheckDate(new Date(),selectedDetail.workEndDate)"
                    :selectedDetail="selectedDetail"
                    @view-done="editPtwBackToList"
                >

                </status-approve-not-expire-date-edit>

                <!-- status-reject-view ，只看，還需要 加上 Approve到期後的條件 -->
                <status-reject-approve-expire-date-view
                    v-if="!CheckObjectIfEmpty(selectedDetail) && selectedDetail.status === 'reject' || !CheckObjectIfEmpty(selectedDetail) && selectedDetail.status === 'approve' && !CheckDate(new Date(),selectedDetail.workEndDate)"
                    :selectedDetail="selectedDetail"
                    @view-done="editPtwBackToList"
                >
                </status-reject-approve-expire-date-view>

            </div>

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import SearchCondition from "./SearchCondition.vue";
import AddPTW from "./AddPTW.vue";
import EditPTW from "./EditPTW.vue";
import StatusNewView from "./StatusNewView.vue";
import StatusRejectOrApproveExpireDateView from "./StatusRejectOrApproveExpireDateView.vue";
import StatusApproveNotExpireDate from "./StatusApproveNotExpireDate.vue";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";
import Datetime from "@/services/Datetime";

// Export
import toExcel from "@/services/Excel/json2excel";

enum EStatus {
    new = "new",
    pendding = "pendding",
    approve = "approve",
    reject = "reject"
}

@Component({
    components: {
        SearchCondition,
        AddPTW,
        EditPTW,
        StatusNewView,
        StatusRejectOrApproveExpireDateView,
        StatusApproveNotExpireDate
    }
})
export default class Invitation extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    // table相關
    path: string = "";
    tableMultiple: boolean = false;
    selectedDetail: any = {};

    // api 回來資料
    responseData: any = {};
    flow1Params: any = {
        startDate: new Date(),
        paging: {
            pageSize: 10,
            page: 1
        },
        endDate: new Date()
    };

    workDescriptionSelectItem: any = {};

    inputFormData: any = {
        objectId: "",
        contact: "",
        contactEmail: "",
        companyId: "",
        workCategoryId: ""
    };

    created() {
        this.initWorkDescriptionSelectItem();
    }

    mounted() {}

    isExpired(date) {
        if (date.getTime > new Date().getTime) {
            return "(Expired)";
        } else {
            return "";
        }
    }

    selectedItem(data) {
        if (!data) {
            this.selectedDetail = {};
        } else {
            this.selectedDetail = data;
        }
        console.log("Inva selectedItem ~ ", this.selectedDetail);
    }

    async initWorkDescriptionSelectItem() {
        this.workDescriptionSelectItem = {};
        let tempDescriptionSelectItem = {};

        await this.$server
            .R("/flow1/purposes")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (const returnValue of response.results) {
                        tempDescriptionSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                    this.workDescriptionSelectItem = tempDescriptionSelectItem;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    pageToList() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;
        (this.$refs.listTable as any).reload();
    }

    pageToAdd() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;
    }

    pageToEdit() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
    }

    async receiveSearchConditionData(searchConditionData: any) {
        this.flow1Params = JSON.parse(JSON.stringify(searchConditionData));
    }

    async addPTWToList(addPTWParam: object) {
        this.pageToList();
        this.inputFormData = addPTWParam;
    }

    editPtwBackToList() {
        this.pageToList();
    }

    downloadPageExcel() {
        let abc;
        Dialog.prompt(
            this._("w_ExportExcel"),
            this._("w_HowToExportExcel"),
            [
                this._("w_Invitation_ExportCurrentPage"),
                this._("w_Invitation_ExportAllData")
            ],
            index => {
                switch (index) {
                    case 0:
                        this.exportExcel();
                        break;
                    case 1:
                        this.exportAllExcel();
                        break;
                    default:
                        break;
                }
            }
        );
    }

    async exportAllExcel() {
        console.log("exportAllExcel", this.flow1Params);
        let parms = JSON.parse(JSON.stringify(this.flow1Params));
        let paging = {
            pageSize: 100000,
            page: 1
        };
        parms.paging = paging;

        await this.$server
            .R("/flow1/crms", parms)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.exportExcelByApi(response.results);
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_Dialog_ErrorTitle")
                );
            });
    }

    exportExcelByApi(tableData) {
        console.log("exportExcelByApi");
        let tableTh = document.getElementById("DataTables_Table_0") as any;

        let th = [];
        for (var i = 0; i < tableTh.rows.length; i++) {
            if (i == 0) {
                for (let title of tableTh.rows[i].cells) {
                    if (title.innerText.trim().length > 0) {
                        th.push(title.innerText);
                    }
                }
            }
        }

        let data = [];
        for (var i = 0; i < tableData.length; i++) {
            let td = [];
            td.push(i + 1);
            td.push(tableData[i].ptwId);
            td.push(tableData[i].status);
            td.push(tableData[i].contactEmail);
            td.push(tableData[i].company.name);
            td.push(tableData[i].workPremisesUnit);
            td.push(tableData[i].workCategory.name);
            td.push(new Date(tableData[i].workStartDate));
            td.push(new Date(tableData[i].workEndDate));
            td.push(tableData[i].workContact);

            data.push(td);
        }

        let [fileName, fileType, sheetName] = [
            this._("w_Navigation_Invitation"),
            "xlsx",
            "Sheet 1"
        ];
        toExcel({ th, data, fileName, fileType, sheetName });
    }

    exportExcel() {
        console.log("exportExcel");
        //let reportTable: any = this.$refs.listTable;
        let tableData = document.getElementById("DataTables_Table_0") as any;

        //data
        let th = [];
        let data = [];
        for (var i = 0; i < tableData.rows.length; i++) {
            if (i == 0) {
                for (let title of tableData.rows[i].cells) {
                    if (title.innerText.trim().length > 0) {
                        th.push(title.innerText);
                    }
                }
            } else {
                let td = [];
                for (let body of tableData.rows[i].cells) {
                    if (body.innerText.trim().length > 0) {
                        td.push(body.innerText);
                    }
                }
                data.push(td);
            }
        }

        let [fileName, fileType, sheetName] = [
            this._("w_Navigation_Invitation"),
            "xlsx",
            "Sheet 1"
        ];
        toExcel({ th, data, fileName, fileType, sheetName });
    }

    dateToYYYY_MM_DD(value) {
        return Datetime.DateTime2String(new Date(value), "YYYY-MM-DD");
    }

    tableShowStatus(status: number): string {
        let result = "";
        switch (status) {
            case 1:
                result = this._("w_Invitation_New");
                break;
            case 2:
                result = this._("w_Invitation_PendingApproved");
                break;
            case 3:
                result = this._("w_Invitation_Approved");
                break;
            case 4:
                result = this._("w_Invitation_Rejected");
                break;
        }

        return result;
    }

    tableShowWorkCategory(workCategoryId: string): string {
        let result = "";

        for (const id in this.workDescriptionSelectItem) {
            if (workCategoryId === id) {
                result = this.workDescriptionSelectItem[id];
            }
        }

        return result;
    }

    CheckObjectIfEmpty(obj: object): boolean {
        const result = Object.keys(obj);
        return result.length === 0;
    }

    DateToZero(value: Date): Date {
        let date = new Date(value.getTime());
        date.setHours(0, 0, 0, 0);
        return date;
    }

    CheckDate(today: Date, endDate: Date) {
        return (
            this.DateToZero(new Date(endDate)).getTime() >=
            this.DateToZero(today).getTime()
        );
    }

    ITableList() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_PTWID")}
                 */
                ptwId: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_PTWStatus")}
                 */
                status: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Email")}
                 */
                contactEmail: string;


                company: interface {
                    /**
                     * @uiLabel - ${this._("w_Invitation_Tenant")}
                     */
                    name: string;

                };


                /**
                 * @uiLabel - ${this._("w_Invitation_Unit")}
                 */
                workPremisesUnit: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_WorkCategory")}
                 */
                workCategory: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_StartDate")}
                 */
                workStartDate: Date;


                /**
                 * @uiLabel - ${this._("w_Invitation_EndDate")}
                 */
                workEndDate: Date;


                /**
                 * @uiLabel - ${this._("w_Invitation_ContractorCompany")}
                 */
                workContact: string;

                Actions: any

            }`;
    }

    IAddForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_PTWID")}
                 */
                ptwId: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_PTWStatus")}
                 */
                ptwStatus: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Email")}
                 */
                email: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Tenant")}
                 */
                tenant: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_Unit")}
                 */
                workPremisesUnit: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_WorkCategory")}
                 */
                workCategory: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_StartDate")}
                 */
                workStartDate: Date;


                /**
                 * @uiLabel - ${this._("w_Invitation_EndDate")}
                 */
                workEndDate: Date;


                /**
                 * @uiLabel - ${this._("w_Invitation_ContractorCompany")}
                 */
                workContact: string;

                Actions: any


            }`;
    }
}
</script>

<style lang="scss" scoped>
</style>




