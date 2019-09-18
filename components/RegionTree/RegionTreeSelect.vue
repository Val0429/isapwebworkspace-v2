<template>

    <!-- region tree -->
    <iv-card
        :visible="true"
        :label="regionTreeItem.titleItem.card == '' ? '{titleItem.card}' : regionTreeItem.titleItem.card"
    >
        <template #toolbox>
            <iv-toolbox-search @keyup="cardSearch" />
            <iv-toolbox-divider />
            <iv-toolbox-back @click="clickBack" />
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
    </iv-card>

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
} from "./";

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

    clickItem: IRegionTreeSelected = {
        objectId: "",
        type: ERegionType.none,
        name: ""
    };

    @Prop({
        type: Boolean,
        default: true
    })
    multiple: boolean;

    @Watch("regionTreeItem.tree", { deep: true })
    private onRegionDatasChanged(newval: IRegionItem, oldval: IRegionItem) {
        this.watchToggleTreeEvent(newval);
    }

    @Watch("selecteds", {})
    private onSelectedsChanged(newval: any, oldval: any) {
        this.focusTreeClear(this.regionTreeItem.tree);
        this.focusTree(this.regionTreeItem.tree);
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

    watchToggleTreeEvent(regionItem: IRegionItem) {
        let wantType: ERegionType = this.regionTreeItem.changeType(
            this.selectType
        );
        let itemType: ERegionType = this.regionTreeItem.changeType(
            regionItem.type
        );

        // 是否被 click
        if (regionItem.event.clickBar && itemType == wantType) {
            regionItem.status.focusBar = !regionItem.status.focusBar;

            if (regionItem.status.focusBar) {
                // 被選項寫入變數做判斷用
                this.clickItem = {
                    objectId: regionItem.objectId,
                    type: regionItem.type,
                    name: regionItem.name
                };
            }
        }

        // 單選移除其他選項
        if (
            !this.multiple &&
            !(
                regionItem.objectId == this.clickItem.objectId &&
                regionItem.type == this.clickItem.type
            )
        ) {
            regionItem.status.focusBar = false;
        }

        // 是否加入選單或移除
        if (regionItem.status.focusBar) {
            let inSelect = false;

            // 加入回傳選單內容
            for (let i in this.selecteds) {
                let selectItem = this.selecteds[i];
                if (
                    selectItem.type == itemType &&
                    selectItem.objectId == regionItem.objectId
                ) {
                    inSelect = true;
                    break;
                }
            }
            if (!inSelect) {
                let selectItem: IRegionTreeSelected = {
                    objectId: regionItem.objectId,
                    type: regionItem.type,
                    name: regionItem.name
                };
                this.selecteds.push(selectItem);
            }
        } else {
            for (let i in this.selecteds) {
                let selectItem = this.selecteds[i];
                if (
                    selectItem.type == itemType &&
                    selectItem.objectId == regionItem.objectId
                ) {
                    this.selecteds.splice(parseInt(i), 1);
                    break;
                }
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

        for (let tempRegionItem of regionItem.children) {
            this.watchToggleTreeEvent(tempRegionItem);
        }

        // 判斷完成就移除事件
        regionItem.event.clickBar = false;
    }

    focusTree(regionItem: IRegionItem) {
        let wantType: ERegionType = this.regionTreeItem.changeType(
            this.selectType
        );
        let itemType: ERegionType = this.regionTreeItem.changeType(
            regionItem.type
        );

        for (let i in this.selecteds) {
            let selectItem = this.selecteds[i];
            let selectType = this.regionTreeItem.changeType(selectItem.type);
            if (selectType != wantType) {
                this.selecteds.splice(parseInt(i), 1);
                continue;
            }

            if (!this.multiple) {
                this.clickItem = {
                    objectId: selectItem.objectId,
                    type: selectItem.type,
                    name: selectItem.name
                };
            }

            if (
                regionItem.objectId == selectItem.objectId &&
                itemType == selectType
            ) {
                regionItem.status.focusBar = true;
            }
        }

        // 不顯示的
        if (itemType != wantType) {
            regionItem.status.focusBar = false;
        }

        // 子目錄遞迴
        for (let childrenRegionItem of regionItem.children) {
            this.focusTree(childrenRegionItem);
        }
    }

    focusTreeClear(regionItem: IRegionItem) {
        regionItem.status.focusBar = false;
        // 選單不出現 toggle 按鈕
        regionItem.status.showToggle = false;
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
