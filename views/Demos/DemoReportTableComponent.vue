<template>
    <div>
        DemoReportComponent
        <anlysis-dashboard :anlysisData="dData">
        </anlysis-dashboard>
        <peak-time-range
            :siteItems="siteItem"
            :dayXSiteX="pDayXxSiteX"
            :timeRangeData="pData"
        >
        </peak-time-range>
        <report-table :reportTableData="rData">
        </report-table>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";
import {
    ReportTableData,
    IPeckTimeRange,
    ReportDashboard,
    EPageType,
    ESign,
    EDayXSiteX,
    ISiteItems
} from "@/components/Reports";

@Component
export default class DemoReportComponent extends Vue {
    ePageType = EPageType;
    eESign = ESign;

    rData = new ReportTableData();

    dData = new ReportDashboard();

    pData:IPeckTimeRange[] = [];
    
    pDayXxSiteX:EDayXSiteX = EDayXSiteX.none;

    siteItem:ISiteItems[] = [
    ];


    created() {}

    mounted() {
        this.initAnlyDashboardData();
        this.initPeakTimeRange();
        this.initReportTable();
        
    }

    initReportTable() {
        setTimeout(() => {
            this.rData.head = [
                "2019-06-24T09:00:00.000Z",
                "2019-06-24T10:00:00.000Z",
                "2019-06-24T11:00:00.000Z",
                "2019-06-24T12:00:00.000Z",
                "2019-06-24T13:00:00.000Z",
                "2019-06-24T14:00:00.000Z",
                "2019-06-24T16:00:00.000Z",
                "2019-06-24T17:00:00.000Z",
                "2019-06-24T18:00:00.000Z",
                "2019-06-24T19:00:00.000Z",
                "2019-06-24T20:00:00.000Z",
                "2019-06-24T21:00:00.000Z"
            ];
            this.rData.body = [
                {
                    area: "1F精品區",
                    group: "N/A",
                    in: [
                        {  value: 1, valueRatio: 0.01 },
                        {  value: 1, valueRatio: -0.01 },
                        {  value: 1, valueRatio: 0.01 },
                        {  value: 1, valueRatio: 0.01 },
                        {  value: 1, valueRatio: 0.01 },
                        {  value: 1, valueRatio: -0.01 },
                        {  value: 1, valueRatio: 0.01 },
                        {  value: 1, valueRatio: 0.01 },
                        {  value: 1, valueRatio: 0.01 },
                        {  value: 1, valueRatio: 0.01 },
                        {  value: 1, valueRatio: -0.01 },
                        {  value: 2, valueRatio: -0.02 }
                    ],
                    out: [
                        { value: 3, valueRatio: -0.03 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 4, valueRatio: 0.05 }
                    ]
                },
                {
                    area: "2F生活用品",
                    group: "Group01",
                    in: [
                        { value: 5, valueRatio: 0.06 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 6, valueRatio: -0.07 }
                    ],
                    out: [
                        { value: 7, valueRatio: -0.08 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: -0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 1, valueRatio: 0.01 },
                        { value: 8, valueRatio: -0.09 }
                    ]
                }
            ];
        }, 4000);
    }

