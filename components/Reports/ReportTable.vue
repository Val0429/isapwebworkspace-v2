<template>
    <div class="animated fadeIn">
        <title>Report Table</title>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th v-for="(item, key, index) in tableData.head">
                        {{item}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(items, key, index) in tableData.body">
                    <td>{{items.title}}</td>
                    <td v-for="(item, key, index) in items.context">
                        {{item}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";

@Component({
    components: {}
})
export class ReportTable extends Vue {
    // Prop
    @Prop({
        type: Object,
        default: function() {
            return {};
        }
    })
    tableData: object;

    created() {}

    mounted() {}
}

export default ReportTable;
Vue.component("report-table", ReportTable);
</script>

<style lang="scss" scoped>
</style>
