<template>
    <div class="animated fadeIn">

        <!-- Tina -->
        <filter-condition-campaign
            :yearSelectItem="yearSelectItem"
            :campaignAllData="campaignAllData"
            @submit-data="receiveFilterData"
        >
        </filter-condition-campaign>

        <iv-card
            :visible="visible"
            :label="filterData.campaignIds ? analysisTitle() : '' "
        >

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
            </template>

            <!-- Morris -->
            <highcharts-campaign-multiple
                v-if="chartMode.multiple"
                :value="chartDatas.multiple"
            >
            </highcharts-campaign-multiple>

            <highcharts-campaign-single
                v-if="chartMode.single"
                :value="chartDatas.single"
            >
            </highcharts-campaign-single>

            <campaign-event-table
                v-if="chartMode.multiple"
                :thresholdDetailTableContent="responseDataAllCampaignArray"
                :total="total"
            ></campaign-event-table>

            <campaign-table
                v-if="chartMode.single"
                :thresholdDetailTableContent="responseDataSingleCampaignArray"
            >
            </campaign-table>

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
import { Component, Vue } from "vue-property-decorator";
// Vue
// Report
import {
    ECampaignTimeType,
    IChartCampaignMultiple,
    IChartCampaignSingle
} from "@/components/Reports";
// Service
import ResponseFilter from "@/services/ResponseFilter";
import Loading from "@/services/Loading";

@Component({
    components: {}
})
export default class ReportCampaign extends Vue {
    chartMode: {
        multiple: boolean;
        single: boolean;
    } = {
        multiple: false,
        single: false
    };
    chartDatas: {
        multiple: IChartCampaignMultiple[];
        single: IChartCampaignSingle[];
    } = {
        multiple: [],
        single: []
    };

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    // recipient 相關
    modalShow: boolean = false;
    userData: any = [];
    sitesSelectItem: any = [];

    // 收合card控制
    visible: boolean = false;

    // 接收 Filter Condition 資料 相關
    filterData: any = {};
    responseDataAllCampaign: any = {};
    responseDataAllCampaignArray: any = [];
    responseDataSingleCampaign: any = {};
    responseDataSingleCampaignArray: any = [];
    total: number = 0;

    // send user 相關
    userSelectItem: any = {};

    yearSelectItem: any = {};
    campaignAllData: any = {};

    inputFormData: any = {
        year: "",
        campaignIds: [],
        siteIds: []
    };

    ////////////////////////////////////// Tina End //////////////////////////////////////

    created() {
        this.initData();
        // this.initChartDeveloper();
    }

    mounted() {}

    async initData() {
        await this.initSelectItemUsers();
        await this.initSelectYear();
        this.siteFilterPermission();
    }

    ////////////////////////////////////// Tina Start //////////////////////////////////////

    // Author: Tina
    siteFilterPermission() {
        for (const detail of this.$user.user.allowSites) {
            let site = { id: detail.objectId, text: detail.name };
            this.sitesSelectItem.push(site);

            // tempSitesSelectItem[detail.objectId] = detail.name;
        }
        // this.sitesSelectItem = tempSitesSelectItem;
    }

    async initSelectItemUsers() {
        let tempUserSelectItem = {};

        await this.$server
            .R("/user/user")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (response.results != undefined &&
                        response.results.length > 0) {
                        for (const returnValue of response.results) {
                            tempUserSelectItem[
                                returnValue.objectId
                            ] = `${returnValue.username} - ${returnValue.email}`;
                        }
                        this.userSelectItem = tempUserSelectItem;
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSelectYear() {
        let tempResult: {};
        let tempYearSelectItem = {};

        tempResult = await this.$server
            .R("/report/campaign/condition")
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });

        for (const year in tempResult) {
            tempYearSelectItem[year] = year;
            this.$set(this.campaignAllData, year, tempResult[year]);
        }

        this.campaignAllData = tempResult;
        this.yearSelectItem = tempYearSelectItem;
    }

    async receiveUserData(data) {
        this.userData = [];
        this.userData = data;
    }

