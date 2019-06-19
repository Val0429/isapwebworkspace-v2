<template>
    <div>
        <b-form-checkbox
            v-if="haveOption(data.value)"
            v-show="showOption(data.value)"
            class="checkbox-group"
            name="sortSelectOption"
            :value="data.value"
            @change="changeCheckbox"
        >
            {{ data.text }}
        </b-form-checkbox>
        <iv-tree-view
            v-for="(children, index) of data.childrens"
            class="tree-view"
            :type="type"
            :key="'sort__select__tree_key__'+data.value+'__'+index"
            :data="children"
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
import { TreeView } from "./TreeView.vue";
import { ESortSelectTreeEventType } from "./models/ESortSelectTree";

@Component({
    components: { TreeView }
})
export class TreeForm extends Vue {
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

    showOption(data: string): boolean {
        let result = true;
        if (this.searchText != "" && !data.match(this.searchText)) {
            result = false;
        }
        return result;
    }

    haveOption(data: string): boolean {
        let result = false;
        switch (this.type) {
            case ESortSelectTreeEventType.option:
                if (!this.data.status.choose) {
                    result = true;
                }
                break;
            case ESortSelectTreeEventType.choose:
                if (
                    this.data.status.choose ||
                    this.data.status.childrenChoose
                ) {
                    result = true;
                }
                break;
            case ESortSelectTreeEventType.none:
            default:
                break;
        }
        return result;
    }

    changeCheckbox(event: any) {
        this.data.event.clickCheckbox = true;
        this.data.status.focus = event == false ? false : true;
    }
}
export default TreeForm;
Vue.component("iv-tree-form", TreeForm);
</script>

<style lang="scss" scoped>
.tree-view {
    margin-left: 20px;
}
</style>
