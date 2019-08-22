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
                        :server="{ path: '/flow2/logs' }"
                    >
                        <template #entity="{$attrs}">
                            {{ JSON.stringify($attrs.row.entity) }}
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




