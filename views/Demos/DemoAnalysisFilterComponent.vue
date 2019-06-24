<template>
    <div>
        <!-- 父元件的data='傳到子元件的data' -->
        <analysis_filter
            :sitesSelectItem="sitesSelectItem"
            :tagSelectItem="tagSelectItem"
            :regionTreeItem="regionTreeItem"
            :label="_('w_ReportFilterConditionComponent_')"
            @submit-data="receiveData"
        >
        </analysis_filter>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";

enum EPageStep {
    none = "none",
    showResult = "showResult",
    chooseTree = "chooseTree"
}

@Component
export default class DemoAnalysisFilterComponent extends Vue {
    filterData: any = {};

    created() {}

    mounted() {}

    receiveData(data) {
        console.log(' - ', data);
    }


}
</script>
