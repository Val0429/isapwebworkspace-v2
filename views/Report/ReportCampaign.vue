<template>
    <div class="animated fadeIn">

        <!-- Tina -->
        <filter-condition-campaign
            :yearSelectItem="yearSelectItem"
            :campaignAllData="campaignAllData"
            :campaignSelectItem="campaignSelectItem"
            :campaignSiteSelectItem="campaignSiteSelectItem"
            @year-campaign="receiveYearCampaign"
        >
        </filter-condition-campaign>

        <iv-card
            :visible="visible"
        >
<!--
            :label="filterData.campaignIds.length !== 0 ? analysisTitle() : '' "
-->

            <template #toolbox>
                <!-- Tina -->
                <iv-toolbox-send-mail
                    size="lg"
                    @click="modalShow = !modalShow"
                />
            </template>

            <!-- Morris -->
            <highcharts-campaign-multiple
                v-if="chartMode.multiple"
                :value="chartDatas.multiple"
            >
            </highcharts-campaign-multiple>

            <highcharts-campaign-single
                v-if="chartMode.single"
                :value="chartDatas.single"
            >
            </highcharts-campaign-single>

        </iv-card>

        <!-- Tina -->
        <recipient
            :modalShow="modalShow"
            :userSelectItem="userSelectItem"
            @user-data="receiveUserData"
            @return-modalShow="receiveModalShowData"
        ></recipient>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Dialog from "@/services/Dialog";
import HighchartsCampaignMultiple from "@/components/Reports/Highcharts/HighchartsCampaignMultiple.vue";
import HighchartsCampaignSingle from "@/components/Reports/Highcharts/HighchartsCampaignSingle.vue";
import HighchartsService from "@/components/Reports/models/HighchartsService";
import ResponseFilter from "@/services/ResponseFilter";

import {
    ECampaignTimeType,
    IChartCampaignMultiple,
    IChartCampaignSingle
} from "@/components/Reports";

@Component({
    components: {}
})
export default class ReportCampaign extends Vue {
    chartMode: {
        multiple: boolean;
        single: boolean;
    } = {
        multiple: false,
        single: false
    };
    chartDatas: {
        multiple: IChartCampaignMultiple[];
        single: IChartCampaignSingle[];
    } = {
        multiple: [],
        single: []
    };

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    // recipient 相關
    modalShow: boolean = false;
    userData: any = [];

    // 收合card控制
    visible: boolean = false;

    // 接收 Filter Condition 資料 相關
    filterData: any = {};
    responseData: any = {};

    // send user 相關
    userSelectItem: any = {};

    yearSelectItem: any = {};
    campaignAllData: any = {};
    campaignSelectItem: any = {};
    campaignSiteSelectItem: any = {};

    inputFormData: any = {
        year: "",
        campaignIds: [],
        siteIds: []
    };

    ////////////////////////////////////// Tina End //////////////////////////////////////

    created() {
        this.initData();
        this.initChartDeveloper();
    }

    mounted() {}

    async initData() {
        this.initSelectYear();
        await this.initSelectCampaign();
        await this.initSelectCampaignStore();
        await this.initSelectItemUsers();
        await this.initSelectYear();
    }

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    async initSelectItemUsers() {
        let tempUserSelectItem = {};

        await this.$server
            .R("/user/user")
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response.results) {
                        // 自定義 userSelectItem 的 key 的方式
                        tempUserSelectItem[
                            returnValue.objectId
                        ] = `${returnValue.username} - ${returnValue.email}`;
                    }
                    this.userSelectItem = tempUserSelectItem;
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

