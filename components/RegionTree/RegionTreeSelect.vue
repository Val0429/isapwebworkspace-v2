<template>

    <!-- region tree -->
    <Card
        :visible="true"
        :data="{ label: regionTreeItem.titleItem.card == '' ? '{titleItem.card}' : regionTreeItem.titleItem.card }"
    >
        <template #toolbox>
            <toolbox-search @keyup="cardSearch"></toolbox-search>
            <toolbox-divider />
            <toolbox-back @click="clickBack" />
        </template>

        <div class="row">
            <region-tree
                ref="regionTree"
                class="col-md-12"
                :data="regionTreeItem.tree"
            >
                <template #title="{$attrs}">
                    {{ $attrs.name }}
                    <b-badge
                        class=""
                        v-for="(tag, index) in $attrs.tags"
                        pill
                        danger
                        :key="'region-badge-'+index"
                    >{{ tag.name }}</b-badge>
                </template>
            </region-tree>

        </div>

        <template #footer>
            <b-button
                variant="secondary"
                size="lg"
                @click="clickBack"
            >{{ _('w_Back') }}
            </b-button>
        </template>
    </Card>

</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import { Card } from "@/../components/cards/card/card.vue.ts";
import { RegionTree } from "./RegionTree.vue";
import {
    ERegionType,
    ETreeEventType,
    ITreeEvent,
    ITreeStatus,
    IRegionTreeToggleStatus,
    IRegionTreeSelected,
    IRegionTreeTag,
    IRegionItem,
    RegionTreeItem
} from "./models";

enum EPageStep {
    none,
    list,
    editRoot,
    editRegion,
    bindingSite
}

@Component({
    components: {
        Card,
        RegionTree
    }
})
export class RegionTreeSelect extends Vue {
    // prop
    @Prop({
        type: Object,
        default: new RegionTreeItem()
    })
    regionTreeItem: RegionTreeItem;

    @Prop({
        type: String,
        default: ERegionType.none
    })
    selectType: ERegionType;

    @Prop({
        type: Array,
        default: []
    })
    selecteds: IRegionTreeSelected[];

    @Watch("regionTreeItem.tree", { deep: true })
    private onRegionDatasChanged(newval: IRegionItem, oldval: IRegionItem) {
        this.watchToggleTreeEvent(newval);
    }

    @Watch("selecteds", {})
    private onSelectedsChanged(newval: any, oldval: any) {
        if (newval.length == 0) {
            this.focusTreeClear(this.regionTreeItem.tree);
        } else {
            this.focusTree(this.regionTreeItem.tree);
        }
    }

    watchToggleTreeEvent(regionItem: IRegionItem) {
        let wantType: ERegionType = this.regionTreeItem.changeType(
            this.selectType
        );
        let itemType: ERegionType = this.regionTreeItem.changeType(
            regionItem.type
        );

        // 是否被 focus
        if (regionItem.event.clickBar && itemType == wantType) {
            regionItem.status.focusBar = !regionItem.status.focusBar;
            if (regionItem.status.focusBar) {
                let selectItem: IRegionTreeSelected = {
                    objectId: regionItem.objectId,
                    type: regionItem.type,
                    name: regionItem.name
                };
                this.selecteds.push(selectItem);
            }
        }

        // 是否顯示
        switch (wantType) {
            case ERegionType.region:
                if (
                    itemType == ERegionType.root ||
                    itemType == ERegionType.region
                ) {
                    regionItem.status.showBar = true;
                } else {
                    regionItem.status.showBar = false;
                }
                break;
            case ERegionType.site:
                if (
                    itemType == ERegionType.root ||
                    itemType == ERegionType.region ||
                    itemType == ERegionType.site
                ) {
                    regionItem.status.showBar = true;
                } else {
                    regionItem.status.showBar = false;
                }
                break;
            case ERegionType.area:
                if (
                    itemType == ERegionType.root ||
                    itemType == ERegionType.region ||
                    itemType == ERegionType.site ||
                    itemType == ERegionType.area
                ) {
                    regionItem.status.showBar = true;
                } else {
                    regionItem.status.showBar = false;
                }
                break;
            case ERegionType.root:
            case ERegionType.none:
            default:
                break;
        }
        regionItem.event.clickBar = false;
        for (let tempRegionItem of regionItem.children) {
            this.watchToggleTreeEvent(tempRegionItem);
        }
    }

    created() {
        this.initRegionTreeItem();
    }

    mounted() {}

    initRegionTreeItem() {
        this.focusTree(this.regionTreeItem.tree);
    }

    cardSearch(search: string) {
        this.searchTreeBar(this.regionTreeItem.tree, search);
    }

    searchTreeBar(regionItem: IRegionItem, search: string) {
        if (search != "") {
            let itemText = regionItem.name.toLowerCase();
            let searchText = search.toLowerCase();
            let serachResult = itemText.match(searchText);
            if (serachResult == null) {
                regionItem.status.searchBar = false;
            } else {
                regionItem.status.searchBar = true;
            }
        } else {
            regionItem.status.searchBar = true;
        }
        for (let childrenItem of regionItem.children) {
            this.searchTreeBar(childrenItem, search);
        }
    }

    clickBack() {
        this.$emit("click-back", this.selecteds);
    }

    focusTree(regionItem: IRegionItem) {
        let wantType: ERegionType = this.regionTreeItem.changeType(
            this.selectType
        );
        let itemType: ERegionType = this.regionTreeItem.changeType(
            regionItem.type
        );
        regionItem.status.showToggle = false;
        for (let i in this.selecteds) {
            let selectItem = this.selecteds[i];
            let selectType = this.regionTreeItem.changeType(selectItem.type);
            if (selectType != wantType) {
                this.selecteds.splice(parseInt(i), 1);
                continue;
            }
            if (
                regionItem.objectId == selectItem.objectId &&
                itemType == selectType &&
                itemType == wantType
            ) {
                regionItem.status.focusBar = true;
            }
        }
        for (let tempRegionItem of regionItem.children) {
            this.focusTree(tempRegionItem);
        }
    }

    focusTreeClear(regionItem: IRegionItem) {
        regionItem.status.focusBar = false;
        for (let tempRegionItem of regionItem.children) {
            this.focusTreeClear(tempRegionItem);
        }
    }
}

Vue.component("region-tree-select", RegionTreeSelect);
export default RegionTreeSelect;
</script>

<style lang="scss" scoped>
</style>