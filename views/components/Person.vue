<template>
    <div key="main">
        <iv-auto-transition
            :step="step"
            :type="type"
        >
            <template v-if="step === 1">
                <iv-auto-card
                    key="SearchCard"
                    :label="_('wb_Search')"
                >
                    <iv-form
                        :interface="personSearchForm()"
                        :value="defaultValue"
                        @submit="doSearch"
                    />
                </iv-auto-card>
                <iv-auto-card
                    key="ListTable"
                    :label="_('m_Persons_Person_List')"
                >
                    <iv-table
                        ref="table"
                        :server="{ 'path': '/continental/workcards' }"
                        :params="personFilter"
                        :interface="personList()"
                        :selectable="false"
                    >
                        <template #photo_base64="{ $attrs, $listeners }">
                            <img
                                :src="'data:image/jpg;base64,' + $attrs.value"
                                style="max-width:50px; max-height: 50px;"
                            />
                        </template>
                        <template #actions="{ $attrs, $listeners }">
                            <ivc-toolbox-actions @click="readMore($attrs.row)" />
                        </template>
                    </iv-table>
                </iv-auto-card>
            </template>
            <template v-else-if="step === 2">
                <iv-auto-card
                    key="tableDeatil"
                    :label="_('m_Persons_Person_Detail')"
                >
                    <template #toolbox>
                        <ivc-toolbox-goback @click="step = 1" />
                    </template>
                    <iv-form
                        :interface="IPersonBaseData()"
                        :value="personBaseData"
                    >
                        <template #photo_base64="{$attrs}">
                            <div class="form-group col-md-3 text-center">
                                <img
                                    :src="'data:image/jpg;base64,' + $attrs.value"
                                    style="max-height:160px;max-width:120px;"
                                />
                            </div>
                        </template>
                    </iv-form>
                    <iv-card :label="_('w_Certificate')">
                        <iv-table
                            :interface="IPersonLicensesData()"
                            :data="personLicensesData"
                            :hidePaging="true"
                        />
                    </iv-card>
                    <iv-card :label="_('m_Persons_Person_Work_Station_Record')">
                        <iv-table
                            :interface="IWorkStationRecord()"
                            :data="workStationRecord"
                            :hidePaging="true"
                        />
                    </iv-card>
                    <iv-card :label="_('m_Persons_Person_Allow_Into_Site')">
                        <iv-table
                            :interface="IAllowIntoSite()"
                            :data="allowIntoSite"
                            :hidePaging="true"
                        />
                    </iv-card>
                    <iv-card :label="_('m_Persons_Person_Enter_Site_Record')">
                        <iv-table
                            :interface="IEnterSiteRecord()"
                            :data="personLicensesData"
                            :hidePaging="true"
                        />
                    </iv-card>

                    <template #footer>
                        <b-button
                            variant="secondary"
                            size="lg"
                            @click="pageToList()"
                        >{{ 'Back' }}</b-button>
                    </template>
                </iv-auto-card>
            </template>
        </iv-auto-transition>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RegisterRouter } from "@/../core/router";
import { toEnumInterface } from "@/../core";

