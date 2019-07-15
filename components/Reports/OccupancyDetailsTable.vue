<template>
    <div>
        <table
            ref="reportTable"
            class="table b-table table-striped table-hover"
        >
            <thead>
                <tr>
                    <th
                        class="center"
                        v-for="(value,index) in thresholdDetailTableTitle"
                        :key="'title_' + index"
                    >{{ value }}
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr
                    v-for="(value,index) in thresholdDetailTableContent"
                    :key="'tableDataFromApi__' + index"
                >
                    <td class="center">{{ showTime(value.date)}}</td>
                    <td class="center">{{ value.total }}</td>
                    <td class="center">
                        <img
                            v-for="(item,index) in value.imageSrcs"
                            class="threshold-image"
                            :src="serverConfig.url  + item"
                        >
                    </td>
                </tr>
            </tbody>
        </table>

    </div>
</template>

<script lang="ts">
import {
    Vue,
    Component,
    Prop,
    Emit,
    Model,
    Watch
} from "vue-property-decorator";
import Datetime from "@/services/Datetime";
import ServerConfig from "@/services/ServerConfig";

@Component({
    components: {}
})
export class OccupancyDetailsTable extends Vue {
    Prop;
    @Prop({
        type: Array,
        default: () => []
    })
    thresholdDetailTableContent: [];

    thresholdDetailTableTitle: any = [];

    serverConfig = ServerConfig;

    created() {
        this.initDate();
    }

    mounted() {}

    initDate() {
        this.thresholdDetailTableTitle = [
            this._("w_Occupancy_Time"),
            this._("w_Occupancy_NumberDetected"),
            this._("w_Occupancy_Snapshot")
        ];
    }

    showTime(time) {
        return new Date(time).getHours() + ":" + new Date(time).getMinutes();
    }

    tableToArray() {
        let objTable: any = this.$refs.reportTable;
        let arrays = [];
        let rowspans = 0;
        let rowspanRowCount = 1;
        for (var i = 0; i < objTable.rows.length; i++) {
            let array = [];
            if (rowspanRowCount > 1) {
                rowspanRowCount--;
            } else {
                rowspans = 0;
            }
            for (let l = 0; l < rowspans; l++) {
                array.push("");
            }
            for (var j = 0; j < objTable.rows[i].cells.length; j++) {
                let strings = "";
                if (objTable.rows[i].cells[j].getAttribute("rowspan")) {
                    rowspanRowCount = objTable.rows[i].cells[j].getAttribute(
                        "rowspan"
                    );
                    rowspans++;
                }
                for (
                    var k = 0;
                    k < objTable.rows[i].cells[j].childNodes.length;
                    k++
                ) {
                    if (objTable.rows[i].cells[j].childNodes[k].length) {
                        strings += objTable.rows[i].cells[j].innerHTML;
                    } else {
                        strings +=
                            objTable.rows[i].cells[j].childNodes[k].innerHTML;
                    }
                }
                array.push(strings.trim());
            }
            arrays.push(array);
        }
        return arrays;
    }

    doCancel() {}
}

export default OccupancyDetailsTable;
Vue.component("occupancy-details-table", OccupancyDetailsTable);
</script>

<style lang="scss" scoped>
.threshold-image {
    max-width: 300px;
    margin-bottom: 5px;
}
.center {
    text-align: center;
}
</style>
