<template>
    <div class="animated fadeIn overflow">
        <h2 v-if="reportTableData._body && reportTableData._body.length > 0">{{reportTableTitle.headTitle}}</h2>
        <table
            ref="reportTable"
            class="table table-bordered"
        >
            <thead>
                <tr class="title">
                    <th v-if="reportTableData._body &&  reportTableData._body[0] && reportTableData._body[0].site">
                        {{ _('w_Site')}}
                    </th>
                    <th v-if="reportTableData._body && reportTableData._body[0] && reportTableData._body[0].area">
                        {{ _('w_Area')}}
                    </th>
                    <th v-if="reportTableData._body && reportTableData._body[0] && reportTableData._body[0].group">
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
                    <tr v-if="reportTableTitle.title1">
                        <td
                            v-if="reportTableData._body && reportTableData._body[0] && reportTableData._body[0].site"
                            :rowspan="reportTableTitle.titleCount"
                            class="title"
                        >{{ items.site ? items.site.name: ""}}</td>
                        <td
                            v-if="reportTableData._body && reportTableData._body[0] && reportTableData._body[0].area"
                            :rowspan="reportTableTitle.titleCount"
                            class="title"
                        >{{items.area ? items.area.name:""}}</td>
                        <td
                            v-if="reportTableData._body && reportTableData._body[0] && reportTableData._body[0].group"
                            :rowspan="reportTableTitle.titleCount"
                            class="title"
                        >{{items.group ? items.group.name : ""}}</td>
                        <td class="title"> {{reportTableTitle.title1}}</td>
                        <td v-for="(item1, key, index) in items.item1">
                            <a
                                v-if="item1.link && item1.value != 0"
                                href="#"
                                @click="clickItem(reportTableData._head[key],items.site.objectId,items.area.objectId,'item1')"
                            >{{ item1.value}}</a>
                            <span v-else>{{ item1.value}}</span>
                            <span
                                v-if="item1.valueRatio != 0"
                                :class="eSign.none != item1.sign ? (eSign.positive == item1.sign ?  'green':'red') : ''"
                            >{{ " (" + toPercent(item1.valueRatio,0) + ")" }}</span>
                        </td>
                        <td v-if="items.item1">
                            <a>{{items.item1Total.value }}</a>
                            <span
                                v-if="items.item1Total.valueRatio != 0"
                                :class="eSign.none != items.item1Total.sign ? (eSign.positive == items.item1Total.sign ?  'green':'red') : ''"
                            >{{ " (" + toPercent(items.item1Total.valueRatio,0) + ")" }}</span>
                        </td>
                    </tr>
                    <tr v-if="reportTableTitle.title2">
                        <td class="title"> {{reportTableTitle.title2}}</td>
                        <td v-for="(item2, key, index) in items.item2">
                            <a
                                v-if="item2.link && item2.value != 0"
                                href="#"
                                @click="clickItem(reportTableData._head[key],items.site.objectId,items.area.objectId,'item2')"
                            >{{ item2.value }}</a>
                            <span v-else>{{ item2.value}}</span>
                            <span
                                v-if="item2.valueRatio != 0"
                                :class="eSign.none != item2.sign ? (eSign.positive == item2.sign ?  'green':'red') : ''"
                            >{{" (" + toPercent(item2.valueRatio,0) + ")" }}</span>
                        </td>
                        <td v-if="items.item2">
                            <span>{{ items.item2Total.value }}</span>
                            <span
                                v-if="items.item2Total.valueRatio"
                                :class="eSign.none != items.item2Total.sign ? (eSign.positive == items.item2Total.sign ?  'green':'red') : ''"
                            > {{" (" + toPercent(items.item2Total.valueRatio,0) + ")"}}</span>
                        </td>
                    </tr>
                    <tr v-if="reportTableTitle.title3">
                        <td class="title"> {{reportTableTitle.title3}}</td>
                        <td v-for="(item3, key, index) in items.item3">
                            <a
                                v-if="item3.link && item3.value != 0"
                                href="#"
                                @click="clickItem(reportTableData._head[key],items.site.objectId,items.area.objectId,'item3')"
                            >{{ item3.value }}</a>
                            <span v-else>{{ item3.value}}</span>
                            <span
                                v-if="item3.valueRatio != 0"
                                :class="eSign.none != item3.sign ? (eSign.positive == item3.sign ?  'green':'red') : ''"
                            >{{" (" + toPercent(item3.valueRatio,0) + ")" }}</span>
                        </td>
                        <td v-if="items.item3">
                            <span>{{ items.item3Total.value }}</span>
                            <span
                                v-if="items.item3Total.valueRatio != 0"
                                :class="eSign.none != items.item3Total.sign ? (eSign.positive == items.item3Total.sign ?  'green':'red') : ''"
                            > {{" (" + toPercent(items.item3Total.valueRatio,0) + ")"}}</span>
                        </td>
                    </tr>
                    <tr v-if="reportTableTitle.title4">
                        <td class="title"> {{reportTableTitle.title4}}</td>
                        <td v-for="(item4, key, index) in items.item4">
                            <a
                                v-if="item4.link && item4.value != 0"
                                href="#"
                                @click="clickItem(reportTableData._head[key],items.site.objectId,items.area.objectId,'item4')"
                            >{{ item4.value }}</a>
                            <span v-else>{{ item4.value}}</span>
                            <span
                                v-if="item4.valueRatio != 0"
                                :class="eSign.none != item4.sign ? (eSign.positive == item4.sign ?  'green':'red') : ''"
                            >{{" (" + toPercent(item4.valueRatio,0) + ")" }}</span>
                        </td>
                        <td v-if="items.item4">
                            <span>{{ items.item4Total.value }}</span>
                            <span
                                v-if="items.item4Total.valueRatio != 0"
                                :class="eSign.none != items.item4Total.sign ? (eSign.positive == items.item4Total.sign ?  'green':'red') : ''"
                            > {{" (" + toPercent(items.item4Total.valueRatio,0) + ")"}}</span>
                        </td>
                    </tr>
                </template>
            </tbody>
            <tfoot v-if="!reportTableData._noFoot && reportTableData._body && reportTableData._body.length > 0">
                <tr v-if="reportTableTitle.total1Title">
                    <td
                        v-if="reportTableData._body &&  reportTableData._body[0] && reportTableData._body[0].site"
                        :rowspan="reportTableTitle.titleCount"
                        class="title"
                    ></td>
                    <td
                        v-if="reportTableData._body &&  reportTableData._body[0] && reportTableData._body[0].area"
                        :rowspan="reportTableTitle.titleCount"
                        class="title"
                    ></td>
                    <td
                        v-if="reportTableData._body &&  reportTableData._body[0] && reportTableData._body[0].group"
                        :rowspan="reportTableTitle.titleCount"
                        class="title"
                    ></td>
                    <td class="title"> {{reportTableTitle.total1Title}}</td>
                    <td v-for="(items, key, index) in reportTableData.foot">
                        <span>{{ items.item1Total.value}}</span>
                        <span
                            v-if="items.item1Total.valueRatio != 0"
                            :class="eSign.none != items.item1Total.sign ? (eSign.positive == items.item1Total.sign ?  'green':'red') : ''"
                        >{{ " (" + toPercent(items.item1Total.valueRatio,0) + ")" }}</span>
                    </td>

                </tr>
                <tr v-if="reportTableTitle.total2Title">
                    <td class="title"> {{reportTableTitle.total2Title}}</td>
                    <td v-for="(items, key, index) in reportTableData.foot">
                        <span>{{ items.item2Total.value }}</span>
                        <span
                            v-if="items.item2Total.valueRatio != 0"
                            :class="eSign.none != items.item2Total.sign ? (eSign.positive == items.item2Total.sign ?  'green':'red') : ''"
                        >{{ " (" + toPercent(items.item2Total.valueRatio,0) + ")"}}</span>
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

    clickItem(time, site, area, rowName) {
        this.$emit(
            "clickItem",
            this.reportTableData.thatDay,
            time,
            site,
            area,
            rowName
        );
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
    color: #ff4326;
}
.green {
    color: #55c250;
}

.overflow {
    overflow-y: auto;
}
</style>

