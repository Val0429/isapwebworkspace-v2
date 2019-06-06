<template>

    <!-- region tree -->
    <iv-card
        :visible="true"
        :label="regionTreeItem.titleItem.card == '' ? '{titleItem.card}' : regionTreeItem.titleItem.card"
    >
        <template #toolbox>
            <iv-toolbox-search @keyup="cardSearch" />
            <iv-toolbox-divider />
            <iv-toolbox-binding-site
                :visible="toolboxVisibled(eRegionTreeToolboxType.bindingSite)"
                :disabled="toolboxDisable(eRegionTreeToolboxType.bindingSite)"
                @click="bindingSiteCard"
            />
            <iv-toolbox-add-next-layer-region
                :visible="toolboxVisibled(eRegionTreeToolboxType.addNextLayerRegion)"
                :disabled="toolboxDisable(eRegionTreeToolboxType.addNextLayerRegion)"
                @click="addNextLayerRegionCard"
            />
            <iv-toolbox-add-same-layer-region
                :visible="toolboxVisibled(eRegionTreeToolboxType.addSameLayerRegion)"
                :disabled="toolboxDisable(eRegionTreeToolboxType.addSameLayerRegion)"
                @click="addSameLayerRegionCard"
            />
            <iv-toolbox-edit
                :visible="toolboxVisibled(eRegionTreeToolboxType.editRoot)"
                :disabled="toolboxDisable(eRegionTreeToolboxType.editRoot)"
                @click="editRootCard"
            />
            <iv-toolbox-edit
                :visible="toolboxVisibled(eRegionTreeToolboxType.editRegion)"
                :disabled="toolboxDisable(eRegionTreeToolboxType.editRegion)"
                @click="editRegionCard"
            />
            <iv-toolbox-delete
                :visible="toolboxVisibled(eRegionTreeToolboxType.deleteRegion)"
                :disabled="toolboxDisable(eRegionTreeToolboxType.deleteRegion)"
                @click="deleteRegionCard"
            />
            <iv-toolbox-divider :visible="toolboxVisibled(eRegionTreeToolboxType.divider)" />
            <iv-toolbox-toggle-region @click="toggleOpenRegion" />
            <iv-toolbox-toggle-site @click="toggleOpenSite" />
            <iv-toolbox-toggle-area @click="toggleOpenArea" />
        </template>

        <div class="row">
            <region-tree
                ref="regionTree"
                class="col-md-8"
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
                <template #toolbox="{$attrs}">
                    <iv-toolbox-more v-if="toolboxMore($attrs)">

                        <iv-toolbox-binding-site
                            @click="bindingSiteTree($event, $attrs)"
                            :visible="toolboxVisibled(eRegionTreeToolboxType.bindingSite, $attrs)"
                            :disabled="toolboxDisable(eRegionTreeToolboxType.bindingSite, $attrs)"
                        />
                        <iv-toolbox-add-next-layer-region
                            @click="addNextLayerRegionTree($event, $attrs)"
                            :visible="toolboxVisibled(eRegionTreeToolboxType.addNextLayerRegion, $attrs)"
                            :disabled="toolboxDisable(eRegionTreeToolboxType.addNextLayerRegion, $attrs)"
                        />
                        <iv-toolbox-add-same-layer-region
                            @click="addSameLayerRegionTree($event,$attrs)"
                            :visible="toolboxVisibled(eRegionTreeToolboxType.addSameLayerRegion, $attrs)"
                            :disabled="toolboxDisable(eRegionTreeToolboxType.addSameLayerRegion, $attrs)"
                        />
                        <iv-toolbox-edit
                            @click="editRootTree($event, $attrs)"
                            :visible="toolboxVisibled(eRegionTreeToolboxType.editRoot, $attrs)"
                            :disabled="toolboxDisable(eRegionTreeToolboxType.editRoot, $attrs)"
                        />
                        <iv-toolbox-edit
                            @click="editRegionTree($event, $attrs)"
                            :visible="toolboxVisibled(eRegionTreeToolboxType.editRegion, $attrs)"
                            :disabled="toolboxDisable(eRegionTreeToolboxType.editRegion, $attrs)"
                        />
                        <iv-toolbox-delete
                            @click="deleteRegionTree($event, $attrs)"
                            :visible="toolboxVisibled(eRegionTreeToolboxType.deleteRegion, $attrs)"
                            :disabled="toolboxDisable(eRegionTreeToolboxType.deleteRegion, $attrs)"
                        />
                    </iv-toolbox-more>
                </template>
            </region-tree>

            <div class="col-md-4 region-info">
                <div>
                    <div class="region-info-title">
                        {{ regionTreeItem.region.name != '' ? regionTreeItem.region.name : '&nbsp;' }}
                    </div>

                    <div
                        v-if="!(regionTreeItem.region.type == eRegionType.none)"
                        class="region-info-photo"
                    >
                        <img
                            class="region-info-photo-img"
                            :src="regionTreeItem.region.photoSrc"
                        >
                    </div>

                    <div
                        v-if="!(regionTreeItem.region.type == eRegionType.none || regionTreeItem.region.type == eRegionType.area || regionTreeItem.region.type == eRegionType.root)"
                        class="region-info-address"
                    >
                        <div class="region-info-address-title">{{ regionTreeItem.titleItem.address }}</div>
                        <div class="region-info-address-content">{{ regionTreeItem.region.address }}</div>
                    </div>

                    <div
                        v-if="!(regionTreeItem.region.type == eRegionType.none)"
                        class="region-info-tag"
                    >
                        <template v-for="tag of regionTreeItem.region.tags">
                            <span class="region-info-tag-span">#{{ tag.name }}</span>
                        </template>
                    </div>

                    <div
                        v-if="!(regionTreeItem.region.type == eRegionType.none || regionTreeItem.region.type == eRegionType.root)"
                        class="region-info-map"
                    >
                        <div class="region-info-map-title">{{ regionTreeItem.titleItem.map }}</div>
                        <iframe
                            v-if="regionTreeItem.region.type != eRegionType.area"
                            class="region-info-map-iframe"
                            :src="`${googleMap.src}&z=${googleMap.zSize}&q=${regionTreeItem.region.location.lat},${regionTreeItem.region.location.lng}`"
                        >
                        </iframe>
                        <div
                            v-if="regionTreeItem.region.type == eRegionType.area"
                            class="region-info-image-map"
                        >
                            <img
                                class="region-info-image-map-img"
                                :src="regionTreeItem.region.imageMapSrc"
                            >
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </iv-card>

