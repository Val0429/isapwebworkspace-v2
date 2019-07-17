<template>
    <div class="animated fadeIn">

        <filter-condition-vip-and-blacklist
            :tagSelectItem="tagSelectItem"
            :templateItem="templateItem"
            :label="_('w_ReportFilterConditionComponent_')"
            @submit-data="receiveFilterData">

        </filter-condition-vip-and-blacklist>

        <div v-show="pageStep === ePageStep.none">
            VIPTracking
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Dialog from "@/services/Dialog";
import {ITemplateItem, EDesignationPeriod, EDeviceMode} from '@/components/Reports';
import ResponseFilter from '@/services/ResponseFilter';

enum EPageStep {
    none = "none"
}

@Component({
    components: {}
})
export default class ReportVIPTracking extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.none;

    templateItem: ITemplateItem | null = null;


    ////////////////////////////////////// Tina Start //////////////////////////////////////

    //// Filter Condition Start ////

    selectItem = {
        site: [],
        area: [],
        tags: []
    };

    // select 相關
    tagSelectItem: any = {};

    // recipient 相關
    modalShow: boolean = false;

    // 接收 Filter Condition 資料 相關
    filterData: any = {
        startDate: new Date(),
        endDate: new Date(),
        tagIds: [],
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
        await this.initSelectItemTag();
    }

    ////////////////////////////////////// Tina Start //////////////////////////////////////

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
    // Author: Tina
    async receiveFilterData(filterData, designationPeriod ) {
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

    resolveSummary() {}

    ////////////////////////////////////// Tina End //////////////////////////////////////

}
</script>


<style lang="scss" scoped>
</style>




