<template>
    <div>
        <iv-tree-form
            :type="type"
            :data="data"
            :searchText="searchText"
        />
    </div>
</template>


<script lang="ts" >
import { Vue, Component, Prop } from "@/../core";
import {
    ISortSelectTreeOption,
    ISortSelectTreeItem
} from "./models/ISortSelectTree";
import { TreeForm } from "./TreeForm.vue";
import { ESortSelectTreeEventType } from "./models/ESortSelectTree";

@Component({
    components: {
        TreeForm
    }
})
export class TreeView extends Vue {
    @Prop({
        type: Object,
        default: {}
    })
    data: ISortSelectTreeItem;

    @Prop({
        type: String,
        default: ""
    })
    searchText: string;

    @Prop({
        type: String,
        default: ""
    })
    type: ESortSelectTreeEventType;

    eSortSelectTreeEventType = ESortSelectTreeEventType;

    created() {}

    mounted() {}
}
export default TreeView;
Vue.component("iv-tree-view", TreeView);
</script>


<style lang="scss" scoped>
</style>