</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import { Card } from "@/../components/cards/card/card.vue.ts";
import { RegionTree } from "./RegionTree.vue";
import {
    ERegionType,
    ETreeEventType,
    ERegionTreeToolboxType,
    ITreeEvent,
    ITreeStatus,
    IRegionTreeToggleStatus,
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

interface IGoogleMap {
    src: string;
    zSize: string;
}

@Component({
    components: {
        Card,
        RegionTree
    }
})
export class RegionTreeSetup extends Vue {
    eRegionType = ERegionType;
    eRegionTreeToolboxType = ERegionTreeToolboxType;

    googleMap: IGoogleMap = {
        src: "https://maps.google.com/maps?output=embed",
        zSize: "16"
    };
    focusRegionIdList: string[] = [];
    deleteRegionIdList: string[] = [];

    // prop
    @Prop({
        type: Object,
        default: new RegionTreeItem()
    })
    regionTreeItem: RegionTreeItem;

    @Watch("regionTreeItem.tree", { deep: true })
    private onRegionDatasChanged(newval: IRegionItem, oldval: IRegionItem) {
        let eventType: any = ETreeEventType.none;

        // check click bar
        if (eventType == ETreeEventType.none) {
            eventType = this.watchCheckTreeEventClickBar(newval);
        }

        // check shift click bar
        if (eventType == ETreeEventType.none) {
            eventType = this.watchCheckTreeEventShift(newval);
        }

        // create tree
        if (eventType != ETreeEventType.none) {
            this.watchToggleTreeEvent(newval, eventType);
        }
    }

    watchCheckTreeEventClickBar(regionItem: IRegionItem): ETreeEventType {
        let eventType: ETreeEventType = ETreeEventType.none;
        if (eventType == ETreeEventType.none && regionItem.event.clickBar) {
            eventType = ETreeEventType.clickBar;
        }
        if (eventType == ETreeEventType.none) {
            for (let tempRegionItem of regionItem.children) {
                eventType = this.watchCheckTreeEventClickBar(tempRegionItem);
                if (eventType != ETreeEventType.none) {
                    break;
                }
            }
        }
        return eventType;
    }

    watchCheckTreeEventShift(regionItem: IRegionItem): ETreeEventType {
        let eventType: ETreeEventType = ETreeEventType.none;
        if (
            eventType == ETreeEventType.none &&
            regionItem.event.shiftClickBar
        ) {
            eventType = ETreeEventType.shiftClickBar;
        }
        if (eventType == ETreeEventType.none) {
            for (let tempRegionItem of regionItem.children) {
                eventType = this.watchCheckTreeEventShift(tempRegionItem);
                if (eventType != ETreeEventType.none) {
                    break;
                }
            }
        }
        return eventType;
    }

    watchToggleTreeEvent(regionItem: IRegionItem, evetnType: ETreeEventType) {
        let regionItemType = this.regionTreeItem.changeType(regionItem.type);
        switch (evetnType) {
            case ETreeEventType.clickBar:
                if (regionItem.event.clickBar) {
                    // 是否被 focus
                    regionItem.status.focusBar = !regionItem.status.focusBar;

                    // 單選只有一個 id
                    if (
                        regionItem.status.focusBar &&
                        regionItemType == ERegionType.region
                    ) {
                        this.focusRegionIdList = [regionItem.objectId];
                        this.deleteRegionIdList = [regionItem.objectId];
                    } else {
                        this.focusRegionIdList = [];
                        this.deleteRegionIdList = [];
                    }

                    // 焦點物件
                    this.regionTreeItem.region = regionItem.status.focusBar
                        ? regionItem
                        : this.regionTreeItem.tree;
                } else {
                    regionItem.status.focusBar = false;
                }
                regionItem.event.shiftClickBar = false;
                break;
            case ETreeEventType.shiftClickBar:
                this.regionTreeItem.resetRegion();
                if (regionItem.type == ERegionType.root) {
                    regionItem.status.focusBar = false;
                }
                if (regionItem.event.shiftClickBar) {
                    // 是否被 focus
                    regionItem.status.focusBar = true;
                    if (regionItemType == ERegionType.region) {
                        this.focusRegionIdList.push(regionItem.objectId);
                        this.deleteRegionIdList.push(regionItem.objectId);
                    }
                }
                break;
        }
        regionItem.event.clickBar = false;
        for (let tempRegionItem of regionItem.children) {
            this.watchToggleTreeEvent(tempRegionItem, evetnType);
        }
    }

    created() {}

    mounted() {}

    // toggle function
    toggleOpenRegion($event: any) {
        this.regionTreeItem.toggleTree(ERegionType.region);
    }

    toggleOpenSite($event: any) {
        this.regionTreeItem.toggleTree(ERegionType.site);
    }

    toggleOpenArea($event: any) {
        this.regionTreeItem.toggleTree(ERegionType.area);
    }

    // toolbox function
    toolboxMore(data: any): boolean {
        let dataType = this.regionTreeItem.changeType(data.type);
        let result: boolean = false;
        switch (dataType) {
            case ERegionType.root:
            case ERegionType.region:
                result = true;
                break;
            default:
                result = false;
                break;
        }
        return result;
    }

    toolboxDisable(
        toolboxType: ERegionTreeToolboxType,
        data: any = null
    ): boolean {
        let result: boolean = true;
        if (data == null) {
            data = this.regionTreeItem.region;
        }
        switch (toolboxType) {
            case ERegionTreeToolboxType.bindingSite:
            case ERegionTreeToolboxType.addNextLayerRegion:
            case ERegionTreeToolboxType.editRoot:
                if (this.focusRegionIdList.length == 1) {
                    result = false;
                }
                if (data.type == ERegionType.root) {
                    result = false;
                }
                break;
            case ERegionTreeToolboxType.addSameLayerRegion:
            case ERegionTreeToolboxType.editRegion:
                if (this.focusRegionIdList.length == 1) {
                    result = false;
                }
                break;
            case ERegionTreeToolboxType.deleteRegion:
                if (this.deleteRegionIdList.length > 0) {
                    result = false;
                }
                break;
            case ERegionTreeToolboxType.none:
            default:
                result = true;
                break;
        }
        return result;
    }

    toolboxVisibled(
        toolboxType: ERegionTreeToolboxType,
        data: any = null
    ): boolean {
        let result: boolean = false;
        if (data == null) {
            data = this.regionTreeItem.region;
        }
        let dataType = this.regionTreeItem.changeType(data.type);
        switch (toolboxType) {
            case ERegionTreeToolboxType.bindingSite:
                switch (dataType) {
                    case ERegionType.root:
                    case ERegionType.region:
                        result = true;
                        break;
                    default:
                        result = false;
                        break;
                }
                break;
            case ERegionTreeToolboxType.addNextLayerRegion:
                switch (dataType) {
                    case ERegionType.root:
                    case ERegionType.region:
                        result = true;
                        break;
                    default:
                        result = false;
                        break;
                }
                break;
            case ERegionTreeToolboxType.addSameLayerRegion:
                switch (dataType) {
                    case ERegionType.region:
                        result = true;
                        break;
                    default:
                        result = false;
                        break;
                }
                break;
            case ERegionTreeToolboxType.editRoot:
                switch (dataType) {
                    case ERegionType.root:
                        result = true;
                        break;
                    default:
                        result = false;
                        break;
                }
                break;
            case ERegionTreeToolboxType.editRegion:
                switch (dataType) {
                    case ERegionType.region:
                        result = true;
                        break;
                    default:
                        result = false;
                        break;
                }
                break;
            case ERegionTreeToolboxType.divider:
                switch (dataType) {
                    case ERegionType.root:
                    case ERegionType.region:
                        result = true;
                        break;
                    default:
                        result = false;
                        break;
                }
                break;
            case ERegionTreeToolboxType.deleteRegion:
                switch (dataType) {
                    case ERegionType.region:
                    case ERegionType.none:
                        result = true;
                        break;
                    default:
                        result = false;
                        break;
                }
                break;
            case ERegionTreeToolboxType.none:
            default:
                result = false;
                break;
        }
        return result;
    }

    // card function
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

    bindingSiteCard() {
        this.bindingSite(this.regionTreeItem.region);
    }

    addNextLayerRegionCard() {
        this.addNextLayerRegion(this.regionTreeItem.region);
    }

    addSameLayerRegionCard() {
        this.addSameLayerRegion(this.regionTreeItem.region);
    }

    editRootCard() {
        this.editRoot(this.regionTreeItem.region);
    }

    editRegionCard() {
        this.editRegion(this.regionTreeItem.region);
    }

    deleteRegionCard() {
        this.deleteRegion(this.deleteRegionIdList);
    }

    // tree function
    bindingSiteTree(event: any, data: any) {
        this.bindingSite(data);
    }

    addNextLayerRegionTree(event: any, data: any) {
        this.addNextLayerRegion(data);
    }

    addSameLayerRegionTree(event: any, data: any) {
        this.addSameLayerRegion(data);
    }

    editRootTree(event: any, data: any) {
        this.editRoot(data);
    }

    editRegionTree(event: any, data: any) {
        this.editRegion(data);
    }

    deleteRegionTree(event: any, data: any) {
        this.deleteRegion([data.objectId]);
    }

    // finish function
    bindingSite(data: IRegionItem) {
        this.regionTreeItem.region = data;
        this.regionTreeItem.titleItem.edit = data.name;
        this.$emit("click-binding-site", this.regionTreeItem.region);
    }

    addNextLayerRegion(data: IRegionItem) {
        let parentId = data.objectId;
        this.regionTreeItem.titleItem.edit = data.name;
        this.regionTreeItem.resetRegion();
        this.regionTreeItem.region.parentId = parentId;
        this.regionTreeItem.region.type = ERegionType.region;
        this.$emit("click-add-next-layer-region", this.regionTreeItem.region);
    }

    addSameLayerRegion(data: IRegionItem) {
        let parentId = data.parentId;
        this.regionTreeItem.titleItem.edit = "";
        this.regionTreeItem.resetRegion();
        this.regionTreeItem.region.parentId = parentId;
        this.regionTreeItem.region.type = ERegionType.region;
        this.$emit("click-add-same-layer-region", this.regionTreeItem.region);
    }

    editRoot(data: IRegionItem) {
        this.regionTreeItem.region = data;
        this.regionTreeItem.titleItem.edit = data.name;
        this.$emit("click-edit-root");
    }

    editRegion(data: IRegionItem) {
        this.regionTreeItem.region = data;
        this.regionTreeItem.titleItem.edit = data.name;
        this.$emit("click-edit-region");
    }

    deleteRegion(data: string[]) {
        this.deleteRegionIdList = data;
        this.$emit("click-delete", this.deleteRegionIdList);
    }
}

Vue.component("region-tree-setup", RegionTreeSetup);
export default RegionTreeSetup;
</script>

<style lang="scss" scoped>
.region-info {
    .region-info-title {
        padding: 10px;
        color: $white;
        background-color: $primary;
    }

    .region-info-photo {
        .region-info-photo-img {
            width: 100%;
        }
    }

    .region-info-address {
        margin-top: 20px;
        .region-info-address-title {
            font-size: 1.2rem;
            font-weight: bold;
        }

        .region-info-address-content {
            font-size: 1rem;
        }
    }

    .region-info-tag {
        margin-top: 10px;
        .region-info-tag-span {
            color: $blue;
            margin-right: 5px;
        }
    }

    .region-info-map {
        margin-top: 20px;
        .region-info-map-title {
            font-size: 1.2rem;
            font-weight: bold;
        }
        .region-info-image-map {
            .region-info-image-map-img {
                width: 100%;
            }
        }
        .region-info-map-iframe {
            width: 100%;
            height: 500px;
            overflow: hidden;
            border: 0px;
        }
    }
}
</style>