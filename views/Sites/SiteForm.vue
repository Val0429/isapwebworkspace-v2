<template>
    <div class="animated fadeIn">
        <iv-auto-card :label="transition.step === 3 ? _('w_Site_AddSite') :  _('w_Site_EditSite')">

            <template #toolbox>
                <iv-toolbox-back @click="pageToSiteList()" />
            </template>

            <iv-form
                :interface="ISiteForm()"
                :value="site"
                @update:*="updateSiteForm($event)"
                @submit="saveSite($event)"
            >

                <template #officeHourId="{$attrs, $listeners}">
                    <iv-form-selection
                        v-bind="$attrs"
                        v-on="$listeners"
                        :options="officeHourItem"
                    >
                    </iv-form-selection>
                </template>

                <template #managerId="{$attrs, $listeners}">
                    <iv-form-selection
                        v-bind="$attrs"
                        v-on="$listeners"
                        :options="managerItem"
                    >
                    </iv-form-selection>
                </template>

                <template #tagIds="{$attrs, $listeners}">
                    <iv-form-selection
                        v-bind="$attrs"
                        v-on="$listeners"
                        :options="tagItem"
                        :multiple="true"
                    >
                    </iv-form-selection>
                </template>

                <template #imageSrc="{ $attrs, $listeners}">
                    <img
                        class="imgSide mb-3"
                        v-if="newImgSrc"
                        v-bind="$attrs"
                        v-on="$listeners"
                        :src="newImgSrc"
                    />
                </template>

                <template #mapping="{ $attrs, $listeners }">
                    <div class="googleMap col-md-12">
                        <b-button
                            variant="secondary"
                            size="md"
                            @click="googleMapMapping()"
                        >{{ _('w_Site_Mapping') }}
                        </b-button>
                    </div>
                </template>

                <template #googleMap="{ $attrs, $listeners, index }">
                    <iframe
                        v-if="gooleMapSrc != ''"
                        class="googleMap"
                        allowfullscreen=""
                        width="800"
                        height="600"
                        frameborder="0"
                        scrolling="no"
                        marginheight="0"
                        marginwidth="0"
                        :src="gooleMapSrc"
                    >
                    </iframe>
                </template>

            </iv-form>

            <template #footer-before>
                <b-button
                    variant="secondary"
                    size="lg"
                    @click="pageToSiteList()"
                >{{ _('w_Back') }}
                </b-button>
            </template>

        </iv-auto-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { ISiteAddData, ISiteEditData } from "@/config/default/api/interfaces";
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";
import ServerConfig from "@/services/ServerConfig";
import ImageBase64 from "@/services/ImageBase64";
import { ESetupMode } from "@/components/ImageMap";

interface IGoogleMap {
    src: string;
    zSize: string;
}

@Component({})
export class SiteForm extends Vue {
    @Prop({
        type: Object,
        default: () => {
            return {};
        }
    })
    site: any;

    @Prop({
        type: Object,
        default: () => {
            return {};
        }
    })
    transition;

    serverUrl = ServerConfig.url;
    newImg = new Image();
    newImgSrc = "";
    gooleMapSrc = "";

    //options
    managerItem = [];
    tagItem = [];
    officeHourItem = [];

    googleMap: IGoogleMap = {
        src: "https://maps.google.com/maps?output=embed",
        zSize: "16"
    };

    sitePhoto: any = {
        add: `sitePhoto: string;`,
        edit: `sitePhoto?: string;`,
    };

    created() {}

    mounted() {
        this.initManagerItem();
        this.initTagItem();
        this.initOfficeHourItem();
        this.initImage();
    }

    initImage() {
        if (this.transition.step === 4) {
            this.newImgSrc = this.serverUrl + this.site.imageSrc;
        } else {
            this.newImgSrc = ESetupMode.setup;
        }
    }

