<template>
    <div class="animated fadeIn">
        <title>Report Table</title>
        <table
            class="table table-bordered"
            v-if="reportTableData._body && reportTableData._body.length > 0"
        >
            <thead>
                <tr class="title">
                    <th v-if="reportTableData._body[0].site">
                        Site
                    </th>
                    <th v-if="reportTableData._body[0].area">
                        Area
                    </th>
                    <th v-if="reportTableData._body[0].group">
                        Group
                    </th>
                    <th>
                        Item
                    </th>
                    <th v-for="(item, key, index) in reportTableData._head">
                        {{item}}
                    </th>
                    <th>
                        Total
                    </th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(items, key, index) in reportTableData._body">
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
                            <span>{{ itemIn.value}}</span>
                            <span :class="eSign.none != itemIn.sign ? (eSign.positive == itemIn.sign ?  'green':'red') : ''">{{ " (" + toPercent(itemIn.valueRatio,0) + ")" }}</span>
                        </td>
                        <td v-if="items.in">
                            <span>{{items.inTotal.value }}</span>
                            <span :class="eSign.none != items.inTotal.sign ? (eSign.positive == items.inTotal.sign ?  'green':'red') : ''">{{ " (" + toPercent(items.inTotal.valueRatio,0) + ")" }}</span>

                        </td>

                    </tr>
                    <tr>
                        <td class="title">Tarffic - OUT</td>
                        <td v-for="(itemOut, key, index) in items.out">
                            <span>{{ itemOut.value }}</span>
                            <span :class="eSign.none != itemOut.sign ? (eSign.positive == itemOut.sign ?  'green':'red') : ''">{{" (" + toPercent(itemOut.valueRatio,0) + ")" }}</span>
                        </td>
                        <td v-if="items.out">
                            <span>{{ items.outTotal.value }}</span>
                            <span :class="eSign.none != items.outTotal.sign ? (eSign.positive == items.outTotal.sign ?  'green':'red') : ''"> {{" (" + toPercent(items.outTotal.valueRatio,0) + ")"}}</span>
                        </td>
                    </tr>
                </template>
            </tbody>
            <tfoot>
                <tr>
                    <td
                        v-if="reportTableData._body[0].site"
                        rowspan="2"
                        class="title"
                    ></td>
                    <td
                        v-if="reportTableData._body[0].area"
                        rowspan="2"
                        class="title"
                    ></td>
                    <td
                        v-if="reportTableData._body[0].group"
                        rowspan="2"
                        class="title"
                    ></td>
                    <td class="title">Tarffic-in Total</td>
                    <td v-for="(items, key, index) in reportTableData.foot">
                        <span>{{ items.inTotal.value}}</span>
                        <span :class="eSign.none != items.inTotal.sign ? (eSign.positive == items.inTotal.sign ?  'green':'red') : ''">{{ " (" + toPercent(items.inTotal.valueRatio,0) + ")" }}</span>
                    </td>

                </tr>
                <tr>
                    <td class="title">Tarffic-out Total</td>
                    <td v-for="(items, key, index) in reportTableData.foot">
                        <span>{{ items.outTotal.value }}</span>
                        <span :class="eSign.none != items.outTotal.sign ? (eSign.positive == items.outTotal.sign ?  'green':'red') : ''">{{ " (" + toPercent(items.outTotal.valueRatio,0) + ")"}}</span>
                    </td>

                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import { ReportTableData, ESign } from "../Reports/models";

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

    eSign = ESign;

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
