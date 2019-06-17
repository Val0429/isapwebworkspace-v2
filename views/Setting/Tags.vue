<template>
    <div class="animated fadeIn">
        <iv-card
            v-show="pageStep === ePageStep.list"
            :data="{ label: _('w_Tag_TagList') }"
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
                :server="{ path: '/tag' }"
                @selected="selectedItem($event)"
            >

                <template #Actions="{$attrs, $listeners}">
                    <iv-toolbox-more :disabled="isSelected.length !== 1">
                        <iv-toolbox-view @click="pageToView" />
                        <iv-toolbox-edit @click="pageToEdit(ePageStep.edit)" />
                        <iv-toolbox-delete @click="doDelete" />
                    </iv-toolbox-more>
                </template>

                <template #description="{$attrs}">
                    {{ show30Words($attrs.value) }}
                </template>

                <template #regions="{$attrs}">
                    {{ showFirst($attrs.value) }}
                </template>

                <template #sites="{$attrs}">
                    {{ showFirst($attrs.value) }}
                </template>

            </iv-table>
        </iv-card>

        <!--From (Add and Edit)-->
        <iv-auto-card
            v-show="pageStep === ePageStep.add || pageStep === ePageStep.edit"
            :visible="true"
            :label="pageStep === ePageStep.add ? _('w_Tag_AddTag') :  _('w_Tag_EditTag')"
        >

            <iv-form
                :interface="IAddAndEditForm()"
                :value="inputTagData"
                @update:*="tempSaveInputData($event)"
                @submit="saveAddOrEdit($event)"
            >
                <template #selectTreeRegion="{ $attrs, $listeners }">

                    <div class="m-3">
                        <b-button @click="pageToChooseRegionTree">
                            {{ _('w_SelectRegionTree') }}
                        </b-button>
                    </div>
                </template>

                <template #selectTreeSite="{ $attrs, $listeners }">

                    <div class="m-3">
                        <b-button @click="pageToChooseSiteTree">
                            {{ _('w_SelectSiteTree') }}
                        </b-button>
                    </div>
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
            :label=" _('w_Tag_ViewTag') "
        >
            <template #toolbox>
                <iv-toolbox-back @click="pageToList()" />
            </template>

            <iv-form
                :interface="IViewForm()"
                :value="inputTagData"
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

        <region-tree-select
            v-show="pageStep === ePageStep.chooseRegionTree"
            v-on:click-back="pageToShowResultRegionTree"
            :multiple="true"
            :regionTreeItem="regionTreeItem"
            :selectType="selectTypeRegion"
            :selecteds="selectedsRegions"
        >
        </region-tree-select>

        <region-tree-select
            v-show="pageStep === ePageStep.chooseSiteTree"
            v-on:click-back="pageToShowResultSiteTree"
            :multiple="true"
            :regionTreeItem="siteTreeItem"
            :selectType="selectTypeSite"
            :selecteds="selectedsSites"
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
} from "@/components/RegionTree/models";
import { RegionTreeSelect } from "@/components/RegionTree/RegionTreeSelect.vue";

import RegionAPI from "@/services/RegionAPI";
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog/Dialog";

interface IInputTagData extends ITag, ITagReadUpdate {
    siteIdsText?: string;
    regionIdsText?: string;
    type?: string;
}

enum EPageStep {
    list = "list",
    add = "add",
    edit = "edit",
    view = "view",
    none = "none",
    showResult = "showResult",
    chooseRegionTree = "chooseRegionTree",
    chooseSiteTree = "chooseSiteTree"
}

@Component({
    components: {}
})
export default class Tags extends Vue {
    ePageStep = EPageStep;
    pageStep: EPageStep = EPageStep.list;

    isSelected: any = [];
    tableMultiple: boolean = true;

    selectedDetail: any = [];

    regionsSelectItem: any = {};
    sitesSelectItem: any = {};

    // tree 相關
    selectTypeSite = ERegionType.site;
    selectedsSites: IRegionTreeSelected[] = [];
    siteTreeItem = new RegionTreeItem();

    selectTypeRegion = ERegionType.region;
    selectedsRegions: IRegionTreeSelected[] = [];
    regionTreeItem = new RegionTreeItem();

    inputTagData: IInputTagData = {
        objectId: "",
        name: "",
        description: "",
        siteIds: [],
        regionIds: [],
        siteIdsText: "",
        regionIdsText: "",
        type: ""
    };

    created() {}

    mounted() {}

