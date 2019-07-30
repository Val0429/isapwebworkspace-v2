<template>
    <div class="animated fadeIn">
        <iv-card :label="_('w_Site_SiteList')">

            <template #toolbox>

                <iv-toolbox-view
                    :disabled="!isSelectSite"
                    @click="pageToSiteView()"
                />
                <iv-toolbox-edit
                    :disabled="!isSelectSite"
                    @click="pageToSiteEdit()"
                />
                <iv-toolbox-delete
                    :disabled="!isSelectSite"
                    @click="deleteSite()"
                />

                <iv-toolbox-divider />
                <iv-toolbox-add @click="pageToSiteAdd()" />

            </template>

            <iv-table
                ref="siteTable"
                :interface="ISiteList()"
                @selected="selectedSite($event)"
                :server="{ path: '/location/site' }"
                :multiple="tableMultiple"
            >

                <template #establishment="{$attrs, $listeners}">
                    {{$attrs.row.establishment ? showTime($attrs.row.establishment) : ""}}
                </template>

                <template #manager="{$attrs, $listeners}">
                    {{$attrs.row.manager ? $attrs.row.manager.name : ""}}
                </template>

                <template #areaName="{$attrs, $listeners}">
                    {{showArea($attrs.row.objectId)}}
                </template>

                <template #deviceGroupName="{$attrs, $listeners}">
                    {{showDeviceGroup($attrs.row.objectId,'site')}}
                </template>

                <template #Actions="{$attrs, $listeners}">
                    <iv-toolbox-more :disabled="!isSelectSite">
                        <iv-toolbox-area @click="pageToAreaList()" />
                        <iv-toolbox-device-group @click="pageToDeviceGroupList(1)" />
                    </iv-toolbox-more>
                </template>
            </iv-table>

        </iv-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import Dialog from "@/services/Dialog";
import Datetime from "@/services/Datetime";
import Loading from "@/services/Loading";
import ResponseFilter from "@/services/ResponseFilter";
@Component({})
export class SiteList extends Vue {
    tableMultiple = false;

    //site datas
    isSelectSite = false;
    site: any = {};

    areaAll = [];
    deviceGroupAll = [];

    created() {}

    mounted() {
        this.initSiteListArea();
        this.initSiteListDeviceGroup();
    }

    reload() {
        (this.$refs.siteTable as any).reload();
    }

    async initSiteListDeviceGroup() {
        this.deviceGroupAll = [];

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
            .R("/device/group", body)
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    if (response.results != undefined) {
                        this.deviceGroupAll = response.results;
                    }
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    async initSiteListArea() {
        this.areaAll = [];

        await this.$server
            .R("/location/area/all", {})
            .then((response: any) => {
                ResponseFilter.successCheck(this, response, (response: any) => {
                    this.areaAll = response;
                });
            })
            .catch((e: any) => {
                return ResponseFilter.catchError(this, e);
            });
    }

    showArea(data) {
        let areas = [];
        for (let area of this.areaAll) {
            if (area.site.objectId == data) {
                areas.push(area.name);
            }
        }

        return this.showFirst(areas);
    }

    showFirst(data): string {
        if (data.length >= 2) {
            return data.map(item => item)[0] + "...";
        }
        if (data.length === 1) {
            return data.map(item => item)[0];
        }
        if (data.length == 0) {
            return "";
        }
    }

    showTime(data) {
        return Datetime.DateTime2String(new Date(data), "YYYY-MM-DD");
    }

    showDeviceGroup(data, type) {
        let deviceGroups = [];
        for (let devicegroup of this.deviceGroupAll) {
            var mapId = "";
            if (type == "site") {
                mapId = devicegroup.site.objectId;
            } else if (type == "area") {
                mapId = devicegroup.area.objectId;
            }

            if (mapId == data) {
                deviceGroups.push(devicegroup.name);
            }
        }
        return this.showFirst(deviceGroups);
    }

    selectedSite(data) {
        this.isSelectSite = false;
        if (data && data.objectId) {
            data.managerId = data.manager
                ? data.manager.objectId
                : data.manager;
            data.officeHourId = data.officeHour
                ? data.officeHour.objectId
                : data.officeHour;
            data.tagIds = data.tags
                ? data.tags.map(t => t.objectId)
                : data.tags;
            data.establishment = data.establishment
                ? new Date(data.establishment)
                : null;
            this.site = this.isSelectSite = data;
        }
        this.$emit("selectedSite", data);
    }

    async deleteSite() {
        Dialog.confirm(this._("w_DeleteConfirm"), this._("w_Confirm"), () => {
            var body: {
                objectId: string;
            } = {
                objectId: this.site.objectId
            };

            Loading.show();
            this.$server
                .D("/location/site", body)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Success"));
                            (this.$refs.siteTable as any).reload();
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        });
    }

    pageToSiteView() {
        this.$emit("pageToSiteView");
    }

    pageToSiteEdit() {
        this.$emit("pageToSiteEdit");
    }

    pageToSiteAdd() {
        this.$emit("pageToSiteAdd");
    }

    pageToAreaList() {
        this.$emit("pageToAreaList");
    }

    pageToDeviceGroupList() {
        this.$emit("pageToDeviceGroupList");
    }

    ISiteList() {
        return `interface {
                /**
                * @uiLabel - ${this._("w_Site_SiteID")}
                */
                customId: string;

                /**
                * @uiLabel - ${this._("w_Site_SiteName")}
                */
                name: string;

                /**
                * @uiLabel - ${this._("w_Site_Address")}
                */
                address?: string;

                /**
                * @uiLabel - ${this._("w_Site_Establishment")}
                */
                establishment: any;

                /**
                * @uiLabel - ${this._("w_Site_Manager")}
                */
                manager: string;

                /**
                * @uiLabel - ${this._("w_Site_StaffNumber")}
                */
                staffNumber: number;

                /**
                * @uiLabel - ${this._("w_Site_Area")}
                */
                areaName: string;

                /**
                * @uiLabel - ${this._("w_Site_DeviceGroup")}
                */
                deviceGroupName: string;

                 /**
                * @uiLabel -
                */
                Actions: any;

            }`;
    }
}
export default SiteList;
Vue.component("siteList", SiteList);
</script>

<style lang="scss" scoped>
</style>
