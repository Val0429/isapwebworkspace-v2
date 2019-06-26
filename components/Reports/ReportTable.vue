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
                        <td v-for="(item, key, index) in items.in">{{item}}</td>
                        <td v-if="items.in">{{items.inTotal}}</td>

                    </tr>
                    <tr>
                        <td class="title">Tarffic - OUT</td>
                        <td v-for="(item, key, index) in items.out">{{item}}</td>
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
}
.green {
    color: #1bbc9b;
}
</style>
