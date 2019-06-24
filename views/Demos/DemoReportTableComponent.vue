<template>
    <div>
        DemoReportComponent
        <anlysis-dashboard :anlysisData="data">
        </anlysis-dashboard>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";

enum PageType {
    traffic = "traffic",
    averageOccupancy = "averageOccupancy",
    averageDwellTime = "averageDwellTime",
    demographic = "demographic",
    vipBlacklist = "vipBlacklist",
    bepeatCustomer = "bepeatCustomer",
    bevenue = "bevenue",
    transaction = "transaction",
    conversion = "conversion",
    asp = "asp"
}

@Component
export default class DemoReportComponent extends Vue {
    pageType = PageType;
    data = {
        pageType: PageType.traffic
    };

    created() {}

    mounted() {}
}
</script>
