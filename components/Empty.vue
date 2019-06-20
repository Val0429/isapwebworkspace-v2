<template>
    <div ref="mapParent">

        <div>
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

@Component({
    components: {}
})
export class Empty extends Vue {
    @Prop({
        type: String,
        default: ""
    })
    label: string;

    inputData = "Test input data";

    created() {}

    mounted() {
        this.start();
    }

    start() {
        this.$emit("input", this.inputData);
    }
}

export default Empty;
Vue.component("empty", Empty);
</script>

<style lang="scss" scoped>
</style>
