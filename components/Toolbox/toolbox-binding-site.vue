<template>

    <iv-toolbox-element-base
        v-bind="$attrs"
        v-show="visible"
        icon="fa fa-link isap-toolbox-icon"
        :title="_('w_Region_BindingSite')"
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
            v-for="slot in Object.keys($scopedSlots)"
            :slot="slot"
            slot-scope="scope"
        >
            <slot
                :name="slot"
                v-bind="scope"
            /></template>

    </iv-toolbox-element-base>

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
export class ToolboxBindingSite extends Vue {
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
export default ToolboxBindingSite;
Vue.component("iv-toolbox-binding-site", ToolboxBindingSite);
</script>


<style lang="css" scoped>
</style>

