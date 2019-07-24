<template>
    <div class="animated fadeIn">

        <filter-condition-vip-and-blacklist
            :label="_('w_ReportFilterConditionComponent_')"
            :tagSelectItem="tagSelectItem"
            :templateItem="templateItem"
            :sitesSelectItem="sitesSelectItem"
            :allTagsItem="allTagsItem"
            :tagIncludeSitesItem="tagIncludeSitesItem"
            :addPeriodSelectItem="addPeriodSelectItem"
            @submit-data="receiveFilterData"
        >
        </filter-condition-vip-and-blacklist>

        <iv-card
            :visible="visible"
            :label="filterData.tagIds.length !== 0 ? analysisTitle() : '' "
        >
            <!--                        :label="filterData.siteIds.length !== 0 ? analysisTitle() : '' "
-->

            <template #toolbox>
                <!-- Ben -->
                <iv-toolbox-export-excel
                    size="lg"
                    @click="exportExcel(eFileType.xlsx)"
                />
                <iv-toolbox-export-csv
                    size="lg"
                    @click="exportExcel(eFileType.csv)"
                />

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

            <highcharts-vip-tracking
                :startDate="startDate"
                :endDate="endDate"
                :tagIds="tagIds"
                :sites="sites"
                :value="chartDatas"
            >
            </highcharts-vip-tracking>
        </iv-card>

        <!-- Tina -->
        <recipient
            :modalShow="modalShow"
            :userSelectItem="userSelectItem"
            @user-data="receiveUserData"
            @return-modalShow="receiveModalShowData"
        ></recipient>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

// Vue
import HighchartsVipTracking from "@/components/Reports/Highcharts/HighchartsVipTracking.vue";

// Report
import {
    EDesignationPeriod,
    EDeviceMode,
    EVipTrackingType,
    ITemplateItem,
    ISite,
    IChartVipTrackingData,
    EAddPeriodSelect
} from "@/components/Reports";

// Service
import Dialog from "@/services/Dialog";
import ResponseFilter from "@/services/ResponseFilter";
import HighchartsService from "@/components/Reports/models/HighchartsService";
import ReportService from "@/components/Reports/models/ReportService";
import Datetime from "@/services/Datetime";
import Loading from "@/services/Loading";

// Export
import ReportPDFService from "@/components/Reports/models/ReportPDFService";

@Component({
    components: {}
})
export default class ReportVIPTracking extends Vue {
    templateItem: ITemplateItem | null = null;

    ////////////////////////////////////// Morris Start //////////////////////////////////////
    startDate: Date = new Date("2019-01-01T00:00:00.000Z");
    endDate: Date = new Date("2019-01-01T01:00:00.000Z");
    tagIds: string[] = [];
    sites: ISite[] = [];
    chartDatas: IChartVipTrackingData[] = [];

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    //// Filter Condition Start ////

    selectItem = {
        site: [],
        area: [],
        tags: []
    };

    // select 相關
    tagSelectItem: any = [];
    addPeriodSelectItem: any = [];
    sitesSelectItem: any = {};
    tagIncludeSitesItem: any = [];
    allTagsItem: any = [];

    // OfficeHour 相關
    officeHourItemDetail: any = [];

    // 收合card控制
    visible: boolean = false;

    // recipient 相關
    modalShow: boolean = false;

    // 接收 Filter Condition 資料 相關
    filterData: any = {
        startDate: new Date(),
        endDate: new Date(),
        tagIds: [],
        siteIds: []
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
        this.initChartDeveloper();
    }

    mounted() {}

    // Author: Tina
    async initDatas() {
        this.siteFilterPermission();
        this.initSelect();
        await this.initSelectItemTag();
        await this.initTagIncludeSitesItem();
    }

    initSelect() {
        this.addPeriodSelectItem = [
            { value: EAddPeriodSelect.period, text: this._("w_period") },
            {
                value: EAddPeriodSelect.designation,
                text: this._("w_Designation")
            }
        ];
    }

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    siteFilterPermission() {
        let tempSitesSelectItem = {};
        for (const detail of this.$user.allowSites) {
            tempSitesSelectItem[detail.objectId] = detail.name;
        }
        this.sitesSelectItem = tempSitesSelectItem;
    }

