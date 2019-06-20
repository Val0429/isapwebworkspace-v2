<template>
    <div>
        <iv-auto-card
            :visible="true"
            :label="_('w_ReportFilterConditionComponent_')"
        >
            <iv-form
                :interface="IFilterConditionForm()"
            ></iv-form>
        </iv-auto-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import {
    ERegionType,
    RegionTreeItem,
    IRegionTreeSelected
} from "@/components/RegionTree/models";
import { RegionTreeSelect } from "@/components/RegionTree/RegionTreeSelect.vue";

import RegionAPI from "@/services/RegionAPI";
import ResponseFilter from "@/services/ResponseFilter";

@Component({
    components: {}
})
export class FilterCondition extends Vue {
    // Prop
    // @Prop({
    //     type: String, // Boolean, Number, String, Array, Object
    //     default: "000"
    // })
    // label: string;

    // @Prop({
    //     type: Object, // Boolean, Number, String, Array, Object
    //     default: ""
    // })
    // filterData: object;


    @Prop({
        type: Object, // Boolean, Number, String, Array, Object
        default: {test:"565"}
    })
    sitesSelectItem: object;

    // Model
    @Model("model", {
        type: String,
        default: ""
    })
    value: string;

    inputData = "Test input data";
    modelData = "";

    // tree 相關
    selectType = ERegionType.site;
    regionTreeItem = new RegionTreeItem();
    selecteds: IRegionTreeSelected[] = [];

    created() {
        this.modelData = this.value;
        console.log('filter - ', this.sitesSelectItem);
    }

    async mounted() {
        this.start();
        await this.initSelectItemTree();
        console.log('filter - ', this.sitesSelectItem);
    }

    start() {
        this.$emit("input", this.inputData);
    }

    putModel() {
        this.$emit("model", this.modelData);
    }


    async initSelectItemTree() {
        await this.$server
            .R("/location/tree")
            .then((response: any) => {
                if (response != undefined) {
                    this.regionTreeItem.tree = RegionAPI.analysisApiResponse(
                        response
                    );
                    this.regionTreeItem.region = this.regionTreeItem.tree;
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });
    }

    IFilterConditionForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Sites")}
                 */
                siteIds?: ${toEnumInterface(this.sitesSelectItem as any, true)};

                selectTreeSite?: any;

            }
        `;
    }
}

export default FilterCondition;
Vue.component("filter_condition", FilterCondition);
</script>

<style lang="scss" scoped>
</style>
