<template>
    <div class="animated fadeIn">

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
export default class ToolDemographic extends Vue {
    // 收合card控制
    visible: boolean = false;

    created() {}

    mounted() {}

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




