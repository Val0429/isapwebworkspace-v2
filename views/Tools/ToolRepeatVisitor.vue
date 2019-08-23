<template>
    <div class="animated fadeIn">

        <tool-repeat-visitor-filter @filter="receiveFilterData"></tool-repeat-visitor-filter>

        <iv-card
            :visible="visible"
            :label="_('w_Tool_FilterData')"
        >

            <iv-table
                ref="listTable"
                :interface="ITableList()"
                :server="{ path: '/user/group' }"
            >
                <template #Actions="{$attrs, $listeners}">

                    <iv-toolbox-more>
                        <iv-toolbox-view @click="pageToView" />
                    </iv-toolbox-more>
                </template>

            </iv-table>

        </iv-card>

        <!-- 點擊彈出 detail -->
        <b-modal
            hide-footer
            size="xl"
            :title="_('w_Tool_RepeatVisitorDetail')"
            v-model="modalShow"
        >

            <iv-table
                ref="listTable"
                :interface="IDetailList()"
                :server="{ path: '/' }"
            >
                <template #Actions="{$attrs, $listeners}">

                    <iv-toolbox-more>
                        <iv-toolbox-view @click="pageToView" />
                    </iv-toolbox-more>
                </template>

            </iv-table>

            <hr>

            <b-button
                class="float-right"
                variant="secondary"
                type="button"
                @click="modalShow = !modalShow"
            >{{ _('w_Back') }}
            </b-button>

        </b-modal>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

// Service
import Dialog from "@/services/Dialog";

@Component({
    components: {}
})
export default class ToolRepeatVisitor extends Vue {

    // 收合card控制
    visible: boolean = false;

    isSelected: any = [];

    modalShow: boolean = false;

    created() {}

    mounted() {}

    receiveFilterData() {
        this.visible = true;
    }

    pageToView() {
        this.modalShow = true;
    }

    // Todo: wait api
    ITableList() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;


                /**
                 * @uiLabel - ${this._("w_Snapshot")}
                 */
                snapshot: string;


                /**
                 * @uiLabel - ${this._("w_ReportRepeatVisitor_NumberOfVisit")}
                 */
                count: string;


                Actions?: any;
            }
        `;
    }

    // Todo: wait api
    IDetailList() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;


                /**
                 * @uiLabel - ${this._("w_Snapshot")}
                 */
                snapshot: string;


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 */
                sites: string;


                /**
                 * @uiLabel - ${this._("w_Tool_VisitTime")}
                 */
                time: string;

            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>




