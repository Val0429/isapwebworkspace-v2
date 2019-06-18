<template>
    <div >
        <b-form-checkbox
            v-show="showOption(data.value)"
            class="checkbox-group"
            name="sortSelectOption"
            :value="data.value"
        >
            {{ data.text }}
        </b-form-checkbox>
        <iv-tree-view 
            v-for="(children, index) of data.childrens" 
            style="margin-left:20px;"
            :data="children"
            :key="'sort__select__tree_key__'+data.value+'__'+index"
        />
    </div>
</template>

<script lang="ts" >
import { Vue, Component, Prop} from "@/../core";
import { ISortSelectTreeOption } from "./models/ISortSelect";
import { TreeView } from "./TreeView.vue";

@Component({
    components: { TreeView }
})
export class TreeForm extends Vue {
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

    created (){
        console.log(this.data);
    }

    showOption(data: string): boolean {
        let result = true;
        if (this.optionSearchText != "" && !data.match(this.optionSearchText)) {
            result = false;
        }
        return result;
    }
}
export default TreeForm;
Vue.component("iv-tree-form", TreeForm);
</script>

<style lang="scss" scoped>
</style>
