<template>
    <div ref="mapParent">

        <div>
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";

@Component({
    components: {}
})
export class Empty extends Vue {
    // Prop
    @Prop({
        type: String,
        default: ""
    })
    label: string;

    // Model
    @Model("input", {
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
        this.$emit("change", this.inputData);
    }

    putModel() {
        this.$emit("input", this.modelData);
    }
}

export default Empty;
Vue.component("empty", Empty);
</script>

<style lang="scss" scoped>
</style>
