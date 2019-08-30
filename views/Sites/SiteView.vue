<template>
    <div class="animated fadeIn">
        <iv-card :label="_('w_Site_ViewSite')">

            <template #toolbox>
                <iv-toolbox-back @click="pageToSiteList()" />
            </template>

            <iv-form
                :interface="ISiteView()"
                :value="site"
            >

                <template #establishment="{$attrs, $listeners}">
                    <iv-form-label
                        v-bind="$attrs"
                        v-on="$listeners"
                        :value="$attrs.value ? showTime($attrs.value) : ''"
                    />
                </template>

                <template #officeHour="{$attrs, $listeners}">
                    <iv-form-label
                        v-bind="$attrs"
                        v-on="$listeners"
                        :value="$attrs.value ? showOfficeHour($attrs.value) : ''"
                    />
                </template>

                <template #managerId="{$attrs, $listeners}">
                    <iv-form-label
                        v-bind="$attrs"
                        v-on="$listeners"
                        :value="$attrs.value ? showManager($attrs.value) : ''"
                    />
                </template>

                <template #tag="{$attrs, $listeners}">
                    <iv-form-label
                        v-bind="$attrs"
                        v-on="$listeners"
                        :value="site.tag ? showTags(site.tag) : ''"
                    />
                </template>

                <template #imageSrc="{ $attrs, $listeners}">
                    <label class="col-md-12">
                        {{_("w_Site_Photo")}}
                    </label>
                    <img
                        class="imgSide"
                        v-if="newImgSrc"
                        v-bind="$attrs"
                        v-on="$listeners"
                        :src="newImgSrc"
                    />
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

            <template #footer>
                <b-button
                    variant="secondary"
                    size="lg"
                    @click="pageToSiteList()"
                >{{ _('w_Back') }}
                </b-button>
            </template>
        </iv-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";
import ServerConfig from "@/services/ServerConfig";

interface IGoogleMap {
    src: string;
    zSize: string;
}

@Component({})
export class SiteView extends Vue {
    @Prop({
        type: Object,
        default: () => {
            return {};
        }
    })
    site: any;

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

    created() {}

    mounted() {
        this.initManagerItem();
        this.initTagItem();
        this.initOfficeHourItem();
        this.googleMapMapping();
        this.newImgSrc = this.serverUrl + this.site.imageSrc;
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

        this.site.officeHour = [];

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

        await this.$server
            .R("/office-hour", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (let item of response.results) {
                        for (let subItem of item.sites) {
                            if (subItem.objectId == this.site.objectId) {
                                this.site.officeHour = item.objectId;
                                break;
                            }
                        }
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
        this.site.tag = [];

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

        await this.$server
            .R("/tag", param)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    for (let item of response.results) {
                        for (let subItem of item.sites) {
                            if (subItem.objectId == this.site.objectId) {
                                this.site.tag.push(item.objectId);
                                break;
                            }
                        }
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    showTags(datas) {
        var tags = [];
        for (let data of datas) {
            if (this.tagItem.filter(m => m.id == data)[0]) {
                tags.push(this.tagItem.filter(m => m.id == data)[0].text);
            }
        }
        return tags.join(",");
    }

    showOfficeHour(data) {
        return this.officeHourItem.filter(m => m.id == data)[0]
            ? this.officeHourItem.filter(m => m.id == data)[0].text
            : "";
    }

    showManager(data) {
        return this.managerItem.filter(m => m.id == data)[0]
            ? this.managerItem.filter(m => m.id == data)[0].text
            : "";
    }

    showTime(data) {
        return Datetime.DateTime2String(
            new Date(data),
            Datetime.checkDateFormat
        );
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

    pageToSiteList() {
        this.$emit("pageToSiteList");
    }

    ISiteView() {
        return `interface {
                /**
                * @uiLabel - ${this._("w_Site_SiteID")}
                 * @uiType - iv-form-label
                */
                customId?: string;

                /**
                * @uiLabel - ${this._("w_Site_SiteName")}
                * @uiType - iv-form-label
                */
                name?: string;

                /**
                * @uiLabel - ${this._("w_Site_Address")}
                * @uiType - iv-form-label
                */
                address?: string;

                /**
                * @uiLabel - ${this._("w_Site_PhoneNumber")}
                * @uiType - iv-form-label
                */
                phone?: string;

                /**
                * @uiLabel - ${this._("w_Site_Establishment")}
                */
                establishment?: any;

                /**
                * @uiLabel - ${this._("w_Site_StaffNumber")}
                * @uiType - iv-form-label
                */
                staffNumber?: string;

                /**
                * @uiLabel - ${this._("w_Site_OfficeHour")}
               * @uiType - iv-form-label
                */
                officeHour?: string;

                /**
                * @uiLabel - ${this._("w_Site_Manager")}
                * @uiType - iv-form-label
                */
                managerId?: string;

                /**
                * @uiLabel - ${this._("w_Site_Tag")}
                * @uiType - iv-form-label
                */
                tag?: string;

                imageSrc:any;

                /**
                * @uiLabel - ${this._("w_Site_Latitude")}
                * @uiType - iv-form-label
                * @uiColumnGroup - location
                */
                latitude?: number;

                /**
                * @uiLabel - ${this._("w_Site_Longitude")}
                * @uiType - iv-form-label
                * @uiColumnGroup - location
                */
                longitude?: number;

                googleMap:any;

            }`;
    }
}
export default SiteView;
Vue.component("siteView", SiteView);
</script>

<style lang="scss" scoped>
</style>
