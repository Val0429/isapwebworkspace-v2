<template>
    <div class="animated fadeIn">
        <iv-card :label=" _('w_Site_AreaList') ">

            <template #toolbox>

                <iv-toolbox-view
                    :disabled="!isSelectArea"
                    @click="pageToAreaView()"
                />
                <iv-toolbox-edit
                    :disabled="!isSelectArea"
                    @click="pageToAreaEdit()"
                />
                <iv-toolbox-delete
                    :disabled="!isSelectArea"
                    @click="deleteArea()"
                />

                <iv-toolbox-divider />
                <iv-toolbox-add @click="pageToAreaAdd()" />
                <iv-toolbox-back @click="pageToSiteList()" />

            </template>

            <iv-table
                ref="areaTable"
                :interface="IAreaList()"
                @selected="selectedArea($event)"
                :multiple="tableMultiple"
                :server="{  path: '/location/area' }"
                :params="areaParams"
            >

                <template #siteName="{$attrs, $listeners}">
                    {{$attrs.row.site ? $attrs.row.site.name : ""}}
                </template>

                <template #deviceGroupName="{$attrs, $listeners}">
                    {{showDeviceGroup($attrs.row.objectId,'area')}}
                </template>

                <template #Actions="{$attrs, $listeners}">
                    <iv-toolbox-more :disabled="!isSelectArea">
                        <iv-toolbox-device-group @click="pageToDeviceGroupList(5)" />
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
export class SiteAreaList extends Vue {
    @Prop({
        type: Object,
        default: () => {
            return {};
        }
    })
    areaParams: object;

    tableMultiple = false;

    //area datas
    isSelectArea = false;
    areas = {};
    area: any = {};

    //device Group datas
    deviceGroupAll = [];

    created() {}

    mounted() {
        this.initSiteListDeviceGroup();
    }

    async initSiteListDeviceGroup() {
        this.deviceGroupAll = [];
        let param: any = { paging: { all: true } };

        await this.$server
            .R("/device/group", param)
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

    reload() {
        (this.$refs.areaTable as any).reload();
    }

    selectedArea(data) {
        this.isSelectArea = false;
        if (data && data.objectId) {
            this.area = this.isSelectArea = data;
        }
        this.$emit("selectedArea", data);
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

    async deleteArea() {
        Dialog.confirm(this._("w_DeleteConfirm"), this._("w_Confirm"), () => {
            var body: {
                objectId: string;
            } = {
                objectId: this.area.objectId
            };

            Loading.show();
            this.$server
                .D("/location/area", body)
                .then((response: any) => {
                    ResponseFilter.successCheck(
                        this,
                        response,
                        (response: any) => {
                            Dialog.success(this._("w_Success"));
                            (this.$refs.areaTable as any).reload();
                        }
                    );
                })
                .catch((e: any) => {
                    return ResponseFilter.catchError(this, e);
                });
        });
    }

    pageToAreaView() {
        this.$emit("pageToAreaView");
    }

    pageToAreaEdit() {
        this.$emit("pageToAreaEdit");
    }

    pageToAreaAdd() {
        this.$emit("pageToAreaAdd");
    }

    pageToDeviceGroupList() {
        this.$emit("pageToDeviceGroupList");
    }

    pageToSiteList() {
        this.$emit("pageToSiteList");
    }

    IAreaList() {
        return `interface {
                 /**
                 * @uiLabel - ${this._("w_No")}
                 * @uiType - iv-cell-auto-index
                 */
                no: string;

                 /**
                 * @uiLabel - ${this._("w_Site_SiteName")}
                 */
                siteName: any;

                 /**
                 * @uiLabel - ${this._("w_Site_AreaName")}
                 */
                name: string;

                /**
                * @uiLabel - ${this._("w_Site_DeviceGroup")}
                */
                deviceGroupName: string;

                Actions: any;
            }`;
    }
}

export default SiteAreaList;
Vue.component("siteAreaList", SiteAreaList);
</script>

<style lang="scss" scoped>
</style>