    receiveModalShowData(data) {
        this.modalShow = data;
    }

    async receiveFilterData(filterData) {
        let param = {};
        this.responseDataAllCampaignArray = [];
        this.responseDataSingleCampaignArray = [];
        this.filterData = filterData;

        console.log("this.filterData - ", this.filterData);

        if (this.filterData.campaignIds.length > 1) {
            param = {
                campaignIds: this.filterData.campaignIds
            };

            Loading.show();
            await this.$server
                .C("/report/campaign/multi-campaign-summary", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            this.responseDataAllCampaign = response;
                            this.responseDataAllCampaignArray =
                                response.summaryDatas;
                            this.total = response.budgetTotal;
                            this.sortOutChartDataAllCampaign(
                                this.responseDataAllCampaign.summaryDatas
                            );
                            this.analysisTitle();
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else if (this.filterData.campaignIds.length === 1) {
            param = {
                campaignId: this.filterData.campaignIds[0],
                siteIds: this.filterData.siteIds
            };

            Loading.show();
            await this.$server
                .C("/report/campaign/single-campaign-summary", param)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            this.responseDataSingleCampaign = response;
                            this.responseDataSingleCampaignArray.push(response);
                            this.sortOutChartDataSingleCampaign(
                                this.responseDataSingleCampaign.summaryDatas
                            );
                            this.analysisTitle();
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else {
            return false;
        }
    }

    sortOutChartDataAllCampaign(datas: any) {
        this.chartDatas.multiple = [];

        let tempDateChartDataBefore: IChartCampaignMultiple = {
            name: "",
            startDate: new Date(),
            endDate: new Date(),
            traffic: 0,
            budget: 0,
            trafficGainPer: 0
        };

        for (let summary of datas) {
            let tempChartData = JSON.parse(
                JSON.stringify(tempDateChartDataBefore)
            );
            tempChartData = {
                name: summary.campaign.name,
                startDate: new Date(summary.startDate),
                endDate: new Date(summary.endDate),
                traffic: summary.traffic,
                budget: summary.budget,
                trafficGainPer: summary.trafficGainPer
            };
            this.chartDatas.multiple.push(tempChartData);
        }
        this.chartMode.multiple = true;
        this.chartMode.single = false;
        console.log("chartDatas.multiple - ", this.chartDatas.multiple);
    }

    sortOutChartDataSingleCampaign(datas: any) {
        this.chartDatas.single = [];

        let tempChartDataBefore: IChartCampaignSingle = {
            type: ECampaignTimeType.before,
            date: new Date(),
            traffic: 0
        };

        let tempChartDataDuring: IChartCampaignSingle = {
            type: ECampaignTimeType.during,
            date: new Date(),
            traffic: 0
        };

        let tempChartDataAfter: IChartCampaignSingle = {
            type: ECampaignTimeType.after,
            date: new Date(),
            traffic: 0
        };

        for (let summary of datas) {
            let tempChartDataBeforeItem = JSON.parse(
                JSON.stringify(tempChartDataBefore)
            );

            let tempChartDataDuringItem = JSON.parse(
                JSON.stringify(tempChartDataDuring)
            );

            let tempChartDataAfterItem = JSON.parse(
                JSON.stringify(tempChartDataAfter)
            );

            switch (summary.type) {
                case 0:
                    tempChartDataBeforeItem = {
                        type: ECampaignTimeType.before,
                        date: new Date(summary.date),
                        traffic: summary.traffic
                    };
                    this.chartDatas.single.push(tempChartDataBeforeItem);
                    break;
                case 1:
                    tempChartDataDuringItem = {
                        type: ECampaignTimeType.during,
                        date: new Date(summary.date),
                        traffic: summary.traffic
                    };
                    this.chartDatas.single.push(tempChartDataDuringItem);
                    break;
                case 2:
                    tempChartDataAfterItem = {
                        type: ECampaignTimeType.after,
                        date: new Date(summary.date),
                        traffic: summary.traffic
                    };
                    this.chartDatas.single.push(tempChartDataAfterItem);
                    break;
            }
        }
        this.chartMode.single = true;
        this.chartMode.multiple = false;
        console.log("chartDatas.single - ", this.chartDatas.single);
    }

    analysisTitle(): string {
        let title = "Analysis - ";

        title += `${this._("w_Title_FiscalYear")} ${this.filterData.year}.`;

        if (this.filterData.campaignIds.length === 1) {
            for (const campaignId in this.campaignAllData) {
                if (this.campaignAllData[campaignId].length > 0) {
                    this.campaignAllData[campaignId].map(item => {
                        if (this.filterData.campaignIds[0] === item.objectId) {
                            title += `${this._("w_Title_One_EventName")} ${
                                item.name
                            }. `;
                        }
                    });
                }
            }
        } else if (this.filterData.campaignIds.length >= 2) {
            title += `${this._("w_Title_EventName_Start")} ${
                this.filterData.campaignIds.length
            } ${this._("w_Title_EventName_End")} `;
        } else {
            title += "";
        }

        if (this.filterData.siteIds.length === 1) {
            for (const site of this.sitesSelectItem) {
                if (this.filterData.siteIds[0] === site.id) {
                    title += `${this._("w_Title_One_Site")} ${site.text}. `;
                }
            }
        } else if (this.filterData.siteIds.length >= 2) {
            title += `${this._("w_Title_Many_Site_Start")} ${
                this.filterData.siteIds.length
            } ${this._("w_Title_Many_Site_End")} `;
        } else {
            title += "";
        }

        this.visible = true;

        return title;
    }

    ////////////////////////////////////// Tina End //////////////////////////////////////

    ////////////////////////////////////// Export //////////////////////////////////////

    // Author: Ben
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

    // Author: Morris
    exportPDF() {
        // let title = "";
        // title += this._("w_Navigation_Report_Traffic");
        // title += " ";
        // title += Datetime.DateTime2String(
        //     this.startDate,
        //     HighchartsService.datetimeFormat.date
        // );
        //
        // ReportPDFService.exportPDF(title);
    }

    ///////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////

    // Author: Morris, Product remove
    initChartDeveloper() {
        let campaignMultipleTimeLength = 10;
        let campaignSingleTimeLength = 30;

        this.chartDatas.multiple = [];
        this.chartDatas.single = [];

        for (let i = 0; i < campaignMultipleTimeLength; i++) {
            let tempItem: IChartCampaignMultiple = {
                name: "Campaign " + i.toString(),
                startDate: new Date(),
                endDate: new Date(),
                traffic: Math.floor(Math.random() * 300),
                budget: Math.floor(Math.random() * 1000),
                trafficGainPer: Math.floor(Math.random())
            };
            tempItem.startDate.setDate(
                -Math.floor(Math.random() * i * campaignMultipleTimeLength) -
                    (campaignMultipleTimeLength - i)
            );
            tempItem.endDate.setDate(
                Math.floor(Math.random() * i * campaignMultipleTimeLength) -
                    (campaignMultipleTimeLength - i)
            );
            this.chartDatas.multiple.push(tempItem);
        }

        for (let i = 0; i < campaignSingleTimeLength; i++) {
            let tempItem: IChartCampaignSingle = {
                type: ECampaignTimeType.none,
                date: new Date(),
                traffic: Math.floor(Math.random() * 300)
            };
            let campaignSingleTimeIndex1 = campaignSingleTimeLength / 3;
            let campaignSingleTimeIndex3 = (campaignSingleTimeLength / 3) * 2;
            tempItem.date.setDate(-(campaignSingleTimeLength - i));
            if (i < campaignSingleTimeIndex1) {
                tempItem.type = ECampaignTimeType.before;
            } else if (i > campaignSingleTimeIndex3) {
                tempItem.type = ECampaignTimeType.after;
            } else {
                tempItem.type = ECampaignTimeType.during;
            }
            this.chartDatas.single.push(tempItem);
        }

        this.chartMode.multiple = true;
        this.chartMode.single = true;
    }
}
</script>


<style lang="scss" scoped>
</style>




