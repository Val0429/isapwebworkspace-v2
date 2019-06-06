<template>

    <toolbox-element-base
        icon="fa fa-times isap-toolbox-icon"
        v-bind="$attrs"
        v-show="visible"
        :title="_('w_Switch')"
        :variant="variant"
        :size="size"
        :disabled="disabled"
        @click="click"
    >

        <!-- Pass on all named slots -->
        <slot
            v-for="slot in Object.keys($slots)"
            :name="slot"
            :slot="slot"
        />

        <!-- Pass on all scoped slots -->
        <template
            slot-scope="scope"
            v-for="slot in Object.keys($scopedSlots)"
            :slot="slot"
        >
            <slot
                v-bind="scope"
                :name="slot" 
            /></template>

    </toolbox-element-base>

</template>

<script lang="ts">
import {
    Vue,
    Component,
    Prop,
    Model,
    Emit,
    Watch
} from "vue-property-decorator";
import { FormMergeBindings } from "@/../components/form/helpers/form-merge-bindings/form-merge-bindings.vue.ts";
import $ from "jquery";

@Component({
    components: { FormMergeBindings }
})
export class ToolboxClose extends Vue {
    @Prop({
        type: String,
        required: false,
        default: "light"
    })
    variant!: string;

    @Prop({
        type: String,
        required: false,
        default: "sm"
    })
    size!: string;

    @Prop({
        type: Boolean,
        required: false,
        default: false
    })
    disabled!: boolean;

    @Prop({
        type: Boolean,
        required: false,
        default: true
    })
    visible!: boolean;

    @Emit()
    click(event) {
        return;
    }
}
export default ToolboxClose;
Vue.component("toolbox-close", ToolboxClose);
</script>
<style lang="css" scoped>
</style>