@Component
export default class Components extends Vue {
    private defaultValue = {
        pid: "",
        name_zh: ""
    };
    private step: number = 1;
    private type: string = "iv-direction-slide";
    private personBaseData: any = {
        name: "",
        idString: "",
        type: ""
    };
    private personLicensesData: any = {
        licenses_name: "",
        licenses_expiry: "",
        licenses_get: ""
    };
    private workStationRecord: any = {
        sitename: "",
        bad_record: "",
        work_record: "",
        is_black: ""
    };
    private allowIntoSite: any = {
        sitename: "",
        work_areas: "",
        comname: "",
        close_date: "",
        close_reason: ""
    };
    private personFilter: any = {};
    private personSearchForm() {
        return `
            interface {
                /*
                 * @uiLabel - ID
                 * @uiType - iv-form-string
                 */
                pid?: string;
                /*
                 * @uiLabel - ${this._("w_Name")}
                 * @uiType - iv-form-string
                 */
                name_zh?: string;
            }
        `;
    }
    private personList() {
        return `
            interface {
                /*
                 * @uiLabel - ID
                 */
                pid: string;
                /*
                 * @uiLabel - ${this._("w_Type")}
                 */
                workcard_type: string;
                /*
                 * @uiLabel - ${this._("w_Title")}
                 */
                name_zh: string;
                /*
                 * @uiLabel - ${this._("w_Picture")}
                 */
                photo_base64?: any;
                /*
                 * @uiLabel - ${this._("w_Actions")}
                 */
                actions?: any;
            }
        `;
    }
    private IPersonBaseData() {
        return `
      interface {
          /*
            * @uiLabel - ${this._("w_Picture")}
            * @uiColumnGroup - baseData
            */
           photo_base64?: any;
          /*
            * @uiLabel - ${this._("w_Title")}
            * @uiType - iv-form-label
            * @uiColumnGroup - baseData
            */
          name_zh?: string;
          /*
            * @uiLabel - ID
            * @uiType - iv-form-label
            * @uiColumnGroup - baseData
            */
          pid?: string;
          /*
            * @uiLabel - ${this._("w_Type")}
            * @uiType - iv-form-label
            * @uiColumnGroup - baseData
            */
           workcard_type?: string;
          
      }
    `;
    }
    private IPersonLicensesData() {
        return `
      interface {
          /*
            * @uiLabel - ${this._("w_Certificate") + this._("w_Title")}
            */
          licenses_name: string;
          /*
            * @uiLabel - ${this._("w_Certificate") +
                this._("w_Certificate_Expiry")}
            */
          licenses_expiry: Date;
          /*
            * @uiLabel - ${this._("w_Get") + this._("w_Date")}
            */
          licenses_get: Date;
      }
    `;
    }
    private IWorkStationRecord() {
        return `
      interface {
          /*
            * @uiLabel - ${this._("w_Work_Station")}
            */
          sitename: string;

          /*
            * @uiLabel - ${this._("w_Bad_Record")}
            */
          bad_record: string;

          /*
            * @uiLabel - ${this._("w_Work_Record")}
            */
          work_record: string;

          /*
            * @uiLabel - ${this._("w_Is_Black")}
            */
          is_black: string;
      }
    `;
    }
    private IAllowIntoSite() {
        return `
      interface {
          /*
            * @uiLabel - ${this._("w_Site") + this._("w_Title")}
            */
          sitename: string;

          /*
            * @uiLabel - ${this._("w_Work_Area")}
            */
          work_areas: string;

          /*
            * @uiLabel - ${this._("w_Company")}
            */
          comname: string;

          /*
            * @uiLabel - ${this._("w_Status")}
            */
          status: string;

          /*
            * @uiLabel - ${this._("w_Status_Off") + this._("w_Date")}
            */
          close_date: Date;

          /*
            * @uiLabel - ${this._("w_Status_Off") + this._("w_Reason")}
            */
          close_reason: string;
      }
    `;
    }
    private IEnterSiteRecord() {
        return `
      interface {
          /*
            * @uiLabel - ${this._("w_Site") + this._("w_Title")}
            */
          sitename: string;
          /*
            * @uiLabel - ${this._("w_Date")}
            */
          enter_date: Date;
          /*
            * @uiLabel - ${this._("w_Enter") + this._("w_Timestamp")}
            */
          enter_time: string;
          /*
            * @uiLabel - ${this._("w_Leave") + this._("w_Timestamp")}
            */
          leave_time: string;
          /*
            * @uiLabel - ${this._("w_Stay") + this._("w_Timestamp")}
            */
          stay_time: string;
      }
    `;
    }
    private async doSearch(val) {
        this.personFilter = val;
    }
    private readMore(value) {
        this.step = 2;

        this.personBaseData = {
            paging: {
                page: 1,
                pageSize: 10000,
                total: 1,
                totalPages: 10000
            },
            results: value
        };

        this.personLicensesData = {
            paging: {
                page: 1,
                pageSize: 10000,
                total: 1,
                totalPages: 10000
            },
            results: value.user_licenses
        };

        this.workStationRecord = {
            paging: {
                page: 1,
                pageSize: 10000,
                total: 1,
                totalPages: 10000
            },
            results: value.user_sites
        };

        let newWorkStationRecord = value.user_sites;
        let siteareaname = value.work_areas;
        for (let i in newWorkStationRecord) {
            newWorkStationRecord[i]["work_areas"] = siteareaname;
        }
        this.allowIntoSite = {
            paging: {
                page: 1,
                pageSize: 10000,
                total: 1,
                totalPages: 10000
            },
            results: newWorkStationRecord
        };
        console.log("!!!! value", value);
    }

    pageToList() {
        this.step = 1;
    }
}
</script>
<style lang="scss" scoped>
/deep/.form-label {
    background-color: transparent;
    padding: 0;
    border: none;
}
</style>