    initPeakTimeRange() {
        setTimeout(() => {

           this.pDayXxSiteX = EDayXSiteX.dayXSiteX

            this.siteItem= [
               { value: "iVTCTzctbF", text: "台北店" },
               { value: "pfLGgj8Hf5", text: "台中店" }
            ];

           let apipData= [
                {
                    site: {
                        objectId: "iVTCTzctbF",
                        name: "台北店"
                    },
                    date: "2019-06-25T16:00:00.000Z",
                    peakHourDatas: [
                        {
                            date: "2019-06-25T01:00:00.000Z",
                            level: 4
                        },
                        {
                            date: "2019-06-25T02:00:00.000Z",
                            level: 5
                        },
                        {
                            date: "2019-06-25T03:00:00.000Z",
                            level: 1
                        },
                        {
                            date: "2019-06-25T04:00:00.000Z",
                            level: 5
                        },
                        {
                            date: "2019-06-25T05:00:00.000Z",
                            level: 3
                        },
                        {
                            date: "2019-06-25T06:00:00.000Z",
                            level: 0
                        },
                        {
                            date: "2019-06-25T07:00:00.000Z",
                            level: 3
                        },
                        {
                            date: "2019-06-25T08:00:00.000Z",
                            level: 2
                        }
                    ]
                },
                {
                    site: {
                        objectId: "iVTCTzctbF",
                        name: "台北店"
                    },
                    date: "2019-06-26T16:00:00.000Z",
                    peakHourDatas: [
                        {
                            date: "2019-06-25T01:00:00.000Z",
                            level: 1
                        },
                        {
                            date: "2019-06-25T02:00:00.000Z",
                            level: 4
                        },
                        {
                            date: "2019-06-25T03:00:00.000Z",
                            level: 5
                        },
                        {
                            date: "2019-06-25T04:00:00.000Z",
                            level: 2
                        },
                        {
                            date: "2019-06-25T05:00:00.000Z",
                            level: 5
                        },
                        {
                            date: "2019-06-25T06:00:00.000Z",
                            level: 4
                        },
                        {
                            date: "2019-06-25T07:00:00.000Z",
                            level: 1
                        },
                        {
                            date: "2019-06-25T08:00:00.000Z",
                            level: 0
                        }
                    ]
                },
                {
                    site: {
                        objectId: "pfLGgj8Hf5",
                        name: "台中店"
                    },
                    date: "2019-06-26T16:00:00.000Z",
                    peakHourDatas: [
                        {
                            date: "2019-06-25T01:00:00.000Z",
                            level: 2
                        },
                        {
                            date: "2019-06-25T02:00:00.000Z",
                            level: 2
                        },
                        {
                            date: "2019-06-25T03:00:00.000Z",
                            level: 3
                        },
                        {
                            date: "2019-06-25T04:00:00.000Z",
                            level: 4
                        },
                        {
                            date: "2019-06-25T05:00:00.000Z",
                            level: 5
                        },
                        {
                            date: "2019-06-25T06:00:00.000Z",
                            level: 3
                        },
                        {
                            date: "2019-06-25T07:00:00.000Z",
                            level: 2
                        },
                        {
                            date: "2019-06-25T08:00:00.000Z",
                            level: 1
                        }
                    ]
                }
            ];

 
        // Data format conversion
        for (let item of apipData) {
                let pDatum:IPeckTimeRange = {
                    site:"",
                    head:[],
                    body:[]
                }
                let head = [];
                let levels: number[] = [];
                for (let subItem of item.peakHourDatas) {
                    levels.push(subItem.level);
                    head.push(subItem.date);
                }

                let body = {
                    title: item.date,
                    context: levels
                };
                pDatum.site = item.site.objectId;
                pDatum.head = head;
                pDatum.body.push(body);
                this.pData.push(pDatum);
        }

        }, 2000);
    }

    initAnlyDashboardData() {
        setTimeout(() => {
            this.dData = {
                pageType: EPageType.traffic,
                traffic: {
                    sign: ESign.negative,
                    total: 43250,
                    value: 10,
                    valueRatio: 0.156
                },
                averageOccupancy: {
                    sign: ESign.negative,
                    total: 10,
                    value: 1,
                    valueRatio: 0.099
                },
                averageDwellTime: {
                    sign: ESign.positive,
                    total: 25,
                    value: 2,
                    valueRatio: 0.01
                },
                demographic: {
                    sign: ESign.positive,
                    value: 11,
                    valueRatio: 0.099,
                    sign2: ESign.negative,
                    value2: 11,
                    valueRatio2: 0.099
                },
                vipBlacklist: {
                    sign: ESign.positive,
                    value: 11,
                    valueRatio: 0.099,
                    sign2: ESign.negative,
                    value2: 11,
                    valueRatio2: 0.099
                },
                repeatCustomer: {
                    sign: ESign.negative,
                    total: 0.36,
                    value: 9,
                    valueRatio: 0.11
                },
                revenue: {
                    sign: ESign.positive,
                    total: 9999999,
                    value: 11,
                    valueRatio: 0.099
                },
                transaction: {
                    sign: ESign.negative,
                    total: 666,
                    value: 11,
                    valueRatio: 0.099
                },
                conversion: {
                    sign: ESign.positive,
                    total: 0.18,
                    value: 2,
                    valueRatio: 0.01
                },
                asp: {
                    sign: ESign.positive,
                    total: 1235,
                    value: 2,
                    valueRatio: 0.01
                }
            };
        }, 2000);
    }

}
</script>
