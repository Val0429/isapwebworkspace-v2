<template>
    <div class="animated fadeIn overflow">
        <title>Report Table</title>
        <table
            ref="reportTable"
            class="table table-bordered"
            v-if="reportTableData._body && reportTableData._body.length > 0"
        >
            <thead>
                <tr class="title">
                    <th v-if="reportTableData._body[0].site">
                        {{ _('w_Site')}}
                    </th>
                    <th v-if="reportTableData._body[0].area">
                        {{ _('w_Area')}}
                    </th>
                    <th v-if="reportTableData._body[0].group">
                        {{ _('w_Group')}}

                    </th>
                    <th>
                        {{ _('w_Item')}}

                    </th>
                    <th v-for="(item, key, index) in reportTableData._head">
                        {{item}}
                    </th>
                    <th>
                        {{ _('w_Total')}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(items, key, index) in reportTableData._body">
                    <tr>
                        <td
                            v-if="items.site"
                            :rowspan="reportTableTitle.titleCount"
                            class="title"
                        >{{items.site.name}}</td>
                        <td
                            v-if="items.area"
                            :rowspan="reportTableTitle.titleCount"
                            class="title"
                        >{{items.area.name}}</td>
                        <td
                            v-if="items.group"
                            :rowspan="reportTableTitle.titleCount"
                            class="title"
                        >{{items.group.name}}</td>
                        <td class="title"> {{reportTableTitle.title1}}</td>
                        <td v-for="(itemIn, key, index) in items.in">
                            <span>{{ itemIn.value}}</span>
                            <span
                                v-if="itemIn.valueRatio != 0"
                                :class="eSign.none != itemIn.sign ? (eSign.positive == itemIn.sign ?  'green':'red') : ''"
                            >{{ " (" + toPercent(itemIn.valueRatio,0) + ")" }}</span>
                        </td>
                        <td v-if="items.in">
                            <span>{{items.inTotal.value }}</span>
                            <span
                                v-if="items.inTotal.valueRatio != 0"
                                :class="eSign.none != items.inTotal.sign ? (eSign.positive == items.inTotal.sign ?  'green':'red') : ''"
                            >{{ " (" + toPercent(items.inTotal.valueRatio,0) + ")" }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="title"> {{reportTableTitle.title2}}</td>
                        <td v-for="(itemOut, key, index) in items.out">
                            <span>{{ itemOut.value }}</span>
                            <span
                                v-if="itemOut.valueRatio != 0"
                                :class="eSign.none != itemOut.sign ? (eSign.positive == itemOut.sign ?  'green':'red') : ''"
                            >{{" (" + toPercent(itemOut.valueRatio,0) + ")" }}</span>
                        </td>
                        <td v-if="items.out">
                            <span>{{ items.outTotal.value }}</span>
                            <span
                                v-if="items.outTotal.valueRatio"
                                :class="eSign.none != items.outTotal.sign ? (eSign.positive == items.outTotal.sign ?  'green':'red') : ''"
                            > {{" (" + toPercent(items.outTotal.valueRatio,0) + ")"}}</span>
                        </td>
                    </tr>
                    <tr v-if="reportTableTitle.title3">
                        <td class="title"> {{reportTableTitle.title3}}</td>
                        <td v-for="(itemIn, key, index) in items.in2">
                            <span>{{ itemIn.value }}</span>
                            <span
                                v-if="itemIn.valueRatio != 0"
                                :class="eSign.none != itemIn.sign ? (eSign.positive == itemIn.sign ?  'green':'red') : ''"
                            >{{" (" + toPercent(itemIn.valueRatio,0) + ")" }}</span>
                        </td>
                        <td v-if="items.in2">
                            <span>{{ items.inTotal2.value }}</span>
                            <span
                                v-if="items.inTotal2.valueRatio != 0"
                                :class="eSign.none != items.inTotal2.sign ? (eSign.positive == items.inTotal2.sign ?  'green':'red') : ''"
                            > {{" (" + toPercent(items.inTotal2.valueRatio,0) + ")"}}</span>
                        </td>
                    </tr>
                    <tr v-if="reportTableTitle.title4">
                        <td class="title"> {{reportTableTitle.title4}}</td>
                        <td v-for="(itemOut, key, index) in items.out2">
                            <span>{{ itemOut.value }}</span>
                            <span
                                v-if="itemOut.valueRatio != 0"
                                :class="eSign.none != itemOut.sign ? (eSign.positive == itemOut.sign ?  'green':'red') : ''"
                            >{{" (" + toPercent(itemOut.valueRatio,0) + ")" }}</span>
                        </td>
                        <td v-if="items.out2">
                            <span>{{ items.outTotal2.value }}</span>
                            <span
                                v-if="items.outTotal2.valueRatio != 0"
                                :class="eSign.none != items.outTotal2.sign ? (eSign.positive == items.outTotal2.sign ?  'green':'red') : ''"
                            > {{" (" + toPercent(items.outTotal2.valueRatio,0) + ")"}}</span>
                        </td>
                    </tr>
                </template>
            </tbody>
            <tfoot v-if="!reportTableData._noFoot">
                <tr>
                    <td
                        v-if="reportTableData._body[0].site"
                        :rowspan="reportTableTitle.titleCount"
                        class="title"
                    ></td>
                    <td
                        v-if="reportTableData._body[0].area"
                        :rowspan="reportTableTitle.titleCount"
                        class="title"
                    ></td>
                    <td
                        v-if="reportTableData._body[0].group"
                        :rowspan="reportTableTitle.titleCount"
                        class="title"
                    ></td>
                    <td class="title"> {{reportTableTitle.inTotalTitle}}</td>
                    <td v-for="(items, key, index) in reportTableData.foot">
                        <span>{{ items.inTotal.value}}</span>
                        <span
                            v-if="items.inTotal.valueRatio != 0"
                            :class="eSign.none != items.inTotal.sign ? (eSign.positive == items.inTotal.sign ?  'green':'red') : ''"
                        >{{ " (" + toPercent(items.inTotal.valueRatio,0) + ")" }}</span>
                    </td>

                </tr>
                <tr>
                    <td class="title"> {{reportTableTitle.outTotalTitle}}</td>
                    <td v-for="(items, key, index) in reportTableData.foot">
                        <span>{{ items.outTotal.value }}</span>
                        <span
                            v-if="items.outTotal.valueRatio != 0"
                            :class="eSign.none != items.outTotal.sign ? (eSign.positive == items.outTotal.sign ?  'green':'red') : ''"
                        >{{ " (" + toPercent(items.outTotal.valueRatio,0) + ")"}}</span>
                    </td>

                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import { ReportTableData, IReportTableTitle, ESign } from "./";

@Component({
    components: {}
})
export class ReportTable extends Vue {
    // Prop
    @Prop({
        type: Object,
        default: function() {
            return new ReportTableData();
        }
    })
    reportTableData: ReportTableData;

    @Prop({
        type: Object,
        default: function() {
            return {
                titleCount: 0
            };
        }
    })
    reportTableTitle: IReportTableTitle;

    eSign = ESign;

    created() {}

    mounted() {}

    toPercent(point, fixed) {
        var str = Number(point * 100).toFixed(fixed);
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
                        if (objTable.rows[i].cells[j].childNodes[k].innerHTML) {
                            strings +=
                                objTable.rows[i].cells[j].childNodes[k]
                                    .innerHTML;
                        }
                    }
                }
                array.push(strings.trim());
            }
            arrays.push(array);
        }
        return arrays;
    }
}

export default ReportTable;
Vue.component("report-table", ReportTable);
</script>

<style lang="scss" scoped>
.title {
    background-color: #f8f8f8;
}

.red {
    color: #e26929;
    font-size: 10px;
}
.green {
    color: #1bbc9b;
    font-size: 10px;
}

.overflow {
    overflow-y: auto;
}
</style>

