<template>
    <div class="animated fadeIn">

        <!-- Tina -->
        <filter-condition-heat-map
            :sitesSelectItem="sitesSelectItem"
            :regionTreeItem="regionTreeItem"
            :templateItem="templateItem"
            :addPeriodSelectItem="addPeriodSelectItem"
            :label="_('w_ReportFilterConditionComponent_')"
            @submit-data="receiveFilterData"
        >

        </filter-condition-heat-map>

        <iv-card :visible="visible" :label="filterData.siteIds !== '' ? analysisTitle() : '' ">
            <template #toolbox>

                <iv-toolbox-export-pdf
                    size="lg"
                    @click="exportPDF"
                />

                <!-- Tina -->
                <iv-toolbox-send-mail
                    size="lg"
                    @click="modalShow = !modalShow"
                />
                <iv-toolbox-copy-to-template
                    size="lg"
                    @click="pageToReportTemplate()"
                />
            </template>

            <!-- Tina -->
            <analysis-filter-heat-map
                class="mb-4"
                :areaSelectItem="areaSelectItem"
                :deviceGroupSelectItem="deviceGroupSelectItem"
                :deviceSelectItem="deviceSelectItem"
                :isIncludedEmployeeSelectItem="isIncludedEmployeeSelectItem"
                :siteIds="filterData.siteIds"
                :areaId="inputFormData.areaId"
                :groupId="inputFormData.groupId"
                :deviceId="inputFormData.deviceId"
                :isIncludedEmployee="inputFormData.isIncludedEmployee"
                @area_id="receiveAreaId"
                @group_id="receiveGroupId"
                @device_id="receiveDeviceId"
                @is_included_employee="receiveIsIncludedEmployee"
            >
            </analysis-filter-heat-map>

            <!-- Tina -->
            <heat-map-many-day
                v-if="!checkDateTheSameDay(filterData.startDate, filterData.endDate)"
                :dayArray="dayArray"
                @day-array-index="receiveDayArrayIndex"
            ></heat-map-many-day>
            <br>

            <!-- Tina  -->
            <heat-map-one-day-slider-bar
                v-if="filterData.siteIds !== '' && checkDateTheSameDay(filterData.startDate, filterData.endDate)"
                :slider="slider"
                @hour="receiveHour"
            >
            </heat-map-one-day-slider-bar>

            <!-- Ben -->
            <camera-heatmap
                :mapImage="mapImage"
                :heatMapPosition="heatMapPosition"
            >
            </camera-heatmap>

        </iv-card>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

// Vue
import HeatMapManyDay from "@/components/Reports/Filter/HeatMapManyDay.vue";

// Region Tree
import {
    ERegionType,
    IRegionTreeSelected,
    RegionTreeItem
} from "@/components/RegionTree";

// Report
import {
    ETimeMode,
    EWeather,
    EAgeRange,
    EAreaMode,
    EDwellTimeRange,
    EPageType,
    ESign,
    EDeviceMode,
    EIncludedEmployee,
    EDesignationPeriod,
    EAddPeriodSelect,
    IChartDemographicData,
    ISite,
    ITemplateItem,
    IFilterCondition,
    IReportToTemplateItem
} from "@/components/Reports";
import {
    IHeatMapData,
    IHeatMapPosition,
    IMapImage
} from "@/components/Camera/IHeatmap";

// Service
import Dialog from "@/services/Dialog";
import RegionAPI from "@/services/RegionAPI";
import ResponseFilter from "@/services/ResponseFilter";
import Datetime from "@/services/Datetime";
import ReportService from "@/components/Reports/models/ReportService";
import WeatherService from "@/components/Reports/models/WeatherService";
import HighchartsService from "@/components/Reports/models/HighchartsService";
import Loading from "@/services/Loading";

// Export
import toExcel from "@/services/Excel/json2excel";
import excel2json from "@/services/Excel/excel2json";
import ReportPDFService from "@/components/Reports/models/ReportPDFService";
import { EFileType } from "@/components/Reports";

enum ETableStep {
    mainTable = "mainTable",
    sunTable = "sunTable",
    detailTable = "detailTable",
    none = "none"
}

@Component({
    components: {
        HeatMapManyDay
    }
})
export default class ReportHeatmap extends Vue {
    // Author : Morris
    templateItem: ITemplateItem | null = null;
    startDate: Date = new Date("2019-01-01T00:00:00.000Z");
    endDate: Date = new Date("2019-01-01T01:00:00.000Z");
    timeMode: ETimeMode = ETimeMode.none;
    areaMode: EAreaMode = EAreaMode.none;
    sites: ISite[] = [];
    chartDatas: IChartDemographicData[] = [];

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    //// Filter Condition Start ////

    // select 相關
    sitesSelectItem: any = [];
    addPeriodSelectItem: any = [];
    tagSelectItem: any = {};
    tags = [];

    // tree
    selectType = ERegionType.site;
    regionTreeItem = new RegionTreeItem();
    selecteds: IRegionTreeSelected[] = [];

    // OfficeHour 相關
    officeHourItemDetail: any = [];

    // recipient 相關
    modalShow: boolean = false;

    // 收合card控制
    visible: boolean = false;

    // 接收 Filter Condition 資料 相關
    filterData: any = {
        startDate: new Date(),
        endDate: new Date(),
        firstSiteId: "",
        siteIds: "",
        type: ETimeMode.none
    };
    responseData: any = {};
    userData: any = [];
    //// Filter Condition End ////

    //// Analysis Filter Start ////
    deviceMode: string = EDeviceMode.heatmap;

    // select 相關
    areaSelectItem: any = {};
    deviceGroupSelectItem: any = {};
    deviceSelectItem: any = {};
    timeModeSelectItem: any = {};
    isIncludedEmployeeSelectItem: any = {};

    inputFormData: any = {
        areaId: "",
        groupId: "",
        deviceId: "",
        type: "",
        isIncludedEmployee: "no"
    };

    // 整理 showReportData 相關
    areaSummaryFilter: any = [];
    deviceGroupSummaryFilter: any = [];
    deviceSummaryFilter: any = [];

    // 時間一天
    slider: any = {};
    hour: string = "";

    // 時間多天
    dayArray: any = [];
    dayArrayData: string = "";

    //// Analysis Filter End ////

    // send user 相關
    userSelectItem: any = {};

    // Report To Template相關
    ReportToTemplateData: IReportToTemplateItem | null = null;
    designationPeriod: EDesignationPeriod = EDesignationPeriod.none;

    //ReportDashboard 相關
    dPageType: EPageType = EPageType.none;
    dTimeMode: ETimeMode = ETimeMode.none;
    pSiteIds = [];

    //heatmap 相關
    heatMapPosition: IHeatMapPosition[] = [];

    mapImage: IMapImage = {
        name: "HeatMap",
        src:
            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        width: 600,
        height: 400
    };

    ////////////////////////////////////// Tina End //////////////////////////////////////

    created() {
        this.initDatas();
        this.initTemplate();
    }

    mounted() {}

    async initDatas() {
        // Tina
        this.initSelect();
        await this.initRegionTreeSelect();
        await this.siteFilterPermission();
        await this.initSelectItemTag();
        await this.initSelectItemTree();
        await this.initSelectItemUsers();
    }

