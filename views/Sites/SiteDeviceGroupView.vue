<template>
    <div class="animated fadeIn">

        <iv-card :label=" _('w_Site_ViewDevice')">

            <template #toolbox>
                <iv-toolbox-back @click="pageToDeviceGroupList()" />
            </template>

            <iv-form
                :interface="IDeviceGroupView()"
                :value="deviceGroup"
            >

                <template #siteName="{$attrs, $listeners}">
                    <iv-form-label
                        v-bind="$attrs"
                        v-on="$listeners"
                        :value="deviceGroup.site ? deviceGroup.site.name : '' "
                    />
                </template>

                <template #areaName="{$attrs, $listeners}">
                    <iv-form-label
                        v-bind="$attrs"
                        v-on="$listeners"
                        :value="deviceGroup.area ? deviceGroup.area.name : '' "
                    />
                </template>

                <template #deviceGroupName="{$attrs, $listeners}">
                    <iv-form-label
                        v-bind="$attrs"
                        v-on="$listeners"
                        :value="deviceGroup ? deviceGroup.name : '' "
                    />
                </template>

                <template #mode="{$attrs, $listeners}">
                    <iv-form-label
                        v-bind="$attrs"
                        v-on="$listeners"
                        :value="$attrs.value ? showDeviceModel($attrs.value) : ''"
                    />
                </template>

                <template #devices="{$attrs, $listeners}">
                    <iv-form-label
                        v-bind="$attrs"
                        v-on="$listeners"
                        :value="$attrs.value ? showDeviceDtail($attrs.value) : ''"
                    />
                </template>

            </iv-form>

            <template #footer>
                <b-button
                    variant="secondary"
                    size="lg"
                    @click="pageToDeviceGroupList()"
                >{{ _('w_Back') }}
                </b-button>
            </template>
        </iv-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import Dialog from "@/services/Dialog";
import ImageBase64 from "@/services/ImageBase64";
import { ImageMapItem } from "@/components/ImageMap";
import { ImageMap } from "@/components/ImageMap/ImageMap.vue";

interface IGoogleMap {
    src: string;
    zSize: string;
}

enum ECameraMode {
    peopleCounting = "People Counting",
    humanDetection = "Human Detection",
    heatmap = "Heatmap",
    dwellTime = "Dwell Time",
    demographic = "Demographic",
    visitor = "Visitor"
}

@Component({})
export class SiteDeviceGroupView extends Vue {
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
    area: any;

    @Prop({
        type: Object,
        default: () => {
            return {};
        }
    })
    deviceGroup: any;

    imageMap = new ImageMapItem();

    //options
    cameraModeItem = [];

    created() {}

    mounted() {
        this.initCameraItem();
    }

    initCameraItem() {
        this.cameraModeItem = [
            { id: "peopleCounting", text: ECameraMode.peopleCounting },
            { id: "humanDetection", text: ECameraMode.humanDetection },
            { id: "heatmap", text: ECameraMode.heatmap },
            { id: "dwellTime", text: ECameraMode.dwellTime },
            { id: "demographic", text: ECameraMode.demographic },
            { id: "visitor", text: ECameraMode.visitor }
        ];
    }

    showDeviceModel(datas) {
        if (datas) {
            if (
                this.cameraModeItem.filter(b => b.id == datas).map(c => c.text)
            ) {
                return this.cameraModeItem
                    .filter(b => b.id == datas)
                    .map(c => c.text)[0];
            }
        }
    }

    showDeviceDtail(datas) {
        let modalContext = "";
        if (datas) {
            for (let data of datas) {
                if (data) {
                    modalContext += data.mode + " : " + data.count + ",";
                }
            }
            return modalContext.slice(0, -1);
        }
    }

    pageToDeviceGroupList() {
        this.$emit("pageToDeviceGroupList");
    }

    IDeviceGroupView() {
        return `interface {

                 /**
                 * @uiLabel - ${this._("w_Site_SiteName")}
                 * @uiType - iv-form-label
                 */
                siteName?: string;

                 /**
                 * @uiLabel - ${this._("w_Site_AreaName")}
                 * @uiType - iv-form-label
                 */
                areaName?: string;

                 /**
                 * @uiLabel - ${this._("w_Site_GroupName")}
                 * @uiType - iv-form-label
                 */
                deviceGroupName?: string;

                /**
                * @uiLabel - ${this._("w_Site_Model")}
                * @uiType - iv-form-label
                */
                mode: string;

                /**
                * @uiLabel - ${this._("w_Site_Devices")}
                * @uiType - iv-form-label
                */
                devices?: string;

                 /**
                 * @uiLabel - ${this._("w_Site_Low")}
                 * @uiType - iv-form-label
                 * @uiColumnGroup - threshold
                 */
                low?:number;

                 /**
                 * @uiLabel - ${this._("w_Site_Medium")}
                 * @uiType - iv-form-label
                 * @uiColumnGroup - threshold
                 */

                medium?:number;
                /**
                 * @uiLabel - ${this._("w_Site_High")}
                 * @uiType - iv-form-label
                 * @uiColumnGroup - threshold
                 */
                high?:number;

            }`;
    }
}
export default SiteDeviceGroupView;
Vue.component("siteDeviceGroupView", SiteDeviceGroupView);
</script>

<style lang="scss" scoped>
</style>
