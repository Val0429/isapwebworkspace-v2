<template>
    <iv-modal
        :visible.sync="visible"
        :label="label"
        @update:visible="doUpdateVisible"
    >
        <div
            class="content"
            v-html="value"
        />

    </iv-modal>
</template>


<script lang="ts" >
import {
    Vue,
    Component,
    Prop,
    Model,
    Watch,
    Emit
} from "vue-property-decorator";

@Component
export class Dialog extends Vue {
    @Prop({ type: String, required: true })
    label: string;

    @Prop({ type: String, required: true })
    value: string;

    visible: boolean = true;

    @Emit("update:visible")
    doUpdateVisible(value: boolean) {
        return value;
    }
}
export default Dialog;
</script>

<style lang="scss" scoped>
.content {
    margin-bottom: 30px;
}
</style>