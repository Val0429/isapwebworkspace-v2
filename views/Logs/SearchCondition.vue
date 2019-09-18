<template>
    <div>

        <iv-auto-card :label="_('w_Logs_SearchCondition')">
            <iv-form
                v-if="beMount"
                :interface="IFilterConditionForm()"
                :value="inputFormData"
                @update:*="udpateFilterConditionForm"
                @submit="doSubmit($event)"
            >
            </iv-form>

            <template #footer-before></template>

        </iv-auto-card>

    </div>
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import Datetime from "@/services/Datetime";
import Dialog from "@/services/Dialog";
import ResponseFilter from "@/services/ResponseFilter";

interface IPaging {
    pageSize: number;
    page: number;
}

@Component({
    components: {}
})
export class SearchCondition extends Vue {
    beMount: boolean = true;
    inputFormData: any = {
        startDate: new Date(),
        endDate: new Date(),
        eventType: ""
    };

    created() {
        this.initInputFormData();
    }

    mounted() {}

    initInputFormData() {
        this.beMount = false;
        this.inputFormData.startDate = Datetime.DateStart(new Date());
        this.inputFormData.endDate = Datetime.DateEnd(new Date());
        this.beMount = true;
    }

    udpateFilterConditionForm(data: any) {
        this.inputFormData[data.key] = data.value;
    }

    async doSubmit(data) {
        const doSubmitParam: {
            startDate?: Date;
            endDate?: Date;
            eventType?: string;
        } = {};

        if (
            data.startDate &&
            data.startDate != null &&
            data.startDate != "Invalid Date"
        ) {
            doSubmitParam.startDate = Datetime.DateStart(data.startDate);
        }

        if (
            data.endDate &&
            data.endDate != null &&
            data.endDate != "Invalid Date"
        ) {
            doSubmitParam.endDate = Datetime.DateEnd(data.endDate);
        }

        if (this.inputFormData.eventType != "") {
            doSubmitParam.eventType = this.inputFormData.eventType;
        }

        this.$emit("submit-data", doSubmitParam);
    }

    doReset() {
        this.inputFormData = {
            startDate: Datetime.DateStart(new Date()),
            endDate: Datetime.DateEnd(new Date()),
            eventType: null
        };
    }

    IFilterConditionForm() {
        return `
            interface {

                /**
                * @uiLabel - ${this._("w_Startdate")}
                * @uiPlaceHolder - ${this._("w_Startdate")}
                * @uiType - iv-form-date
                * @uiColumnGroup - row1
                */
                startDate: date;

                /**
                * @uiLabel - ${this._("w_Enddate")}
                * @uiPlaceHolder - ${this._("w_Enddate")}
                * @uiType - iv-form-date
                * @uiColumnGroup - row1
                */
                endDate: date;

                /**
                 * @uiLabel - ${this._("w_Logs_EventType")}
                 * @uiPlaceHolder - ${this._("w_Logs_EventType")}
                 * @uiColumnGroup - row2
                 */
                eventType?: enum {
                    ServiceStop = "",
                    ServiceStart = "",
                    FrsConnected = "",
                    FrsDisconnected = "",
                    LoginSuccess = "",
                    LoginFail = "",
                    UserCreate = "",
                    UserDelete = "",
                    UserUpdate = "",
                    DeviceAdd = "",
                    DeviceEdit = "",
                    DeviceRemove = "",
                    GenerateReportData = ""

                    Login = "1",
                    Logout = "2",
                    ConfigChanged = "101",
                    UserAdd = "202",
                    UserEdit = "203",
                    UserRemove = "204",
                    KioskAdd = "212",
                    KioskEdit = "213",
                    KioskRemove = "214",
                    LicenseAdd = "300",
                    InvitationComplete = "3100",
                    PreRegistrationComplete = "3101",
                    StrictTryCheckIn = "3110",
                    StrictConfirmPhoneNumber = "3111",
                    StrictScanIDCard = "3112",
                    StrictCompareFace = "3113",
                    StrictCompleteCheckIn = "3114",
                    RegistrationComplete = "3115",
                    TryCheckIn = "3116",
                    FaceVerifyResult = "3117",
                    DoneCheckIn = "3118",
                    CompanyAdd = "4022",
                    CompanyEdit = "4023",
                    CompanyRemove = "4024",
                    Concierge = "4030"
                };
            }
        `;
    }
}

export default SearchCondition;
Vue.component("search-condition", SearchCondition);
</script>

<style lang="scss" scoped>
.submit {
    background-color: #5c7895;
    border: 1px solid #5c7895;
}
.reset {
    background-color: #d7d7d7;
    border: 1px solid #d7d7d7;
}
</style>