    initHeatmap() {
        //假資料

        // var points = [];
        // var max = 0;
        // var width = this.mapImage.width;
        // var height = this.mapImage.height;
        // var len = 400;

        // while (len--) {
        //     let val = Math.floor(Math.random() * 100);
        //     max = Math.max(max, val);
        //     let point = {
        //         x: Math.floor(Math.random() * width),
        //         y: Math.floor(Math.random() * height),
        //         value: val
        //     };
        //     if (
        //         100 > point.x ||
        //         point.x > 350 ||
        //         70 > point.y ||
        //         point.y > 250
        //     ) {
        //         continue;
        //     }
        //     points.push(point);
        // }

        var points = [{"x":5,"y":5,"value":0},{"x":15,"y":5,"value":0},{"x":25,"y":5,"value":0},{"x":35,"y":5,"value":0},{"x":45,"y":5,"value":0},{"x":55,"y":5,"value":0},{"x":65,"y":5,"value":0},{"x":75,"y":5,"value":0},{"x":85,"y":5,"value":0},{"x":95,"y":5,"value":0},{"x":105,"y":5,"value":0},{"x":115,"y":5,"value":0},{"x":125,"y":5,"value":0},{"x":135,"y":5,"value":0},{"x":145,"y":5,"value":0},{"x":155,"y":5,"value":0},{"x":165,"y":5,"value":0},{"x":175,"y":5,"value":0},{"x":185,"y":5,"value":0},{"x":195,"y":5,"value":0},{"x":205,"y":5,"value":0},{"x":215,"y":5,"value":0},{"x":225,"y":5,"value":0},{"x":235,"y":5,"value":0},{"x":245,"y":5,"value":0},{"x"	:255,"y":5,"value":0},{"x":265,"y":5,"value":0},{"x":275,"y":5,"value":0},{"x":285,"y":5,"value":0},{"x":295,"y":5,"value":0},{"x":305,"y":5,"value":0},{"x":315,"y":5,"value":0},{"x":325,"y":5,"value":0},{"x":335,"y":5,"value":0},{"x":345,"y":5,"value":0},{"x":355,"y":5,"value":0},{"x":365,"y":5,"value":0},{"x":375,"y":5,"value":0},{"x":385,"y":5,"value":0},{"x":395,"y":5,"value":0},{"x":405,"y":5,"value":0},{"x":415,"y":5,"value":0},{"x":425,"y":5,"value":0},{"x":435,"y":5,"value":0},{"x":445,"y":5,"value":0},{"x":455,"y":5,"value":0},{"x":465,"y":5,"value":0},{"x":475,"y":5,"value":6},{"x":485,"y":5,"value":6},{"x":495,"y":5,"value":6},{"x":505,"y":5,"value":6},{"x":515,"y":5,"value":6},{"x":525,"y":5,"value":6},{"x":535,"y":5,"value":0},{"x":545,"y":5,"value":0},{"x":555,"y":5,"value":0},{"x":565,"y":5,"value":0},{"x":575,"y":5,"value":6},{"x":585,"y":5,"value":6},{"x":595,"y":5,"value":6},{"x":605,"y":5,"value":6},{"x":615,"y":5,"value":6},{"x":625,"y":5,"value":6},{"x":635,"y":5,"value":6},{"x":5,"y":15,"value":0},{"x":15,"y":15,"value":0},{"x":25,"y":15,"value":0},{"x":35,"y":15,"value":0},{"x":45,"y":15,"value":0},{"x":55,"y":15,"value":0},{"x":65,"y":15,"value":0},{"x":75,"y":15,"value":0},{"x":85,"y":15,"value":0},{"x":95,"y":15,"value":0},{"x":105,"y":15,"value":0},{"x":115,"y":15,"value":0},{"x":125,"y":15,"value":0},{"x":135,"y":15,"value":0},{"x":145,"y":15,"value":0},{"x":155,"y":15,"value":0},{"x":165,"y":15,"value":0},{"x":175,"y":15,"value":0},{"x":185,"y":15,"value":0},{"x":195,"y":15,"value":0},{"x":205,"y":15,"value":0},{"x":215,"y":15,"value":0},{"x":225,"y":15,"value":0},{"x":235,"y":15,"value":0},{"x":245,"y":15,"value":0},{"x":255,"y":15,"value":0},{"x":265,"y":15,"value":0},{"x":275,"y":15,"value":0},{"x":285,"y":15,"value":0},{"x":295,"y":15,"value":0},{"x":305,"y":15,"value":0},{"x":315,"y":15,"value":0},{"x":325,"y":15,"value":0},{"x":335,"y":15,"value":0},{"x":345,"y":15,"value":0},{"x":355,"y":15,"value":0},{"x":365,"y":15,"value":0},{"x":375,"y":15,"value":0},{"x":385,"y":15,"value":0},{"x":395,"y":15,"value":0},{"x":405,"y":15,"value":0},{"x":415,"y":15,"value":0},{"x":425,"y":15,"value":0},{"x":435,"y":15,"value":0},{"x":445,"y":15,"value":0},{"x":455,"y":15,"value":0},{"x":465,"y":15,"value":0},{"x":475,"y":15,"value":6},{"x":485,"y":15,"value":6},{"x":495,"y":15,"value":6},{"x":505,"y":15,"value":6},{"x":515,"y":15,"value":6},{"x":525,"y":15,"value":6},{"x":535,"y":15,"value":0},{"x":545,"y":15,"value":0},{"x":555,"y":15,"value":0},{"x":565,"y":15,"value":0},{"x":575,"y":15,"value":6},{"x":585,"y":15,"value":6},{"x":595,"y":15,"value":6},{"x":605,"y":15,"value":6},{"x":615,"y":15,"value":6},{"x":625,"y":15,"value":6},{"x":635,"y":15,"value":6},{"x":5,"y":25,"value":0},{"x":15,"y":25,"value":0},{"x":25,"y":25,"value":0},{"x":35,"y":25,"value":0},{"x":45,"y":25,"value":0},{"x":55,"y":25,"value":0},{"x":65,"y":25,"value":0},{"x":75,"y":25,"value":0},{"x":85,"y":25,"value":0},{"x":95,"y":25,"value":0},{"x":105,"y":25,"value":0},{"x":115,"y":25,"value":0},{"x":125,"y":25,"value":0},{"x":135,"y":25,"value":0},{"x":145,"y":25,"value":0},{"x":155,"y":25,"value":0},{"x":165,"y":25,"value":0},{"x":175,"y":25,"value":0},{"x":185,"y":25,"value":0},{"x":195,"y":25,"value":0},{"x":205,"y":25,"value":0},{"x":215,"y":25,"value":0},{"x":225,"y":25,"value":0},{"x":235,"y":25,"value":0},{"x":245,"y":25,"value":0},{"x":255,"y":25,"value":0},{"x":265,"y":25,"value":0},{"x":275,"y":25,"value":0},{"x":285,"y":25,"value":0},{"x":295,"y":25,"value":0},{"x":305,"y":25,"value":0},{"x":315,"y":25,"value":0},{"x":325,"y":25,"value":0},{"x":335,"y":25,"value":0},{"x":345,"y":25,"value":0},{"x":355,"y":25,"value":0},{"x":365,"y":25,"value":0},{"x":375,"y":25,"value":0},{"x":385,"y":25,"value":0},{"x":395,"y":25,"value":0},{"x":405,"y":25,"value":0},{"x":415,"y":25,"value":0},{"x":425,"y":25,"value":0},{"x":435,"y":25,"value":0},{"x":445,"y":25,"value":0},{"x":455,"y":25,"value":0},{"x":465,"y":25,"value":0},{"x":475,"y":25,"value":6},{"x":485,"y":25,"value":6},{"x":495,"y":25,"value":6},{"x":505,"y":25,"value":6},{"x":515,"y":25,"value":18},{"x":525,"y":25,"value":18},{"x":535,"y":25,"value":12},{"x":545,"y":25,"value":12},{"x":555,"y":25,"value":12},{"x":565,"y":25,"value":12},{"x":575,"y":25,"value":18},{"x":585,"y":25,"value":6},{"x":595,"y":25,"value":6},{"x":605,"y":25,"value":12},{"x":615,"y":25,"value":12},{"x":625,"y":25,"value":12},{"x":635,"y":25,"value":12},{"x":5,"y":35,"value":0},{"x":15,"y":35,"value":0},{"x":25,"y":35,"value":0},{"x":35,"y":35,"value":0},{"x":45,"y":35,"value":0},{"x":55,"y":35,"value":0},{"x":65,"y":35,"value":0},{"x":75,"y":35,"value":0},{"x":85,"y":35,"value":0},{"x":95,"y":35,"value":0},{"x":105,"y":35,"value":0},{"x":115,"y":35,"value":0},{"x":125,"y":35,"value":0},{"x":135,"y":35,"value":0},{"x":145,"y":35,"value":0},{"x":155,"y":35,"value":0},{"x":165,"y":35,"value":0},{"x":175,"y":35,"value":0},{"x":185,"y":35,"value":0},{"x":195,"y":35,"value":0},{"x":205,"y":35,"value":0},{"x":215,"y":35,"value":0},{"x":225,"y":35,"value":0},{"x":235,"y":35,"value":0},{"x":245,"y":35,"value":0},{"x":255,"y":35,"value":0},{"x":265,"y":35,"value":0},{"x":275,"y":35,"value":0},{"x":285,"y":35,"value":0},{"x":295,"y":35,"value":0},{"x":305,"y":35,"value":0},{"x":315,"y":35,"value":0},{"x":325,"y":35,"value":0},{"x":335,"y":35,"value":0},{"x":345,"y":35,"value":0},{"x":355,"y":35,"value":0},{"x":365,"y":35,"value":0},{"x":375,"y":35,"value":0},{"x":385,"y":35,"value":0},{"x":395,"y":35,"value":0},{"x":405,"y":35,"value":0},{"x":415,"y":35,"value":0},{"x":425,"y":35,"value":0},{"x":435,"y":35,"value":0},{"x":445,"y":35,"value":0},{"x":455,"y":35,"value":0},{"x":465,"y":35,"value":0},{"x":475,"y":35,"value":6},{"x":485,"y":35,"value":6},{"x":495,"y":35,"value":6},{"x":505,"y":35,"value":6},{"x":515,"y":35,"value":18},{"x":525,"y":35,"value":18},{"x":535,"y":35,"value":12},{"x":545,"y":35,"value":12},{"x":555,"y":35,"value":12},{"x":565,"y":35,"value":12},{"x":575,"y":35,"value":18},{"x":585,"y":35,"value":6},{"x":595,"y":35,"value":6},{"x":605,"y":35,"value":12},{"x":615,"y":35,"value":12},{"x":625,"y":35,"value":12},{"x":635,"y":35,"value":12},{"x":5,"y":45,"value":0},{"x":15,"y":45,"value":0},{"x":25,"y":45,"value":0},{"x":35,"y":45,"value":0},{"x":45,"y":45,"value":0},{"x":55,"y":45,"value":0},{"x":65,"y":45,"value":0},{"x":75,"y":45,"value":0},{"x":85,"y":45,"value":0},{"x":95,"y":45,"value":0},{"x":105,"y":45,"value":0},{"x":115,"y":45,"value":0},{"x":125,"y":45,"value":0},{"x":135,"y":45,"value":0},{"x":145,"y":45,"value":0},{"x":155,"y":45,"value":0},{"x":165,"y":45,"value":0},{"x":175,"y":45,"value":0},{"x":185,"y":45,"value":6},{"x":195,"y":45,"value":24},{"x":205,"y":45,"value":24},{"x":215,"y":45,"value":24},{"x":225,"y":45,"value":24},{"x":235,"y":45,"value":24},{"x":245,"y":45,"value":24},{"x":255,"y":45,"value":24},{"x":265,"y":45,"value":24},{"x":275,"y":45,"value":0},{"x":285,"y":45,"value":0},{"x":295,"y":45,"value":0},{"x":305,"y":45,"value":0},{"x":315,"y":45,"value":0},{"x":325,"y":45,"value":0},{"x":335,"y":45,"value":0},{"x":345,"y":45,"value":0},{"x":355,"y":45,"value":0},{"x":365,"y":45,"value":0},{"x":375,"y":45,"value":0},{"x":385,"y":45,"value":0},{"x":395,"y":45,"value":0},{"x":405,"y":45,"value":0},{"x":415,"y":45,"value":0},{"x":425,"y":45,"value":0},{"x":435,"y":45,"value":0},{"x":445,"y":45,"value":0},{"x":455,"y":45,"value":0},{"x":465,"y":45,"value":0},{"x":475,"y":45,"value":6},{"x":485,"y":45,"value":6},{"x":495,"y":45,"value":6},{"x":505,"y":45,"value":6},{"x":515,"y":45,"value":18},{"x":525,"y":45,"value":18},{"x":535,"y":45,"value":12},{"x":545,"y":45,"value":18},{"x":555,"y":45,"value":18},{"x":565,"y":45,"value":18},{"x":575,"y":45,"value":24},{"x":585,"y":45,"value":12},{"x":595,"y":45,"value":6},{"x":605,"y":45,"value":12},{"x":615,"y":45,"value":12},{"x":625,"y":45,"value":12},{"x":635,"y":45,"value":12},{"x":5,"y":55,"value":0},{"x":15,"y":55,"value":0},{"x":25,"y":55,"value":0},{"x":35,"y":55,"value":0},{"x":45,"y":55,"value":6},{"x":55,"y":55,"value":6},{"x":65,"y":55,"value":6},{"x":75,"y":55,"value":6},{"x":85,"y":55,"value":6},{"x":95,"y":55,"value":6},{"x":105,"y":55,"value":6},{"x":115,"y":55,"value":6},{"x":125,"y":55,"value":0},{"x":135,"y":55,"value":0},{"x":145,"y":55,"value":0},{"x":155,"y":55,"value":0},{"x":165,"y":55,"value":0},{"x":175,"y":55,"value":0},{"x":185,"y":55,"value":6},{"x":195,"y":55,"value":30},{"x":205,"y":55,"value":30},{"x":215,"y":55,"value":30},{"x":225,"y":55,"value":30},{"x":235,"y":55,"value":30},{"x":245,"y":55,"value":30},{"x":255,"y":55,"value":30},{"x":265,"y":55,"value":24},{"x":275,"y":55,"value":0},{"x":285,"y":55,"value":0},{"x":295,"y":55,"value":0},{"x":305,"y":55,"value":0},{"x":315,"y":55,"value":0},{"x":325,"y":55,"value":0},{"x":335,"y":55,"value":6},{"x":345,"y":55,"value":6},{"x":355,"y":55,"value":6},{"x":365,"y":55,"value":6},{"x":375,"y":55,"value":6},{"x":385,"y":55,"value":6},{"x":395,"y":55,"value":6},{"x":405,"y":55,"value":6},{"x":415,"y":55,"value":0},{"x":425,"y":55,"value":0},{"x":435,"y":55,"value":0},{"x":445,"y":55,"value":0},{"x":455,"y":55,"value":0},{"x":465,"y":55,"value":0},{"x":475,"y":55,"value":6},{"x":485,"y":55,"value":6},{"x":495,"y":55,"value":6},{"x":505,"y":55,"value":6},{"x":515,"y":55,"value":18},{"x":525,"y":55,"value":18},{"x":535,"y":55,"value":12},{"x":545,"y":55,"value":18},{"x":555,"y":55,"value":18},{"x":565,"y":55,"value":18},{"x":575,"y":55,"value":24},{"x":585,"y":55,"value":12},{"x":595,"y":55,"value":6},{"x":605,"y":55,"value":12},{"x":615,"y":55,"value":12},{"x":625,"y":55,"value":12},{"x":635,"y":55,"value":12},{"x":5,"y":65,"value":0},{"x":15,"y":65,"value":0},{"x":25,"y":65,"value":0},{"x":35,"y":65,"value":0},{"x":45,"y":65,"value":6},{"x":55,"y":65,"value":6},{"x":65,"y":65,"value":12},{"x":75,"y":65,"value":12},{"x":85,"y":65,"value":12},{"x":95,"y":65,"value":12},{"x":105,"y":65,"value":12},{"x":115,"y":65,"value":12},{"x":125,"y":65,"value":0},{"x":135,"y":65,"value":0},{"x":145,"y":65,"value":0},{"x":155,"y":65,"value":0},{"x":165,"y":65,"value":0},{"x":175,"y":65,"value":0},{"x":185,"y":65,"value":6},{"x":195,"y":65,"value":30},{"x":205,"y":65,"value":30},{"x":215,"y":65,"value":30},{"x":225,"y":65,"value":30},{"x":235,"y":65,"value":30},{"x":245,"y":65,"value":30},{"x":255,"y":65,"value":30},{"x":265,"y":65,"value":24},{"x":275,"y":65,"value":0},{"x":285,"y":65,"value":0},{"x":295,"y":65,"value":0},{"x":305,"y":65,"value":0},{"x":315,"y":65,"value":0},{"x":325,"y":65,"value":0},{"x":335,"y":65,"value":6},{"x":345,"y":65,"value":6},{"x":355,"y":65,"value":6},{"x":365,"y":65,"value":6},{"x":375,"y":65,"value":6},{"x":385,"y":65,"value":6},{"x":395,"y":65,"value":6},{"x":405,"y":65,"value":6},{"x":415,"y":65,"value":0},{"x":425,"y":65,"value":0},{"x":435,"y":65,"value":0},{"x":445,"y":65,"value":0},{"x":455,"y":65,"value":0},{"x":465,"y":65,"value":0},{"x":475,"y":65,"value":6},{"x":485,"y":65,"value":6},{"x":495,"y":65,"value":6},{"x":505,"y":65,"value":6},{"x":515,"y":65,"value":18},{"x":525,"y":65,"value":18},{"x":535,"y":65,"value":12},{"x":545,"y":65,"value":18},{"x":555,"y":65,"value":18},{"x":565,"y":65,"value":18},{"x":575,"y":65,"value":24},{"x":585,"y":65,"value":12},{"x":595,"y":65,"value":6},{"x":605,"y":65,"value":12},{"x":615,"y":65,"value":12},{"x":625,"y":65,"value":12},{"x":635,"y":65,"value":12},{"x":5,"y":75,"value":0},{"x":15,"y":75,"value":0},{"x":25,"y":75,"value":0},{"x":35,"y":75,"value":0},{"x":45,"y":75,"value":6},{"x":55,"y":75,"value":6},{"x":65,"y":75,"value":12},{"x":75,"y":75,"value":12},{"x":85,"y":75,"value":12},{"x":95,"y":75,"value":12},{"x":105,"y":75,"value":12},{"x":115,"y":75,"value":12},{"x":125,"y":75,"value":0},{"x":135,"y":75,"value":0},{"x":145,"y":75,"value":0},{"x":155,"y":75,"value":0},{"x":165,"y":75,"value":0},{"x":175,"y":75,"value":0},{"x":185,"y":75,"value":6},{"x":195,"y":75,"value":30},{"x":205,"y":75,"value":30},{"x":215,"y":75,"value":30},{"x":225,"y":75,"value":30},{"x":235,"y":75,"value":30},{"x":245,"y":75,"value":30},{"x":255,"y":75,"value":30},{"x":265,"y":75,"value":24},{"x":275,"y":75,"value":0},{"x":285,"y":75,"value":0},{"x":295,"y":75,"value":0},{"x":305,"y":75,"value":0},{"x":315,"y":75,"value":0},{"x":325,"y":75,"value":0},{"x":335,"y":75,"value":6},{"x":345,"y":75,"value":6},{"x":355,"y":75,"value":6},{"x":365,"y":75,"value":6},{"x":375,"y":75,"value":6},{"x":385,"y":75,"value":6},{"x":395,"y":75,"value":6},{"x":405,"y":75,"value":6},{"x":415,"y":75,"value":0},{"x":425,"y":75,"value":0},{"x":435,"y":75,"value":0},{"x":445,"y":75,"value":0},{"x":455,"y":75,"value":0},{"x":465,"y":75,"value":0},{"x":475,"y":75,"value":6},{"x":485,"y":75,"value":6},{"x":495,"y":75,"value":6},{"x":505,"y":75,"value":6},{"x":515,"y":75,"value":18},{"x":525,"y":75,"value":18},{"x":535,"y":75,"value":12},{"x":545,"y":75,"value":18},{"x":555,"y":75,"value":18},{"x":565,"y":75,"value":18},{"x":575,"y":75,"value":24},{"x":585,"y":75,"value":12},{"x":595,"y":75,"value":6},{"x":605,"y":75,"value":12},{"x":615,"y":75,"value":12},{"x":625,"y":75,"value":12},{"x":635,"y":75,"value":12},{"x":5,"y":85,"value":0},{"x":15,"y":85,"value":6},{"x":25,"y":85,"value":6},{"x":35,"y":85,"value":6},{"x":45,"y":85,"value":12},{"x":55,"y":85,"value":12},{"x":65,"y":85,"value":18},{"x":75,"y":85,"value":18},{"x":85,"y":85,"value":18},{"x":95,"y":85,"value":18},{"x":105,"y":85,"value":18},{"x":115,"y":85,"value":12},{"x":125,"y":85,"value":0},{"x":135,"y":85,"value":0},{"x":145,"y":85,"value":0},{"x":155,"y":85,"value":0},{"x":165,"y":85,"value":0},{"x":175,"y":85,"value":0},{"x":185,"y":85,"value":6},{"x":195,"y":85,"value":36},{"x":205,"y":85,"value":36},{"x":215,"y":85,"value":36},{"x":225,"y":85,"value":36},{"x":235,"y":85,"value":36},{"x":245,"y":85,"value":36},{"x":255,"y":85,"value":30},{"x":265,"y":85,"value":24},{"x":275,"y":85,"value":0},{"x":285,"y":85,"value":0},{"x":295,"y":85,"value":0},{"x":305,"y":85,"value":0},{"x":315,"y":85,"value":0},{"x":325,"y":85,"value":0},{"x":335,"y":85,"value":6},{"x":345,"y":85,"value":6},{"x":355,"y":85,"value":6},{"x":365,"y":85,"value":6},{"x":375,"y":85,"value":6},{"x":385,"y":85,"value":6},{"x":395,"y":85,"value":6},{"x":405,"y":85,"value":6},{"x":415,"y":85,"value":0},{"x":425,"y":85,"value":0},{"x":435,"y":85,"value":0},{"x":445,"y":85,"value":0},{"x":455,"y":85,"value":0},{"x":465,"y":85,"value":0},{"x":475,"y":85,"value":6},{"x":485,"y":85,"value":6},{"x":495,"y":85,"value":6},{"x":505,"y":85,"value":6},{"x":515,"y":85,"value":18},{"x":525,"y":85,"value":18},{"x":535,"y":85,"value":12},{"x":545,"y":85,"value":18},{"x":555,"y":85,"value":18},{"x":565,"y":85,"value":18},{"x":575,"y":85,"value":18},{"x":585,"y":85,"value":6},{"x":595,"y":85,"value":0},{"x":605,"y":85,"value":6},{"x":615,"y":85,"value":6},{"x":625,"y":85,"value":6},{"x":635,"y":85,"value":6},{"x":5,"y":95,"value":0},{"x":15,"y":95,"value":6},{"x":25,"y":95,"value":6},{"x":35,"y":95,"value":12},{"x":45,"y":95,"value":18},{"x":55,"y":95,"value":18},{"x":65,"y":95,"value":24},{"x":75,"y":95,"value":24},{"x":85,"y":95,"value":24},{"x":95,"y":95,"value":18},{"x":105,"y":95,"value":18},{"x":115,"y":95,"value":12},{"x":125,"y":95,"value":0},{"x":135,"y":95,"value":0},{"x":145,"y":95,"value":0},{"x":155,"y":95,"value":0},{"x":165,"y":95,"value":0},{"x":175,"y":95,"value":0},{"x":185,"y":95,"value":6},{"x":195,"y":95,"value":36},{"x":205,"y":95,"value":36},{"x":215,"y":95,"value":36},{"x":225,"y":95,"value":36},{"x":235,"y":95,"value":36},{"x":245,"y":95,"value":36},{"x":255,"y":95,"value":30},{"x":265,"y":95,"value":24},{"x":275,"y":95,"value":0},{"x":285,"y":95,"value":0},{"x":295,"y":95,"value":0},{"x":305,"y":95,"value":0},{"x":315,"y":95,"value":0},{"x":325,"y":95,"value":0},{"x":335,"y":95,"value":6},{"x":345,"y":95,"value":6},{"x":355,"y":95,"value":6},{"x":365,"y":95,"value":6},{"x":375,"y":95,"value":6},{"x":385,"y":95,"value":6},{"x":395,"y":95,"value":6},{"x":405,"y":95,"value":6},{"x":415,"y":95,"value":0},{"x":425,"y":95,"value":0},{"x":435,"y":95,"value":0},{"x":445,"y":95,"value":0},{"x":455,"y":95,"value":0},{"x":465,"y":95,"value":0},{"x":475,"y":95,"value":6},{"x":485,"y":95,"value":6},{"x":495,"y":95,"value":6},{"x":505,"y":95,"value":6},{"x":515,"y":95,"value":18},{"x":525,"y":95,"value":18},{"x":535,"y":95,"value":12},{"x":545,"y":95,"value":18},{"x":555,"y":95,"value":18},{"x":565,"y":95,"value":18},{"x":575,"y":95,"value":18},{"x":585,"y":95,"value":6},{"x":595,"y":95,"value":0},{"x":605,"y":95,"value":6},{"x":615,"y":95,"value":6},{"x":625,"y":95,"value":6},{"x":635,"y":95,"value":6},{"x":5,"y":105,"value":6},{"x":15,"y":105,"value":12},{"x":25,"y":105,"value":12},{"x":35,"y":105,"value":18},{"x":45,"y":105,"value":24},{"x":55,"y":105,"value":24},{"x":65,"y":105,"value":24},{"x":75,"y":105,"value":24},{"x":85,"y":105,"value":24},{"x":95,"y":105,"value":18},{"x":105,"y":105,"value":18},{"x":115,"y":105,"value":18},{"x":125,"y":105,"value":6},{"x":135,"y":105,"value":6},{"x":145,"y":105,"value":6},{"x":155,"y":105,"value":6},{"x":165,"y":105,"value":6},{"x":175,"y":105,"value":6},{"x":185,"y":105,"value":12},{"x":195,"y":105,"value":42},{"x":205,"y":105,"value":48},{"x":215,"y":105,"value":42},{"x":225,"y":105,"value":42},{"x":235,"y":105,"value":42},{"x":245,"y":105,"value":42},{"x":255,"y":105,"value":36},{"x":265,"y":105,"value":30},{"x":275,"y":105,"value":6},{"x":285,"y":105,"value":6},{"x":295,"y":105,"value":6},{"x":305,"y":105,"value":6},{"x":315,"y":105,"value":0},{"x":325,"y":105,"value":0},{"x":335,"y":105,"value":6},{"x":345,"y":105,"value":6},{"x":355,"y":105,"value":6},{"x":365,"y":105,"value":6},{"x":375,"y":105,"value":6},{"x":385,"y":105,"value":6},{"x":395,"y":105,"value":6},{"x":405,"y":105,"value":6},{"x":415,"y":105,"value":0},{"x":425,"y":105,"value":0},{"x":435,"y":105,"value":0},{"x":445,"y":105,"value":0},{"x":455,"y":105,"value":0},{"x":465,"y":105,"value":0},{"x":475,"y":105,"value":6},{"x":485,"y":105,"value":6},{"x":495,"y":105,"value":6},{"x":505,"y":105,"value":6},{"x":515,"y":105,"value":12},{"x":525,"y":105,"value":12},{"x":535,"y":105,"value":6},{"x":545,"y":105,"value":12},{"x":555,"y":105,"value":12},{"x":565,"y":105,"value":12},{"x":575,"y":105,"value":12},{"x":585,"y":105,"value":6},{"x":595,"y":105,"value":0},{"x":605,"y":105,"value":6},{"x":615,"y":105,"value":6},{"x":625,"y":105,"value":6},{"x":635,"y":105,"value":6},{"x":5,"y":115,"value":6},{"x":15,"y":115,"value":12},{"x":25,"y":115,"value":12},{"x":35,"y":115,"value":18},{"x":45,"y":115,"value":24},{"x":55,"y":115,"value":24},{"x":65,"y":115,"value":24},{"x":75,"y":115,"value":24},{"x":85,"y":115,"value":24},{"x":95,"y":115,"value":24},{"x":105,"y":115,"value":36},{"x":115,"y":115,"value":36},{"x":125,"y":115,"value":24},{"x":135,"y":115,"value":24},{"x":145,"y":115,"value":24},{"x":155,"y":115,"value":24},{"x":165,"y":115,"value":24},{"x":175,"y":115,"value":24},{"x":185,"y":115,"value":30},{"x":195,"y":115,"value":60},{"x":205,"y":115,"value":66},{"x":215,"y":115,"value":42},{"x":225,"y":115,"value":42},{"x":235,"y":115,"value":42},{"x":245,"y":115,"value":42},{"x":255,"y":115,"value":36},{"x":265,"y":115,"value":30},{"x":275,"y":115,"value":6},{"x":285,"y":115,"value":6},{"x":295,"y":115,"value":6},{"x":305,"y":115,"value":6},{"x":315,"y":115,"value":0},{"x":325,"y":115,"value":0},{"x":335,"y":115,"value":6},{"x":345,"y":115,"value":6},{"x":355,"y":115,"value":6},{"x":365,"y":115,"value":6},{"x":375,"y":115,"value":6},{"x":385,"y":115,"value":6},{"x":395,"y":115,"value":6},{"x":405,"y":115,"value":6},{"x":415,"y":115,"value":0},{"x":425,"y":115,"value":0},{"x":435,"y":115,"value":0},{"x":445,"y":115,"value":0},{"x":455,"y":115,"value":0},{"x":465,"y":115,"value":0},{"x":475,"y":115,"value":6},{"x":485,"y":115,"value":6},{"x":495,"y":115,"value":6},{"x":505,"y":115,"value":6},{"x":515,"y":115,"value":6},{"x":525,"y":115,"value":6},{"x":535,"y":115,"value":0},{"x":545,"y":115,"value":6},{"x":555,"y":115,"value":6},{"x":565,"y":115,"value":6},{"x":575,"y":115,"value":6},{"x":585,"y":115,"value":6},{"x":595,"y":115,"value":0},{"x":605,"y":115,"value":6},{"x":615,"y":115,"value":6},{"x":625,"y":115,"value":6},{"x":635,"y":115,"value":6},{"x":5,"y":125,"value":6},{"x":15,"y":125,"value":12},{"x":25,"y":125,"value":12},{"x":35,"y":125,"value":18},{"x":45,"y":125,"value":24},{"x":55,"y":125,"value":24},{"x":65,"y":125,"value":24},{"x":75,"y":125,"value":24},{"x":85,"y":125,"value":24},{"x":95,"y":125,"value":24},{"x":105,"y":125,"value":36},{"x":115,"y":125,"value":42},{"x":125,"y":125,"value":30},{"x":135,"y":125,"value":30},{"x":145,"y":125,"value":30},{"x":155,"y":125,"value":30},{"x":165,"y":125,"value":30},{"x":175,"y":125,"value":30},{"x":185,"y":125,"value":36},{"x":195,"y":125,"value":66},{"x":205,"y":125,"value":72},{"x":215,"y":125,"value":42},{"x":225,"y":125,"value":42},{"x":235,"y":125,"value":42},{"x":245,"y":125,"value":42},{"x":255,"y":125,"value":36},{"x":265,"y":125,"value":30},{"x":275,"y":125,"value":6},{"x":285,"y":125,"value":6},{"x":295,"y":125,"value":6},{"x":305,"y":125,"value":6},{"x":315,"y":125,"value":0},{"x":325,"y":125,"value":0},{"x":335,"y":125,"value":6},{"x":345,"y":125,"value":12},{"x":355,"y":125,"value":12},{"x":365,"y":125,"value":12},{"x":375,"y":125,"value":12},{"x":385,"y":125,"value":12},{"x":395,"y":125,"value":12},{"x":405,"y":125,"value":12},{"x":415,"y":125,"value":6},{"x":425,"y":125,"value":6},{"x":435,"y":125,"value":6},{"x":445,"y":125,"value":6},{"x":455,"y":125,"value":6},{"x":465,"y":125,"value":6},{"x":475,"y":125,"value":12},{"x":485,"y":125,"value":12},{"x":495,"y":125,"value":6},{"x":505,"y":125,"value":6},{"x":515,"y":125,"value":6},{"x":525,"y":125,"value":6},{"x":535,"y":125,"value":0},{"x":545,"y":125,"value":6},{"x":555,"y":125,"value":6},{"x":565,"y":125,"value":6},{"x":575,"y":125,"value":6},{"x":585,"y":125,"value":6},{"x":595,"y":125,"value":0},{"x":605,"y":125,"value":6},{"x":615,"y":125,"value":6},{"x":625,"y":125,"value":6},{"x":635,"y":125,"value":6},{"x":5,"y":135,"value":6},{"x":15,"y":135,"value":12},{"x":25,"y":135,"value":12},{"x":35,"y":135,"value":18},{"x":45,"y":135,"value":24},{"x":55,"y":135,"value":24},{"x":65,"y":135,"value":24},{"x":75,"y":135,"value":24},{"x":85,"y":135,"value":24},{"x":95,"y":135,"value":24},{"x":105,"y":135,"value":36},{"x":115,"y":135,"value":42},{"x":125,"y":135,"value":30},{"x":135,"y":135,"value":30},{"x":145,"y":135,"value":30},{"x":155,"y":135,"value":30},{"x":165,"y":135,"value":30},{"x":175,"y":135,"value":30},{"x":185,"y":135,"value":36},{"x":195,"y":135,"value":66},{"x":205,"y":135,"value":90},{"x":215,"y":135,"value":60},{"x":225,"y":135,"value":60},{"x":235,"y":135,"value":60},{"x":245,"y":135,"value":60},{"x":255,"y":135,"value":54},{"x":265,"y":135,"value":48},{"x":275,"y":135,"value":24},{"x":285,"y":135,"value":24},{"x":295,"y":135,"value":24},{"x":305,"y":135,"value":24},{"x":315,"y":135,"value":0},{"x":325,"y":135,"value":0},{"x":335,"y":135,"value":6},{"x":345,"y":135,"value":12},{"x":355,"y":135,"value":12},{"x":365,"y":135,"value":12},{"x":375,"y":135,"value":12},{"x":385,"y":135,"value":12},{"x":395,"y":135,"value":12},{"x":405,"y":135,"value":12},{"x":415,"y":135,"value":6},{"x":425,"y":135,"value":6},{"x":435,"y":135,"value":6},{"x":445,"y":135,"value":6},{"x":455,"y":135,"value":6},{"x":465,"y":135,"value":6},{"x":475,"y":135,"value":12},{"x":485,"y":135,"value":12},{"x":495,"y":135,"value":6},{"x":505,"y":135,"value":6},{"x":515,"y":135,"value":6},{"x":525,"y":135,"value":6},{"x":535,"y":135,"value":0},{"x":545,"y":135,"value":6},{"x":555,"y":135,"value":6},{"x":565,"y":135,"value":6},{"x":575,"y":135,"value":6},{"x":585,"y":135,"value":6},{"x":595,"y":135,"value":0},{"x":605,"y":135,"value":6},{"x":615,"y":135,"value":6},{"x":625,"y":135,"value":6},{"x":635,"y":135,"value":6},{"x":5,"y":145,"value":6},{"x":15,"y":145,"value":12},{"x":25,"y":145,"value":12},{"x":35,"y":145,"value":18},{"x":45,"y":145,"value":24},{"x":55,"y":145,"value":24},{"x":65,"y":145,"value":24},{"x":75,"y":145,"value":24},{"x":85,"y":145,"value":24},{"x":95,"y":145,"value":24},{"x":105,"y":145,"value":36},{"x":115,"y":145,"value":42},{"x":125,"y":145,"value":30},{"x":135,"y":145,"value":30},{"x":145,"y":145,"value":30},{"x":155,"y":145,"value":30},{"x":165,"y":145,"value":30},{"x":175,"y":145,"value":30},{"x":185,"y":145,"value":36},{"x":195,"y":145,"value":60},{"x":205,"y":145,"value":90},{"x":215,"y":145,"value":60},{"x":225,"y":145,"value":60},{"x":235,"y":145,"value":60},{"x":245,"y":145,"value":60},{"x":255,"y":145,"value":54},{"x":265,"y":145,"value":54},{"x":275,"y":145,"value":30},{"x":285,"y":145,"value":30},{"x":295,"y":145,"value":30},{"x":305,"y":145,"value":30},{"x":315,"y":145,"value":0},{"x":325,"y":145,"value":0},{"x":335,"y":145,"value":6},{"x":345,"y":145,"value":12},{"x":355,"y":145,"value":12},{"x":365,"y":145,"value":12},{"x":375,"y":145,"value":12},{"x":385,"y":145,"value":12},{"x":395,"y":145,"value":12},{"x":405,"y":145,"value":12},{"x":415,"y":145,"value":6},{"x":425,"y":145,"value":6},{"x":435,"y":145,"value":6},{"x":445,"y":145,"value":6},{"x":455,"y":145,"value":6},{"x":465,"y":145,"value":6},{"x":475,"y":145,"value":12},{"x":485,"y":145,"value":12},{"x":495,"y":145,"value":6},{"x":505,"y":145,"value":6},{"x":515,"y":145,"value":6},{"x":525,"y":145,"value":6},{"x":535,"y":145,"value":0},{"x":545,"y":145,"value":6},{"x":555,"y":145,"value":6},{"x":565,"y":145,"value":6},{"x":575,"y":145,"value":6},{"x":585,"y":145,"value":6},{"x":595,"y":145,"value":0},{"x":605,"y":145,"value":6},{"x":615,"y":145,"value":6},{"x":625,"y":145,"value":6},{"x":635,"y":145,"value":6},{"x":5,"y":155,"value":6},{"x":15,"y":155,"value":12},{"x":25,"y":155,"value":12},{"x":35,"y":155,"value":18},{"x":45,"y":155,"value":24},{"x":55,"y":155,"value":24},{"x":65,"y":155,"value":24},{"x":75,"y":155,"value":24},{"x":85,"y":155,"value":24},{"x":95,"y":155,"value":24},{"x":105,"y":155,"value":36},{"x":115,"y":155,"value":42},{"x":125,"y":155,"value":30},{"x":135,"y":155,"value":30},{"x":145,"y":155,"value":30},{"x":155,"y":155,"value":30},{"x":165,"y":155,"value":30},{"x":175,"y":155,"value":30},{"x":185,"y":155,"value":36},{"x":195,"y":155,"value":60},{"x":205,"y":155,"value":90},{"x":215,"y":155,"value":60},{"x":225,"y":155,"value":60},{"x":235,"y":155,"value":60},{"x":245,"y":155,"value":60},{"x":255,"y":155,"value":54},{"x":265,"y":155,"value":54},{"x":275,"y":155,"value":30},{"x":285,"y":155,"value":30},{"x":295,"y":155,"value":30},{"x":305,"y":155,"value":30},{"x":315,"y":155,"value":0},{"x":325,"y":155,"value":0},{"x":335,"y":155,"value":6},{"x":345,"y":155,"value":12},{"x":355,"y":155,"value":12},{"x":365,"y":155,"value":12},{"x":375,"y":155,"value":12},{"x":385,"y":155,"value":12},{"x":395,"y":155,"value":12},{"x":405,"y":155,"value":12},{"x":415,"y":155,"value":6},{"x":425,"y":155,"value":6},{"x":435,"y":155,"value":6},{"x":445,"y":155,"value":6},{"x":455,"y":155,"value":6},{"x":465,"y":155,"value":6},{"x":475,"y":155,"value":6},{"x":485,"y":155,"value":6},{"x":495,"y":155,"value":0},{"x":505,"y":155,"value":0},{"x":515,"y":155,"value":0},{"x":525,"y":155,"value":0},{"x":535,"y":155,"value":0},{"x":545,"y":155,"value":6},{"x":555,"y":155,"value":6},{"x":565,"y":155,"value":6},{"x":575,"y":155,"value":6},{"x":585,"y":155,"value":6},{"x":595,"y":155,"value":0},{"x":605,"y":155,"value":6},{"x":615,"y":155,"value":6},{"x":625,"y":155,"value":6},{"x":635,"y":155,"value":6},{"x":5,"y":165,"value":6},{"x":15,"y":165,"value":12},{"x":25,"y":165,"value":12},{"x":35,"y":165,"value":18},{"x":45,"y":165,"value":24},{"x":55,"y":165,"value":24},{"x":65,"y":165,"value":24},{"x":75,"y":165,"value":24},{"x":85,"y":165,"value":24},{"x":95,"y":165,"value":24},{"x":105,"y":165,"value":36},{"x":115,"y":165,"value":42},{"x":125,"y":165,"value":30},{"x":135,"y":165,"value":30},{"x":145,"y":165,"value":30},{"x":155,"y":165,"value":30},{"x":165,"y":165,"value":30},{"x":175,"y":165,"value":30},{"x":185,"y":165,"value":36},{"x":195,"y":165,"value":60},{"x":205,"y":165,"value":90},{"x":215,"y":165,"value":60},{"x":225,"y":165,"value":60},{"x":235,"y":165,"value":60},{"x":245,"y":165,"value":60},{"x":255,"y":165,"value":54},{"x":265,"y":165,"value":54},{"x":275,"y":165,"value":30},{"x":285,"y":165,"value":30},{"x":295,"y":165,"value":30},{"x":305,"y":165,"value":30},{"x":315,"y":165,"value":0},{"x":325,"y":165,"value":0},{"x":335,"y":165,"value":6},{"x":345,"y":165,"value":12},{"x":355,"y":165,"value":12},{"x":365,"y":165,"value":12},{"x":375,"y":165,"value":12},{"x":385,"y":165,"value":12},{"x":395,"y":165,"value":12},{"x":405,"y":165,"value":12},{"x":415,"y":165,"value":6},{"x":425,"y":165,"value":6},{"x":435,"y":165,"value":6},{"x":445,"y":165,"value":6},{"x":455,"y":165,"value":6},{"x":465,"y":165,"value":6},{"x":475,"y":165,"value":6},{"x":485,"y":165,"value":6},{"x":495,"y":165,"value":6},{"x":505,"y":165,"value":6},{"x":515,"y":165,"value":6},{"x":525,"y":165,"value":6},{"x":535,"y":165,"value":6},{"x":545,"y":165,"value":12},{"x":555,"y":165,"value":12},{"x":565,"y":165,"value":12},{"x":575,"y":165,"value":12},{"x":585,"y":165,"value":12},{"x":595,"y":165,"value":6},{"x":605,"y":165,"value":6},{"x":615,"y":165,"value":6},{"x":625,"y":165,"value":6},{"x":635,"y":165,"value":6},{"x":5,"y":175,"value":6},{"x":15,"y":175,"value":12},{"x":25,"y":175,"value":12},{"x":35,"y":175,"value":18},{"x":45,"y":175,"value":24},{"x":55,"y":175,"value":24},{"x":65,"y":175,"value":24},{"x":75,"y":175,"value":24},{"x":85,"y":175,"value":24},{"x":95,"y":175,"value":24},{"x":105,"y":175,"value":36},{"x":115,"y":175,"value":42},{"x":125,"y":175,"value":30},{"x":135,"y":175,"value":30},{"x":145,"y":175,"value":30},{"x":155,"y":175,"value":30},{"x":165,"y":175,"value":30},{"x":175,"y":175,"value":30},{"x":185,"y":175,"value":36},{"x":195,"y":175,"value":54},{"x":205,"y":175,"value":84},{"x":215,"y":175,"value":54},{"x":225,"y":175,"value":54},{"x":235,"y":175,"value":54},{"x":245,"y":175,"value":54},{"x":255,"y":175,"value":48},{"x":265,"y":175,"value":48},{"x":275,"y":175,"value":30},{"x":285,"y":175,"value":30},{"x":295,"y":175,"value":30},{"x":305,"y":175,"value":30},{"x":315,"y":175,"value":0},{"x":325,"y":175,"value":0},{"x":335,"y":175,"value":6},{"x":345,"y":175,"value":12},{"x":355,"y":175,"value":12},{"x":365,"y":175,"value":12},{"x":375,"y":175,"value":12},{"x":385,"y":175,"value":12},{"x":395,"y":175,"value":12},{"x":405,"y":175,"value":12},{"x":415,"y":175,"value":6},{"x":425,"y":175,"value":6},{"x":435,"y":175,"value":6},{"x":445,"y":175,"value":6},{"x":455,"y":175,"value":6},{"x":465,"y":175,"value":6},{"x":475,"y":175,"value":6},{"x":485,"y":175,"value":6},{"x":495,"y":175,"value":6},{"x":505,"y":175,"value":6},{"x":515,"y":175,"value":6},{"x":525,"y":175,"value":6},{"x":535,"y":175,"value":6},{"x":545,"y":175,"value":6},{"x":555,"y":175,"value":6},{"x":565,"y":175,"value":6},{"x":575,"y":175,"value":6},{"x":585,"y":175,"value":6},{"x":595,"y":175,"value":6},{"x":605,"y":175,"value":6},{"x":615,"y":175,"value":6},{"x":625,"y":175,"value":6},{"x":635,"y":175,"value":6},{"x":5,"y":185,"value":6},{"x":15,"y":185,"value":12},{"x":25,"y":185,"value":12},{"x":35,"y":185,"value":18},{"x":45,"y":185,"value":24},{"x":55,"y":185,"value":24},{"x":65,"y":185,"value":24},{"x":75,"y":185,"value":24},{"x":85,"y":185,"value":24},{"x":95,"y":185,"value":24},{"x":105,"y":185,"value":36},{"x":115,"y":185,"value":42},{"x":125,"y":185,"value":30},{"x":135,"y":185,"value":30},{"x":145,"y":185,"value":30},{"x":155,"y":185,"value":30},{"x":165,"y":185,"value":30},{"x":175,"y":185,"value":30},{"x":185,"y":185,"value":36},{"x":195,"y":185,"value":54},{"x":205,"y":185,"value":84},{"x":215,"y":185,"value":54},{"x":225,"y":185,"value":54},{"x":235,"y":185,"value":54},{"x":245,"y":185,"value":54},{"x":255,"y":185,"value":48},{"x":265,"y":185,"value":48},{"x":275,"y":185,"value":30},{"x":285,"y":185,"value":30},{"x":295,"y":185,"value":30},{"x":305,"y":185,"value":30},{"x":315,"y":185,"value":0},{"x":325,"y":185,"value":0},{"x":335,"y":185,"value":6},{"x":345,"y":185,"value":12},{"x":355,"y":185,"value":12},{"x":365,"y":185,"value":12},{"x":375,"y":185,"value":12},{"x":385,"y":185,"value":12},{"x":395,"y":185,"value":12},{"x":405,"y":185,"value":12},{"x":415,"y":185,"value":6},{"x":425,"y":185,"value":6},{"x":435,"y":185,"value":6},{"x":445,"y":185,"value":6},{"x":455,"y":185,"value":6},{"x":465,"y":185,"value":6},{"x":475,"y":185,"value":6},{"x":485,"y":185,"value":6},{"x":495,"y":185,"value":6},{"x":505,"y":185,"value":6},{"x":515,"y":185,"value":6},{"x":525,"y":185,"value":6},{"x":535,"y":185,"value":6},{"x":545,"y":185,"value":6},{"x":555,"y":185,"value":6},{"x":565,"y":185,"value":6},{"x":575,"y":185,"value":6},{"x":585,"y":185,"value":6},{"x":595,"y":185,"value":6},{"x":605,"y":185,"value":6},{"x":615,"y":185,"value":6},{"x":625,"y":185,"value":6},{"x":635,"y":185,"value":6},{"x":5,"y":195,"value":6},{"x":15,"y":195,"value":12},{"x":25,"y":195,"value":12},{"x":35,"y":195,"value":18},{"x":45,"y":195,"value":24},{"x":55,"y":195,"value":24},{"x":65,"y":195,"value":24},{"x":75,"y":195,"value":24},{"x":85,"y":195,"value":24},{"x":95,"y":195,"value":24},{"x":105,"y":195,"value":36},{"x":115,"y":195,"value":42},{"x":125,"y":195,"value":30},{"x":135,"y":195,"value":30},{"x":145,"y":195,"value":30},{"x":155,"y":195,"value":30},{"x":165,"y":195,"value":30},{"x":175,"y":195,"value":30},{"x":185,"y":195,"value":30},{"x":195,"y":195,"value":48},{"x":205,"y":195,"value":78},{"x":215,"y":195,"value":48},{"x":225,"y":195,"value":48},{"x":235,"y":195,"value":48},{"x":245,"y":195,"value":48},{"x":255,"y":195,"value":42},{"x":265,"y":195,"value":42},{"x":275,"y":195,"value":30},{"x":285,"y":195,"value":30},{"x":295,"y":195,"value":30},{"x":305,"y":195,"value":30},{"x":315,"y":195,"value":0},{"x":325,"y":195,"value":0},{"x":335,"y":195,"value":6},{"x":345,"y":195,"value":12},{"x":355,"y":195,"value":12},{"x":365,"y":195,"value":12},{"x":375,"y":195,"value":12},{"x":385,"y":195,"value":12},{"x":395,"y":195,"value":12},{"x":405,"y":195,"value":12},{"x":415,"y":195,"value":6},{"x":425,"y":195,"value":6},{"x":435,"y":195,"value":6},{"x":445,"y":195,"value":6},{"x":455,"y":195,"value":6},{"x":465,"y":195,"value":6},{"x":475,"y":195,"value":6},{"x":485,"y":195,"value":6},{"x":495,"y":195,"value":6},{"x":505,"y":195,"value":6},{"x":515,"y":195,"value":6},{"x":525,"y":195,"value":6},{"x":535,"y":195,"value":6},{"x":545,"y":195,"value":6},{"x":555,"y":195,"value":6},{"x":565,"y":195,"value":6},{"x":575,"y":195,"value":6},{"x":585,"y":195,"value":6},{"x":595,"y":195,"value":6},{"x":605,"y":195,"value":0},{"x":615,"y":195,"value":0},{"x":625,"y":195,"value":0},{"x":635,"y":195,"value":0},{"x":5,"y":205,"value":6},{"x":15,"y":205,"value":12},{"x":25,"y":205,"value":12},{"x":35,"y":205,"value":18},{"x":45,"y":205,"value":24},{"x":55,"y":205,"value":24},{"x":65,"y":205,"value":18},{"x":75,"y":205,"value":18},{"x":85,"y":205,"value":18},{"x":95,"y":205,"value":18},{"x":105,"y":205,"value":30},{"x":115,"y":205,"value":36},{"x":125,"y":205,"value":30},{"x":135,"y":205,"value":30},{"x":145,"y":205,"value":30},{"x":155,"y":205,"value":30},{"x":165,"y":205,"value":30},{"x":175,"y":205,"value":30},{"x":185,"y":205,"value":30},{"x":195,"y":205,"value":48},{"x":205,"y":205,"value":78},{"x":215,"y":205,"value":48},{"x":225,"y":205,"value":48},{"x":235,"y":205,"value":48},{"x":245,"y":205,"value":48},{"x":255,"y":205,"value":42},{"x":265,"y":205,"value":42},{"x":275,"y":205,"value":30},{"x":285,"y":205,"value":30},{"x":295,"y":205,"value":30},{"x":305,"y":205,"value":30},{"x":315,"y":205,"value":0},{"x":325,"y":205,"value":0},{"x":335,"y":205,"value":6},{"x":345,"y":205,"value":12},{"x":355,"y":205,"value":12},{"x":365,"y":205,"value":12},{"x":375,"y":205,"value":12},{"x":385,"y":205,"value":12},{"x":395,"y":205,"value":12},{"x":405,"y":205,"value":12},{"x":415,"y":205,"value":6},{"x":425,"y":205,"value":6},{"x":435,"y":205,"value":6},{"x":445,"y":205,"value":6},{"x":455,"y":205,"value":6},{"x":465,"y":205,"value":6},{"x":475,"y":205,"value":6},{"x":485,"y":205,"value":6},{"x":495,"y":205,"value":6},{"x":505,"y":205,"value":6},{"x":515,"y":205,"value":6},{"x":525,"y":205,"value":6},{"x":535,"y":205,"value":6},{"x":545,"y":205,"value":6},{"x":555,"y":205,"value":6},{"x":565,"y":205,"value":6},{"x":575,"y":205,"value":6},{"x":585,"y":205,"value":6},{"x":595,"y":205,"value":6},{"x":605,"y":205,"value":0},{"x":615,"y":205,"value":0},{"x":625,"y":205,"value":0},{"x":635,"y":205,"value":0},{"x":5,"y":215,"value":6},{"x":15,"y":215,"value":12},{"x":25,"y":215,"value":12},{"x":35,"y":215,"value":18},{"x":45,"y":215,"value":24},{"x":55,"y":215,"value":24},{"x":65,"y":215,"value":18},{"x":75,"y":215,"value":18},{"x":85,"y":215,"value":18},{"x":95,"y":215,"value":18},{"x":105,"y":215,"value":30},{"x":115,"y":215,"value":36},{"x":125,"y":215,"value":30},{"x":135,"y":215,"value":30},{"x":145,"y":215,"value":30},{"x":155,"y":215,"value":30},{"x":165,"y":215,"value":30},{"x":175,"y":215,"value":30},{"x":185,"y":215,"value":30},{"x":195,"y":215,"value":30},{"x":205,"y":215,"value":60},{"x":215,"y":215,"value":30},{"x":225,"y":215,"value":30},{"x":235,"y":215,"value":30},{"x":245,"y":215,"value":30},{"x":255,"y":215,"value":30},{"x":265,"y":215,"value":30},{"x":275,"y":215,"value":30},{"x":285,"y":215,"value":30},{"x":295,"y":215,"value":30},{"x":305,"y":215,"value":30},{"x":315,"y":215,"value":0},{"x":325,"y":215,"value":0},{"x":335,"y":215,"value":6},{"x":345,"y":215,"value":12},{"x":355,"y":215,"value":12},{"x":365,"y":215,"value":12},{"x":375,"y":215,"value":12},{"x":385,"y":215,"value":12},{"x":395,"y":215,"value":12},{"x":405,"y":215,"value":12},{"x":415,"y":215,"value":6},{"x":425,"y":215,"value":6},{"x":435,"y":215,"value":6},{"x":445,"y":215,"value":6},{"x":455,"y":215,"value":6},{"x":465,"y":215,"value":6},{"x":475,"y":215,"value":6},{"x":485,"y":215,"value":6},{"x":495,"y":215,"value":6},{"x":505,"y":215,"value":6},{"x":515,"y":215,"value":6},{"x":525,"y":215,"value":6},{"x":535,"y":215,"value":6},{"x":545,"y":215,"value":6},{"x":555,"y":215,"value":6},{"x":565,"y":215,"value":6},{"x":575,"y":215,"value":6},{"x":585,"y":215,"value":6},{"x":595,"y":215,"value":6},{"x":605,"y":215,"value":0},{"x":615,"y":215,"value":0},{"x":625,"y":215,"value":0},{"x":635,"y":215,"value":0},{"x":5,"y":225,"value":6},{"x":15,"y":225,"value":12},{"x":25,"y":225,"value":12},{"x":35,"y":225,"value":18},{"x":45,"y":225,"value":24},{"x":55,"y":225,"value":24},{"x":65,"y":225,"value":18},{"x":75,"y":225,"value":18},{"x":85,"y":225,"value":18},{"x":95,"y":225,"value":18},{"x":105,"y":225,"value":30},{"x":115,"y":225,"value":36},{"x":125,"y":225,"value":30},{"x":135,"y":225,"value":30},{"x":145,"y":225,"value":30},{"x":155,"y":225,"value":30},{"x":165,"y":225,"value":30},{"x":175,"y":225,"value":30},{"x":185,"y":225,"value":30},{"x":195,"y":225,"value":30},{"x":205,"y":225,"value":60},{"x":215,"y":225,"value":30},{"x":225,"y":225,"value":30},{"x":235,"y":225,"value":30},{"x":245,"y":225,"value":30},{"x":255,"y":225,"value":30},{"x":265,"y":225,"value":30},{"x":275,"y":225,"value":30},{"x":285,"y":225,"value":30},{"x":295,"y":225,"value":30},{"x":305,"y":225,"value":30},{"x":315,"y":225,"value":0},{"x":325,"y":225,"value":0},{"x":335,"y":225,"value":6},{"x":345,"y":225,"value":12},{"x":355,"y":225,"value":12},{"x":365,"y":225,"value":12},{"x":375,"y":225,"value":12},{"x":385,"y":225,"value":12},{"x":395,"y":225,"value":12},{"x":405,"y":225,"value":12},{"x":415,"y":225,"value":6},{"x":425,"y":225,"value":6},{"x":435,"y":225,"value":6},{"x":445,"y":225,"value":6},{"x":455,"y":225,"value":6},{"x":465,"y":225,"value":6},{"x":475,"y":225,"value":6},{"x":485,"y":225,"value":6},{"x":495,"y":225,"value":6},{"x":505,"y":225,"value":6},{"x":515,"y":225,"value":6},{"x":525,"y":225,"value":6},{"x":535,"y":225,"value":6},{"x":545,"y":225,"value":6},{"x":555,"y":225,"value":6},{"x":565,"y":225,"value":6},{"x":575,"y":225,"value":6},{"x":585,"y":225,"value":6},{"x":595,"y":225,"value":6},{"x":605,"y":225,"value":0},{"x":615,"y":225,"value":0},{"x":625,"y":225,"value":0},{"x":635,"y":225,"value":0},{"x":5,"y":235,"value":6},{"x":15,"y":235,"value":12},{"x":25,"y":235,"value":12},{"x":35,"y":235,"value":18},{"x":45,"y":235,"value":24},{"x":55,"y":235,"value":24},{"x":65,"y":235,"value":18},{"x":75,"y":235,"value":18},{"x":85,"y":235,"value":18},{"x":95,"y":235,"value":18},{"x":105,"y":235,"value":30},{"x":115,"y":235,"value":36},{"x":125,"y":235,"value":30},{"x":135,"y":235,"value":30},{"x":145,"y":235,"value":30},{"x":155,"y":235,"value":30},{"x":165,"y":235,"value":30},{"x":175,"y":235,"value":30},{"x":185,"y":235,"value":30},{"x":195,"y":235,"value":30},{"x":205,"y":235,"value":60},{"x":215,"y":235,"value":30},{"x":225,"y":235,"value":30},{"x":235,"y":235,"value":30},{"x":245,"y":235,"value":30},{"x":255,"y":235,"value":30},{"x":265,"y":235,"value":30},{"x":275,"y":235,"value":30},{"x":285,"y":235,"value":30},{"x":295,"y":235,"value":30},{"x":305,"y":235,"value":30},{"x":315,"y":235,"value":0},{"x":325,"y":235,"value":0},{"x":335,"y":235,"value":6},{"x":345,"y":235,"value":12},{"x":355,"y":235,"value":12},{"x":365,"y":235,"value":12},{"x":375,"y":235,"value":12},{"x":385,"y":235,"value":12},{"x":395,"y":235,"value":12},{"x":405,"y":235,"value":12},{"x":415,"y":235,"value":6},{"x":425,"y":235,"value":6},{"x":435,"y":235,"value":6},{"x":445,"y":235,"value":6},{"x":455,"y":235,"value":6},{"x":465,"y":235,"value":6},{"x":475,"y":235,"value":6},{"x":485,"y":235,"value":6},{"x":495,"y":235,"value":6},{"x":505,"y":235,"value":6},{"x":515,"y":235,"value":6},{"x":525,"y":235,"value":6},{"x":535,"y":235,"value":6},{"x":545,"y":235,"value":6},{"x":555,"y":235,"value":6},{"x":565,"y":235,"value":6},{"x":575,"y":235,"value":6},{"x":585,"y":235,"value":6},{"x":595,"y":235,"value":6},{"x":605,"y":235,"value":0},{"x":615,"y":235,"value":0},{"x":625,"y":235,"value":0},{"x":635,"y":235,"value":0},{"x":5,"y":245,"value":6},{"x":15,"y":245,"value":12},{"x":25,"y":245,"value":12},{"x":35,"y":245,"value":18},{"x":45,"y":245,"value":18},{"x":55,"y":245,"value":18},{"x":65,"y":245,"value":12},{"x":75,"y":245,"value":12},{"x":85,"y":245,"value":12},{"x":95,"y":245,"value":12},{"x":105,"y":245,"value":24},{"x":115,"y":245,"value":30},{"x":125,"y":245,"value":30},{"x":135,"y":245,"value":30},{"x":145,"y":245,"value":30},{"x":155,"y":245,"value":30},{"x":165,"y":245,"value":30},{"x":175,"y":245,"value":30},{"x":185,"y":245,"value":30},{"x":195,"y":245,"value":30},{"x":205,"y":245,"value":60},{"x":215,"y":245,"value":30},{"x":225,"y":245,"value":30},{"x":235,"y":245,"value":30},{"x":245,"y":245,"value":30},{"x":255,"y":245,"value":30},{"x":265,"y":245,"value":30},{"x":275,"y":245,"value":30},{"x":285,"y":245,"value":30},{"x":295,"y":245,"value":30},{"x":305,"y":245,"value":30},{"x":315,"y":245,"value":0},{"x":325,"y":245,"value":0},{"x":335,"y":245,"value":0},{"x":345,"y":245,"value":6},{"x":355,"y":245,"value":6},{"x":365,"y":245,"value":6},{"x":375,"y":245,"value":6},{"x":385,"y":245,"value":6},{"x":395,"y":245,"value":6},{"x":405,"y":245,"value":6},{"x":415,"y":245,"value":6},{"x":425,"y":245,"value":6},{"x":435,"y":245,"value":6},{"x":445,"y":245,"value":6},{"x":455,"y":245,"value":6},{"x":465,"y":245,"value":6},{"x":475,"y":245,"value":6},{"x":485,"y":245,"value":6},{"x":495,"y":245,"value":6},{"x":505,"y":245,"value":6},{"x":515,"y":245,"value":6},{"x":525,"y":245,"value":6},{"x":535,"y":245,"value":6},{"x":545,"y":245,"value":6},{"x":555,"y":245,"value":6},{"x":565,"y":245,"value":6},{"x":575,"y":245,"value":6},{"x":585,"y":245,"value":6},{"x":595,"y":245,"value":6},{"x":605,"y":245,"value":0},{"x":615,"y":245,"value":0},{"x":625,"y":245,"value":0},{"x":635,"y":245,"value":0},{"x":5,"y":255,"value":6},{"x":15,"y":255,"value":12},{"x":25,"y":255,"value":12},{"x":35,"y":255,"value":18},{"x":45,"y":255,"value":18},{"x":55,"y":255,"value":18},{"x":65,"y":255,"value":12},{"x":75,"y":255,"value":12},{"x":85,"y":255,"value":12},{"x":95,"y":255,"value":12},{"x":105,"y":255,"value":24},{"x":115,"y":255,"value":30},{"x":125,"y":255,"value":30},{"x":135,"y":255,"value":30},{"x":145,"y":255,"value":30},{"x":155,"y":255,"value":30},{"x":165,"y":255,"value":30},{"x":175,"y":255,"value":30},{"x":185,"y":255,"value":30},{"x":195,"y":255,"value":30},{"x":205,"y":255,"value":60},{"x":215,"y":255,"value":30},{"x":225,"y":255,"value":30},{"x":235,"y":255,"value":30},{"x":245,"y":255,"value":30},{"x":255,"y":255,"value":30},{"x":265,"y":255,"value":30},{"x":275,"y":255,"value":30},{"x":285,"y":255,"value":30},{"x":295,"y":255,"value":30},{"x":305,"y":255,"value":30},{"x":315,"y":255,"value":0},{"x":325,"y":255,"value":0},{"x":335,"y":255,"value":0},{"x":345,"y":255,"value":6},{"x":355,"y":255,"value":6},{"x":365,"y":255,"value":6},{"x":375,"y":255,"value":6},{"x":385,"y":255,"value":6},{"x":395,"y":255,"value":6},{"x":405,"y":255,"value":6},{"x":415,"y":255,"value":6},{"x":425,"y":255,"value":6},{"x":435,"y":255,"value":6},{"x":445,"y":255,"value":6},{"x":455,"y":255,"value":6},{"x":465,"y":255,"value":6},{"x":475,"y":255,"value":6},{"x":485,"y":255,"value":6},{"x":495,"y":255,"value":6},{"x":505,"y":255,"value":6},{"x":515,"y":255,"value":6},{"x":525,"y":255,"value":6},{"x":535,"y":255,"value":6},{"x":545,"y":255,"value":6},{"x":555,"y":255,"value":6},{"x":565,"y":255,"value":6},{"x":575,"y":255,"value":6},{"x":585,"y":255,"value":6},{"x":595,"y":255,"value":6},{"x":605,"y":255,"value":0},{"x":615,"y":255,"value":0},{"x":625,"y":255,"value":0},{"x":635,"y":255,"value":0},{"x":5,"y":265,"value":6},{"x":15,"y":265,"value":12},{"x":25,"y":265,"value":12},{"x":35,"y":265,"value":18},{"x":45,"y":265,"value":18},{"x":55,"y":265,"value":18},{"x":65,"y":265,"value":12},{"x":75,"y":265,"value":12},{"x":85,"y":265,"value":12},{"x":95,"y":265,"value":12},{"x":105,"y":265,"value":24},{"x":115,"y":265,"value":30},{"x":125,"y":265,"value":30},{"x":135,"y":265,"value":30},{"x":145,"y":265,"value":30},{"x":155,"y":265,"value":30},{"x":165,"y":265,"value":30},{"x":175,"y":265,"value":30},{"x":185,"y":265,"value":30},{"x":195,"y":265,"value":30},{"x":205,"y":265,"value":60},{"x":215,"y":265,"value":30},{"x":225,"y":265,"value":30},{"x":235,"y":265,"value":30},{"x":245,"y":265,"value":30},{"x":255,"y":265,"value":30},{"x":265,"y":265,"value":30},{"x":275,"y":265,"value":30},{"x":285,"y":265,"value":30},{"x":295,"y":265,"value":30},{"x":305,"y":265,"value":30},{"x":315,"y":265,"value":0},{"x":325,"y":265,"value":0},{"x":335,"y":265,"value":0},{"x":345,"y":265,"value":6},{"x":355,"y":265,"value":6},{"x":365,"y":265,"value":6},{"x":375,"y":265,"value":6},{"x":385,"y":265,"value":6},{"x":395,"y":265,"value":6},{"x":405,"y":265,"value":6},{"x":415,"y":265,"value":6},{"x":425,"y":265,"value":6},{"x":435,"y":265,"value":6},{"x":445,"y":265,"value":6},{"x":455,"y":265,"value":6},{"x":465,"y":265,"value":6},{"x":475,"y":265,"value":6},{"x":485,"y":265,"value":6},{"x":495,"y":265,"value":6},{"x":505,"y":265,"value":6},{"x":515,"y":265,"value":6},{"x":525,"y":265,"value":6},{"x":535,"y":265,"value":6},{"x":545,"y":265,"value":6},{"x":555,"y":265,"value":6},{"x":565,"y":265,"value":6},{"x":575,"y":265,"value":6},{"x":585,"y":265,"value":6},{"x":595,"y":265,"value":6},{"x":605,"y":265,"value":0},{"x":615,"y":265,"value":0},{"x":625,"y":265,"value":0},{"x":635,"y":265,"value":0},{"x":5,"y":275,"value":6},{"x":15,"y":275,"value":12},{"x":25,"y":275,"value":12},{"x":35,"y":275,"value":12},{"x":45,"y":275,"value":12},{"x":55,"y":275,"value":12},{"x":65,"y":275,"value":6},{"x":75,"y":275,"value":6},{"x":85,"y":275,"value":6},{"x":95,"y":275,"value":12},{"x":105,"y":275,"value":24},{"x":115,"y":275,"value":30},{"x":125,"y":275,"value":30},{"x":135,"y":275,"value":30},{"x":145,"y":275,"value":30},{"x":155,"y":275,"value":30},{"x":165,"y":275,"value":30},{"x":175,"y":275,"value":30},{"x":185,"y":275,"value":30},{"x":195,"y":275,"value":30},{"x":205,"y":275,"value":60},{"x":215,"y":275,"value":30},{"x":225,"y":275,"value":30},{"x":235,"y":275,"value":30},{"x":245,"y":275,"value":30},{"x":255,"y":275,"value":30},{"x":265,"y":275,"value":30},{"x":275,"y":275,"value":30},{"x":285,"y":275,"value":30},{"x":295,"y":275,"value":30},{"x":305,"y":275,"value":30},{"x":315,"y":275,"value":0},{"x":325,"y":275,"value":0},{"x":335,"y":275,"value":0},{"x":345,"y":275,"value":6},{"x":355,"y":275,"value":6},{"x":365,"y":275,"value":6},{"x":375,"y":275,"value":6},{"x":385,"y":275,"value":6},{"x":395,"y":275,"value":6},{"x":405,"y":275,"value":6},{"x":415,"y":275,"value":6},{"x":425,"y":275,"value":6},{"x":435,"y":275,"value":6},{"x":445,"y":275,"value":6},{"x":455,"y":275,"value":6},{"x":465,"y":275,"value":6},{"x":475,"y":275,"value":6},{"x":485,"y":275,"value":6},{"x":495,"y":275,"value":6},{"x":505,"y":275,"value":6},{"x":515,"y":275,"value":6},{"x":525,"y":275,"value":6},{"x":535,"y":275,"value":6},{"x":545,"y":275,"value":6},{"x":555,"y":275,"value":6},{"x":565,"y":275,"value":6},{"x":575,"y":275,"value":6},{"x":585,"y":275,"value":6},{"x":595,"y":275,"value":6},{"x":605,"y":275,"value":0},{"x":615,"y":275,"value":0},{"x":625,"y":275,"value":0},{"x":635,"y":275,"value":0},{"x":5,"y":285,"value":6},{"x":15,"y":285,"value":6},{"x":25,"y":285,"value":6},{"x":35,"y":285,"value":6},{"x":45,"y":285,"value":6},{"x":55,"y":285,"value":6},{"x":65,"y":285,"value":0},{"x":75,"y":285,"value":0},{"x":85,"y":285,"value":0},{"x":95,"y":285,"value":6},{"x":105,"y":285,"value":18},{"x":115,"y":285,"value":30},{"x":125,"y":285,"value":30},{"x":135,"y":285,"value":30},{"x":145,"y":285,"value":30},{"x":155,"y":285,"value":30},{"x":165,"y":285,"value":30},{"x":175,"y":285,"value":30},{"x":185,"y":285,"value":30},{"x":195,"y":285,"value":30},{"x":205,"y":285,"value":60},{"x":215,"y":285,"value":30},{"x":225,"y":285,"value":30},{"x":235,"y":285,"value":30},{"x":245,"y":285,"value":30},{"x":255,"y":285,"value":30},{"x":265,"y":285,"value":30},{"x":275,"y":285,"value":30},{"x":285,"y":285,"value":30},{"x":295,"y":285,"value":30},{"x":305,"y":285,"value":30},{"x":315,"y":285,"value":0},{"x":325,"y":285,"value":0},{"x":335,"y":285,"value":0},{"x":345,"y":285,"value":6},{"x":355,"y":285,"value":6},{"x":365,"y":285,"value":6},{"x":375,"y":285,"value":6},{"x":385,"y":285,"value":6},{"x":395,"y":285,"value":6},{"x":405,"y":285,"value":6},{"x":415,"y":285,"value":6},{"x":425,"y":285,"value":6},{"x":435,"y":285,"value":6},{"x":445,"y":285,"value":6},{"x":455,"y":285,"value":6},{"x":465,"y":285,"value":6},{"x":475,"y":285,"value":6},{"x":485,"y":285,"value":6},{"x":495,"y":285,"value":6},{"x":505,"y":285,"value":6},{"x":515,"y":285,"value":6},{"x":525,"y":285,"value":6},{"x":535,"y":285,"value":6},{"x":545,"y":285,"value":6},{"x":555,"y":285,"value":6},{"x":565,"y":285,"value":6},{"x":575,"y":285,"value":6},{"x":585,"y":285,"value":6},{"x":595,"y":285,"value":6},{"x":605,"y":285,"value":0},{"x":615,"y":285,"value":0},{"x":625,"y":285,"value":0},{"x":635,"y":285,"value":0},{"x":5,"y":295,"value":6},{"x":15,"y":295,"value":6},{"x":25,"y":295,"value":6},{"x":35,"y":295,"value":6},{"x":45,"y":295,"value":6},{"x":55,"y":295,"value":6},{"x":65,"y":295,"value":0},{"x":75,"y":295,"value":0},{"x":85,"y":295,"value":0},{"x":95,"y":295,"value":6},{"x":105,"y":295,"value":18},{"x":115,"y":295,"value":30},{"x":125,"y":295,"value":30},{"x":135,"y":295,"value":30},{"x":145,"y":295,"value":30},{"x":155,"y":295,"value":30},{"x":165,"y":295,"value":30},{"x":175,"y":295,"value":30},{"x":185,"y":295,"value":30},{"x":195,"y":295,"value":30},{"x":205,"y":295,"value":60},{"x":215,"y":295,"value":30},{"x":225,"y":295,"value":30},{"x":235,"y":295,"value":30},{"x":245,"y":295,"value":30},{"x":255,"y":295,"value":30},{"x":265,"y":295,"value":30},{"x":275,"y":295,"value":30},{"x":285,"y":295,"value":30},{"x":295,"y":295,"value":30},{"x":305,"y":295,"value":30},{"x":315,"y":295,"value":0},{"x":325,"y":295,"value":0},{"x":335,"y":295,"value":0},{"x":345,"y":295,"value":6},{"x":355,"y":295,"value":6},{"x":365,"y":295,"value":6},{"x":375,"y":295,"value":6},{"x":385,"y":295,"value":6},{"x":395,"y":295,"value":6},{"x":405,"y":295,"value":6},{"x":415,"y":295,"value":6},{"x":425,"y":295,"value":6},{"x":435,"y":295,"value":6},{"x":445,"y":295,"value":6},{"x":455,"y":295,"value":6},{"x":465,"y":295,"value":6},{"x":475,"y":295,"value":6},{"x":485,"y":295,"value":6},{"x":495,"y":295,"value":6},{"x":505,"y":295,"value":6},{"x":515,"y":295,"value":6},{"x":525,"y":295,"value":6},{"x":535,"y":295,"value":6},{"x":545,"y":295,"value":6},{"x":555,"y":295,"value":6},{"x":565,"y":295,"value":6},{"x":575,"y":295,"value":6},{"x":585,"y":295,"value":6},{"x":595,"y":295,"value":6},{"x":605,"y":295,"value":0},{"x":615,"y":295,"value":0},{"x":625,"y":295,"value":0},{"x":635,"y":295,"value":0},{"x":5,"y":305,"value":0},{"x":15,"y":305,"value":0},{"x":25,"y":305,"value":0},{"x":35,"y":305,"value":0},{"x":45,"y":305,"value":0},{"x":55,"y":305,"value":0},{"x":65,"y":305,"value":0},{"x":75,"y":305,"value":0},{"x":85,"y":305,"value":0},{"x":95,"y":305,"value":6},{"x":105,"y":305,"value":18},{"x":115,"y":305,"value":30},{"x":125,"y":305,"value":30},{"x":135,"y":305,"value":30},{"x":145,"y":305,"value":30},{"x":155,"y":305,"value":30},{"x":165,"y":305,"value":30},{"x":175,"y":305,"value":30},{"x":185,"y":305,"value":30},{"x":195,"y":305,"value":30},{"x":205,"y":305,"value":60},{"x":215,"y":305,"value":30},{"x":225,"y":305,"value":30},{"x":235,"y":305,"value":30},{"x":245,"y":305,"value":30},{"x":255,"y":305,"value":30},{"x":265,"y":305,"value":30},{"x":275,"y":305,"value":30},{"x":285,"y":305,"value":30},{"x":295,"y":305,"value":30},{"x":305,"y":305,"value":30},{"x":315,"y":305,"value":0},{"x":325,"y":305,"value":0},{"x":335,"y":305,"value":0},{"x":345,"y":305,"value":6},{"x":355,"y":305,"value":6},{"x":365,"y":305,"value":6},{"x":375,"y":305,"value":6},{"x":385,"y":305,"value":6},{"x":395,"y":305,"value":6},{"x":405,"y":305,"value":6},{"x":415,"y":305,"value":6},{"x":425,"y":305,"value":6},{"x":435,"y":305,"value":6},{"x":445,"y":305,"value":6},{"x":455,"y":305,"value":6},{"x":465,"y":305,"value":6},{"x":475,"y":305,"value":6},{"x":485,"y":305,"value":6},{"x":495,"y":305,"value":6},{"x":505,"y":305,"value":6},{"x":515,"y":305,"value":6},{"x":525,"y":305,"value":6},{"x":535,"y":305,"value":6},{"x":545,"y":305,"value":6},{"x":555,"y":305,"value":6},{"x":565,"y":305,"value":6},{"x":575,"y":305,"value":6},{"x":585,"y":305,"value":6},{"x":595,"y":305,"value":6},{"x":605,"y":305,"value":0},{"x":615,"y":305,"value":0},{"x":625,"y":305,"value":0},{"x":635,"y":305,"value":0},{"x":5,"y":315,"value":0},{"x":15,"y":315,"value":0},{"x":25,"y":315,"value":0},{"x":35,"y":315,"value":0},{"x":45,"y":315,"value":0},{"x":55,"y":315,"value":0},{"x":65,"y":315,"value":0},{"x":75,"y":315,"value":0},{"x":85,"y":315,"value":0},{"x":95,"y":315,"value":6},{"x":105,"y":315,"value":18},{"x":115,"y":315,"value":30},{"x":125,"y":315,"value":30},{"x":135,"y":315,"value":30},{"x":145,"y":315,"value":30},{"x":155,"y":315,"value":30},{"x":165,"y":315,"value":30},{"x":175,"y":315,"value":30},{"x":185,"y":315,"value":30},{"x":195,"y":315,"value":30},{"x":205,"y":315,"value":60},{"x":215,"y":315,"value":30},{"x":225,"y":315,"value":30},{"x":235,"y":315,"value":30},{"x":245,"y":315,"value":30},{"x":255,"y":315,"value":30},{"x":265,"y":315,"value":30},{"x":275,"y":315,"value":30},{"x":285,"y":315,"value":30},{"x":295,"y":315,"value":30},{"x":305,"y":315,"value":30},{"x":315,"y":315,"value":0},{"x":325,"y":315,"value":0},{"x":335,"y":315,"value":0},{"x":345,"y":315,"value":6},{"x":355,"y":315,"value":6},{"x":365,"y":315,"value":6},{"x":375,"y":315,"value":6},{"x":385,"y":315,"value":6},{"x":395,"y":315,"value":6},{"x":405,"y":315,"value":6},{"x":415,"y":315,"value":6},{"x":425,"y":315,"value":6},{"x":435,"y":315,"value":6},{"x":445,"y":315,"value":6},{"x":455,"y":315,"value":6},{"x":465,"y":315,"value":6},{"x":475,"y":315,"value":6},{"x":485,"y":315,"value":6},{"x":495,"y":315,"value":6},{"x":505,"y":315,"value":6},{"x":515,"y":315,"value":6},{"x":525,"y":315,"value":6},{"x":535,"y":315,"value":6},{"x":545,"y":315,"value":6},{"x":555,"y":315,"value":6},{"x":565,"y":315,"value":6},{"x":575,"y":315,"value":6},{"x":585,"y":315,"value":6},{"x":595,"y":315,"value":6},{"x":605,"y":315,"value":0},{"x":615,"y":315,"value":0},{"x":625,"y":315,"value":0},{"x":635,"y":315,"value":0},{"x":5,"y":325,"value":0},{"x":15,"y":325,"value":0},{"x":25,"y":325,"value":0},{"x":35,"y":325,"value":0},{"x":45,"y":325,"value":0},{"x":55,"y":325,"value":0},{"x":65,"y":325,"value":0},{"x":75,"y":325,"value":0},{"x":85,"y":325,"value":0},{"x":95,"y":325,"value":6},{"x":105,"y":325,"value":18},{"x":115,"y":325,"value":30},{"x":125,"y":325,"value":30},{"x":135,"y":325,"value":30},{"x":145,"y":325,"value":30},{"x":155,"y":325,"value":30},{"x":165,"y":325,"value":30},{"x":175,"y":325,"value":30},{"x":185,"y":325,"value":30},{"x":195,"y":325,"value":30},{"x":205,"y":325,"value":60},{"x":215,"y":325,"value":30},{"x":225,"y":325,"value":30},{"x":235,"y":325,"value":30},{"x":245,"y":325,"value":30},{"x":255,"y":325,"value":30},{"x":265,"y":325,"value":30},{"x":275,"y":325,"value":30},{"x":285,"y":325,"value":30},{"x":295,"y":325,"value":30},{"x":305,"y":325,"value":30},{"x":315,"y":325,"value":0},{"x":325,"y":325,"value":0},{"x":335,"y":325,"value":0},{"x":345,"y":325,"value":6},{"x":355,"y":325,"value":6},{"x":365,"y":325,"value":6},{"x":375,"y":325,"value":6},{"x":385,"y":325,"value":6},{"x":395,"y":325,"value":6},{"x":405,"y":325,"value":6},{"x":415,"y":325,"value":6},{"x":425,"y":325,"value":6},{"x":435,"y":325,"value":6},{"x":445,"y":325,"value":6},{"x":455,"y":325,"value":6},{"x":465,"y":325,"value":6},{"x":475,"y":325,"value":6},{"x":485,"y":325,"value":6},{"x":495,"y":325,"value":6},{"x":505,"y":325,"value":6},{"x":515,"y":325,"value":6},{"x":525,"y":325,"value":6},{"x":535,"y":325,"value":6},{"x":545,"y":325,"value":6},{"x":555,"y":325,"value":6},{"x":565,"y":325,"value":6},{"x":575,"y":325,"value":6},{"x":585,"y":325,"value":6},{"x":595,"y":325,"value":6},{"x":605,"y":325,"value":0},{"x":615,"y":325,"value":0},{"x":625,"y":325,"value":0},{"x":635,"y":325,"value":0},{"x":5,"y":335,"value":0},{"x":15,"y":335,"value":0},{"x":25,"y":335,"value":0},{"x":35,"y":335,"value":0},{"x":45,"y":335,"value":0},{"x":55,"y":335,"value":0},{"x":65,"y":335,"value":0},{"x":75,"y":335,"value":0},{"x":85,"y":335,"value":0},{"x":95,"y":335,"value":6},{"x":105,"y":335,"value":18},{"x":115,"y":335,"value":30},{"x":125,"y":335,"value":30},{"x":135,"y":335,"value":30},{"x":145,"y":335,"value":30},{"x":155,"y":335,"value":30},{"x":165,"y":335,"value":30},{"x":175,"y":335,"value":30},{"x":185,"y":335,"value":30},{"x":195,"y":335,"value":30},{"x":205,"y":335,"value":54},{"x":215,"y":335,"value":24},{"x":225,"y":335,"value":24},{"x":235,"y":335,"value":24},{"x":245,"y":335,"value":24},{"x":255,"y":335,"value":24},{"x":265,"y":335,"value":24},{"x":275,"y":335,"value":24},{"x":285,"y":335,"value":24},{"x":295,"y":335,"value":24},{"x":305,"y":335,"value":24},{"x":315,"y":335,"value":0},{"x":325,"y":335,"value":0},{"x":335,"y":335,"value":0},{"x":345,"y":335,"value":6},{"x":355,"y":335,"value":6},{"x":365,"y":335,"value":6},{"x":375,"y":335,"value":6},{"x":385,"y":335,"value":6},{"x":395,"y":335,"value":6},{"x":405,"y":335,"value":6},{"x":415,"y":335,"value":6},{"x":425,"y":335,"value":6},{"x":435,"y":335,"value":6},{"x":445,"y":335,"value":6},{"x":455,"y":335,"value":6},{"x":465,"y":335,"value":6},{"x":475,"y":335,"value":6},{"x":485,"y":335,"value":6},{"x":495,"y":335,"value":6},{"x":505,"y":335,"value":6},{"x":515,"y":335,"value":6},{"x":525,"y":335,"value":6},{"x":535,"y":335,"value":6},{"x":545,"y":335,"value":6},{"x":555,"y":335,"value":6},{"x":565,"y":335,"value":6},{"x":575,"y":335,"value":6},{"x":585,"y":335,"value":6},{"x":595,"y":335,"value":6},{"x":605,"y":335,"value":0},{"x":615,"y":335,"value":0},{"x":625,"y":335,"value":0},{"x":635,"y":335,"value":0},{"x":5,"y":345,"value":0},{"x":15,"y":345,"value":0},{"x":25,"y":345,"value":0},{"x":35,"y":345,"value":0},{"x":45,"y":345,"value":0},{"x":55,"y":345,"value":0},{"x":65,"y":345,"value":0},{"x":75,"y":345,"value":0},{"x":85,"y":345,"value":0},{"x":95,"y":345,"value":6},{"x":105,"y":345,"value":18},{"x":115,"y":345,"value":30},{"x":125,"y":345,"value":30},{"x":135,"y":345,"value":30},{"x":145,"y":345,"value":30},{"x":155,"y":345,"value":30},{"x":165,"y":345,"value":30},{"x":175,"y":345,"value":30},{"x":185,"y":345,"value":30},{"x":195,"y":345,"value":30},{"x":205,"y":345,"value":54},{"x":215,"y":345,"value":24},{"x":225,"y":345,"value":30},{"x":235,"y":345,"value":30},{"x":245,"y":345,"value":30},{"x":255,"y":345,"value":30},{"x":265,"y":345,"value":30},{"x":275,"y":345,"value":30},{"x":285,"y":345,"value":30},{"x":295,"y":345,"value":30},{"x":305,"y":345,"value":30},{"x":315,"y":345,"value":6},{"x":325,"y":345,"value":6},{"x":335,"y":345,"value":6},{"x":345,"y":345,"value":12},{"x":355,"y":345,"value":12},{"x":365,"y":345,"value":12},{"x":375,"y":345,"value":12},{"x":385,"y":345,"value":6},{"x":395,"y":345,"value":6},{"x":405,"y":345,"value":6},{"x":415,"y":345,"value":6},{"x":425,"y":345,"value":6},{"x":435,"y":345,"value":6},{"x":445,"y":345,"value":6},{"x":455,"y":345,"value":6},{"x":465,"y":345,"value":6},{"x":475,"y":345,"value":6},{"x":485,"y":345,"value":6},{"x":495,"y":345,"value":6},{"x":505,"y":345,"value":6},{"x":515,"y":345,"value":6},{"x":525,"y":345,"value":6},{"x":535,"y":345,"value":6},{"x":545,"y":345,"value":6},{"x":555,"y":345,"value":6},{"x":565,"y":345,"value":6},{"x":575,"y":345,"value":6},{"x":585,"y":345,"value":6},{"x":595,"y":345,"value":6},{"x":605,"y":345,"value":0},{"x":615,"y":345,"value":0},{"x":625,"y":345,"value":0},{"x":635,"y":345,"value":0},{"x":5,"y":355,"value":0},{"x":15,"y":355,"value":0},{"x":25,"y":355,"value":0},{"x":35,"y":355,"value":0},{"x":45,"y":355,"value":0},{"x":55,"y":355,"value":0},{"x":65,"y":355,"value":0},{"x":75,"y":355,"value":0},{"x":85,"y":355,"value":0},{"x":95,"y":355,"value":0},{"x":105,"y":355,"value":6},{"x":115,"y":355,"value":12},{"x":125,"y":355,"value":12},{"x":135,"y":355,"value":12},{"x":145,"y":355,"value":12},{"x":155,"y":355,"value":12},{"x":165,"y":355,"value":12},{"x":175,"y":355,"value":12},{"x":185,"y":355,"value":12},{"x":195,"y":355,"value":12},{"x":205,"y":355,"value":12},{"x":215,"y":355,"value":0},{"x":225,"y":355,"value":6},{"x":235,"y":355,"value":6},{"x":245,"y":355,"value":6},{"x":255,"y":355,"value":6},{"x":265,"y":355,"value":6},{"x":275,"y":355,"value":6},{"x":285,"y":355,"value":6},{"x":295,"y":355,"value":6},{"x":305,"y":355,"value":6},{"x":315,"y":355,"value":6},{"x":325,"y":355,"value":6},{"x":335,"y":355,"value":6},{"x":345,"y":355,"value":12},{"x":355,"y":355,"value":12},{"x":365,"y":355,"value":12},{"x":375,"y":355,"value":12},{"x":385,"y":355,"value":6},{"x":395,"y":355,"value":6},{"x":405,"y":355,"value":6},{"x":415,"y":355,"value":6},{"x":425,"y":355,"value":6},{"x":435,"y":355,"value":6},{"x":445,"y":355,"value":6},{"x":455,"y":355,"value":6},{"x":465,"y":355,"value":6},{"x":475,"y":355,"value":6},{"x":485,"y":355,"value":6},{"x":495,"y":355,"value":6},{"x":505,"y":355,"value":6},{"x":515,"y":355,"value":6},{"x":525,"y":355,"value":6},{"x":535,"y":355,"value":6},{"x":545,"y":355,"value":12},{"x":555,"y":355,"value":12},{"x":565,"y":355,"value":12},{"x":575,"y":355,"value":12},{"x":585,"y":355,"value":12},{"x":595,"y":355,"value":12},{"x":605,"y":355,"value":6},{"x":615,"y":355,"value":6},{"x":625,"y":355,"value":6},{"x":635,"y":355,"value":6},{"x":5,"y":365,"value":0},{"x":15,"y":365,"value":0},{"x":25,"y":365,"value":0},{"x":35,"y":365,"value":0},{"x":45,"y":365,"value":0},{"x":55,"y":365,"value":0},{"x":65,"y":365,"value":0},{"x":75,"y":365,"value":0},{"x":85,"y":365,"value":0},{"x":95,"y":365,"value":0},{"x":105,"y":365,"value":0},{"x":115,"y":365,"value":0},{"x":125,"y":365,"value":0},{"x":135,"y":365,"value":0},{"x":145,"y":365,"value":0},{"x":155,"y":365,"value":0},{"x":165,"y":365,"value":0},{"x":175,"y":365,"value":0},{"x":185,"y":365,"value":0},{"x":195,"y":365,"value":0},{"x":205,"y":365,"value":0},{"x":215,"y":365,"value":0},{"x":225,"y":365,"value":6},{"x":235,"y":365,"value":6},{"x":245,"y":365,"value":6},{"x":255,"y":365,"value":6},{"x":265,"y":365,"value":6},{"x":275,"y":365,"value":6},{"x":285,"y":365,"value":6},{"x":295,"y":365,"value":6},{"x":305,"y":365,"value":6},{"x":315,"y":365,"value":6},{"x":325,"y":365,"value":6},{"x":335,"y":365,"value":6},{"x":345,"y":365,"value":12},{"x":355,"y":365,"value":12},{"x":365,"y":365,"value":12},{"x":375,"y":365,"value":12},{"x":385,"y":365,"value":6},{"x":395,"y":365,"value":6},{"x":405,"y":365,"value":6},{"x":415,"y":365,"value":6},{"x":425,"y":365,"value":6},{"x":435,"y":365,"value":6},{"x":445,"y":365,"value":6},{"x":455,"y":365,"value":6},{"x":465,"y":365,"value":6},{"x":475,"y":365,"value":6},{"x":485,"y":365,"value":6},{"x":495,"y":365,"value":6},{"x":505,"y":365,"value":6},{"x":515,"y":365,"value":6},{"x":525,"y":365,"value":6},{"x":535,"y":365,"value":6},{"x":545,"y":365,"value":12},{"x":555,"y":365,"value":12},{"x":565,"y":365,"value":12},{"x":575,"y":365,"value":12},{"x":585,"y":365,"value":12},{"x":595,"y":365,"value":12},{"x":605,"y":365,"value":6},{"x":615,"y":365,"value":6},{"x":625,"y":365,"value":6},{"x":635,"y":365,"value":6},{"x":5,"y":375,"value":0},{"x":15,"y":375,"value":0},{"x":25,"y":375,"value":0},{"x":35,"y":375,"value":0},{"x":45,"y":375,"value":0},{"x":55,"y":375,"value":0},{"x":65,"y":375,"value":0},{"x":75,"y":375,"value":0},{"x":85,"y":375,"value":0},{"x":95,"y":375,"value":0},{"x":105,"y":375,"value":0},{"x":115,"y":375,"value":0},{"x":125,"y":375,"value":0},{"x":135,"y":375,"value":0},{"x":145,"y":375,"value":0},{"x":155,"y":375,"value":0},{"x":165,"y":375,"value":0},{"x":175,"y":375,"value":0},{"x":185,"y":375,"value":0},{"x":195,"y":375,"value":0},{"x":205,"y":375,"value":0},{"x":215,"y":375,"value":0},{"x":225,"y":375,"value":6},{"x":235,"y":375,"value":6},{"x":245,"y":375,"value":6},{"x":255,"y":375,"value":6},{"x":265,"y":375,"value":6},{"x":275,"y":375,"value":6},{"x":285,"y":375,"value":6},{"x":295,"y":375,"value":6},{"x":305,"y":375,"value":6},{"x":315,"y":375,"value":6},{"x":325,"y":375,"value":6},{"x":335,"y":375,"value":6},{"x":345,"y":375,"value":12},{"x":355,"y":375,"value":12},{"x":365,"y":375,"value":12},{"x":375,"y":375,"value":12},{"x":385,"y":375,"value":6},{"x":395,"y":375,"value":6},{"x":405,"y":375,"value":6},{"x":415,"y":375,"value":6},{"x":425,"y":375,"value":6},{"x":435,"y":375,"value":6},{"x":445,"y":375,"value":6},{"x":455,"y":375,"value":6},{"x":465,"y":375,"value":6},{"x":475,"y":375,"value":6},{"x":485,"y":375,"value":6},{"x":495,"y":375,"value":6},{"x":505,"y":375,"value":6},{"x":515,"y":375,"value":6},{"x":525,"y":375,"value":6},{"x":535,"y":375,"value":6},{"x":545,"y":375,"value":12},{"x":555,"y":375,"value":12},{"x":565,"y":375,"value":12},{"x":575,"y":375,"value":12},{"x":585,"y":375,"value":12},{"x":595,"y":375,"value":12},{"x":605,"y":375,"value":6},{"x":615,"y":375,"value":6},{"x":625,"y":375,"value":6},{"x":635,"y":375,"value":6},{"x":5,"y":385,"value":0},{"x":15,"y":385,"value":0},{"x":25,"y":385,"value":0},{"x":35,"y":385,"value":0},{"x":45,"y":385,"value":0},{"x":55,"y":385,"value":0},{"x":65,"y":385,"value":0},{"x":75,"y":385,"value":0},{"x":85,"y":385,"value":0},{"x":95,"y":385,"value":0},{"x":105,"y":385,"value":0},{"x":115,"y":385,"value":0},{"x":125,"y":385,"value":0},{"x":135,"y":385,"value":0},{"x":145,"y":385,"value":0},{"x":155,"y":385,"value":0},{"x":165,"y":385,"value":0},{"x":175,"y":385,"value":0},{"x":185,"y":385,"value":0},{"x":195,"y":385,"value":0},{"x":205,"y":385,"value":0},{"x":215,"y":385,"value":0},{"x":225,"y":385,"value":6},{"x":235,"y":385,"value":6},{"x":245,"y":385,"value":6},{"x":255,"y":385,"value":6},{"x":265,"y":385,"value":6},{"x":275,"y":385,"value":6},{"x":285,"y":385,"value":6},{"x":295,"y":385,"value":6},{"x":305,"y":385,"value":6},{"x":315,"y":385,"value":6},{"x":325,"y":385,"value":6},{"x":335,"y":385,"value":6},{"x":345,"y":385,"value":12},{"x":355,"y":385,"value":12},{"x":365,"y":385,"value":12},{"x":375,"y":385,"value":12},{"x":385,"y":385,"value":6},{"x":395,"y":385,"value":6},{"x":405,"y":385,"value":6},{"x":415,"y":385,"value":6},{"x":425,"y":385,"value":6},{"x":435,"y":385,"value":6},{"x":445,"y":385,"value":6},{"x":455,"y":385,"value":6},{"x":465,"y":385,"value":6},{"x":475,"y":385,"value":6},{"x":485,"y":385,"value":6},{"x":495,"y":385,"value":6},{"x":505,"y":385,"value":6},{"x":515,"y":385,"value":6},{"x":525,"y":385,"value":6},{"x":535,"y":385,"value":6},{"x":545,"y":385,"value":12},{"x":555,"y":385,"value":12},{"x":565,"y":385,"value":12},{"x":575,"y":385,"value":12},{"x":585,"y":385,"value":12},{"x":595,"y":385,"value":12},{"x":605,"y":385,"value":6},{"x":615,"y":385,"value":6},{"x":625,"y":385,"value":6},{"x":635,"y":385,"value":6},{"x":5,"y":395,"value":0},{"x":15,"y":395,"value":0},{"x":25,"y":395,"value":0},{"x":35,"y":395,"value":0},{"x":45,"y":395,"value":0},{"x":55,"y":395,"value":0},{"x":65,"y":395,"value":0},{"x":75,"y":395,"value":0},{"x":85,"y":395,"value":0},{"x":95,"y":395,"value":0},{"x":105,"y":395,"value":0},{"x":115,"y":395,"value":0},{"x":125,"y":395,"value":0},{"x":135,"y":395,"value":0},{"x":145,"y":395,"value":0},{"x":155,"y":395,"value":0},{"x":165,"y":395,"value":0},{"x":175,"y":395,"value":0},{"x":185,"y":395,"value":0},{"x":195,"y":395,"value":0},{"x":205,"y":395,"value":0},{"x":215,"y":395,"value":0},{"x":225,"y":395,"value":6},{"x":235,"y":395,"value":6},{"x":245,"y":395,"value":6},{"x":255,"y":395,"value":6},{"x":265,"y":395,"value":6},{"x":275,"y":395,"value":6},{"x":285,"y":395,"value":6},{"x":295,"y":395,"value":6},{"x":305,"y":395,"value":6},{"x":315,"y":395,"value":6},{"x":325,"y":395,"value":6},{"x":335,"y":395,"value":6},{"x":345,"y":395,"value":12},{"x":355,"y":395,"value":12},{"x":365,"y":395,"value":12},{"x":375,"y":395,"value":12},{"x":385,"y":395,"value":12},{"x":395,"y":395,"value":12},{"x":405,"y":395,"value":12},{"x":415,"y":395,"value":12},{"x":425,"y":395,"value":12},{"x":435,"y":395,"value":12},{"x":445,"y":395,"value":12},{"x":455,"y":395,"value":12},{"x":465,"y":395,"value":12},{"x":475,"y":395,"value":12},{"x":485,"y":395,"value":12},{"x":495,"y":395,"value":12},{"x":505,"y":395,"value":12},{"x":515,"y":395,"value":12},{"x":525,"y":395,"value":6},{"x":535,"y":395,"value":6},{"x":545,"y":395,"value":12},{"x":555,"y":395,"value":12},{"x":565,"y":395,"value":12},{"x":575,"y":395,"value":12},{"x":585,"y":395,"value":12},{"x":595,"y":395,"value":12},{"x":605,"y":395,"value":6},{"x":615,"y":395,"value":6},{"x":625,"y":395,"value":6},{"x":635,"y":395,"value":6},{"x":5,"y":405,"value":0},{"x":15,"y":405,"value":0},{"x":25,"y":405,"value":0},{"x":35,"y":405,"value":0},{"x":45,"y":405,"value":0},{"x":55,"y":405,"value":0},{"x":65,"y":405,"value":0},{"x":75,"y":405,"value":0},{"x":85,"y":405,"value":0},{"x":95,"y":405,"value":0},{"x":105,"y":405,"value":0},{"x":115,"y":405,"value":0},{"x":125,"y":405,"value":0},{"x":135,"y":405,"value":0},{"x":145,"y":405,"value":0},{"x":155,"y":405,"value":0},{"x":165,"y":405,"value":0},{"x":175,"y":405,"value":0},{"x":185,"y":405,"value":0},{"x":195,"y":405,"value":0},{"x":205,"y":405,"value":0},{"x":215,"y":405,"value":0},{"x":225,"y":405,"value":6},{"x":235,"y":405,"value":6},{"x":245,"y":405,"value":6},{"x":255,"y":405,"value":6},{"x":265,"y":405,"value":6},{"x":275,"y":405,"value":6},{"x":285,"y":405,"value":6},{"x":295,"y":405,"value":6},{"x":305,"y":405,"value":6},{"x":315,"y":405,"value":6},{"x":325,"y":405,"value":6},{"x":335,"y":405,"value":6},{"x":345,"y":405,"value":12},{"x":355,"y":405,"value":12},{"x":365,"y":405,"value":12},{"x":375,"y":405,"value":12},{"x":385,"y":405,"value":12},{"x":395,"y":405,"value":12},{"x":405,"y":405,"value":12},{"x":415,"y":405,"value":12},{"x":425,"y":405,"value":12},{"x":435,"y":405,"value":12},{"x":445,"y":405,"value":12},{"x":455,"y":405,"value":12},{"x":465,"y":405,"value":12},{"x":475,"y":405,"value":12},{"x":485,"y":405,"value":12},{"x":495,"y":405,"value":12},{"x":505,"y":405,"value":12},{"x":515,"y":405,"value":12},{"x":525,"y":405,"value":6},{"x":535,"y":405,"value":6},{"x":545,"y":405,"value":12},{"x":555,"y":405,"value":12},{"x":565,"y":405,"value":12},{"x":575,"y":405,"value":12},{"x":585,"y":405,"value":12},{"x":595,"y":405,"value":12},{"x":605,"y":405,"value":6},{"x":615,"y":405,"value":6},{"x":625,"y":405,"value":6},{"x":635,"y":405,"value":6},{"x":5,"y":415,"value":0},{"x":15,"y":415,"value":0},{"x":25,"y":415,"value":0},{"x":35,"y":415,"value":0},{"x":45,"y":415,"value":0},{"x":55,"y":415,"value":0},{"x":65,"y":415,"value":0},{"x":75,"y":415,"value":0},{"x":85,"y":415,"value":0},{"x":95,"y":415,"value":0},{"x":105,"y":415,"value":0},{"x":115,"y":415,"value":0},{"x":125,"y":415,"value":0},{"x":135,"y":415,"value":0},{"x":145,"y":415,"value":0},{"x":155,"y":415,"value":0},{"x":165,"y":415,"value":0},{"x":175,"y":415,"value":0},{"x":185,"y":415,"value":0},{"x":195,"y":415,"value":0},{"x":205,"y":415,"value":0},{"x":215,"y":415,"value":0},{"x":225,"y":415,"value":6},{"x":235,"y":415,"value":6},{"x":245,"y":415,"value":6},{"x":255,"y":415,"value":6},{"x":265,"y":415,"value":6},{"x":275,"y":415,"value":6},{"x":285,"y":415,"value":6},{"x":295,"y":415,"value":6},{"x":305,"y":415,"value":6},{"x":315,"y":415,"value":6},{"x":325,"y":415,"value":6},{"x":335,"y":415,"value":6},{"x":345,"y":415,"value":12},{"x":355,"y":415,"value":12},{"x":365,"y":415,"value":12},{"x":375,"y":415,"value":12},{"x":385,"y":415,"value":12},{"x":395,"y":415,"value":12},{"x":405,"y":415,"value":12},{"x":415,"y":415,"value":12},{"x":425,"y":415,"value":12},{"x":435,"y":415,"value":12},{"x":445,"y":415,"value":12},{"x":455,"y":415,"value":12},{"x":465,"y":415,"value":12},{"x":475,"y":415,"value":12},{"x":485,"y":415,"value":12},{"x":495,"y":415,"value":12},{"x":505,"y":415,"value":12},{"x":515,"y":415,"value":12},{"x":525,"y":415,"value":6},{"x":535,"y":415,"value":6},{"x":545,"y":415,"value":12},{"x":555,"y":415,"value":12},{"x":565,"y":415,"value":12},{"x":575,"y":415,"value":12},{"x":585,"y":415,"value":12},{"x":595,"y":415,"value":12},{"x":605,"y":415,"value":6},{"x":615,"y":415,"value":6},{"x":625,"y":415,"value":6},{"x":635,"y":415,"value":6},{"x":5,"y":425,"value":0},{"x":15,"y":425,"value":0},{"x":25,"y":425,"value":0},{"x":35,"y":425,"value":0},{"x":45,"y":425,"value":0},{"x":55,"y":425,"value":0},{"x":65,"y":425,"value":0},{"x":75,"y":425,"value":0},{"x":85,"y":425,"value":0},{"x":95,"y":425,"value":0},{"x":105,"y":425,"value":0},{"x":115,"y":425,"value":0},{"x":125,"y":425,"value":0},{"x":135,"y":425,"value":0},{"x":145,"y":425,"value":0},{"x":155,"y":425,"value":0},{"x":165,"y":425,"value":0},{"x":175,"y":425,"value":0},{"x":185,"y":425,"value":0},{"x":195,"y":425,"value":0},{"x":205,"y":425,"value":0},{"x":215,"y":425,"value":0},{"x":225,"y":425,"value":6},{"x":235,"y":425,"value":6},{"x":245,"y":425,"value":6},{"x":255,"y":425,"value":6},{"x":265,"y":425,"value":6},{"x":275,"y":425,"value":6},{"x":285,"y":425,"value":6},{"x":295,"y":425,"value":6},{"x":305,"y":425,"value":6},{"x":315,"y":425,"value":6},{"x":325,"y":425,"value":6},{"x":335,"y":425,"value":6},{"x":345,"y":425,"value":6},{"x":355,"y":425,"value":6},{"x":365,"y":425,"value":6},{"x":375,"y":425,"value":6},{"x":385,"y":425,"value":6},{"x":395,"y":425,"value":6},{"x":405,"y":425,"value":6},{"x":415,"y":425,"value":6},{"x":425,"y":425,"value":6},{"x":435,"y":425,"value":6},{"x":445,"y":425,"value":6},{"x":455,"y":425,"value":6},{"x":465,"y":425,"value":6},{"x":475,"y":425,"value":6},{"x":485,"y":425,"value":6},{"x":495,"y":425,"value":6},{"x":505,"y":425,"value":6},{"x":515,"y":425,"value":6},{"x":525,"y":425,"value":0},{"x":535,"y":425,"value":0},{"x":545,"y":425,"value":6},{"x":555,"y":425,"value":6},{"x":565,"y":425,"value":6},{"x":575,"y":425,"value":6},{"x":585,"y":425,"value":6},{"x":595,"y":425,"value":6},{"x":605,"y":425,"value":6},{"x":615,"y":425,"value":6},{"x":625,"y":425,"value":6},{"x":635,"y":425,"value":6},{"x":5,"y":435,"value":0},{"x":15,"y":435,"value":0},{"x":25,"y":435,"value":0},{"x":35,"y":435,"value":0},{"x":45,"y":435,"value":0},{"x":55,"y":435,"value":0},{"x":65,"y":435,"value":0},{"x":75,"y":435,"value":0},{"x":85,"y":435,"value":0},{"x":95,"y":435,"value":0},{"x":105,"y":435,"value":0},{"x":115,"y":435,"value":0},{"x":125,"y":435,"value":0},{"x":135,"y":435,"value":0},{"x":145,"y":435,"value":0},{"x":155,"y":435,"value":0},{"x":165,"y":435,"value":0},{"x":175,"y":435,"value":0},{"x":185,"y":435,"value":0},{"x":195,"y":435,"value":0},{"x":205,"y":435,"value":0},{"x":215,"y":435,"value":0},{"x":225,"y":435,"value":6},{"x":235,"y":435,"value":6},{"x":245,"y":435,"value":6},{"x":255,"y":435,"value":6},{"x":265,"y":435,"value":6},{"x":275,"y":435,"value":6},{"x":285,"y":435,"value":6},{"x":295,"y":435,"value":6},{"x":305,"y":435,"value":6},{"x":315,"y":435,"value":6},{"x":325,"y":435,"value":6},{"x":335,"y":435,"value":6},{"x":345,"y":435,"value":6},{"x":355,"y":435,"value":6},{"x":365,"y":435,"value":6},{"x":375,"y":435,"value":6},{"x":385,"y":435,"value":6},{"x":395,"y":435,"value":6},{"x":405,"y":435,"value":6},{"x":415,"y":435,"value":6},{"x":425,"y":435,"value":6},{"x":435,"y":435,"value":6},{"x":445,"y":435,"value":6},{"x":455,"y":435,"value":6},{"x":465,"y":435,"value":6},{"x":475,"y":435,"value":6},{"x":485,"y":435,"value":6},{"x":495,"y":435,"value":6},{"x":505,"y":435,"value":6},{"x":515,"y":435,"value":6},{"x":525,"y":435,"value":0},{"x":535,"y":435,"value":0},{"x":545,"y":435,"value":6},{"x":555,"y":435,"value":6},{"x":565,"y":435,"value":6},{"x":575,"y":435,"value":6},{"x":585,"y":435,"value":6},{"x":595,"y":435,"value":6},{"x":605,"y":435,"value":6},{"x":615,"y":435,"value":6},{"x":625,"y":435,"value":6},{"x":635,"y":435,"value":6},{"x":5,"y":445,"value":0},{"x":15,"y":445,"value":0},{"x":25,"y":445,"value":0},{"x":35,"y":445,"value":0},{"x":45,"y":445,"value":0},{"x":55,"y":445,"value":0},{"x":65,"y":445,"value":0},{"x":75,"y":445,"value":0},{"x":85,"y":445,"value":0},{"x":95,"y":445,"value":0},{"x":105,"y":445,"value":0},{"x":115,"y":445,"value":0},{"x":125,"y":445,"value":0},{"x":135,"y":445,"value":0},{"x":145,"y":445,"value":0},{"x":155,"y":445,"value":0},{"x":165,"y":445,"value":0},{"x":175,"y":445,"value":0},{"x":185,"y":445,"value":0},{"x":195,"y":445,"value":0},{"x":205,"y":445,"value":0},{"x":215,"y":445,"value":0},{"x":225,"y":445,"value":6},{"x":235,"y":445,"value":6},{"x":245,"y":445,"value":6},{"x":255,"y":445,"value":6},{"x":265,"y":445,"value":6},{"x":275,"y":445,"value":6},{"x":285,"y":445,"value":6},{"x":295,"y":445,"value":6},{"x":305,"y":445,"value":6},{"x":315,"y":445,"value":6},{"x":325,"y":445,"value":6},{"x":335,"y":445,"value":6},{"x":345,"y":445,"value":6},{"x":355,"y":445,"value":6},{"x":365,"y":445,"value":6},{"x":375,"y":445,"value":6},{"x":385,"y":445,"value":6},{"x":395,"y":445,"value":6},{"x":405,"y":445,"value":6},{"x":415,"y":445,"value":6},{"x":425,"y":445,"value":6},{"x":435,"y":445,"value":6},{"x":445,"y":445,"value":6},{"x":455,"y":445,"value":6},{"x":465,"y":445,"value":6},{"x":475,"y":445,"value":6},{"x":485,"y":445,"value":6},{"x":495,"y":445,"value":6},{"x":505,"y":445,"value":6},{"x":515,"y":445,"value":6},{"x":525,"y":445,"value":0},{"x":535,"y":445,"value":0},{"x":545,"y":445,"value":6},{"x":555,"y":445,"value":6},{"x":565,"y":445,"value":6},{"x":575,"y":445,"value":6},{"x":585,"y":445,"value":6},{"x":595,"y":445,"value":6},{"x":605,"y":445,"value":6},{"x":615,"y":445,"value":6},{"x":625,"y":445,"value":6},{"x":635,"y":445,"value":6},{"x":5,"y":455,"value":0},{"x":15,"y":455,"value":0},{"x":25,"y":455,"value":0},{"x":35,"y":455,"value":0},{"x":45,"y":455,"value":0},{"x":55,"y":455,"value":0},{"x":65,"y":455,"value":0},{"x":75,"y":455,"value":0},{"x":85,"y":455,"value":0},{"x":95,"y":455,"value":0},{"x":105,"y":455,"value":0},{"x":115,"y":455,"value":0},{"x":125,"y":455,"value":0},{"x":135,"y":455,"value":0},{"x":145,"y":455,"value":0},{"x":155,"y":455,"value":0},{"x":165,"y":455,"value":0},{"x":175,"y":455,"value":0},{"x":185,"y":455,"value":0},{"x":195,"y":455,"value":0},{"x":205,"y":455,"value":0},{"x":215,"y":455,"value":0},{"x":225,"y":455,"value":6},{"x":235,"y":455,"value":6},{"x":245,"y":455,"value":6},{"x":255,"y":455,"value":6},{"x":265,"y":455,"value":6},{"x":275,"y":455,"value":6},{"x":285,"y":455,"value":6},{"x":295,"y":455,"value":6},{"x":305,"y":455,"value":6},{"x":315,"y":455,"value":6},{"x":325,"y":455,"value":6},{"x":335,"y":455,"value":6},{"x":345,"y":455,"value":6},{"x":355,"y":455,"value":6},{"x":365,"y":455,"value":6},{"x":375,"y":455,"value":6},{"x":385,"y":455,"value":6},{"x":395,"y":455,"value":6},{"x":405,"y":455,"value":6},{"x":415,"y":455,"value":6},{"x":425,"y":455,"value":6},{"x":435,"y":455,"value":6},{"x":445,"y":455,"value":6},{"x":455,"y":455,"value":6},{"x":465,"y":455,"value":6},{"x":475,"y":455,"value":6},{"x":485,"y":455,"value":6},{"x":495,"y":455,"value":6},{"x":505,"y":455,"value":6},{"x":515,"y":455,"value":6},{"x":525,"y":455,"value":0},{"x":535,"y":455,"value":0},{"x":545,"y":455,"value":6},{"x":555,"y":455,"value":6},{"x":565,"y":455,"value":6},{"x":575,"y":455,"value":6},{"x":585,"y":455,"value":6},{"x":595,"y":455,"value":6},{"x":605,"y":455,"value":6},{"x":615,"y":455,"value":6},{"x":625,"y":455,"value":6},{"x":635,"y":455,"value":6},{"x":5,"y":465,"value":0},{"x":15,"y":465,"value":0},{"x":25,"y":465,"value":0},{"x":35,"y":465,"value":0},{"x":45,"y":465,"value":0},{"x":55,"y":465,"value":0},{"x":65,"y":465,"value":0},{"x":75,"y":465,"value":0},{"x":85,"y":465,"value":0},{"x":95,"y":465,"value":0},{"x":105,"y":465,"value":0},{"x":115,"y":465,"value":0},{"x":125,"y":465,"value":0},{"x":135,"y":465,"value":0},{"x":145,"y":465,"value":0},{"x":155,"y":465,"value":0},{"x":165,"y":465,"value":0},{"x":175,"y":465,"value":0},{"x":185,"y":465,"value":0},{"x":195,"y":465,"value":0},{"x":205,"y":465,"value":0},{"x":215,"y":465,"value":0},{"x":225,"y":465,"value":6},{"x":235,"y":465,"value":6},{"x":245,"y":465,"value":6},{"x":255,"y":465,"value":6},{"x":265,"y":465,"value":6},{"x":275,"y":465,"value":6},{"x":285,"y":465,"value":6},{"x":295,"y":465,"value":6},{"x":305,"y":465,"value":6},{"x":315,"y":465,"value":6},{"x":325,"y":465,"value":6},{"x":335,"y":465,"value":6},{"x":345,"y":465,"value":6},{"x":355,"y":465,"value":6},{"x":365,"y":465,"value":6},{"x":375,"y":465,"value":6},{"x":385,"y":465,"value":6},{"x":395,"y":465,"value":6},{"x":405,"y":465,"value":6},{"x":415,"y":465,"value":6},{"x":425,"y":465,"value":6},{"x":435,"y":465,"value":6},{"x":445,"y":465,"value":6},{"x":455,"y":465,"value":6},{"x":465,"y":465,"value":6},{"x":475,"y":465,"value":6},{"x":485,"y":465,"value":6},{"x":495,"y":465,"value":6},{"x":505,"y":465,"value":6},{"x":515,"y":465,"value":6},{"x":525,"y":465,"value":0},{"x":535,"y":465,"value":0},{"x":545,"y":465,"value":6},{"x":555,"y":465,"value":6},{"x":565,"y":465,"value":6},{"x":575,"y":465,"value":6},{"x":585,"y":465,"value":6},{"x":595,"y":465,"value":6},{"x":605,"y":465,"value":6},{"x":615,"y":465,"value":6},{"x":625,"y":465,"value":6},{"x":635,"y":465,"value":6},{"x":5,"y":475,"value":0},{"x":15,"y":475,"value":0},{"x":25,"y":475,"value":0},{"x":35,"y":475,"value":0},{"x":45,"y":475,"value":0},{"x":55,"y":475,"value":0},{"x":65,"y":475,"value":0},{"x":75,"y":475,"value":0},{"x":85,"y":475,"value":0},{"x":95,"y":475,"value":0},{"x":105,"y":475,"value":0},{"x":115,"y":475,"value":0},{"x":125,"y":475,"value":0},{"x":135,"y":475,"value":0},{"x":145,"y":475,"value":0},{"x":155,"y":475,"value":0},{"x":165,"y":475,"value":0},{"x":175,"y":475,"value":0},{"x":185,"y":475,"value":0},{"x":195,"y":475,"value":0},{"x":205,"y":475,"value":0},{"x":215,"y":475,"value":0},{"x":225,"y":475,"value":6},{"x":235,"y":475,"value":6},{"x":245,"y":475,"value":6},{"x":255,"y":475,"value":6},{"x":265,"y":475,"value":6},{"x":275,"y":475,"value":6},{"x":285,"y":475,"value":6},{"x":295,"y":475,"value":6},{"x":305,"y":475,"value":6},{"x":315,"y":475,"value":6},{"x":325,"y":475,"value":6},{"x":335,"y":475,"value":6},{"x":345,"y":475,"value":6},{"x":355,"y":475,"value":6},{"x":365,"y":475,"value":6},{"x":375,"y":475,"value":6},{"x":385,"y":475,"value":6},{"x":395,"y":475,"value":6},{"x":405,"y":475,"value":6},{"x":415,"y":475,"value":6},{"x":425,"y":475,"value":6},{"x":435,"y":475,"value":6},{"x":445,"y":475,"value":6},{"x":455,"y":475,"value":6},{"x":465,"y":475,"value":6},{"x":475,"y":475,"value":6},{"x":485,"y":475,"value":6},{"x":495,"y":475,"value":6},{"x":505,"y":475,"value":6},{"x":515,"y":475,"value":6},{"x":525,"y":475,"value":0},{"x":535,"y":475,"value":0},{"x":545,"y":475,"value":6},{"x":555,"y":475,"value":6},{"x":565,"y":475,"value":6},{"x":575,"y":475,"value":6},{"x":585,"y":475,"value":6},{"x":595,"y":475,"value":6},{"x":605,"y":475,"value":6},{"x":615,"y":475,"value":6},{"x":625,"y":475,"value":6},{"x":635,"y":475,"value":6}];

        this.mapImage.src =
            "http://172.16.10.21:6066/images_report/human_detection/20190624/O2SwWx3OUu_report_1561358107224.jpeg"

        setTimeout(() => {
            this.heatMapPosition = points;
        }, 300);
    }