    async initSelectYear() {

        let tempResult = {};
        let tempYearSelectItem = {};

        let result = await this.$server
            .R("/event/campaign/all-object")
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });

        console.log('result - ', result);

        tempResult = result;

        for (const year in tempResult) {
            tempYearSelectItem[year] = year;
        }

        this.campaignAllData = tempResult;
        this.yearSelectItem = tempYearSelectItem;

    }

    async initSelectCampaign() {
        this.campaignSelectItem = {
            all: "all",
            MMsKioPy3X: "聖誕節",
            k6H0cOOLXe: "母親節"
        };
    }

    async initSelectCampaignStore() {}

    async receiveYearCampaign(year, campaignIds) {
        this.inputFormData.year = year;
        this.inputFormData.campaignIds = campaignIds;
        console.log("this.inputFormData.year - ", this.inputFormData.year);
        console.log(
            "this.inputFormData.campaignIds - ",
            this.inputFormData.campaignIds
        );
    }

    async receiveUserData(data) {
        this.userData = [];
        this.userData = data;
    }

    receiveModalShowData(data) {
        this.modalShow = data;
    }

    async receiveFilterData(filterData) {
        let param = JSON.parse(JSON.stringify(filterData));
        this.filterData = filterData;

        await this.$server
            .C("/report/human-detection/summary", param)
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

    resolveSummary() {}

    analysisTitle(): string {

        // TODO: 待確認 title 和 site部分
        let title = 'Analysis - ';

        console.log('analysisTitle - ', this.filterData);

        title += `${ this._('w_Title_FiscalYear') } ${ this.filterData.year }.`;


        // if (this.filterData.campaignIds.length === 1) {
        //     for (const campaignId in this.campaignSelectItem) {
        //         if(this.filterData.campaignIds[0] === campaignId) {
        //             title += `${this._('w_Title_One_EventName')} ${this.campaignSelectItem[campaignId]}. `;
        //         }
        //     }
        // } else if (this.filterData.campaignIds.length >= 2) {
        //     title += `${this._('w_Title_EventName_Start')} ${this.filterData.campaignIds.length} ${this._('w_Title_EventName_End')} `;
        // } else {
        //     title += '';
        // }

        // if (this.filterData.siteIds.length === 1) {
        //     for (const siteId in this.sitesSelectItem) {
        //         if(this.filterData.siteIds[0] === siteId) {
        //             title += `${this._('w_Title_One_Site')} ${this.sitesSelectItem[siteId]}. `;
        //         }
        //     }
        // } else {
        //     title += `${this._('w_Title_Many_Site_Start')} ${this.filterData.siteIds.length} ${this._('w_Title_Many_Site_End')} `;
        // }

        this.visible = true;

        return title;
    }

    ////////////////////////////////////// Tina End //////////////////////////////////////

    /////////////////////////////////////////////////////////////////////

    // Author: Morris, Product remove
    initChartDeveloper() {
        let campaignMultipleTimeLength = 10;
        let campaignSingleTimeLength = 30;

        this.chartDatas.multiple = [];
        this.chartDatas.single = [];

        for (let i = 0; i < campaignMultipleTimeLength; i++) {
            let tempItem: IChartCampaignMultiple = {
                name: "Campaign " + i.toString(),
                startDate: new Date(),
                endDate: new Date(),
                traffic: Math.floor(Math.random() * 300),
                budget: Math.floor(Math.random() * 1000)
            };
            tempItem.startDate.setDate(
                -Math.floor(Math.random() * i * campaignMultipleTimeLength) -
                    (campaignMultipleTimeLength - i)
            );
            tempItem.endDate.setDate(
                Math.floor(Math.random() * i * campaignMultipleTimeLength) -
                    (campaignMultipleTimeLength - i)
            );
            this.chartDatas.multiple.push(tempItem);
        }

        for (let i = 0; i < campaignSingleTimeLength; i++) {
            let tempItem: IChartCampaignSingle = {
                type: ECampaignTimeType.none,
                date: new Date(),
                traffic: Math.floor(Math.random() * 300)
            };
            let campaignSingleTimeIndex1 = campaignSingleTimeLength / 3;
            let campaignSingleTimeIndex3 = (campaignSingleTimeLength / 3) * 2;
            tempItem.date.setDate(-(campaignSingleTimeLength - i));
            if (i < campaignSingleTimeIndex1) {
                tempItem.type = ECampaignTimeType.before;
            } else if (i > campaignSingleTimeIndex3) {
                tempItem.type = ECampaignTimeType.after;
            } else {
                tempItem.type = ECampaignTimeType.during;
            }
            this.chartDatas.single.push(tempItem);
        }

        this.chartMode.multiple = true;
        this.chartMode.single = true;
    }
}
</script>


<style lang="scss" scoped>
</style>




