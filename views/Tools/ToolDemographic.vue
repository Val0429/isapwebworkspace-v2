<template>
    <div class="animated fadeIn">

        <tool-demographic-filter @filter="receiveFilterData"></tool-demographic-filter>

        <iv-card
            :visible="visible"
            :label="_('w_Tool_FilterData')"
        >

            <iv-table
                ref="listTable"
                :interface="ITableList()"
                :server="{ path: '/report/demographic' }"
                :params="tabelParam"
            >
            </iv-table>
        </iv-card>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Service
import Dialog from "@/services/Dialog";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";

@Component({
    components: {}
})
export default class ToolDemographic extends Vue {
    // 收合card控制
    visible: boolean = false;

    tabelParam: object = {};

    created() {}

    mounted() {}

    async receiveFilterData(filterData) {
        this.visible = true;
        this.tabelParam = filterData;

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
                 * @uiLabel - ${this._("w_Area")}
                 */
                area: string;

                   /**
                 * @uiLabel - ${this._("w_Group")}
                 */
                group: string;

                /**
                 * @uiLabel - ${this._("w_Camera")}
                 */
                camera: string;


                /**
                 * @uiLabel - ${this._("w_Snapshot")}
                 */
                snapshot: string;

                /**
                 * @uiLabel - ${this._("w_Time")}
                 */
                time: string;

                        /**
                 * @uiLabel - ${this._("w_Gender")}
                 */
                gender: string;

                 /**
                 * @uiLabel - ${this._("w_Age")}
                 */
               age: string;


            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>




