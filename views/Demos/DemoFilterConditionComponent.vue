<template>
    <div>
        <!-- 父元件的data='傳到子元件的data' -->
        <filter_condition
            :sitesSelectItem="sitesSelectItem"
            :tagSelectItem="tagSelectItem"
            :regionTreeItem="regionTreeItem"
            :label="_('w_ReportFilterConditionComponent_')"
            @submit-data="receivFiltereData"
        >
        </filter_condition>

        <analysis_filter_in_out
            v-if="filterData.siteIds && filterData.siteIds.length === 1"
            :siteIds0="filterData.siteIds0"
            :deviceMode="deviceMode"
        >
        </analysis_filter_in_out>
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

import RegionAPI from "@/services/RegionAPI";
import ResponseFilter from "@/services/ResponseFilter";

enum EDeviceMode {
    peopleCounting = "peopleCounting",
    dwellTime = "dwellTime",
    demographic = "demographic",
    heatmap = "heatmap",
    visitor = "visitor",
    humanDetection = "humanDetection"
}

@Component
export default class DemoFilterConditionComponent extends Vue {
    // select 相關
    sitesSelectItem: any = {};
    tagSelectItem: any = {};

    // tree
    selectType = ERegionType.site;
    regionTreeItem = new RegionTreeItem();
    selecteds: IRegionTreeSelected[] = [];

    // 接收 submit 相關
    filterData: any = {};

    // 網子元件傳資料
    deviceMode: string = EDeviceMode.peopleCounting;

    created() {
        this.initSelectItemSite();
        this.initSelectItemTag();
        this.initSelectItemTree();
        this.initRegionTreeSelect();
    }

    mounted() {}

    initRegionTreeSelect() {
        this.regionTreeItem = new RegionTreeItem();
        this.regionTreeItem.titleItem.card = this._("w_SiteTreeSelect");
    }

    async initSelectItemSite() {
        let tempSitesSelectItem = {};

        const readAllSiteParam: {
            type: string;
        } = {
            type: "all"
        };

        await this.$server
            .R("/location/site/all", readAllSiteParam)
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response) {
                        // 自定義 sitesSelectItem 的 key 的方式
                        tempSitesSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                    this.sitesSelectItem = tempSitesSelectItem;
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

    async initSelectItemTag() {
        let tempTagSelectItem = {};

        await this.$server
            .R("/tag/all")
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response) {
                        // 自定義 tagSelectItem 的 key 的方式
                        tempTagSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                    this.tagSelectItem = tempTagSelectItem;
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

    async receivFiltereData(data) {
        this.filterData = data;
        // this.filterData.siteIds0 = '';
        Vue.set(this.filterData, "siteIds0", data.siteIds[0]);
        // this.filterData.siteIds0 = data.siteIds[0];
        console.log("father siteIds0 ", this.filterData.siteIds0);
    }
}
</script>
