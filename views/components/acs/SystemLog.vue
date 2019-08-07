<template>
    <div key="main">
        <iv-auto-card :label="_('w_Search')">
                <iv-form
                    :interface="filterInterface()"
                    @submit="doFilter($event)"
                >
                </iv-form>
            </iv-auto-card>
            <iv-card :label="_('w_SystemLog')">
        <iv-table
                    ref="mainTable"
                    :interface="mainList()"
                    :server="{ path: '/acs/systemlog' }"
                    :params="filter"
                >
                    <template #date="{$attrs, $listeners}">
                        {{momento($attrs.row.createdAt).format("YYYY-MM-DD")}}
                    </template>
                    <template #time="{$attrs, $listeners}">
                        {{momento($attrs.row.createdAt).format("HH:mm:ss")}}
                    </template>
                    <template #user="{$attrs, $listeners}">
                        {{$attrs.value ? $attrs.value.username : "SYSTEM"}}
                    </template>
                </iv-table>
            </iv-card>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";
import Dialog from "@/services/Dialog/Dialog";
import { PermissionName} from '@/../src/constants/permissions';
import { System } from '@/config/default/api/interfaces';
import moment from 'moment';


@Component({
    components: { }
})
export default class QueryPermission extends Vue {
    filter:any={name:'', content:'', startDate:new Date(), endDate:new Date()}
    doFilter($event) {
        console.log("doFilter event", $event);
        if($event.startDate){
            $event.start = moment($event.startDate).format("YYYY-MM-DD");
            delete($event.startDate);
        }
        if($event.endDate){
            $event.end = moment($event.endDate).format("YYYY-MM-DD");
            delete($event.endDate);
        }
        this.filter = $event;
        console.log("doFilter filter", this.filter);
    }
    momento:any=moment;
    mainList(){
        return `
            interface {
                /**
                 * @uiLabel - ${this._("w_log_date")}
                 */
                date?: string;
                /**
                 * @uiLabel - ${this._("w_log_time")}
                 */
                time?: string;
                /**
                 * @uiLabel - ${this._("w_Username")}
                 */
                user?: string;
                /**
                 * @uiLabel - ${this._("w_log_title")}
                 */
                title?: string;
                /**
                 * @uiLabel - ${this._("w_log_message")}
                 */
                message?: string;

            }
        `;
    }
    filterInterface() {
        return `
            interface {
                /**
                 * @uiColumnGroup - row2
                 * @uiType - iv-form-date
                 * @uiLabel - ${this._("w_Startdate")}
                 * @uiPlaceHolder - ${this._("w_Startdate")}
                 */
                startDate?: Date;
                /**
                 * @uiColumnGroup - row2
                 * @uiType - iv-form-date
                 * @uiLabel - ${this._("w_Enddate")}
                 * @uiPlaceHolder - ${this._("w_Enddate")}
                 */
                endDate?: Date;
                /**
                 * @uiLabel - ${this._("w_log_title")}
                 * @uiColumnGroup - row1
                 * @uiPlaceHolder - ${this._("w_log_title")}
                 */
                name?: string;
                /**
                 * @uiColumnGroup - row1
                 * @uiLabel - ${this._("w_log_message")}
                 * @uiPlaceHolder - ${this._("w_log_message")}
                 */
                content?: string;
                

            }
        `;
    }

    

    
}
</script>
<style lang="scss" scoped>

</style>
