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
    repeatCustomer = "repeatCustomer",
    revenue = "revenue",
    transaction = "transaction",
    conversion = "conversion",
    asp = "asp"
}

enum Sign {
    positive = "positive",
    negative = "negative"
}

interface IReportDashboard {
    pageType: PageType;
    traffic: {
        sign: Sign;
        total: number;
        value: number;
        valueRatio: number;
    };
    averageOccupancy: {
        sign: Sign;
        total: number;
        value: number;
        valueRatio: number;
    };
    averageDwellTime: {
        sign: Sign;
        total: number;
        value: number;
        valueRatio: number;
    };
    demographic: {
        sign: Sign;
        value: number;
        valueRatio: number;
        sign2: Sign;
        value2: number;
        valueRatio2: number;
    };
    vipBlacklist: {
        sign: Sign;
        value: number;
        valueRatio: number;
        sign2: Sign;
        value2: number;
        valueRatio2: number;
    };
    repeatCustomer: {
        sign: Sign;
        total: number;
        value: number;
        valueRatio: number;
    };
    revenue: {
        sign: Sign;
        total: number;
        value: number;
        valueRatio: number;
    };
    transaction: {
        sign: Sign;
        total: number;
        value: number;
        valueRatio: number;
    };
    conversion: {
        sign: Sign;
        total: number;
        value: number;
        valueRatio: number;
    };
    asp: {
        sign: Sign;
        total: number;
        value: number;
        valueRatio: number;
    };
}

@Component
export default class DemoReportComponent extends Vue {
    pageType = PageType;
    sign = Sign;

    data: IReportDashboard = {
        pageType: PageType.traffic,
        traffic: {
            sign: Sign.negative,
            total: 43250,
            value: 11,
            valueRatio: 0.156
        },
        averageOccupancy: {
            sign: Sign.negative,
            total: 10,
            value: 1,
            valueRatio: 0.099
        },
        averageDwellTime: {
            sign: Sign.positive,
            total: 25,
            value: 2,
            valueRatio: 0.01
        },
        demographic: {
            sign: Sign.positive,
            value: 11,
            valueRatio: 0.099,
            sign2: Sign.negative,
            value2: 11,
            valueRatio2: 0.099
        },
        vipBlacklist: {
            sign: Sign.positive,
            value: 11,
            valueRatio: 0.099,
            sign2: Sign.negative,
            value2: 11,
            valueRatio2: 0.099
        },
        repeatCustomer: {
            sign: Sign.negative,
            total: 0.36,
            value: 9,
            valueRatio: 0.11
        },
        revenue: {
            sign: Sign.positive,
            total: 9999999,
            value: 11,
            valueRatio: 0.099
        },
        transaction: {
            sign: Sign.negative,
            total: 666,
            value: 11,
            valueRatio: 0.099
        },
        conversion: {
            sign: Sign.positive,
            total: 0.18,
            value: 2,
            valueRatio: 0.01
        },
        asp: {
            sign: Sign.positive,
            total: 1235,
            value: 2,
            valueRatio: 0.01
        }
    };

    created() {}

    mounted() {}
}
</script>
