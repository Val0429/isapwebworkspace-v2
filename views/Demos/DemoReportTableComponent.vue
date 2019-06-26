<template>
    <div>
        DemoReportComponent
        <anlysis-dashboard :anlysisData="dData">
        </anlysis-dashboard>
        <peak-time-range
            :timeRangeData="pData"
            :siteItem="siteItem"
            v-on:changeSite="changeSite"
        >
        </peak-time-range>
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
    asp = "asp",
    none = "none"
}

enum Sign {
    positive = "positive",
    negative = "negative",
    none = "none"
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

interface IPeckTimeRange {
    head: string[];
    body: IPeckTimeRangeBody[];
}

interface IPeckTimeRangeBody {
    title: string;
    context: number[];
}

@Component
export default class DemoReportComponent extends Vue {
    pageType = PageType;
    sign = Sign;

    siteItem = [
        { value: "dfgsadg", text: "台北店" },
        { value: "ewtewfg", text: "台中店" }
    ];

    pData: IPeckTimeRange = {
        head: [],
        body: []
    };

    dData: IReportDashboard = {
        pageType: PageType.none,
        traffic: {
            sign: Sign.none,
            total: -1,
            value: -1,
            valueRatio: -1
        },
        averageOccupancy: {
            sign: Sign.none,
            total: -1,
            value: -1,
            valueRatio: -1
        },
        averageDwellTime: {
            sign: Sign.none,
            total: -1,
            value: -1,
            valueRatio: -1
        },
        demographic: {
            sign: Sign.none,
            value: -1,
            valueRatio: -1,
            sign2: Sign.none,
            value2: -1,
            valueRatio2: -1
        },
        vipBlacklist: {
            sign: Sign.none,
            value: -1,
            valueRatio: -1,
            sign2: Sign.none,
            value2: -1,
            valueRatio2: -1
        },
        repeatCustomer: {
            sign: Sign.none,
            total: -1,
            value: -1,
            valueRatio: -1
        },
        revenue: {
            sign: Sign.none,
            total: -1,
            value: -1,
            valueRatio: -1
        },
        transaction: {
            sign: Sign.none,
            total: -1,
            value: -1,
            valueRatio: -1
        },
        conversion: {
            sign: Sign.none,
            total: -1,
            value: -1,
            valueRatio: -1
        },
        asp: {
            sign: Sign.none,
            total: -1,
            value: -1,
            valueRatio: -1
        }
    };

    site = "dfgsadg";

    created() {}

    mounted() {
        this.initPeakTimeRange();
        this.initAnlyDashboardData();
    }

    initPeakTimeRange() {
        if (this.site == "dfgsadg") {
            this.pData = {
                head: [
                    "09:00-10:00",
                    "10:00-11:00",
                    "11:00-12:00",
                    "12:00-13:00",
                    "13:00-14:00",
                    "14:00-15:00",
                    "15:00-16:00",
                    "16:00-17:00",
                    "17:00-18:00",
                    "18:00-19:00",
                    "19:00-20:00",
                    "21:00-22:00"
                ],
                body: [
                    {
                        title: "2019/1/1 Tue",
                        context: [1, 2, 3, 4, 5, 1, 4, 5, 1, 1, 4, 1]
                    },
                    {
                        title: "2019/1/2 Wed",
                        context: [5, 4, 5, 3, 2, 1, 4, 5, 1, 2, 4, 1]
                    },
                    {
                        title: "2019/1/3 Thu",
                        context: [1, 3, 4, 5, 1, 5, 4, 2, 1, 2, 1, 1]
                    },
                    {
                        title: "2019/1/4 Fri",
                        context: [1, 3, 4, 4, 2, 1, 3, 4, 5, 1, 4, 1]
                    },
                    {
                        title: "2019/1/5 Sat",
                        context: [1, 3, 5, 4, 5, 1, 4, 2, 1, 3, 2, 2]
                    },
                    {
                        title: "2019/1/6 Sun",
                        context: [1, 2, 1, 4, 4, 5, 1, 2, 1, 3, 3, 1]
                    },
                    {
                        title: "2019/1/7 Mon",
                        context: [1, 1, 1, 2, 2, 4, 5, 1, 1, 3, 4, 1]
                    }
                ]
            };
        } else {
            this.pData = {
                head: [
                    "09:00-10:00",
                    "10:00-11:00",
                    "11:00-12:00",
                    "12:00-13:00",
                    "13:00-14:00",
                    "14:00-15:00",
                    "15:00-16:00",
                    "16:00-17:00",
                    "17:00-18:00",
                    "18:00-19:00",
                    "19:00-20:00",
                    "21:00-22:00"
                ],
                body: [
                    {
                        title: "2019/1/1 Tue",
                        context: [4, 2, 5, 4, 5, 1, 4, 1, 2, 1, 4, 2]
                    },
                    {
                        title: "2019/1/2 Wed",
                        context: [5, 4, 4, 5, 1, 5, 3, 4, 1, 2, 5, 1]
                    },
                    {
                        title: "2019/1/3 Thu",
                        context: [1, 3, 4, 5, 1, 5, 4, 2, 1, 2, 1, 1]
                    },
                    {
                        title: "2019/1/4 Fri",
                        context: [1, 1, 4, 5, 1, 4, 4, 3, 1, 3, 4, 1]
                    },
                    {
                        title: "2019/1/5 Sat",
                        context: [1, 3, 1, 4, 2, 1, 4, 5, 1, 5, 2, 2]
                    },
                    {
                        title: "2019/1/6 Sun",
                        context: [1, 2, 1, 2, 4, 5, 1, 2, 1, 3, 3, 1]
                    },
                    {
                        title: "2019/1/7 Mon",
                        context: [1, 1, 1, 2, 4, 5, 1, 5, 2, 3, 4, 1]
                    }
                ]
            };
        }
    }

    initAnlyDashboardData() {
        this.dData = {
            pageType: PageType.traffic,
            traffic: {
                sign: Sign.negative,
                total: 43250,
                value: 10,
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
    }

    changeSite(site) {
        this.site = site;

        this.initPeakTimeRange();
    }
}
</script>
