<template>
    <div class="animated fadeIn">
        <iv-card
            v-show="pageStep === ePageStep.list"
            :label=" _('w_ReportTemplate_List') "
        >
            <template #toolbox>

                <iv-toolbox-view
                    :disabled="isSelected.length !== 1"
                    @click="pageToView"
                />
                <iv-toolbox-edit
                    :disabled="isSelected.length !== 1"
                    @click="pageToEdit(ePageStep.edit)"
                />
                <iv-toolbox-copy
                    :disabled="isSelected.length !== 1"
                    @click="pageToDuplicate(ePageStep.duplicate)"
                />
                <iv-toolbox-delete
                    :disabled="isSelected.length === 0"
                    @click="doDelete"
                />
                <iv-toolbox-divider />
                <iv-toolbox-add @click="pageToAdd(ePageStep.add)" />

            </template>

            <iv-table
                ref="tagTable"
                :interface="ITableList()"
                :multiple="tableMultiple"
                :server="{ path: '/report/template' }"
                @selected="selectedItem($event)"
            >

                <template #sites="{$attrs}">
                    {{ showFirst($attrs.value) }}
                </template>

                <template #mode="{$attrs}">
                    {{ getMode($attrs.value) }}
                </template>

                <template #type="{$attrs}">
                    {{ getType($attrs.value) }}
                </template>


                <template #startDate="{$attrs}">
                    {{ $attrs.value ? dateToYYYY_MM_DD($attrs.value) : ''}}
                </template>

                <template #endDate="{$attrs}">
                    {{ $attrs.value ? dateToYYYY_MM_DD($attrs.value) : ''}}
                </template>


                <template #sendDates="{$attrs}">
                    <div v-html="getReportTimeTable($attrs.value)"></div>
                </template>


                <template #sendUsers="{$attrs}">
                    {{ showFirst($attrs.value) }}
                </template>

                <template #Actions="{$attrs, $listeners}">
                    <iv-toolbox-more :disabled="isSelected.length !== 1">
                        <iv-toolbox-copy @click="pageToDuplicate(ePageStep.duplicate)" />
                        <iv-toolbox-view @click="pageToView" />
                        <iv-toolbox-edit @click="pageToEdit(ePageStep.edit)" />
                        <iv-toolbox-delete @click="doDelete" />
                    </iv-toolbox-more>
                </template>



                <template #goToReport="{$attrs}">
                    <div class="mt-2 ml-3 mb-3">
                        <b-button @click='goToReport($attrs)'>
                            {{ _('w_ReportTemplate_goToReport') }}
                        </b-button>
                    </div>
                </template>

            </iv-table>
        </iv-card>

        <!--From (Add and Edit and Duplicate)-->
        <iv-auto-card
            v-show="pageStep === ePageStep.add || pageStep === ePageStep.edit || pageStep === ePageStep.duplicate"
            :visible="true"
            :label=showLabelTitle()
        >

            <template #toolbox>
                <iv-toolbox-back @click="pageToList()" />
            </template>


            <iv-form
                :interface="IAddAndEditForm()"
                :value="inputFormData"
                @update:*="tempSaveInputData($event)"
                @submit="saveAddOrEdit($event)"
            >


                <template #selectTree="{ $attrs, $listeners }">

                    <div class="mt-2 ml-3 mb-3">
                        <b-button @click="pageToChooseTree">
                            {{ _('w_SelectSiteTree') }}
                        </b-button>
                    </div>
                </template>

                <template #ReportPeriodTitle="{ $attrs, $listeners }">
                    <div class="ml-3 mb-2 w-100">{{ _('w_ReportTemplate_ReportPeriod1') }}</div>
                </template>

                <template #selectPeriodAddWay="{ $attrs, $listeners }">
                    <b-col
                        cols="3"
                        class="mb-3"
                    >
                        <b-form-radio-group
                            v-model="selectPeriodAddWay"
                            :options="addPeriodSelectItem"
                            buttons
                            button-variant="outline-success"
                            name="radio-btn-outline"
                            @change="changeAddPeriodSelect"
                        ></b-form-radio-group>
                    </b-col>
                </template>

                <iv-form-selection
                    v-bind="$attrs"
                    v-on="$listeners"
                    :multiple="false"
                    :options="designationPeriodSelectItem"
                >
                </iv-form-selection>

                <template #sendReportTimeTitle="{ $attrs, $listeners }">
                    <div class="ml-3 mb-2 w-100">{{ _('w_ReportTemplate_SendReportTime1') }}</div>
                </template>

                <template #sendDates="{$attrs, $listeners}">
                    <b-form-group class="ml-3">
                        <b-row
                            v-for="(value, index) in sendReportTime"
                            :key="'sendReportTime' + index"
                        >
                            <b-col cols="4">
                                <b-form-select
                                    class="mb-2"
                                    v-model="sendReportTime[index].week"
                                    :plain="true"
                                    :options="timeSelectItem.weeks"
                                ></b-form-select>
                            </b-col>

                            <b-col cols="4">
                                <b-form-select
                                    v-model="sendReportTime[index].hour"
                                    :plain="true"
                                    :options="timeSelectItem.hours"
                                ></b-form-select>
                            </b-col>

                            <b-col cols="1">
                                <b-button
                                    class="button addButton"
                                    variant="success"
                                    type="button"
                                    @click="addSendReportTime()"
                                >
                                    <i class="fa fa-plus"></i>
                                </b-button>
                            </b-col>

                            <b-col cols="1">
                                <b-button
                                    v-show="index === 0"
                                    class="button"
                                    variant="danger"
                                    type="button"
                                    style="visibility:hidden"
                                    @click="removeSendReportTime(index)"
                                >
                                    <i class="fa fa-minus"></i>

                                </b-button>
                            </b-col>

                            <b-col cols="1">
                                <b-button
                                    v-show="index !== 0"
                                    class="button"
                                    variant="danger"
                                    type="button"
                                    @click="removeSendReportTime(index)"
                                >
                                    <i class="fa fa-minus"></i>

                                </b-button>
                            </b-col>

                        </b-row>
                    </b-form-group>

                </template>

            </iv-form>

            <template #footer-before>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToList()"
                >{{ _('w_Back') }}
                </b-button>
            </template>

        </iv-auto-card>

        <!-- view -->
        <iv-card
            v-show="pageStep === ePageStep.view"
            :visible="true"
            :label=" _('w_ReportTemplate_View') "
        >
            <template #toolbox>
                <iv-toolbox-back @click="pageToList()" />
            </template>

            <iv-form
                :interface="IViewForm()"
                :value="inputFormData"
            >
            </iv-form>

            <template #footer>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToList()"
                >{{ _('w_Back') }}
                </b-button>
            </template>

        </iv-card>

        <!-- region tree select -->
        <region-tree-select
            v-show="pageStep === ePageStep.chooseTree"
            :multiple="true"
            :regionTreeItem="regionTreeItem"
            :selectType="selectType"
            :selecteds="selecteds"
            v-on:click-back="pageToShowResult"
        >
        </region-tree-select>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import { ITag, ITagReadUpdate } from "@/config/default/api/interfaces";
