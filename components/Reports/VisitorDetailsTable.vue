<template>
    <div>
        <table
            ref="reportTable"
            class="table b-table table-striped table-hover"
        >
            <thead>
                <tr>
                    <th
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
                    <td>{{ value.site.name }}</td>
                    <td>{{ showTime(value.date) }}</td>
                    <td v-for="(item,index) in value.frequencyRanges">{{ item }}</td>
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

@Component({
    components: {}
})
export class VisitorDetailsTable extends Vue {
    Prop;
    @Prop({
        type: Array,
        default: () => []
    })
    thresholdDetailTableContent: [];

    thresholdDetailTableTitle: any = [];

    created() {
        this.initDate();
    }

    mounted() {}

    initDate() {
        this.thresholdDetailTableTitle = [
            this._("w_ReportVisitor_Site"),
            this._("w_ReportVisitor_Date"),
            this._("w_ReportVisitor_1"),
            this._("w_ReportVisitor_2"),
            this._("w_ReportVisitor_3"),
            this._("w_ReportVisitor_4"),
            this._("w_ReportVisitor_5")
        ];
    }

    doCancel() {}

    showTime(time) {
        return Datetime.DateTime2String(new Date(time), "YYYY-MM-DD HH:mm");
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
}

export default VisitorDetailsTable;
Vue.component("vistor-details-table", VisitorDetailsTable);
</script>

<style lang="scss" scoped>
.threshold-image {
    max-width: 300px;
    margin-bottom: 5px;
}
</style>
