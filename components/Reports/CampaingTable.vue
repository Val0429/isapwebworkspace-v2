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
                    v-for="(value,index) in thresholdDetailTableData"
                    :key="'tableData__' + index"
                >
                    <td class="center">{{numberWithCommas(value.type)}}</td>
                    <td class="center">{{numberWithCommas(value.before)}}</td>
                    <td class="center">{{ numberWithCommas(value.during) }}</td>
                    <td class="center">{{ numberWithCommas(value.after) }}</td>
                    <td class="center">{{ toPercent(value.changeDuring ),0}}</td>
                    <td class="center">{{toPercent( value.changeAfter ),0}}</td>

                </tr>
            </tbody>
        </table>

        <div class="table-pagination right">
            <b-pagination-nav
                :link-gen="getData"
                :number-of-pages="Math.ceil(totalRow / prePage) ? Math.ceil(totalRow / prePage) : 1"
                v-model="currentPage"
            />
        </div>

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
export class CampaingTable extends Vue {
    Prop;
    @Prop({
        type: Array,
        default: () => []
    })
    thresholdDetailTableContent: [];

    thresholdDetailTableTitle: any = [];

    thresholdDetailTableData: any = [];

    serverConfig = ServerConfig;

    prePage = 5;
    currentPage = 1;
    totalRow = 5;

    created() {
        this.initDate();
    }

    mounted() {
        // this.getData();
    }

    initDate() {
        this.thresholdDetailTableTitle = [
            "",
            this._("w_Campaign_BeforeCampaign"),
            this._("w_Campaign_DuringCampaign"),
            this._("w_Campaign_AfterCampaign"),
            this._("w_Campaign_ChangeDuringCampaign"),
            this._("w_Campaign_ChangeAfterCampaign")
        ];
    }

    getData() {
        this.thresholdDetailTableData = this.thresholdDetailTableContent.filter(
            (u, i) =>
                i >= (this.currentPage - 1) * this.prePage &&
                i < this.currentPage * this.prePage
        );
        this.totalRow = this.thresholdDetailTableContent.length;
    }

    getNo(index: number, sortType: boolean = true): number {
        if (sortType) {
            return this.currentPage * this.prePage - this.prePage + index + 1;
        } else {
            return (
                this.currentPage * this.prePage -
                this.prePage +
                this.prePage -
                index
            );
        }
    }

    numberWithCommas(number) {
        return Math.abs(number)
            .toFixed(0)
            .toString()
            .replace(/\B(?=(\d{3})+\b)/g, ",");
    }

    toPercent(point, fixed = 0) {
        var str = Number(Math.abs(point) * 100).toFixed(fixed);
        str += "%";
        return str;
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

export default CampaingTable;
Vue.component("campaing-table", CampaingTable);
</script>

<style lang="scss" scoped>
.threshold-image {
    max-width: 300px;
    margin-bottom: 5px;
}
.center {
    text-align: center;
}

.right {
    float: right;
}
</style>
