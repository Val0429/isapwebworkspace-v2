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
export class ToolTrafficFilter extends Vue {
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

export default ToolTrafficFilter;
Vue.component("tool-traffic-filter", ToolTrafficFilter);
</script>

<style lang="scss" scoped>
</style>
