<template>
    <div>
        <iv-card
            :label="_('w_Dashboard_Bottom5sites')"
        >

<!--            <select-time @time="receiveTime"></select-time>-->

        </iv-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";

/// install Highcharts
import Highcharts from "highcharts";
import HighchartsVue from "highcharts-vue";
import exportingInit from "highcharts/modules/exporting";
exportingInit(Highcharts);
Vue.use(HighchartsVue);

import { EMode } from '@/components/Dashboard/index'

@Component({
    components: {}
})
export class Bottom5sites extends Vue {
    // Prop
    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: ""
    })
    label: string;

    chartOptions: any = {};

    time: any = {};

    created() {
    }

    mounted() {
    }

    async receiveTime(time: object) {
        this.time = JSON.parse(JSON.stringify(time));

        // TODO: wait api
        // Loading.show();
        // await this.$server
        //     .C("/", this.time)
        //     .then((response: any) => {
        //         ResponseFilter.successCheck(
        //             this,
        //             response,
        //             (response: any) => {
        //             },
        //             this._("w_Dialog_ErrorTitle")
        //         );
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.catchError(
        //             this,
        //             e,
        //             this._("w_Dialog_ErrorTitle")
        //         );
        //     });
    }
}

export default Bottom5sites;
Vue.component("bottom-5sites", Bottom5sites);
</script>

<style lang="scss" scoped>
</style>
