<template>
    <div class="input-group md-form form-sm form-2 pl-0">
        <b-input
            v-show="visible"
            v-model="search"
            type="text"
            :size="size"
            :disabled="disabled"
            :variant="variant"
            @keyup="searchKeyup"
            @change="searchChange"
        >
        </b-input>
        <div class="input-group-append">
            <span class="input-group-text red lighten-3">
                <i
                    class="fa fa-search text-grey"
                    aria-hidden="true"
                ></i>
            </span>
        </div>
    </div>

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

@Component({
    components: {}
})
export class ToolboxSearch extends Vue {
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

    search: string = "";

    searchKeyup(event: any) {
        this.$emit("keyup", this.search);
    }

    searchChange(data: string) {
        this.$emit("change", data);
    }
}
export default ToolboxSearch;
Vue.component("toolbox-search", ToolboxSearch);
</script>


<style lang="css" scoped>
</style>

