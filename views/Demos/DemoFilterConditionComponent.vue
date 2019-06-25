<template>
    <div>
        <!-- 父元件的data='傳到子元件的data' -->
        <filter_condition
            :label="_('w_ReportFilterConditionComponent_')"
            @submit-data="receivFiltereData"
        >
        </filter_condition>

        <br>

        <analysis_filter_in_out
            v-if="filterData.siteIds && filterData.siteIds.length === 1"
            :siteIds0="filterData.siteIds0"
            :deviceMode="deviceMode"
        >
        </analysis_filter_in_out>

        <analysis_filter
            v-if="filterData.siteIds && filterData.siteIds.length === 1"
            :siteIds0="filterData.siteIds0"
            :deviceMode="deviceMode"
        >
        </analysis_filter>

        <b-button
            @click="sendEmail"
        >
            {{ _('w_ReportTemplate_Recipient') }}
        </b-button>

        <br>

        <recipient
            @user-data="receivUSerData"></recipient>

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

    // 接收 submit 相關
    filterData: any = {};

    // 網子元件傳資料
    deviceMode: string = EDeviceMode.demographic;

    created() {}

    mounted() {}

    sendEmail() {}

    receivFiltereData(data) {
        this.filterData = data;
        Vue.set(this.filterData, "siteIds0", data.siteIds[0]);
    }

    receivUSerData(data) {
        console.log('data - ', data);
    }
}
</script>