import {
    ERegionType,
    IRegionItem,
    RegionTreeItem,
    IRegionTreeSelected
} from "@/components/RegionTree";
import { RegionTreeSelect } from "@/components/RegionTree/RegionTreeSelect.vue";
import {
    EAddPeriodSelect,
    EDesignationPeriod
} from "@/components/Reports/models/EReport";

import RegionAPI from "@/services/RegionAPI";
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";

import { EWeeks, EVideoSource } from "@/components/Reports";
import { ITemplateItem } from "@/components/Reports";

enum EPageStep {
    list = "list",
    add = "add",
    edit = "edit",
    view = "view",
    duplicate = "duplicate",
    none = "none",
    showResult = "showResult",
    chooseTree = "chooseTree"
}

const timeItem = {
    week: "1",
    hour: "22"
};

@Component({
    components: {}
})
export default class ReportTemplate extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.list;

    isSelected: any = [];
    tableMultiple: boolean = true;

    selectedDetail: any = [];

    // select 相關
    sitesSelectItem: any = {};
    metricSelectItem: any = {};
    userSelectItem: any = {};
    tagSelectItem: any = {};

    timeSelectItem: any = {
        weeks: [
            { value: "0", text: EWeeks.Sunday },
            { value: "1", text: EWeeks.Monday },
            { value: "2", text: EWeeks.Tuesday },
            { value: "3", text: EWeeks.Wednesday },
            { value: "4", text: EWeeks.Thursday },
            { value: "5", text: EWeeks.Friday },
            { value: "6", text: EWeeks.Saturday }
        ],
        hours: []
    };

    addPeriodSelectItem: any = [];
    designationPeriodSelectItem: any = {};

    // tree 相關
    selectType = ERegionType.site;
    regionTreeItem = new RegionTreeItem();
    selecteds: IRegionTreeSelected[] = [];

    inputFormData: any = {};
    sendReportTime: any = [{ week: "1", hour: "22" }];
    selectPeriodAddWay: string = EAddPeriodSelect.period;

    created() {}

    mounted() {
        this.initDayRanges();
        this.initSelectItem();
    }

    clearInputData() {
        this.inputFormData = {
            objectId: "",
            name: "",
            siteIds: [],
            tagIds: [],
            type: EDesignationPeriod.today,
            mode: "",
            endDate: new Date(),
            startDate: new Date(),
            sendDates: '',
            sendUserIds: [],

            stepType: "",

            siteIdsText: "",
            tagIdsText: "",
            modeText: '',
            typeText: '',
            startDateText: '',
            endDateText: '',
            sendDatesText: '',
            sendUsersText: '',
        };
    }

    initSelectItem() {
        this.addPeriodSelectItem = [
            { value: EAddPeriodSelect.period, text: this._("w_period") },
            {
                value: EAddPeriodSelect.designation,
                text: this._("w_Designation")
            }
        ];

        this.designationPeriodSelectItem = {
            today: this._("w_Today"),
            yesterday: this._("w_Yesterday"),
            last7days: this._("w_last7days"),
            thisWeek: this._("w_thisWeek"),
            lastWeek: this._("w_lastWeek"),
            thisMonth: this._("w_thisMonth"),
            lastMonth: this._("w_lastMonth"),
            q1: this._("w_q1"),
            q2: this._("w_q2"),
            q3: this._("w_q3"),
            q4: this._("w_q4"),
            thisYear: this._("w_thisYear")
        };

        this.metricSelectItem = {
            peopleCounting: this._("w_Navigation_VideoSources_PeopleCounting"),
            humanDetection: this._("w_Navigation_VideoSources_HumanDetection"),
            heatmap: this._("w_Navigation_VideoSources_Heatmap"),
            dwellTime: this._("w_Navigation_VideoSources_DwellTime"),
            demographic: this._("w_Navigation_VideoSources_Demographic"),
            visitor: this._("w_Navigation_VideoSources_Visitor")
        };
    }

    async initSelectItemSite() {
        this.sitesSelectItem = {};

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
                        this.sitesSelectItem[returnValue.objectId] =
                            returnValue.name;
                        this.regionTreeItem.tree = RegionAPI.analysisApiResponse(
                            returnValue
                        );
                    }
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });
    }

    async initSelectItemTree() {
        await this.$server
            .R("/location/tree")
            .then((response: any) => {
                if (response != undefined) {
                    this.regionTreeItem.tree = RegionAPI.analysisApiResponse(
                        response
                    );
                    this.regionTreeItem.region = this.regionTreeItem.tree;
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
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
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });
    }

    async initSelectItemUsers() {
        this.userSelectItem = {};

        await this.$server
            .R("/user/user")
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response.results) {
                        // 自定義 userSelectItem 的 key 的方式
                        this.userSelectItem[
                            returnValue.objectId
                        ] = `${returnValue.username} : ${returnValue.email}`;
                    }
                }
            })
            .catch((e: any) => {
                if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                    return ResponseFilter.base(this, e);
                }
                console.log(e);
                return false;
            });
    }

    initRegionTreeSelect() {
        this.regionTreeItem = new RegionTreeItem();
        this.regionTreeItem.titleItem.card = this._("w_SiteTreeSelect");
    }

    initDayRanges() {
        for (let i = 0; i < 25; i++) {
            const tempHour =
                i === 24 ? "00" : i < 10 ? "0" + i.toString() : i.toString();
            const tempValue =
                tempHour + ":00" + (i < 12 || i > 23 ? " am" : " pm");
            const tempObject = { value: i.toString(), text: tempValue };
            this.timeSelectItem.hours.push(tempObject);
        }
    }

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
    }

    getInputData() {
        this.clearInputData();
        for (const param of this.selectedDetail) {

            this.inputFormData = {
                objectId: param.objectId,
                name: param.name,
                siteIds: param.sites,
                tagIds: param.tags,
                stepType: "",
                mode: param.mode,
                type: param.type ? param.type : '',
                startDate: param.startDate ? new Date(param.startDate) : null,
                endDate: param.endDate ? new Date(param.endDate) : null,
                // endDate: new Date(param.endDate),
                sendDates: param.sendDates,
                sendUserIds: param.sendUsers,

                siteIdsText: this.idsToText(param.sites),
                tagIdsText: this.idsToText(param.tags),
                modeText: this.getMode(param.mode),
                typeText: this.getType(param.type),
                startDateText: param.startDate ? this.dateToYYYY_MM_DD(param.startDate) : '',
                endDateText: param.endDate ? this.dateToYYYY_MM_DD(param.endDate) : '',
                sendDatesText: this.getReportTimeView(param.sendDates),
                sendUsersText: this.idsToText(param.sendUsers)
            };
        }

    }

    tempSaveInputData(data) {
        switch (data.key) {

            case "name":
                this.inputFormData.name = data.value;
                break;
            case "tagIds":
                this.inputFormData.tagIds = data.value;
                break;
            case "siteIds":
                this.inputFormData.siteIds = data.value;
                break;
            case "type":
                this.inputFormData.type = data.value;
                break;
            case "mode":
                this.inputFormData.mode = data.value;
                break;
            case "startDate":
                this.inputFormData.startDate = data.value;
                break;
            case "endDate":
                this.inputFormData.endDate = data.value;
                break;
            case "sendUserIds":
                this.inputFormData.sendUserIds = data.value;
                break;

        }

        this.selecteds = [];

        for (const id of this.inputFormData.siteIds) {
            for (const detail in this.sitesSelectItem) {
                if (id === detail) {
                    let selectedsObject: IRegionTreeSelected = {
                        objectId: detail,
                        type: ERegionType.site,
                        name: this.sitesSelectItem[detail]
                    };
                    this.selecteds.push(selectedsObject);
                }
            }
        }
    }

    async pageToAdd(stepType: string) {
        this.pageStep = EPageStep.add;
        await this.initSelectItemSite();
        await this.initSelectItemUsers();
        await this.initSelectItemTag();
        this.clearInputData();
        this.selecteds = [];
        this.inputFormData.stepType = stepType;
        this.sendReportTime = [{ week: "1", hour: "22" }];

    }

    async pageToDuplicate(stepType: string) {
        this.pageStep = EPageStep.duplicate;
        this.getInputData();
        await this.initSelectItemSite();
        await this.initSelectItemUsers();
        await this.initSelectItemTag();

        this.inputFormData.stepType = stepType;

        this.inputFormData.name = '';
        this.inputFormData.objectId = '';
        this.selecteds = [];
        this.sendReportTime = [];

        let hour = "";
        let week = "";

        // sendDates
        this.inputFormData.sendDates.map(item => {
            hour = Datetime.DateTime2String(new Date(item.date), "H");
            week = item.day;
            const tempSendReportTime = {
                hour, week
            };
            this.sendReportTime.push(tempSendReportTime);
            this.inputFormData.sendDates = JSON.parse(
                JSON.stringify(this.sendReportTime)
            );
        });

        // Select Report Period
        if (this.inputFormData.type && !this.inputFormData.startDate && !this.inputFormData.endDate) {
            this.selectPeriodAddWay = EAddPeriodSelect.designation;
            // this.inputFormData.startDate = JSON.parse(JSON.stringify(this.inputFormData.type));
        }

        if (!this.inputFormData.type && this.inputFormData.startDate&& this.inputFormData.endDate) {
            //  console.log(' - ', this.inputFormData.startDate, this.inputFormData.endDate);

            this.selectPeriodAddWay = EAddPeriodSelect.period;
            // this.inputFormData.startDate = new Date(this.inputFormData.startDate);
            // this.inputFormData.endDate = new Date(this.inputFormData.endDate);

        }

        // select Ids
        this.inputFormData.siteIds = JSON.parse(
            JSON.stringify(
                this.inputFormData.siteIds.map(item => item.objectId)
            )
        );
        this.inputFormData.tagIds = JSON.parse(
            JSON.stringify(
                this.inputFormData.tagIds.map(item => item.objectId)
            )
        );
        this.inputFormData.sendUserIds = JSON.parse(
            JSON.stringify(
                this.inputFormData.sendUserIds.map(item => item.objectId)
            )
        );


    }

    async pageToEdit(stepType: string) {
        this.pageStep = EPageStep.edit;
        this.getInputData();
        await this.initSelectItemSite();
        await this.initSelectItemUsers();
        await this.initSelectItemTag();

        this.inputFormData.stepType = stepType;

        this.selecteds = [];
        this.sendReportTime = [];

        let hour = "";
        let week = "";

        // sendDates
        this.inputFormData.sendDates.map(item => {
            hour = Datetime.DateTime2String(new Date(item.date), "H");
            week = item.day;
            const tempSendReportTime = {
                hour, week
            };
            this.sendReportTime.push(tempSendReportTime);
            this.inputFormData.sendDates = JSON.parse(
                JSON.stringify(this.sendReportTime)
            );
        });

        // Select Report Period
        if (this.inputFormData.type && !this.inputFormData.startDate && !this.inputFormData.endDate) {
            this.selectPeriodAddWay = EAddPeriodSelect.designation;
            // this.inputFormData.startDate = JSON.parse(JSON.stringify(this.inputFormData.type));
        }

        if (!this.inputFormData.type && this.inputFormData.startDate&& this.inputFormData.endDate) {
           //  console.log(' - ', this.inputFormData.startDate, this.inputFormData.endDate);

            this.selectPeriodAddWay = EAddPeriodSelect.period;
            // this.inputFormData.startDate = new Date(this.inputFormData.startDate);
            // this.inputFormData.endDate = new Date(this.inputFormData.endDate);

        }

        // select Ids
        this.inputFormData.siteIds = JSON.parse(
            JSON.stringify(
                this.inputFormData.siteIds.map(item => item.objectId)
            )
        );
        this.inputFormData.tagIds = JSON.parse(
            JSON.stringify(
                this.inputFormData.tagIds.map(item => item.objectId)
            )
        );
        this.inputFormData.sendUserIds = JSON.parse(
            JSON.stringify(
                this.inputFormData.sendUserIds.map(item => item.objectId)
            )
        );
    }

    pageToView() {
        this.pageStep = EPageStep.view;
        this.getInputData();
    }

    pageToList() {
        this.pageStep = EPageStep.list;
        (this.$refs.tagTable as any).reload();
        this.selecteds = [];
    }

    async pageToChooseTree() {
        this.pageStep = EPageStep.chooseTree;
        this.initRegionTreeSelect();
        await this.initSelectItemTree();
        this.selecteds = [];
        for (const id of this.inputFormData.siteIds) {
            for (const detail in this.sitesSelectItem) {
                if (id === detail) {
                    let selectedsObject: IRegionTreeSelected = {
                        objectId: detail,
                        type: ERegionType.site,
                        name: this.sitesSelectItem[detail]
                    };
                    this.selecteds.push(selectedsObject);
                }
            }
        }
    }

    pageToShowResult() {

        if (this.inputFormData.stepType === EPageStep.edit) {
            this.pageStep = EPageStep.edit;
            // siteIds clear
            this.inputFormData.siteIds = [];

            // from selecteds push siteIds
            for (const item of this.selecteds) {
                this.inputFormData.siteIds.push(item.objectId);
            }
        }

        if (this.inputFormData.stepType === EPageStep.add) {
            this.pageStep = EPageStep.add;

            // siteIds clear
            this.inputFormData.siteIds = [];

            // from selecteds push siteIds
            for (const item of this.selecteds) {
                this.inputFormData.siteIds.push(item.objectId);
            }
        }

        if (this.inputFormData.stepType === EPageStep.duplicate) {
            this.pageStep = EPageStep.duplicate;

            // siteIds clear
            this.inputFormData.siteIds = [];

            // from selecteds push siteIds
            for (const item of this.selecteds) {
                this.inputFormData.siteIds.push(item.objectId);
            }
        }
    }

    addSendReportTime() {
        var tempTimeItem = JSON.parse(JSON.stringify(timeItem));
        this.sendReportTime.push(tempTimeItem);
    }

    removeSendReportTime(index: number) {
        this.sendReportTime.splice(index, 1);
    }

    changeAddPeriodSelect(selected: string) {
        this.selectPeriodAddWay = selected;
        this.inputFormData.type = "today";
        this.inputFormData.startDate = new Date();
        this.inputFormData.endDate = new Date();
    }

    async saveAddOrEdit(data) {

        //console.log('sendReportTime - ', this.sendReportTime);

        let date: Date = new Date();
        let day: string = '';
        let tempSendDates = [];

        this.sendReportTime.map(item => {
            date = new Date(
                2000,
                1,
                1,
                item.hour,
                0
            );
            day = item.week;

            const sendDatesObject = {
                date, day
            };

            tempSendDates.push(sendDatesObject);

        });

        let datas = [];
        let addParam = {};
        let editParam = {};

        if (!this.inputFormData.objectId) {

            if (this.selectPeriodAddWay === EAddPeriodSelect.period) {
                const tempDatas: any = [
                    {
                        name: data.name,
                        siteIds: data.siteIds !== undefined ? data.siteIds : [],
                        tagIds: data.tagIds !== undefined ? data.tagIds : [],
                        sendUserIds: data.sendUserIds !== undefined ? data.sendUserIds : [],
                        startDate: data.startDate,
                        endDate: data.endDate,
                        mode: data.mode,
                        sendDates: tempSendDates,
                    }
                ];
                datas = tempDatas;
            }

            if (this.selectPeriodAddWay === EAddPeriodSelect.designation) {
                const tempDatas: any = [
                    {
                        name: data.name,
                        siteIds: data.siteIds !== undefined ? data.siteIds : [],
                        tagIds: data.tagIds !== undefined ? data.tagIds : [],
                        sendUserIds: data.sendUserIds !== undefined ? data.sendUserIds : [],
                        type: data.type,
                        mode: data.mode,
                        sendDates: tempSendDates,
                    }
                ];
                datas = tempDatas;
            }

            addParam = { datas };

            await this.$server
                .C("/report/template", addParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(this._("w_ReportTemplate_AddReportTemplateSuccess"));
                            this.pageToList();
                        }
                        if (returnValue.statusCode === 500) {
                            Dialog.error(this._("w_ReportTemplate_AddReportTemplateFailed"));
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    if (e.res.statusCode == 500) {
                        Dialog.error(this._("w_ReportTemplate_AddReportTemplateFailed"));
                        return false;
                    }
                    console.log(e);
                    return false;
                });
        } else if (this.inputFormData.objectId) {
            if (this.selectPeriodAddWay === EAddPeriodSelect.period) {
                const tempDatas: any = [
                    {
                        objectId: data.objectId,
                        name: data.name,
                        siteIds: data.siteIds !== undefined ? data.siteIds : [],
                        tagIds: data.tagIds !== undefined ? data.tagIds : [],
                        sendUserIds: data.sendUserIds !== undefined ? data.sendUserIds : [],
                        startDate: data.startDate,
                        endDate: data.endDate,
                        mode: data.mode,
                        sendDates: tempSendDates,
                    }
                ];
                datas = tempDatas;
            }

            if (this.selectPeriodAddWay === EAddPeriodSelect.designation) {
                const tempDatas: any = [
                    {
                        objectId: data.objectId,
                        name: data.name,
                        siteIds: data.siteIds !== undefined ? data.siteIds : [],
                        tagIds: data.tagIds !== undefined ? data.tagIds : [],
                        sendUserIds: data.sendUserIds !== undefined ? data.sendUserIds : [],
                        type: data.type,
                        mode: data.mode,
                        sendDates: tempSendDates,
                    }
                ];
                datas = tempDatas;
            }

            editParam = { datas };

            await this.$server
                .U("/report/template", editParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(this._("w_ReportTemplate_EditReportTemplateSuccess"));
                            this.pageToList();
                        }
                        if (returnValue.statusCode === 500) {
                            Dialog.error(this._("w_ReportTemplate_EditReportTemplateFailed"));
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    if (e.res.statusCode == 500) {
                        Dialog.error(this._("w_ReportTemplate_EditReportTemplateFailed"));
                        return false;
                    }
                    console.log(e);
                    return false;
                });
        }
    }

    async doDelete() {
        Dialog.confirm(
            this._("w_ReportTemplate_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                for (const param of this.selectedDetail) {
                    const deleteUserParam: {
                        objectId: string;
                    } = {
                        objectId: param.objectId
                    };

                    this.$server
                        .D("/report/template", deleteUserParam)
                        .then((response: any) => {
                            for (const returnValue of response) {
                                if (returnValue.statusCode === 200) {
                                    this.pageToList();
                                }
                                if (returnValue.statusCode === 500) {
                                    Dialog.error(this._("w_DeleteFailed"));
                                    return false;
                                }
                            }
                        })
                        .catch((e: any) => {
                            if (
                                e.res &&
                                e.res.statusCode &&
                                e.res.statusCode == 401
                            ) {
                                return ResponseFilter.base(this, e);
                            }

                            console.log(e);
                        });
                }
            }
        );
    }

    showFirst(value: any): string {
        if (value.length >= 2) {
            return value.map(item => item.name)[0] + "...";
        }
        if (value.length === 1) {
            return value.map(item => item.name)[0];
        }
        if (value.length == 0) {
            return "";
        }
    }

    show30Words(
        value: any,
        startWord: number = 0,
        endWord: number = 30
    ): string {
        return value.length < endWord
            ? value.substring(startWord, endWord)
            : value.substring(startWord, endWord) + "...";
    }

    idsToText(value: any): string {
        let result = "";
        for (let val of value) {
            result += val.name + ", ";
        }
        result = result.substring(0, result.length - 2);
        return result;
    }

    showLabelTitle(): string {
        if (this.pageStep === EPageStep.add) {
            return this._("w_ReportTemplate_Add");
        }
        if (this.pageStep === EPageStep.edit) {
            return this._("w_ReportTemplate_Edit");
        }
        if (this.pageStep === EPageStep.duplicate) {
            return this._("w_ReportTemplate_AddDuplicate");
        }
    }

    getWeekText(value: any): string {
        return !isNaN(value) && value > -1 && value < 7
            ? this._(`w_Week_${value.toString()}` as any)
            : this._("w_Week_Unknow");
    }

    getNumber10plus0(value: any): string {
        let result = "00";
        if (!isNaN(value)) {
            result = value < 10 ? "0" + value.toString() : value.toString();
        }
        return result;
    }

    dateToYYYY_MM_DD(value) {
        return Datetime.DateTime2String(new Date(value), "YYYY-MM-DD");
    }

    getMode(data: string): string {

        switch (data) {
            case EVideoSource.peopleCounting:
                return this._("w_Navigation_VideoSources_PeopleCounting");
            case EVideoSource.humanDetection:
                return this._("w_Navigation_VideoSources_HumanDetection");
            case EVideoSource.heatmap:
                return this._("w_Navigation_VideoSources_Heatmap");
            case EVideoSource.dwellTime:
                return this._("w_Navigation_VideoSources_DwellTime");
            case EVideoSource.demographic:
                return this._("w_Navigation_VideoSources_Demographic");
            case EVideoSource.visitor:
                return this._("w_Navigation_VideoSources_Visitor");
            default:
                return '';
        }

    }

    getType(data: string): string {

        switch (data) {
            case EDesignationPeriod.today:
                return this._("w_Today");
            case EDesignationPeriod.yesterday:
                return this._("w_Yesterday");
            case EDesignationPeriod.last7days:
                return this._("w_last7days");
            case EDesignationPeriod.thisWeek:
                return this._("w_thisWeek");
            case EDesignationPeriod.lastWeek:
                return this._("w_lastWeek");
            case EDesignationPeriod.thisMonth:
                return this._("w_thisMonth");
            case EDesignationPeriod.lastMonth:
                return this._("w_lastMonth");
            case EDesignationPeriod.q1:
                return this._("w_q1");
            case EDesignationPeriod.q2:
                return this._("w_q2");
            case EDesignationPeriod.q3:
                return this._("w_q3");
            case EDesignationPeriod.q4:
                return this._("w_q4");
            case EDesignationPeriod.thisYear:
                return this._("w_thisYear");
            default:
                return '';
        }

    }

    getReportTimeTable(data: any): string {

        let weekDay: string = '';
        let time: string = '';
        let result: string = '';

        if (data) {
            for (const item of data) {

                if (item.day === '0') {
                    weekDay = EWeeks.Sunday;
                    time = Datetime.DateTime2String(new Date(item.date), "HH:mm");
                    result += `${weekDay}, ${time} <br>`;
                }
                if (item.day === '1') {
                    weekDay = EWeeks.Monday;
                    time = Datetime.DateTime2String(new Date(item.date), "HH:mm");
                    result += `${weekDay}, ${time} <br>`;
                }
                if (item.day === '2') {
                    weekDay = EWeeks.Tuesday;
                    time = Datetime.DateTime2String(new Date(item.date), "HH:mm");
                    result += `${weekDay}, ${time} <br>`;
                }
                if (item.day === '3') {
                    weekDay = EWeeks.Wednesday;
                    time = Datetime.DateTime2String(new Date(item.date), "HH:mm");
                    result += `${weekDay}, ${time} <br>`;
                }
                if (item.day === '4') {
                    weekDay = EWeeks.Thursday;
                    time = Datetime.DateTime2String(new Date(item.date), "HH:mm");
                    result += `${weekDay}, ${time} <br>`;
                }
                if (item.day === '5') {
                    weekDay = EWeeks.Friday;
                    time = Datetime.DateTime2String(new Date(item.date), "HH:mm");
                    result += `${weekDay}, ${time} <br>`;
                }
                if (item.day === '6') {
                    weekDay = EWeeks.Saturday;
                    time = Datetime.DateTime2String(new Date(item.date), "HH:mm");
                    result += `${weekDay}, ${time} <br>`;
                }

            }
        }

        return result;
    }

    getReportTimeView(data: any): string {

        let weekDay: string = '';
        let time: string = '';
        let result: string = '';

        if (data) {
            for (const item of data) {

                if (item.day === '0') {
                    weekDay = EWeeks.Sunday;
                    time = Datetime.DateTime2String(new Date(item.date), "HH:mm");
                    result += `${weekDay}, ${time} ; `;
                }
                if (item.day === '1') {
                    weekDay = EWeeks.Monday;
                    time = Datetime.DateTime2String(new Date(item.date), "HH:mm");
                    result += `${weekDay}, ${time} ; `;
                }
                if (item.day === '2') {
                    weekDay = EWeeks.Tuesday;
                    time = Datetime.DateTime2String(new Date(item.date), "HH:mm");
                    result += `${weekDay}, ${time} ; `;
                }
                if (item.day === '3') {
                    weekDay = EWeeks.Wednesday;
                    time = Datetime.DateTime2String(new Date(item.date), "HH:mm");
                    result += `${weekDay}, ${time} ; `;
                }
                if (item.day === '4') {
                    weekDay = EWeeks.Thursday;
                    time = Datetime.DateTime2String(new Date(item.date), "HH:mm");
                    result += `${weekDay}, ${time} ; `;
                }
                if (item.day === '5') {
                    weekDay = EWeeks.Friday;
                    time = Datetime.DateTime2String(new Date(item.date), "HH:mm");
                    result += `${weekDay}, ${time} ; `;
                }
                if (item.day === '6') {
                    weekDay = EWeeks.Saturday;
                    time = Datetime.DateTime2String(new Date(item.date), "HH:mm");
                    result += `${weekDay}, ${time} ; `;
                }

            }
        }
        result = result.substring(0, result.length - 2);
        return result;
    }


    goToReport(value: any) {
        let url = "/reports/";

        switch (value.row.mode) {
            case EVideoSource.peopleCounting:
                url += "traffic?";
                break;

            case EVideoSource.humanDetection:
                url += "occupancy";
                break;

            case EVideoSource.demographic:
                url += "demographic";
                break;

            case EVideoSource.visitor:
                url += "repeat_visitor";
                break;

            case EVideoSource.dwellTime:
                url += "dwell_time";
                break;

            case EVideoSource.heatmap:
                url += "heatmap";
                break;

            default:
                break;
        }

        console.log(value.row);

        this.$router.push({
            path: url,
            query: {
                template: JSON.stringify(value.row)
            }
        });
    }

    ITableList() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Name")}
                 */
                name: string;


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 */
                sites: string;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Metric")}
                 */
                mode: string;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_ReportPeriod")}
                 */
                type: string;


                /**
                 * @uiLabel - ${this._("w_BOCampaign_StartDate")}
                 */
                startDate: string;


                /**
                 * @uiLabel - ${this._("w_BOCampaign_FinishDate")}
                 */
                endDate: string;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_SendReportTime")}
                 */
                sendDates: string;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Recipient")}
                 */
                sendUsers: string;


                Actions?: any;

                goToReport?: any;

            }
        `;
    }

    IAddAndEditForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Name")}
                 * @uiPlaceHolder - ${this._("w_ReportTemplate_Name")}
                 * @uiType - ${
                     this.inputFormData.stepType === EPageStep.add ||
                     this.inputFormData.stepType === EPageStep.duplicate
                         ? "iv-form-string"
                         : "iv-form-label"
                 }
                */
                name: string;


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 */
                siteIds: ${toEnumInterface(this.sitesSelectItem as any, true)};

                selectTree?: any;


                /**
                 * @uiLabel - ${this._("w_Tag")}
                 * @uiColumnGroup - tag
                 */
                tagIds: ${toEnumInterface(this.tagSelectItem as any, true)};


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Metric")}
                 */
                mode: ${toEnumInterface(this.metricSelectItem as any, false)};


                ReportPeriodTitle?: any;
                selectPeriodAddWay?: any;


                /**
                * @uiLabel - ${this._("w_BOCampaign_StartDate")}
                * @uiPlaceHolder - ${this._("w_BOCampaign_StartDate")}
                * @uiColumnGroup - date
                * @uiType - iv-form-date
                * @uiHidden - ${
                    this.selectPeriodAddWay === EAddPeriodSelect.designation
                        ? "true"
                        : "false"
                }
                 */
                startDate?: any;


                /**
                * @uiLabel - ${this._("w_BOCampaign_FinishDate")}
                * @uiPlaceHolder - ${this._("w_BOCampaign_FinishDate")}
                * @uiColumnGroup - date
                * @uiType - iv-form-date
                * @uiHidden - ${
                    this.selectPeriodAddWay === EAddPeriodSelect.designation
                        ? "true"
                        : "false"
                }
                 */
                endDate?: any;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_DesignationPeriod")}
                 * @uiHidden - ${
                     this.selectPeriodAddWay === EAddPeriodSelect.period
                         ? "true"
                         : "false"
                 }
                 */
                type?: ${toEnumInterface(
                    this.designationPeriodSelectItem as any,
                    false
                )};


                sendReportTimeTitle?: any;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_SendReportTime")}
                 */
                sendDates?: any;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Recipient")}
                 */
                sendUserIds: ${toEnumInterface(
                    this.userSelectItem as any,
                    true
                )};

            }
        `;
    }

    IViewForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Name")}
                 * @uiType - iv-form-label
                 */
                name?: string;


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 * @uiType - iv-form-label
                */
                siteIdsText?: string;


                /**
                 * @uiLabel - ${this._("w_Tag")}
                 * @uiType - iv-form-label
                 */
                tagIdsText: string;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Metric")}
                 * @uiType - iv-form-label
                 */
                modeText?: string;

                /**
                 * @uiLabel - ${this._("w_ReportTemplate_ReportPeriod")}
                 * @uiType - iv-form-label
                 */
                typeText?: string;


                /**
                 * @uiLabel - ${this._("w_BOCampaign_StartDate")}
                 * @uiType - iv-form-label
                 * @uiColumnGroup - date
                 */
                startDateText?: any;


                /**
                 * @uiLabel - ${this._("w_BOCampaign_FinishDate")}
                 * @uiType - iv-form-label
                 * @uiColumnGroup - date
                 */
                endDateText?: any;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_SendReportTime")}
                 * @uiType - iv-form-label
                 */
                sendDatesText?: string;


                /**
                 * @uiLabel - ${this._("w_ReportTemplate_Recipient")}
                 * @uiType - iv-form-label
                */
                sendUsersText?: string;

            }
        `;
    }
}
</script>

