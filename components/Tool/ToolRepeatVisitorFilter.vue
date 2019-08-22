<template>
    <div>
        Components Empty
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";

@Component({
    components: {}
})
export class ToolRepeatVisitorFilter extends Vue {
    // Prop
    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: ""
    })
    label: string;


    created() {
    }

    mounted() {
    }


}

export default ToolRepeatVisitorFilter;
Vue.component("tool-repeat-visitor-filter", ToolRepeatVisitorFilter);
</script>

<style lang="scss" scoped>
</style>
