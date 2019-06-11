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

        <!-- 刪除 confirm dialog -->
        <b-modal
            hide-footer
            size="md"
            :title="_('w_Region_DeleteConfrimTitle')"
            v-model="deleteModalShow"
        >
            <div class="card-content">
                {{ _('w_Region_DeleteConfrimContent')}}
            </div>
            <hr>
            <b-row>

                <!-- 確認 -->
                <b-col
                    cols="3"
                    offset="6"
                >
                    <b-button
                        class="button button-full"
                        variant="success"
                        type="button"
                        @click="deleteRegionConfirm"
                    >{{ _('w_Region_ButtonDeleteConfirm') }}
                    </b-button>
                </b-col>

                <!-- 取消 -->
                <b-col cols="3">
                    <b-button
                        class="button button-full"
                        variant="secondary"
                        type="button"
                        @click="deleteRegionCancel"
                    >{{ _('w_Cancel') }}
                    </b-button>
                </b-col>

            </b-row>

        </b-modal>

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
} from "@/components/RegionTree/models";
import { RegionTreeSetup } from "@/components/RegionTree/RegionTreeSetup.vue";
import RegionAPI from "@/services/RegionAPI";
import ServerConfig from "@/services/ServerConfig";
import ResponseFilter from "@/services/ResponseFilter";
import Dialog from "@/services/Dialog/Dialog";

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
    deleteModalShow: boolean = false;
    cardModifyTitle = "";
    cardBindingTitle = "";
    deleteRegionIdList: string[] = [];
    selectItem: any = {
        site: {}
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
        this.deleteModalShow = false;
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
    }

    // init data
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
        this.deleteModalShow = true;
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

    deleteRegionCancel() {
        this.deleteModalShow = false;
        this.pageToTree();
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