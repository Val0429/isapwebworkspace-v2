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
                        :server="{ path: '/flow2/loglist' }"
                    >
                        <template #entity="{$attrs}">
                            {{ resolveEntity($attrs.row) }}
                        </template>

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

enum ELogActionType {
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
}

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

    resolveEntity(data: any): string {
        let result = "";
        console.log(data.action, ELogActionType.EventLogin);
        switch (data.action) {
            case ELogActionType.EventLogin:
                result = data.owner.username + " Login";
                break;
            case ELogActionType.EventLogout:
                break;
            case ELogActionType.EventConfigChanged:
                break;
            case ELogActionType.EventUserAdd:
                break;
            case ELogActionType.EventUserEdit:
                break;

            case ELogActionType.EventUserRemove:
                break;
            case ELogActionType.EventKioskAdd:
                break;
            case ELogActionType.EventKioskEdit:
                break;
            case ELogActionType.EventKioskRemove:
                break;
            case ELogActionType.EventLicenseAdd:
                break;

            case ELogActionType.EventFlow2InvitationComplete:
                break;
            case ELogActionType.EventFlow2PreRegistrationComplete:
                break;
            case ELogActionType.EventFlow2StrictTryCheckIn:
                break;
            case ELogActionType.EventFlow2StrictConfirmPhoneNumber:
                break;
            case ELogActionType.EventFlow2StrictScanIDCard:
                break;

            case ELogActionType.EventFlow2StrictCompareFace:
                break;
            case ELogActionType.EventFlow2StrictCompleteCheckIn:
                break;
            case ELogActionType.EventFlow2RegistrationComplete:
                break;
            case ELogActionType.EventFlow2TryCheckIn:
                break;
            case ELogActionType.EventFlow2FaceVerifyResult:
                break;

            case ELogActionType.EventFlow2DoneCheckIn:
                break;
            case ELogActionType.EventFlow2CompanyAdd:
                break;
            case ELogActionType.EventFlow2CompanyEdit:
                break;
            case ELogActionType.EventFlow2CompanyRemove:
                break;
            case ELogActionType.EventFlow2Concierge:
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
                action: string;

                owner: interface {
                    /**
                     * @uiLabel - ${this._("w_Logs_Owner")}
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




