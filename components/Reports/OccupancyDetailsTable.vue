<template>
    <div>
        <iv-card
            :visible="true"
            :label="'wait...'"
        >

            <template #toolbox>
                <iv-toolbox-back/>
            </template>

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
                    <td>{{ value.time }}</td>
                    <td>{{ value.numberDetected }}</td>
                    <td>
                            <img
                                class="threshold-image"
                                :src="src"
                            ><br>
                    </td>
                </tr>
                </tbody>
            </table>
            <template #footer>
                <b-button
                    variant="secondary"
                    size="lg"
                    @click="modalShow = !modalShow"
                >{{ _('w_BackToList') }}
                </b-button>
            </template>

        </iv-card>

    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop, Emit, Model, Watch } from "vue-property-decorator";
    import { toEnumInterface } from "@/../core";
    import ResponseFilter from "@/services/ResponseFilter";

    @Component({
        components: {}
    })
    export class OccupancyDetailsTable extends Vue {

        // Prop
        // @Prop({
        //     type: Boolean, // Boolean, Number, String, Array, Object
        //     default: false
        // })
        // modalShow: boolean;

        thresholdDetailTableTitle: any = [];


        created() {
            this.initDate();
        }

        mounted() {}

        initDate() {
            this.thresholdDetailTableTitle = [
                this._("w_Occupancy_Time"),
                this._("w_Occupancy_NumberDetected"),
                this._("w_Occupancy_Snapshot"),
            ];
        }

        doCancel() {

        }
    }

    export default OccupancyDetailsTable;
    Vue.component("occupancy_details_table", OccupancyDetailsTable);
</script>

<style lang="scss" scoped>
    .threshold-image {
        margin-bottom: 5px;
    }

</style>
