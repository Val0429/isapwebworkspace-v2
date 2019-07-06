<template>
    <div>
        <table class="table b-table table-striped table-hover">
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

                    <td>{{ value.title }}</td>
                    <td>{{ value.time }}</td>
                    <td>{{ value.oneTime }}</td>
                    <td>{{ value.twoTime }}</td>
                    <td>{{ value.threeTime }}</td>
                    <td>{{ value.fourTime }}</td>
                    <td>{{ value.upFiveTime }}</td>
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
    // Prop
    // @Prop({
    //     type: Array, // Boolean, Number, String, Array, Object
    //     default: () => []
    // })
    // thresholdDetailTableContent: object;

    thresholdDetailTableTitle: any = [];
    thresholdDetailTableContent: any = [];

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

        // 假資料

        for (let i = 0; i < 5; i++) {
            let dat = new Date();
            dat.setDate(dat.getDate() + i); // (2)

            let detailObject = {
                title: "京站店",
                time: Datetime.DateTime2String(dat, "YYYY/MM/DD"),
                oneTime: i % 1,
                twoTime: i % 2,
                threeTime: i % 3,
                fourTime: i % 4,
                upFiveTime: i % 5
            };
            this.thresholdDetailTableContent.push(detailObject);
        }
    }

    doCancel() {}
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
