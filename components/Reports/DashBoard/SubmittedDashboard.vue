<template>
    <div>
        <div class="row col-lg-12">
            <div class="col-lg-4 col-sm-1 col-xs-1 col-xxs-1">
                1
            </div>
            <!--/col-->
            <div class="col-lg-4 col-sm-1 col-xs-1 col-xxs-1">
                2
            </div>
            <!--/col-->
            <div class="col-lg-4 col-sm-1 col-xs-1 col-xxs-1">
                3
            </div>
            <!--/col-->
        </div>
        <!-- /row -->

        <div class="row col-lg-12">
            <div class="col-lg-12 col-sm-4 col-xs-4 col-xxs-4">
                4
            </div>
            <!--/col-->
        </div>
        <!-- /row -->
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";

@Component({
    components: {}
})
export class SubmittedDashBoard extends Vue {
    // Prop
    @Prop({
        type: String, // Boolean, Number, String, Array, Object
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

export default SubmittedDashBoard;
Vue.component("submitted-dashboard", SubmittedDashBoard);
</script>

<style lang="scss" scoped>
</style>
