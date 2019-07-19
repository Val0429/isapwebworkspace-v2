<template>
    <div class="chart">
        <b-form-group>
            <b-row>
                <b-col>

                    <!-- siteXDay1 -->
                    <highcharts
                        ref="chartSiteXDay1"
                        v-if="mountChart.siteXday1"
                        :options="chartOptions.siteXday1"
                    ></highcharts>

                    <!-- siteXDayX -->
                    <highcharts
                        ref="chartSiteXDayX"
                        v-if="mountChart.siteXdayX"
                        :options="chartOptions.siteXdayX"
                    ></highcharts>

                </b-col>
            </b-row>
        </b-form-group>

        <b-modal
            v-model="modalShow"
            hide-header
            hide-footer
            size="lg"
        >
            <table
                ref="reportTable"
                class="table b-table table-striped table-hover"
            >
                <thead>
                    <tr>
                        <th
                            class="center"
                            style="width:20%;"
                            v-for="(value,index) in vipTrackingDetail.titleList"
                            :key="'title_' + index"
                        >{{ value }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(value,index) in vipTrackingDetail.data"
                        :key="'tableData__' + index"
                    >
                        <td class="center">
                            <img
                                style="width: 100%; max-hight:50px;"
                                :src="value.imageSrc"
                            >
                        </td>
                        <td class="center">{{ value.name }}</td>
                        <td class="center">{{ value.site }}</td>
                        <td class="center">{{ value.date }}</td>
                        <td class="center">{{ value.dwellTime }}</td>
                    </tr>
                </tbody>
            </table>

            <div class="table-pagination right">
                <b-pagination-nav
                    :link-gen="getDetail"
                    :number-of-pages="tableNumberRow()"
                    v-model="vipTrackingDetail.paging.currentPage"
                />
            </div>

        </b-modal>

    </div>
</template>

<script lang="ts">
import {
    Vue,
    Component,
    Prop,
    Emit,
    Model,
    Watch
} from "vue-property-decorator";

/// install Highcharts
import Highcharts from "highcharts";
import HighchartsVue from "highcharts-vue";
import exportingInit from "highcharts/modules/exporting";
exportingInit(Highcharts);
Vue.use(HighchartsVue);

// custom import
import Datetime from "@/services/Datetime";
import HighchartsService from "../models/HighchartsService";
import { ISite, ISiteOfficeHourItem, IChartVipTrackingData } from "../";
import { EChartMode, EVipTrackingType } from "../";
import {
    IChartVipTrackingDetailData,
    IChartTrafficData
} from "../models/IHighCharts";

@Component({
    components: {}
})
export class HighchartsVipTracking extends Vue {
    // Prop
    @Prop({
        type: Date,
        default: function() {
            return new Date();
        }
    })
    startDate: Date;

    @Prop({
        type: Date,
        default: function() {
            return new Date();
        }
    })
    endDate: Date;

    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    tagIds: string[];

    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    sites: ISite[];

    @Prop({
        type: Array,
        default: function() {
            return [];
        }
    })
    value: IChartVipTrackingData[];

    chartMode: EChartMode = EChartMode.none;
    modalShow = false;

    vipTrackingDetail = {
        titleList: [],
        data: [],
        paging: {
            totalRow: 10,
            prePage: 1,
            currentPage: 10
        }
    };

    mountChart: {
        siteXday1: boolean;
        siteXdayX: boolean;
    } = {
        siteXday1: false,
        siteXdayX: false
    };

    chartOptions: {
        siteXday1: any;
        siteXdayX: any;
    } = {
        siteXday1: {},
        siteXdayX: {}
    };

    @Watch("value", { deep: true })
    private onValueChanged(
        newval: IChartVipTrackingData[],
        oldval: IChartVipTrackingData[]
    ) {
        this.start();
    }

    created() {
        this.start();
    }

    mounted() {}

    start() {
        this.modalShow = false;
        this.mountChart.siteXday1 = false;
        this.mountChart.siteXdayX = false;

        this.chartMode = HighchartsService.chartMode(
            this.startDate,
            this.endDate,
            this.sites
        );

        switch (this.chartMode) {
            case EChartMode.site1Day1:
            case EChartMode.siteXDay1:
                this.initSiteXDay1();
                break;
            case EChartMode.site1DayX:
            case EChartMode.siteXDayX:
                this.initSiteXDayX();
                break;
            default:
                break;
        }

        console.log(
            "chart prop: ",
            this.chartMode,
            this.startDate,
            this.endDate,
            this.sites,
            this.value
        );
    }

    ////////////////////////// site X day 1 //////////////////////////

    initSiteXDay1() {
        let tempValues: IChartVipTrackingData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempHourStrings: string[] = [];
        let tempCategories: string[] = [];
        let tempSeries: {
            name: string;
            data: number[];
        }[] = [{ name: "VIP", data: [] }, { name: "Blacklist", data: [] }];

        // get all site office hour
        let weekDay = this.startDate.getDay();
        let tempOfficeHour: ISiteOfficeHourItem = { startHour: 24, endHour: 0 };
        for (let site of this.sites) {
            let officeHour: ISiteOfficeHourItem = HighchartsService.siteOfficeHour(
                weekDay,
                this.sites[0].officeHour
            );
            if (officeHour.startHour < tempOfficeHour.startHour) {
                tempOfficeHour.startHour = officeHour.startHour;
            }
            if (officeHour.endHour > tempOfficeHour.endHour) {
                tempOfficeHour.endHour = officeHour.endHour;
            }
            if (officeHour.startHour >= 23 && officeHour.endHour <= 0) {
                break;
            }
        }

        // get all office hour string list
        for (
            let i = tempOfficeHour.startHour;
            i <= tempOfficeHour.endHour;
            i++
        ) {
            let hourString = i < 10 ? `0${i.toString()}` : i.toString();
            tempHourStrings.push(`${hourString}:00`);
        }

        for (let hour of tempHourStrings) {
            let spliceIndexList: number[] = [];
            let tempStartDate = new Date(this.startDate.getTime());
            let tempHourNumber = hour.replace(":00", "");
            tempStartDate.setHours(parseInt(tempHourNumber));
            let tempResult = {
                vip: 0,
                blacklist: 0,
                date: tempStartDate
            };
            for (let i in tempValues) {
                let val = tempValues[i];
                let tempValue = this.anysislyChartValue(val);
                if (tempValue.timeString == hour) {
                    spliceIndexList.push(parseInt(i));
                    switch (tempValue.type) {
                        case EVipTrackingType.vip:
                            tempResult.vip += tempValue.personCount;
                            break;
                        case EVipTrackingType.blacklist:
                            tempResult.blacklist += tempValue.personCount;
                            break;
                    }
                }
            }

            tempSeries[0].data.push(tempResult.vip);
            tempSeries[1].data.push(tempResult.blacklist);
            tempCategories.push(
                HighchartsService.categorieStringWithJSON(hour, tempResult)
            );

            // tempValues 減肥
            for (let i = spliceIndexList.length - 1; i >= 0; i--) {
                tempValues.splice(spliceIndexList[i], 1);
            }
        }

        this.chartOptions.siteXday1 = {
            chart: { zoomType: "x" },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            xAxis: {
                categories: tempCategories,
                labels: { useHTML: true }
            },
            yAxis: {
                labels: { style: { color: "#000" } },
                title: {
                    text: this._("w_ReportTraffic_TrafficTraffic"),
                    style: { color: "#000" }
                }
            },
            tooltip: {
                enabled: true,
                useHTML: true,
                backgroundColor: "#333",
                style: { color: "#fff" }
            },
            plotOptions: {
                series: {
                    cursor: "pointer",
                    point: {
                        events: {
                            click: this.clickChartPoint
                        }
                    }
                }
            },
            series: tempSeries
        };
        this.mountChart.siteXday1 = true;
    }

    ////////////////////////// site X day X //////////////////////////

    initSiteXDayX() {
        let tempValues: IChartVipTrackingData[] = JSON.parse(
            JSON.stringify(this.value)
        );
        let tempCategories: string[] = [];
        let tempSeries: {
            name: string;
            data: number[];
        }[] = [{ name: "VIP", data: [] }, { name: "Blacklist", data: [] }];
        let tempResult: any = [];

        // 避免時間相反造成無窮迴圈
        let sortDate = Datetime.SortDateGap(this.startDate, this.endDate);

        // 設置最大值避免無窮迴圈
        let categorieMaxlength = 10000;
        let categorieNowlength = 0;

        // 時間累加判斷用
        let tempTimestamp: number = sortDate.startDate.getTime();
        let endTimestamp: number = sortDate.endDate.getTime();
        let tempDate: Date = new Date(tempTimestamp);
        let dateGap: number =
            Math.floor(
                Math.abs(
                    sortDate.startDate.getTime() - sortDate.endDate.getTime()
                ) / Datetime.oneDayTimestamp
            ) + 1;

        while (
            tempTimestamp <= endTimestamp &&
            categorieNowlength < categorieMaxlength
        ) {
            let tempItem = {
                vip: 0,
                blacklist: 0,
                date: new Date(tempTimestamp)
            };

            let dateStart = Datetime.DateStart(new Date(tempTimestamp));
            let dateEnd = Datetime.DateStart(
                new Date(tempTimestamp + Datetime.oneDayTimestamp)
            );
            let tempStartTimestamp = dateStart.getTime();
            let tempEndTimestamp = dateEnd.getTime();

            let spliceIndexList: number[] = [];
            for (let i in tempValues) {
                let val = tempValues[i];
                let value: IChartVipTrackingData = this.anysislyChartValue(val);
                let valTimestamp = value.date.getTime();

                if (
                    valTimestamp >= tempStartTimestamp &&
                    valTimestamp <= tempEndTimestamp
                ) {
                    switch (value.type) {
                        case EVipTrackingType.vip:
                            tempItem.vip += value.personCount;
                            break;
                        case EVipTrackingType.blacklist:
                            tempItem.blacklist += value.personCount;
                            break;
                    }
                    spliceIndexList.push(parseInt(i));
                }
            }

            tempResult.push(tempItem);

            // tempValues 減肥
            for (let i = spliceIndexList.length - 1; i >= 0; i--) {
                tempValues.splice(spliceIndexList[i], 1);
            }

            // set loop value
            categorieNowlength++;
            tempTimestamp = dateEnd.getTime() + 1000;
        }

        for (let ret of tempResult) {
            tempCategories.push(
                HighchartsService.categorieStringWithJSON(
                    Datetime.DateTime2String(
                        ret.date,
                        HighchartsService.datetimeFormat.date
                    ),
                    ret
                )
            );
            tempSeries[0].data.push(ret.vip);
            tempSeries[1].data.push(ret.blacklist);
        }

        this.chartOptions.siteXdayX = {
            chart: { zoomType: "x" },
            exporting: { enabled: false },
            title: { text: null },
            subtitle: { text: null },
            xAxis: {
                categories: tempCategories,
                labels: { useHTML: true }
            },
            yAxis: {
                labels: { style: { color: "#000" } },
                title: {
                    text: null,
                    style: { color: "#000" }
                }
            },
            tooltip: {
                enabled: true,
                useHTML: true,
                backgroundColor: "#333",
                style: { color: "#fff" }
            },
            plotOptions: {
                series: {
                    cursor: "pointer",
                    point: {
                        events: {
                            click: this.clickChartPoint
                        }
                    }
                }
            },
            series: tempSeries
        };
        this.mountChart.siteXdayX = true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    clickChartPoint(value: any) {
        if (value == undefined) {
            return false;
        }

        if (value.point == undefined) {
            return false;
        }

        if (value.point.colorIndex == undefined) {
            return false;
        }

        if (value.point.category == undefined) {
            return false;
        }

        let vipType: EVipTrackingType = EVipTrackingType.none;
        if (value.point.colorIndex == 0) {
            vipType = EVipTrackingType.vip;
        } else if (value.point.colorIndex == 1) {
            vipType = EVipTrackingType.blacklist;
        }

        try {
            let valueStartIndex = value.point.category.indexOf(">{");
            let valueEndIndex = value.point.category.indexOf("}<");
            let valueJson = value.point.category.substring(
                valueStartIndex + 1,
                valueEndIndex + 1
            );
            let newValue: any = JSON.parse(valueJson);

            this.vipTrackingDetail.titleList = [];
            this.vipTrackingDetail.data = [];

            switch (vipType) {
                case EVipTrackingType.vip:
                    this.vipTrackingDetail.titleList.push(
                        this._("w_VIPAndBlackList_TableTitleVip")
                    );
                    break;
                case EVipTrackingType.blacklist:
                    this.vipTrackingDetail.titleList.push(
                        this._("w_VIPAndBlackList_TableTitleBlacklist")
                    );
                    break;
            }

            this.vipTrackingDetail.titleList.push(
                this._("w_VIPAndBlackList_TableTitleName")
            );
            this.vipTrackingDetail.titleList.push(
                this._("w_VIPAndBlackList_TableTitleSite")
            );
            this.vipTrackingDetail.titleList.push(
                this._("w_VIPAndBlackList_TableTitleVisitDate")
            );
            this.vipTrackingDetail.titleList.push(
                this._("w_VIPAndBlackList_TableTitleDwellTime")
            );

            this.getDetail();
            this.modalShow = true;

            console.log("!!! newValue", newValue);
        } catch (e) {
            console.log(e);
        }
    }

    getDetail() {
        // TODO: Waitting API
        this.vipTrackingDetail.data = [
            {
                imageSrc:
                    "https://i2.kknews.cc/SIG=qgrgn5/ctp-vzntr/1522820711142o3526o5n61.jpg",
                name: "楊冪",
                site: "北京店",
                date: "2019/07/13",
                dwellTime: "30m"
            },
            {
                imageSrc:
                    "https://i1.kknews.cc/SIG=3o4k229/ctp-vzntr/1522817213043o8860rqn82.jpg",
                name: "劉詩詩",
                site: "杭州店",
                date: "2019/07/20",
                dwellTime: "1h30m"
            },
            {
                imageSrc:
                    "https://i1.kknews.cc/SIG=1fo64hq/ctp-vzntr/15228207228673p8o2o7or4.jpg",
                name: "劉亦菲",
                site: "南京店",
                date: "2019/07/13",
                dwellTime: "45m"
            },
            {
                imageSrc:
                    "https://i1.kknews.cc/SIG=2iu502h/ctp-vzntr/1522820285391rsq0175o86.jpg",
                name: "迪麗熱巴",
                site: "烏魯木齊店",
                date: "2019/07/15",
                dwellTime: "3h15m"
            },
            {
                imageSrc:
                    "https://i1.kknews.cc/SIG=26sbusf/ctp-vzntr/1522820882168on5q151qno.jpg",
                name: "鄭爽",
                site: "黑龍江店",
                date: "2019/07/13",
                dwellTime: "1d2h30m"
            },
            {
                imageSrc:
                    "https://i2.kknews.cc/SIG=19drvqf/ctp-vzntr/15228174698542o17496r19.jpg",
                name: "唐嫣",
                site: "青島店",
                date: "2019/07/13",
                dwellTime: "3h30m"
            },
            {
                imageSrc:
                    "https://i2.kknews.cc/SIG=3t52gmc/ctp-vzntr/15228205840133364402o41.jpg",
                name: "戚薇",
                site: "珠穆朗瑪峰店",
                date: "2019/07/14",
                dwellTime: "10m"
            },
            {
                imageSrc:
                    "https://i2.kknews.cc/SIG=1k4bper/ctp-vzntr/1522818581653p16n111q29.jpg",
                name: "佟麗婭",
                site: "重慶店",
                date: "2019/07/13",
                dwellTime: "3m"
            },
            {
                imageSrc:
                    "https://i1.kknews.cc/SIG=3qgbsmb/ctp-vzntr/1522820352800435sop9r68.jpg",
                name: "趙麗穎",
                site: "大連店",
                date: "2019/07/13",
                dwellTime: "7h5m"
            },
            {
                imageSrc:
                    "https://i2.kknews.cc/SIG=1ldkf9/ctp-vzntr/152281799889310p148o357.jpg",
                name: "Angle Baby",
                site: "上海店",
                date: "2019/07/13",
                dwellTime: "16m"
            }
        ];
    }

    tableNumberRow(): number {
        let result = 1;
        let tempNumber = Math.ceil(
            this.vipTrackingDetail.paging.totalRow /
                this.vipTrackingDetail.paging.prePage
        );
        if (tempNumber > 0) {
            result = tempNumber;
        }
        return result;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    private anysislyChartValueDefault(): IChartVipTrackingData {
        let value: IChartVipTrackingData = {
            type: EVipTrackingType.none,
            date: new Date(),
            personCount: 0,

            // every report
            i18n: this.i18nItem(),
            timeString: Datetime.DateTime2String(
                new Date(),
                HighchartsService.datetimeFormat.time
            ),
            dateString: Datetime.DateTime2String(
                new Date(),
                HighchartsService.datetimeFormat.date
            )
        };
        return value;
    }

    private anysislyChartValue(
        item: IChartVipTrackingData
    ): IChartVipTrackingData {
        let value: IChartVipTrackingData = JSON.parse(JSON.stringify(item));
        value.date = new Date(value.date);

        value.i18n = this.i18nItem();
        value.timeString = Datetime.DateTime2String(
            value.date,
            HighchartsService.datetimeFormat.time
        );
        return value;
    }

    private i18nItem() {
        let result: any = {
            time: this._("w_Report_Time"),
            date: this._("w_Report_Date"),
            startDate: this._("w_Report_StartDate"),
            endDate: this._("w_Report_EndDate")
        };
        return result;
    }
}

export default HighchartsVipTracking;
Vue.component("highcharts-vip-tracking", HighchartsVipTracking);
</script>

<style lang="scss" scoped>
.center {
    text-align: center;
}
</style>
