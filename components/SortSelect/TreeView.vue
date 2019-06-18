<template>
    <div>
        <iv-tree-form 
            :data="data"
            :optionSearchText="optionSearchText"
        />
    </div>
</template>


<script lang="ts" >
import { Vue, Component, Prop} from "@/../core";
import { ISortSelectTreeOption } from "./models/ISortSelect";
import { TreeForm } from "./TreeForm.vue";

@Component({
    components:{
        TreeForm
    }
})
export class TreeView extends Vue {
    @Prop({
        type: Object,
        default: {}
    })
    data: ISortSelectTreeOption;

    @Prop({
        type: String,
        default: ""
    })
    optionSearchText: string;
}
export default TreeView;
Vue.component("iv-tree-view", TreeView);
</script>


<style lang="scss" scoped>
</style>
