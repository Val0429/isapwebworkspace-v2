<template>
    <div class="animated fadeIn">

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <div
                key="transition_1"
                v-show="transition.step === 1"
            >
                <search-condition @submit-data="reloadTable"></search-condition>

                <iv-card
                    :label="_('w_Logs_List')"
                    :visible="tableVisible"
                >
                    <iv-table
                        ref="listTable"
                        :interface="ITableList()"
                        :multiple="tableMultiple"
                        :params="tableParam"
                        :selectable="false"
                        :server="{path: '/location/company'}"
                    >

                        <!-- <template #action="{$attrs}">
                            {{ resolveAction($attrs.row.action) }}
                        </template>

                        <template #entity="{$attrs}">
                            {{ resolveEntity($attrs.row) }}
                        </template> -->

                    </iv-table>
                </iv-card>

            </div>

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

// Vue
import SearchCondition from "./SearchCondition.vue";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";

// enum ELogActionType {
//     EventLogin = "1",
//     EventLogout = "2",
//     EventConfigChanged = "101",
//     EventUserAdd = "202",
//     EventUserEdit = "203",
//     EventUserRemove = "204",
//     EventKioskAdd = "212",
//     EventKioskEdit = "213",
//     EventKioskRemove = "214",
//     EventLicenseAdd = "300",
//     EventFlow2InvitationComplete = "3100",
//     EventFlow2PreRegistrationComplete = "3101",
//     EventFlow2StrictTryCheckIn = "3110",
//     EventFlow2StrictConfirmPhoneNumber = "3111",
//     EventFlow2StrictScanIDCard = "3112",
//     EventFlow2StrictCompareFace = "3113",
//     EventFlow2StrictCompleteCheckIn = "3114",
//     EventFlow2RegistrationComplete = "3115",
//     EventFlow2TryCheckIn = "3116",
//     EventFlow2FaceVerifyResult = "3117",
//     EventFlow2DoneCheckIn = "3118",
//     EventFlow2CompanyAdd = "4022",
//     EventFlow2CompanyEdit = "4023",
//     EventFlow2CompanyRemove = "4024",
//     EventFlow2Concierge = "4030"
// }

@Component({
    components: {
        SearchCondition
    }
})
export default class Logs extends Vue {
    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    tableMultiple: boolean = true;
    tableVisible: boolean = false;
    selectedDetail: any = [];
    tableParam: {
        start: string;
        end: string;
        action?: string;
    } = {
        start: Datetime.DateStart(new Date()).toISOString(),
        end: Datetime.DateEnd(new Date()).toISOString()
    };

    created() {}

    mounted() {}

    reloadTable(datas: any) {
        this.tableVisible = true;
        if (datas.startDate != undefined) {
            this.tableParam.start = datas.startDate.toISOString();
        }
        if (datas.endDate != undefined) {
            this.tableParam.end = datas.endDate.toISOString();
        }
        if (datas.eventType != undefined && datas.eventType != "") {
            this.tableParam.action = datas.eventType;
        }
        (this.$refs.listTable as any).reload();
    }

    resolveAction(action: string): string {
        action = action.replace("Event", "");
        action = action.replace(/Flow[\d]/, "");
        return action;
    }

    resolveEntity(data: any): string {
        let result = "";
        let userName =
            data.owner && data.owner.username ? data.owner.username : "";
        switch (data.action) {
            case "EventLogin":
                result = `[${userName}] Login`;
                break;
            case "EventLogout":
                result = `[${userName}] Logout`;
                break;
            case "EventConfigChanged":
                result = `[${userName}] Change config`;
                break;
            case "EventUserAdd":
                result = `[${userName}] Add user`;
                break;
            case "EventUserEdit":
                result = `[${userName}] Edit user`;
                break;

            case "EventUserRemove":
                result = `[${userName}] Remove user`;
                break;
            case "EventKioskAdd":
                result = `[${userName}] Add Kiosk`;
                break;
            case "EventKioskEdit":
                result = `[${userName}] Edit Kiosk`;
                break;
            case "EventKioskRemove":
                result = `[${userName}] Remove Kiosk`;
                break;
            case "EventLicenseAdd":
                result = `[${userName}] Add license`;
                break;

            case "EventFlow2InvitationComplete":
                result = `[${userName}] Invitation complete`;
                break;
            case "EventFlow2PreRegistrationComplete":
                result = `[${userName}] Pre-registration complete`;
                break;
            case "EventFlow2StrictTryCheckIn":
                result = `[${userName}] Strict try check in`;
                break;
            case "EventFlow2StrictConfirmPhoneNumber":
                result = `[${userName}] Strict confirm phone number`;
                break;
            case "EventFlow2StrictScanIDCard":
                result = `[${userName}] Strict scan ID card`;
                break;

            case "EventFlow2StrictCompareFace":
                result = `[${userName}] Strict compare face`;
                break;
            case "EventFlow2StrictCompleteCheckIn":
                result = `[${userName}] Strict complete check in`;
                break;
            case "EventFlow2RegistrationComplete":
                result = `[${userName}] Registration complete`;
                break;
            case "EventFlow2TryCheckIn":
                result = `[${userName}] Try check in`;
                break;
            case "EventFlow2FaceVerifyResult":
                result = `[${userName}] Face verify`;
                break;

            case "EventFlow2DoneCheckIn":
                result = `[${userName}] Check in done`;
                break;
            case "EventFlow2CompanyAdd":
                result = `[${userName}] Add company`;
                break;
            case "EventFlow2CompanyEdit":
                result = `[${userName}] Edit company`;
                break;
            case "EventFlow2CompanyRemove":
                result = `[${userName}] Remove company`;
                break;
            case "EventFlow2Concierge":
                result = `[${userName}] Concierge log`;
                break;

            default:
                break;
        }

        if (result == "") {
            result = JSON.stringify(data.entity);
        }

        return result;
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
                 * @uiLabel - ${this._("w_Logs_EventType")}
                 */
                action: any;

                owner: interface {
                    /**
                     * @uiLabel - ${this._("w_Logs_Message")}
                     */
                    username: string;
                };

                /**
                 * @uiLabel - ${this._("w_Logs_Entity")}
                 */
                entity: any;

                /**
                 * @uiLabel - ${this._("w_Logs_CreatedAt")}
                 * @uiType - iv-cell-date
                 * @uiAttrs - { format: "YYYY-MM-DD HH:mm:ss" }
                 */
                createdAt: date;

            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>




