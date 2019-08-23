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
                :server="{ path: '/report/people-counting' }"
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
import Loading from '@/services/Loading';
import ResponseFilter from '@/services/ResponseFilter';

@Component({
    components: {}
})
export default class ToolTraffic extends Vue {
    // 收合card控制
    visible: boolean = false;

    created() {}

    mounted() {}

    async receiveFilterData(filterData) {
        this.visible = true;

        Loading.show();
        await this.$server
            .C("/report/people-counting", filterData)
            .then((response: any) => {
                ResponseFilter.successCheck(
                    this,
                    response,
                    (response: any) => {},
                );
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(
                    this,
                    e,
                    this._("w_Dialog_ErrorTitle")
                );
            });

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




