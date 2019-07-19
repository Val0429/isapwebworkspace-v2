<template>
    <div class="animated fadeIn">

        <!-- region tree -->
        <region-tree-setup
            v-show="pageStep == ePageStep.tree"
            v-on:click-binding-site="pageToBindingSite"
            v-on:click-add-next-layer-region="pageToEdit"
            v-on:click-add-same-layer-region="pageToEdit"
            v-on:click-edit-root="pageToEdit"
            v-on:click-edit-region="pageToEdit"
            v-on:click-delete="treeDelete"
            :regionTreeItem="regionTreeItem"
        >
        </region-tree-setup>

        <!-- edit root -->
        <iv-auto-card
            v-show="pageStep == ePageStep.modifyRoot"
            :visible="true"
            :label="cardModifyTitle"
        >
            <template #toolbox>
                <iv-toolbox-back @click="pageToTree($event)" />
            </template>

            <iv-form
                :interface="IRootForm()"
                :value="regionTreeItem.region"
                @update:*="updateRegionFrom($event)"
                @submit="clickSaveModifyRegion($event)"
            >
                <template #photoImg="{ $attrs, $listeners }">
                    <img
                        v-if="newImgSrc != ''"
                        class="region-form-image"
                        :src="newImgSrc"
                    />
                </template>

            </iv-form>

            <template #footer-before>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToTree($event)"
                >{{ _('w_Region_BackToTree') }}
                </b-button>
            </template>

        </iv-auto-card>

        <!-- add or edit region -->
        <iv-auto-card
            v-show="pageStep == ePageStep.modifyRegion"
            :visible="true"
            :label="cardModifyTitle"
        >

            <template #toolbox>
                <iv-toolbox-back @click="pageToTree($event)" />
            </template>

            <iv-form
                :interface="IRegionForm()"
                :value="regionTreeItem.region"
                @update:*="updateRegionFrom($event)"
                @submit="clickSaveModifyRegion($event)"
            >
                <template #photoImg="{ $attrs, $listeners }">
                    <img
                        v-if="newImgSrc != ''"
                        class="region-form-image"
                        :src="newImgSrc"
                    />
                </template>

                <template #tagIds="{$attrs, $listeners}">
                    <iv-form-selection
                        v-bind="$attrs"
                        v-on="$listeners"
                        :options="selectItem.tags"
                        :multiple="true"
                    >
                    </iv-form-selection>
                </template>
            </iv-form>

            <template #footer-before>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToTree($event)"
                >{{ _('w_Region_BackToTree') }}
                </b-button>
            </template>

        </iv-auto-card>

        <!-- binding site -->
        <iv-auto-card
            v-show="pageStep == ePageStep.bindingSite"
            :visible="true"
            :label="cardBindingTitle"
        >
            <template #toolbox>
                <iv-toolbox-back @click="pageToTree($event)" />
            </template>

            <iv-form
                :interface="IBindingSiteForm()"
                :value="regionTreeItem.region"
                @submit="clickSaveBindingSite($event)"
            >
                <template #errorMessage>
                    <div
                        v-if="noSiteBeBinding"
                        class="region-binding-site-error-message"
                    >{{ _('w_Region_ErrorNoSiteBeBinding') }}</div>
                </template>
            </iv-form>

            <template #footer-before>
                <b-button
                    variant="dark"
                    size="lg"
                    @click="pageToTree($event)"
                >{{ _('w_Region_BackToTree') }}
                </b-button>
            </template>

        </iv-auto-card>

    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { toEnumInterface } from "@/../core";
import ImageBase64 from "@/services/ImageBase64";

import {
    ERegionType,
    IRegionItem,
    RegionTreeItem
} from "@/components/RegionTree";
import { RegionTreeSetup } from "@/components/RegionTree/RegionTreeSetup.vue";
import RegionAPI from "@/services/RegionAPI";
import ServerConfig from "@/services/ServerConfig";
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog";

import { ITagReadUpdate } from "@/config/default/api/interfaces";

