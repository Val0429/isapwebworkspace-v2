<template>
    <iv-tree
        ref="tree"
        :server="server"
        :data="data"
        :visible="data.status.showCard"
    >
        <!-- Pass on all named slots -->
        <slot
            v-for="slot in Object.keys($slots)"
            :name="slot"
            :slot="slot"
        />

        <!-- Pass on all scoped slots -->
        <template
            v-for="slot in Object.keys($scopedSlots)"
            slot-scope="scope"
            :slot="slot"
        >
            <slot
                v-bind="scope"
                :name="slot"
            />
        </template>

        <template #default="{$attrs}">
            <b-card-header
                v-show="data.status.showBar && data.status.searchBar"
                :class="{focus: data.status.focusBar}"
                @click="clickTreeBar($event, $attrs.result)"
            >
                <!---- icon ---->
                <i
                    v-if="$attrs.result.type == eRegionType.root"
                    class="fa fa-info"
                >
                </i>
                <i
                    v-if="$attrs.result.type == eRegionType.region"
                    class="fa fa-globe"
                >
                </i>
                <i
                    v-if="$attrs.result.type == eRegionType.globe"
                    class="fa fa-globe"
                >
                </i>
                <i
                    v-if="$attrs.result.type == eRegionType.state"
                    class="fa fa-map"
                >
                </i>
                <i
                    v-if="$attrs.result.type == eRegionType.country"
                    class="fa fa-flag"
                >
                </i>
                <img
                    v-if="$attrs.result.type == eRegionType.city"
                    class="region-icon"
                    :src="iconBase64.regionLavelCityIcon"
                >
                <i
                    v-if="$attrs.result.type == eRegionType.township"
                    class="fa fa-crop"
                >
                </i>
                <i
                    v-if="$attrs.result.type == eRegionType.road"
                    class="fa fa-road"
                >
                </i>
                <i
                    v-if="$attrs.result.type == eRegionType.site"
                    class="fa fa-home"
                >
                </i>
                <img
                    v-if="$attrs.result.type == eRegionType.store"
                    class="region-icon"
                    :src="iconBase64.regionLavelStoreIcon"
                >
                <img
                    v-if="$attrs.result.type == eRegionType.floor"
                    class="region-icon"
                    :src="iconBase64.regionLavelFloorIcon"
                >
                <i
                    v-if="$attrs.result.type == eRegionType.area"
                    class="fa fa-map-marker"
                >
                </i>
                <img
                    v-if="$attrs.result.type == eRegionType.door"
                    class="region-icon"
                    :src="iconBase64.regionLavelDoorIcon"
                >
                <!--== icon ==-->

                <slot
                    name="title"
                    :$attrs="$attrs.result"
                />

                <div class="float-right toolbox">
                    <b-badge
                        v-if="$attrs.result.children && $attrs.result.children.length > 0"
                        class="badge"
                        variant="secondary"
                        pill
                        :title="childrenName"
                    >{{ $attrs.result.children.length }}</b-badge>

                    <slot
                        name="toolbox"
                        :$attrs="$attrs.result"
                    />

                    <b-button
                        v-if="showToggleTreeBar($attrs)"
                        class="card-collapse-button fa fa-chevron-down"
                        variant="light"
                        size="sm"
                        :disabled="!$attrs.result.children || $attrs.result.children.length === 0"
                        :class="{ card_close: !data.status.showCard }"
                        @click="toggleTreeBar($attrs)"
                    />
                </div>
            </b-card-header>
        </template>
    </iv-tree>
</template>


<script lang="ts">
import {
    Vue,
    Component,
    Prop,
    Model,
    Emit,
    Watch,
    Provide,
    Inject
} from "vue-property-decorator";

import {
    MetaParser,
    EnumParser,
    IMetaResult
} from "@/../core/server/parser/meta-parser";
import { IServerTree } from "@/../components/interfaces";
import { Tree, ITreeUnit } from "@/../components/trees/tree/tree.vue.ts";
import { ERegionType } from "./models";
import IconBase64 from "./models/IconBase64";

@Component({
    components: { Tree }
})
export class RegionTree extends Vue {
    @Prop({
        type: Object as () => IServerTree,
        required: false
    })
    server!: IServerTree;

    @Prop({
        required: false
    })
    data!: ITreeUnit<any> | any[];

    eRegionType = ERegionType;
    iconBase64 = IconBase64;
    treeBarFocus: boolean = true;
    childrenName = "";

    created() {
        for (let index in this.data.children) {
            let children = this.data.children[index];
            if (children.name != undefined) {
                if (parseInt(index) > 0) {
                    this.childrenName += "\n";
                }
                this.childrenName += children.name;
            }
        }
    }

    public get result() {
        return (this.$refs.tree as any).result;
    }

    public reload() {
        (this.$refs.tree as any).reload();
    }

    clickTreeBar(event: any, data: any) {
        if (!this.treeBarFocus) {
            this.treeBarFocus = true;
            return false;
        }
        data.event.shiftClickBar = data.type != "root" && event.shiftKey;
        data.event.clickBar = !event.shiftKey;
    }

    showToggleTreeBar($attrs: any): boolean {
        let result = false;
        if ($attrs.result.children && $attrs.result.children.length > 0) {
            result = true;
        }
        if (!$attrs.result.status.showToggle) {
            result = false;
        }
        return result;
    }

    toggleTreeBar(event: any) {
        this.treeBarFocus = false;
        this.data.status.showCard = !this.data.status.showCard;
    }
}
Vue.component("region-tree", RegionTree);
export default RegionTree;
</script>


<style lang="scss" scoped>
.card-header {
    border: 1px solid #798a93;
    border-radius: 3px;
    box-shadow: 0 0 5px #aaa;
    font-weight: bold;
    margin: 8px 0;
    position: relative;
    cursor: pointer;
    background-color: $white;

    // user-select
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;

    &.focus {
        background-color: $gray-600;
    }
}

.toolbox {
    position: absolute;
    display: flex;
    align-items: center;
    right: 0.4rem;
    height: 2.2rem;
    top: 0.3rem;

    > * {
        margin-left: 0.1rem;
        margin-right: 0.1rem;
    }

    .card-collapse-button {
        cursor: pointer;
        @include transition(all 0.2s linear);
    }

    .card_close {
        @include transform-origin(50% 50% 0);
        @include rotate(90);
    }

    .badge {
        margin-left: 6px;
        margin-right: 6px;
    }
}

.title {
    margin-right: 16px;
}

.badge-tag {
    margin-left: 4px;
    margin-right: 4px;
}

.region-icon {
    width: 15px;
    margin-right: 0.5rem;
}
</style>
