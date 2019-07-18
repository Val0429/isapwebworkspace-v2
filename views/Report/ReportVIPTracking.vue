<template>
    <div class="animated fadeIn">

        <filter-condition-vip-and-blacklist
            :label="_('w_ReportFilterConditionComponent_')"
            :tagSelectItem="tagSelectItem"
            :templateItem="templateItem"
            :sitesSelectItem="sitesSelectItem"
            :allTagsItem="allTagsItem"
            :tagIncludeSitesItem="tagIncludeSitesItem"
            @submit-data="receiveFilterData"
        >
        </filter-condition-vip-and-blacklist>

        <iv-card
            :label="filterData.siteIds.length !== 0 ? analysisTitle() : '' "
            :visible="visible"
        >
            <highcharts-vip-tracking
                :startDate="startDate"
                :endDate="endDate"
                :sites="sites"
                :value="chartDatas"
            >
            </highcharts-vip-tracking>
        </iv-card>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Dialog from "@/services/Dialog";
import {
    ITemplateItem,
    EDesignationPeriod,
    EDeviceMode,
    ISite,
    IChartVipTrackingData
} from "@/components/Reports";
import ResponseFilter from "@/services/ResponseFilter";

import HighchartsVipTracking from "@/components/Reports/Highcharts/HighchartsVipTracking.vue";
import ReportService from "@/components/Reports/models/ReportService";
import Datetime from '@/services/Datetime';

@Component({
    components: {}
})
export default class ReportVIPTracking extends Vue {
    templateItem: ITemplateItem | null = null;

    ////////////////////////////////////// Morris Start //////////////////////////////////////
    startDate: Date = new Date("2019-01-01T00:00:00.000Z");
    endDate: Date = new Date("2019-01-01T01:00:00.000Z");
    sites: ISite[] = [];
    chartDatas: IChartVipTrackingData[] = [];

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
    allTagsItem: any = [];

    // OfficeHour 相關
    officeHourItemDetail: any = [];


    // 收合card控制
    visible: boolean = false;

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

        for (const detail in this.tagSelectItem) {
            this.allTagsItem.push(detail);
        }
    }

    async initTagIncludeSitesItem() {

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

        if (result['results'].length > 0) {
            result['results'].map(item => {
                this.tagIncludeSitesItem.push(item)
            })
        } else {
            return false;
        }
    }

    // Author: Tina
    async receiveFilterData(filterData, designationPeriod) {
        console.log(" - ", filterData);
        console.log(" - ", designationPeriod);

        let param = JSON.parse(JSON.stringify(filterData));
        this.filterData = filterData;
        this.designationPeriod = designationPeriod;

        // await this.$server
        //     .C("/report/people-counting/summary", param)
        //     .then((response: any) => {
        //         if (response !== undefined) {
        //             this.responseData = response;
        //             this.officeHourItemDetail = this.responseData.officeHours;
        //             this.resolveSummary();
        //         }
        //     })
        //     .catch((e: any) => {
        //         if (e.res && e.res.statusCode && e.res.statusCode == 401) {
        //             return ResponseFilter.base(this, e);
        //         }
        //         console.log(e);
        //         return false;
        //     });
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

    analysisTitle(): string {

        let title = 'Analysis - ';

        console.log('analysisTitle - ', this.filterData);

        if (this.filterData.tagIds.length === 1) {
            for (const tagId in this.tagSelectItem) {
                if(this.filterData.tagIds[0] === tagId) {
                    title += `${this._('w_Title_One_Tag')} ${this.tagSelectItem[tagId]}. `;
                }
            }
        } else if (this.filterData.tagIds.length >= 2) {
            title += `${this._('w_Title_Many_Tag_Start')} ${this.filterData.tagIds.length} ${this._('w_Title_Many_Tag_End')} `;
        } else {
            title += '';
        }

        // if (this.filterData.siteIds.length === 1) {
        //     for (const siteId in this.sitesSelectItem) {
        //         if(this.filterData.siteIds[0] === siteId) {
        //             title += `${this._('w_Title_One_Site')} ${this.sitesSelectItem[siteId]}. `;
        //         }
        //     }
        // } else {
        //     title += `${this._('w_Title_Many_Site_Start')} ${this.filterData.siteIds.length} ${this._('w_Title_Many_Site_End')} `;
        // }

        title += `${this._('w_Title_StartDate')} ${Datetime.DateTime2String(this.filterData.startDate, "YYYY/MM/DD")}. `;
        title += `${this._('w_Title_EndDate')} ${Datetime.DateTime2String(this.filterData.endDate, "YYYY/MM/DD")}. `;


        this.visible = true;

        return title;
    }

    ////////////////////////////////////// Tina End //////////////////////////////////////
}
</script>


<style lang="scss" scoped>
</style>