enum EPageStep {
    none,
    tree,
    modifyRoot,
    modifyRegion,
    bindingSite
}

@Component({
    components: {
        RegionTreeSetup
    }
})
export default class Region extends Vue {
    ePageStep = EPageStep;

    pageStep: EPageStep = EPageStep.tree;
    regionTreeItem: RegionTreeItem = new RegionTreeItem();

    noSiteBeBinding = false;
    cardModifyTitle = "";
    cardBindingTitle = "";
    deleteRegionIdList: string[] = [];
    selectItem: any = {
        site: {},
        tags: []
    };

    // image
    newImg = new Image();
    newImgSrc = "";

    created() {}

    mounted() {
        this.pageToTree();
    }

    pageToTree() {
        this.initRegionTreeItem();
        this.newImgSrc = "";
        this.pageStep = EPageStep.tree;
    }

    async pageToBindingSite() {
        let siteCount = 0;
        let param = { type: "unbinding" };
        this.cardBindingTitle = this.regionTreeItem.region.name;
        this.selectItem.site = [];
        this.regionTreeItem.region.sites = [];
        this.noSiteBeBinding = false;
        for (let childrenRegion of this.regionTreeItem.region.children) {
            if (childrenRegion.type == ERegionType.site) {
                this.selectItem.site[childrenRegion.objectId] =
                    childrenRegion.name;
                this.regionTreeItem.region.sites.push(childrenRegion.objectId);
                siteCount++;
            }
        }
        await this.$server
            .R("/location/site/all", param)
            .then((response: any) => {
                if (response != undefined) {
                    for (let resp of response) {
                        this.selectItem.site[resp.objectId] = resp.name;
                        siteCount++;
                    }
                }
                this.noSiteBeBinding = siteCount < 1;
            })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });
        this.pageStep = EPageStep.bindingSite;
    }

    pageToEdit() {
        this.cardModifyTitle =
            this.regionTreeItem.titleItem.edit != ""
                ? this.regionTreeItem.titleItem.edit
                : this._("w_Region_AddRegionTitle");
        this.newImgSrc = this.regionTreeItem.region.photoSrc;
        switch (this.regionTreeItem.region.type) {
            case ERegionType.root:
                this.pageStep = EPageStep.modifyRoot;
                break;
            default:
                this.pageStep = EPageStep.modifyRegion;
                break;
        }
        this.initTagItem();
    }

    // init data
    async initTagItem() {
        this.selectItem.tags = [];

        let body: {
            paging: {
                page: number;
                pageSize: number;
            };
        } = {
            paging: {
                page: 1,
                pageSize: 999
            }
        };

        await this.$server
            .R("/tag/all", body)
            .then((response: any) => {
                for (let itme of response) {
                    let tag = { id: itme.objectId, text: itme.name };
                    this.selectItem.tags.push(tag);
                }
            })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });

        this.regionTreeItem.region.tagIds = [];
        for (let tag of this.regionTreeItem.region.tags) {
            this.regionTreeItem.region.tagIds.push(tag.objectId);
        }
    }

    async initRegionTreeItem() {
        let param = {};
        this.regionTreeItem = new RegionTreeItem();
        this.regionTreeItem.titleItem.card = this._("w_Region_CardTitle");
        this.regionTreeItem.titleItem.address = this._("w_Region_Address");
        this.regionTreeItem.titleItem.map = this._("w_Region_Map");

        await this.$server
            .R("/location/tree", param)
            .then((response: any) => {
                if (response != undefined) {
                    this.regionTreeItem.tree = RegionAPI.analysisApiResponse(
                        response
                    );
                    this.regionTreeItem.region = this.regionTreeItem.tree;
                    this.regionTreeItem.region.status.focusBar = true;
                }
            })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });
    }

    initRegionTree(response: any): IRegionItem {
        let regionItem: IRegionItem = this.regionTreeItem.regionItem;
        regionItem.objectId = response.objectId;
        regionItem.parentId = response.parentId;
        if (response.data.name != undefined) {
            regionItem.name = response.data.name;
        }
        if (response.data.customId != undefined) {
            regionItem.customId = response.data.customId;
        }
        if (response.data.address != undefined) {
            regionItem.address = response.data.address;
        }
        if (response.data.longitude != undefined) {
            regionItem.lng = response.data.longitude;
            regionItem.location.lng = response.data.longitude;
        }
        if (response.data.latitude != undefined) {
            regionItem.lat = response.data.latitude;
            regionItem.location.lat = response.data.latitude;
        }
        if (response.data.imageSrc != undefined) {
            regionItem.photoSrc = ServerConfig.url + response.data.imageSrc;
        }
        if (response.data.mapSrc != undefined) {
            regionItem.imageMapSrc = ServerConfig.url + response.data.mapSrc;
        }
        if (response.data.tags != undefined) {
            for (let tempTagRes of response.data.tags) {
                regionItem.tags.push({
                    objectId: tempTagRes.objectId,
                    name: tempTagRes.name
                });
            }
        }
        switch (response.type) {
            case "root":
                regionItem.type = ERegionType.root;
                if (
                    this.regionTreeItem.toggleStatus.region ||
                    this.regionTreeItem.toggleStatus.site ||
                    this.regionTreeItem.toggleStatus.area
                ) {
                    regionItem.status.showCard = true;
                } else {
                    regionItem.status.showCard = false;
                }
                break;
            case "site":
                regionItem.type = ERegionType.site;
                if (
                    this.regionTreeItem.toggleStatus.site ||
                    this.regionTreeItem.toggleStatus.area
                ) {
                    regionItem.status.showCard = true;
                } else {
                    regionItem.status.showCard = false;
                }
                break;
            case "area":
                regionItem.type = ERegionType.area;
                if (this.regionTreeItem.toggleStatus.site) {
                    regionItem.status.showCard = true;
                } else {
                    regionItem.status.showCard = false;
                }
                break;
            default:
                regionItem.type = ERegionType.region;
                if (
                    this.regionTreeItem.toggleStatus.region ||
                    this.regionTreeItem.toggleStatus.site ||
                    this.regionTreeItem.toggleStatus.area
                ) {
                    regionItem.status.showCard = true;
                } else {
                    regionItem.status.showCard = false;
                }
                break;
        }
        for (let childrenResponse of response.childrens) {
            regionItem.children.push(this.initRegionTree(childrenResponse));
        }
        return regionItem;
    }

    // tree function
    treeDelete(idList: string[]) {
        this.deleteRegionIdList = idList;
        Dialog.confirm(
            this._("w_Region_DeleteConfrimContent"),
            this._("w_Region_DeleteConfrimTitle"),
            () => {
                this.deleteRegionConfirm();
            }
        );
    }

    // form function
    async clickSaveModifyRegion(data: any) {
        let param = {
            datas: []
        };
        let saveRegion: {
            parentId: string;
            objectId?: string;
            type: ERegionType;
            name: string;
            customId?: string;
            address?: string;
            longitude?: number;
            latitude?: number;
            imageBase64?: string;
        } = {
            parentId: data.parentId,
            type: data.type,
            name: data.name
        };

        // get key
        if (data.objectId != undefined) {
            saveRegion.objectId = data.objectId;
        }
        if (data.customId != undefined) {
            saveRegion.customId = data.customId;
        }

        if (data.address != undefined) {
            saveRegion.address = data.address;
        }

        if (data.lng != undefined) {
            saveRegion.longitude = parseFloat(data.lng);
        }

        if (data.lat != undefined) {
            saveRegion.latitude = parseFloat(data.lat);
        }

        if (this.newImgSrc != this.regionTreeItem.region.photoSrc) {
            saveRegion.imageBase64 = this.newImgSrc;
        }

        // check value
        if (
            isNaN(saveRegion.latitude) ||
            saveRegion.latitude > 90 ||
            saveRegion.latitude < -90
        ) {
            Dialog.error(this._("w_Region_ErrorLatitude"));
            return false;
        }

        if (
            isNaN(saveRegion.longitude) ||
            saveRegion.longitude > 180 ||
            saveRegion.longitude < -180
        ) {
            Dialog.error(this._("w_Region_ErrorLongitude"));
            return false;
        }
        param.datas.push(saveRegion);

        // check create or update
        if (
            param.datas[0].objectId == undefined ||
            param.datas[0].objectId == ""
        ) {
            await this.$server
                .C("/location/region", param)
                .then((response: any) => {
                    if (response != undefined) {
                        this.pageToTree();
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.base(this, e);
                });
        } else {
            await this.$server
                .U("/location/region", param)
                .then((response: any) => {
                    if (response != undefined) {
                        this.pageToTree();
                    }
                })
                .catch((e: any) => {
                    return ResponseFilter.base(this, e);
                });
        }

        //update tags
        let tbody: {
            paging: {
                page: number;
                pageSize: number;
            };
        } = {
            paging: {
                page: 1,
                pageSize: 999
            }
        };

        await this.$server
            .R("/tag", tbody)
            .then((response: any) => {
                const datas: ITagReadUpdate[] = [];
                var tagList = response.results;

                for (let tempResponse of tagList) {
                    let haveRegionInTag = false;
                    let haveChooseTag = false;

                    // 檢查這個 tag 是否有這個 region
                    for (let region of tempResponse.regions) {
                        if (region.objectId == data.objectId) {
                            haveRegionInTag = true;
                            break;
                        }
                    }

                    // 檢查這個 tag 是否被選擇
                    for (let tagId of data.tagIds) {
                        if (tagId == tempResponse.objectId) {
                            haveChooseTag = true;
                            break;
                        }
                    }

                    // 都存在或都不存在就不修改
                    if (haveRegionInTag != haveChooseTag) {
                        let tempTageItem = {
                            objectId: tempResponse.objectId,
                            regionIds: []
                        };

                        if (haveChooseTag) {
                            // 加上現在的 id 進去
                            tempTageItem.regionIds.push(data.objectId);
                        }

                        // 移除現在的 region, 只加其他 id 進去
                        for (let region of tempResponse.regions) {
                            if (
                                region.objectId != "" &&
                                region.objectId != data.objectId
                            ) {
                                tempTageItem.regionIds.push(region.objectId);
                            }
                        }
                        datas.push(tempTageItem);
                    }
                }

                if (datas.length > 0) {
                    const tagParam = { datas };
                    this.$server
                        .U("/tag", tagParam)
                        .then((response: any) => {
                            if (response != undefined) {
                                this.pageToTree();
                            }
                        })
                        .catch((e: any) => {
                            return ResponseFilter.base(this, e);
                        });
                } else {
                    this.pageToTree();
                }
            })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });
    }

    async clickSaveBindingSite(data: any) {
        let param = { datas: [] };
        let removeBindingIdList = [];
        for (let siteId of data.sites) {
            param.datas.push({
                objectId: siteId,
                regionId: this.regionTreeItem.region.objectId
            });
        }
        for (let siteId of this.regionTreeItem.region.sites) {
            let haveId = false;
            for (let data of param.datas) {
                if (siteId == data.objectId) {
                    haveId = true;
                    break;
                }
            }
            if (!haveId) {
                removeBindingIdList.push({
                    objectId: siteId,
                    regionId: ""
                });
            }
        }
        for (let removeId of removeBindingIdList) {
            param.datas.push(removeId);
        }
        await this.$server
            .U("/location/site/binding-region", param)
            .then((response: any) => {
                if (response != undefined) {
                    this.pageToTree();
                }
            })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });
    }

    // modal function
    async deleteRegionConfirm() {
        let param = { objectId: this.deleteRegionIdList };
        await this.$server
            .D("/location/region", param)
            .then((response: any) => {
                if (response != undefined) {
                    this.pageToTree();
                }
            })
            .catch((e: any) => {
                return ResponseFilter.base(this, e);
            });
    }

    // image function
    async uploadFile(file) {
        if (file) {
            ImageBase64.fileToBase64(file, (base64 = "") => {
                if (base64 != "") {
                    this.newImgSrc = base64;
                } else {
                    Dialog.error(this._("w_Region_ErrorFileToLarge"));
                }
            });
        }
    }

    // form function
    updateRegionFrom(data: any) {
        if (data.key == "photoSrc") {
            this.uploadFile(data.value);
        }
    }

    IRootForm() {
        return `
                interface {

                    /**
                     * @uiLabel - ${this._("w_Region_Name")}
                     * @uiPlaceHolder - ${this._("w_Region_NamePlaceholder")}
                     */
                    name: string;

                    /**
                     * @uiLabel - ${this._("w_Region_Photo")}
                     * @uiPlaceHolder - ${this._("w_Region_PhotoPlaceholder")}
                     * @uiType - iv-form-file
                     */
                    photoSrc: string;

                    photoImg?: any;

            }
        `;
    }

    IRegionForm() {
        return `
                interface {

                    /**
                     * @uiLabel - ${this._("w_Region_Name")}
                     * @uiPlaceHolder - ${this._("w_Region_NamePlaceholder")}
                     */
                    name: string;

                    /**
                     * @uiLabel - ${this._("w_Region_Address")}
                     * @uiPlaceHolder - ${this._("w_Region_AddressPlaceholder")}
                     */
                    address: string;

                    /**
                     * @uiLabel - ${this._("w_Region_CustomId")}
                     * @uiPlaceHolder - ${this._(
                         "w_Region_CustomIdPlaceholder"
                     )}
                     */
                    customId?: string;

                    /**
                     * @uiLabel - ${this._("w_Region_Lat")}
                     * @uiPlaceHolder - ${this._("w_Region_LatPlaceholder")}
                     * @uiColumnGroup - location
                     */
                    lat: number;

                    /**
                     * @uiLabel - ${this._("w_Region_Lng")}
                     * @uiPlaceHolder - ${this._("w_Region_LngPlaceholder")}
                     * @uiColumnGroup - location
                     */
                    lng: number;

                    /**
                     * @uiLabel - ${this._("w_Site_Tag")}
                     * @uiPlaceHolder - ${this._("w_Site_Tag")}
                     */
                    tagIds?: any;

                    /**
                     * @uiLabel - ${this._("w_Region_Photo")}
                     * @uiPlaceHolder - ${this._("w_Region_PhotoPlaceholder")}
                     * @uiType - iv-form-file
                     */
                    photoSrc: string;

                    photoImg?: any;
            }
        `;
    }

    IBindingSiteForm() {
        return `
            interface {

                /**
                 * @uiLabel - ${this._("w_Region_Sites")}
                 * @uiPlaceHolder - ${this._("w_Region_SitesPlaceholder")}
                 */
                sites?: ${toEnumInterface(this.selectItem.site, true)};

                errorMessage?: any
            }
        `;
    }
}
</script>

<style lang="scss" scoped>
.region-info {
    .region-info-title {
        padding: 10px;
        color: $white;
        background-color: $primary;
    }

    .region-info-photo {
        .region-info-photo-img {
            width: 100%;
        }
    }

    .region-info-address {
        margin-top: 20px;
        .region-info-address-title {
            font-size: 1.2rem;
            font-weight: bold;
        }

        .region-info-address-content {
            font-size: 1rem;
        }
    }

    .region-info-tag {
        margin-top: 10px;
        .region-info-tag-span {
            color: $blue;
            margin-right: 5px;
        }
    }

    .region-info-map {
        margin-top: 20px;
        .region-info-map-title {
            font-size: 1.2rem;
            font-weight: bold;
        }
        .region-info-image-map {
            .region-info-image-map-img {
                width: 100%;
            }
        }
        .region-info-map-iframe {
            width: 100%;
            height: 500px;
            overflow: hidden;
            border: 0px;
        }
    }
}

.region-form-image {
    width: 90%;
    height: 90%;
    max-height: auto;
    min-height: auto;
    margin: 10px 5%;
}

.region-binding-site-error-message {
    margin-left: 30px;
    color: $red;
    font-weight: bold;
    font-size: 1.3rem;
}
</style>