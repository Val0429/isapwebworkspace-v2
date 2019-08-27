<template>
    <div>

        <iv-auto-transition
            :step="transition.step"
            :type="transition.type"
        >

            <iv-form
                key="transition_1"
                v-show="transition.step === 1"
                :interface="IFilterConditionForm()"
            >
                <template #ifAllSites="{ $attrs, $listeners }">

                    <p class="ml-3">{{ _('w_Sites1') }}</p>

                    <b-col cols="9">
                        <b-form-radio-group
                            v-model="selectAllSites"
                            :name="radioName"
                            class="mb-3"
                            :options="ifAllSitesSelectItem"
                            @change="changeAllSitesSelect"
                        ></b-form-radio-group>
                    </b-col>

                </template>

                <template #siteIds="{$attrs, $listeners}">

                    <iv-form-selection
                        v-on="$listeners"
                        v-model="inputFormData.siteIds"
                        class="col-md-10"
                        :options="sitesSelectItem"
                        :multiple="true"
                        @input="changeSiteIds"
                    >
                    </iv-form-selection>

                    <div class="col-md-2">
                        <b-button
                            class="col-md-12"
                            variant="outline-secondary"
                            @click="pageToChooseTree"
                        >
                            {{ _('w_SelectSiteTree') }}
                        </b-button>
                    </div>

                </template>
            </iv-form>

            <region-tree-select
                key="transition_2"
                v-show="transition.step === 2"
                :multiple="true"
                :regionTreeItem="regionTreeItem"
                :selectType="selectType"
                :selecteds="selecteds"
                v-on:click-back="pageToShowResult"
            >
            </region-tree-select>

        </iv-auto-transition>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from "vue-property-decorator";
import { toEnumInterface } from "../../../core";
import Datetime from "@/services/Datetime";

import ResponseFilter from "@/services/ResponseFilter";
import ReportService from "../Reports/models/ReportService";
import RegionAPI from "@/components/RegionTree/models/RegionAPI";

// Transition
import Transition from "@/services/Transition";
import { ITransition } from "@/services/Transition";

// Region Tree
import {
    IRegionTreeSelected,
    RegionTreeItem,
    ERegionType
} from "../RegionTree";
import { EIfAllSelected } from "../Reports";

@Component({
    components: {}
})
export class SelectPermissionSite extends Vue {
    // Prop
    @Prop({
        type: String, // Boolean, Number, String, Array, Object
        default: ''
    })
    radioName: string;

    transition: ITransition = {
        type: Transition.type,
        prevStep: 1,
        step: 1
    };

    selectAllSites: string = EIfAllSelected.all;

    sitesSelectItem: any = [];
    ifAllSitesSelectItem: any = [];

    inputFormData: any = {
        siteIds: [],
        allSiteIds: []
    };

    // tree
    selectType = ERegionType.site;
    regionTreeItem = new RegionTreeItem();
    selecteds: IRegionTreeSelected[] = [];

    created() {
        this.initData();
        this.siteFilterPermission();
        this.initRegionTreeSelect();
        this.initSelectItemTree();
    }

    mounted() {}

    initData() {
        this.ifAllSitesSelectItem = [
            { value: EIfAllSelected.all, text: this._("w_AllSites") },
            { value: EIfAllSelected.select, text: this._("w_SelectSites") }
        ];
        this.inputFormData.siteIds = this.inputFormData.allSiteIds;
    }

    initRegionTreeSelect() {
        this.regionTreeItem = new RegionTreeItem();
        this.regionTreeItem.titleItem.card = this._("w_SiteTreeSelect");
    }

    siteFilterPermission() {
        for (const detail of this.$user.user.allowSites) {
            let site = { id: detail.objectId, text: detail.name };
            this.sitesSelectItem.push(site);
            this.inputFormData.allSiteIds.push(detail.objectId);
        }
    }

    async pageToChooseTree() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 2;

        this.selecteds = [];

        for (const id of this.inputFormData.siteIds) {
            for (const detail of this.sitesSelectItem) {
                if (id === detail.id) {
                    let selectedsObject: IRegionTreeSelected = {
                        objectId: detail.id,
                        type: ERegionType.site,
                        name: detail.text
                    };
                    this.selecteds.push(selectedsObject);
                }
            }
        }
    }

    pageToShowResult() {
        this.transition.prevStep = this.transition.step;
        this.transition.step = 1;

        // siteIds clear
        this.inputFormData.siteIds = [];

        // from selecteds push siteIds
        for (const item of this.selecteds) {
            this.inputFormData.siteIds.push(item.objectId);
        }

        if (
            this.inputFormData.siteIds.length !==
            this.inputFormData.allSiteIds.length
        ) {
            this.selectAllSites = EIfAllSelected.select;
        } else if (
            this.inputFormData.siteIds.length ===
            this.inputFormData.allSiteIds.length
        ) {
            this.selectAllSites = EIfAllSelected.all;
        }

        this.$emit("siteIds", this.inputFormData.siteIds);
    }

    async initSelectItemTree() {
        await this.$server
            .R("/location/tree")
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    let tempTree = ReportService.resolveUserSite(
                        this,
                        response
                    );
                    this.regionTreeItem.tree = RegionAPI.analysisApiResponse(
                        tempTree
                    );
                    this.regionTreeItem.region = this.regionTreeItem.tree;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    changeAllSitesSelect(selected: string) {
        this.inputFormData.siteIds = [];
        this.selecteds = [];
        this.selectAllSites = selected;
        if (this.selectAllSites === EIfAllSelected.all) {
            this.inputFormData.siteIds = [];
            this.selecteds = [];

            this.inputFormData.siteIds = this.inputFormData.allSiteIds;
        } else {
            this.inputFormData.siteIds = [];
            this.selecteds = [];
        }

        this.$emit("siteIds", this.inputFormData.siteIds);
    }

    changeSiteIds() {
        if (
            this.inputFormData.siteIds.length !==
            this.inputFormData.allSiteIds.length
        ) {
            this.selectAllSites = EIfAllSelected.select;
        } else if (
            this.inputFormData.siteIds.length ===
            this.inputFormData.allSiteIds.length
        ) {
            this.selectAllSites = EIfAllSelected.all;
        }

        this.selecteds = [];

        for (const id of this.inputFormData.siteIds) {
            for (const detail of this.sitesSelectItem) {
                if (id === detail.id) {
                    let selectedsObject: IRegionTreeSelected = {
                        objectId: detail.id,
                        type: ERegionType.site,
                        name: detail.text
                    };
                    this.selecteds.push(selectedsObject);
                }
            }
        }

        this.$emit("siteIds", this.inputFormData.siteIds);
    }

    IFilterConditionForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_ReportTemplate_ReportPeriod1")}
                 * @uiColumnGroup - site1
                 */
                ifAllSites?: any;


                siteIds?: any;

            }
        `;
    }
}

export default SelectPermissionSite;
Vue.component("select-permission-site", SelectPermissionSite);
</script>

<style lang="scss" scoped>
</style>
