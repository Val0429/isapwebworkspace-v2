<template>
    <div>
        {{ label }}
        <!-- <highcharts :options="chartOptions"></highcharts> -->
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import HighchartsVue from "highcharts-vue";

Vue.use(HighchartsVue);

@Component({
    components: {
        
    }
})
export class ChartBarLine extends Vue {
    // Prop
    @Prop({
        type: String,
        default: ""
    })
    label: string;

    // Model
    @Model("model", {
        type: String,
        default: ""
    })
    value: string;

    inputData = "Test input data";
    modelData = "";

    chartOptions: {
        series: [
            {
                data: [1, 2, 3]; // sample data
            }
        ];
    };

    created() {
        this.modelData = this.value;
    }

    mounted() {
        this.start();
    }

    start() {
        this.$emit("input", this.inputData);
    }

    putModel() {
        this.$emit("model", this.modelData);
    }
}

export default ChartBarLine;
Vue.component("chart-bar-line", ChartBarLine);
</script>

<style lang="scss" scoped>
</style>
