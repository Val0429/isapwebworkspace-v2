<template>
    <div class="animated fadeIn">
        <title>Report Table</title>
        <table
            class="table table-bordered"
            v-if="reportTableData.head.length > 0"
        >
            <thead>
                <tr>
                    <th v-if="reportTableData.body[0].site">
                        Site
                    </th>
                    <th v-if="reportTableData.body[0].area">
                        Area
                    </th>
                    <th v-if="reportTableData.body[0].group">
                        Group
                    </th>
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
                <tr v-for="(items, key, index) in reportTableData.body">
                    <td
                        v-if="items.site"
                        rowspan="2"
                    >{{items.site}}</td>
                    <td
                        v-if="items.area"
                        rowspan="2"
                    >{{items.area}}</td>
                    <td
                        v-if="items.group"
                        rowspan="2"
                    >{{items.group}}</td>
                    <td>Tarffic - IN</td>
                    <td v-for="(item, key, index) in items.in">{{item}}</td>
                    <td v-if="items.context">{{showRowTotal(items.in)}}</td>
                </tr>
                <tr v-for="(items, key, index) in reportTableData.body">
                    <td>Tarffic - OUT</td>
                    <td v-for="(item, key, index) in items.out">{{item}}</td>
                    <td v-if="items.context">{{showRowTotal(items.out)}}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td
                        v-if="reportTableData.body[0].site"
                        rowspan="2"
                    ></td>
                    <td
                        v-if="reportTableData.body[0].area"
                        rowspan="2"
                    ></td>
                    <td
                        v-if="reportTableData.body[0].group"
                        rowspan="2"
                    ></td>
                    <td>Tarffic-in total</td>
                    <td v-for="(items, key, index) in reportTableData.head">{{showColTotal(reportTableData.body,"in")}}</td>
                </tr>
                <tr>
                    <td>Tarffic-out total</td>
                    <td v-for="(items, key, index) in reportTableData.head">{{showColTotal(reportTableData.body,"out")}}</td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import { IReportTableData } from "../Reports/models";

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

    created() {}

    mounted() {}

    showRowTotal(datas) {
        return datas.reduce((ty, u) => ty + u, 0);
    }

    showColTotal(datas, key) {
        return datas.reduce((ty, u) => ty[key] + u, 0);
    }
}

export default ReportTable;
Vue.component("report-table", ReportTable);
</script>

<style lang="scss" scoped>
</style>
