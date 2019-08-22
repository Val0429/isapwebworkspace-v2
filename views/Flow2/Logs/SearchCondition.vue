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
                    EventLogin = "1",
                    EventLogout = "2",
                    EventConfigChanged = "101",
                    EventUserAdd = "202",
                    EventUserEdit = "203",
                    EventUserRemove = "204",
                    EventKioskAdd = "212",
                    EventKioskEdit = "213",
                    EventKioskRemove = "214",
                    EventLicenseAdd = "300",
                    EventFlow2InvitationComplete = "3100",
                    EventFlow2PreRegistrationComplete = "3101",
                    EventFlow2StrictTryCheckIn = "3110",
                    EventFlow2StrictConfirmPhoneNumber = "3111",
                    EventFlow2StrictScanIDCard = "3112",
                    EventFlow2StrictCompareFace = "3113",
                    EventFlow2StrictCompleteCheckIn = "3114",
                    EventFlow2RegistrationComplete = "3115",
                    EventFlow2TryCheckIn = "3116",
                    EventFlow2FaceVerifyResult = "3117",
                    EventFlow2DoneCheckIn = "3118",
                    EventFlow2CompanyAdd = "4022",
                    EventFlow2CompanyEdit = "4023",
                    EventFlow2CompanyRemove = "4024",
                    EventFlow2Concierge = "4030"
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
