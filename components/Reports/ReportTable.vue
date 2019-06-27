<template>
    <div class="animated fadeIn">
        <title>Report Table</title>
        <table
            class="table table-bordered"
            v-if="reportTableData.body.length > 0"
        >
            <thead>
                <tr class="title">
                    <th v-if="reportTableData.body[0].site">
                        Site
                    </th>
                    <th v-if="reportTableData.body[0].area">
                        Area
                    </th>
                    <th v-if="reportTableData.body[0].group">
                        Group
                    </th>
                    <th>
                        Item
                    </th>
                    <th v-for="(item, key, index) in reportTableData.head">
                        {{item}}
                    </th>
                    <th>
                        Total
                    </th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(items, key, index) in reportTableData.body">
                    <tr>
                        <td
                            v-if="items.site"
                            rowspan="2"
                            class="title"
                        >{{items.site}}</td>
                        <td
                            v-if="items.area"
                            rowspan="2"
                            class="title"
                        >{{items.area}}</td>
                        <td
                            v-if="items.group"
                            rowspan="2"
                            class="title"
                        >{{items.group}}</td>
                        <td class="title">Tarffic - IN</td>
                        <td v-for="(itemIn, key, index) in items.in">
                            <span>{{itemIn.value > 0 ? itemIn.value : "N/A"}}</span>
                            <span :class="sign.none != itemIn.sign ? (sign.positive == itemIn.sign ?  'green':'red') : ''">{{itemIn.valueRatio > 0 ? " (" + toPercent(itemIn.valueRatio,0) + ")" : "N/A"}}</span>
                        </td>
                        <td v-if="items.in">{{items.inTotal}}</td>

                    </tr>
                    <tr>
                        <td class="title">Tarffic - OUT</td>
                        <td v-for="(itemOut, key, index) in items.out">
                            <span>{{itemOut.value > 0 ? itemOut.value : "N/A"}}</span>
                            <span :class="sign.none != itemOut.sign ? (sign.positive == itemOut.sign ?  'green':'red') : ''">{{itemOut.valueRatio > 0 ? " (" + toPercent(itemOut.valueRatio,0) + ")" : "N/A"}}</span>
                        </td>
                        <td v-if="items.out">{{items.outTotal}}</td>
                    </tr>
                </template>
            </tbody>
            <tfoot>
                <tr>
                    <td
                        v-if="reportTableData.body[0].site"
                        rowspan="2"
                        class="title"
                    ></td>
                    <td
                        v-if="reportTableData.body[0].area"
                        rowspan="2"
                        class="title"
                    ></td>
                    <td
                        v-if="reportTableData.body[0].group"
                        rowspan="2"
                        class="title"
                    ></td>
                    <td class="title">Tarffic-in Total</td>
                    <td v-for="(items, key, index) in reportTableData.foot">{{items.inTotal}}</td>
                </tr>
                <tr>
                    <td class="title">Tarffic-out Total</td>
                    <td v-for="(items, key, index) in reportTableData.foot">{{items.outTotal}}</td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import { IReportTableData } from "../Reports/models";

enum Sign {
    positive = "positive",
    negative = "negative",
    none = "none"
}

@Component({
    components: {}
})
export class ReportTable extends Vue {
    // Prop
    @Prop({
        type: Object,
        default: function() {
            return new IReportTableData();
        }
    })
    reportTableData: IReportTableData;

    sign = Sign;

    created() {}

    mounted() {}

    toPercent(point, fixed) {
        var str = Number(point * 100).toFixed(fixed);
        str += "%";
        return str;
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
</style>
