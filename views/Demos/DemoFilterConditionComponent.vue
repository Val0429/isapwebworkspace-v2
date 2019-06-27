<template>
    <div>

        <!-- 父元件的data='傳到子元件的data' -->
        <filter_condition
            :label="_('w_ReportFilterConditionComponent_')"
            @submit-data="receiveFilterData"
        >
        </filter_condition>

        <div class="h-25"></div>

        <!--
            v-if="filterData.siteIds && filterData.siteIds.length === 1"

-->

        <analysis_filter_in_out
            v-if="filterData.siteIds && filterData.siteIds.length === 1"
            :siteIds0="filterData.siteIds0"
            :deviceMode="deviceMode"
        >
        </analysis_filter_in_out>

        <!--
            v-if="filterData.siteIds && filterData.siteIds.length === 1"
-->

        <analysis_filter
            :siteIds0="filterData.siteIds0"
            :deviceMode="deviceMode"
        >
        </analysis_filter>

        <b-button @click="modalShow = !modalShow">
            {{ _('w_ReportTemplate_Recipient') }}
        </b-button>

        <div class="h-25"></div>

        <recipient
            :modalShow="modalShow"
            @user-data="receiveUserData"
            @return-modalShow="receiveModalShowData"
        ></recipient>

    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";

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
    // recipient 相關
    modalShow: boolean = false;

    // 往recipient子元件傳資料
    deviceMode: string = EDeviceMode.peopleCounting;

    // 接收 Filter Condition 資料 相關
    filterData: any = {};
    responseData: any = {};
    userData: any = [];

    created() {}

    mounted() {}

    receiveFilterData(filterData, responseData) {
        this.filterData = filterData;
        this.responseData = responseData;
        Vue.set(this.filterData, "siteIds0", filterData.siteIds[0]);
        console.log("this.filterData  - ", this.filterData);
        console.log("this.responseData  - ", this.responseData);
    }

    receiveUserData(data) {
        this.userData = data;
        console.log("this.userData - ", this.userData);
    }

    receiveModalShowData(data) {
        this.modalShow = data;
    }
}
</script>
<style lang="scss" scoped>
</style>
