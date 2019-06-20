<template>
    <div>

        <filter_condition
        :sitesSelectItem="sitesSelectItem"
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

    sitesSelectItem: any = {};


   created() {
       console.log('0000 - ', );
       this.initSelectItemSite();
       console.log('1111 - ', );
   }

    mounted() {
        console.log('2222 - ', );
        this.initSelectItemSite();
        console.log('3333 - ', );
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
                console.log('demo - ', response);
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

        console.log('demo - ', this.sitesSelectItem);

    }
}
</script>
