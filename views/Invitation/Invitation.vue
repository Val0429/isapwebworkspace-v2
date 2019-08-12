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

                <search-condition
                    @submit-data="receiveSearchConditionData"
                    @excel="downloadExcel"
                ></search-condition>

                <iv-card
                    key="transition_1"
                    v-show="transition.step === 1"
                    :label=" _('w_Invitation_List') "
                >
                    <template #toolbox>

                        <iv-toolbox-edit @click="pageToView" />
                        <iv-toolbox-divider />

                        <iv-toolbox-export-excel @click="downloadPageExcel" />
                        <iv-toolbox-add @click="pageToAdd" />

                    </template>

                    <iv-table
                        ref="listTable"
                        :interface="ITableList()"
                        :multiple="tableMultiple"
                        :server="{ path: '/flow1/crms' }"
                        @selected="selectedItem($event)"
                    >

                        <template #status="{$attrs, $listeners}">
                            {{ tableShowStatus($attrs.value) }}
                        </template>

                        <template #Actions="{$attrs, $listeners}">

                            <iv-toolbox-more>
                                <iv-toolbox-edit @click="pageToView" />
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
                    v-if="!CheckObjectIfEmpty(selectedDetail) && selectedDetail.status !== 1 "
                    :selectedDetail="selectedDetail"
                    @edit-ptw-back-to-list="editPtwBackToList"
                ></edit-ptw>

                <!-- status-new-view -->
                <status-new-view
                    v-if="!CheckObjectIfEmpty(selectedDetail) && selectedDetail.status === 1"
                    :selectedDetail="selectedDetail"
                    @view-done="editPtwBackToList"
                ></status-new-view>

                <!-- status-approve-edit， 可編輯， 須加上 Approve未期後的條件 -->
                <!--                <status-approve-not-expire-date-edit-->
                <!--                    v-if="!CheckObjectIfEmpty(selectedDetail) && selectedDetail.status === 4"-->
                <!--                    :selectedDetail="selectedDetail"-->
                <!--                    @view-done="editPtwBackToList">-->
                <!--                    -->
                <!--                </status-approve-not-expire-date-edit>-->

                <!-- status-reject-view ， 還需要 加上 Approve到期後的條件 -->
                <!--                <status-reject-approve-expire-date-view-->
                <!--                    v-if="!CheckObjectIfEmpty(selectedDetail) && selectedDetail.status === 4"-->
                <!--                    :selectedDetail="selectedDetail"-->
                <!--                    @view-done="editPtwBackToList"-->
                <!--                >-->

                <!--                </status-reject-approve-expire-date-view>-->

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

    inputFormData: any = {
        objectId: "",
        contact: "",
        contactEmail: "",
        companyId: "",
        workCategory: ""
    };

    created() {}

    mounted() {}

    isExpired(date) {
        if (date.getTime > new Date().getTime) {
            return "(Expired)";
        } else {
            return "";
        }
    }

    selectedItem(data) {
        // data.length === 0 || !!data ?  : ;

        if (!data) {
            this.selectedDetail = {};
        } else {
            this.selectedDetail = data;
        }

        console.log(" ~ ", this.selectedDetail);
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

    pageToView() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 3;
        // TODO: 7steps
    }

    async receiveSearchConditionData(searchConditionData: any) {
        let param = JSON.parse(JSON.stringify(searchConditionData));

        // TODO: wait api
        // Loading.show();
        // await this.$server
        //     .R("/", param)
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(this, response, (response: any) => {
        //             this.responseData = response;
        //         });
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.catchError(this, e);
        //     });
    }

    async addPTWToList(addPTWParam: object) {
        this.pageToList();
        this.inputFormData = addPTWParam;
    }

    editPtwBackToList() {
        this.pageToList();
    }

    downloadExcel() {
        console.log("downloadExcel");
        //TODO wait API
    }

    downloadPageExcel() {
        console.log("downloadPageExcel");
        this.exportExcel();
    }

    exportExcel() {
        let reportTable: any = null;
        reportTable = this.$refs.listTable;
        let tableData = reportTable.tableToArray();

        //th
        let th = [];
        for (let title of tableData[0]) {
            th.push(title);
        }

        //data
        let data = [];
        for (let bodys of tableData) {
            if (tableData.indexOf(bodys) == 0) continue;
            data.push(bodys);
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

    CheckObjectIfEmpty(obj: object): boolean {
        const result = Object.keys(obj);
        return result.length === 0;
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
                unit: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_WorkCategory")}
                 */
                workCategory: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_StartDate")}
                 */
                startDate: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_EndDate")}
                 */
                endDate: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_ContractorCompany")}
                 */
                contractor: string;

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
                unit: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_WorkCategory")}
                 */
                workCategory: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_StartDate")}
                 */
                startDate: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_EndDate")}
                 */
                endDate: string;


                /**
                 * @uiLabel - ${this._("w_Invitation_ContractorCompany")}
                 */
                contractor: string;

                Actions: any


            }`;
    }
}
</script>

<style lang="scss" scoped>
</style>