    initSelect() {
        this.addPeriodSelectItem = [
            { value: EAddPeriodSelect.period, text: this._("w_period") },
            {
                value: EAddPeriodSelect.designation,
                text: this._("w_Designation")
            }
        ];

        this.timeModeSelectItem = {
            day: this._("w_daily"),
            week: this._("w_weekly"),
            month: this._("w_monthly"),
            quarter: this._("w_quarterly"),
            year: this._("w_yearly")
        };

        this.isIncludedEmployeeSelectItem = {
            yes: this._("w_yes"),
            no: this._("w_no")
        };
    }

    // Author: Morris
    initTemplate() {
        if (this.$route.query.template != undefined) {
            let templateJSON: string = this.$route.query.template as string;
            this.templateItem = ReportService.analysisTemplate(templateJSON);
        }
    }

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    initRegionTreeSelect() {
        this.regionTreeItem = new RegionTreeItem();
        this.regionTreeItem.titleItem.card = this._("w_SiteTreeSelect");
    }

    siteFilterPermission() {
        let tempSitesSelectItem = {};
        for (const detail of this.$user.user.allowSites) {
            let site = { id: detail.objectId, text: detail.name };
            this.sitesSelectItem.push(site);

            // tempSitesSelectItem[detail.objectId] = detail.name;
        }
        // this.sitesSelectItem = tempSitesSelectItem;
    }

