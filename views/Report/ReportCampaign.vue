<template>
    <div class="animated fadeIn">

        <!-- Tina -->
        <filter-condition-campaign
            :yearSelectItem="yearSelectItem"
            :campaignSelectItem="campaignSelectItem"
            :campaignSiteSelectItem="campaignSiteSelectItem"
            @year-campaign="receiveYearCampaign"
        >
        </filter-condition-campaign>

        <iv-card>
            <template #toolbox>
                <!-- Tina -->
                <iv-toolbox-send-mail
                    size="lg"
                    @click="modalShow = !modalShow"
                />
            </template>

            <!-- Morris -->
            <highcharts-campaign-multipe
                v-if="chartMode.multiple"
                :value="chartDatas.multiple"
            >
            </highcharts-campaign-multipe>

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
import HighchartsCampaignMultipe from "@/components/Reports/HighchartsCampaignMultipe.vue";
import HighchartsCampaignSingle from "@/components/Reports/HighchartsCampaignSingle.vue";
import HighchartsService from "@/components/Reports/models/HighchartsService";
import ResponseFilter from "@/services/ResponseFilter";

import {
    IChartCampaignMultipe,
    IChartCampaignSingle
} from "@/components/Reports";

@Component({
    components: {
        HighchartsCampaignMultipe,
        HighchartsCampaignSingle
    }
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
        multiple: IChartCampaignMultipe[];
        single: IChartCampaignSingle[];
    } = {
        multiple: [],
        single: []
    };

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    // recipient 相關
    modalShow: boolean = false;
    userData: any = [];

    // send user 相關
    userSelectItem: any = {};

    yearSelectItem: any = {};
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

    /////////////////////////////////////////////////////////////////////

    // Author: Morris, Product remove
    initChartDeveloper() {
        this.chartDatas.multiple = [];
        this.chartDatas.single = [];

        for (let i = 0; i < 10; i++) {
            let tempItem: IChartCampaignMultipe = {
                name: "Campaign " + i.toString(),
                startDate: new Date(),
                endDate: new Date(),
                traffic: Math.floor(Math.random() * 300),
                budget: Math.floor(Math.random() * 1000)
            };
            this.chartDatas.multiple.push(tempItem);
        }

        this.chartMode.multiple = true;
        this.chartMode.single = true;
    }

    async initData() {
        this.initSelectYear();
        await this.initSelectCampaign();
        await this.initSelectCampaignStore();
        await this.initSelectItemUsers();
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

    initSelectYear() {
        this.yearSelectItem = {
            "2019": "2019",
            "2020": "2020"
        };
    }

    async initSelectCampaign() {
        this.campaignSelectItem = {
            MMsKioPy3X: "聖誕節",
            k6H0cOOLXe: "母親節"
        };
    }

    async initSelectCampaignStore() {}

    async receiveYearCampaign(year, campaign) {
        this.inputFormData.year = year;
        this.inputFormData.campaignIds = campaign;
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

    ////////////////////////////////////// Tina End //////////////////////////////////////
}
</script>


<style lang="scss" scoped>
</style>




