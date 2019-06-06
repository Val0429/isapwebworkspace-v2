<template>
    <div
        v-show="visible"
        class="space"
    ></div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model, Emit } from "vue-property-decorator";

@Component
export class ToolboxSpace extends Vue {
    @Prop({
        type: Boolean,
        required: false,
        default: true
    })
    visible!: boolean;
}
export default ToolboxSpace;
Vue.component("iv-toolbox-space", ToolboxSpace);
</script>


<style lang="scss" scoped>
.space {
    width: 5px;
}
</style>