    async initSelectItemSite() {
        let tempSitesSelectItem = {};

        const readAllSiteParam: {
            type: string;
        } = {
            type: "all"
        };

        await this.$server
            .R("/location/site/all", readAllSiteParam)
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response) {
                        // 自定義 sitesSelectItem 的 key 的方式
                        tempSitesSelectItem[returnValue.objectId] =
                            returnValue.name;
                    }
                    this.sitesSelectItem = tempSitesSelectItem;
                }
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

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
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemTree() {
        let tempTree = {};
        let tempChildrenArray = [];

        await this.$server
            .R("/location/tree")
            .then((response: any) => {
                if (response != undefined) {
                    tempTree = response;
                    if (this.$user.user.allowSites.length > 0) {
                        this.$user.user.allowSites.map(site => {
                            if (response.childrens.length > 0) {
                                response.childrens.map(item => {
                                    if (item.objectId === site.objectId) {
                                        let tempTreeData = JSON.parse(
                                            JSON.stringify(tempTree)
                                        );
                                        tempTreeData.childrens = [];
                                        tempChildrenArray.push(item);
                                        tempTreeData.childrens = tempChildrenArray;
                                        tempTree = tempTreeData;
                                    }
                                });
                            }
                        });
                    }

                    this.regionTreeItem.tree = RegionAPI.analysisApiResponse(
                        tempTree
                    );

                    this.regionTreeItem.region = this.regionTreeItem.tree;
                }
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectItemArea() {
        let tempAreaSelectItem = { all: this._("w_AllAreas") };

        const readParam: {
            siteId: string;
        } = {
            siteId: this.filterData.firstSiteId
        };

        if (!this.filterData.firstSiteId) {
            return false;
        } else {
            await this.$server
                .R("/location/area/all", readParam)
                .then((response: any) => {
                    if (response != undefined) {
                        for (const returnValue of response) {
                            // 自定義 sitesSelectItem 的 key 的方式
                            tempAreaSelectItem[returnValue.objectId] =
                                returnValue.name;
                            // this.$set(this.areaSelectItem, returnValue.objectId, returnValue.name);
                        }
                        this.areaSelectItem = tempAreaSelectItem;
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        }
    }

    async initSelectItemDeviceGroup() {
        let tempDeviceGroupSelectItem = { all: this._("w_AllDeviceGroups") };
        this.deviceGroupSelectItem = {};

        let readParam: {
            siteId: string;
            areaId?: string;
            mode: string;
        } = {
            siteId: this.filterData.firstSiteId,
            mode: this.deviceMode
        };
        if (!this.filterData.firstSiteId) {
            return false;

            // 只選擇site
        } else if (this.filterData.firstSiteId && !this.inputFormData.areaId) {
            await this.$server
                .R("/device/group/all", readParam)
                .then((response: any) => {
                    if (response != undefined) {
                        for (const returnValue of response) {
                            // 自定義 tempDeviceGroupSelectItem 的 key 的方式
                            tempDeviceGroupSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceGroupSelectItem = tempDeviceGroupSelectItem;
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId !== "all"
        ) {
            // 選擇site和單一area
            readParam.areaId = this.inputFormData.areaId;
            await this.$server
                .R("/device/group/all", readParam)
                .then((response: any) => {
                    if (response != undefined) {
                        for (const returnValue of response) {
                            // 自定義 tempDeviceGroupSelectItem 的 key 的方式
                            tempDeviceGroupSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceGroupSelectItem = tempDeviceGroupSelectItem;
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId === "all"
        ) {
            // 選擇site和all area
            await this.$server
                .R("/device/group/all", readParam)
                .then((response: any) => {
                    if (response != undefined) {
                        for (const returnValue of response) {
                            // 自定義 tempDeviceGroupSelectItem 的 key 的方式
                            tempDeviceGroupSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceGroupSelectItem = tempDeviceGroupSelectItem;
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        }
    }

    async initSelectItemDevice() {
        let tempDeviceSelectItem = { all: this._("w_AllDevices") };
        this.deviceSelectItem = {};

        const readParam: {
            siteId: string;
            areaId?: string;
            groupId?: string;
            mode: string;
        } = {
            siteId: this.filterData.firstSiteId,
            mode: this.deviceMode
        };
        if (!this.filterData.firstSiteId) {
            return false;

            // 只選擇site
        } else if (
            this.filterData.firstSiteId &&
            !this.inputFormData.areaId &&
            !this.inputFormData.groupId
        ) {
            await this.$server
                .R("/device", readParam)
                .then((response: any) => {
                    if (response.results.length > 0) {
                        for (const returnValue of response.results) {
                            // 自定義 tempDeviceSelectItem 的 key 的方式
                            tempDeviceSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceSelectItem = tempDeviceSelectItem;
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId !== "all" &&
            !this.inputFormData.groupId
        ) {
            // 選擇site和單一area
            readParam.areaId = this.inputFormData.areaId;
            await this.$server
                .R("/device", readParam)
                .then((response: any) => {
                    if (response.results.length > 0) {
                        for (const returnValue of response.results) {
                            // 自定義 tempDeviceSelectItem 的 key 的方式
                            tempDeviceSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceSelectItem = tempDeviceSelectItem;
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId !== "all" &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId !== "all"
        ) {
            // 選擇site和單一area和單一device group
            readParam.groupId = this.inputFormData.groupId;
            await this.$server
                .R("/device", readParam)
                .then((response: any) => {
                    if (response.results.length > 0) {
                        for (const returnValue of response.results) {
                            // 自定義 tempDeviceSelectItem 的 key 的方式
                            tempDeviceSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceSelectItem = tempDeviceSelectItem;
                    }
                    if (response.results.length === 0) {
                        this.deviceSelectItem = {};
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId !== "all" &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId !== "all" &&
            this.inputFormData.deviceId === "all"
        ) {
            // 選擇site和單一area和單一device group和 all device
            readParam.groupId = this.inputFormData.groupId;

            await this.$server
                .R("/device", readParam)
                .then((response: any) => {
                    if (response.results.length > 0) {
                        for (const returnValue of response.results) {
                            // 自定義 tempDeviceSelectItem 的 key 的方式
                            tempDeviceSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceSelectItem = tempDeviceSelectItem;
                    }
                    if (response.results.length === 0) {
                        this.deviceSelectItem = {};
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId === "all" &&
            (this.inputFormData.groupId === undefined ||
                this.inputFormData.groupId === "") &&
            this.inputFormData.groupId !== "all"
        ) {
            // 選擇site和all area
            readParam.areaId = "";
            await this.$server
                .R("/device", readParam)
                .then((response: any) => {
                    if (response.results.length > 0) {
                        for (const returnValue of response.results) {
                            // 自定義 tempDeviceSelectItem 的 key 的方式
                            tempDeviceSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceSelectItem = tempDeviceSelectItem;
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId === "all" &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId === "all"
        ) {
            // 選擇site和all area和all device group
            readParam.groupId = this.inputFormData.groupId;
            await this.$server
                .R("/device", readParam)
                .then((response: any) => {
                    if (response.results.length > 0) {
                        for (const returnValue of response.results) {
                            // 自定義 tempDeviceSelectItem 的 key 的方式
                            tempDeviceSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceSelectItem = tempDeviceSelectItem;
                    }
                    if (response.results.length === 0) {
                        this.deviceSelectItem = {};
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else if (
            this.filterData.firstSiteId &&
            this.inputFormData.areaId &&
            this.inputFormData.areaId !== "all" &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId === "all"
        ) {
            // 選擇site和單一area和all device group
            readParam.areaId = this.inputFormData.areaId;
            readParam.groupId = "";
            await this.$server
                .R("/device", readParam)
                .then((response: any) => {
                    if (response.results.length > 0) {
                        for (const returnValue of response.results) {
                            // 自定義 tempDeviceSelectItem 的 key 的方式
                            tempDeviceSelectItem[returnValue.objectId] =
                                returnValue.name;
                        }
                        this.deviceSelectItem = tempDeviceSelectItem;
                    }
                    if (response.results.length === 0) {
                        this.deviceSelectItem = {};
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        }
    }

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
                return ResponseFilter.catchError(this, e);
            });
    }

    initHourArray() {
        let weekDay = new Date().getDay();

        const dayRanges = [
            {
                startDay: "1",
                endDay: "5",
                startDate: "2000-01-01T01:00:00.000Z",
                endDate: "2000-01-01T09:00:00.000Z"
            },
            {
                startDay: "6",
                endDay: "0",
                startDate: "2000-01-01T00:00:00.000Z",
                endDate: "2000-01-01T14:00:00.000Z"
            }
        ];

        let result = HighchartsService.siteOfficeHour(weekDay, dayRanges);
        console.log(result);

        this.slider = {
            value: 0,
            data: [],
            range: []
        };

        let tempDataArray = [];
        let tempRangeArray = [];

        for (let i = result.startHour; i <= result.endHour; i++) {
            let hourString = i < 10 ? `0${i.toString()}` : i.toString();
            let tempLabel = { label: `${hourString}:00` };

            tempRangeArray.push(tempLabel);
            tempDataArray.push(i);
        }

        console.log("tempDataArray - ", tempDataArray);
        console.log("tempRangeArray - ", tempRangeArray);

        this.slider = {
            value: result.startHour,
            data: tempDataArray,
            range: tempRangeArray
        };
    }

    initDayArray() {
        const summaryDatas = [
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "1zK9b3J0Nq",
                    name: "1F"
                },
                deviceGroups: [
                    {
                        objectId: "8CVfWZLlPD",
                        name: "1F peopleCounting STU48區"
                    }
                ],
                device: {
                    objectId: "RiZtGia7MQ",
                    name: "台北 1F 80L_1-out"
                },
                date: "2019-06-30T16:00:00.000Z",
                type: "day",
                in: 0,
                prevIn: 0,
                out: 2,
                prevOut: 61,
                inEmployee: 0,
                prevInEmployee: 0,
                outEmployee: 0,
                prevOutEmployee: 0
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "pfLGgj8Hf5",
                    name: "2F"
                },
                deviceGroups: [
                    {
                        objectId: "73iC8Xtl1t",
                        name: "2F peopleCounting 女裝區"
                    }
                ],
                device: {
                    objectId: "iYJLYUjHWF",
                    name: "台北 2F 80L_1-out"
                },
                date: "2019-06-30T16:00:00.000Z",
                type: "day",
                in: 0,
                prevIn: 0,
                out: 2,
                prevOut: 61,
                inEmployee: 0,
                prevInEmployee: 0,
                outEmployee: 0,
                prevOutEmployee: 0
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "pfLGgj8Hf5",
                    name: "2F"
                },
                deviceGroups: [
                    {
                        objectId: "jzthfNUGky",
                        name: "2F peopleCounting 童裝區"
                    }
                ],
                device: {
                    objectId: "bWBAWOHIn1",
                    name: "台北 2F 80L_1-in"
                },
                date: "2019-06-30T16:00:00.000Z",
                type: "day",
                in: 1,
                prevIn: 62,
                out: 0,
                prevOut: 0,
                inEmployee: 0,
                prevInEmployee: 0,
                outEmployee: 0,
                prevOutEmployee: 0
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "1zK9b3J0Nq",
                    name: "1F"
                },
                deviceGroups: [
                    {
                        objectId: "sfs8VJbvFE",
                        name: "1F peopleCounting HKT48區"
                    }
                ],
                device: {
                    objectId: "bZpj6O9hW1",
                    name: "台北 1F 80L_1-in"
                },
                date: "2019-06-30T16:00:00.000Z",
                type: "day",
                in: 1,
                prevIn: 62,
                out: 0,
                prevOut: 0,
                inEmployee: 0,
                prevInEmployee: 0,
                outEmployee: 0,
                prevOutEmployee: 0
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "1zK9b3J0Nq",
                    name: "1F"
                },
                deviceGroups: [
                    {
                        objectId: "8CVfWZLlPD",
                        name: "1F peopleCounting STU48區"
                    }
                ],
                device: {
                    objectId: "RiZtGia7MQ",
                    name: "台北 1F 80L_1-out"
                },
                date: "2019-07-01T16:00:00.000Z",
                type: "day",
                in: 0,
                prevIn: 0,
                out: 50,
                prevOut: 82,
                inEmployee: 0,
                prevInEmployee: 0,
                outEmployee: 0,
                prevOutEmployee: 0
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "pfLGgj8Hf5",
                    name: "2F"
                },
                deviceGroups: [
                    {
                        objectId: "73iC8Xtl1t",
                        name: "2F peopleCounting 女裝區"
                    }
                ],
                device: {
                    objectId: "iYJLYUjHWF",
                    name: "台北 2F 80L_1-out"
                },
                date: "2019-07-01T16:00:00.000Z",
                type: "day",
                in: 0,
                prevIn: 0,
                out: 50,
                prevOut: 82,
                inEmployee: 0,
                prevInEmployee: 0,
                outEmployee: 0,
                prevOutEmployee: 0
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "pfLGgj8Hf5",
                    name: "2F"
                },
                deviceGroups: [
                    {
                        objectId: "jzthfNUGky",
                        name: "2F peopleCounting 童裝區"
                    }
                ],
                device: {
                    objectId: "bWBAWOHIn1",
                    name: "台北 2F 80L_1-in"
                },
                date: "2019-07-01T16:00:00.000Z",
                type: "day",
                in: 21,
                prevIn: 70,
                out: 0,
                prevOut: 0,
                inEmployee: 0,
                prevInEmployee: 0,
                outEmployee: 0,
                prevOutEmployee: 0
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "1zK9b3J0Nq",
                    name: "1F"
                },
                deviceGroups: [
                    {
                        objectId: "sfs8VJbvFE",
                        name: "1F peopleCounting HKT48區"
                    }
                ],
                device: {
                    objectId: "bZpj6O9hW1",
                    name: "台北 1F 80L_1-in"
                },
                date: "2019-07-01T16:00:00.000Z",
                type: "day",
                in: 21,
                prevIn: 70,
                out: 0,
                prevOut: 0,
                inEmployee: 0,
                prevInEmployee: 0,
                outEmployee: 0,
                prevOutEmployee: 0
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "pfLGgj8Hf5",
                    name: "2F"
                },
                deviceGroups: [
                    {
                        objectId: "jzthfNUGky",
                        name: "2F peopleCounting 童裝區"
                    }
                ],
                device: {
                    objectId: "bWBAWOHIn1",
                    name: "台北 2F 80L_1-in"
                },
                date: "2019-07-02T16:00:00.000Z",
                type: "day",
                in: 60,
                prevIn: 86,
                out: 0,
                prevOut: 0,
                inEmployee: 0,
                prevInEmployee: 0,
                outEmployee: 0,
                prevOutEmployee: 0
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "1zK9b3J0Nq",
                    name: "1F"
                },
                deviceGroups: [
                    {
                        objectId: "sfs8VJbvFE",
                        name: "1F peopleCounting HKT48區"
                    }
                ],
                device: {
                    objectId: "bZpj6O9hW1",
                    name: "台北 1F 80L_1-in"
                },
                date: "2019-07-02T16:00:00.000Z",
                type: "day",
                in: 60,
                prevIn: 86,
                out: 0,
                prevOut: 0,
                inEmployee: 0,
                prevInEmployee: 0,
                outEmployee: 0,
                prevOutEmployee: 0
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "1zK9b3J0Nq",
                    name: "1F"
                },
                deviceGroups: [
                    {
                        objectId: "8CVfWZLlPD",
                        name: "1F peopleCounting STU48區"
                    }
                ],
                device: {
                    objectId: "RiZtGia7MQ",
                    name: "台北 1F 80L_1-out"
                },
                date: "2019-07-02T16:00:00.000Z",
                type: "day",
                in: 0,
                prevIn: 0,
                out: 85,
                prevOut: 82,
                inEmployee: 0,
                prevInEmployee: 0,
                outEmployee: 0,
                prevOutEmployee: 0
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "pfLGgj8Hf5",
                    name: "2F"
                },
                deviceGroups: [
                    {
                        objectId: "73iC8Xtl1t",
                        name: "2F peopleCounting 女裝區"
                    }
                ],
                device: {
                    objectId: "iYJLYUjHWF",
                    name: "台北 2F 80L_1-out"
                },
                date: "2019-07-02T16:00:00.000Z",
                type: "day",
                in: 0,
                prevIn: 0,
                out: 85,
                prevOut: 82,
                inEmployee: 0,
                prevInEmployee: 0,
                outEmployee: 0,
                prevOutEmployee: 0
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "1zK9b3J0Nq",
                    name: "1F"
                },
                deviceGroups: [
                    {
                        objectId: "8CVfWZLlPD",
                        name: "1F peopleCounting STU48區"
                    }
                ],
                device: {
                    objectId: "RiZtGia7MQ",
                    name: "台北 1F 80L_1-out"
                },
                date: "2019-07-03T16:00:00.000Z",
                type: "day",
                in: 0,
                prevIn: 0,
                out: 56,
                prevOut: 2,
                inEmployee: 0,
                prevInEmployee: 0,
                outEmployee: 0,
                prevOutEmployee: 0
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "pfLGgj8Hf5",
                    name: "2F"
                },
                deviceGroups: [
                    {
                        objectId: "73iC8Xtl1t",
                        name: "2F peopleCounting 女裝區"
                    }
                ],
                device: {
                    objectId: "iYJLYUjHWF",
                    name: "台北 2F 80L_1-out"
                },
                date: "2019-07-03T16:00:00.000Z",
                type: "day",
                in: 0,
                prevIn: 0,
                out: 56,
                prevOut: 2,
                inEmployee: 0,
                prevInEmployee: 0,
                outEmployee: 0,
                prevOutEmployee: 0
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "pfLGgj8Hf5",
                    name: "2F"
                },
                deviceGroups: [
                    {
                        objectId: "jzthfNUGky",
                        name: "2F peopleCounting 童裝區"
                    }
                ],
                device: {
                    objectId: "bWBAWOHIn1",
                    name: "台北 2F 80L_1-in"
                },
                date: "2019-07-03T16:00:00.000Z",
                type: "day",
                in: 38,
                prevIn: null,
                out: 0,
                prevOut: null,
                inEmployee: 0,
                prevInEmployee: null,
                outEmployee: 0,
                prevOutEmployee: null
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "1zK9b3J0Nq",
                    name: "1F"
                },
                deviceGroups: [
                    {
                        objectId: "sfs8VJbvFE",
                        name: "1F peopleCounting HKT48區"
                    }
                ],
                device: {
                    objectId: "bZpj6O9hW1",
                    name: "台北 1F 80L_1-in"
                },
                date: "2019-07-03T16:00:00.000Z",
                type: "day",
                in: 38,
                prevIn: null,
                out: 0,
                prevOut: null,
                inEmployee: 0,
                prevInEmployee: null,
                outEmployee: 0,
                prevOutEmployee: null
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "pfLGgj8Hf5",
                    name: "2F"
                },
                deviceGroups: [
                    {
                        objectId: "jzthfNUGky",
                        name: "2F peopleCounting 童裝區"
                    }
                ],
                device: {
                    objectId: "bWBAWOHIn1",
                    name: "台北 2F 80L_1-in"
                },
                date: "2019-07-04T16:00:00.000Z",
                type: "day",
                in: 37,
                prevIn: null,
                out: 0,
                prevOut: null,
                inEmployee: 0,
                prevInEmployee: null,
                outEmployee: 0,
                prevOutEmployee: null
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "1zK9b3J0Nq",
                    name: "1F"
                },
                deviceGroups: [
                    {
                        objectId: "sfs8VJbvFE",
                        name: "1F peopleCounting HKT48區"
                    }
                ],
                device: {
                    objectId: "bZpj6O9hW1",
                    name: "台北 1F 80L_1-in"
                },
                date: "2019-07-04T16:00:00.000Z",
                type: "day",
                in: 37,
                prevIn: null,
                out: 0,
                prevOut: null,
                inEmployee: 0,
                prevInEmployee: null,
                outEmployee: 0,
                prevOutEmployee: null
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "1zK9b3J0Nq",
                    name: "1F"
                },
                deviceGroups: [
                    {
                        objectId: "8CVfWZLlPD",
                        name: "1F peopleCounting STU48區"
                    }
                ],
                device: {
                    objectId: "RiZtGia7MQ",
                    name: "台北 1F 80L_1-out"
                },
                date: "2019-07-04T16:00:00.000Z",
                type: "day",
                in: 0,
                prevIn: null,
                out: 46,
                prevOut: null,
                inEmployee: 0,
                prevInEmployee: null,
                outEmployee: 0,
                prevOutEmployee: null
            },
            {
                site: {
                    objectId: "iVTCTzctbF",
                    name: "台北店"
                },
                area: {
                    objectId: "pfLGgj8Hf5",
                    name: "2F"
                },
                deviceGroups: [
                    {
                        objectId: "73iC8Xtl1t",
                        name: "2F peopleCounting 女裝區"
                    }
                ],
                device: {
                    objectId: "iYJLYUjHWF",
                    name: "台北 2F 80L_1-out"
                },
                date: "2019-07-04T16:00:00.000Z",
                type: "day",
                in: 0,
                prevIn: null,
                out: 46,
                prevOut: null,
                inEmployee: 0,
                prevInEmployee: null,
                outEmployee: 0,
                prevOutEmployee: null
            }
        ];

        let tempDayArray = [];

        if (summaryDatas.length > 0) {
            summaryDatas.map(item => {
                tempDayArray.push(item.date);
            });
        } else {
            return false;
        }

        // 去掉重複的值
        this.dayArray = [...new Set(tempDayArray)];

        // this.dayArray = [
        //     "2019-07-01T16:00:00.000Z",
        //     "2019-07-02T16:00:00.000Z",
        //     "2019-07-03T16:00:00.000Z",
        //     "2019-07-04T16:00:00.000Z"
        // ];
    }

    async receiveUserData(data) {
        this.userData = [];
        this.userData = data;
    }

    receiveModalShowData(data) {
        this.modalShow = data;
    }

    //// 以下為 analysis filter ////

    async receiveFilterData(
        filterData: IFilterCondition,
        designationPeriod: EDesignationPeriod
    ) {
        let param = JSON.parse(JSON.stringify(filterData));
        this.filterData = filterData;
        this.designationPeriod = designationPeriod;

        console.log("this.filterData - ", this.filterData);

        this.inputFormData = {
            areaId: "",
            groupId: "",
            deviceId: "",
            type: "",
            isIncludedEmployee: "no"
        };

        if (
            this.checkDateTheSameDay(
                this.filterData.startDate,
                this.filterData.endDate
            )
        ) {
            this.initHourArray();
        } else {
            this.initDayArray();
        }

        // await this.$server
        //     .C("/report/demographic/summary", param)
        //     .then((response: any) => {
        //         if (response !== undefined) {
        //             this.responseData = response;
        //             this.officeHourItemDetail = this.responseData.officeHours;
        //             this.resolveSummary();
        //         }
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.catchError(this, e);
        //     });

        // Ben  //TODO for test and delete it when have api
        this.initHeatmap();
    }

    resolveSummary() {
        if (this.filterData.siteIds.length === 1) {
            this.initSelectItemArea();
            this.initSelectItemDeviceGroup();
            this.initSelectItemDevice();
        }

        this.inputFormData = {
            areaId: "all",
            groupId: "all",
            deviceId: "all",
            type: this.filterData.type,
            isIncludedEmployee: "no"
        };

        // get office hour data
        let tempISite: any = {};
        this.sites = [];

        for (const filterSiteId of this.filterData.siteIds) {
            for (const detail of this.officeHourItemDetail) {
                for (const officeHourSiteId of detail.sites) {
                    if (this.filterData.siteIds === officeHourSiteId.objectId) {
                        let tempOfficeHours = [];
                        for (const dayRangesValue of detail.dayRanges) {
                            let tempOfficeHour: any = {};
                            tempOfficeHour = {
                                startDay: dayRangesValue.startDay,
                                endDay: dayRangesValue.endDay,
                                startDate: dayRangesValue.startDate,
                                endDate: dayRangesValue.endDate
                            };
                            tempOfficeHours.push(tempOfficeHour);
                        }
                        tempISite = {
                            objectId: officeHourSiteId.objectId,
                            name: officeHourSiteId.name,
                            officeHour: tempOfficeHours
                        };
                        this.sites.push(tempISite);
                        break;
                    }
                }
            }
        }

        // this.sites.push(tempISite);
        this.dTimeMode = this.filterData.type;
        this.pSiteIds = this.filterData.siteIds;
        this.tags = this.filterData.tagIds;
        this.startDate = new Date(this.filterData.startDate);
        this.endDate = new Date(this.filterData.endDate);
        this.timeMode = this.filterData.type;
        this.areaMode = EAreaMode.all;
        this.sortOutChartData(this.responseData.summaryDatas);

        // Ben
        this.initHeatmap();
        // this.initDashboardData();
        // this.initReportTable();
    }

    analysisTitle(): string {
        let title = "Analysis - ";

        for (const site of this.sitesSelectItem) {
            if (this.filterData.siteIds === site.id) {
                title += `${this._("w_Title_One_Site")} ${site.text}. `;
            }
        }

        title += `${this._("w_Title_StartDate")} ${Datetime.DateTime2String(
            this.filterData.startDate,
            "YYYY/MM/DD"
        )}. `;
        title += `${this._("w_Title_EndDate")} ${Datetime.DateTime2String(
            this.filterData.endDate,
            "YYYY/MM/DD"
        )}. `;

        this.visible = true;

        return title;
    }

    checkDateTheSameDay(startDate: Date, endDate: Date) {
        return (
            Datetime.DateToZero(endDate).getTime() ===
            Datetime.DateToZero(startDate).getTime()
        );
    }

    sortOutChartData(datas: any) {
        let tempChartDatas: IChartDemographicData[] = [];
        let isOneDay = false;
        this.chartDatas = [];

        // 取得date、siteObjectId資料
        if (
            Datetime.IsOneDate(
                this.filterData.startDate,
                this.filterData.endDate
            )
        ) {
            isOneDay = true;

            // one day
            for (let i = 0; i < 24; i++) {
                let tempDate = Datetime.DateToZero(this.filterData.startDate);
                tempDate.setHours(i);
                let tempDateChartDataLower20 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.lower20,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataM21_30 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m21_30,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataM31_40 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m31_40,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataM41_50 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m41_50,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataM51_60 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m51_60,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataUpper61 = {
                    date: tempDate,
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.upper61,
                    maleCount: 0,
                    femaleCount: 0
                };

                for (let siteId of this.filterData.siteIds) {
                    let tempSiteChartDataLower20 = JSON.parse(
                        JSON.stringify(tempDateChartDataLower20)
                    );
                    tempSiteChartDataLower20.date = new Date(
                        tempSiteChartDataLower20.date
                    );
                    tempSiteChartDataLower20.siteObjectId = siteId;

                    let tempSiteChartDataM21_30 = JSON.parse(
                        JSON.stringify(tempDateChartDataM21_30)
                    );
                    tempSiteChartDataM21_30.date = new Date(
                        tempSiteChartDataM21_30.date
                    );
                    tempSiteChartDataM21_30.siteObjectId = siteId;

                    let tempSiteChartDataM31_40 = JSON.parse(
                        JSON.stringify(tempDateChartDataM31_40)
                    );
                    tempSiteChartDataM31_40.date = new Date(
                        tempSiteChartDataM31_40.date
                    );
                    tempSiteChartDataM31_40.siteObjectId = siteId;

                    let tempSiteChartDataM41_50 = JSON.parse(
                        JSON.stringify(tempDateChartDataM41_50)
                    );
                    tempSiteChartDataM41_50.date = new Date(
                        tempSiteChartDataM41_50.date
                    );
                    tempSiteChartDataM41_50.siteObjectId = siteId;

                    let tempSiteChartDataM51_60 = JSON.parse(
                        JSON.stringify(tempDateChartDataM51_60)
                    );
                    tempSiteChartDataM51_60.date = new Date(
                        tempSiteChartDataM51_60.date
                    );
                    tempSiteChartDataM51_60.siteObjectId = siteId;

                    let tempSiteChartDataUpper61 = JSON.parse(
                        JSON.stringify(tempDateChartDataUpper61)
                    );
                    tempSiteChartDataUpper61.date = new Date(
                        tempSiteChartDataUpper61.date
                    );
                    tempSiteChartDataUpper61.siteObjectId = siteId;

                    tempChartDatas.push(
                        tempSiteChartDataLower20,
                        tempSiteChartDataM21_30,
                        tempSiteChartDataM31_40,
                        tempSiteChartDataM41_50,
                        tempSiteChartDataM51_60,
                        tempSiteChartDataUpper61
                    );
                }
            }
        } else {
            // multiple days
            let dateList = Datetime.DateList(
                this.filterData.startDate,
                this.filterData.endDate
            );

            for (let dateItem of dateList) {
                let tempDateChartDataLower20 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.lower20,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataM21_30 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m21_30,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataM31_40 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m31_40,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataM41_50 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m41_50,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataM51_60 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.m51_60,
                    maleCount: 0,
                    femaleCount: 0
                };
                let tempDateChartDataUpper61 = {
                    date: new Date(dateItem.getTime()),
                    siteObjectId: "",
                    temperatureMin: 0,
                    temperatureMax: 0,
                    weather: EWeather.none,
                    ageRange: EAgeRange.upper61,
                    maleCount: 0,
                    femaleCount: 0
                };

                for (let siteId of this.filterData.siteIds) {
                    let tempSiteChartDataLower20 = JSON.parse(
                        JSON.stringify(tempDateChartDataLower20)
                    );
                    tempSiteChartDataLower20.date = new Date(
                        tempSiteChartDataLower20.date
                    );
                    tempSiteChartDataLower20.siteObjectId = siteId;

                    let tempSiteChartDataM21_30 = JSON.parse(
                        JSON.stringify(tempDateChartDataM21_30)
                    );
                    tempSiteChartDataM21_30.date = new Date(
                        tempSiteChartDataM21_30.date
                    );
                    tempSiteChartDataM21_30.siteObjectId = siteId;

                    let tempSiteChartDataM31_40 = JSON.parse(
                        JSON.stringify(tempDateChartDataM31_40)
                    );
                    tempSiteChartDataM31_40.date = new Date(
                        tempSiteChartDataM31_40.date
                    );
                    tempSiteChartDataM31_40.siteObjectId = siteId;

                    let tempSiteChartDataM41_50 = JSON.parse(
                        JSON.stringify(tempDateChartDataM41_50)
                    );
                    tempSiteChartDataM41_50.date = new Date(
                        tempSiteChartDataM41_50.date
                    );
                    tempSiteChartDataM41_50.siteObjectId = siteId;

                    let tempSiteChartDataM51_60 = JSON.parse(
                        JSON.stringify(tempDateChartDataM51_60)
                    );
                    tempSiteChartDataM51_60.date = new Date(
                        tempSiteChartDataM51_60.date
                    );
                    tempSiteChartDataM51_60.siteObjectId = siteId;

                    let tempSiteChartDataUpper61 = JSON.parse(
                        JSON.stringify(tempDateChartDataUpper61)
                    );
                    tempSiteChartDataUpper61.date = new Date(
                        tempSiteChartDataUpper61.date
                    );
                    tempSiteChartDataUpper61.siteObjectId = siteId;

                    tempChartDatas.push(
                        tempSiteChartDataLower20,
                        tempSiteChartDataM21_30,
                        tempSiteChartDataM31_40,
                        tempSiteChartDataM41_50,
                        tempSiteChartDataM51_60,
                        tempSiteChartDataUpper61
                    );
                }
            }
        }

        for (let tempChartData of tempChartDatas) {
            let tempDateFormat = isOneDay
                ? Datetime.DateTime2String(
                      tempChartData.date,
                      ReportService.datetimeFormat.hour
                  )
                : Datetime.DateTime2String(
                      tempChartData.date,
                      ReportService.datetimeFormat.date
                  );

            // 計算 maleCount、femaleCount
            for (let summary of datas) {
                let summaryDateFormat = isOneDay
                    ? Datetime.DateTime2String(
                          new Date(summary.date),
                          ReportService.datetimeFormat.hour
                      )
                    : Datetime.DateTime2String(
                          new Date(summary.date),
                          ReportService.datetimeFormat.date
                      );

                if (
                    summaryDateFormat == tempDateFormat &&
                    summary.site.objectId == tempChartData.siteObjectId
                ) {
                    let ageRangeIndex = 0;
                    switch (tempChartData.ageRange) {
                        case EAgeRange.lower20:
                            ageRangeIndex = 0;
                            break;
                        case EAgeRange.m21_30:
                            ageRangeIndex = 1;
                            break;
                        case EAgeRange.m31_40:
                            ageRangeIndex = 2;
                            break;
                        case EAgeRange.m41_50:
                            ageRangeIndex = 3;
                            break;
                        case EAgeRange.m51_60:
                            ageRangeIndex = 4;
                            break;
                        case EAgeRange.upper61:
                            ageRangeIndex = 5;
                            break;
                    }

                    summary.maleRanges[ageRangeIndex] =
                        summary.maleRanges[ageRangeIndex] === null
                            ? 0
                            : summary.maleRanges[ageRangeIndex];
                    summary.femaleRanges[ageRangeIndex] =
                        summary.femaleRanges[ageRangeIndex] === null
                            ? 0
                            : summary.femaleRanges[ageRangeIndex];
                    summary.maleEmployeeRanges[ageRangeIndex] =
                        summary.maleEmployeeRanges[ageRangeIndex] === null
                            ? 0
                            : summary.maleEmployeeRanges[ageRangeIndex];
                    summary.femaleEmployeeRanges[ageRangeIndex] =
                        summary.femaleEmployeeRanges[ageRangeIndex] === null
                            ? 0
                            : summary.femaleEmployeeRanges[ageRangeIndex];

                    tempChartData.maleCount +=
                        summary.maleRanges[ageRangeIndex];
                    tempChartData.femaleCount +=
                        summary.femaleRanges[ageRangeIndex];

                    if (
                        this.inputFormData.isIncludedEmployee ===
                        EIncludedEmployee.no
                    ) {
                        tempChartData.maleCount -=
                            summary.maleEmployeeRanges[ageRangeIndex];
                        tempChartData.femaleCount -=
                            summary.femaleEmployeeRanges[ageRangeIndex];
                    }
                }
            }

            // 取得天氣
            for (let i in this.responseData.weathers) {
                let weather = this.responseData.weathers[i];
                let weatherDateFormat = isOneDay
                    ? Datetime.DateTime2String(
                          new Date(weather.date),
                          ReportService.datetimeFormat.hour
                      )
                    : Datetime.DateTime2String(
                          new Date(weather.date),
                          ReportService.datetimeFormat.date
                      );

                if (
                    weatherDateFormat == tempDateFormat &&
                    weather.site.objectId == tempChartData.siteObjectId
                ) {
                    tempChartData.weather = WeatherService.WeatherIcon(
                        weather.icon
                    );
                    tempChartData.temperatureMin = weather.temperatureMin;
                    tempChartData.temperatureMax = weather.temperatureMax;
                    break;
                }
            }

            // TODO: Dwell time
            let tempRandomDwellTime = Math.floor(Math.random() * 6);
            if (tempRandomDwellTime == 0) {
                tempChartData.dwellTimeRange = EDwellTimeRange.lower5;
            } else if (tempRandomDwellTime == 1) {
                tempChartData.dwellTimeRange = EDwellTimeRange.m5_15;
            } else if (tempRandomDwellTime == 2) {
                tempChartData.dwellTimeRange = EDwellTimeRange.m15_30;
            } else if (tempRandomDwellTime == 3) {
                tempChartData.dwellTimeRange = EDwellTimeRange.m30_60;
            } else if (tempRandomDwellTime == 4) {
                tempChartData.dwellTimeRange = EDwellTimeRange.m60_120;
            } else {
                tempChartData.dwellTimeRange = EDwellTimeRange.upper120;
            }
            // TODO: Dwell time
        }

        this.chartDatas = tempChartDatas;
    }

    async receiveAreaId(areaId) {
        this.inputFormData.areaId = areaId;

        this.areaSummaryFilter = [];
        this.chartDatas = [];

        // 依照單一area篩選
        if (this.inputFormData.areaId && this.inputFormData.areaId !== "all") {
            for (const singleData of this.responseData.summaryDatas) {
                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];
                    if (detailKey === "area") {
                        if (
                            this.inputFormData.areaId ===
                            tempSingleData.objectId
                        ) {
                            this.areaSummaryFilter.push(singleData);
                        }
                    }
                }
            }

            this.sortOutChartData(this.areaSummaryFilter);
            this.areaMode = EAreaMode.single;
            this.inputFormData.groupId = "";
            this.inputFormData.deviceId = "";

            await this.initSelectItemDeviceGroup();
            await this.initSelectItemDevice();

            this.inputFormData.groupId = "all";
            this.inputFormData.deviceId = "all";

            // 依照all area篩選
        } else if (
            this.inputFormData.areaId &&
            this.inputFormData.areaId === "all"
        ) {
            this.sortOutChartData(this.responseData.summaryDatas);
            this.areaMode = EAreaMode.all;

            this.inputFormData.groupId = "";
            this.inputFormData.deviceId = "";

            await this.initSelectItemArea();
            await this.initSelectItemDeviceGroup();
            await this.initSelectItemDevice();

            this.inputFormData.groupId = "all";
            this.inputFormData.deviceId = "all";

            // 清除area篩選
        } else if (!this.inputFormData.areaId) {
            this.sortOutChartData(this.responseData.summaryDatas);
            this.areaMode = EAreaMode.all;

            this.inputFormData.areaId = "";
            this.inputFormData.groupId = "";
            this.inputFormData.deviceId = "";

            await this.initSelectItemArea();
            await this.initSelectItemDeviceGroup();
            await this.initSelectItemDevice();

            this.inputFormData.areaId = "all";
            this.inputFormData.groupId = "all";
            this.inputFormData.deviceId = "all";
        } else {
            return false;
        }
    }

    async receiveGroupId(groupId) {
        this.inputFormData.groupId = groupId;

        this.deviceGroupSummaryFilter = [];

        if (
            this.inputFormData.groupId &&
            this.inputFormData.groupId !== "all"
        ) {
            // 依照單一deviceGroup篩選
            for (const singleData of this.areaSummaryFilter) {
                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];

                    if (detailKey === "deviceGroups") {
                        if (
                            this.inputFormData.groupId ===
                            tempSingleData[0].objectId
                        ) {
                            this.deviceGroupSummaryFilter.push(singleData);
                        }
                    }
                }
            }

            this.sortOutChartData(this.deviceGroupSummaryFilter);

            this.inputFormData.deviceId = "";
            await this.initSelectItemDevice();
            this.inputFormData.deviceId = "all";

            // 依照all deviceGroups篩選
        } else if (
            this.inputFormData.areaId &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId === "all"
        ) {
            this.sortOutChartData(this.areaSummaryFilter);

            this.inputFormData.deviceId = "";
            await this.initSelectItemDevice();
            this.inputFormData.groupId = "all";
            this.inputFormData.deviceId = "all";

            // 清除deviceGroups篩選
        } else if (this.inputFormData.areaId && !this.inputFormData.groupId) {
            this.sortOutChartData(this.areaSummaryFilter);

            this.inputFormData.deviceId = "";
            await this.initSelectItemDevice();
            this.inputFormData.groupId = "all";
            this.inputFormData.deviceId = "all";
        } else {
            return false;
        }
    }

    async receiveDeviceId(deviceId) {
        this.inputFormData.deviceId = deviceId;
        this.deviceSummaryFilter = [];

        // 判斷沒有 deviceGroup
        if (
            ReportService.CheckObjectIfEmpty(this.deviceGroupSummaryFilter) &&
            this.inputFormData.groupId === "all"
        ) {
            // 依照device篩選
            for (const singleData of this.areaSummaryFilter) {
                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];

                    if (detailKey === "device") {
                        if (
                            this.inputFormData.deviceId ===
                            tempSingleData.objectId
                        ) {
                            this.deviceSummaryFilter.push(singleData);
                        }
                    }
                }
            }
            this.sortOutChartData(this.deviceSummaryFilter);

            // 清除device篩選
            if (
                this.inputFormData.areaId &&
                this.inputFormData.groupId &&
                !this.inputFormData.deviceId
            ) {
                this.sortOutChartData(this.areaSummaryFilter);

                this.inputFormData.deviceId = "";
                await this.initSelectItemDevice();
                this.inputFormData.deviceId = "all";

                // 依照all device篩選
            } else if (
                this.inputFormData.areaId &&
                this.inputFormData.groupId &&
                this.inputFormData.deviceId === "all"
            ) {
                this.sortOutChartData(this.areaSummaryFilter);

                this.inputFormData.deviceId = "";
                await this.initSelectItemDevice();
                this.inputFormData.deviceId = "all";
            } else {
                return false;
            }

            // 判斷有 deviceGroup，groupId 為 'all'，
        } else if (
            !ReportService.CheckObjectIfEmpty(this.deviceGroupSummaryFilter) &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId === "all"
        ) {
            // 依照device篩選
            for (const singleData of this.deviceGroupSummaryFilter) {
                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];

                    if (detailKey === "device") {
                        if (
                            this.inputFormData.deviceId ===
                            tempSingleData.objectId
                        ) {
                            this.deviceSummaryFilter.push(singleData);
                        }
                    }
                }
            }
            this.sortOutChartData(this.deviceSummaryFilter);

            // 清除device篩選
            if (
                this.inputFormData.areaId &&
                this.inputFormData.groupId &&
                !this.inputFormData.deviceId
            ) {
                this.sortOutChartData(this.deviceGroupSummaryFilter);

                this.inputFormData.deviceId = "";
                await this.initSelectItemDevice();
                this.inputFormData.deviceId = "all";

                // 依照all device篩選
            } else if (
                this.inputFormData.areaId &&
                this.inputFormData.groupId &&
                this.inputFormData.deviceId === "all"
            ) {
                this.sortOutChartData(this.deviceGroupSummaryFilter);

                this.inputFormData.deviceId = "";
                await this.initSelectItemDevice();
                this.inputFormData.deviceId = "all";
            } else {
                return false;
            }

            // 判斷有 deviceGroup，groupId 不為 'all'，
        } else if (
            !ReportService.CheckObjectIfEmpty(this.deviceGroupSummaryFilter) &&
            this.inputFormData.groupId &&
            this.inputFormData.groupId !== "all"
        ) {
            // 依照device篩選
            for (const singleData of this.deviceGroupSummaryFilter) {
                for (const detailKey in singleData) {
                    const tempSingleData = singleData[detailKey];

                    if (detailKey === "device") {
                        if (
                            this.inputFormData.deviceId ===
                            tempSingleData.objectId
                        ) {
                            this.deviceSummaryFilter.push(singleData);
                        }
                    }
                }
            }
            this.sortOutChartData(this.deviceSummaryFilter);

            // 清除device篩選
            if (
                this.inputFormData.areaId &&
                this.inputFormData.groupId &&
                !this.inputFormData.deviceId
            ) {
                this.sortOutChartData(this.deviceGroupSummaryFilter);

                this.inputFormData.deviceId = "";
                await this.initSelectItemDevice();
                this.inputFormData.deviceId = "all";

                // 依照all device篩選
            } else if (
                this.inputFormData.areaId &&
                this.inputFormData.groupId &&
                this.inputFormData.deviceId === "all"
            ) {
                this.sortOutChartData(this.deviceGroupSummaryFilter);

                this.inputFormData.deviceId = "";
                await this.initSelectItemDevice();
                this.inputFormData.deviceId = "all";
            } else {
                return false;
            }
        }
    }

    receiveType(type) {
        this.inputFormData.type = type;
        this.timeMode = type;
    }

    async receiveIsIncludedEmployee(isIncludedEmployee) {
        this.inputFormData.isIncludedEmployee = isIncludedEmployee;

        // 單一site
        if (this.filterData.firstSiteId) {
            this.sortOutChartData(this.responseData.summaryDatas);

            this.inputFormData.areaId = "";
            this.inputFormData.groupId = "";
            this.inputFormData.deviceId = "";

            await this.initSelectItemArea();
            await this.initSelectItemDeviceGroup();
            await this.initSelectItemDevice();

            this.inputFormData.areaId = "all";
            this.inputFormData.groupId = "all";
            this.inputFormData.deviceId = "all";
        }
    }

    // 一天的其中一小時
    receiveHour(hour) {
        let tempHour = new Date();
        tempHour.setHours(parseInt(hour), 0, 0, 0);

        this.hour = new Date(tempHour).toISOString();
        console.log("this.hour - ", this.hour);

        // let d =Datetime.DateTime2String(new Date('2000-01-01T01:00:00.000Z'), 'HH')
        // let d1 =Datetime.DateTime2String(new Date(this.hour), 'HH')
        // console.log('d - ', d);
        // console.log('d1 - ', d1);
        // console.log('?? - ', d1 === d);
    }

    // 多天的其中一天
    receiveDayArrayIndex(timeArrayIndex) {
        for (const index in this.dayArray) {
            if (timeArrayIndex === index) {
                this.dayArrayData = this.dayArray[index];
            }
        }

        console.log('this.dayArrayData ~ ', this.dayArrayData)
    }

    // Author: Tina
    sortOutReportToTemplateData() {
        this.ReportToTemplateData = {
            startDate: this.filterData.startDate,
            endDate: this.filterData.endDate,
            mode: EDeviceMode.heatmap,
            siteIds: this.filterData.siteIds,
            tagIds: this.filterData.tagIds,
            sendUserIds: this.userData,
            type: this.designationPeriod
        };
    }

    // Author: Tina
    pageToReportTemplate() {
        this.sortOutReportToTemplateData();
        this.$router.push({
            path: "/reports/",
            query: {
                reportToTemplateData: JSON.stringify(this.ReportToTemplateData)
            }
        });
    }

    ////////////////////////////////////// Tina End //////////////////////////////////////

    ////////////////////////////////////// Export //////////////////////////////////////

    // Author: Morris
    exportPDF() {
        let title = "";
        title += this._("w_Navigation_Report_Traffic");
        title += " ";
        title += Datetime.DateTime2String(
            this.startDate,
            HighchartsService.datetimeFormat.date
        );
        ReportPDFService.exportPDF(title);
    }

    /////////////////////////////////////////////////////////////////////
}
</script>

<style lang="scss" scoped>
</style>




