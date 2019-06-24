<template>
    <div>

        <!-- 父元件的data='傳到子元件的data' -->
        <filter_condition
        :sitesSelectItem="sitesSelectItem"
        :tagSelectItem="tagSelectItem"
        :label="_('w_ReportFilterConditionComponent_')">
        </filter_condition>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";
import {
    ERegionType,
    RegionTreeItem,
    IRegionTreeSelected
} from "@/components/RegionTree/models";
import { RegionTreeSelect } from "@/components/RegionTree/RegionTreeSelect.vue";

import RegionAPI from "@/services/RegionAPI";
import ResponseFilter from "@/services/ResponseFilter";

@Component
export default class DemoFilterConditionComponent extends Vue {
    filterData: any = {};

    // select 相關
    sitesSelectItem: any = {};
    tagSelectItem: any = {};

    // tree
    selectType = ERegionType.site;
    regionTreeItem = new RegionTreeItem();
    selecteds: IRegionTreeSelected[] = [];

    created() {
       this.initSelectItemSite();
       this.initSelectItemTag();
   }

    async mounted() {
    }

   initSelectItemSite() {

        this.sitesSelectItem = {};

        const readAllSiteParam: {
            type: string;
        } = {
            type: "all"
        };

        this.$server
            .R("/location/site/all", readAllSiteParam)
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response) {
                        // 自定義 sitesSelectItem 的 key 的方式
                        this.sitesSelectItem[returnValue.objectId] =
                            returnValue.name;
                        // this.regionTreeItem.tree = RegionAPI.analysisApiResponse(
                        //     returnValue
                        // );
                    }
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

   initSelectItemTag() {

        this.sitesSelectItem = {};

        this.$server
            .R("/tag/all", )
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response) {
                        // 自定義 sitesSelectItem 的 key 的方式
                        this.tagSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });
console.log('this.tagSelectItem - ', this.tagSelectItem);
    }
}
</script>
