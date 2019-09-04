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
                :server="{ path: '/report/dwell-time' }"
                :params="tabelParam"
            >

                <template #area="{ $attrs, $listeners }">

                    {{$attrs.row.area.name}}
                </template>

                <template #group="{ $attrs, $listeners }">
                    {{showGroups($attrs.row.deviceGroups)}}
                </template>

                <template #camera="{ $attrs, $listeners }">
                    {{$attrs.row.device.name}}
                </template>

                <template #item="{ $attrs, $listeners }">
                    {{$attrs.row.isIn ? _('w_Navigation_Tools_TrafficIn') : _('w_Navigation_Tools_TrafficOut')}}
                </template>

                <template #snapshot="{ $attrs, $listeners }">
                    <img :src="serverConfig._url + $attrs.row.imageSrc"><img>
                </template>

                <template #time="{ $attrs, $listeners }">
                    {{showTime($attrs.row.date)}}
                </template>

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
import Datetime from "@/services/Datetime";
import ServerConfig from "@/services/ServerConfig";

@Component({
    components: {}
})
export default class ToolDwellTime extends Vue {
    serverConfig = ServerConfig;

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

    showGroups(data) {
        var groups = [];
        for (let datum of data) {
            groups.push(datum.name);
        }
        return groups.join(",");
    }

    showTime(date) {
        return Datetime.DateTime2String(
            new Date(date),
            `${Datetime.FormatCheckDate} HH:mm`
        );
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
                item: boolean;



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