    // Author: Tina
    async initSelectItemTag() {
        let tempTagSelectItem = {};

        await this.$server
            .R("/tag/all")
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response) {
                        // 自定義 tagSelectItem 的 key 的方式
                        // tempTagSelectItem[returnValue.objectId] =
                        //     returnValue.name;

                        let tad = {
                            id: returnValue.objectId,
                            text: returnValue.name
                        };
                        this.tagSelectItem.push(tad);
                    }
                    // this.tagSelectItem = tempTagSelectItem;
                }
            })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });

        for (const detail of this.tagSelectItem) {
            this.allTagsItem.push(detail.id);
        }
    }

    async initTagIncludeSitesItem() {
        let result = await this.$server
            .R("/tag")
            // .then((response: any) => {
            //     if (response != undefined) {
            //         for (const returnValue of response) {
            //             // 自定義 tagSelectItem 的 key 的方式
            //             tempTagSelectItem[returnValue.objectId] =
            //                 returnValue.name;
            //         }
            //         this.tagSelectItem = tempTagSelectItem;
            //     }
            // })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });

        if (result["results"].length > 0) {
            result["results"].map(item => {
                this.tagIncludeSitesItem.push(item);
            });
        } else {
            return false;
        }
    }

    // Author: Tina
    async receiveFilterData(filterData, designationPeriod) {
        let param = JSON.parse(JSON.stringify(filterData));
        this.filterData = filterData;
        this.designationPeriod = designationPeriod;

        console.log('this.filterData ~ ', this.filterData)

        // await this.$server
        //     .C("/report/people-counting/summary", param)
        //     .then((response: any) => {
        //         if (response !== undefined) {
        //             this.responseData = response;
        //             this.officeHourItemDetail = this.responseData.officeHours;
        //             this.resolveSummary();
        //         }
        //     })
        //     .catch((e: any) => {
        //         return ResponseFilter.base(this, e);
        //     });
    }

    resolveSummary() {
        // get office hour data
        let tempISite: any = {};
        this.sites = [];

        for (const filterSiteId of this.filterData.siteIds) {
            for (const detail of this.officeHourItemDetail) {
                for (const officeHourSiteId of detail.sites) {
                    if (filterSiteId === officeHourSiteId.objectId) {
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
    }

    analysisTitle(): string {
        let title = "Analysis - ";

        if (this.filterData.tagIds.length === 1) {
            for (const tagId of this.tagSelectItem) {
                if (this.filterData.tagIds[0] === tagId.id) {
                    title += `${this._("w_Title_One_Tag")} ${tagId.text}. `;
                }
            }
        } else if (this.filterData.tagIds.length >= 2) {
            title += `${this._("w_Title_Many_Tag_Start")} ${
                this.filterData.tagIds.length
            } ${this._("w_Title_Many_Tag_End")} `;
        } else {
            title += "";
        }

        // if (this.filterData.siteIds.length === 1) {
        //     for (const siteId in this.sitesSelectItem) {
        //         if(this.filterData.siteIds[0] === siteId) {
        //             title += `${this._('w_Title_One_Site')} ${this.sitesSelectItem[siteId]}. `;
        //         }
        //     }
        // } else {
        //     title += `${this._('w_Title_Many_Site_Start')} ${this.filterData.siteIds.length} ${this._('w_Title_Many_Site_End')} `;
        // }

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

    async receiveUserData(data) {
        this.userData = [];
        this.userData = data;
    }

    receiveModalShowData(data) {
        this.modalShow = data;
    }

    // Author: Tina
    sortOutReportToTemplateData() {
        this.ReportToTemplateData = {
            startDate: this.filterData.startDate,
            endDate: this.filterData.endDate,
            mode: EDeviceMode.humanDetection,
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

    // Author: Morris
    exportPDF() {
        let title = "";
        title += this._("w_Navigation_Report_VIPBlackList");
        title += " ";
        title += Datetime.DateTime2String(
            this.startDate,
            HighchartsService.datetimeFormat.date
        );

        ReportPDFService.exportPDF(title);
    }

    exportExcel(fType) {
        // let reportTable: any = null;
        // if (this.tableStep == ETableStep.mainTable) {
        //     reportTable = this.$refs.reportTable;
        // } else {
        //     reportTable = this.$refs.sunReportTable;
        // }
        // let tableData = reportTable.tableToArray();
        //
        // //th
        // let th = [];
        // for (let title of tableData[0]) {
        //     th.push(title);
        // }
        //
        // //data
        // let data = [];
        // for (let bodys of tableData) {
        //     if (tableData.indexOf(bodys) == 0) continue;
        //     data.push(bodys);
        // }
        // let [fileName, fileType, sheetName] = [
        //     this._("w_Navigation_VideoSources_Demographic"),
        //     fType,
        //     Datetime.DateTime2String(this.startDate, "YYYY-MM-DD")
        // ];
        // toExcel({ th, data, fileName, fileType, sheetName });
    }

    ///////////////////////////////////////////////////////

    // Author: Morris, Product remove
    initChartDeveloper() {
        // single day
        this.startDate = new Date("2019-07-01T08:00:00.000Z");
        this.endDate = new Date("2019-07-01T14:00:00.000Z");

        // Multiple day
        this.startDate = new Date("2019-06-20T08:00:00.000Z");
        this.endDate = new Date("2019-08-10T14:00:00.000Z");

        let siteLength = 10;

        for (let j = 0; j < siteLength; j++) {
            let tempJ = j + 1;
            this.tagIds.push("TagId" + tempJ.toString());
            this.sites.push({
                objectId: "site" + tempJ.toString(),
                name: "Site " + tempJ.toString(),
                officeHour: [
                    {
                        startDay: "0",
                        endDay: "6",
                        startDate: "2000-01-01T00:00:00.000Z",
                        endDate: "2000-01-01T14:00:00.000Z"
                    }
                ]
            });

            for (let i = 1; i < 20; i++) {
                let tempI = i;
                let iNumber = tempI;
                let iString = tempI.toString();
                let iString10 = iNumber < 10 ? `0${iString}` : iString;
                let tempDate = new Date(`2019-07-${iString10}T00:00:00.000Z`);
                let tempVipTrackingType =
                    Math.floor(Math.random() * 300) % 2 == 0
                        ? EVipTrackingType.vip
                        : EVipTrackingType.blacklist;
                let tempChartData: IChartVipTrackingData = {
                    type: tempVipTrackingType,
                    date: tempDate,
                    personCount: Math.floor(Math.random() * 50)
                };
                this.chartDatas.push(tempChartData);
            }
        }
    }
}
</script>


<style lang="scss" scoped>
</style>




