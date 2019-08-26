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
                :server="{ path: '/report/repeat-visitor' }"
                :params="tabelParam"
            >

                <template #snapshot="{ $attrs, $listeners }">

                    <img :src="serverConfig._url + $attrs.row.datas[0].imageSrc"><img>
                </template>

                <template #count="{ $attrs, $listeners }">
                    {{$attrs.row.count}}
                </template>

                <template #Actions="{$attrs, $listeners}">

                    <iv-toolbox-more>
                        <iv-toolbox-view @click="pageToView($attrs.row)" />
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
            <table
                ref="reportTable"
                class="table b-table table-striped table-hover"
            >
                <thead>
                    <tr>
                        <th
                            class="center"
                            v-for="(value,index) in tableDetailTitle"
                            :key="'title_' + index"
                        >{{ value }}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="(value,index) in tableDetailData.datas"
                        :key="'tableData__' + index"
                    >
                        <td class="center">{{index + 1}}</td>

                        <td class="center">

                            <img
                                :key="'tableDataSrc__' + index"
                                class="threshold-image"
                                :src="serverConfig._url  + value.imageSrc"
                            >
                        </td>
                        <td class="center">{{ showTime(value.date) }}</td>
                    </tr>
                </tbody>
            </table>

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
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";
import Datetime from "@/services/Datetime";
import ServerConfig from "@/services/ServerConfig";

@Component({
    components: {}
})
export default class ToolRepeatVisitor extends Vue {
    serverConfig = ServerConfig;

    // 收合card控制
    visible: boolean = false;

    tabelParam: object = {};

    isSelected: any = [];

    modalShow: boolean = false;

    tableDetailTitle: any = [];

    tableDetailData: any = [];

    created() {}

    mounted() {}

    async receiveFilterData(filterData) {
        this.visible = true;
        this.tabelParam = filterData;

        (this.$refs.listTable as any).reload();
    }

    showTime(date) {
        return Datetime.DateTime2String(new Date(date), "YYYY-MM-DD HH:mm");
    }

    pageToView(data) {
        this.tableDetailTitle = [
            this._("w_no"),
            this._("w_Snapshot"),
            this._("w_Time")
        ];
        this.tableDetailData = data;
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
}
</script>

<style lang="scss" scoped>
</style>




