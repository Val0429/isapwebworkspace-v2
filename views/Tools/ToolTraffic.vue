<template>
    <div class="animated fadeIn">

        <tool-traffic-filter @filter="receiveFilterData"></tool-traffic-filter>

        <iv-card
            :visible="visible"
            :label="_('w_Tool_FilterData')"
        >

            <iv-table
                ref="listTable"
                :interface="ITableList()"
                :server="{ path: '/user/group' }"
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

@Component({
    components: {}
})
export default class ToolTraffic extends Vue {
    // 收合card控制
    visible: boolean = false;

    created() {}

    mounted() {}

    receiveFilterData() {
        this.visible = true;
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
                 * @uiLabel - ${this._("w_Item")}
                 */
                itme: string;



                /**
                 * @uiLabel - ${this._("w_Snapshot")}
                 */
                snapshot: string;

                /**
                 * @uiLabel - ${this._("w_Time")}
                 */
                time: string;


            }
        `;
    }
}
</script>

<style lang="scss" scoped>
</style>




