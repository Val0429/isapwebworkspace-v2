<template>
    <div>
        <b-form-checkbox
            v-if="isOption() && haveItem(data.value)"
            v-show="showItem(data.value)"
            class="checkbox-group"
            name="sortSelectOption"
            :value="data.value"
            :checked="checked"
            @change="changeCheckbox"
        >
            {{ data.text }}
        </b-form-checkbox>
        <b-form-checkbox
            v-if="isChoose() && haveItem(data.value)"
            v-show="showItem(data.value)"
            class="checkbox-group"
            name="sortSelectChoose"
            :value="data.value"
            :checked="checked"
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
import { Vue, Component, Prop, Watch } from "@/../core";
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

    checked: string[] = [];

    isOption(): boolean {
        let result = false;
        if (this.type == ESortSelectTreeEventType.option) {
            result = true;
        }
        return result;
    }

    isChoose(): boolean {
        let result = false;
        if (this.type == ESortSelectTreeEventType.choose) {
            result = true;
        }
        return result;
    }

    showItem(data: string): boolean {
        let result = true;
        if (this.searchText != "" && !data.match(this.searchText)) {
            result = false;
        }
        return result;
    }

    haveItem(data: string): boolean {
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

    @Watch("data.status.optionFocus", { deep: true })
    private onOptionFocusChanged(newval: boolean, oldval: boolean) {
        if (this.type == ESortSelectTreeEventType.option) {
            this.checked = newval ? [this.data.value] : [];
        }
    }

    @Watch("data.status.chooseFocus", { deep: true })
    private onChooseFocusChanged(newval: boolean, oldval: boolean) {
        if (this.type == ESortSelectTreeEventType.choose) {
            this.checked = newval ? [this.data.value] : [];
        }
    }

    changeCheckbox(event: any) {
        switch (this.type) {
            case ESortSelectTreeEventType.option:
                this.data.status.optionFocus =
                    event == false || event == null || event == undefined
                        ? false
                        : true;
                break;
            case ESortSelectTreeEventType.choose:
                this.data.status.chooseFocus =
                    event == false || event == null || event == undefined
                        ? false
                        : true;
                break;
            case ESortSelectTreeEventType.none:
            default:
                break;
        }
        if (event == false) {
            this.checked = [];
        } else {
            this.checked.push(this.data.value);
        }
        this.data.event.clickCheckboxType = this.type;
        this.data.event.clickCheckbox = true;
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
