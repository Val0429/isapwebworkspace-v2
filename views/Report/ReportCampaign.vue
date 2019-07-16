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

        <div v-show="pageStep === ePageStep.none">

            <iv-card>

                <template #toolbox>
                    <!-- Tina -->
                    <iv-toolbox-send-mail
                        size="lg"
                        @click="modalShow = !modalShow"
                    />
                </template>


            </iv-card>
        </div>

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
import ResponseFilter from '@/services/ResponseFilter';

enum EPageStep {
    none = "none"
}

@Component({
    components: {}
})
export default class ReportCampaign extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;

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
        year: '',
        campaignIds: [],
        siteIds: [],
    };

    ////////////////////////////////////// Tina End //////////////////////////////////////

    created() {
        this.initData();
    }

    mounted() {}

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
            "2020": "2020",
        }
    }

    async initSelectCampaign() {
        this.campaignSelectItem = {
            MMsKioPy3X: "聖誕節",
            k6H0cOOLXe: "母親節",
        }
    }

    async initSelectCampaignStore() {}

    async receiveYearCampaign(year, campaign) {
        this.inputFormData.year = year;
        this.inputFormData.campaignIds = campaign;
        console.log('this.inputFormData.year - ', this.inputFormData.year);
        console.log('this.inputFormData.campaignIds - ', this.inputFormData.campaignIds);
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




