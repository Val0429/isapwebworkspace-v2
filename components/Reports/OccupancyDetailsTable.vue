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
                            :src="value.src"
                        ><br>
                    </td>
                </tr>
                </tbody>
            </table>
            <template #footer>
                <b-button
                    variant="secondary"
                    size="lg"
                >{{ _('w_Back') }}
                </b-button>
            </template>

        </iv-card>

    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop, Emit, Model, Watch } from "vue-property-decorator";
    import { toEnumInterface } from "@/../core";
    import ResponseFilter from "@/services/ResponseFilter";
    import Datetime from '@/services/Datetime';

    @Component({
        components: {}
    })
    export class OccupancyDetailsTable extends Vue {

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
                this._("w_Occupancy_Time"),
                this._("w_Occupancy_NumberDetected"),
                this._("w_Occupancy_Snapshot"),
            ];

            // 假資料

            for (let i = 0; i < 10 ; i++) {
                let detailObject = {
                    time: Datetime.DateTime2String(new Date(), "YYYY/MM/DD HH:mm"),
                    numberDetected: i % 3 ? 5 : 7,
                    src: i % 3
                        ? 'https://scontent-sea1-1.cdninstagram.com/vp/12efb734c004cb99ab09bff758369aeb/5DAEB837/t51.2885-15/e35/61136397_818365191881804_7621382242543634635_n.jpg?_nc_ht=scontent-sea1-1.cdninstagram.com&se=7&ig_cache_key=MjA0OTAzOTgxNTkwMjU5NjA4NQ%3D%3D.2'
                        : 'https://pbs.twimg.com/media/Dj1lCA5U8AANFmY.jpg',
                };
                this.thresholdDetailTableContent.push(detailObject)
            }



        }

        doCancel() {

        }
    }

    export default OccupancyDetailsTable;
    Vue.component("occupancy_details_table", OccupancyDetailsTable);
</script>

<style lang="scss" scoped>
    .threshold-image {
        max-width: 300px;
        margin-bottom: 5px;
    }

</style>