    async initManagerItem() {
        this.managerItem = [];

        let param: any = { paging: { all: true } };

        await this.$server
            .R("/user/user/all", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (let user of response) {
                        let manager = { id: user.objectId, text: user.name };
                        this.managerItem.push(manager);
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initOfficeHourItem() {
        this.officeHourItem = [];

        let param: any = { paging: { all: true } };

        await this.$server
            .R("/office-hour/all", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (let itme of response) {
                        let officeHour = { id: itme.objectId, text: itme.name };
                        this.officeHourItem.push(officeHour);
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initTagItem() {
        this.tagItem = [];

        let param: any = { paging: { all: true } };

        await this.$server
            .R("/tag/all", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (let itme of response) {
                        let tag = { id: itme.objectId, text: itme.name };
                        this.tagItem.push(tag);
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async saveSite(data) {
        if (this.transition.step === 3) {
            const datas: ISiteAddData[] = [
                {
                    // regionId: "uCsinPqUj1",
                    name: data.name,
                    customId: data.customId,
                    managerId: data.managerId,
                    address: data.address,
                    phone: data.phone,
                    establishment: data.establishment,
                    squareMeter: data.squareMeter,
                    staffNumber: data.staffNumber,
                    officeHourId: data.officeHourId,
                    imageBase64: this.newImgSrc,
                    longitude: data.longitude,
                    latitude: data.latitude,
                    tagIds: data.tagIds
                }
            ];

            const addSiteParam = { datas };
            Loading.show();
            await this.$server
                .C("/location/site", addSiteParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Site_AddSiteSuccess"));
                            this.pageToSiteList();
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        } else if (this.transition.step === 4) {
            const datas: ISiteEditData[] = [
                {
                    // regionId: "uCsinPqUj1",
                    objectId: data.objectId,
                    name: data.name,
                    customId: data.customId,
                    managerId: data.managerId,
                    address: data.address,
                    phone: data.phone,
                    establishment: data.establishment,
                    squareMeter: data.squareMeter,
                    staffNumber: data.staffNumber,
                    officeHourId: data.officeHourId,
                    longitude: data.longitude,
                    latitude: data.latitude,
                    tagIds: data.tagIds
                }
            ];

            if (this.newImg.src) {
                datas[0].imageBase64 = this.newImgSrc;
            }

            const editSiteParam = { datas };
            Loading.show();
            await this.$server
                .U("/location/site", editSiteParam)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Site_EditSiteSuccess"));
                            this.pageToSiteList();
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        }
    }

    googleMapMapping() {
        if (this.site) {
            if (
                parseFloat(this.site.longitude) > 180 ||
                parseFloat(this.site.longitude) < -180
            ) {
                Dialog.error(this._("w_Site_Longitude_Range"));
                return;
            }

            if (
                parseFloat(this.site.latitude) > 90 ||
                parseFloat(this.site.latitude) < -90
            ) {
                Dialog.error(this._("w_Site_Latitude_Range"));
                return;
            }
            this.gooleMapSrc =
                this.googleMap.src +
                "&z=" +
                this.googleMap.zSize +
                "&q=" +
                this.site.latitude +
                "," +
                this.site.longitude;
        }
    }

    updateSiteForm(data) {
        if (data) {
            this.site[data.key] = data.value;
            if (data.key == "sitePhoto") {
                this.uploadFile(data.value);
            }
        }
    }

    async uploadFile(file) {
        if (file) {
            ImageBase64.fileToBase64(file, (base64 = "") => {
                if (base64 != "") {
                    this.newImg = new Image();
                    this.newImg.src = base64;
                    this.newImg.onload = () => {
                        this.newImgSrc = base64;
                        return;
                    };
                } else {
                    Dialog.error(this._("w_Region_ErrorFileToLarge"));
                }
            });
        }
    }

    pageToSiteList() {
        this.$emit("pageToSiteList");
    }

    ISiteForm() {
        return `interface {
                /**
                * @uiLabel - ${this._("w_Site_SiteID")}
                * @uiPlaceHolder - ${this._("w_Site_SiteID")}
                * @uiType - iv-form-string
                */
                customId: string;

                /**
                * @uiLabel - ${this._("w_Site_SiteName")}
                * @uiPlaceHolder - ${this._("w_Site_SiteName")}
                * @uiType - iv-form-string
                */
                name: string;

                /**
                * @uiLabel - ${this._("w_Site_Address")}
                * @uiPlaceHolder - ${this._("w_Site_Address")}
                * @uiType - iv-form-string
                */
                address?: string;

                /**
                * @uiLabel - ${this._("w_Site_PhoneNumber")}
                * @uiPlaceHolder - ${this._("w_Site_PhoneNumber")}
                * @uiType - iv-form-string
                */
                phone?: string;

                /**
                * @uiLabel - ${this._("w_Site_Establishment")}
                * @uiPlaceHolder - ${this._("w_Site_Establishment")}
                * @uiType - iv-form-date
                */
                establishment?: any;

                /**
                * @uiLabel - ${this._("w_Site_StaffNumber")}
                * @uiPlaceHolder - ${this._("w_Site_StaffNumber")}
                * @uiType - iv-form-number
                */
                staffNumber: number;

                /**
                * @uiLabel - ${this._("w_Site_OfficeHour")}
                * @uiPlaceHolder - ${this._("w_Site_OfficeHour")}
                */
                officeHourId: any;

                /**
                * @uiLabel - ${this._("w_Site_Manager")}
                * @uiPlaceHolder - ${this._("w_Site_Manager")}
                */
                managerId: any;

                /**
                * @uiLabel - ${this._("w_Site_Tag")}
                * @uiPlaceHolder - ${this._("w_Site_Tag")}
                */
                tagIds: any;

                /**
                * @uiLabel - ${this._("w_Site_Photo")}
                * @uiPlaceHolder - ${this._("w_Site_Photo")}
                * @uiType - iv-form-file
                */
                ${ this.site.objectId ? this.sitePhoto.edit : this.sitePhoto.add }

                imageSrc?:any;

                /**
                * @uiLabel - ${this._("w_Site_Latitude")}
                * @uiPlaceHolder - ${this._("w_Site_Latitude")}
                * @uiType - iv-form-number
                * @uiColumnGroup - location
                */
                latitude?: number;

                /**
                * @uiLabel - ${this._("w_Site_Longitude")}
                * @uiPlaceHolder - ${this._("w_Site_Longitude")}
                * @uiType - iv-form-number
                * @uiColumnGroup - location
                */
                longitude?: number;

                 /**
                * @uiColumnGroup - btuuon
                */
                mapping?: any;

                googleMap?:any;

            }`;
    }
}
export default SiteForm;
Vue.component("siteForm", SiteForm);
</script>

<style lang="scss" scoped>
</style>