    clearInputData() {
        this.inputTagData = {
            objectId: "",
            name: "",
            description: "",
            siteIds: [],
            regionIds: [],
            siteIdsText: "",
            regionIdsText: "",
            type: ""
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

                    this.siteTreeItem.tree = RegionAPI.analysisApiResponse(
                        response
                    );
                    this.siteTreeItem.region = this.siteTreeItem.tree;
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

    async initSelectItemRegion() {
        await this.$server
            .R("/location/region/all")
            .then((response: any) => {
                if (response != undefined) {
                    for (const returnValue of response) {
                        // 自定義 sitesSelectItem 的 key 的方式
                        this.regionsSelectItem[returnValue.objectId] =
                            returnValue.name;
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
        this.siteTreeItem = new RegionTreeItem();
        this.regionTreeItem.titleItem.card = this._("w_RegionTreeSelect");
        this.siteTreeItem.titleItem.card = this._("w_SiteTreeSelect");
    }

    selectedItem(data) {
        this.isSelected = data;
        this.selectedDetail = [];
        this.selectedDetail = data;
    }

    getInputData() {
        this.clearInputData();
        for (const param of this.selectedDetail) {
            this.inputTagData = {
                objectId: param.objectId,
                name: param.name,
                description: param.description,
                siteIds: param.sites,
                regionIds: param.regions,
                siteIdsText: this.idsToText(param.sites),
                regionIdsText: this.idsToText(param.regions),
                type: ""
            };
        }
    }

    tempSaveInputData(data) {
        switch (data.key) {
            case "name":
                this.inputTagData.name = data.value;
                break;
            case "description":
                this.inputTagData.description = data.value;
                break;
            case "siteIds":
                this.inputTagData.siteIds = data.value;
                break;
            case "regionIds":
                this.inputTagData.regionIds = data.value;
                break;
        }

        for (const id of this.inputTagData.siteIds) {
            for (const detail in this.sitesSelectItem) {
                if (id === detail) {
                    let selectedsObject: IRegionTreeSelected = {
                        objectId: detail,
                        type: ERegionType.site,
                        name: this.sitesSelectItem[detail]
                    };
                    this.selectedsSites.push(selectedsObject);
                }
            }
        }

        for (const id of this.inputTagData.regionIds) {
            for (const detail in this.regionsSelectItem) {
                if (id === detail) {
                    let selectedsObject: IRegionTreeSelected = {
                        objectId: detail,
                        type: ERegionType.region,
                        name: this.regionsSelectItem[detail]
                    };
                    this.selectedsRegions.push(selectedsObject);
                }
            }
        }
    }

    async pageToAdd(type: string) {
        this.pageStep = EPageStep.add;
        await this.initSelectItemSite();
        await this.initSelectItemRegion();
        this.clearInputData();
        this.selectedsSites = [];
        this.selectedsRegions = [];
        this.inputTagData.type = type;
    }

    async pageToEdit(type: string) {
        this.pageStep = EPageStep.edit;
        this.getInputData();
        await this.initSelectItemSite();
        await this.initSelectItemRegion();
        this.selectedsSites = [];
        this.selectedsRegions = [];
        this.inputTagData.type = type;

        this.inputTagData.siteIds = JSON.parse(
            JSON.stringify(this.inputTagData.siteIds.map(item => item.objectId))
        );
        this.inputTagData.regionIds = JSON.parse(
            JSON.stringify(
                this.inputTagData.regionIds.map(item => item.objectId)
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
        this.selectedsSites = [];
        this.selectedsRegions = [];
    }

    async pageToChooseRegionTree() {
        this.pageStep = EPageStep.chooseRegionTree;
        this.initRegionTreeSelect();
        await this.initSelectItemTree();
        this.selectedsRegions = [];
        for (const id of this.inputTagData.regionIds) {
            for (const detail in this.regionsSelectItem) {
                if (id === detail) {
                    let selectedsObject: IRegionTreeSelected = {
                        objectId: detail,
                        type: ERegionType.region,
                        name: this.regionsSelectItem[detail]
                    };
                    this.selectedsRegions.push(selectedsObject);
                }
            }
        }
    }

    async pageToChooseSiteTree() {
        this.pageStep = EPageStep.chooseSiteTree;
        this.initRegionTreeSelect();
        await this.initSelectItemTree();
        this.selectedsSites = [];
        for (const id of this.inputTagData.siteIds) {
            for (const detail in this.sitesSelectItem) {
                if (id === detail) {
                    let selectedsObject: IRegionTreeSelected = {
                        objectId: detail,
                        type: ERegionType.site,
                        name: this.sitesSelectItem[detail]
                    };
                    this.selectedsSites.push(selectedsObject);
                }
            }
        }
    }

    pageToShowResultRegionTree() {
        if (this.inputTagData.type === EPageStep.edit) {
            this.pageStep = EPageStep.edit;

            // siteIds clear
            this.inputTagData.regionIds = [];

            // from selecteds push siteIds / regionIds

            for (const item of this.selectedsRegions) {
                this.inputTagData.regionIds.push(item.objectId);
            }
        }

        if (this.inputTagData.type === EPageStep.add) {
            this.pageStep = EPageStep.add;

            // siteIds clear
            this.inputTagData.regionIds = [];

            // from selecteds push siteIds / regionIds

            for (const item of this.selectedsRegions) {
                this.inputTagData.regionIds.push(item.objectId);
            }
        }
    }

    pageToShowResultSiteTree() {
        if (this.inputTagData.type === EPageStep.edit) {
            this.pageStep = EPageStep.edit;

            // siteIds clear
            this.inputTagData.siteIds = [];

            // from selecteds push siteIds / regionIds
            for (const item of this.selectedsSites) {
                this.inputTagData.siteIds.push(item.objectId);
            }
        }

        if (this.inputTagData.type === EPageStep.add) {
            this.pageStep = EPageStep.add;

            // siteIds clear
            this.inputTagData.siteIds = [];

            // from selecteds push siteIds / regionIds
            for (const item of this.selectedsSites) {
                this.inputTagData.siteIds.push(item.objectId);
            }
        }
    }

    async saveAddOrEdit(data) {
        if (this.inputTagData.type === EPageStep.add) {
            const datas: ITag[] = [
                {
                    name: data.name,
                    description: data.description,
                    regionIds:
                        data.regionIds !== undefined ? data.regionIds : [],
                    siteIds: data.siteIds !== undefined ? data.siteIds : []
                }
            ];

            const addParam = {
                datas
            };

            await this.$server
                .C("/tag", addParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(this._("w_Tag_AddTagSuccess"));
                            this.pageToList();
                        }
                        if (returnValue.statusCode === 500) {
                            Dialog.error(this._("w_Tag_AddTagFailed"));
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    if (e.res.statusCode == 500) {
                        Dialog.error(this._("w_Tag_AddTagFailed"));
                        return false;
                    }
                    console.log(e);
                    return false;
                });
        }
        if (this.inputTagData.type === EPageStep.edit) {
            const datas: ITagReadUpdate[] = [
                {
                    description: data.description,
                    regionIds:
                        data.regionIds !== undefined ? data.regionIds : [],
                    siteIds: data.siteIds !== undefined ? data.siteIds : [],
                    objectId: data.objectId
                }
            ];

            const editgParam = {
                datas
            };

            await this.$server
                .U("/tag", editgParam)
                .then((response: any) => {
                    for (const returnValue of response) {
                        if (returnValue.statusCode === 200) {
                            Dialog.success(this._("w_Tag_EditTagSuccess"));
                            this.pageToList();
                        }
                        if (returnValue.statusCode === 500) {
                            Dialog.error(this._("w_Tag_EditTagFailed"));
                            return false;
                        }
                    }
                })
                .catch((e: any) => {
                    if (e.res && e.res.statusCode && e.res.statusCode == 401) {
                        return ResponseFilter.base(this, e);
                    }
                    if (e.res.statusCode == 500) {
                        Dialog.error(this._("w_Tag_EditTagFailed"));
                        return false;
                    }
                    console.log(e);
                    return false;
                });
        }
    }

    async doDelete() {
        Dialog.confirm(
            this._("w_Tag_DeleteConfirm"),
            this._("w_DeleteConfirm"),
            () => {
                for (const param of this.selectedDetail) {
                    const deleteUserParam: {
                        objectId: string;
                    } = {
                        objectId: param.objectId
                    };

                    this.$server
                        .D("/tag", deleteUserParam)
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

    ITableList() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;


                /**
                 * @uiLabel - ${this._("w_Tag_TagName")}
                 */
                name: string;


                /**
                 * @uiLabel - ${this._("w_Description")}
                 */
                description: string;


                 /**
                  * @uiLabel - ${this._("w_Regions")}
                  */
                regions: string;


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 */
                sites: string;

                Actions?: any;

            }
        `;
    }

    IAddAndEditForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Tag_TagName")}
                 * @uiPlaceHolder - ${this._("w_Tag_TagName")}
                 * @uiType - ${
                     this.inputTagData.type === EPageStep.add
                         ? "iv-form-string"
                         : "iv-form-label"
                 }
                */
                name: string;


                /**
                 * @uiLabel - ${this._("w_Description")}
                 * @uiPlaceHolder - ${this._("w_Description")}
                */
                description: string;


                /**
                 * @uiLabel - ${this._("w_Regions")}
                 */
                regionIds?: ${toEnumInterface(
                    this.regionsSelectItem as any,
                    true
                )};

                selectTreeRegion?: any;

                /**
                 * @uiLabel - ${this._("w_Sites")}
                 */
                siteIds?: ${toEnumInterface(this.sitesSelectItem as any, true)};

                selectTreeSite?: any;

            }
        `;
    }

    IViewForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Tag_TagName")}
                 * @uiType - iv-form-label
                 */
                name?: string;


                /**
                 * @uiLabel - ${this._("w_Description")}
                 * @uiType - iv-form-label
                 */
                description?: string;


                /**
                 * @uiLabel - ${this._("w_Regions")}
                 * @uiType - iv-form-label
                 */
                regionIdsText?: string;


                /**
                 * @uiLabel - ${this._("w_Sites")}
                 * @uiType - iv-form-label
                */
                siteIdsText?: string;

            }
        `;
    }
}
</script>

