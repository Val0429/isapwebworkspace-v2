<template>
    <div class="animated fadeIn">

        <filter-condition-vip-and-blacklist
            :label="_('w_ReportFilterConditionComponent_')"
            :tagSelectItem="tagSelectItem"
            :templateItem="templateItem"
            :sitesSelectItem="sitesSelectItem"
            :tagIncludeSitesItem="tagIncludeSitesItem"
            @submit-data="receiveFilterData"
        >

        </filter-condition-vip-and-blacklist>

        <div>
            VIPTracking
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Dialog from "@/services/Dialog";
import {
    ITemplateItem,
    EDesignationPeriod,
    EDeviceMode,
    ISite
} from "@/components/Reports";
import ResponseFilter from "@/services/ResponseFilter";

import HighchartsVipTracking from "@/components/Reports/Highcharts/HighchartsVipTracking.vue";
import ReportService from "@/components/Reports/models/ReportService";

@Component({
    components: {}
})
export default class ReportVIPTracking extends Vue {
    templateItem: ITemplateItem | null = null;
    sites: ISite[] = [];

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    //// Filter Condition Start ////

    selectItem = {
        site: [],
        area: [],
        tags: []
    };

    // select 相關
    tagSelectItem: any = {};
    sitesSelectItem: any = {};
    tagIncludeSitesItem: any = [];

    // OfficeHour 相關
    officeHourItemDetail: any = [];

    // recipient 相關
    modalShow: boolean = false;

    // 接收 Filter Condition 資料 相關
    filterData: any = {
        startDate: new Date(),
        endDate: new Date(),
        tagIds: []
    };
    responseData: any = {};
    userData: any = [];

    //// Filter Condition End ////

    //// Analysis Filter Start ////
    // TODO: check deviceMode
    deviceMode: string = EDeviceMode.peopleCounting;

    //// Analysis Filter End ////

    // send user 相關
    userSelectItem: any = {};

    // Report To Template相關
    ReportToTemplateData: any | null = null;
    designationPeriod: EDesignationPeriod = EDesignationPeriod.none;

    ////////////////////////////////////// Tina End //////////////////////////////////////

    created() {
        this.initDatas();
    }

    mounted() {}

    // Author: Tina
    async initDatas() {
        this.siteFilterPermission();
        await this.initSelectItemTag();
        await this.initTagIncludeSitesItem();
    }

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    siteFilterPermission() {
        let tempSitesSelectItem = {};
        for (const detail of this.$user.allowSites) {
            tempSitesSelectItem[detail.objectId] = detail.name;
        }
        this.sitesSelectItem = tempSitesSelectItem;
    }

    // Author: Tina
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

    async initTagIncludeSitesItem() {
        let tempTagIncludeSitesItem = {};

        let result = await this.$server
            .R("/tag")
            // .then((response: any) => {
            //     if (response != undefined) {
            //         for (const returnValue of response) {
            //             // 自定義 tagSelectItem 的 key 的方式
            //             tempTagSelectItem[returnValue.objectId] =
            //                 returnValue.name;
            //         }
            //         this.tagSelectItem = tempTagSelectItem;
            //     }
            // })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });

        this.tagIncludeSitesItem = result["results"];
        // console.log("result - ", this.tagIncludeSitesItem);
    }

    // Author: Tina
    async receiveFilterData(filterData, designationPeriod) {
        let param = JSON.parse(JSON.stringify(filterData));
        this.filterData = filterData;
        this.designationPeriod = designationPeriod;

        await this.$server
            .C("/report/people-counting/summary", param)
            .then((response: any) => {
                if (response !== undefined) {
                    this.responseData = response;
                    this.resolveSummary();
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

    resolveSummary() {
        // get office hour data
        let tempISite: any = {};
        this.sites = [];

        for (const filterSiteId of this.filterData.siteIds) {
            for (const detail of this.officeHourItemDetail) {
                for (const officeHourSiteId of detail.sites) {
                    if (filterSiteId === officeHourSiteId.objectId) {
                        let tempOfficeHours = [];
                        for (const dayRangesValue of detail.dayRanges) {
                            let tempOfficeHour: any = {};
                            tempOfficeHour = {
                                startDay: dayRangesValue.startDay,
                                endDay: dayRangesValue.endDay,
                                startDate: dayRangesValue.startDate,
                                endDate: dayRangesValue.endDate
                            };
                            tempOfficeHours.push(tempOfficeHour);
                        }
                        tempISite = {
                            objectId: officeHourSiteId.objectId,
                            name: officeHourSiteId.name,
                            officeHour: tempOfficeHours
                        };
                        this.sites.push(tempISite);
                        break;
                    }
                }
            }
        }
    }

    ////////////////////////////////////// Tina End //////////////////////////////////////
}
</script>


<style lang="scss" scoped>
</style>




